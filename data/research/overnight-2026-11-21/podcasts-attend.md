# Podcasts, Attend and new areas: research notes (2026-11-21 overnight pass)

## Podcasts
- 16 spreadsheet-only podcast records rewritten (specific description, status, episode_count with
  episode_count_as_of, Apple/Spotify/website links, organizations, featured episodes where sourced).
- 4 already-researched records got links, organizations and tags (entering-the-fifth-dimension also gained co-hosts
  Aaron Peterson and Addi Darnell; a duplicate featured episode was removed from the-twilight-pwn).
- Episode counts and latest-episode dates: Apple iTunes lookup API (each record cites its lookup URL). Counts are
  what the feed shows on 2026-11-21; older feeds may have dropped episodes.
- Still releasing in Nov 2026: Strange Highways (finished all four series 18 Sep 2026, now on Night Gallery),
  Ear of the Beholder, Time Enough, Imagine if you Will, The Key of Imagination.
- Ended or quiet: Between Light and Shadow (2021), Between Science and Superstition (2020), The Fifth Dimension (2020),
  The Twilight Highlight Zone (2020), Between Light, Shadow, Science & Superstition (2022), Submitted For Your Approval (2023), Anthology (Apr 2024).
- 12 new podcast records, incl. two different shows named "The Sign Post/Signpost Up Ahead", The Hindsight Zone,
  Dimensions, The Sci-Fright Zone, and single episodes with Anne Serling, Mark Dawidziak and a 2025 Serling centennial tribute.
  Low confidence (title and URL only): the-5th-dimension-a-twilight-zone-podcast, pretty-much-pop-52-twilight-zone-morality-tales.

## Attend
9 new records: Syfy July 4 marathon (dated 2011-2025), H&I July 4 marathon 2025, Syfy 65th-anniversary marathon (low),
Hole in the Wall Theater staging of four teleplays (New Britain CT, 2008), and five low-confidence local events
(Everson Museum, SUNY Oswego centennial, Serling on Screen Binghamton, Ithaca College 2008 marathon, Rosendale Theatre 2025).
Sources added to serlingfest-2026 and theater-schmeater-twilight-zone-live. No 2027 events announced yet.
Not found: a TZ item in MoPOP's horror exhibit or Paley's 2025 exhibit; Comic-Con panels for the 2019 series; the origin of May 11 as Twilight Zone Day.

## New area: Where to watch (flagged new, series/where-to-watch)
- where-to-watch-twilight-zone-1959-us: Paramount+, free on Pluto TV and Fandango at Home Free; buy on Amazon, Apple, Fandango (JustWatch, 2026-11-17). A Dec 2025 article said it was leaving Pluto TV; JustWatch still lists it.
- where-to-watch-twilight-zone-2019-us: not streaming in the US; buy only (JustWatch, 2026-11-20).
- To do: 1985 and 2002 series, other countries; recheck every few months (tagged date-sensitive).

## International titles (no edits; series records already hold them)
- Belgium 2019: "The Twilight Zone : La Quatrième Dimension (2019)" seen in a JustWatch URL, unread.
- German: the record's "Twilight Zone – Unwahrscheinliche Geschichten" (fernsehserien.de) stands.
- 2002 has only its French title; 1985/2002 German, Spanish, Italian titles need sources.

## Leads
Everson Museum page; SUNY Oswego speaker/date; AP 2014 "NY college bringing 'Twilight Zone' to the stage"; Visit Binghamton
"Serling on Screen"; WAMC Rosendale listing; Marist (Oct 2025) "66 Years in the Twilight Zone"; Bear Manor Media events;
CNY Playhouse, ARC Theatre and Boston "Live Onstage: The Twilight Zone" stagings; Classic Conversations, WUWF (Feb 2026) and NPR interviews.

## Schema notes
- Added `episode_count_as_of` to the podcasts schema (records already used it).
- Event records mix details.date/dates/location/place/venue; one agreed set would help.
- A `latest_episode` podcast field would let "active" be computed.

## Round 3

I used 18 of the 20 WebFetch calls. Each low-confidence record was checked against its key page.

- syfy-65-years-twilight-zone-marathon: confirmed (Remind Magazine, 4 Oct 2024). It ran 5-7 Oct 2024 with 65 slots and 64 different episodes. Confidence is now high.
- everson-museum-rod-serling-before-the-twilight-zone: this was a lecture and screening, not an exhibit. I rewrote it.
  - When and where: 19 Dec 2024, 6pm, Hosmer Auditorium at the Everson Museum, Syracuse.
  - What: "Patterns" was screened.
  - Speaker: Ryan Zlomek of SUNY Oswego. The museum spells it Zlomek and Oswego spells it Ziomek; both spellings are recorded.
  - Partners: the Rod Serling Memorial Foundation and SUNY Oswego.
  - It now has kind lecture and category lectures/academic.
- suny-oswego-serling-100th-lecture-screening-2024: this is the same event as the Everson lecture, so I set `duplicate_of: works/everson-museum-rod-serling-before-the-twilight-zone`. The record is not deleted.
- serling-on-screen-binghamton: the venue (Helen Foley Theatre, Binghamton High School) and the times (5-6 Dec 7-9pm, 7 Dec 2-4pm) are confirmed. No year and no programme could be found, even in the summer 2025 newsletter. Tagged `unconfirmed`; recommendation is maybe.
- ithaca-college-friday-night-twilight-zone-marathon-2008: this was the opening event of the 2008 Rod Serling Conference (28-29 March 2008). It ran 28 March, 8pm, in Park Auditorium, with episodes chosen by online vote. Confidence is high. The site has no record for the 2008 conference itself; that is a lead.
- rosendale-theatre-rod-serling-evening-2025: a talk by Nicholas Parisi and Tony Albarella on 2 Oct 2025, 7-9pm, for the show's 66th anniversary. The WAMC listing and the Marist Circle report (16 Oct 2025) both confirm it. It is now kind lecture, subtype talk.
- the-5th-dimension-a-twilight-zone-podcast: Podnews gives only "three friends" as hosts, plus the Spotify and website links. Tagged `unconfirmed`; recommendation is maybe.
- pretty-much-pop-52-twilight-zone-morality-tales: confirmed. Posted 15 July 2020; hosts Mark Linsenmayer, Erica Spyres and Brian Hirt, with guest Ken Gerber; the episodes discussed are listed. Confidence is high.

New records from the leads:
- works/bcsd-rod-serling-day-2024: the Binghamton City School District's annual Rod Serling Day for fifth graders. In 2024 Anne Serling-Sutton spoke, and the district screened a tribute video based on "Walking Distance".
- works/binghamton-university-twilight-zone-stage-2014: a staging of "The Monsters Are Due on Maple Street" and "Dust", directed by Elizabeth Mozer and reported by the AP on 6 Mar 2014. Confidence is medium because the exact dates are not given.
- The Marist Oct 2025 lead turned out to be the Rosendale event, so I used it as a second source there.

Remaining leads:
- The SerlingFest 2026 schedule PDF.
- CNY Playhouse, ARC Theatre and the Boston "Live Onstage" TZ stagings.
- A record for the 2008 Rod Serling Conference.
- The year of "Serling on Screen".

Checks: the YAML check passes, and `npm run check:data` checked 6152 records with no findings.
