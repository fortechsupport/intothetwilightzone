# Research round 1: Rod Serling's television plays (2026-11-21)

Sources read: Wikipedia "Rod Serling"; "List of Playhouse 90 episodes" (read fully); "List of Studio One episodes" (verbatim to
season 7, episode 314); "List of Hallmark Hall of Fame episodes" (verbatim to episode 157); "Westinghouse Desilu Playhouse";
"Kraft Television Theatre"; "Lux Video Theatre", "Climax!", "Armstrong Circle Theatre", "Danger (TV series)" (no
episode-level Serling credits); "Patterns (film)"; "Requiem for a Heavyweight".
Not reachable: lists for Kraft, The U.S. Steel Hour and Lux episodes (no such Wikipedia pages); "The United States Steel
Hour" article (fetch limit).

## Added (pending, tag research-2026-11-21, in teleplays.json)
- Buffalo Bill Is Dead, Studio One, 23 Nov 1953, dir. Franklin J. Schaffner
- U.F.O., Studio One, 6 Sep 1954, dir. Mel Ferber
- Horace Mann's Miracle, Hallmark Hall of Fame, 8 Mar 1953, dir. Albert McCleery
- Man Against Pain, Hallmark Hall of Fame, 21 Jun 1953, dir. Albert McCleery, with Tod Andrews
- Nightmare at Ground Zero, Playhouse 90, 15 May 1958, dir. Franklin Schaffner; teleplay by Serling and Paul Monash from
  the book by John C. Clark and Robert Cahn

## Already on file (matched, not changed)
All 11 Playhouse 90 plays in the list, The Arena and The Strike (Studio One), Patterns and Old MacDonald Had a Curve (Kraft),
The Time Element (Desilu Playhouse), A Storm in Summer (Hallmark), and the rest in the Rod Serling article.

## Found, for later (existing records are locked, so these wait for Adam or an unlock)
- Directors and exact dates for the Playhouse 90 records from the episode list: Forbidden Area (4 Oct 1956, John
  Frankenheimer); Requiem for a Heavyweight (11 Oct 1956, Ralph Nelson; Jack Palance, Keenan Wynn, Kim Hunter, Ed Wynn;
  Peabody Award, the first for an individual television script, and Emmys for Nelson and Serling); The Comedian (14 Feb 1957,
  Frankenheimer; story by Ernest Lehman); The Dark Side of the Earth (19 Sep 1957, Arthur Penn); Panic Button (28 Nov 1957,
  Schaffner); Bomber's Moon (22 May 1958, Frankenheimer); A Town Has Turned to Dust (19 Jun 1958, Frankenheimer); The Velvet
  Alley (22 Jan 1959, Schaffner); The Rank and File (28 May 1959, Schaffner); In the Presence of Mine Enemies (18 May 1960,
  Fielder Cook).
- Patterns (Kraft): restaged live on 9 Feb 1955 (Kraft Television Theatre episode table; the prose says "three weeks
  later"); cast led by Everett Sloane, Richard Kiley, Ed Begley; Serling's Emmy for the script.
- The Arena (Studio One, 9 Apr 1956, dir. Franklin J. Schaffner; Wendell Corey, Chester Morris) came from a summary of the
  unread part of the page: verify before using.
- "Nightmare at Ground Zero" is on file as a 1953 Suspense play (source: Museum of Broadcast Communications) and now also as
  the 1958 Playhouse 90 play. Whether they are the same story reworked is not established.
- Still to find: Serling's plays for Lux Video Theatre, Armstrong Circle Theatre, The U.S. Steel Hour beyond Noon on Doomsday
  and The Rack, and his early local and radio-to-TV work. Wikipedia does not list them by episode; next sources to try are the
  Rod Serling Memorial Foundation and the Paley Center catalogue.

## Round 1 leftovers (13:10 UTC): the Rod Serling Memorial Foundation's filmography

Source: https://rodserling.com/rod-serlings-complete-filmography/ (213 television entries, 1952–1976). 47 plays not on file
were added as pending records (teleplays-foundation.json), each citing that page. Wikipedia's Steel Hour, Kraft and Lux
articles named no further Serling plays (Lux names none at all); The Rack is dated 12 April 1955 in a Steel Hour photo caption.

Conflicts for Adam (records not changed):
- "The Director" (1955): on file as The Jane Wyman Show; the Foundation lists it on Fireside Theater, 13 September 1955,
  dir. Herschell Daugherty, with Jack Carson. (Fireside Theatre was renamed The Jane Wyman Show in 1955 — an inference, unverified.)
- "Nightmare at Ground Zero": the Foundation lists only the Suspense play (18 August 1953, dir. Robert Stevens), not the
  1958 Playhouse 90 one taken from Wikipedia's episode list. One of the two sources is wrong; unresolved.
- "Old MacDonald Had a Curve": the Foundation spells it "Old MacDonald Has a Curve" and dates it 5 August 1953.

Found, for later: The Oath: "Sad and Lonely Sundays" (1976). The UCLA finding aid for the Rod Serling papers (OAC ark:/13030/kt5489n8zx)
has no title list online.

Correction (2026-11-23): The Loner's episodes were already on file. All 26 are segments of src/content/films/the-loner.yaml, each
with its writer, director and cast from Wikipedia and CTVA, which agree on every writer and director credit (Serling wrote 15).
The note above that they were not added was wrong. CTVA and Wikipedia both title episode 9 "The Sheriff of Fetterman's
Crossing"; the Foundation's "at" is a variant.

## The three conflicts, resolved (2026-11-23, Adam approved each)

- "The Director": kept on The Jane Wyman Show. Wikipedia's Fireside Theatre article confirms the anthology was hosted by Jane
  Wyman from 1955 (announced 2 April 1955) and billed as Jane Wyman Presents The Fireside Theatre, later The Jane Wyman Show;
  CTVA titles the 1955–56 season "Jane Wyman Presents Fireside Theatre". Added the Foundation's date (13 September 1955),
  director Herschell Daugherty and Jack Carson. Neither Wikipedia nor CTVA's index lists the episode itself.
- "Nightmare at Ground Zero": both kept. The 1953 Suspense play now carries the Foundation's date (18 August 1953) and director
  Robert Stevens. The 1958 Playhouse 90 play is marked unverified (research_confidence low): Wikipedia's article on it credits
  Serling and Paul Monash, from the book by John C. Clark and Robert Cahn, and cites the Paley Center and the Port Huron Times
  Herald and Register-Guard of May 1958, which we have not read. The UCLA Film & Television Archive's Playhouse 90 pages do not
  mention it. Next source to try: the Paley Center catalogue entry.
- "Old MacDonald Had a Curve": "Had" stays the title, "Has" is an alternate title (aka), date 5 August 1953 from the Foundation.

Found while doing this: film records had no `writing_credit_note` or `aka` in the schema, so the credit notes on 48 records
(the Foundation plays among them) were silently dropped. Both fields are now in the schema and shown on film pages.
