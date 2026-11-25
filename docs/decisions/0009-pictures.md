# 0009 Pictures on the site

**Date:** 2026-11-25. **Decided by:** Adam ("Yes to your suggestions. Please pay credit where it is due. Get
whatever images you can."), on the rules proposed in the thread "Improve the whole site in 5 cycles".

## Decision

- The site hosts a picture only when the page it comes from (Wikimedia Commons, the Library of Congress, the
  National Archives) states that it is in the public domain or under a Creative Commons license (CC0, CC BY,
  CC BY-SA). Publicity photographs released without a copyright notice, which Commons records as public domain,
  are included.
- Never hosted: frames from episodes, official logos and title designs, posters, and book, comic or magazine
  covers, whatever a host page claims about them. Those stay link-only (CLAUDE.md, "Copyright").
- Every picture names its title, maker, license (with the license's own reason or link) and source page beside
  the picture, and in full on /credits/images/. Pictures are resized to WebP and otherwise unchanged.
- Pages with no such picture get an original illustration made for this site (cycle 3 of
  docs/plans/site-quality-cycles.md), never a stand-in that could be mistaken for official art.
- Data: data/images/images.yaml (scripts/import-images.mjs); code: src/lib/images.ts, RecordFigure.astro.

## Why

Adam wants pictures on every page, and knows most franchise imagery needs Paramount's consent. Hosting only
documented free pictures, credited in full, keeps the site within the blessing goal and lets rights holders see
exactly where each picture came from.

## Set aside

- **Fair-use thumbnails of posters and covers:** legally arguable but not "without prior permission", and a
  poor fit for a site that hopes to be endorsed.
- **Hot-linking pictures from Commons:** would leak visitors' addresses to another site and break if files move.
