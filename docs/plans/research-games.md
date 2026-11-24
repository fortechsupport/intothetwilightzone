# Content plan: Games

**Date:** 2026-11-24 · **Status:** approved on Adam's behalf overnight. Adam's note (03:23 UTC): "act autonomously for the
next 6 hours, approving things by your best judgement rather than waiting for my approval. Be thorough." Every
choice below is in *Decided here* for him to review in the morning. · **Checklist:** docs/RESEARCH_CHECKLIST.md, Play > Games
**Follows:** decision 0005 (records with sources are included; fan votes flag doubtful ones), decision 0006 (a
likeness is "Compared to", never "Inspired by"), the Serling rule, and "media are never categories".

---

## 1. Where Games stands today

There are 49 game records on five shelves (video games 33, nods in other games 21, pinball/arcade/slots 12, board and
card 4, other 6). Problems:
- **Double placement.** Every nod (Alan Wake's Night Springs, Fallout 3's Tranquility Lane, the Lawlor pinball
  callouts) is on both "Video games" or "Pinball" and "Nods in other games", so the licensed games are buried.
- **Duplicates.** Five pairs describe the same thing: Alan Wake's Night Springs (two records), Fallout 3's
  Tranquility Lane, Red & Ted's Road Show, The Simpsons Pinball Party, and the Willy Wonka achievement.
- **The four digital versions of the 1993 table** (The Pinball Arcade 2013, Pinball FX 2023, Pinball FX VR, AtGames
  Legends) sit under video games as "appearances in other games"; they are the same licensed table.
- **Contradictions inside records:** the 1988 adventure names two different developers; the Pinball FX VR add-on
  gives a 2024 date for a game that launched in April 2025.
- **Known gaps** from the checklist: the 2014 game's credits, the VR table's date, an Atari ST version of the 1988
  game, the Hellbreak card game. **Likely missing:** escape rooms and other licensed experiences.

## 2. Structure: five shelves, official first

| Shelf | What goes on it | Official? |
|---|---|---|
| **Pinball and slot machines** | The 1993 Bally table, its licensed digital versions, the home ROM and the rumoured remake (each marked), and the IGT slot machine. Groups: The 1993 table · Digital versions of the table · Slot machines · Unofficial and unconfirmed. | Licensed, except where marked |
| **Video games** | Licensed computer, console and VR games, released or not: 1988, the unreleased Commodore 64 port, 2014, VR 2022, the Interlude interactive pilot (unmade), the Tower of Terror promotional game. Groups: Released · Unreleased and unmade · Tower of Terror tie-ins. | Licensed |
| **Board, card and party games** | Ideal's 1964 game, the 1958 Boyd proposal, Clue: Tower of Terror, trivia games. | By licence, as stated |
| **Other games and play** | Mini golf and anything that fits nowhere else. | By licence |
| **Nods in other games** *(new)* | Games that reference or borrow from the show, grouped: Video games · Pinball tables · Fan-made games · Name only, link not confirmed. | Unofficial |

A record sits on exactly one shelf. A nod is never also listed as a video game.

## 3. On every page
Type, maker and year; platforms; licence where a source states it; credits linked to People; the episode a nod
refers to, linked; where to play now (official stores only, no affiliate codes); media link-only (trailers, manuals
on archive sites, reviews by named critic). Nods say in plain words what the nod is and who noticed it.

## 4. Media and documents that attach
Reviews, manuals, box art and trailers attach to their game and appear in the Media Library, link-only.

## 5. Cross-links
Makers (Midway, Bally, Zen Studios, IGT, Ideal, First Row) to Organizations; designers (Pat Lawlor and team) to
People; episodes named by nods to the episode pages; Tower of Terror games to the attraction.

## 6. Sources
MobyGames, the Internet Pinball Database, publisher press releases (Zen Studios, IGT, Fun Train), contemporary
reviews, the Internet Archive for manuals. About 20 page reads.

## 7. Blessing-ready
Every licensed game names its licence holder (CBS), maker and credits. Nothing is hosted: no ROMs, no downloads,
no box art copies. The home ROM is described, never linked for download. Fan games are credited to their makers.

## 8. Steps
One pull request: dedupe, re-shelve, verify the contradictions, add what research finds, and screenshots.

## 9. Acceptance checks
- Every game record sits on exactly one shelf; duplicates point to the record they repeat (`duplicate_of`).
- No contradiction left inside a record; each fact has a source.
- Licensed games name the licence where a source states it.
- CI passes: check:data, tokens, both builds, check:site, check:a11y.

---

## Decided here (Adam reviews later)
- The five-shelf structure above, with official shelves first and every nod on one unofficial shelf.
- Duplicates keep their files and point to the fuller record, whose sources absorb theirs.
- The four digital versions of the 1993 table move from Video games to Pinball, as versions of the table.
- The ZX Spectrum "Twilight Zone" stays, under "Name only, link not confirmed".
- Six nods that sat on Video games (Fallout 76, Fallout Tactics, Persona 2: Eternal Punishment, The Simpsons: Tapped
  Out, Twisted Metal 2, The Adventures of Willy Beamish) are now subtype `video-game-homage`, so they sit only under
  Nods. A record's own shelf now comes from its subtype; the old `categories:` lines on game records were removed.
- The Ken Levine Interlude pilot (announced, never made) and the Tower of Terror promotional PC game are marked
  official: CBS itself announced the Interlude pilot, and Disney made the Tower game for its licensed attraction. Shown on Video games under
  "Unreleased and unmade" and "Tower of Terror tie-ins".
- The 1988 adventure keeps both developer names (Covenant Technologies and Gigabit Systems), each with its source,
  and says they disagree, rather than picking one.
- Pinball FX VR's Twilight Zone table: dated 3 April 2025, the day Zen Studios launched Pinball FX VR with it as an
  add-on; the store's later listing date is kept as a note.
- The 2014 game's developer is Spark Plug Games (Metacritic); confidence raised to medium.
- Hellbreak (the 2026 horror card game) is not added: none of the four announcements names The Twilight Zone.
- No Atari ST version of the 1988 game is listed: no source found one.

## Waiting on Adam
- Nothing blocking.

## Found, for later
- **Clue: The Twilight Zone Tower of Terror (2007):** the licence holder (Disney alone, or Disney and CBS) is not
  stated by any source read; the record says only what the sources say.
- **The home ROM (L-9H):** kept as unofficial software by the original programmer; it is described, never linked for
  download. Whether Williams/Planetary Pinball approved it is not sourced.
- **Bloody Disgusting, "CBS enters Twilight Zone series video game"** failed to load; a lead on an unannounced game.
- **For Merchandise (Collect):** Entertainment Earth lists Bif Bang Pow! figures and bobbleheads, Trevco shirts and a
  door-portal decal.
- **For Events (Attend):** CBS's Twilight Zone pop-up at The Grove, Los Angeles (29 March 2019) for the 2019 revival.
- **Escape rooms:** the one known room, Xscapes' "Rod Serling Experience" in Binghamton (2018), is in Places >
  Attractions; it gained the Rod Serling Memorial Foundation's 2019 article as a source. No licensed escape room was
  found in a search on 24 November 2026.
- Duplicates still show in `data/review/taxonomy.json` (the export lists every record); the site hides them.
