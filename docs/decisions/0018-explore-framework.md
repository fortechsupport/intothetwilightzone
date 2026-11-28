# 0018 The explore framework: group pages with toggles, a table per category with its own columns, Sources

**Date:** 2026-11-28. **Decided by:** Adam, in the project thread "Reorganize the menu into seven groups": his menu
(14:19 UTC), one table per category (14:29), no category links for Play, Collect or Legacy (15:04), and his answers to
30 questions (15:59) and 20 follow-ups (16:51). Details marked *(thread)* were decided while building;
docs/plans/explore-framework-2026-11-28.md logs them. Supersedes the page structure of decision 0017.

## Decision

- **Group pages with toggles.** Discover (Organizations, People, Places, Events, Sources), View (Television, Movies,
  Stage, Artwork), Listen (Music, Radio, Podcasts, Lectures) and Read (Articles, Books, Comics, Essays, Magazines,
  Scripts, Short stories) each show one toggle per category; the category's short intro and table appear below. Each
  toggle has its own address (/view/movies/); the group's address reopens on the visitor's last choice. On phones
  the toggles scroll sideways with no visible scroll bar.
- **No category or shelf pages**, and no "How this connects" box on the toggles. Play, Collect and Legacy are one
  table each, with the category only as a column, one-tap category chips and Surprise me.
- **Each table has its own columns**, filters and sortable headings, chosen for what it holds (plan section 3), with
  My Zone buttons on rows (Watched and Want to watch; Read and Want to read; Heard; I have it and I want it) and a fan
  rating from the thumbs votes.
- **No combined values**: Legacy's kinds of link are each separate (Adaptations, Remakes, Homages, Parodies,
  References, Quotations, Lyric mentions, Covers, Samples, Easter eggs, Named after, Tributes, Inspired by, Compared
  to, Fan films, Fan audio dramas, Fan edits, Supercuts, Fan fiction, Fan art, In everyday language, In their own
  words; *(thread)* About the show and Fellow anthologies). Collect's old combined shelves are split item by item.
- **Collect:** one row per item, marked Physical, Digital or Both, never two rows for one item.
- **Sources** (last in Discover): Feeds (every site the site cites, with its feed and its page here; OPML export) and
  Posts (a reader for every feed, headlines and links only).
- **Total rebuild:** no redirects for the site's own reorganizations (nothing had been published). *(thread)* The
  2023 WordPress site's addresses and records without pages keep theirs.
- **404:** ten versions built on episodes, in our own words, one at random per visit.

## Why

Adam's aim: fans should respect the site for documenting every branch and twig, and newcomers should fall in love
with the show and want to explore more episodes. Toggles keep a group's categories one tap apart; tables chosen per
category let each be explored on its own terms.
