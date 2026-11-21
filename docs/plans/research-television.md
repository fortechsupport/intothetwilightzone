# Content plan: Television

**Date:** 2026-11-21 · **Status:** revision 2, for Adam's approval (checklist box 1 of 4) · **Checklist:** docs/RESEARCH_CHECKLIST.md, item 1
**Decisions so far:** docs/decisions/0002-television-structure.md (Adam, 2026-11-21 09:15 UTC)

**What Adam set.**

*Scope (08:56 UTC).* Television is the root of the franchise and has four subsections:
1. the official series and revivals
2. Rod Serling's other series, including Night Gallery
3. other anthology shows similar to The Twilight Zone
4. Homages

Every series covered gets its own page. TV networks and narrators show in Television as well as in Organizations
and People.

*Answers to the first plan (09:15 UTC).*
- Night Gallery is one page with a dynamic way to explore its episodes, and its episode pages go.
- Every other non-TZ series uses the same explorer.
- Homages can be filtered by type, series and more, and show on both pages they connect.
- Similar anthologies are tagged.
- Episodes nest under their series, and only the official series and revivals get episode pages.
- TV films go to Movies. Pilots and unmade projects related to series stay here.
- A documentary made by a series (American Masters) sits on that series' page, and is also listed in Movies when
  it is feature-length.
- Broadcast history, home video (with links) and current streaming are added for every series.
- A play made for a TV series goes in Television, and also in Movies if it is feature-length.

Every example below is an existing record on `main` with its own source.

---

## 1. Structure

**Television** (one category in Watch, replacing "TV series" and "TV episodes"):

| Subsection | Series pages | Episode pages | On main today |
|---|---|---|---|
| **A. The Twilight Zone** | 1959, 1985, 2002, 2019 | Yes, every episode | 4 series; 329 episodes and segments (complete) |
| **B. Rod Serling's other series** | Night Gallery, The Loner, The New People, Liar's Club, The Storm | No: episodes are entries in the explorer | Night Gallery's 43 episodes with 93 segments; few episode lists for the others |
| **C. Similar anthology series** | Each one, tagged (section 3) | No: only the episodes with a TZ or Serling tie are entries | about 33 series |
| **D. Homages** | Each show that has one (The Simpsons, Futurama…) | No: each homage is an entry on its show's page and on the TZ page it points to | 160 entries across 110 shows |

**Also on every series page that has them:**
- Pilots and unmade projects: The Time Element (1958); the 1964 Witches, Warlocks and Werewolves proposal; the
  2012 CBS revival; Night Gallery's unaired sketches
- Broadcast history
- Home video
- Where to stream now

**Serling's plays for other series (Adam's point 6).** Each play is an entry on the page of the series it aired in.
- Patterns goes on the Kraft Television Theatre page, and Requiem for a Heavyweight on the Playhouse 90 page.
- Those series get pages under C or B. The pages say plainly that they list only the episodes tied to Serling or TZ.
- Serling's own page lists all his plays together.
- A play also gets a Movies listing when it is feature-length (question Q1).

**Moved out:**
- TV films go to Movies: Carol for Another Christmas, The Electric Grandmother, Duel. The Night Gallery pilot
  (1969, 95 minutes) is a TV film too, so it moves to Movies. The Night Gallery page links to it as the pilot.
- Radio-only series (Lights Out, Inner Sanctum Mystery) go to Listen. Suspense stays here as well, because
  Serling wrote for its TV run.
- Duplicates are merged: Monsters (two records) and Duel (two records).

---

## 2. The episode explorer (B, C and D pages)

One component, used on every series page that has no separate episode pages:

- **Browse:** episodes grouped by season, each opening to show its segments.
- **Each entry shows:**
  - air date, season and number
  - title, and segment titles
  - writer, source story and author, director
  - cast with their characters, each linking to People and Characters
  - a short own-words summary
  - the painting (Night Gallery), its reviews and media, and the source
- **Filter and sort:** season, year, writer, director, actor, source author; for homages, type and TZ episode.
  Text search on the page; sort by air date or A to Z.
- **Linkable:** every entry and segment has its own address (for example `/series/night-gallery/#s2e13-the-messiah-on-mott-street`)
  that opens it on load. Other pages link straight to it, and site search finds it.
