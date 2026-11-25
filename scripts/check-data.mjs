#!/usr/bin/env node
// Checks the content records and the review ledger. Fails (exit 1) on any finding.
//
//   node scripts/check-data.mjs
//
// The build already validates every record against src/content.config.ts. This adds what the
// schema cannot see:
// 1. A person's file name must be the slug of their name, or their credits split into two pages.
// 2. Every decisions.json key must point at a record that exists (renames orphan decisions).
// 3. duplicate_of must point at a record that exists and is not itself a duplicate.
// 4. Two records in one collection must not share a title and year unless one is a duplicate.
// 5. Every record needs at least one source.
// 6. Every hosted picture (data/images/images.yaml) has its file, alt text, a maker, an accepted license and a
//    source page, and points at records that exist (people and organizations may be derived from credits).
import fs from 'node:fs';
import path from 'node:path';
import YAML from 'yaml';

const root = path.resolve(path.dirname(new URL(import.meta.url).pathname), '..');
const content = path.join(root, 'src/content');
const slugify = (t) => t.replace(/['’‘]/g, '').normalize('NFKD').replace(/[̀-ͯ]/g, '').toLowerCase()
  .replace(/&/g, ' and ').replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '') || 'untitled';

const records = new Map();
const findings = [];
const warnings = [];
for (const col of fs.readdirSync(content)) {
  const dir = path.join(content, col);
  if (!fs.statSync(dir).isDirectory()) continue;
  const walk = (d) => fs.readdirSync(d, { withFileTypes: true }).flatMap((e) => e.isDirectory() ? walk(path.join(d, e.name)) : [path.join(d, e.name)]);
  for (const file of walk(dir).filter((f) => /\.ya?ml$/.test(f))) {
    const id = path.relative(dir, file).replace(/\.ya?ml$/, '').split(path.sep).join('/');
    let data;
    try { data = YAML.parse(fs.readFileSync(file, 'utf8')); } catch (e) { findings.push(`${col}/${id}: YAML error ${e.message.split('\n')[0]}`); continue; }
    records.set(`${col}/${id}`, data ?? {});
  }
}

for (const [key, d] of records) {
  const [col, id] = [key.split('/')[0], key.split('/').slice(1).join('/')];
  if (col === 'people' && d.name && slugify(d.name) !== id) findings.push(`${key}: file name should be ${slugify(d.name)}.yaml to match "${d.name}"`);
  if (d.duplicate_of) {
    const target = records.get(d.duplicate_of);
    if (!target) findings.push(`${key}: duplicate_of points at missing ${d.duplicate_of}`);
    else if (target.duplicate_of) findings.push(`${key}: duplicate_of points at another duplicate ${d.duplicate_of}`);
  }
  if (col !== 'connections' && col !== 'series' && !(d.sources?.length) && !d.duplicate_of) {
    findings.push(`${key}: no sources`);
  }
}

const seen = new Map();
for (const [key, d] of records) {
  const col = key.split('/')[0];
  if (d.duplicate_of || ['connections', 'episodes', 'series', 'characters', 'quotes', 'comics', 'magazines'].includes(col)) continue;
  const t = d.title ?? d.name;
  if (!t) continue;
  const y = String(d.year ?? d.release_date ?? d.published ?? '').slice(0, 4);
  const k = `${col}|${slugify(String(t))}|${y}|${slugify(String(d.artist ?? d.authors?.[0] ?? d.publisher ?? d.creator ?? ''))}`;
  if (seen.has(k)) findings.push(`${key}: same title and year as ${seen.get(k)}; mark one duplicate_of the other or tell them apart`);
  else seen.set(k, key);
}

const ledgerFile = path.join(root, 'data/review/decisions.json');
if (fs.existsSync(ledgerFile)) {
  const ledger = JSON.parse(fs.readFileSync(ledgerFile, 'utf8'));
  const derived = new Set(['people', 'organizations', 'submissions']);
  for (const key of Object.keys(ledger)) {
    const col = key.split('/')[0];
    if (derived.has(col)) continue; // people and organizations can be derived from credits
    if (!records.has(key)) findings.push(`decisions.json: ${key} has no record (renamed or deleted?)`);
  }
}

const imagesFile = path.join(root, 'data/images/images.yaml');
if (fs.existsSync(imagesFile)) {
  const imgs = YAML.parse(fs.readFileSync(imagesFile, 'utf8')) ?? [];
  const ids = new Set();
  for (const i of imgs) {
    const at = `images.yaml ${i.id}`;
    if (ids.has(i.id)) findings.push(`${at}: id used twice`); ids.add(i.id);
    for (const f of ['src', 'small']) if (!i[f] || !fs.existsSync(path.join(root, 'public', i[f]))) findings.push(`${at}: ${f} file missing`);
    for (const f of ['alt', 'title', 'creator', 'source_url']) if (!i[f]) findings.push(`${at}: no ${f}`);
    if (!/^(Public domain|CC0( 1\.0)?|CC BY(-SA)? [1-4]\.0( [A-Za-z ]+)?)$/.test(i.license ?? '')) findings.push(`${at}: license "${i.license}" is not public domain or CC0/BY/BY-SA`);
    if (/^CC BY/.test(i.license ?? '') && !i.license_url) findings.push(`${at}: a CC BY license needs its license_url`);
    for (const k of i.records ?? []) {
      if (records.has(k)) continue;
      // People and organizations can exist only as credits; check:site then catches a key with no page.
      if (['people', 'organizations'].includes(k.split('/')[0])) warnings.push(`${at}: ${k} has no record file (fine if it is derived from credits)`);
      else findings.push(`${at}: record ${k} does not exist`);
    }
  }
  console.log(`${imgs.length} pictures checked.`);
}

console.log(`${records.size} records checked.`);
for (const w of warnings) console.log('! ' + w);
for (const f of findings.slice(0, 80)) console.log('✗ ' + f);
if (findings.length > 80) console.log(`… and ${findings.length - 80} more`);
console.log(findings.length ? `${findings.length} findings.` : '✓ No findings.');
process.exit(findings.length ? 1 : 0);
