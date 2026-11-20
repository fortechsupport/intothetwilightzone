#!/usr/bin/env python3
"""Generate places / events / lectures records for IntoTheTwilightZone.com (overnight research pass 2026-11-20).

Each record carries its own assessment (connection, tier + why, recommendation + why), written to
data/review/assessment-overrides.yaml so the review sheet shows a reason for every record.
"""
import sys
from pathlib import Path
import yaml

ROOT = Path(sys.argv[1])
C = ROOT / "src" / "content"
TODAY = "2026-11-20"

def wp(title, slug):
    return {"title": f"Wikipedia: {title}", "url": f"https://en.wikipedia.org/wiki/{slug}"}

REC = []  # (collection, id, data, assessment)

def add(coll, rid, data, conn, tier, tier_why, rec, rec_why):
    data.setdefault("last_verified", TODAY)
    data["locked"] = True
    REC.append((coll, rid, data, {"connection": conn, "tier": tier, "tier_reason": tier_why,
                                   "recommendation": rec, "reason": rec_why}))

# ------------------------------------------------------------------ IN-STORY PLACES
def place(rid, name, appears, notes, sources, conn, tier="core", rec="include", why=None, conf="high",
          region=None, country=None, aka=None, extra=None):
    d = {"name": name, "kind": "in-story"}
    if aka: d["aka"] = aka
    if region: d["region"] = region
    if country: d["country"] = country
    d["filmed"] = [{"ref": r, "note": n} for r, n in appears]
    eps = [r for r, _ in appears if r[:4].isdigit()]
    if eps: d["episodes"] = eps
    d["notes"] = notes
    d["sources"] = sources
    d["research_confidence"] = conf
    d["relevance"] = tier
    if extra: d.update(extra)
    add("locations", rid, d, conn, tier,
        "A setting inside a Twilight Zone story." if tier == "core" else "A setting inside a related Serling or franchise story.",
        rec, why or "Fictional places are how fans remember episodes; an in-story gazetteer is a natural browse path for the site.")

place("the-twilight-zone-dimension", "The Twilight Zone (the dimension itself)",
      [("series/1959", "Named and described in Serling's opening narrations from the first season on."),
       ("series/1985", "Kept as the frame of the revival's openings."),
       ("series/2002", "Forest Whitaker's narrations keep the conceit."),
       ("series/2019", "Jordan Peele's narrations keep the conceit.")],
      "The show's one constant setting is not a town but a state of being: Serling's narrations describe a dimension "
      "\"beyond that which is known to man,\" lying between light and shadow, science and superstition. Ordinary people "
      "cross into it without noticing, which is why so many episodes begin in a diner, an office or a living room. The "
      "phrase entered everyday English as shorthand for any eerie or unreal situation.",
      [wp("The Twilight Zone", "The_Twilight_Zone"), wp("The Twilight Zone (1959 TV series)", "The_Twilight_Zone_(1959_TV_series)")],
      "The title place of the whole franchise.", why="The anchor record for the in-story places section; every other setting is a corner of it.")

place("willoughby", "Willoughby",
      [("1959/a-stop-at-willoughby", "The 1888 village Gart Williams sees from his commuter train and finally steps into.")],
      "A peaceful, sunlit village of July 1888, with a bandstand, fishing boys and an unhurried pace, that an overworked New "
      "York advertising man glimpses each night when his train stops at a station that should not exist. The final shot "
      "reveals \"Willoughby & Son\" as the name of the funeral home that collects his body, turning the dream town into a "
      "metaphor for escape through death. \"Willoughby\" became fan shorthand for longing for a simpler past.",
      [wp("A Stop at Willoughby", "A_Stop_at_Willoughby")],
      "The best-known fictional town of the original series, from Serling's own script.")

place("peaksville-ohio", "Peaksville, Ohio",
      [("1959/its-a-good-life", "The isolated town ruled by six-year-old Anthony Fremont."),
       ("2002/its-still-a-good-life", "The 2003 sequel returns to Peaksville decades later."),
       ("films/twilight-zone-the-movie", "Joe Dante's segment remakes Anthony's story but moves it to a new setting.")],
      "A farming town Anthony Fremont has cut off from the rest of the world, perhaps destroyed the rest of it, and keeps "
      "in terror; residents must \"think happy thoughts\" or be wished into the cornfield. The story comes from Jerome "
      "Bixby's 1953 short story; Serling's narration names the town and its location. Bill Mumy returned as the adult "
      "Anthony when the 2002 revival went back to Peaksville.",
      [wp("It's a Good Life (The Twilight Zone)", "It%27s_a_Good_Life_(The_Twilight_Zone)"), wp("It's Still a Good Life", "It%27s_Still_a_Good_Life")],
      "Setting of one of the most famous episodes and its official sequel.")

place("the-cornfield", "The cornfield",
      [("1959/its-a-good-life", "Where Anthony sends anyone who displeases him."),
       ("2002/its-still-a-good-life", "Referenced again in the sequel.")],
      "Never shown in full, the cornfield outside Peaksville is where Anthony \"wishes\" people, animals and things he "
      "dislikes; no one comes back. \"Wished into the cornfield\" is a widely quoted phrase and was echoed by The "
      "Simpsons' first Treehouse of Horror parody.",
      [wp("It's a Good Life (The Twilight Zone)", "It%27s_a_Good_Life_(The_Twilight_Zone)")],
      "A named destination inside the Peaksville story that became a catchphrase.", conf="high")

place("maple-street", "Maple Street",
      [("1959/the-monsters-are-due-on-maple-street", "A suburban street that turns on itself after a power failure."),
       ("2002/the-monsters-are-on-maple-street", "The 2003 remake updates the paranoia to terrorism.")],
      "An ordinary late-summer suburban street whose residents, after a mysterious blackout and a rumour of invaders, "
      "accuse and finally attack one another; aliens watching from a hill note that people are their own best weapon. "
      "Serling's closing narration makes Maple Street a stand-in for any community that gives in to fear. The episode is "
      "widely taught in American schools.",
      [wp("The Monsters Are Due on Maple Street", "The_Monsters_Are_Due_on_Maple_Street")],
      "Setting of the most-taught Twilight Zone episode and its 2002-series remake.")

place("homewood", "Homewood",
      [("1959/walking-distance", "Martin Sloan's hometown, where he walks back into his own childhood summer.")],
      "The small hometown that a burned-out 36-year-old executive reaches on foot from a gas station and finds unchanged "
      "from his boyhood: the drugstore, the bandstand concert and the carousel in the park. Serling said the episode was "
      "partly autobiographical, and fans link Homewood's park and carousel to Recreation Park in Binghamton, New York.",
      [wp("Walking Distance", "Walking_Distance"), {"title": "Elliot Becker remembers Rod the teacher (Rod Serling Memorial Foundation)", "url": "https://rodserling.com/elliot-becker-remembers-rod-the-teacher"}],
      "Martin Sloan's hometown, a stand-in for Serling's own Binghamton.",
      extra={"notes_link": None} if False else None)

place("busy-bee-cafe-ridgeview-ohio", "Busy Bee Cafe, Ridgeview, Ohio",
      [("1959/nick-of-time", "The diner with the penny fortune-telling machine.")],
      "A small-town diner where honeymooners Don and Pat Carter wait while their car is repaired on the way to New York "
      "City. Don becomes hooked on the \"Mystic Seer,\" a bobble-headed napkin-holder fortune machine on their booth. The "
      "machine survives as a replica collectible and the diner as a recognisable Shatner-era image.",
      [wp("Nick of Time (The Twilight Zone)", "Nick_of_Time_(The_Twilight_Zone)")],
      "Setting of Richard Matheson's \"Nick of Time.\"")

place("hi-way-cafe", "Hi-Way Café",
      [("1959/will-the-real-martian-please-stand-up", "The roadside diner where bus passengers are stranded on a snowy night.")],
      "A roadside diner near a washed-out bridge where state troopers, a bus driver and seven passengers (one too many) "
      "wait out a storm. Each traveller is suspected of being a Martian; the counterman Haley turns out to be a Venusian "
      "with a third eye.",
      [wp("Will the Real Martian Please Stand Up?", "Will_the_Real_Martian_Please_Stand_Up%3F")],
      "Setting of a classic Serling whodunit episode.")

place("cliffordville-indiana", "Cliffordville, Indiana",
      [("1959/of-late-i-think-of-cliffordville", "The hometown William Feathersmith buys his way back to, as it was in 1910.")],
      "A small Indiana town that a ruthless 75-year-old tycoon revisits as a young man, with his modern knowledge, after a "
      "deal with a female devil. He finds that knowing the future is useless without the know-how to build it and ends up "
      "a janitor in his own company.",
      [wp("Of Late I Think of Cliffordville", "Of_Late_I_Think_of_Cliffordville")],
      "Setting of a fourth-season Serling script.", conf="medium")

place("sunnyvale-rest", "Sunnyvale Rest",
      [("1959/kick-the-can", "The retirement home where Charles Whitley persuades residents to play a children's game."),
       ("films/twilight-zone-the-movie", "Steven Spielberg's segment remakes the story in a retirement home.")],
      "A home for the aged whose residents, led by Charles Whitley, recover their childhood by playing kick-the-can on the "
      "lawn at night, while sceptical Ben Conroy stays old. The idea returned as Spielberg's segment of Twilight Zone: The "
      "Movie (1983).",
      [wp("Kick the Can (The Twilight Zone)", "Kick_the_Can_(The_Twilight_Zone)")],
      "Setting of George Clayton Johnson's episode and its 1983 film remake.", conf="medium")

place("peaceful-valley-new-mexico", "Peaceful Valley, New Mexico",
      [("1959/valley-of-the-shadow", "The hidden town that guards alien technology.")],
      "A quiet desert town that a reporter stumbles into after a wrong turn. Its people secretly hold technology left by a "
      "visitor from another planet, and they cannot let him leave. One of the fourth-season hour-long episodes, written by "
      "Charles Beaumont.",
      [wp("Valley of the Shadow (The Twilight Zone)", "Valley_of_the_Shadow_(The_Twilight_Zone)")],
      "Setting of a fourth-season hour episode.")

