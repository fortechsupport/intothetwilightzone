// Pictures on record pages (Adam, 2026-11-25: "images to supplement the content on each and every page",
// limited to what can be used without the rights holders' permission). Data: data/images/images.yaml,
// written by scripts/import-images.mjs from a sourcing pass. Every image is public domain or Creative
// Commons as its source page states, is hosted under public/media/images/, and carries its full credit:
// title, creator, license with the license's own reason or link, and the source page. Episode frames,
// logos, title cards, posters and covers are never used (decision 0007).
import { readFileSync, existsSync } from 'node:fs';
import { resolve } from 'node:path';
import { parse } from 'yaml';

export interface SiteImage {
  id: string;            // file stem, unique: "people-rod-serling"
  src: string;           // /media/images/people/rod-serling.webp (640 px wide at most)
  small: string;         // the 320 px copy
  width: number;
  height: number;
  records: string[];     // record keys it shows; the first is its main subject
  role: 'portrait' | 'publicity' | 'place' | 'organization';
  title: string;
  alt: string;
  date?: string;
  creator: string;
  creator_note?: string; // more about the maker or distributor, shown on the credits page
  license: string;       // "Public domain", "CC BY-SA 4.0"
  license_reason?: string;
  license_url?: string;
  source_url: string;    // the file page the license comes from
  source_name: string;   // "Wikimedia Commons", "Library of Congress"
  original_source?: string;
}

let cache: SiteImage[] | undefined;
export function allImages(): SiteImage[] {
  if (cache) return cache;
  const f = resolve(process.cwd(), 'data/images/images.yaml');
  cache = existsSync(f) ? ((parse(readFileSync(f, 'utf8')) ?? []) as SiteImage[]) : [];
  return cache;
}

let byRecord: Map<string, SiteImage[]> | undefined;
/** Images that show a record, its own main-subject pictures first. */
export function imagesFor(key: string | undefined): SiteImage[] {
  if (!key) return [];
  if (!byRecord) {
    byRecord = new Map();
    for (const img of allImages()) for (const k of img.records) {
      const l = byRecord.get(k) ?? [];
      l.push(img);
      byRecord.set(k, l);
    }
  }
  const l = byRecord.get(key) ?? [];
  return [...l.filter((i) => i.records[0] === key), ...l.filter((i) => i.records[0] !== key)];
}

/** "Public domain" licenses are linked to the source page that explains them; CC ones to the license deed. */
export const licenseHref = (i: SiteImage) => i.license_url ?? i.source_url;
