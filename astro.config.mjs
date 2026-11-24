import { defineConfig } from 'astro/config';
import unlinkHidden from './integrations/unlink-hidden.mjs';
import externalLinks from './integrations/external-links.mjs';
import recordIndex from './integrations/record-index.mjs';
import { readFileSync, readdirSync } from 'node:fs';
import { parse } from 'yaml';
import { MOVED_PATHS, OLD_GROUPS } from './src/lib/taxonomy.mjs';
import { buildShowIndex, isEntryOnly } from './src/lib/tv-shows.mjs';

// Old WordPress URLs (2023 site) mapped to their new homes.
const redirects = {
  '/television': '/series/',
  '/1959series': '/series/1959/',
  '/1985series': '/series/1985/',
  '/2002series': '/series/2002/',
  '/2019series': '/series/2019/',
  '/television/1959-series': '/series/1959/',
  '/television/1985-series': '/series/1985/',
  '/television/2002-series': '/series/2002/',
  '/television/2019-series': '/series/2019/',
  '/blog': '/',
  '/contact': '/about/#contact',
  // Section pages replaced by the category structure (2026-11-20).
  '/films': '/movies/',
  '/works': '/categories/',
  '/books': '/reading/books/',
  '/comics': '/reading/comics/',
  '/magazines': '/reading/magazines/',
  '/essays': '/reading/essays/',
  '/songs': '/music/songs/',
  '/influence': '/homages/',
  '/voices': '/people/fans/',
  '/beyond': '/categories/',
  // Categories that became content or moved under Adam's category-versus-content rule (2026-11-20).
  '/advertising': '/media/advertisements/',
  '/advertising/commercials': '/media/advertisements/',
  '/advertising/print-ads': '/media/advertisements/',
  '/advertising/promos-trailers': '/media/advertisements/',
  '/advertising/sponsors': '/organizations/sponsors/',
  '/archives': '/media/archival-holdings/',
  '/archives/collections': '/media/archival-holdings/',
  '/archives/documents': '/media/documents/',
  '/quotes': '/people/fans/',
  '/quotes/admirers': '/people/fans/',
  '/quotes/rod-serling': '/rod-serling/',
  '/community/fan-communities': '/organizations/fan-groups/',
  '/community/organizations': '/organizations/foundations-societies/',
  '/community/websites-databases': '/reading/websites/',
  '/cultural-impact': '/homages/in-everyday-language/',
  '/cultural-impact/catchphrases': '/homages/in-everyday-language/',
  '/cultural-impact/theme-shorthand': '/homages/in-everyday-language/',
  '/cultural-impact/public-uses': '/homages/in-everyday-language/',
  '/cultural-impact/dictionary-rankings': '/homages/in-everyday-language/',
  '/legal-history': '/events/legal/',
  '/legal-history/trials': '/events/legal/',
  '/legal-history/lawsuits': '/events/legal/',
  '/legal-history/censorship': '/events/legal/',
  '/legal-history/rights-ownership': '/events/legal/',
  '/props-collecting': '/artwork/props-costumes/',
  '/props-collecting/props-costumes': '/artwork/props-costumes/',
  '/props-collecting/auctions': '/artwork/props-costumes/',
  '/props-collecting/museum-holdings': '/artwork/props-costumes/',
  '/props-collecting/replicas': '/merchandise/replicas/',
  // Radio and podcasts moved under Audio; Reviews and media became content (2026-11-20 evening).
  '/series/radio': '/radio/series/',
  '/series/podcast': '/podcasts/shows/',
  '/episodes/radio': '/radio/episodes/',
  '/episodes/radio-original-stories': '/radio/original-stories/',
  '/episodes/radio-unmade-tv-scripts': '/radio/unmade-scripts/',
  '/episodes/podcast': '/podcasts/episodes/',
  '/reviews': '/media/reviews/',
  '/reviews/contemporary': '/media/reviews/',
  '/reviews/retrospective': '/media/reviews/',
  '/reviews/rankings': '/media/reviews/',
  '/reviews/awards-citations': '/media/reviews/',
  '/reviews/aggregate-scores': '/media/reviews/',
  '/media/ads': '/media/advertisements/',
  '/media/holdings': '/media/archival-holdings/',
  // The same actor had two People pages (2026-11-24).
  '/people/lou-gossett-jr': '/people/louis-gossett-jr/',
};
// The nine verbs (2026-11-21): group pages became verb pages, and some subcategories moved.
for (const [g, v] of Object.entries(OLD_GROUPS)) redirects[`/explore/${g}`] = `/${v}/`;
for (const [from, to] of Object.entries(MOVED_PATHS)) redirects[from.replace(/\/$/, '')] = to;
for (const [k, t] of Object.entries(redirects)) if (MOVED_PATHS[t]) redirects[k] = MOVED_PATHS[t];
// Television (Adam, 2026-11-21, decision 0002): Episodes merged into Television, and every episode,
// segment or sketch of a show other than The Twilight Zone is an entry on its show's page.
Object.assign(redirects, { '/episodes': '/series/episodes/', '/series/tv': '/series/', '/films/night-gallery': '/night-gallery/' });
{
  const dir = './src/content/films';
  const films = readdirSync(dir).filter((n) => n.endsWith('.yaml')).map((n) => ({ id: n.slice(0, -5), data: parse(readFileSync(`${dir}/${n}`, 'utf8')) ?? {} }));
  const tv = buildShowIndex(films);
  for (const f of films) if (isEntryOnly(f.id, f.data)) redirects[`/films/${f.id}`] = tv.entryHref(f.id);
  // A show that gained a record of its own moves from /television/<show>/ to its record's page.
  for (const s of tv.shows.values()) if (s.recordId && s.slug !== 'night-gallery') redirects[`/television/${s.slug}`] = s.href;
  // Films kept only for a writer's filmography (Movies Q2) send their old address to that writer's page.
  const slug = (n) => String(n).replace(/['’‘]/g, '').normalize('NFKD').replace(/[\u0300-\u036f]/g, '').toLowerCase().replace(/&/g, ' and ').replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '');
  for (const f of films) {
    const who = (f.data.writers ?? [])[0] ?? (f.data.source_authors ?? [])[0];
    if (f.data.filmography_only && who) redirects[`/films/${f.id}`] = `/people/${slug(who)}/`;
  }
}
// Movies (2026-11-23, docs/plans/research-movies.md): the Television films and Shorts shelves were split up.
Object.assign(redirects, { '/movies/tv-films': '/movies/', '/movies/shorts-and-other': '/movies/linked-films/' });

export default defineConfig({
  site: 'https://intothetwilightzone.com',
  trailingSlash: 'ignore',
  redirects,
  integrations: [unlinkHidden(), externalLinks(), recordIndex()],
});
