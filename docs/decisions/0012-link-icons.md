# 0012 Link icons: our own icon for each kind of site

**Date:** 2026-11-26. **Decided by:** Adam, on a decision card (12:48 UTC): "Our own icon per link type", over
brand logos, each site's favicon, or text only. Which hosts fall under which kind was decided in the thread.

## Decision

- Outside links in link lists show a small icon for the kind of site: encyclopedia or wiki, film and television
  database, where to watch, video, podcast/radio/audiobook, music database or lyrics, book/comic/story database,
  archive or library, scholarship, map, shop or auction, official site, and a globe for any other website.
- The icons are drawn for this site (simple line drawings in the site's link colour). No other site's logo or
  favicon is used, and no request goes to another site to draw them.
- Where: sources lists, "More about this episode elsewhere", film and work Links, Where to watch, Media and
  content lists. Links inside running text get no icon; the ↗ new-tab mark stays on every outside link.
- The build tags each outside link with `data-link` (`src/lib/link-kinds.mjs`, applied by
  `integrations/external-links.mjs`); `public/site.css` draws the icon. Sources and policy (/sources/#link-icons)
  explains every icon. The site's own GitHub (corrections) and licence links get none.

## Why

Logos are their owners' trademarks; borrowing them is the kind of thing that could weigh against an official
blessing (decision 0009). Generic icons scan as quickly and keep the site's own look.
