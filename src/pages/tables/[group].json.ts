// The rows of each group page's table (GroupTable.astro), fetched when a visitor first searches, filters, sorts or
// asks for more rows. Column values are indexes into `options`, to keep the files small.
import type { APIRoute } from 'astro';
import { groupTables } from '../../lib/group-table';

export async function getStaticPaths() {
  return [...(await groupTables()).values()].map((t) => ({ params: { group: t.file.slice(8, -5) }, props: { key: t.key } }));
}

export const GET: APIRoute = async ({ props }) => {
  const t = (await groupTables()).get(props.key)!;
  const keys = t.cols.filter((c) => c.key !== 'year' && !c.num).map((c) => c.key);
  const rows = t.rows.map((r) => {
    const o: Record<string, unknown> = { t: r.t };
    if (r.h) o.h = r.h;
    if (r.x) o.x = 1;
    if (r.y) o.y = r.y;
    if (r.r) o.r = r.r;
    if (r.n !== undefined) o.n = r.n;
    for (const k of keys) { const v = r.v[k]; if (v?.length) o[k] = v.map((x) => t.options[k].indexOf(x)); }
    return o;
  });
  const options = Object.fromEntries(keys.map((k) => [k, t.options[k]]));
  return new Response(JSON.stringify({ options, rows }), { headers: { 'Content-Type': 'application/json' } });
};
