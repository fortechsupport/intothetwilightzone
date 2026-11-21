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
