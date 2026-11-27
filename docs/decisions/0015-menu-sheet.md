# 0015 The menu is Adam's sheet: Meet, View, Listen, Read, Play, Collect, Legacy

**Date:** 2026-11-27. **Decided by:** Adam, who sent the menu as a spreadsheet (2026-11-26 19:30 ET; copy at
/mnt/project-files/site-cycles/adam-menu-sheet-2026-11-26.png) and answered "yes" (19:34 ET) to the five proposed
answers in docs/plans/navigation-2026-11-27.md. Details marked *(thread)* were decided while building.
Supersedes the verb list of decision 0011 and the Play and Art and design placement of 0013.

## Decision

- Seven groups, in this order: **Meet, View, Listen, Read, Play, Collect, Legacy**. Items in each group follow the
  sheet's numbering, not A to Z.
- **Meet:** Organizations, People, Places, Events. People holds real people, characters and fans, and links the
  community forums. Places keeps its Real places and Settings tabs. History merges into Events (with the Timeline
  linked): its five shelves keep their names under /events/, and /history/ redirects.
- **View** (replaces Watch): Television, Movies, Stage, Artwork. Art and design takes back the name **Artwork**
  (Adam's word on the sheet) and keeps its address, /artwork/.
- **Listen:** Music, Radio, Podcasts, Lectures.
- **Read:** Scripts, Books, Comics, Magazines, Articles, Essays; Websites and The stories behind the episodes follow
  (Adam's answer 2).
- **Play:** Pinball, Video games, Board games, Card games, Mini golf, Trivia, Six Degrees, then the Episode finder,
  Episode of the day and fan-made games (answer 4). "Board, card and party games" splits into Board games, Card games,
  Mini golf and Trivia games (answer 3); /games/board-card-games/ redirects to Board games.
- **Collect** and **Legacy** span every category (answer 1): Collect lists what a fan can own, category by category;
  Legacy lists the unofficial and inspired works, category by category. *(thread)* Collect's categories and shelves
  are COLLECT_FROM in src/lib/taxonomy.mjs: Merchandise, then Books, Comics, Magazines and Scripts, Scores and
  soundtrack albums, and the physical and video games. Legacy keeps the relationship shelves first, titled "Legacy by
  relationship" (so the group page and the category page do not share a title) and shown as "By kind of link", then
  one page per category (LEGACY_FROM) listing every entry marked unofficial, grouped by shelf.
- /watch/ redirects to /view/ and /discover/ to /legacy/; /attend/ and /visit/ keep pointing at Events and Places.

## Why

Adam's sheet. Meet first puts the directories everything links to at the front; View covers looking at art as well
as watching; Legacy names what the show inspired, which Discover only described.
