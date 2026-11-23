// Fan votes: a thumbs up or thumbs down on any record page (docs/plans/fan-votes.md, decision 0006).
// - One vote per member per record; a member can change or withdraw it. Up and down cancel out.
// - Counts are public. Only votes from active members count, so suspending a spammer undoes their votes.
// - When a record's net score falls below zero, Adam gets an alert on the Moderation page (and an email
//   once email sending is set up). Nothing is removed automatically: Adam keeps it or marks it for removal,
//   and removals reach the site through data/review/decisions.json (scripts/apply-vote-removals.mjs).
import type { Env } from './env';
import { SITE_NAME } from './env';
import { HttpError, itemKey, now, oneOf, readJson, str, today } from './http';
import { rateLimit } from './guard';
import { sendEmail } from './email';
import { type Ctx, requireAdmin, requireMod, requireUser } from './session';

const MAX_KEYS_PER_READ = 50; // D1 allows 100 bound parameters per query
const PUBLIC_CACHE_SEC = 60;
const ALERT_EMAILS_PER_DAY = 25;
const DAY = 86_400_000;

// ---------------------------------------------------------------------------------------------
// Which records exist: dist/fan/vote-items.json, written at build by integrations/record-index.mjs.

type Items = Record<string, [title: string, path: string]>;
let itemsCache: { at: number; items: Items } | null = null;

export async function loadItems(ctx: Ctx): Promise<Items> {
  if (itemsCache && now() - itemsCache.at < 10 * 60_000) return itemsCache.items;
  if (!ctx.env.ASSETS) throw new HttpError(503, 'items_unavailable', 'Voting is not available on this version of the site.');
  const r = await ctx.env.ASSETS.fetch(new Request(new URL('/fan/vote-items.json', ctx.req.url)));
  if (!r.ok) throw new HttpError(503, 'items_unavailable', 'Voting is not available on this version of the site.');
  itemsCache = { at: now(), items: (await r.json()) as Items };
  return itemsCache.items;
}

// ---------------------------------------------------------------------------------------------
// Totals

type Totals = { up: number; down: number };

/** Recount one record from the votes of active members. Returns the statement so callers can batch it. */
function recount(db: D1Database, key: string) {
  return db
    .prepare(`INSERT INTO vote_totals (item_key, up, down, updated_at)
      SELECT ?1, COALESCE(SUM(v.value = 1), 0), COALESCE(SUM(v.value = -1), 0), ?2
      FROM votes v JOIN users u ON u.id = v.user_id AND u.status = 'active' WHERE v.item_key = ?1
      ON CONFLICT (item_key) DO UPDATE SET up = excluded.up, down = excluded.down, updated_at = excluded.updated_at
      RETURNING up, down`)
    .bind(key, now());
}

/** Recount every record a member voted on (after suspension, lifting it, or deleting the account). */
export async function recountForMember(ctx: Ctx, keys: string[]) {
  if (!keys.length) return;
  const db = ctx.env.DB!;
  const items = await loadItems(ctx).catch(() => ({}) as Items);
  for (let i = 0; i < keys.length; i += 50) {
    const chunk = keys.slice(i, i + 50);
    const res = await db.batch(chunk.map((k) => recount(db, k)));
    for (let j = 0; j < chunk.length; j++) {
      const t = res[j].results[0] as Totals | undefined;
      if (t) await checkAlert(ctx, chunk[j], items[chunk[j]]);
    }
  }
}

export async function memberVoteKeys(env: Env, userId: string) {
  const r = await env.DB!.prepare('SELECT item_key FROM votes WHERE user_id = ?1').bind(userId).all<{ item_key: string }>();
  return r.results.map((x) => x.item_key);
}

// ---------------------------------------------------------------------------------------------
// Reading and casting votes

function keysParam(url: URL) {
  const raw = (url.searchParams.get('items') ?? '').split(',').filter(Boolean);
  if (!raw.length || raw.length > MAX_KEYS_PER_READ) throw new HttpError(400, 'bad_item', `Ask for between 1 and ${MAX_KEYS_PER_READ} items.`);
  return [...new Set(raw.map((k) => itemKey(k, true)))].sort();
}

