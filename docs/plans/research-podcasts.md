# Content plan: Podcasts

**Date:** 2026-11-24 · **Status:** draft, revised 2026-11-24 03:20 UTC after Adam's idea ("display all the Podcast series, then have a table of aggregated posts (episodes) from each series feed", searchable, filterable and sortable); waiting on Adam's approval · **Checklist:** docs/RESEARCH_CHECKLIST.md, Listen > Podcasts
**Order:** Adam, 2026-11-24 01:07 UTC: finish Watch (done), then Listen: Music (done in PRs #57 to #60), then Podcasts.
**Follows:** decision 0005 (records with sources are included; visitors' votes flag doubtful ones), decision 0006 (a
likeness is "Compared to", never "Inspired by"), the Serling rule, and the Music plan's "where to listen" answer (Q5).

Every example below is an existing record on `main` with its own source.

---

## 1. Where Podcasts stands today

There are 57 podcast records. The site shows two shelves:

| Shelf today | On the page | What's wrong with it |
|---|---:|---|
| Podcast series | 36 | It mixes whole podcasts about the show, such as Strange Highways (421 episodes) and The Twilight Zone Podcast, with single episodes of other shows: Behind the Bastards on the 1983 film, NPR's Pop Culture Happy Hour on the 2019 revival, and The Retroist on Night Gallery. Groups are only "Active" and "Ended". |
| Podcast episodes | 58 | Nine single-episode records plus about 50 "featured episodes" copied out of the series records. None links to the Twilight Zone episode it discusses, although many records name it. |

Further gaps:
- **12 records never show.** They were added in research on 2026-11-21 but have no decision, so the site hides them. They include Rarified Heir's interview with Anne Serling, TV Confidential's two-part Serling centennial tribute with Anne and Jodi Serling, the Art of Manliness interview with Mark Dawidziak, and seven podcasts devoted to the show.
- **No official shelf.** No podcast made or licensed by CBS/Paramount, the Serling family or the Rod Serling Memorial Foundation is recorded. None has been looked for yet.
- **Night Gallery** has three podcast records: Christopher Brown's Night Gallery Podcast, The Twilight Zone Podcast's Night Gallery feed, and The Retroist's episode. They are mixed in with everything else.
- **Fiction:** one audio-fiction anthology, The Familiar, describes itself in terms of the show. It sits among the review podcasts.
- **Dated facts:** most episode counts and "active" labels come from Adam's research spreadsheets or from one reading of a feed. A podcast's status changes, so each needs an "as of" date.
- **Where to listen:** some records link a feed or a catalogue page, but none has a consistent "where to listen" line.

---

## 2. Structure: four shelves and an episode table

Each shelf is A to Z, with official and unofficial items apart.

| Shelf | What goes on it | Official? |
|---|---|---|
| **A. Official podcasts** *(new)* | Podcasts made or licensed by CBS/Paramount, the Serling family or the Rod Serling Memorial Foundation. Shown only if research finds some (Q4). | Official |
| **B. Podcasts about the show** | Whole podcasts devoted to the show, grouped by what they cover: "The original series", "Every series", "The 2019 revival" and "Night Gallery". A last group, "Recurring segments in other podcasts", holds runs inside another show, such as Night of the Living Podcast's "Zoned Out" and Hallowed Groundling's monthly segment. Each entry shows its status and episode count, with the date they were read. | Unofficial |
| **C. Single episodes** | One episode, or a short run, of another podcast whose main subject is the show (Q2). Grouped by subject: "The show", "Rod Serling" (Rarified Heir, TV Confidential), "Twilight Zone: The Movie and the accident" (Behind the Bastards, Decades of Horror), "Night Gallery" (The Retroist) and "The 2019 revival" (Pop Culture Happy Hour). | Unofficial |
| **D. Fiction inspired by the show** *(new)* | Audio-fiction anthology podcasts whose makers or reviewers tie them to the show (Q5), such as The Familiar. Fan recordings of the episodes themselves stay in Radio > Fan and independent audio. | Unofficial |

**Every episode (Adam's idea, Q3):** below the shelves, one table holds every episode of every podcast on shelves A,
B and D, read from each podcast's own RSS feed, plus each single episode on shelf C.
- **What a row shows:**
  - the podcast, the episode title, its date and its length;
  - the Twilight Zone episode or film it discusses, where the title names one;
  - a link to the episode's own page on the podcast's site.
- **Finding episodes:**
  - Search by title.
  - Filter by podcast, by series covered, by Twilight Zone episode and by year.
  - Sort by date, podcast, title, or Twilight Zone episode in broadcast order.
  - Filters and sort are kept in the address, so a filtered list can be shared.
- **Size:** about 4,000 to 5,000 rows. The 28 podcasts that state a count already list 2,930 episodes. So the table is a separate data file of roughly 150 to 200 KB compressed. It loads after the page, shows 50 rows at a time, and keeps every page under the 1.5 MB limit.
- **Matching to the show:**
  - A podcast episode is tied to a Twilight Zone episode when its title names that episode, and the row says "matched by title".
  - Titles that are also ordinary words, such as "Two", "Dust", "Elegy" and "Mute", match only when the title also says Twilight Zone or gives the episode number. The match rule is written down in the plan's step 3 notes.
  - A visitor's thumbs-down on a match works as on any other link (decision 0005).
- **On every Twilight Zone episode page:** a "Podcasts about this episode" line with the count and the latest few, linking to the table filtered to that episode. This replaces hand-picked featured episodes.
- **Feeds that end:** if a podcast's feed disappears, its episodes stay in the table, marked "feed no longer available", with the date last read. Nothing is dropped.
- **Recurring segments** (Zoned Out, Hallowed Groundling): only the feed's episodes whose titles name the segment or the show are kept.
- The Radio Dramas' own podcast feed stays in Radio, as part of the radio dramas, and is linked from the Podcasts page.

---

## 3. On every page

**A podcast:**
- Hosts, network or publisher, first episode, status ("active" or "ended") and episode count, each with the date it was read.
- What it covers: which series, Night Gallery, the film or Serling.
- Where to listen: the podcast's own site, and its Apple Podcasts and Spotify pages (Q7).
- Its episodes: the table filtered to this podcast, newest first, with the date the feed was last read.
- Guests who worked on the show, members of the Serling family and scholars, linked to their People pages where a source names them.

**A single episode:**
- The podcast, the hosts and guests, the date, and what it is about, in our own words.
- A link to the episode's own page, and to the Twilight Zone episode or film it discusses.

**A Twilight Zone episode page (Television):** a "Podcasts about this episode" line, built from the episode table.

---

## 4. Media and documents that attach (never categories)

- **Interviews:**
  - A podcast interview with someone who made the show attaches to that person's People page. Examples: Anne Serling on Rarified Heir; Mark Dawidziak on The Art of Manliness.
  - An interview also lists in the Media Library as an interview.
- **Cover art:** linked from the podcast's own page or its directory page, never copied.
- **Transcripts:** linked where the podcast publishes one, never copied.

---

## 5. Cross-links

| Panel | Home | Gap to fill |
|---|---|---|
| Podcasts about this episode | Television (episode pages) | Built from the episode table (Q3). |
| Serling family interviews | Meet > People (Anne Serling, Jodi Serling) | Rarified Heir and TV Confidential are hidden today. |
| Night Gallery | Watch > Television > Rod Serling's series | Its three podcasts should list there too. |
| The 1983 film | Watch > Movies | Behind the Bastards, Decades of Horror and Movie Defenders should show on the film's page. |
| Fiction inspired by the show | Discover > Legacy | Shelf D also counts as legacy. |
| The Radio Dramas' feed | Listen > Radio | Linked, not moved. |

---

## 6. Sources and fetch budget

- **Facts about each podcast:**
  - Apple's public lookup for the podcast's catalogue entry. It gives the feed, the episode count and the latest date, and it worked in 2026-11 research.
  - The podcast's own site or feed.
  - Spotify and other directories only as a second source.
- **Finding missing podcasts:** web searches for official, Night Gallery, Serling and revival podcasts, and for audio fiction that names the show.
- **Single episodes:** the episode's own page on the podcast's site or network (iHeart, NPR, Libsyn).

- **Episode lists:** each podcast's RSS feed (30 records already store one; Apple's lookup gives the rest). The feeds
  are read by the site's own build tooling on GitHub (Q8), not by research fetches, so they don't use the shared
  research budget. Each request names the site, asks only for a changed feed, and is made once a week at most.

**Research budget:**
- Round 1: about 60 lookups to re-check the 57 records, and about 30 to find what is missing.
- Round 2: about 30, for the feeds Apple doesn't list and for guests' names.
- Each round takes under an hour at the shared limit of 100 fetches an hour.

---

## 7. Blessing-ready

- **Accuracy a rights holder would trust:**
  - A podcast is "official" only with a source that says CBS/Paramount, the Serling family or the Foundation made or licensed it.
  - Every episode count and status says when it was read.
- **Respect for their property:**
  - No audio, cover art or transcript is hosted, and no player is embedded.
  - The episode table copies only facts: title, date and length. It never copies the podcasters' show notes; each row links to the episode's own page (Q9).
  - The feed reader identifies the site and checks each feed at most once a week.
- **Honoring the people:** every host, guest and producer is named. Interviews with the show's makers and with Serling's family are linked from their People pages.
- **Credit where credit is due:** the fan podcasters who have kept the show discussed for years are credited by name, as the researchers and critics they are.
- **Sending fans to official sources:** "where to listen" links go to the podcast's own site and the directories it lists itself on.
- **No money:** no affiliate codes, no ads, no sponsorships. A podcast's own sponsors are not mentioned.

---

## 8. Questions for Adam, each with a suggested answer

| # | Question | Suggested answer |
|---|---|---|
| Q1 | Which podcasts devoted to the show do we list? | **All of them, any size, active or ended,** each with its status and episode count as of the date read. You asked to document everything; a two-episode podcast is still part of the history. |
| Q2 | Which single episodes of other podcasts do we list? | **Episodes whose main subject is the show, an episode, the 1983 film, Night Gallery or Serling.** We don't go looking for passing mentions, but any we already have stay. |
| Q3 | Do we list every episode of every podcast about the show? | **Yes (your idea):** one searchable, filterable and sortable table built from each podcast's RSS feed, about 4,000 to 5,000 rows, kept fresh automatically (Q8). Each Twilight Zone episode page shows the podcast episodes that name it. This replaces my first answer of five hand-picked featured episodes per podcast, which would have gone stale. |
| Q4 | What makes a podcast "official"? | **Made or licensed by CBS/Paramount, the Serling family or the Rod Serling Memorial Foundation, with a source saying so.** A cast member or a family member appearing as a guest does not make a podcast official. |
| Q5 | Fiction podcasts that say they are inspired by the show: add a shelf? | **Yes, flagged "new",** but only with the makers' or a reviewer's statement. A podcast that only resembles the show is labelled "Compared to" (decision 0006). |
| Q6 | The 12 hidden records: include them? | **Yes, in round 1, after re-checking their sources,** under decision 0005. |
| Q7 | Add "where to listen" to every podcast? | **Yes:** the podcast's own site, then Apple Podcasts and Spotify, never affiliate links. This is the same rule as Music's Q5. |
| Q8 | How does the episode table stay current? | **A weekly job on GitHub (Mondays) reads the feeds and opens a pull request with the new episodes,** which merges itself when the checks pass, under your merge-when-green rule. The data stays in the repository, so a dead feed never empties the table, and every change is reviewable. |
| Q9 | Do rows include each episode's description (show notes)? | **No: title, date, length and a link only.** Show notes are the podcasters' own writing. Linking to them sends listeners to the podcasters' pages, the respectful choice for a site seeking a blessing. Search still works on titles and on the Twilight Zone episode each row discusses. |

---

## 9. Steps (one pull request each, merged when checks pass)

1. **Research round 1:**
   - Re-check all 57 records: status, episode count, first episode, hosts and where to listen.
   - Find official, Night Gallery, Serling, 2019-revival and fiction podcasts.
   - Include the 12 hidden records.
   - Give each record its shelf.
2. **Research round 2:**
   - A feed address for every podcast on shelves A, B and D.
   - The title-matching rule tested against the feeds.
   - Guests linked to People.
3. **Structure and pages:**
   - The four shelves, the podcast and single-episode pages, and the "Podcasts about this episode" line on episode pages.
   - The feed reader (scripts/podcast-feeds.mjs), its data file (data/podcasts/episodes.json), the weekly GitHub job, and the episode table.
   - Screenshots at 320 px and 1440 px go to Adam.

## 10. Acceptance checks (pass or fail)

- Every podcast record sits on exactly one of shelves A to D.
- Every status and episode count says when it was read.
- No single episode of another podcast sits on shelf B.
- Every podcast and single episode has at least one source and a link to its own page or feed.
- No audio, cover art or transcript is hosted; no link carries an affiliate code.
- An official podcast cites a source naming CBS/Paramount, the Serling family or the Foundation.
- The episode table holds every episode of every feed read, plus each single-episode record.
- The table searches, filters by podcast, series, Twilight Zone episode and year, sorts by date, podcast, title and episode, and keeps all of that in the address.
- No row copies show notes. Every row links to the episode's own page. No audio is embedded.
- No page is over 1.5 MB; the table's data loads separately.
- A podcast episode whose title names a Twilight Zone episode shows on that episode's page, marked "matched by title".
- A feed that stops answering keeps its episodes, marked "feed no longer available".
- New records carry a connection, tier, recommendation and source, and are included under decision 0005.
- CI passes: `check:data`, `tokens --check`, both builds, `check:site` and `check:a11y`.

---

## Decided here (Adam reviews later)
- The Radio Dramas' podcast feed stays in Radio and is linked from Podcasts.
- Fan recordings of the episodes stay in Radio > Fan and independent audio; only original fiction goes on shelf D.
- The episode table sits on the Podcasts page below the shelves, with its own address (/podcasts/episodes/) for sharing filtered lists; the old "Podcast episodes" shelf becomes shelf C, "Single episodes".
- Podcast interviews with the show's makers attach to their People pages as interviews (the "media are never categories" rule) and also stay on shelf C.

## Waiting on Adam
- Approval of this plan, and of Q1 to Q9 as suggested or changed.

## Found, for later
- Five Radio records are not placed on any shelf, including the radio show's podcast feed and the BBC and syndication runs (taxonomy export, 2026-11-24). They belong to Radio's series page.
