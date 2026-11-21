// Small HTTP helpers shared by every endpoint.

export class HttpError extends Error {
  constructor(public status: number, public code: string, message?: string, public extra?: Record<string, unknown>) {
    super(message ?? code);
  }
}

const SECURITY_HEADERS = {
  'Cache-Control': 'no-store',
  'X-Content-Type-Options': 'nosniff',
  'Referrer-Policy': 'strict-origin-when-cross-origin',
};

export function json(data: unknown, status = 200, headers: HeadersInit = {}) {
  const h = new Headers(headers);
  h.set('Content-Type', 'application/json; charset=utf-8');
  for (const [k, v] of Object.entries(SECURITY_HEADERS)) if (!h.has(k)) h.set(k, v);
  return new Response(JSON.stringify(data), { status, headers: h });
}

export function errorResponse(e: unknown) {
  if (e instanceof HttpError) return json({ error: e.code, message: e.message, ...e.extra }, e.status);
  console.error('Unhandled error', e instanceof Error ? e.stack : e);
  return json({ error: 'server_error', message: 'Something went wrong on our side. Please try again.' }, 500);
}

/** Reject cross-site writes: the Origin header must be this site. SameSite cookies are the second layer. */
export function checkOrigin(req: Request) {
  if (['GET', 'HEAD', 'OPTIONS'].includes(req.method)) return;
  const origin = req.headers.get('Origin');
  if (!origin || origin !== new URL(req.url).origin) throw new HttpError(403, 'bad_origin', 'This request did not come from this site.');
}

export async function readJson<T = Record<string, unknown>>(req: Request, maxBytes = 64 * 1024): Promise<T> {
  const type = req.headers.get('Content-Type') ?? '';
  if (!type.startsWith('application/json')) throw new HttpError(415, 'json_required');
  const len = Number(req.headers.get('Content-Length') ?? '0');
  if (len > maxBytes) throw new HttpError(413, 'too_large', 'That is too long.');
  const text = await req.text();
  if (text.length > maxBytes) throw new HttpError(413, 'too_large', 'That is too long.');
  try {
    const v = JSON.parse(text);
    if (!v || typeof v !== 'object' || Array.isArray(v)) throw new Error();
    return v as T;
  } catch {
    throw new HttpError(400, 'bad_json');
  }
}

/** Read a trimmed string field with a length limit. */
export function str(body: Record<string, unknown>, key: string, opts: { max: number; min?: number; required?: boolean; label?: string } ) {
  const raw = body[key];
  const v = typeof raw === 'string' ? raw.replace(/\r\n/g, '\n').trim() : '';
  const label = opts.label ?? key;
  if (opts.required && !v) throw new HttpError(400, 'missing_field', `Please fill in ${label}.`, { field: key });
  if (v && opts.min && v.length < opts.min) throw new HttpError(400, 'too_short', `${cap(label)} needs at least ${opts.min} characters.`, { field: key });
  if (v.length > opts.max) throw new HttpError(400, 'too_long', `${cap(label)} can be at most ${opts.max} characters.`, { field: key });
  // Strip control characters other than newline and tab.
  return v.replace(/[\u0000-\u0008\u000b\u000c\u000e-\u001f\u007f]/g, '');
}
const cap = (s: string) => s.charAt(0).toUpperCase() + s.slice(1);

export function oneOf<T extends string>(v: unknown, allowed: readonly T[], field: string): T {
  if (typeof v === 'string' && (allowed as readonly string[]).includes(v)) return v as T;
  throw new HttpError(400, 'bad_value', `Please choose a ${field}.`, { field });
}

/** Item keys look like "episodes/walking-distance" (collection/id, lowercase slugs). */
export function itemKey(v: unknown, required = false): string {
  if (v === undefined || v === null || v === '') {
    if (required) throw new HttpError(400, 'bad_item');
    return '';
  }
  if (typeof v !== 'string' || v.length > 200 || !/^[a-z0-9][a-z0-9-]*(\/[a-z0-9][a-z0-9._-]*)+$/.test(v)) throw new HttpError(400, 'bad_item', 'That item is not recognised.');
  return v;
}

/** Only http(s) links, no credentials in the URL. */
export function httpUrl(v: string, field = 'link'): string {
  if (!v) return '';
  let u: URL;
  try { u = new URL(v); } catch { throw new HttpError(400, 'bad_url', 'Please enter a full web address starting with https://', { field }); }
  if (!['http:', 'https:'].includes(u.protocol) || u.username || u.password) throw new HttpError(400, 'bad_url', 'Please enter a full web address starting with https://', { field });
  return u.toString();
}

export function now() { return Date.now(); }
export function today() { return new Date().toISOString().slice(0, 10); }

const ALPHABET = 'abcdefghijkmnpqrstuvwxyz23456789';
/** Random id, e.g. "k3m9x2...". 16 chars from a 32-char alphabet = 80 bits. */
export function newId(len = 16) {
  const bytes = crypto.getRandomValues(new Uint8Array(len));
  let s = '';
  for (const b of bytes) s += ALPHABET[b & 31];
  return s;
}

export function b64url(bytes: ArrayBuffer | Uint8Array) {
  const u = bytes instanceof Uint8Array ? bytes : new Uint8Array(bytes);
  let s = '';
  for (const b of u) s += String.fromCharCode(b);
  return btoa(s).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
}
export function fromB64url(s: string) {
  const bin = atob(s.replace(/-/g, '+').replace(/_/g, '/') + '==='.slice((s.length + 3) % 4));
  return Uint8Array.from(bin, (c) => c.charCodeAt(0));
}
export function randomToken(bytes = 32) { return b64url(crypto.getRandomValues(new Uint8Array(bytes))); }

export async function sha256(s: string) {
  const d = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(s));
  return [...new Uint8Array(d)].map((b) => b.toString(16).padStart(2, '0')).join('');
}
export async function hmac(secret: string, s: string) {
  const key = await crypto.subtle.importKey('raw', new TextEncoder().encode(secret), { name: 'HMAC', hash: 'SHA-256' }, false, ['sign']);
  const sig = await crypto.subtle.sign('HMAC', key, new TextEncoder().encode(s));
  return b64url(sig).slice(0, 32);
}

export function getCookie(req: Request, name: string) {
  const header = req.headers.get('Cookie') ?? '';
  for (const part of header.split(/;\s*/)) {
    const i = part.indexOf('=');
    if (i > 0 && part.slice(0, i) === name) return decodeURIComponent(part.slice(i + 1));
  }
  return undefined;
}
