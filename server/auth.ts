// Signing up and signing in: passkeys (primary), email links, and Google. No passwords anywhere.
import {
  generateAuthenticationOptions,
  generateRegistrationOptions,
  verifyAuthenticationResponse,
  verifyRegistrationResponse,
} from '@simplewebauthn/server';
import { SITE_NAME, features, type Env } from './env';
import { HttpError, b64url, fromB64url, newId, now, randomToken, readJson, sha256, str } from './http';
import { ipKey, rateLimit, verifyTurnstile } from './guard';
import { type Ctx, type User, putChallenge, requireUser, startSession, takeChallenge } from './session';
import { sendEmail } from './email';

const MIN = 60_000;
const RESERVED = new Set([
  'admin', 'administrator', 'moderator', 'mod', 'mods', 'staff', 'support', 'help', 'official', 'system', 'root', 'null', 'undefined',
  'intothetwilightzone', 'twilightzone', 'twilight-zone', 'rodserling', 'rod-serling', 'serling', 'cbs', 'paramount', 'account', 'community',
  'deleted', 'deleted-member', 'anonymous', 'me', 'you', 'everyone', 'webmaster', 'postmaster', 'abuse', 'security', 'privacy', 'copyright', 'dmca',
]);

export function checkHandle(v: unknown): string {
  const h = typeof v === 'string' ? v.trim() : '';
  if (!/^[A-Za-z0-9][A-Za-z0-9_-]{2,23}$/.test(h)) throw new HttpError(400, 'bad_handle', 'Usernames are 3 to 24 letters, numbers, - or _, starting with a letter or number.', { field: 'handle' });
  if (RESERVED.has(h.toLowerCase())) throw new HttpError(400, 'handle_reserved', 'That username is reserved. Please pick another.', { field: 'handle' });
  return h;
}

export function checkEmail(v: unknown): string {
  const e = typeof v === 'string' ? v.trim().toLowerCase() : '';
  if (e.length > 254 || !/^[^\s@<>()",;:]+@[^\s@<>()",;:]+\.[a-z]{2,}$/i.test(e)) throw new HttpError(400, 'bad_email', 'Please enter a valid email address.', { field: 'email' });
  return e;
}

function rp(env: Env, req: Request) {
  const url = new URL(req.url);
  const host = url.hostname;
  const rpID = env.RP_ID || (host === 'intothetwilightzone.com' || host.endsWith('.intothetwilightzone.com') ? 'intothetwilightzone.com' : host);
  return { rpID, origin: url.origin };
}

async function handleTaken(env: Env, handle: string) {
  return !!(await env.DB!.prepare('SELECT 1 FROM users WHERE handle = ?1').bind(handle).first());
}

async function createUser(env: Env, id: string, handle: string, displayName: string, email: string | null): Promise<User> {
  const t = now();
  const admins = (env.ADMIN_EMAILS ?? '').split(',').map((s) => s.trim().toLowerCase()).filter(Boolean);
  const role = email && admins.includes(email) ? 'admin' : 'member';
  try {
    await env.DB!
      .prepare('INSERT INTO users (id, handle, display_name, email, email_verified, role, created_at, updated_at) VALUES (?1, ?2, ?3, ?4, ?5, ?6, ?7, ?7)')
      .bind(id, handle, displayName || handle, email, email ? 1 : 0, role, t)
      .run();
  } catch (e) {
    if (String(e).includes('UNIQUE')) throw new HttpError(409, 'handle_taken', 'Someone just took that username. Please pick another.', { field: 'handle' });
    throw e;
  }
  return (await env.DB!.prepare('SELECT * FROM users WHERE id = ?1').bind(id).first<User>())!;
}

function profileFields(body: Record<string, unknown>) {
  const handle = checkHandle(body.handle);
  const displayName = str(body, 'displayName', { max: 50, label: 'display name' }) || handle;
  if (body.agree !== true) throw new HttpError(400, 'must_agree', 'Please confirm you are 13 or older and agree to the terms.', { field: 'agree' });
  return { handle, displayName };
}

// ---------- Passkeys ----------

