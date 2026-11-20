// Per-record explanations written by scripts/assess.py into data/review/assessments.json:
// how each record connects to The Twilight Zone, its relevance tier, a recommendation for Adam's
// review, the best source, a readable title, its subcategory and an alphabetical sort key.
// Run `npm run assess` after changing content so these stay in step.
import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';

export interface Assessment {
  connection: string;
  tier: 'core' | 'related' | 'tangential';
  tier_reason: string;
  recommendation: 'include' | 'maybe' | 'exclude';
  reason: string;
  source_title: string;
  source_url: string;
  title: string;
  subcategory: string;
  sort: string;
}

let cache: Record<string, Assessment> | undefined;
export function assessments(): Record<string, Assessment> {
  if (!cache) {
    try {
      cache = JSON.parse(readFileSync(resolve(process.cwd(), 'data/review/assessments.json'), 'utf8'));
    } catch {
      cache = {};
    }
  }
  return cache!;
}
export const assess = (key: string): Assessment | undefined => assessments()[key];

export const TIER_LABEL: Record<string, string> = { core: 'Core', related: 'Related', tangential: 'Tangential' };
