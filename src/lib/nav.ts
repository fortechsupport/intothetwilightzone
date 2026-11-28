// The site's navigation model: Adam's menu sheet (2026-11-27, decision 0015), seven groups each with columns of
// categories and their subcategories, with counts. Base.astro renders it as the main menu; the group pages, home
// page and All categories use it too, so every view of the structure agrees. Read lists its formats in Adam's
// order and its topic collections; Discover's People column holds real people, characters and fans with the forums;
// Places lists the real places' kinds, then Settings; Play lists each kind of game and the games on this site;
// Collect and Legacy span every category.
import { catalog, countOf, type CatInfo } from './catalog';
import { VERBS, READ_COLLECTIONS, READ_ORDER, READ_TITLES, COLLECT_FROM, LEGACY_FROM, sortKey, catHref, togglesOf } from './taxonomy.mjs';

/** A category's unofficial and inspired entries, each once, A to Z (Legacy, src/pages/legacy/[cat].astro). */
export const unofficialOf = (c: CatInfo) => [...new Map(c.subs.flatMap((s) => s.entries.filter((e) => e.official === false).map((e) => [e.key, e] as const))).values()].sort((a, b) => a.sort.localeCompare(b.sort));
/** Read's items as Adam named them (2026-11-28). */
export const READ_LABEL: Record<string, string> = READ_TITLES;
const COLLECT_BLURB: Record<string, string> = {
  merchandise: 'Home video, toys and figures, trading cards, posters, prop replicas, screen-used props and the rest.',
  reading: 'Books, comics, magazines and published scripts.',
  music: 'Score and soundtrack albums.',
  games: 'Pinball machines, video games, board, card and trivia games.',
};

export interface NavLink { title: string; href: string; n: number; isNew?: boolean; live?: boolean }
export interface NavCol { title: string; href: string; n: number; live?: boolean; cta?: string; isNew?: boolean; blurb?: string; subs: NavLink[] }
export interface NavVerb { slug: string; title: string; blurb: string; href: string; n: number; cols: NavCol[]; collections?: NavLink[]; menu?: NavCol[] }

const az = <T extends { title: string }>(l: T[]) => [...l].sort((a, b) => sortKey(a.title).localeCompare(sortKey(b.title)));
const subLinks = (c: CatInfo, keep: (slug: string) => boolean = () => true): NavLink[] =>
  az(c.subs.filter((s) => s.entries.length && keep(s.slug)).map((s) => ({ title: s.title, href: catHref(c.slug, s.slug), n: s.entries.length, isNew: s.isNew })));
const subCount = (c: CatInfo, keep: (slug: string) => boolean) => new Set(c.subs.filter((s) => keep(s.slug)).flatMap((s) => s.entries.map((e) => e.key))).size;
const col = (c: CatInfo, keep?: (slug: string) => boolean): NavCol => ({ title: c.title, href: catHref(c.slug), n: keep ? subCount(c, keep) : countOf(c), isNew: c.isNew, blurb: c.description, subs: subLinks(c, keep) });

