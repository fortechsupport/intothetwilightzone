# Content plan: Radio dramas

**Date:** 2026-11-23 · **Status:** draft for Adam's approval (checklist box 1 of 4) · **Checklist:** docs/RESEARCH_CHECKLIST.md, item 3
**Follows:** decision 0005 (records are included without item-by-item review; visitors' votes flag doubtful ones) and
decision 0006 (a likeness is "Compared to", never "Inspired by").

Every example below is an existing record on `main` with its own source. Counts are from `main` at 7c80cec.

---

## 1. Where Radio stands today

There are 187 radio records, and all are official.

| Shelf today | Records | What's wrong with it |
|---|---:|---|
| Radio series | 8 | These are not records. The shelf is built from the `series_title` field, and every entry links to the same episode list. The Twilight Zone Radio Dramas has a full record (`radio/twilight-zone-radio-dramas-series`), but no series page shows its seasons. |
| Radio episodes | 187 | It mixes the 176 radio dramas, Serling's 5 radio works and 6 records that are not episodes: US syndication, BBC Radio 4 Extra, the CD and digital collections, and two podcast feeds. |
| Original radio stories *(new)* | 17 | The series record says "sixteen stories written for radio" from volume 16, but we hold 17. That needs reconciling. |
| Radio versions of unmade scripts *(new)* | 4 | Deep: Beaumont's "Gentlemen, Be Seated", Sohl's "Who Am I?" and two more. |

Further gaps:
- **The radio dramas:**
  - Each episode names its star (`voiced_by`) but not its full cast, director or music.
  - The music record (`works/tz-radio-dramas-music-and-sound`) names five sound engineers and found no composer.
  - Two of the three sources on each episode are a Wikipedia mirror (goodoldtv.com) and a fan blog (The Twilight Zone Vortex); the third is the research spreadsheet.
  - No episode page has "Where to listen", although CLAUDE.md asks for "Where to watch" on every show and episode page.
- **Serling's radio work:** the 5 records rest on Wikipedia alone:
  - Hop Off the Express and Grab a Local (1949)
  - To Live a Dream (Dr. Christian, 1949)
  - Adventure Express (WLW, 1950–51)
  - The Zero Hour (host)
  - Fantasy Park (host, 1974–75)

  His WNYC and WLW years are known only from his biography.
- **Night Gallery and the revivals:** no radio adaptations are recorded, and none has been searched for.

---

## 2. Structure: five shelves

Each shelf is A to Z, or in season order where order is the point, with official and unofficial items apart.

| Shelf | What goes on it | Official? |
|---|---|---|
| **A. The Twilight Zone Radio Dramas** | A real series page (like the TV series pages) with all 176 episodes in season and volume order. It has filters for "adapted from TV", "original radio story" and "unmade TV script", and a link to the TV episode each one adapts. The two "new" shelves, Original radio stories and Radio versions of unmade scripts, stay as shelves of their own and also list on this page. | Official (licensed by CBS and the Serling estate) |
| **B. Rod Serling's radio work** | Everything Serling wrote, hosted or narrated for radio, grouped by his role. **Written:** Hop Off the Express, To Live a Dream, Adventure Express and any WLW or WNYC scripts found. **Hosted or narrated:** The Zero Hour, Fantasy Park. | Official (his work) |
| **C. Other radio and audio adaptations** *(new)* | Radio and audio versions of episodes made by anyone other than Falcon Picture Group: licensed foreign-language productions, other audio companies, Night Gallery or revival stories on audio. It is shown only if research finds some. | Each one marked by its licence |
| **D. Fellow radio anthologies** | Lights Out and Inner Sanctum (records exist, tagged `radio-only`), and Suspense, each only with a sourced tie to the show or to Serling, stated on the record. | Unofficial |
| **E. Fan and independent audio** *(new)* | Fan-made audio dramas and readings of the episodes, credited to their makers. They also list on Discover > Legacy > Fan-made. | Unofficial |

**Moving out of the shelves (records kept, Q2):**
- US syndication, BBC Radio 4 Extra, the CD and digital collections, and the two podcast feeds become the series page's **Broadcast and release history** and **Where to listen**.
- The synthesized "Radio series" shelf goes. Its entries become the series pages for A and B.

---

## 3. On every page

**The radio drama episode page:**
1. **Header:** type, season and volume, and the Official label.
2. **Facts:**
   - first release (volume and date)
   - the TV episode it adapts (linked) and the original writer
   - adapted by
   - star and full cast, with each name linked to People
   - Stacy Keach as narrator
   - producer and director
   - sound and music
3. **About:** the story in our own words, and how the radio version differs from the TV one where a source says so.
4. **Where to listen:** licensed releases and services only, with no affiliate codes. It notes where the episode was included as an extra on the 2010–11 Blu-ray sets (82 were).
5. **Media**, all link-only: official sample clips, reviews by author and publication, and interviews with the cast or producer.

**The series page (A):**
- what the series is, who made it and under what licence
- seasons and volumes
- broadcast and release history: syndication to about 200 US stations, XM and Sirius, BBC Radio 4 Extra, cassette, CD, downloads and Blu-ray extras
- the Gold Marcum Award (2006, record exists)
- the cast, A to Z
- where to listen

**Serling's radio pages (B):** the station or network, the date, his role, and archive holdings of the script as archival content (the Rod Serling papers and Ithaca College's Rod Serling Archives already have records in Archives).

