// The site's navigation model: the seven verbs, each with columns of categories and their subcategories,
// with counts. Base.astro renders it as the main menu; the verb pages, home page and All categories use it
// too, so every view of the structure agrees. Read lists its formats in Adam's order and its topic collections;
// Meet splits the People directory; Discover's Places column lists the real places' kinds, then Settings.
import { catalog, countOf, type CatInfo } from './catalog';
import { VERBS, READ_COLLECTIONS, READ_ORDER, sortKey } from './taxonomy.mjs';

export interface NavLink { title: string; href: string; n: number; isNew?: boolean }
export interface NavCol { title: string; href: string; n: number; live?: boolean; isNew?: boolean; blurb?: string; subs: NavLink[] }
export interface NavVerb { slug: string; title: string; blurb: string; href: string; n: number; cols: NavCol[]; collections?: NavLink[]; menu?: NavCol[] }

const az = <T extends { title: string }>(l: T[]) => [...l].sort((a, b) => sortKey(a.title).localeCompare(sortKey(b.title)));
const subLinks = (c: CatInfo, keep: (slug: string) => boolean = () => true): NavLink[] =>
  az(c.subs.filter((s) => s.entries.length && keep(s.slug)).map((s) => ({ title: s.title, href: `/${c.slug}/${s.slug}/`, n: s.entries.length, isNew: s.isNew })));
const subCount = (c: CatInfo, keep: (slug: string) => boolean) => new Set(c.subs.filter((s) => keep(s.slug)).flatMap((s) => s.entries.map((e) => e.key))).size;
const col = (c: CatInfo, keep?: (slug: string) => boolean): NavCol => ({ title: c.title, href: `/${c.slug}/`, n: keep ? subCount(c, keep) : countOf(c), isNew: c.isNew, blurb: c.description, subs: subLinks(c, keep) });

// Places sits in Discover (Adam, 2026-11-26) with two tabs, Real places and Settings: the kinds of real place
// A to Z, then Settings last, pointing at its tab.
const placesCol = (pl: CatInfo): NavCol => {
  const st = pl.subs.find((s) => s.slug === 'in-story');
  const c = col(pl);
  return { ...c, subs: [...c.subs.filter((s) => s.href !== '/places/in-story/'), { title: 'Settings in the stories', href: '/places/#settings', n: st?.entries.length ?? 0 }] };
};

let cache: NavVerb[] | undefined;
export async function navModel(): Promise<NavVerb[]> {
  if (cache) return cache;
  const cats = await catalog();
  const get = (slug: string) => cats.get(slug);
  cache = VERBS.map((v) => {
    let cols: NavCol[] = [];
    let collections: NavLink[] | undefined;
    if (v.slug === 'read') {
      const r = get('reading')!;
      const formats = r.subs.filter((s) => s.entries.length && !READ_COLLECTIONS.includes(s.slug));
      const rank = (slug: string) => { const i = READ_ORDER.indexOf(slug); return i < 0 ? Infinity : i; };
      const ordered = [...formats].sort((a, b) => rank(a.slug) - rank(b.slug) || sortKey(a.title).localeCompare(sortKey(b.title)));
      cols = ordered.map((s) => ({ title: s.title, href: `/reading/${s.slug}/`, n: s.entries.length, isNew: s.isNew, blurb: s.blurb, subs: [] }));
      collections = subLinks(r, (s) => READ_COLLECTIONS.includes(s));
    } else if (v.slug === 'meet') {
      const p = get('people')!, o = get('organizations')!;
      const ch = p.subs.find((s) => s.slug === 'characters');
      cols = az([
        col(p, (s) => s !== 'characters'),
        { title: 'Characters', href: '/people/characters/', n: ch?.entries.length ?? 0, blurb: ch?.blurb, subs: [] },
        col(o),
      ]);
      // The fan forums and uploads (Adam, 2026-11-25: "Forums/Community in the main menu under Meet"). Their
      // contents live in the accounts database, so the column has no build-time count.
      cols.push({ title: 'Community', href: '/community/', n: 0, live: true, blurb: 'Talk with other fans in the forums, share your own photos and finds, and see what fans have added to each page.',
        subs: [{ title: 'Forums', href: '/community/forum/', n: 0 }, { title: 'Fan contributions', href: '/community/uploads/', n: 0 }, { title: 'Community guidelines', href: '/community/guidelines/', n: 0 }] });
    } else {
      cols = v.categories.map((c) => get(c.slug)).filter(Boolean).map((c) => c!.slug === 'places' ? placesCol(c!) : col(c!));
    }
    const n = v.slug === 'read' ? countOf(get('reading')!) : cols.reduce((t, c) => t + c.n, 0);
    // Read's menu: its formats in one column and its topic collections in another.
    const menu = v.slug === 'read' ? [
      { title: 'Formats', href: '/read/', n, subs: cols.map((c) => ({ title: c.title, href: c.href, n: c.n, isNew: c.isNew })) },
      { title: 'Collections', href: '/read/#collections', n: new Set(get('reading')!.subs.filter((s) => READ_COLLECTIONS.includes(s.slug)).flatMap((s) => s.entries.map((e) => e.key))).size, subs: collections ?? [] },
    ] : undefined;
    return { slug: v.slug, title: v.title, blurb: v.blurb, href: v.href, n, cols, collections, menu };
  });
  return cache;
}
