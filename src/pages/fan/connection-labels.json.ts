// Key -> [label, page] for every connection, so a vote alert can say which link fans voted down:
// "Futurama: Anthology of Interest I → The Twilight Zone (1959): Parody". integrations/record-index.mjs
// keeps only the connections that appear on a built page.
import type { APIRoute } from 'astro';
import { getCollection } from 'astro:content';
import { resolveRef, CONNECTION_LABELS } from '../../lib/data';
export const GET: APIRoute = async () => {
  const out: Record<string, [string, string]> = {};
  for (const c of await getCollection('connections')) {
    const [from, to] = await Promise.all([resolveRef(c.data.from), resolveRef(c.data.to)]);
    // Episodes are referred to as "1959/walking-distance": add the series year so "A Game of Pool" (1985) and
    // "A Game of Pool" (1959) read apart.
    const name = (ref: string, r?: { title: string }) => `${r?.title ?? ref}${/^\d{4}\//.test(ref) ? ` (${ref.slice(0, 4)})` : ''}`;
    out[`connections/${c.id}`] = [`${name(c.data.from, from)} → ${name(c.data.to, to)}: ${(CONNECTION_LABELS[c.data.kind] ?? c.data.kind).toLowerCase()}`, from?.url ?? to?.url ?? ''];
  }
  return new Response(JSON.stringify(out), { headers: { 'Content-Type': 'application/json' } });
};
