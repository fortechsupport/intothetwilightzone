#!/usr/bin/env node
// Apply Adam's "Mark for removal" decisions from the Moderation page's "Votes below zero" tab.
//
//   1. On /moderation/#q=votes, use "Download removals for decisions.json" (vote-removals-<date>.json).
//   2. node scripts/apply-vote-removals.mjs ~/Downloads/vote-removals-<date>.json
//   3. Commit data/review/decisions.json in a pull request; after it deploys, mark each one "Removal applied".
//
// Each record becomes `exclude` in data/review/decisions.json (the same ledger Adam's other decisions use,
// docs/REVIEW.md), with a note naming the vote. Existing notes are kept after it. Keys are sorted, and the file
// is written the way scripts/review.py writes it.
import { readFileSync, writeFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';

const file = process.argv[2];
if (!file) { console.error('Usage: node scripts/apply-vote-removals.mjs <vote-removals.json>'); process.exit(2); }
const ledgerPath = fileURLToPath(new URL('../data/review/decisions.json', import.meta.url));
const ledger = JSON.parse(readFileSync(ledgerPath, 'utf8'));
const removals = JSON.parse(readFileSync(file, 'utf8'));
const KEY = /^[a-z0-9][a-z0-9-]*(\/[a-z0-9][a-z0-9._-]*)+$/;

let changed = 0;
for (const [key, entry] of Object.entries(removals)) {
  if (!KEY.test(key) || entry?.status !== 'exclude' || typeof entry.notes !== 'string' || !/^\d{4}-\d{2}-\d{2}$/.test(entry.date ?? '')) {
    console.error(`Skipped ${key}: not a removal entry from the Moderation page.`);
    continue;
  }
  const before = ledger[key];
  if (before?.status === 'exclude') { console.log(`Already excluded: ${key}`); continue; }
  const notes = before?.notes ? `${entry.notes}. Before: ${before.status}, "${before.notes}"` : entry.notes;
  ledger[key] = { ...(before ?? {}), status: 'exclude', notes, date: entry.date };
  changed++;
  console.log(`${before ? 'Excluded' : 'Excluded (no earlier decision; check the page is gone after a build)'}: ${key}`);
}
const sorted = Object.fromEntries(Object.keys(ledger).sort().map((k) => [k, ledger[k]]));
writeFileSync(ledgerPath, JSON.stringify(sorted, null, 1) + '\n');
console.log(`${changed} record${changed === 1 ? '' : 's'} marked exclude in data/review/decisions.json.`);