place("happiness-arizona", "Happiness, Arizona",
      [("1959/mr-garrity-and-the-graves", "A recently renamed frontier town of about 1890 with a Boot Hill cemetery.")],
      "A western town where a travelling con man claims he can raise the dead from Boot Hill, then takes payment from the "
      "townsfolk to leave their relatives buried. A comic fifth-season episode written by Serling from a Mike Korologos story.",
      [wp("Mr. Garrity and the Graves", "Mr._Garrity_and_the_Graves")],
      "Setting of a fifth-season western comedy episode.")

place("rock-spring-school", "Rock Spring School",
      [("1959/the-changing-of-the-guard", "The New England boys' school where Professor Ellis Fowler has taught for decades.")],
      "A snowbound boys' preparatory school where an elderly teacher (Donald Pleasence), forced to retire at Christmas, is "
      "visited by the ghosts of former pupils who died in war and public service and learns how his teaching shaped them.",
      [wp("The Changing of the Guard", "The_Changing_of_the_Guard")],
      "Setting of a third-season Serling Christmas episode.", conf="medium")

place("centerville-stopover", "Centerville (the toy town)",
      [("1959/stopover-in-a-quiet-town", "The silent town Bob and Millie Frazier wake up in.")],
      "After a party near Riverdale, a couple wakes in an empty, oddly artificial town called Centerville where the trees "
      "are props and the trains loop back. The last shot shows a giant child picking them up: they are pets in an alien "
      "girl's model village.",
      [wp("Stopover in a Quiet Town", "Stopover_in_a_Quiet_Town")],
      "Setting of a fifth-season episode with a famous final reveal.")

place("upstate-new-york-bus-depot", "The bus depot in upstate New York",
      [("1959/mirror-image", "The waiting room where Millicent Barnes meets her double.")],
      "An isolated bus station where Millicent Barnes waits for the bus to Cortland and keeps finding her suitcase moved "
      "and her double in the restroom mirror. Fellow traveller Paul Grinstead is from Binghamton and is bound for Syracuse; "
      "the place names are Serling nods to his home region.",
      [wp("Mirror Image (The Twilight Zone)", "Mirror_Image_(The_Twilight_Zone)")],
      "Setting of an episode whose local place names point to Serling's Southern Tier roots.")

place("happy-glades", "Happy Glades",
      [("1959/elegy", "The asteroid cemetery where three astronauts find a frozen Earth town.")],
      "Three stranded astronauts land on an asteroid that looks like an American town in which every person stands frozen "
      "in place. The caretaker, Jeremy Wickwire, explains that it is Happy Glades, a cemetery where the dead are posed "
      "doing what they loved, and he soon makes the visitors his newest exhibits.",
      [wp("Elegy (The Twilight Zone)", "Elegy_(The_Twilight_Zone)")],
      "Setting of a first-season Charles Beaumont episode.", conf="medium")

place("v9-gamma", "V9-Gamma",
      [("1959/on-thursday-we-leave-for-home", "The scorched planet where a colony waits 30 years for rescue.")],
      "A planet with two suns and no night, where a stranded colony has survived for three decades under Captain William "
      "Benteen. When rescue arrives he cannot give up his authority and ends up alone on the planet.",
      [wp("On Thursday We Leave for Home", "On_Thursday_We_Leave_for_Home")],
      "Setting of a fourth-season Serling hour episode.", conf="medium")

place("ss-queen-of-glasgow", "S.S. Queen of Glasgow",
      [("1959/judgment-night", "The British freighter sunk by a U-boat in 1942, over and over.")],
      "A British cargo ship crossing the Atlantic in 1942, on which a passenger who cannot remember how he came aboard "
      "dreads the attack he senses is coming. He is the U-boat commander who sank her, condemned to relive the sinking "
      "as a victim.",
      [wp("Judgment Night (The Twilight Zone)", "Judgment_Night_(The_Twilight_Zone)")],
      "Setting of a first-season Serling episode.", conf="medium")

place("castle-of-the-brothers-of-truth", "The castle of the Brothers of Truth",
      [("1959/the-howling-man", "The Central European monastery where a monk keeps the Devil locked up.")],
      "An ancient castle in Central Europe, just after the First World War, where a monastic order holds a howling "
      "prisoner behind a door barred with the Staff of Truth. Their guest frees him and learns too late that he has "
      "released the Devil.",
      [wp("The Howling Man", "The_Howling_Man")],
      "Setting of Charles Beaumont's \"The Howling Man.\"", conf="medium")

place("the-ninth-floor", "The ninth floor (\"The After Hours\")",
      [("1959/the-after-hours", "The department-store floor that does not exist, where Marsha White buys a thimble."),
       ("1985/the-after-hours", "Remade for the 1985 revival.")],
      "An elevator takes shopper Marsha White to an empty ninth floor of a department store that, she is told, has no "
      "ninth floor. She is a mannequin who forgot what she was during her month among people. The episode gave its title to "
      "a 2025 episode of Severance.",
      [wp("The After Hours", "The_After_Hours")],
      "Setting of a first-season Serling episode and its 1985 remake.")

place("the-nice-place", "The \"nice place\" (\"A Nice Place to Visit\")",
      [("1959/a-nice-place-to-visit", "The afterlife that gives a dead crook everything he wants.")],
      "After petty thief Rocky Valentine is shot, his guide Pip gives him a luxurious apartment, winning streaks and "
      "admiring women. Endless success bores him, and when he asks to go to \"the other place\" he learns he is already "
      "there.",
      [wp("A Nice Place to Visit", "A_Nice_Place_to_Visit")],
      "Setting of one of the series' most-quoted twists.")

place("mars-zoo-people-are-alike", "The Martian zoo (\"People Are Alike All Over\")",
      [("1959/people-are-alike-all-over", "The replica Earth house where astronaut Sam Conrad is put on display.")],
      "After crash-landing on Mars, Sam Conrad is welcomed by friendly Martians who give him a comfortable Earth-style "
      "house. It has no windows and the door will not open: it is a zoo exhibit labelled with his species \"in his native "
      "habitat.\"",
      [wp("People Are Alike All Over", "People_Are_Alike_All_Over")],
      "Setting of a first-season episode adapted from Paul W. Fairman.", conf="medium")

place("global-airlines-flight-33", "Global Airlines Flight 33",
      [("1959/the-odyssey-of-flight-33", "The airliner lost in time over Manhattan.")],
      "A transatlantic jet that hits a freak tailwind and finds itself over a prehistoric Manhattan (a dinosaur in the "
      "grass) and then over the New York of 1939, with the World's Fair below, as the crew tries to get back to its own "
      "time.",
      [wp("The Odyssey of Flight 33", "The_Odyssey_of_Flight_33")],
      "Setting of a second-season Serling episode.", conf="medium")

place("fords-theatre-back-there", "Ford's Theatre, April 14, 1865 (\"Back There\")",
      [("1959/back-there", "A man from 1961 tries to stop Lincoln's assassination.")],
      "A real place used as a story setting: after an argument about time travel at his Washington club, Peter Corrigan "
      "finds himself in 1865 and tries in vain to warn people at Ford's Theatre. The real theatre is a National Historic "
      "Site in Washington, D.C.",
      [wp("Back There", "Back_There")],
      "A real historic place as Serling imagined it in an episode.", conf="medium")

place("dachau-deaths-head-revisited", "Dachau (\"Deaths-Head Revisited\")",
      [("1959/deaths-head-revisited", "A former SS captain returns to the camp and is tried by the ghosts of its prisoners.")],
      "Serling set this episode in the ruins of the real Nazi concentration camp near Munich, which he described in his "
      "closing narration as a place that must stand as a reminder. The memorial site at Dachau is now visited by about 800,000 "
      "people a year.",
      [wp("Deaths-Head Revisited", "Deaths-Head_Revisited")],
      "A real historic site that Serling used to argue for remembrance.", conf="medium")

place("room-22-morgue", "Room 22 (\"Twenty Two\")",
      [("1959/twenty-two", "The hospital morgue a dancer dreams of each night.")],
      "A recovering dancer is told each night by a nurse, \"Room for one more, honey,\" at the door of the hospital morgue, "
      "Room 22. She later refuses to board Flight 22 because the stewardess says the same words, and the plane explodes. "
      "The story is based on a well-known ghost anecdote.",
      [wp("Twenty Two (The Twilight Zone)", "Twenty_Two_(The_Twilight_Zone)")],
      "Setting of a second-season videotaped episode.", conf="medium")

place("the-cylinder-five-characters", "The cylinder (\"Five Characters in Search of an Exit\")",
      [("1959/five-characters-in-search-of-an-exit", "The doll-collection barrel in which five figures try to escape.")],
      "A smooth-walled, open-topped cylinder holding an army major, a clown, a ballerina, a hobo and a bagpiper who cannot "
      "remember who they are. It is a Christmas toy-collection barrel and they are dolls.",
      [wp("Five Characters in Search of an Exit", "Five_Characters_in_Search_of_an_Exit")],
      "Setting of a third-season Serling episode.")

place("stockton-fallout-shelter", "The Stockton basement shelter (\"The Shelter\")",
      [("1959/the-shelter", "A family fallout shelter that splits a neighbourhood during a false alarm.")],
      "Dr. Bill Stockton's basement fallout shelter, stocked for his family only, becomes the target of his neighbours when a "
      "radio warning of incoming missiles turns out to be false. A Cold War morality play in which no one is literally "
      "attacked.",
      [wp("The Shelter (The Twilight Zone)", "The_Shelter_(The_Twilight_Zone)")],
      "Setting of a Serling Cold War episode.")

