# The explore framework: group pages, 24 tables, Sources, record pages, spoilers, 404

**Date:** 2026-11-28. **Approved by Adam:** his menu (14:19 UTC), the correction to one table per category (14:29),
no category links for Play, Collect or Legacy (15:04), his answers to 30 questions (15:59) and to 20 follow-ups
(16:51). This plan replaces the open parts of docs/plans/navigation-2026-11-28.md.

**Total rebuild (Adam, 16:51):** no public links have been published and there are no visitors or users yet, so any
address may change, no redirects are kept or added, and account data may be reset if the design needs it (Adam
recreates his account; he is told before it happens).

## 1. Menu and group pages

| Group | Toggles, in Adam's order | Address of each |
|---|---|---|
| Discover | Organizations, People, Places, Events, Sources | /discover/organizations/ ... /discover/sources/ |
| View | Television, Movies, Stage, Artwork | /view/television/ ... |
| Listen | Music, Radio, Podcasts, Lectures | /listen/music/ ... |
| Read | Articles, Books, Comics, Essays, Magazines, Scripts, Short stories | /read/articles/ ... |
| Play, Collect, Legacy | none: one table each | /play/, /collect/, /legacy/ |

- The menu's Discover, View, Listen and Read dropdowns list the category names; Play, Collect and Legacy are single
  links. No category or shelf links anywhere for Play, Collect or Legacy.
- **Toggles:** a row of buttons under the group's title; the selected one shows its category's two-sentence intro and
  its table below. Each toggle is a real link to its own address (works without JavaScript, can be shared and
  bookmarked); with JavaScript the table swaps in place and the address updates. /view/ opens on the first toggle,
  later on the one the visitor last chose (remembered in the browser).
- **Phones:** the toggles are one sideways-scrolling strip with the scroll bar hidden (Adam). A soft fade at the edge
  shows there are more; arrow keys move between toggles; the selected one scrolls into view.
- **No "How this connects" box** on toggles (Adam, 16:51). Intro and table only.
- **Removed:** every category landing page and every shelf page (/series/, /movies/, /movies/linked-films/ ...), the
  held branch's redirects, and every redirect in astro.config.mjs. Record pages keep their addresses (/films/<id>/,
  /episodes/1959/<id>/ ...): nothing gains from moving them.

## 2. What every table does

- One row per record, A to Z by default ignoring a leading The, A or An (people by surname, see 7 below); first 100 rows
  in the page, the rest load on first use; filters and sort kept in the address.
- **Search** across every column. **Filters:** one per column marked F below. **Sorting:** only the column headings
  marked S are clickable (click again to reverse); a Sort menu offers the same on phones.
- **Official** column (Official / Unofficial and inspired) wherever a table holds both.
- **Fan rating:** the net thumbs up/down already on record pages, as a sortable column on View, Listen and Read
  tables (loaded from the votes service; blank until an item has votes).
- **Row actions** (saved to My Zone: in the browser, or the account when signed in): View: Watched, Want to watch.
  Listen: Heard. Read: Read, Want to read. Collect: I have it, I want it. Every row also has Details (its page).
- **Play, Collect, Legacy** also get one-tap Category chips above the table and a "Surprise me" button that opens a
  random row matching the current filters.
- **No combined values.** Wherever an old shelf joined two things ("Props and costumes", "Toys and figures",
  "Adaptations and remakes", "Narrators and hosts"), each becomes its own value, and every record is assigned the one
  or ones that fit, from its sources. Where a source doesn't say, the record is checked and the result logged.

## 3. The 24 tables (S = sortable heading, F = filter)

### Discover
1. **Organizations:** Name (S) · Kind (F: Network, Studio, Streamer, Production company, Publisher, Product licensee,
   Record label, Game company, Toy company, Home video label, Sponsor, Advertiser, Archive, Library, Museum,
   Foundation, Society, Award body, School, Fan club, Auction house, Other) · Founded (S) · Ended · Based in (F) ·
   Part of (parent company) · Records (S, how many records name it) · Official (F, rights holders and licensees).
