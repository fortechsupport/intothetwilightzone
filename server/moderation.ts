// The moderation queue: suggestions, uploads, held forum posts, reports and copyright notices.
import { HttpError, newId, now, oneOf, readJson, str } from './http';
import { ipKey, rateLimit, verifyTurnstile } from './guard';
import { checkEmail } from './auth';
import { type Ctx, requireAdmin, requireMod } from './session';
import { memberVoteKeys, recountForMember } from './votes';

const QUEUES = ['suggestions', 'uploads', 'posts', 'reports', 'takedowns'] as const;

export async function queue(ctx: Ctx) {
  requireMod(ctx);
  const url = new URL(ctx.req.url);
  const which = oneOf(url.searchParams.get('q') ?? 'suggestions', QUEUES, 'queue');
  const status = url.searchParams.get('status') === 'done' ? 'done' : 'open';
  const db = ctx.env.DB!;
  const by = 'm.handle AS handle, m.display_name AS display_name';
  let sql: string;
  switch (which) {
    case 'suggestions':
      sql = `SELECT s.*, ${by} FROM suggestions s LEFT JOIN users m ON m.id = s.user_id WHERE s.status ${status === 'open' ? "= 'pending'" : "!= 'pending'"} ORDER BY s.created_at ${status === 'open' ? 'ASC' : 'DESC'} LIMIT 100`;
      break;
    case 'uploads':
      sql = `SELECT u.id, u.kind, u.title, u.description, u.item_key, u.rights, u.license, u.body, u.link_url, u.filename, u.media_type, u.size, u.status, u.review_note, u.created_at, ${by} FROM uploads u LEFT JOIN users m ON m.id = u.user_id WHERE u.status ${status === 'open' ? "= 'pending'" : "IN ('approved', 'rejected', 'removed')"} ORDER BY u.created_at ${status === 'open' ? 'ASC' : 'DESC'} LIMIT 100`;
      break;
    case 'posts':
      sql = `SELECT p.id, p.body, p.status, p.created_at, t.id AS topic_id, t.title AS topic_title, t.status AS topic_status, ${by},
        (SELECT COUNT(*) FROM posts x WHERE x.user_id = p.user_id AND x.status = 'visible') AS author_visible_posts
        FROM posts p JOIN topics t ON t.id = p.topic_id LEFT JOIN users m ON m.id = p.user_id WHERE p.status ${status === 'open' ? "= 'pending'" : "= 'hidden'"} ORDER BY p.created_at ${status === 'open' ? 'ASC' : 'DESC'} LIMIT 100`;
      break;
    case 'reports':
      sql = `SELECT r.*, ${by},
        CASE r.target_type
          WHEN 'post' THEN (SELECT substr(body, 1, 600) FROM posts WHERE id = r.target_id)
          WHEN 'topic' THEN (SELECT title FROM topics WHERE id = r.target_id)
          WHEN 'upload' THEN (SELECT title FROM uploads WHERE id = r.target_id)
          WHEN 'user' THEN (SELECT handle FROM users WHERE id = r.target_id) END AS target_text,
        CASE r.target_type WHEN 'post' THEN (SELECT topic_id FROM posts WHERE id = r.target_id) WHEN 'topic' THEN r.target_id END AS topic_id
        FROM reports r LEFT JOIN users m ON m.id = r.reporter_id WHERE r.status ${status === 'open' ? "= 'open'" : "!= 'open'"} ORDER BY r.created_at ${status === 'open' ? 'ASC' : 'DESC'} LIMIT 100`;
      break;
    case 'takedowns':
      sql = `SELECT * FROM takedowns WHERE status ${status === 'open' ? "= 'open'" : "!= 'open'"} ORDER BY created_at ${status === 'open' ? 'ASC' : 'DESC'} LIMIT 100`;
      break;
  }
  const rows = await db.prepare(sql).all();
  return { queue: which, status, items: rows.results };
}

async function audit(ctx: Ctx, action: string, type: string, id: string, note = '') {
  await ctx.env.DB!.prepare('INSERT INTO audit_log (actor_id, action, target_type, target_id, note, at) VALUES (?1, ?2, ?3, ?4, ?5, ?6)').bind(ctx.user!.id, action, type, id, note, now()).run();
}

