// Writes migrations/console/all-in-one-line.sql: every migration in migrations/, comments removed, on one line.
// The Cloudflare dashboard's D1 console takes a single line, and a "--" comment there swallows everything after it,
// so docs/ACCOUNTS_SETUP.md tells Adam to paste this file instead of the migrations themselves.
// `node scripts/d1-console-sql.mjs --check` fails if the file is out of date (run in CI).
import { readFileSync, readdirSync, writeFileSync, mkdirSync, existsSync } from 'node:fs';

const dir = 'migrations';
const out = `${dir}/console/all-in-one-line.sql`;

function stripComments(line) {
  let res = '', quoted = false;
  for (let i = 0; i < line.length; i++) {
    if (line[i] === "'") quoted = !quoted;
    if (!quoted && line.startsWith('--', i)) break;
    res += line[i];
  }
  return res.trim();
}

const sql = readdirSync(dir).filter((f) => /^\d{4}_.*\.sql$/.test(f)).sort()
  .map((f) => readFileSync(`${dir}/${f}`, 'utf8').split('\n').map(stripComments).filter(Boolean).join(' '))
  .join(' ').replace(/\s+/g, ' ').trim() + '\n';

if (process.argv.includes('--check')) {
  if (!existsSync(out) || readFileSync(out, 'utf8') !== sql) {
    console.error(`${out} is out of date. Run: node scripts/d1-console-sql.mjs`);
    process.exit(1);
  }
  console.log(`${out} is up to date.`);
} else {
  mkdirSync(`${dir}/console`, { recursive: true });
  writeFileSync(out, sql);
  console.log(`Wrote ${out} (${sql.length} characters).`);
}