place("the-old-mans-cave", "The cave (\"The Old Man in the Cave\")",
      [("1959/the-old-man-in-the-cave", "Post-nuclear settlement guided by a voice from a cave, 1974.")],
      "In 1974, ten years after a nuclear war, a small settlement survives by following the advice of an unseen \"old "
      "man\" in a cave, relayed by Mr. Goldsmith. Soldiers arrive, break in and find a computer; the townspeople then eat "
      "the contaminated food it warned them against.",
      [wp("The Old Man in the Cave", "The_Old_Man_in_the_Cave")],
      "Setting of a fifth-season Serling episode.", conf="medium")

place("corrys-asteroid", "Corry's asteroid (\"The Lonely\")",
      [("1959/the-lonely", "A desert prison asteroid where James Corry lives with a robot, Alicia.")],
      "A barren asteroid nine million miles from Earth where convict James Corry serves a 50-year sentence alone, until a "
      "supply captain leaves him a lifelike robot companion. The exteriors were shot in Death Valley.",
      [wp("The Lonely", "The_Lonely")],
      "Setting of a first-season Serling episode; links to the Death Valley filming record.", conf="medium")

place("tinas-other-dimension", "The fourth dimension behind the wall (\"Little Girl Lost\")",
      [("1959/little-girl-lost", "The portal under a bedroom wall into which a child falls.")],
      "A distorted, sound-filled space behind the wall of a girl's bedroom, reached through an opening by her bed. Her "
      "father reaches in to pull her back before the portal closes. Richard Matheson's script is often cited as an influence "
      "on Poltergeist (1982).",
      [wp("Little Girl Lost (The Twilight Zone)", "Little_Girl_Lost_(The_Twilight_Zone)")],
      "Setting of a third-season Matheson episode with a documented film legacy.", conf="medium")

place("foster-mansion-new-orleans", "The Foster mansion, New Orleans (\"The Masks\")",
      [("1959/the-masks", "A dying patriarch's house on Mardi Gras night.")],
      "On the last night of Mardi Gras, dying millionaire Jason Foster makes his greedy heirs wear grotesque masks until "
      "midnight as a condition of his will. When they take them off, their faces have become the masks. Directed by Ida "
      "Lupino, the only woman to direct an episode of the original series.",
      [wp("The Masks", "The_Masks")],
      "Setting of a fifth-season Serling episode.")

place("the-highway-hitch-hiker", "The cross-country highway (\"The Hitch-Hiker\")",
      [("1959/the-hitch-hiker", "Nan Adams's drive from New York to California.")],
      "Driving alone from New York to Los Angeles, Nan Adams keeps seeing the same hitch-hiker by the road, mile after mile. "
      "She learns she died in a tyre blow-out in Pennsylvania days earlier and he is Death. Adapted from Lucille Fletcher's "
      "1941 radio play.",
      [wp("The Hitch-Hiker (The Twilight Zone)", "The_Hitch-Hiker_(The_Twilight_Zone)")],
      "Setting of a first-season episode drawn from a classic radio play.")

place("hollywood-tower-hotel", "The Hollywood Tower Hotel",
      [("films/tower-of-terror-1997", "The haunted hotel of the 1997 TV film.")],
      "The fictional Hollywood hotel at the heart of Disney's Twilight Zone Tower of Terror rides: on Halloween night 1939, "
      "lightning struck it and five guests vanished from an elevator. Riders enter through a library where Rod Serling, in "
      "re-edited footage, introduces the story. The 1997 TV film uses the same backstory.",
      [wp("The Twilight Zone Tower of Terror", "The_Twilight_Zone_Tower_of_Terror")],
      "The fictional hotel behind the franchise's theme-park attractions.", tier="related",
      why="Ties the in-story places to the ride records under Places > Real life; fans know it as a TZ setting.")

place("night-gallery-the-gallery", "The Night Gallery",
      [("films/night-gallery-pilot", "Serling introduces the paintings in the 1969 pilot film."),
       ("films/night-gallery", "Each episode opens in the gallery.")],
      "The shadowy museum where Rod Serling, as curator, stands before paintings that each introduce a story. The paintings "
      "were made for the show, mostly by Tom Wright and Jaroslav Gebr. It is Serling's second great fictional framing "
      "space after the Twilight Zone itself.",
      [wp("Night Gallery", "Night_Gallery")],
      "Serling's framing setting for Night Gallery.", tier="related")

# ------------------------------------------------------------------ REAL-LIFE PLACES (new)
def real(rid, name, kind, notes, sources, conn, tier, rec, why, conf="high", **kw):
    d = {"name": name, "kind": kind}
    d.update({k: v for k, v in kw.items() if k not in ("categories", "media", "filmed")})
    if kw.get("filmed"): d["filmed"] = kw["filmed"]
    d["notes"] = notes
    d["sources"] = sources
    if kw.get("media"): d["media"] = kw["media"]
    if kw.get("categories"): d["categories"] = kw["categories"]
    d["research_confidence"] = conf
    d["relevance"] = tier
    add("locations", rid, d, conn, tier,
        {"core": "A place where the show itself was made or is celebrated.",
         "related": "A place tied to Rod Serling's life, lectures or legacy.",
         "tangential": "A place with a light, documented tie."}[tier], rec, why)

VENUE = ["places/lecture-event-venues"]
real("pacific-ocean-park-santa-monica", "Pacific Ocean Park, Santa Monica", "filming-location",
     "A nautical-themed amusement pier at Santa Monica and Venice that operated from 1958 to 1967. It stood in for the "
     "amusement park in \"In Praise of Pip,\" where Jack Klugman's bookie relives an evening with his young son in the "
     "shooting gallery and house of mirrors. The pier was demolished in the 1970s.",
     [wp("In Praise of Pip", "In_Praise_of_Pip"), wp("Pacific Ocean Park", "Pacific_Ocean_Park")],
     "Filming location for a fifth-season episode.", "core", "include",
     "A documented filming location; lost places like this are a highlight of a locations section.",
     city="Santa Monica", region="California", country="US", status="demolished", opened="1958", closed="1967",
     filmed=[{"ref": "1959/in-praise-of-pip", "note": "Amusement-park scenes."}])

real("elmira-college", "Elmira College", "event-venue",
     "Private college in Elmira, New York, about 30 miles from Ithaca. On May 1, 1975, eight weeks before his death, "
     "Serling gave a lecture here on commercial broadcasting and American society, recorded and later distributed by "
     "the Pacifica Radio Archives as \"A Glimpse into the Twilight Zone.\"",
     [{"title": "Pacifica Radio Archives SZ0066", "url": "https://pacificaradioarchives.org/node/8692"}],
     "Venue of one of Serling's last recorded lectures.", "related", "include",
     "Gives the 1975 lecture a place on the map; small, sourced and specific.",
     city="Elmira", region="New York", country="US", status="open", categories=VENUE)

real("moorpark-college", "Moorpark College", "event-venue",
     "Community college in Moorpark, Ventura County, California. Serling spent a day on campus on December 3, 1968, "
     "refused to sign the state loyalty oath required of paid speakers and waived his fee, then spoke against the "
     "Vietnam War and for civil rights. The campus magazine QUEST printed the speech the next day.",
     [{"title": "Rod Serling Rips Loyalty Oaths, the Vietnam War, and Social Inequity (Rod Serling Memorial Foundation)",
       "url": "https://rodserling.com/rod-serling-rips-loyalty-oaths-the-vietnam-war-and-social-inequity/"}],
     "Venue of Serling's 1968 loyalty-oath speech.", "related", "include",
     "A vivid, documented moment of Serling's public life.", city="Moorpark", region="California", country="US",
     status="open", categories=VENUE)

real("suny-broome-community-college", "SUNY Broome Community College (Broome Tech)", "event-venue",
     "Binghamton's community college, then Broome Technical Community College. About 400 people heard Serling attack "
     "advertiser censorship of television here at the end of April 1964, with his old English teacher Lloyd Hartman "
     "showing him the campus.",
     [{"title": "Rod Serling Rips TV Censorship (Binghamton Press, May 1, 1964, via RSMF)", "url": "https://rodserling.com/rod-serling-rips-tv-censorship/"}],
     "Hometown venue of a 1964 Serling speech.", "related", "include", "Hometown lecture venue with a dated, sourced talk.",
     city="Binghamton", region="New York", country="US", status="open", categories=VENUE)

real("ucla-campus-serling-talks", "UCLA (Serling's campus talks)", "event-venue",
     "The University of California, Los Angeles, where Serling spoke to students in November 1966 and May 1971. Both talks "
     "were filmed by the UCLA Communication Studies department and are now on YouTube. UCLA Library also holds Serling's "
     "papers and dictabelt recordings (see the separate archive records).",
     [{"title": "LearnOutLoud: Rod Serling at UCLA in 1966", "url": "https://learnoutloud.com/Catalog/Arts-and-Entertainment/Film_-Music_-Radio_-TV_-and-Pop-Culture/Rod-Serling-at-UCLA-in-1966/116797"},
      {"title": "LearnOutLoud: Rod Serling at UCLA in 1971", "url": "https://learnoutloud.com/Free-Audio-Video/Arts-and-Entertainment/Film_-Music_-Radio_-TV_-and-Pop-Culture/Rod-Serling-at-UCLA-in-1971/116798"}],
     "Venue of two filmed Serling talks.", "related", "include", "Links two of the best surviving Serling lecture films to a place.",
     city="Los Angeles", region="California", country="US", status="open", categories=VENUE)

real("westport-library", "Westport Library", "event-venue",
     "Public library in Westport, Connecticut, the town where the Serlings lived in the 1950s. It hosted the four-day "
     "symposium \"Westport in The Twilight Zone\" for Serling's centennial, September 26-29, 2024, curated by Arlen Schumer "
     "with Nick Parisi and Mark Dawidziak.",
     [{"title": "Westport Library: Westport in the Twilight Zone with Arlen Schumer",
       "url": "https://westportlibrary.org/westport-in-the-twilight-zone-with-arlen-schumer-a-four-day-celebration-of-rod-serlings-centennial-at-the-westport-library/"}],
     "Venue of the 2024 centennial symposium in Serling's former hometown.", "related", "include",
     "Connects the symposium record to Serling's Westport years.", city="Westport", region="Connecticut", country="US",
     status="open", categories=VENUE)

