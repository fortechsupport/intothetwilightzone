// The show index for pages: which film records are entries on a show page, every show's address, and
// the entries the episode explorer (src/components/EpisodeExplorer.astro) shows.
// The rule itself is in ./tv-shows.mjs, shared with astro.config.mjs for redirects.
import { getCollection, type CollectionEntry } from 'astro:content';
import { buildShowIndex, isEntryOnly } from './tv-shows.mjs';

const films = await getCollection('films');
const byId = new Map(films.map((f) => [f.id, f]));
export const tv = buildShowIndex(films);

/** Address of a film record: its own page, or its entry on its show's page. */
export function filmHref(id: string): string {
  const f = byId.get(id);
  return f && isEntryOnly(id, f.data) ? tv.entryHref(id) : `/films/${id}/`;
}
export { isEntryOnly };

export interface ExPerson { name: string }
export interface ExSegment { title: string; summary?: string; source_title?: string; source_authors: string[]; writers: string[]; directors: string[]; cast: string[]; adapts?: { title: string; href: string } }
export interface ExLink { kind: string; certainty: string; title: string; href: string; evidence?: string }
export interface ExEntry {
  id: string;
  title: string;
  date?: string;
  group: string;
  number?: string;
  kindLabel?: string;
  summary?: string;
  segments: ExSegment[];
  writers: string[];
  directors: string[];
  cast: string[];
  links: ExLink[]; // Twilight Zone episodes and series this entry pays homage to
  sources: CollectionEntry<'films'>['data']['sources'];
  media: CollectionEntry<'films'>['data']['media'];
  verified?: string;
}

const KIND_LABEL: Record<string, string> = { 'tv-episode': 'Episode', 'tv-segment': 'Segment', sketch: 'Sketch', 'web-series': 'Web series', 'tv-series': 'About the series' };

function groupOf(id: string, d: CollectionEntry<'films'>['data']): { group: string; number?: string } {
  const ng = /^night-gallery-s(\d+)e(\d+)$/.exec(id);
  if (ng) return { group: `Season ${Number(ng[1])}`, number: `Episode ${Number(ng[2])}` };
  if (d.kind === 'tv-series') return { group: 'More about the series' };
  if (/syndication/i.test(d.parent_series ?? '')) return { group: 'Seen only in syndication' };
  const s = /season (\d+)/i.exec(d.parent_series ?? '') ?? /\bS(\d+)(?:E\d+)?\b/.exec(d.parent_series ?? '');
  const e = /episode (\d+)/i.exec(d.parent_series ?? '') ?? /\bS\d+E(\d+)\b/.exec(d.parent_series ?? '');
  if (s) return { group: `Season ${Number(s[1])}`, number: e ? `Episode ${Number(e[1])}` : undefined };
  return { group: 'Episodes' };
}

let epCache: Map<string, { title: string; series: string }> | undefined;
let seriesCache: Map<string, string> | undefined;
async function resolveTz(ref: string): Promise<{ title: string; href: string } | undefined> {
  if (!epCache) epCache = new Map((await getCollection('episodes')).map((e) => [e.id, { title: e.data.title, series: e.data.series }]));
  if (!seriesCache) seriesCache = new Map((await getCollection('series')).map((s) => [s.id, `${s.data.title} (${s.data.years})`]));
  if (/^\d{4}\//.test(ref)) { const e = epCache.get(ref); return e && { title: `“${e.title}” (${e.series})`, href: `/episodes/${ref}/` }; }
  const [col, ...rest] = ref.split('/');
  const id = rest.join('/');
  if (col === 'series') { const t = seriesCache.get(id); return t ? { title: t, href: `/series/${id}/` } : undefined; }
  if (col === 'films') { const f = byId.get(id); return f && { title: f.data.title, href: filmHref(id) }; }
  return undefined;
}

// On its show's page an entry drops the show's name: "Night Gallery: The Dead Man" -> "The Dead Man".
function shortTitle(id: string, title: string): string {
  const show = tv.showOf(id)?.title;
  if (!show) return title;
  for (const sep of [': ', ' – ', ' - ', ', ']) if (title.startsWith(show + sep) && title.length > show.length + sep.length + 1) return title.slice(show.length + sep.length).replace(/^["“](.*)["”]$/, '$1');
  return title;
}

/** Explorer entries for a list of film ids (all of one show), in air order. */
export async function explorerEntries(ids: string[]): Promise<ExEntry[]> {
  const conns = await getCollection('connections');
  const out: ExEntry[] = [];
  for (const id of ids) {
    const f = byId.get(id);
    if (!f) continue;
    const d = f.data;
    const links: ExLink[] = [];
    for (const c of conns.filter((x) => x.data.from === `films/${id}`)) {
      const t = await resolveTz(c.data.to);
      if (t) links.push({ kind: c.data.kind, certainty: c.data.confidence, title: t.title, href: t.href, evidence: c.data.evidence ?? c.data.summary });
    }
    const segments: ExSegment[] = [];
    for (const sg of d.segments) {
      const adapts = sg.adapts_episode ? await resolveTz(sg.adapts_episode) : undefined;
      segments.push({ title: sg.title, summary: sg.summary, source_title: sg.source_title, source_authors: sg.source_authors, writers: sg.writers, directors: sg.directors, cast: sg.cast, adapts });
    }
    out.push({
      id, title: shortTitle(id, d.title), date: d.release_date, ...groupOf(id, d), kindLabel: KIND_LABEL[d.kind],
      summary: d.summary, segments, writers: d.writers, directors: d.directors, cast: d.cast, links,
      sources: d.sources, media: d.media, verified: d.last_verified,
    });
  }
  const groupRank = (g: string) => (/^Season (\d+)/.exec(g) ? Number(/^Season (\d+)/.exec(g)![1]) : g === 'Episodes' ? 0 : g === 'More about the series' ? 999 : 500);
  return out.sort((a, b) => groupRank(a.group) - groupRank(b.group) || String(a.date ?? '9999').localeCompare(String(b.date ?? '9999')) || a.id.localeCompare(b.id));
}

/** Every show that has a page because it holds entries, with its entries. */
export function showsWithEntries() {
  return [...tv.shows.values()].filter((s) => s.entries.length > 0);
}
