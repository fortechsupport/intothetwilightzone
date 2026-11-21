// Rate limits and the Turnstile human check.
import type { Env } from './env';
import { HttpError, hmac } from './http';

/** Fixed-window counter in D1. Throws 429 once `limit` actions happen inside `windowSec`. */
export async function rateLimit(env: Env, key: string, limit: number, windowSec: number) {
  const db = env.DB!;
  const win = Math.floor(Date.now() / 1000 / windowSec) * windowSec;
  const row = await db
    .prepare('INSERT INTO rate_limits (key, window_start, count) VALUES (?1, ?2, 1) ON CONFLICT (key, window_start) DO UPDATE SET count = count + 1 RETURNING count')
    .bind(key, win)
    .first<{ count: number }>();
  if ((row?.count ?? 0) > limit) {
    const wait = Math.ceil((win + windowSec - Date.now() / 1000) / 60);
    throw new HttpError(429, 'rate_limited', `You've done that a lot just now. Please try again in ${wait} minute${wait === 1 ? '' : 's'}.`);
  }
  // Housekeeping: now and then, drop windows older than two days.
  if (Math.random() < 0.02) await db.prepare('DELETE FROM rate_limits WHERE window_start < ?1').bind(Math.floor(Date.now() / 1000) - 172800).run();
}

/** A per-day pseudonym for the visitor's IP address, so limits work without storing addresses. */
export async function ipKey(env: Env, req: Request) {
  const ip = req.headers.get('CF-Connecting-IP') ?? '0.0.0.0';
  return hmac(`${env.AUTH_SECRET ?? 'dev-only-secret'}:${new Date().toISOString().slice(0, 10)}`, ip);
}

export async function verifyTurnstile(env: Env, req: Request, token: unknown) {
  if (!env.TURNSTILE_SECRET) return; // switched off (development, or before Adam adds the keys)
  if (typeof token !== 'string' || !token || token.length > 4096) throw new HttpError(400, 'turnstile', 'Please complete the "I am human" check.');
  const form = new FormData();
  form.set('secret', env.TURNSTILE_SECRET);
  form.set('response', token);
  const ip = req.headers.get('CF-Connecting-IP');
  if (ip) form.set('remoteip', ip);
  const r = await fetch('https://challenges.cloudflare.com/turnstile/v0/siteverify', { method: 'POST', body: form });
  const out = (await r.json().catch(() => ({}))) as { success?: boolean; hostname?: string };
  if (!out.success) throw new HttpError(400, 'turnstile', 'The "I am human" check did not go through. Please try it again.');
}
