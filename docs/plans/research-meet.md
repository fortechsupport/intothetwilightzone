# Content plan: Meet (People, Characters, Organizations)

**Date:** 2026-11-24 · **Status:** approved on Adam's behalf overnight. Adam's note (03:23 UTC): "act autonomously for the
next 6 hours, approving things by your best judgement rather than waiting for my approval. Be thorough." Every
choice below is in *Decided here* for him to review in the morning.
**Checklist:** docs/RESEARCH_CHECKLIST.md, Meet
**Follows:** Adam's inclusion rule of 2026-11-23 (include everything with sources), "credit where credit is due", and
the official/unofficial split for organizations.

---

## 1. Where Meet stands today

**People** (3,275 placements on 15 shelves) is deep for the four series' credits. Problems found on 24 November 2026:
- 21 people records have no decision and are hidden, so their episode credits link nowhere.
- *Other people* holds 13 records, seven of them the team that made the 1993 pinball machine with no roles, and set
  decorators and an orchestrator whose roles no rule recognised.
- The checklist's earlier problems (the John Hancock credit, "Gordon Mitchell", the Rebecca Parr and David Carren
  duplicates) are already gone from the records; the *Showrunners* shelf it mentions no longer exists.

**Characters** (817): 69 characters from 2002 and 1985 episodes that had none have no decision and are hidden.

**Organizations** (74): the sponsors, makers and producers named in the site's own records are mostly missing: four
of the original series' sponsors, the 2002 and 2019 production companies, the radio dramas' producer, and the
makers of the licensed masks, figures, prints, pinball and home video.

## 2. Structure

**People** gains one shelf, flagged new: **Game makers** (designers, programmers, artists and sound makers of the
licensed games). Set decorators go to *Crew*, orchestrators to *Composers*. The rest is unchanged.

**Organizations** keeps its shelves. New records go where their kind puts them: sponsors under *Sponsors and
advertisers* (official for the series' own sponsors), production companies and studios under their shelves,
makers of licensed products under *Product licensees*, auction houses under *Other organizations*.

## 3. On every page
People: role, credits linked to episodes and works, a short biography, sources. Organizations: what it did for the
franchise, the records that name it, and sources.

## 4. Media and documents that attach
Interviews, obituaries and profiles attach to the person; advertisements and sponsorship material to the sponsor.

## 5. Cross-links
Each credit links to its episode, film or game; each organization page lists the records that name it.

## 6. Sources
Wikipedia articles on each person and series; the makers' and auction houses' own pages, through the product records
that already cite them.

## 7. Blessing-ready
Every craftsperson is credited by name, including the pinball team and the set decorators who rarely are. Sponsors
and licensees are named as the series' own records name them; nothing is promoted.

## 8. Steps
One pull request: decide the hidden records, roles for the unplaced people, the new shelf, the new organizations.

## 9. Acceptance checks
- Every people, characters and organizations record has a decision.
- *Other people* holds only people whose role fits no shelf.
- Every organization named as sponsor, producer or licensed maker in two or more records has a record.
- CI passes: check:data, tokens, both builds, check:site, check:a11y.

---

## Decided here (Adam reviews later)
- **The 90 hidden records are included:** 18 people credited on episodes (each with a Wikipedia source), the 69
  characters, and three people whose identity is likely but not fully confirmed (Andrew Francis, Patrick R. Norris,
  Paul Shapiro). Their records say so in their sources, and fan votes or a later source can correct them.
- **Game makers** is a new People shelf for the 1993 pinball team: Pat Lawlor, Larry DeMar, Ted Estes (design and
  software), John Youssi (art), John Krutsch (mechanics), Chris Granner and Rich Karstens (music and sound). Each now
  has a role, a credit linked to the game, and a biography from the game's Wikipedia article. Tim Kitzrow, who voiced
  the Serling-style narration, is under *Voice actors*.
- **19 organizations added** from the site's own sourced records: sponsors General Foods, Kimberly-Clark,
  Colgate-Palmolive, Johnson & Johnson and Procter & Gamble; producers Genre Films, CBS Television Studios, Trilogy
  Entertainment and Falcon Picture Group; licensed makers Trick or Treat Studios, Sideshow, Funko, Dark Hall Mansion,
  Zen Studios, Midway Manufacturing, Pioneer LDC and Kino Lorber; and the auction houses Heritage Auctions and Prop
  Store (not official).
- James T. Aubrey (CBS president) and James Comisar (collector) stay under *Other people*.

## Waiting on Adam
- Nothing blocking.

## Found, for later
- **2026-11-24:** every item below now carries a mark (Done, Can't with the reason, Read round, or Adam) in
  docs/plans/finish-open-items-2026-11-24.md, which is the current list.
- **Night Gallery characters and casts:** none recorded; a research round of its own.
- **Radio drama characters** (the original stories): none recorded.
- **One character, several actors** (Philip and the new Philip in "Upgrade") still cannot be shown as one.
- **Organization links to Wikipedia** were not fetched in this pass; each new record cites the series or product
  record's source instead.
- **Entertainment Earth** is named as publisher on five product records but has no record; whether it made or only
  sold those products needs checking first.
- **Stern Pinball** appears only on unlicensed homage tables; no record made.
- **Sponsor shelf wording:** Serling's other sponsors (Kraft, U.S. Steel) show under "Unofficial and inspired", which
  reads oddly for a sponsor; a shelf group such as "Sponsors of Serling's other work" would read better.
