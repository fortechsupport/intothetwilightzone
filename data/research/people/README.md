# People and characters research notes (2026-11-20 overnight pass)

What this pass added, and what still needs a human or a later pass. Records themselves carry
`research_confidence` (high / medium / low) and sources; this file keeps the working notes:
names that could not be identified (so no record was written), facts to double-check, and leads.

Known limits of this pass: the shared web-fetch budget ran out repeatedly, so many bios and
dates rest on prior knowledge rather than a fetched page, and many Wikipedia person URLs were
written from known article titles rather than checked one by one. Confidence is set accordingly.


---

## Source report: report-pchunk-1

### Report: pchunk-1 people records

**Written:** 252 new files in src/content/people/. All of them parse as YAML and have name, bio, roles, relevance, sources, research_confidence and last_verified. Confidence: about 70 high, about 145 medium, about 37 low.
**Already existed (skipped):** stephen-king.

## Not written: 48 names I could not identify with confidence, or knew too little about to write a useful record
- **Writers, crew or authors I could not confirm:** cal-willingham, ed-waters, john-w-bloch, milton-s-gelman, rebecca-swanson, robin-love, rebecca-parr, katrina-cabrera-ortega, peter-oberth, andrew-guest, patrick-r-norris, lee-polk
- **Obscure cast whose identity I could not confirm:** andrew-johnston, artine-tony-browne, dan-frishman, jack-aranson, john-mcmurtry, jonathan-potts, keith-knight, marc-vahanian, mavis-neal, morgan-farley, than-wyenn, monie-ellis, robert-yuro, ron-stein, pat-ohara, janine-gray, carlos-ramirez, virginia-morris, kimmy-garrett, steven-perry, zibby-allen, brandon-eels, carol-kearny, lindsay-ridgeway, john-crawford, larry-blake, linden-chiles, lou-frizzell, rayford-barnes, robert-karnes, andrew-francis
- **Cast whose role I could not confirm:**
  - virginia-williams: a common name, and I could not confirm which actress did the radio role.
  - michael-fox: I could not tell which actor named Michael Fox is in "A Message from Charity".
  - pat-obrien: it is unclear whether the sportscaster appears as himself.
- **gordon-mitchell:** one slug covers two people. The actor in "The Purple Testament" is probably the bodybuilder actor; the writer of "Take My Life...Please!" is almost certainly a different person. The credits need splitting.
- **mickey-keating:** written, then deleted, because I could not verify any source URL.

## Doubtful facts and flags
- **robert-collins and robert-l-collins:** same person (the Television Academy page names "Robert Collins" as creator of Police Woman). I wrote both, tagging robert-collins `same-person-as-robert-l-collins`.
- **lou-holz:** taken to be the comedian Lou Holtz, credited with the idea for "A Short Drink...". I did not confirm this. Tagged `credit-spelling`.
- **thalmus-rasulala:** was credited as Jack Crowder in 1964.
- **john-williams:** this is the English actor, not the composer. Tagged `disambiguation`.
- **ernest-truex:** I added a tz_credit for "What You Need" (as Pedott). The episode record's cast leaves him out, so that record may need him added.
- **ralph-senensky:** died in 2025 at 102; I don't have the exact date.
- **Low-confidence records:** orangey-the-cat (his appearance in "Night of the Meek" is unconfirmed), adele-t-strassfield (the "only woman writer" claim), tananarive-due (I could not confirm whether she shares the writing credit), william-m-lee, r-l-thomas (taken to be Ralph L. Thomas), sigmund-neufeld (taken to be Sigmund Neufeld Jr.).
- **Unconfirmed Wikipedia URLs:** a few disambiguated titles were written from memory and not checked: Adam_Williams_(actor), Patrick_O'Neal_(actor), Paul_Rodriguez_(actor), Michael_Dunn_(actor), Scott_Wilson_(actor), Robert_Butler_(director), David_Butler_(director), Tom_McGrath_(animator) (this one did appear in search results), Jonathan_Jackson_(actor), The_Rack_(1956_film), Tower_of_Terror_(1997_film), Somewhere_in_Time_(film), Contact_(1997_American_film). Where a person's page title was doubtful I cited the episode-list page instead.
- **Research limits:** the shared WebSearch budget ran out partway through, so the later batches rest on my own knowledge. Search results returned links only, no text.

## Schema needs
- An `aliases` field on people, so that one record can match several credit spellings (Robert Collins / Robert L. Collins, Lou Holz / Lou Holtz, Jack Crowder / Thalmus Rasulala).
- A way to mark non-human performers (Robby the Robot, Orangey). For now they are tagged `non-human`.

---

## Source report: report-pchunk-2

### Report: pchunk-2 people records

