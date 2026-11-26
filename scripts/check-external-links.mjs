#!/usr/bin/env node
// Checks every link to another website in the built site and reports the ones that are gone.
//
//   npm run build && node scripts/check-external-links.mjs [dist] [report.md]
//
// Run weekly and on demand by .github/workflows/external-links.yml, where the network is open (cloud sessions can
// only reach a few hosts). A link counts as broken when the site answers 404 or 410, or when its host no longer
// exists. 401, 403, 429 and other refusals are listed separately as "could not check": many sites turn away
// automated readers, and that says nothing about the page. English Wikipedia links are checked in batches of 50
// through its API, so a missing article is caught without loading 2,000 pages. The run always succeeds; the report
// is the result (the job summary, and report.md as a run artifact).
import { readdir, readFile, writeFile } from 'node:fs/promises';
import { join, relative } from 'node:path';

const dist = process.argv[2] ?? 'dist';
const reportPath = process.argv[3] ?? 'external-links-report.md';
const SKIP = /^https?:\/\/((www\.)?intothetwilightzone\.com|[a-z0-9-]+\.intothetwilightzone-preview\.pages\.dev|github\.com\/fortechsupport\/intothetwilightzone)(\/|$)/i;
const UA = 'IntoTheTwilightZone link checker (non-commercial fan site; weekly check for dead links)';

async function htmlFiles(dir) {
  const out = [];
  for (const e of await readdir(dir, { withFileTypes: true })) {
    const p = join(dir, e.name);
    if (e.isDirectory()) out.push(...(await htmlFiles(p)));
    else if (e.name.endsWith('.html')) out.push(p);
  }
  return out;
}

const decode = (s) => s.replace(/&amp;/g, '&').replace(/&#39;/g, "'").replace(/&quot;/g, '"');
const pagesFor = new Map(); // url -> [page paths]
for (const f of await htmlFiles(dist)) {
  const html = (await readFile(f, 'utf8')).replace(/<script[\s\S]*?<\/script>/g, '');
  const page = '/' + relative(dist, f).replace(/index\.html$/, '').replace(/\\/g, '/');
  for (const m of html.matchAll(/<a\b[^>]*\shref="(https?:\/\/[^"]+)"/g)) {
    const url = decode(m[1]);
    if (SKIP.test(url)) continue;
    if (!pagesFor.has(url)) pagesFor.set(url, []);
    const list = pagesFor.get(url);
    if (!list.includes(page)) list.push(page);
  }
}
const urls = [...pagesFor.keys()];
console.log(`${urls.length} distinct links to other websites.`);

const broken = []; // { url, why }
const unchecked = []; // { url, why }

