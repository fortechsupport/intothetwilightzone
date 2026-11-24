// Page titles and record-type labels.
//
// Every record page shows a small type label above its heading ("Radio drama", "Song by Iron Maiden")
// and uses the same context in its browser title, so two records that share a name ("A Stop at
// Willoughby" the episode, the radio drama and the song) never share a <title>. `npm run check:site`
// fails the build if two public pages end up with the same title.

const year = (v: unknown): string | undefined => {
  const m = /\b(1[89]\d\d|20\d\d)\b/.exec(String(v ?? ''));
  return m ? m[1] : undefined;
};

const FILM_KIND: Record<string, string> = {
  commercial: 'Commercial', documentary: 'Documentary', film: 'Film', 'music-video': 'Music video', pilot: 'TV pilot',
  short: 'Short film', sketch: 'TV sketch', special: 'TV special', stage: 'Stage production', 'tv-episode': 'TV episode',
  'tv-film': 'TV film', 'tv-segment': 'TV segment', 'tv-series': 'TV series', unproduced: 'Unproduced project', 'web-series': 'Web series',
};
const WORK_KIND: Record<string, string> = {
  soundtrack: 'Soundtrack', game: 'Game', collectible: 'Collectible', artwork: 'Artwork', stage: 'Stage production',
  attraction: 'Attraction', event: 'Event', convention: 'Convention', parody: 'Parody', television: 'Television',
  memorial: 'Memorial', education: 'Classroom resource', 'fan-community': 'Fan community', link: 'Resource',
  lecture: 'Lecture', advertisement: 'Advertisement', 'home-media': 'Home media release', legal: 'Legal history',
  'cultural-impact': 'Cultural impact', prop: 'Prop', production: 'Production history', other: 'Related work',
};
const ESSAY_KIND: Record<string, string> = {
  'academic-thesis': 'Thesis', article: 'Article', 'book-chapter': 'Book chapter', essay: 'Essay', interview: 'Interview',
  'journal-article': 'Journal article', lecture: 'Lecture', review: 'Review', speech: 'Speech',
};
const PLACE_KIND: Record<string, string> = {
  archive: 'Archive', attraction: 'Attraction', 'backlot-set': 'Backlot or set', 'event-venue': 'Venue',
  'filming-location': 'Filming location', 'in-story': 'Place in the stories', memorial: 'Memorial',
  'museum-exhibit': 'Museum or exhibit', 'serling-place': "Place in Rod Serling's life",
};
const BOOK_KIND: Record<string, string> = { anthology: 'Anthology', novel: 'Novel', novelization: 'Novelization', reference: 'Reference book' };

const lcFirst = (t: string) => (/^[A-Z]{2}/.test(t) ? t : t.charAt(0).toLowerCase() + t.slice(1));
const humanize = (s: string) => (s.charAt(0).toUpperCase() + s.slice(1)).replace(/[-_]+/g, ' ');

/** Radio records (Radio plan, 2026-11-24): the radio dramas, their series and release records, Serling's own radio
 * work, other producers' adaptations and fan audio each say what they are. */
function radioType(d: any): string {
  if (d.series_title === 'The Twilight Zone Radio Dramas') return d.subtype === 'audio-series' ? (/collections/i.test(d.title) ? 'Radio releases' : 'Radio series') : d.subtype === 'radio-broadcast' ? 'Radio broadcasts' : 'Radio drama';
  if ((d.tags ?? []).includes('fan-made')) return 'Fan audio drama';
  if ((d.tags ?? []).includes('audio-adaptation')) return 'Radio play';
  if (d.serling_role === 'unproduced') return 'Unproduced radio work';
  return 'Radio program';
}

/** The singular type label shown above a record's heading. */
export function recordType(col: string, d: any): string {
  switch (col) {
    case 'episodes': return 'Episode';
    case 'series': return 'Series';
    case 'films': return FILM_KIND[d.kind] ?? 'Screen';
    case 'works': return WORK_KIND[d.kind] ?? humanize(d.kind ?? 'Work');
    case 'songs': return 'Song';
    case 'radio': return radioType(d);
    case 'podcasts': return 'Podcast';
    case 'books': return BOOK_KIND[d.kind] ?? 'Book';
    case 'comics': return 'Comic';
    case 'magazines': return 'Magazine issue';
    case 'essays': return ESSAY_KIND[d.kind] ?? 'Article';
    case 'archives': return 'Archive collection';
    case 'quotes': return 'In their words';
    case 'characters': return 'Character';
    case 'people': return 'Person';
    case 'locations': case 'places': return PLACE_KIND[d.kind] ?? 'Place';
    case 'organizations': return 'Organization';
    default: return humanize(col);
  }
}

/** A short context line shown with the type label: who, where and when. */
export function recordContext(col: string, d: any, extra: { firstRef?: string } = {}): string {
  const parts: (string | undefined)[] = [];
  switch (col) {
    case 'songs': parts.push(d.artist ? `by ${d.artist}` : undefined, year(d.year ?? d.released)); break;
    case 'radio': parts.push(d.series_title, d.series_title === 'The Twilight Zone Radio Dramas' && d.season ? `season ${d.season}${d.season_order ? `, episode ${d.season_order}` : ''}` : undefined); break;
    case 'comics': parts.push(d.publisher, year(d.cover_date)); break;
    case 'magazines': parts.push(d.magazine, year(d.cover_date)); break;
    case 'books': parts.push(d.authors?.[0] ? `by ${String(d.authors[0]).replace(/\s*\(.*\)$/, '')}` : undefined, year(d.published)); break;
    case 'essays': parts.push(d.authors?.[0] ? `by ${String(d.authors[0]).replace(/\s*\(.*\)$/, '')}` : undefined, d.published_in, year(d.published)); break;
    case 'films': parts.push(year(d.release_date)); break;
    case 'works': parts.push(d.creator && String(d.creator).length < 40 ? String(d.creator) : undefined, year(d.year)); break;
    case 'characters': parts.push(extra.firstRef ? `in ${extra.firstRef}` : undefined); break;
    case 'podcasts': parts.push(d.hosts?.length ? `hosted by ${d.hosts.slice(0, 2).join(' and ')}` : undefined); break;
    case 'archives': parts.push(d.institution); break;
  }
  return parts.filter(Boolean).join(' · ');
}

/** The browser title for a record page, unique across the site. */
export function recordDocTitle(col: string, d: any, heading: string, extra: { firstRef?: string } = {}): string {
  const type = recordType(col, d);
  const ctx = recordContext(col, d, extra);
  switch (col) {
    case 'people': return heading;
    case 'episodes': return heading;
    case 'quotes': {
      const words = String(d.text ?? '').split(/\s+/).slice(0, 7).join(' ').replace(/[,;:.]$/, '');
      return `${d.person}: “${words}…”`;
    }
    case 'organizations': return `${heading} (organization)`;
    default: return `${heading} (${[lcFirst(type), ctx].filter(Boolean).join(', ')})`;
  }
}
