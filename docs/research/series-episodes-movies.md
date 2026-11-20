# Series, episodes and movies: overnight research pass (2026-11-20)

Branch `claude/project-thread-rvuex4`, built on the taxonomy schema (`claude/project-thread-p8ztki`).
All new data lives in `data/research/series-episodes-movies/` and is merged into `src/content` by
`python3 scripts/research/apply_media.py` (safe to re-run; list items are de-duplicated by title and url).

## What changed

| Area | Change |
|---|---|
| TV series (1959, 1985, 2002, 2019) | Summaries rewritten as full landing-page text; 20 sourced history events (pilot, premiere, theme change, hour-long season, sponsors, awards, Minow speech, Ellison's exit, syndicated season, UPN cancellation, streaming seasons, home video); sources; series-level media (Serling's 1959 Mike Wallace interview, 1963 Binny Lum interview, Television Academy oral histories, 2019 trailer, 1959 Variety sponsor report, retrospective articles). |
| Episodes | 62 original-series episodes now list their Blu-ray extras (Marc Scott Zicree's 1978 interviews, cast interviews, Serling's 1975 Sherwood Oaks lecture, alternate pilot versions) and 14 list Television Academy oral-history clips by George Clayton Johnson and Earl Hamner. "The Comedian" (2019) links the free YouTube premiere. |
| Radio dramas | All 176 episodes checked against the full episode list (season/volume, star); every record now has two sources and `last_verified`. Missing stars added (e.g. Yasen Peyankov in "The Jeopardy Room"). 16 originals written for radio and 5 unmade TV scripts or non-TV sources placed in new subcategories `episodes/radio-original-stories` and `episodes/radio-unmade-tv-scripts`. Series record rewritten (Falcon Picture Group, Carl Amari, Stacy Keach, 2002-2012, BBC Radio 4 Extra, XM/Sirius, CD volumes, Blu-ray extras). |
| Podcasts | 5 TZ podcasts rewritten with real descriptions, hosts, episode counts, status, `covers` and `featured_episodes` linked to episode ids. 6 new: The Twilight Gnome, Zoning Out, Zoners, Night Gallery Podcast (Christopher Brown), Retroist Night Gallery episode, Zoned Out (Night of the Living Podcast). |
| Movies | New: Serling (2026 documentary, SXSW), Rod Serling: Beyond the Twilight Zone (E! True Hollywood Story, 2000), Bryan Singer's 2012 CBS revival (unmade), Matheson's shelved "The Doll" (unmade), ABC's 1964 "Witches, Warlocks and Werewolves" offer (unmade). Updated: the 60th-anniversary Remembering Rod Serling documentary, the Warner Bros. feature project. 43 Night Gallery episode records got an episode-level summary built from their segments. 1983 film gets media links (AFI catalog, Trailers From Hell, oral-history clips). |
| New subcategories (flagged new) | `movies/unmade-projects`, `episodes/radio-original-stories`, `episodes/radio-unmade-tv-scripts`. |

## Rights policy applied

Everything is a link. `licensed` = hosted by the rights holder or a licensed archive (Television Academy,
Blank on Blank/PBS, CBS); `link-only` = third-party upload or article; `public-domain` only for the 1959
Variety page from the Media History Digital Library. Nothing was downloaded or re-hosted.

## Gaps and open items

- **1985 production codes** (110 segments) and 2019 codes (20): no public source lists them (Wikipedia's tables have no code column). Left empty rather than guessed.
- **Radio volume numbers**: the records' `volume` field follows the later 30-volume digital re-release; the original CD volume equals the records' `season` field. Both are kept.
- **Blu-ray extras** link to the TMDB-derived specials list, not to the disc; no per-item URL exists.
- **Trade press**: Lantern (Media History Digital Library) blocks automated search, so only one Variety page was added. A hand search for 1959-64 "Twilight Zone" items in Variety, Broadcasting and Sponsor would add premiere reviews, ratings and the 1964 cancellation.
- **Not verified for the 2002 series**: which stories UPN never aired.
- Fetch budget is shared across overnight threads (~100/hour), so podcast episode lists are samples (3-7 featured episodes each), not full lists.
- Forwarded to other threads: Serling's 1946 WNYC radio appearance and the Pacifica Radio Archives interviews (lectures/people), Theater Schmeater's live stage version (already in works).
