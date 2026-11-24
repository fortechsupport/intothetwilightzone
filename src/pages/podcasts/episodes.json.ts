// Every podcast episode we know of, as compact JSON for the episode table (/podcasts/episodes/). The page loads it
// when it opens, so the page itself stays light. Facts only (plan Q9): title, date, length and the episode's link.
//   podcasts: [title, href, kind, feed status ('ok' | 'unavailable' | '' when no feed is read)]
//   shows:    [title, series, href, key] for each of the show's episodes and Night Gallery segments
//   rows:     [podcast, title, date, seconds, url, external (1/0), [show indexes]]
import type { APIRoute } from 'astro';
import { podcastIndex, SERIES_NAMES } from '../../lib/podcast-episodes';

export const GET: APIRoute = async () => {
  const ix = await podcastIndex();
  const body = {
    generated: ix.generated,
    series: SERIES_NAMES,
    podcasts: ix.podcasts.map((p) => [p.title, p.href, p.kind, p.feed?.status ?? '']),
    shows: ix.targets.map((t) => [t.title, t.series, t.href, t.key]),
    rows: ix.rows.map((r) => [r.p, r.t, r.d ?? '', r.s ?? 0, r.u, r.x ? 1 : 0, r.m]),
  };
  return new Response(JSON.stringify(body), { headers: { 'content-type': 'application/json; charset=utf-8' } });
};
