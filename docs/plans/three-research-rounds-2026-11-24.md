# Three research rounds: Night Gallery characters, Serling's films, disc releases per show

**Date:** 2026-11-24. **Approved:** Adam asked for every category but Read to be finished; the coordinator passed on
(10:58 UTC) that these three rounds start without waiting, that the References grouping is ours to choose and log,
and that each part merges once checks pass. Follows docs/plans/finish-open-items-2026-11-24.md (the ledger), whose
"Not finished" items these are.

## Steps (one pull request each)

1. **Night Gallery characters, Serling's films, References groups.**
   - A character record for each principal character of every Night Gallery segment: the role and actor from the
     segment summary in Wikipedia's List of Night Gallery episodes, the name from the cast lists of the fan episode
     guide at nightgallery.net (season one, two and three pages, read 2026-11-24). A name is used only when both
     sources name the same actor, so no pairing is guessed.
   - Serling's films: disc releases (`releases:`) from Wikipedia, Blu-ray.com, DVD Talk, DVD Savant, CineSavant,
     DiscDish, High-Def Digest, Mondo Digital and B&S About Movies; posters linked where Wikipedia shows one; trailers
     linked where a rights-respecting page holds one.
   - References on /homages/references/ grouped by evidence.
2. **Disc releases for each show.** *(Done: 150 of 155 shows read, 149 shown, 28 episode rows; the five left are under "Found, for later".)* For each of the 155 shows on /television/: the home video release that holds its
   Twilight Zone-related episode, from the show's Wikipedia article, or a note that none is listed. Read in batches,
   because web reading is limited to 100 pages an hour across this project.
   - Show level: `data/fan/discs.yaml`, keyed by show, shown as "Home video" beside "Where to watch" on the show's page
     and on a show record's page. Episode level: a `releases:` row on the episode record when the article names the
     set holding it, or its season dates settle which season set holds it.

## Acceptance checks
- [x] Every Night Gallery episode record, the pilot and the unaired segments record has at least one character
      (45 of 45; 140 characters, 105 of them new).
- [x] Every new character names its segment, its actor and both sources; none is paired by guesswork.
- [x] Ten Serling films carry disc releases, each with a source; no release date or label without one.
- [x] No poster or trailer is copied; each is a link to the page that shows it.
- [x] /homages/references/ shows the groups "Confirmed by its makers", "Documented" and "Noted by fans", in that order.
- [ ] Each of the 155 shows has a disc release or a "none listed" line (step 2): 150 of 155 read, 149 shown; the rest are under
      "Found, for later".
- [ ] `npm run check:data`, both builds, `check:site`, `tokens -- --check` and `check:a11y` pass; CI green.

## Decided here (Adam reviews later)
- **References are grouped by evidence** (Confirmed by its makers, Documented, Noted by fans), not left as one A-Z
  list. A reader sees at once how well each passing reference is documented, which is what the Legacy intro promises,
  and the filter box still searches across all groups. Records with no evidence mark sit under "Documented"
  (their default in the schema).
- **Night Gallery: principal characters only.** A record for each character Wikipedia's summary describes (one to
  three per segment), not for every bartender and policeman in the cast lists. Minor roles stay in the cast lists
  linked from each character's sources.
- **Role names kept as the credits give them.** Where the credits name a character only by role ("The Phantom",
  "The Vampire"), the record uses that role, with the segment in brackets when two segments share it.
- **nightgallery.net as a source for names.** It is a fan site; its cast lists match Wikipedia's actors in every
  segment checked, and it is credited on every record that uses it.
- **Posters: linked, not hosted.** No poster designer is named for any Serling film except Phantom of the Paradise
  (John Alvin, per Wikipedia). Each poster link names the distributor as rights holder.
- **Saddle the Wind's DVD date** (26 August 2008) is kept from the earlier reading of DVD Savant's review header; a
  second reading of the page did not show the header.

