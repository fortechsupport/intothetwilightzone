import { defineConfig } from 'astro/config';
import unlinkHidden from './integrations/unlink-hidden.mjs';
import externalLinks from './integrations/external-links.mjs';
import recordIndex from './integrations/record-index.mjs';
import sitemap from './integrations/sitemap.mjs';
import { readFileSync, readdirSync } from 'node:fs';
import { parse } from 'yaml';
import { buildShowIndex, isEntryOnly } from './src/lib/tv-shows.mjs';

// Addresses (the explore framework, Adam 2026-11-28: "Total rebuild since no public links have been published yet"):
// no redirects for the site's own reorganizations. Two kinds stay, because they are not reorganizations: the 2023
// WordPress site's addresses, which were public on this domain, and records that have no page of their own.
const redirects = {
  '/television': '/view/television/',
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
};
{
  // An episode, segment or sketch of another show is an entry on its show's page (decision 0002); a show that has a
  // record of its own lives at that record's page; a film kept only for a writer's filmography (Movies Q2) is on the
  // writer's page.
  const dir = './src/content/films';
  const films = readdirSync(dir).filter((n) => n.endsWith('.yaml')).map((n) => ({ id: n.slice(0, -5), data: parse(readFileSync(`${dir}/${n}`, 'utf8')) ?? {} }));
  const tv = buildShowIndex(films);
  for (const f of films) if (isEntryOnly(f.id, f.data)) redirects[`/films/${f.id}`] = tv.entryHref(f.id);
  for (const s of tv.shows.values()) if (s.recordId && s.slug !== 'night-gallery') redirects[`/television/${s.slug}`] = s.href;
  const slug = (n) => String(n).replace(/['’‘]/g, '').normalize('NFKD').replace(/[\u0300-\u036f]/g, '').toLowerCase().replace(/&/g, ' and ').replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '');
  for (const f of films) {
    const who = (f.data.writers ?? [])[0] ?? (f.data.source_authors ?? [])[0];
    if (f.data.filmography_only && who) redirects[`/films/${f.id}`] = `/people/${slug(who)}/`;
  }
  redirects['/films/night-gallery'] = '/night-gallery/';
}

export default defineConfig({
  site: 'https://intothetwilightzone.com',
  trailingSlash: 'ignore',
  redirects,
  integrations: [unlinkHidden(), externalLinks(), recordIndex(), sitemap()],
});
