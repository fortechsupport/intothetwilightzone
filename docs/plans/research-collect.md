# Content plan: Collect (Artwork and Merchandise)

**Date:** 2026-11-24 · **Status:** approved on Adam's behalf overnight. Adam's note (03:23 UTC): "act autonomously for the
next 6 hours, approving things by your best judgement rather than waiting for my approval. Be thorough." Every
choice below is in *Decided here* for him to review in the morning. · **Checklist:** docs/RESEARCH_CHECKLIST.md,
Collect > Artwork and Merchandise
**Follows:** "media are never categories" (an interview, a radio segment or an advertisement attaches to its record),
"official vs unofficial" (a record's `official:` wins), decision 0005 (records with sources are included), and the
copyright rule (artwork and products are described and linked, never copied).

---

## 1. Where Collect stands today

Artwork has 81 placements of 60 records on eight shelves; Merchandise has 126 placements of 98 records on eight.
Problems found on 24 November 2026:
- **Double placement.** 27 records sit on two shelves at once: every Trick or Treat mask is on both *Masks* and
  *Collectibles*; tin totes and sheet music on *Collectibles* and *Other merchandise*; the Night Gallery title
  sequence on *Title design* and *Night Gallery paintings*; gallery shows on *Art and illustration* and Events.
- **"Other merchandise" is a drawer of things that are not merchandise:** a book about the music, the CBS stock-music
  library, two radio segments and a podcast episode about the theme, a list of licensed songs, the 2019 Super Bowl
  advertisement, 1959 trade-press pages, 1983 college newspapers, a database of theme covers, and ten home video
  releases that belong on *Home video*.
- **Everything is marked official.** Merchandise is official unless a record says "unlicensed", so an artist's pin
  set "inspired by" an episode, a fan LEGO proposal and prints whose licence no source states sit on the official
  shelf. Artists' own prints sit beside the studio's posters.
- **Duplicates:** the 2018 "Eye of the Beholder" mask auction (two records), Matheson's "Once Upon a Time" script
  archive at Heritage (two records), the 2019 Super Bowl spot (a works record repeats the films record).
- **Home video is thin:** 14 releases, ten of them misfiled; no VHS, and nothing for the 2002 series.
- **Night Gallery paintings:** eight paintings have records; the show had one for nearly every segment.

## 2. Structure

Each shelf shows official items first and "Unofficial and inspired" ones below (the site's split). A record sits on
exactly one shelf, chosen from its subtype.

**Artwork**

| Shelf | What goes on it | Groups |
|---|---|---|
| Posters, key art and prints | Studio posters and key art; art prints (licensed where a source says so, otherwise unofficial) | Posters and key art · Art prints |
| Title design | The opening sequences of every series | (A to Z) |
| Cover and comic art | Comic and magazine covers and interior art | Comics · Magazines |
| Night Gallery paintings | The paintings, and the book and talks about them | The paintings · About the paintings |
| Make-up and production design | Make-up and effects designs (William Tuttle's work) | (A to Z) |
| Props and costumes | Surviving pieces: props, costumes, make-up appliances, matte paintings, scripts | Surviving pieces · Sold at auction · In museums and collections · Reused props |
| Art and illustration | Artists and works inspired by the show; art made for the revival's campaigns | (A to Z) |

Gallery shows move to **Attend > Events > Exhibitions** (they are events), linked from the Artwork page.

**Merchandise**

| Shelf | What goes on it | Groups |
|---|---|---|
| Toys and figures | Action figures, bobbleheads, vinyl figures | Bif Bang Pow! · Sideshow · Funko · Other makers |
| Prop replicas | Licensed replicas of props | (A to Z) |
| Trading cards | Card sets | (A to Z) |
| Masks and costumes | Masks to wear | (A to Z) |
| Household and apparel | Clothing, drinkware, pins, decals, ornaments | Clothing · Mugs and drinkware · Pins, decals and ornaments |
| Collectibles and souvenirs | Tin totes, wooden figure sets, sheet music, Tower of Terror souvenirs | Tower of Terror souvenirs · Sheet music · Other collectibles |
| Home video | Every VHS, laserdisc, DVD and Blu-ray release, one record per release or set | The Twilight Zone (1959) · Twilight Zone: The Movie (1983) · The Twilight Zone (1985) · The Twilight Zone (2002) · The Twilight Zone (2019) · Night Gallery |

*Other merchandise* and *Other artwork* stay as catch-alls for anything new that fits nowhere, and are hidden when empty.

**Where the misfiled records go**

| Record | Goes to | Why |
|---|---|---|
| Wissner, *A Dimension of Sound* (2013) | Read > Books | It is a book |
| CBS Music Library and the stock-music practice | Discover > History > Production history | How the show was scored |
| Uses of the theme in other films and TV | Discover > Legacy > In everyday language, "The theme as shorthand" | It is about the theme as shorthand |
| Composers Datebook, The Score #906, The Goldsmith Odyssey episode | Content (audio) on the theme's records, in the Media Library | Media attach to what they are about |
| Tunefind song lists (2019), cover and sample indexes | Content (link) on the 2019 series and the theme | Links are content |
| 2019 Super Bowl spot, 1959-60 trade press, 1983 college newspapers | Content (advertisement) on the 2019 series, the 1959 series and the 1983 film | Adam's rule: advertising is content |

## 3. On every page
What it is, maker or artist, year, licence (stated only where a source states it), edition size where known, the
episode it depicts (linked), and for surviving pieces the provenance and sale. Images are never copied: each record
links to the maker's, auction house's or museum's own page.

## 4. Media and documents that attach
Auction catalogues, museum records, makers' announcements and reviews of releases attach to their record and appear
in the Media Library, link-only.

## 5. Cross-links
Makers (Bif Bang Pow!, Sideshow, Funko, Rittenhouse, Trick or Treat Studios, Image Entertainment, Kino Lorber) to
Organizations; artists and designers (William Tuttle, Tom Wright, Jaroslav Gebr, Tom Whalen) to People; depicted
episodes to their pages; home video releases to the series and films they contain.

## 6. Sources
Makers' and retailers' product pages, auction lots (Heritage, Prop Store, Bonhams, Nate D. Sanders), museum
collection pages, DVD Talk and other release reviews, nightgallery.net, the Twilight Zone Museum, contemporary press.

## 7. Blessing-ready
Every product names its maker and, where a source states it, its licensor. Nothing is sold, no prices are promoted,
no shop links carry affiliate codes. Unlicensed items are labelled as such, never hidden, so collectors can tell them
apart. Artists are credited by name on every print.

## 8. Steps
One pull request: one shelf per record, the misfiled records moved, the official split corrected, duplicates
merged, home video researched, and screenshots.

## 9. Acceptance checks
- Every Artwork and Merchandise record sits on exactly one shelf; the "Other" shelves are empty or near-empty.
- No item is on an official shelf unless it was made by the rights holders or a source states a licence.
- Duplicates point to the record they repeat (`duplicate_of`).
- Every home video release has its own record with a source.
- CI passes: check:data, tokens, both builds, check:site, check:a11y.

---

## Decided here (Adam reviews later)
- The structure above, one shelf per record.
- **The licence rule for products and prints:** official only when made by the rights holders or a source states a
  licence. A print or product with no licence statement goes under "Unofficial and inspired" with the note "No
  source read states a licence", so a licensed maker can be moved up as soon as a source is found.
- Gallery shows move to Events > Exhibitions.
- Surviving pieces (props, make-up appliances, matte paintings, scripts) go on *Props and costumes*; *Make-up and
  production design* keeps the designs.
- The ten misfiled records move as in section 2.
- **Home video is built from the release lists already on the series and film pages** (42 physical releases), grouped
  by show, each linking to its show's release table; broadcast, syndication and streaming rows are left off. A table
  of its own was tried and dropped because it repeated those entries. Three Night Gallery releases were added from
  the record's own Wikipedia-sourced summary: the 2017 complete-series DVD and Kino's Season Two and Three Blu-rays.
- **The Mondo record is merged into Dark Hall Mansion's "To Serve Man" prints:** the /Film roundup it cited names
  Mondo only for The Nice Guys poster; the Twilight Zone prints in it were Dark Hall Mansion's, "officially licensed".
- **Dark Hall Mansion prints are official:** two sources call its Twilight Zone series "officially licensed" (Next
  Projection, 12 August 2014; Inside the Rock Poster Frame, 23 April 2015). That covers Tom Whalen's series, Shag's
  2015 print (its first guest-artist release) and the 2016 "To Serve Man" prints.
- Marked unofficial, with "No source read states a licence": Phantom City Creative's "Time Enough at Last" (2026),
  Zeb Love's 1xRUN print, Drew Friedman's Serling portrait, Middle of Beyond's nurse mug, 80sTees shirts and the
  Super7 Iron Maiden figure (based on the cover of the band's 1981 single "Twilight Zone"). Also unofficial: the Lowbrow Antics pin
  set ("inspired"), the LEGO Ideas fan proposal, the RISD Museum screen print, Jordan Monsell's poster, Hirschfeld's
  caricature and two independent illustrators.
- Marked official as work made for the franchise: Juan Ortiz's card art (Rittenhouse's licensed 2020 set), and the
  2019 revival's campaign art by Nate Lewis and Huddy Creative (both records say the art was made for the revival).
- Media attach to records: the Composers Datebook and The Score radio segments, The Goldsmith Odyssey episode, the TV
  Time Machine interview with Tom Wright, the Tunefind song lists and the cover-and-sample indexes are now content
  on the theme, the series, the stock-music record or the Night Gallery paintings. The 1959-60 trade press and the
  1983 college newspapers are advertisements on the 1959 series and the 1983 film.
- Duplicates: the 2018 pig-face mask auction, Matheson's script archive and the 2019 Super Bowl spot (its Clio award
  and date moved to the films record).

## Waiting on Adam
- Nothing blocking.

## Found, for later
- **Night Gallery paintings:** only eight of the show's paintings have records. Each segment was introduced by one,
  most by Tom Wright, the pilot's by Jaroslav Gebr. A painting-by-segment list needs a source that names each one (the
  2020 book *The Art of Darkness*, nightgallery.net); a research round of its own.
- **Home video duplicates:** a few releases have both a record and a row on their show's page (the Definitive Edition,
  the Blu-ray seasons, the 2012 complete series). Merge the record's extras into the row, or link the two.
- **Gold Entertainment (2000):** the Twilight Zone Museum page quotes an Amazon review naming a 2000 full-series DVD
  set by Gold Entertainment; the 1959 page already notes it beside V3 Media's 2002 Gold Collection. Unconfirmed.
- **The 1985 series and the 1983 film on VHS and laserdisc:** no release is recorded; the pages read had none.
- **Licences to confirm:** Mondo (no Twilight Zone print found), Middle of Beyond, 80sTees, Phantom City Creative,
  Fright-Rags (says licensed; licensor not named), The Strand Magazine's gift-set mug.
- **Merchandise for the 1985 and 2019 series:** none found yet beyond the 2019 home video.
- **The empty catch-all shelves** (Other artwork, Other merchandise) show "No entries yet" if opened directly; the
  category page already hides empty shelves.
