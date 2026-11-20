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

## Second pass: everything related (2026-11-19)

Adam asked for everything even remotely related, to curate later. Every record from this PR now carries
`relevance` (core / related / tangential, same field as the print PR) and teleplays carry `tags: [teleplay]`.

- The Sixth Sense (1972), all 25 episodes, and its link into Night Gallery syndication.
- Night Gallery parodies: Treehouse of Horror IV, Tiny Toons' Night Ghoulery (with `parody` connections to `films/night-gallery`).
- Unproduced Serling scripts (two Night Gallery scripts, No Christmas This Year).
- The 1982 Twilight Zone accident and trial (works, `subtype: history`, relevance core).
- The Planet of the Apes franchise (tangential).
- Other work by Twilight Zone writers (related): Matheson, Beaumont, George Clayton Johnson, Earl Hamner Jr., Bradbury, Jerome Bixby.
- Anthology family tree (tangential, `tags: [anthology-family]`): 26 radio and TV anthologies from Lights Out to Cabinet of Curiosities.
- Local titles in five countries and "twilight zone" as an everyday phrase.
- Walk of Fame star: the official walkoffame.com page gives the ceremony date as October 6, 1988 (Wikipedia's 1985 is wrong). The music/merch
  and people/places PRs already use 1988.

Gaps: anthology records cite the Wikipedia anthology overview plus each series' own article link, but per-series TZ connections
(shared writers, explicit influence) are not yet sourced; first-broadcast dates for international versions; dated examples of the phrase.
