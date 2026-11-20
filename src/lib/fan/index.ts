// Fan-experience data: curated paths, hidden endings, related episodes, where to watch, and the
// small JSON indexes the browser-only tools (/finder/, /today/, /degrees/, /my-zone/) read.
// Editorial content lives in data/fan/*.yaml so research and review work never conflict with it.
import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { parse } from 'yaml';
import { allEpisodes, episodeNumber, type Episode } from '../data';
import { sortKey } from '../taxonomy.mjs';

const read = (name: string) => parse(readFileSync(resolve(process.cwd(), 'data/fan', name), 'utf8'));

export interface PathStep { ref: string; note: string }
export interface FanPath { slug: string; title: string; short: string; intro: string; steps: PathStep[]; ranked?: boolean; spoilers?: boolean; sort?: 'az' | 'aired' }

let pathsCache: FanPath[] | undefined;
export function fanPaths(): FanPath[] {
  pathsCache ??= read('paths.yaml') as FanPath[];
  return pathsCache;
}

let endingsCache: Record<string, string> | undefined;
export function endingOf(id: string): string | undefined {
  endingsCache ??= read('endings.yaml') as Record<string, string>;
  return endingsCache[id];
}

export const SERIES_LABEL: Record<string, string> = {
  '1959': 'Original series (1959-1964)',
  '1985': '1985 revival (1985-1989)',
  '2002': '2002 revival (2002-2003)',
  '2019': '2019 revival (2019-2020)',
};

/** Steps resolved to episodes, ordered as the path asks. Missing (hidden by review) episodes drop out. */
export async function resolvePath(p: FanPath) {
  const eps = await allEpisodes();
  const byId = new Map(eps.map((e) => [e.id, e]));
  let steps = p.steps.map((s) => ({ ...s, e: byId.get(s.ref) })).filter((s): s is PathStep & { e: Episode } => !!s.e);
  if (p.sort === 'az') steps = steps.sort((a, b) => sortKey(a.e.data.title).localeCompare(sortKey(b.e.data.title)));
  if (p.sort === 'aired') steps = steps.sort((a, b) => (a.e.data.air_date ?? '').localeCompare(b.e.data.air_date ?? ''));
  return steps;
}

/** Which curated paths an episode is on, for a badge on its page. */
export function pathsFor(id: string) {
  return fanPaths().filter((p) => p.steps.some((s) => s.ref === id));
}

/** "If you liked this": other episodes scored by shared writer, source author, director, themes and cast. */
export async function relatedEpisodes(e: Episode, limit = 6) {
  const eps = await allEpisodes();
  const d = e.data;
  const scored = [] as { e: Episode; score: number; why: string[] }[];
  for (const o of eps) {
    if (o.id === e.id) continue;
    const od = o.data;
    let score = 0;
    const why: string[] = [];
    const share = (a: string[], b: string[]) => a.filter((x) => b.includes(x));
    // Serling wrote most of the original series, so sharing him there is only a weak signal.
    const serlingOnly = (n: string) => n === 'Rod Serling' && d.series === '1959' && od.series === '1959';
    const allW = share(d.writers, od.writers);
    const w = allW.filter((n) => !serlingOnly(n));
    if (w.length) { score += 3; why.push(`also written by ${w.join(' and ')}`); }
    else if (allW.length) score += 0.5;
    const sa = share(d.source_authors, od.source_authors);
    if (sa.length) { score += 2.5; why.push(`based on a story by ${sa.join(' and ')}`); }
    const dir = share(d.directors, od.directors);
    if (dir.length) { score += 1; why.push(`directed by ${dir.join(' and ')}`); }
    const th = share(d.themes, od.themes);
    if (th.length) { score += 2 * th.length; why.push(`${th.length > 1 ? 'themes' : 'theme'}: ${th.join(', ')}`); }
    const cast = share(d.cast, od.cast);
    if (cast.length) { score += 1.5 * cast.length; why.push(`with ${cast.slice(0, 3).join(', ')}`); }
    if (od.title === d.title && od.series !== d.series) { score += 4; why.unshift(`the ${od.series} version of the same title`); }
    if (score >= 2.5 && why.length) scored.push({ e: o, score, why });
  }
  return scored.sort((a, b) => b.score - a.score || (a.e.data.air_date ?? '').localeCompare(b.e.data.air_date ?? '')).slice(0, limit);
}

/** A per-episode search link on JustWatch, which tracks streaming, free and purchase options by country. */
export function watchLinks(e: Episode) {
  const show = e.data.series === '1959' ? 'The Twilight Zone 1959' : `The Twilight Zone ${e.data.series}`;
  return {
    justwatch: `https://www.justwatch.com/us/search?q=${encodeURIComponent(show)}`,
    reelgood: `https://reelgood.com/search?q=${encodeURIComponent('The Twilight Zone')}`,
    homeMedia: `/series/${e.data.series}/#releases`,
  };
}

/** Compact rows for the episode finder, episode of the day and on-this-day tools. */
export async function episodeIndex() {
  const eps = await allEpisodes();
  return eps.map((e) => ({
    id: e.id,
    t: e.data.title,
    s: e.data.series,
    se: e.data.season,
    n: episodeNumber(e.data),
    d: e.data.air_date ?? '',
    w: e.data.writers,
    sa: e.data.source_authors,
    di: e.data.directors,
    c: e.data.cast,
    th: e.data.themes,
    sy: e.data.synopsis ?? '',
    rt: e.data.runtime_min,
  }));
}
