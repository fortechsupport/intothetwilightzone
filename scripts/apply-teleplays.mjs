#!/usr/bin/env node
// Television research round 1 (docs/plans/research-television.md, step 2): add Rod Serling's television plays as
// pending film records, each an entry on the page of the series it aired in (decision 0002).
//
//   node scripts/apply-teleplays.mjs data/research/television-2026-11-21/teleplays.json [--dry]
//
// Input: [{ title, series, date (YYYY-MM-DD or YYYY), summary?, directors?, cast?, credit?, sources: [{title, url,
// publisher?, author?}] }]. A play already on file (same title on the same series, ignoring "The" and any
// parenthetical) is skipped and listed, never overwritten. New records start pending: they are tagged
// research-2026-11-21 and teleplay, and each gets an assessment block appended to
// data/review/assessment-overrides.yaml (append only; never re-dump that file).
import fs from 'node:fs';
import path from 'node:path';
import { parseDocument, Document, Scalar } from 'yaml';
import { normShow, showSlug } from '../src/lib/tv-shows.mjs';

const [input, ...flags] = process.argv.slice(2);
const dry = flags.includes('--dry');
if (!input) { console.error('usage: node scripts/apply-teleplays.mjs <teleplays.json> [--dry]'); process.exit(1); }
const plays = JSON.parse(fs.readFileSync(input, 'utf8'));
const dir = 'src/content/films';
const key = (t) => String(t).toLowerCase().replace(/\s*\([^)]*\)\s*/g, ' ').replace(/^(the|a|an) /, '').replace(/[^a-z0-9]+/g, ' ').trim();
const existing = new Map();
for (const f of fs.readdirSync(dir).filter((x) => x.endsWith('.yaml'))) {
  const d = parseDocument(fs.readFileSync(path.join(dir, f), 'utf8')).toJS();
  existing.set(`${showSlug(normShow(d.parent_series ?? ''))}|${key(d.title)}`, f);
  if (!d.parent_series) existing.set(`|${key(d.title)}`, f);
}
const q = (v) => { const s = new Scalar(String(v)); s.type = Scalar.QUOTE_SINGLE; return s; };
const slugify = (s) => s.normalize('NFKD').replace(/[̀-ͯ]/g, '').toLowerCase().replace(/['’]/g, '').replace(/&/g, ' and ').replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '');
const added = []; const skipped = []; let overrides = '';
for (const p of plays) {
  const k = `${showSlug(normShow(p.series))}|${key(p.title)}`;
  if (existing.has(k)) { skipped.push(`${p.title} (${p.series}) = ${existing.get(k)}`); continue; }
  if (!p.sources?.length) { skipped.push(`${p.title} (${p.series}): no source`); continue; }
  let id = slugify(`${p.title}-${String(p.date).slice(0, 4)}-teleplay`);
  while (fs.existsSync(path.join(dir, `${id}.yaml`))) id += '-2';
  const rec = {
    title: p.title,
    kind: 'tv-episode',
    parent_series: p.series,
    ...(p.summary ? { summary: p.summary } : {}),
    release_date: q(p.date),
    writers: ['Rod Serling'],
    ...(p.credit ? { writing_credit_note: p.credit } : {}),
    ...(p.directors?.length ? { directors: p.directors } : {}),
    ...(p.cast?.length ? { cast: p.cast } : {}),
    sources: p.sources.map((s) => ({ title: s.title, url: s.url, ...(s.author ? { author: s.author } : {}), ...(s.publisher ? { publisher: s.publisher } : {}) })),
    research_confidence: p.sources.length > 1 ? 'high' : 'medium',
    relevance: 'related',
    tags: ['teleplay', 'research-2026-11-21', 'television-round-1'],
    last_verified: q('2026-11-21'),
  };
  const doc = new Document(rec, { aliasDuplicateObjects: false });
  const text = doc.toString({ indentSeq: false, lineWidth: 0 });
  added.push(`${id}: ${p.title} (${p.series}, ${p.date})`);
  overrides += `films/${id}:\n  connection: A television play by Rod Serling${p.series ? ` for ${p.series}` : ''}, ${String(p.date).slice(0, 4)}, from the career that led to The Twilight Zone.\n  tier: related\n  tier_reason: Serling's own work outside the series; Adam's scope covers all things Rod Serling.\n  recommendation: include\n  reason: Credited to Serling in ${p.sources[0].publisher ?? p.sources[0].title}; it completes his body of work on his page and the series page.\n  subcategory: Rod Serling's series\n`;
  if (!dry) fs.writeFileSync(path.join(dir, `${id}.yaml`), text);
}
if (!dry && overrides) fs.appendFileSync('data/review/assessment-overrides.yaml', `\n# Television research round 1 (Serling's plays), 2026-11-21\n${overrides}`);
console.log(`${dry ? '[dry] ' : ''}added ${added.length}, skipped ${skipped.length}`);
for (const a of added) console.log('  + ' + a);
for (const s of skipped) console.log('  = ' + s);
