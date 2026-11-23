// The signed-in member's own account: profile, lists, devices, data export and deletion.
import { features } from './env';
import { HttpError, itemKey, now, oneOf, readJson, str, today } from './http';
import { rateLimit } from './guard';
import { type Ctx, endSession, publicUser, requireUser } from './session';
import { memberVoteKeys, recountForMember } from './votes';

export const LISTS = ['favorite', 'later', 'watched', 'owned', 'wanted'] as const;
type ListName = (typeof LISTS)[number];
const MAX_ITEMS_PER_LIST = 5000;

export async function me(ctx: Ctx) {
  const f = features(ctx.env);
  const config = {
    features: { accounts: f.accounts, uploads: f.uploads, email: f.email, google: f.google },
    turnstileSiteKey: f.turnstile ? ctx.env.TURNSTILE_SITE_KEY : null,
  };
  if (!ctx.user) return { user: null, config };
  const u = ctx.user;
  const out: Record<string, unknown> = {
    user: { ...publicUser(u), email: u.email, emailVerified: !!u.email_verified, bio: u.bio, showFavorites: !!u.show_favorites, createdAt: u.created_at },
    config,
  };
  if (u.role !== 'member') {
    const db = ctx.env.DB!;
    const [s, up, p, t, r, d, v] = await db.batch([
      db.prepare("SELECT COUNT(*) AS n FROM suggestions WHERE status = 'pending'"),
      db.prepare("SELECT COUNT(*) AS n FROM uploads WHERE status = 'pending'"),
      db.prepare("SELECT COUNT(*) AS n FROM posts WHERE status = 'pending'"),
      db.prepare("SELECT COUNT(*) AS n FROM topics WHERE status = 'pending'"),
      db.prepare("SELECT COUNT(*) AS n FROM reports WHERE status = 'open'"),
      db.prepare("SELECT COUNT(*) AS n FROM takedowns WHERE status = 'open'"),
      db.prepare("SELECT COUNT(*) AS n FROM vote_alerts WHERE status = 'open'"),
    ]);
    const n = (x: D1Result) => (x.results[0] as { n: number }).n;
    out.queue = { suggestions: n(s), uploads: n(up), posts: n(p) + n(t), reports: n(r), takedowns: n(d), votes: n(v) };
  }
  return out;
}

export async function updateProfile(ctx: Ctx) {
  const u = requireUser(ctx);
  const body = await readJson(ctx.req);
  const displayName = str(body, 'displayName', { max: 50, required: true, label: 'display name' });
  const bio = str(body, 'bio', { max: 500, label: 'about you' });
  const showFavorites = body.showFavorites === true ? 1 : 0;
  await ctx.env.DB!.prepare('UPDATE users SET display_name = ?1, bio = ?2, show_favorites = ?3, updated_at = ?4 WHERE id = ?5').bind(displayName, bio, showFavorites, now(), u.id).run();
  return { ok: true };
}

export async function security(ctx: Ctx) {
  const u = requireUser(ctx);
  const db = ctx.env.DB!;
  const [pk, ss, ids] = await db.batch([
    db.prepare('SELECT id, nickname, device_type, backed_up, created_at, last_used_at FROM passkeys WHERE user_id = ?1 ORDER BY created_at').bind(u.id),
    db.prepare('SELECT id_hash, label, created_at, seen_at FROM sessions WHERE user_id = ?1 AND expires_at > ?2 ORDER BY seen_at DESC').bind(u.id, now()),
    db.prepare('SELECT provider, created_at FROM identities WHERE user_id = ?1').bind(u.id),
  ]);
  return {
    passkeys: pk.results,
    sessions: (ss.results as { id_hash: string; label: string; created_at: number; seen_at: number }[]).map((s) => ({ id: s.id_hash.slice(0, 12), label: s.label, createdAt: s.created_at, seenAt: s.seen_at, current: s.id_hash === ctx.sessionHash })),
    identities: ids.results,
  };
}

export async function endOtherSession(ctx: Ctx, idPrefix: string) {
  const u = requireUser(ctx);
  if (!/^[0-9a-f]{12}$/.test(idPrefix)) throw new HttpError(400, 'bad_value');
  await ctx.env.DB!.prepare("DELETE FROM sessions WHERE user_id = ?1 AND substr(id_hash, 1, 12) = ?2").bind(u.id, idPrefix).run();
  return { ok: true };
}

export async function signOut(ctx: Ctx) {
  await endSession(ctx);
  return { ok: true };
}

