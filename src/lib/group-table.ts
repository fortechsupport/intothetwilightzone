// One sortable, filterable, searchable table per category (Adam, 2026-11-28; docs/plans/navigation-2026-11-28.md):
// Discover, View and Listen get one per category, Read one per format, and Play, Collect and Legacy one each. Every
// record is one row, with a column (and a filter) for each way the category divides. GroupTable.astro renders the
// first rows into the page; the rest come from /tables/<key>.json, built here, so pages stay small.
import { catalog, entityRows, type CatInfo, type Entry } from './catalog';
import { VERBS, COLLECT_FROM, LEGACY_FROM, READ_ORDER, READ_COLLECTIONS, sortKey } from './taxonomy.mjs';
import { READ_LABEL, unofficialOf } from './nav';

export interface Col { key: string; label: string; narrow?: boolean; num?: boolean }
export interface Row { key: string; t: string; h?: string; x?: 1; s: string; y?: string; r?: string; n?: number; v: Record<string, string[]> }
export interface Table { key: string; file: string; slug: string; title: string; noun: string; cols: Col[]; rows: Row[]; options: Record<string, string[]> }

const SIDE: Record<string, string> = { official: 'Official', unofficial: 'Unofficial and inspired' };
const TIER: Record<string, string> = { core: 'Core', related: 'Related', tangential: 'Tangential' };
const year = (e: Entry) => String(e.meta ?? '').match(/\b(1[89]\d\d|20\d\d)\b/)?.[1];
const clip = (s?: string, n = 150) => {
  if (!s) return undefined;
  const t = s.replace(/\s+/g, ' ').trim();
  return t.length <= n ? t : t.slice(0, t.lastIndexOf(' ', n - 1)) + '…';
};

/** Collect: physical or digital, from what the shelf is and what the record says (plan, "Decided here" 4). */
const PHYSICAL_SHELVES = new Set(['home-media', 'toys-figures', 'trading-cards', 'household-apparel', 'masks-and-costumes', 'replicas', 'props-costumes', 'collectibles', 'posters-prints', 'board-games', 'card-games', 'books', 'comics', 'magazines', 'scripts']);
const DIGITAL_RE = /\b(digital|download(able)?|e-?book|kindle|audiobook|audible|app|ios|android|steam|playstation network|xbox live|eshop|oculus|meta quest|vr|streaming|mp3|itunes|online|pinball fx|zen studios|farsight|pinball arcade|web ?site|browser)\b/i;
const PHYSICAL_RE = /\b(vinyl|lp|cd|cassette|8-track|vhs|laserdisc|dvd|blu-ray|floppy|cartridge|cd-rom|disc|hardcover|paperback|print(ed)?|figure|card|board game|machine|table|cabinet)\b/i;
function format(e: Entry, shelf: string): string {
  if (e.group === 'Digital versions of the table') return 'Digital';
  if (e.group === 'The 1993 table' || e.group === 'Slot machines') return 'Physical';
  const text = `${e.title} ${e.meta ?? ''} ${e.desc ?? ''}`;
  const d = DIGITAL_RE.test(text), p = PHYSICAL_SHELVES.has(shelf) || PHYSICAL_RE.test(text);
  return d && p ? 'Physical and digital' : d ? 'Digital' : p ? 'Physical' : 'Not stated';
}