/** One action on one queue item. */
export async function act(ctx: Ctx) {
  const mod = requireMod(ctx);
  const body = await readJson(ctx.req);
  const type = oneOf(body.type, ['suggestion', 'upload', 'post', 'topic', 'report', 'takedown', 'user'] as const, 'type');
  const id = typeof body.id === 'string' && /^[a-z0-9]{4,40}$/.test(body.id) ? body.id : '';
  if (!id) throw new HttpError(400, 'bad_value');
  const action = typeof body.action === 'string' ? body.action : '';
  const note = str(body, 'note', { max: 1000, label: 'the note' });
  const db = ctx.env.DB!;
  const t = now();
  const done = async (r: D1Result | D1Result[]) => {
    const changes = Array.isArray(r) ? r.reduce((n, x) => n + (x.meta.changes ?? 0), 0) : r.meta.changes;
    if (!changes) throw new HttpError(404, 'not_found', 'That item was not found or was already handled.');
    await audit(ctx, `${type}:${action}`, type, id, note);
    return { ok: true };
  };
  switch (type) {
    case 'suggestion': {
      const status = oneOf(action, ['accepted', 'declined', 'pending'] as const, 'action');
      return done(await db.prepare('UPDATE suggestions SET status = ?1, review_note = ?2, reviewed_by = ?3, reviewed_at = ?4 WHERE id = ?5').bind(status, note, mod.id, t, id).run());
    }
    case 'upload': {
      const status = oneOf(action, ['approved', 'rejected', 'removed', 'pending'] as const, 'action');
      if (status === 'removed' || status === 'rejected') {
        // Files that will never be shown are deleted from storage straight away.
        const row = await db.prepare('SELECT r2_key FROM uploads WHERE id = ?1').bind(id).first<{ r2_key: string }>();
        if (row?.r2_key && ctx.env.UPLOADS) await ctx.env.UPLOADS.delete(row.r2_key);
        return done(await db.prepare("UPDATE uploads SET status = ?1, review_note = ?2, reviewed_by = ?3, reviewed_at = ?4, r2_key = '', size = 0 WHERE id = ?5").bind(status, note, mod.id, t, id).run());
      }
      return done(await db.prepare('UPDATE uploads SET status = ?1, review_note = ?2, reviewed_by = ?3, reviewed_at = ?4 WHERE id = ?5').bind(status, note, mod.id, t, id).run());
    }
    case 'post': {
      const status = oneOf(action, ['visible', 'hidden'] as const, 'action');
      const post = await db.prepare('SELECT topic_id, status, created_at FROM posts WHERE id = ?1').bind(id).first<{ topic_id: string; status: string; created_at: number }>();
      if (!post) throw new HttpError(404, 'not_found');
      const stmts = [db.prepare('UPDATE posts SET status = ?1 WHERE id = ?2').bind(status, id)];
      if (status === 'visible' && post.status !== 'visible') {
        // Approving the first post of a held topic publishes the topic too.
        stmts.push(db.prepare("UPDATE topics SET status = 'visible' WHERE id = ?1 AND status = 'pending'").bind(post.topic_id));
        stmts.push(db.prepare('UPDATE topics SET post_count = post_count + 1, last_post_at = MAX(last_post_at, ?1) WHERE id = ?2').bind(post.created_at, post.topic_id));
      }
      if (status === 'hidden' && post.status === 'visible') stmts.push(db.prepare('UPDATE topics SET post_count = MAX(post_count - 1, 0) WHERE id = ?1').bind(post.topic_id));
      return done(await db.batch(stmts));
    }
    case 'topic': {
      const a = oneOf(action, ['hide', 'show', 'lock', 'unlock', 'pin', 'unpin', 'move'] as const, 'action');
      const sql = {
        hide: "UPDATE topics SET status = 'hidden' WHERE id = ?1",
        show: "UPDATE topics SET status = 'visible' WHERE id = ?1",
        lock: 'UPDATE topics SET locked = 1 WHERE id = ?1',
        unlock: 'UPDATE topics SET locked = 0 WHERE id = ?1',
        pin: 'UPDATE topics SET pinned = 1 WHERE id = ?1',
        unpin: 'UPDATE topics SET pinned = 0 WHERE id = ?1',
        move: 'UPDATE topics SET category_id = ?2 WHERE id = ?1 AND EXISTS (SELECT 1 FROM forum_categories WHERE id = ?2)',
      }[a];
      return done(await db.prepare(sql).bind(id, ...(a === 'move' ? [String(body.category ?? '')] : [])).run());
    }
    case 'report': {
      const status = oneOf(action, ['actioned', 'dismissed'] as const, 'action');
      return done(await db.prepare('UPDATE reports SET status = ?1, resolved_by = ?2, resolved_at = ?3 WHERE id = ?4').bind(status, mod.id, t, id).run());
    }
    case 'takedown': {
      requireAdmin(ctx);
      const status = oneOf(action, ['actioned', 'dismissed', 'open'] as const, 'action');
      return done(await db.prepare('UPDATE takedowns SET status = ?1, note = ?2, resolved_at = ?3 WHERE id = ?4').bind(status, note, t, id).run());
    }
    case 'user': {
      const a = oneOf(action, ['suspend', 'unsuspend', 'make-moderator', 'make-member'] as const, 'action');
      const target = await db.prepare('SELECT role FROM users WHERE id = ?1').bind(id).first<{ role: string }>();
      if (!target) throw new HttpError(404, 'not_found');
      if (id === mod.id) throw new HttpError(400, 'self', 'You cannot do that to your own account.');
      if (target.role === 'admin') throw new HttpError(403, 'forbidden', 'Admins cannot be changed here.');
      if (a.startsWith('make-')) requireAdmin(ctx);
      if (a === 'suspend' || a === 'unsuspend') {
        // Only active members' votes count, so suspending (or reinstating) someone recounts what they voted on.
        const out = await done(a === 'suspend'
          ? await db.batch([
            db.prepare("UPDATE users SET status = 'suspended' WHERE id = ?1").bind(id),
            db.prepare('DELETE FROM sessions WHERE user_id = ?1').bind(id),
          ])
          : await db.prepare("UPDATE users SET status = 'active' WHERE id = ?1").bind(id).run());
        await recountForMember(ctx, await memberVoteKeys(ctx.env, id));
        return out;
      }
      const sql = { 'make-moderator': "UPDATE users SET role = 'moderator' WHERE id = ?1", 'make-member': "UPDATE users SET role = 'member' WHERE id = ?1" }[a];
      return done(await db.prepare(sql).bind(id).run());
    }
  }
}