export async function signOutEverywhere(ctx: Ctx) {
  const u = requireUser(ctx);
  await ctx.env.DB!.prepare('DELETE FROM sessions WHERE user_id = ?1').bind(u.id).run();
  await endSession(ctx);
  return { ok: true };
}

export async function removeEmail(ctx: Ctx) {
  const u = requireUser(ctx);
  const pk = await ctx.env.DB!.prepare('SELECT COUNT(*) AS n FROM passkeys WHERE user_id = ?1').bind(u.id).first<{ n: number }>();
  const ids = await ctx.env.DB!.prepare('SELECT COUNT(*) AS n FROM identities WHERE user_id = ?1').bind(u.id).first<{ n: number }>();
  if (!pk?.n && !ids?.n) throw new HttpError(400, 'last_sign_in', 'Your email is your only way to sign in. Add a passkey first.');
  await ctx.env.DB!.prepare('UPDATE users SET email = NULL, email_verified = 0, updated_at = ?1 WHERE id = ?2').bind(now(), u.id).run();
  return { ok: true };
}

export async function unlinkIdentity(ctx: Ctx, provider: string) {
  const u = requireUser(ctx);
  const pk = await ctx.env.DB!.prepare('SELECT COUNT(*) AS n FROM passkeys WHERE user_id = ?1').bind(u.id).first<{ n: number }>();
  if (!pk?.n && !(u.email && u.email_verified)) throw new HttpError(400, 'last_sign_in', 'This is your only way to sign in. Add a passkey or an email address first.');
  await ctx.env.DB!.prepare('DELETE FROM identities WHERE user_id = ?1 AND provider = ?2').bind(u.id, provider).run();
  return { ok: true };
}

// ---------- Lists ----------

export async function getLists(ctx: Ctx) {
  const u = requireUser(ctx);
  const rows = await ctx.env.DB!.prepare('SELECT list, item_key, added_on FROM list_items WHERE user_id = ?1').bind(u.id).all<{ list: ListName; item_key: string; added_on: string }>();
  const out: Record<ListName, Record<string, string>> = { favorite: {}, later: {}, watched: {}, owned: {}, wanted: {} };
  for (const r of rows.results) out[r.list][r.item_key] = r.added_on;
  return out;
}

export async function setListItem(ctx: Ctx) {
  const u = requireUser(ctx);
  const body = await readJson(ctx.req);
  const list = oneOf(body.list, LISTS, 'list');
  const key = itemKey(body.key, true);
  await rateLimit(ctx.env, `list:${u.id}`, 600, 3600);
  if (body.on === true) {
    const n = await ctx.env.DB!.prepare('SELECT COUNT(*) AS n FROM list_items WHERE user_id = ?1 AND list = ?2').bind(u.id, list).first<{ n: number }>();
    if ((n?.n ?? 0) >= MAX_ITEMS_PER_LIST) throw new HttpError(400, 'list_full', `Lists can hold up to ${MAX_ITEMS_PER_LIST} items.`);
    await ctx.env.DB!.prepare('INSERT OR IGNORE INTO list_items (user_id, list, item_key, added_on) VALUES (?1, ?2, ?3, ?4)').bind(u.id, list, key, today()).run();
  } else {
    await ctx.env.DB!.prepare('DELETE FROM list_items WHERE user_id = ?1 AND list = ?2 AND item_key = ?3').bind(u.id, list, key).run();
  }
  return { ok: true };
}

/** Bring the browser-only checklist into the account. Items already in the account are kept. */
export async function mergeLists(ctx: Ctx) {
  const u = requireUser(ctx);
  const body = await readJson(ctx.req, 1024 * 1024);
  await rateLimit(ctx.env, `merge:${u.id}`, 20, 3600);
  const stmts: D1PreparedStatement[] = [];
  const db = ctx.env.DB!;
  for (const list of LISTS) {
    const items = body[list];
    if (!items || typeof items !== 'object') continue;
    let count = 0;
    for (const [key, date] of Object.entries(items as Record<string, unknown>)) {
      if (++count > MAX_ITEMS_PER_LIST) break;
      let k: string;
      try { k = itemKey(key, true); } catch { continue; }
      const d = typeof date === 'string' && /^\d{4}-\d{2}-\d{2}$/.test(date) ? date : today();
      stmts.push(db.prepare('INSERT OR IGNORE INTO list_items (user_id, list, item_key, added_on) VALUES (?1, ?2, ?3, ?4)').bind(u.id, list, k, d));
    }
  }
  for (let i = 0; i < stmts.length; i += 100) await db.batch(stmts.slice(i, i + 100));
  return { ok: true, merged: stmts.length, lists: await getLists(ctx) };
}

// ---------- Your data ----------