/** GET /api/votes?items=a,b: counts for each record, and the member's own vote when signed in. */
export async function read(ctx: Ctx) {
  const url = new URL(ctx.req.url);
  // Only records the site shows: made-up keys can't be used to get around the cache.
  const items = await loadItems(ctx);
  const keys = keysParam(url).filter((k) => items[k]);
  if (!keys.length) throw new HttpError(404, 'unknown_item', 'Those records are not on the site.');
  const anonymous = !ctx.user;
  // Signed-out readers share one cached answer per set of records, so busy pages cost one database read a minute.
  const cache = anonymous && typeof caches !== 'undefined' ? (caches as unknown as { default: Cache }).default : null;
  const cacheKey = new Request(`${url.origin}/api/votes?items=${keys.map(encodeURIComponent).join(',')}`);
  if (cache) {
    const hit = await cache.match(cacheKey).catch(() => undefined);
    if (hit) return hit;
  }
  const db = ctx.env.DB!;
  const marks = keys.map((_, i) => `?${i + 1}`).join(',');
  const [totals, mine] = await db.batch([
    db.prepare(`SELECT item_key, up, down FROM vote_totals WHERE item_key IN (${marks})`).bind(...keys),
    db.prepare(`SELECT item_key, value FROM votes WHERE user_id = ?${keys.length + 1} AND item_key IN (${marks})`).bind(...keys, ctx.user?.id ?? ''),
  ]);
  const out: Record<string, { up: number; down: number; mine?: number }> = {};
  for (const k of keys) out[k] = { up: 0, down: 0 };
  for (const r of totals.results as { item_key: string; up: number; down: number }[]) Object.assign(out[r.item_key], { up: r.up, down: r.down });
  if (!anonymous) {
    for (const k of keys) out[k].mine = 0;
    for (const r of mine.results as { item_key: string; value: number }[]) out[r.item_key].mine = r.value;
  }
  const body = JSON.stringify({ votes: out, signedIn: !anonymous });
  const res = new Response(body, {
    headers: {
      'Content-Type': 'application/json; charset=utf-8',
      'X-Content-Type-Options': 'nosniff',
      'Cache-Control': anonymous ? `public, max-age=${PUBLIC_CACHE_SEC}` : 'private, no-store',
    },
  });
  if (cache) {
    const put = cache.put(cacheKey, res.clone()).catch(() => undefined);
    if (ctx.waitUntil) ctx.waitUntil(put); else await put;
  }
  return res;
}

/** POST /api/votes { item, value: 1 | -1 | 0 } (0 withdraws the vote). */
export async function cast(ctx: Ctx) {
  const u = requireUser(ctx);
  const body = await readJson(ctx.req, 2048);
  const key = itemKey(body.item, true);
  const value = body.value === 1 || body.value === -1 || body.value === 0 ? body.value : NaN;
  if (Number.isNaN(value)) throw new HttpError(400, 'bad_value', 'A vote is up, down or none.');
  const items = await loadItems(ctx);
  const item = items[key];
  if (!item) throw new HttpError(404, 'unknown_item', 'That record is not on the site.');
  await rateLimit(ctx.env, `vote:h:${u.id}`, 120, 3600);
  await rateLimit(ctx.env, `vote:d:${u.id}`, 600, 86400);
  const db = ctx.env.DB!;
  const t = now();
  const write = value === 0
    ? db.prepare('DELETE FROM votes WHERE user_id = ?1 AND item_key = ?2').bind(u.id, key)
    : db.prepare(`INSERT INTO votes (user_id, item_key, value, created_at, updated_at) VALUES (?1, ?2, ?3, ?4, ?4)
        ON CONFLICT (user_id, item_key) DO UPDATE SET value = excluded.value, updated_at = excluded.updated_at`).bind(u.id, key, value, t);
  const [, totals] = await db.batch([write, recount(db, key)]);
  const tot = (totals.results[0] as Totals | undefined) ?? { up: 0, down: 0 };
  await checkAlert(ctx, key, item);
  return { item: key, up: tot.up, down: tot.down, mine: value };
}

// ---------------------------------------------------------------------------------------------
// Alerts for Adam

type AlertRow = { status: string; emailed_at: number | null; times: number };

/**
 * Open, update or close a record's alert. It reads the totals again rather than trusting the caller's copy, so two
 * votes landing together can't leave an alert based on an older count.
 */