/** Step 1 of creating an account with a passkey, or of adding another passkey to your account. */
export async function passkeyRegisterOptions(ctx: Ctx) {
  const { env, req } = ctx;
  const body = await readJson(req);
  const { rpID } = rp(env, req);
  let userId: string, userName: string, displayName: string, exclude: { id: string; transports?: string[] }[] = [];
  let profile: { handle: string; displayName: string } | null = null;
  if (ctx.user) {
    userId = ctx.user.id; userName = ctx.user.handle; displayName = ctx.user.display_name;
    const rows = await env.DB!.prepare('SELECT id, transports FROM passkeys WHERE user_id = ?1').bind(userId).all<{ id: string; transports: string }>();
    exclude = rows.results.map((r) => ({ id: r.id, transports: r.transports ? r.transports.split(',') : undefined }));
  } else {
    await rateLimit(env, `reg-ip:${await ipKey(env, req)}`, 10, 3600);
    await verifyTurnstile(env, req, body.turnstile);
    profile = profileFields(body);
    if (await handleTaken(env, profile.handle)) throw new HttpError(409, 'handle_taken', 'That username is taken. Please pick another.', { field: 'handle' });
    userId = newId(); userName = profile.handle; displayName = profile.displayName;
  }
  const options = await generateRegistrationOptions({
    rpName: SITE_NAME,
    rpID,
    userName,
    userDisplayName: displayName,
    userID: new Uint8Array(new TextEncoder().encode(userId)),
    attestationType: 'none',
    excludeCredentials: exclude as never,
    authenticatorSelection: { residentKey: 'required', userVerification: 'preferred' },
  });
  const challengeId = newId(24);
  await putChallenge(env, challengeId, 'passkey-reg', { challenge: options.challenge, userId, profile, adding: !!ctx.user }, 10 * MIN);
  return { challengeId, options };
}

export async function passkeyRegisterVerify(ctx: Ctx) {
  const { env, req } = ctx;
  const body = await readJson(req, 32 * 1024);
  const ch = await takeChallenge<{ challenge: string; userId: string; profile: { handle: string; displayName: string } | null; adding: boolean }>(env, body.challengeId, 'passkey-reg');
  if (ch.adding && ctx.user?.id !== ch.userId) throw new HttpError(403, 'forbidden');
  const { rpID, origin } = rp(env, req);
  let v;
  try {
    v = await verifyRegistrationResponse({ response: body.response as never, expectedChallenge: ch.challenge, expectedOrigin: origin, expectedRPID: rpID, requireUserVerification: false });
  } catch (e) {
    throw new HttpError(400, 'passkey_failed', 'That passkey could not be checked. Please try again.');
  }
  if (!v.verified || !v.registrationInfo) throw new HttpError(400, 'passkey_failed', 'That passkey could not be checked. Please try again.');
  const { credential, credentialDeviceType, credentialBackedUp } = v.registrationInfo;
  let user: User;
  if (ch.adding) user = ctx.user!;
  else {
    if (await handleTaken(env, ch.profile!.handle)) throw new HttpError(409, 'handle_taken', 'Someone just took that username. Please pick another.', { field: 'handle' });
    user = await createUser(env, ch.userId, ch.profile!.handle, ch.profile!.displayName, null);
  }
  const nickname = typeof body.nickname === 'string' ? body.nickname.slice(0, 40) : '';
  await env.DB!
    .prepare('INSERT INTO passkeys (id, user_id, public_key, counter, transports, device_type, backed_up, nickname, created_at) VALUES (?1, ?2, ?3, ?4, ?5, ?6, ?7, ?8, ?9)')
    .bind(credential.id, user.id, b64url(credential.publicKey), credential.counter, (credential.transports ?? []).join(','), credentialDeviceType, credentialBackedUp ? 1 : 0, nickname, now())
    .run();
  if (!ch.adding) await startSession(ctx, user);
  return { ok: true, created: !ch.adding };
}

export async function passkeyLoginOptions(ctx: Ctx) {
  const { env, req } = ctx;
  await rateLimit(env, `login-ip:${await ipKey(env, req)}`, 30, 3600);
  const { rpID } = rp(env, req);
  const options = await generateAuthenticationOptions({ rpID, userVerification: 'preferred' });
  const challengeId = newId(24);
  await putChallenge(env, challengeId, 'passkey-auth', { challenge: options.challenge }, 5 * MIN);
  return { challengeId, options };
}

