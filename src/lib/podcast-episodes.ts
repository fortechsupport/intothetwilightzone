// The podcast episode table (docs/plans/research-podcasts.md, Q3, Q8 and Q9).
//
// Rows come from three places, so the table holds every episode we know of:
// 1. data/podcasts/episodes.json, written by scripts/podcast-feeds.mjs from each podcast's own RSS feed;
// 2. a podcast record's featured_episodes, for podcasts whose feed we cannot read (or rows a feed no longer lists);
// 3. single-episode records (shelf C), which link to their own page on this site.
// Each row keeps only facts: title, date, length and a link (Q9). Titles are matched to the show's episodes by
// src/lib/podcast-match.mjs and shown as "matched by title".
import fs from 'node:fs';
import path from 'node:path';
import { getCollection } from 'astro:content';
import { allEpisodes } from './data';
import { makeMatcher } from './podcast-match.mjs';

export type PodcastRow = {
  p: number; // index into podcasts
  t: string; // title
  d?: string; // date, YYYY-MM-DD
  s?: number; // length in seconds
  u: string; // the episode's own page (external), or a page on this site
  x: boolean; // u is external
  m: number[]; // indexes into targets: the show's episodes the title names
  f?: boolean; // the row came from the record, not the feed
};
export type PodcastIndex = {
  generated?: string;
  podcasts: { id: string; title: string; href: string; kind: string; feed?: { status: string; last_read?: string; last_tried?: string; url?: string } }[];
  targets: { key: string; title: string; series: string; href: string }[];
  rows: PodcastRow[];
};

export const SERIES_NAMES: Record<string, string> = {
  '1959': 'The Twilight Zone (1959)',
  '1985': 'The Twilight Zone (1985)',
  '2002': 'The Twilight Zone (2002)',
  '2019': 'The Twilight Zone (2019)',
  'night-gallery': 'Night Gallery',
};

let cache: Promise<PodcastIndex> | undefined;
export function podcastIndex(): Promise<PodcastIndex> {
  return (cache ??= build());
}

async function build(): Promise<PodcastIndex> {
  const file = path.resolve('data/podcasts/episodes.json');
  const data = fs.existsSync(file) ? JSON.parse(fs.readFileSync(file, 'utf8')) : { feeds: {}, episodes: [] };

  const targets: PodcastIndex['targets'] = [];
  for (const e of await allEpisodes()) targets.push({ key: e.id, title: e.data.title, series: e.data.series, href: `/episodes/${e.id}/` });
  for (const f of (await getCollection('films')).filter((f) => /^night-gallery-s\de\d\d$/.test(f.id)).sort((a, b) => a.id.localeCompare(b.id))) {
    for (const sg of f.data.segments ?? []) targets.push({ key: `${f.id}#${sg.title}`, title: sg.title, series: 'night-gallery', href: `/night-gallery/#${f.id}` });
  }
  const tIndex = new Map(targets.map((t, i) => [t.key, i]));
  const match = makeMatcher(targets);

  const recs = (await getCollection('podcasts')).filter((r) => !r.data.duplicate_of).sort((a, b) => a.id.localeCompare(b.id));
  const podcasts: PodcastIndex['podcasts'] = recs.map((r) => ({ id: r.id, title: r.data.title, href: `/podcasts/${r.id}/`, kind: r.data.kind ?? 'podcast', feed: data.feeds?.[r.id] && { status: data.feeds[r.id].status, last_read: data.feeds[r.id].last_read, last_tried: data.feeds[r.id].last_tried, url: data.feeds[r.id].url } }));
  const pIndex = new Map(recs.map((r, i) => [r.id, i]));
  const covers = new Map(recs.map((r) => [r.id, (r.data.covers ?? []) as string[]]));

  const rows: PodcastRow[] = [];
  const seen = new Set<string>();
  const norm = (s: string) => s.toLowerCase().replace(/[^a-z0-9]+/g, ' ').trim();
  for (const e of data.episodes ?? []) {
    const p = pIndex.get(e.p);
    if (p === undefined || !e.u) continue; // a podcast that is not published, or a row with nowhere to link
    rows.push({ p, t: e.t, d: e.d, s: e.s, u: e.u, x: true, m: match(e.t, covers.get(e.p)).map((k) => tIndex.get(k)!) });
    seen.add(`${e.p}|${norm(e.t)}`);
  }
  for (const r of recs) {
    const p = pIndex.get(r.id)!;
    // A single episode with no episode link of its own is one row, linking to its page here.
    if (r.data.kind === 'single-episode' && !r.data.featured_episodes.some((fe) => fe.url)) {
      rows.push({ p, t: r.data.title, d: r.data.first_episode, u: `/podcasts/${r.id}/`, x: false, m: match(r.data.title, covers.get(r.id)).map((k) => tIndex.get(k)!), f: true });
      continue;
    }
    for (const fe of r.data.featured_episodes) {
      if (!fe.url || seen.has(`${r.id}|${norm(fe.title)}`)) continue;
      const m = fe.covers_episode && tIndex.has(fe.covers_episode) ? [tIndex.get(fe.covers_episode)!] : match(fe.title, covers.get(r.id)).map((k) => tIndex.get(k)!);
      rows.push({ p, t: fe.title, d: fe.date, u: fe.url, x: true, m, f: true });
    }
  }
  rows.sort((a, b) => (b.d ?? '').localeCompare(a.d ?? '') || a.p - b.p);
  return { generated: data.generated, podcasts, targets, rows };
}

/** Rows that name one of the show's episodes, for that episode's page. */
export async function podcastsAbout(key: string) {
  const ix = await podcastIndex();
  const t = ix.targets.findIndex((x) => x.key === key);
  if (t < 0) return [];
  return ix.rows.filter((r) => r.m.includes(t)).map((r) => ({ ...r, podcast: ix.podcasts[r.p] }));
}


// How many podcast episodes name each Night Gallery segment (key "<film id>#<segment title>"), worked out once.
let segCounts: Promise<Map<string, number>> | undefined;
export function segmentPodcastCounts(): Promise<Map<string, number>> {
  return (segCounts ??= podcastIndex().then((ix) => {
    const m = new Map<string, number>();
    for (const r of ix.rows) for (const t of r.m) if (ix.targets[t].series === 'night-gallery') m.set(ix.targets[t].key, (m.get(ix.targets[t].key) ?? 0) + 1);
    return m;
  }));
}
