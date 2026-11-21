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

## Pass 2b (second sweep, same night)

52 new records, 17 enriched, 37 connections. Corrected: The Ventures' "Twilight Zone" is Marty Manning's tune, not the TV theme.

---

### Music / Songs research notes (pass 2)

### Budget
- The shared WebFetch budget (100 per hour across all agents) ran out early and stayed close to empty. About 12 of my fetches worked.
- Web searches return only titles and URLs, so a search cannot confirm a lyric. Each lyric check needs one fetch.
- curl to lyric sites is blocked by the proxy.
- A method that works: build the letras.mus.br address by hand (`https://www.letras.mus.br/<artist-slug>/<song-slug>/`) and ask the fetch whether the phrase appears. The fetch model will not quote lyrics, but it does say yes or no, which verse, and whether the phrase is an idiom or a reference to the show. If the slug is wrong, the site falls back to another song by the same artist (that happened for MF DOOM, whose slug returned "Potholderz"), so always check the title the fetch reports.

### Task A: confirmed (update_of, with sources)
- **A Tribe Called Quest, "Description of a Fool" (1990):** the phrase appears. The fetch would not say where, or whether it is an idiom.
- **Ice Cube, "Robbin' Hood (Cause It Ain't All Good)" (1993):** first verse, used as an idiom.
- **Tyler, the Creator, "Nightmare" (Goblin, 2011):** verse 3, used as an idiom.
- **Excludes:** none. No song got a real lyric check that came back negative.
- **Not yet checked:** MF DOOM "Go with the Flow" (the letras slug does not exist), Kid Cudi, Kid Rock, Tech N9ne, E-40, Chamillionaire, Vanilla Ice, WC, The Roots, Dennis DeYoung, Loudon Wainwright, Lisa Brokop, Thirsty Merc, Gary Portnoy, Warren Haynes, John Entwistle, and the rest of the unclassified rows. Try letras slugs for them first next pass.
- **Correction lead:** "Ghetto Horror Show" is credited on lyric sites to Mack 10 featuring Jayo Felony and Ice Cube. The existing row lists only Ice Cube.

### Task B: new
- **Serling, *Next Stop, Willoughby* (2022, Been There Scene That):** a full concept album whose tracks are named after episodes. I added the 12 tracks not already listed (A Passage for Trumpet already exists), each with an episode id. Sources: Metal Music Archives tracklist, Heavy Blog Is Heavy, Everything Is Noise.
- **Serling EP, *The James Bevis Chronicles / The Hempstead Assignments*:** the title seems to point to "Mr. Bevis". Low confidence.
- **Leads with title matches only:** The Dockers "Talking Tina", a Bandcamp track "Willoughby" (morosecodeoh), and Alienfaktor "Twilight Zone". All are low confidence and marked "maybe".
- **Pages checked that added nothing new:** the TV Tropes "Referenced By" Twilight Zone page and the Twilight Zone Wiki page "Audio recordings with references" both list only songs we already have. The Wikipedia article "Time Enough at Last" names no songs. Steve Terrell's "It's Twilight Time" playlist also holds only existing songs.
- **Hip-hop and rock leads from the brief (Jay-Z, Eminem, Nas, Wu-Tang, Kanye, Ab-Soul, They Might Be Giants, BÖC, Ramones, Misfits, Danzig, Anthrax, Fall Out Boy, Dan Bern):** searches returned nothing I could use. They need lyric fetches or Genius access.
  - TMBW lists "Hell Hotel" (They Might Be Giants) for a Twilight Zone search. Check its notes.
- **Other unchecked leads:**
  - AllMusic album "Monsters on Maple Street" (mw0001436074)
  - AllMusic "Time Enough at Last" album (mw0000449432)
  - "Twilight Zone EP" (mw0000934439)
  - The Kiwix copy of the Wikipedia "Twilight Zone (disambiguation)" page, which could not be fetched

