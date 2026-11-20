// Builds CategoryLanding items from collection entries plus their assessments.
import { assess } from './assessments';
import { sortKey } from './categories';
import type { Item } from '../components/CategoryLanding.astro';

const clamp = (s: string | undefined, n = 420) => {
  if (!s) return undefined;
  const t = s.replace(/\s+/g, ' ').trim();
  if (t.length <= n) return t;
  const cut = t.slice(0, n);
  const end = Math.max(cut.lastIndexOf('. '), cut.lastIndexOf('; '));
  return (end > n * 0.5 ? cut.slice(0, end + 1) : cut.slice(0, cut.lastIndexOf(' ')) + '…');
};

export function item(collection: string, id: string, title: string, opts: Partial<Item> = {}): Item {
  const a = assess(`${collection}/${id}`);
  const desc = clamp(opts.desc);
  let why = a?.connection;
  // Skip the connection line when it only repeats the description.
  if (why && desc && desc.includes(why.slice(0, 60).replace(/…$/, ''))) why = undefined;
  return {
    id,
    title,
    sort: opts.sort ?? a?.sort ?? sortKey(title),
    sub: opts.sub ?? a?.subcategory ?? 'Other',
    tier: a?.tier,
    why,
    ...opts,
    desc,
  };
}

export const year = (v?: string | number | null) => {
  const m = String(v ?? '').match(/(1[89]\d\d|20\d\d)/);
  return m ? m[1] : undefined;
};
export const meta = (...xs: (string | undefined | null | false)[]) => xs.filter(Boolean).join(' · ') || undefined;