export async function passkeyLoginVerify(ctx: Ctx) {
  const { env, req } = ctx;
  const body = await readJson(req, 32 * 1024);
  const ch = await takeChallenge<{ challenge: string }>(env, body.challengeId, 'passkey-auth');
  const response = body.response as { id?: string } | undefined;
  if (!response || typeof response.id !== 'string') throw new HttpError(400, 'passkey_failed');
  const pk = await env.DB!.prepare('SELECT * FROM passkeys WHERE id = ?1').bind(response.id).first<{ id: string; user_id: string; public_key: string; counter: number; transports: string }>();
  if (!pk) throw new HttpError(400, 'passkey_unknown', 'This site doesn\'t recognise that passkey. It may belong to an account that was deleted, or to another site.');
  const { rpID, origin } = rp(env, req);
  let v;
  try {
    v = await verifyAuthenticationResponse({
      response: response as never,
      expectedChallenge: ch.challenge,
      expectedOrigin: origin,
      expectedRPID: rpID,
      requireUserVerification: false,
      credential: { id: pk.id, publicKey: new Uint8Array(fromB64url(pk.public_key)), counter: pk.counter, transports: (pk.transports ? pk.transports.split(',') : undefined) as never },
    });
  } catch {
    throw new HttpError(400, 'passkey_failed', 'That passkey could not be checked. Please try again.');
  }
  if (!v.verified) throw new HttpError(400, 'passkey_failed', 'That passkey could not be checked. Please try again.');
  await env.DB!.prepare('UPDATE passkeys SET counter = ?1, last_used_at = ?2 WHERE id = ?3').bind(v.authenticationInfo.newCounter, now(), pk.id).run();
  const user = await env.DB!.prepare('SELECT * FROM users WHERE id = ?1').bind(pk.user_id).first<User>();
  if (!user) throw new HttpError(400, 'passkey_unknown');
  if (user.status === 'suspended') throw new HttpError(403, 'suspended', 'This account is suspended. If you think that is a mistake, use the contact details on the About page.');
  await startSession(ctx, user);
  return { ok: true };
}

export async function removePasskey(ctx: Ctx, id: string) {
  const u = requireUser(ctx);
  const n = await ctx.env.DB!.prepare('SELECT COUNT(*) AS n FROM passkeys WHERE user_id = ?1').bind(u.id).first<{ n: number }>();
  const others = await ctx.env.DB!.prepare('SELECT COUNT(*) AS n FROM identities WHERE user_id = ?1').bind(u.id).first<{ n: number }>();
  if ((n?.n ?? 0) <= 1 && !(u.email && u.email_verified) && !(others?.n)) throw new HttpError(400, 'last_sign_in', 'This is your only way to sign in. Add another passkey or an email address first.');
  await ctx.env.DB!.prepare('DELETE FROM passkeys WHERE id = ?1 AND user_id = ?2').bind(id, u.id).run();
  return { ok: true };
}

// ---------- Email links ----------

/** Send a sign-in link. The answer is the same whether or not the address has an account. */
export async function emailStart(ctx: Ctx) {
  const { env, req } = ctx;
  if (!features(env).email) throw new HttpError(503, 'email_off', 'Email sign-in is not switched on yet. Please use a passkey.');
  const body = await readJson(req);
  const email = checkEmail(body.email);
  await rateLimit(env, `email-ip:${await ipKey(env, req)}`, 5, 3600);
  await rateLimit(env, `email-to:${await sha256(email)}`, 3, 3600);
  await verifyTurnstile(env, req, body.turnstile);
  // "add" links an email to the signed-in account; otherwise sign in or sign up.
  const purpose = ctx.user && body.purpose === 'add' ? 'add' : 'login';
  const token = randomToken(32);
  await putChallenge(env, await sha256(token), 'email-link', { email, purpose, userId: ctx.user?.id ?? null }, 20 * MIN);
  const link = `${new URL(req.url).origin}/account/verify/#t=${token}`;
  const action = purpose === 'add' ? 'confirm this email address for your account' : 'sign in';
  await sendEmail(env, email, `Your ${SITE_NAME} sign-in link`,
    `Use this link to ${action} on ${SITE_NAME}:\n\n${link}\n\nIt works once and expires in 20 minutes. If you didn't ask for it, you can ignore this email.\n`);
  return { ok: true };
}