real("leyte-philippines-serling-wwii", "Leyte, Philippines (Serling's war)", "serling-place",
     "Serling fought here with the 511th Parachute Infantry Regiment, 11th Airborne Division, in late 1944, and was wounded "
     "in the Philippines campaign. Biographers trace the death, fear and soldiers' stories in episodes such as \"The Purple "
     "Testament\" and \"The Quality of Mercy\" to what he saw on Leyte and in Manila.",
     [{"title": "National WWII Museum: Rod Serling and The Twilight Zone", "url": "https://www.nationalww2museum.org/war/articles/rod-serling-twilight"},
      wp("Rod Serling", "Rod_Serling")],
     "Where the war experiences behind many Serling scripts took place.", "related", "include",
     "Explains the source of a recurring theme; pairs with the Camp Toccoa record.", conf="medium",
     region="Leyte", country="PH")

real("wkrc-tv-cincinnati", "WKRC-TV, Cincinnati", "serling-place",
     "The Cincinnati television station where Serling worked as a staff writer in the early 1950s, writing live dramas for "
     "\"The Storm\" anthology while freelancing scripts to New York. It followed his radio job at WLW and came before his "
     "move east and the success of \"Patterns\" (1955).",
     [wp("Rod Serling", "Rod_Serling")],
     "An early workplace in Serling's road to television.", "related", "include",
     "Fills the gap between the WLW radio and New York records in his career map.", conf="medium",
     city="Cincinnati", region="Ohio", country="US")

# ------------------------------------------------------------------ EVENTS
def event(rid, title, sub, year, desc, sources, conn, tier, rec, why, kind="event", details=None, media=None,
          categories=None, conf="high", creator=None):
    d = {"title": title, "kind": kind, "subtype": sub, "year": year}
    if creator: d["creator"] = creator
    d["description"] = desc
    if details: d["details"] = details
    d["sources"] = sources
    if media: d["media"] = media
    if categories: d["categories"] = categories
    d["research_confidence"] = conf
    d["relevance"] = tier
    add("works", rid, d, conn, tier,
        {"core": "An event in the history of The Twilight Zone itself.",
         "related": "An event in Rod Serling's life or the wider franchise.",
         "tangential": "An event with a light tie to the show."}[tier], rec, why)

TZ59 = wp("The Twilight Zone (1959 TV series)", "The_Twilight_Zone_(1959_TV_series)")

event("the-time-element-broadcast-1958", "\"The Time Element\" airs on Westinghouse Desilu Playhouse (1958)", "premiere", 1958,
      "CBS's Westinghouse Desilu Playhouse aired Serling's \"The Time Element\" on November 24, 1958: a man dreams each night of "
      "Pearl Harbor the day before the attack. Shelved by CBS as an anthology pilot, it was bought by Desilu, drew strong "
      "reviews and mail, and persuaded CBS to commission The Twilight Zone. Desi Arnaz introduced it.",
      [wp("The Time Element", "The_Time_Element")], "The unofficial pilot that got the series made.", "core", "include",
      "The true starting point of the franchise; belongs at the top of the timeline.", details={"date": "1958-11-24", "network": "CBS"},
      categories=["events/premieres"])

event("twilight-zone-premiere-1959", "The Twilight Zone premieres on CBS (1959)", "premiere", 1959,
      "The series debuted on Friday, October 2, 1959, at 10 p.m. Eastern on CBS with \"Where Is Everybody?\", starring Earl "
      "Holliman as a man alone in an empty town. Serling wrote the episode and narrated in voice-over; he did not appear on "
      "camera until later in the first season. The original run lasted five seasons and 156 episodes.",
      [{"title": "HISTORY.com: The Twilight Zone premieres", "url": "https://www.history.com/this-day-in-history/october-2/the-twilight-zone-premieres"}, TZ59],
      "The first broadcast of the series.", "core", "include", "The founding date of everything on the site.",
      details={"date": "1959-10-02", "network": "CBS", "first_episode": "1959/where-is-everybody"},
      categories=["events/premieres"])

event("hour-long-season-premiere-1963", "The Twilight Zone returns as an hour-long series (1963)", "broadcast", 1963,
      "After CBS dropped the show from its autumn 1962 schedule, it returned on Thursday, January 3, 1963, in a one-hour "
      "format with \"In His Image.\" The 18 hour-long episodes of season four were not a success, and season five went back "
      "to half an hour that autumn.",
      [TZ59], "A turning point in the original run.", "core", "include", "Explains the odd-length season four in the episode lists.",
      details={"date": "1963-01-03", "network": "CBS", "first_episode": "1959/in-his-image"}, categories=["events/broadcasts-marathons"], conf="medium")

event("final-original-broadcast-1964", "Last first-run episode of the original series (1964)", "broadcast", 1964,
      "CBS broadcast the last new episode of the original series, \"The Bewitchin' Pool,\" on June 19, 1964. CBS did not "
      "renew the show; reruns followed that summer and it then went into syndication, where it has rarely been off the air.",
      [TZ59], "The end of the original run.", "core", "include", "Closes the original-series timeline.",
      details={"date": "1964-06-19", "network": "CBS", "episode": "1959/the-bewitchin-pool"}, categories=["events/broadcasts-marathons"], conf="medium")

event("night-gallery-pilot-broadcast-1969", "Night Gallery pilot film airs on NBC (1969)", "premiere", 1969,
      "NBC aired the Night Gallery TV movie on November 8, 1969: three stories hosted by Serling, including one directed by a "
      "young Steven Spielberg with Joan Crawford. The series followed in December 1970 as part of Four in One.",
      [wp("Night Gallery", "Night_Gallery")], "Premiere of Serling's second anthology.", "related", "include",
      "Night Gallery is in scope per Adam's rule; its premiere belongs on the timeline.",
      details={"date": "1969-11-08", "network": "NBC", "film": "films/night-gallery-pilot"}, categories=["events/premieres"])

event("serling-death-1975", "Death of Rod Serling (1975)", "history", 1975,
      "Serling died on June 28, 1975, aged 50, at Strong Memorial Hospital in Rochester, New York, after complications from "
      "heart bypass surgery following a series of heart attacks. He was buried at Lake View Cemetery in Interlaken, New York, "
      "near his family's Cayuga Lake cottage.",
      [wp("Rod Serling", "Rod_Serling"), {"title": "Rod Serling's Binghamton obituary (RSMF)", "url": "https://rodserling.com/rod-serlings-binghamton-obituary/"}],
      "The death of the show's creator.", "core", "include",
      "A necessary timeline entry; links his hospital and grave records.", details={"date": "1975-06-28", "location": "Rochester, New York"},
      categories=["events/serling-life"])

event("twilight-zone-magazine-launch-1981", "Rod Serling's The Twilight Zone Magazine launches (1981)", "premiere", 1981,
      "The fiction magazine licensed from Carol Serling launched with its April 1981 issue, edited by T. E. D. Klein, and ran "
      "until 1989. It published new horror and fantasy by Stephen King and others alongside Twilight Zone teleplays and "
      "episode guides by Marc Scott Zicree.",
      [wp("Rod Serling's The Twilight Zone Magazine", "Rod_Serling%27s_The_Twilight_Zone_Magazine")], "Launch of the official magazine.",
      "core", "include", "Marks a licensed revival of the brand between the series and the film.", details={"date": "1981-04"},
      categories=["events/premieres"], conf="medium")

event("twilight-zone-the-movie-release-1983", "Twilight Zone: The Movie opens (1983)", "premiere", 1983,
      "Warner Bros. released the four-segment film on June 24, 1983, with segments by John Landis, Steven Spielberg, Joe Dante "
      "and George Miller. It opened under the shadow of the 1982 helicopter accident that killed Vic Morrow and two children.",
      [{"title": "The Numbers: Twilight Zone: The Movie", "url": "https://www.the-numbers.com/movie/Twilight-Zone-The-Movie"},
       wp("Twilight Zone: The Movie", "Twilight_Zone:_The_Movie")],
      "Release of the franchise's feature film.", "core", "include", "The film's release is a core franchise date.",
      details={"date": "1983-06-24", "film": "films/twilight-zone-the-movie"}, categories=["events/premieres"])

event("twilight-zone-trial-1986-1987", "The Twilight Zone manslaughter trial (1986-1987)", "trial", 1987,
      "John Landis, associate producer George Folsey Jr., unit production manager Dan Allingham, helicopter pilot Dorcey Wingo "
      "and special-effects coordinator Paul Stewart were charged with involuntary manslaughter over the 1982 deaths of Vic "
      "Morrow, Myca Dinh Le and Renee Shin-Yi Chen. The trial in Los Angeles ran from mid-1986, with testimony about the hiring "
      "of the children without permits and the timing of the explosions. The jury acquitted all five on May 29, 1987. Civil "
      "suits by the families were settled, and the case changed safety rules for stunts, pyrotechnics and child actors.",
      [wp("Twilight Zone accident", "Twilight_Zone_accident"),
       {"title": "Crime Library: The Twilight Zone Tragedy", "url": "https://crimelibrary.org/notorious_murders/not_guilty/twilight_zone/9.html"}],
      "The legal aftermath of the deaths on the film's set.", "core", "include",
      "Inseparable from the film's history; handled factually, it is one of the most-searched TZ topics.",
      kind="legal", details={"verdict": "Not guilty, 1987-05-29", "location": "Los Angeles", "related": "works/twilight-zone-accident-1982"},
      categories=["legal-history/accident-trial", "events/production-history"], conf="medium")

