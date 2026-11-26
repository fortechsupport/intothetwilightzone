# 0010 Era themes and motion

*Updated by decision 0014 (2026-11-26): 1985 Neon became 1985 Glow, 2019 Crimson became 2019 Gloss, and 1959 and 2002
gained textures from Adam's era breakdown.*

**Date:** 2026-11-25. **Decided by:** Adam asked for "themes that appear like the aesthetic of the original
series in addition to the aesthetics of each revival series" and "animated effects to improve user
experience"; the details below were decided in the thread "Improve the whole site in 5 cycles" for him to
review.

## Decision

- The header's Theme menu offers: Your device (Midnight or Paper, following the device), Midnight, Paper,
  1959 Original, 1985 Neon, 2002 Steel and 2019 Crimson. The choice is kept in the visitor's browser.
- **1959 Original:** black and white, a moving film grain, a soft spotlight, typewriter (Courier Prime)
  kickers, and every photograph shown in grey.
- **1985 Neon:** magenta and cyan on deep indigo, a faint scan-line screen, a wide display face (Michroma).
- **2002 Steel:** cool steel and teal, a condensed display face (Oswald), a cold light from above.
- **2019 Crimson:** stark black, red and violet, a heavy serif (Fraunces) with a red rule under page titles.
- Themes evoke each era by palette, type and texture only. None uses a series logo, title design, frame or
  any other franchise artwork (the blessing goal, decision 0009).
- Every theme's colors live in design/tokens.json and pass the same 4.5:1 text and 3:1 control contrast test;
  `check:a11y` runs axe on a sample of page types in each era theme.
- Motion: a short cross-fade between pages, cards that lift on hover, menus that unfold, the turning vortex
  and the 1959 grain. All of it stops when the visitor's device asks for reduced motion.

## Why

Adam asked for themes and animation. Naming the themes by year and a plain word, rather than by series title,
keeps them clearly the site's own design and avoids any suggestion of official branding.

## Set aside

- **Copying each series' opening-title look (spiral, eye, door logos):** that is franchise artwork.
- **Light versions of each era theme:** more to keep accessible for little gain; Paper remains the light theme.
- **Scroll-in animations on content:** they delay reading and can trip contrast checks while fading in.
