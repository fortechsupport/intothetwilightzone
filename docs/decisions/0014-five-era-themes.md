# 0014 Five era themes, one per era, and no house themes

**Date:** 2026-11-26. **Decided by:** Adam, in two steps. At 13:34 UTC he approved retuning the era themes to his
era-by-era visual breakdown ("yes"). At 15:38 UTC, after seeing that retune, he decided: "Remove themes for Your
Device, Paper, and Midnight. 5 themes only "1959 series", "1985 series", "2002 series", "2019 series", and "1983
movie". They also need to be each granularly closer in appearance to the images I've attached." The images were the
key art of each era (the 1959 series' poster with Serling before concentric rings, the 1985 series' DVD cover, the
2002 series' poster, the 2019 series' poster, and the 1983 film's poster). Updates decision 0010.

## Decision

- **Five themes, no others.** The Theme menu lists, in order of release: 1959 series, 1983 movie, 1985 series, 2002
  series, 2019 series. The 1959 series is the default for every visitor. Nothing follows the device's light or dark
  setting any more; the 2019 series is the one light theme. Printing still uses dark ink on white paper.
- **1959 series:** black and white, silver type in an old-style face (IM Fell English), concentric rings receding into
  the dark behind the top of the page, film grain, typewriter kickers, photographs in grey.
- **1983 movie:** a deep navy night sky full of stars, a dusk glow on the horizon (peach, rose, violet) with dark hills
  against it, silvered old-style titles with a faint warm halo, and peach for the accent (the sunset on the title).
- **1985 series:** violet dark like a bare room at night, darker violet walls at the sides, stars, a white light
  glowing from above, rough chalk-white lettering for titles (Cabin Sketch) and pale lilac for the accent.
- **2002 series:** deep electric blue, a cold light breaking through the middle, faint orbits and ruled lines like a
  scientist's chalkboard, titles in gold engraved capitals (Cinzel), cyan links, photographs a little cold.
- **2019 series:** a pale overcast sky, black old-style titles, grass green for the accent and a strip of grass above
  the footer, night blue for links, and the home page's doorway turned to night blue (the doorway of stars).
- **Keys.** The themes are stored as `1959`, `1983`, `1985`, `2002` and `2019`. A choice saved under an earlier name
  moves to its era (`original`, `neon`, `steel`, `crimson`); one saved as Midnight or Paper is forgotten, and that
  visitor sees the 1959 series.
- **Fonts.** IM Fell English, Cinzel and Cabin Sketch (SIL Open Font License, from Fontsource) replace DM Serif
  Display, Fraunces, Oswald and Michroma, which nothing uses any more. Jost and Courier Prime stay.

## Limits that still hold (from 0010)

- Palette, type and texture only. No logo, title design, frame or piece of the key art is copied: the rings, stars,
  horizon and grass are our own CSS drawings, and the fonts are general-purpose typefaces that share the feel of each
  era's lettering, not its letterforms.
- Every colour pair passes the contrast test (4.5:1 for text, 3:1 for control borders) in every theme and in print,
  textures sit behind the content, and motion stops under reduced motion.
- `npm run check:a11y` runs axe on every sample page in the 1959 and 2019 themes, on a sample in the other three,
  and the 320 px overflow check in all of them.

## Set aside

- **Following the device's light or dark setting:** Adam asked for the five themes only. A visitor who wants light
  picks the 2019 series.
- **Gradient-filled titles like the 1983 poster's:** contrast tools can't measure text filled with a gradient, so the
  titles are a solid silver with a warm halo instead.
