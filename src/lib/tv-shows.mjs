// Television shows and the episodes listed on them (Adam, 2026-11-21, docs/decisions/0002-television-structure.md).
//
// Only the four Twilight Zone series have a page per episode. Every other show (Night Gallery, the
// anthologies Rod Serling wrote for, the shows with Twilight Zone homages) has one page, and each of
// its episodes, segments and sketches is an entry on that page with its own anchor.
//
// Plain JavaScript on raw record data, so astro.config.mjs (redirects) and the pages share one rule.

/** Film-record kinds that are part of a show rather than a work of their own. */
export const ENTRY_KINDS = new Set(['tv-episode', 'tv-segment', 'sketch', 'web-series']);

const NG_EPISODE = /^night-gallery-s\d+e\d+$/;

/** A show's name without season, episode or note suffixes: "The Simpsons S5E5" -> "The Simpsons". */
export function normShow(name) {
  return String(name ?? '')
    .replace(/,[^,]*\(season \d+\)\s*$/i, '')
    .replace(/,\s*(S\d|season|episode).*$/i, '')
    .replace(/\s+S\d+(E\d+)?\b.*$/i, '')
    .replace(/\s+season\b.*$/i, '')
    .replace(/\s*\([^)]*\)\s*$/, '')
    .trim();
}

export function showSlug(name) {
  return String(name).replace(/['’‘]/g, '').normalize('NFKD').replace(/[̀-ͯ]/g, '').toLowerCase()
    .replace(/&/g, ' and ').replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '') || 'show';
}

/** The show a film record belongs to, or null when it stands on its own. */
export function hostShow(id, d) {
  if (NG_EPISODE.test(id)) return 'Night Gallery';
  if (!d?.parent_series) return null;
  if (!ENTRY_KINDS.has(d.kind) && d.kind !== 'tv-series') return null;
  return normShow(d.parent_series) || null;
}

/** True when a film record has no page of its own and is an entry on its show's page. */
export const isEntryOnly = (id, d) => !d?.duplicate_of && hostShow(id, d) !== null;

/**
 * Index of shows from all film records ({ id, data } pairs).
 * Returns { shows: Map<slug, {slug, title, recordId?, href, entries: id[]}>, entryHref(id), showOf(id) }.
 */
export function buildShowIndex(films) {
  const byTitle = new Map();
  for (const f of films) {
    if (f.data.kind === 'tv-series' && !f.data.parent_series && !f.data.duplicate_of) {
      const key = showSlug(normShow(f.data.title));
      if (!byTitle.has(key)) byTitle.set(key, f.id);
    }
  }
  const shows = new Map();
  const showOfId = new Map();
  const hrefOf = (slug, recordId) => (slug === 'night-gallery' ? '/night-gallery/' : recordId ? `/films/${recordId}/` : `/television/${slug}/`);
  for (const f of films) {
    if (!isEntryOnly(f.id, f.data)) continue;
    const title = hostShow(f.id, f.data);
    const slug = showSlug(title);
    if (!shows.has(slug)) {
      const recordId = byTitle.get(slug);
      shows.set(slug, { slug, title, recordId, href: hrefOf(slug, recordId), entries: [] });
    }
    shows.get(slug).entries.push(f.id);
    showOfId.set(f.id, slug);
  }
  // Show records with no entries yet still get the explorer (empty) on their own page.
  for (const [slug, recordId] of byTitle) {
    if (!shows.has(slug)) {
      const rec = films.find((f) => f.id === recordId);
      shows.set(slug, { slug, title: normShow(rec.data.title), recordId, href: hrefOf(slug, recordId), entries: [] });
    }
  }
  return {
    shows,
    showOf: (id) => shows.get(showOfId.get(id)),
    entryHref: (id) => {
      const s = shows.get(showOfId.get(id));
      return s ? `${s.href}#${id}` : `/films/${id}/`;
    },
    showByRecord: (recordId) => [...shows.values()].find((s) => s.recordId === recordId),
  };
}
