# 0003: Links open by destination, and every show says where to watch it

**Date:** 2026-11-21 (11:25 UTC) · **Decided by:** Adam · **Plan:** docs/plans/television-audit.md

## Decision

1. **Links:** links within the site open in the same tab. Links to other websites open in a new tab.
2. **Where to watch** appears on every content page about something you can watch: each Twilight Zone series, its
   episodes, Night Gallery, and every other show (The Simpsons, Psych and so on). For a show listed in a section, it
   appears once beside the show's name, not under each of its episodes.

## Why

Adam (2026-11-21): "Anywhere i visit displays all the relevant information instead of needing to hop back and
forth." Where to watch is the first thing a visitor wants after reading about a show; a new tab for other sites keeps
the visitor's place here.

## Set aside

- Listing where to watch under every episode of a non-TZ show: repetitive; Adam asked for it once beside the show.
- Linking to each streaming service: the JustWatch page already links each offer, and naming services without links
  keeps the site clear of anything that looks like promotion.
- Adding `target` by hand in every template: easy to miss; one build step and one check cover every page.

## How it is built

- `integrations/external-links.mjs` rewrites every built page: each external link gets `target="_blank"`,
  `rel="noopener noreferrer"` and `aria-describedby="ext-note"` (a hidden "opens in a new tab" note in the Base
  layout); any `target` on an internal link is removed. `public/site.css` adds a ↗ after new-tab links.
  `npm run check:site` fails a page that breaks the rule. Client-side templates follow it by hand.
- `data/fan/watch.yaml` holds each show's US offers (stream, free with ads, buy or rent) read from its JustWatch US
  page, with the date JustWatch checked and the date we read it. `src/lib/watch.ts` looks a show up;
  `src/components/WhereToWatch.astro` shows it as a facts row (or a section). Unchecked shows get search links.
- Service names only, plain links to JustWatch and Reelgood, never an affiliate code (no money is made from the site).

## Decided here (Adam reviews later)

- US first: other countries are one click away on JustWatch. Disc-only sellers are left out (Home video covers them).
- Where-to-watch facts live in a data file, not as review records, because they change month to month. The two older
  where-to-watch records (1959 and 2019 series) were excluded on 24 November 2026, on Adam's behalf during his overnight
  autonomy window, and their *Where to watch* shelf removed: the panels show the same services, and the records quoted
  prices that go stale. The records are kept; Adam can include them again.
- Radio series, unaired pilots and unmade projects get no where-to-watch row.
