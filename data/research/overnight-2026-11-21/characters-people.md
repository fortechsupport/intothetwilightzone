# Characters and people: research notes (2026-11-21 overnight pass)

## Characters
69 new character records. Every episode of all four series now has at least one character
(32 episodes of the 2002 series and 1985 "The Convict's Piano" were missing).

- 2002 actor/character pairs: scifi-movies.com season page; roles from the Wikipedia 2002 series article; twist details from TV Tropes (cited where used). "The Convict's Piano": Wikipedia (via a mirror) and TVmaze. The Fandom wiki refused every fetch.
- Confidence: 34 high, 35 medium.
- Episodes with only the lead character (no reachable source described the supporting roles): Burned, Developing, Evergreen, Harsh Mistress, Into the Light, Night Route, Tagged, Time Lapse.
- Supporting characters named in cast lists but skipped for lack of a role description: Kate Graham (Burned); Logan, Ed, Joyce, Mr. Brooks (Evergreen); Adam (Night Route); Adelaide (Memphis); the agent who takes Zack's body (Time Lapse); "Jack" in Future Trade (TV Tropes name; the cast list gives Dean Winters as "Mr. Gordon").
- Spelling choices: "Martin Donner" (aka "Martin Donnor"); "Anne MacIntosh" (aka "Annie"); "Nicki Aycox" (scifi-movies has "Nicki Lynn Aycox"); "Scott Crane" surname from TV Tropes only.

## Episode cast additions
Confirmed actors missing from episode cast lists were appended (source added on each episode):
Tom O'Brien and Cristen Kauffman (The Convict's Piano); Angela Featherstone; Andrew Moxham, Kim Hawthorne; Paul Perri;
Devon Gummersall; Robbie Holloway; Scott Heindl; Greg Serano; Efosa Otuomagie; Ben Bass; Nicki Aycox; Sarah Carter;
Ashley Edner; Kristi Angus, Peter Williams; Lindy Booth; Mackenzie Gray; Dion Johnstone, Gabrielle Miller; Laara Sadiq.

Not changed, to check:
- 2002/to-protect-and-serve credits "Samantha Esteban", but both sources name Samantha Becker as Carla Arroyo. Possibly the same actress.
  Same episode: "Artine Tony Browne" appears as "Artine Brown" on scifi-movies.
- 2002/time-lapse: scifi-movies spells "Alexandra Berreto"; the record's "Barreto" is probably right.
- 1985/if-she-dies: Wikipedia credits "David Bennett Carren"; the record has "David Carren".
- "Rebecca Parr Cioffi" (The Beacon, But Can She Type?) vs "Rebecca Parr" (Cold Reading): likely one person.
- people/john-hancock is director John D. Hancock, so the "John Hancock" who plays Dr. Puckett in "The Convict's Piano" links to the wrong man. Needs a separate record.
- "Gordon Mitchell" (actor, 1959 "The Purple Testament") and "Gordon Mitchell (writer)" (1985 "Take My Life...Please!") are already distinct credit strings; neither has a people record. Unconfirmed that the actor is the bodybuilder Gordon Mitchell (Charles Pendleton).

## People
5 new records: linden-chiles, rayford-barnes, andrew-guest (high); martin-lavut, paul-shapiro (medium).
Only Wikipedia article pages could be fetched (TMDB, Fandom and Wikipedia search/API refused), and search returned
titles without text, so identifying each person cost one fetch.

Leads for a later pass: John Furia, Jr.; Vern Gillum; Otta Hanus; Kenneth Gilbert; Robert Hunter (is the "Devil's Alphabet"
teleplay writer the Grateful Dead lyricist?); Robert Walden ("20/20 Vision" writer the actor?); Lee Polk; Marvin Petal;
Alonso Alvarez-Barreda; Peter Oberth; Michael Kopsa (Canadian actor 1956-2022, very likely, TZ credit unconfirmed);
Patrick R. Norris (likely costume designer turned director). Cast: Eric Keenleyside, John Novak, Aaron Pearl,
Andrew Francis, Jennifer Griffin, Jonathan Potts, Todd Williams, Zak Santiago, Larry J. Blake, Carolyn Kearney, Gene Coogan.

## Schema need
A way to say one character is played by different actors at different ages or versions (Philip / New Philip in
"Upgrade", young Sean in "Found and Lost").

## Round 2

**16 new people records.** Each one was confirmed by fetching the person's Wikipedia article, and each name matches the episode credit string exactly.

High confidence: the article's filmography names the Twilight Zone episode and the role.
- angela-featherstone: Kate Graham, "Burned"
- nicki-aycox: "Sanctuary"
- greg-serano: Marco Flores, "Last Lap"
- sarah-carter: Amber, "Sunrise"
- lindy-booth: Shannon, "The Pharaoh's Curse"
- gabrielle-miller: Angela Perry, "To Protect and Serve"
- kristi-angus: Holly, "The Monsters Are on Maple Street"
- kim-hawthorne: Muriel, "Chosen"
- alexandra-barreto: Maria Hernandez, "Time Lapse"
- eric-keenleyside: Bartender, 1989 "Love Is Blind"
- ben-bass: Trevor Black. The article does not name the episode.
- zak-santiago: Cheto, "The Pool Guy"
- todd-williams: Marcus Fisher, "Tagged"
- john-furia-jr: name "John Furia, Jr."; the article lists The Twilight Zone among his credits.

Medium confidence: the article lists The Twilight Zone among the person's credits, but does not name the episode.
- patrick-r-norris: name "Patrick R. Norris"; Wikipedia article "Patrick Norris"
- andrew-francis

Overrides: scratchpad/overrides-people-2.yaml.

**Spelling note.** Nicki Aycox's Wikipedia article spells her Sanctuary character "Ricki". characters/rikki-sanctuary uses "Rikki", following scifi-movies. One source of the two is wrong, and I did not change the record.

**Checked but not written, because the article does not mention The Twilight Zone:**
- Mackenzie Gray (Canadian actor, b. 1957)
- Devon Gummersall
- John Novak (actor)
- Larry J. Blake (1914-1982)
- Michael Kopsa (round 1)
- Robert Hunter (Grateful Dead lyricist): no television writing is mentioned, so whether he wrote "Devil's Alphabet" remains unconfirmed.
- Robert Walden (Lou Grant actor): no writing credits are mentioned, so whether he wrote "20/20 Vision" remains unconfirmed.
- John Hancock (actor, 1941-1992, https://en.wikipedia.org/wiki/John_Hancock_(actor)): the article does not list "The Convict's Piano". I did not write john-hancock-actor. The identity is plausible, and he had a long run of authority-figure roles in the 1980s. If it is confirmed later, the credit string "John Hancock" on 1985/the-convicts-piano and on characters/dr-puckett will need to change to match the new record.

**Gordon Mitchell.** The Wikipedia article on "The Purple Testament" does not list him in its cast. I wrote no record. His credit on the 1959 episode record has no source I could find.

**No Wikipedia article found:**
- Dion Johnstone
- Laara Sadiq

**Not reached:**
- Vern Gillum
- Otta Hanus
- Kenneth Gilbert
- Lee Polk
- Marvin Petal
- Alonso Alvarez-Barreda
- Peter Oberth
- Aaron Pearl (no Wikipedia title in search results)
- Jennifer Griffin
- Jonathan Potts
- Carolyn Kearney
- Gene Coogan

Budget used: 24 WebFetch calls, about 14 WebSearch calls. The YAML check passes, and `npm run check:data` reports no findings.
