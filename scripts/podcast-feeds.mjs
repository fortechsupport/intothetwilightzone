#!/usr/bin/env node
// Podcast feed reader (docs/plans/research-podcasts.md, Q3, Q8 and Q9).
//
// Reads the RSS feed of every podcast record that has one (links.rss, or the feed Apple's public lookup gives for
// links.apple / an Apple source URL) and keeps, for each episode, only facts: title, date, length and the episode's own
// link. Show notes, audio and artwork are never stored (Q9).
//
//   node scripts/podcast-feeds.mjs            read the feeds and print a report (nothing is written)
//   node scripts/podcast-feeds.mjs --write    also merge the episodes into data/podcasts/episodes.json
//
// Nothing is ever dropped: an episode stays in the data file when its feed stops listing it or the feed disappears,
// and the feed is then marked as no longer available with the date it was last read (Q8).
// Runs on GitHub (the weekly job and pull requests that touch podcasts); the research sandbox cannot reach feeds.
import fs from 'node:fs';
import path from 'node:path';
import YAML from 'yaml';

const root = path.resolve(path.dirname(new URL(import.meta.url).pathname), '..');
const dir = path.join(root, 'src/content/podcasts');
const out = path.join(root, 'data/podcasts/episodes.json');
const write = process.argv.includes('--write');
const today = new Date().toISOString().slice(0, 10);
// Identify the site and ask politely; no personal details (CLAUDE.md, privacy).
const UA = 'IntoTheTwilightZone.com podcast index (non-commercial fan site; weekly; https://intothetwilightzone.com/)';

