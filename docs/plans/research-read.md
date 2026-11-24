# Content plan: Read (Books and Scripts, Comics and Magazines, Articles, Essays and Websites)

**Date:** 2026-11-24 · **Status:** approved on Adam's behalf. Adam (14:19 UTC): "You have permission to work on the
Read grouping categories to build them out according to the quality-level we've built out other categories on the
site. Be thorough in your research and development. Impress me." He is away until about 17:20 UTC and will review
later, so every call below is in *Decided here*. · **Checklist:** docs/RESEARCH_CHECKLIST.md, rows 4-6 and section 3.
**Follows:** "media are never categories", "official vs unofficial" (a record's `official:` wins), decision 0005
(records with sources are included), the copyright rule (covers and texts are linked, never copied), and the
second-pass rule (every new fact is checked against its source before merging).

---

## 1. Where Read stands today (24 November 2026, 14:30 UTC)

772 placements on 13 shelves: Books 193, Comics 188, Articles and interviews 125, Magazines 81, Essays and scholarship
51, Scripts and teleplays 27, Websites 14, and six topic collections (Foundation publications 26, Anniversary
coverage 18, Cast and crew memoirs 14, The accident and trial 14, Serling's own writing 11, Foreign-language 9).

Problems found:
- **The stories the episodes adapt have no records.** 70 episode records name a source author and 55 Night Gallery
  segments name a source story, but a reader cannot browse the stories themselves, see where they first appeared,
  or find which book reprints them.
- **40 books have no kind** and 19 sit under "Other books", so the Books shelf's groups hide a fifth of it.
- **Script books sit on two format shelves** (Books and Scripts and teleplays, 27 records).
- **Rod Serling's own writing has 11 records**, all articles and talks; his own books (the three story collections
  of 1960-1962, *The Season to Be Wary*, the Night Gallery books, the published plays) are not in it.
- **20 reviews have no decision** (left from the Media Library sweep for this round); four AudioFile reviews were
  located but never read, and one journal "book review" does not say which book it reviews.
- **Websites are thin:** 14 records, no official sites, no archives or museum sites.
- **Magazines:** The Twilight Zone Magazine's cover artists are not recorded.

## 2. Structure

Read keeps its approved shape: **format shelves**, where each record sits on exactly one, and **topic collections**
that cut across formats (a memoir can be both a Book and a Cast and crew memoir).

**Format shelves**

| Shelf | What goes on it | Groups |
|---|---|---|
| Books | Every book that is not a script book | Story anthologies · Novelizations · Novels · Guides and reference · Scholarship and criticism · Biography and memoir · Rod Serling and Night Gallery · Young readers · Art and puzzle books · Audiobooks · Graphic novels · Other books |
| Scripts and teleplays | Published scripts and script books | Books · Single scripts |
| **The stories behind the episodes** *(new)* | One record per published story, play or poem an episode or segment adapts | The Twilight Zone (1959) · The Twilight Zone (1985) · The Twilight Zone (2019) · Night Gallery |
| Comics | Unchanged | by publisher |
| Magazines | Unchanged | by magazine |
| Articles and interviews | Unchanged | Articles · Interviews |
| Essays and scholarship | Unchanged | Journal articles · Book chapters · Essays · Theses and dissertations |
| Websites and databases | Official sites, archives and museums, reference sites, databases, fan sites | Official sites · Archives and museums · Reference sites · Databases · Fan sites · Academic |

**Topic collections** (unchanged): The accident and trial in print, Anniversary coverage, Cast and crew memoirs,
Foreign-language editions, Rod Serling Memorial Foundation publications, Rod Serling's own writing.

## 3. On every page
- **A story:** its title, author, kind (short story, radio play, poem), where and when it was first published where
  a source we read says so, the episode or segment it became (linked), and the sources. Where no source read gives
  the first publication, the page says so rather than guessing.
- **A book:** author, publisher, year, kind, the episodes it covers or reprints, licensed or not.
- **A website:** who runs it, what it holds, whether it is official.

## 4. Steps (one pull request each)
1. **Structure and decisions:** this plan; books classified (no "no kind" left); script books on one shelf;
   Serling's own books in his collection; the 20 reviews decided and the AudioFile ones read.
2. **The stories behind the episodes:** a record per adapted story with its first publication where sourced, linked
   both ways with its episodes and segments.
3. **Websites, magazines and the rest:** official sites, archives and museums, reference sites; magazine cover
   artists where a readable source gives them; the second-pass fact check.

## 5. Acceptance checks
- [ ] Every Read record sits on exactly one format shelf.
- [ ] No book is without a kind; "Other books" holds only books that fit no group.
- [ ] Every adapted episode and Night Gallery segment with a named source links to a story record, and each story
      links back.
- [ ] Every story record has a source; a first-publication fact appears only where a source read states it.
- [ ] The 20 reviews are decided.
- [ ] New facts were re-checked against their sources before merging (second pass).
- [ ] `check:data`, both builds, `check:site`, `tokens -- --check` and `check:a11y` pass; CI green.

---

## Decided here (Adam reviews later)
- **Formats and collections stay as approved:** one format shelf per record, topic collections across them.
- **A new format shelf, "The stories behind the episodes"**, flagged new. It is neither official nor unofficial:
  the stories belong to their authors, so the shelf shows no official split.
- **Script books leave the Books shelf** and stay on Scripts and teleplays only.
- **Serling's own books join "Rod Serling's own writing"**, beside his articles and talks: his story collections
  (1960-1963), *The Season to Be Wary*, the two *Night Gallery* books, *Patterns*, the Gauntlet Press script volumes
  and the translations of his stories (27 records). Anthologies only published under his name (*Devils and Demons*,
  *Triple W*, *Other Worlds*, ghost-edited per the SF Encyclopedia) and the unverified 1998 *Omnibus* stay out.
- **Book groups follow the book's kind.** 43 books had no kind or "other": each now has one, from its title and
  description. New groups: *The 1982 accident and the trial* (three books), *Lessons, faith and self-help* (three),
  and *Art, poetry and puzzle books* (adds the haiku book). The old group "Rod Serling and Night Gallery", which held
  Matheson's and Bradbury's novels, is split into *Night Gallery*, *Rod Serling's other books* and *Books by the show's
  writers*.
- **The 20 reviews are included** as content on the records they review (decision 0005: they have sources). The
  AudioFile review of the Genius Entertainment set (August/September 2005) was read in full and summarised; the other
  three AudioFile addresses now redirect to another site, so their pages say their verdicts could not be read.
- **Story records are book records** with the kind *short story*, *radio play* or *book* (for Cerf's *Famous Ghost
  Stories*), so they appear on the book pages, in search and in the Media Library without a new collection. Two new
  fields, *First published in* and *First published*, are filled only from a page we read; a date taken from a
  catalogue that lists printings without marking the first says "earliest printing the catalogue lists".
- **A story gets a record only when its title is known.** Episodes credited "based on a story by" or "an idea by"
  with no title (A Kind of a Stopwatch, A Quality of Mercy, A Short Drink from a Certain Fountain, Execution,
  Hocus-Pocus and Frisby, I Shot an Arrow into the Air, Mr. Garrity and the Graves, Showdown with Rance McGrew,
  Static, The Dummy) keep the author on the episode page. Remakes of earlier episodes (the 1985 and 2002 remakes)
  link to the episode they remake, not to a story.
- **Episode pages gain "Based on" (the story, linked, with its first publication) and "In print"**: every book, comic,
  magazine and essay whose record names the episode. Night Gallery segments link their source story the same way.
- **Four 1959 episodes gain the story they adapt**, from their Wikipedia articles: "Little Girl Lost", "The Jungle",
  "Elegy" and "A World of His Own" (Matheson's "And Now I'm Waiting").
- **"The Last Flight"** is not linked to a story: its Wikipedia infobox names Matheson's "Flight" but marks it
  "citation needed".
- **"All of Us Are Dying"**: the SF Encyclopedia records it in *Rogue*, October 1961, after the episode aired, so the
  page gives that as an appearance, not a first publication.

- **Second pass (24 November, 14:50-15:06 UTC):** all 55 pages behind the stories' first publications were re-read
  by a separate check. Two corrections: AuthorWars gives "The Dead Man" (Leiber) a year only, not Weird Tales; and
  Russell Kirk's story first ran as "Old Place of Sorworth" in The London Mystery Magazine no. 14. Where a catalogue
  lists a dated printing without marking it the first (nine Night Gallery stories), the page now says "the earliest
  dated printing we found" and the *First published* fields stay empty. "The Star" is dated November 1955 from the
  article's infobox. Everything else was confirmed word for word.

- **Websites (24 November, 15:16 UTC round):** three reference sites gain records of their own, each read that day:
  The Classic TV Archive's episode guide (CTVA), TVmaze's guide to the 1959 series and NightGallery.net (a fan guide to
  Night Gallery, which says it is not officially licensed). IMDb, TMDB, Paramount's catalogue page, the Fandom wiki and
  Fanlore already had records and were left as they were. The Emory honors thesis gains its author, Julia Hayes Baker.
- **MAD magazine:** Wikipedia's list of MAD's film spoofs has no Twilight Zone entry, so no spoof record was added from
  it; the list of TV spoofs could not be read (see below).
- **Sixteen more stories dated** from their AuthorWars pages. Where the catalogue dates a story and lists a printing in
  that year, the page says "the earliest dated printing we found" (for example "Button, Button" in Playboy, June 1970,
  and Parke Godwin's story in The Twilight Zone Magazine, January 1982). Where it gives only a year, the record
  carries the year and says no venue is named.
- **Twilight Zone Magazine covers:** a new *Cover art* fact on magazine issues, filled only where the issue's AuthorWars
  page or its cover-art record names the artist. The artist links to a person page and the cover is listed under
  Artwork, *Cover and comic art*, Magazines. Two catalogue misspellings are corrected and said so on the record
  ("Helnweinn" is Gottfried Helnwein; "Mattleson" is Marvin Mattelson, as the catalogue spells him elsewhere). A cover
  credited to a firm (Zuprik-Curtis Enterprises, March/April 1984) or to film stills and studio photographs is noted in
  the issue's description, not as a person.
- **Second pass of this round (24 November, 16:40 UTC):** an independent check re-read twelve of the new facts'
  pages (five cover credits, four story printings, CTVA, NightGallery.net and a Bunshun date): all twelve confirmed
  word for word. "Helnweinn" is confirmed as the catalogue's own spelling; the record uses the artist's usual spelling,
  Gottfried Helnwein, and says so.
- **Third pass: other sources (24 November, 17:20 UTC onward, Adam: "continue working").** The gaps were reopened
  with sources that do not refuse automated reading:
  - *Magazine covers:* the Internet Archive's scans of the issues (their text layer prints the contents-page credit, such
    as "Cover art by Carl Chaplin"), the Twilight Zone Vortex blog's issue-by-issue reviews ("Cover Art: Ralph Mercer")
    and FantLab's edition records ("Cover art by Richard Newton"). Each credit cites the page it was read on. Where two
    sources spell a name differently the record uses the issue's own spelling and says so (Tito Salomoni, written
    "Solomoni" by the blog; Kari Brayman, read by the scan's OCR as "Kari Broymon"). A cover the blog credits to
    "Artifact" and one it describes as a film still from *Iceman* are noted in the description, not as people.
  - *Comic credits:* Heritage Auctions' comic issue index, which reproduces the Grand Comics Database's credits under its
    Creative Commons licence and says so on every page. Its issue ids match the GCD ids already on our records, which
    was checked for each issue before writing. Story pencils, inks, scripts and letters, and the cover painter, go into
    the issue's *Creators*; a credit the index marks "?" is left off the list and named in the source note instead. The
    back-cover pin-up, a reprint of the front cover, counts as cover art. "Paul Newman" in one issue is written Paul S.
    Newman, as the same index names him elsewhere in the series. Two new role labels (letters, colors) were added.
  - *Book dates:* Open Library's records. *B.C. Strikes Back* was wrongly described as a 1970s book: Open Library lists
    1961 (Fawcett Gold Medal) and 1962 (Putnam) editions, and the Rod Serling Memorial Foundation confirms that Serling
    wrote its foreword (quoting it), so his credit now reads "foreword" instead of co-author.
  - *Essay bylines:* each article's own page, read in paced rounds. A sponsored HuffPost piece is labelled as such.
    "Congress Remains in the Twilight Zone" was filed as Serling's own writing; the page is a 2000 column signed by
    David Rossie (Binghamton Press & Sun-Bulletin), so it now credits him and sits with the Foundation's papers.
    Interviews the Foundation reprinted from Cemetery Dance carry the Foundation's posting date and say so.
    *Beyond Peyton Place* now names its co-author Alvin M. Cotlar and its publisher as a bookseller's record gives it.
    One date with no source (31 December 2024 on a book chapter) was replaced by the year the publisher's page gives.

## Waiting on Adam
- Nothing.

## Not possible, and why
Each item below was tried; the reason is what stopped it.
- **Creators for 66 of the 188 comics (third pass in progress).** The Grand Comics Database refuses automated reading,
  but Heritage Auctions' issue index carries its credits; it allows about four page reads every ten minutes, so the
  Gold Key issues are being read in paced rounds (28 of 94 done when this was written). The Dell, Walker, Cayuga and
  giveaway editions come after.
- **Authors for 118 of the 379 essays and articles, dates for 63 (third pass in progress).** Each original is being
  read in paced rounds; 59 read so far. 28 of the gaps are rankings, aggregate scores and unsigned staff reviews with no
  page of their own to read, which by their nature carry no byline. Pages that block automated reading (Disability Studies Quarterly's site shows
  an access-denied page) or now redirect elsewhere (the Historic Vehicle Association's article goes to the Drivers
  Foundation's home page) are listed as such on the record. Newspaper archives behind a login are not tried.
- **Cover artists for 8 of the 60 Twilight Zone Magazine issues** (September-October 1984, November-December 1984,
  January-February 1985, October 1986, August 1987, December 1987, April 1988 and June 1988). AuthorWars names no artist
  for them, FantLab has no record of those issues, the Twilight Zone Vortex's issue-by-issue reviews have not reached
  them, and no Internet Archive scan of them turned up in search (the archive's collection page needs JavaScript).
  Twelve more covers are described instead of credited (film stills, photographs, a firm, a reused book cover, and
  one credited only to "Artifact").
- **A first venue for 39 of the 99 stories** (14 have a year only, 25 nothing; 20 more give the earliest dated
  printing rather than a marked first). For these the catalogues we can read (AuthorWars, FantLab) give a year only or
  nothing, and ISFDb, philsp.com's FictionMags Index and Galactic Central refuse or do not resolve. Each page says
  what is known. "The Chaser" (Collier) is left without a date: the EBSCO guide gives 1951, which other summaries
  contradict, so neither date is used.
- **Twelve source stories have no title in any source** (ten Night Gallery segments, "The Devil's Alphabet" credit
  for Arthur Gray and "Need to Know" for Sidney Sheldon): the author stays on the episode page.
- **Three AudioFile reviews** redirect to another site, so their verdicts could not be read.
- **MAD's TV spoofs.** Wikipedia's "List of TV spoofs in Mad" address returns "not found", and MAD's own archive is not
  online, so the 1960s and 1980s Twilight Zone spoofs remain unverified and get no record.
- **The Twilight Zone Museum** now redirects to tz-museum.com, a different address; the record keeps the old link
  until the new site can be read and checked.
- **Dates for 31 books (third pass in progress).** Of the 44 books without a date, the 12 with a source page were read
  on 24 November: the four Japanese *Mysteri Zone* volumes (Bunshun, 1983-1994) and the two Italian collections
  (Fanucci, 2001) now have dates. Open Library then dated *Patterns* (1957), *Rod Serling's Night Gallery Reader* (1987)
  and *B.C. Strikes Back* (1961); library and bookseller records then dated *Sci Fi TV* (1995), *The Gospel According
  to Science Fiction* (2007) and Ed Nelson's *Beyond Peyton Place* (2008). McFarland's site refuses automated reading; the Silman-James, Celeste review, TV Time Machine shop and
  rodserling.com pages give no date. The rest came from Adam's spreadsheets with no source to read; a date found only
  in a search-result title is not used.

