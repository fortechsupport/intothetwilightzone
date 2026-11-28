// The site's tables (the explore framework, docs/plans/explore-framework-2026-11-28.md, sections 2 and 3): one per
// category of Discover, View and Listen, one per Read format, one each for Play, Collect and Legacy, and Sources'
// Feeds. Each table has its own columns, chosen for what it holds: which columns filter, which headings sort, which
// show a link. Every record is one row. GroupTable.astro renders the first rows into the page; the rest come from
// /tables/<key>.json, built here, so pages stay small.
import { getCollection } from 'astro:content';
import { catalog, entityRows, type CatInfo, type Entry } from './catalog';
import { VERBS, COLLECT_FROM, LEGACY_FROM, READ_ORDER, READ_COLLECTIONS, sortKey } from './taxonomy.mjs';
import { READ_LABEL, unofficialOf } from './nav';
import { allPeople } from './data';
import { slugify } from './slug';
import { THEME, themesOfTags } from './themes';
import { watchFor, watchShort } from './watch';

/** sort: how the heading sorts (none = not sortable); filter: a filter menu; show false: a filter only, no column. */
export interface Col { key: string; label: string; sort?: 'text' | 'num' | 'date'; filter?: boolean; show?: boolean; narrow?: boolean; link?: boolean; first?: 'asc' | 'desc' }
/** v: the values shown and filtered; o: what a sortable column sorts by; l: a link cell [label, href]. */
export interface Row { key: string; t: string; h?: string; x?: 1; s: string; r?: string; v: Record<string, string[]>; o: Record<string, string | number>; l: Record<string, [string, string]> }
export interface Table {
  key: string; file: string; slug: string; title: string; noun: string; cols: Col[]; rows: Row[]; options: Record<string, string[]>;
  /** The order a visitor first sees: 't' (A to Z) unless order is the point (Events: by date). */
  def: { key: string; dir: 1 | -1 };
  /** Row buttons, saved to My Zone (public/fan.js lists): [list, label pressed-off]. */
  actions: [string, string][];
  /** Play, Collect, Legacy: one-tap chips for this column, and a Surprise me button. */
  chips?: string;
  /** The first column's heading: Title, Name, Item, Work... */
  first?: string;
}

const OFFICIAL: Record<string, string> = { official: 'Official', unofficial: 'Unofficial and inspired' };
const clip = (s?: string, n = 150) => {
  if (!s) return undefined;
  const t = s.replace(/\s+/g, ' ').trim();
  return t.length <= n ? t : t.slice(0, t.lastIndexOf(' ', n - 1)) + '…';
};
const yearIn = (s?: unknown) => String(s ?? '').match(/\b(1[89]\d\d|20\d\d)\b/)?.[1];
const iso = (s?: unknown) => { const m = String(s ?? '').match(/\b(1[89]\d\d|20\d\d)(-\d\d)?(-\d\d)?/); return m ? m[0] : undefined; };
const human = (s?: string) => (s ? (s.charAt(0).toUpperCase() + s.slice(1)).replace(/-/g, ' ') : undefined);
const list = (x: unknown): string[] => (Array.isArray(x) ? x : x ? [x] : []).map(String).map((s) => s.trim()).filter(Boolean);
/** One spelling per person ("Alan Crosland, Jr." and "Alan Crosland Jr." are one director), from the People index. */
let canon: Map<string, string> | undefined;
const who = (x: unknown) => list(x).map((n) => canon?.get(slugify(n)) ?? n);
const SERIES_SHORT: Record<string, string> = { '1959': '1959 series', '1985': '1985 series', '2002': '2002 series', '2019': '2019 series' };
const SERIES: Record<string, string> = { '1959': 'The Twilight Zone (1959)', '1985': 'The Twilight Zone (1985)', '2002': 'The Twilight Zone (2002)', '2019': 'The Twilight Zone (2019)' };

// Every record, by catalog key ("films/the-man", "episodes/1959/the-howling-man").
type Rec = { col: string; id: string; data: any };
let recs: Map<string, Rec> | undefined;
async function records() {
  if (recs) return recs;
  recs = new Map();
  for (const col of ['series', 'episodes', 'films', 'connections', 'songs', 'books', 'comics', 'magazines', 'radio', 'podcasts', 'people', 'quotes', 'locations', 'works', 'essays', 'archives', 'characters', 'organizations'] as const) {
    for (const r of await getCollection(col as any)) recs.set(`${col}/${(r as any).id}`, { col, id: (r as any).id, data: (r as any).data });
  }
  return recs;
}
const baseKey = (k: string) => k.split('#')[0];

/** Collect: physical, digital or both, from what the record says (details.medium, set from sources) and its shelf. */
const PHYSICAL_SHELVES = new Set(['home-media', 'toys-figures', 'trading-cards', 'household-apparel', 'masks-and-costumes', 'replicas', 'props-costumes', 'collectibles', 'posters-prints', 'board-games', 'card-games', 'books', 'comics', 'magazines', 'scripts']);
const DIGITAL_RE = /\b(digital|download(able)?|e-?book|kindle|audiobook|audible|app|ios|android|steam|playstation network|xbox live|eshop|oculus|meta quest|vr|streaming|mp3|itunes|online|pinball fx|zen studios|farsight|pinball arcade|web ?site|browser)\b/i;
const PHYSICAL_RE = /\b(vinyl|lp|cd|cassette|8-track|vhs|laserdisc|dvd|blu-ray|floppy|cartridge|cd-rom|disc|hardcover|paperback|print(ed)?|figure|card|board game|machine|table|cabinet)\b/i;
const MEDIUM: Record<string, string> = { Physical: 'Physical', Digital: 'Digital', 'Physical and digital': 'Both', 'Not released on its own': 'Not released on its own', 'Not stated': 'Not stated' };
function physicalOrDigital(e: Entry, shelf: string, medium?: string): string {
  if (medium && MEDIUM[medium]) return MEDIUM[medium];
  if (e.group === 'Digital versions of the table') return 'Digital';
  if (e.group === 'The 1993 table' || e.group === 'Slot machines') return 'Physical';
  const text = `${e.title} ${e.meta ?? ''} ${e.desc ?? ''}`;
  const d = DIGITAL_RE.test(text), p = PHYSICAL_SHELVES.has(shelf) || PHYSICAL_RE.test(text);
  return d && p ? 'Both' : d ? 'Digital' : p ? 'Physical' : 'Not stated';
}
const EDITION_RE: [RegExp, string][] = [[/\b4k\b|ultra hd/i, '4K'], [/blu-?ray/i, 'Blu-ray'], [/\bdvd\b/i, 'DVD'], [/laserdisc/i, 'Laserdisc'], [/\bvhs\b/i, 'VHS'], [/\bvinyl\b|\blp\b/i, 'Vinyl'], [/\bcd\b/i, 'CD'], [/cassette/i, 'Cassette'], [/e-?book|kindle/i, 'E-book'], [/audiobook|audible/i, 'Audiobook'], [/download|digital/i, 'Download'], [/hardcover/i, 'Hardcover'], [/paperback/i, 'Paperback']];

