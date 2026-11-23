// Films by Twilight Zone writers with no tie to the show, its episodes or Rod Serling (Adam, 2026-11-23,
// Movies Q2: "No, only films with ties to the series, its episodes, or Rod Serling himself. Link to their
// filmography is okay though."). Their records are kept in src/content/films with `filmography_only: true`,
// so nothing is lost, but no build gives them a page (see the loader in src/content.config.ts). Each
// writer's People page lists them as links out to their own sources, beside a link to the writer's
// filmography.
import { readdirSync, readFileSync } from 'node:fs';
import { join, resolve } from 'node:path';
import { parse } from 'yaml';
import { slugify } from './slug';

export interface OutsideFilm { id: string; title: string; year?: string; url?: string; source?: string; role: string }

let cache: Map<string, OutsideFilm[]> | undefined;

/** Person slug -> the films on file only for their filmography, oldest first. */
export function filmographyOnly(): Map<string, OutsideFilm[]> {
  if (cache) return cache;
  const dir = resolve(process.cwd(), 'src/content/films');
  const map = new Map<string, OutsideFilm[]>();
  for (const f of readdirSync(dir).filter((x) => x.endsWith('.yaml'))) {
    const d = parse(readFileSync(join(dir, f), 'utf8')) ?? {};
    if (!d.filmography_only) continue;
    const first = (d.sources ?? [])[0] ?? {};
    const base = { id: f.replace(/\.yaml$/, ''), title: d.title, year: String(d.release_date ?? '').slice(0, 4) || undefined, url: first.url, source: first.title };
    const credit = (names: string[] | undefined, role: string) => {
      for (const n of names ?? []) {
        const slug = slugify(n);
        if (!map.has(slug)) map.set(slug, []);
        if (!map.get(slug)!.some((x) => x.id === base.id)) map.get(slug)!.push({ ...base, role });
      }
    };
    credit(d.writers, 'Writer');
    credit(d.source_authors, 'Source story');
  }
  for (const list of map.values()) list.sort((a, b) => (a.year ?? '9999').localeCompare(b.year ?? '9999') || a.title.localeCompare(b.title));
  cache = map;
  return map;
}
