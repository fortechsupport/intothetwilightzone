// Suggestions and fan uploads. Everything lands in the moderation queue before anyone else sees it.
import type { Env } from './env';
import { HttpError, httpUrl, itemKey, newId, now, oneOf, readJson, str } from './http';
import { rateLimit, verifyTurnstile } from './guard';
import { type Ctx, requireUser } from './session';

const MB = 1024 * 1024;
export const UPLOAD_LIMITS = { image: 15 * MB, audio: 50 * MB, video: 95 * MB, document: 25 * MB } as const;
const PER_MEMBER_BYTES = 1024 * MB;   // 1 GB of files per member
const SITE_BYTES = 9 * 1024 * MB;     // stop at 9 GB, under R2's 10 GB free storage
const RIGHTS = ['own', 'public-domain', 'licensed', 'permission'] as const;

// ---------- Suggestions ----------

export async function createSuggestion(ctx: Ctx) {
  const u = requireUser(ctx);
  const body = await readJson(ctx.req);
  await rateLimit(ctx.env, `suggest:${u.id}`, 15, 86400);
  await verifyTurnstile(ctx.env, ctx.req, body.turnstile);
  const kind = oneOf(body.kind, ['new', 'correction', 'idea'] as const, 'kind of suggestion');
  const title = str(body, 'title', { max: 140, min: 3, required: true, label: 'a short title' });
  const text = str(body, 'body', { max: 8000, min: 10, required: true, label: 'the details' });
  const sources = str(body, 'sources', { max: 2000, label: 'sources' });
  const pageUrl = str(body, 'pageUrl', { max: 500, label: 'page address' });
  if (pageUrl) httpUrl(pageUrl, 'pageUrl');
  const id = newId();
  await ctx.env.DB!.prepare('INSERT INTO suggestions (id, user_id, kind, page_url, title, body, sources, credit, created_at) VALUES (?1, ?2, ?3, ?4, ?5, ?6, ?7, ?8, ?9)')
    .bind(id, u.id, kind, pageUrl, title, text, sources, body.credit === false ? 0 : 1, now()).run();
  return { ok: true, id };
}

export async function myContributions(ctx: Ctx) {
  const u = requireUser(ctx);
  const db = ctx.env.DB!;
  const [s, up, t] = await db.batch([
    db.prepare('SELECT id, kind, title, status, review_note, created_at, reviewed_at FROM suggestions WHERE user_id = ?1 ORDER BY created_at DESC LIMIT 200').bind(u.id),
    db.prepare("SELECT id, kind, title, item_key, media_type, size, status, review_note, created_at, reviewed_at FROM uploads WHERE user_id = ?1 AND status != 'draft' ORDER BY created_at DESC LIMIT 200").bind(u.id),
    db.prepare("SELECT p.id, p.status, p.created_at, t.id AS topic_id, t.title FROM posts p JOIN topics t ON t.id = p.topic_id WHERE p.user_id = ?1 AND p.status IN ('pending', 'hidden') ORDER BY p.created_at DESC LIMIT 50").bind(u.id),
  ]);
  return { suggestions: s.results, uploads: up.results, heldPosts: t.results };
}

// ---------- Uploads ----------