// English Wikipedia: ask the API which titles are missing.
const WIKI = /^https?:\/\/en\.wikipedia\.org\/wiki\/([^#?]+)/;
const wikiUrls = urls.filter((u) => WIKI.test(u));
const titleOf = (u) => decodeURIComponent(WIKI.exec(u)[1]).replace(/_/g, ' ');
for (let i = 0; i < wikiUrls.length; i += 50) {
  const batch = wikiUrls.slice(i, i + 50);
  const titles = [...new Set(batch.map(titleOf))];
  try {
    const r = await fetch('https://en.wikipedia.org/w/api.php?action=query&format=json&formatversion=2&redirects=1&titles=' + encodeURIComponent(titles.join('|')), { headers: { 'User-Agent': UA } });
    const d = await r.json();
    const norm = new Map((d.query?.normalized ?? []).map((n) => [n.from, n.to]));
    const missing = new Set((d.query?.pages ?? []).filter((p) => p.missing || p.invalid).map((p) => p.title));
    const redir = new Map((d.query?.redirects ?? []).map((n) => [n.from, n.to]));
    for (const u of batch) {
      const t = titleOf(u); const n = norm.get(t) ?? t;
      if (missing.has(redir.get(n) ?? n)) broken.push({ url: u, why: 'no such Wikipedia article', wiki: t });
    }
  } catch (e) { batch.forEach((u) => unchecked.push({ url: u, why: 'Wikipedia API: ' + e.message })); }
}

// Everything else: one request per link, a few at a time and at most two at once per site.
const rest = urls.filter((u) => !WIKI.test(u));
const busy = new Map();
async function check(url) {
  const host = new URL(url).host;
  while ((busy.get(host) ?? 0) >= 2) await new Promise((r) => setTimeout(r, 100));
  busy.set(host, (busy.get(host) ?? 0) + 1);
  try {
    let r;
    for (const method of ['HEAD', 'GET']) {
      r = await fetch(url, { method, redirect: 'follow', headers: { 'User-Agent': UA, Accept: 'text/html,*/*' }, signal: AbortSignal.timeout(20000) });
      if (method === 'GET') r.body?.cancel();
      if (r.status !== 405 && r.status !== 404 && r.status < 500) break; // some sites answer HEAD wrongly: try GET
    }
    if (r.status === 404 || r.status === 410) broken.push({ url, why: `HTTP ${r.status}` });
    else if (r.status >= 400) unchecked.push({ url, why: `HTTP ${r.status}` });
  } catch (e) {
    const code = e.cause?.code ?? e.name;
    if (code === 'ENOTFOUND') broken.push({ url, why: 'site no longer exists (DNS)' });
    else unchecked.push({ url, why: code });
  } finally { busy.set(host, busy.get(host) - 1); }
}
let next = 0;
await Promise.all(Array.from({ length: 16 }, async () => { while (next < rest.length) await check(rest[next++]); }));

// For each broken link, suggest a replacement: the closest Wikipedia article for a missing one, and otherwise the
// Wayback Machine's latest copy, if it has one. Suggestions are reported, never applied: a person checks each one.
for (const b of broken) {
  try {
    if (b.wiki) {
      const r = await fetch('https://en.wikipedia.org/w/api.php?action=opensearch&format=json&limit=1&search=' + encodeURIComponent(b.wiki), { headers: { 'User-Agent': UA } });
      const [, , , links] = await r.json();
      if (links?.[0]) b.suggest = links[0];
    } else {
      const r = await fetch('https://archive.org/wayback/available?url=' + encodeURIComponent(b.url), { headers: { 'User-Agent': UA }, signal: AbortSignal.timeout(20000) });
      const snap = (await r.json()).archived_snapshots?.closest;
      if (snap?.available && snap.status === '200') b.suggest = snap.url.replace(/^http:/, 'https:');
    }
  } catch { /* no suggestion */ }
}
await writeFile(reportPath.replace(/\.md$/, '') + '.json', JSON.stringify(broken, null, 1));
const row = (x) => `| ${x.url} | ${x.why}${x.suggest ? ` (try ${x.suggest})` : ''} | ${pagesFor.get(x.url).slice(0, 3).join(' ')}${pagesFor.get(x.url).length > 3 ? ` (+${pagesFor.get(x.url).length - 3})` : ''} |`;
const byHost = (a, b) => a.url.localeCompare(b.url);
const md = [
  `# Links to other websites: ${new Date().toISOString().slice(0, 10)}`,
  '',
  `${urls.length} distinct links checked: ${broken.length} broken, ${unchecked.length} could not be checked (the site refused an automated reader or did not answer).`,
  '',
  '## Broken',
  '',
  '| Link | Why | On pages |', '|---|---|---|',
  ...broken.sort(byHost).map(row),
  '',
  '## Could not check',
  '',
  '| Link | Why | On pages |', '|---|---|---|',
  ...unchecked.sort(byHost).map(row),
  '',
].join('\n');
await writeFile(reportPath, md);
for (const b of broken) console.log(`BROKEN ${b.why}: ${b.url}${b.suggest ? `  TRY ${b.suggest}` : ''}  (${pagesFor.get(b.url).slice(0, 2).join(' ')})`);
console.log(`${broken.length} broken, ${unchecked.length} could not be checked, of ${urls.length}. Report: ${reportPath}`);
