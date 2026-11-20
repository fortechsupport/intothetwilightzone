# Research pass 2: music, games, artwork, merchandise (2026-11-20)

Overnight deep-research pass requested by Adam. Raw rows are in `data/research/music-games-art-merch-2/*.jsonl`
and are merged by `scripts/research/merge_music_games_art_merch.py` (re-runnable). Every record carries sources,
research_confidence, a relevance tier, and a hand-written connection / recommendation / reason in
`data/review/assessment-overrides.yaml`. Media are linked only where legitimately hosted (`rights: link-only` or
`licensed` unless public domain); nothing copyrighted is re-hosted.

Totals: 232 new records (59 people, 11 songs, 162 works), 74 existing records enriched, 165 episode connections.
14 of 80 song verifications had a source and were applied; the other 66 stay "unclassified" until checked.

The web search budget shared by all overnight threads ran out during this pass. Gaps are listed in each section.


---

## Music – composers, scores, soundtracks, theme recordings (research notes)

Output: out/music-scores.jsonl — 90 records (50 people, 39 works, 1 song); 32 are update_of enrichments of existing records.
Builder script (re-runnable, validates update_of ids and episode ids): scratchpad/gen-music-scores/build.py

## Covered
- Original series (1959-64): Herrmann, Goldsmith, Waxman, Rosenman, Van Cleave, Nathan Scott, Fred Steiner, Constant (updates). New: René Garriguenc, Lucien Moraweck, Guy Luypaertz, Willis Schaefer (stock cues), Jeff Alexander, Tommy Morgan, Laurindo Almeida, Leith Stevens, Lud Gluskin (CBS music director who spliced the theme together), Don B. Ray.
- Theme history: Constant "Etrange 3"/"Milieu 2" with CBS library numbers, copyright and publisher data, how it was paid for, and the "Ponant 19" claim that doesn't hold up; Herrmann theme (polytonal analysis, copyright, alternate takes); the season-two candidate themes that were turned down (new).
- CBS Music Library / stock-music practice (new context record); Herrmann's 1957 Outer Space Suite and its LP; Goldsmith/Garriguenc jazz source cues.
- 1985 revival: every composer on Intrada ISC 348 with episode mapping (Young, Poledouris, Safan, McCarthy, Wannberg, Redford, Kaplan, Kempel, Goldstein, Steiner), Robert Drasnin (supervising music director), Morton Stevens, Louis Natale, Ron Ramin and Lance Rubin (episodes unknown). Grateful Dead: the sessions (Grateful Dead Archive Online item), the 9 Mar 1985 Berkeley show where the theme turned up in Drums/Space (archive.org audio), Merl Saunders, Jerry Garcia, Mickey Hart, Bob Bralove.
- Night Gallery: theme history (Goldenberg pilot → Mellé's electronic theme for seasons 1-2 → Sauter for season 3), segment composers (Goldenberg, Mellé, Sauter, Oliver Nelson, Robert Prince, Paul Glass, John Lewis, Benny Carter, Lalo Schifrin, Robert Bain, Frank Skinner), and the Jerry Wallace hit "If You Leave Me Tonight I'll Cry".
- Releases: catalogue numbers for the Varèse LPs (STV 81171/81178/81185/81192/81205; numbers for vols 1, 3 and 4 are inferred from the sequence), the Varèse CDs (1990, VCD 47247), the French "La Quatrième Dimension" LP, the Japanese 5CD set (few details), full credits for Silva's 40th Anniversary set, the McNeely/Abbey Road re-recording, Intrada 1985, the TZ Movie Warner LP (9 23887-1), FSM Vol.12 No.7, and the Music Box Records edition.
- Scholarship/media: Wissner's *A Dimension of Sound* (the key source), the Fred Steiner TV Academy interview, the Goldsmith Odyssey podcast, Composers Datebook, and the Tunefind song lists for the 2019 series.

## Could not find / gaps (web search budget ran out partway through)
- **Twilight Zone (2002) composer(s)**: still unconfirmed. Whether Mark Snow scored it was not verified, and IMDb episode credit pages need a direct check.
- **Rod Serling's Lost Classics (1994)** composer: not found. The IMDb full-credits URL is noted (s.media-imdb.com/title/tt0111520/fullcredits).
- **Twilight Zone Radio Dramas** music credits: not found.
- **Lyn Murray, William Lava, Wilbur Hatch, Bernard Green**: no source tied them to specific TZ episodes, so no records were made. Wissner's appendix is the place to check.
- The Herrmann "Jess-Belle" and "Living Doll" scores, Goldsmith's 7th score, and Jeff Alexander's second score (probably "Come Wander with Me") are all marked unverified.
- Tommy Morgan's and Laurindo Almeida's episodes are not named in the abstract I could read (low confidence).
- A 2019 series soundtrack album (Lakeshore?) was not found.
- New theme covers: none added beyond the existing ones (Ventures, Manhattan Transfer, Marty Manning, Neil Norman, Boston Pops, Marketts). Discogs and SecondHandSongs searches were blocked by the search limit.
- Golden Earring "Twilight Zone" (1982) and Iron Maiden "Twilight Zone" are original songs, not covers of the theme. The existing records already treat them as references, and the duplicate *-2 unclassified rows can be merged.

## Proposed NEW subcategories (flagged new_subcategory true)
- **Stock music library cues** (stock-music-library, library-suite, library-cue): most episodes were scored with library cues, so this is how the series' music actually worked.
- **Unused / rejected themes** (unused-theme): the season-two candidate themes are lost music worth telling.
- **Recording sessions** (recording-session): the Dead's 1985 sessions have archive documentation.
- **Concert performances** (concert-performance): live versions of the theme, with legal audio on archive.org.
- **Theme uses in other media** (theme-use): Sixteen Candles, Moonlighting, The Simpsons and others. This can grow into individual records.
- **Sheet music** (sheet-music).
- **Music scholarship & podcasts** (book, podcast-episode, radio-segment).
- **Licensed songs in episodes** (episode-song-list): pop songs used in the 2019 series.

## Open questions for Adam
1. Should Night Gallery composers be full people records (done as "related") or folded into a Night Gallery page?
2. Do you want minor stock-library composers (Luypaertz, Schaefer, Moraweck) shown publicly, or kept only as data?
3. Is it worth buying or borrowing Wissner's book? Its cue appendix would let us add per-episode stock-music lists for all 156 episodes.

---

## Music / Songs research notes (pass 1, cut short)

## What happened
- The session's shared WebSearch budget (200 calls per turn, shared by every agent) ran out after about 20 of my searches. The searches that did run returned only titles and URLs, with no snippets, so lyric checks needed WebFetch. I used about 15 fetches (the guideline is about 12). Genius and lyrics.com block fetches, and readdork rate-limited me.
- I found where the "unclassified" rows came from: the `songs` sheet of `data/source/_IntoTheTwilightZone.xlsx`, rows 27-124. They are bare artist/title pairs with no album, year or notes, so the reason each song was added is lost.

## Task A: verifying the unclassified rows (80 records; the 16 duplicate `-2` ids were skipped)
- **Confirmed lyric mentions (fetched lyric pages):**
  - Bon Jovi "Who Says You Can't Go Home" (2005, first verse)
  - Damn Yankees "Runaway" (1990, chorus)
  - Aimee Allen "Cooties" (Hairspray film soundtrack, 2007)
- **New duplicate found:** `moses-pelham-twilight-zone` is the same recording as `moses-p-twilight-zone` (Moses P is Moses Pelham). It is marked exclude with `duplicate_of`.
- **Classed as "reference" because the title itself names the show:** 17 rows, plus 2 "Zwilight Zone" title puns. Their content is unchecked, so they are low confidence and "maybe".
- **Still unclassified:** 57 rows, all low confidence and "maybe". I did not mark any as "exclude", because none of them got a real search; the budget ran out first. Re-run these first next pass. Ideal tools are Genius lyric search (blocked here) or a lyrics site that allows fetching (letras.com and metalkingdom.net worked).
- **Partly enriched rows:**
  - Ice Cube "Robbin' Hood" (Lethal Injection, 1993)
  - John Entwistle "Sleeping Man" (Too Late the Hero, 1981)

## Task B: new songs (10 records, far short of the 60 target)
- Sourced from Wikipedia's "Twilight Zone" disambiguation list:
  - L.A. Style "Twilight Zone" (1993)
  - Van Morrison "Twilight Zone" (The Philosopher's Stone, 1998)
  - S.E.S. "Twilight Zone" (Love, 1999)
- Named after episodes:
  - Electromud "Time Enough at Last" (Bandcamp, explicitly about the S1E8 episode)
  - bobsquared "Time Enough at Last"
  - Jaimie Vernon "Time Enough At Last"
  - Hassle Hound "Monsters Are Due on Maple Street"
  - Doom Service "Monsters Are Due"
- Other titled songs:
  - Klone "Twilight Zone" (check whether it is a Golden Earring cover)
  - Ted Sink "Twilight Zone" (amateur self-submission, exclude)

## Leads I could not verify (no records written; check next pass)
- Episode-title songs: other "To Serve Man" songs beyond Cattle Decapitation and Nuclear Assault, "A Stop at Willoughby" / "Willoughby" songs, "Nightmare at 20,000 Feet" songs, "Talky Tina", "The Obsolete Man", "Eye of the Beholder" (beware: Metallica's song is unrelated).
- The band "Next Stop Willoughby" (Sonicbids page seen). Its name comes from the episode, so it could go in a "bands named after episodes" list along with Serling (Maine) and The Number Twelve Looks Like You.
- Hip-hop lyric mentions from the brief (Jay-Z, Eminem, Nas, Wu-Tang, Ab-Soul, Kanye, BabyTron) need a Genius lyric search. Rock and metal names to check: They Might Be Giants, Ozzy, Danzig, Misfits, Blue Öyster Cult, Dan Bern, Fall Out Boy, Ramones, Anthrax, Overkill.
- Surf and instrumental covers of the theme (Ventures-style, by other surf bands) and Golden Earring covers.
- Rich DiSilvio's "Ode to Rod Serling" (rodserling.com, 2017) is a poem, not a song. It fits Reading / fan tributes.

## Proposed new subcategories
- **Songs named after episodes:** a clean, browsable group (To Serve Man, Time Enough at Last, Maple Street, Nightmare at 20,000 Feet).
- **Bands named after the show or episodes:** Serling, The Number Twelve Looks Like You, Next Stop Willoughby.
- **International / non-English songs:** S.E.S. (K-pop), Moses P (Germany), 2 Unlimited and L.A. Style (Netherlands).
- **Idiom uses vs. real references:** many "twilight zone" lyrics use the phrase as everyday slang. A flag would let Adam show only songs that are really about the show.

## Open questions for Adam
- Do you remember the source of the spreadsheet rows 27-124? They look like a lyric-search export. Knowing it would let us confirm the 57 unresolved rows quickly.
- Should idiom-only lyric mentions (like Bon Jovi) be listed, or only songs that are about the show?
- Should self-released Bandcamp / SoundCloud tracks be included?

---

## Games research notes (Twilight Zone)

Output: out/games.jsonl has 46 records: 38 works with kind "game" and 8 people.

## Covered
- **Updates (update_of), 10 records**
  - 1993 pinball: full credits, 15,235 units, model 50020, toys, episode map, ops manual, Flipside, Play Meter (archive.org), and Granner's own soundtrack MP3.
  - 1988 First Row game: full credits from the manual scan, the "Crossroads of Imagination" subtitle, developer Covenant Technologies, Amiga UPC.
  - Ideal 1964 game: rules and components.
  - Clue Tower of Terror: park-exclusive edition.
  - Pinball Arcade table: Kickstarter in 2012, released 2013-02-05, delisted 2018-06-30.
  - Pinball FX table: released 2023-04-13 on PC, PS and Xbox.
  - TZ VR: Pocket Money Games and Fun Train; story titles; Quest release 2022-07-14; PSVR2 release 2024-03-19.
  - IGT slot: 5 reels, 15 lines, bonus names, listed 2014.
  - Legacy 2014 game: extra sources only.
- **New licensed or official items**
  - Unreleased C64 port of the 1988 game.
  - Boyd Specialty's 1958 board-game pitch to Serling.
  - Ken Levine / Interlude interactive TZ pilot (2016, never released).
  - TZ pinball home ROM L-9.4H.
  - Rumored Chicago Gaming Company remake.
  - Disneyland California Adventure Tower of Terror promotional PC game.
  - Monster Mini Golf Twilight Zone course, Las Vegas (2020).
- **Homages**
  - 13 video-game homages, including Fallout 3 Tranquility Lane, Alan Wake Night Springs, Alan Wake 2 Night Springs DLC, Dark Pictures' Curator, Asemblance and Midnight Scenes.
  - 6 pinball homages, including Red & Ted's Road Show, Willy Wonka and Simpsons Pinball Party.
- **Fan and name-only items**: Tower of Terror Flash simulator, Crowdpurr trivia, ZX Spectrum "Twilight Zone" (excluded).

## Could not find or verify (shared search budget ran out mid-run)
- **No evidence found**
  - A Cryptozoic or other modern licensed TZ board or card game.
  - TZ Monopoly, Trivial Pursuit or Clue editions (other than Tower of Terror).
  - A Magic: The Gathering Secret Lair drop.
  - A d20 or licensed tabletop RPG. Sword & Sorcery's 2000s d20 lines did not include TZ in anything seen, so I treat it as unconfirmed or nonexistent.
  - Lottery scratchers.
  - Bally or WMS TZ slots.
  - Handheld LCD games.
  - Licensed mobile apps. The futuresoft "Twilight Zone App" page is actually the Carl Amari radio dramas; I passed it to audio.
- **Hellbreak TCG**: added Paramount properties in 2026, but no TZ card was confirmed.
- **Not verified**
  - Legacy Interactive 2014 game: developer credits and episode basis.
  - Pinball FX VR release date.
  - Atari ST version of the 1988 game.
  - Whether Stories Untold explicitly cites TZ.
- **Not searched**: Control, BioShock, Psychonauts, Twisted Metal and Destiny homages. These are unconfirmed and were left out.

## Proposed new subcategories
- video-game-homage / pinball-homage: TZ's influence on games is large and best kept apart from licensed items.
- unreleased-game / unrealized-project: cancelled ports, pitches, and the Levine interactive series.
- pinball-software / pinball-remake: ROM revisions and the expected CGC remake matter to collectors.
- promotional-game / fan-game: Tower of Terror tie-ins.
- mini-golf: a licensed physical game venue. It overlaps with Attractions.
- trivia: quizzes and trivia games. Trivia books such as Bill DeVoe's "Trivia from The Twilight Zone" (BearManor) belong under Reading.
- interactive-film.

## Open questions
- Should the Monster Mini Golf course live under Games or under Places/Attractions?
- Should name-only references (Persona 2, Monster Hunter) be kept as excluded rows or dropped?
- Re-run when search budget allows, for: Legacy 2014 credits, TZ escape-room boxed games, later IGT/Aristocrat slot variants, and the CGC remake announcement.

---

## Artwork research notes (IntoTheTwilightZone.com)

Output: artwork.jsonl, 69 records (50 works and 19 people). 8 of these are update_of enrichments: the title sequences from 1985 and 2019, the 1983 one-sheet (artist John Alvin), the Tom Whalen series, and the Serling statue; plus the people records thomas-j-wright, jaroslav-gebr and william-j-tuttle.

## Covered
- **Night Gallery paintings:** a hub record covering about 101 paintings and what happened to the originals, plus 7 individual paintings. The Cemetery and The Escape Route are by Gebr; del Toro owns The Escape Route. The others are the Crawford portrait from "Eyes", You Can't Get Help Like That Anymore (sold at Hake's in 2014 for $9,775), The Caterpillar (Wright still owns it), Make Me Laugh and Pickman's Model. Also the Art of Darkness book (2020), the TV Time Machine interview with Tom Wright, the Night Gallery title sequence and the ADG Gebr tribute (2017).
- **Answer to the question in the brief:** Gebr painted the pilot work only. Tom Wright painted almost all of the series paintings. Tom Wright did not write a book called "The Art of Night Gallery". The art book is *Rod Serling's Night Gallery: The Art of Darkness* by Skelton and Benson (Creature Features, 2020).
- **Title sequences:** the 1959 season 1 opening (UPA, Herrmann), seasons 2-3 (Constant) and seasons 4-5 (door, window, eye, E=mc2, mannequin, clock).
- **Posters:** the 1983 one-sheet by John Alvin, plus the Japanese B2, Italian and French posters. Also the 1983 Hirschfeld caricature of Serling.
- **Prints:** the Whalen series details, the Whalen "Eye of the Beholder" print, the 2016 Dark Hall Mansion "To Serve Man" prints and a RISD Museum print.
- **Comic covers:** Dell Four Color #1173, Gold Key #1/#24 (original art sold for $1,180)/#40/#92, the Gold Key artist roster, NOW #1 (Sienkiewicz cover; Neal Adams reprint cover) and Dynamite #1 (Francavilla).
- **Magazine:** the April 1981 TZ Magazine cover (Jim Warren) and its illustrators, an overview of the magazine's cover art (film stills from Oct. 1983; archive.org scans) and Night Cry covers.
- **Makeup design:** Tuttle's "Eye of the Beholder" design, two surviving appliances that went to auction (2018, 2023), "The Masks", and the Martian/Frisby aliens.
- **Public art and exhibitions:** the statue update (bronze, $140k, Sept. 15, 2024), the SerlingFest 2024 art show and the Roberson Museum show (Oct. 2024).
- **Advertising:** sponsor billboards from 1961-64 (low confidence, from reader comments), a print ad for the 1983 film, and the TV Guide archive gallery.

## Not found / gaps (the shared web-search budget ran out partway through)
- **2002 UPN title sequence:** designer not found. 1983 movie title design not researched.
- **Season 1 sponsors:** General Foods and Kimberly-Clark ads not verified. No museum- or archive.org-hosted scans of period sponsor ads were found. The Lantern (Media History Digital Library) pages I checked were not relevant.
- **Screen prints:** I could not verify Twilight Zone prints by Kevin Tong, Jason Edmiston, Gary Pullin, Laurent Durieux or Ken Taylor, so I did not add records for them. I also could not confirm which Mondo prints exist; the existing Mondo record was not enriched.
- **Binghamton:** no Serling or Twilight Zone mural found. The 2022 downtown mural by Danae Brissonnet is carousel-themed, not Serling. The statue's sculptor is not named in the sources I checked.
- **Other gaps:** TV Guide covers (Serling does not appear to have had one; not confirmed), Rittenhouse sketch-card artists, storyboards, the Mystic Seer prop's original design, 2019 posters beyond the existing key art, and a 2019 Night Gallery exhibition (mentioned only in a photo caption).
- **Night Gallery segment ids:** none exist in existing-episodes.txt, so the Night Gallery records name segments in details instead of episodes.

## Proposed new subcategories (flagged new_subcategory: true)
- night-gallery-painting: the gallery canvases are the core visual art of Serling's second anthology.
- comic-cover / comic-art: about 30 years of licensed comic art with notable artists.
- magazine-cover / magazine-illustration: TZ Magazine (1981-89) was a major home for illustration.
- screen-print: limited-edition gallery prints, distinct from theatrical posters.
- makeup-design: Tuttle's designs are central to the show's best-known twists.
- caricature: the Hirschfeld portrait and similar portraits of Serling.
- public-art (Murals and public art): the statue, plus any future murals.
- vintage-ad: sponsor and print-campaign art.
- art-book: books whose subject is the art itself, e.g. The Art of Darkness.
- artist-interview: primary-source interviews with the artists.

## Open questions for Adam
- Should Night Gallery segments get their own episode ids (e.g. 1970/the-caterpillar) so the paintings can link to them?
- Should auction-lot pages be shown as media? They are link-only and their images are copyrighted.
- Should the RISD print (only tangential) stay?

---

## Merchandise research notes (merch.jsonl)

87 records: 21 update existing records (update_of), 66 are new.

## Covered
- **Sideshow Toy 12-inch:** existing record enriched. Four releases now have their own records: Eye of the Beholder Doctor + Nurse (SID6900, limited to 5,000), Kanamit (SID6903), Gremlin (SID6904) and Invader (SID6905, sculpted by Mat Falls). Release years were not shown in any source I saw.
- **Bif Bang Pow! 8-inch Mego-style line (2010 onward):** existing record enriched. Records added for each two-pack (Gremlin/Jason Foster, Doctor/Henry Bemis, Venusian/Invader, Cyclops/Alicia, Alien/Nurse), for the SDCC sets (Bob Wilson/Don Carter, Talky Tina/Willie) and for six single-carded series figures (Series 1, 2, 4 and 5).
- **Bif Bang Pow!/Zica 3 3/4-inch line (2014 onward):** existing record enriched. Records added for Series 2 (Eye of the Beholder), Series 3 (Five Characters, limited to 1,400 each), Series 4 (The Dummy), the Series 5 diorama editions, the SDCC 2014 color figures and the glow-in-the-dark Talky Tina.
- **Bobbleheads:** item numbers BBP05003-05022. Also covered: the color SDCC variants, Willie & Jerry, Bob Wilson (Diamond APR112002, 2011), Icons of TZ, Monitor Mates (Toy Fair 2014) and the Shatner Captain/Passenger set.
- **Funko Pop!:** 2024 wave only, #1582 Narrator, #1583 Gremlin and #1584 Deluxe Robert Wilson. I found no Talky Tina or Kanamit Pop!.
- **Prop replicas:** Mystic Seer versions (cream, black-and-white, red, signature, Shatner-signed with a Hake's auction lot, 2023 EE bundle). Also the Bif Bang Pow! Talky Tina replica (with a UNT Web Archive capture of a 2012 article), the Trick or Treat Studios Talky Tina (Sideshow item 905676) and the Kanamit's Cookbook "To Serve Man" set (SDCC).
- **Masks (Trick or Treat Studios, CBS license, 2017):** Mystic Seer, Eye of the Beholder doctor, Gremlin, and vacuform masks from "The Masks".
- **Trading cards:** all 7 existing Rittenhouse sets enriched. Series 1 (1999) and the 50th Anniversary set (2009) now have full insert and autograph-signer lists from House of Checklists. The other sets got checklist links (nslists, TCDB, Cardboard Connection).
- **Household and other:** tin totes (Kanamit, Rod Serling, Doorway), Doorway travel mug, door decal, Middle of Beyond nurse tiki mug, Strand Magazine gift set, Trevco polos, Fright-Rags (2015, enriched), and an unlicensed Lowbrow Antics pin set.
- **Hallmark 2009 ornament:** enriched with The Henry Ford museum collection record, which is a legitimate image source.
- **Tower of Terror tie-ins (related):** Funko Pop! Town Hollywood Tower Hotel (2022), Disney park merchandise waves from 2022 to 2026, a lanyard pin set, and the LEGO Ideas fan project that passed 10,000 supporters in September 2025.
- **Home video (kind "other"):** Definitive Edition DVD and the season Blu-rays (enriched). Also the Complete Series Blu-ray (2012), Fan Favorites, Essential Episodes 55th, Image single-volume DVDs, Treasures of the Twilight Zone, Japanese Pioneer laserdiscs (original and 1985 series), the Complete '80s Series DVD, the 1983 movie on Blu-ray and HD DVD (2007), a 2025-26 movie Blu-ray (label unverified), the 2019 series DVDs, and Night Gallery on Blu-ray (Kino and Imprint).

## Could not find or verify
- **No 1959-1964 licensed merchandise found** apart from the Ideal board game (already on the site) and the Gold Key/Dell comics. I found no lunch box, View-Master reel, Aurora model kit or sponsor premium; they very likely never existed.
- **Makers with no real TZ products found:** Mezco, NECA, McFarlane, Diamond Select, Kotobukiya, Hot Toys and Burger King or other fast-food promos. The only Super7 item is Iron Maiden's "Twilight Zone" single-art figure, which is tangential.
- **Not found:**
  - CBS/Fox VHS releases from the 1980s, and US laserdiscs (Image released the series on LD, but I found no LDDb pages for those).
  - Any 4K release of the original series.
  - Merchandise for the 1985 or 2019 series.
  - Other Hallmark ornament years, licensed jigsaw puzzles, Rubie's or Spirit Halloween costumes, Junk Food or Hot Topic lines, and socks.
  - Vintage print ads for merchandise with legitimately hosted scans (no vintage-ad records were made).
- **Facts still missing:** the Sideshow release years, contents of 8-inch Series 3, 6, 7 and 8, the Rittenhouse Series 2-4 and 2019-2020 signer lists (the checklist pages are linked), and the label of the newest movie Blu-ray.

## Proposed new subcategories
| Subcategory | Reason |
|---|---|
| Masks and costumes | Trick or Treat Studios' licensed line is substantial. |
| Prop replicas | Mystic Seer, Talky Tina and the To Serve Man book together make a distinct collecting area. |
| Ornaments | Hallmark Keepsake, plus Disney park ornaments. |
| Home video, split into vhs/laserdisc/dvd/blu-ray | Format history is a collecting area in its own right. |
| Theme-park merchandise | Tower of Terror items carry the TZ name. |
| Dioramas and convention exclusives | Variants from SDCC and other conventions are common. |
| Tin totes and drinkware | Lunchbox-style items stand in for the vintage lunch box that apparently never existed. |
| Fan proposals | Unofficial ideas such as LEGO Ideas projects. |

## Open questions for Adam
- Should Tower of Terror merchandise sit under Merchandise or under the attraction records?
- Do you want single-carded re-issues as separate rows, or folded into the parent line?
- Should unlicensed fan-maker items (Etsy-style pins and shirts) be included at all?