export async function createUpload(ctx: Ctx) {
  const u = requireUser(ctx);
  const { env } = ctx;
  const body = await readJson(ctx.req, 128 * 1024);
  await rateLimit(env, `upload:${u.id}`, 10, 86400);
  await verifyTurnstile(env, ctx.req, body.turnstile);
  if (body.agree !== true) throw new HttpError(400, 'must_agree', 'Please confirm you have the right to share this.', { field: 'agree' });
  const kind = oneOf(body.kind, ['file', 'text', 'link'] as const, 'what you are sharing');
  const title = str(body, 'title', { max: 140, min: 3, required: true, label: 'a title' });
  const description = str(body, 'description', { max: 4000, label: 'the description' });
  const key = itemKey(body.itemKey);
  const rights = oneOf(body.rights, RIGHTS, 'rights statement');
  const license = str(body, 'license', { max: 200, label: 'the licence' });
  if (rights === 'licensed' && !license) throw new HttpError(400, 'missing_field', 'Please name the licence, for example CC BY 4.0.', { field: 'license' });
  let text = '', link = '', filename = '', size = 0;
  if (kind === 'text') text = str(body, 'body', { max: 50000, min: 50, required: true, label: 'your piece' });
  if (kind === 'link') link = httpUrl(str(body, 'linkUrl', { max: 1000, required: true, label: 'the link' }), 'linkUrl');
  if (kind === 'file') {
    if (!env.UPLOADS) throw new HttpError(503, 'uploads_off', 'File uploads are not switched on yet. You can share a link or a written piece instead.');
    filename = str(body, 'filename', { max: 200, required: true, label: 'file name' }).replace(/[\\/]/g, '_');
    size = Number(body.size);
    if (!Number.isFinite(size) || size <= 0) throw new HttpError(400, 'bad_value', 'That file looks empty.');
    if (size > UPLOAD_LIMITS.video) throw new HttpError(413, 'too_large', `Files can be up to ${UPLOAD_LIMITS.video / MB} MB. For longer videos, upload to a video site and share the link instead.`);
    await checkQuota(env, u.id, size);
  }
  const id = newId();
  await env.DB!.prepare('INSERT INTO uploads (id, user_id, kind, title, description, item_key, rights, license, body, link_url, filename, size, status, created_at) VALUES (?1, ?2, ?3, ?4, ?5, ?6, ?7, ?8, ?9, ?10, ?11, ?12, ?13, ?14)')
    .bind(id, u.id, kind, title, description, key, rights, license, text, link, filename, size, kind === 'file' ? 'draft' : 'pending', now()).run();
  return { ok: true, id, uploadUrl: kind === 'file' ? `/api/uploads/${id}/file` : null };
}

async function checkQuota(env: Env, userId: string, size: number) {
  const db = env.DB!;
  const [mine, all] = await db.batch([
    db.prepare("SELECT COALESCE(SUM(size), 0) AS n FROM uploads WHERE user_id = ?1 AND kind = 'file' AND status IN ('pending', 'approved')").bind(userId),
    db.prepare("SELECT COALESCE(SUM(size), 0) AS n FROM uploads WHERE kind = 'file' AND status IN ('pending', 'approved')"),
  ]);
  const n = (r: D1Result) => (r.results[0] as { n: number }).n;
  if (n(mine) + size > PER_MEMBER_BYTES) throw new HttpError(413, 'quota', 'You have reached the 1 GB limit for files. Remove an older upload or share a link instead.');
  if (n(all) + size > SITE_BYTES) throw new HttpError(507, 'site_full', 'The site has reached its storage limit for now. Please share a link instead.');
}

/** What a file really is, from its first bytes. The browser's claimed type is ignored. */
export function sniff(b: Uint8Array): { type: string; group: keyof typeof UPLOAD_LIMITS } | null {
  const at = (i: number, ...bytes: number[]) => bytes.every((x, j) => b[i + j] === x);
  const ascii = (i: number, s: string) => at(i, ...[...s].map((c) => c.charCodeAt(0)));
  if (at(0, 0xff, 0xd8, 0xff)) return { type: 'image/jpeg', group: 'image' };
  if (at(0, 0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a)) return { type: 'image/png', group: 'image' };
  if (ascii(0, 'GIF87a') || ascii(0, 'GIF89a')) return { type: 'image/gif', group: 'image' };
  if (ascii(0, 'RIFF') && ascii(8, 'WEBP')) return { type: 'image/webp', group: 'image' };
  if (ascii(0, '%PDF-')) return { type: 'application/pdf', group: 'document' };
  if (ascii(0, 'RIFF') && ascii(8, 'WAVE')) return { type: 'audio/wav', group: 'audio' };
  if (ascii(0, 'OggS')) return { type: 'audio/ogg', group: 'audio' };
  if (ascii(0, 'fLaC')) return { type: 'audio/flac', group: 'audio' };
  if (ascii(0, 'ID3') || (b[0] === 0xff && (b[1]! & 0xe0) === 0xe0 && (b[1]! & 0x06) !== 0)) return { type: 'audio/mpeg', group: 'audio' };
  if (ascii(4, 'ftyp')) {
    const brand = String.fromCharCode(...b.slice(8, 12));
    if (brand === 'M4A ' || brand === 'M4B ') return { type: 'audio/mp4', group: 'audio' };
    if (brand === 'qt  ') return { type: 'video/quicktime', group: 'video' };
    return { type: 'video/mp4', group: 'video' };
  }
  if (at(0, 0x1a, 0x45, 0xdf, 0xa3)) return { type: 'video/webm', group: 'video' };
  return null;
}

