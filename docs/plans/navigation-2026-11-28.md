# Navigation, 2026-11-28: Discover first, and one table per group

**Date:** 2026-11-28. Adam's message in the project (14:19 UTC) is the approval; this plan records how it was read.
Supersedes the Meet and Read lists of decision 0015 (docs/plans/navigation-2026-11-27.md).

## What Adam sent

| Group | Items, in his order |
|---|---|
| Discover | Organizations, People, Places, Events |
| View | Television, Movies, Stage, Artwork |
| Listen | Music, Radio, Podcasts, Lectures |
| Read | Articles, Books, Comics, Essays, Magazines, Scripts, Short Stories |
| Play | One sortable, filterable, searchable table: official games, fan-made games, trivia, Six Degrees, nods from other games, anything that gets played |
| Collect | One such table: official and unofficial merchandise, anything you can collect, buy or acquire, physical and digital |
| Legacy | One such table: all the kinds of links, with all the categories in columns |

"The tables from the category groupings of Discover, View, Listen, and Read should also be 1 sortable, filterable,
searchable table."

## Reading taken

- **Meet becomes Discover**, with the same four items. /discover/ becomes the group page again; /meet/ redirects to it.
  (/discover/ pointed at /legacy/ for one day, 2026-11-27 to 2026-11-28; that redirect is retired.)
- **View and Listen are unchanged** (Artwork and Lectures were already there since 2026-11-27).
- **Read** lists exactly his seven items, which are A to Z: Articles, Books, Comics, Essays, Magazines, Scripts, Short
  stories. Its topic collections (Anniversary coverage and the rest) are not menu items any more; they stay on the
  Read page and become a filter in its table.
- **Short stories** replaces "The stories behind the episodes" (same records, address /reading/short-stories/, old
  address redirects). Serling's own short story "First Squad, First Platoon" (The Strand, 2024) joins it.
- **Websites leaves Read.** Its 15 records are never dropped: they move to Legacy as a new kind of link, "Websites and
  fan sites" (/homages/websites/, old address redirects). See "Decided here".
- **Play, Collect and Legacy menus are unchanged**; each group page gains its one table.
- **One table per category** (Adam, 14:29 UTC, correcting a first reading of one table per group): Discover, View and
  Listen get one on each category page (Organizations, People, Places, Events, Television, Movies, Stage, Artwork,
  Music, Radio, Podcasts, Lectures), Read one on each of its seven format pages, and Play, Collect and Legacy one each
  on their group page. One row per record: search, a filter per column, sort by any column (a Sort menu too, for
  phones), A to Z by default (ignoring a leading The, A or An). The table replaces the shelf previews and the old A to
  Z indexes on those pages; the shelf pages keep their Official and Unofficial shelves. Every address still works.

## Steps (one pull request each)

One pull request (the two parts depend on each other's navigation):
1. Menu: Discover, Read's seven items, Short stories, Websites into Legacy, redirects, docs, decision 0017.
2. The tables: one component (src/components/GroupTable.astro, data in src/lib/group-table.ts) for all 22 tables, fed
   by one JSON file per table built with the site (/tables/<key>.json), so pages stay small: the first 100 rows are in
   the page, the rest load when a visitor searches, filters, sorts or asks for more.

## Acceptance checks

- [ ] The menu shows Discover, View, Listen, Read, Play, Collect, Legacy; Read's items are exactly Adam's seven.
- [ ] /meet/, /reading/websites/ and /reading/source-stories/ redirect; no broken internal links (check:site).
- [ ] Each category of Discover, View and Listen, each Read format, and Play, Collect and Legacy has one table; every
      record is a row; search, every filter and
      every sort work; the address keeps the filters (shareable); "n of N shown" is announced.
- [ ] Play's table includes licensed games, nods in other games, fan-made games, published trivia games and the
      games on this site (Trivia quiz, Six Degrees, Episode finder, Episode of the day).
- [ ] Collect's table includes every shelf in Collect, official and unofficial, with a Physical or digital column.
- [ ] Legacy's table has a Kind of link column and a Category column, each filterable.
- [ ] Group pages stay under 300 KB of HTML; tables work at 320 px without sideways scrolling; axe finds nothing.
- [ ] All CI checks pass; screenshots at 320 and 1440 px.

## Decided here (Adam reviews later)

1. Websites go to Legacy as "Websites and fan sites", because Adam described Legacy as "all the kinds of links" and
   8 of the 15 are fan sites and fan wikis that track the show's legacy (Simpsons Wiki, Muppet Wiki, The Infosphere,
   The Twilight Zone Vortex). The other 7 are reference entries (Wikipedia, TV Tropes, the SF Encyclopedia, Atlas
   Obscura). Moving them anywhere else is one line in MOVES (src/lib/taxonomy.mjs).
2. "Short stories" keeps the one radio play (Lucille Fletcher's "The Hitch-Hiker") and the one anthology (Bennett
   Cerf's Famous Ghost Stories) that episodes adapt, labelled by kind, so the shelf stays the full list of what the
   episodes adapted.
3. Read's topic collections leave the menu (Adam listed seven items) but stay on the Read page and in its table.
4. Physical or digital (Collect) is taken from what each record says: its shelf (digital versions of the pinball
   table; home video is physical), its format or subtype (download, app, e-book, streaming, digital). Records that
   say nothing either way are "Physical" only where the shelf is physical by nature (figures, cards, apparel, props,
   print), and otherwise "Not stated".

<<<<<<< HEAD
9. *(follow-up, 2026-11-28)* The 25 Collect items that said nothing about format were researched and each record now
   carries `details.medium` with a note: 14 physical, 3 digital, 7 "Not released on its own" (episode scores, cues
   and music heard only inside a programme, an unmade game and a rumored pinball remake, which sit on Collect shelves
   but were never sold), and 1 still "Not stated": the 2004 Tower of Terror promotional PC game, whose only source
   (Tower Secrets) names no disc or download and no other source was found.

=======
>>>>>>> 336f4cd655029363425119b675e77778ca40a913
## Waiting on Adam

- Nothing.

5. People, Places and Organizations: the new table replaces their old A to Z index and keeps its "Appears in" filter
   and record counts (a Records column, sortable). The one-page-per-letter A to Z of People stays.
6. Read formats: the table replaces the grouped list; its Group column is the old grouping (Biographies, Gold Key...)
   and "Official or not" is a column instead of two shelves.
7. Legacy's "all the categories in columns": one Category column with a filter, rather than a column per category,
   so the table fits a phone. A work linked to the show only by a connection takes the category of the later work
   (a film is Movies, a TV series or episode Television, a song Music); 229 other works (games, products, websites
   recorded as works) show as "Other works".
8. Where a record states no reason, its row shows its shelf and its one line of facts ("Actors: 1 credit,
   1924-1998"), as its shelf page does.

## Found, for later

- One Legacy entry shows its address instead of a title (the Alan Wake "Night Springs" connection); the title comes
  from the connection record. Fix in the data in the next quality cycle.
