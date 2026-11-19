# TV and film research pass (2026-11-19)

This pass filled gaps in the Television and Movies parts of the site: all four series, the official films and
specials, works inspired by specific episodes, and homages and parodies in other film and TV.

## What changed

- **Episodes (329/329 updated):** every episode and 1985 segment now has an original, spoiler-light synopsis,
  themes, and at least one web source. 91 records gained a `writing_credit_note` naming the source story
  (title, author and year where confirmed). Missing production codes were filled. All are `locked: true`.
- **Films (3 updated, 74 new):** full segment credits for *Twilight Zone: The Movie*, the two stories of
  *Rod Serling's Lost Classics* (1994, CBS TV film), the American Masters documentary (now `documentary`), plus
  new records for *The Time Element* (1958 pilot), *The Happy Place* (unproduced first pilot), *Tower of Terror*
  (1997), the 2017 Almeida stage play, the 60th-anniversary cinema event and documentary, the long-running
  Warner Bros. feature in development, and the holiday marathons. Other shows' episodes and sketches that
  reference the series are stored as `tv-episode`, `tv-segment` or `sketch` with `parent_series`.
- **Connections (51 updated, 82 new):**
  - 10 links inside the franchise (1985, 2002 and 2019 remakes and sequels of 1959 episodes) plus the three
    Twilight Zone: The Movie remakes.
  - The 49 spreadsheet links were checked: 3 are now confirmed by the creator (Us, Child's Play, Jacob's
    Ladder), 23 documented, 23 still fan-noted because no source was found.
  - About 70 new inspired-by, homage and parody links (Simpsons Treehouse of Horror, Futurama, Family Guy, SNL,
    Black Mirror, Toy Story 4, Gilmore Girls, Felicity and more).

### Follow-up decisions (applied)

- **Source-story authors** now live in a new `source_authors` field, shown as "Based on a story by" on episode
  pages and on person pages as "Source story". They stay in `writers` only when they also wrote the teleplay
  (e.g. Matheson's "Steel", Beaumont's "The Howling Man"). 70 episodes changed. "Story by" credits for original
  TV stories stay in `writers`.
- **Unsourced links** stay but are labelled "Unconfirmed: fan-noted, no source yet" everywhere on the site.
- **Trivia:** a new `trivia` field (each fact needs a source) is shown as "Did you know" on episode pages.
  39 sourced facts were added across 30 episodes.
- **Synopsis re-check:** the 59 1985 season 1 segments and 20 2019 episodes were checked against the Wikipedia
  episode lists. 13 were rewritten. Caveat: the 1985 list has only one-line summaries, so smaller details in
  those synopses are checked against the premise only.

### Legal history and international versions

- New `history` and `international_titles` fields on series and films, shown as "History and legal record" and
  "Around the world" sections.
- *Twilight Zone: The Movie*: 13 dated events covering the 1982 helicopter accident, the illegal hiring of the
  child actors, the labor fines, the NTSB report, the 1986-87 manslaughter trial and acquittal, the civil
  settlements, and the safety reforms that followed.
- 1959 series: the plagiarism suits over "Static" and "Long Distance Call", and the current ownership. Episode
  trivia covers the suits over "The After Hours" and "The Miniature", and the licensing of "An Occurrence at Owl
  Creek Bridge".
- 31 international titles across the four series and the film. Many have only a title, with no first
  broadcaster or year, because the research hit the page-fetch limit. Gaps: German titles of the revivals,
  first broadcasters for Italy and Spain, the Netherlands, Sweden, Portugal and the UK.

Raw research is in `data/research/tv-film/`. The merge script is `scripts/research/merge_tv_film.py`
(`python3 scripts/research/merge_tv_film.py <snapshot src/content> data/research/tv-film <out>`, then run
`scripts/research/apply_source_authors.py` from `src/content/episodes`), and
`scripts/research/fixups.json` holds the manual review decisions (aliases, name spellings, dropped items).

## Needs a decision or a second look

1. **Writer credit conflicts** (resolved by `source_authors`, above). The table below shows the original
   differences between the spreadsheet and the research.
