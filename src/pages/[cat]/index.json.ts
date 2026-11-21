// The full A to Z index of a large section (People) as compact JSON. The section page loads it only when a
// visitor filters or searches, so the page itself stays light. Rows: [title, href, meta, kinds, records,
// appears-in slugs, official]. `kinds` and `where` map slugs to titles and links.
import type { APIRoute } from 'astro';
import { catalog, entityRows, SPLIT_INDEX_AT } from '../../lib/catalog';

export async function getStaticPaths() {
  const out = [];
  for (const c of (await catalog()).values()) {
    if (c.kind !== 'section') continue;
    const rows = await entityRows(c.slug as any);
    if (rows.length > SPLIT_INDEX_AT) out.push({ params: { cat: c.slug } });
  }
  return out;
}

export const GET: APIRoute = async ({ params }) => {
  const rows = await entityRows(params.cat as any);
  const kinds: Record<string, string> = {};
  const where: Record<string, [string, string]> = {};
  for (const r of rows) {
    for (const s of r.subs) kinds[s.slug] = s.title;
    for (const w of r.where) where[w.slug] = [w.title, w.href];
  }
  const data = rows.map((r) => [r.title, r.href, r.meta ?? '', r.subs.map((s) => s.slug), r.records, r.where.map((w) => w.slug), r.official === true ? 1 : 0]);
  return new Response(JSON.stringify({ kinds, where, rows: data }), { headers: { 'Content-Type': 'application/json' } });
};
