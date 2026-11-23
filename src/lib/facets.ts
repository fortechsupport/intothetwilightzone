// The extra filters on Movies lists (plan docs/plans/research-movies.md, section 3): shelf, type, decade,
// the Twilight Zone episode a film points to, and how sure that link is. Values come from Entry.facets
// (src/lib/catalog.ts); a filter with fewer than two values is not shown.
import type { Entry } from './catalog';
import { sortKey } from './taxonomy.mjs';

const MOVIE_FACETS: [string, string][] = [['shelf', 'Section'], ['type', 'Type'], ['decade', 'Decade'], ['episode', 'Episode'], ['confidence', 'How sure']];
const CONFIDENCE_ORDER = ['Confirmed by its makers', 'Documented', 'Noted by fans'];

export function movieFacets(cat: string, entries: Entry[]) {
  if (cat !== 'movies') return [];
  return MOVIE_FACETS.map(([key, label]) => {
    const vals = [...new Set(entries.flatMap((e) => e.facets?.[key] ?? []))];
    const options = key === 'decade' ? vals.sort()
      : key === 'confidence' ? vals.sort((a, b) => CONFIDENCE_ORDER.indexOf(a) - CONFIDENCE_ORDER.indexOf(b))
      : vals.sort((a, b) => sortKey(a.replace(/^["“]/, '')).localeCompare(sortKey(b.replace(/^["“]/, ''))));
    return { key, label, options };
  });
}
