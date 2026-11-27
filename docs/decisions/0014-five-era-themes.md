# 0014 Five era themes, one per era, and no house themes

**Date:** 2026-11-26. **Decided by:** Adam, in two steps. At 13:34 UTC he approved retuning the era themes to his
era-by-era visual breakdown ("yes"). At 15:38 UTC, after seeing that retune, he decided: "Remove themes for Your
Device, Paper, and Midnight. 5 themes only "1959 series", "1985 series", "2002 series", "2019 series", and "1983
movie". They also need to be each granularly closer in appearance to the images I've attached." The images were the
key art of each era (the 1959 series' poster with Serling before concentric rings, the 1985 series' DVD cover, the
2002 series' poster, the 2019 series' poster, and the 1983 film's poster). At 22:26 UTC he named the faces he wants
(1959 and 2019: Bernhard Modern and Venus Extended; 1985: Casablanca Antique or Caslon Antique), kept 1983 and 2002 as
built, and asked for a darker 2019 theme based on the 2019 series' title card (white title over a starfield).
Updates decision 0010.

## Decision

- **Five themes, no others.** The Theme menu lists, in order of release: 1959 series, 1983 movie, 1985 series, 2002
  series, 2019 series. The 1959 series is the default for every visitor. Nothing follows the device's light or dark
  setting any more, and all five are dark. Printing still uses dark ink on white paper.
- **1959 series:** black and white, silver titles in Linden Hill (for Bernhard Modern), labels in widely spaced
  Lexend Giga (for Venus Extended), concentric rings receding into the dark behind the top of the page, film grain,
  photographs in grey.
- **1983 movie:** a deep navy night sky full of stars, a dusk glow on the horizon (peach, rose, violet) with dark hills
  against it, silvered old-style titles with a faint warm halo, and peach for the accent (the sunset on the title).
- **1985 series:** violet dark like a bare room at night, darker violet walls at the sides, stars, a white light
    glowing from above, worn antique letterpress type for titles and labels (IM Fell Double Pica, for Caslon Antique
  and Casablanca Antique; Cabin Sketch and then Eater were tried first and set aside), labels in widely spaced
  capitals, and pale lilac for the accent.
- **2002 series:** deep electric blue, a cold light breaking through the middle, faint orbits and ruled lines like a
  scientist's chalkboard, titles in gold engraved capitals (Cinzel), cyan links, photographs a little cold.
- **2019 series:** after the series' title card: a black night sky full of stars, a soft blue haze at its heart and a
  faint band of the Milky Way, white titles in Linden Hill and labels in Lexend Giga (as for 1959), moonlight white
  for the accent and pale blue links. (The first version, a light theme with a pale sky and grass from the series'
  poster, was replaced at Adam's request.)
- **Keys.** The themes are stored as `1959`, `1983`, `1985`, `2002` and `2019`. A choice saved under an earlier name
  moves to its era (`original`, `neon`, `steel`, `crimson`); one saved as Midnight or Paper is forgotten, and that
  visitor sees the 1959 series.
- **Fonts.** Linden Hill, Lexend Giga, IM Fell English, IM Fell Double Pica and Cinzel (SIL Open Font License, from
  Fontsource) replace DM Serif Display, Fraunces, Oswald and Michroma, which nothing uses any more. Jost (text) and
  Courier Prime (teleplay excerpts) stay. The faces Adam named (Bernhard Modern, Venus Extended, Caslon Antique,
  Casablanca Antique) are sold under commercial licences (MyFonts, Fontspring), so they can't be hosted without a
  web licence bought in Adam's name, and Adam chose to keep the free look-alikes (22:37 UTC). The free faces are the closest we found among about thirty compared side
  by side with the key art. Swapping in the licensed fonts later only means replacing the files and two names in
  design/tokens.json.

## Limits that still hold (from 0010)

- Palette, type and texture only. No logo, title design, frame or piece of the key art is copied: the rings, stars,
  horizon and grass are our own CSS drawings, and the fonts are general-purpose typefaces that share the feel of each
  era's lettering, not its letterforms.
- Every colour pair passes the contrast test (4.5:1 for text, 3:1 for control borders) in every theme and in print,
  textures sit behind the content, and motion stops under reduced motion.
- `npm run check:a11y` runs axe on every sample page in the 1959 and 2019 themes, on a sample in the other three,
  and the 320 px overflow check in all of them.

## Set aside

- **Following the device's light or dark setting:** Adam asked for the five themes only, all dark. Print stays light.
- **Gradient-filled titles like the 1983 poster's:** contrast tools can't measure text filled with a gradient, so the
  titles are a solid silver with a warm halo instead.

## Changed 2026-11-27 (Adam)

- **1985 series** blends purple with black instead of shades of purple ("the theme should blend purple and black
  like the image i provided"). The background, panels and lines are near-black; the violet is light: a glow from the
  side walls and through the middle, falling off into black at the top and bottom, as on the key art. Text is near
  white, links and highlights lavender.
- **Headings in every theme:** h1 and h2 use the theme's own display face; h3 and smaller use Jost, the shared
  interface face, at weight 600 ("H3, H4, H5, etc should use a clean (easy-to-read) font shared by all themes").