/** Legacy: the category a later work belongs to, by record type. */
const LEGACY_CAT_OF: Record<string, string> = { episodes: 'Television', series: 'Television', television: 'Television', films: 'Movies', songs: 'Music', radio: 'Radio', podcasts: 'Podcasts', books: 'Books', comics: 'Comics', magazines: 'Magazines', essays: 'Essays', works: 'Other' };
const targetKey = (e: Entry) => { const m = e.href?.match(/^\/(\w+)\/([^/#]+)/); return m ? `${m[1]}/${m[2]}` : e.key; };
/** The 22 kinds of link (plan section 5), from the connection's own kind. */
const LINK_KIND: Record<string, string> = { 'official-adaptation': 'Adaptations', remake: 'Remakes', homage: 'Homages', parody: 'Parodies', reference: 'References', 'lyric-mention': 'Lyric mentions', 'inspired-by': 'Inspired by', compared: 'Compared to' };
const EVIDENCE: Record<string, string> = { 'confirmed-by-creator': 'Confirmed by its makers', documented: 'Documented', 'fan-noted': 'Noted by fans' };
const EVIDENCE_RANK: Record<string, number> = { 'Confirmed by its makers': 3, Documented: 2, 'Noted by fans': 1 };

// The games played on this site itself (Play). Made by this site, so unofficial.
const SITE_GAMES: [string, string, string, string][] = [
  ['quiz', 'Twilight Zone trivia quiz', '/quiz/', 'Ten questions a round, drawn from the episode pages of this site.'],
  ['degrees', 'Six Degrees of The Twilight Zone', '/degrees/', "Link any two people through the episodes they made together, from this site's credits."],
  ['finder', 'Episode finder', '/finder/', "Answer a few questions and get the episodes that fit, from this site's episode records."],
  ['today', 'Episode of the day', '/today/', 'A different episode for every day of the year, with what happened on that date.'],
];

type Fill = { v?: Record<string, string | string[] | undefined>; o?: Record<string, string | number | undefined>; l?: Record<string, [string, string] | undefined> };
class Builder {
  rows = new Map<string, Row>();
  add(e: { key: string; title: string; href?: string; external?: boolean; sort: string; why?: string; desc?: string; meta?: string; official?: boolean }, f: Fill = {}) {
    let r = this.rows.get(e.key);
    if (!r) {
      // A title in another script (Сумеречная зона) has nothing to file under A to Z: it goes after Z.
      r = { key: e.key, t: e.title, s: /[a-z0-9]/.test(e.sort) ? e.sort : `\uffff${e.title}`, v: {}, o: {}, l: {} };
      if (e.href) r.h = e.href;
      if (e.external) r.x = 1;
      // Why the row is here: the record's stated connection or description; failing those, its line of facts.
      const why = clip(e.why ?? e.desc) ?? clip(e.meta); if (why) r.r = why;
      if (e.official !== undefined) r.v.off = [e.official ? OFFICIAL.official : OFFICIAL.unofficial];
      this.rows.set(e.key, r);
    }
    for (const [k, x] of Object.entries(f.v ?? {})) for (const s of list(x)) { const l = (r.v[k] ??= []); if (!l.includes(s)) l.push(s); }
    for (const [k, x] of Object.entries(f.o ?? {})) if (x !== undefined && x !== '' && r.o[k] === undefined) r.o[k] = x;
    for (const [k, x] of Object.entries(f.l ?? {})) if (x && !r.l[k]) r.l[k] = x;
    return r;
  }
}

const shelvesOf = (c: CatInfo, keep?: string[] | null) => c.subs.filter((s) => (!keep || keep.includes(s.slug)) && s.entries.length);
export const tableFile = (key: string) => `/tables/${key.replace('/', '-')}.json`;
const off: Col = { key: 'off', label: 'Official', filter: true, narrow: true };
const WATCH: [string, string][] = [['watched', 'Watched'], ['later', 'Want to watch']];
const READ: [string, string][] = [['watched', 'Read'], ['later', 'Want to read']];
const HEARD: [string, string][] = [['watched', 'Heard']];

let cache: Map<string, Table> | undefined;
export async function groupTables(): Promise<Map<string, Table>> {
  if (cache) return cache;
  const cats = await catalog();
  const R = await records();
  const get = (slug: string) => cats.get(slug)!;
  const rec = (e: Entry) => R.get(baseKey(e.key));
  const out = new Map<string, Table>();
  const finish = (key: string, title: string, noun: string, b: Builder, cols: Col[], extra: Partial<Table> = {}) => {
    const rows = [...b.rows.values()].sort((a, z) => a.s.localeCompare(z.s));
    const options: Record<string, string[]> = {};
    for (const c of cols) {
      if (!c.filter) continue;
      const vals = [...new Set(rows.flatMap((r) => r.v[c.key] ?? []))];
      options[c.key] = c.key === 'off' ? Object.values(OFFICIAL).filter((o) => vals.includes(o)) : vals.sort((a, z) => sortKey(a.replace(/^["“]/, '')).localeCompare(sortKey(z.replace(/^["“]/, ''))));
    }
    // A column nothing fills, or a filter with one value for every row, tells nothing: leave it out.
    const keep = cols.filter((c) => {
      const filled = rows.some((r) => r.v[c.key]?.length || r.o[c.key] !== undefined || r.l[c.key]);
      if (!filled) return false;
      if (c.filter && c.show === false) return (options[c.key]?.length ?? 0) > 1;
      if (c.key === 'off') return (options.off?.length ?? 0) > 1;
      return true;
    });
    out.set(key, { key, file: tableFile(key), slug: key, title, noun, cols: keep, rows, options, def: { key: 't', dir: 1 }, actions: [], ...extra });
  };
  const people = await allPeople();
  canon = new Map([...people.values()].map((p) => [p.slug, p.name]));

  // ---------- Discover ----------
  {
    // Organizations: kind is the record's own kind (each separate), founded, ended, where, parent, how many records.
    const c = get('organizations'); const b = new Builder();
    const ent = new Map((await entityRows('organizations')).map((r) => [r.key, r]));
    const KIND: Record<string, string> = { 'production-company': 'Production company', licensee: 'Product licensee', 'record-label': 'Record label', 'game-company': 'Game company', 'toy-company': 'Toy company', 'home-video': 'Home video label', 'award-body': 'Award body', 'fan-group': 'Fan club or community', 'auction-house': 'Auction house' };
    for (const s of shelvesOf(c)) for (const e of s.entries) {
      const d = rec(e)?.data ?? {};
      b.add(e, { v: { kind: d.kind ? KIND[d.kind] ?? human(d.kind) : s.title, where: d.location ? d.location.split(/,\s*/).pop() : undefined, parent: d.parent },
        o: { founded: iso(d.founded), n: ent.get(e.key)?.records } });
    }
    finish('organizations', 'Organizations', 'organizations', b, [
      { key: 'kind', label: 'Kind', filter: true }, { key: 'founded', label: 'Founded', sort: 'date', narrow: true }, { key: 'where', label: 'Based in', filter: true, narrow: true },
      { key: 'parent', label: 'Part of', narrow: true }, { key: 'n', label: 'Records', sort: 'num', narrow: true, first: 'desc' }, off], { first: 'Name' });
  }
  {
    // People: real people, characters and fans in one table, by surname; roles each separate; where they appear.
    const c = get('people'); const b = new Builder();
    const ent = new Map((await entityRows('people')).map((r) => [r.key, r]));
    const ROLE: Record<string, string> = { Cast: 'Actor', 'Radio cast': 'Voice actor', 'Source story': 'Writer', 'Series creator': 'Producer', 'Radio adaptation': 'Writer', 'Original writer': 'Writer', 'Radio writer': 'Writer', 'Radio writer (never produced)': 'Writer', 'Radio host': 'Host', 'Comics writer': 'Writer', 'Comics artist': 'Artist', 'Cover artist': 'Illustrator' };
    const SHELF_ROLE: Record<string, string[]> = { actors: ['Actor'], artists: ['Artist'], composers: ['Composer'], crew: ['Crew'], directors: ['Director'], 'game-makers': ['Game maker'], family: ['Family'], fans: ['Fan'], 'inspired-creators': ['Creator it inspired'], 'narrators-hosts': [], producers: ['Producer'], 'scholars-historians': [], 'voice-actors': ['Voice actor'], writers: ['Writer'] };
    for (const s of shelvesOf(c)) for (const e of s.entries) {
      const isChar = e.key.startsWith('characters/');
      const p = people.get(e.key.replace(/^people\//, ''));
      const d = rec(e)?.data ?? p?.record?.data ?? {};
      const roles = new Set<string>(SHELF_ROLE[s.slug] ?? []);
      for (const cr of p?.credits ?? []) { const r = ROLE[cr.role] ?? cr.role; if (/^(Actor|Voice actor|Writer|Director|Producer|Composer|Narrator|Host)$/.test(r)) roles.add(r); }
      for (const r of list(d.roles)) { const x = r.toLowerCase(); for (const [re, v] of [[/narrat/, 'Narrator'], [/host/, 'Host'], [/scholar|professor|academic/, 'Scholar'], [/historian/, 'Historian'], [/illustrat/, 'Illustrator'], [/artist|painter/, 'Artist']] as [RegExp, string][]) if (re.test(x)) roles.add(v); }
      if (s.slug === 'narrators-hosts' && !roles.has('Narrator') && !roles.has('Host')) roles.add('Narrator or host');
      if (s.slug === 'scholars-historians' && !roles.has('Scholar') && !roles.has('Historian')) roles.add('Scholar or historian');
      const er = ent.get(e.key);
      const APPEARS: Record<string, string> = { episodes: 'Television', films: 'Movies', radio: 'Radio', comics: 'Read' };
      const charWhere = isChar ? [...new Set(list(d.appears_in).map((x) => (/^\d{4}\//.test(x) ? 'Television' : APPEARS[x.split('/')[0]])).filter(Boolean))] : [];
      b.add(e, { v: { kind: isChar ? 'Character' : s.slug === 'fans' ? 'Fan' : 'Real person', role: isChar ? [] : [...roles], where: isChar ? charWhere : er?.where.filter((w) => !w.slug.includes('/') && w.slug !== 'people').map((w) => ({ 'Legacy by relationship': 'Legacy', Reading: 'Read' } as Record<string, string>)[w.title] ?? w.title) },
        o: { born: iso(d.born), died: iso(d.died), n: isChar ? undefined : er?.records } });
    }
    finish('people', 'People', 'people', b, [
      { key: 'kind', label: 'Kind', filter: true, narrow: true }, { key: 'role', label: 'Roles', filter: true }, { key: 'where', label: 'Appears in', filter: true },
      { key: 'born', label: 'Born', sort: 'date', narrow: true }, { key: 'died', label: 'Died', sort: 'date', narrow: true }, { key: 'n', label: 'Credits', sort: 'num', narrow: true, first: 'desc' }], { first: 'Name' });
  }
  {
    // Places: kind, city, region, country, status, how many episodes and films were made there, its map.
    const c = get('places'); const b = new Builder();
    const KIND: Record<string, string> = { 'backlot-set': 'Set or backlot', 'filming-location': 'Filming location', 'serling-place': "Rod Serling's place", attraction: 'Attraction', 'museum-exhibit': 'Museum or exhibit', memorial: 'Memorial', archive: 'Archive', 'event-venue': 'Venue', 'in-story': 'Setting in a story' };
    for (const s of shelvesOf(c)) for (const e of s.entries) {
      const d = rec(e)?.data ?? {};
      const status = d.closed ? 'Closed' : /demolish/i.test(d.status ?? '') ? 'Demolished' : /closed/i.test(d.status ?? '') ? 'Closed' : d.kind === 'in-story' ? undefined : d.status ? 'Open' : undefined;
      b.add(e, { v: { kind: d.kind ? KIND[d.kind] : s.slug === 'in-story' ? 'Setting in a story' : s.title, city: d.city, region: d.region, country: d.country, status },
        o: { country: d.country, n: (d.filmed?.length ?? 0) || undefined },
        l: { map: d.lat != null && d.lng != null ? ['Map', `/map/#${e.key.split('/').pop()}`] : undefined } });
    }
    finish('places', 'Places', 'places', b, [
      { key: 'kind', label: 'Kind', filter: true }, { key: 'city', label: 'City', narrow: true }, { key: 'region', label: 'State or region', filter: true, narrow: true },
      { key: 'country', label: 'Country', filter: true, sort: 'text', narrow: true }, { key: 'status', label: 'Status', filter: true, narrow: true },
      { key: 'n', label: 'Filmed here', sort: 'num', narrow: true, first: 'desc' }, { key: 'map', label: 'Map', link: true, narrow: true }], { first: 'Name' });
  }
  {
    // Events: by date, because order is the point. Each kind separate.
    const c = get('events'); const b = new Builder();
    const today = new Date().toISOString().slice(0, 10);
    const KIND_OF: Record<string, string> = { SerlingFest: 'Festival', 'Film festivals': 'Festival', 'Anniversaries and days': 'Anniversary', 'TV marathons': 'Marathon', Screenings: 'Screening', 'Twilight Zone conventions': 'Convention', 'Conferences and symposia': 'Conference', 'Panels and salutes': 'Panel', 'Museum exhibits': 'Exhibition', 'Art exhibitions': 'Exhibition', 'Emmy Awards': 'Award', 'Hugo Awards': 'Award', 'Other awards and honors': 'Honor', 'Halls of fame and rankings': 'Ranking', Memorials: 'Memorial' };
    const SHELF_KIND: Record<string, string> = { premieres: 'Premiere', 'production-history': 'Production or broadcast milestone', 'serling-life': "Rod Serling's life", legal: 'Trial, lawsuit or rights', exhibitions: 'Exhibition', conventions: 'Convention', 'other-events': 'Other event', upcoming: 'Coming up' };
    for (const s of shelvesOf(c)) for (const e of s.entries) {
      const d = rec(e)?.data ?? {};
      const date = iso(e.key.match(/#history:([^:]+)/)?.[1]) ?? iso(d.details?.date ?? d.year ?? e.meta);
      const kind = (e.group && KIND_OF[e.group]) ?? SHELF_KIND[s.slug] ?? s.title;
      b.add(e, { v: { kind: kind === 'Coming up' ? undefined : kind, place: d.details?.location ?? d.details?.venue, series: e.group && SERIES[e.group.match(/\((\d{4})\)/)?.[1] ?? ''], status: s.slug === 'upcoming' || (date && date > today) ? 'Coming up' : 'Past' },
        o: { date } });
    }
    finish('events', 'Events', 'events', b, [
      { key: 'date', label: 'Date', sort: 'date', narrow: true }, { key: 'kind', label: 'Kind', filter: true }, { key: 'place', label: 'Place', narrow: true },
      { key: 'series', label: 'Series', filter: true, narrow: true }, { key: 'status', label: 'Coming up or past', filter: true, show: false }, off], { def: { key: 'date', dir: 1 }, first: 'Event' });
  }

  // ---------- View ----------
  {
    // Television: every series, episode, segment and show; season and episode sort in air order.
    const c = get('series'); const b = new Builder();
    const KIND: Record<string, string> = { 'tv-series': 'Series', 'web-series': 'Series', 'tv-episode': 'Episode', 'tv-segment': 'Segment', sketch: 'Sketch', pilot: 'Pilot', special: 'Special', 'tv-film': 'TV film', unproduced: 'Unmade', film: 'TV film', documentary: 'Special' };
    const SHELF_SERIES: Record<string, string> = { anthologies: 'Fellow anthologies', homages: 'Other shows', 'serling-series': "Rod Serling's other series" };
    for (const s of shelvesOf(c)) for (const e of s.entries) {
      const r = rec(e); const d = r?.data ?? {};
      const isEp = r?.col === 'episodes';
      const intl = e.key.includes('#intl:');
      const series = isEp ? SERIES_SHORT[d.series] : r?.col === 'series' ? SERIES_SHORT[r.id] ?? d.title : intl ? (SERIES_SHORT[e.group?.match(/^The Twilight Zone \((\d{4})/)?.[1] ?? ''] ?? e.group) : e.key.startsWith('night-gallery') || /night gallery/i.test(d.parent_series ?? '') ? 'Night Gallery' : SHELF_SERIES[s.slug] ?? (s.slug === 'twilight-zone' ? 'The Twilight Zone' : d.parent_series ?? e.group);
      const type = isEp ? (/[a-z]$/i.test(String(d.episode)) ? 'Segment' : 'Episode') : r?.col === 'series' ? 'Series' : intl ? 'Title abroad' : KIND[d.kind] ?? (s.slug === 'pilots-unmade' ? 'Pilot or unmade' : undefined);
      const epNum = isEp ? parseInt(String(d.episode), 10) : undefined;
      const watch = isEp ? watchFor({ series: d.series }) : r?.col === 'series' ? watchFor({ series: r.id }) : r?.col === 'films' && (d.kind === 'tv-series' || d.parent_series) ? watchFor({ show: d.parent_series ?? d.title }) : undefined;
      const themes = isEp ? themesOfTags(d.themes).map((t) => THEME.get(t)?.label).filter(Boolean) as string[] : [];
      b.add(e, { v: { series, type, writer: who(d.writers), director: who(d.directors), theme: themes, se: isEp ? `S${d.season} E${d.episode}` : undefined },
        o: { se: isEp ? `${d.series}-${String(d.season).padStart(2, '0')}-${String(epNum).padStart(3, '0')}${String(d.episode).replace(/^\d+/, '')}` : undefined, aired: iso(d.air_date ?? d.release_date ?? d.years), runtime: d.runtime_min },
        l: { watch: watch ? [watchShort(watch.w) ?? 'Find where to watch', watch.w?.justwatch ?? watch.search.justwatch] : undefined } });
    }
    finish('series', 'Television', 'entries', b, [
      { key: 'series', label: 'Series', filter: true }, { key: 'type', label: 'Type', filter: true, narrow: true }, { key: 'se', label: 'Season and episode', sort: 'text', narrow: true },
      { key: 'aired', label: 'First aired', sort: 'date', narrow: true }, { key: 'writer', label: 'Writer', filter: true }, { key: 'director', label: 'Director', filter: true },
      { key: 'theme', label: 'Theme', filter: true, show: false }, { key: 'watch', label: 'Where to watch', link: true }, off], { actions: WATCH });
  }
  {
    // Movies: kind, year, director, writer, Serling's part, its tie to the show, runtime, where to watch.
    const c = get('movies'); const b = new Builder();
    const KIND: Record<string, string> = { film: 'Feature film', 'tv-film': 'TV film', documentary: 'Documentary', short: 'Short', special: 'Special', 'music-video': 'Music video', unproduced: 'Unmade', pilot: 'Pilot', commercial: 'Commercial' };
    const ROLE: Record<string, string> = { written: 'Wrote it', 'from-his-work': 'From his work', narrated: 'Narrated', appeared: 'Appeared' };
    const TIE: Record<string, string> = { 'twilight-zone-films': 'Twilight Zone film', 'rod-serling-films': "Rod Serling's film", 'tz-makers': 'By Twilight Zone makers', 'linked-films': 'Linked to the show', documentaries: 'Documentary about it', 'unmade-projects': 'Unmade project' };
    for (const s of shelvesOf(c)) for (const e of s.entries) {
      const r = rec(e); const d = r?.data ?? {};
      const w = r?.col === 'films' ? watchFor({ slug: r.id, name: d.title }) : undefined;
      b.add(e, { v: { kind: KIND[d.kind] ?? human(d.kind), director: who(d.directors), writer: who(d.writers), serling: ROLE[d.serling_role], tie: TIE[s.slug] ?? s.title },
        o: { year: yearIn(d.release_date ?? e.meta), runtime: d.runtime_min },
        l: { watch: w ? [watchShort(w.w) ?? 'Find where to watch', w.w?.justwatch ?? w.search.justwatch] : undefined } });
    }
    finish('movies', 'Movies', 'films', b, [
      { key: 'kind', label: 'Kind', filter: true, narrow: true }, { key: 'year', label: 'Year', sort: 'date', narrow: true }, { key: 'director', label: 'Director', filter: true },
      { key: 'writer', label: 'Writer', filter: true }, { key: 'serling', label: "Serling's part", filter: true, narrow: true }, { key: 'tie', label: 'Tie to the show', filter: true },
      { key: 'runtime', label: 'Minutes', sort: 'num', narrow: true }, { key: 'watch', label: 'Where to watch', link: true }, off], { actions: WATCH });
  }
  {
    // Stage: kind (each separate), company or theater, city, year.
    const c = get('stage'); const b = new Builder();
    const SHELF: Record<string, string> = { 'the-play': 'The play', 'episode-stagings': 'Staging of an episode', 'serling-on-stage': "Rod Serling's stage work", 'live-readings': 'Live reading or radio-style show' };
    for (const s of shelvesOf(c)) for (const e of s.entries) {
      const d = rec(e)?.data ?? {};
      const kind = s.slug === 'parodies' ? (/tribute/i.test(`${e.title} ${d.subtype ?? ''} ${d.description ?? ''}`) && !/parod/i.test(`${d.subtype ?? ''}`) ? 'Tribute' : 'Parody') : SHELF[s.slug] ?? s.title;
      b.add(e, { v: { kind, company: d.details?.company ?? d.details?.theater ?? d.publisher ?? d.creator, city: d.details?.city ?? d.details?.location },
        o: { year: yearIn(d.year ?? e.meta) } });
    }
    finish('stage', 'Stage', 'productions', b, [
      { key: 'kind', label: 'Kind', filter: true }, { key: 'company', label: 'Company or theater', filter: true }, { key: 'city', label: 'City', filter: true, narrow: true },
      { key: 'year', label: 'Year', sort: 'date', narrow: true }, off]);
  }
  {
    // Artwork: kind, artist, year, what it was made for.
    const c = get('artwork'); const b = new Builder();
    const SHELF: Record<string, string> = { 'night-gallery-paintings': 'Night Gallery painting', 'title-design': 'Title design', 'other-artwork': 'Other artwork' };
    for (const s of shelvesOf(c)) for (const e of s.entries) {
      const r = rec(e); const d = r?.data ?? {};
      const kind = s.slug === 'covers' ? (e.group === 'Comics' ? 'Comic cover' : 'Magazine cover') : s.slug === 'production-design' ? (/make-?up|prosthetic|mask/i.test(`${e.title} ${d.subtype ?? ''}`) ? 'Make-up' : 'Production design') : s.slug === 'art-illustration' ? (/illustrat/i.test(`${d.subtype ?? ''} ${e.title}`) ? 'Illustration' : 'Art') : SHELF[s.slug] ?? s.title;
      const artist = s.slug === 'covers' ? (e.meta?.match(/cover by ([^·]+)/)?.[1]?.split(/,\s*/) ?? []) : list(d.creator);
      b.add(e, { v: { kind, artist, for: s.slug === 'covers' ? e.title.replace(/^Cover: /, '') : d.details?.for },
        o: { artist: artist[0] ? sortKey(artist[0]) : undefined, year: yearIn(d.year ?? d.cover_date ?? e.meta) } });
    }
    finish('artwork', 'Artwork', 'works of art', b, [
      { key: 'kind', label: 'Kind', filter: true }, { key: 'artist', label: 'Artist', filter: true, sort: 'text' }, { key: 'year', label: 'Year', sort: 'date', narrow: true },
      { key: 'for', label: 'Made for' }, off]);
  }

  // ---------- Listen ----------
  {
    const c = get('music'); const b = new Builder();
    const SUB: Record<string, string> = { 'main-title': 'Main title theme', sample: 'Sample', tribute: 'Song about the show', 'title-reference': 'Song named after it' };
    for (const s of shelvesOf(c)) for (const e of s.entries) {
      const r = rec(e); const d = r?.data ?? {};
      const kind = s.slug === 'theme' ? 'Main title theme' : s.slug === 'soundtracks' ? (/album|lp|cd|soundtrack/i.test(`${e.title} ${d.subtype ?? ''}`) ? 'Soundtrack album' : 'Score') : s.slug === 'covers-samples' ? (d.subtype === 'sample' || /sampl/i.test(`${e.why ?? ''} ${d.description ?? ''}`) ? 'Sample' : 'Cover') : s.slug === 'songs-mention' ? (d.tz_connection === 'lyric-mention' ? 'Lyric mention' : d.tz_connection === 'unclassified' ? 'Not yet checked' : 'Phrase only') : s.slug === 'songs-about' ? SUB[d.subtype] ?? 'Song about the show' : s.slug === 'music-videos' ? 'Music video' : s.title;
      b.add(e, { v: { artist: d.artist ?? d.creator, kind, series: e.group && SERIES[e.group.match(/\((\d{4})\)/)?.[1] ?? ''] ? SERIES[e.group.match(/\((\d{4})\)/)![1]] : e.group, album: d.album },
        o: { artist: d.artist ? sortKey(d.artist) : undefined, year: yearIn(d.year ?? e.meta) } });
    }
    finish('music', 'Music', 'pieces of music', b, [
      { key: 'artist', label: 'Artist', filter: true, sort: 'text' }, { key: 'kind', label: 'Kind', filter: true }, { key: 'series', label: 'Series', filter: true, narrow: true },
      { key: 'album', label: 'Album', narrow: true }, { key: 'year', label: 'Year', sort: 'date', narrow: true }, off], { actions: HEARD });
  }
  {
    const c = get('radio'); const b = new Builder();
    const SERIES_OF: Record<string, string> = { 'radio-dramas': 'The Twilight Zone Radio Dramas', 'original-stories': 'The Twilight Zone Radio Dramas', 'unmade-scripts': 'The Twilight Zone Radio Dramas', 'serling-radio': "Rod Serling's radio work", adaptations: 'Other adaptations', anthologies: 'Fellow anthologies', 'fan-audio': 'Fan and independent audio' };
    const ROLE: Record<string, string> = { wrote: 'Serling wrote it', acted: 'Serling acted', hosted: 'Serling hosted', unproduced: 'Serling wrote it, never produced' };
    for (const s of shelvesOf(c)) for (const e of s.entries) {
      const d = rec(e)?.data ?? {};
      const kind = s.slug === 'original-stories' ? 'Original radio story' : s.slug === 'unmade-scripts' ? 'Unmade script' : s.slug === 'fan-audio' ? 'Fan-made' : s.slug === 'anthologies' ? 'Fellow anthology' : d.serling_role ? ROLE[d.serling_role] : d.adapts_episode ? 'Adaptation of an episode' : d.subtype === 'audio-series' || /series/.test(e.key) ? 'Series' : 'Adaptation';
      const num = d.season != null ? `S${d.season} E${d.season_order ?? ''}`.trim() : d.volume != null ? `Vol. ${d.volume} no. ${d.volume_order ?? ''}`.trim() : undefined;
      b.add(e, { v: { series: SERIES_OF[s.slug] ?? s.title, num, star: d.voiced_by?.slice(0, 2), writer: [d.original_writer, d.adapted_by].filter(Boolean), kind },
        o: { num: d.season != null ? `${String(d.season).padStart(2, '0')}-${String(d.season_order ?? 0).padStart(3, '0')}` : d.volume != null ? `v${String(d.volume).padStart(3, '0')}-${String(d.volume_order ?? 0).padStart(3, '0')}` : undefined, date: iso(d.broadcast_date ?? d.volume_released ?? e.meta) },
        l: { adapts: d.adapts_episode ? ['The episode', `/episodes/${d.adapts_episode}/`] : undefined } });
    }
    finish('radio', 'Radio', 'radio entries', b, [
      { key: 'series', label: 'Series', filter: true }, { key: 'num', label: 'Number', sort: 'text', narrow: true }, { key: 'star', label: 'Star', filter: true },
      { key: 'adapts', label: 'Adapts', link: true, narrow: true }, { key: 'writer', label: 'Writer or adapter', filter: true }, { key: 'date', label: 'Released or broadcast', sort: 'date', narrow: true },
      { key: 'kind', label: 'Kind', filter: true }, off], { actions: HEARD });
  }
  {
    const c = get('podcasts'); const b = new Builder();
    const KIND: Record<string, string> = { podcast: 'Podcast', segment: 'Recurring segment', 'single-episode': 'Single episode', fiction: 'Fiction' };
    const COVERS: Record<string, string> = { '1959': 'The original series', '1985': 'The 1985 series', '2002': 'The 2002 series', '2019': 'The 2019 series', 'films/twilight-zone-the-movie': 'The 1983 movie', 'films/night-gallery': 'Night Gallery' };
    const SUBJ: Record<string, string> = { show: 'The original series', serling: 'Rod Serling', 'film-1983': 'The 1983 movie', 'night-gallery': 'Night Gallery', 'revival-2019': 'The 2019 series' };
    for (const s of shelvesOf(c)) for (const e of s.entries) {
      const d = rec(e)?.data ?? {};
      const covers = [...list(d.covers).map((x) => COVERS[x] ?? human(x.split('/').pop())), ...(d.subject ? [SUBJ[d.subject]] : [])];
      const latest = d.sources?.map((x: any) => x.note?.match(/to (\d{4}-\d\d-\d\d)/)?.[1]).find(Boolean);
      b.add(e, { v: { kind: KIND[d.kind ?? 'podcast'], covers, hosts: d.hosts, network: d.network, status: d.status === 'active' ? 'Active' : d.status === 'ended' ? 'Ended' : undefined },
        o: { started: iso(d.first_episode), eps: d.episode_count, latest },
        l: { feed: d.links?.rss ? ['Feed', d.links.rss] : undefined } });
    }
    finish('podcasts', 'Podcasts', 'podcasts', b, [
      { key: 'kind', label: 'Kind', filter: true, narrow: true }, { key: 'covers', label: 'Covers', filter: true }, { key: 'hosts', label: 'Hosts', filter: true },
      { key: 'network', label: 'Network', filter: true, narrow: true }, { key: 'started', label: 'Started', sort: 'date', narrow: true }, { key: 'eps', label: 'Episodes', sort: 'num', narrow: true, first: 'desc' },
      { key: 'latest', label: 'Latest episode', sort: 'date', narrow: true, first: 'desc' }, { key: 'status', label: 'Status', filter: true, narrow: true }, { key: 'feed', label: 'Feed', link: true, narrow: true }], { actions: HEARD });
  }
  {
    const c = get('lectures'); const b = new Builder();
    for (const s of shelvesOf(c)) for (const e of s.entries) {
      const r = rec(e); const d = r?.data ?? {};
      const kind = s.slug === 'academic' ? 'Talk about the show' : s.slug === 'classroom' ? (e.group === 'University and adult courses' ? 'University course' : 'School lesson') : e.group === 'Teaching' ? "Serling's teaching" : /speech|address|commencement/i.test(`${e.title} ${d.subtype ?? ''}`) ? 'Serling speech' : 'Serling lecture';
      const speaker = r?.col === 'essays' ? d.authors : list(d.creator);
      b.add(e, { v: { kind, speaker, where: d.details?.venue ?? d.details?.institution ?? d.publisher ?? d.published_in },
        o: { date: iso(d.details?.date ?? d.year ?? d.published ?? e.meta) } });
    }
    finish('lectures', 'Lectures', 'lectures and lessons', b, [
      { key: 'kind', label: 'Kind', filter: true }, { key: 'speaker', label: 'Speaker', filter: true }, { key: 'where', label: 'Where', filter: true }, { key: 'date', label: 'Date', sort: 'date', narrow: true }], { actions: HEARD });
  }

  // ---------- Read: one table per format ----------
  const reading = get('reading');
  const topics = (b: Builder) => { for (const s of reading.subs.filter((x) => READ_COLLECTIONS.includes(x.slug))) for (const e of s.entries) if (b.rows.has(e.key)) b.add(e, { v: { coll: s.title } }); };
  const readRows = (slug: string, fill: (e: Entry, d: any, col?: string) => Fill) => { const b = new Builder(); for (const e of reading.subs.find((s) => s.slug === slug)?.entries ?? []) { const r = rec(e); b.add(e, fill(e, r?.data ?? {}, r?.col)); } topics(b); return b; };
  const topic: Col = { key: 'coll', label: 'Topic', filter: true, show: false };
  const by = (n?: unknown) => { const a = list(n)[0]; return a ? sortKey(a.split(/\s+/).pop() + ' ' + a) : undefined; };
  {
    const KIND: Record<string, string> = { interview: 'Interview', review: 'Review', article: 'Article', essay: 'Article' };
    const b = readRows('articles', (e, d) => ({ v: { author: d.authors, pub: d.published_in, kind: KIND[d.kind] ?? (d.review_type ? 'Review' : 'Article') }, o: { author: by(d.authors), pub: d.published_in ? sortKey(d.published_in) : undefined, date: iso(d.published ?? e.meta) } }));
    finish('reading/articles', READ_LABEL.articles, 'articles', b, [
      { key: 'author', label: 'Author', filter: true, sort: 'text' }, { key: 'pub', label: 'Publication', filter: true, sort: 'text' }, { key: 'date', label: 'Date', sort: 'date', narrow: true },
      { key: 'kind', label: 'Kind', filter: true, narrow: true }, topic], { actions: READ });
  }
  {
    const b = readRows('books', (e, d) => ({ v: { author: d.authors ?? d.creator, publisher: d.publisher, kind: human(d.kind) }, o: { author: by(d.authors ?? d.creator), year: yearIn(d.published ?? d.year ?? e.meta), pages: d.pages } }));
    finish('reading/books', READ_LABEL.books, 'books', b, [
      { key: 'author', label: 'Author', filter: true, sort: 'text' }, { key: 'publisher', label: 'Publisher', filter: true }, { key: 'year', label: 'Year', sort: 'date', narrow: true },
      { key: 'kind', label: 'Kind', filter: true, narrow: true }, { key: 'pages', label: 'Pages', sort: 'num', narrow: true }, topic, off], { actions: READ });
  }
  {
    const b = readRows('comics', (e, d) => ({ v: { issue: d.order != null ? `No. ${d.order}` : undefined, series: d.series_name ?? d.publisher, creators: list(d.creators).map((x) => x.replace(/\s*\(.*\)$/, '')), adapts: list(d.episodes).map((x) => SERIES[x.split('/')[0]] ? x.split('/')[1]?.replace(/-/g, ' ') : undefined).filter(Boolean) as string[] }, o: { issue: d.order != null ? `${sortKey(d.series_name ?? '')}-${String(d.order).padStart(4, '0')}` : undefined, date: iso(d.cover_date) } }));
    finish('reading/comics', READ_LABEL.comics, 'comics', b, [
      { key: 'series', label: 'Series', filter: true }, { key: 'issue', label: 'Issue order', sort: 'text', show: true, narrow: true }, { key: 'date', label: 'Cover date', sort: 'date', narrow: true },
      { key: 'creators', label: 'Creators', filter: true }, { key: 'adapts', label: 'Adapts', filter: true, show: false }, topic, off], { actions: READ });
  }
  {
    const KIND: Record<string, string> = { essay: 'Essay', 'journal-article': 'Journal article', 'book-chapter': 'Book chapter', speech: 'Speech', review: 'Review', 'academic-thesis': 'Thesis', lecture: 'Lecture', interview: 'Interview', article: 'Article', script: 'Script' };
    const b = readRows('essays', (e, d) => ({ v: { author: d.authors, pub: d.published_in, kind: KIND[d.kind] }, o: { author: by(d.authors), year: yearIn(d.published ?? e.meta) } }));
    finish('reading/essays', READ_LABEL.essays, 'essays', b, [
      { key: 'author', label: 'Author', filter: true, sort: 'text' }, { key: 'pub', label: 'Published in', filter: true }, { key: 'year', label: 'Year', sort: 'date', narrow: true },
      { key: 'kind', label: 'Kind', filter: true, narrow: true }, topic], { actions: READ });
  }
  {
    const b = readRows('magazines', (e, d) => ({ v: { issue: d.order != null ? `No. ${d.order}` : undefined, mag: d.magazine ?? e.group, editor: d.editor, artist: d.cover_artist }, o: { issue: d.order != null ? `${sortKey(d.magazine ?? '')}-${String(d.order).padStart(4, '0')}` : undefined, date: iso(d.cover_date) } }));
    finish('reading/magazines', READ_LABEL.magazines, 'magazine issues', b, [
      { key: 'mag', label: 'Magazine', filter: true }, { key: 'issue', label: 'Issue order', sort: 'text', narrow: true }, { key: 'date', label: 'Cover date', sort: 'date', narrow: true },
      { key: 'editor', label: 'Editor', filter: true, narrow: true }, { key: 'artist', label: 'Cover artist', filter: true, narrow: true }, topic, off], { actions: READ });
  }
  {
    const b = readRows('scripts', (e, d) => ({ v: { writer: d.authors ?? d.creator, kind: /unproduced|unmade|never/i.test(`${d.kind ?? ''} ${e.desc ?? ''}`) ? 'Unproduced script' : /radio/i.test(`${d.kind ?? ''}`) ? 'Radio script' : /screenplay/i.test(`${d.kind ?? ''} ${e.title}`) ? 'Screenplay' : 'Teleplay or published script' }, o: { writer: by(d.authors ?? d.creator), year: yearIn(d.published ?? e.meta) } }));
    finish('reading/scripts', READ_LABEL.scripts, 'scripts', b, [
      { key: 'writer', label: 'Writer', filter: true, sort: 'text' }, { key: 'kind', label: 'Kind', filter: true }, { key: 'year', label: 'Year', sort: 'date', narrow: true }, topic], { actions: READ });
  }
  {
    const b = readRows('short-stories', (e, d) => ({ v: { author: d.authors ?? d.creator, first: d.first_published_in, became: e.group, kind: /radio/i.test(`${d.kind ?? ''} ${e.desc ?? ''}`) ? 'Radio play' : /anthology/i.test(`${d.kind ?? ''}`) ? 'Anthology' : e.group === "Rod Serling's short stories" ? "Serling's own story" : 'Short story' }, o: { author: by(d.authors ?? d.creator), year: yearIn(d.first_published ?? d.published ?? e.meta) } }));
    finish('reading/short-stories', READ_LABEL['short-stories'], 'stories', b, [
      { key: 'author', label: 'Author', filter: true, sort: 'text' }, { key: 'first', label: 'First published in', filter: true }, { key: 'year', label: 'Year', sort: 'date', narrow: true },
      { key: 'became', label: 'Became an episode of', filter: true }, { key: 'kind', label: 'Kind', filter: true, narrow: true }, topic], { actions: READ });
  }

  // ---------- Play, Collect, Legacy: one table each ----------
  {
    const b = new Builder();
    const SHELF: Record<string, string> = { 'board-games': 'Board game', 'card-games': 'Card game', 'mini-golf': 'Mini golf', 'trivia-games': 'Trivia game', 'game-homages': 'Nod in another game', 'other-games': 'Other', 'video-games': 'Video game' };
    for (const s of shelvesOf(get('games'))) for (const e of s.entries) {
      const d = rec(e)?.data ?? {};
      const cat = s.slug === 'pinball-arcade' ? (e.group === 'Slot machines' ? 'Slot machine' : 'Pinball') : s.slug === 'game-homages' && e.group === 'Fan-made games' ? 'Fan-made game' : SHELF[s.slug] ?? s.title;
      const status = /unreleased|unmade|never|cancel/i.test(`${e.group ?? ''}`) ? 'Unreleased or unmade' : /proposed/i.test(`${e.group ?? ''}`) ? 'Proposed, never made' : /rumou?red/i.test(`${e.title} ${e.group ?? ''}`) ? 'Rumored' : 'Released';
      b.add(e, { v: { cat, platform: d.details?.platform ?? d.details?.platforms, maker: d.publisher ?? d.creator, status }, o: { year: yearIn(d.year ?? e.meta) } });
    }
    for (const e of get('homages').subs.find((s) => s.slug === 'fan-made')?.entries.filter((x) => x.group === 'Fan games') ?? []) { const d = rec(e)?.data ?? {}; b.add(e, { v: { cat: 'Fan-made game', maker: d.creator, status: 'Released' }, o: { year: yearIn(d.year ?? e.meta) } }); }
    for (const [k, t, h, r] of SITE_GAMES) b.add({ key: `site/${k}`, title: t, href: h, sort: sortKey(t), why: r, official: false }, { v: { cat: 'On this site', maker: 'IntoTheTwilightZone.com', platform: 'Web browser', status: 'Released' }, l: { play: ['Play now', h] } });
    finish('play', 'Play', 'games', b, [
      { key: 'cat', label: 'Category', filter: true }, { key: 'platform', label: 'Platform', filter: true, narrow: true }, { key: 'maker', label: 'Maker', filter: true },
      { key: 'year', label: 'Year', sort: 'date', narrow: true }, { key: 'status', label: 'Status', filter: true, narrow: true }, off, { key: 'play', label: 'Play', link: true, narrow: true }], { chips: 'cat', first: 'Game' });
  }
  {
    const b = new Builder();
    const medium = new Map((await getCollection('works')).filter((r: any) => r.data.details?.medium).map((r: any) => [`works/${r.id}`, String(r.data.details.medium)]));
    const SHELF: Record<string, string> = { 'home-media': 'Home video', 'trading-cards': 'Trading cards', 'masks-and-costumes': 'Masks', replicas: 'Prop replicas', 'other-merchandise': 'Other', books: 'Books', comics: 'Comics', magazines: 'Magazines', scripts: 'Scripts', soundtracks: 'Soundtrack albums', 'pinball-arcade': 'Pinball', 'video-games': 'Video games', 'board-games': 'Board games', 'card-games': 'Card games', 'trivia-games': 'Trivia games' };
    for (const [slug, keep] of COLLECT_FROM) for (const s of shelvesOf(get(slug), keep)) for (const e of s.entries) {
      const d = rec(e)?.data ?? {};
      const text = `${e.title} ${d.subtype ?? ''} ${e.meta ?? ''}`;
      // A shelf that joined two things is split per item, from what the item says it is.
      const cat = s.slug === 'props-costumes' ? (/costume|dress|suit|uniform|mask/i.test(text) ? 'Costumes' : 'Props')
        : s.slug === 'posters-prints' ? (e.group === 'Art prints' ? 'Prints' : 'Posters')
        : s.slug === 'toys-figures' ? (/figure|bobble|funko|pop!|statue|bust/i.test(text) ? 'Figures' : 'Toys')
        : s.slug === 'household-apparel' ? (e.group === 'Clothing' ? 'Clothing' : e.group === 'Mugs and drinkware' ? 'Drinkware' : /ornament/i.test(text) ? 'Ornaments' : /decal|sticker/i.test(text) ? 'Decals' : /pin\b|pins\b|badge/i.test(text) ? 'Pins' : 'Household')
        : s.slug === 'collectibles' ? (e.group === 'Tower of Terror souvenirs' ? 'Souvenirs' : e.group === 'Sheet music' ? 'Sheet music' : 'Collectibles')
        : SHELF[s.slug] ?? s.title;
      const edition = EDITION_RE.filter(([re]) => re.test(text)).map(([, l]) => l);
      b.add(e, { v: { cat, fmt: physicalOrDigital(e, s.slug, medium.get(e.key)), edition, maker: d.publisher ?? d.creator ?? e.meta?.split(' · ').find((x) => /\b(inc|ltd|llc|toys|entertainment|video|records|press|books|comics|publishing|games)\b/i.test(x)), series: e.group && /\(\d{4}\)/.test(e.group) ? e.group : undefined }, o: { year: yearIn(d.year ?? d.published ?? d.cover_date ?? e.meta) } });
    }
    finish('collect', 'Collect', 'things to collect', b, [
      { key: 'cat', label: 'Category', filter: true }, { key: 'fmt', label: 'Physical, digital or both', filter: true, narrow: true }, { key: 'edition', label: 'Edition', filter: true, narrow: true },
      { key: 'maker', label: 'Maker', filter: true }, { key: 'year', label: 'Year', sort: 'date', narrow: true }, { key: 'series', label: 'Series', filter: true, narrow: true }, off],
      { chips: 'cat', actions: [['owned', 'I have it'], ['wanted', 'I want it']], first: 'Item' });
  }
  {
    // Legacy: one row per later work, with every kind of link it has (each kind separate), the category it belongs
    // to, the episode it draws on, its maker and year, and the evidence. A work is here only when it has a kind of
    // link; games are in Play and merchandise in Collect.
    const b = new Builder();
    const catOf = new Map<string, string[]>();
    for (const slug of LEGACY_FROM) { const c = cats.get(slug); if (!c) continue; for (const s of c.subs) for (const e of s.entries) { const l = catOf.get(e.key) ?? []; const n = slug === 'reading' ? LEGACY_CAT_OF[e.key.split('/')[0]] ?? 'Books' : c.title; if (!l.includes(n)) l.push(n); catOf.set(e.key, l); } }
    const FAN: Record<string, string> = { 'Fan films': 'Fan films', 'Fan audio dramas': 'Fan audio dramas' };
    const epTitle = (ref: string) => (R.get(/^\d{4}\//.test(ref) ? `episodes/${ref}` : ref) ?? R.get(`series/${ref}`))?.data?.title;
    const add = (e: Entry, key: string, kind: string | undefined, extra: { to?: string; ev?: string; d?: any; cat?: string[] } = {}) => {
      if (!kind) return;
      const d = extra.d ?? rec(e)?.data ?? {};
      const maker = list(d.directors)[0] ?? d.artist ?? d.creator ?? list(d.authors)[0] ?? list(d.hosts)[0];
      b.add({ ...e, key }, { v: { kind, cat: extra.cat ?? catOf.get(key) ?? catOf.get(e.key) ?? [LEGACY_CAT_OF[key.split('/')[0]] ?? 'Other'], to: extra.to, ev: extra.ev, maker },
        o: { year: yearIn(d.release_date ?? d.year ?? d.published ?? d.first_episode ?? e.meta), to: extra.to ? sortKey(extra.to) : undefined, ev: extra.ev ? EVIDENCE_RANK[extra.ev] : undefined } });
    };
    for (const s of shelvesOf(get('homages'))) for (const e of s.entries) {
      if (s.slug === 'websites') continue; // websites are Sources now (plan section 4)
      if (s.slug === 'fan-made' && e.group === 'Fan games') continue; // in Play only
      const cr = rec(e);
      if (cr?.col === 'connections') {
        const cd = cr.data; const from = R.get(cd.from);
        add({ ...e, title: from?.data?.title ?? from?.data?.name ?? e.title, sort: sortKey(from?.data?.title ?? e.title) }, cd.from, LINK_KIND[cd.kind], { to: epTitle(cd.to), ev: EVIDENCE[cd.confidence], d: from?.data, cat: catOf.get(cd.from) ?? (s.slug === 'in-other-shows' ? ['Television'] : undefined) });
        continue;
      }
      const ev = EVIDENCE_RANK[e.group ?? ''] ? e.group : e.facets?.confidence?.[0];
      const kind = s.slug === 'fan-made' ? (/supercut/i.test(e.title) ? 'Supercuts' : FAN[e.group ?? ''] ?? (e.group === 'Fan edits and supercuts' ? 'Fan edits' : 'Fan films'))
        : s.slug === 'adaptations-remakes' ? (/remake/i.test(`${e.title} ${e.desc ?? ''}`) ? 'Remakes' : 'Adaptations')
        : ({ homages: 'Homages', parodies: 'Parodies', references: 'References', 'inspired-by': 'Inspired by', compared: 'Compared to', 'in-everyday-language': 'In everyday language', 'in-other-shows': 'References' } as Record<string, string>)[s.slug];
      add(e, e.key, kind, { ev });
    }
    // Unofficial works in the other categories, by what their shelf says they are. A shelf that says nothing about a
    // link (unofficial films with no connection record, for example) adds nothing here: those works stay in their
    // own category's table.
    const SHELF_KIND: Record<string, Record<string, string>> = {
      series: { anthologies: 'Fellow anthologies' },
      radio: { 'fan-audio': 'Fan audio dramas', anthologies: 'Fellow anthologies', adaptations: 'Adaptations' },
      podcasts: { shows: 'About the show', 'single-episodes': 'About the show', fiction: 'Fan fiction' },
      lectures: { academic: 'About the show', classroom: 'About the show' },
      movies: { documentaries: 'About the show' },
      stage: { 'episode-stagings': 'Adaptations', 'live-readings': 'Adaptations', 'the-play': 'Adaptations' },
      artwork: { 'art-illustration': 'Inspired by' },
      music: { 'music-videos': 'References' },
    };
    for (const slug of LEGACY_FROM) {
      if (slug === 'games' || slug === 'merchandise') continue;
      const c = cats.get(slug); if (!c) continue;
      const un = new Set(unofficialOf(c).map((e) => e.key));
      for (const s of c.subs.filter((x) => !READ_COLLECTIONS.includes(x.slug))) for (const e of s.entries) if (un.has(e.key) && e.official === false) {
        if (b.rows.get(e.key)?.v.kind?.length) continue; // its connection already says how it links
        const d = rec(e)?.data ?? {};
        let kind = SHELF_KIND[slug]?.[s.slug];
        if (slug === 'reading' && !['short-stories', 'scripts'].includes(s.slug)) kind = 'About the show';
        if (slug === 'stage' && s.slug === 'parodies') kind = /tribute/i.test(`${e.title} ${d.subtype ?? ''}`) ? 'Tributes' : 'Parodies';
        if (slug === 'music') kind = s.slug === 'covers-samples' ? (d.subtype === 'sample' || /sampl/i.test(`${e.why ?? ''} ${d.description ?? ''}`) ? 'Samples' : 'Covers')
          : s.slug === 'songs-about' ? (d.subtype === 'title-reference' ? 'Named after' : 'Tributes')
          : s.slug === 'songs-mention' ? (d.tz_connection === 'lyric-mention' ? 'Lyric mentions' : d.tz_connection === 'unclassified' ? 'Lyric mentions' : 'In everyday language') : kind;
        add(e, e.key, kind, { ev: slug === 'music' && d.tz_connection === 'unclassified' ? 'Not yet checked' : undefined });
      }
    }
    finish('legacy', 'Legacy', 'works it inspired', b, [
      { key: 'kind', label: 'Kind of link', filter: true }, { key: 'cat', label: 'Category', filter: true, narrow: true }, { key: 'to', label: 'Draws on', filter: true, sort: 'text' },
      { key: 'maker', label: 'Maker', filter: true, narrow: true }, { key: 'year', label: 'Year', sort: 'date', narrow: true },
      { key: 'ev', label: 'Evidence', filter: true, sort: 'num', narrow: true, first: 'desc' }, off], { chips: 'cat', first: 'Work' });
  }

  // ---------- Sources (Discover, last) ----------
  {
    // One row per site cited anywhere on the site, with how many records cite it, its feed where one is recorded,
    // and its page here where it has one. Kinds and feeds for the rest are the plan's Sources step.
    const SELF = 'intothetwilightzone.com';
    const cited = new Map<string, Set<string>>();
    const hostOf = (u: string) => { try { return new URL(u).hostname.replace(/^(www|m)\./, '').toLowerCase(); } catch { return undefined; } };
    const walk = (x: unknown, key: string): void => {
      if (Array.isArray(x)) { for (const y of x) walk(y, key); return; }
      if (!x || typeof x !== 'object') return;
      for (const v of Object.values(x as Record<string, unknown>)) {
        if (typeof v === 'string' && /^https?:\/\//.test(v)) { const h = hostOf(v); if (h && h !== SELF) { const set = cited.get(h) ?? new Set(); set.add(key); cited.set(h, set); } }
        else walk(v, key);
      }
    };
    for (const [k, r] of R) walk(r.data, k);
    const known = new Map<string, { t: string; h: string; kind: string; feed?: string }>();
    for (const r of R.values()) if (r.col === 'podcasts') { const h = r.data.links?.website && hostOf(r.data.links.website); if (h) known.set(h, { t: r.data.title, h: `/podcasts/${r.id}/`, kind: 'Podcast', feed: r.data.links?.rss }); }
    for (const e of get('homages').subs.find((x) => x.slug === 'websites')?.entries ?? []) {
      const w = rec(e)?.data; const u = w?.links?.website ?? w?.links?.url ?? w?.sources?.find((x: any) => x.url)?.url;
      const h = u && hostOf(u); if (h && !known.has(h)) known.set(h, { t: e.title, h: e.href ?? '', kind: (e.group ?? 'Website').replace(/s$/, '') });
    }
    for (const r of R.values()) if (r.col === 'organizations') { const h = r.data.website && hostOf(r.data.website); if (h && !known.has(h)) known.set(h, { t: r.data.name, h: `/organizations/${r.id}/`, kind: 'Organization' }); }
    const b = new Builder();
    for (const [host, keys] of cited) {
      const k = known.get(host);
      const t = k?.t ?? host;
      b.add({ key: `site/${host}`, title: t, href: `https://${host}/`, external: true, sort: sortKey(t), meta: k ? host : undefined },
        { v: { kind: k?.kind ?? 'Not yet classified', hasfeed: k?.feed ? 'Has a feed' : 'No feed recorded yet' }, o: { n: keys.size }, l: { feed: k?.feed ? ['Feed', k.feed] : undefined, page: k?.h ? ['On this site', k.h] : undefined } });
    }
    finish('sources/feeds', 'Sources', 'sources', b, [
      { key: 'kind', label: 'Kind', filter: true }, { key: 'feed', label: 'Feed', link: true, narrow: true }, { key: 'hasfeed', label: 'Feed', filter: true, show: false },
      { key: 'page', label: 'Page here', link: true, narrow: true }, { key: 'n', label: 'Cited by', sort: 'num', narrow: true, first: 'desc' }], { first: 'Source' });
  }
  cache = out;
  return out;
}
