// Forums: categories, topics and posts, with reporting. Posts are plain text (no HTML), rendered safely by the page.
import { HttpError, itemKey, newId, now, oneOf, readJson, str } from './http';
import { rateLimit, verifyTurnstile } from './guard';
import { type Ctx, requireUser } from './session';

const PAGE = 30;
const AUTHOR = 'm.handle AS handle, m.display_name AS display_name, m.role AS role';

export async function categories(ctx: Ctx) {
  const rows = await ctx.env.DB!.prepare(`
    SELECT c.id, c.title, c.description,
      (SELECT COUNT(*) FROM topics t WHERE t.category_id = c.id AND t.status = 'visible') AS topics,
      (SELECT COALESCE(SUM(post_count), 0) FROM topics t WHERE t.category_id = c.id AND t.status = 'visible') AS posts,
      (SELECT MAX(last_post_at) FROM topics t WHERE t.category_id = c.id AND t.status = 'visible') AS last_post_at
    FROM forum_categories c ORDER BY c.sort`).all();
  return { categories: rows.results };
}

export async function listTopics(ctx: Ctx) {
  const url = new URL(ctx.req.url);
  const cat = url.searchParams.get('category');
  const item = itemKey(url.searchParams.get('item'));
  const before = Number(url.searchParams.get('before') ?? '0') || Number.MAX_SAFE_INTEGER;
  const where = ["t.status = 'visible'", 't.last_post_at < ?1'];
  const binds: unknown[] = [before];
  if (cat) { binds.push(cat); where.push(`t.category_id = ?${binds.length}`); if (before !== Number.MAX_SAFE_INTEGER) where.push('t.pinned = 0'); }
  if (item) { binds.push(item); where.push(`t.item_key = ?${binds.length}`); }
  const order = cat ? 't.pinned DESC, t.last_post_at DESC' : 't.last_post_at DESC';
  const rows = await ctx.env.DB!.prepare(`SELECT t.id, t.category_id, t.title, t.item_key, t.locked, t.pinned, t.post_count, t.created_at, t.last_post_at, ${AUTHOR}
    FROM topics t LEFT JOIN users m ON m.id = t.user_id WHERE ${where.join(' AND ')} ORDER BY ${order} LIMIT ${PAGE}`).bind(...binds).all();
  const category = cat ? await ctx.env.DB!.prepare('SELECT id, title, description FROM forum_categories WHERE id = ?1').bind(cat).first() : null;
  if (cat && !category) throw new HttpError(404, 'not_found', 'That forum was not found.');
  return { category, topics: rows.results, more: rows.results.length === PAGE };
}

export async function getTopic(ctx: Ctx, id: string) {
  const db = ctx.env.DB!;
  const isMod = !!ctx.user && ctx.user.role !== 'member';
  const topic = await db.prepare(`SELECT t.*, c.title AS category_title, ${AUTHOR} FROM topics t JOIN forum_categories c ON c.id = t.category_id LEFT JOIN users m ON m.id = t.user_id WHERE t.id = ?1`).bind(id).first<Record<string, unknown>>();
  if (!topic || (topic.status !== 'visible' && !isMod && topic.user_id !== ctx.user?.id)) throw new HttpError(404, 'not_found', 'That topic was not found.');
  const url = new URL(ctx.req.url);
  const after = Number(url.searchParams.get('after') ?? '0');
  // Everyone sees visible posts; you also see your own held posts; moderators see everything but deleted.
  const posts = await db.prepare(`SELECT p.id, p.body, p.status, p.created_at, p.edited_at, p.user_id = ?2 AS mine, ${AUTHOR}
    FROM posts p LEFT JOIN users m ON m.id = p.user_id
    WHERE p.topic_id = ?1 AND p.created_at > ?3 AND (p.status = 'visible' OR p.status = 'deleted' OR (p.status = 'pending' AND p.user_id = ?2) OR ?4)
    ORDER BY p.created_at LIMIT 200`).bind(id, ctx.user?.id ?? '', after, isMod ? 1 : 0).all<Record<string, unknown>>();
  const { user_id, ...t } = topic;
  return {
    topic: { ...t, mine: !!ctx.user && user_id === ctx.user.id },
    posts: posts.results.map((p) => (p.status === 'deleted' ? { ...p, body: '', handle: null, display_name: null } : p)),
  };
}