export async function checkAlert(ctx: Ctx, key: string, item: [string, string] | undefined) {
  const db = ctx.env.DB!;
  const t = (await db.prepare('SELECT up, down FROM vote_totals WHERE item_key = ?1').bind(key).first<Totals>()) ?? { up: 0, down: 0 };
  const net = t.up - t.down;
  const at = now();
  const row = await db.prepare('SELECT status, emailed_at, times FROM vote_alerts WHERE item_key = ?1').bind(key).first<AlertRow>();
  const [title, path] = item ?? [key, ''];
  if (net < 0) {
    if (!row) {
      // ON CONFLICT: when two votes arrive together, only the one that creates the alert sends the email.
      const made = await db.prepare("INSERT INTO vote_alerts (item_key, title, path, status, up, down, times, opened_at) VALUES (?1, ?2, ?3, 'open', ?4, ?5, 1, ?6) ON CONFLICT (item_key) DO NOTHING RETURNING item_key").bind(key, title, path, t.up, t.down, at).first();
      if (made) await notify(ctx, key, title, path, t, 1, null);
      return;
    }
    if (row.status === 'recovered') {
      // A fresh fall below zero, after it had climbed back (or after Adam kept it and it climbed back).
      const made = await db.prepare("UPDATE vote_alerts SET status = 'open', up = ?2, down = ?3, times = times + 1, opened_at = ?4, title = ?5, path = ?6 WHERE item_key = ?1 AND status = 'recovered' RETURNING item_key").bind(key, t.up, t.down, at, title, path).first();
      if (made) await notify(ctx, key, title, path, t, row.times + 1, row.emailed_at);
      return;
    }
  } else if (row && (row.status === 'open' || row.status === 'kept')) {
    await db.prepare("UPDATE vote_alerts SET status = 'recovered', up = ?2, down = ?3 WHERE item_key = ?1").bind(key, t.up, t.down).run();
    return;
  }
  if (row) await db.prepare('UPDATE vote_alerts SET up = ?2, down = ?3 WHERE item_key = ?1').bind(key, t.up, t.down).run();
}

/** Who gets alert emails: VOTE_ALERT_EMAIL, else the first of ADMIN_EMAILS. */
export function alertRecipient(env: Env) {
  return (env.VOTE_ALERT_EMAIL ?? '').trim() || (env.ADMIN_EMAILS ?? '').split(',').map((s) => s.trim()).find(Boolean) || '';
}
function canEmail(env: Env) {
  return !!env.EMAIL_FROM && (!!env.EMAIL || !!env.RESEND_API_KEY || env.DEV_EMAIL_LOG === '1') && !!alertRecipient(env);
}

async function notify(ctx: Ctx, key: string, title: string, path: string, t: Totals, times: number, lastEmailed: number | null) {
  const env = ctx.env;
  if (!canEmail(env)) return; // The Moderation page always has the alert; email is extra.
  if (lastEmailed && now() - lastEmailed < DAY) return; // at most one email per record a day
  const db = env.DB!;
  const day = Math.floor(Date.now() / DAY) * 86400;
  const sent = await db
    .prepare("INSERT INTO rate_limits (key, window_start, count) VALUES ('vote-alert-email', ?1, 1) ON CONFLICT (key, window_start) DO UPDATE SET count = count + 1 RETURNING count")
    .bind(day)
    .first<{ count: number }>();
  if ((sent?.count ?? 0) > ALERT_EMAILS_PER_DAY) return; // a flood of alerts: the Moderation page still lists them all
  await db.prepare('UPDATE vote_alerts SET emailed_at = ?2 WHERE item_key = ?1').bind(key, now()).run();
  const origin = new URL(ctx.req.url).origin;
  const net = t.up - t.down;
  const text = [
    `Fans have voted "${title}" below zero on ${SITE_NAME}.`,
    '',
    `Score: ${net} (${t.up} up, ${t.down} down)${times > 1 ? `. This is time ${times} it has fallen below zero.` : ''}`,
    `Page: ${origin}${path || '/'}`,
    `Record: ${key}`,
    '',
    'Nothing has been removed. Decide on the Moderation page: Keep it, or Mark for removal.',
    `${origin}/moderation/#q=votes`,
    '',
    `Date: ${today()}`,
  ].join('\n');
  const send = sendEmail(env, alertRecipient(env), `Fans voted "${title.slice(0, 80)}" below zero (${net})`, text).catch((e) => console.error('Vote alert email failed', e));
  if (ctx.waitUntil) ctx.waitUntil(send); else await send;
}

