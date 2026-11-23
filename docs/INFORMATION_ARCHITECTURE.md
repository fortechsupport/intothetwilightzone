# IntoTheTwilightZone.com: information architecture

**Status:** proposal for Adam's review, 2026-11-21
**Based on:** Adam's verb-based rough draft (Watch, Listen, Read, Play, Collect, Meet, Visit, Fandom), the taxonomy now on branch `claude/project-thread-p8ztki` (`src/lib/taxonomy.mjs`), and the 5,957 approved records in `data/review/taxonomy.json`.
**Scope:** the site's top level, the categories and subcategories under it, and the rules for placing records. This document does not change any code. The navigation is built in the "Reorganize site around new category list" work once Adam approves this.

---

## 1. Summary

The site is organized around **what a visitor wants to do**. Each top-level item is a verb. Under each verb sit categories, and under those sit subcategories. All of them are alphabetized.

| Verb | What the visitor does | Categories | Records* |
|---|---|---|---:|
| **Watch** | Watches it on a screen or stage | Movies, Stage, Television | 657 |
| **Listen** | Listens to it | Music, Podcasts, Radio dramas | 489 |
| **Read** | Reads it | Articles, Books, Comics, Essays and scholarship, Magazines, Scripts, Websites | 665 |
| **Play** | Plays it | Games | 52 |
| **Collect** | Owns it or admires it as an object | Artwork, Merchandise | 178 |
| **Attend** | Goes to it at a set time and place | Events, Lectures and talks | 90 |
| **Discover** | Learns the story behind it and what it inspired | History, Legacy | 833 |
| **Meet** | Looks up who made it, who is in it, or who it inspired | Characters, Organizations, People | 2,640 |
| **Visit** | Looks up where it happened, real or fictional | Real places, Settings | 126 |

\*Distinct records that appear anywhere in the verb. A record can appear in more than one verb, so the column adds up to more than 5,957. Section 9 has the full counts.

Five rules hold the structure together:

1. **One question per level.** A verb asks "what do you want to do?". A category asks "what kind of thing is it?". A subcategory asks "what format or type within that?". Topics such as "the 1982 accident" or "anniversary coverage" are **collections** (curated cross-cuts), not subcategories.
2. **One home, many listings.** Every record has exactly one home, which is its page and its address. It can be *listed* in any number of other places.
3. **Media and content are never categories.** Reviews, quotes, interviews, advertisements, documents, scans, archive holdings and links are content. They attach to the record they are about and are gathered in the **Media Library**.
4. **People, characters, organizations and places are directories.** Meet and Visit open directories. Every other verb holds works and happenings.
5. **Official and Unofficial are shelves, not categories.** Every category that has both shows them as two labelled shelves on the same page.

---

## 2. Changes from the rough draft

| Draft | Proposal | Why |
|---|---|---|
| Scripts under Television, Movies and Read | **Read > Scripts** only. Episode and movie pages link to it. | One home per record. A script is something you read, not watch. Two homes would mean three copies to keep in sync. |
| Theater under Watch | **Watch > Stage** (theatre and live readings). Theme-park attractions move to **Visit**. | A play is watched. The Tower of Terror is a place you go. |
| Music under Listen with Scores and Lyrics | **Listen > Music**: Songs, Soundtracks and scores, The theme. | Lyrics are text about a song. They are content on the song page, and only ever linked, never reproduced. Composers are people, so they live in Meet. |
| Read > Documents | **Removed as a category.** Documents (production memos, letters, script drafts, press kits) are content in the **Media Library**, attached to their records. | Adam's rule: archives and documents are content. |
| Articles (Newspapers, Blogs) | **Read > Articles** (newspapers, magazines, web articles) and **Read > Websites** (whole sites and databases). | "Blogs" is too narrow. Fan wikis, the Rod Serling Memorial Foundation site and IMDb-style databases also need a home. |
| Collect with no categories | **Collect > Artwork** and **Collect > Merchandise**, each with subcategories. | Collect has 178 records and nine merchandise types. It needs the same depth as the other verbs. |
| Meet > Contributors | **Meet > People** with role subcategories. | Of the 1,819 people, many are fans, family, scholars and the creators the show inspired. They didn't contribute to the show. "Contributors" would also leave no room for Showrunners as a role. |
| Meet > Organizations, real and fictional | Kept. Fictional organizations are a **new subcategory**. | There are no fictional organization records yet. Section 10 has the gap. |
| Visit > Attractions (real) and Settings (fictional) | **Visit > Real places** (with Attractions as one of six subcategories) and **Visit > Settings**. | Only 17 of about 90 real places are attractions. Most are filming locations, backlot sets and Rod Serling's own places. |
| Fandom | Renamed **Discover**, with categories **Legacy** and **History**. Fan-made work is one subcategory of Legacy. | Most of the 750 records here are professional works: The Simpsons, Jordan Peele, Stephen King. "Fandom" would mislabel them, and real fans need their own shelf. |
| (no home) Events, lectures, awards, the accident and trial | **Attend** (events and lectures you could go to) and **Discover > History** (milestones). | 213 records had nowhere to go in the draft. |
| (no home) Reviews, quotes, interviews, ads | **Media Library**, attached to their records. | Adam's rule: content, not categories. |