async function shouldHold(ctx: Ctx, userId: string) {
  const mode = ctx.env.FORUM_PREMODERATE ?? 'new';
  if (ctx.user!.role !== 'member' || mode === 'none') return false;
  if (mode === 'all') return true;
  const n = await ctx.env.DB!.prepare("SELECT COUNT(*) AS n FROM posts WHERE user_id = ?1 AND status = 'visible'").bind(userId).first<{ n: number }>();
  return (n?.n ?? 0) < 2;
}

export async function createTopic(ctx: Ctx) {
  const u = requireUser(ctx);
  const body = await readJson(ctx.req);
  await rateLimit(ctx.env, `topic:${u.id}`, 5, 86400);
  await verifyTurnstile(ctx.env, ctx.req, body.turnstile);
  const cat = typeof body.category === 'string' ? body.category : '';
  if (!(await ctx.env.DB!.prepare('SELECT 1 FROM forum_categories WHERE id = ?1').bind(cat).first())) throw new HttpError(400, 'bad_value', 'Please choose a forum.', { field: 'category' });
  const title = str(body, 'title', { max: 120, min: 4, required: true, label: 'a title' });
  const text = str(body, 'body', { max: 10000, min: 2, required: true, label: 'your post' });
  const key = itemKey(body.itemKey);
  const hold = await shouldHold(ctx, u.id);
  const tid = newId(), pid = newId(), t = now();
  await ctx.env.DB!.batch([
    ctx.env.DB!.prepare('INSERT INTO topics (id, category_id, user_id, title, item_key, status, post_count, created_at, last_post_at) VALUES (?1, ?2, ?3, ?4, ?5, ?6, ?7, ?8, ?8)').bind(tid, cat, u.id, title, key, hold ? 'pending' : 'visible', hold ? 0 : 1, t),
    ctx.env.DB!.prepare('INSERT INTO posts (id, topic_id, user_id, body, status, created_at) VALUES (?1, ?2, ?3, ?4, ?5, ?6)').bind(pid, tid, u.id, text, hold ? 'pending' : 'visible', t),
  ]);
  return { ok: true, id: tid, held: hold };
}

export async function createPost(ctx: Ctx, topicId: string) {
  const u = requireUser(ctx);
  const body = await readJson(ctx.req);
  await rateLimit(ctx.env, `post:${u.id}`, 30, 3600);
  const topic = await ctx.env.DB!.prepare('SELECT status, locked FROM topics WHERE id = ?1').bind(topicId).first<{ status: string; locked: number }>();
  if (!topic || topic.status === 'hidden') throw new HttpError(404, 'not_found', 'That topic was not found.');
  if (topic.locked && u.role === 'member') throw new HttpError(403, 'locked', 'This topic is closed to new replies.');
  const text = str(body, 'body', { max: 10000, min: 2, required: true, label: 'your reply' });
  const hold = topic.status === 'pending' || (await shouldHold(ctx, u.id));
  const pid = newId(), t = now();
  const stmts = [ctx.env.DB!.prepare('INSERT INTO posts (id, topic_id, user_id, body, status, created_at) VALUES (?1, ?2, ?3, ?4, ?5, ?6)').bind(pid, topicId, u.id, text, hold ? 'pending' : 'visible', t)];
  if (!hold) stmts.push(ctx.env.DB!.prepare('UPDATE topics SET post_count = post_count + 1, last_post_at = ?1 WHERE id = ?2').bind(t, topicId));
  await ctx.env.DB!.batch(stmts);
  return { ok: true, id: pid, held: hold };
}

export async function editPost(ctx: Ctx, postId: string) {
  const u = requireUser(ctx);
  const body = await readJson(ctx.req);
  const text = str(body, 'body', { max: 10000, min: 2, required: true, label: 'your post' });
  const r = await ctx.env.DB!.prepare("UPDATE posts SET body = ?1, edited_at = ?2 WHERE id = ?3 AND user_id = ?4 AND status IN ('visible', 'pending')").bind(text, now(), postId, u.id).run();
  if (!r.meta.changes) throw new HttpError(404, 'not_found', 'You can only edit your own posts.');
  return { ok: true };
}

