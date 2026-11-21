// Review workflow: Adam decides record by record what the public site shows.
//
// Decisions live in one ledger, data/review/decisions.json, keyed "<collection>/<id>"
// (for example "books/the-twilight-zone-companion" or "episodes/1959/time-enough-at-last").
// A record with no entry is pending. Keeping decisions out of the record files means research
// threads and the spreadsheet importer never conflict with review work.
//
// Which records a build shows depends on REVIEW_MODE:
//   public  - only records marked include (production)
//   preview - everything except records marked exclude (dev server and preview deploys)
//   all     - every record, excluded ones too
// Unset, it is preview for `astro dev` and Cloudflare Pages preview branches, public otherwise.
import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';

export type ReviewStatus = 'pending' | 'include' | 'exclude';
export interface Decision {
  status: ReviewStatus;
  notes?: string;
  date?: string;
}
export type ReviewMode = 'public' | 'preview' | 'all';

export const LEDGER_PATH = resolve(process.cwd(), 'data/review/decisions.json');

export function reviewMode(): ReviewMode {
  const env = process.env.REVIEW_MODE?.trim().toLowerCase();
  if (env === 'public' || env === 'preview' || env === 'all') return env;
  if (env) throw new Error(`REVIEW_MODE must be public, preview or all (got "${env}")`);
  const branch = process.env.CF_PAGES_BRANCH;
  if (branch && branch !== 'main') return 'preview';
  if (process.env.NODE_ENV !== 'production') return 'preview';
  return 'public';
}

export function loadDecisions(): Record<string, Decision> {
  try {
    return JSON.parse(readFileSync(LEDGER_PATH, 'utf8'));
  } catch (err: any) {
    if (err?.code === 'ENOENT') return {};
    throw new Error(`Could not read ${LEDGER_PATH}: ${err.message}`);
  }
}

export function statusOf(decisions: Record<string, Decision>, key: string): ReviewStatus {
  return decisions[key]?.status ?? 'pending';
}

export function isVisible(status: ReviewStatus, mode: ReviewMode): boolean {
  if (mode === 'all') return true;
  if (mode === 'preview') return status !== 'exclude';
  return status === 'include';
}