event("twilight-zone-1985-premiere", "The Twilight Zone revival premieres on CBS (1985)", "premiere", 1985,
      "CBS launched the first revival on Friday, September 27, 1985, with \"Shatterday\" (Bruce Willis) and \"A Little Peace "
      "and Quiet.\" Episodes often held two or three stories, and writers included Harlan Ellison, Ray Bradbury, Stephen King "
      "and George R. R. Martin. It ran three seasons, the last in syndication.",
      [wp("The Twilight Zone (1985 TV series)", "The_Twilight_Zone_(1985_TV_series)")], "Premiere of the first revival.", "core", "include",
      "Core franchise date.", details={"date": "1985-09-27", "network": "CBS"}, categories=["events/premieres"])

event("lost-classics-broadcast-1994", "Twilight Zone: Rod Serling's Lost Classics airs (1994)", "premiere", 1994,
      "CBS aired a TV movie of two unproduced Serling stories on May 19, 1994: \"The Theatre,\" finished by Richard Matheson "
      "from Serling's outline, and \"Where the Dead Are,\" from a completed Serling script. James Earl Jones hosted.",
      [wp("Twilight Zone: Rod Serling's Lost Classics", "Twilight_Zone:_Rod_Serling%27s_Lost_Classics")],
      "Broadcast of Serling's unproduced stories under the franchise name.", "core", "include", "Core franchise date.",
      details={"date": "1994-05-19", "network": "CBS"}, categories=["events/premieres"], conf="medium")

event("tower-of-terror-orlando-opening-1994", "The Twilight Zone Tower of Terror opens at Disney-MGM Studios (1994)", "premiere", 1994,
      "The first Twilight Zone Tower of Terror opened on July 22, 1994, at Disney-MGM Studios (now Disney's Hollywood Studios) "
      "in Florida, with re-edited Serling footage and a narrator matching his voice. Versions followed in California (2004) and "
      "Paris (2007); Tokyo's 2006 tower has a different story.",
      [wp("The Twilight Zone Tower of Terror", "The_Twilight_Zone_Tower_of_Terror")], "Opening of the franchise's theme-park attraction.",
      "core", "include", "The attraction is the franchise's biggest physical presence; its opening is a key date.",
      details={"date": "1994-07-22", "location": "locations/tower-of-terror-disneys-hollywood-studios"}, categories=["events/premieres"])

event("tower-of-terror-film-1997", "Tower of Terror TV film premieres (1997)", "premiere", 1997,
      "The Wonderful World of Disney aired Tower of Terror, starring Steve Guttenberg and Kirsten Dunst, on October 26, 1997. "
      "It adapts the ride's 1939 Hollywood Tower Hotel story.",
      [wp("Tower of Terror (1997 film)", "Tower_of_Terror_(1997_film)")], "Premiere of a film based on the TZ attraction.", "related", "include",
      "A franchise spin-off of the ride; one step from the show.", details={"date": "1997-10-26", "film": "films/tower-of-terror-1997"},
      categories=["events/premieres"], conf="medium")

event("twilight-zone-2002-premiere", "The Twilight Zone revival premieres on UPN (2002)", "premiere", 2002,
      "UPN launched the second revival on September 18, 2002, with Forest Whitaker as host and narrator. Each hour held two "
      "stories; it ran one season of 43 episodes, including sequels and remakes of original episodes.",
      [wp("The Twilight Zone (2002 TV series)", "The_Twilight_Zone_(2002_TV_series)")], "Premiere of the second revival.", "core", "include",
      "Core franchise date.", details={"date": "2002-09-18", "network": "UPN"}, categories=["events/premieres"])

event("tower-of-terror-california-closing-2017", "Tower of Terror closes at Disney California Adventure (2017)", "history", 2017,
      "The California version, opened May 5, 2004, closed on January 2, 2017, and was rethemed as Guardians of the Galaxy - "
      "Mission: Breakout! Fans held farewell events and many rode it on its last nights. The Florida tower keeps the Twilight "
      "Zone theme.",
      [wp("The Twilight Zone Tower of Terror", "The_Twilight_Zone_Tower_of_Terror")], "End of one TZ attraction.", "related", "include",
      "Closing dates complete the attraction records.", details={"date": "2017-01-02", "location": "locations/tower-of-terror-disney-california-adventure"},
      categories=["events/other-events"], conf="medium")

event("twilight-zone-2019-premiere", "The Twilight Zone revival premieres on CBS All Access (2019)", "premiere", 2019,
      "Jordan Peele's revival began streaming on April 1, 2019, with \"The Comedian\" and \"Nightmare at 30,000 Feet.\" The pilot "
      "was also shown free on CBS television. It ran two seasons (the second from June 2020).",
      [wp("The Twilight Zone (2019 TV series)", "The_Twilight_Zone_(2019_TV_series)")], "Premiere of the third revival.", "core", "include",
      "Core franchise date.", details={"date": "2019-04-01", "network": "CBS All Access"}, categories=["events/premieres"])

# marathons
DOG = {"title": "Den of Geek: The Twilight Zone Marathon, a History of a Holiday Tradition (Arlen Schumer, 2018)",
       "url": "https://www.denofgeek.com/tv/the-twilight-zone-marathon-a-history-of-a-holiday-tradition/"}
event("ktla-thanksgiving-marathon-1980", "KTLA's first Twilight Zone marathon (Thanksgiving 1980)", "marathon", 1980,
      "Los Angeles station KTLA ran an eight-hour Twilight Zone marathon on Thanksgiving 1980, which its program director later "
      "called the station's first; it drew a 16% share. The Thanksgiving marathon did not last, but it set the pattern for "
      "holiday marathons.",
      [DOG], "One of the earliest documented TZ marathons.", "core", "include",
      "The origin story of the marathon tradition fans still follow.", details={"station": "KTLA (Los Angeles)"},
      categories=["events/broadcasts-marathons"], conf="medium")

event("ktla-july-4-marathon", "KTLA's Fourth of July Twilight Zone marathon (from 1983)", "marathon", 1983,
      "KTLA began a Fourth of July Twilight Zone marathon in 1983, according to its program director in a 1991 Los Angeles Times "
      "piece. It became a summer counterpart to the New Year's marathons in other cities.",
      [DOG], "A long-running holiday marathon.", "core", "include", "Part of the marathon tradition.", details={"station": "KTLA (Los Angeles)"},
      categories=["events/broadcasts-marathons"], conf="medium")

event("wpix-new-years-marathon", "WPIX's New Year's Twilight Zone marathon (1980s)", "marathon", 1983,
      "New York's WPIX (Channel 11) began Twilight Zone marathons in the early 1980s and was perhaps the first station to run "
      "one on New Year's Eve, the slot most fans associate with the show. Exact first year is not documented.",
      [DOG], "Likely origin of the New Year's marathon.", "core", "include",
      "Explains the best-known TZ ritual; flagged medium confidence because the first year is uncertain.",
      details={"station": "WPIX (New York)"}, categories=["events/broadcasts-marathons"], conf="low")

event("syfy-new-years-marathon", "Sci-Fi Channel / Syfy New Year's Twilight Zone marathon", "marathon", 1995,
      "The cable network ran a Twilight Zone marathon over New Year's for more than two decades; it billed the 2016-17 run as the "
      "22nd annual. Schedules were published each year and fans have sometimes voted on the line-up.",
      [{"title": "BroadwayWorld: Syfy continues New Year's tradition with 22nd annual Twilight Zone marathon (2016)",
        "url": "https://www.broadwayworld.com/bwwtv/article/SyFy-Continues-New-Years-Tradition-with-22nd-Annual-THE-TWILIGHT-ZONE-Marathon-20161221"}, DOG],
      "The national form of the marathon tradition.", "core", "include", "A ritual many fans know the show from.",
      details={"network": "Sci-Fi Channel, later Syfy", "first_year": "about 1995 (22nd annual in 2016)"},
      categories=["events/broadcasts-marathons"], conf="medium")

event("national-twilight-zone-day", "National Twilight Zone Day (May 11)", "anniversary", None,
      "An unofficial \"fun holiday\" on May 11 listed by holiday calendars, on which fans are encouraged to watch episodes. Its "
      "origin and the reason for the date are not documented; it is not tied to an air date.",
      [{"title": "timeanddate.com: Twilight Zone Day", "url": "https://www.timeanddate.com/holidays/fun/twilight-zone-day"}],
      "A fan observance named after the show.", "tangential", "maybe",
      "Popular online but with no known origin; keep if you want fan observances, otherwise skip.",
      details={"date": "Every May 11"}, categories=["events/anniversaries-festivals"], conf="low")

event("bundy-rod-serling-archive-opening-2015", "The Rod Serling Archive opens at the Bundy Museum (2015)", "exhibition", 2015,
      "The Bundy Museum of History and Art in Binghamton opened a permanent Rod Serling exhibit in April 2015. Displays included "
      "the helmet Leonard Nimoy wore in \"A Quality of Mercy,\" a pig-face mask from \"Eye of the Beholder,\" a vintage board "
      "game, and photographs and film from Serling's wider career.",
      [{"title": "MeTV: A new Rod Serling exhibit opens in the Twilight Zone creator's hometown", "url": "https://metv.com/stories/a-new-rod-serling-exhibit-opens-in-the-twilight-zone-creators-hometown"},
       {"title": "Zoomer Radio (2015-04-16): Twilight Zone shrine opens in Binghamton", "url": "https://www.zoomerradio.ca/news/latest-news/2015/04/16/twilight-zone-shrine-opens-binghamton-ny/"}],
      "Opening of the only permanent TZ exhibit in Serling's hometown.", "core", "include", "A museum of TZ props and history.",
      details={"date": "2015-04", "location": "locations/bundy-museum-rod-serling-archive"}, categories=["events/exhibitions"])