---

## 4. Media and documents that attach (never categories)

- Archival holdings of Serling's radio scripts attach to the radio work and to Serling's page. The Radio Preservation Task Force catalog record already exists (`works/radio-preservation-task-force-serling-papers`).
- Serling's own radio interviews and guest spots attach as interviews to his page and the Media Library, and are not records (Q3).
- Cover art of the CD volumes attaches to the series page, credited to its artist, and is linked, not copied.
- Reviews of the radio dramas, by named critic and publication.

---

## 5. Cross-links

| Panel | Home | Gap to fill |
|---|---|---|
| Voice cast | Meet > People > Voice actors (124 today) | Most episodes list only the star. |
| Falcon Picture Group, Carl Amari, CBS licensing | Organizations, People | Falcon Picture Group has no Organizations record. |
| TV episode each one adapts | Television | Already shown on 155 TV episode pages as "Radio drama: …". |
| Original writers (Serling, Beaumont, Matheson, Sohl…) | People | Their pages should list the radio versions under Listen. |
| WLW, WKRC, WNYC, Antioch | Places, Organizations | WLW and WKRC have Places records and Antioch College has an Organizations record; WNYC has none, and the radio works do not link to any of them yet. |

---

## 6. Sources and fetch budget

- **Wikipedia, "The Twilight Zone (radio series)"**, read directly, in place of the goodoldtv.com mirror.
- **OTRR** synopses (otrr.org), and **RadioGOLDINdex** for Serling's old-time radio credits. RadioGOLDINdex is untested from here.
- **BBC programme pages** for the Radio 4 Extra broadcasts. They often list the full cast and writers.
- **The producer's and publishers' own listings** for cast, release dates and where to listen. Which ones are licensed today needs checking.
- **The Rod Serling Memorial Foundation**, the Wisconsin Center for Film and Theater Research and Ithaca College finding aids, for Serling's radio scripts.
- **The Twilight Zone Vortex** guide stays as a credited fan source, never the only one.
- IMDb, TV Tropes and Fandom refuse fetches. They are leads only.

**Budget: about 150 fetches, about 2 hours at the shared 100 an hour, in two rounds:**

| Round | Work | Fetches |
|---|---|---:|
| 1 | A: the episode list read directly; cast, credits and release dates from BBC and producer listings; reconcile 16 against 17 original stories; where to listen; music credits | about 100 |
| 2 | B to E: Serling's radio career (WNYC, WLW, network scripts, archive holdings), other adaptations, fellow anthologies' sourced ties, fan audio | about 50 |

---

## 7. Blessing-ready

- **Accuracy a rights holder would trust:**
  - Cast and credits come from the producer, the BBC or the release itself, not from a fan blog alone.
  - Every episode links to the teleplay it adapts and credits its original writer.
