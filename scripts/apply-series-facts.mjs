// Applies data/research/television-2026-11-21/series-facts.json to the films records: network, run dates,
// seasons, episode count, creators, hosts, country, and sourced Twilight Zone ties, each with the article as a
// source. Edits the YAML in place with the yaml package so comments and order are kept. Safe to run twice.
import { readFileSync, writeFileSync } from 'node:fs';
import { parseDocument, Scalar } from 'yaml';
const facts = JSON.parse(readFileSync('data/research/television-2026-11-21/series-facts.json', 'utf8'));
for (const [id, f] of Object.entries(facts)) {
  if (id.startsWith('_')) continue;
  const path = `src/content/films/${id}.yaml`;
  const doc = parseDocument(readFileSync(path, 'utf8'));
  const src = () => ({ title: `Wikipedia: ${f.article}`, url: f.url, publisher: 'Wikipedia' });
  const quoted = (v) => { const n = new Scalar(v); n.type = Scalar.QUOTE_SINGLE; return n; };
  for (const k of ['network', 'seasons', 'episode_count', 'country']) if (f[k] !== undefined) doc.set(k, f[k]);
  for (const k of ['release_date', 'end_date']) if (f[k] !== undefined) doc.set(k, quoted(f[k]));
  for (const k of ['created_by', 'presented_by']) if (f[k]?.length) doc.set(k, f[k]);
  if (f.ties?.length) doc.set('ties', f.ties.map((text) => ({ text, sources: [src()] })));
  const sources = doc.get('sources')?.toJSON?.() ?? [];
  if (!sources.some((s) => s.url === f.url)) doc.addIn(['sources'], src());
  doc.set('last_verified', quoted('2026-11-21'));
  writeFileSync(path, doc.toString({ lineWidth: 0, indentSeq: false, aliasDuplicateObjects: false }));
  console.log('updated', id);
}