### Proposed subcategories
- **Concept albums built on episodes:** Serling's *Next Stop, Willoughby* is the clearest example. It fits next to "songs named after episodes."
- **An "idiom" flag on lyric mentions:** Ice Cube and Tyler both use the phrase only as everyday slang.

### Open questions
- Should idiom-only mentions by major artists (Ice Cube, Tyler, ATCQ) be listed or hidden?
- Should every track of an episode-titled concept album get its own record (as done here), or should the album get one record?

---

### Music, second pass: theme covers, revivals, stock credits (notes)

Output: out/music-scores-2.jsonl has 31 records (13 songs, 12 works, 6 people). 6 of them are update_of enrichments: the-ventures-the-twilight-zone, jonathan-davis-the-twilight-zone-2002, neil-norman-and-his-cosmic-orchestra-twilight-zone, mark-snow, robert-drasnin and jeff-alexander (the last two are first-pass ids).
Builder script, which validates ids, update_of and episodes: scratchpad/gen-music-scores-2/build.py
Budget: the shared WebFetch budget ran out after about 9 fetches. Search results came back as titles and links only, so several records are medium or low confidence and say so.

### Key findings
- **Correction: the Ventures' "Twilight Zone" (1964, The Ventures in Space, Dolton) is credited to Marty Manning.** It is the tune from Manning's 1961 LP, not Constant's TV theme. The existing song record has been corrected with update_of.
- **2002 UPN series**: IMDb credits **Mark Snow** as composer, **Jonathan Davis (of Korn)** for "theme music adapted and performed", **Marius Constant** for the original theme, and **Stuart Goetz** as music editor. No score album was found.
- **Lost Classics (1994)**: the music is by **Patrick Williams** (SciFi-Movies credits page).
- **Radio Dramas**: no composer credit in Wikipedia or the reviews. Only sound engineers are named (Wolski, Benson, Lee, Cerny, Rizzo). The CD booklets need checking.
- **Tower of Terror**: **Richard Bellis** scored the pre-show "episode", re-recording the original instrumentation. The lobby uses period jazz (Ellington's "Mood Indigo"; Vera Lynn's "We'll Meet Again" in Paris). No official album exists.
- **Herrmann's "Moat Farm Murder" (1946 CBS radio)**: its cues were reused in 11 original-series episodes (Wissner 2017, open-access PDF on CORE). Robert Drasnin compiled the stock scores for Rip Van Winkle Caper, Valley of the Shadow and Nightmare at 20,000 Feet. Wissner also says 57 of 156 episodes used either an original score or at least one Herrmann stock cue.
- **Jeff Alexander**: "The Trouble with Templeton" is confirmed as one of his two original scores (Cambridge chapter abstract). Tommy Morgan and Laurindo Almeida are confirmed as writing for episodes featuring their instruments, but the abstract names no episodes.
- **New covers and samples**: Silver Bullet "Undercover Anarchist", the 8 Bit Arcade chiptune (of the *Herrmann* theme), DJ Cam "Twilight Zone" (samples Herrmann's "Space Control" from the Outer Space Suite), the Manhattan Transfer with the WDR Funkhausorchester, the Cincinnati Pops/Kunzel "Chiller" (detail is medium confidence), and Nebula-H, James Andreasen and The X Files (all low confidence, single-source WhoSampled entries).
- **Other uses**: the 2019 Super Bowl LIII "disruption" spot (Clio winner), The Score #906 radio hour, the Gary Wolk orchestral and Jeffrey Bowen band arrangements, the Constant/Lubin TZ–Outer Limits pairing on Discogs (low), and CCR's "Midnight Special" in the Twilight Zone: The Movie prologue.

### Still open (gaps)
- **Lyn Murray, William Lava, Wilbur Hatch**: no source ties them to a TZ episode. No records made. This needs Wissner's book appendix.
- **Herrmann "Jess-Belle" / "Living Doll"**: both records are marked low/maybe. The infobox credits could not be fetched.
- **2019 series**: no official soundtrack album was found (searched Lakeshore and Varèse; only the Tunefind song lists turned up). No new Beltrami/Roberts per-episode credits; IMDb episode credit pages exist (e.g. s.media-imdb.com/title/tt9199174/fullcredits) but were not fetched.
- **Twilight Zone: The Movie**: Goldsmith scored all segments, and the existing records already cover this. Only the CCR song was added.
- **To fetch when budget allows**: the WhoSampled TV page and page 2 (whosampled.com/tv/The-Twilight-Zone/?sp=2), the SecondHandSongs Constant work page (secondhandsongs.com/work/174718/all) for a full cover list, Discogs 4475505, and the Twilight Zone Wiki audio-references page.
- **To merge**: the duplicate unclassified rows (golden-earring-twilight-zone-2, iron-maiden-twilight-zone-2, 2-unlimited-twilight-zone-2) are still outstanding.

### Proposed new subcategories
- **series-score** (record for one revival's whole music department), for when there is no album.
- **audio-drama-score**: music for the radio dramas.
- **attraction-music**: Tower of Terror queue, pre-show and ride audio.
- **theme-use** (carried over): adverts and promos, e.g. the Super Bowl spot.
- **radio-segment** (carried over): radio programmes about the music.
- **library-cue** (carried over): individual CBS stock scores reused in episodes (e.g. Moat Farm Murder).

### Questions for Adam
1. Do you want low-confidence single-source WhoSampled samples (Nebula-H, Andreasen, The X Files) public, or held back as data only?
2. Should licensed pop songs in TZ productions (like CCR in the 1983 movie) go in Songs or in a separate "songs in productions" list?

---

### Gaps pass 2: games, art, collectibles, ads

Output: out/gaps-2.jsonl has 19 records: 9 enrich existing records (update_of) and 10 are new. No new id repeats an existing or first-pass id.
Both web budgets ran out: WebFetch hit the shared hourly cap after 11 calls, and about 58 searches were used. Many search results came back as titles and links only, so several rows are marked low confidence and include a "to_verify" note.

### Resolved
- **Pinball FX VR add-on:** released on Meta Quest 2024-08-26 at $14.99, by Zen Studios (source: QuestStoreDB).
- **1988 game on Atari ST:** not confirmed. Lysator lists Amiga and PC only. First Row did release other games on the ST, such as Prime Time, so a port is plausible but has no evidence.
- **Bottleneck / Phantom City Creative:** the "Time Enough at Last" print, on sale 2026-04-16. Three editions: 100, 75 and 25 (acrylic panel), priced $50, $60 and $85. If the existing record is about an earlier print, split it.
- **New prints:**
  - Drew Friedman's Rod Serling print: 2024, edition of 20, signed.
  - Zeb Love's TZ print (1xRUN).
  - Tom Whalen's "It's a Good Life" (Dark Hall Mansion, 2017), with a Heritage lot page.
- **TV Guide:** Serling's cover of June 3, 1972 (Night Gallery; photo by Gene Trindl). The 1970s list has no Twilight Zone cover. The 1950s and 1960s lists were not checked; the URL is en.wikipedia.org/wiki/List_of_TV_Guide_covers_(1960s).
- **Auction documents (new subtype script-archive):**
  - Richard Matheson's annotated "Once Upon a Time" script archive, with a companion lot (Heritage 997042, lots 1989 and 1990), plus the 2017 Fine Books report.
  - Martin Landau's shooting scripts (Heritage lot 1183).
  - A screen-used TZ matte painting (Nate D. Sanders lot 67144, April 2024). The episode is not yet confirmed.
- **Laserdiscs:** LDDB catalog numbers for the Pioneer Japan discs: PILF-2612, PILF-2670, PILF-2542 (Treasures) and PILF-1048 (New TZ vol. 10).
- **Sideshow 12-inch figures:** probably 2002-2003, based on Toymania's Toy Fair 2003 coverage and a 2002-dated listing. Low confidence.
- **Rittenhouse sketch cards:** only one artist found, Cris Bolson (Series 4 Gremlin sketch, case incentive).
- **Apparel:**
  - 80sTees designs ("To Serve Man", "Question the Unknown", "The Fear").
  - Trevco CBS-licensed tees (TRCBS186, TRCBS1562BK).
  - Licensed tees sold at Target and Walmart ("The Masks", "Living Doll", "Monologue").
- **TZ VR:** added developer interviews (Fangoria, DreadXP, Den of Geek, ISPR) and Fun Train's history post.
- **Vintage ads (subtype vintage-ad):**
  - 1959-60 Media History Digital Library (Lantern) pages from Sponsor and Broadcasting.
  - Sponsor-history articles from TVLine, /Film and TV Obscurities.
  - 1983 film pages in Texas A&M's Battalion (June 23, 1983, p. 5) and the Michigan Daily (Bentley Library).
  - All of these are legitimately hosted scans, but none has yet been confirmed to show an actual ad versus a news item.

### Not found or not verifiable (no source, so no row)
- **Legacy Interactive 2014 game:** credits still not found. MobyGames entry 4095 mixes the 2014 game with the Amiga/DOS versions and shows no names.
- **Control, BioShock, Psychonauts, Twisted Metal, Destiny:** no source found that ties any of them to Twilight Zone. BioShock's only link is Ken Levine's Interlude project, which is already a record. Leave these out.
- **Licensed mobile or Facebook games, boxed trivia or party games, escape-room boxes:** none found.
- **Slots:** only IGT's TZ slot exists. No Bally, WMS, Aristocrat or Light & Wonder TZ slot was found.
- **Tower of Terror games:** nothing beyond Clue and the promotional PC game already on the site.
- **Title design:** no designer found for the 2002 UPN opening or for the 1983 movie's titles.
- **Prints and art shows:** no Mondo TZ print confirmed (the 2016 "To Serve Man" giclées were Dark Hall Mansion, not Mondo). No Grey Matter TZ print found. No Crazy 4 Cult TZ piece found.
- **Serling statue:** no source names the sculptor. WSKG, Digital Journal and the RSMF pages don't say. Worth asking the Rod Serling Memorial Foundation directly.
- **Night Gallery auctions:** none found at Heritage, Profiles in History or Julien's; the only sale is the Hakes painting already on the site.
- **Home video:** 1980s CBS/Fox and Columbia House VHS releases are unconfirmed. Library catalog records (TAMU "The twilight zone. Vol. 1-4", UWM film collection, ACMI "The Twilight Zone Volume 1") exist, but I could not open them to check the format and publisher. No US Image Entertainment laserdisc pages were found on LDDB.
- **Merchandise:** no merchandise found for the 1985 or 2019 series, apart from the 2019 DVD and Blu-ray. Also none found:
  - Hallmark ornaments other than 2009. The 2010-2012 Dreambook PDFs came up in search but were not checked.
  - Licensed jigsaw puzzles.
  - Spirit Halloween or Rubie's costumes.
  - Hot Topic, Junk Food or Mad Engine lines.

### Proposed new subcategories
- **script-archive:** annotated scripts and production papers that turn up at auction. They are primary sources.
- **matte-painting:** production art painted for the show.
- **magazine-cover** (from pass 1): TV Guide covers.
- **screen-print** (from pass 1).
- **vintage-ad:** trade-press and newspaper pages.

### Open questions
- Should auction-lot documents (scripts) live under Artwork, Merchandise, or a new "Archives and documents" category?
- Should rows whose source is an eBay listing (the Bolson sketch card, the 2002 Invader date) be kept as low confidence or dropped?