export async function findMember(ctx: Ctx) {
  requireMod(ctx);
  const q = new URL(ctx.req.url).searchParams.get('handle') ?? '';
  const rows = await ctx.env.DB!.prepare("SELECT id, handle, display_name, role, status, created_at, (SELECT COUNT(*) FROM posts WHERE user_id = users.id) AS posts FROM users WHERE handle LIKE ?1 ESCAPE '\\' ORDER BY handle LIMIT 20")
    .bind(q.replace(/[%_\\]/g, (c) => `\\${c}`) + '%').all();
  return { members: rows.results };
}

export async function auditLog(ctx: Ctx) {
  requireMod(ctx);
  const rows = await ctx.env.DB!.prepare('SELECT a.*, m.handle FROM audit_log a LEFT JOIN users m ON m.id = a.actor_id ORDER BY a.at DESC LIMIT 100').all();
  return { log: rows.results };
}

/** Copyright notice from anyone (no account needed). */
export async function createTakedown(ctx: Ctx) {
  const body = await readJson(ctx.req);
  await rateLimit(ctx.env, `takedown-ip:${await ipKey(ctx.env, ctx.req)}`, 5, 86400);
  await verifyTurnstile(ctx.env, ctx.req, body.turnstile);
  const name = str(body, 'name', { max: 120, required: true, label: 'your name' });
  const organization = str(body, 'organization', { max: 200, label: 'organization' });
  const email = checkEmail(body.email);
  const work = str(body, 'work', { max: 4000, min: 10, required: true, label: 'the work' });
  const urls = str(body, 'urls', { max: 4000, required: true, label: 'the addresses on this site' });
  const signature = str(body, 'signature', { max: 120, required: true, label: 'your signature' });
  if (body.goodFaith !== true || body.accurate !== true) throw new HttpError(400, 'must_agree', 'Please confirm both statements.', { field: 'goodFaith' });
  await ctx.env.DB!.prepare('INSERT INTO takedowns (id, name, organization, email, work, urls, statement_good_faith, statement_accurate, signature, created_at) VALUES (?1, ?2, ?3, ?4, ?5, ?6, 1, 1, ?7, ?8)')
    .bind(newId(), name, organization, email, work, urls, signature, now()).run();
  return { ok: true };
}
