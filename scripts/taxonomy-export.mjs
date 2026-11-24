#!/usr/bin/env node
// Writes data/review/taxonomy.json: every record's places in the site taxonomy, computed with the
// same rules the site uses (src/lib/taxonomy.mjs), for the review spreadsheet.
//   node scripts/taxonomy-export.mjs
import { readFileSync, readdirSync, statSync, writeFileSync } from 'node:fs';
import { join, relative, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import YAML from 'yaml';
import { TAXONOMY, place, placePerson, explicitPlacements, subTitleFromSlug, contentOf, contentParents, isOfficial, SERIES_LABEL } from '../src/lib/taxonomy.mjs';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');
const CONTENT = join(ROOT, 'src/content');
const slugify = (t) => String(t).replace(/['’‘]/g, '').normalize('NFKD').replace(/[̀-ͯ]/g, '').toLowerCase().replace(/&/g, ' and ').replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '') || 'untitled';

function walk(dir) {
  let out = [];
  for (const n of readdirSync(dir)) {
    const p = join(dir, n);
    if (statSync(p).isDirectory()) out = out.concat(walk(p));
    else if (n.endsWith('.yaml')) out.push(p);
  }
  return out;
}
const db = {};
for (const col of readdirSync(CONTENT)) {
  if (!statSync(join(CONTENT, col)).isDirectory()) continue;
  db[col] = walk(join(CONTENT, col)).map((f) => ({ id: relative(join(CONTENT, col), f).replace(/\.yaml$/, ''), data: YAML.parse(readFileSync(f, 'utf8')) ?? {} }));
}
let assessments = {};
try { assessments = JSON.parse(readFileSync(join(ROOT, 'data/review/assessments.json'), 'utf8')); } catch {}
const connFrom = new Map();
for (const c of db.connections ?? []) {
  if (!connFrom.has(c.data.from)) connFrom.set(c.data.from, []);
  connFrom.get(c.data.from).push(c.data.kind);
}
const ctx = { assessSub: (k) => assessments[k]?.subcategory, connKinds: (k) => connFrom.get(k) ?? [] };

// Credit roles per person, as src/lib/data.ts allPeople() derives them.
const creditRoles = new Map();
const addRole = (name, role) => {
  if (!name) return;
  const s = slugify(String(name).trim());
  if (!creditRoles.has(s)) creditRoles.set(s, new Set());
  creditRoles.get(s).add(role);
};
for (const e of db.episodes ?? []) {
  const d = e.data;
  (d.writers ?? []).forEach((n) => addRole(n, 'Writer'));
  (d.source_authors ?? []).forEach((n) => addRole(n, 'Source story'));
  (d.directors ?? []).forEach((n) => addRole(n, 'Director'));
  (d.cast ?? []).forEach((n) => addRole(n, 'Cast'));
  addRole(d.narrator, 'Narrator');
}
for (const f of db.films ?? []) {
  const d = f.data;
  (d.writers ?? []).forEach((n) => addRole(n, 'Writer'));
  (d.directors ?? []).forEach((n) => addRole(n, 'Director'));
  (d.cast ?? []).forEach((n) => addRole(n, 'Cast'));
  for (const sg of d.segments ?? []) {
    (sg.writers ?? []).forEach((n) => addRole(n, 'Writer'));
    (sg.directors ?? []).forEach((n) => addRole(n, 'Director'));
    (sg.cast ?? []).forEach((n) => addRole(n, 'Cast'));
  }
}
for (const r of db.radio ?? []) {
  String(r.data.adapted_by ?? '').split(/,\s*/).forEach((n) => addRole(n, 'Radio adaptation'));
  (r.data.voiced_by ?? []).forEach((n) => addRole(n, 'Radio cast'));
}
const COMIC_ROLE = { writer: 'Comics writer', artist: 'Comics artist', cover: 'Cover artist', inker: 'Inker', editor: 'Editor', colorist: 'Colorist' };
for (const c of db.comics ?? []) {
  for (const raw of c.data.creators ?? []) {
    const m = String(raw).trim().match(/^(.*?)\s*\(([^)]*)\)\s*$/);
    const name = m ? m[1] : raw;
    const roles = m ? m[2].split(/\s*,\s*/).map((r) => r.toLowerCase()) : ['creator'];
    for (const r of roles) addRole(name, COMIC_ROLE[r] ?? 'Comics creator');
  }
}
const quoted = new Set((db.quotes ?? []).map((q) => slugify(q.data.person)));

const CAT = Object.fromEntries(TAXONOMY.map((c) => [c.slug, c]));
const label = ({ cat, sub, group, official }) => {
  if (cat === 'content') return { cat, sub, group: group ?? null, catTitle: 'Content (shown on other records)', subTitle: sub, isNew: false, official: official ?? null };
  const c = CAT[cat];
  const s = c?.subs.find((x) => x.slug === sub);
  return {
    cat, sub, group: group ?? null,
    catTitle: c?.title ?? subTitleFromSlug(cat),
    subTitle: s?.title ?? subTitleFromSlug(sub),
    isNew: !c || !!c.isNew || !s || !!s.isNew,
    official: official ?? null,
  };
};
// Titles for the records content is attached to (the site resolves these fully; this is for the sheet).
const byKey = new Map();
for (const [col, recs] of Object.entries(db)) for (const r of recs) byKey.set(`${col}/${r.id}`, r.data);
const titleIdx = new Map();
const nt = (t) => String(t ?? '').toLowerCase().replace(/^(the|a|an)\s+/, '').replace(/[^a-z0-9]+/g, ' ').trim();
for (const [k, d] of byKey) { const t = d.title ?? d.name; if (t && !titleIdx.has(nt(t))) titleIdx.set(nt(t), k); }
const parentTitle = (ref) => {
  if (ref.startsWith('org:')) return ref.slice(4);
  if (ref.startsWith('person:')) return ref.slice(7);
  if (/^\d{4}\//.test(ref)) return byKey.get(`episodes/${ref}`)?.title ?? ref;
  const m = ref.match(/^series[ /](\d{4})/i);
  if (m) return SERIES_LABEL[m[1]] ?? ref;
  if (/^seasons? \d/i.test(ref)) return undefined;
  if (/^[a-z]+\/[a-z0-9-]/.test(ref)) { const d = byKey.get(ref); return d ? d.title ?? d.name : ref.startsWith('people/') ? ref.slice(7).replace(/-/g, ' ') : ref; }
  const k = titleIdx.get(nt(ref));
  return k ? byKey.get(k).title ?? byKey.get(k).name : ref;
};
const out = {};
for (const [col, recs] of Object.entries(db)) {
  for (const r of recs) {
    const key = `${col}/${r.id}`;
    let placed;
    if (col === 'people') {
      const roles = (r.data.roles ?? []).filter((x) => typeof x === 'string');
      for (const c of r.data.tz_credits ?? []) if (c.role) roles.push(c.role);
      placed = placePerson({ roles, creditRoles: [...(creditRoles.get(r.id) ?? [])], quoted: quoted.has(r.id), isSerling: r.id === 'rod-serling' }).map((sub) => ({ cat: 'people', sub }));
      if (placed.some((p) => p.sub === 'composers')) placed.push({ cat: 'music', sub: 'composers' });
    } else placed = place(col, r.id, r.data, ctx);
    placed = placed.concat(explicitPlacements(r.data));
    const why = assessments[key]?.connection;
    placed = placed.map((p) => ({ ...p, official: isOfficial(col, r.data, p, { why }) }));
    const content = contentOf(col, r.data);
    if (content) {
      const on = [...new Set(contentParents(col, r.data).map(parentTitle).filter(Boolean))];
      placed.unshift({ cat: 'content', sub: content.label, group: on.length ? `On: ${on.join('; ')}` : 'Not yet attached', official: placed[0]?.official });
    }
    const seen = new Set();
    out[key] = placed.filter((p) => !seen.has(`${p.cat}/${p.sub}`) && seen.add(`${p.cat}/${p.sub}`)).map(label);
    // Records the site shows nowhere on a shelf, by design, say where they are instead of looking unplaced.
    if (r.data.duplicate_of) out[key] = [{ cat: 'duplicate', sub: 'duplicate', catTitle: 'Duplicate (hidden on the site)', subTitle: `Duplicate of ${r.data.duplicate_of}`, group: null, isNew: false, official: null }];
    else if (!out[key].length && col === 'radio' && r.data.series_title) out[key] = [{ cat: 'radio', sub: 'series-page', catTitle: 'Radio', subTitle: `${r.data.series_title}: series page, broadcast and release history`, group: null, isNew: false, official: true }];
  }
}
writeFileSync(join(ROOT, 'data/review/taxonomy.json'), JSON.stringify(out, null, 1) + '\n');
const unplaced = Object.entries(out).filter(([, v]) => !v.length).map(([k]) => k);
console.log(`Wrote data/review/taxonomy.json: ${Object.keys(out).length} records${unplaced.length ? `, ${unplaced.length} not placed: ${unplaced.slice(0, 8).join(', ')}` : ''}`);
