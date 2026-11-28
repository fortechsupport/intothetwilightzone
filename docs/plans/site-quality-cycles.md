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
- Cycle 12: the five Wikipedia links the checker flagged as missing, each checked by web search on 2026-11-26: Logan's Run (novel) -> Logan's_Run (the novel's article; the film is separate), What Dreams May Come (novel) -> What_Dreams_May_Come_(Matheson_novel), Are You Afraid of the Dark? (1990 TV series) -> Are_You_Afraid_of_the_Dark%3F, Editorial Novaro -> es.wikipedia (no English article), Gauntlet Press (no article anywhere) -> the publisher's own page for As Timeless as Infinity vol. 10. Search excerpts: record action links and figure captions/credits marked data-pagefind-ignore (the credit stays on the page and on /credits/images/); a build step (spaceFacts in integrations/external-links.mjs) puts a space between dt and dd so facts don't run together; the highlighted search term uses surface-3 with a brass underline (text on surface-3 is already contrast-checked).
- Cycle 13: below 640 px Pagefind stacks its filter panel (280 px at 320 px wide) above the results; it now folds behind a Filters button (aria-expanded) inserted before the drawer, below 40em only, matching Pagefind's own breakpoint (measured: side by side from 640 px). Intro text no longer says the filters are 'beside' the results.
- Cycle 14 (window 4, Adam 2026-11-26 10:18 UTC): goodoldtv.com and gilligansisland.org were Wikipedia copy sites (paths are Wikipedia titles; web search on 2026-11-26 shows The_Twilight_Zone_(1959_TV_series,_season_N) on en.wikipedia.org), so their 352 links now point at en.wikipedia.org with titles 'Wikipedia: ...'. Duplicate source entries (same URL twice) removed in 98 records, keeping the first. Not changed: dead links whose pages still appear in web search (authorwars, hakes, aol, yahoo, Television Academy, WETA), since a 404 to our checker may be a bot block; podcast episode links come from the podcasters' own feeds and are refreshed weekly.
- Cycle 15 (window 4): a speed check of 18 page types on a throttled phone connection found every largest paint under 1.5 s, so nothing changed. The heaviest pages (/series/1959/ 309 KB, /people/characters/ 325 KB) are heavy because of their content and stay as they are.
- Cycle 16 (window 4): the 2026-11-26 link check (run 45800967023) shows 51 broken links, none of them the new Wikipedia links. Swapped the three that have Wayback copies (Musicnotes, Downpour, plosin.com essay) and reworded the sheet-music description so it no longer says Musicnotes sells it now. scripts/podcast-feeds.mjs gains cleanLink(), which keeps the last full URL when a feed glues its site address in front of an episode link (Golden Spiral Media's feed).
- Cycle 17 (window 4): ISFDB lookups run on GitHub (research.yml, isfdb-story-dates.mjs), because the cloud session cannot reach isfdb.org. I accepted a match only when the ISFDB title record names the record's author, and stored ISFDB's title date (its date of first publication) as first_published. first_published_in is set only where the earliest printing ISFDB lists has that same date. Where the record already hedged ("does not mark that printing as the first"), the wording stays. "All of Us Are Dying" is not dated, since its only printing came after the episode aired. Run 1 (45802472083) was cancelled after 25 minutes with 16 of 44 stories read. The script now has a 20 s timeout per request and prints progress.
- Cycle 18 (window 4): run 2 (45806375390) read all 44 stories, but ISFDB timed out on most of them. The three new author-verified matches (The Canal, The Dark Boy, The Dear Departed) are applied under the same rules as Cycle 17. The timeout is now 60 s. The 28 stories still undated: A Question of Fear, I'll Never Leave You – Ever, Lost and Found (no ISFDB match in run 1), plus Room with a View, She'll Be Company for You, Soft, Sweet Sleep, Song for a Lady, Stop Killing Me, Tell David, The Academy, The Burning Man, The Chaser, The Depository, The Flat Male, The Funeral, The Fur Brooch, The Hitch-Hiker, The Horsehair Trunk, The Misfortune Cookie, The Other Hand, The Painted Mirror, The Phantom Farmhouse, The Ring with the Red Velvet Ropes, The Sins of the Fathers, The Valley Was Still, The Witch, Tick of Time and To See the Invisible Man (timed out). Dispatch research.yml again to retry them.
- Cycle 19 (window 4): run 3 (45811323884, 60 s timeout) answered quickly. 15 author-verified matches applied under the Cycle 17 rules. "Song for a Lady" already named its collection, so it gains only the date. For "The Burning Man", ISFDB dates the story to July 1975, before the 1976 collection the record named, so the record now says so. Rejected as other writers' stories: The Academy, The Depository, The Funeral, The Hitch-Hiker, The Sins of the Fathers, Tick of Time. No ISFDB record: A Question of Fear, I'll Never Leave You – Ever, Lost and Found, Soft, Sweet Sleep, Stop Killing Me, The Ring with the Red Velvet Ropes, The Witch. 14 stay undated, each with a reason.
- Cycle 20 (window 4): the lookup now reads up to 15 same-titled ISFDB records and keeps only those that name the record's author (by surname). Run 4 (45814333803) found the right records for Lost and Found, The Academy, The Funeral and The Sins of the Fathers, which runs 1-3 had missed among other writers' stories of the same name. 10 stay undated. ISFDB has no record by the right author for nine of them, and All of Us Are Dying is the post-broadcast case. These need the authors' own collections or another catalogue. That is a research round for a later window, not something to guess.
- Cycle 6 photos: 37 of 39 fetched pictures imported. Left out the Steven Spielberg masterclass photo (three people on a dark stage, no way to tell which is him) and the cropped Lanigan's Rabbi still filed under Art Carney (the man shown looks like co-star Stuart Margolin); both removed from the pending list. The Sonny Bono and Telly Savalas sketch photo is kept for Savalas, with alt text naming who is where.
- Cycle 6 (Adam said "continue", 2026-11-25 22:01 UTC): fixed layout shift (space held for the account buttons, votes
  and search box; metric-matched fallback fonts), added a layout-shift check to `check:a11y`, a year's cache for
  fonts and a week's for photos, a sitemap, and structured data on the record types that lacked it. The
  Discuss and Fan contributions links are now rendered by RecordHeader; public/account.js (fan accounts work) puts
  its buttons in front of them instead of adding the links itself.

## Waiting on Adam

- Done 2026-11-28: Ko-fi page ko-fi.com/intothetwilightzone (Adam); DONATE set in src/lib/site-links.ts and the button shows on /support/.
- Nothing yet.

## Found, for later

- /people/characters/ (325 KB) and /series/1959/ (303 KB) are just over the 300 KB target (within the 1.5 MB limit).