2. **People:** Name (S, by surname) · Kind (F: Real person, Character, Fan) · Roles (F, each separate: Actor, Voice
   actor, Writer, Director, Producer, Composer, Crew, Narrator, Host, Artist, Illustrator, Game maker, Scholar,
   Historian, Family, Creator it inspired, Fan) · Appears in (F: each series, Night Gallery, the movie, radio...) ·
   Born (S) · Died (S) · Credits (S). Characters show "Played by" in their row line.
3. **Places:** Name (S) · Kind (F: Filming location, Set or backlot, Serling place, Attraction, Museum or exhibit,
   Memorial, Archive, Venue, Setting in a story) · City · State or region (F) · Country (F, S) · Status (F: Open,
   Closed, Demolished) · Filmed here (S, number of episodes and films) · Map link.
4. **Events:** default order is date, because order is the point. Event (S) · Date (S) · Kind (F: Anniversary,
   Festival, Screening, Marathon, Convention, Conference, Panel, Exhibition, Award, Honor, Ranking, Memorial, Premiere,
   Production milestone, Broadcast milestone, Serling's life, Trial, Lawsuit, Rights) · Place (F) · Series (F) ·
   Status (F: Coming up, Past).
5. **Sources**, with its own two toggles (section 4): **Feeds** and **Posts**.

### View
6. **Television:** Title (S) · Series (F: The Twilight Zone 1959, 1985, 2002, 2019, Night Gallery, The Loner and
   Serling's other series, fellow anthologies, other shows) · Type (F: Series, Episode, Segment, Pilot, Special, TV
   film, Unmade, Title abroad) · Season and episode (S, in air order) · First aired (S) · Writer (F) · Director (F) ·
   Theme (filter only) · Where to watch · Fan rating (S) · Official (F). Runtime left out at 1440 px the table was too
   wide to read; it stays on each episode page.
7. **Movies:** Title (S) · Kind (F: Feature film, TV film, Documentary, Short, Special, Music video, Unmade) · Year (S)
   · Director (F) · Writer (F) · Serling's part (F: Wrote, From his work, Narrated, Appeared) · Tie to the show (F:
   Twilight Zone film, Serling film, By Twilight Zone makers, Linked film) · Runtime (S) · Where to watch · Fan rating
   (S) · Official (F).
8. **Stage:** Title (S) · Kind (F: The play, Staging of an episode, Serling's stage work, Live reading, Radio-style
   show, Parody, Tribute) · Company or theater (F) · City (F) · Year (S) · Episodes staged (F) · Official (F).
9. **Artwork:** Title (S) · Kind (F: Art, Illustration, Cover art, Comic art, Night Gallery painting, Make-up,
   Production design, Title design, Poster) · Artist (S, F) · Year (S) · Made for (F: the series, episode or product)
   · Official (F).

### Listen
10. **Music:** Title (S) · Artist (S, F) · Kind (F: Main title theme, Score, Soundtrack album, Cover, Sample, Song
    about the show, Song naming the show, Phrase only, Music video) · Series (F) · Album · Year (S) · Evidence (F,
    for samples and lyrics) · Fan rating (S) · Official (F).
11. **Radio:** Title (S) · Series (F: The Twilight Zone Radio Dramas, Serling's radio work, other adaptations, fellow
    anthologies, fan audio) · Season or volume and number (S, in release order) · Star (F) · Adapts (link to the
    episode) · Writer or adapter (F) · Released or broadcast (S) · Kind (F: Adaptation of an episode, Original radio
    story, Unmade script, Serling wrote, Serling acted, Serling hosted, Fan-made) · Fan rating (S) · Official (F).
12. **Podcasts:** Title (S) · Kind (F: Podcast, Recurring segment, Single episode, Fiction) · Covers (F: each series,
    Night Gallery, the movie, Serling) · Hosts (F) · Network (F) · Started (S) · Episodes (S) · Latest episode (S, from
    the feed) · Status (F: Active, Ended) · Fan rating (S).
13. **Lectures:** Title (S) · Kind (F: Talk about the show, School lesson, University course, Serling speech,
    Serling lecture, Serling's teaching) · Speaker (F) · Where (F) · Date (S) · Recording (F: Recorded, Text only, Not
    recorded) · Fan rating (S).

