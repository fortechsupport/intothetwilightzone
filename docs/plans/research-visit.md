# Content plan: Visit (Real places and Settings)

**Date:** 2026-11-24 · **Status:** approved on Adam's behalf overnight. Adam's note (03:23 UTC): "act autonomously for the
next 6 hours, approving things by your best judgement rather than waiting for my approval. Be thorough." Every
choice below is in *Decided here* for him to review in the morning.
**Checklist:** docs/RESEARCH_CHECKLIST.md, Visit
**Follows:** Adam's inclusion rule of 2026-11-23, and decision 0005 (records with sources are included; doubtful ones
are labelled and fan votes flag them).

---

## 1. Where Visit stands today

Places has 126 placements. Problems found on 24 November 2026:
- **Eleven places appear twice**, once as a place record and once as an older works record: the four Tower of Terror
  rides, the Serling statue, the Recreation Park carousel and bandstand plaque, Serling's grave, the Bundy Museum
  and Forum Theatre exhibits, and the Antioch markers.
- *Attractions* mixes three groups (Attractions, Exhibits, Rides) plus ungrouped entries, and a historical marker
  sits among the rides.
- *Filming locations* (30) is one A to Z list, though the 1959 series, the 1983 film and the 2019 series were filmed
  in very different places.
- *Other real places* holds two London theatres and a ballpark (venues), and SerlingFest and the Rod Serling Film
  Festival, which are events.
- One source on the 2002 series' Vancouver record is about the 2019 series (it mentions 2002 only in passing).

## 2. Structure

| Shelf | Groups |
|---|---|
| Attractions | The Tower of Terror · Experiences |
| Filming locations | The Twilight Zone (1959) · Twilight Zone: The Movie (1983) · The Twilight Zone (1985) · The Twilight Zone (2002) · The Twilight Zone (2019) · Other films |
| Memorials and exhibits | (A to Z); memorials also show under History > Honors > Memorials, exhibits under Events > Exhibitions |
| Rod Serling's places · Sets and backlots · Venues and archives · Settings | Unchanged |

SerlingFest and the Rod Serling Film Festival move to Attend > Events > Anniversaries and festivals.

## 3. On every page
Address, city, whether it can be visited, what was filmed or happened there (linked), and sources. Unconfirmed
locations say so.

## 4. Media and documents that attach
Historical-marker pages (HMdb), museum pages and local press attach to their place, link-only.

## 5. Cross-links
Filming locations to the episodes and films shot there; memorials and Serling's places to his life events; venues
to the events held there.

## 6. Sources
The place records' own sources (HMdb, Atlas Obscura, Wikipedia, local press, the parks' own pages), plus the
Georgia Straight (Craig Takeuchi, 1 April 2019) for the 2019 series' shooting dates.

## 7. Blessing-ready
Disney's attractions are named as licensed; private homes (Serling's boyhood home) are listed for history and say
they are private. Fan-reported locations are labelled unconfirmed.

## 8. Steps
One pull request: duplicates merged, groups, venues and festivals re-placed, the new location, screenshots.

## 9. Acceptance checks
- No place appears twice on Visit.
- Attractions and Filming locations are grouped; Other real places is empty.
- CI passes: check:data, tokens, both builds, check:site, check:a11y.

---

## Decided here (Adam reviews later)
- **The place record wins:** the eleven works records that repeat a place now point to it (`duplicate_of`); their
  extra sources were carried over, with the facts only they had: the California tower's last day (2 January 2017),
  Ohio's governor at the Antioch marker's dedication, and the Bundy exhibit's hands-on stations and its name "In the
  Zone".
- Groups as above; memorials and museum exhibits that are places also appear on History and Events, as the works
  records did.
- The Almeida, the Ambassadors and Mirabito Stadium are *Venues*; SerlingFest and the Rod Serling Film Festival are
  events.
- **New location, unconfirmed:** the Vancouver Aquarium in Stanley Park, which one listing site (WhereFilmed) gives
  for the 2002 series with no episode. Included and labelled, under Adam's rule, so fans can confirm or vote it down.
- **1985 revival producers added** (Meet, found while researching locations): Persistence of Vision (seasons 1-2),
  London Films and Atlantis Films (season 3), from the series' Wikipedia article.
- The 2002 series' Vancouver record keeps the Georgia Straight source, now marked as an article about the 2019 series
  that says the 2002 revival "was shot in Vancouver". Its shooting dates for 2019 (October 1, 2018, to March 20) were
  added to the 2019 record.

## Waiting on Adam
- Nothing blocking.

## Found, for later
- **2026-11-24:** every item below now carries a mark (Done, Can't with the reason, Read round, or Adam) in
  docs/plans/finish-open-items-2026-11-24.md, which is the current list.
- **1985 series locations:** Wikipedia names no studio or town for the CBS seasons; the third season was
  "Canadian-produced" with no city. Paul Chavez's 1985 call sheets at USC (already an archive record) would answer it.
- **2002 series locations:** only the Vancouver Aquarium claim was found.
- ~~**Settings:**~~ Done: every episode of the four series, Night Gallery and the two films read (second pass and
  docs/plans/finish-open-items-2026-11-24.md).
- **A Binghamton and Syracuse walking map** of Serling's places (the records have coordinates for most).
