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
3. Part 3: every remaining fact added overnight read against its cited page, and internal batch tags hidden (a third
   pull request).
4. Part 4: more episode settings and the Foundation's other nine videos (a fourth pull request, and more as the
   episode reading continues).

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

## Part 3: every remaining overnight fact
**How:** every record PRs #62 to #70 changed was listed against its state before the night (139 records with new
facts or sources; 32 already checked in parts 1 and 2). The rest were read against their cited pages: about 90
claims on about 60 pages, plus the 35 podcast feed notes (episode counts and date ranges), which were checked
against the feed data itself and all match. Official/licensed flags set overnight were checked too.

**Corrected (14):**
- *AtGames Legends 4K pack:* "under license from CBS" is not on the page; it carries CBS's trademark notice. Reworded.
- *Huddy Creative key art:* the studio says it "developed key art concepts" for the reboot, not that CBS commissioned
  or used them; no longer marked official.
- *Juan Ortiz's Rittenhouse cards:* no page read states a licence; the official flag set overnight is removed and
  the record says so.
- *Holiday marathons:* Den of Geek does not call KTLA's 1980 marathon "the first known"; KTLA's program director
  says it was KTLA's first, and the article says no one knows which station started them.
- *The Key of Imagination:* "began in November 2022" and "posted to YouTube" are not on Apple's page (it says active
  since 2022); reworded.
- *Imagine if you Will:* "a rotating guest", "one per show" and "about an hour" are not on its page; reworded.
- *Phantom City Creative:* "Canadian" is not on the gallery's page; removed.
- *Pinball FX VR add-on:* QuestStoreDB calls 26 August 2024 a release date, not a store-entry date; note reworded.
- *Night Gallery Blu-rays:* Wikipedia gives the Season Two and Three dates but no distributor; notes say Kino Lorber
  is from its own product page (Season Three) and inferred (Season Two).
- *Unity Award:* Wikipedia names the award but no year; the year 1961 is the Rod Serling Memorial Foundation's,
  now cited. The Wikipedia note no longer mentions an offline mirror.
- *Series Mania 2019:* an international premiere, not a world premiere; Adam Scott was announced to attend.
- *Tower of Terror 25th anniversary:* the page quotes no Disney statement; "marked by Disney" removed.
- *Tower of Terror PC game:* its credits come from a YouTube summary that Tower Secrets cites; now said.
- *"The Time Element" source:* the Wikipedia address redirects to the franchise article; the source says so.

