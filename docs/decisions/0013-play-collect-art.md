# 0013 Play gains the site's games; Collect is for objects; Art and design joins Discover

**Date:** 2026-11-26. **Decided by:** Adam ("yes, yes, yes", 13:34 UTC) to the suggestions in
docs/plans/navigation-2026-11-26.md. Details marked *(thread)* were decided while building.

## Decision

- **Play** shows a "Play on this site" column beside Games: a new **trivia quiz** (/quiz/), Six degrees of the
  Zone, the Episode finder, Episode of the day, and the fan-made games (Legacy > Fan-made).
- The quiz builds every question from the episode records (writers, directors, cast, first air year), the same
  sourced facts the episode pages show, and links each answer to that page. Ten questions a round, by series or
  all four. Wrong answers come from the same series and are never also right for the episode *(thread)*.
- **Collect** shows Merchandise's shelves directly, A to Z, and a "Track your collection" link to My Zone.
- **Props and costumes** and **Posters and prints** (was "Posters, key art and prints") moved from Artwork to
  Merchandise: they are objects people own. `/artwork/props-costumes/` and `/artwork/posters-key-art/` redirect
  (MOVES in src/lib/taxonomy.mjs).
- **Artwork** is now **Art and design**, in Discover after History *(thread: the position)*: title design, make-up
  and production design, Night Gallery's paintings, cover and comic art, and art and illustration. Its address
  stays /artwork/.
- The shelves were kept as they were rather than merged (the suggestion had paired toys with replicas and cards
  with collectibles) *(thread)*: finer shelves lose nothing, and merging would move records' addresses.

## Why

Adam: "Does Artwork make sense under Collect? Physical art would fall under merchandise." Most of Artwork is about
how the shows look, which is something to discover; the objects belong with the other things people collect.
