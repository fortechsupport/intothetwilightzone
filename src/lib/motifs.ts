// Original line drawings made for this site (decision 0009): one motif per kind of record, used where no
// public-domain or Creative Commons picture of the record exists. They are the site's own work, drawn in
// SVG with the theme's colors, and deliberately generic: none imitates the show's artwork.
export type Motif = 'tv' | 'reel' | 'mic' | 'radio' | 'vinyl' | 'book' | 'comic' | 'magazine' | 'pen' | 'archive' | 'quote'
  | 'mask' | 'pin' | 'columns' | 'die' | 'curtain' | 'ticket' | 'star' | 'gavel' | 'disc' | 'easel' | 'door' | 'clock' | 'person';

/** Paths in a 48 x 48 box, stroked with currentColor. */
export const MOTIF_PATHS: Record<Motif, string> = {
  tv: '<rect x="7" y="13" width="34" height="25" rx="4"/><rect x="11" y="17" width="21" height="17" rx="2"/><path d="M18 13 13 6M30 13l5-7M36 20v.01M36 25v.01M15 38l-2 4M33 38l2 4"/>',
  reel: '<circle cx="24" cy="24" r="16"/><circle cx="24" cy="24" r="3"/><circle cx="24" cy="14" r="4"/><circle cx="24" cy="34" r="4"/><circle cx="14" cy="24" r="4"/><circle cx="34" cy="24" r="4"/><path d="M40 24h5"/>',
  mic: '<rect x="18" y="5" width="12" height="22" rx="6"/><path d="M12 22a12 12 0 0 0 24 0M24 34v8M17 42h14M18 12h4M18 17h4"/>',
  radio: '<rect x="6" y="16" width="36" height="24" rx="4"/><circle cx="17" cy="28" r="6"/><path d="M28 24h9M28 29h9M28 34h6M12 16 34 6"/>',
  vinyl: '<circle cx="24" cy="24" r="18"/><circle cx="24" cy="24" r="6"/><circle cx="24" cy="24" r="1"/><path d="M24 11a13 13 0 0 1 13 13M24 15a9 9 0 0 1 9 9"/>',
  book: '<path d="M24 12c-5-3-11-4-17-3v28c6-1 12 0 17 3 5-3 11-4 17-3V9c-6-1-12 0-17 3zM24 12v28"/><path d="M11 16c3 0 6 .5 9 2M11 22c3 0 6 .5 9 2M28 18c3-1.5 6-2 9-2M28 24c3-1.5 6-2 9-2"/>',
  comic: '<rect x="6" y="6" width="36" height="36" rx="2"/><path d="M6 22h20M26 6v36M26 28h16"/><path d="M11 10h10a3 3 0 0 1 3 3v2a3 3 0 0 1-3 3h-6l-3 3v-3a3 3 0 0 1-3-3v-2a3 3 0 0 1 2-3z"/>',
  magazine: '<rect x="10" y="5" width="28" height="38" rx="2"/><path d="M15 11h18M15 16h12M15 22h18v14H15z"/>',
  pen: '<path d="M33 6 42 15 20 37l-11 2 2-11z"/><path d="M29 10l9 9M11 28l9 9M8 43h32"/>',
  archive: '<rect x="6" y="9" width="36" height="9" rx="1"/><path d="M9 18v21h30V18M19 25h10"/>',
  quote: '<path d="M10 30c0-8 3-13 9-15M10 30a5 5 0 1 0 5-5M27 30c0-8 3-13 9-15M27 30a5 5 0 1 0 5-5"/>',
  mask: '<path d="M8 10c10 4 22 4 32 0v14c0 9-7 16-16 16S8 33 8 24z"/><path d="M14 20c2-2 5-2 7 0M27 20c2-2 5-2 7 0M17 31c4 3 10 3 14 0"/>',
  pin: '<path d="M24 42s-12-12-12-21a12 12 0 0 1 24 0c0 9-12 21-12 21z"/><circle cx="24" cy="21" r="4"/><path d="M6 44h36"/>',
  columns: '<path d="M6 16 24 6l18 10zM8 40h32M6 44h36M12 18v20M20 18v20M28 18v20M36 18v20"/>',
  die: '<rect x="8" y="8" width="32" height="32" rx="6"/><circle cx="17" cy="17" r="1.5"/><circle cx="31" cy="17" r="1.5"/><circle cx="24" cy="24" r="1.5"/><circle cx="17" cy="31" r="1.5"/><circle cx="31" cy="31" r="1.5"/>',
  curtain: '<path d="M5 6h38M7 6c0 14 3 26 9 34M41 6c0 14-3 26-9 34M7 6c3 8 7 13 11 15M41 6c-3 8-7 13-11 15M5 42h38"/>',
  ticket: '<path d="M6 14h36v6a4 4 0 0 0 0 8v6H6v-6a4 4 0 0 0 0-8z"/><path d="M30 14v20" stroke-dasharray="2 3"/><path d="M13 21h11M13 27h8"/>',
  star: '<path d="m24 6 5.5 11.5L42 19l-9 8.5 2 12.5-11-6-11 6 2-12.5-9-8.5 12.5-1.5z"/>',
  gavel: '<path d="m20 10 10 10M16 14l10 10M14 16l12-12 8 8-12 12zM29 23l13 13-4 4-13-13M8 42h18"/>',
  disc: '<rect x="6" y="6" width="36" height="36" rx="3"/><circle cx="24" cy="24" r="12"/><circle cx="24" cy="24" r="3"/>',
  easel: '<rect x="10" y="6" width="28" height="22" rx="1"/><path d="M14 22l6-7 5 5 4-3 5 5M24 28v6M16 44l6-16M32 44l-6-16"/>',
  door: '<path d="M14 42V6h20v36M8 42h32"/><path d="M14 6l10 4v36l-10-4" opacity=".6"/><circle cx="21" cy="25" r="1"/>',
  clock: '<circle cx="24" cy="24" r="17"/><path d="M24 13v11l7 5M24 7v2M24 39v2M7 24h2M39 24h2"/>',
  person: '<circle cx="24" cy="17" r="8"/><path d="M9 42c1-9 7-14 15-14s14 5 15 14"/>',
};

