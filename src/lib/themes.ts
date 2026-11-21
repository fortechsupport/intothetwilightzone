// Themes (Adam, 2026-11-21; decision 0004): one fixed list of 41 themes in eight families, for every Twilight
// Zone series, episode, Night Gallery segment and homage. A theme is our editors' reading, not a claim by a
// story's makers, and every place that shows themes says so.
//   - Twilight Zone episodes: their own `themes:` keywords, mapped through the aliases in data/themes.yaml.
//   - Night Gallery segments: data/themes-assigned.yaml, read from each segment's summary.
//   - Homages and other works pointing to an episode: that episode's themes ("from the episode it points to").
//   - Series and shows: the most common themes among their episodes, with counts.
import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { parse } from 'yaml';
import { getCollection } from 'astro:content';

export interface Theme { slug: string; label: string; desc: string; family: string; aliases: string[] }
export interface Family { family: string; slug: string; themes: Theme[] }

const read = (p: string) => parse(readFileSync(resolve(process.cwd(), p), 'utf8'));
const fslug = (s: string) => s.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');

export const FAMILIES: Family[] = (read('data/themes.yaml') as { family: string; themes: Omit<Theme, 'family'>[] }[])
  .map((f) => ({ family: f.family, slug: fslug(f.family), themes: f.themes.map((t) => ({ ...t, family: f.family })) }));
export const THEMES: Theme[] = FAMILIES.flatMap((f) => f.themes);
export const THEME = new Map(THEMES.map((t) => [t.slug, t]));
const ALIAS = new Map(THEMES.flatMap((t) => t.aliases.map((a) => [a.toLowerCase(), t.slug] as const)));
const ORDER = new Map(THEMES.map((t, i) => [t.slug, i]));
const ASSIGNED = read('data/themes-assigned.yaml') as Record<string, { title: string; themes: string[] }>;

export const themeHref = (slug: string) => `/themes/${slug}/`;
/** Themes in the list's own order, without repeats. */
export const ordered = (slugs: Iterable<string>) => [...new Set(slugs)].filter((s) => THEME.has(s)).sort((a, b) => ORDER.get(a)! - ORDER.get(b)!);

/** An episode's themes from its keywords. Keywords with no theme (comedy, baseball…) are left out. */
export function themesOfTags(tags: string[] = []): string[] {
  return ordered(tags.map((t) => ALIAS.get(t.trim().toLowerCase())).filter((s): s is string => !!s));
}

/** A Night Gallery segment's themes (film id, segment number from 0). */
export const segmentThemes = (filmId: string, i: number): string[] => ordered(ASSIGNED[`${filmId}#${i}`]?.themes ?? []);

let epThemes: Map<string, string[]> | undefined;
/** Themes of every Twilight Zone episode, keyed by episode id ("1959/time-enough-at-last"). */
export async function episodeThemes(): Promise<Map<string, string[]>> {
  return (epThemes ??= new Map((await getCollection('episodes')).map((e) => [e.id, themesOfTags(e.data.themes)])));
}

/** Themes a record takes from the Twilight Zone episodes it points to (refs like "1959/the-howling-man"). */
export async function inheritedThemes(refs: string[]): Promise<string[]> {
  const m = await episodeThemes();
  return ordered(refs.flatMap((r) => m.get(r) ?? []));
}

/** The most common themes in a set of theme lists, with how many items carry each. */
export function topThemes(lists: string[][], n = 8): [string, number][] {
  const c = new Map<string, number>();
  for (const l of lists) for (const s of new Set(l)) c.set(s, (c.get(s) ?? 0) + 1);
  return [...c.entries()].sort((a, b) => b[1] - a[1] || ORDER.get(a[0])! - ORDER.get(b[0])!).slice(0, n);
}

export const THEME_NOTE = 'Themes are our editors’ reading of the story, not a claim by its makers.';