---

## 3. The verbs

Each verb lists its purpose, what belongs in it, what does not, and its categories and subcategories. Subcategories are alphabetized. Items marked **(new)** are additions beyond the current taxonomy that Adam can remove.

### 3.1 Watch

**Purpose:** everything made to be watched: on television, in a cinema, on a streaming service or on stage.
**In:** TV series, their episodes, feature films, TV films, documentaries, shorts, pilots, unmade screen projects, stage plays and live readings, whether official or inspired.
**Out:** scripts (go to Read), theme-park attractions (go to Visit), soundtracks (go to Listen), home video releases as products (go to Collect > Merchandise > Home video), and trailers and clips (content in the Media Library).

| Category | Subcategory | Definition | Examples | Count |
|---|---|---|---|---:|
| **Movies** (six shelves, docs/plans/research-movies.md, 2026-11-23) | Documentaries | Documentaries about Rod Serling and the show, and the ones Serling narrated (also on his shelf) | *Submitted for Your Approval* (1995, American Masters); *In Search of Ancient Astronauts* (1973) | 11 |
| | Films by Twilight Zone makers **(new)** | Films by the show's writers and directors that a source ties to the show or to Serling. Their other films have no page: the writer's People page links out to them (Adam, Q2) | *Duel* (1971) | 1 |
| | Films linked to the show | Films, TV films and shorts that remake, adapt, honor, parody or reference an episode or the show, each with its confidence mark | *The Box* (2009); *Truth or Consequences, N.M.* (1997) | 116 |
| | Rod Serling's films | Everything Serling wrote, that was made from his work, or that he narrated, grouped by his part; his TV plays of 70 minutes or more (Playhouse 90) are listed here too (Adam, Q1) | *Planet of the Apes* (1968), *Seven Days in May* (1964), the Night Gallery pilot (1969) | 40 |
| | Twilight Zone films | Films and specials made under the Twilight Zone name | *Twilight Zone: The Movie* (1983) | 4 |
| | Unmade and lost projects **(new)** | Announced Twilight Zone films never made, and Serling's unproduced screen scripts | The Warner Bros. feature; *Jeopardy Run* | 5 |
| **Stage** | Live readings | Staged readings and radio-style live shows | Live readings of classic scripts | 4 |
| | Theatre | Stage plays and adaptations | *The Twilight Zone* stage adaptation (Almeida Theatre, 2017) | 15 |
| **Television** (`/series/`) | The Twilight Zone | The four official series and revivals. A parent page (`/series/twilight-zone/`, Adam 2026-11-23) links to each series page, and each series page links to a page per episode | *The Twilight Zone* (1959, 1985, 2002, 2019) | 4 |
| | All Twilight Zone episodes | Every episode of the four series, by series and season | "Time Enough at Last", "The Monsters Are Due on Maple Street" | 329 |
| | Rod Serling's series | Night Gallery, Serling's other series, and the plays he wrote for other anthologies, each show on one page with an episode explorer | *Night Gallery* (`/night-gallery/`), *The Loner*, *Playhouse 90* | 73 |
| | Fellow anthologies | Anthologies like The Twilight Zone, tagged by how they connect (cited by their makers, by Twilight Zone writers, compared by critics) | *The Outer Limits*, *Black Mirror* | 34 |
| | Homages in other shows | Episodes, segments and sketches of other shows that pay homage to The Twilight Zone, on their show's page; all of them at `/television/homages/` with filters | *The Simpsons*, *Futurama*, *Saturday Night Live* | 194 |
| | Pilots and unmade projects **(new)** | Pilots and series that were planned but never made | *The Time Element* | — |
| | Around the world | Foreign broadcasts and translated titles | Dubbed and retitled broadcasts abroad | 7 |

**Decision 0002 (Adam, 2026-11-21):** only the four Twilight Zone series have a page per episode. Every other show has one
page, and its episodes are entries in an episode explorer on that page (filters for season, person, homage type and how
sure we are). A homage shows on its show's page and on the Twilight Zone episode it points to, or the series page when it
points to no single episode. Television films go to Movies; radio-only anthologies go to Listen.

### 3.2 Listen

**Purpose:** everything made to be heard.
**In:** radio dramas, podcasts, songs, soundtracks, score releases and the theme in all its versions.
**Out:** composers and performers (go to Meet), lyrics (content on the song, link-only), and audio clips of TV episodes (content).

