# Plan: improve the whole site in 5 cycles

**Date:** 2026-11-25. **Thread:** "Improve the whole site in 5 cycles".

## What Adam approved

Adam, 2026-11-25 15:17 UTC: "Do anything and everything you can think of to continuously improve the overall
quality and user experience for IntoTheTwilightZone.com. You have my permission to work with yourself to
improve, test, approve, improve further, and repeat that process for 5 cycles ... add anything in the public
domain or that can legally be added to this site without prior permission."

His answers to the four scoping questions (15:23 UTC):
1. Visuals means images supplementing the content on each and every page; also animated effects, and themes
   the visitor can switch between that evoke the original series and each revival.
2. Yes to the image rules (documented public-domain or Creative Commons only, no episode frames, posters or
   covers), with credit where it is due. Decision 0009.
3. Scope as suggested: design, navigation (Community in the main menu under Meet), search, speed,
   accessibility, the home page, record pages and images. No new research except sourced error fixes.
4. Reporting as suggested: merge each change when the checks pass, progress on the thread's checklist, one
   short note with 320 px and 1440 px screenshots per cycle, and a final summary.

## Cycles (one pull request each, merged when CI is green)

1. **Foundations.** Fix the phone home page (the hero ran 50 px past the screen edge, hidden by a clipped
   section); make `check:a11y` catch content cut off at the right edge; stop phones hiding "Also listed in"
   links behind an ellipsis; put Community (Forums, Fan contributions, Guidelines) in the Meet menu and the
   utility bar; build the picture system (data/images/images.yaml, RecordFigure beside the title of every record
   type, /credits/images/), and import the first sourced pictures.
2. **Themes and motion.** A theme picker with Midnight and Paper plus era themes evoking the 1959 original
   (black and white, film grain, typewriter accents), 1985 (neon on deep blue), 2002 (cool steel and teal) and
   2019 (high-contrast black and red-violet), by palette, type and texture only, never the shows' logos or title
   designs. Every era theme passes the same 4.5:1 and 3:1 contrast checks. Gentle animations (page fade-in, card
   lift, menu reveal, the vortex) that switch off under prefers-reduced-motion.
3. **A picture on every page.** Real credited pictures wherever the sourcing pass found them; everywhere else an
   original illustration drawn for this site (SVG, by record type: a door, a clock, a reel, a microphone, a book,
   a map pin...), plus og:image social cards per page.
4. **Search, speed and record pages.** Search results with type filters and pictures, faster first paint
   (font preloading, image sizes, the two pages over 300 KB), record-page polish (role lists grouped, a pictures
   gallery where a record has more than one).
5. **Re-audit and finish.** Every page type at 320 and 1440 px in each theme, axe, links, and fixes for whatever
   the audit finds; the final summary.

## Acceptance checks (every cycle)

- CI green: check:data, tokens --check, build, build:preview, check:site, check:a11y.
- At 320 x 640 nothing runs past the right edge on the checked pages (now tested), and the h1 starts in the top
  third.
- Every hosted picture has a creator, an accepted license, a source page and alt text (import-images refuses
  anything else; check:data re-checks).
- Screenshots at 320 and 1440 px of the changed pages sent to Adam after the cycle.

## Decided here (Adam reviews later)

- Community sits as a fourth column of the Meet menu (no count, since its contents are live) and in the utility
  bar.
- Pictures beside the record title on desktop and under it on phones, 300 px wide, with a one-line credit; the
  full credit is one click away on /credits/images/.
- Images are hosted as 640 and 320 px WebP; the full-size original stays on its source page.
- Era theme names: "1959 Original", "1985 Neon", "2002 Steel", "2019 Crimson" (years and plain words, not series
  titles); dark only; Michroma, Oswald and Fraunces as their display faces; the brand name keeps DM Serif Display
  in every theme (decision 0010).
- Record illustrations: one motif per kind of record in rings like the home page's, a monogram for people; drawn in
  the theme's colors; hidden from screen readers as decoration. Phones show it under the title on records but skip it
  on verb and category pages. Credited pictures also join the Media Library and become a record's og:image.
