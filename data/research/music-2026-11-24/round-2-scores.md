# Music research round 2: who scored each episode, score releases, Night Gallery, Serling on record (2026-11-24)

Plan: docs/plans/research-music.md (approved by Adam 2026-11-24, Q1 to Q6 as suggested). This round covers Q4 and part of Q5.
Fetch use: about 25 page reads. The main source needed no fetching: Bill Wrobel's paper "The Twilight Zone" (score rundowns and cue sheets, Film Score Rundowns, 2010, revised 5 May 2018). It is a 95-page PDF in Adam's site archive (IntoTheTwilightZone.com.zip, Essays folder), written from the scores in the CBS Collection at UCLA. Its closing note allows copying and quoting for non-profit purposes as long as the source and copyright are kept, so the records cite it by author and title.

## New field: episode music (Q4)
Episodes gain an optional `music` block (src/content.config.ts, docs/CONTENT_SCHEMA.md) with these fields:
- `score`: `original`, `stock`, or `original-and-stock`.
- `composers[]`: the original score's composers.
- `library_composers[]`: only where a sourced cue sheet names them.
- `note`.
- `sources[]`: at least one.

The structure step will show it as a "Music" line on the episode page.

### Original scores (27)
| Composer | Episodes | Sources |
|---|---|---|
| Bernard Herrmann | Where Is Everybody?, Walking Distance, The Lonely, Eye of the Beholder, Little Girl Lost, Living Doll, Ninety Years Without Slumbering | Varèse LPs vol. 2 and 1, Silva 40th disc 1, Varèse/McNeely 1999 (Qobuz), Wrobel |
| Jerry Goldsmith | Back There, The Big Tall Wish, The Invaders, Dust, Nervous Man in a Four Dollar Room | Varèse LPs vol. 1 to 5, Silva disc 2, Wrobel |
| Nathan Van Cleave | Perchance to Dream, Elegy, Two, I Sing the Body Electric, A World of Difference | Varèse LPs, Silva disc 3 |
| Fred Steiner | A Hundred Yards Over the Rim, King Nine Will Not Return, The Passersby | Varèse LPs, Silva disc 4, Wrobel |
| Nathan Scott | A Stop at Willoughby | Varèse vol. 2, Silva disc 3 |
| Leonard Rosenman | And When the Sky Was Opened | Varèse vol. 3, Silva disc 4 |
| Jeff Alexander | The Trouble with Templeton | Varèse vol. 5, Silva disc 4 |
| Franz Waxman | The Sixteen-Millimeter Shrine | Varèse vol. 1, Silva disc 4 |
| Tommy Morgan | Hocus-Pocus and Frisby | Wrobel (score dated 30 March 1962) |
| René Garriguenc | Passage on the Lady Anne | Wrobel (written 19 April 1963) |
| Morton Stevens | The Beacon (1985 series) | Wrobel |

### Stock (library) music (7)
- A World of His Own and The Rip Van Winkle Caper: full cue sheets in Wrobel, with the library composers named.
  - A World of His Own uses Herrmann's 1939 radio cue "Monday Morning" three times.
  - The Rip Van Winkle Caper is built mostly from Herrmann's "Moat Farm Murder" cues.
- The Hitch-Hiker: the cue sheet uses Herrmann's "Hitch Hiker" cues (CBS library 8-56-D-1) many times among other library cues. It is recorded as stock with Herrmann first; Silva puts it on its Herrmann disc.
- One for the Angels, Third from the Sun, Judgment Night and The Old Man in the Cave: Wrobel says they had no original score. He printed their cue sheets in an earlier paper that we don't have.

## Score releases
- Varèse Sarabande's Original Television Scores LPs, volumes 1, 2, 4 and 5 (STV 81171, 81178, 81192, 81205; 1983 to 1985), now carry their track lists, with composers, read from 45worlds. Volume 3 (STV 81185) was not re-read this round.
- Already on record and confirmed this round:
  - Silva Screen's 40th Anniversary Collection (4 CDs, 19 October 1999): disc 1 Herrmann, disc 2 Goldsmith, discs 3 and 4 the other composers. Reviewed by Filmtracks (written 4 November 1999, revised 21 October 2007) and Soundtrack.net (4.5 of 5).
  - Varèse's 1999 Herrmann re-recording conducted by Joel McNeely (Abbey Road, September 1999; liner notes Christopher Husted; cover paintings Matthew Joseph Peak).
  - Varèse CD VCD 47233 (25 October 1990).
- Where to listen (Q5): only the McNeely release has a licensed streaming page (Qobuz). The older LPs have no official streaming page that we found, so they keep their catalogue links.

## Night Gallery
- Themes: Classic TV Themes (classicthemes.com) confirms all three: Billy Goldenberg for the 1969 pilot, Gil Mellé for 1970 to 1972, and Eddie E. Sauter for 1972 to 1973. It is added as a second source to each, and the Sauter record had only one source before.
- Goldenberg's pilot score has never been released on record, according to Daniel Kremer's ConFluence Film Blog (July 2010).
- Dragon's Domain's Gil Mellé Collection, Volume 1 (DDR841) has no Night Gallery tracks, although its notes mention his Night Gallery work.
- No per-episode Night Gallery composer list could be read: the blog that lists them redirected to a host this session may not open.

## Rod Serling on record
- Nothing found. Discogs refused automated reading, and searches turned up no spoken-word or narration album by Serling.
- The Rod Serling Dictabelt Collection at UCLA (308 dictabelts, digitised 2019) and the story of Westbrook Van Voorhis, the pilot's first narrator, are already on record.
- Shelf B's "Rod Serling on record" group stays hidden, as the plan allows.

## Leads for later
- The cue sheets in Martin Grams Jr.'s The Twilight Zone: Unlocking the Door to a Television Classic ("As Timeless as Infinity", per Wrobel's link) would cover the other stock-music episodes.
- Wrobel's earlier paper "The CBS Collection 072 UCLA" has the cue sheets for the four episodes above.
- The Herrmann episode records works/herrmann-jess-belle-score and works/herrmann-living-doll-score are still unverified. Living Doll is now sourced at episode level through the McNeely release.
- Devil's Tune: Ethnic Music from the Twilight Zone (library-music compilation): not yet looked up.
