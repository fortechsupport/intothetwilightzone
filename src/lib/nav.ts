// The site's navigation model: Adam's menu sheet (2026-11-27, decision 0015), seven groups each with columns of
// categories and their subcategories, with counts. Base.astro renders it as the main menu; the group pages, home
// page and All categories use it too, so every view of the structure agrees. Read lists its formats in Adam's
// order and its topic collections; Meet's People column holds real people, characters and fans with the forums;
// Places lists the real places' kinds, then Settings; Play lists each kind of game and the games on this site.
import { catalog, countOf, type CatInfo } from './catalog';
import { VERBS, READ_COLLECTIONS, READ_ORDER, sortKey } from './taxonomy.mjs';

export interface NavLink { title: string; href: string; n: number; isNew?: boolean; live?: boolean }
export interface NavCol { title: string; href: string; n: number; live?: boolean; cta?: string; isNew?: boolean; blurb?: string; subs: NavLink[] }
export interface NavVerb { slug: string; title: string; blurb: string; href: string; n: number; cols: NavCol[]; collections?: NavLink[]; menu?: NavCol[] }

const az = <T extends { title: string }>(l: T[]) => [...l].sort((a, b) => sortKey(a.title).localeCompare(sortKey(b.title)));
const subLinks = (c: CatInfo, keep: (slug: string) => boolean = () => true): NavLink[] =>
  az(c.subs.filter((s) => s.entries.length && keep(s.slug)).map((s) => ({ title: s.title, href: `/${c.slug}/${s.slug}/`, n: s.entries.length, isNew: s.isNew })));
const subCount = (c: CatInfo, keep: (slug: string) => boolean) => new Set(c.subs.filter((s) => keep(s.slug)).flatMap((s) => s.entries.map((e) => e.key))).size;
const col = (c: CatInfo, keep?: (slug: string) => boolean): NavCol => ({ title: c.title, href: `/${c.slug}/`, n: keep ? subCount(c, keep) : countOf(c), isNew: c.isNew, blurb: c.description, subs: subLinks(c, keep) });

// Places (in Meet since 2026-11-27) has two tabs, Real places and Settings: the kinds of real place
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
      // Meet (Adam's sheet): Organizations; People, which holds real people, characters and fans, with the forums
      // (their contents live in the accounts database, so they carry no build-time count); Places; Events, which
      // lists History and the Timeline until History's shelves move into it (plan step 3).
      cols = v.categories.filter((c) => c.slug !== 'history').map((c) => get(c.slug)).filter(Boolean).map((c) => c!.slug === 'places' ? placesCol(c!) : col(c!));
      const people = cols.find((c) => c.href === '/people/');
      if (people) people.subs.push({ title: 'Community forums', href: '/community/forum/', n: 0, live: true }, { title: 'Fan contributions', href: '/community/uploads/', n: 0, live: true });
      const events = cols.find((c) => c.href === '/events/'), history = get('history');
      if (events && history) { events.n += countOf(history); events.subs.push({ title: 'History', href: '/history/', n: countOf(history) }, { title: 'Timeline', href: '/timeline/', n: 0, live: true }); }
    } else if (v.slug === 'collect') {
      // Collect (Adam, 2026-11-26): Merchandise's shelves shown directly, then the visitor's own collection.
      const m = get('merchandise')!;
      cols = az(m.subs.filter((s) => s.entries.length).map((s) => ({ title: s.title, href: `/merchandise/${s.slug}/`, n: s.entries.length, isNew: s.isNew, blurb: s.blurb, subs: [] })));
      cols.push({ title: 'Track your collection', href: '/my-zone/', n: 0, live: true, cta: 'Your list', blurb: 'Mark what you own and what you want on any page, and see your list in My Zone. It stays in your browser, or in your account if you sign in.', subs: [] });
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
    const n = v.slug === 'read' ? countOf(get('reading')!) : v.slug === 'collect' ? countOf(get('merchandise')!) : v.slug === 'play' ? countOf(get('games')!) : cols.reduce((t, c) => t + c.n, 0);
    // Read's menu: its formats in one column and its topic collections in another.
    const menu = v.slug === 'read' ? [
      { title: 'Formats', href: '/read/', n, subs: cols.map((c) => ({ title: c.title, href: c.href, n: c.n, isNew: c.isNew })) },
      { title: 'Collections', href: '/read/#collections', n: new Set(get('reading')!.subs.filter((s) => READ_COLLECTIONS.includes(s.slug)).flatMap((s) => s.entries.map((e) => e.key))).size, subs: collections ?? [] },
    ] : undefined;
    return { slug: v.slug, title: v.title, blurb: v.blurb, href: v.href, n, cols, collections, menu };
  });
  return cache;
}