- Publicity stills (photographs taken on set and released to the press without notice) count as publicity
  photographs, not episode frames; frames captured from the broadcast are still refused.

- Not hosted although Commons marks it public domain: the photograph of the wrecked helicopter from the 1982
  accident on the set of Twilight Zone: The Movie, in which three people died (the blessing rule: handle the
  accident with respect). The 1986-87 trial photograph is hosted, under a new "Events" group.
- Not linked: a Janice Rule and Terry Burnham press photo whose page names no episode; tying it to "Nightmare as a
  Child" would be an inference, so it is filed only under the two actors.
- Cycle 7 (autonomy window 3, Adam 2026-11-26 02:41 UTC): accessibility audit beyond axe. Fixed the heading outline (hidden h2 on section pages and Viewing paths; EpisodeExplorer takes the parent heading level) and made check:site fail on any skipped level; header brand may wrap at 320 px under WCAG 1.4.12 text spacing; search result count announced through a status region. Map pins left as they are: the place list is the keyboard route.
- Cycle 8: a weekly GitHub workflow checks every outbound link (the cloud sandbox can't reach most sites; GitHub's runners can), report only. Record scan for empty, placeholder, malformed-date and impossible-year values found nothing to fix.
- Cycle 9: /support/ page, linked in the footer. Wording promises no ads, no say for donors and donations only for running the site; the button reads DONATE in site-links.ts (Ko-fi, Adam's choice 2026-11-26) and stays hidden until he sets it up. At 360 px and below the header gap is 8 px so the name keeps one line while still being able to wrap under text spacing.
- Cycle 10: print always uses the Paper palette (generated by build-tokens.mjs, so no raw colors) and keeps record heads, figures, cards and fact rows whole; apple-touch-icon (180 px, full-bleed) and a 32 px PNG icon drawn from favicon.svg, with /favicon.ico redirected to it.
- Cycle 11: dead outbound links (link check run 2 on the branch: 151 down to 127 after canonicalising mirror hosts). Every dead link with a Wayback copy that answered 200 now points at that copy (67 URLs, 215 occurrences in data and assessments); the doubled Golden Spiral URL now points at its show page. Links with no archived copy are left in place (never drop a source) and stay on the weekly report. Five Wikipedia titles flagged missing were not changed, because the correct titles could not be verified from here. Event venues map colour map-8 changed to dark teal.
- Cycle 12: the five Wikipedia links the checker flagged as missing, each checked by web search on 2026-11-26: Logan's Run (novel) -> Logan's_Run (the novel's article; the film is separate), What Dreams May Come (novel) -> What_Dreams_May_Come_(Matheson_novel), Are You Afraid of the Dark? (1990 TV series) -> Are_You_Afraid_of_the_Dark%3F, Editorial Novaro -> es.wikipedia (no English article), Gauntlet Press (no article anywhere) -> the publisher's own page for As Timeless as Infinity vol. 10.
- Cycle 6 photos: 37 of 39 fetched pictures imported. Left out the Steven Spielberg masterclass photo (three people on a dark stage, no way to tell which is him) and the cropped Lanigan's Rabbi still filed under Art Carney (the man shown looks like co-star Stuart Margolin); both removed from the pending list. The Sonny Bono and Telly Savalas sketch photo is kept for Savalas, with alt text naming who is where.
- Cycle 6 (Adam said "continue", 2026-11-25 22:01 UTC): fixed layout shift (space held for the account buttons, votes
  and search box; metric-matched fallback fonts), added a layout-shift check to `check:a11y`, a year's cache for
  fonts and a week's for photos, a sitemap, and structured data on the record types that lacked it. The
  Discuss and Fan contributions links are now rendered by RecordHeader; public/account.js (fan accounts work) puts
  its buttons in front of them instead of adding the links itself.

## Waiting on Adam

- Ko-fi page for the Support hosting donate button (Adam, 2026-11-26: he will create it). Then set DONATE in src/lib/site-links.ts to { url: 'https://ko-fi.com/<page>', label: 'Ko-fi' } and the button appears on /support/.
- Nothing yet.

## Found, for later

- /people/characters/ (325 KB) and /series/1959/ (303 KB) are just over the 300 KB target (within the 1.5 MB limit).
