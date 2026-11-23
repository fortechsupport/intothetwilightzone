# Release notes

What a visitor can do after each change, in plain words. Newest first. Every entry ends with what is
known not to work yet.

## 2026-11-23 — Fan votes: thumbs up and down on every record (switch on with fan accounts)

**Fans can vote on anything on the site.** Once fan accounts are switched on (docs/ACCOUNTS_SETUP.md):
- Every record page (people, characters, places, organizations, episodes, films, books, songs and the rest: 6,045
  pages) shows a **thumbs up** and a **thumbs down** with their counts, next to Favorite and Later.
- So does every single link between records (566 homages, parodies, references and adaptations), wherever it is
  listed, so fans can vote on one tie, such as a film link noted only by fans.
- A signed-in member votes once per record, and can switch or withdraw their vote. Anyone can see the counts.
- When a record's score (ups minus downs) falls below zero, Adam sees it on the Moderation page under **Votes below
  zero** and decides: **Keep it** or **Mark for removal**. Nothing is removed automatically.

**Known not to work yet**
- Nothing shows until the Cloudflare setup is done; the buttons stay hidden until then.
- No alert emails until email sending is set up; the Moderation page is the alert until then.
- Reviews, quotes and clips in the Media Library that aren't records of their own can't be voted on yet.
- Lists don't show counts and can't be sorted by score.

## 2026-11-23 — Fans' film links checked

Adam asked that links fans have noted be verified. Every film link marked "Noted by fans" has now been checked, and 26 of
them were read again against the makers' own interviews. A visitor now sees, in each film's "Why it's here" box, what the
makers actually said:
- Triangle is now **confirmed by its makers**: writer-director Christopher Smith calls it "that classic Twilight Zone
  thing of running into yourself".
- Devil is now **documented**: Film Stories reports Shyamalan planned its trilogy "in the vein of The Twilight Zone".
- The Truman Show's two links say that writer Andrew Niccol denies a Twilight Zone source ("No. Goes to show you can't
  believe everything you read.").
- The rest stay "Noted by fans", and each now names the interviews that were read and what the makers named instead.

**Known not to work yet:** Many fan-noted links are still labelled "Inspired by" when the only source is a comparison;
a "compared to" label is proposed for Adam. About 28 older links still show research shorthand in their evidence.

## 2026-11-23 — Movies on six shelves

A visitor opening Watch > Movies now finds six shelves, A to Z, each split into official and unofficial items:
- **Twilight Zone films**: the 1983 film, Rod Serling's Lost Classics and the two 60th anniversary specials.
- **Rod Serling's films**, grouped by his part: written by him, made from his work, narrated by him, and his Playhouse 90
  plays (Adam: TV plays of 70 minutes or more are also listed in Movies). Planet of the Apes is here now.
- **Documentaries**, about Serling and the show, plus the ones he narrated.
- **Films linked to the show**, which also holds the short films and TV films that point to an episode.
- **Films by Twilight Zone makers** (new): Duel, the one film by the show's writers with a source tying it to the show.
- **Unmade and lost projects**: the Warner Bros. feature and Serling's unproduced scripts.

The Movies page lists every film in one list a visitor can filter by section, type, decade, the episode a film points to,
and how sure the link is. Each film page's "Why it's here" box now names the episode, the mark (confirmed, documented or
noted by fans) and the source for each link, and Serling's part where he had one. Film pages can show the story a film is
based on and its composer.

Moved out of Movies: the music videos to Listen > Music > Music videos (new), the two fan edits to Discover > Legacy >
Fan-made (new), the holiday marathons to Screenings and marathons, The Happy Place to Television's pilots, and the
SpongeBob "Tidal Zone" special to the SpongeBob page in Television. Old shelf addresses redirect.

