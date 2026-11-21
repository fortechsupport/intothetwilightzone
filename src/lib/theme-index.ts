// Everything filed under each theme (decision 0004), for /themes/ and /themes/<slug>/: Twilight Zone episodes,
// Night Gallery segments, and works that point to an episode (homages, remakes, songs, films…), which take
// that episode's themes. Built once per build.
import { getCollection } from 'astro:content';
import { allEpisodes, episodeNumber, resolveRef, mediumOf, CONNECTION_LABELS } from './data';
import { tv, filmHref } from './television';
import { THEMES, themesOfTags, segmentThemes, episodeThemes } from './themes';
import { sortKey } from './categories';

export interface ThemeEpisode { id: string; title: string; series: string; number: string; date?: string; href: string; themes: string[] }
export interface ThemeSegment { title: string; episode: string; href: string; date?: string; themes: string[] }
export interface ThemeWork { title: string; href: string; medium: string; kind: string; via: { title: string; href: string; series: string }[]; themes: string[] }
export interface ThemeIndex { episodes: ThemeEpisode[]; segments: ThemeSegment[]; works: ThemeWork[] }

let cache: ThemeIndex | undefined;
export async function themeIndex(): Promise<ThemeIndex> {
  if (cache) return cache;
  const eps = await allEpisodes();
  const epT = await episodeThemes();
  const episodes: ThemeEpisode[] = eps.map((e) => ({
    id: e.id, title: e.data.title, series: e.data.series, number: episodeNumber(e.data), date: e.data.air_date,
    href: `/episodes/${e.id}/`, themes: themesOfTags(e.data.themes),
  }));
  const byEp = new Map(episodes.map((e) => [e.id, e]));

  // Night Gallery: the pilot film and every broadcast episode, segment by segment.
  const segments: ThemeSegment[] = [];
  for (const f of (await getCollection('films')).filter((x) => x.id === 'night-gallery-pilot' || /^night-gallery-s\d+e\d+$/.test(x.id))) {
    const m = /^night-gallery-s(\d+)e(\d+)$/.exec(f.id);
    const episode = m ? `Season ${Number(m[1])}, episode ${Number(m[2])}` : 'The pilot film (1969)';
    const base = filmHref(f.id);
    f.data.segments.forEach((sg, i) => {
      const href = m ? `${base.replace(/#.*$/, '')}#${f.id}-${i + 1}` : base;
      segments.push({ title: sg.title, episode, href, date: f.data.release_date, themes: segmentThemes(f.id, i) });
    });
  }
  segments.sort((a, b) => String(a.date ?? '').localeCompare(String(b.date ?? '')) || a.href.localeCompare(b.href));

  // Works pointing to an episode, one row per work with every episode it points to.
  const rows = new Map<string, ThemeWork>();
  for (const c of await getCollection('connections')) {
    const ep = byEp.get(c.data.to);
    if (!ep) continue;
    const r = await resolveRef(c.data.from);
    if (!r) continue;
    const fid = c.data.from.startsWith('films/') ? c.data.from.slice(6) : '';
    const show = fid ? tv.showOf(fid)?.title : undefined;
    const title = show && !r.title.startsWith(show) ? `${show}: ${r.title}` : r.title;
    const row = rows.get(c.data.from) ?? { title, href: r.url, medium: mediumOf(r.kind), kind: CONNECTION_LABELS[c.data.kind] ?? c.data.kind, via: [], themes: [] };
    if (!row.via.some((v) => v.href === ep.href)) row.via.push({ title: ep.title, href: ep.href, series: ep.series });
    row.themes = [...new Set([...row.themes, ...(epT.get(ep.id) ?? [])])];
    rows.set(c.data.from, row);
  }
  const works = [...rows.values()].sort((a, b) => sortKey(a.title).localeCompare(sortKey(b.title)));
  return (cache = { episodes, segments, works });
}

/** How many episodes, segments and works carry each theme. */
export async function themeCounts(): Promise<Map<string, { episodes: number; segments: number; works: number }>> {
  const ix = await themeIndex();
  return new Map(THEMES.map((t) => [t.slug, {
    episodes: ix.episodes.filter((e) => e.themes.includes(t.slug)).length,
    segments: ix.segments.filter((s) => s.themes.includes(t.slug)).length,
    works: ix.works.filter((w) => w.themes.includes(t.slug)).length,
  }]));
}