| Category | Subcategory | Definition | Examples | Count |
|---|---|---|---|---:|
| **Music** | Songs | Songs that name, quote or are about the Twilight Zone | Rush, "The Twilight Zone" (1976); Golden Earring, "Twilight Zone" (1982) | 169 |
| | Soundtracks and scores | Score and soundtrack releases | Varèse Sarabande score collections | 40 |
| | The theme | Every recording and cover of the theme | Marius Constant's theme (1959); the Grateful Dead's 1985 version | 57 |
| | Music videos **(new)** | Music videos that borrow from, honor or reference the show (Adam, Movies Q3: music videos are Music) | Young MC, "Bust a Move" | 7 |
| **Podcasts** | Podcast episodes | Single episodes about TZ in other podcasts | Episodes of film and horror podcasts | 9 |
| | Podcast series | Podcasts devoted to TZ | Episode-by-episode rewatch shows | 36 |
| **Radio dramas** | Original radio stories **(new)** | Radio stories with no TV original | Original stories in the radio series | 17 |
| | Radio episodes | *The Twilight Zone Radio Dramas* (2002–2012), adapted from the TV scripts | "The Monsters Are Due on Maple Street" (radio) | 187 |
| | Radio versions of unmade scripts **(new)** | Radio productions of scripts never filmed | Unproduced Serling scripts | 4 |

**Suggested change:** the 75 composer records move entirely to Meet > People > Composers. Listen links to them from each soundtrack and theme. Today they are listed in both places.

### 3.3 Read

**Purpose:** everything made to be read.
**In:** books, comics, magazines, published scripts and teleplays, essays and scholarship, articles, and websites.
**Out:** scans and documents in archives (content, Media Library), reviews of a work (content on that work), cover paintings as artworks (go to Collect > Artwork > Cover art; they also show on the comic or magazine page).

| Category | Definition | Examples | Count |
|---|---|---|---:|
| **Articles** | Newspaper, magazine and web articles and interviews | Contemporary press coverage of the 1959 premiere | 125 |
| **Books** | Novels, anthologies, novelizations, guides, biographies, memoirs and script collections | *The Twilight Zone Companion* (Marc Scott Zicree); *As Timeless as Infinity* (10 volumes) | 195 |
| **Comics** | Comic series and issues | Gold Key *The Twilight Zone* (1962–1982); Dynamite *The Twilight Zone* (2013) | 188 |
| **Essays and scholarship** | Essays, academic papers and critical writing | Academic essays on Serling and the Cold War | 51 |
| **Magazines** | Magazine series and issues | *Rod Serling's The Twilight Zone Magazine* (1981–1989) | 81 |
| **Scripts** **(new)** | Published scripts and teleplays, and script collections | *As Timeless as Infinity: The Complete Twilight Zone Scripts of Rod Serling* | 27 |
| **Websites** **(new)** | Whole websites and databases about TZ | Rod Serling Memorial Foundation site; fan wikis | 14 |

**Read collections** (curated cross-cuts; each record keeps its format home above):

| Collection | Count |
|---|---:|
| Anniversary coverage | 18 |
| Cast and crew memoirs | 14 |
| Foreign-language editions | 9 |
| Rod Serling Memorial Foundation publications | 26 |
| Rod Serling's own writing | 11 |
| The accident and trial in print | 14 |

**Suggested change:** today these six are subcategories next to Books and Comics, which mixes "what format?" with "what topic?". As collections, they become filters on the Read page. A visitor can still open "The accident and trial in print" directly. Only 11 of these records have no format home yet, and all of them are essays, so they move into Essays and scholarship or Articles.

### 3.4 Play

**Purpose:** everything made to be played.
**In:** video games, board and card games, pinball, arcade, slot machines, and games in other franchises that nod to TZ.
**Out:** game manuals and box art (content and artwork), toys that aren't games (go to Collect).

| Category | Subcategory | Definition | Examples | Count |
|---|---|---|---|---:|
| **Games** | Board and card games | Tabletop games | *The Twilight Zone Game* (Ideal, 1964) | 4 |
| | Nods in other games | Other games that reference TZ (unofficial shelf) | *Alan Wake II*'s show-within-a-game *Night Springs* | 19 |
| | Other games | Puzzles, trivia, interactive fiction | Trivia games | 6 |
| | Pinball, arcade and slots | Coin-op and casino machines | *Twilight Zone* pinball (Bally, 1993) | 13 |
| | Video games | Console, computer and mobile games | *The Twilight Zone* (1988, computer game) | 33 |

**Suggested change:** "Slot and casino games" (1 record) folds into "Pinball, arcade and slots". A subcategory with one record is a dead end.

### 3.5 Collect

