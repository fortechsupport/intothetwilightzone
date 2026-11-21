// Where to watch a show in the United States (Adam, 2026-11-21). Data: data/fan/watch.yaml, read from each
// show's JustWatch US page. Every series, show and episode page shows it; lists show it once beside a
// show's name. A show we have not checked gets plain search links to JustWatch and Reelgood instead.
import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { parse } from 'yaml';
import { normShow, showSlug } from './tv-shows.mjs';

export interface Watch { justwatch: string; checked: string | null; fetched: string; stream: string[]; free: string[]; buy: string[] }
export interface WatchInfo { name: string; w?: Watch; search: { justwatch: string; reelgood: string } }

let cache: Record<string, Watch> | undefined;
const all = () => (cache ??= parse(readFileSync(resolve(process.cwd(), 'data/fan/watch.yaml'), 'utf8')) as Record<string, Watch>);

const TZ_NAMES: Record<string, string> = { '1959': 'The Twilight Zone (1959)', '1985': 'The Twilight Zone (1985)', '2002': 'The Twilight Zone (2002)', '2019': 'The Twilight Zone (2019)' };

/** Watch data for a Twilight Zone series ("1959"), or for any show by its name or slug. */
export function watchFor(opts: { series?: string; show?: string; slug?: string; name?: string; justwatch?: string }): WatchInfo {
  const key = opts.series ? `twilight-zone-${opts.series}` : opts.slug ?? showSlug(normShow(opts.show ?? opts.name ?? ''));
  const name = opts.name ?? (opts.series ? TZ_NAMES[opts.series] ?? `The Twilight Zone (${opts.series})` : normShow(opts.show ?? ''));
  const q = encodeURIComponent(name.replace(/\s*\(\d{4}\)$/, ''));
  return { name, w: all()[key], search: { justwatch: opts.justwatch ?? `https://www.justwatch.com/us/search?q=${q}`, reelgood: `https://reelgood.com/search?q=${q}` } };
}

/** "21 November 2026" */
export const longDate = (d: string) => new Date(`${d}T12:00:00Z`).toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric', timeZone: 'UTC' });

/** One short phrase for a list row: "Stream on Netflix", "Free on Tubi", "Buy on Amazon, Apple TV". */
export function watchShort(w?: Watch): string | undefined {
  if (!w) return undefined;
  const two = (l: string[]) => l.slice(0, 2).join(', ') + (l.length > 2 ? ' and more' : '');
  if (w.stream.length) return `Stream on ${two(w.stream)}`;
  if (w.free.length) return `Free on ${two(w.free)}`;
  if (w.buy.length) return `Buy on ${two(w.buy)}`;
  return 'Not streaming in the US';
}
