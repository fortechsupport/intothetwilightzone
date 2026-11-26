# Navigation changes and suggestions (2026-11-26)

**Asked by Adam:** 2026-11-26 12:35 UTC (7:35 AM Eastern), in the project chat: reorder Watch, Listen and Read;
drop Attend (Events and Lectures into Discover); fold Visit into Discover with tabs for Real places and Settings;
suggestions wanted on link icons, Play, Collect and Artwork, "and any and all of this". He also shared two
pictures describing each era's look (lighting, colour, camera), which bear on the era themes (decision 0010).

**Approved by Adam (his words are the approval):** the orderings, removing Attend, Visit into Discover with tabs.
**Not yet approved:** everything under "Suggestions" below.

## Steps (one pull request each)

1. **Seven verbs** (this PR): the orderings, Attend and Visit folded into Discover, Places tabs, redirects,
   docs (INFORMATION_ARCHITECTURE.md, decision 0011, release note).
2. **Link badges** (after Adam picks an option): icons beside external links.
3. **Play and Collect** (after Adam answers): whichever of the suggestions he takes.
4. **Era themes retuned** (screenshots to Adam first): palettes and textures matched to his era breakdown.

## Acceptance checks for step 1

- [x] Main menu shows seven verbs in the order Watch, Listen, Read, Play, Collect, Discover, Meet.
- [x] Watch lists Television, Movies, Stage; Listen lists Music, Radio, Podcasts; Read lists Articles, Books,
      Comics, Essays, Magazines, Scripts, The stories behind the episodes, Websites (menu, verb page, home tile).
- [x] Discover lists History, Legacy, Events, Lectures, Places; its menu's Places column ends with "Settings in
      the stories", which opens the Settings tab.
- [x] /places/ has Real places and Settings tabs, keyboard operable; with no JavaScript both lists show.
- [x] /attend/ and /visit/ redirect; no broken internal links.
- [x] check:data, tokens --check, build, check:site and check:a11y (with /places/ added to its sample) pass.
- [x] Screenshots at 320 and 1440 px in /mnt/project-files/site-cycles/nav-2026-11-26/.

## Suggestions (for Adam)

**Link icons.** The Wikipedia and IMDb logos are trademarks of their owners, and using them is governed by
their own trademark terms; for a site that hopes for a blessing, borrowed logos are the one part of this that
could look careless. Options: (A) a small generic icon for each kind of link (encyclopedia, film database, book
database, video, audio, archive, lyrics, official site) beside the site's name in text; (B) monochrome brand
glyphs beside the name; (C) each site's own favicon, loaded from that site. Recommended: A. It reads as fast as a
logo, needs no one's permission, and stays in the site's own visual style. C also sends visitors' requests to
other sites, so it is not recommended.

**Play.** Today Play holds only Games (43). Suggested:
1. A "Play on this site" shelf listing what is already built: Six degrees of the Zone, the Episode finder and
   Episode of the day.
2. A trivia quiz built only from facts already on the site, each answer linking to its record and source.
3. List the fan-made games (now under Legacy > Fan-made) on Play's unofficial shelf as well.

**Collect and Artwork.** Most of Artwork is about how the shows look (Night Gallery paintings, make-up and
production design, title design, cover art, illustration), which is something to discover rather than to own.
Suggested:
1. Move Artwork to Discover as "Art and design", except Props and costumes (screen-used items, auctions) and
   Posters and prints, which stay in Collect.
2. Collect then lists, in place of one Merchandise card: Home video; Toys, figures and replicas; Trading cards
   and collectibles; Apparel and household; Masks and costumes; Props and costumes (screen-used); Posters and
   prints. These are today's Merchandise and Artwork subcategories, promoted so the menu shows them directly.
3. A "Track your collection" link to My Zone (its owned and wanted lists already exist).

**Era themes.** Adam's breakdown differs from today's themes in two places: 1985 is described as warm, earthy
domestic tones with electric blue and purple for the supernatural, under soft hazy light (today: magenta and
cyan on indigo), and 2019 as glossy, saturated, symmetrical, with stark black-and-white title cards (today:
black, red and violet). 1959 (black and white, hard shadows) and 2002 (drained, cold blue, harsh overhead light)
are close already. Suggested: retune 1985 and 2019, add a venetian-blind shadow texture and fog vignette to 1959
and a colder, greyer cast to 2002, all within the contrast checks and decision 0010's rule (palette, type and
texture only, no logos or title designs). Screenshots to Adam before merging.

## Decided here (Adam reviews later)

- Discover's order: History, Legacy, Events, Lectures, Places (the show's story first, then what it inspired,
  then the gatherings, then the places).
- Read keeps "The stories behind the episodes" (not in Adam's list) between Scripts and Websites, its A to Z place.
- /visit/ redirects to /places/ (the directory itself) and /attend/ to /discover/.
- Discover's menu shows Places' real kinds A to Z, then "Settings in the stories" last, pointing at the tab.
- The verb blurbs for Listen, Read and Discover were rewritten to follow the new order and contents.

- Link icons (step 2, Adam chose option A at 12:48 UTC): which hosts belong to each kind (src/lib/link-kinds.mjs);
  icons only in link lists, not in running text; a legend on Sources and policy.

- Play and Collect (step 3, decision 0013): Art and design placed after History in Discover; Merchandise's
  shelves kept as they are rather than merged; the quiz uses credits and air years only.

## Waiting on Adam

- Nothing: Adam approved Play, Collect and the era themes ("yes, yes, yes", 13:34 UTC). Era themes go to him as
  screenshots before merging.

## Found, for later

- With seven verbs the home page's three-column grid leaves Meet alone on its last row. If Collect changes as
  suggested, the grid will be revisited with it.
