# Television step 1: audit and gap list (2026-11-21)

Status: every item below not marked *research* is fixed in the second pass (commit after 09d3402).

Adam's review of step 1 (10:43 UTC): "nice start, but it lacks so much. Link texts are clunky instead of concise.
Some pages have no options for searching, sorting, and filtering." Every Television page type was opened at
320 px and 1440 px on the preview build and compared with plan section 5 and with the best reference sites
(IMDb and TVmaze series pages, the Twilight Zone Vortex and Fandom wikis, Letterboxd lists). Each gap below is
fixed in this pass unless it is marked *research*: that needs new sourced facts, which are in steps 2 to 5.

## Search, sort and filter

| Page | Before | Fix |
|---|---|---|
| Every subcategory page, site-wide (`/<cat>/<sub>/`) | A plain list, no tools | Search, shelf (official/unofficial), group, relevance, and sort: A to Z, Z to A, newest, oldest. Count shown; the choice stays in the address |
| Television landing (`/series/`) | Eight A to Z cards, then 8-item previews of every shelf (11,000 px) | A purpose-built page: the four series first, Night Gallery, then the shelves in a sensible order, and one search box across every show and episode |
| Series pages (`/series/1959/` etc.) | Two fixed tables (A to Z, air order) under 10,000 px of history | One episode table near the top with search, season, writer and director filters and sort by air date, title or season |
| Episode pages: Legacy list | Up to 60 rows, unsorted, unfiltered | Grouped by medium (Television, Film, Music, Games, Collectibles...), with a filter for type and certainty |
| Homages page | Filters, but one sort only | Sort by Twilight Zone story, show, newest or oldest |
| Show pages (Night Gallery and others) | Explorer present | Kept; sort gains newest/oldest; the explorer moves above long secondary lists |

## Link and label text

| Before | After |
|---|---|
| "Every homage, with filters" | "All homages" |
| "Jump to all 156 episodes (A to Z or in air order)" | Page tabs: Episodes · History · Home video · International · Homages · People · Media |
| "Every television homage to this series, with filters" | "See them all" |
| "All 8 in Pilots and unmade projects →" / "all 1390 →" | "See all 8" / "All 1,390" |
| "Sort and filter X in the Y index →" | "Browse X" |
| Homage rows: "Homage of “The After Hours” (1959) in The After Hours · Severance" | "Severance, “The After Hours” (2025)" with "Homage of “The After Hours”" under it |
| "Reference The Twilight Zone (1959–1964) (Series) Documented" | "References The Twilight Zone (1959)" plus the mark |
| "(collectible)", "(Song)", "(game)" mixed case | A group heading per medium instead |
| Inline citations "(Wikipedia - The Twilight Zone (1959 TV series))" | "(Wikipedia)"; the full title shows on hover and in Sources |
| Breadcrumb "Rod Serling's other series" on Night Gallery | "Rod Serling's series" |
| "Tangential to The Twilight Zone" pill | "Why it's here" line with the reason and its source |
| Explorer heading "Episodes (45 entries)" | "45 episodes" |

## Content and structure gaps (plan section 5)

| Item | Before | Fix |
|---|---|---|
| Series header | Network, host, seasons, count | Adds years, first and last air dates, runtime, production company and network links, most frequent writers, directors and actors with counts |
| People panel on series pages | Missing | Top writers, directors and actors by episode count, each linking to People; full list in People filtered to the series |
| Characters and filming locations on series pages | Missing | Counts and links to the Characters and Places entries tied to the series |
| Homages to the series | 179 in one list | Grouped by medium with a filter, television first |
| Fellow anthologies and show records | Title, one line, "Released 1963", a Wikipedia link | "Why it's here" with tier and source, the tags spelled out, people they share with The Twilight Zone (from our own credits), other shelf members to browse. Years, network, creator and episode counts: *research* (step 3) |
| Night Gallery page | Explorer below a 20-item "More Night Gallery" list | Explorer first; the extras become grouped links (paintings, music, home video, awards) |
| Previous and next | On episode pages only | Also between shows on the same shelf |
| Count mismatch | Landing said 166 homages, homages page 170 | One count from the same data |

## Found, for later
- Network and studio records for NBC, Universal, ABC and the anthologies' networks (plan section 6): *research*.
- Serling's 200+ teleplays: *research*, round 1.
- Home video and streaming links per show: *research*, round 4.

## Third pass (Adam, 11:25 UTC): where to watch and new-tab links

Adam: "I love the dynamic feel... the Where to watch should appear on any content page or section referencing
content... display it next to the series name rather than each episode... internal links open in the same tab, but
external links open in new tabs." Recorded as decision 0003.

| Check | Result |
|---|---|
| Every series, show, film and episode page has a Where to watch row near the top | Done (radio, unaired and unmade excluded) |
| Lists show it once per show, never per episode | Done: series cards, Night Gallery card, anthology and Serling shelves, homage shelf headings, most-homaged shows, homages page show filter |
| Every external link opens in a new tab with noopener noreferrer and a screen-reader note | Done, enforced by check:site |
| No internal link opens a new tab | Done, enforced by check:site |
| Facts sourced and dated | Each show's JustWatch US page and its check date |

### Found, for later
- Filled in after merge: 112 shows and series checked. Not on JustWatch US: the 2002 revival, Playhouse 90, Studio One, The U.S. Steel Hour, Kraft, Climax!, The Jane Wyman Show, Chrysler Theatre, Journey to the Unknown, Out of This World, Science Fiction Theatre, The Loner, B.J. and the Bear, Ghost Story, Ichabod and Me, Hot Metal, Hoppity Hooper, Muppets Tonight, Countdown, Svengoolie, The Charmings, The Flash (1990), Muppet Babies (1984); they show search links.
- Movies and TV films: search links only; check each film's JustWatch page in a later round.
- /series/1959/ is 305 KB, just over the 300 KB target, after the new-tab attributes.
