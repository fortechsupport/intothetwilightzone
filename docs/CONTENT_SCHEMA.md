# Content schema

All content lives in `src/content/<collection>/` as **one YAML file per record**. The
file path (minus `.yaml`) is the record id. Schemas are enforced in `src/content.config.ts`;
a record that does not match fails the build.

## Conventions

- Slugs: lowercase kebab-case from the title; apostrophes dropped (`childs-play`, `its-a-good-life`).
- Episode ids include the series year: `1959/time-enough-at-last`, `1985/gramma`.
- References between records are `"<collection>/<id>"`, e.g. `films/childs-play`, `songs/<id>`,
  `series/1959` for the show in general, and `1959/living-doll` for episodes (episode refs are just
  the episode id, no `episodes/` prefix). Episode-to-episode links (remakes) use two episode ids.
- People are referenced **by exact name string** in credits (`writers`, `directors`, `cast`, ...).
  Person pages are generated from credits; a `people/<slug>.yaml` record only adds bio/dates.
  Person slug = slugify(name), e.g. `rod-serling`, `burgess-meredith`.
- Dates: ISO `YYYY-MM-DD` strings (quoted in YAML). Unknown day/month: `YYYY` or `YYYY-MM`.
- Every record has `sources: [{title, url?, note?}]`, optional `last_verified: 'YYYY-MM-DD'`,
  optional `ids: {imdb, wikidata, goodreads, ...}` and `links: {wikipedia, justwatch, ...}`.
- Optional `research_confidence: high|medium|low` on any record (connections keep their own `confidence`).
- Review status is not a record field: Adam's include/exclude decisions live in
  `data/review/decisions.json` (see `docs/REVIEW.md`). Research never sets it; every new record is pending.
- `locked: true` stops `scripts/import_spreadsheets.py` from overwriting a hand-edited record.
- Copyright: no full narrations, transcripts, lyrics or publisher blurbs. Short excerpts only
  (`lyric_excerpt` max 200 chars, quote `text` max 400), always with a source.

## Collections and fields

| Collection | Path | Required | Optional |
|---|---|---|---|
| series | `series/1959.yaml` | title, years, network, host, seasons, order, summary | history[] ({date, title, text ≤600 own words, sources[] ≥1}), international_titles[] ({country, language?, title, broadcaster?, year?, note?, sources[] ≥1}), releases[] ({date?, format, title, publisher?, region?, note?, sources[] ≥1}: home media, syndication, streaming), sources[] |
| episodes | `episodes/<series>/<slug>.yaml` | title, series (`1959`/`1985`/`2002`/`2019`), season (int), episode (string, e.g. `"8"` or `"18a"`) | aka[], air_date, runtime_min, production_code, writers[] (screen credits), writing_credit_note, source_authors[] (authors of an adapted prior work: story, radio play, anecdote; also listed in writers only when they wrote the teleplay), directors[], cast[], narrator, synopsis (own words), themes[], trivia[] ({text ≤400 chars, own words; sources[] ≥1}) |
| films | `films/<slug>.yaml` | title | kind (`film`/`tv-film`/`tv-episode`/`tv-segment`/`tv-series`/`sketch`/`documentary`/`special`/`pilot`/`stage`/`unproduced`/`short`/`music-video`/`commercial`/`web-series`), summary (own words), parent_series (e.g. `The Simpsons, S2E3`), segments[] ({title, adapts_episode?, writers[], directors[], cast[]}), history[], international_titles[], releases[] (same shapes as series), release_date, rating, runtime_min, writers[], directors[], cast[] |
| connections | `connections/<from-slug>--<to-slug>.yaml` | from (ref), to (ref: episode id or `series/<year>`), kind, confidence | summary, evidence |
| songs | `songs/<artist>-<title>.yaml` | title, tz_connection (`theme`/`lyric-mention`/`reference`/`unclassified`) | artist, album, genre, length, year, lyric_excerpt, description |
| books | `books/<slug>.yaml` | title | authors[], publisher, published, pages, description, kind, isbn, episodes[] |
| comics | `comics/<slug>.yaml` | title | series_name, publisher, cover_date, order, creators[], description, kind, isbn, episodes[] |
| magazines | `magazines/<slug>.yaml` | title | magazine, cover_date, order, publisher, editor, description, kind, isbn, episodes[] |
| essays | `essays/<slug>.yaml` | title | authors[], published_in, published, kind (`essay`/`journal-article`/`book-chapter`/`speech`/`interview`/`review`), description, episodes[] |
| archives | `archives/<slug>.yaml` | name | institution, location, dates, extent, description, url |
| radio | `radio/<slug>.yaml` | title | series_title, season, season_order, volume, volume_order, volume_released, original_writer, adapted_by, voiced_by[], adapts_episode (episode id), description |
| podcasts | `podcasts/<slug>.yaml` | title | hosts[], first_episode, description, status (`active`/`ended`/`unknown`) |
| people | `people/<slug>.yaml` | name | born, died, bio (own words), roles[], tz_credits[] ({series, work, role?, ref?: episode id or `films/<slug>`}) for credits no episode/film record carries |
| quotes | `quotes/<slug>.yaml` | person (exact name), text (≤400 chars) | date, context, episodes[] (episode ids) |
| works | `works/<slug>.yaml` | title, kind (`game`/`collectible`/`artwork`/`stage`/`attraction`/`parody`/`convention`/`television`/`soundtrack`/`event`/`link`/`fan-community`/`memorial`/`education`/`other`) | year, creator, publisher, description (own words), subtype, details (free-form map) |
| locations | `locations/<slug>.yaml` | name | kind (`backlot-set`/`filming-location`/`serling-place`/`attraction`/`museum-exhibit`/`memorial`/`archive`), address, city, region, country, lat, lng, status, opened, closed, filmed[] ({ref, note}), notes |

`connections.kind`: `official-adaptation`, `remake`, `inspired-by`, `homage`, `parody`, `reference`, `lyric-mention`.
`connections.confidence`: `confirmed-by-creator`, `documented`, `fan-noted` (shown on the site as "Unconfirmed"). Use `documented` or
better only with a source URL in `sources`.

## Examples

```yaml
# src/content/episodes/1959/time-enough-at-last.yaml
title: Time Enough at Last
series: '1959'
season: 1
episode: '8'
air_date: '1959-11-20'
runtime_min: 25
writers: [Lynn Venable, Rod Serling]
directors: [John Brahm]
cast: [Burgess Meredith, Vaughn Taylor]
narrator: Rod Serling
ids: { imdb: tt0734683 }
sources:
  - { title: IMDb, url: 'https://www.imdb.com/title/tt0734683/' }
```

```yaml
# src/content/connections/childs-play--living-doll.yaml
from: films/childs-play
to: 1959/living-doll
kind: inspired-by
confidence: documented
evidence: One sentence on what the source says.
sources:
  - { title: Source title, url: 'https://...' }
```