const ENTITIES = { amp: '&', lt: '<', gt: '>', quot: '"', apos: "'", nbsp: ' ' };
const decode = (s) => s
  .replace(/<!\[CDATA\[([\s\S]*?)\]\]>/g, '$1')
  .replace(/&#x([0-9a-f]+);/gi, (_, h) => String.fromCodePoint(parseInt(h, 16)))
  .replace(/&#(\d+);/g, (_, d) => String.fromCodePoint(Number(d)))
  .replace(/&([a-z]+);/gi, (m, n) => ENTITIES[n.toLowerCase()] ?? m)
  .replace(/<[^>]+>/g, '')
  .replace(/\s+/g, ' ')
  .trim();
const tag = (xml, name) => {
  const m = xml.match(new RegExp(`<${name}(?:\\s[^>]*)?>([\\s\\S]*?)</${name}>`, 'i'));
  return m ? decode(m[1]) : undefined;
};
const attr = (xml, name, a) => xml.match(new RegExp(`<${name}\\s[^>]*${a}="([^"]*)"`, 'i'))?.[1];
const isoDate = (s) => {
  if (!s) return undefined;
  const d = new Date(s);
  return Number.isNaN(d.getTime()) ? undefined : d.toISOString().slice(0, 10);
};
/** itunes:duration is seconds, mm:ss or hh:mm:ss; store whole seconds. */
const seconds = (s) => {
  if (!s) return undefined;
  const parts = String(s).trim().split(':').map(Number);
  if (parts.some((n) => Number.isNaN(n))) return undefined;
  return parts.reduce((t, n) => t * 60 + n, 0) || undefined;
};

export function parseFeed(xml) {
  const channel = xml.split(/<item[\s>]/i)[0];
  const items = [...xml.matchAll(/<item[\s>][\s\S]*?<\/item>/gi)].map((m) => m[0]);
  return {
    title: tag(channel, 'title'),
    author: tag(channel, 'itunes:author'),
    link: tag(channel, 'link'),
    episodes: items.map((it) => ({
      title: tag(it, 'title') ?? '(untitled)',
      date: isoDate(tag(it, 'pubDate')),
      seconds: seconds(tag(it, 'itunes:duration')),
      season: Number(tag(it, 'itunes:season')) || undefined,
      number: Number(tag(it, 'itunes:episode')) || undefined,
      // The episode's own page; the enclosure (audio file) is only a fallback, so a row always links somewhere.
      url: tag(it, 'link') || attr(it, 'enclosure', 'url'),
      guid: tag(it, 'guid') || tag(it, 'link') || `${tag(it, 'title')}|${tag(it, 'pubDate')}`,
    })),
  };
}

async function get(url) {
  const res = await fetch(url, { headers: { 'user-agent': UA, accept: 'application/rss+xml, application/xml, text/xml, */*' }, redirect: 'follow', signal: AbortSignal.timeout(30000) });
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  return res.text();
}

/** The podcast's Apple id, from links.apple or an Apple source URL. */
const appleId = (d) => [d.links?.apple, ...(d.sources ?? []).map((s) => s.url)].filter(Boolean)
  .map((u) => String(u).match(/(?:\bid=?|\/id)(\d{6,})/)?.[1]).find(Boolean);
/** Apple's public lookup gives the feed a podcast currently registers (it moves when a show changes host). */
async function appleFeed(d) {
  const id = appleId(d);
  if (!id) return undefined;
  const j = JSON.parse(await get(`https://itunes.apple.com/lookup?id=${id}&entity=podcast`));
  const f = j.results?.[0]?.feedUrl;
  return f ? { url: f, via: `apple ${id}` } : undefined;
}
/** The feed address: links.rss, else Apple's lookup for the podcast's Apple id. */
async function feedOf(d) {
  if (d.links?.rss) return { url: d.links.rss, via: 'record' };
  return appleFeed(d);
}

const records = fs.readdirSync(dir).filter((f) => f.endsWith('.yaml')).sort().map((f) => ({ id: f.slice(0, -5), d: YAML.parse(fs.readFileSync(path.join(dir, f), 'utf8')) })).filter((r) => !r.d.duplicate_of);
const prev = fs.existsSync(out) ? JSON.parse(fs.readFileSync(out, 'utf8')) : { feeds: {}, episodes: [] };
const feeds = { ...prev.feeds };
const byKey = new Map(prev.episodes.map((e) => [`${e.p}|${e.g}`, e]));
const report = [];

for (const { id, d } of records) {
  // A single episode of another podcast (shelf C) is never read whole: its feed is about other things. A record
  // marked feed: false also loses any episodes read before (they came from a feed that is not this podcast's).
  if (d.feed === false) {
    delete feeds[id];
    for (const k of [...byKey.keys()]) if (k.startsWith(`${id}|`)) byKey.delete(k);
    continue;
  }
  let f;
  try { f = await feedOf(d); } catch (e) { report.push([id, 'lookup failed', String(e.message)]); continue; }
  if (!f) { report.push([id, 'no feed', '']); continue; }
  let xml;
  try { xml = await get(f.url); } catch (e) {
    // The record's feed failed: try the one Apple lists now, in case the show moved host.
    const alt = f.via === 'record' ? await appleFeed(d).catch(() => undefined) : undefined;
    if (alt && alt.url !== f.url) { try { xml = await get(alt.url); f = { ...alt, via: `${alt.via} (record feed ${e.message})` }; } catch {} }
    if (!xml) {
      feeds[id] = { ...(feeds[id] ?? {}), url: f.url, via: f.via, status: 'unavailable', last_tried: today };
      report.push([id, 'feed failed', `${e.message} · ${f.url}${alt ? ` · Apple lists ${alt.url}` : ''}`]);
      continue;
    }
  }
  try {
    const parsed = parseFeed(xml);
    const keep = d.feed_filter ? new RegExp(d.feed_filter, 'i') : null;
    const eps = parsed.episodes.filter((e) => !keep || keep.test(e.title));
    const dates = eps.map((e) => e.date).filter(Boolean).sort();
    feeds[id] = { url: f.url, via: f.via, status: 'ok', last_read: today, title: parsed.title, count: eps.length, first: dates[0], latest: dates.at(-1) };
    for (const e of eps) byKey.set(`${id}|${e.guid}`, { p: id, t: e.title, d: e.date, s: e.seconds, n: e.number, se: e.season, u: e.url, g: e.guid });
    report.push([id, 'ok', `${eps.length} episodes${keep ? ` (of ${parsed.episodes.length}, filter /${d.feed_filter}/)` : ''}, ${dates[0] ?? '?'} to ${dates.at(-1) ?? '?'} · "${parsed.title}" · ${f.via} · ${f.url}`]);
  } catch (e) {
    feeds[id] = { ...(feeds[id] ?? {}), url: f.url, via: f.via, status: 'unreadable', last_tried: today };
    report.push([id, 'feed unreadable', `${e.message} · ${f.url}`]);
  }
}

const episodes = [...byKey.values()].sort((a, b) => (b.d ?? '').localeCompare(a.d ?? '') || a.p.localeCompare(b.p));
for (const [id, r, note] of report) console.log(`${r.padEnd(13)} ${id.padEnd(48)} ${note}`);
console.log(`\n${report.filter((r) => r[1] === 'ok').length} feeds read, ${episodes.length} episodes in all.`);
if (write) {
  fs.mkdirSync(path.dirname(out), { recursive: true });
  fs.writeFileSync(out, JSON.stringify({ generated: today, note: 'Facts only (title, date, length, link) from each podcast\'s own RSS feed; see scripts/podcast-feeds.mjs.', feeds, episodes }, null, 0) + '\n');
  console.log(`Wrote ${path.relative(root, out)}.`);
}
