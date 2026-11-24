# Content plan: Discover (History and Legacy)

**Date:** 2026-11-24 · **Status:** approved on Adam's behalf overnight. Adam's note (03:23 UTC): "act autonomously for the
next 6 hours, approving things by your best judgement rather than waiting for my approval. Be thorough." Every
choice below is in *Decided here* for him to review in the morning.
**Checklist:** docs/RESEARCH_CHECKLIST.md, Discover > History and Legacy
**Follows:** Adam's inclusion rule of 2026-11-23, decision 0006 ("Compared to" for comparison-only links), "media are
never categories", and the official/unofficial split.

---

## 1. Where Discover stands today

**History** (141 placements, all official) has five shelves. Problems found on 24 November 2026:
- *Production and broadcast history* (35) and *Honors and awards* (34) are one long A to Z list each: the 1985 and
  2019 revivals, foreign dubs and Emmys are mixed together.
- *Premieres* is A to Z, though the point of the shelf is the order things happened in.
- Duplicates: two records for "The Time Element" (a production record repeats the film record), two for the holiday
  marathons, two for Cayuga Productions (a works record repeats the organization), and the 2013 TV Guide and WGA
  rankings each appear twice (once in History, once in Legacy's "In everyday language").
- Exact dates missing on Seven Days in May, Planet of the Apes and the Mike Wallace interview, although the site's
  own film and essay records have them.

**Legacy** (842 placements) has nine shelves. Problems found:
- The eight remakes made for the 1985, 2002 and 2019 series (the franchise remaking its own episodes) are marked
  unofficial.
- Eight records sit on two Legacy shelves at once: a parody kind put them on *Parodies* while a hand-placed category
  put them on *References* or *Homages*.
- *Fan-made* has three entries and no groups; an animated fan film and a fan game are elsewhere.
- One link (Bart's Comet and "The Monsters Are Due on Maple Street") has no decision and is hidden.

## 2. Structure

**History**

| Shelf | Order and groups |
|---|---|
| Rod Serling's life | A to Z (the Timeline gives the order) |
| Honors and awards | Emmy Awards · Hugo Awards · Other awards and honors · Halls of fame and rankings · Memorials |
| Premieres | In date order |
| Production and broadcast history | The Twilight Zone (1959) · The Twilight Zone (1985) · The Twilight Zone (2019) · Around the world · The Tower of Terror |
| Trials, lawsuits and rights | Unchanged (Censorship · Lawsuits and credit disputes · Rights and ownership · The 1982 accident and trial) |

**Legacy** keeps its nine shelves. *Fan-made* is grouped Fan films · Fan edits and supercuts · Fan audio dramas · Fan
games. Each record sits on one Legacy shelf. The existing evidence filter (confirmed by the makers, documented, noted
by fans) stays the way to narrow the big shelves; groups by evidence were considered and left out because the
filter already does that job.

## 3. On every page
Date (exact where a source gives it), what happened, who was involved (linked), and a source. Legacy entries name the
later work, the episode it draws on, the kind of link and the evidence.

## 4. Media and documents that attach
Interviews (the Mike Wallace interview's transcript record), award citations and press coverage attach to the
milestone they document, link-only.

## 5. Cross-links
Milestones to the series, films and people they concern; Cayuga Productions to Organizations; remakes to both
episodes.

## 6. Sources
The records' own sources (Wikipedia articles on each film and series, Den of Geek, the Television Academy, the Hugo
Awards, TV Guide, the WGA), and for Legacy the makers' statements, published articles, and fan wikis labelled as such.

## 7. Blessing-ready
The franchise's own remakes are labelled official; tributes, parodies and fan work are credited to their makers and
labelled unofficial. A resemblance is never presented as an influence. Fan work is linked, never copied.

## 8. Steps
One pull request: groups and order, the official remakes, one shelf per record, duplicates merged, dates filled,
screenshots.

## 9. Acceptance checks
- Production history and honors are grouped; premieres are in date order.
- No record appears twice on Legacy, and no duplicate milestone appears in History.
- The 1985, 2002 and 2019 remakes are on the official side.
- CI passes: check:data, tokens, both builds, check:site, check:a11y.

---

## Decided here (Adam reviews later)
- The groups and order above.
- **Remakes for the later series are official:** the eight episodes the 1985, 2002 and 2019 series remade from the
  original are the franchise's own work.
- **One Legacy shelf per record:** a record placed by hand on a Legacy shelf (a gag in a comic, a passing reference)
  stays there and is not also listed under Parodies. The Simpsons' "Treehouse of Horror" record moves from
  "Public uses" to Parodies.
- **Rankings are honors:** TV Guide's 2013 list (No. 5) and the WGA's 101 Best-Written (No. 3) are under History >
  Honors > Halls of fame and rankings. The fuller record of each pair is kept, the other points to it, and its
  sources were carried over. Legacy's "Dictionaries and rankings" group is now "Dictionaries".
- **Duplicates merged:** the Time Element production record into the film record (Bert Granet as producer and the
  Season 1 Blu-ray bonus carried over, with the series article as source; a broken Wikipedia link fixed); the holiday
  marathon works record into the films record (KTLA's program director's claim and WPIX's New Year's Eve possibility
  carried over); the Cayuga Productions works record into the organization (its MGM offices and winding-up carried
  over, credited to the fan wiki it came from).
- **Exact dates from the site's own records:** Seven Days in May 12 February 1964 and Planet of the Apes 8 February
  1968 (each film's Wikipedia article), the Mike Wallace interview 22 September 1959 (Wikipedia, The Mike Wallace
  Interview), now linked to its transcript record.
- **Fan-made:** the animated fan film *Reap What You Sow* (Dread Central) and the Tower of Terror fan Flash game join
  the shelf; the game also stays under Play.
- The Bart's Comet link is included: the show's executive producer named the episode on the DVD commentary (as cited
  by Wikipedia).

## Waiting on Adam
- Nothing blocking.

## Found, for later
- **2026-11-24:** every item below now carries a mark (Done, Can't with the reason, Read round, or Adam) in
  docs/plans/finish-open-items-2026-11-24.md, which is the current list.
- **Walk of Fame year:** the record says 1988; some sources say 1985. Needs the Walk of Fame's own listing.
- **Award nominations:** only some nominations are recorded; the 1985-89 revival's Emmy nominations are not.
- **Ratings history** for each season is not recorded.
- **Muppet and Sesame Street theme hums** (Sesame Street episodes 1800, 2403, 3055; Abby's Amazing Adventures 5017;
  Muppet Babies "Elm Street Babies") are on the Muppet Wiki's Twilight Zone page but have no records; the larger
  Muppet spoofs already do.
- **Rugrats:** TV Tropes says an episode in which Angelica makes a promise to her mother "parallels" "The Silence";
  the episode is not named. A "Compared to" candidate once identified.
- **MAD Magazine and MADtv:** no Twilight Zone parody was confirmed in the pages read (Wikipedia's recurring features
  in Mad; TV Tropes' MADtv page could not be read). Still open.
- **Fan-noted links:** about 200 of the 575 links rest on fan wikis alone; they are labelled and can be filtered.
- **Evidence groups** on References (350 entries) could replace the filter if Adam prefers to see them grouped.