export async function emailVerify(ctx: Ctx) {
  const { env, req } = ctx;
  const body = await readJson(req);
  if (typeof body.token !== 'string' || body.token.length > 100) throw new HttpError(400, 'expired', 'That link has expired or was already used. Please ask for a new one.');
  let data: { email: string; purpose: 'login' | 'add'; userId: string | null };
  try { data = await takeChallenge(env, await sha256(body.token), 'email-link'); }
  catch { throw new HttpError(400, 'expired', 'That link has expired or was already used. Please ask for a new one.'); }
  if (data.purpose === 'add') {
    if (!ctx.user || ctx.user.id !== data.userId) throw new HttpError(400, 'wrong_account', 'Please open this link in the browser where you are signed in.');
    const clash = await env.DB!.prepare('SELECT id FROM users WHERE email = ?1 AND id != ?2').bind(data.email, ctx.user.id).first();
    if (clash) throw new HttpError(409, 'email_taken', 'That email address belongs to another account.');
    await env.DB!.prepare('UPDATE users SET email = ?1, email_verified = 1, updated_at = ?2 WHERE id = ?3').bind(data.email, now(), ctx.user.id).run();
    await maybePromote(env, ctx.user.id, data.email);
    return { ok: true, added: true };
  }
  const user = await env.DB!.prepare('SELECT * FROM users WHERE email = ?1').bind(data.email).first<User>();
  if (user) {
    if (user.status === 'suspended') throw new HttpError(403, 'suspended', 'This account is suspended.');
    if (!user.email_verified) await env.DB!.prepare('UPDATE users SET email_verified = 1 WHERE id = ?1').bind(user.id).run();
    await maybePromote(env, user.id, data.email);
    await startSession(ctx, user);
    return { ok: true };
  }
  // New here: ask for a username before creating the account.
  const ticket = newId(24);
  await putChallenge(env, ticket, 'signup', { email: data.email, provider: null, subject: null }, 30 * MIN);
  return { needsProfile: true, ticket, email: data.email };
}

async function maybePromote(env: Env, userId: string, email: string) {
  const admins = (env.ADMIN_EMAILS ?? '').split(',').map((s) => s.trim().toLowerCase()).filter(Boolean);
  if (admins.includes(email)) await env.DB!.prepare("UPDATE users SET role = 'admin' WHERE id = ?1").bind(userId).run();
}

/** Finish creating an account that started with an email link or Google. */
export async function completeSignup(ctx: Ctx) {
  const { env, req } = ctx;
  const body = await readJson(req);
  const { handle, displayName } = profileFields(body);
  if (await handleTaken(env, handle)) throw new HttpError(409, 'handle_taken', 'That username is taken. Please pick another.', { field: 'handle' });
  const t = await takeChallenge<{ email: string | null; provider: string | null; subject: string | null }>(env, body.ticket, 'signup');
  if (t.email && (await env.DB!.prepare('SELECT 1 FROM users WHERE email = ?1').bind(t.email).first())) throw new HttpError(409, 'email_taken', 'An account with that email already exists. Please sign in instead.');
  const user = await createUser(env, newId(), handle, displayName, t.email);
  if (t.provider && t.subject) await env.DB!.prepare('INSERT INTO identities (provider, subject, user_id, created_at) VALUES (?1, ?2, ?3, ?4)').bind(t.provider, t.subject, user.id, now()).run();
  await startSession(ctx, user);
  return { ok: true };
}

// ---------- Google ----------

export async function googleStart(ctx: Ctx) {
  const { env, req } = ctx;
  if (!features(env).google) throw new HttpError(503, 'google_off', 'Google sign-in is not switched on.');
  await rateLimit(env, `google-ip:${await ipKey(env, req)}`, 20, 3600);
  const url = new URL(req.url);
  const state = randomToken(24);
  const verifier = randomToken(48);
  const challenge = b64url(await crypto.subtle.digest('SHA-256', new TextEncoder().encode(verifier)));
  const linking = url.searchParams.get('link') === '1' && ctx.user ? ctx.user.id : null;
  await putChallenge(env, await sha256(state), 'google', { verifier, linking }, 10 * MIN);
  const p = new URLSearchParams({
    client_id: env.GOOGLE_CLIENT_ID!, redirect_uri: `${url.origin}/api/auth/google/callback`, response_type: 'code',
    scope: 'openid email profile', state, code_challenge: challenge, code_challenge_method: 'S256', prompt: 'select_account',
  });
  return Response.redirect(`https://accounts.google.com/o/oauth2/v2/auth?${p}`, 302);
}