event("binghamton-twilight-zone-50-2009", "Binghamton's Twilight Zone 50th anniversary celebration (2009)", "anniversary", 2009,
      "For the 50th anniversary in October 2009, Binghamton held a 12-hour Twilight Zone marathon at the Forum Theatre, walking "
      "tours, a Rod Serling Video Festival screening of the American Masters film, and live WSKG-TV performances of \"Walking "
      "Distance\" and \"Mirror Image\" on Saturday, October 3. WSKG radio's \"Off the Page\" aired a \"Twilight Zone @ 50\" "
      "program with Anne Serling, Martin Grams Jr. and Larry Kassan.",
      [{"title": "WSKG: Twilight Zone @ 50 (Off the Page)", "url": "https://www.wskg.org/arts/2014-10-09/twilight-zone-50"}],
      "Hometown celebration of the 50th anniversary.", "core", "include", "Documents how the hometown marked the milestone; includes audio.",
      details={"date": "2009-10", "location": "Binghamton, New York"},
      media=[{"type": "audio", "title": "WSKG Off the Page: Twilight Zone @ 50", "url": "https://www.wskg.org/arts/2014-10-09/twilight-zone-50",
              "host": "WSKG Public Media", "rights": "link-only", "note": "Radio program with Anne Serling, Martin Grams Jr. and Larry Kassan; audio plays on the page."}],
      categories=["events/anniversaries-festivals"], conf="medium")

event("serlingfest-2025-in-his-own-words", "SerlingFest 2025: In His Own Words", "festival", 2025,
      "The Rod Serling Memorial Foundation's festival marked 50 years since Serling's death, September 19-21, 2025, at the "
      "Forum Theatre and Recreation Park in Binghamton. Frank Spotnitz gave the keynote; Mark Olshaker presented a Serling speech "
      "given at the Library of Congress; Joseph Dougherty, David Bianculli, Anne Serling and Mark Dawidziak spoke; Jonah Tulis "
      "previewed his documentary \"Serling.\"",
      [{"title": "Pipe Dream (Binghamton University): SerlingFest 2025", "url": "https://www.bupipedream.com/?p=170017"},
       {"title": "RSMF Fall 2025 newsletter", "url": "https://rodserling.com/fall-2025-newsletter/"}],
      "The 2025 edition of the main annual Serling festival.", "related", "include", "A dated, sourced festival with notable speakers.",
      details={"dates": "2025-09-19 to 2025-09-21", "location": "Binghamton, New York", "series": "works/serlingfest"},
      categories=["events/anniversaries-festivals"])

event("antioch-marker-dedication-2025", "Ohio historical marker for Serling dedicated at Antioch College (2025)", "anniversary", 2025,
      "On October 2, 2025, the 66th anniversary of the series premiere, Ohio Governor Mike DeWine, Antioch President Jane "
      "Fernandes and Anne Serling dedicated an Ohio historical marker to Serling outside South Hall at Antioch College in "
      "Yellow Springs. Serling was added to the Ohioana Ohio Literary Trail.",
      [{"title": "RSMF Fall 2025 newsletter", "url": "https://rodserling.com/fall-2025-newsletter/"},
       {"title": "WYSU: Rod Serling historical marker, Yellow Springs", "url": "https://wysu.org/ohio-news/2025-07-31/rod-serling-historical-marker-yellow-springs-antioch-college-wlw-tvkiese"}],
      "Dedication of a state marker to Serling.", "related", "include", "The event behind the existing marker location record.",
      details={"date": "2025-10-02", "location": "locations/antioch-college-rod-serling-markers"}, categories=["events/anniversaries-festivals"])

event("serlingfest-2026", "SerlingFest 2026", "festival", 2026,
      "The foundation announced SerlingFest 2026 for August 21-22 at the Binghamton DoubleTree hotel, with a closing gathering at "
      "the Serling statue in Recreation Park on August 23.",
      [{"title": "RSMF Fall 2025 newsletter", "url": "https://rodserling.com/fall-2025-newsletter/"}],
      "The 2026 edition of the main annual Serling festival.", "related", "maybe",
      "Dates come from the foundation's announcement; confirm the programme before featuring it.",
      details={"dates": "2026-08-21 to 2026-08-23", "location": "Binghamton, New York", "series": "works/serlingfest"},
      categories=["events/anniversaries-festivals"], conf="low")

# ------------------------------------------------------------------ LECTURES
def lecture(rid, title, sub, year, creator, desc, sources, conn, tier, rec, why, details=None, media=None, cat=None, conf="high", kind="lecture"):
    d = {"title": title, "kind": kind, "subtype": sub, "year": year, "creator": creator, "description": desc}
    if details: d["details"] = details
    d["sources"] = sources
    if media: d["media"] = media
    if cat: d["categories"] = [cat]
    d["research_confidence"] = conf
    d["relevance"] = tier
    add("works", rid, d, conn, tier,
        {"core": "A talk or class about The Twilight Zone itself.",
         "related": "A talk by Rod Serling, or about him, in his own voice or legacy."}[tier], rec, why)

lecture("serling-broome-tech-censorship-1964", "Rod Serling on television censorship, Broome Technical Community College (1964)", "speech", 1964,
        "Rod Serling",
        "Speaking to about 400 people at Broome Tech in Binghamton at the end of April 1964, as The Twilight Zone ended its run, "
        "Serling argued that advertisers, not government, were the real censors of television, criticised the ratings services and "
        "discussed the FCC. The Binghamton Press reported the talk on May 1, 1964.",
        [{"title": "Rod Serling Rips TV Censorship (RSMF reprint of Binghamton Press, 1964-05-01)", "url": "https://rodserling.com/rod-serling-rips-tv-censorship/"}],
        "Serling's own views on the pressures he worked under on the show.", "related", "include",
        "A first-hand account of Serling's censorship battles, in his hometown.",
        details={"date": "1964-04-30 (approx.)", "location": "locations/suny-broome-community-college"},
        media=[{"type": "article", "title": "Binghamton Press report (reprint)", "url": "https://rodserling.com/rod-serling-rips-tv-censorship/",
                "host": "Rod Serling Memorial Foundation", "date": "1964-05-01", "rights": "link-only"}],
        cat="lectures/serling-lectures", conf="medium")

lecture("serling-ucla-1966", "Rod Serling at UCLA (1966)", "talk", 1966, "Rod Serling",
        "A filmed talk and question session with UCLA students on November 11, 1966, running about an hour and a half, from the "
        "UCLA Communication Studies department's archive. Serling speaks about writing for television, commercial pressure and his "
        "career after The Twilight Zone.",
        [{"title": "LearnOutLoud: Rod Serling at UCLA in 1966", "url": "https://learnoutloud.com/Catalog/Arts-and-Entertainment/Film_-Music_-Radio_-TV_-and-Pop-Culture/Rod-Serling-at-UCLA-in-1966/116797"}],
        "Serling discussing his craft two years after the show ended.", "related", "include",
        "One of the longest surviving films of Serling teaching; free to watch.",
        details={"date": "1966-11-11", "location": "locations/ucla-campus-serling-talks", "length": "1:36"},
        media=[{"type": "video", "title": "Rod Serling at UCLA, 1966", "url": "https://www.youtube.com/watch?v=PyJUwZ0k-JQ",
                "host": "YouTube (UCLA Communication Studies archive)", "date": "1966-11-11", "duration": "1:36:00", "rights": "unknown"}],
        cat="lectures/serling-lectures", conf="medium")

lecture("serling-ucla-1971", "Rod Serling at UCLA (1971)", "talk", 1971, "Rod Serling",
        "A 52-minute filmed session with UCLA students on May 17, 1971, during the Night Gallery years, from the UCLA Communication "
        "Studies department's archive. No Film School used an excerpt in which Serling describes how hard it is to get an idea onto paper.",
        [{"title": "LearnOutLoud: Rod Serling at UCLA in 1971", "url": "https://learnoutloud.com/Free-Audio-Video/Arts-and-Entertainment/Film_-Music_-Radio_-TV_-and-Pop-Culture/Rod-Serling-at-UCLA-in-1971/116798"},
         {"title": "No Film School: Watch Rod Serling discuss his philosophy on creativity (2014)", "url": "https://nofilmschool.com/2014/08/watch-twilight-zone-creator-rod-serling-discuss-his-philosophy-creativity"}],
        "Serling on writing, in the Night Gallery years.", "related", "include", "Free, filmed and well cited.",
        details={"date": "1971-05-17", "location": "locations/ucla-campus-serling-talks", "length": "0:52"},
        media=[{"type": "video", "title": "Rod Serling at UCLA, 1971", "url": "https://www.youtube.com/watch?v=vqlhGgsamro",
                "host": "YouTube (UCLA Communication Studies archive)", "date": "1971-05-17", "duration": "52:00", "rights": "unknown"}],
        cat="lectures/serling-lectures", conf="medium")

lecture("serling-library-of-congress-lecture-1968", "Rod Serling, Library of Congress lecture on television and the literary artist (1968)", "lecture", 1968,
        "Rod Serling",
        "Serling lectured at the Library of Congress on television as a medium for the literary artist. Michigan public station WUOM "
        "and the Library distributed it as programme 5 of the radio series \"Library of Congress Lectures II,\" dated October 4, 1968. "
        "The American Archive of Public Broadcasting holds two copies (29:00 and 25:44). Mark Olshaker presented this speech at "
        "SerlingFest 2025.",
        [{"title": "American Archive of Public Broadcasting: Library of Congress lectures II, episode 5 of 9", "url": "https://americanarchive.org/catalog/cpb-aacip-500-tb0xv19x"},
         {"title": "Unlocking the Airwaves (MITH): programme record", "url": "https://archive.mith.umd.edu/airwaves/episode/cpb-aacip-500-tb0xv19x"}],
        "A formal Serling lecture on writing for television.", "related", "include",
        "Rare, archived audio of Serling at the national library; streamable from a public archive.",
        details={"date": "1968-10-04 (broadcast)", "venue": "Library of Congress, Washington, D.C.", "producer": "WUOM (Ann Arbor) and Library of Congress"},
        media=[{"type": "audio", "title": "Library of Congress Lectures II, programme 5 (Serling) - copy 1", "url": "https://archive.mith.umd.edu/airwaves/episode/cpb-aacip-500-tb0xv19x",
                "host": "Unlocking the Airwaves / American Archive of Public Broadcasting", "date": "1968-10-04", "duration": "29:00", "rights": "unknown"},
               {"type": "audio", "title": "Library of Congress Lectures II, programme 5 (Serling) - copy 2", "url": "https://archive.mith.umd.edu/airwaves/episode/cpb-aacip-500-bz619d02/",
                "host": "Unlocking the Airwaves / American Archive of Public Broadcasting", "date": "1968-10-04", "duration": "25:44", "rights": "unknown"}],
        cat="lectures/serling-lectures")