**Purpose:** physical things people own, display or admire as objects.
**In:** licensed merchandise, posters, original art, cover art, the Night Gallery paintings, screen-used props and costumes, title design and production design.
**Out:** advertisements for merchandise (content on the product), fan art (Discover > Legacy > Fan-made, also listed on the Artwork page's unofficial shelf).

| Category | Subcategory | Definition | Examples | Count |
|---|---|---|---|---:|
| **Artwork** | Art and illustration | Original art and illustration | Fine art inspired by episodes | 15 |
| | Cover art **(new)** | Covers of comics, books, magazines and records, as works of art | George Wilson's cover for Gold Key *The Twilight Zone* #1 (1962) | 14 |
| | Make-up and production design **(new)** | Designs, make-up and sets | William Tuttle's make-up for "Eye of the Beholder" | 6 |
| | Night Gallery paintings **(new)** | The paintings that introduced each Night Gallery story | Tom Wright's gallery paintings | 12 |
| | Posters and key art | Posters and promotional art | *Twilight Zone: The Movie* poster | 19 |
| | Props and costumes **(new)** | Screen-used props and costumes | The Mystic Seer fortune-telling machine | 9 |
| | Title design | Title sequences and logos | The 1959 opening titles | 6 |
| **Merchandise** | Collectibles | Statues, busts, limited editions | Bif Bang Pow! collectibles | 21 |
| | Home video | DVD, Blu-ray, laserdisc and streaming releases | Blu-ray complete series | 2 |
| | Household and apparel | Clothing, mugs, décor | T-shirts, posters for sale | 9 |
| | Masks and costumes | Masks and costumes for wearing | "Eye of the Beholder" masks | 5 |
| | Other merchandise | Anything not covered above | | 34 |
| | Prop replicas **(new)** | Licensed replicas of screen props | Bif Bang Pow! life-size Mystic Seer replica | 7 |
| | Toys and figures | Action figures, dolls, toys | Talky Tina doll | 41 |
| | Trading cards | Card sets | Rittenhouse Archives sets | 7 |

**Suggested changes:** fold "Ornaments" (1 record) into "Household and apparel". "Other merchandise" holds 33 records, which is too many for a catch-all. A review pass would likely produce two or three real subcategories, such as "Posters and prints for sale" and "Books and media bundles".

### 3.6 Attend (new verb)

**Purpose:** happenings with a date and a place that someone could go to, or could have gone to.
**In:** conventions, festivals, anniversaries, exhibitions, screenings and marathons, premieres, lectures, talks, courses, readings and panels.
**Out:** the places they happen (Visit), historical milestones such as awards and lawsuits (Discover > History), and recordings of talks (content on the lecture).

| Category | Subcategory | Definition | Examples | Count |
|---|---|---|---|---:|
| **Events** | Anniversaries and festivals | Anniversary celebrations and festivals | Rod Serling's birthday events in Binghamton | 17 |
| | Conventions | Fan and industry conventions | Twilight Zone conventions | 18 |
| | Exhibitions | Museum and gallery exhibitions | Serling exhibitions | 6 |
| | Screenings and marathons | TV marathons and public screenings | The annual New Year's Day marathon on Syfy | 9 |
| **Lectures and talks** | Academic lectures and courses | University lectures and courses | Courses on Serling | 7 |
| | In the classroom | Teaching materials and school programs | Lesson plans built on episodes | 16 |
| | Readings and panels | Panels and public readings | Anniversary panels | 2 |
| | Rod Serling's lectures and speeches | Serling's own talks | Serling's 1968 Library of Congress lecture | 23 |

**Suggested change:** "Interviews and conversations" (1 record) moves to the Media Library as content, which is where interviews already go.

### 3.7 Discover (renamed from "Fandom")

**Purpose:** the story behind the franchise, and everything it inspired.
**In:** Legacy, meaning every relationship between TZ and another work: adaptations, homages, parodies, references, works inspired by it, its place in everyday language, and fan-made work. History, meaning milestones: awards, premieres, production and broadcast history, trials and rights, and Rod Serling's life.
**Out:** the inspired works themselves. Each keeps its home in its own verb (a film in Watch, a song in Listen) on the unofficial shelf, and Discover lists it by relationship.

| Category | Subcategory | Definition | Examples | Count |
|---|---|---|---|---:|
| **History** **(new category)** | Honors and awards | Emmys, Hugos and other honors | Serling's Emmys for writing | 31 |
| | Premieres | First broadcasts and openings | The premiere on CBS, October 2, 1959 | 11 |
| | Production and broadcast history | How each series was made and aired | The 1960s move to hour-long episodes | 20 |
| | Rod Serling's life | Milestones in Serling's life | Born in Syracuse, 1924 | 1 |
| | Trials, lawsuits and rights | Legal history | The 1982 *Twilight Zone: The Movie* accident and trial | 18 |
| | Other milestones | | | 5 |
| **Legacy** | Adaptations and remakes | Retellings of a TZ story | *Twilight Zone: The Movie* segments of "It's a Good Life" and "Kick the Can" (official) | 12 |
| | Compared to the show **(new)** | Works critics or fans compare with an episode, where no maker or source says it inspired them | *Groundhog Day* and "Shadow Play" | 53 |
| | Fan-made **(new)** | Fan films, fan art, fan fiction and fan communities' own work | Fan-produced episodes | 0 yet; 7 fan-community records to review |
| | Homages | Deliberate tributes | Films built as tributes to the series | 72 |
| | In everyday language | The phrase "twilight zone" and its use in culture | Use of the phrase in news and politics | 11 |
| | In other shows | TV episodes of other series that pay tribute | *The Simpsons*, "Treehouse of Horror" segments | 160 |
| | Inspired by | Works whose creators, or a published source, say TZ inspired them | Works by creators who credit the show | 61 |
| | Parodies | Comic imitations | *The Simpsons*, "Treehouse of Horror IV" (1993) | 67 |
| | References | Passing mentions and quotations | The *Tower of Terror* TV film (1997) | 330 |

**Why History sits here:** today these records are "events", but no one can attend the 1960 Emmys. Grouping them as milestones gives the site a natural home for a **Timeline**: a single page that plots every dated record in order.

### 3.8 Meet (directory)

**Purpose:** every person, character and organization connected to the franchise, with each entry linking to everything they appear in.
**In:** real people in any role, fictional characters, and real and fictional organizations.
**Out:** their works (those stay in the other verbs; each directory page lists them).

| Category | Subcategory | Definition | Examples | Count |
|---|---|---|---|---:|
| **Characters** | (by series) | Fictional characters, listed by the series they appear in | Talky Tina; Henry Bemis; the Kanamits | 748 |
| **Organizations** | Archives and libraries | Institutions holding TZ material | Ithaca College archives | 12 |
| | Award bodies | Bodies that gave TZ honors | Television Academy | 7 |
| | Fan clubs and communities | Organized fan groups | Fan societies | 8 |
| | Fictional organizations **(new)** | Organizations inside the stories | The State in "The Obsolete Man" | 0 yet |
| | Foundations and societies | Foundations and societies | Rod Serling Memorial Foundation | 3 |
| | Museums | Museums | Museums holding props | 2 |
| | Networks, studios and streamers | Broadcasters and studios | CBS, MGM, Paramount+ | 7 |
| | Product licensees | Licensed manufacturers | Bif Bang Pow! | 5 |
| | Production companies | Companies that made the series | Cayuga Productions | 2 |
| | Publishers | Book, comic and magazine publishers | Gold Key, Dynamite, TZ Publications | 13 |
| | Schools and universities | Schools tied to Serling or TZ | Ithaca College, Antioch College | 5 |
| | Sponsors and advertisers | Original broadcast sponsors | Sponsors of the 1959 series | 3 |
| | Other organizations | | | 6 |
| **People** | Actors | On-screen performers | Burgess Meredith, William Shatner | 1,259 |
| | Artists and illustrators **(new)** | Cover artists, painters, illustrators | George Wilson, Tom Wright | 9 |
| | Composers | Composers and music performers | Bernard Herrmann, Jerry Goldsmith | 75 |
| | Creators it inspired **(new)** | People who say TZ shaped their work | Jordan Peele, Stephen King | 16 |
| | Crew | Cinematographers, editors, make-up and other crew | William Tuttle | 99 |
| | Directors | Directors | Richard Donner, Jacques Tourneur | 330 |
| | Family | Rod Serling's family | Carol Serling, Anne Serling | 32 |
| | Fans and admirers | Notable fans | | 14 |
| | Narrators and hosts | On-screen narrators and hosts | Rod Serling, Forest Whitaker, Jordan Peele | 24 |
| | Producers | Producers and executive producers | Buck Houghton | 129 |
| | Scholars and historians | Writers about TZ | Marc Scott Zicree | 25 |
| | Showrunners **(new)** | The person who ran each series | Rod Serling (1959) | 0 yet |
| | Voice actors | Voice performers in radio and animation | Stacy Keach (radio host) | 124 |
| | Writers | Writers of episodes, films and books | Richard Matheson, Charles Beaumont | 275 |
| | Other people | | | 13 |

A person can hold several roles. Rod Serling is a writer, narrator, producer and showrunner, and appears in each list. His page is his single home.

### 3.9 Visit (directory)

**Purpose:** places, real and fictional, with maps where available.
**In:** filming locations, backlot sets, Rod Serling's places, memorials, venues, attractions and museum exhibits, plus settings inside the stories.
**Out:** events held at a place (Attend; the place page lists them).

| Category | Subcategory | Definition | Examples | Count |
|---|---|---|---|---:|
| **Real places** | Attractions | Theme-park rides and attractions | The Twilight Zone Tower of Terror (Disney's Hollywood Studios, 1994) | 17 |
| | Filming locations | Where episodes and films were shot | MGM backlot locations | 30 |
| | Memorials and exhibits **(new)** | Memorials, plaques and exhibits | Serling memorials in Binghamton | 8 |
| | Rod Serling's places **(new)** | Where Serling lived, studied and worked | Binghamton, NY; Antioch College | 12 |
| | Sets and backlots **(new)** | Standing sets and studio lots | MGM Lot 2 | 7 |
| | Venues | Lecture and event venues, and archive buildings | | 8 |
| **Settings** | (by series) | Fictional places in the stories | Willoughby; Peaksville, Ohio; Maple Street | 35 |

**Suggested change:** today the real places sit in one list. The six subcategories above come straight from the `kind` field the records already carry, so the split needs no new research. A handful of records have no `kind` yet and will need one.

### 3.10 The Media Library (utility)

**Purpose:** one searchable index of all content attached to records. It is not a verb and not a category.
**Holds:** video, audio, images, maps, documents, reviews, interviews, quotes, advertisements, archive holdings and links.

| Content type | Count today |
|---|---:|
| Reviews | 163 |
| Quotes | 34 |
| Links | 22 |
| Interviews | 22 |
| Advertisements | 20 |
| Archive holdings | 10 |

Every item shows on the page of the record it belongs to. The Library lists each item once, with every page it appears on.

**Pages (2026-11-21):** `/media/` is an overview of the types; each type has its own page (`/media/reviews/`, `/media/interviews/` and so on) with the sortable table, so no page carries the whole library. A record's "In the Media Library" link goes straight to its row on the type page. The same rule splits the two other long indexes: People has one page per letter (`/people/a-z/s/`) and the section page searches the whole index on demand, and the Timeline has a milestones page plus one page per decade (`/timeline/1960s/`).

---

## 4. Placement rules

### 4.1 The decision procedure

Apply the questions in order. The first "yes" decides the home.

1. **Is it about another record?** A review, quote, interview, ad, document, scan, recording, archive holding or link is **content**. It attaches to that record and is indexed in the Media Library.
2. **Is it a person, character, organization or place?** Its home is in **Meet** or **Visit**.
3. **Is it a milestone rather than something you could attend?** Its home is **Discover > History**.
4. **Otherwise, it is a work or a happening.** Its home is the verb for how it is primarily experienced, judged by its original release: screen or stage is Watch, sound is Listen, text is Read, a game is Play, an object is Collect, and a live happening is Attend.
5. **Official or unofficial?** Official means made or licensed by the rights holders (CBS, the Serling estate, Cayuga Productions, or a licensed publisher or manufacturer). Everything else is unofficial.
6. **Does it relate to TZ without being TZ?** If so, list it in **Discover > Legacy** under the relationship type. If it has its own page, it also sits on the unofficial shelf of its verb.

**Tie-breakers:**

- An object that reproduces a work goes in Collect. A book of scripts is the exception and stays in Read, because people buy it to read.
- An official adaptation (the 1983 movie segments, the radio dramas, the Gold Key comics) is official in its own verb. Its link to the source episode shows in Discover > Legacy > Adaptations and remakes with an Official badge.
- When two homes are equally good, choose the one with more records like it.

### 4.2 Worked examples

| Item | Home | Also listed in | Why |
|---|---|---|---|
| **A script**: *As Timeless as Infinity*, vol. 1 | Read > Books, on the official shelf | Read > Scripts; each episode page ("Read the script") | A script collection is a book you read. A scanned draft in an archive is content instead, on the episode, in the Media Library. |
| **The 1983 movie**: *Twilight Zone: The Movie* | Watch > Movies > Twilight Zone films (official) | Discover > History > Trials, lawsuits and rights (the accident); Discover > Legacy > Adaptations (its segments remaking "It's a Good Life" and "Kick the Can"); Meet > Characters (the Driver, the Passenger); Read > Books (the novelization has its own home) | The film is watched. Its remakes, its accident and its characters are separate records linked to it. |
| **Disneyland's Tower of Terror** | Visit > Real places > Attractions | Discover > Legacy > References (the 1997 TV film, which is itself in Watch > Movies, unofficial); Collect > Merchandise (ride merchandise); Read > Articles (coverage). Reviews are content. | An attraction is a place you go. 31 records mention it. Each sits in its own verb, and the attraction page links them. |
| **Night Gallery** | Watch > Television > Rod Serling's series (one page, `/night-gallery/`, every episode and segment in its explorer) | Watch > Movies > Rod Serling's films (the 1969 pilot, also listed on the Night Gallery page); Collect > Artwork > Night Gallery paintings; Read > Books; Meet > Characters | Night Gallery is in scope as "all things Rod Serling". It is a series, so it lives with the series and has no verb of its own. Its series page is the hub. |
| ***Twilight Zone Magazine*** | Read > Magazines (official; each issue is a record) | Meet > Organizations > Publishers (TZ Publications); Collect > Artwork > Cover art (cover paintings); Media Library (the archive collection holding the run) | The magazine is read. The archive holding the run is content. |
| **A cover painting**: George Wilson's cover for Gold Key *The Twilight Zone* #1 (1962) | Collect > Artwork > Cover art (official) | The comic's page (as its cover); Meet > People > Artists and illustrators (George Wilson) | Artwork is both a category and content. The painting is its own record and also shows on the comic. |
| **A parody episode**: *The Simpsons*, "Treehouse of Horror IV" | An entry on The Simpsons' page, listed in Watch > Television > Homages in other shows | Discover > Legacy > Parodies; each parodied episode's page; `/television/homages/` | The episode is watched. What makes it relevant is the parody relationship, so Discover indexes it by that. |
| **A Serling lecture**: Library of Congress, 1968 | Attend > Lectures and talks > Rod Serling's lectures and speeches (official) | Meet > People (Rod Serling); Visit > Real places > Venues; Media Library (a transcript or recording, if public) | It happened at a date and place. A recording is content on it. |
| **Talky Tina** | Meet > Characters | Collect > Merchandise > Toys and figures (the doll); Watch > Television ("Living Doll") | The character and the doll are two records. |
| **Rush, "The Twilight Zone" (1976)** | Listen > Music > Songs (unofficial) | Discover > Legacy > Inspired by | A song is heard. The lyrics are linked, never reproduced. |
| **A review of the 2019 series** | Content on the 2019 series | Media Library > Reviews | Reviews are content, never a category. |

---

## 5. How the directories cross-link

```
         Watch  Listen  Read  Play  Collect  Attend  Discover
           \      |      |     |      |        |      /
            +-----+------+-----+------+--------+-----+
                              |
             credits, appearances, settings, publishers
                              |
          Meet (People, Characters, Organizations)    Visit (Real places, Settings)
                              |
                       Media Library (content attached to any record)
```

- **From a work to a directory:** every work page lists its people (by role), characters, organizations (studio, publisher, licensee, sponsor) and places (filming locations, settings).
- **From a directory to the verbs:** every person, character, organization and place page lists everything it appears in, grouped by verb, then by category, alphabetized. A visitor on Richard Matheson's page sees Watch (his episodes and films), Read (his novels and stories) and Listen (radio adaptations).
- **Characters link to settings:** each character lists the settings it appears in, and each setting lists its characters.
- **Content links both ways:** each content item shows on its parent records, and the Media Library row lists every page it appears on.
- **Counts in the menus:** every verb's menu shows each category and subcategory with its count, so nothing is buried.

---

## 6. Official and Unofficial, verb by verb

Counts are distinct records with a label. Some records, such as directory entries, carry none.

| Verb | Category | Official | Unofficial | How the split works |
|---|---|---:|---:|---|
| Watch | Movies | 42 | 159 | Official = franchise films and Serling's own films. Unofficial = films linked to or echoing episodes. |
| | Stage | 1 | 18 | Most stage productions are unlicensed or inspired. |
| | TV episodes | 394 | 0 | All official. Other shows' tribute episodes would join as unofficial. |
| | TV series | 16 | 45 | Official = the five TZ series, Night Gallery and Serling series. Unofficial = imitators and dubs. |
| Listen | Music | 89 | 169 | Official = scores and the theme. Unofficial = songs referencing TZ. |
| | Podcasts | 0 | 45 | All unofficial today. The official 2019 companion podcasts would be official. |
| | Radio dramas | 187 | 0 | All licensed. |
| Read | All | 323 | 348 | Official = licensed books, comics, magazines and scripts. Unofficial = guides, scholarship, articles. |
| Play | Games | 12 | 40 | Official = licensed games and pinball. Unofficial = nods in other games. |
| Collect | Artwork | 61 | 15 | Unofficial = fan art and inspired art. |
| | Merchandise | 105 | 0 | Licensed only. Unlicensed items would carry an "Unlicensed" label on the unofficial shelf. |
| Attend | Events | 9 | 41 | Official = events run by rights holders or the Serling foundation. |
| | Lectures and talks | 25 | 18 | Official = Serling's own talks. |
| Discover | History | 80 | 5 | Nearly all official. |
| | Legacy | 4 | 746 | Unofficial by nature. The 4 official records are the 1983 movie's remakes. |
| Meet | Organizations | 28 | 39 | Official = rights holders, licensees, sponsors. Unofficial = fan groups, archives, scholars' bodies. |
| Meet, Visit | People, Characters, Places | n/a | n/a | No split. A person is neither official nor unofficial. Their works are. |

**Recommendation:** use the labels **Official** and **Inspired and unofficial**, as the site does now. When a shelf is empty, hide it.

---

## 7. Naming choices

| Chosen | Alternatives considered | Why the alternatives were rejected |
|---|---|---|
| **Watch, Listen, Read, Play** | View, Hear, Browse | Adam's draft. These are the plainest verbs, and they work as buttons. |
| **Collect** | Own, Shop, Buy, Treasures | "Shop" and "Buy" imply the site sells things, and it is non-commercial. "Own" is awkward for artwork in museums. "Treasures" is cute but not a verb. |
| **Attend** (new) | Experience, Go, Join, Gather | "Experience" is vague. "Go" overlaps with Visit. "Join" implies membership. |
| **Discover** (replaces "Fandom") | Fandom, Legacy, Explore, Trace, Echoes, Beyond | "Fandom" mislabels 750 professional works. "Legacy" is a noun, so it becomes the category name. "Explore" is so generic it could mean anything, and it is already used for group pages. "Echoes" is evocative but unclear in a menu. |
| **Meet** | Who, Contributors, Credits | Adam's draft. "Credits" leaves out fans, family and characters. |
| **Visit** | Go, Where, Map, Places | Adam's draft. "Map" promises a map for every entry. |
| **People** (not "Contributors") | Contributors, Cast and crew | See section 2. |
| **Settings** (fictional places) | In-story places, Fictional places, Locations | Adam's word. Short and clear next to "Real places". |
| **Real places** (not "Attractions") | Attractions, Locations, Real-life places | Attractions are only 17 of about 90 real places. |
| **Inspired and unofficial** | Unofficial, Fan-made, Unlicensed | "Fan-made" is wrong for The Simpsons. "Unlicensed" sounds like a legal accusation. |
| **Collections** (topic cross-cuts) | Topics, Tags, Themes | "Tags" is a technical word. "Collections" fits a museum-style site. |
| **Media Library** | Archive, Vault, Resources | "Archive" collides with archive holdings, which are content. "Vault" is cute but unclear. |

---

## 8. Additions beyond the draft

1. **A ninth verb, Attend,** for 90 events and lectures that had no home.
2. **History inside Discover,** with a **Timeline** page plotting every dated record.
3. **Collections** as a second way to browse: The accident and trial, Anniversaries, Lost and unmade works, Rod Serling's own writing, Memoirs, Foreign-language editions. They are curated sets, not categories, and can cross verbs. "Lost and unmade" would gather the 4 unmade films and 4 unmade radio scripts.
4. **A franchise and era filter** on every list: *The Twilight Zone* (1959, 1985, 2002, 2019), Night Gallery, Rod Serling's other work, and the radio dramas. It is a filter, not a category, and it answers "show me only the 1985 series".
5. **Series hubs:** each series page (Night Gallery, the 1985 revival) gathers every record tied to it across all verbs.
6. **Showrunners** and **Fictional organizations** as new subcategories (no records yet; see section 10).
7. **"Where to watch and listen now"** links on each episode and album, as content, link-only.
8. **Fan-made** as its own Legacy shelf, so real fan work isn't mixed with professional homages.
9. **A utility bar** holding Search, the Media Library, the Timeline, Submit a record and About. It is separate from the nine verbs, so the verbs stay uncluttered.

---

## 9. Mapping from today's taxonomy

| Today's group | Today's category | Goes to |
|---|---|---|
| Screen | TV series, TV episodes, Movies | Watch (unchanged) |
| Audio | Radio, Podcasts, Music | Listen. The 75 composer records move to Meet > People. |
| Print and literature | Reading | Read. Six topic subcategories become collections. |
| Games | Games | Play |
| Art and collectibles | Artwork, Merchandise | Collect |
| Live and experiences | Events | Gatherings go to Attend > Events (50 records). Milestones go to Discover > History (83). |
| | Lectures | Attend > Lectures and talks |
| | Stage | Theatre and live readings go to Watch > Stage (19). Attractions go to Visit > Real places > Attractions (17). |
| Legacy | Homages | Discover > Legacy |
| Sections | People, Places, Organizations | Meet (People, Characters, Organizations), Visit (Real places, Settings). Characters become their own category, not a people subcategory. |
| Library | Media Library | Unchanged, in the utility bar |

**Addresses:** the verbs become landing pages at `/watch/`, `/listen/`, `/read/` and so on, with categories under them (for example, `/watch/movies/`). Record pages keep their current addresses (for example, `/films/twilight-zone-the-movie/`), so no existing link breaks. The current `/explore/<group>/` pages redirect to their new verb.

**Record totals:** 5,957 approved records. Every one maps to at least one verb or to the Media Library. None is left unmapped.

---

## 10. Gaps and open questions

| Gap | Proposed answer |
|---|---|
| No fictional organization records | Research them from episode synopses in a later pass. "The Obsolete Man" alone gives one (the State). |
| No showrunner records | Tag existing producer records. This is a small edit, not new research. |
| Fan-made shelf is empty | Review the 7 fan-community records, then accept submissions through the existing submissions pipeline. |
| "Other merchandise" holds 33 records | One review pass to split it. |
| Podcasts have no official shelf | Add the official companion podcasts for the 2019 series if they exist. |
| Rod Serling's life has 1 milestone | Build it out from the existing biography sources for the Timeline. |
| Should Discover sit before or after Meet and Visit in the menu? | Recommended order: Watch, Listen, Read, Play, Collect, Attend, Discover, Meet, Visit. The verbs for works come first and the directories last, as in Adam's draft. |
| Nine verbs fit one row on desktop. On a phone? | They fold into one menu button, in the same order, each opening its categories. |
