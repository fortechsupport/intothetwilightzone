import { defineConfig } from 'astro/config';
import unlinkHidden from './integrations/unlink-hidden.mjs';

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
  '/privacy': '/about/#privacy',
  '/terms': '/about/#disclaimer',
  // Section pages replaced by the category structure (2026-11-20).
  '/films': '/movies/',
  '/works': '/categories/',
  '/books': '/reading/books/',
  '/comics': '/reading/comics/',
  '/magazines': '/reading/magazines/',
  '/essays': '/reading/essays/',
  '/songs': '/music/songs/',
  '/radio': '/episodes/radio/',
  '/podcasts': '/series/podcast/',
  '/influence': '/homages/',
  '/voices': '/quotes/',
  '/beyond': '/categories/',
};

export default defineConfig({
  site: 'https://intothetwilightzone.com',
  trailingSlash: 'ignore',
  redirects,
  integrations: [unlinkHidden()],
});