lecture("serling-moorpark-college-1968", "Rod Serling at Moorpark College: loyalty oaths, Vietnam and social inequity (1968)", "speech", 1968, "Rod Serling",
        "On December 3, 1968, Serling refused to sign California's loyalty oath for paid speakers, waived his fee, and spoke to Moorpark "
        "College students about the generation gap, the Vietnam War, civil rights and campus protest. He ended: \"If you want to prove "
        "that God is not dead... first prove that man is alive.\" The campus magazine QUEST printed the speech the next day.",
        [{"title": "Rod Serling Rips Loyalty Oaths, the Vietnam War, and Social Inequity (RSMF)", "url": "https://rodserling.com/rod-serling-rips-loyalty-oaths-the-vietnam-war-and-social-inequity/"}],
        "Serling's politics in his own words, the same convictions behind many episodes.", "related", "include",
        "Full printed text survives; a strong primary source on Serling as a public voice.",
        details={"date": "1968-12-03", "location": "locations/moorpark-college"},
        media=[{"type": "transcript", "title": "QUEST transcript (1968-12-04), reprinted by RSMF", "url": "https://rodserling.com/rod-serling-rips-loyalty-oaths-the-vietnam-war-and-social-inequity/",
                "host": "Rod Serling Memorial Foundation", "date": "1968-12-04", "rights": "link-only"}],
        cat="lectures/serling-lectures")

lecture("serling-elmira-college-1975", "\"A Glimpse into the Twilight Zone\": Rod Serling at Elmira College (1975)", "lecture", 1975, "Rod Serling",
        "Recorded on May 1, 1975, at Elmira College, New York, weeks before Serling's death: a 72-minute lecture on commercial "
        "broadcasting and American society, followed by an interview about his writing career. Pacifica Radio Archives holds the "
        "reel (item SZ0066); it has not been digitised, but the archive sells transfer copies.",
        [{"title": "Pacifica Radio Archives: A Glimpse into the Twilight Zone / Rod Serling (SZ0066)", "url": "https://pacificaradioarchives.org/node/8692"}],
        "One of Serling's last recorded lectures.", "related", "include",
        "A rare late recording; worth listing even though it is only available on request.",
        details={"date": "1975-05-01", "location": "locations/elmira-college", "length": "72 min", "archive_id": "Pacifica SZ0066"},
        media=[{"type": "audio", "title": "Pacifica Radio Archives catalogue entry SZ0066", "url": "https://pacificaradioarchives.org/node/8692",
                "host": "Pacifica Radio Archives", "date": "1975-05-01", "duration": "72:00", "rights": "link-only",
                "note": "Reel tape, not digitised; copies by request."}],
        cat="lectures/serling-lectures")

lecture("serling-antioch-drama-in-the-mass-media-1962", "\"Drama in the Mass Media\": Serling's Antioch College seminar (1962-63)", "seminar", 1962, "Rod Serling",
        "After the third season, Serling spent about five months as writer-in-residence at his alma mater, Antioch College in Yellow "
        "Springs, Ohio. He taught a daytime writing class and an evening seminar for about 20 working writers, \"Drama in the Mass Media.\" "
        "Journalist Jeanne Marshall's 23 pages of typed notes survive, including his advice to writers: grab the audience at once, have a "
        "point of view, research the background, and keep sentimentality out.",
        [{"title": "Rod Serling Teaches Writing: Jeanne Marshall's Seminar Notes, 1962-63 (RSMF)", "url": "https://rodserling.com/rod-serling-teaches-writing/"},
         {"title": "Yellow Springs News: Rod Serling at Antioch College (2010)", "url": "https://ysnews.com/news/2010/08/rod-serling-at-antioch-college"}],
        "Serling teaching writing during the series' run.", "related", "include",
        "A rare record of what Serling taught, from a student's notes, mid-way through the show.",
        details={"dates": "1962-1963", "location": "Antioch College, Yellow Springs, Ohio"},
        media=[{"type": "document", "title": "Jeanne Marshall's seminar notes (23 scanned pages)", "url": "https://rodserling.com/rod-serling-teaches-writing/",
                "host": "Rod Serling Memorial Foundation", "rights": "link-only"}],
        cat="lectures/classroom")

lecture("serling-ithaca-student-seminar-1972", "Rod Serling seminar with Ithaca College students (1972)", "seminar", 1972, "Rod Serling",
        "Video of Serling in a small seminar with Ithaca College students in 1972, debating what counts as creativity and taking "
        "questions. Educator Gardner Campbell has used it as a model of teaching through conversation.",
        [{"title": "Gardner Campbell: Rod Serling Seminar (2021)", "url": "https://www.gardnercampbell.net/blog1/rod-serling-seminar/"}],
        "Serling as a teacher in his Ithaca years.", "related", "include", "Free video of Serling teaching.",
        details={"date": "1972", "location": "locations/ithaca-college-rod-serling-archives"},
        media=[{"type": "video", "title": "Rod Serling seminar, Ithaca College, 1972", "url": "https://www.youtube.com/watch?v=sFjxyimRtb0",
                "host": "YouTube", "date": "1972", "rights": "unknown"}],
        cat="lectures/classroom", conf="medium")

lecture("serling-ithaca-episode-screenings", "Serling's evening Twilight Zone screenings at Ithaca College (late 1960s)", "class", 1967, "Rod Serling",
        "Former students recall Serling introducing Twilight Zone episodes in an Ithaca College lecture hall in the evenings, setting "
        "assignments, taking questions and sometimes re-running an episode with his own commentary. He told one group that \"Walking "
        "Distance\" was partly autobiographical, inspired by a visit to Binghamton's Recreation Park.",
        [{"title": "Al Rosen remembers Rod Serling (RSMF, 2020)", "url": "https://rodserling.com/al-rosen-remembers-rod-serling/"},
         {"title": "Elliot Becker remembers Rod the teacher (RSMF, 2016)", "url": "https://rodserling.com/elliot-becker-remembers-rod-the-teacher"}],
        "Serling teaching with his own episodes.", "core", "include", "First-hand accounts of Serling discussing the show with students.",
        details={"dates": "1967-1975", "location": "locations/ithaca-college-rod-serling-archives"}, cat="lectures/classroom", conf="medium")

lecture("wissner-music-in-the-twilight-zone-2017", "\"Music in the Twilight Zone: Hearing Rod Serling's Vision\" (Reba Wissner, 2017)", "lecture", 2017, "Reba Wissner",
        "Musicologist Reba Wissner, author of A Dimension of Sound: Music in The Twilight Zone, lectured at Ithaca College's Whalen "
        "Center for Music on February 17, 2017, on how the series used stock and original scores against the image. The evening "
        "included an episode screening and a display of Serling's awards.",
        [{"title": "Ithaca College: Leading television music scholar to give lecture on music of The Twilight Zone", "url": "https://www.ithaca.edu/news/leading-television-music-scholar-give-lecture-music-twilight-zone"}],
        "An academic lecture on the show's music.", "core", "include", "Scholarly talk on an under-covered side of the show.",
        details={"date": "2017-02-17", "venue": "Nabenhauer Recital Room, Whalen Center for Music, Ithaca College"}, cat="lectures/academic")

lecture("anne-serling-umw-great-lives-2025", "Anne Serling on her father, Great Lives lecture series (2025)", "lecture", 2025, "Anne Serling",
        "Anne Serling spoke about Rod Serling and her memoir As I Knew Him in the University of Mary Washington's Great Lives series "
        "in Fredericksburg, Virginia, on January 28, 2025 (the Russell Mait and Barbara Stone Mait '79 Lecture). The university "
        "posted the full video.",
        [{"title": "UMW Great Lives: Rod Serling", "url": "https://www.umw.edu/greatlives/lecture/rod-serling/"}],
        "A recorded talk about Serling by his daughter.", "related", "include", "Free video, first-hand family perspective.",
        details={"date": "2025-01-28", "venue": "University of Mary Washington, Fredericksburg, Virginia"},
        media=[{"type": "video", "title": "Great Lives: Anne Serling on Rod Serling", "url": "https://player.vimeo.com/video/1051638001",
                "host": "Vimeo (University of Mary Washington)", "date": "2025-01-28", "rights": "link-only"}],
        cat="lectures/academic")

lecture("chris-alexander-morbid-anatomy-2024", "\"The Beauty, Truth, and Terror of The Twilight Zone\" (Chris Alexander, 2024)", "lecture", 2024, "Chris Alexander",
        "An online illustrated \"mini-masterclass\" on the series by writer, filmmaker and former Fangoria editor Chris Alexander, "
        "hosted by Morbid Anatomy on September 16, 2024. The recording went to ticket holders and is archived for the organisation's "
        "Patreon members.",
        [{"title": "Morbid Anatomy: The Beauty, Truth, and Terror of The Twilight Zone", "url": "https://www.morbidanatomy.org/events-tickets/twilight-zone"}],
        "A public lecture about the show.", "core", "maybe", "Paywalled recording; include if you want to list current lecture activity.",
        details={"date": "2024-09-16", "format": "Online (Zoom)"}, cat="lectures/academic")

