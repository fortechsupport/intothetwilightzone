# Podcasts research round 2: the last feeds, title matching, the episode table (2026-11-24)

Plan: docs/plans/research-podcasts.md (approved by Adam 2026-11-24 03:12 UTC). Round 2 and step 3 ship together in
one pull request, because the matching rule is tested against the table it feeds.

## The eight podcasts without a feed

| Podcast | Found | Source |
|---|---|---|
| Zoning Out | Apple listing id1643753831 (four hosts named); feed via Apple's lookup | Apple Podcasts page, read 2026-11-24 |
| Zoners | Fandom Limb Media on Spreaker (show 5859407); Spreaker feed address | Spreaker show page, read 2026-11-24 |
| Of Shadow and Substance | Five episodes, 29 March to 27 May 2019, on iHeart; no feed found. Now dated, counted and marked ended | iHeart page, read 2026-11-24 |
| The Twilight Gnome | Podbean feed for ajrockstar3 | Podbean show page |
| Zoned Out (Night of the Living Podcast) | Blubrry feed for notlp, filtered to the segment | Blubrry episode page |
| The Night Gallery Podcast (The Twilight Zone Podcast) | Ten Night Gallery episodes listed, 2012-12-03 to 2014-12-13; no host or feed named | Podbean page, read 2026-11-24 |
| The Familiar Podcast | An Apple listing "The Familiar" (Fox and Wolf Production, eight episodes, 2020) may be it, but its page does not mention the show and is not confirmed to be the same podcast. Tie marked "not yet confirmed" | Apple Podcasts page, read 2026-11-24 |
| Night Zone Anthology | Not found on Apple (a search returned "The Midnight Zone", a different show) | none new |

Feed addresses built from a host's standard pattern (Spreaker, Podbean, Blubrry) are checked by the feed reader on
GitHub; a wrong one is reported as a failure, never guessed into the records' facts.

## The title-matching rule (src/lib/podcast-match.mjs)

1. Titles are compared in lower case with punctuation reduced to spaces.
2. A title of three or more words matches wherever it appears as whole words.
3. A title of one or two words ("Two", "Dust", "The Hunt", "Static") matches only where the podcast title sets it
   apart: in quotation marks, as the whole title once an episode number is removed, or after a colon, dash, bar or
   episode number, running to the end or the next such mark.
4. A podcast only matches the series it covers. When a title belongs to more than one of those series ("Shadow
   Play", "Eye of the Beholder", "A Game of Pool", "The After Hours"), a series word in the podcast title decides
   ("2019", "Peele", "'85", "2002"); failing that the original series is taken.
5. Longer titles win where two overlap, and one podcast title can match several episodes ("Shadow Play / Grace Note").

**Tested on the 3,287 feed episodes:** 2,206 matched. A read of every short-title match and a random sample of 40
others found no wrong match. Misses are mostly titles that are not about one episode (interviews, mailbags, top-ten
lists) or puns ("The Changing of the Gart", "Lateness of the Nick"), which the rule deliberately leaves alone.

## What the site now shows

- Four shelves: podcasts about the show (grouped by what they cover), single episodes (grouped by subject), fiction
  inspired by the show (new), and the official shelf, which stays hidden because no official podcast was found.
- /podcasts/episodes/: 3,323 episodes (feeds plus the episodes records list) from 56 podcasts, searchable,
  filterable by podcast, series, episode of the show and year, sortable six ways, with every choice in the address.
- "Podcasts" on each episode page of the show that a podcast episode names (Walking Distance: 16 episodes from 16
  podcasts), linked to the table filtered to that episode.
- Each podcast page lists its newest five episodes and links to all of them in the table, saying when the feed was read.
