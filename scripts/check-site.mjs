#!/usr/bin/env node
// Checks the built site in dist/ for the slips a reader would notice. Fails (exit 1) on any finding.
//
//   node scripts/check-site.mjs [distDir]
//
// 1. Broken internal links: every href="/..." and src="/..." must resolve to a built file, a
//    redirect in public/_redirects, an astro.config.mjs redirect stub, or a GET route of the accounts API.
// 2. Duplicate page titles: no two pages (redirect stubs excluded) share a <title>.
// 3. Every page has exactly one <h1>, a <title>, a meta description and lang="en", and its headings inside <main>
//    start at h1 and never skip a level (h2 to h4), so a screen reader's outline has no holes.
// 4. Repeated roles in a person's role line ("Writer · ... · writer").
// 5. Page weight: no public page over 1.5 MB of HTML (the preview-only review queue is exempt); pages over
//    300 KB are listed as warnings, the target in the Seymour quality plan.
// 6. Link rule (Adam, 2026-11-21): every link to another website opens in a new tab with
//    rel="noopener noreferrer" and the "opens in a new tab" note; no link within the site opens a new tab.
import fs from 'node:fs';
import path from 'node:path';
import { isExternal } from '../integrations/external-links.mjs';

const dist = path.resolve(process.argv[2] ?? 'dist');
const MAX_HTML = 1536 * 1024;
const WARN_HTML = 300 * 1024;
const warnings = [];
const WEIGHT_EXEMPT = new Set(['/review/']);

function walk(dir, out = []) {
  for (const e of fs.readdirSync(dir, { withFileTypes: true })) {
    const p = path.join(dir, e.name);
    if (e.isDirectory()) walk(p, out);
    else out.push(p);
  }
  return out;
}

const files = walk(dist);
const fileSet = new Set(files.map((f) => '/' + path.relative(dist, f).split(path.sep).join('/')));
const htmlFiles = files.filter((f) => f.endsWith('.html'));

const redirects = new Set();
const redirectsFile = path.join(dist, '_redirects');
if (fs.existsSync(redirectsFile)) {
  for (const line of fs.readFileSync(redirectsFile, 'utf8').split('\n')) {
    const from = line.trim().split(/\s+/)[0];
    if (from && !from.startsWith('#')) redirects.add(from.replace(/\*$/, ''));
  }
}