// ---------------------------------------------------------------------------------------------
// Moderation: the "Votes below zero" queue

const ALERT_STATUSES = ['open', 'kept', 'remove', 'applied', 'recovered'] as const;

/** GET /api/mod/votes?status=open|done */
export async function alerts(ctx: Ctx) {
  requireMod(ctx);
  const done = new URL(ctx.req.url).searchParams.get('status') === 'done';
  const rows = await ctx.env.DB!
    .prepare(`SELECT a.*, m.handle AS decided_handle FROM vote_alerts a LEFT JOIN users m ON m.id = a.decided_by
      WHERE a.status ${done ? "!= 'open'" : "= 'open'"} ORDER BY ${done ? 'COALESCE(a.decided_at, a.opened_at) DESC' : '(a.up - a.down) ASC, a.opened_at ASC'} LIMIT 200`)
    .all();
  return { status: done ? 'done' : 'open', items: rows.results, email: { on: canEmail(ctx.env) } };
}

/** POST /api/mod/votes { item, action: keep | remove | applied | open, note }. Adam (admin) decides. */
export async function decide(ctx: Ctx) {
  const admin = requireAdmin(ctx);
  const body = await readJson(ctx.req);
  const key = itemKey(body.item, true);
  const action = oneOf(body.action, ['keep', 'remove', 'applied', 'open'] as const, 'action');
  const note = str(body, 'note', { max: 1000, label: 'the note' });
  const status = ({ keep: 'kept', remove: 'remove', applied: 'applied', open: 'open' } as const)[action];
  // Which states each decision can follow. A record back at zero or above ("recovered") needs no decision.
  const from: Record<typeof action, (typeof ALERT_STATUSES)[number][]> = { keep: ['open', 'remove'], remove: ['open', 'kept'], applied: ['remove'], open: ['kept', 'remove', 'applied'] };
  const db = ctx.env.DB!;
  const allowed = from[action];
  const r = await db.prepare(`UPDATE vote_alerts SET status = ?2, note = ?3, decided_by = ?4, decided_at = ?5 WHERE item_key = ?1 AND status IN (${allowed.map((s) => `'${s}'`).join(', ')})`).bind(key, status, note, admin.id, now()).run();
  if (!r.meta.changes) throw new HttpError(404, 'not_found', 'That alert was not found, or was already decided.');
  await db.prepare('INSERT INTO audit_log (actor_id, action, target_type, target_id, note, at) VALUES (?1, ?2, ?3, ?4, ?5, ?6)').bind(admin.id, `vote-alert:${action}`, 'record', key, note, now()).run();
  return { ok: true };
}

/**
 * GET /api/mod/votes/removals: the records Adam marked for removal, as entries for data/review/decisions.json.
 * `node scripts/apply-vote-removals.mjs <file>` merges them in; then mark each "Removal applied".
 */
export async function removals(ctx: Ctx) {
  requireAdmin(ctx);
  const rows = await ctx.env.DB!.prepare("SELECT item_key, title, up, down, decided_at, note FROM vote_alerts WHERE status = 'remove' ORDER BY item_key").all<{ item_key: string; title: string; up: number; down: number; decided_at: number; note: string }>();
  const out: Record<string, { status: 'exclude'; notes: string; date: string }> = {};
  for (const r of rows.results) {
    const date = new Date(r.decided_at).toISOString().slice(0, 10);
    out[r.item_key] = { status: 'exclude', notes: `Removed by Adam ${date} after fans voted it below zero (${r.up} up, ${r.down} down)${r.note ? `: ${r.note}` : ''}`, date };
  }
  return new Response(JSON.stringify(out, null, 1) + '\n', {
    headers: { 'Content-Type': 'application/json; charset=utf-8', 'Content-Disposition': `attachment; filename="vote-removals-${today()}.json"`, 'Cache-Control': 'no-store' },
  });
}
