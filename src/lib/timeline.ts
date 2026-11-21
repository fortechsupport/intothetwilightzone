// Every dated record on the site, as timeline entries. Used by /timeline/ (milestones and decades) and
// /timeline/<decade>/ (every entry in that decade).
import { getCollection } from 'astro:content';
import { allEpisodes, episodeNumber, personUrl } from './data';

export interface Item { date: string; year: number; label: string; url?: string; kind: string; detail?: string }
const MONTHS: Record<string, string> = { jan: '01', feb: '02', mar: '03', apr: '04', may: '05', jun: '06', jul: '07', aug: '08', sep: '09', oct: '10', nov: '11', dec: '12' };

/** Turn ISO dates, years, and loose text like "Apr 1981" or "February-April 1961" into a sortable YYYY[-MM[-DD]]. */
function parseDate(raw: unknown): string | undefined {
  if (raw === undefined || raw === null || raw === '') return undefined;
  const s = String(raw).trim();
  const iso = /^(\d{4})(?:-(\d{2}))?(?:-(\d{2}))?$/.exec(s);
  if (iso) return [iso[1], iso[2], iso[3]].filter(Boolean).join('-');
  const year = /(1[89]\d\d|20\d\d)/.exec(s);
  if (!year) return undefined;
  const month = /\b(jan|feb|mar|apr|may|jun|jul|aug|sep|oct|nov|dec)[a-z]*\.?/i.exec(s);
  return month ? `${year[1]}-${MONTHS[month[1].toLowerCase()]}` : year[1];
}
function add(items: Item[], raw: unknown, kind: string, label: string, url?: string, detail?: string) {
  const date = parseDate(raw);
  if (!date) return;
  items.push({ date, year: Number(date.slice(0, 4)), kind, label, url, detail });
}
async function safe<T extends string>(name: T) {
  try { return await getCollection(name as any); } catch { return []; }
}

