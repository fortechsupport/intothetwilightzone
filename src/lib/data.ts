import { getCollection, type CollectionEntry } from 'astro:content';
import { slugify } from './slug';
import { filmHref } from './television';
import { normShow } from './tv-shows.mjs';

export type Episode = CollectionEntry<'episodes'>;
export type Film = CollectionEntry<'films'>;

export const SERIES_ORDER = ['1959', '1985', '2002', '2019'] as const;

export const CONNECTION_LABELS: Record<string, string> = {
  'official-adaptation': 'Official adaptation',
  remake: 'Remake',
  'inspired-by': 'Inspired by',
  // A resemblance that critics or fans point out, with no maker or source saying the episode inspired it (decision 0006).
  compared: 'Compared to',
  homage: 'Homage',
  parody: 'Parody',
  reference: 'Reference',
  'lyric-mention': 'Lyric mention',
};

/** The medium a connected work belongs to, for grouping legacy lists: from resolveRef's `kind`. */
export function mediumOf(kind: string): string {
  const k = kind.toLowerCase();
  if (/tv episode|tv segment|tv series|sketch|web series|special|series$/.test(k)) return 'Television';
  if (/film|documentary|pilot|unproduced|commercial/.test(k)) return 'Film';
  if (/song|music|soundtrack/.test(k)) return 'Music';
  if (/game/.test(k)) return 'Games';
  if (/collectible|prop/.test(k)) return 'Collectibles';
  if (/artwork/.test(k)) return 'Art';
  if (/stage|attraction|event|convention|lecture/.test(k)) return 'Stage and events';
  if (/radio/.test(k)) return 'Radio';
  if (/book|comic|magazine|essay/.test(k)) return 'Print';
  return 'Other';
}
export const MEDIUM_ORDER = ['Television', 'Film', 'Radio', 'Music', 'Print', 'Games', 'Stage and events', 'Art', 'Collectibles', 'Other'];

/** The same kinds as a phrase that leads into the title it points to: "Parody of “Eye of the Beholder”". */
export const CONNECTION_VERBS: Record<string, string> = {
  'official-adaptation': 'Adapts',
  remake: 'Remake of',
  'inspired-by': 'Inspired by',
  compared: 'Compared to',
  homage: 'Homage to',
  parody: 'Parody of',
  reference: 'Refers to',
  'lyric-mention': 'Names',
};

export const CONFIDENCE_LABELS: Record<string, string> = {
  // Adam's three marks for how sure we are (2026-11-21, docs/decisions/0002-television-structure.md).
  'confirmed-by-creator': 'Confirmed by its makers',
  documented: 'Documented',
  'fan-noted': 'Noted by fans',
};

export function episodeNumber(e: Episode['data']): string {
  return `S${e.season}E${String(e.episode).padStart(2, '0')}`;
}

function compareEpisodeNumbers(a: string, b: string) {
  const na = parseInt(a, 10), nb = parseInt(b, 10);
  return na !== nb ? na - nb : a.localeCompare(b);
}

let episodesCache: Episode[] | undefined;
export async function allEpisodes(): Promise<Episode[]> {
  if (!episodesCache) {
    const eps = await getCollection('episodes');
    eps.sort((a, b) =>
      a.data.series.localeCompare(b.data.series) ||
      a.data.season - b.data.season ||
      compareEpisodeNumbers(a.data.episode, b.data.episode));
    episodesCache = eps;
  }
  return episodesCache;
}

export function formatDate(iso?: string): string | undefined {
  if (!iso) return undefined;
  const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
  const ym = /^(\d{4})-(\d{2})$/.exec(iso);
  if (ym) return `${months[Number(ym[2]) - 1]} ${ym[1]}`;
  const m = /^(\d{4})-(\d{2})-(\d{2})$/.exec(iso);
  if (!m) return iso;
  return `${months[Number(m[2]) - 1]} ${Number(m[3])}, ${m[1]}`;
}

