// Key -> [title, url, category] for every listed record, so /my-zone/ can name what a visitor saved.
import type { APIRoute } from 'astro';
import { catalog } from '../../lib/catalog';
export const GET: APIRoute = async () => {
  const out: Record<string, [string, string, string]> = {};
  for (const c of (await catalog()).values()) {
    if (c.kind === 'library') continue;
    for (const s of c.subs) for (const e of s.entries) if (e.href && !e.external && !out[e.key]) out[e.key] = [e.title, e.href, c.title];
  }
  return new Response(JSON.stringify(out), { headers: { 'Content-Type': 'application/json' } });
};