Following Adam's rule that films need a tie to the show, its episodes or Serling, 16 films by the show's writers with no
such tie (among them Somewhere in Time, The Night Stalker and Logan's Run) no longer have pages. Their records are kept,
and each writer's page lists them under "Other films", linking out to the film's own source and the writer's Wikipedia
article. Their old addresses go to the writer's page.

The search and filter bar on every list page was not filtering, because it ran before the list loaded. It works now.

**Known not to work yet:** The seven music videos are on their own shelf, not yet on their songs' pages. Composers and source
stories are filled in for 13 films so far; the rest come with the next research rounds.

## 2026-11-23 — Rod Serling's films checked one by one

Every film Serling wrote or narrated now shows its exact release date, running time, director, writers, main cast and
studio, taken from the film's own page and listed first among its sources. All 13 films on the Rod Serling Memorial
Foundation's filmography are on the site. Two credits were wrong and are fixed: The Rack's screenplay is by Stewart
Stern, and Incident in an Alley's is by Harry Medford and Orville H. Hampton. Both are from Serling's teleplays, and the
page now says so.

**Known not to work yet:** The Oath: The Sad and Lonely Sundays and In Search of Ancient Astronauts have no page to check
against yet. Serling's 1975 interview about an unmade "It's a Good Life" feature is a scan that can't be read here.

## 2026-11-23 — Movies research: a wide sweep for films that reference the show

Adam asked for a real search for films that reference or pay homage to episodes, with Truth or Consequences, N.M. as his
example. Every original-series episode article on Wikipedia (156) and ten critics' lists were read. The results wait in the
review queue (new records start pending), and the research notes are in `data/research/movies-2026-11-23/`.
- 8 new films linked to an episode or the show: Truth or Consequences, N.M. ("A Penny for Your Thoughts", on Adam's note),
  Marnie, Everybody Wants Some!!, The Brown Bunny, Day of the Evil Gun, Click, The Rewrite and Wild Tales.
- 2 new links for films already on file: Planet of the Apes to "I Shot an Arrow into the Air", and Magic to "Caesar and Me".
- Raised to confirmed by the filmmaker: Urban Legends: Final Cut (John Ottman's DVD commentary), Sinners (Ryan Coogler,
  The Atlantic) and Coherence (James Ward Byrkit). Cube, The Brown Bunny and Wild Tales are now documented.
- 18 more links gained the critics' articles that name them, with their marks unchanged: one critic saying a film "copied"
  an episode keeps it fan-noted.

**Known not to work yet:** IMDb's connection lists refuse automated reads, so they could not be searched. The films are not
yet on the new Movies shelves, which come in the structure step. "What's in the Box" links to the wrong Wikipedia article.

## 2026-11-23 — The Twilight Zone on television: one parent page for the four series

A visitor can now open The Twilight Zone (Watch > Television > The Twilight Zone, `/series/twilight-zone/`). It is one page
for the show on television as a whole, as Adam asked:
- a card for each of the four series (1959, 1985, 2002, 2019) with its years, network, host, seasons, episode count and
  where to watch, linking to the series page and to its list of episodes
- the four runs drawn on one 1959 to 2020 line, from the first and last broadcast dates
- the 10 later episodes that remake or rework an original one
- who wrote and directed the most episodes, and the most common themes, across all four series

The navigation trail now runs through it: Television › The Twilight Zone › 1985 series › Season 3 › the episode.

**Known not to work yet:** the page counts from the records and has no history text of its own yet; the series pages
carry each run's sourced history.

## 2026-11-23 — Adam's Television review: 61 records published

Adam marked every record in the two Television review sheets "include", with no notes:
- 52 of Rod Serling's television plays (review-television-round-1), each now listed on the page of the series it aired on
  (Kraft, Lux Video Theatre, the U.S. Steel Hour, Playhouse 90 and the rest) and on Serling's page.
- 9 organizations (review-television-round-2): NBC, ABC, Universal Television, Kraft, United States Steel, the Theatre Guild,
  Armstrong World Industries, Hallmark Cards and Lux, each with its own page in Organizations.

**Known not to work yet:** nothing new.

## 2026-11-23 — Three of Serling's plays settled, and credit notes on film pages

A visitor can now see:
- "The Director" (1955) with its air date, 13 September 1955, its director and star, and a note that the anthology it aired on
  was Fireside Theatre, billed then as Jane Wyman Presents The Fireside Theatre.
- The 1953 Suspense "Nightmare at Ground Zero" with its date and director, and the 1958 Playhouse 90 play of the same name
  marked unverified, with Paul Monash as co-writer and the cast.
- "Old MacDonald Had a Curve" dated 5 August 1953, with "Old MacDonald Has a Curve" shown as another title.
- Writing credit notes ("Teleplay by … from the book by …") and other titles on every film and television-play page. They were
  in 48 records but not shown.

**Known not to work yet:** the 1958 "Nightmare at Ground Zero" stays unverified until the Paley Center's entry or a 1958
newspaper is read.

## 2026-11-21 — Television research round 4: home video

The Night Gallery page now lists its home releases: Universal's DVD season sets (2004, 2008, 2012), Kino Lorber's
Season One Blu-ray (2021) and Imprint's ten-disc Complete Collection Blu-ray (2026), each with its source. The 2002
series' DVD now names its label, New Line Home Entertainment, and its date, 7 September 2004.

**Known not to work yet:** the Season Two and Three DVD dates rest on a fan site; Kino Lorber's later Night Gallery
Blu-rays were not checked; the 1985 series' early DVD dates still rest on a forum list.

## 2026-11-21 — Television research round 3: stronger sources for homages

Two Simpsons homages now carry their makers' or the official guide's word instead of a fan wiki's: "Bart's Comet" (the
producer's DVD commentary names "The Shelter" and "The Monsters Are Due on Maple Street") and "El Viaje Misterioso de
Nuestro Jomer" ("The Old Man in the Cave"). Two more gained a Wikipedia source.

**Known not to work yet:** 16 of the 20 homages checked have no mention on Wikipedia and stay fan-noted; the notes are in
data/research/television-2026-11-21/homages-round-3.md.

## 2026-11-21 — Television research round 2: networks, studios and sponsors (no change for visitors yet)

Nine organizations are on file pending Adam's review, each with what ties it to Serling's work and a source: NBC (Night
Gallery and many 1950s anthologies), ABC, Universal Television (Night Gallery's studio), the Theatre Guild, and the
sponsors Kraft, United States Steel, Armstrong World Industries, Hallmark Cards and Lux. Review sheet: review-television-round-2.

**Known not to work yet:** Matinee Theater and the Chrysler Theatre networks were not checked; Lux's maker (Lever Brothers)
is not named on the source read, so it is not recorded.

## 2026-11-21 — Television research: 47 more of Rod Serling's plays (no change for visitors yet)

Forty-seven more television plays by Serling, from 1952 to 1966, are on file pending Adam's review, each sourced to the Rod
Serling Memorial Foundation's filmography: seven on Lux Video Theatre, four more on Kraft, plays on Armstrong Circle Theatre,
Medallion Theatre, The Doctor, Danger, Ford Theatre, Climax!, Matinee Theater, the Chrysler Theatre and more. Once included,
each sits on its series' page and on Serling's page. Review sheet: review-television-round-1.

**Known not to work yet:** three conflicts between sources are listed for Adam in
data/research/television-2026-11-21/teleplays.md (The Director, Nightmare at Ground Zero, Old MacDonald). (Corrected
2026-11-23: The Loner's 26 episodes were already on its page; an earlier note here said they were missing.)

## 2026-11-21 — Themes across Television

**Browse by theme.** /themes/ lists 41 themes in eight families (The unknown, Time and memory, Society...), each with a
page holding every Twilight Zone episode by series, every Night Gallery segment and every homage or work that points to one
of those episodes, with a search and series filter. Themes link from the footer, the Television page and every page that
shows them.

**Themes everywhere in Television.** Episode pages list their themes; series and show pages list their most common themes
with counts; each Night Gallery segment and each homage shows its themes. Series episode tables, the episode explorer
(Night Gallery, The Simpsons and every show page) and the homages page have a Theme filter, kept in the address so a
filtered view can be shared. The episode finder's theme chips use the same 41 themes.

**Known not to work yet:** themes are our editors' reading and Adam has not reviewed the list; Serling's other plays
(Playhouse 90, Studio One...) have no themes yet; homages to a whole series rather than one episode have none.

## 2026-11-21 — Television research round 1: Rod Serling's plays (no change for visitors yet)

Five more of Serling's television plays are on file, pending Adam's review: Buffalo Bill Is Dead and U.F.O. (Studio One,
1953 and 1954), Horace Mann's Miracle and Man Against Pain (Hallmark Hall of Fame, 1953), and Nightmare at Ground Zero
(Playhouse 90, 1958, with Paul Monash). Each is dated, has its director and a source, and will sit on its series' page and
Serling's page once included. Review sheet: review-television-round-1 in the project's review folder.

**Known not to work yet:** Wikipedia has no episode lists for Kraft, The U.S. Steel Hour or Lux, so plays on those are
still missing; directors and dates for the Playhouse 90 plays already on file are noted in
data/research/television-2026-11-21/teleplays.md but not added, because those records are locked.

## 2026-11-21 — Television, step 1: one category, show pages and every homage

**Watch > Television is one category with clear shelves.** The Twilight Zone (the four series), Every Twilight
Zone episode, Rod Serling's series, Fellow anthology series, Homages in other shows, Pilots and unmade projects
(new) and International titles. Old Episodes and TV series links land in the right place.

**Every other show has one page with an episode explorer.** Night Gallery (`/night-gallery/`) lists all 43
episodes and their segments by season, with the 1969 pilot at the top; filter by season, person or text, sort by
air date or A to Z, and link straight to any episode (`/night-gallery/#night-gallery-s1e01`). The same explorer
is on every show with a Twilight Zone homage (The Simpsons, Futurama, Saturday Night Live...) and on the
anthologies Rod Serling wrote plays for (Playhouse 90, Kraft Television Theatre...). Old episode addresses
redirect to the entry.

**Every homage, on both pages.** Each homage shows on its show's page and on the Twilight Zone episode it points
to; homages to a series as a whole show on that series' page. `/television/homages/` lists all of them, filterable
by type, show, Twilight Zone series and how sure we are: "Confirmed by its makers", "Documented" or "Noted by fans".

**Credit.** Sources can now name their author and publication, and media can name the rights holder.

**Search, sort and filter everywhere (second pass, after Adam's review).** Every subcategory page on the site now
has search, shelf, group and relevance filters and A to Z, Z to A, newest and oldest sorting. The Television page
leads with the four series and Night Gallery, has one box to find any show or episode, and ranks the most-homaged
episodes and shows. Series pages gain run dates, runtime, top writers and directors, a People and Characters
section, page tabs, and one episode table you can search, filter by season, writer or director, and sort. Episode
pages group their legacy by medium with filters. 24 anthology and Serling series pages now show their network, run,
episode count, creators, hosts and sourced Twilight Zone ties. Link text is shorter throughout.

**Where to watch, and links that open in a new tab (third pass, after Adam's second review).** Every series, show,
film and episode page now says where to watch it in the US near the top: stream, free with ads, and buy or rent,
with the date JustWatch last checked and plain links to JustWatch and Reelgood. Lists name it once beside each
show (the four series cards, Night Gallery, the anthology shelves, the homage shelf's show headings, the
most-homaged shows), and picking a show on the homages page shows where to watch it above its entries. 112 shows
and series are checked; the 20 or so JustWatch doesn't list show search links instead. Every link to another website now opens in a new
tab, marked with ↗ and announced to screen readers; links within the site open in the same tab, and the site check
fails any page that breaks the rule.

**Known not to work yet:** the 2002 revival and about 20 older or non-US shows that JustWatch doesn't list have no where to
watch yet; films other than TV series only have search links; research rounds 1 to 4 (Serling's other plays, the anthologies' own sources, homage
sources, home video) come next; fans cannot yet second a homage (needs fan accounts); most
sources do not yet carry an author or publisher.

## 2026-11-21 — Research checklist (no change for visitors)

**Nothing changes on the site.** `docs/RESEARCH_CHECKLIST.md` lists every category and subcategory under the
nine verbs, with today's record counts, Official and Unofficial shelves, how deeply each is researched, known
gaps, and a recommended order. Adam works through it one category at a time: content plan, research, his
decisions, then the pages.

**Known not to work yet:** nothing new; the checklist's "Found, for later" list names four placement issues.

## 2026-11-21 — Fan accounts (switch on after Cloudflare setup)

**Free member accounts.** Once switched on (docs/ACCOUNTS_SETUP.md), a visitor can:
- Create an account with a passkey (face, fingerprint or screen lock; no password) and sign in on any device.
- Keep **Favorites** and **Watch, listen, read or play later** lists, alongside Watched, I own it and Want it,
  on every device. Anything marked before signing up comes with them. My Zone shows all five lists.
- Join the **forums** (/community/): ten forums, a Discuss link on record pages, replies, editing and deleting
  their own posts, and reporting.
- **Suggest** a correction, something new or an idea, privately, and follow its review status.
- **Share their work**: images, audio, video, PDFs, written pieces or links, shown in Fan contributions
  once approved.
- Download all their data, or delete their account.

The editor gets a **Moderation** page for suggestions, uploads, held posts, reports and copyright notices.
New pages: Terms of use, Privacy notice, Copyright (with a notice form), Community guidelines.

**Known not to work yet**
- Nothing member-related works until the Cloudflare setup is done; until then those pages say "being set up".
- Email sign-in links and Google sign-in are off until their settings are added.
- No email notifications (replies, approvals); members see statuses on their account page.
- Photos are not resized and their location data is not removed automatically (the upload form says so).
- Forum posts are not in site search.

## 2026-11-21 (later) — Faster long pages and a polish pass

**The three heaviest pages now open quickly.**
- **People** shows the 60 people in the most records, with A to Z letters at the top. Every person is on a
  letter page ("People: S", filed by surname). Filtering or searching on the People page still covers all
  2,979 entries; it loads the full index only when you use it. The page went from 1.1 MB to 50 KB.
- **Timeline** opens on the franchise's own milestones (premieres, finales, films, production and legal
  history) with a card for each decade. Each decade has its own page with every dated entry and the same
  show/hide filter. 1.4 MB became 67 KB, and the largest decade page is 185 KB.
- **Media Library** opens on an overview of the types, each with its own sortable page ("Reviews",
  "Interviews"...). Old links (`/media/?type=review`, `/media/#item`) still land in the right place.
  607 KB became 56 KB.

**Polish.**
- On phones, the Media Library and index tables show each row as a card with every column, instead of hiding
  columns.
- The small label above a record's title no longer starts a wrapped line with a stray dot.
- Dates in record facts read as dates ("November 21, 2026", not "2026 11 21"), and hyphenated words keep their
  hyphens. Outside links say what they are ("Read it online", "Official site", "Apple Podcasts") instead of
  showing a field name.
- The "page not found" page offers a search (filled in from the missing address) and the nine ways in.
- Map colors moved into the design tokens, and a few leftover raw colors were removed.

**Sources.** The 14 organizations that had none now cite the archive finding aids, catalogue pages and press
the site already relies on for their holdings. `check:data` now fails any record without a source.

**Checked:** data, tokens, both builds, links and titles (6,272 public pages), accessibility on 34 page types
in both themes at 320 px. Load times on a simulated slow 4G phone with a slowed processor: 0.7 to 1.4 s to
fully loaded for the home, record, index, timeline, Media Library, map and search pages.

**Known not to work yet**
- Without JavaScript, the People page's filters do nothing; the letter pages list everyone.
- Sorting index tables is not available on phones (the column headers are hidden there).
- Map marker colors are the same in both themes and are not part of the contrast check.

## 2026-11-21 — The redesign

**Everything is on `main`.** The fan features, the nine-verb navigation and the structure document, which
had been waiting in a stack of 23 pull requests, are now one site on `main`.

**A new look.** The site now has a design of its own, in the spirit of the 1959 series: midnight black, warm
brass, a serif headline face and a clean mid-century sans for reading.

- A light theme ("Paper") beside the dark one ("Midnight"). The site follows the visitor's system setting,
  and a switch in the header remembers a choice.
- A new home page: a search box, the four series, episode of the day, the nine ways in, the features, the
  Media Library and what the site is.
- Every record page opens the same way: what kind of thing it is and its context ("Song · by Iron Maiden ·
  1981"), then the title. Facts read like a spec sheet. A share image appears when a page is posted to social
  media.
- A footer with the site's sections and tools, and the fan-site notice.
- Fonts are served from the site itself (no calls to outside font services).

**Fixes a reader would notice.**
- No page repeats a role any more ("Writer · ... · writer" on 372 people pages).
- No two pages share a title. 84 titles were shared by 2 to 37 pages each ("Twilight Zone" was the title
  of 37 song pages). Record pages now say what they are in the browser tab: "Twilight Zone (song, by Iron
  Maiden · 1981)".
- Seven actors with accented names (E. J. André, Mel Tormé, Michael Peña, Miguel A. Núñez Jr., René
  Auberjonois, Richard Yñiguez, Rudy Vallée) each had two pages with their credits split between them. Each
  now has one.
- Six records that were entered twice now point at one page, and the old address redirects: Asemblance,
  Duel (1971), Monsters (1988), Persona 2: Eternal Punishment, The Adventures of Willy Beamish, and Moses P's
  "Twilight Zone".
- "On this day" no longer reads "Joseph Campanella was born · Born".

**Adam's review decisions.** The 28 records Adam chose to exclude on November 21 (10 books, 17 songs and
one game) are hidden from the public site. They stay in the data and the review queue with their reasons.

**Checks on every change.** A pull request now has to pass: the data check, the design-token contrast test
in both themes, a build in public and preview mode, a sweep of every page for broken links, duplicate titles,
missing headings or descriptions, repeated roles and page weight, and an accessibility pass (axe-core, WCAG
2.2 AA) on one page of every type in both themes, with a 320-pixel phone check. The working standards are
in CLAUDE.md.

**Known not to work yet**
- Three pages are heavier than the 300 KB target: the Timeline (1.4 MB), the People index (1.1 MB) and the
  Media Library (0.6 MB). They need splitting by decade or letter.
- Share images are one image for the whole site, not one per record.
- 14 organizations created from names in other records have no sources yet (listed as warnings by
  `npm run check:data`).
- Accounts (favorites, watch later, forums, uploads) are being built separately; the header shows My Zone,
  which keeps lists in the browser, until then.