/** Resolve a "collection/id" reference to a title and URL. */
export async function resolveRef(ref: string): Promise<{ title: string; url: string; kind: string } | undefined> {
  const [collection, ...rest] = ref.split('/');
  const id = rest.join('/');
  if (collection === 'films') {
    const f = (await getCollection('films')).find((x) => x.id === id);
    const kinds: Record<string, string> = { film: 'Film', 'tv-film': 'TV film', 'tv-episode': 'TV episode', 'tv-segment': 'TV segment', 'tv-series': 'TV series', sketch: 'Sketch', documentary: 'Documentary', special: 'Special', pilot: 'Pilot', stage: 'Stage', unproduced: 'Unproduced', short: 'Short film', 'music-video': 'Music video', commercial: 'Commercial', 'web-series': 'Web series' };
    if (!f) return undefined;
    const show = f.data.parent_series ? normShow(f.data.parent_series) : '';
    const title = !show || f.data.title.startsWith(show) ? f.data.title : `${show}: ${f.data.title}`;
    return { title, url: filmHref(f.id), kind: kinds[f.data.kind] ?? 'Film' };
  }
  if (collection === 'songs') {
    const s = (await getCollection('songs')).find((x) => x.id === id);
    return s && { title: `${s.data.title}${s.data.artist ? ` (${s.data.artist})` : ''}`, url: `/songs/${s.id}/`, kind: 'Song' };
  }
  if (collection === 'works') {
    const w = (await getCollection('works')).find((x) => x.id === id);
    return w && { title: w.data.title, url: `/works/${w.id}/`, kind: w.data.kind.replace(/-/g, ' ') };
  }
  if (collection === 'series') {
    const s = (await getCollection('series')).find((x) => x.id === id);
    return s && { title: `${s.data.title} (${s.data.years})`, url: `/series/${s.id}/`, kind: 'Series' };
  }
  if (collection === 'radio') {
    const r = (await getCollection('radio')).find((x) => x.id === id);
    return r && { title: r.data.title, url: `/radio/${r.id}/`, kind: 'Radio' };
  }
  const ep = (await allEpisodes()).find((x) => x.id === ref);
  if (ep) return { title: ep.data.title, url: `/episodes/${ep.id}/`, kind: `${ep.data.series} series` };
  return undefined;
}

export interface Credit {
  role: string;
  title: string;
  url: string;
  date?: string;
  detail?: string;
}

export interface Person {
  slug: string;
  name: string;
  credits: Credit[];
  record?: CollectionEntry<'people'>;
}

