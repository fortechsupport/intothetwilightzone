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

## Waiting on Adam

- Nothing yet.

## Found, for later

- (none yet)
