// Dated events with a full day, for "on this day": episode premieres, film releases, births,
// deaths and dated moments from people and series histories.
import { getCollection } from 'astro:content';
import { allEpisodes, episodeNumber } from '../data';
import { filmHref } from '../television';

export interface Anniversary { md: string; y: number; k: string; t: string; u: string }
const FULL = /^(\d{4})-(\d{2})-(\d{2})$/;

export async function anniversaries(): Promise<Anniversary[]> {
  const out: Anniversary[] = [];
  const add = (date: string | undefined, k: string, t: string, u: string) => {
    const m = FULL.exec(String(date ?? '').trim());
    if (m) out.push({ md: `${m[2]}-${m[3]}`, y: Number(m[1]), k, t, u });
  };
  for (const e of await allEpisodes()) add(e.data.air_date, 'Episode premiere', `"${e.data.title}" first aired (${e.data.series} series, ${episodeNumber(e.data)})`, `/episodes/${e.id}/`);
  for (const f of await getCollection('films')) add(f.data.release_date, 'Release', `${f.data.title} was released`, filmHref(f.id));
  for (const p of await getCollection('people')) {
    add(p.data.born, 'Born', `${p.data.name} was born`, `/people/${p.id}/`);
    add(p.data.died, 'Died', `${p.data.name} died`, `/people/${p.id}/`);
    for (const t of p.data.timeline ?? []) add(t.date, 'History', `${p.data.name}: ${t.text}`, `/people/${p.id}/`);
  }
  for (const s of await getCollection('series')) for (const h of (s.data as any).history ?? []) add(h.date, 'History', h.title, `/series/${s.id}/`);
  return out.sort((a, b) => a.md.localeCompare(b.md) || a.y - b.y);
}
