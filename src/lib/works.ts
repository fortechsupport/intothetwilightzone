export const WORK_KINDS: [string, string, string][] = [
  ['soundtrack', 'Soundtracks and theme releases', 'Scores, soundtrack albums and releases of the theme.'],
  ['game', 'Games', 'Pinball, video, board and card games.'],
  ['collectible', 'Collectibles', 'Trading cards, toys, figures and other licensed memorabilia.'],
  ['artwork', 'Artwork', 'Posters, illustration and art inspired by the show.'],
  ['stage', 'Stage', 'Theatre productions and live adaptations.'],
  ['attraction', 'Attractions', 'Theme park rides, escape rooms and exhibits.'],
  ['event', 'Events', 'Marathons, anniversaries, honors and festivals.'],
  ['convention', 'Conventions', 'Fan conventions and gatherings.'],
  ['parody', 'Parodies', 'Spoofs and send-ups.'],
  ['television', 'Television', 'Other television connected to the franchise.'],
  ['memorial', 'Memorials', 'Graves, statues, plaques and places named in Serling\'s honor.'],
  ['education', 'In the classroom', 'Teleplays in school anthologies, lesson plans and courses.'],
  ['fan-community', 'Fan communities', 'Fan art hubs, forums, wikis and subreddits.'],
  ['link', 'Links and resources', 'Curated external resources about the show and its makers.'],
  ['lecture', 'Lectures', 'Talks, lectures and panels.'],
  ['advertisement', 'Advertising', 'Commercials, promos, sponsors and print ads.'],
  ['home-media', 'Home video and streaming', 'Releases of the series and films.'],
  ['legal', 'Legal history', 'Trials, lawsuits, rights and censorship.'],
  ['cultural-impact', 'Cultural impact', 'Catchphrases and the show in everyday language.'],
  ['prop', 'Props', 'Surviving props, costumes and replicas.'],
  ['production', 'Production history', 'How the series were made and broadcast.'],
  ['other', 'Other', 'Everything else.'],
];

export const KIND_LABEL = Object.fromEntries(WORK_KINDS.map(([k, label]) => [k, label]));

export function humanize(key: string): string {
  const s = key.replace(/[_-]+/g, ' ');
  return s.charAt(0).toUpperCase() + s.slice(1);
}

/** Render a free-form details value as text. */
export function detailText(v: unknown): string {
  if (v === null || v === undefined) return '';
  if (Array.isArray(v)) return v.map(detailText).join(', ');
  if (typeof v === 'object') return Object.entries(v as Record<string, unknown>).map(([k, x]) => `${humanize(k)}: ${detailText(x)}`).join('; ');
  if (typeof v === 'boolean') return v ? 'Yes' : 'No';
  return String(v);
}