**Confirmed:** the 1959 and 1985 series' sponsors and production companies; Seven Days in May (12 February 1964);
Night Gallery's 2017 Complete Series DVD; the Forum Theatre exhibit; Fathom's 60th-anniversary screenings; Drew
Friedman's print; Alan Wake, Fallout 3, Game Informer, Metacritic, WGA and TV Guide claims; Consequence's Fifth
Dimension, The Hindsight Zone, TV Terror, The Twilight Gnome, Zoning Out and Zoners; the Foundation's podcast posts;
Gold Key's licence and artists; Interlude's CBS deal; the Composers Datebook topic (Constant's theme).

**Also found:** PaleyFest's Twilight Zone panel was on 24 March 2019 (now recorded). The Serling statue's line
"Everybody has to have a hometown, Binghamton's mine" is on a separate park marker (HMdb), not the statue's base;
corrected (this was older text).

**Batch tags hidden:** tags that track our work (dated batches such as "research-2026-11-21", "-round-N",
"needs-...", "seed-record", "artist-corrected") no longer show on record pages or book cards; they stay in the data
for the review pages (src/lib/tags.ts).

## Part 4: more settings and the Foundation's videos
- **Seven more settings**, each quoted from the episode's Wikipedia article: Space Cruiser E-89 (Death Ship), the Lady
  Anne (Passage on the Lady Anne), the sunken submarine off Guadalcanal (The Thirty-Fathom Grave), the X-20 crash
  site in the Mojave Desert (And When the Sky Was Opened), the Philippine Islands and Corregidor (A Quality of Mercy),
  the valley in Virginia, 1863 (Still Valley), and U.S. Air Force Space Probe No. 1 (The Invaders). Eight more
  articles name no place (The Four of Us Are Dying, The Bewitchin' Pool, Static, The Lateness of the Hour, and the
  four from part 2). What You Need (Scranton), Dead Man's Shoes (the Bowery) and Showdown with Rance McGrew name
  places only in passing; not added.
- **The Foundation's nine other videos** are linked as media (link only, makers as the Foundation names them): six on
  the 1959 series (Stephen Colbert's tribute volume 2, Atomic Abe's list, Tone Travelers, The Hitchhiker parody,
  "You're in the Twilight Zone", "The Star Wars Zone"), two on Rod Serling (Phil deGruy's "Blues For Rod Serling", a
  video tour of his Binghamton sites) and "Dr. Zaius Was Right" on Planet of the Apes.
- **Not yet read:** about 90 of the 1959 series' episodes. Wikipedia reading stopped at the shared limit of 100 page
  reads an hour and continues as it refills; the season list pages carry no plot summaries.

## Part 5: twenty-six more settings
- **Twenty-six more settings**, each quoted from the episode's Wikipedia article. From the first batch: Joey Crown's New
  York City (A Passage for Trumpet), the desert near Reno (I Shot an Arrow into the Air), St. Nick's Arena (The Big
  Tall Wish), the Las Vegas hotel (The Fever), the American airbase in France (The Last Flight), the Philippine
  Islands, 1945 (The Purple Testament) and the territory of New Mexico (A Hundred Yards Over the Rim). From the second:
  the Führerbunker (The Man in the Bottle), Las Vegas (The Prime Mover), the Death Valley cave (The Rip Van Winkle
  Caper), Throckmorton's Curio Shop (A Piano in the House), the 3rd Celestial Division Angel Placement (Cavender Is
  Coming), Pitchville Flats (Hocus-Pocus and Frisby), Facsimile Ltd. (I Sing the Body Electric), Harmony, New York
  (Once Upon a Time), Radin's bomb shelter (One More Pallbearer), the New York club and Kansas City (The Dummy),
  Madeiro, Mexico (The Gift) and Eternity Road (The Hunt). From the third: Coeurville (In His Image), the Blue Ridge
  Mountains (Jess-Belle), Homeville, Indiana and the three stops in history (No Time Like the Past), The Dansburg
  Courier (Printer's Devil), Ferguson's Wax Museum (The New Exhibit) and Joe Palucci's bar (A Kind of a Stopwatch).
- **No named place** in the articles for A World of His Own, Escape Clause, Execution, Long Live Walter Jameson, Mr.
  Bevis, Mr. Denton on Doomsday, Nightmare as a Child, One for the Angels, Perchance to Dream, The Chaser, The
  Sixteen-Millimeter Shrine, A Most Unusual Camera, A Thing About Machines, Dust, Eye of the Beholder, Long Distance
  Call, Nervous Man in a Four Dollar Room, Shadow Play, The Mind and the Matter, Nothing in the Dark, Person or Persons
  Unknown, The Fugitive, The Little People, The Mirror, The Trade-Ins, Two, Miniature, The Incredible World of Horace
  Ford, An Occurrence at Owl Creek Bridge and Black Leather Jackets.
- **Named only in passing, not added:** the North Pole (preview narration of The Night of the Meek), Washington (Four
  O'Clock, The Whole Truth), Albuquerque (an accusation in The Grave), Africa (The Jungle) and Chavez Ravine (a
  hypothetical in The Whole Truth's narration), the Midwest (The Last Rites of Jeff Myrtlebank's narration), Fort
  Sumter and Appomattox (The Passersby's narration), Dachau and the cities of He's Alive's closing narration, Austria
  (Mute), the Earth of The Parallel, and New York City as a plan in Caesar and Me.
- **Not read yet:** Young Man's Fancy (Wikipedia has no article under either title tried), A Short Drink from a
  Certain Fountain, Come Wander with Me, From Agnes – With Love, and the last 23 episodes of season 5.
- Details were kept to what each article states: where an article gives only a surname or no city, so does the
  record (the Führerbunker record gives no city, the Death Valley cave no state).

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
- **Settings:** about 26 more 1959 episodes and the later series could be read the same way.
- ~~Foundation media without records~~ linked in part 4.
- **Possible duplicate:** the essays record for KWBU's Fresh Air page may repeat the Fresh Air podcast record.
- ~~Batch tags shown to visitors~~ hidden in part 3.
- **Rittenhouse's licence:** the trading-card records say licensed, but no page read states it; a Rittenhouse or CBS
  page would settle it.
- Curious Matter's page does not mention The Twilight Zone, and the Murmurs review page could not be read; skipped.