// Links into the accounts API (functions/api) are served at run time, not built: they resolve when
// server/router.ts registers a GET route for the exact path.
const apiGets = new Set([...fs.readFileSync(path.resolve(dist, '..', 'server', 'router.ts'), 'utf8')
  .matchAll(/on\('GET', '([^']+)'/g)].map((m) => m[1]));

function resolves(url) {
  let u = url.split('#')[0].split('?')[0];
  if (!u || u === '/') return true;
  if (u.startsWith('/api/')) return apiGets.has(u);
  try { u = decodeURI(u); } catch { /* keep as is */ }
  if (fileSet.has(u)) return true;
  if (fileSet.has(u.replace(/\/$/, '') + '/index.html')) return true;
  if (fileSet.has(u + '.html')) return true;
  if (redirects.has(u) || redirects.has(u.replace(/\/$/, '')) || redirects.has(u.endsWith('/') ? u : u + '/')) return true;
  for (const r of redirects) if (r.endsWith('/') && r.length > 1 && u.startsWith(r) && [...redirects].some((x) => x === r)) {
    // splat rules such as /old/* are stored without the star
    if (fs.readFileSync(redirectsFile, 'utf8').includes(r + '*')) return true;
  }
  return false;
}

const findings = { links: [], titles: [], structure: [], roles: [], weight: [], tabs: [] };
const titles = new Map();

for (const file of htmlFiles) {
  const rel = '/' + path.relative(dist, file).split(path.sep).join('/');
  const pageUrl = rel.replace(/index\.html$/, '');
  const html = fs.readFileSync(file, 'utf8');
  const isRedirect = /<meta http-equiv="refresh"/i.test(html) && /<title>Redirecting to/i.test(html);
  if (isRedirect) continue;
  if (rel.startsWith('/pagefind/')) continue;

  const title = /<title>([^<]*)<\/title>/.exec(html)?.[1]?.trim();
  if (!title) findings.structure.push(`${pageUrl}: no <title>`);
  else titles.set(title, [...(titles.get(title) ?? []), pageUrl]);
  const h1s = (html.match(/<h1[\s>]/g) ?? []).length;
  if (h1s !== 1) findings.structure.push(`${pageUrl}: ${h1s} <h1> elements`);
  const mainHtml = (/<main[\s\S]*?<\/main>/.exec(html)?.[0] ?? '').replace(/<(template|script)[\s\S]*?<\/\1>/g, '');
  const levels = [...mainHtml.matchAll(/<h([1-6])\b/g)].map((m) => +m[1]);
  const skip = levels.findIndex((l, i) => (i === 0 ? l !== 1 : l > levels[i - 1] + 1));
  if (skip >= 0) findings.structure.push(`${pageUrl}: heading outline ${skip === 0 ? `starts at h${levels[0]}` : `jumps from h${levels[skip - 1]} to h${levels[skip]}`}`);
  if (!/<meta name="description" content="[^"]+"/.test(html)) findings.structure.push(`${pageUrl}: no meta description`);
  if (!/<html lang="en"/.test(html)) findings.structure.push(`${pageUrl}: no lang="en"`);

  // Links: skip inline scripts and JSON so client templates are not read as links.
  const body = html.replace(/<script[\s\S]*?<\/script>/g, '');
  for (const m of body.matchAll(/\s(?:href|src)="(\/[^"]*)"/g)) {
    const url = m[1].replace(/&amp;/g, '&');
    if (url.startsWith('//')) continue;
    if (!resolves(url)) findings.links.push(`${pageUrl} -> ${url}`);
  }

  let ext = 0;
  for (const [tag] of body.matchAll(/<a\b[^>]*>/g)) {
    const href = /\shref="([^"]*)"/.exec(tag)?.[1];
    if (href === undefined) continue;
    const blank = /\starget="_blank"/.test(tag);
    if (isExternal(href)) {
      ext++;
      const rel = /\srel="([^"]*)"/.exec(tag)?.[1]?.split(/\s+/) ?? [];
      if (!blank || !rel.includes('noopener') || !rel.includes('noreferrer') || !/\saria-describedby="[^"]*ext-note/.test(tag)) findings.tabs.push(`${pageUrl}: ${href.slice(0, 80)} should open in a new tab, with noopener noreferrer and the note`);
    } else if (/\starget=/.test(tag)) findings.tabs.push(`${pageUrl}: internal link ${href.slice(0, 80)} sets a target`);
  }
  if (ext && !/<span id="ext-note" hidden>/.test(html)) findings.tabs.push(`${pageUrl}: external links but no #ext-note`);

  if (pageUrl.startsWith('/people/') && pageUrl !== '/people/') {
    const line = /<p class="record-roles"[^>]*>([^<]*)<\/p>/.exec(html)?.[1];
    if (line) {
      const roles = line.split(' · ').map((r) => r.trim().toLowerCase().replace(/s$/, ''));
      const dup = roles.filter((r, i) => roles.indexOf(r) !== i);
      if (dup.length) findings.roles.push(`${pageUrl}: role repeated (${[...new Set(dup)].join(', ')})`);
    }
  }

  const size = Buffer.byteLength(html);
  if (WEIGHT_EXEMPT.has(pageUrl)) continue;
  if (size > MAX_HTML) findings.weight.push(`${pageUrl}: ${(size / 1024).toFixed(0)} KB`);
  else if (size > WARN_HTML) warnings.push(`${pageUrl}: ${(size / 1024).toFixed(0)} KB (target 300 KB)`);
}

for (const [t, urls] of titles) if (urls.length > 1) findings.titles.push(`"${t}" on ${urls.length} pages: ${urls.slice(0, 4).join(', ')}${urls.length > 4 ? ' …' : ''}`);

// Every record a picture is filed under (data/images/images.yaml) must have a page, or the picture never shows.
const imagesYaml = path.resolve('data/images/images.yaml');
findings.pictures = [];
if (fs.existsSync(imagesYaml)) {
  for (const m of fs.readFileSync(imagesYaml, 'utf8').matchAll(/^\s+- ([a-z]+\/[a-z0-9/-]+)$/gm)) {
    const [c, ...rest] = m[1].split('/');
    const page = `/${c === 'locations' ? 'places' : c}/${rest.join('/')}/index.html`;
    if (!fileSet.has(page)) findings.pictures.push(`${m[1]}: no page at ${page.replace(/index\.html$/, '')}`);
  }
}

let failed = 0;
const LABELS = { pictures: 'Pictures filed under records with no page', links: 'Broken internal links', titles: 'Duplicate page titles', structure: 'Page structure', roles: 'Repeated roles', weight: 'Pages over the size budget', tabs: 'Link rule (external new tab, internal same tab)' };
for (const [k, list] of Object.entries(findings)) {
  const uniq = [...new Set(list)];
  console.log(`${uniq.length ? '✗' : '✓'} ${LABELS[k]}: ${uniq.length}`);
  for (const f of uniq.slice(0, 40)) console.log('   ' + f);
  if (uniq.length > 40) console.log(`   … and ${uniq.length - 40} more`);
  failed += uniq.length;
}
for (const w of warnings) console.log(`! Heavy page: ${w}`);
console.log(`${htmlFiles.length} HTML files checked.`);
process.exit(failed ? 1 : 0);
