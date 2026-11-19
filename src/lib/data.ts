import { getCollection, type CollectionEntry } from 'astro:content';
import { slugify } from './slug';

export type Episode = CollectionEntry<'episodes'>;
export type Film = CollectionEntry<'films'>;

export const SERIES_ORDER = ['1959', '1985', '2002', '2019'] as const;

export const CONNECTION_LABELS: Record<string, string> = {
  'official-adaptation': 'Official adaptation',
  remake: 'Remake',
  'inspired-by': 'Inspired by',
  homage: 'Homage',
  parody: 'Parody',
  reference: 'Reference',
  'lyric-mention': 'Lyric mention',
};

export const CONFIDENCE_LABELS: Record<string, string> = {
  'confirmed-by-creator': 'Confirmed by the creator',
  documented: 'Documented by a reliable source',
  'fan-noted': 'Unconfirmed: fan-noted, no source yet',
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
  const m = /^(\d{4})-(\d{2})-(\d{2})$/.exec(iso);
  if (!m) return iso;
  const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
  return `${months[Number(m[2]) - 1]} ${Number(m[3])}, ${m[1]}`;
}

/** Resolve a "collection/id" reference to a title and URL. */
export async function resolveRef(ref: string): Promise<{ title: string; url: string; kind: string } | undefined> {
  const [collection, ...rest] = ref.split('/');
  const id = rest.join('/');
  if (collection === 'films') {
    const f = (await getCollection('films')).find((x) => x.id === id);
    const kinds: Record<string, string> = { film: 'Film', 'tv-film': 'TV film', 'tv-episode': 'TV episode', 'tv-segment': 'TV segment', 'tv-series': 'TV series', sketch: 'Sketch', documentary: 'Documentary', special: 'Special', pilot: 'Pilot', stage: 'Stage', unproduced: 'Unproduced' };
    return f && { title: f.data.parent_series ? `${f.data.title} (${f.data.parent_series})` : f.data.title, url: `/films/${f.id}/`, kind: kinds[f.data.kind] ?? 'Film' };
  }
  if (collection === 'songs') {
    const s = (await getCollection('songs')).find((x) => x.id === id);
    return s && { title: `${s.data.title}${s.data.artist ? ` (${s.data.artist})` : ''}`, url: `/songs/#${s.id}`, kind: 'Song' };
  }
  if (collection === 'works') {
    const w = (await getCollection('works')).find((x) => x.id === id);
    return w && { title: w.data.title, url: `/works/${w.id}/`, kind: w.data.kind.replace(/-/g, ' ') };
  }
  if (collection === 'series') {
    const s = (await getCollection('series')).find((x) => x.id === id);
    return s && { title: `${s.data.title} (${s.data.years})`, url: `/series/${s.id}/`, kind: 'Series' };
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
    const base = { title: f.data.title, url: `/films/${f.id}/`, date: f.data.release_date, detail: 'Film' };
    f.data.writers.forEach((n) => add(n, { ...base, role: 'Writer' }));
    f.data.directors.forEach((n) => add(n, { ...base, role: 'Director' }));
    f.data.cast.forEach((n) => add(n, { ...base, role: 'Cast' }));
    for (const sg of f.data.segments) {
      const sb = { ...base, detail: `Segment: ${sg.title}` };
      sg.writers.forEach((n) => add(n, { ...sb, role: 'Writer' }));
      sg.directors.forEach((n) => add(n, { ...sb, role: 'Director' }));
      sg.cast.forEach((n) => add(n, { ...sb, role: 'Cast' }));
    }
  }
  for (const r of await getCollection('radio')) {
    const base = { title: r.data.title, url: `/radio/#${r.id}`, detail: 'Radio drama' };
    (r.data.adapted_by ?? '').split(/,\s*/).forEach((n) => add(n, { ...base, role: 'Radio adaptation' }));
    r.data.voiced_by.forEach((n) => add(n, { ...base, role: 'Radio cast' }));
  }
  for (const p of await getCollection('people')) {
    const slug = p.id;
    if (!map.has(slug)) map.set(slug, { slug, name: p.data.name, credits: [] });
    map.get(slug)!.record = p;
    map.get(slug)!.name = p.data.name;
    for (const c of p.data.tz_credits) {
      const url = !c.ref ? undefined : /^\d{4}\//.test(c.ref) ? `/episodes/${c.ref}/` : `/${c.ref}/`;
      map.get(slug)!.credits.push({ role: c.role ?? 'Contributor', title: c.work, url: url ?? '', detail: c.series });
    }
  }
  peopleCache = map;
  return map;
}

export function personUrl(name: string) {
  return `/people/${slugify(name)}/`;
}