### Read
14. **Articles:** Title (S) · Author (S, F) · Publication (S, F) · Date (S) · Kind (F: Article, Interview, Review,
    News report, Obituary) · About (F: series, episode, Serling, the movie) · Topic (F: Anniversary coverage, the
    accident and trial, ...) · Fan rating (S).
15. **Books:** Title (S) · Author (S, F) · Publisher (F) · Year (S) · Kind (F: History, Companion, Guide, Biography,
    Memoir, Story collection, Novel, Anthology, Script collection, Self-published) · Pages (S) · Topic (F) · Fan
    rating (S) · Official (F, licensed).
16. **Comics:** Title (S) · Series (F: Dell, Gold Key, Now Comics, Walker & Company, Dynamite, IDW...) · Issue (S, in
    publication order) · Cover date (S) · Creators (F) · Adapts (F, the episode) · Fan rating (S) · Official (F).
17. **Essays:** Title (S) · Author (S, F) · Published in (F) · Year (S) · Kind (F: Essay, Journal article, Book
    chapter, Speech, Review, Thesis) · Episodes discussed (F) · Fan rating (S).
18. **Magazines:** Title (S) · Magazine (F: The Twilight Zone Magazine, Night Cry, others) · Issue (S, in publication
    order) · Cover date (S) · Editor (F) · Cover artist (F) · Fan rating (S) · Official (F).
19. **Scripts:** Title (S) · Writer (S, F) · For (F, the episode or film, linked) · Kind (F: Teleplay, Screenplay,
    Radio script, Published script, Unproduced script) · Year (S) · Where to read (archive or publisher link).
20. **Short stories:** Title (S) · Author (S, F) · First published in (F) · Year (S) · Became (F, the episode it
    became, by series) · Kind (F: Short story, Radio play, Anthology, Serling's own story) · Fan rating (S).

### Play, Collect, Legacy
21. **Play:** Title (S) · Category (F, chips: Pinball, Slot machine, Video game, Board game, Card game, Mini golf,
    Trivia game, Nod in another game, Fan-made game, On this site, Other) · Platform (F) · Maker (F) · Year (S) ·
    Status (F: Released, Unreleased, Unmade, Proposed) · Official (F). Games on this site get a "Play now" action.
22. **Collect:** Item (S) · Category (F, chips: Home video, Toys, Figures, Trading cards, Posters, Prints, Props,
    Costumes, Masks, Prop replicas, Clothing, Drinkware, Pins, Decals, Ornaments, Souvenirs,
    Sheet music, Books, Comics, Magazines, Scripts, Soundtrack albums, Audiobooks, Games, Pinball) · Physical, Digital
    or Both (F) · Edition (F: VHS, Laserdisc, DVD, Blu-ray, 4K, Vinyl, CD, Download, E-book ...) · Maker (F) · Year (S)
    · Series (F) · Official (F). One row per item; an item sold in both forms is "Both", never two rows.
23. **Legacy:** Work (S) · Kind of link (F: the 22 kinds in section 5) · Category (F, chips: Television, Movies,
    Stage, Artwork, Music, Radio, Podcasts, Books, Comics, Magazines, Games, Other) · Draws on (S in air order, F by
    series; links to the episode) · Maker (F) · Year (S) · Evidence (S strongest first, F: Confirmed by its makers,
    Documented, Noted by fans) · Official (F).
24. **Sources, Posts:** see section 4. (Feeds is table 5.)

## 4. Sources (Discover, last)

- **Feeds:** one row per site or publication cited anywhere on the site (about 1,170 distinct sites are cited today;
  databases and stores are grouped by site). Source (S) · Kind (F: Fan site, Blog, Podcast, News, Magazine, Database,
  Wiki, Archive, Library, Academic, Official, Video channel) · Creator or owner (F) · Site link · Feed link, or "No
  feed" (filter: Has a feed) · Page on this site, where one exists (a podcast, an organization) · Cited by (S, number
  of records) · Latest post (S) · Official (F). Websites (formerly in Read) become rows here.
- **Export:** "Download for your feed reader" gives an OPML file (the XML format Feedly, Inoreader, NetNewsWire and
  others import) of every feed, or only the feeds the table is filtered to.