**Written: 250 new files** in `src/content/people/`. All 250 pass YAML validation. Confidence: 175 high, 75 medium, none low. No tz_credits were added.

## Not written (49 names)
- **Duplicates of existing records:** "Rod Serling (host/narrator)" and "Rod Serling (host)" are credit strings on radio/zero-hour-radio-rod-serling and radio/fantasy-park. `rod-serling` already exists, so those credit strings should be changed to "Rod Serling".
- **Already exists, name doesn't match:** `h-m-wynant.yaml` was already there with name "H. M. Wynant", but the credit string is "H.M. Wynant", so they don't link up. One of the two needs changing.
- **Two credit strings, one slug:** I wrote `alan-crosland-jr` with the name "Alan Crosland Jr.". Three 1959 episode records spell it "Alan Crosland, Jr." (ring-a-ding-girl, the-old-man-in-the-cave, the-parallel). Those should be changed to match.
- **Couldn't identify them well enough for a substantive bio (search snippets were empty, and the shared search budget ran out):** Gene Coogan, Paul Tucker, Alonso Alvarez-Barreda, Barry Higgins, Catherine Ferrar, Chip Duncan, Eddie Marr, Glynis Davies, John Peter Kousakis, Jonathan Whitesell, Larry Musser, Les Crutchfield, Patrick O'Moore, Seth Weisburst, Steve DiMarco, Steve Carruthers, Adrianna Bertola, Allison McKay, Bryce Maritano, Carolyn Kearney, Charlie Largent, Frank Hotchkiss, Garrie Bateson, Géza Kovács, James Head, Joan Huntington, John Novak, Jonathan Stone, Patricia Sterling, Paul Shapiro, Robert Pratt, Tom Pedi, Willard Peugh, Cathleen Cordell, Leon Benson, David Carren, Deidre Hudson, Dick Nelson, Ellen Weston, Larry J. Blake, Martin Lavut, Michael Kopsa, Otta Hanus, William Selby.
- **Unsure which person it is:** Doug McGrath (Twilight Zone: The Movie, "Time Out"). It may be the writer-director Douglas McGrath or another actor of that name. James Houghton (Last Rites of Jeff Myrtlebank) is either the actor-writer or the theatre producer.

