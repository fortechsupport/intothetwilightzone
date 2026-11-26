# 0011 Seven verbs: Attend and Visit fold into Discover

**Date:** 2026-11-26. **Decided by:** Adam, in the project chat (12:35 UTC): "Watch should be ordered with
Television first, then Movies, then Stage. Listen should be ordered with Music first, then Radio, then Podcasts.
Read should be ordered with Articles first, then Books, Comics, Essays, Magazines, Scripts, and Websites ... We
don't need Attend. Include Events and Lectures in Discover instead. Visit can be included in Discover also, with
tabs to toggle between Real Places and Settings." Details marked *(thread)* were decided while building, for
him to review. docs/INFORMATION_ARCHITECTURE.md is updated to match.

## Decision

- The main menu has seven verbs: Watch, Listen, Read, Play, Collect, Discover, Meet.
- **Watch:** Television, Movies, Stage. **Listen:** Music, Radio, Podcasts. Set by `order` on each verb in
  `VERBS` (src/lib/taxonomy.mjs); a category a verb's order leaves out follows A to Z.
- **Read:** Articles, Books, Comics, Essays, Magazines, Scripts, then The stories behind the episodes, then
  Websites (`READ_ORDER`). Adam's list did not name the stories shelf; it keeps its A to Z place *(thread)*.
- **Discover:** History, Legacy, Events, Lectures, Places *(thread: the order)*.
- **Places** page: two tabs, Real places (the kinds and the A to Z index) and Settings (every fictional setting
  A to Z). `/places/#settings` opens the Settings tab; the menu's last Places link points there. Without
  JavaScript both lists show, one after the other. The tabs follow the WAI-ARIA tabs pattern (arrow keys, Home,
  End) and the panel is chosen before the page draws, so nothing shifts.
- `/attend/` redirects to `/discover/` and `/visit/` to `/places/` (`RETIRED_VERBS`). The home page and 404 say
  "Seven ways in".

## Why

Adam's call: fewer verbs make a shorter menu, and Events, Lectures and Places are all ways to discover the
show's story. The record pages and addresses of every event, lecture and place are unchanged.