// Places (in Discover, called Meet 2026-11-27 to 11-28) has two tabs, Real places and Settings: the kinds of real place
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
    let collectKeys: Set<string> | undefined, legacyKeys: Set<string> | undefined;
    if (v.slug === 'read') {
      const r = get('reading')!;
      // Adam (2026-11-28): exactly seven items, named as he wrote them; the shelf pages keep their fuller titles.
      const ordered = READ_ORDER.map((slug) => r.subs.find((s) => s.slug === slug)).filter((s) => s && s.entries.length) as typeof r.subs;
      cols = ordered.map((s) => ({ title: READ_LABEL[s.slug] ?? s.title, href: `/reading/${s.slug}/`, n: s.entries.length, isNew: s.isNew, blurb: s.blurb, subs: [] }));
      collections = subLinks(r, (s) => READ_COLLECTIONS.includes(s));
    } else if (v.slug === 'discover') {
      // Discover (Adam, 2026-11-28; Meet on the 2026-11-27 sheet): Organizations; People, which holds real people, characters and fans, with the forums
      // (their contents live in the accounts database, so they carry no build-time count); Places; Events, which
      // holds History's shelves and links the Timeline.
      cols = v.categories.map((c) => get(c.slug)).filter(Boolean).map((c) => c!.slug === 'places' ? placesCol(c!) : col(c!));
      const people = cols.find((c) => c.href === '/people/');
      if (people) people.subs.push({ title: 'Community forums', href: '/community/forum/', n: 0, live: true }, { title: 'Fan contributions', href: '/community/uploads/', n: 0, live: true });
      cols.find((c) => c.href === '/events/')?.subs.push({ title: 'Timeline', href: '/timeline/', n: 0, live: true });
    } else if (v.slug === 'collect') {
      // Collect (Adam's sheet: all categories): one column per category with things a fan can own, its shelves below,
      // then the visitor's own collection. Merchandise lists its shelves A to Z.
      cols = COLLECT_FROM.map(([slug, keep]) => {
        const c = get(slug)!;
        const shelves = c.subs.filter((s) => (keep ? keep.includes(s.slug) : true) && s.entries.length);
        const ordered = keep ? keep.map((k) => shelves.find((s) => s.slug === k)).filter(Boolean) as typeof shelves : az(shelves);
        return { title: c.title, href: `/${c.slug}/`, n: new Set(shelves.flatMap((s) => s.entries.map((e) => e.key))).size, blurb: COLLECT_BLURB[c.slug], subs: ordered.map((s) => ({ title: s.title, href: `/${c.slug}/${s.slug}/`, n: s.entries.length, isNew: s.isNew })) };
      });
      collectKeys = new Set(COLLECT_FROM.flatMap(([slug, keep]) => get(slug)!.subs.filter((s) => !keep || keep.includes(s.slug)).flatMap((s) => s.entries.map((e) => `${e.key}`))));
      cols.push({ title: 'Track your collection', href: '/my-zone/', n: 0, live: true, cta: 'Your list', blurb: 'Mark what you own and what you want on any page, and see your list in My Zone. It stays in your browser, or in your account if you sign in.', subs: [] });
    } else if (v.slug === 'legacy') {
      // Legacy (Adam's sheet: all categories): the kinds of link first, then each category's unofficial and inspired
      // works, each on its own page (src/pages/legacy/[cat].astro). The category columns carry no shelf links, so the
      // menu panel stays one screen high; each page lists its shelves.
      const h = get('homages')!;
      cols = [{ ...col(h), title: 'By kind of link' }];
      for (const slug of LEGACY_FROM) {
        const c = get(slug); if (!c) continue;
        const un = unofficialOf(c);
        if (!un.length) continue;
        cols.push({ title: c.title, href: `/legacy/${c.slug}/`, n: un.length, blurb: `Unofficial and inspired: ${az(c.subs.filter((s) => s.entries.some((e) => e.official === false))).map((s) => s.title.toLowerCase()).join(', ')}.`, subs: [] });
      }
      legacyKeys = new Set([...h.subs.flatMap((s) => s.entries.map((e) => e.key)), ...LEGACY_FROM.flatMap((slug) => get(slug) ? unofficialOf(get(slug)!).map((e) => e.key) : [])]);
    } else {
      cols = v.categories.map((c) => get(c.slug)).filter(Boolean).map((c) => c!.slug === 'places' ? placesCol(c!) : col(c!));
      // Play (Adam's sheet): one column per kind of game in his order, then the games to play on this site.
      if (v.slug === 'play') {
        const g = get('games')!;
        const shelf = (slug: string, title: string): NavCol => { const sh = g.subs.find((x) => x.slug === slug); return { title, href: `/games/${slug}/`, n: sh?.entries.length ?? 0, isNew: sh?.isNew, blurb: sh?.blurb, subs: [] }; };
        const tg = g.subs.find((x) => x.slug === 'trivia-games');
        cols = [
          shelf('pinball-arcade', 'Pinball'), shelf('video-games', 'Video games'), shelf('board-games', 'Board games'), shelf('card-games', 'Card games'), shelf('mini-golf', 'Mini golf'),
          { title: 'Trivia', href: '/quiz/', n: tg?.entries.length ?? 0, live: true, cta: 'Play now', blurb: 'Ten questions a round, drawn from the episode pages, and the trivia games published about the show.', subs: [{ title: 'Trivia quiz', href: '/quiz/', n: 0, live: true }, { title: 'Trivia games', href: '/games/trivia-games/', n: tg?.entries.length ?? 0 }] },
          { title: 'Six Degrees', href: '/degrees/', n: 0, live: true, cta: 'Play now', blurb: 'Link any two people through the episodes they made together.', subs: [] },
          { title: 'More to play', href: '/games/', n: (g.subs.find((x) => x.slug === 'game-homages')?.entries.length ?? 0) + (g.subs.find((x) => x.slug === 'other-games')?.entries.length ?? 0), live: true, cta: 'Explore', blurb: 'The Episode finder, an episode for every day, fan-made games and the nods to the show in other games.',
            subs: [{ title: 'Episode finder', href: '/finder/', n: 0 }, { title: 'Episode of the day', href: '/today/', n: 0 }, { title: 'Fan-made games', href: '/homages/fan-made/', n: 0 }, { title: 'Nods in other games', href: '/games/game-homages/', n: g.subs.find((x) => x.slug === 'game-homages')?.entries.length ?? 0 }] },
        ];
      }
    }
    const n = v.slug === 'read' ? countOf(get('reading')!) : v.slug === 'collect' ? collectKeys!.size : v.slug === 'legacy' ? legacyKeys!.size : v.slug === 'play' ? countOf(get('games')!) : cols.reduce((t, c) => t + c.n, 0);
    // Read's menu is its seven formats, flat like Play's (Adam, 2026-11-28); the topic collections stay on the Read page.
    const menu = v.slug === 'legacy' ? [
      // Legacy's menu: the kinds of link in one column and the categories in another, so the panel stays short.
      cols[0],
      { title: 'By category', href: '/legacy/#categories', n: new Set(LEGACY_FROM.flatMap((slug) => get(slug) ? unofficialOf(get(slug)!).map((e) => e.key) : [])).size, subs: cols.slice(1).map((c) => ({ title: c.title, href: c.href, n: c.n })) },
    ] : undefined;
    // Play, Collect and Legacy are one table each, with no category links in the menu or on their page (Adam,
    // 2026-11-28); the columns above still give their counts.
    if (['play', 'collect', 'legacy'].includes(v.slug)) return { slug: v.slug, title: v.title, blurb: v.blurb, href: v.href, n, cols: [], collections, menu: undefined };
    // Discover, View, Listen and Read (the explore framework, 2026-11-28): the menu lists the category names only, each
    // linking to its toggle on the group page, in Adam's order; Discover ends with Sources.
    if (['discover', 'view', 'listen', 'read'].includes(v.slug)) {
      const toggles: NavCol[] = togglesOf(v.slug).map(([cat, sub, title]: [string, string, string]) => {
        const c = cols.find((x) => x.title === title);
        return { title, href: v.slug === 'read' ? catHref('reading', sub) : catHref(cat), n: c?.n ?? 0, blurb: c?.blurb, subs: [], live: cat === 'sources' || undefined };
      });
      return { slug: v.slug, title: v.title, blurb: v.blurb, href: v.href, n, cols: toggles, collections: undefined, menu: undefined };
    }
    return { slug: v.slug, title: v.title, blurb: v.blurb, href: v.href, n, cols, collections, menu };
  });
  return cache;
}