/** The motif for a record, from its collection and the type label its page shows. */
export function motifFor(col: string, type = ''): Motif {
  const t = type.toLowerCase();
  if (/game|pinball|puzzle/.test(t)) return 'die';
  if (/stage|play|theat/.test(t)) return 'curtain';
  if (/convention|event|attraction|venue/.test(t)) return 'ticket';
  if (/legal/.test(t)) return 'gavel';
  if (/home media|soundtrack|disc/.test(t)) return 'disc';
  if (/artwork|prop/.test(t)) return 'easel';
  if (/memorial/.test(t)) return 'star';
  if (/lecture|speech|classroom/.test(t)) return 'mic';
  switch (col) {
    case 'episodes': case 'series': return 'tv';
    case 'films': return /tv|television/.test(t) ? 'tv' : 'reel';
    case 'radio': return 'radio';
    case 'podcasts': return 'mic';
    case 'songs': return 'vinyl';
    case 'books': return 'book';
    case 'comics': return 'comic';
    case 'magazines': return 'magazine';
    case 'essays': return 'pen';
    case 'archives': return 'archive';
    case 'quotes': return 'quote';
    case 'characters': return 'mask';
    case 'locations': case 'places': return 'pin';
    case 'organizations': return 'columns';
    case 'people': return 'person';
    default: return 'door';
  }
}

/** Two initials for a person's monogram: "Rod Serling" -> "RS". */
export const initials = (name: string) => name.replace(/\(.*?\)/g, '').split(/\s+/).filter((w) => /^[A-Za-zÀ-ž]/.test(w) && !/^(jr|sr|ii|iii)\.?$/i.test(w)).map((w) => w[0].toUpperCase()).filter((_, i, a) => i === 0 || i === a.length - 1).join('').slice(0, 2);

/** The motif for a category or section landing page. */
export function motifForCategory(slug: string): Motif {
  const m: Record<string, Motif> = {
    artwork: 'easel', events: 'ticket', games: 'die', history: 'clock', lectures: 'mic', homages: 'star', merchandise: 'disc',
    movies: 'reel', music: 'vinyl', podcasts: 'mic', radio: 'radio', reading: 'book', stage: 'curtain', series: 'tv',
    people: 'person', places: 'pin', organizations: 'columns',
  };
  return m[slug] ?? 'door';
}
