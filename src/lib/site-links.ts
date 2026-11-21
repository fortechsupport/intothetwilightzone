// Links in the site header's utility bar and in the footer. One place, so pages and threads add links
// here instead of editing the layout. Every link must point at a page that exists (CI checks links).

/** The small bar above the main navigation. */
export const UTILITY_LINKS: [string, string][] = [
  ['Start here', '/start/'],
  ['Media Library', '/media/'],
  ['Timeline', '/timeline/'],
  ['Rod Serling', '/rod-serling/'],
  ['Night Gallery', '/night-gallery/'],
  ['Everything A to Z', '/categories/'],
];

/** Footer columns: heading, then links. */
export const FOOTER_COLUMNS: { title: string; links: [string, string][] }[] = [
  { title: 'Explore', links: [['Start here', '/start/'], ['Viewing paths', '/paths/'], ['Episode finder', '/finder/'], ['Episode of the day', '/today/'], ['Map', '/map/'], ['Six degrees', '/degrees/']] },
  { title: 'Reference', links: [['Media Library', '/media/'], ['Timeline', '/timeline/'], ['Rod Serling', '/rod-serling/'], ['Night Gallery', '/night-gallery/'], ['Everything A to Z', '/categories/'], ['Search', '/search/']] },
  { title: 'This site', links: [['About', '/about/'], ['Sources and policy', '/sources/'], ['Contribute', '/contribute/'], ['My Zone', '/my-zone/']] },
];

/** Extra footer links (terms, privacy, community rules...). The accounts work adds its pages here. */
export const FOOTER_LINKS: [string, string][] = [];