export async function deletePost(ctx: Ctx, postId: string) {
  const u = requireUser(ctx);
  const post = await ctx.env.DB!.prepare('SELECT topic_id, status FROM posts WHERE id = ?1 AND user_id = ?2').bind(postId, u.id).first<{ topic_id: string; status: string }>();
  if (!post) throw new HttpError(404, 'not_found', 'You can only delete your own posts.');
  const stmts = [ctx.env.DB!.prepare("UPDATE posts SET status = 'deleted', body = '' WHERE id = ?1").bind(postId)];
  if (post.status === 'visible') stmts.push(ctx.env.DB!.prepare('UPDATE topics SET post_count = MAX(post_count - 1, 0) WHERE id = ?1').bind(post.topic_id));
  await ctx.env.DB!.batch(stmts);
  return { ok: true };
}

export async function report(ctx: Ctx) {
  const u = requireUser(ctx);
  const body = await readJson(ctx.req);
  await rateLimit(ctx.env, `report:${u.id}`, 20, 86400);
  const targetType = oneOf(body.targetType, ['post', 'topic', 'upload', 'user'] as const, 'what you are reporting');
  const reason = oneOf(body.reason, ['spam', 'abuse', 'copyright', 'privacy', 'off-topic', 'other'] as const, 'reason');
  const note = str(body, 'note', { max: 1000, label: 'the note' });
  const targetId = typeof body.targetId === 'string' && /^[a-z0-9]{4,40}$/.test(body.targetId) ? body.targetId : '';
  if (!targetId) throw new HttpError(400, 'bad_value');
  const table = { post: 'posts', topic: 'topics', upload: 'uploads', user: 'users' }[targetType];
  if (!(await ctx.env.DB!.prepare(`SELECT 1 FROM ${table} WHERE id = ?1`).bind(targetId).first())) throw new HttpError(404, 'not_found');
  await ctx.env.DB!.prepare('INSERT INTO reports (id, reporter_id, target_type, target_id, reason, note, created_at) VALUES (?1, ?2, ?3, ?4, ?5, ?6, ?7)').bind(newId(), u.id, targetType, targetId, reason, note, now()).run();
  return { ok: true };
}

export async function profile(ctx: Ctx, handle: string) {
  const db = ctx.env.DB!;
  const m = await db.prepare("SELECT id, handle, display_name, bio, role, created_at, show_favorites FROM users WHERE handle = ?1 AND status = 'active'").bind(handle).first<{ id: string; show_favorites: number } & Record<string, unknown>>();
  if (!m) throw new HttpError(404, 'not_found', 'There is no member with that username.');
  const [posts, uploads, favs, count] = await db.batch([
    db.prepare("SELECT p.id, p.created_at, substr(p.body, 1, 240) AS excerpt, t.id AS topic_id, t.title FROM posts p JOIN topics t ON t.id = p.topic_id WHERE p.user_id = ?1 AND p.status = 'visible' AND t.status = 'visible' ORDER BY p.created_at DESC LIMIT 10").bind(m.id),
    db.prepare("SELECT id, kind, title, media_type, created_at FROM uploads WHERE user_id = ?1 AND status = 'approved' ORDER BY created_at DESC LIMIT 24").bind(m.id),
    db.prepare("SELECT item_key, added_on FROM list_items WHERE user_id = ?1 AND list = 'favorite' AND ?2 ORDER BY added_on DESC LIMIT 100").bind(m.id, m.show_favorites),
    db.prepare("SELECT COUNT(*) AS n FROM posts WHERE user_id = ?1 AND status = 'visible'").bind(m.id),
  ]);
  const { id, show_favorites, ...pub } = m;
  return { member: { ...pub, id, postCount: (count.results[0] as { n: number }).n }, posts: posts.results, uploads: uploads.results, favorites: show_favorites ? favs.results : null };
}