/** Receive the file body for a draft upload and stream it into R2. */
export async function putUploadFile(ctx: Ctx, id: string) {
  const u = requireUser(ctx);
  const { env, req } = ctx;
  if (!env.UPLOADS) throw new HttpError(503, 'uploads_off');
  const row = await env.DB!.prepare("SELECT * FROM uploads WHERE id = ?1 AND user_id = ?2 AND status = 'draft' AND kind = 'file'").bind(id, u.id).first<{ size: number }>();
  if (!row) throw new HttpError(404, 'not_found', 'That upload was not found, or the file was already sent.');
  const len = Number(req.headers.get('Content-Length') ?? '0');
  if (!len || len !== row.size || !req.body) throw new HttpError(400, 'bad_length', 'The file size did not match. Please try again.');
  // Read the first bytes to learn the real type, then stream the rest straight through.
  const reader = req.body.getReader();
  const chunks: Uint8Array[] = [];
  let have = 0;
  while (have < 16) {
    const { value, done } = await reader.read();
    if (done) break;
    chunks.push(value); have += value.length;
  }
  const head = new Uint8Array(have);
  let o = 0;
  for (const c of chunks) { head.set(c, o); o += c.length; }
  const kind = sniff(head);
  if (!kind) { await reader.cancel(); throw new HttpError(415, 'bad_type', 'That kind of file is not accepted. Images: JPEG, PNG, GIF, WebP. Audio: MP3, M4A, OGG, WAV, FLAC. Video: MP4, MOV, WebM. Documents: PDF.'); }
  if (len > UPLOAD_LIMITS[kind.group]) { await reader.cancel(); throw new HttpError(413, 'too_large', `${kind.group[0]!.toUpperCase() + kind.group.slice(1)} files can be up to ${UPLOAD_LIMITS[kind.group] / MB} MB.`); }
  const fixed = new FixedLengthStream(len);
  const writer = fixed.writable.getWriter();
  const pump = (async () => {
    await writer.write(head);
    for (;;) {
      const { value, done } = await reader.read();
      if (done) break;
      await writer.write(value);
    }
    await writer.close();
  })();
  const r2Key = `uploads/${u.id}/${id}`;
  await Promise.all([env.UPLOADS.put(r2Key, fixed.readable, { httpMetadata: { contentType: kind.type } }), pump]);
  await env.DB!.prepare("UPDATE uploads SET r2_key = ?1, media_type = ?2, status = 'pending' WHERE id = ?3").bind(r2Key, kind.type, id).run();
  return { ok: true, mediaType: kind.type };
}

type UploadRow = { id: string; user_id: string | null; status: string; r2_key: string; media_type: string; filename: string; size: number };