let cache: Item[] | undefined;
/** All timeline entries, oldest first. */
export async function timelineItems(): Promise<Item[]> {
  if (cache) return cache;
  const items: Item[] = [];
  const series = await safe('series');
  for (const s of series as any[]) {
    for (const h of s.data.history ?? []) add(items, h.date, 'History', h.title, `/series/${s.id}/`, `${s.data.title} (${s.id})`);
    for (const r of s.data.releases ?? []) add(items, r.date, 'Home media', r.title, `/series/${s.id}/`, [r.format, r.publisher, r.region].filter(Boolean).join(', '));
    for (const t of s.data.international_titles ?? []) if (t.year) add(items, String(t.year), 'Around the world', `${t.title} (${t.country})`, `/series/${s.id}/`, [t.broadcaster, `${s.id} series`].filter(Boolean).join(', '));
  }
  const eps = await allEpisodes();
  const firstLast = new Map<string, { first: any; last: any }>();
  for (const e of eps) {
    add(items, e.data.air_date, 'Episode', e.data.title, `/episodes/${e.id}/`, `${e.data.series} series, ${episodeNumber(e.data)}`);
    const key = e.data.series;
    const fl = firstLast.get(key) ?? { first: e, last: e };
    if ((e.data.air_date ?? '9999') < (fl.first.data.air_date ?? '9999')) fl.first = e;
    if ((e.data.air_date ?? '') > (fl.last.data.air_date ?? '')) fl.last = e;
    firstLast.set(key, fl);
  }
  for (const [key, fl] of firstLast) {
    add(items, fl.first.data.air_date, 'Series', `The ${key} series premieres`, `/series/${key}/`, fl.first.data.title);
    add(items, fl.last.data.air_date, 'Series', `The ${key} series ends its run`, `/series/${key}/`, fl.last.data.title);
  }
  for (const f of (await safe('films')) as any[]) {
    const label = f.data.parent_series ? `${f.data.title} (${f.data.parent_series})` : f.data.title;
    add(items, f.data.release_date, f.data.kind === 'film' ? 'Film' : 'Screen', label, `/films/${f.id}/`, f.data.kind.replace(/-/g, ' '));
    for (const h of f.data.history ?? []) add(items, h.date, 'History', h.title, `/films/${f.id}/`, f.data.title);
    for (const r of f.data.releases ?? []) add(items, r.date, 'Home media', r.title, `/films/${f.id}/`, [r.format, r.publisher, r.region].filter(Boolean).join(', '));
  }
  for (const b of (await safe('books')) as any[]) add(items, b.data.published, 'Book', b.data.title, `/books/${b.id}/`, (b.data.authors ?? []).join(', '));
  for (const c of (await safe('comics')) as any[]) add(items, c.data.cover_date, 'Comic', c.data.title, `/comics/${c.id}/`, c.data.publisher);
  for (const m of (await safe('magazines')) as any[]) add(items, m.data.cover_date, 'Magazine', m.data.title, `/magazines/${m.id}/`, m.data.publisher);
  for (const r of (await safe('radio')) as any[]) add(items, r.data.volume_released, 'Radio', r.data.title, `/radio/${r.id}/`, r.data.series_title);
  for (const p of (await safe('podcasts')) as any[]) add(items, p.data.first_episode, 'Podcast', `${p.data.title} begins`, `/podcasts/${p.id}/`);
  for (const s of (await safe('songs')) as any[]) add(items, s.data.year, 'Song', s.data.title, `/songs/${s.id}/`, s.data.artist);
  for (const p of (await safe('people')) as any[]) {
    add(items, p.data.born, 'Born', p.data.name, personUrl(p.data.name));
    add(items, p.data.died, 'Died', p.data.name, personUrl(p.data.name));
  }
  for (const q of (await safe('quotes')) as any[]) add(items, q.data.date, 'Quote', `${q.data.person}${q.data.context ? `: ${q.data.context}` : ''}`, `/quotes/${q.id}/`);
  for (const l of (await safe('locations')) as any[]) {
    add(items, l.data.opened, 'Place', `${l.data.name} opens`, `/places/${l.id}/`);
    add(items, l.data.closed, 'Place', `${l.data.name} closes`, `/places/${l.id}/`);
  }
  for (const w of (await safe('works')) as any[]) {
    add(items, w.data.year, 'Work', w.data.title, `/works/${w.id}/`, w.data.kind.replace(/-/g, ' '));
    const d = w.data.details ?? {};
    add(items, d.opened, 'Work', `${w.data.title} opens`, `/works/${w.id}/`);
    add(items, d.closed, 'Work', `${w.data.title} closes`, `/works/${w.id}/`);
    if (d.released && parseDate(d.released) !== parseDate(w.data.year)) add(items, d.released, 'Work', `${w.data.title} released`, `/works/${w.id}/`);
  }
  for (const e of (await safe('essays')) as any[]) add(items, e.data.published, 'Essay', e.data.title, undefined, (e.data.authors ?? []).join(', '));

  items.sort((a, b) => a.date.localeCompare(b.date) || a.kind.localeCompare(b.kind) || a.label.localeCompare(b.label));
  return (cache = items);
}

/** The page an entry's year belongs to: "1960s", or "before-1900" for everything earlier. */
export const decadeSlug = (year: number) => (year < 1900 ? 'before-1900' : `${Math.floor(year / 10) * 10}s`);
export const decadeLabel = (slug: string) => (slug === 'before-1900' ? 'Before 1900' : `The ${slug}`);
/** Kinds shown on the /timeline/ overview: the franchise's own milestones. */
export const MILESTONE_KINDS = new Set(['Series', 'History', 'Film', 'Around the world']);
export const fmtDay = (d: string) => {
  const [, m, day] = d.split('-');
  const names = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  return m ? `${names[Number(m) - 1]}${day ? ` ${Number(day)}` : ''}` : '';
};
export const kindClass = (k: string) => `k-${k.toLowerCase().replace(/[^a-z]+/g, '-')}`;
