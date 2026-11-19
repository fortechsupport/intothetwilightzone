# IntoTheTwilightZone.com

An independent, non-commercial living history of *The Twilight Zone*: every series, episode and
person, and the films, songs, books and stories the show inspired. The site earns no money.

Built with [Astro](https://astro.build) from YAML records in `src/content/`, with static search by
[Pagefind](https://pagefind.app). Designed to deploy free on Cloudflare Pages.

## Working on the site

```sh
npm install
npm run dev        # local preview at http://localhost:4321
npm run build      # static site in dist/ plus the search index
```

## Content

- One YAML file per record under `src/content/<collection>/`. Field reference:
  [docs/CONTENT_SCHEMA.md](docs/CONTENT_SCHEMA.md). The build fails on records that break the schema.
- `data/source/*.xlsx` are the original research spreadsheets. `npm run import` regenerates
  records from them; any record with `locked: true` is never overwritten, so mark hand-edited
  records as locked.
- Every record carries `sources`. Influence links (`connections`) carry a confidence level:
  `confirmed-by-creator`, `documented` (needs a source URL) or `fan-noted`.

## Copyright and sourcing

Facts, original writing and short attributed excerpts only. Video, audio, scripts, scans, full
lyrics and publisher blurbs are linked, never hosted. See `src/pages/sources.astro` for the public
policy and the footer disclaimer in `src/layouts/Base.astro`.

## Deploying (Cloudflare Pages)

- Build command: `npm run build`
- Output directory: `dist`
- Node version: 22
- `public/_redirects` maps old WordPress URLs to the new pages with 301s.