2. **Name spellings normalised:** Ryszard Bugajski, OCee Ritch, Robert Downey Sr., Allison Liddi-Brown,
   David R. Ellis, Alonso Alvarez-Barreda, Emily C. Chang. Kept as credited: "Jus Addiss", "Alan Smithee"
   (Paladin of the Lost Hour, actually Gilbert Cates), "Johnson Smith" (George Clayton Johnson's pen name).
3. **1985 S2 episode 9 segment order:** Wikipedia has Private Channel before Shelter Skelter; the spreadsheet
   has the reverse. Spreadsheet order kept.
4. **Weak spreadsheet links** with no source found: Looper / Back There, Minority Report / A Most Unusual
   Camera, Toy Story / Five Characters in Search of an Exit, Blazing Saddles / Mr. Denton on Doomsday. Kept and
   labelled Unconfirmed.
5. **Different-episode claims:** sources tie *Final Destination* to "And When the Sky Was Opened" and *The Sixth
   Sense* to "The Hitch-Hiker" (both added alongside the spreadsheet links). *Magic* is tied by one source to
   "Caesar and Me" rather than "The Dummy". *The Box*, *Real Steel* and *Mercy* adapt the same source stories
   rather than the episodes.
6. **1985 season 1 synopses:** checked against one-line summaries only (see above).
7. **Unverified:** the 2019 documentary's credits, which episodes the stage play adapts, and the Medium episode
   title ("Still Life", S2E9, aired 2005-11-21).

## Franchise aspects not yet on the site (suggested)

- **For this area:** source stories as their own records (title, year, magazine), home video releases, and
  Night Gallery as its own section.
- **For other areas:** the Tower of Terror rides (locations/merchandise), Serling's 1959 Mike Wallace interview
  (people/quotes), the radio dramas.

## Conflict table

| Record | Field | Spreadsheet | Research says |
|---|---|---|---|
| `1959/time-enough-at-last` | writers | Lynn Venable, Rod Serling | Rod Serling |
| `1959/and-when-the-sky-was-opened` | writers | Richard Matheson, Rod Serling | Rod Serling |
| `1959/what-you-need` | writers | Lewis Padgett, Rod Serling | Rod Serling |
| `1959/the-four-of-us-are-dying` | writers | George Clayton Johnson, Rod Serling | Rod Serling |
| `1959/third-from-the-sun` | writers | Richard Matheson, Rod Serling | Rod Serling |
| `1959/i-shot-an-arrow-into-the-air` | writers | Madelon Champion, Rod Serling | Rod Serling |
| `1959/the-hitch-hiker` | writers | Lucille Fletcher, Rod Serling | Rod Serling |
| `1959/people-are-alike-all-over` | writers | Paul Fairman, Rod Serling | Rod Serling |
| `1959/execution` | writers | George Clayton Johnson, Rod Serling | Rod Serling |
| `1959/the-chaser` | writers | John Collier, Robert Presnell Jr. | Robert Presnell Jr. |
| `1959/twenty-two` | writers | Bennett Cerf, Rod Serling | Rod Serling |
| `1959/the-odyssey-of-flight-33` | directors | Jus Addiss | Justus Addiss |
| `1959/static` | writers | Oceo Ritch, Charles Beaumont | Charles Beaumont |
| `1959/the-rip-van-winkle-caper` | directors | Jus Addiss | Justus Addiss |
| `1959/the-new-exhibit` | writers | Charles Beaumont, Jerry Sohl | Charles Beaumont |
| `1959/of-late-i-think-of-cliffordville` | writers | Malcolm Jameson, Rod Serling | Rod Serling |
| `1959/dead-mans-shoes` | writers | Charles Beaumont, Oceo Ritch | Charles Beaumont |
| `1959/a-kind-of-a-stopwatch` | writers | Michael D. Rosenthal, Rod Serling | Rod Serling |
| `1959/living-doll` | writers | Charles Beaumont, Jerry Sohl | Charles Beaumont |
| `1959/the-old-man-in-the-cave` | writers | Henry Slesar, Rod Serling | Rod Serling |
| `1959/a-short-drink-from-a-certain-fountain` | writers | Lou Holz, Rod Serling | Rod Serling |
| `1959/ninety-years-without-slumbering` | writers | Johnson Smith, Richard De Roy | Richard De Roy |
| `1959/the-self-improvement-of-salvadore-ross` | writers | Henry Slesar, Jerry McNeely | Jerry McNeely |
| `1959/an-occurrence-at-owl-creek-bridge` | writers | Ambrose Bierce, Robert Enrico | Robert Enrico |
| `1959/queen-of-the-nile` | writers | Charles Beaumont, Jerry Sohl | Charles Beaumont |
| `1959/mr-garrity-and-the-graves` | writers | Mike Korologos, Rod Serling | Rod Serling |
| `1985/if-she-dies` | writers | David Carren | David Bennett Carren |
| `1985/if-she-dies` | directors | John D. Hancock | John Hancock |
| `1985/examination-day` | writers | Henry Slesar, Philip DeGuere Jr. | Philip DeGuere, Henry Slesar |
| `1985/teachers-aide` | directors | B. W. L. Norton, Robert Downey Sr. | B. W. L. Norton |
| `1985/paladin-of-the-lost-hour` | directors | Alan Smithee | Gilbert Cates |
| `1985/the-beacon` | writers | Martin Pasko, Rebecca Parr Cioffi | Martin Pasko, Rebecca Parr |
| `1985/night-of-the-meek` | directors | Martha Coolidge, Ryszard Bugajski | Martha Coolidge |
| `1985/but-can-she-type` | writers | Martin Pasko, Rebecca Parr Cioffi | Martin Pasko, Rebecca Parr |
| `1985/tooth-and-consequences` | directors | Robert Downey | Robert Downey Sr. |
| `1985/button-button` | writers | Richard Matheson, Logan Swanson | Richard Matheson |
| `1985/private-channel` | episode | 09c | 09b |
| `1985/shelter-skelter` | episode | 09b | 09c |
| `1985/room-2426` | directors | Richard Bugajski | Ryszard Bugajski |
| `2002/the-pool-guy` | directors | Paul Shapiro, Brad Turner | Paul Shapiro |
| `2002/hunted` | directors | Patrick R. Norris | Patrick Norris |
| `2002/mr-motivation` | writers | Steven Aspis, Brent V. Friedman | Brent V. Friedman |
| `2002/sanctuary` | directors | Patrick R. Norris | Patrick Norris |
| `2002/found-and-lost` | writers | Bill Mumy, Frederick Rappaport | Frederick Rappaport |
| `2002/tagged` | writers | Charlie Largent, Michael Angeli | Michael Angeli |
| `2002/how-much-do-you-love-your-kid` | directors | Allison Liddi | Allison Liddi-Brown |
| `2002/the-placebo-effect` | writers | Rebecca Swanson, Brent V. Friedman | Brent V. Friedman |
| `2002/eye-of-the-beholder` | directors | David Ellis | David R. Ellis |
| `2002/the-executions-of-grady-finch` | writers | Frederick Rappaport, Ira Steven Behr, Brent V. Friedman | Ira Steven Behr, Brent V. Friedman |
| `2002/homecoming` | writers | Bradley Thompson, David Weddle, Michael Angeli | Michael Angeli |
| `2002/sunrise` | writers | Katrina Cabrera Ortega, Frederick Rappaport | Frederick Rappaport |
| `2019/meet-in-the-middle` | writers | Emily Chang, Sara Amini | Emily C. Chang, Sara Amini |
| `2019/ovation` | writers | David Weil, Emily Chang, Sara Amini | Emily C. Chang, Sara Amini |
| `2019/among-the-untrodden` | writers | Heather Anne Campbell, Peter Oberth | Heather Anne Campbell |
| `2019/a-small-town` | directors | Alonso Alvarez | Alonso Alvarez-Barreda |
| `2019/try-try` | directors | Jen McGowan | Jennifer McGowan |