- **Respect for their property:**
  - No audio is hosted.
  - Clips are linked only from the producer's, publisher's or BBC's own pages.
  - Fan audio is clearly marked unofficial and credited to its makers.
- **Honoring the people:**
  - Serling's radio years, from WNYC to The Zero Hour, are presented as the start of his career, with dates and sources.
  - The radio writers (Dennis Etchison, M. J. Elliott and others) and the sound team are credited by name.
- **Credit where credit is due:**
  - every actor, adapter, engineer and cover artist
  - every source by author and publication
  - fan researchers such as The Twilight Zone Vortex, by name
- **Sending fans to official sources:** where to listen links only to licensed releases, with no affiliate codes.
- **No money:** no ads, no affiliate links, no sponsorships.

---

## 8. Questions for Adam, each with my suggested answer

| # | Question | Suggested answer |
|---|---|---|
| Q1 | Should the category stay "Radio dramas", or become "Radio and audio dramas"? | **"Radio and audio dramas".** Download-only and foreign-language audio productions then have a home. Podcasts (people talking about the show) stay their own category. |
| Q2 | The six records that describe how the series aired or was sold (US syndication, BBC Radio 4 Extra, CD and digital collections, two podcast feeds): shelf entries, or content on the series page? | **Content on the series page**, under Broadcast and release history and Where to listen. This follows your rule that media and content are never categories. The records are kept, only taken off the shelves. |
| Q3 | Serling's radio interviews and guest appearances: records, or media? | **Media** on his page and in the Media Library. Series he hosted or narrated (The Zero Hour, Fantasy Park) stay records, under your standing rule that anything Serling touched is included. |
| Q4 | Lights Out, Inner Sanctum and Suspense: keep them in Radio? | **Keep them, only with a sourced tie to the show or Serling, stated on the page.** If no tie is found, they move to Discover > Legacy as context, never deleted. |
| Q5 | Fan-made audio dramas and readings: include? | **Yes, on the unofficial "Fan and independent audio" shelf (new)**, credited to their makers, linked never copied, and also listed in Legacy > Fan-made. |
| Q6 | Night Gallery and the 1985, 2002 and 2019 series on audio: search for them? | **Yes, in round 2.** They go on shelf C if found; if none are found, the plan says so. |
| Q7 | Full cast for all 176 episodes, or star only? | **Full cast where a source lists it** (BBC and release listings usually do). Where none does, the page says "Full cast not yet sourced". |

---

## 9. Steps (one pull request each, merged when checks pass)

1. **Research round 1:** shelf A. Credits, cast, release dates, where to listen, music, the 16-against-17 count.
2. **Research round 2:** shelves B to E.
3. **Structure and pages:**
   - the series pages
   - the richer episode page
   - the five shelves
   - Where to listen

   Screenshots at 320 px and 1440 px go to Adam before merge, because this is a new layout.

## 10. Acceptance checks (pass or fail)

- Every radio drama episode has its season, volume, release date, adapted TV episode (or "original" or "unmade
  script"), adapter, star and at least one source beyond the fan guide and the spreadsheet.
- The episode count matches the series record (176), and the original-story count matches its source, or the
  difference is explained on the page.
- Every Serling radio work has a date, a station or network, his role, and a source beyond Wikipedia, or a line
  saying none was found.
- Every episode and series page has Where to listen, and no link carries an affiliate or referral code.
- No audio file is hosted. Every clip, cover and review names its creator.
- New records start pending, carry a connection, tier, recommendation and source, and are included under
  decision 0005.
- CI passes: `check:data`, `tokens --check`, both builds, `check:site` and `check:a11y`.

---

## Decided here (Adam reviews later)
- The plan uses the existing records' facts (the series record, the music record, the award record) and cites
  them; nothing in it is new research.

## Waiting on Adam
- Approval of this plan, and answers to Q1 to Q7. The suggested answers are what will be built if he agrees.

## Found, for later
- The Movies plan's round 3 (documentaries and media attachments) is still open and runs alongside this plan.
- Audiobooks of Twilight Zone books (`works/*-audiobook`) belong with their books in Read, not in Radio. Check them
  when Read is worked.