- **Posts:** an RSS reader for every feed in Feeds, newest first. Headline (S) · Source (S, F) · Author · Date (S) ·
  Kind of source (F). Each links to the original in a new tab. No post text is copied (link-only rule). Every post
  from a source about the show is shown; from general sites, only posts about The Twilight Zone, Serling or Night
  Gallery (matched in title or category), and a site's own Twilight Zone tag feed is used where it has one.
- **Refresh:** Adam's choice on the decision card (every 6 hours with no setup, recommended; or every 15 minutes with
  a two-minute setup).
- The policy page now at /sources/ moves to /policy/.

## 5. Legacy kinds, each separate (Adam, 16:51: "don't want things combined")

Adaptations · Remakes · Homages · Parodies · References · Quotations · Lyric mentions · Covers · Samples · Easter
eggs · Named after · Tributes · Inspired by · Compared to · Fan films · Fan audio dramas · Fan edits · Supercuts ·
Fan fiction · Fan art · In everyday language · In their own words.

Found while building (Adam to confirm): two more kinds the existing records need, so none is mislabelled.
- **About the show:** podcasts, books, essays, articles, documentaries and talks whose subject is the show (411
  today). Without it they would have to be called "Inspired by", which they are not.
- **Fellow anthologies:** anthology series in the same tradition with a sourced tie, stated on each page (26).

Today's counts by kind: About the show 411, References 365, Lyric mentions 96, Parodies 66, Inspired by 65, Homages
54, Compared to 50, Samples 41, Fellow anthologies 26, Tributes 20, Adaptations 17, Covers 9, In everyday language 9,
Remakes 8, Fan fiction 6, Named after 3, Fan films 1, Fan audio dramas 1, Fan edits 1, Supercuts 1. Quotations, Easter
eggs, Fan art and In their own words have no records yet: the Legacy research round fills them.
"In other shows" stops being a kind: it is a place, so those rows take Category = Television. Fan-made games are in
Play only. The connection schema's `kind` gains the new values; the existing 583 connections keep theirs.

## 6. Record pages: "More to explore"

On every episode, film and record page, after the facts:
- **More with each person:** for each credited person with other items on the site, up to 3 of them with a link to
  the person's page ("More with Burgess Meredith: Time Enough at Last, Mr. Dingle, the Strong, Printer's Devil").
  Cast in credit order first, then writer, director, composer; the first 6 people show, the rest behind "Show
  everyone".
- **Themes:** each theme tag links to its theme page (/themes/<slug>/, which lists every item carrying it), with up
  to 3 related items under each tag, chosen by most themes shared with this record.
- **Branches:** "Came from" (the episode or story a work draws on) and "What came after" (adaptations, homages and
  everything else in Legacy that points to it), each with its kind of link.
- This replaces "Watch next" and the separate mood explorer; /finder/ stays a game in Play.

## 7. Spoilers and the reveal

- Every sentence that gives away an ending is marked in the data and hidden until clicked: all 329 episodes (1959,
  1985, 2002, 2019) and Twilight Zone: The Movie. 31 endings are written today (data/fan/endings.yaml); the rest are
  written from each episode's sources.
- **Reveal:** the hidden text sits behind a dark panel; on click the panel opens like a door onto a starfield and the
  text fades in, under a second. Original to this site, nothing taken from the shows' title designs. With reduced
  motion: a plain fade. The same reveal, at about half a second, shows the answer in the Trivia quiz.

## 8. The 404 page

Ten versions, one picked at random on each visit (the page also works without JavaScript, showing the first). Each
names its episode, links to it, is in our own words (no quoted dialogue), gives nothing away about the ending, and is
checked against the episode's synopsis before it ships:
1. Where Is Everybody? (1959): "You've walked into an empty town. Nobody's here, and neither is this page."
2. Nightmare at 20,000 Feet: "There's something out on the wing, and it has made off with this page."
3. The Hitch-Hiker: "You keep passing the same spot on the road. The page you want isn't on it."
4. Five Characters in Search of an Exit: "Like the strangers in the round room, you've reached a wall with no door."
5. Little Girl Lost: "This page slipped through the wall. We can hear it, but we can't reach it."
6. A Stop at Willoughby: "Next stop, Willoughby? Not on this line. This page doesn't exist."
7. The Monsters Are Due on Maple Street: "The lights went out on Maple Street, and this page went with them."
8. It's a Good Life: "Somebody wished this page away to the cornfield. Better think happy thoughts, and search."
9. Living Doll: "Talky Tina says this page doesn't exist, and you'd be wise to believe her."
10. The Obsolete Man: "This page has been declared obsolete."
Each version keeps the search box and the ways in.

