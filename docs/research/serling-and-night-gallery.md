# Rod Serling and Night Gallery research notes (2026-11-19)

## What this pass adds

- **Night Gallery, complete.** Series record, the 1969 pilot film, all 43 broadcast episodes (`films/night-gallery-s<season>e<NN>`),
  the two sketches first seen in syndication, and a home-media record. 98 segments in all, each with writer(s), director,
  four lead cast, an own-words summary and, where there is one, the source story and author (Lovecraft, Leiber, Matheson,
  van Vogt, Blackwood, Derleth, Kornbluth and others). New page: `/night-gallery/`.
- **Rod Serling beyond The Twilight Zone.** 20 live television plays (Kraft, Studio One, U.S. Steel Hour, Playhouse 90 and more),
  11 TV films, pilots and series, 11 feature films (9 of them existing spreadsheet records now filled in), The Loner with all
  26 episodes, 11 hosting, narration and acting credits, 4 radio credits, his commercials, and 14 honors. New page: `/rod-serling/`.
- **People.** A full biography and dated timeline for Rod Serling (WWII service, Antioch, Cincinnati radio, the censorship fights,
  teaching, death), plus Night Gallery's painters, composers and producers, The Loner's executive producer, and Serling's brother and daughters.
- **Schema (additive only).** Film segments can carry `summary`, `source_title` and `source_authors`; people can carry `timeline`.
  Person pages show the timeline and list source-story authors under a "Source story" role.

## Sources

Wikipedia (Rod Serling, Night Gallery, Night Gallery (film), List of Night Gallery episodes, The Loner), the Museum of
Broadcast Communications Encyclopedia of Television, Encyclopaedia Britannica, CTVA and Shout! Factory. Every record names its sources.

## Known gaps and judgment calls

- Segment summaries are my own words built from the episode list's one-line descriptions; a few add plot detail from general knowledge. Worth a spot check.
- Directors and casts for most live TV plays and films are not on the source pages used; where given they are well-documented credits
  (marked `research_confidence: medium` when only one source backs the record).
- Walk of Fame star: Wikipedia says 1985; the music/merch PR's record says 1988. Needs one check.
- Serling's name order differs by source (Rodman Edward vs Edward Rodman); the record follows Wikipedia.
- Low-confidence records: Time Travelers (1976), The Oath: The Sad and Lonely Sundays, Jeopardy Run, Monsters! Mysteries or Myths?, Inkpot Award.
- `films/night-gallery.yaml` also exists in the TV/film PR with a one-line summary; this PR's fuller version should win when both merge.
- Not done: The Sixth Sense episodes repackaged as Night Gallery, the unproduced Night Gallery scripts, per-episode trivia and syndication
  edit details (Skelton and Benson's After-Hours Tour is the reference), Serling's 1950s scripts beyond the ~20 best documented
  (he sold over 200), and IMDb ids for the new records.
