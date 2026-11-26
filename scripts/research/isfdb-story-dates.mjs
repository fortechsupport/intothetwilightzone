#!/usr/bin/env node
// Looks up the stories behind episodes that have no first-publication date, in the Internet Speculative Fiction
// Database (ISFDB). Read-only: it prints what ISFDB says (title record, date, author, earliest printings) for a person
// to check and copy into the records with the ISFDB page as the source. Cloud sessions cannot reach isfdb.org, so it
// runs on GitHub (.github/workflows/research.yml).
//
//   node scripts/research/isfdb-story-dates.mjs > isfdb.jsonl
import { readdir, readFile } from 'node:fs/promises';
import yaml from 'yaml';

const UA = 'IntoTheTwilightZone research (non-commercial fan site; a few slow lookups)';
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
const get = async (url) => { await sleep(1500); const r = await fetch(url, { headers: { 'User-Agent': UA }, signal: AbortSignal.timeout(60000) }); return r.ok ? r.text() : ''; };
const strip = (s) => s.replace(/<[^>]+>/g, ' ').replace(/&amp;/g, '&').replace(/&#39;|&rsquo;/g, "'").replace(/\s+/g, ' ').trim();
const norm = (s) => s.toLowerCase().replace(/[’']/g, "'").replace(/[^a-z0-9' ]/g, ' ').replace(/\s+/g, ' ').trim();

const dir = 'src/content/books';
const todo = [];
for (const f of (await readdir(dir)).filter((f) => f.endsWith('.yaml'))) {
  const d = yaml.parse(await readFile(`${dir}/${f}`, 'utf8'));
  if (d.duplicate_of || d.published || d.first_published || d.year) continue;
  if (!['short-story', 'radio-play', 'novelette', 'novella'].includes(d.kind)) continue;
  todo.push({ id: f.replace(/\.yaml$/, ''), title: d.title, authors: d.authors ?? [] });
}
console.error(`${todo.length} stories to look up`);

for (const [i, t] of todo.entries()) {
  console.error(`${i + 1}/${todo.length} ${t.title}`);
  const out = { id: t.id, title: t.title, authors: t.authors, matches: [] };
  try {
    const html = await get(`https://www.isfdb.org/cgi-bin/se.cgi?arg=${encodeURIComponent(t.title)}&type=Fiction+Titles`);
    // A single exact hit redirects straight to the title page; otherwise there is a results table.
    const ids = new Set();
    if (/<b>Title:<\/b>/.test(html)) { const m = html.match(/title\.cgi\?(\d+)/); if (m) ids.add(m[1]); }
    for (const m of html.matchAll(/href="[^"]*title\.cgi\?(\d+)"[^>]*>([^<]+)<\/a>/g)) if (norm(m[2]) === norm(t.title)) ids.add(m[1]);
    for (const id of [...ids].slice(0, 4)) {
      const page = await get(`https://www.isfdb.org/cgi-bin/title.cgi?${id}`);
      const authors = [...page.matchAll(/ea\.cgi\?\d+[^>]*>([^<]+)<\/a>/g)].map((m) => m[1]).slice(0, 4);
      const date = page.match(/<b>Date:<\/b>\s*([^<\n]+)/)?.[1]?.trim();
      const type = page.match(/<b>Type:<\/b>\s*([^<\n]+)/)?.[1]?.trim();
      const pubs = page.split(/<table class="publications"|<h2>Publications/)[1] ?? '';
      const rows = [...pubs.matchAll(/<tr[^>]*>([\s\S]*?)<\/tr>/g)].map((r) => strip(r[1])).filter((r) => /\d{4}/.test(r)).slice(0, 3);
      out.matches.push({ url: `https://www.isfdb.org/cgi-bin/title.cgi?${id}`, date, type, authors, firstPrintings: rows });
    }
  } catch (e) { out.error = e.message; }
  console.log(JSON.stringify(out));
}
