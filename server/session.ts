// Sessions: a random token in an HttpOnly cookie; the database keeps only its SHA-256 hash.
import type { Env } from './env';
import { HttpError, getCookie, now, randomToken, sha256 } from './http';

export const SESSION_COOKIE = '__Host-tz_s';
/** Readable by page scripts: holds only the handle, so pages know to ask "who am I?" without calling the API for every visitor. */
export const HINT_COOKIE = 'tz_hint';
const DAY = 86_400_000;
const SESSION_DAYS = 30;

export interface User {
  id: string;
  handle: string;
  display_name: string;
  email: string | null;
  email_verified: number;
  bio: string;
  role: 'member' | 'moderator' | 'admin';
  status: 'active' | 'suspended';
  show_favorites: number;
  created_at: number;
}

export interface Ctx {
  env: Env;
  req: Request;
  user: User | null;
  sessionHash: string | null;
  /** Cookies to set on the response. */
  setCookies: string[];
}

function cookie(name: string, value: string, maxAgeSec: number, httpOnly: boolean) {
  return `${name}=${encodeURIComponent(value)}; Path=/; Max-Age=${maxAgeSec}; Secure; SameSite=Lax${httpOnly ? '; HttpOnly' : ''}`;
}

function deviceLabel(ua: string) {
  const browser = /Edg\//.test(ua) ? 'Edge' : /Firefox\//.test(ua) ? 'Firefox' : /Chrome\//.test(ua) ? 'Chrome' : /Safari\//.test(ua) ? 'Safari' : 'A browser';
  const os = /iPhone/.test(ua) ? 'iPhone' : /iPad/.test(ua) ? 'iPad' : /Android/.test(ua) ? 'Android' : /Mac OS X/.test(ua) ? 'Mac' : /Windows/.test(ua) ? 'Windows' : /Linux/.test(ua) ? 'Linux' : 'a device';
  return `${browser} on ${os}`;
}

export async function loadSession(ctx: Ctx) {
  const token = getCookie(ctx.req, SESSION_COOKIE);
  if (!token || !ctx.env.DB) return;
  const hash = await sha256(token);
  const row = await ctx.env.DB
    .prepare('SELECT u.*, s.seen_at, s.expires_at FROM sessions s JOIN users u ON u.id = s.user_id WHERE s.id_hash = ?1')
    .bind(hash)
    .first<User & { seen_at: number; expires_at: number }>();
  if (!row || row.expires_at < now()) {
    if (row) await ctx.env.DB.prepare('DELETE FROM sessions WHERE id_hash = ?1').bind(hash).run();
    clearSessionCookies(ctx);
    return;
  }
  if (row.status === 'suspended') {
    // Suspended members are signed out everywhere.
    await ctx.env.DB.prepare('DELETE FROM sessions WHERE user_id = ?1').bind(row.id).run();
    clearSessionCookies(ctx);
    return;
  }
  const { seen_at, expires_at, ...user } = row;
  ctx.user = user;
  ctx.sessionHash = hash;
  // Slide the expiry forward at most once a day.
  if (now() - seen_at > DAY) {
    await ctx.env.DB.prepare('UPDATE sessions SET seen_at = ?1, expires_at = ?2 WHERE id_hash = ?3').bind(now(), now() + SESSION_DAYS * DAY, hash).run();
    ctx.setCookies.push(cookie(SESSION_COOKIE, token, SESSION_DAYS * 86400, true), cookie(HINT_COOKIE, user.handle, SESSION_DAYS * 86400, false));
  }
}

export async function startSession(ctx: Ctx, user: User) {
  const token = randomToken(32);
  const hash = await sha256(token);
  const t = now();
  await ctx.env.DB!
    .prepare('INSERT INTO sessions (id_hash, user_id, created_at, seen_at, expires_at, label) VALUES (?1, ?2, ?3, ?3, ?4, ?5)')
    .bind(hash, user.id, t, t + SESSION_DAYS * DAY, deviceLabel(ctx.req.headers.get('User-Agent') ?? ''))
    .run();
  ctx.setCookies.push(cookie(SESSION_COOKIE, token, SESSION_DAYS * 86400, true), cookie(HINT_COOKIE, user.handle, SESSION_DAYS * 86400, false));
  ctx.user = user;
  ctx.sessionHash = hash;
  // Tidy up: expired sessions and challenges.
  if (Math.random() < 0.1) {
    await ctx.env.DB!.batch([
      ctx.env.DB!.prepare('DELETE FROM sessions WHERE expires_at < ?1').bind(t),
      ctx.env.DB!.prepare('DELETE FROM challenges WHERE expires_at < ?1').bind(t),
    ]);
  }
}

export function clearSessionCookies(ctx: Ctx) {
  ctx.setCookies.push(cookie(SESSION_COOKIE, '', 0, true), cookie(HINT_COOKIE, '', 0, false));
}

export async function endSession(ctx: Ctx) {
  if (ctx.sessionHash) await ctx.env.DB!.prepare('DELETE FROM sessions WHERE id_hash = ?1').bind(ctx.sessionHash).run();
  clearSessionCookies(ctx);
  ctx.user = null;
}

export function requireUser(ctx: Ctx): User {
  if (!ctx.user) throw new HttpError(401, 'signed_out', 'Please sign in first.');
  return ctx.user;
}
export function requireMod(ctx: Ctx): User {
  const u = requireUser(ctx);
  if (u.role !== 'moderator' && u.role !== 'admin') throw new HttpError(403, 'forbidden', 'Only moderators can do that.');
  return u;
}
export function requireAdmin(ctx: Ctx): User {
  const u = requireUser(ctx);
  if (u.role !== 'admin') throw new HttpError(403, 'forbidden', 'Only the site admin can do that.');
  return u;
}

export function publicUser(u: User) {
  return { id: u.id, handle: u.handle, displayName: u.display_name, role: u.role };
}

// Single-use challenges (passkey challenges, email tokens, OAuth state, sign-up tickets).
export async function putChallenge(env: Env, id: string, kind: string, data: unknown, ttlMs: number) {
  await env.DB!.prepare('INSERT INTO challenges (id, kind, data, expires_at) VALUES (?1, ?2, ?3, ?4)').bind(id, kind, JSON.stringify(data), now() + ttlMs).run();
}
export async function takeChallenge<T>(env: Env, id: unknown, kind: string): Promise<T> {
  if (typeof id !== 'string' || !id || id.length > 200) throw new HttpError(400, 'expired', 'That has expired. Please start again.');
  const row = await env.DB!.prepare('DELETE FROM challenges WHERE id = ?1 AND kind = ?2 RETURNING data, expires_at').bind(id, kind).first<{ data: string; expires_at: number }>();
  if (!row || row.expires_at < now()) throw new HttpError(400, 'expired', 'That has expired. Please start again.');
  return JSON.parse(row.data) as T;
}
