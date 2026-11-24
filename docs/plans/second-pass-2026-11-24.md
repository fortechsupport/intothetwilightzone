# Plan: second pass on the overnight categories

**Date:** 2026-11-24 · **Status:** approved on Adam's behalf overnight. Adam's note (03:23 UTC): "act autonomously for the
next 6 hours, approving things by your best judgement rather than waiting for my approval. Be thorough." The first
pass (PRs #62 to #70) finished every category except Read in about 90 minutes. This pass checks that work against its
sources, fills the gaps the plans admit where a source exists, and checks the pages.
**Covers:** docs/plans/research-{podcasts,games,collect,attend,discover,meet,visit,media-library}.md

---

## 1. How the check was done
- Every record changed overnight was compared field by field with its state before the night (99 records with new
  facts, about 390 with only shelf, kind or tag changes).
- Every new fact was read against the page it cites: about 60 claims on 25 pages (Wikipedia's articles on the four
  series, the radio series, the pinball machine and three films; the makers', galleries', auction and press pages).
- Every changed record was checked for lost fields or sources.

## 2. Steps
1. Corrections, the "Where to watch now" decision, the gaps filled from sources, and the fixes from the page check
   (this pull request).
2. Part 2: episode settings, the podcast and Foundation-media gaps, and two podcast descriptions (a second pull
   request).

## 3. Acceptance checks
- Every claim read in section 1 is supported by its source, or reworded, or removed.
- No record lost a field or source overnight.
- CI passes: check:data, tokens, both builds, check:site, check:a11y.

---

## Found and fixed
**A record was overwritten.** James Gunn's 1970 Serling interview already had a record, with the Internet Archive's
CC-licensed audio and a lock; the Media Library sweep rewrote it as if new and dropped the audio, its source, the lock
and the University of Kansas link. All restored, with the new facts kept. The release note had counted it as new.

**Claims the sources do not support, corrected:**
- *Auction house:* the Matheson "Once Upon a Time" script archive (26 June 2017) and Martin Landau's scripts
  (25 September 2019) were sold by **Profiles in History**, whose catalogues Heritage Auctions' site hosts, not by
  Heritage. New Profiles in History record; Heritage's description says what its site shows.
- *Wrong episodes:* the Landau lot holds one Twilight Zone script, "The Beacon" (1985 revival), not "Mr. Denton on
  Doomsday" or "The Jeopardy Room". Those two links are excluded and a link to "The Beacon" added.
- *Clio:* the 2019 promo campaign was **shortlisted**, not a winner.
- *Sponsors:* Kimberly-Clark dropped out after the first season, not during it; Colgate-Palmolive sponsored from the
  second. General Foods stayed until April 1961.
- *Cayuga Productions:* Wikipedia says Serling held a 40% share of the series, not that Cayuga co-owned it with CBS.
- *"The Time Element":* the script was bought and shelved, not "turned down as a series pitch".
- *2002 revival:* Wikipedia does not tie Pen Densham, Mark Stern and John Watson to Trilogy; it names four production
  companies and four executive producers. Corrected, with the three missing companies added (Spirit Dance
  Entertainment, Joshmax Productions Services, New Line Television).
- *Genre Films:* no source read calls it Simon Kinberg's company; removed.
- *Radio dramas:* licensed by CBS Enterprises and the Rod Serling Estate, produced by Carl Amari's Falcon Picture Group.
- *Pioneer LDC:* LDDb names Pioneer Japan as manufacturer and 20th Century Fox Home Entertainment as publisher of the
  Special Edition vol. 7; the description now says so.
- *Kino Lorber:* its first Night Gallery Blu-ray was the first season.
- *Planet of the Apes:* 8 February 1968 is the New York premiere; US release 3 April 1968.
- *Mike Wallace interview:* Wikipedia gives no date; the 22 September 1959 date is the Rod Serling Memorial
  Foundation's ("Roasting Rod Serling", 2019), now cited.
- *1988 PC game:* Entertainment Earth says Gigabit Systems *published* it for PC, not developed it.
- *Zen Studios:* the 2023 table's release date (13 April 2023) and the VR add-on are now cited to Zen and Wikipedia;
  "licensed" was not in the pages read, so the description cites the CBS trademark line instead.
- *Mondo:* /Film names Mondo for two other films' posters, not one.
- *Bundy Museum:* the hands-on items are from the museum's own "In The Zone" page, not Gizmodo.
- *Prop Store:* it auctioned the pig-nose appliance on 1 December 2018; whether it sold is not stated.

**Confirmed as written:** the pinball team and their roles; the Dark Hall Mansion and Shag print details; the ATX
Festival, UCLA screening, Antioch marker (Governor DeWine attended), Tower of Terror closing (2 January 2017), Georgia
Straight and WhereFilmed claims; Dick Cavett and James Gunn quotes; Funko, Sideshow, Trick or Treat, Prop Store and
Heritage lots; the Xscapes escape room.

## Gaps filled
- **Walk of Fame:** dedicated 7 October 1988 (the 1988 Twilight Zone Magazine article the Foundation reprints); the
  Walk of Fame's page says 10/06/1988. Both recorded. No source gives 1985.
- **Filming:** the 2002 revival was made in Vancouver (Wikipedia infobox); the 2019 series' dates for both seasons
  (1 October 2018 to 20 March 2019; 6 October 2019 to 16 March 2020).
- **Muppet theme hums:** seven new references from the Muppet Wiki (Sesame Street episodes 1800, 2403, 2441 and
  3055; Abby's Amazing Adventures; Muppet Babies "Elm Street Babies" and "Back to the Nursery"), labelled fan-noted.
- **New event:** CBS's Twilight Zone pop-up at The Grove, Los Angeles (reported 29 March 2019).
- **New sponsor:** Pepsi-Cola (third season, with Chesterfield and Bufferin).
- **Five interviews with Anne Serling:** WUWF (Bob Barrett, 18 February 2026), WYSO Book Nook (Vick Mickunas, 5 June
  2024, on "First Squad, First Platoon"), WBUR Here & Now (12 September 2024, with Mark Dawidziak, on the statue),
  WVXU (John Kiesewetter, 25 March 2020, on O'Toole from Moscow), and an undated HuffPost Q&A by Dan Lybarger.
- **Licences confirmed:** 80sTees' "To Serve Man" shirt page says "OFFICIALLY LICENSED", and The Search for Tiki calls
  Middle of Beyond's nurse mug "an officially licensed depiction"; both now official (licensor not named). Phantom City
  Creative, Fright-Rags and The Strand's gift set state no licence; unchanged.

## Gaps filled, part 2
- **Episode settings:** 14 of the 1959 series' best-known episodes were read on Wikipedia for places they name. Nine
  new settings: Oakwood (Where Is Everybody?; named only in the production note, which the record says), the King Nine
  crash site, the Kanamit ship, Norma's apartment building in New York, Flight 107, the Hoboken Zephyrs' ballpark,
  Lister's Pool Room (Chicago) and Mason's Pool Hall (Sandusky, mentioned, not shown), and the ruined public library
  in Time Enough at Last. The Masks' Foster mansion and The After Hours' ninth floor already had records. Five
  articles name no place (The Silence, The Trouble with Templeton, The Obsolete Man, Third from the Sun's home
  planet, The After Hours' store).
- **Audio dramas:** Earbud Theater and The Veil describe themselves as in the vein of The Twilight Zone; The Other
  Stories' page quotes Lifewire comparing it. Tangential.
- **Foundation media:** the Rod Serling Memorial Foundation's Media page links Jonathan Napolitano's film of the
  Binghamton carousel, Paul Giammarco's Death Valley video essay and "Conversations with Rod Serling (Ithaca College,
  1974)" (rights unknown, link only); all three attached to their place or record. Its 2025 legacy talk (Parisi,
  Olshaker, Dawidziak) is a new interview on Serling's page.
- **Podcast descriptions:** Fresh Air's Serling tribute is dated by its member-station posts (7 October 2025); Night
  Zone's Twilight Zone comparison is in a truncated excerpt, which the description now says.

## Found in the page check, fixed
- **Organization pages listed no records.** Most organizations added overnight showed only their description,
  because the records naming them used other spellings ("Sideshow Toy") or fields the site does not read for
  organizations. Fixed with alternative names and `organizations` lists on the series, radio, laserdisc, Blu-ray and
  auction records; each now lists the records that name it.

## Decided here (Adam reviews later)
- **The two "Where to watch now" records are excluded**, and their shelf (Television > Where to watch) removed: the
  watch panel on each series page shows the same services from the same JustWatch read, and the records quoted prices
  that go stale. The records stay in the data; including them again brings the shelf back. Decision 0003 updated.
- The two wrong Landau links are excluded rather than deleted, so their history stays.

## Waiting on Adam
- Nothing blocking.

## Found, for later
- **Already covered:** Bif Bang Pow!, Trevco and the door decal (Games plan) and the 1985 revival's awards (Discover
  plan) already had records. Wikipedia lists no Emmy nominations for the 1985 revival; its one award is Harlan
  Ellison's 1987 WGA Award, which has a record.
- **Awards filed as reviews:** the WGA and Emmy records above sit under Reviews > Awards and citations; the Read round
  should move honors to History, as the Media Library sweep did for two.
- **Remarkable Ohio** was read only in part; the number of marker sides is not confirmed.
- **Settings:** about 140 more 1959 episodes and the later series could be read the same way.
- **Foundation media without records:** the Colbert tribute (vol. 2), Atomic Abe, Tone Travelers, The Hitchhiker
  (2014), "Dr. Zaius Was Right", "You're in the Twilight Zone", a Serling sites tour, "Star Wars meets TZ" and Phil
  deGruy's "Blues for Rod Serling". Each needs its own source read.
- **Possible duplicate:** the essays record for KWBU's Fresh Air page may repeat the Fresh Air podcast record.
- **Batch tags shown to visitors:** tags like "research-2026-11-21" (121 pages) and "second-pass-2026-11-24" show as
  chips on record pages. Suggest hiding tags that end in a date.
- Curious Matter's page does not mention The Twilight Zone, and the Murmurs review page could not be read; skipped.