let peopleCache: Map<string, Person> | undefined;
export async function allPeople(): Promise<Map<string, Person>> {
  if (peopleCache) return peopleCache;
  const map = new Map<string, Person>();
  const add = (name: string | undefined, credit: Credit) => {
    if (!name) return;
    const clean = name.trim();
    if (!clean || /^(various|unknown)/i.test(clean)) return;
    const slug = slugify(clean);
    if (!map.has(slug)) map.set(slug, { slug, name: clean, credits: [] });
    map.get(slug)!.credits.push(credit);
  };
  for (const e of await allEpisodes()) {
    const base = { title: e.data.title, url: `/episodes/${e.id}/`, date: e.data.air_date, detail: `${e.data.series} series, ${episodeNumber(e.data)}` };
    e.data.writers.forEach((n) => add(n, { ...base, role: 'Writer' }));
    e.data.source_authors.filter((n) => !e.data.writers.includes(n)).forEach((n) => add(n, { ...base, role: 'Source story' }));
    e.data.directors.forEach((n) => add(n, { ...base, role: 'Director' }));
    e.data.cast.forEach((n) => add(n, { ...base, role: 'Cast' }));
    add(e.data.narrator, { ...base, role: 'Narrator' });
  }
  for (const f of await getCollection('films')) {
    const base = { title: f.data.title, url: filmHref(f.id), date: f.data.release_date, detail: f.data.parent_series ?? (f.data.kind === 'film' ? 'Film' : f.data.kind.replace(/-/g, ' ').replace(/^./, (c) => c.toUpperCase())) };
    f.data.writers.forEach((n) => add(n, { ...base, role: 'Writer' }));
    f.data.directors.forEach((n) => add(n, { ...base, role: 'Director' }));
    f.data.cast.forEach((n) => add(n, { ...base, role: 'Cast' }));
    f.data.created_by.forEach((n) => add(n, { ...base, role: 'Series creator' }));
    f.data.presented_by.forEach((n) => add(n, { ...base, role: 'Host' }));
    f.data.source_authors.filter((n) => !f.data.writers.includes(n)).forEach((n) => add(n, { ...base, role: 'Source story' }));
    f.data.composer.forEach((n) => add(n, { ...base, role: 'Composer' }));
    for (const sg of f.data.segments) {
      const sb = { ...base, detail: `Segment: ${sg.title}` };
      sg.writers.forEach((n) => add(n, { ...sb, role: 'Writer' }));
      sg.directors.forEach((n) => add(n, { ...sb, role: 'Director' }));
      sg.cast.forEach((n) => add(n, { ...sb, role: 'Cast' }));
      sg.source_authors.forEach((n) => add(n, { ...sb, role: 'Source story' }));
    }
  }
  for (const r of await getCollection('radio')) {
    // A record about a whole series or its releases names its people on the series page, not as credits.
    const drama = r.data.series_title === 'The Twilight Zone Radio Dramas';
    if (drama && r.data.subtype) continue;
    const st = r.data.series_title;
    const base = { title: r.data.title, url: `/radio/${r.id}/`, detail: drama ? 'Radio drama' : st && !r.data.title.startsWith(st.replace(/\s*\(.*$/, '')) ? st : 'Radio' };
    (r.data.adapted_by ?? '').split(/,\s*/).forEach((n) => add(n, { ...base, role: 'Radio adaptation' }));
    // The writer of what the radio version adapts: the teleplay for a radio drama, the script for Serling's own work.
    for (const raw of (r.data.original_writer ?? '').split(/,\s*|\s+and\s+/)) {
      const n = splitCredit(raw).name;
      if (n && !/^(others?|other\b)/i.test(n)) add(n, { ...base, role: drama || r.data.serling_role === undefined ? 'Original writer' : r.data.serling_role === 'unproduced' ? 'Radio writer (never produced)' : 'Radio writer' });
    }
    r.data.voiced_by.forEach((n) => add(n, { ...base, role: r.data.serling_role === 'hosted' ? 'Radio host' : 'Radio cast' }));
  }
  for (const c of await getCollection('comics')) {
    const base = { title: c.data.title, url: `/comics/${c.id}/`, date: c.data.cover_date, detail: c.data.publisher };
    for (const raw of c.data.creators ?? []) {
      const { name, roles } = splitCredit(raw);
      for (const r of roles.length ? roles : ['creator']) add(name, { ...base, role: COMIC_ROLE[r] ?? 'Comics creator' });
    }
  }
  // A magazine's cover painter, where the issue's catalogue entry credits one (Read plan, cover artists).
  for (const m of await getCollection('magazines')) {
    if (m.data.cover_artist) add(splitCredit(m.data.cover_artist).name, { title: m.data.title, url: `/magazines/${m.id}/`, date: m.data.cover_date, detail: m.data.publisher, role: 'Cover artist' });
  }
  for (const p of await getCollection('people')) {
    const slug = p.id;
    if (!map.has(slug)) map.set(slug, { slug, name: p.data.name, credits: [] });
    // Credits filed under another name the person is credited by ("Lou Gossett Jr.") fold into this page.
    for (const alt of p.data.aka) {
      const as = slugify(alt);
      if (as !== slug && map.has(as)) { map.get(slug)!.credits.push(...map.get(as)!.credits); map.delete(as); }
    }
    map.get(slug)!.record = p;
    map.get(slug)!.name = p.data.name;
    for (const c of p.data.tz_credits) {
      const url = !c.ref ? undefined : /^\d{4}\//.test(c.ref) ? `/episodes/${c.ref}/` : `/${c.ref}/`;
      map.get(slug)!.credits.push({ role: c.role ?? 'Contributor', title: c.work, url: url ?? '', detail: c.series });
    }
  }
  for (const q of await getCollection('quotes')) {
    const slug = slugify(q.data.person);
    if (!map.has(slug)) map.set(slug, { slug, name: q.data.person, credits: [] });
  }
  peopleCache = map;
  return map;
}

/** "George Wilson (cover)" -> { name: "George Wilson", roles: ["cover"] }. */
export function splitCredit(raw: string): { name: string; roles: string[] } {
  const m = String(raw).trim().match(/^(.*?)\s*\(([^)]*)\)\s*$/);
  // "illustration Joe Certa": a role word written before the name.
  const pre = String(raw).trim().match(/^(illustration|art|cover|script|story|pencils|inks)\s+([A-Z].*)$/);
  if (!m && pre) return { name: pre[2].trim(), roles: [pre[1] === 'illustration' ? 'illustrator' : pre[1]] };
  if (!m) return { name: String(raw).trim(), roles: [] };
  return { name: m[1].trim(), roles: m[2].split(/\s*,\s*/).map((r) => r.toLowerCase()).filter(Boolean) };
}
export const COMIC_ROLE: Record<string, string> = { writer: 'Comics writer', artist: 'Comics artist', cover: 'Cover artist', inker: 'Inker', editor: 'Editor', colorist: 'Colorist', illustrator: 'Illustrator', art: 'Comics artist', script: 'Comics writer', story: 'Comics writer', pencils: 'Comics artist', inks: 'Inker', colors: 'Colorist', letters: 'Letterer', letterer: 'Letterer', creator: 'Comics creator' };