lecture("boulton-take-this-stand-2010", "\"Take this stand\": Rod Serling and the politics of The Twilight Zone (Mark Boulton, 2010)", "lecture", 2010, "Mark Boulton",
        "University of Wisconsin-Whitewater historian Mark Boulton gave this talk on October 25, 2010, in the Fairhaven \"Life & Times\" "
        "lecture series in Whitewater, Wisconsin, on how Serling used the series to argue about civil rights, McCarthyism and the Cold War.",
        [{"title": "UW-Whitewater Library blog: Talk about Rod Serling (2010)", "url": "https://blogs.uww.edu/library/wp-json/wp/v2/posts/5740"}],
        "An academic talk on the show's politics.", "core", "include", "Sourced academic lecture on the show's themes.",
        details={"date": "2010-10-25", "venue": "Fellowship Hall, Fairhaven Retirement Community"}, cat="lectures/academic", conf="medium")

lecture("bridgewater-state-anthropology-twilight-zone", "Bridgewater State University anthropology course on The Twilight Zone", "course", None, "Walter Harper",
        "Anthropologist Walter Harper teaches a writing-intensive autumn course at Bridgewater State University in Massachusetts in "
        "which students watch an episode each week and discuss what it shows about culture, conformity and fear.",
        [{"title": "Bridgewater State University: 'Twilight' time", "url": "https://bridgew.edu/news-events/news/%25E2%2580%2598twilight%25E2%2580%2599-time"}],
        "A university course built on the show.", "core", "include", "Shows the series' standing as a teaching text.",
        details={"venue": "Bridgewater State University, Bridgewater, Massachusetts"}, cat="lectures/classroom", conf="medium", kind="education")

lecture("spotnitz-serlingfest-keynote-2025", "Frank Spotnitz keynote, SerlingFest 2025", "keynote", 2025, "Frank Spotnitz",
        "X-Files writer and producer Frank Spotnitz gave the keynote at SerlingFest 2025 in Binghamton, discussing The Twilight Zone's "
        "influence on The X-Files, with episode screenings.",
        [{"title": "Pipe Dream: SerlingFest 2025", "url": "https://www.bupipedream.com/?p=170017"},
         {"title": "RSMF Fall 2025 newsletter", "url": "https://rodserling.com/fall-2025-newsletter/"}],
        "A TV writer on the show's influence.", "core", "include", "A documented talk on the show's legacy by a major successor.",
        details={"date": "2025-09", "event": "works/serlingfest-2025-in-his-own-words"}, cat="lectures/readings-panels", conf="medium")


# ------------------------------------------------------------------ SECOND PASS (2026-11-20)
LP = {"title": "Lightpainter: Twilight Zone On Location, part 1 (Paul Giammarco, 2012)", "url": "https://www.lightpainter.us/2012/11/twilight-zone-on-location-part-1/"}
real("zabriskie-point-death-valley", "Zabriskie Point, Death Valley", "filming-location",
     "The eroded badlands overlook in Death Valley National Park. Location photographers who matched frames from the episodes "
     "identify it as a backdrop for the asteroid in \"The Lonely\" (1959) and the alien-looking desert of \"I Shot an Arrow into "
     "the Air\" (1960). It is one of the park's most visited viewpoints and looks much as it did on screen.",
     [LP, {"title": "NPS: Death Valley in Movies and Television", "url": "https://home.nps.gov/deva/learn/historyculture/death-valley-in-movies-and-television.htm"}],
     "A specific, visitable filming spot inside the Death Valley location.", "core", "include",
     "Lets visitors stand where the episodes were shot; pairs with the park-wide Death Valley record.", conf="medium",
     city="Death Valley", region="California", country="US", lat=36.4207, lng=-116.8101, status="open",
     filmed=[{"ref": "1959/the-lonely", "note": "Asteroid exteriors (identified by frame matching)."},
             {"ref": "1959/i-shot-an-arrow-into-the-air", "note": "Desert where the astronauts believe they are stranded."}])

real("desolation-canyon-death-valley", "Desolation Canyon, Death Valley", "filming-location",
     "A narrow side canyon south of Furnace Creek in Death Valley National Park. Frame-matching location research places scenes "
     "of \"The Lonely\" and \"I Shot an Arrow into the Air\" here, and identifies it as the backdrop photographed for the landed "
     "rocket in \"The Little People,\" which was otherwise shot at MGM.",
     [LP], "A specific filming spot used by three episodes.", "core", "include",
     "Documented by location researchers with photographs; medium confidence because no studio record confirms it.", conf="medium",
     city="Death Valley", region="California", country="US", status="open",
     filmed=[{"ref": "1959/the-lonely", "note": "Asteroid scenes."}, {"ref": "1959/i-shot-an-arrow-into-the-air", "note": "Desert scenes."},
             {"ref": "1959/the-little-people", "note": "Backdrop plate for the landed rocket."}])

event("fathom-60th-anniversary-screenings-2019", "The Twilight Zone: A 60th Anniversary Celebration in cinemas (2019)", "anniversary", 2019,
      "Fathom Events and CBS Home Entertainment showed six restored episodes in more than 600 US cinemas for one night, Thursday, "
      "November 14, 2019: \"Walking Distance,\" \"Time Enough at Last,\" \"The Invaders,\" \"The Monsters Are Due on Maple Street,\" "
      "\"Eye of the Beholder\" and \"To Serve Man,\" with a new short documentary, \"Remembering Rod Serling.\"",
      [{"title": "Boxoffice Pro: Fathom Events celebrates 60th anniversary of The Twilight Zone", "url": "https://www.boxofficepro.com/fathom-events-celebrates-60th-anniversary-of-the-twilight-zone-with-classic-episodes/"},
       {"title": "Den of Geek: The Twilight Zone to screen in theaters for 60th anniversary", "url": "https://www.denofgeek.com/movies/the-twilight-zone-to-screen-in-theaters-for-60th-anniversary/"}],
      "The series' official 60th-anniversary event.", "core", "include", "An official, national anniversary event with a documented line-up.",
      details={"date": "2019-11-14", "organiser": "Fathom Events and CBS Home Entertainment", "venues": "600+ US cinemas"},
      categories=["events/anniversaries-festivals"])

lecture("madigan-serling-100th-birthday-2024", "\"Twilight Zone and Its Creator Rod Serling's 100th Birthday\" (Tim Madigan, 2024)", "lecture", 2024, "Tim Madigan",
        "Philosopher Tim Madigan gave a centennial talk on Serling's life and the series at St. John Fisher University in Rochester, New "
        "York, on October 31, 2024. Rochester is where Serling died in 1975, and Fisher had marked the show's 60th anniversary in 2019.",
        [{"title": "St. John Fisher University event listing", "url": "https://www.sjf.edu/events/twilight-zone-and-its-creator-rod-serlings-100th-birthday.php"}],
        "A centennial talk about the show and its creator.", "core", "include", "A dated academic talk for the centennial.",
        details={"date": "2024-10-31", "venue": "Golisano Gateway, St. John Fisher University, Rochester, New York"}, cat="lectures/academic")

lecture("serling-kpfk-interview-1970", "Rod Serling interviewed by Mark Davidson, KPFK (1970)", "interview", 1970, "Rod Serling",
        "A radio conversation recorded by Pacifica station KPFK in Los Angeles on March 13, 1970, in which Serling discusses his work as a "
        "science-fiction writer. Pacifica Radio Archives holds the tape (item BB5150).",
        [{"title": "Pacifica Radio Archives: Serling, Rod (subject listing)", "url": "https://pacificaradioarchives.org/subject-tags/serling-rod"}],
        "Serling on his science-fiction writing, in his own voice.", "related", "maybe",
        "An interview rather than a lecture and only available by request; keep if you want every recording of Serling.",
        details={"date": "1970-03-13", "station": "KPFK, Los Angeles", "archive_id": "Pacifica BB5150"},
        media=[{"type": "audio", "title": "Pacifica Radio Archives BB5150", "url": "https://pacificaradioarchives.org/subject-tags/serling-rod",
                "host": "Pacifica Radio Archives", "date": "1970-03-13", "rights": "link-only", "note": "Catalogue entry; copies by request."}],
        cat="lectures/interviews-conversations", conf="medium")

# ------------------------------------------------------------------ write
SUB = {"in-story": "In-story places", "event-venue": "Lecture and event venues", "filming-location": "Filming locations",
       "serling-place": "Rod Serling's places", "premiere": "Premieres", "marathon": "Broadcasts and marathons",
       "broadcast": "Broadcasts and marathons", "trial": "Accident and trial", "exhibition": "Exhibitions",
       "anniversary": "Anniversaries and festivals", "festival": "Anniversaries and festivals", "history": "History",
       "lectures/serling-lectures": "Rod Serling's lectures", "lectures/academic": "Academic talks",
       "lectures/classroom": "In the classroom", "lectures/readings-panels": "Readings and panels", "lectures/interviews-conversations": "Interviews and conversations"}


def subcat(coll, d):
    for c in d.get("categories", []):
        if c in SUB: return SUB[c]
    return SUB.get(d.get("kind") if coll == "locations" else d.get("subtype"), "Other")


def main():
    over_path = ROOT / "data" / "review" / "assessment-overrides.yaml"
    over = yaml.safe_load(over_path.read_text()) or {}
    for coll, rid, data, a in REC:
        data = {k: v for k, v in data.items() if v is not None}
        p = C / coll / f"{rid}.yaml"
        if p.exists() and not (sys.argv[2:] and sys.argv[2] == "--force"):
            print("EXISTS, skipping:", p); continue
        p.write_text(yaml.safe_dump(data, sort_keys=False, allow_unicode=True, width=110), encoding="utf-8")
        a["subcategory"] = subcat(coll, data)
        over[f"{coll}/{rid}"] = a
    over_path.write_text(yaml.safe_dump(dict(sorted(over.items())), sort_keys=False, allow_unicode=True, width=110), encoding="utf-8")
    print(len(REC), "records")

main()
