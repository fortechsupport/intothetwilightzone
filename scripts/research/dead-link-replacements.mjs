#!/usr/bin/env node
// For each dead outbound link in scripts/research/dead-links.txt (copied from the weekly link report), looks for a
// replacement a person can check: the link's own answer now (it may redirect), every Wayback Machine copy that
// answered 200 (the CDX index, which finds copies the availability API misses), and, for podcast episodes, the
// episode's Apple Podcasts page matched by the feed's guid. Lines in scripts/research/candidate-links.txt are
// fetched as possible replacements found by web search. Read-only; runs on GitHub (.github/workflows/research.yml)
// because cloud sessions cannot reach these hosts.
//
//   node scripts/research/dead-link-replacements.mjs > replacements.jsonl
import { readFile } from 'node:fs/promises';
import { existsSync } from 'node:fs';

const UA = 'Mozilla/5.0 (compatible; IntoTheTwilightZone link check; non-commercial fan site)';
const SLOW = 7000;
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
async function fetchy(url, method = 'GET') {
  try {
    const r = await fetch(url, { method, redirect: 'follow', headers: { 'User-Agent': UA, accept: 'text/html,application/json,*/*' }, signal: AbortSignal.timeout(45000) });
    const text = method === 'GET' ? await r.text().catch(() => '') : '';
    const title = text.match(/<title[^>]*>([^<]*)<\/title>/i)?.[1]?.trim().slice(0, 160);
    return { status: r.status, final: r.url, title, text };
  } catch (e) { return { status: 0, error: String(e.message) }; }
}
const lines = async (f) => existsSync(f) ? (await readFile(f, 'utf8')).split('\n').map((s) => s.trim()).filter((s) => s && !s.startsWith('#')) : [];

function variants(u) {
  const bare = u.replace(/^https?:\/\//i, '');
  const out = new Set([bare]);
  out.add(bare.startsWith('www.') ? bare.slice(4) : 'www.' + bare);
  return [...out];
}

async function cdx(u) {
  const found = [];
  for (const v of variants(u)) {
    let r;
    // The CDX index answers 429 to quick callers: wait between calls and back off when it says so.
    for (let t = 0; t < 5; t++) {
      await sleep(SLOW * (t + 1));
      r = await fetchy(`https://web.archive.org/cdx/search/cdx?url=${encodeURIComponent(v)}&output=json&filter=statuscode:200&fl=timestamp,original,mimetype`);
      if (r.status !== 429) break;
    }
    if (r.status !== 200) { found.push({ variant: v, cdx_status: r.status }); continue; }
    let rows = [];
    try { rows = JSON.parse(r.text || '[]').slice(1); } catch {}
    if (rows.length) found.push({ variant: v, count: rows.length, first: rows[0], last: rows[rows.length - 1] });
  }
  return found;
}

const dead = await lines('scripts/research/dead-links.txt');
const skip = /fifthdimension\.libsyn|TwilightZonePod\.com|authorwars\.com/i; // matched on Apple, or catalogued elsewhere
console.error(`${dead.length} dead links`);
for (const [i, u] of dead.entries()) {
  if (skip.test(u)) continue;
  console.error(`${i + 1}/${dead.length} ${u}`);
  const live = await fetchy(u);
  const out = { url: u, live: { status: live.status, final: live.final, title: live.title, error: live.error }, wayback: await cdx(u) };
  const best = out.wayback.filter((w) => w.last).sort((a, b) => b.last[0].localeCompare(a.last[0]))[0];
  if (best) {
    const snap = `https://web.archive.org/web/${best.last[0]}/${best.last[1]}`;
    const s = await fetchy(snap);
    out.best = { url: snap, status: s.status, title: s.title };
  }
  console.log(JSON.stringify(out));
}

// Podcast episodes: the Apple Podcasts episode page for each dead feed link, matched by guid.
const pods = [['the-fifth-dimension', '906935586'], ['imagine-if-you-will', '1231816890']];
const eps = JSON.parse(await readFile('data/podcasts/episodes.json', 'utf8')).episodes;
for (const [p, id] of pods) {
  const r = await fetchy(`https://itunes.apple.com/lookup?id=${id}&entity=podcastEpisode&limit=200`);
  let res = [];
  try { res = JSON.parse(r.text).results ?? []; } catch {}
  for (const e of eps.filter((e) => e.p === p && dead.includes(e.u))) {
    const m = res.find((x) => x.episodeGuid === e.g) ?? res.find((x) => x.trackName === e.t);
    console.log(JSON.stringify({ podcast: p, url: e.u, guid: e.g, title: e.t, apple: m?.trackViewUrl, apple_title: m?.trackName, apple_date: m?.releaseDate }));
  }
  console.log(JSON.stringify({ podcast: p, apple_status: r.status, apple_episodes: res.length }));
}

for (const u of await lines('scripts/research/candidate-links.txt')) {
  await sleep(800);
  const r = await fetchy(u);
  const author = /isfdb\.org/.test(u) ? (r.text || '').match(/Authors?:<\/b>([\s\S]*?)<\/li>/)?.[1]?.replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim() : undefined;
  console.log(JSON.stringify({ candidate: u, status: r.status, final: r.final, title: r.title, author, error: r.error }));
}