## Doubtful points to check
- Most medium-confidence Wikipedia URLs could not be checked one by one (Wikipedia can't be reached from this container, and searches returned only titles). Lisa Schrage, Mari Morrow, Ken Sagoes, Eugene Clark (actor), Alf Humphreys and Ned Bellamy were confirmed.
- I couldn't confirm a Wikipedia article for the Twilight Zone stage play, so Richard Jones's sources are the Hollywood Reporter and WhatsOnStage reviews instead.
- Some character names in the medium-confidence records come from memory: John A. Alonzo as Luis Gallegos, Walter Burke as Joe Mizell, Nico Minardos as Manuel, Leonard Strong as the hitch-hiker, Barry Sullivan in "Eyes", and Murray Matheson as Mr. Agee.
- Theodore J. Flicker has a cast credit on "Hell's Bells" in the records. That isn't stated in his bio.
- Murray Matheson's bio mentions his original-series role (the Clown in "Five Characters in Search of an Exit"), but no episode record carries that credit. It could go in tz_credits, or be added to the episode's cast.
- Dates I wasn't sure of are left out or given as the year only.

## Schema needs
- A person needs an `aliases` field, or the episode records' credit strings need cleaning, so that variant spellings ("Alan Crosland, Jr.", "H.M. Wynant", "Rod Serling (host)") link to one person.

---

## Source report: report-pchunk-3

### pchunk-3 people report

**Written: 271 new files** in src/content/people/ (all 299 unique slugs in the chunk were processed; none existed beforehand). All 271 parse as YAML, every `name` matches its credit string exactly, and every record has at least one source URL. 

Confidence: about 170 high, about 95 medium, 4 low (Roger Jacquet, Cindy Bridges, David Rawlins, Lizzy Connolly).

## Skipped (28)
- **Could not identify the person or confirm a source (27):** Amir Mann, Ceil Cabot, David Fresco, Dusty Kay, Hank Brandt, Joseph Perry, Marvin Petal, Nancy Lawrence, Robert F. Lyons, Les Enloe, Lisabeth Hush, Kenneth Gilbert, Ralph Phillips, Richard Krzemien, Tom Stern, Tim Armstrong (2019 "8"; which Tim Armstrong is unclear), Daniel Wolowicz, Cindy Harrell, Duncan McNeil, Jennifer Griffin, Jack Collins, John Alderson, Peggy Feury, Richard O'Brien (Night Gallery 1971; this is not the Rocky Horror writer, and I could not confirm who it is), Samantha Esteban, Vern Gillum, John Furia, Jr. (I am fairly sure who he is, but the search budget ran out before I could confirm a source URL).
- **Robert Serling:** this credit, on films/rod-serling-submitted-for-your-approval, is the same person as the existing people/robert-j-serling.yaml. I did not create a duplicate. Fix it with an alias, or by changing the credit to "Robert J. Serling".

## Data issues
- **J.D. Feigelson / J. D. Feigelson:** both spellings share the slug j-d-feigelson. The file uses the name "J.D. Feigelson", so his director credits, spelled "J. D. Feigelson", will not link until the credit spelling is made consistent.
- **Pseudonyms:** alan-smithee (direction attributed to Gilbert Cates) and josh-rogan (Melissa Mathison) are recorded as pseudonym records. Both are medium confidence.
- **New tz_credit:** I added only one. Philip DeGuere Jr. gets "executive producer" of the 1985 series, with ref series/1985.

## Facts to verify
- Tim O'Connor as Colonel Sloane in "On Thursday We Leave for Home".
- René Auberjonois's character name in "Camera Obscura".
- David Rawlins as the editor of Saturday Night Fever.
- Ann Blyth's death is given as '2026-06' (news reports say she died at 98).
- Allen Baron's death date was left out because I could not confirm it.
- A few dates are year-only.
- Wikipedia URLs for some lesser-known names (for example Christina Choe, Eugene Robert Glazer, Lally Cadeau, Page Fletcher, Hedley Mattingly) come from my own knowledge, not from search results.

## Process notes
- The web search budget (shared across the turn) ran out near the end of the chunk.
- No schema changes are needed. Some roles are free-text values (stuntman, journalist, comedian, singer, musician, bandleader), which the current schema accepts.

---

## Source report: report-pchunk-4

### Report: pchunk-4 people records

**Written: 288 of 300** new files in src/content/people/. Every file parses as YAML. No existing file was overwritten or edited, and no tz_credits were added.
- Confidence: about 150 high, 100 medium, 35 low. The low ones are thin records for obscure writers and bit-part actors, kept to the facts of their credits.
- Each record links to the relevant Wikipedia episode list (1959, 1985, Night Gallery, 2002, 2019 or radio) as a backstop source.

## Skipped (12)
- **Stacy Keach (host/narrator)**: stacy-keach.yaml already exists. The radio series record should credit "Stacy Keach" instead of this name.
- **Could not identify, or know nothing beyond the credit:** Tina Hermensen, Jamie Brown (radio "Nick of Time"), Mark Russell ("Black Leather Jackets"), Calvin Brown ("I Am the Night—Color Me Black"), Mark Taylor ("Profile in Silver"), Jim Purdy (director, "20/20 Vision"), Edward Redlich (writer, "Private Channel"), Hardy Rawls, Dennis Rucker, Laurie Prange, Zachary Ansley.

## Doubtful facts / data issues
- **john-hancock**: written for the director John D. Hancock. The cast credit on 1985 "The Convict's Piano" is probably a different man, the actor John Hancock (1941-1992). The record needs splitting or the credit renaming.
- **robert-garland**: the record for Twilight Zone: The Movie lists him as a writer, but he has no on-screen segment credit. His bio says so.
- **Unconfirmed claims:**
  - Joseph Ruskin as the voice of the Kanamit
  - Chuck Hicks in "Ninety Years Without Slumbering"
  - Morgan Brittany in "Nightmare as a Child"
  - Stacy Keach Sr. in "Wong's Lost and Found Emporium"
  - Justus Addiss directing "The Odyssey of Flight 33"
  - Paul Comi in "People Are Alike All Over"
- **Death dates left out where unsure:** Paul Dooley, H. M. Wynant, Geoffrey Horne, Annette McCarthy, Gus Trikonis.
- **Wikipedia person URLs** were not checked by machine: the Wikipedia API and WebFetch were blocked by the proxy. About 15 were confirmed in search results. Low-confidence pages that may need a check include Rick_Friedberg, Robert_Hamner, Jerrold_Freedman, Sutton_Roley, Jack_Grinnage, Cotter_Smith, Joseph_Whipp, Julie_Khaner, Russ_Conway_(actor) and Johnny_Brown_(actor).
- **Web searches ran out** before the last batch (69 names, Cesare Danova to Zachary Ansley), so those bios rely on prior knowledge only.

## Schema needs
- People could use an `aliases` field. Logan Swanson and Lewis Padgett are pseudonyms (Logan Swanson for Richard Matheson; Lewis Padgett for Kuttner and Moore), and a credit named "Stacy Keach (host/narrator)" could then link to the existing Stacy Keach record.

---

## Source report: report-pchunk-5

### Report: pchunk-5 people records

**Written: 271 of 300** new files in src/content/people/. Every file passes yaml.safe_load, has at least one source, and has relevance, research_confidence and last_verified '2026-11-20'. No existing files were overwritten, and no tz_credits were added (every credit is already carried by an episode or film record). One media item was added: the Television Academy "Remembering Bruce Bilson" page.

The web search budget for the turn ran out near the end, so some Wikipedia article titles were not checked (see below).

## Skipped (29): could not be identified, or a record would be too thin
- **Little-documented cast:** Abbie Hern, Alexandra Barreto, Dave Morick, David Macklin, Ed Call, Elisa Cook, James Davidson, Journey Laird, Paul Jenkins, Peter LaCroix, Eric Freeman, Ricky Powell, Wendy Worthington, Zak Santiago, James Metropole, Aaron Pearl, Eric Keenleyside, Lee Jay Lambert, Todd Williams
- **Little-documented writers and directors:** Jeff Stuart, Steven Aspis, Anne Collins, Joe Gannon, Stephen Beck, Eli Richbourg, Terry Matz, Virginia Aldridge
- **Robert Hunter** ("Devil's Alphabet" writer): I could not confirm whether this is the Grateful Dead lyricist.
- **Robert Walden** ("20/20 Vision" writer): I could not confirm whether this is the Lou Grant actor.

## Doubtful facts and items to check
- **Tom Palmer:** the actor in "The Lateness of the Hour" (1960) and the writer of "Extra Innings" (1988) are probably two different people. The record says so and may need to be split.
- **Johnson Smith:** reported to be a pseudonym of George Clayton Johnson, but this is unconfirmed (low confidence, tagged pseudonym).
- **Ryszard Bugajski:** the site's record for the 1985 "Night of the Meek" credits him as director. That looks wrong (I believe Martha Coolidge directed it), so the 1985 episode record should be checked. The bio names only his third-season segments.
- **Michael Bell** (Night Gallery, "Green Fingers"): I think this is the voice actor, but it is unconfirmed (low confidence).
- **Dates not confirmed by search:** exact death dates were left out for some people (for example Bruce Bilson, given only as '2025', and Eric Till, Pippa Scott and Stanford Whitmore, who have no death date). Anthony Lawrence and Ed Adamson have years only.
- **Wikipedia titles not checked:** I removed two that I doubted (Arthur Gray, Jack Lambert). These are still in place and are likely correct but unchecked: Jerry_Finnerman, Michael_Wilson_(writer), Marsha_Hunt_(actress,_born_1917), Harold_D._Schuster, Robert_Hogan_(actor), Jon_Korkes, Gail_Kobe, Aaron_Moorhead.
- **Low confidence** (thin but accurate, as far as I know): Wallace Rooney, Chris Hubbell, Doug Jackson, Shelley Levinson, Clyde Hayes, Richard De Roy, Michael D. Rosenthal, Ed Adamson, and three of the stage-play cast (Neil Haigh, Oliver Alvin-Wilson, Franc Ashman).

## Schema notes
- **Zamba** (a trained lion) has the role "animal performer" and the tag "animal". The site may want a separate kind for non-human performers.
- **Ben Stiller and Matt Reeves** are tagged in-development, for the unproduced Warner Bros. Twilight Zone feature.

---

## Source report: report-1959-actors

### 1959 missing actors: report

**Written: 48 people records** in src/content/people/. Each one has
tz_credits per episode (`actor (as <character>)`, ref = episode id), relevance core, tag 1959-series, and sources: the
actor's Wikipedia article (title confirmed in search results), the episode's Wikipedia article, and the 1959 guest-star list.
All files pass YAML validation; existence was checked right before each write (opened with mode 'x').

Confidence: high 14, medium 25, low 9 (Will Kuluva, Kelton Garwood, Curt Conway, Laura Devon, Leon Belasco, Pamela Austin,
Terry Becker, Kate Murtagh, Paul Newlan, Mary Webster). Low/medium records omit birth/death dates I could not confirm.

## Limits hit
- The shared WebFetch budget was used up after 1 fetch (Jacqueline deWit). WebSearch returned titles and URLs only, no
  snippets. So searches only confirmed which Wikipedia article titles exist. Bios and dates come from my own knowledge.
  Dates on medium records are worth checking against Wikipedia when fetches are available again.
- About 13 WebSearch calls used.

## Doubtful facts to check
- Kevin Hagen: I added a second tz_credit for "Elegy" as Capt. James Webber. The Elegy record's cast has only Kellaway and
  Morrow. I'm fairly sure he was in it, but I could not confirm the character name.
- Patricia Smith as Debbie Reynolds's sister on The Debbie Reynolds Show; Tod Andrews in Mister Roberts after Fonda;
  Kelton Garwood's later name, Jonathan Harper; Terry Becker's later directing and producing; Pamela Austin in Kissin' Cousins.
- William Reynolds (b. 1931): no death date given. He may have died around 2022. Unverified.
- Pamela Austin: no Wikipedia URL was confirmed, so the record cites the episode and the guest-star list only.

## Skipped (29)
- **Maggie Mahoney**: this is Margaret Field (Wikipedia's Maggie_Mahoney redirects to Margaret_Field). She already has
  people/margaret-field.yaml and is in the-new-exhibit cast. characters/emma-senescu.yaml lists played_by "Maggie Mahoney";
  it should probably be changed to "Margaret Field". I did not edit it.
- **Fredrick Beir**: the Wikipedia article is "Fred Beir". I know too little about him to write a record.
- **Wikipedia article exists, but I know too little to write a solid bio:** Edgar Stehli, Than Wyenn (he is also in Night
  Gallery "The Doll"), George Keymas, June Dayton, Suzanne Lloyd, Robin Hughes, Elen Willard, Robert Foulk.
- **Could not identify or no information:** Dana Dillaway, Michael Montgomery, Ben Erway, Dody Heath, Miranda Jones,
  Joseph Bernard, Austin Green, Clark Allen, Alma Platt, Edmund Vargas, Helen Brown, David Bond, Billy Beck, Bob Mitchell,
  Mary Munday, John Bolt, Georgia Simmons, Kim Hector.
- H.M. Wynant: skipped as instructed. He was not in the JSON anyway.

## Schema note
Many 1959 episode cast lists hold only 2-3 names, so supporting actors' credits now live in people tz_credits. Adding these
actors to the episode cast lists would make that duplication unnecessary.

---

## Source report: report-characters-1959

### Characters: The Twilight Zone (1959-64)

**Written:** 468 new files in `src/content/characters/`, covering all 156 episodes in `episodes/1959/` (1 to 6 per episode). All files parse with yaml.safe_load. No existing file was overwritten. 184 character files from other threads were already in the folder, and none of my slugs collided with them.

- Confidence: 434 high, 34 medium. Kinds: 386 human, 36 supernatural, 17 object, 13 alien, 9 robot, 4 animal, 3 other.
- Every file has `tags: [new]`, `relevance: core` and `last_verified: '2026-11-20'`. Sources are the episode's Wikipedia article plus its IMDb page, both taken from the episode record's ids/links.
- I fixed the truncated Wikipedia links in the episode records for Eye of the Beholder, A Game of Pool, Mr. Dingle, Nightmare at 20,000 Feet and Probe 7. Shadow Play and The Encounter have no Wikipedia URL (I could not confirm the title), so they cite IMDb only.
- Slugs: a name that could repeat across episodes ("The Woman", "Mr. Death", "Maggie", "Sykes", "The aliens" and so on) gets the episode slug appended, e.g. `mr-death-one-for-the-angels`.

## How names were checked
Character names and actors for about 75 episodes were checked against the cast lists on their Wikipedia articles (WebFetch). This corrected several things I had from memory: Colbey and Koch in I Am the Night, Ross and Avery in Will the Real Martian, Throckmorton and Marvin in A Piano in the House, and Langsford and McClusky in The 7th Is Made Up of Phantoms. The shared WebFetch budget (100 per hour) ran out near the end. WebSearch returns only titles, so it was little help with names. The remaining main characters come from my own knowledge and are well documented. Supporting roles I could not confirm are marked medium, and about 55 thin or doubtful minor characters were dropped rather than guessed.

## Records that recur across series
These carry remake ids and actors, as the task asked:
- Anthony Fremont: 2002/its-still-a-good-life (Bill Mumy) and films/twilight-zone-the-movie (Jeremy Licht)
- Agnes Fremont: 2002 (Cloris Leachman)
- Janet Tyler: 2002/eye-of-the-beholder (Molly Sims)
- Henry Corwin: 1985/night-of-the-meek (Richard Mulligan)
- Mr. Dundee: 1985/night-of-the-meek (William Atherton)
- Jesse Cardiff: 1985/a-game-of-pool (Esai Morales)
- James Howard "Fats" Brown: 1985 (Maury Chaykin)
- Adam Grant: 1985/shadow-play (Peter Coyote)
- The Gremlin: the film (Larry Cedar)
- Robby the Robot: Uncle Simon and The Brain Center at Whipple's

**Overlap to resolve:** another thread has already written separate remake records: anthony-fremont-2002, anthony-1983, agnes-fremont-2002, janet-tyler-2002, henry-corwin-1985, mr-dundee-1985, jesse-cardiff-1985, fats-brown-1985, adam-grant-1985 and the-gremlin-1983. Each of those remake actors is now linked to two records for the same role. Keep either the remake ids on the 1959 records or the separate remake records, not both. Marsha White is not linked to 1985, because the 1985 remake renamed her Marsha Cole (marsha-cole.yaml).

## Doubtful facts or spellings
- H.M. Wynant: I used the episode cast spelling. The people file has "H. M. Wynant", so the name strings do not match.
- Nightmare as a Child: Markie is credited to Terry Burnham (medium). The episode cast lists Morgan Brittany, who I believe played Helen as a child in a flashback. This needs checking.
- Lt. Fitzgerald's first name (William) and Terry Decker's full name are from memory.
- Robert Sloan (Walking Distance) and Charlie Farnsworth (Maple Street): the surnames are from memory, marked medium.
- The Kanamit: the voice is often credited to Joseph Ruskin, but I left him out of played_by.
- The wax murderers (The New Exhibit) list the five actors from Wikipedia's cast list.

## Actors in played_by with no people file and not in that episode's cast list
These were checked against `src/content/people` at write time. Format: actor -> episode id -> character.

- Dana Dillaway -> 1959/one-for-the-angels -> Maggie
- Doug McClure -> 1959/mr-denton-on-doomsday -> Pete Grant
- Jerome Cowan -> 1959/the-sixteen-millimeter-shrine -> Jerry Hearndan
- Michael Montgomery -> 1959/walking-distance -> Young Martin Sloan
- Jacqueline deWit -> 1959/time-enough-at-last -> Helen Bemis
- Suzanne Lloyd -> 1959/perchance-to-dream -> Maya
- James Franciscus -> 1959/judgment-night -> Lt. Mueller
- Phillip Pine -> 1959/the-four-of-us-are-dying -> Virgil Sterig
- William Reynolds -> 1959/the-purple-testament -> Lt. Fitzgerald
- Ben Erway -> 1959/the-monsters-are-due-on-maple-street -> Pete Van Horn
- Edgar Stehli -> 1959/long-live-walter-jameson -> Samuel Kittridge
- Dody Heath -> 1959/long-live-walter-jameson -> Susanna Kittridge
- Than Wyenn -> 1959/execution -> Paul Johnson
- Terry Burnham -> 1959/nightmare-as-a-child -> Markie
- Howard Smith -> 1959/a-stop-at-willoughby -> Oliver Misrell
- Mary Webster -> 1959/a-passage-for-trumpet -> Nan
- Abraham Sofaer -> 1959/the-mighty-casey -> Dr. Stillman
- Robin Hughes -> 1959/the-howling-man -> The Howling Man
- George Keymas -> 1959/eye-of-the-beholder -> The Leader
- Irene Tedrow -> 1959/the-lateness-of-the-hour -> Mrs. Loren
- June Dayton -> 1959/a-penny-for-your-thoughts -> Helen Turner
- Carmen Mathews -> 1959/static -> Vinnie Broun
- Lili Darvas -> 1959/long-distance-call -> Grandma Bayles
- Patricia Smith -> 1959/long-distance-call -> Sylvia Bayles
- Miranda Jones -> 1959/a-hundred-yards-over-the-rim -> Martha Horn
- Joseph Bernard -> 1959/the-shelter -> Marty Weiss
- Austin Green -> 1959/the-passersby -> Abraham Lincoln
- Will Kuluva -> 1959/the-mirror -> Father Tomás
- Elen Willard -> 1959/the-grave -> Ione Sykes
- Alice Frost -> 1959/its-a-good-life -> Aunt Amy
- Kelton Garwood -> 1959/five-characters-in-search-of-an-exit -> The Hobo
- Clark Allen -> 1959/five-characters-in-search-of-an-exit -> The Bagpiper
- Trevor Bardette -> 1959/one-more-pallbearer -> Colonel Hawthorne
- Robert Foulk -> 1959/the-hunt -> The Gatekeeper
- Russell Collins -> 1959/kick-the-can -> Ben Conroy
- Philip Coolidge -> 1959/a-piano-in-the-house -> Throckmorton
- Edgar Buchanan -> 1959/the-last-rites-of-jeff-myrtlebank -> Doc Bolton
- Nancy Kulp -> 1959/the-fugitive -> Mrs. Gann
- Alma Platt -> 1959/the-trade-ins -> Marie Holt
- Edmund Vargas -> 1959/the-gift -> Pedro
- Helen Brown -> 1959/young-mans-fancy -> Henrietta Walker
- Ludwig Donath -> 1959/hes-alive -> Ernst Ganz
- Curt Conway -> 1959/hes-alive -> Adolf Hitler
- Ann Jillian -> 1959/mute -> Ilse Nielsen
- Irene Dailey -> 1959/mute -> Miss Frank
- Fredrick Beir -> 1959/death-ship -> Mike Carter
- Laura Devon -> 1959/jess-belle -> Ellwyn Glover
- Claire Griswold -> 1959/miniature -> Alice
- Barbara Barrie -> 1959/miniature -> Myra
- Robert F. Simon -> 1959/no-time-like-the-past -> Harvey
- Maggie Mahoney -> 1959/the-new-exhibit -> Emma Senescu
- Will Kuluva -> 1959/the-new-exhibit -> Ernest Ferguson
- David Bond -> 1959/the-new-exhibit -> The wax murderers
- Billy Beck -> 1959/the-new-exhibit -> The wax murderers
- Bob Mitchell -> 1959/the-new-exhibit -> The wax murderers
- Nick Cravat -> 1959/nightmare-at-20-000-feet -> The Gremlin
- Leon Belasco -> 1959/a-kind-of-a-stopwatch -> Potts
- Harold Gould -> 1959/probe-7-over-and-out -> General Larrabee
- Randy Boone -> 1959/the-7th-is-made-up-of-phantoms -> Pvt. Michael McClusky
- Walter Brooke -> 1959/a-short-drink-from-a-certain-fountain -> Dr. Raymond Gordon
- James T. Callahan -> 1959/ninety-years-without-slumbering -> Doug Kirk
- Mary Munday -> 1959/ring-a-ding-girl -> Hildy Powell
- Kevin Hagen -> 1959/you-drive -> Pete Radcliff
- Pamela Austin -> 1959/number-12-looks-just-like-you -> Valerie
- Sue Randall -> 1959/from-agnes-with-love -> Millie
- Celia Lovsky -> 1959/queen-of-the-nile -> Viola Draper
- Virginia Gregg -> 1959/the-masks -> Emily Harper
- Brooke Hayward -> 1959/the-masks -> Paula Harper
- Alan Sues -> 1959/the-masks -> Wilfred Harper Jr.
- Terry Becker -> 1959/i-am-the-nightcolor-me-black -> Jagger
- Kate Murtagh -> 1959/mr-garrity-and-the-graves -> Zelda Gooberman
- Paul Newlan -> 1959/the-brain-center-at-whipples -> Walter Hanley
- Ted de Corsia -> 1959/the-brain-center-at-whipples -> Dickerson
- John Bolt -> 1959/come-wander-with-me -> Billy Rayford
- Georgia Simmons -> 1959/the-bewitchin-pool -> Aunt T
- Tod Andrews -> 1959/the-bewitchin-pool -> Gil Sharewood
- Kim Hector -> 1959/the-bewitchin-pool -> Whitt

## Schema notes
- The `kind` enum has no value for a dummy, doll or mannequin that seems alive. I used object (dolls, wax figures), supernatural (Willie, Caesar, Talky Tina) and other (Miss Keevers). A value such as `doll` or `puppet` may be worth adding.
- One character played by different actors at different ages (Pip, Janet Tyler, Young Martin Sloan) cannot be marked as such, because played_by is a flat list.

---

## Source report: report-characters-revivals-fans

### Report: revival/film/Night Gallery characters + new people subcategories (updated after round 2)

## Task A: characters (src/content/characters/, 280 files written by this agent, all tagged new)
- 1985: 180 records covering 109 of 110 segments (only "The Convict's Piano" missing, as no source with character names was reachable).
- 2019: 40 records covering all 20 episodes.
- 2002: 14 records covering 11 of 43 episodes.
- Twilight Zone: The Movie: 11 records. Night Gallery: 35 records (relevance 'related').
- Round 2 added 96 characters, built mostly from per-segment Wikipedia articles read through a Wikipedia mirror. The article URL is cited in each record's sources.
- Remake/clash slugs: anthony-fremont-2002, agnes-fremont-2002, janet-tyler-2002, henry-corwin-1985, mr-dundee-1985, adam-grant-1985, jesse-cardiff-1985, fats-brown-1985, anthony-1983, helen-foley-1983, uncle-walt-1983, the-gremlin-1983, kanamits-2019, death-2002-one-night-at-mercy, death-1985-rendezvous-in-a-dark-place.
- **2002 gap (32 episodes):** no reachable source pairs 2002 actors with character names. The Wikipedia series summaries, Rotten Tomatoes, scifi-movies.com and the Fandom wiki pages are thin, and the shared WebFetch budget was repeatedly exhausted. I did not guess names. Episodes: another-life, burned, chosen, cold-fusion, dead-mans-eyes, developing, dream-lover, evergreen, fair-warning, found-and-lost, future-trade, harsh-mistress, homecoming, hunted, into-the-light, last-lap, memphis, night-route, rewind, sanctuary, shades-of-guilt, sunrise, tagged, the-collection, the-monsters-are-on-maple-street, the-path, the-pharaohs-curse, the-placebo-effect, the-pool-guy, time-lapse, to-protect-and-serve, upgrade.
- Doubtful facts worth checking: Kyle Montgomery, Amanda Strickland, Marsha Cole (1986), Sophie Gilson, Janet Warren, Eve Martin, Michelle Weaver, Andrea Collins, Detective Reece and Keith (The Who of You; actor-to-role mapping inferred from cast order), and the 1989 "A Game of Pool" ending.
- played_by actors that are not in the episode's cast list (episode cast lists may be incomplete or wrong; e.g. 1985/the-trunk lists Alf Humphreys but Wikipedia credits Bud Cort as the lead): Kerry Noonan (1985/a-message-from-charity), Basil Hoffman (1985/button-button), Frederick Long (1985/gramma), Anne Twomey (1985/her-pilgrim-soul), James Whitmore Jr. (1985/nightcrawlers), Jenny Agutter (1985/the-last-defender-of-camelot), Norman Lloyd (1985/the-last-defender-of-camelot), Jeff Calhoun (1985/the-shadow-man), David Greenlee (1985/the-toys-of-caliban), Paul Sand (1985/time-and-teresa-golowitz), Liliana Mumy (2002/its-still-a-good-life), Doug Jones (2019/blurryman), Jonathan Caliri (1985/welcome-to-winfield), Jenny Agutter (1985/voices-in-the-earth), Pete Kowanko (1985/song-of-the-younger-world), Karen Austin (1985/a-matter-of-minutes), Jefferson White (2019/six-degrees-of-freedom), Bud Cort (1985/the-trunk), Robert Prescott (1985/the-elevator), James Whitmore Jr. (1985/the-girl-i-married)
- **Episode data problems found (not edited):**
  - 1985/button-button links.wikipedia is truncated to `https://en.wikipedia.org/wiki/Butto`. My records cite https://en.wikipedia.org/wiki/Button,_Button instead.
  - 1985/a-message-from-charity credits "Duncan McNeil"; the actor is Robert Duncan McNeill. I kept the episode spelling in played_by and did not write a person record.

### Actors still without people records (actor -> episode -> character)
- Abbie Hern -> 2019/among-the-untrodden -> Madison
- Bud Cort -> 1985/the-trunk -> Willy Gardner
- Duncan McNeil -> 1985/a-message-from-charity -> Peter Wood
- Frederick Long -> 1985/gramma -> Gramma
- Jeff Calhoun -> 1985/the-shadow-man -> The Shadow Man
- Jefferson White -> 2019/six-degrees-of-freedom -> Jerry Pierson
- Jonathan Caliri -> 1985/welcome-to-winfield -> Matt Winnaker
- Laurie Prange -> films/night-gallery-s2e07 -> Brenda
- Pete Kowanko -> 1985/song-of-the-younger-world -> Tanner Smith
- Robert Prescott -> 1985/the-elevator -> Roger
(Not written because I could not identify them confidently or the credit is misspelled.)

## Task B: people (src/content/people/)
Round 1 (24, tagged with the subcategory + new):
- Scholars & historians: martin-grams-jr, gordon-f-sander, joel-engel, nicholas-parisi, douglas-brode, stewart-t-stanyard, arlen-schumer, jean-marc-lofficier, randy-lofficier, amy-boyle-johnston (low), mark-dawidziak, scott-skelton, jim-benson, peter-wolfe, koren-shadmi.
- Fans & champions: stephen-king (core), guillermo-del-toro.
- Inspired creators: leslie-stevens, joseph-stefano, george-a-romero, richard-p-rubinstein.
- Family & friends of Rod Serling: samuel-serling, esther-serling (low), helen-foley.

Round 2 (12 actors from the missing list, tagged new, with tz_credits where the episode cast lacks them):
- anne-twomey, basil-hoffman, david-greenlee, doug-jones, james-whitmore-jr (Nightcrawlers + The Girl I Married), karen-austin, kerry-noonan, liliana-mumy, pat-obrien, paul-sand, bud-cort, jefferson-white.
- Most of the earlier 38 "missing" actors were written meanwhile by other agents (the people collection grew from 274 to 1700+ files).

Skipped for lack of documented evidence: J.J. Abrams, Damon Lindelof, Vince Gilligan, M. Night Shyamalan, Rian Johnson, Bryan Fuller, R.L. Stine, Reece Shearsmith and Steve Pemberton (fan-noted only), Bill DeVoe, Don Presnell, Marty McGee, and the "keepers of the flame" (no verifiable individuals). No media[] was added, because nothing could be verified with search exhausted.

## Schema notes
- People roles added: designer, critic, teacher, illustrator, translator, broadcaster.
