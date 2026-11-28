// The rows of each table (GroupTable.astro), fetched when a visitor first searches, filters, sorts or asks for more
// rows. Filter values are indexes into `options`, to keep the files small; other cells are sent as they are.
import type { APIRoute } from 'astro';
import { groupTables } from '../../lib/group-table';

export async function getStaticPaths() {
  return [...(await groupTables()).values()].map((t) => ({ params: { group: t.file.slice(8, -5) }, props: { key: t.key } }));
}

export const GET: APIRoute = async ({ props }) => {
  const t = (await groupTables()).get(props.key)!;
  const rows = t.rows.map((r) => {
    const o: Record<string, unknown> = { k: r.key, t: r.t };
    if (r.h) o.h = r.h;
    if (r.x) o.x = 1;
    if (r.r) o.r = r.r;
    const v: Record<string, unknown> = {};
    for (const c of t.cols) {
      const x = r.v[c.key];
      if (x?.length) v[c.key] = c.filter ? x.map((s) => t.options[c.key].indexOf(s)) : x;
    }
    if (Object.keys(v).length) o.v = v;
    if (Object.keys(r.o).length) o.o = r.o;
    if (Object.keys(r.l).length) o.l = r.l;
    return o;
  });
  return new Response(JSON.stringify({ options: t.options, rows }), { headers: { 'Content-Type': 'application/json' } });
};