export function personUrl(name: string) {
  return `/people/${slugify(splitCredit(name).name)}/`;
}

/** Role labels without repeats: "writer" and "Writer" (or "Writers") count once, first spelling kept, capitalized. */
export function uniqueRoles(roles: string[]): string[] {
  const seen = new Set<string>();
  const out: string[] = [];
  for (const raw of roles) {
    const r = String(raw ?? '').trim();
    if (!r) continue;
    const key = r.toLowerCase().replace(/[^a-z]+/g, ' ').trim().replace(/s$/, '');
    if (seen.has(key)) continue;
    seen.add(key);
    out.push(r.charAt(0).toUpperCase() + r.slice(1));
  }
  return out;
}

const SITE_NAMES: Record<string, string> = {
  'wikipedia.org': 'Wikipedia', 'imdb.com': 'IMDb', 'archive.org': 'Internet Archive', 'fandom.com': 'Fandom',
  'twilightzonevortex.blogspot.com': 'Twilight Zone Vortex', 'variety.com': 'Variety', 'nytimes.com': 'The New York Times',
  'slashfilm.com': '/Film', 'tvshowsondvd.com': 'TVShowsOnDVD', 'rodserling.com': 'Rod Serling Memorial Foundation',
  'twilightzonemuseum.com': 'Twilight Zone Museum', 'blu-ray.com': 'Blu-ray.com', 'dvdtalk.com': 'DVD Talk',
  'tvtropes.org': 'TV Tropes', 'ign.com': 'IGN', 'avclub.com': 'The A.V. Club', 'screenrant.com': 'Screen Rant',
  'cbr.com': 'CBR', 'syfy.com': 'SYFY', 'paramount.com': 'Paramount', 'justwatch.com': 'JustWatch',
};
/**
 * A short name for a source, for inline citations: "Wikipedia", "Variety, March 11, 1959", "Twilight Zone Vortex".
 * The full title stays in the link's title attribute and in the page's Sources list.
 */
export function shortSource(s: { title: string; url?: string; publisher?: string }): string {
  if (s.publisher) return s.publisher;
  const t = s.title.trim();
  const head = /^([A-Z][^:,"“]{1,40}?)(?::| -| –|,)\s/.exec(t)?.[1]?.replace(/\s*\(.*\)$/, '');
  if (head && /^(Wikipedia|IMDb|Variety|Billboard|Fandom|SlashFilm|\/Film|Moviefone|Why So Blu|The Twilight Zone Wiki|TV Guide|Los Angeles Times|The New York Times|Time|Newsweek|Broadcasting|Screen Rant|Collider|IGN|Vulture|Deadline|The Hollywood Reporter|Plagiarism Today)$/i.test(head)) {
    const date = /^[^,]+,\s*([A-Z][a-z]+ \d{1,2}, \d{4})/.exec(t)?.[1];
    return date ? `${head}, ${date}` : head;
  }
  const tail = / [-–|] ([^-–|"“]{2,40})$/.exec(t)?.[1];
  if (tail && !/\(\d{4}/.test(tail)) return tail.replace(/\s*\(.*\)$/, '');
  if (s.url) {
    try {
      const h = new URL(s.url).hostname.replace(/^www\./, '');
      const k = Object.keys(SITE_NAMES).find((d) => h === d || h.endsWith('.' + d));
      return k ? SITE_NAMES[k] : h;
    } catch { /* fall through */ }
  }
  return t.length > 40 ? t.slice(0, t.lastIndexOf(' ', 40)) + '…' : t;
}