export async function googleCallback(ctx: Ctx) {
  const { env, req } = ctx;
  const url = new URL(req.url);
  const back = (frag: string) => Response.redirect(`${url.origin}/account/#${frag}`, 302);
  const state = url.searchParams.get('state'), code = url.searchParams.get('code');
  if (!state || !code) return back('error=google_cancelled');
  let st: { verifier: string; linking: string | null };
  try { st = await takeChallenge(env, await sha256(state), 'google'); } catch { return back('error=expired'); }
  const tr = await fetch('https://oauth2.googleapis.com/token', {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams({ code, client_id: env.GOOGLE_CLIENT_ID!, client_secret: env.GOOGLE_CLIENT_SECRET!, redirect_uri: `${url.origin}/api/auth/google/callback`, grant_type: 'authorization_code', code_verifier: st.verifier }),
  });
  const tok = (await tr.json().catch(() => ({}))) as { id_token?: string };
  if (!tr.ok || !tok.id_token) return back('error=google_failed');
  // The ID token came straight from Google's token endpoint over TLS, so its claims can be read directly
  // (OpenID Connect Core 3.1.3.7); we still check who it was issued to and when it expires.
  const claims = JSON.parse(new TextDecoder().decode(fromB64url(tok.id_token.split('.')[1] ?? ''))) as { iss?: string; aud?: string; sub?: string; email?: string; email_verified?: boolean; exp?: number };
  if (!claims.sub || claims.aud !== env.GOOGLE_CLIENT_ID || !['https://accounts.google.com', 'accounts.google.com'].includes(claims.iss ?? '') || (claims.exp ?? 0) * 1000 < now()) return back('error=google_failed');
  const email = claims.email_verified && claims.email ? claims.email.toLowerCase() : null;
  const linked = await env.DB!.prepare('SELECT u.* FROM identities i JOIN users u ON u.id = i.user_id WHERE i.provider = ?1 AND i.subject = ?2').bind('google', claims.sub).first<User>();
  if (st.linking) {
    if (linked && linked.id !== st.linking) return back('error=google_other_account');
    if (!linked) await env.DB!.prepare('INSERT INTO identities (provider, subject, user_id, created_at) VALUES (?1, ?2, ?3, ?4)').bind('google', claims.sub, st.linking, now()).run();
    return back('linked=google');
  }
  let user = linked;
  if (!user && email) {
    // A verified Google address that matches a verified address here is the same person.
    user = await env.DB!.prepare('SELECT * FROM users WHERE email = ?1 AND email_verified = 1').bind(email).first<User>();
    if (user) await env.DB!.prepare('INSERT INTO identities (provider, subject, user_id, created_at) VALUES (?1, ?2, ?3, ?4)').bind('google', claims.sub, user.id, now()).run();
  }
  if (user) {
    if (user.status === 'suspended') return back('error=suspended');
    if (email) await maybePromote(env, user.id, email);
    await startSession(ctx, user);
    const res = back('signed-in');
    return res;
  }
  const ticket = newId(24);
  const free = email && !(await env.DB!.prepare('SELECT 1 FROM users WHERE email = ?1').bind(email).first());
  await putChallenge(env, ticket, 'signup', { email: free ? email : null, provider: 'google', subject: claims.sub }, 30 * MIN);
  return back(`signup=${ticket}`);
}

// ---------- Admin bootstrap ----------

export async function claimAdmin(ctx: Ctx) {
  const u = requireUser(ctx);
  const body = await readJson(ctx.req);
  await rateLimit(ctx.env, `claim:${u.id}`, 5, 3600);
  const code = typeof body.code === 'string' ? body.code.trim() : '';
  if (!ctx.env.ADMIN_BOOTSTRAP_TOKEN || ctx.env.ADMIN_BOOTSTRAP_TOKEN.length < 16 || code !== ctx.env.ADMIN_BOOTSTRAP_TOKEN) throw new HttpError(403, 'bad_code', 'That code is not right.');
  await ctx.env.DB!.prepare("UPDATE users SET role = 'admin' WHERE id = ?1").bind(u.id).run();
  return { ok: true };
}
