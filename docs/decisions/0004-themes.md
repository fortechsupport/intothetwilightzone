# 0004 Themes for every series, episode, segment and homage

Date: 2026-11-21. Asked for by Adam ("we should include it for all series, episodes, and homages, right?"); direction
approved through the coordinator the same day.

## Decision

One fixed list of 41 themes in eight families (data/themes.yaml), shown and filterable across Television:

- **Twilight Zone episodes** keep their `themes:` keywords (391 distinct keywords on 329 episodes). Each keyword maps to a
  theme through the theme's `aliases`; every episode lands on one to four themes. Keywords with no theme (tone or subject
  words such as comedy, satire, baseball, boxing) stay searchable but are not shown as themes.
- **Night Gallery segments** (96, pilot included) get one to three themes each in data/themes-assigned.yaml, read from the
  segment summary on this site.
- **Homages and other works** that point to a Twilight Zone episode (shows, films, songs, works) take that episode's themes,
  and say "from the episode it points to". Links to a whole series give no themes.
- **Series and shows** show their most common themes with counts, from their episodes or entries.
- Every page that shows themes says they are our editors' reading, not a claim by the makers.

Where they appear: episode, series, show, film, work and record pages (a Themes fact or line); a Theme filter on series
episode tables, the episode explorer (Night Gallery and every show page) and /television/homages/; /themes/ (all themes by
family, A to Z) and /themes/<slug>/ (episodes by series, Night Gallery segments, homages by medium, related themes, with a
search and series filter). The episode finder and "If you liked this" now use the 41 themes instead of raw keywords.

## Why

Raw keywords were too many and too uneven to browse (391 for 329 episodes, most used once). A short controlled list makes
themes browsable across series, Night Gallery and homages, and keeps the episode records unchanged (no locked records edited).

## Set aside

- Hand-assigning themes to every homage: inheritance from the episode is honest, sourced to the episode record, and needs no
  new judgment per record.
- Themes on Serling's other plays (Playhouse 90, Studio One...): their records have few summaries yet. Found, for later.

## Decided here (Adam reviews later)

- The 41 themes, their names and families. **Adam approved the names on 2026-11-23** ("Use those theme names"); he may ask
  for changes later, and a slug change needs a redirect.
- Which keywords fold into which theme (data/themes.yaml `aliases`).
- The Night Gallery segment readings in data/themes-assigned.yaml.