- **Disc and tape releases live beside "Where to watch"** (labelled "Home video", as it includes VHS), not in a new section: a visitor looking for how to see a show finds
  streaming and discs together. Each line names Wikipedia as its source and the date it was read.
- **Only what the page text says.** Reading tools summarise the far end of a long page; a claim that came only from
  such a summary was not used. Long pages were read again from a later point so the home media section came through
  word for word.
- **"None listed" says whose list.** A show with no release reads "Wikipedia's article lists no home video release",
  not "never released", unless the article itself says it was never released, lost or wiped.
- **Episode rows only when settled.** An episode gets a release row only when the article names its set or the
  season dates leave one answer ("worked out from the air date" in the row's note). Where a year spans two seasons,
  the episode has no row and the show's line gives the complete set.

## Waiting on Adam
- Nothing new. (Q8, the 52 unconfirmed songs and the radio casts stay on the ledger's list.)

## Found, for later
- **Night Gallery segments with no paired character** (Wikipedia names no actor beside a role): "A Death in the
  Family", "Witches' Feast", "The Diary", "An Act of Chivalry", "The Different Ones", "The Funeral", "The Tune in Dan's
  Café", "You Can't Get Help Like That Anymore", "Little Girl Lost", "Satisfaction Guaranteed" and "Room for One Less".
  The nightgallery.net cast lists name their characters; a second source pairing role and actor would let us add them.
- **Spellings that differ between sources:** existing records "Dr. Ravadon" (nightgallery.net: Dr. Archibald Ravdon),
  "Steven Macy" (Stephen Macy) and "Randolph Lane" (Randy Lane). Left as they are until a third source settles them.
- **Trailers:** TCM's trailer page for Saddle the Wind refuses automated reading; The Yellow Canary's trailer survives
  as a 35mm print (UCLA screening listing) and is not online. No official trailer was found online for Patterns, The
  Rack, Assault on a Queen, The Man or The Salamander (the Salamander Blu-ray carries one).
- **Home video not found:** The Man (1972; a forum asks for a DVD), The Yellow Canary, Incident in an Alley, Carol for
  Another Christmas (Wikipedia gives a 2016 DVD date with no source or label), A Storm in Summer and Certain Honorable
  Men. Umbrella's Australian Blu-ray of Requiem for a Heavyweight is listed with no date.
- **In Search of...:** a summary of the article's unread part says the 2012 complete DVD set includes "two Rod
  Serling specials"; not used until the page text itself is read.
- **Disc releases not yet found** (step 2): The Simpsons (the main article names no set; its season
  DVDs need the episode-list pages), Futurama (the same), WandaVision (no home media section found in three reads),
  The Catholic Hour (the article read was not the 1956 television series) and Tales of the Unusual (the link is the
  film). Also open: QI's "Future" record is dated 2009 while Wikipedia dates Series F to 2008; Wikipedia's main
  Saturday Night Live article points to a separate list of DVD releases; Seinfeld, Gilmore Girls, Frasier and
  others have episodes whose air year spans two seasons, so they carry the show's line but no episode row.
- **Records to check:** the Ichabod and Me record should be the episode "The Celebrity" (20 March 1962); Muppets
  Tonight's "William Shatner episode" is a Shatner cameo in the Whoopi Goldberg episode (7 July 1996); Suspense's
  article cites the DVD "An Evening in the Zone" (S'More Entertainment, 2009) without saying it holds the episode;
  Tales of the Unusual's Wikipedia link is the 2000 film, not the series; Lights Out (on Television) opens the radio
  series' record, which has no Where to watch box, so its disc line (from the 1949-1952 NBC television article: none
  listed, episodes survive as kinescopes) is held in discs.yaml but not shown; a record for the television version
  would show it.
- **Heavy page:** /people/characters/ is 323 KB with the 105 new Night Gallery characters (target 300 KB; the limit
  is 1.5 MB).
- **Big shows with their own home video lists** (The Simpsons, Futurama, Saturday Night Live, Star Trek): their
  "List of ... home video releases" pages would give an episode-by-episode answer.
