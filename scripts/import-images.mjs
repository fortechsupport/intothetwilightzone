#!/usr/bin/env node
// Adds sourced pictures to the site (src/lib/images.ts explains the rules).
//
//   node scripts/import-images.mjs <manifest.json>
//
// The manifest is an array of { file, records, role, title, alt, date?, creator, license, license_reason?,
// license_url?, source_url, original_source? } with `file` relative to the manifest's folder. Each picture
// is resized to 640 and 320 px wide WebP under public/media/images/<collection>/ and its credit is merged
// into data/images/images.yaml by id (re-running replaces an entry, never duplicates it). Anything without
// a creator, an accepted license or a source page is refused and listed.
import { readFileSync, writeFileSync, mkdirSync, existsSync } from 'node:fs';
import { dirname, resolve, basename, extname } from 'node:path';
import sharp from 'sharp';
import { parse, stringify } from 'yaml';

const manifestPath = process.argv[2];
if (!manifestPath) { console.error('usage: node scripts/import-images.mjs <manifest.json>'); process.exit(2); }
const base = dirname(resolve(manifestPath));
// Paths in the repository are resolved from the script's own folder, so it can be run from anywhere.
const repo = resolve(dirname(new URL(import.meta.url).pathname), '..');
const items = JSON.parse(readFileSync(manifestPath, 'utf8'));
const OK_LICENSE = /^(Public domain|CC0( 1\.0)?|CC BY(-SA)? [1-4]\.0( [A-Za-z ]+)?)$/;
const sourceName = (u) => /commons\.wikimedia/.test(u) ? 'Wikimedia Commons' : /loc\.gov/.test(u) ? 'Library of Congress' : /archives\.gov/.test(u) ? 'National Archives' : new URL(u).hostname;

const out = resolve(repo, 'data/images/images.yaml');
const existing = existsSync(out) ? (parse(readFileSync(out, 'utf8')) ?? []) : [];
const byId = new Map(existing.map((i) => [i.id, i]));
const refused = [];
for (const m of items) {
  const why = [];
  if (!m.creator) why.push('no creator');
  else if (m.creator.length > 100) why.push('creator credit over 100 characters (move detail to creator_note)');
  if (!OK_LICENSE.test(m.license ?? '')) why.push(`license "${m.license}"`);
  if (!/^https:\/\//.test(m.source_url ?? '')) why.push('no source page');
  if (!m.records?.length) why.push('no record');
  if (!m.alt) why.push('no alt text');
  if (/^CC BY/.test(m.license ?? '') && !m.license_url) why.push('CC license without its link');
  const src = resolve(base, m.file);
  if (!existsSync(src)) why.push('file missing');
  if (why.length) { refused.push(`${m.file}: ${why.join(', ')}`); continue; }
  const collection = m.records[0].split('/')[0];
  const stem = basename(m.file, extname(m.file));
  const id = `${collection}-${stem}`.replace(/[^a-z0-9-]+/gi, '-').toLowerCase();
  const dir = resolve(repo, 'public/media/images', collection);
  mkdirSync(dir, { recursive: true });
  const big = `${dir}/${stem}.webp`, small = `${dir}/${stem}-320.webp`;
  const info = await sharp(src).rotate().resize({ width: 640, withoutEnlargement: true }).webp({ quality: 76 }).toFile(big);
  await sharp(src).rotate().resize({ width: 320, withoutEnlargement: true }).webp({ quality: 74 }).toFile(small);
  const entry = {
    id, src: `/media/images/${collection}/${stem}.webp`, small: `/media/images/${collection}/${stem}-320.webp`,
    width: info.width, height: info.height, records: m.records, role: m.role, title: m.title, alt: m.alt,
    ...(m.date ? { date: String(m.date) } : {}), creator: m.creator, ...(m.creator_note ? { creator_note: m.creator_note } : {}), license: m.license,
    ...(m.license_reason ? { license_reason: m.license_reason } : {}), ...(m.license_url ? { license_url: m.license_url } : {}),
    source_url: m.source_url, source_name: sourceName(m.source_url), ...(m.original_source ? { original_source: m.original_source } : {}),
  };
  byId.set(id, entry);
}
const all = [...byId.values()].sort((a, b) => a.id.localeCompare(b.id));
mkdirSync(dirname(out), { recursive: true });
writeFileSync(out, '# Credited pictures. Written by scripts/import-images.mjs; see src/lib/images.ts for the rules.\n' + stringify(all, { lineWidth: 0 }));
console.log(`${all.length} pictures in data/images/images.yaml (${items.length - refused.length} from this manifest).`);
if (refused.length) { console.log(`Refused ${refused.length}:`); refused.forEach((r) => console.log('  ' + r)); }