- **Weight:** all text, built at build time. The filters work with JavaScript, and without JavaScript the full
  list still shows. Night Gallery's page should land near 150 KB, under the 300 KB target.

**Retiring the Night Gallery episode pages (after this plan is approved):**
- The 43 episode records stay as data, so credits on People pages and decision keys still work.
- Only their pages go. Each old address redirects to its explorer entry, so no link breaks.

---

## 3. Similar anthology series: tags

Each series gets one or more tags, each backed by a source:

- **Serling or TZ ties**: shares people or material with TZ or Night Gallery (The Sixth Sense, whose episodes were
  folded into Night Gallery's syndication package; The Ray Bradbury Theater, from a writer of TZ).
- **Inspired by TZ**: its makers, or a published source, say TZ inspired it (Black Mirror).
- **Compared by critics**: reviewers call it a new Twilight Zone (Dimension 404, Room 104).
- **Same format, same era**: anthologies that ran beside TZ (One Step Beyond, launched the same year; Thriller;
  The Outer Limits).
- **Later genre peer**: similar in feel, with no documented tie (to be assigned per series during research).
- **Series by TZ writers**: not anthologies, but made by TZ writers (Earl Hamner Jr.'s The Waltons and Falcon Crest).

The 26 series that today cite only Wikipedia's general anthology list each get a source that supports their tag.

---

## 4. Homages: where they show, and filters

- **Where they show.** Each homage shows on the page of the show it is in (The Simpsons) and on the TZ page it
  points to:
  - when it points to an episode, on that episode's page ("Nightmare at 20,000 Feet")
  - when it points to no particular episode, on that series' page
  - when it points to several episodes, on each of them
- **Filters:** type (parody, homage, reference, remake, comparison), host show, TZ series, TZ episode, decade, and
  how sure we are (confirmed by its makers, documented, fan-noted). Fan-noted entries show with a label and are
  never dropped.

---

## 5. On every series page

1. **Header:** years, network or streamer, seasons and episodes, creator, showrunner, narrator or host, production
   company, and the Official or Unofficial label
2. **About:** an own-words history with sourced dates
3. **Episodes:** a season list linking to episode pages (A), or the explorer (B, C, D)
4. **People:** writers, directors, cast, composers and crew, each linking to People
5. **Characters, settings and filming locations**
6. **Broadcast history:** premiere, time slots, format changes, cancellation, syndication, revivals and marathons.
   Each dated milestone also feeds the Timeline.
7. **Home video:** every release (VHS, laserdisc, DVD, Blu-ray, digital), by country, with links (rules in section 7)
8. **Where to stream now:** the services in the US, with the date last checked
9. **Pilots and unmade projects**
10. **Documentaries the series made about Serling or TZ:** American Masters' "Rod Serling: Submitted for Your
    Approval" (1995) sits on the American Masters page, and is listed in Movies because it is feature-length.
11. **International titles**
12. **Homages:** of this series, or on this show
13. **Media:** reviews, interviews, ads, press kits, archive holdings, links
14. **Why it's here:** the connection, its tier and the source

**Episode pages (A only):**
- air date, season and number, production code
- writer, source story, director
- cast and characters
- an own-words synopsis (no transcript, no reproduced narration)
- the radio, comic and film adaptations
- homages pointing to it, its script in Read, music, filming locations
- sourced trivia, media, and where to stream

---

## 6. Cross-links: one home, many listings

| Panel on Television | Home | On main | Gap |
|---|---|---|---|
| Networks and streamers | Organizations | CBS, UPN, CBS All Access, Paramount, Prime Video | NBC and Universal (both named in `films/night-gallery`), ABC, the anthologies' networks |
| Production companies and studios | Organizations | Cayuga, Monkeypaw, MGM, Warner Bros. | The producers of the 1985 and 2002 series |
| Sponsors | Organizations | American Tobacco, Bristol-Myers, Liggett & Myers | Other sponsors by season |
| Narrators and hosts | People | 24 | — |
| Showrunners *(new)* | People | 0 | Tag the existing producer records |
| Writers, directors, composers | People | Credited on every episode | — |

---

## 7. Home video and streaming links (non-commercial rule)

- **Links go to neutral pages.** Each release links to the publisher's own page, or to a database entry such as
  the Library of Congress catalogue or Blu-ray.com, never to a shop through an affiliate or referral link. If only
  a shop page exists, it gets a plain link with no tracking.
- **Streaming links** go to each service's own page for the series. Each carries "last checked" with a date,
  because availability changes. The US comes first, and other countries are added where a source lists them.

---

## 8. Sources and fetch budget

- **Wikipedia articles:** Rod Serling, every series in A to D, and the anthologies Serling wrote for (Kraft,
  Studio One, Playhouse 90, U.S. Steel Hour, Climax!, Suspense). These fetch reliably from here.
- **Archive finding aids already on the site:** the Rod Serling Papers, the CBS collection and the Dictabelt
  collection.
- **Release databases and service pages** for home video and streaming.
- IMDb, TV Tropes and Fandom refuse fetches. They are leads only, never sources.

**Budget: about 400 fetches, about 4 to 5 hours at the shared 100 an hour.** That is four rounds, best overnight:

| Round | Work | Fetches |
|---|---|---:|
| 1 | Serling's plays and his other series' episode lists | about 130 |
| 2 | The anthologies, re-sourced and tagged, plus TV organizations | about 60 |
| 3 | Homages, checked by show | about 150 |
| 4 | Home video and streaming for every series | about 60 |

---

## 9. Questions for Adam (each with a proposed answer)

| # | Question | Proposed answer |
|---|---|---|
| Q1 | What counts as "feature-length" for a TV play? | **A single story in a slot of 90 minutes or more**, such as Playhouse 90. Hour-slot plays like Patterns (Kraft, 1955) stay in Television only. |
| Q2 | Do the anthologies Serling wrote for (Playhouse 90, Kraft…) list only his plays? | **Yes.** Only episodes tied to Serling or TZ, with a line saying so. A full episode list would be thousands of entries unrelated to the show. |
| Q3 | Does every show with a homage get a page, even with one entry? | **Yes**, so the rule stays simple and each homage has a home. A show with one entry gets a short page. |
| Q4 | Where to stream: US only, or every country? | **US first**, with a check date, adding countries where a source lists them. |
| Q5 | Do fan-noted homages (no published source yet) show? | **Yes, with a "fan-noted" label**, and a filter to hide them. Nothing is dropped, per your rule. |
| Q6 | Night Gallery segments also aired in the syndicated package with different titles and cuts. Should those versions be noted? | **Yes**, as a line on the entry, where a source describes the change. |

---

## 10. Steps (one pull request each)

1. **Structure:** the Television category, the subsections, the explorer component, the Night Gallery pages
   retired into the explorer with redirects, the merges, the radio and TV-film moves. No new records.
   Screenshots go to Adam before merge.
2. **Research round 1:** Serling's plays and his other series. Pending records, with a review sheet.
3. **Research round 2:** the anthologies and organizations.
4. **Research round 3:** homages.
5. **Research round 4:** home video and streaming.
6. **Pages filled out** after Adam's decisions on the records.

## 11. Acceptance checks (pass or fail)

- Every series in A to D has one page. A series lists every episode page. B, C and D list their entries in the
  explorer, each with a source.
- No `/films/night-gallery-sNeN/` address returns 404. Each redirects to its entry.
- Each homage appears on its show's page and on every TZ page it points to.
- The explorer filters by season, people and (for homages) type and TZ episode, and works without JavaScript as
  a full list.
- Each similar anthology has at least one tag with a source.
- No home video or streaming link carries an affiliate or referral code.
- Every new record has a connection, tier, recommendation and source, starts pending, and is on a
  new-records-only sheet.
- CI passes: `check:data`, `tokens --check`, both builds, `check:site` and `check:a11y`. No page is over 300 KB.

## Decided here (Adam reviews later)
- Night Gallery episode records stay as data; only their pages go, with redirects.
- Serling's plays sit on their anthology's page and on his own page.
- The 1969 Night Gallery pilot is a TV film, so it goes to Movies.

## Waiting on Adam
- Approval of this revision, and Q1–Q6.

## Found, for later
- 39 Serling-life milestones also show under Attend > Other events (see the checklist).