## Steps (one pull request each; a clickable preview of 1 to 3 goes to Adam first)

1. Group pages with toggles, the category tables in their new places, the menu, removal of category, shelf and
   redirect pages; the 404 page.
2. The table specification in section 3: new columns, split values, per-table sorting, fan rating, row actions.
3. Play, Collect and Legacy: chips, Surprise me, Collect's Physical/Digital/Both on one row per item, the 22 kinds.
4. Sources: the Feeds inventory, OPML export, the Posts reader and its refresh.
5. Record pages: More to explore.
6. Spoilers: marking every ending, the reveal, Trivia.

## Acceptance checks

- [ ] The menu shows Discover, View, Listen, Read (category names only), then Play, Collect, Legacy as single links.
- [ ] Every toggle has its own address, works without JavaScript, and the strip scrolls sideways at 320 px with no
      visible scroll bar and nothing else scrolling sideways.
- [ ] No page links to a Play, Collect or Legacy category or shelf; no shelf page and no redirect exists.
- [ ] Each of the 24 tables has exactly the columns, filters and sortable headings listed in section 3, and every
      record of its category is a row.
- [ ] No filter value joins two things with "and" unless it is one thing's name (a title or company).
- [ ] Collect has no item twice; every row says Physical, Digital or Both, or why not.
- [ ] Feeds' OPML file imports into a feed reader (tested in one); Posts shows only headlines and links.
- [ ] Episode pages show More with (cast and crew), Themes (up to 3 each) and Branches; nothing repeats the page itself.
- [ ] No ending is visible before a click on any episode or movie page; the reveal respects reduced motion.
- [ ] The 404 page shows one of ten versions at random; each is checked against its episode.
- [ ] All CI checks pass; screenshots at 320 and 1440 px of every group page, one table per group, an episode page
      and the 404 page.

## Decided here (Adam reviews later)

8. The 2023 WordPress site's old addresses (/1959series and the like) keep their redirects: they were public on this
   domain before this site. Records with no page of their own (an episode of another show, a film kept for a
   writer's filmography) keep theirs too. Every redirect from this site's own reorganizations is gone.
9. People's one-page-per-letter index is gone: the People table covers it, and the sitemap lists every person page.
10. The Fan rating column appears once anything in a table has been rated, so empty tables don't carry an empty
    column. Sorting by it is in the Sort menu from the start.
11. Collect splits its old combined shelves item by item from what each item says it is (a figure, a bobblehead or a
    statue is a Figure; anything else on Toys and figures is a Toy). Each split is listed for checking in step 3.
12. Legacy has one row per later work, with every kind of link it has, rather than one row per link.
13. Sources' Feeds table is built from every link the site cites (1,063 sites today). Podcasts, website records and
    organizations give 3 kinds and the known feeds; the rest show "Not yet classified" until the Sources step.

1. Record pages keep their addresses; only category and shelf pages move or go.
2. People sort by surname (Serling, Rod); characters, organizations and everything else by name as written.
3. Events default to date order, since order is the point there.
4. Fan rating is a sortable column on View, Listen and Read tables, from the existing votes.
5. Play gets no row action beyond "Play now" on this site's own games (not asked for).
6. The policy page moves from /sources/ to /policy/.
7. Fan-made games stay in Play only; Legacy has every other fan-made kind.

## Waiting on Adam

- How fresh Posts should be (decision card).
- A look at the 22 separate Legacy kinds and the ten 404 lines (in the preview).

## Found, for later

- Themes are tagged on the 329 episodes only; films, books, songs and other works inherit them through the episode
  they link to. Tagging them directly is a research round.
- A "Collectors" count on Collect (how many members have each item) once My Zone has enough members.
- One Legacy entry shows its address instead of a title (the Alan Wake "Night Springs" connection).