/** Legacy: the category a later work belongs to when it sits only on a Legacy-by-relationship shelf, by record type. */
const LEGACY_CAT_OF: Record<string, string> = { episodes: 'Television', series: 'Television', television: 'Television', films: 'Movies', songs: 'Music', radio: 'Radio', podcasts: 'Podcasts', books: 'Reading', comics: 'Reading', magazines: 'Reading', essays: 'Reading', works: 'Other works' };
/** The record a Legacy entry is about: a connection's page is the later work's page, so read it from the address. */
const targetKey = (e: Entry) => { const m = e.href?.match(/^\/(\w+)\/([^/#]+)/); return m ? `${m[1]}/${m[2]}` : e.key; };
const legacyCat = (e: Entry) => { const k = targetKey(e), col = k.split('/')[0]; return col === 'films' && /-tv-series$|-series$/.test(k) ? 'Television' : LEGACY_CAT_OF[col]; };

// The games played on this site itself (Play). Fan-made by this site, so unofficial.
const SITE_GAMES: Row[] = [
  { key: 'site/quiz', t: 'Twilight Zone trivia quiz', h: '/quiz/', s: sortKey('Twilight Zone trivia quiz'), r: 'Ten questions a round, drawn from the episode pages of this site.', v: {} },
  { key: 'site/degrees', t: 'Six Degrees of The Twilight Zone', h: '/degrees/', s: sortKey('Six Degrees of The Twilight Zone'), r: 'Link any two people through the episodes they made together, from this site\'s credits.', v: {} },
  { key: 'site/finder', t: 'Episode finder', h: '/finder/', s: sortKey('Episode finder'), r: 'Answer a few questions and get the episodes that fit, from this site\'s episode records.', v: {} },
  { key: 'site/today', t: 'Episode of the day', h: '/today/', s: sortKey('Episode of the day'), r: 'A different episode for every day of the year, with what happened on that date.', v: {} },
];

class Builder {
  rows = new Map<string, Row>();
  add(e: Entry, vals: Record<string, string | undefined>) {
    let r = this.rows.get(e.key);
    if (!r) {
      r = { key: e.key, t: e.title, s: e.sort, v: {} };
      if (e.href) r.h = e.href;
      if (e.external) r.x = 1;
      const y = year(e); if (y) r.y = y;
      // The reason a row is here: the record's stated connection or description; failing those, its shelf and its
      // one line of facts ("Actors: 1 credit · 1924-1998"), which is how its shelf page lists it.
      const why = clip(e.why ?? e.desc) ?? (e.meta ? clip([vals.shelf ?? vals.kind ?? vals.cat ?? vals.group, e.meta].filter(Boolean).join(': ')) : undefined); if (why) r.r = why;
      this.rows.set(e.key, r);
    }
    const all = { ...vals, side: e.official === true ? SIDE.official : e.official === false ? SIDE.unofficial : undefined, tier: TIER[e.tier ?? 'core'] };
    for (const [k, v] of Object.entries(all)) {
      if (!v) continue;
      const list = (r.v[k] ??= []);
      if (!list.includes(v)) list.push(v);
    }
  }
}

const shelvesOf = (c: CatInfo, keep?: string[] | null) => c.subs.filter((s) => (!keep || keep.includes(s.slug)) && s.entries.length);

/** The tables, by key: a category slug, `reading/<format>`, or play, collect, legacy. */
export const tableFile = (key: string) => `/tables/${key.replace('/', '-')}.json`;
const FACET_COLS: [string, string, boolean][] = [['type', 'Type', false], ['episode', 'Episode it points to', true], ['confidence', 'Evidence', true]];
const SECTIONS = new Set(['people', 'places', 'organizations']);

let cache: Map<string, Table> | undefined;
export async function groupTables(): Promise<Map<string, Table>> {
  if (cache) return cache;
  const cats = await catalog();
  const get = (slug: string) => cats.get(slug)!;
  const out = new Map<string, Table>();
  const finish = (key: string, title: string, noun: string, b: Builder, cols: Col[]) => {
    const rows = [...b.rows.values()].sort((a, z) => a.s.localeCompare(z.s));
    const all: Col[] = [...cols, { key: 'year', label: 'Year', narrow: true }];
    if (rows.some((r) => r.v.side?.length)) all.push({ key: 'side', label: 'Official or not', narrow: true });
    all.push({ key: 'tier', label: 'Relevance', narrow: true });
    const options: Record<string, string[]> = {};
    for (const c of all) {
      if (c.key === 'year' || c.num) continue;
      const vals = [...new Set(rows.flatMap((r) => r.v[c.key] ?? []))];
      const order = c.key === 'tier' ? Object.values(TIER) : c.key === 'side' ? Object.values(SIDE) : undefined;
      options[c.key] = order ? order.filter((o) => vals.includes(o)) : vals.sort((a, z) => sortKey(a.replace(/^["“]/, '')).localeCompare(sortKey(z.replace(/^["“]/, ''))));
    }
    // A column with one value for every row (or none) tells nothing: leave it out. Year stays where any row has one.
    const keep = all.filter((c) => (c.key === 'year' ? rows.some((r) => r.y) : c.num ? true : (options[c.key]?.length ?? 0) > 1));
    out.set(key, { key, file: tableFile(key), slug: key, title, noun, cols: keep, rows, options });
  };

  // Discover, View and Listen: one table per category, with its shelves, the shelf's own groups, and (Movies) the
  // film filters. People, Places and Organizations add where each appears and how many records it is in.
  for (const g of VERBS.filter((v) => ['discover', 'view', 'listen'].includes(v.slug))) {
    for (const c0 of g.categories) {
      const c = cats.get(c0.slug); if (!c) continue;
      const b = new Builder();
      const facetCols = FACET_COLS.filter(([k]) => c.subs.some((s) => s.entries.some((e) => e.facets?.[k]?.length)));
      for (const s of shelvesOf(c)) for (const e of s.entries) {
        const vals: Record<string, string | undefined> = { shelf: c.slug === 'places' && s.slug === 'in-story' ? 'Settings in the stories' : s.title, group: e.group };
        b.add(e, vals);
        for (const [k] of facetCols) for (const v of e.facets?.[k] ?? []) b.add(e, { [k]: v });
      }
      const cols: Col[] = [{ key: 'shelf', label: SECTIONS.has(c.slug) || c.slug === 'events' ? 'Kind' : 'Shelf' }, { key: 'group', label: 'Group', narrow: true }, ...facetCols.map(([key, label, narrow]) => ({ key, label, narrow }))];
      if (SECTIONS.has(c.slug)) {
        for (const r of await entityRows(c.slug as any)) {
          const row = b.rows.get(r.key); if (!row) continue;
          row.n = r.records;
          row.v.where = r.where.filter((w) => !w.slug.includes('/') && w.slug !== c.slug).map((w) => w.title);
        }
        cols.push({ key: 'where', label: 'Appears in', narrow: true }, { key: 'n', label: 'Records', narrow: true, num: true });
      }
      finish(c.slug, c.title, c.title.toLowerCase(), b, cols);
    }
  }
  // Read: one table per format (Adam's seven), with the format's own groups (Biographies, Gold Key, ...) and the
  // topic collections each item is in.
  const reading = get('reading');
  for (const slug of READ_ORDER) {
    const sub = reading.subs.find((s) => s.slug === slug); if (!sub) continue;
    const b = new Builder();
    for (const e of sub.entries) b.add(e, { group: e.group });
    for (const s of reading.subs.filter((x) => READ_COLLECTIONS.includes(x.slug))) for (const e of s.entries) if (b.rows.has(e.key)) b.add(e, { coll: s.title });
    finish(`reading/${slug}`, READ_LABEL[slug], READ_LABEL[slug].toLowerCase(), b, [{ key: 'group', label: 'Group' }, { key: 'coll', label: 'Collection', narrow: true }]);
  }
  {
    // Play: every kind of game, the nods in other games, fan-made games and the games on this site.
    const b = new Builder();
    for (const s of shelvesOf(get('games'))) for (const e of s.entries) b.add(e, { kind: s.title, group: e.group });
    for (const e of get('homages').subs.find((s) => s.slug === 'fan-made')?.entries.filter((x) => x.group === 'Fan games') ?? []) b.add(e, { kind: 'Fan-made games' });
    for (const r of SITE_GAMES) b.rows.set(r.key, { ...r, v: { kind: ['Play on this site'], side: [SIDE.unofficial], tier: [TIER.core] } });
    finish('play', 'Play', 'games', b, [{ key: 'kind', label: 'Kind' }, { key: 'group', label: 'Group', narrow: true }]);
  }
  {
    const b = new Builder();
    for (const [slug, keep] of COLLECT_FROM) {
      const c = get(slug);
      for (const s of shelvesOf(c, keep)) for (const e of s.entries) b.add(e, { cat: c.title, shelf: s.title, fmt: format(e, s.slug) });
    }
    finish('collect', 'Collect', 'things to collect', b, [{ key: 'cat', label: 'Category' }, { key: 'shelf', label: 'Shelf' }, { key: 'fmt', label: 'Physical or digital', narrow: true }]);
  }
  {
    // Legacy: the kind of link (the Legacy-by-relationship shelves, or the category shelf an unofficial work sits on),
    // the category of the later work, and how well the link is documented.
    const b = new Builder();
    const EVIDENCE = ['Confirmed by its makers', 'Documented', 'Noted by fans', 'Name only, link not confirmed'];
    const catOf = new Map<string, string[]>();
    for (const slug of LEGACY_FROM) { const c = cats.get(slug); if (!c) continue; for (const s of c.subs) for (const e of s.entries) { const l = catOf.get(e.key) ?? []; if (!l.includes(c.title)) l.push(c.title); catOf.set(e.key, l); } }
    const ev = (e: Entry) => [...(EVIDENCE.includes(e.group ?? '') ? [e.group!] : []), ...(e.facets?.confidence ?? [])];
    for (const s of shelvesOf(get('homages'))) for (const e of s.entries) {
      const cs = catOf.get(e.key) ?? catOf.get(targetKey(e)) ?? [s.slug === 'websites' ? 'Websites' : legacyCat(e) ?? 'Other works'];
      for (const c of cs) b.add(e, { kind: s.title, cat: c });
      for (const x of ev(e)) b.add(e, { ev: x });
    }
    for (const slug of LEGACY_FROM) {
      const c = cats.get(slug); if (!c) continue;
      const un = new Set(unofficialOf(c).map((e) => e.key));
      for (const s of c.subs.filter((x) => !READ_COLLECTIONS.includes(x.slug))) for (const e of s.entries) if (un.has(e.key) && e.official === false) {
        const known = b.rows.get(e.key);
        b.add(e, { cat: c.title, kind: known?.v.kind?.length ? undefined : s.title });
        for (const x of ev(e)) b.add(e, { ev: x });
      }
    }
    finish('legacy', 'Legacy', 'works it inspired', b, [{ key: 'kind', label: 'Kind of link' }, { key: 'cat', label: 'Category' }, { key: 'ev', label: 'Evidence', narrow: true }]);
  }
  cache = out;
  return out;
}
