// Browser helpers shared by the account, community, contribute and moderation pages.
// Bundled into each page's script by Astro; nothing here runs on the server.

export type Me = {
  user: null | { id: string; handle: string; displayName: string; role: 'member' | 'moderator' | 'admin'; email: string | null; emailVerified: boolean; bio: string; showFavorites: boolean; createdAt: number };
  config: { features: { accounts: boolean; uploads?: boolean; email?: boolean; google?: boolean }; turnstileSiteKey?: string | null };
  queue?: Record<string, number>;
};

export class ApiError extends Error {
  constructor(public status: number, public code: string, message: string, public field?: string) { super(message); }
}

export async function api<T = any>(path: string, body?: unknown, method?: string): Promise<T> {
  let r: Response;
  try {
    r = await fetch(path, {
      method: method ?? (body !== undefined ? 'POST' : 'GET'),
      headers: body !== undefined ? { 'Content-Type': 'application/json' } : {},
      body: body !== undefined ? JSON.stringify(body) : undefined,
      credentials: 'same-origin',
    });
  } catch {
    throw new ApiError(0, 'offline', 'Could not reach the site. Check your connection and try again.');
  }
  const data = await r.json().catch(() => ({}));
  if (!r.ok) throw new ApiError(r.status, data.error ?? 'error', data.message ?? (r.status === 503 ? 'Accounts are not switched on for this version of the site yet.' : 'Something went wrong. Please try again.'), data.field);
  return data as T;
}

let mePromise: Promise<Me> | null = null;
export function me(fresh = false): Promise<Me> {
  if (!mePromise || fresh) mePromise = api<Me>('/api/me').catch((e) => ({ user: null, config: { features: { accounts: false } }, error: e }) as Me);
  return mePromise;
}

export const esc = (s: unknown) => String(s ?? '').replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[c]!);

/** Plain text to safe HTML: paragraphs, line breaks, and http(s) links (marked ugc, nofollow). */
export function renderText(s: string) {
  return s.split(/\n{2,}/).map((para) => {
    const parts = para.split(/(https?:\/\/[^\s<>"']+)/g).map((part, i) => {
      if (i % 2 === 0) return esc(part).replace(/\n/g, '<br>');
      const trimmed = part.replace(/[.,;:!?)]+$/, '');
      const rest = part.slice(trimmed.length);
      return `<a href='${esc(trimmed)}' rel='nofollow ugc noopener' target='_blank'>${esc(trimmed)}</a>${esc(rest)}`;
    });
    return `<p>${parts.join('')}</p>`;
  }).join('');
}

export function when(ms: number) {
  const d = new Date(ms);
  const diff = (Date.now() - ms) / 1000;
  if (diff < 60) return 'just now';
  if (diff < 3600) return `${Math.floor(diff / 60)} min ago`;
  if (diff < 86400) return `${Math.floor(diff / 3600)} h ago`;
  if (diff < 86400 * 7) return `${Math.floor(diff / 86400)} d ago`;
  return d.toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' });
}

export function bytes(n: number) {
  return n >= 1048576 ? `${(n / 1048576).toFixed(1)} MB` : `${Math.max(1, Math.round(n / 1024))} KB`;
}

/** Names for record keys, from the site's own index (title, address, category). */
let recs: Promise<Record<string, [string, string, string]>> | null = null;
export function records() {
  if (!recs) recs = fetch('/fan/records.json').then((r) => r.json()).catch(() => ({}));
  return recs;
}
export async function itemLabel(key: string) {
  if (!key) return null;
  const r = (await records())[key];
  return r ? { title: r[0], href: r[1], cat: r[2] } : { title: key.split('/').pop()!.replace(/-/g, ' '), href: '', cat: '' };
}

/** Cloudflare Turnstile ("I am human"). Renders into `el` if the site has a key; returns a getter for the token. */
let tsLoad: Promise<void> | null = null;
export async function turnstile(el: HTMLElement, siteKey?: string | null): Promise<() => string | undefined> {
  if (!siteKey) return () => undefined;
  if (!tsLoad) tsLoad = new Promise((res, rej) => {
    const s = document.createElement('script');
    s.src = 'https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit';
    s.async = true; s.onload = () => res(); s.onerror = () => rej(new Error('turnstile'));
    document.head.appendChild(s);
  });
  try { await tsLoad; } catch { el.textContent = 'The "I am human" check could not load. Turn off any blocker for challenges.cloudflare.com and reload.'; return () => undefined; }
  const w = (window as any).turnstile;
  const id = w.render(el, { sitekey: siteKey, theme: 'auto', size: 'flexible' });
  return () => { const t = w.getResponse(id); return t || undefined; };
}
export function resetTurnstile() { try { (window as any).turnstile?.reset(); } catch { /* not loaded */ } }

/** Show an error under a form, and mark the field it is about. */
export function showError(form: HTMLElement, e: unknown) {
  const box = form.querySelector<HTMLElement>('[data-error]');
  const err = e instanceof ApiError ? e : new ApiError(0, 'error', 'Something went wrong. Please try again.');
  form.querySelectorAll('[aria-invalid]').forEach((f) => f.removeAttribute('aria-invalid'));
  if (err.field) form.querySelector(`[name="${err.field}"]`)?.setAttribute('aria-invalid', 'true');
  if (box) { box.textContent = err.message; box.hidden = false; box.focus?.(); }
}
export function clearError(form: HTMLElement) {
  const box = form.querySelector<HTMLElement>('[data-error]');
  if (box) { box.textContent = ''; box.hidden = true; }
}

export function formData(form: HTMLFormElement) {
  const out: Record<string, unknown> = {};
  for (const el of Array.from(form.elements) as HTMLInputElement[]) {
    if (!el.name) continue;
    if (el.type === 'checkbox') out[el.name] = el.checked;
    else if (el.type === 'radio') { if (el.checked) out[el.name] = el.value; }
    else if (el.type !== 'file') out[el.name] = el.value;
  }
  return out;
}

/** Disable a form's button while a request runs. */
export async function busy<T>(form: HTMLFormElement, fn: () => Promise<T>): Promise<T> {
  const btn = form.querySelector<HTMLButtonElement>('button[type=submit]');
  const label = btn?.textContent;
  if (btn) { btn.disabled = true; btn.textContent = 'Working…'; }
  try { return await fn(); } finally { if (btn) { btn.disabled = false; btn.textContent = label ?? ''; } }
}

export const ROLE_LABEL = { member: '', moderator: 'Moderator', admin: 'Site editor' } as const;

export function authorHtml(p: { handle?: string | null; display_name?: string | null; role?: string | null }) {
  if (!p.handle) return '<span class="muted">Deleted member</span>';
  const badge = p.role && p.role !== 'member' ? ` <span class="role-badge">${esc(ROLE_LABEL[p.role as 'moderator'])}</span>` : '';
  return `<a href='/members/?h=${encodeURIComponent(p.handle)}'>${esc(p.display_name || p.handle)}</a> <span class="muted small">@${esc(p.handle)}</span>${badge}`;
}