/** Serve a file: anyone once approved; before that, only its uploader and moderators. */
export async function getUploadFile(ctx: Ctx, id: string) {
  const { env, req } = ctx;
  if (!env.UPLOADS) throw new HttpError(404, 'not_found');
  const row = await env.DB!.prepare("SELECT id, user_id, status, r2_key, media_type, filename, size FROM uploads WHERE id = ?1 AND kind = 'file' AND r2_key != ''").bind(id).first<UploadRow>();
  const isMod = ctx.user && ctx.user.role !== 'member';
  if (!row || (row.status !== 'approved' && !isMod && ctx.user?.id !== row.user_id)) throw new HttpError(404, 'not_found');
  const range = parseRange(req.headers.get('Range'), row.size);
  const obj = await env.UPLOADS.get(row.r2_key, range ? { range: { offset: range.start, length: range.end - range.start + 1 } } : undefined);
  if (!obj || !('body' in obj)) throw new HttpError(404, 'not_found');
  const inline = /^(image|audio|video)\//.test(row.media_type) || row.media_type === 'application/pdf';
  const h = new Headers({
    'Content-Type': row.media_type,
    'X-Content-Type-Options': 'nosniff',
    'Content-Security-Policy': "default-src 'none'; sandbox",
    'Content-Disposition': `${inline ? 'inline' : 'attachment'}; filename*=UTF-8''${encodeURIComponent(row.filename || id)}`,
    'Accept-Ranges': 'bytes',
    'Cache-Control': row.status === 'approved' ? 'public, max-age=3600' : 'private, no-store',
    'Cross-Origin-Resource-Policy': 'same-origin',
  });
  if (range) {
    h.set('Content-Range', `bytes ${range.start}-${range.end}/${row.size}`);
    h.set('Content-Length', String(range.end - range.start + 1));
    return new Response(obj.body, { status: 206, headers: h });
  }
  h.set('Content-Length', String(row.size));
  return new Response(obj.body, { headers: h });
}

function parseRange(v: string | null, size: number) {
  const m = v && /^bytes=(\d*)-(\d*)$/.exec(v.trim());
  if (!m || (!m[1] && !m[2])) return null;
  let start: number, end: number;
  if (!m[1]) { start = Math.max(0, size - Number(m[2])); end = size - 1; }
  else { start = Number(m[1]); end = m[2] ? Math.min(Number(m[2]), size - 1) : size - 1; }
  if (start > end || start >= size) return null;
  return { start, end };
}

const PUBLIC_UPLOAD = 'u.id, u.kind, u.title, u.description, u.item_key, u.rights, u.license, u.link_url, u.media_type, u.size, u.created_at, m.handle, m.display_name';

export async function listUploads(ctx: Ctx) {
  const url = new URL(ctx.req.url);
  const item = itemKey(url.searchParams.get('item'));
  const by = url.searchParams.get('by') ?? '';
  const before = Number(url.searchParams.get('before') ?? '0') || Number.MAX_SAFE_INTEGER;
  const where = ["u.status = 'approved'", 'u.created_at < ?1'];
  const binds: unknown[] = [before];
  if (item) { binds.push(item); where.push(`u.item_key = ?${binds.length}`); }
  if (by) { binds.push(by); where.push(`m.handle = ?${binds.length}`); }
  const rows = await ctx.env.DB!.prepare(`SELECT ${PUBLIC_UPLOAD} FROM uploads u LEFT JOIN users m ON m.id = u.user_id WHERE ${where.join(' AND ')} ORDER BY u.created_at DESC LIMIT 30`).bind(...binds).all();
  return { uploads: rows.results };
}

export async function getUpload(ctx: Ctx, id: string) {
  const row = await ctx.env.DB!.prepare(`SELECT ${PUBLIC_UPLOAD}, u.body, u.status, u.user_id FROM uploads u LEFT JOIN users m ON m.id = u.user_id WHERE u.id = ?1`).bind(id).first<Record<string, unknown>>();
  const isMod = ctx.user && ctx.user.role !== 'member';
  if (!row || (row.status !== 'approved' && !isMod && ctx.user?.id !== row.user_id)) throw new HttpError(404, 'not_found', 'That contribution was not found.');
  const { user_id, ...rest } = row;
  return { upload: { ...rest, mine: !!ctx.user && ctx.user.id === user_id } };
}

export async function withdrawUpload(ctx: Ctx, id: string) {
  const u = requireUser(ctx);
  const row = await ctx.env.DB!.prepare('SELECT r2_key FROM uploads WHERE id = ?1 AND user_id = ?2').bind(id, u.id).first<{ r2_key: string }>();
  if (!row) throw new HttpError(404, 'not_found');
  if (row.r2_key && ctx.env.UPLOADS) await ctx.env.UPLOADS.delete(row.r2_key);
  await ctx.env.DB!.prepare('DELETE FROM uploads WHERE id = ?1').bind(id).run();
  return { ok: true };
}