export async function exportData(ctx: Ctx) {
  const u = requireUser(ctx);
  const db = ctx.env.DB!;
  const q = (sql: string) => db.prepare(sql).bind(u.id);
  const [pk, ss, ids, li, sg, up, tp, ps, rp, vt] = await db.batch([
    q('SELECT nickname, device_type, backed_up, created_at, last_used_at FROM passkeys WHERE user_id = ?1'),
    q('SELECT label, created_at, seen_at, expires_at FROM sessions WHERE user_id = ?1'),
    q('SELECT provider, created_at FROM identities WHERE user_id = ?1'),
    q('SELECT list, item_key, added_on FROM list_items WHERE user_id = ?1'),
    q('SELECT id, kind, page_url, title, body, sources, credit, status, review_note, created_at FROM suggestions WHERE user_id = ?1'),
    q('SELECT id, kind, title, description, item_key, rights, license, body, link_url, filename, media_type, size, status, review_note, created_at FROM uploads WHERE user_id = ?1'),
    q('SELECT id, category_id, title, item_key, status, created_at FROM topics WHERE user_id = ?1'),
    q('SELECT id, topic_id, body, status, created_at, edited_at FROM posts WHERE user_id = ?1'),
    q('SELECT target_type, target_id, reason, note, status, created_at FROM reports WHERE reporter_id = ?1'),
    q('SELECT item_key, value, created_at, updated_at FROM votes WHERE user_id = ?1'),
  ]);
  const data = {
    site: 'intothetwilightzone.com',
    exported: new Date().toISOString(),
    account: { handle: u.handle, displayName: u.display_name, email: u.email, emailVerified: !!u.email_verified, bio: u.bio, role: u.role, showFavorites: !!u.show_favorites, createdAt: new Date(u.created_at).toISOString() },
    passkeys: pk.results, sessions: ss.results, linkedSignIns: ids.results, lists: li.results,
    suggestions: sg.results, uploads: up.results, topics: tp.results, posts: ps.results, reports: rp.results,
    votes: (vt.results as { item_key: string; value: number; created_at: number; updated_at: number }[]).map((v) => ({ item: v.item_key, vote: v.value === 1 ? 'up' : 'down', createdAt: v.created_at, updatedAt: v.updated_at })),
    note: 'Uploaded files themselves are not included; open each one from your account page to download it.',
  };
  return new Response(JSON.stringify(data, null, 2), {
    headers: { 'Content-Type': 'application/json; charset=utf-8', 'Content-Disposition': `attachment; filename="intothetwilightzone-${u.handle}-${today()}.json"`, 'Cache-Control': 'no-store' },
  });
}

/** Delete the account. Lists, devices and uploads go; forum posts are deleted too, or kept as "deleted member" if asked. */
export async function deleteAccount(ctx: Ctx) {
  const u = requireUser(ctx);
  const body = await readJson(ctx.req);
  if (typeof body.confirm !== 'string' || body.confirm.trim().toLowerCase() !== u.handle.toLowerCase()) throw new HttpError(400, 'confirm', 'Type your username to confirm.', { field: 'confirm' });
  const keepPosts = body.keepPosts === true;
  const db = ctx.env.DB!;
  const voted = await memberVoteKeys(ctx.env, u.id);
  const files = await db.prepare("SELECT r2_key FROM uploads WHERE user_id = ?1 AND r2_key != ''").bind(u.id).all<{ r2_key: string }>();
  if (ctx.env.UPLOADS && files.results.length) await ctx.env.UPLOADS.delete(files.results.map((f) => f.r2_key));
  const stmts = [
    db.prepare('DELETE FROM uploads WHERE user_id = ?1').bind(u.id),
    keepPosts ? db.prepare('UPDATE posts SET user_id = NULL WHERE user_id = ?1').bind(u.id) : db.prepare("UPDATE posts SET status = 'deleted', body = '', user_id = NULL WHERE user_id = ?1").bind(u.id),
    db.prepare('UPDATE topics SET user_id = NULL WHERE user_id = ?1').bind(u.id),
    db.prepare('UPDATE suggestions SET user_id = NULL WHERE user_id = ?1').bind(u.id),
    db.prepare('UPDATE reports SET reporter_id = NULL WHERE reporter_id = ?1').bind(u.id),
    db.prepare('DELETE FROM users WHERE id = ?1').bind(u.id), // cascades: passkeys, identities, sessions, list items
  ];
  await db.batch(stmts);
  // Their votes went with the account (ON DELETE CASCADE): recount those records.
  await recountForMember(ctx, voted);
  await endSession(ctx);
  return { ok: true };
}
