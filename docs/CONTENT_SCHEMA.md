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
- Optional `relevance: core|related|tangential` on any record: core is about The Twilight Zone itself, related covers Rod Serling, Night Gallery and the show's writers, tangential only mentions or borrows the name. Optional `tags[]` for light labels (`self-published`, `unverified`, `unlicensed`, `teleplay`). `duplicate_of: <collection>/<id>` hides a duplicate record from pages while keeping it locked against re-import.
- `locked: true` stops `scripts/import_spreadsheets.py` from overwriting a hand-edited record.
- Copyright: no full narrations, transcripts, lyrics or publisher blurbs. Short excerpts only
  (`lyric_excerpt` max 200 chars, quote `text` max 400), always with a source.

## Collections and fields

| Collection | Path | Required | Optional |
|---|---|---|---|
| series | `series/1959.yaml` | title, years, network, host, seasons, order, summary | history[] ({date, title, text ≤600 own words, sources[] ≥1}), international_titles[] ({country, language?, title, broadcaster?, year?, note?, sources[] ≥1}), releases[] ({date?, format, title, publisher?, region?, note?, sources[] ≥1}: home media, syndication, streaming), sources[] |
| episodes | `episodes/<series>/<slug>.yaml` | title, series (`1959`/`1985`/`2002`/`2019`), season (int), episode (string, e.g. `"8"` or `"18a"`) | aka[], air_date, runtime_min, production_code, writers[] (screen credits), writing_credit_note, source_authors[] (authors of an adapted prior work: story, radio play, anecdote; also listed in writers only when they wrote the teleplay), directors[], cast[], narrator, synopsis (own words), themes[], trivia[] ({text ≤400 chars, own words; sources[] ≥1}) |
| films | `films/<slug>.yaml` | title | kind (`film`/`tv-film`/`tv-episode`/`tv-segment`/`tv-series`/`sketch`/`documentary`/`special`/`pilot`/`stage`/`unproduced`/`short`/`music-video`/`commercial`/`web-series`), summary (own words), parent_series (e.g. `The Simpsons, S2E3`), segments[] ({title, adapts_episode?, summary?, source_title?, source_authors[], writers[], directors[], cast[]}), history[], international_titles[], releases[] (same shapes as series), release_date, rating, runtime_min, writers[], directors[], cast[] |
| connections | `connections/<from-slug>--<to-slug>.yaml` | from (ref), to (ref: episode id or `series/<year>`), kind, confidence | summary, evidence |
| songs | `songs/<artist>-<title>.yaml` | title, tz_connection (`theme`/`lyric-mention`/`reference`/`unclassified`) | artist, album, genre, length, year, lyric_excerpt, description |
| books | `books/<slug>.yaml` | title | authors[], publisher, published, pages, description, kind, isbn, episodes[] |
| comics | `comics/<slug>.yaml` | title | series_name, publisher, cover_date, order, creators[], description, kind, isbn, episodes[] |
| magazines | `magazines/<slug>.yaml` | title | magazine, cover_date, order, publisher, editor, description, kind, isbn, episodes[] |
| essays | `essays/<slug>.yaml` | title | authors[], published_in, published, kind (`essay`/`journal-article`/`book-chapter`/`speech`/`interview`/`review`), description, episodes[] |
| archives | `archives/<slug>.yaml` | name | institution, location, dates, extent, description, url |
| radio | `radio/<slug>.yaml` | title | series_title, season, season_order, volume, volume_order, volume_released, original_writer, adapted_by, voiced_by[], adapts_episode (episode id), description |
| podcasts | `podcasts/<slug>.yaml` | title | hosts[], first_episode, description, status (`active`/`ended`/`unknown`) |
| people | `people/<slug>.yaml` | name | born, died, bio (own words), roles[], tz_credits[] ({series, work, role?, ref?: episode id or `films/<slug>`}) for credits no episode/film record carries, timeline[] ({date, text}) for dated life events |
| quotes | `quotes/<slug>.yaml` | person (exact name), text (≤400 chars) | date, context, episodes[] (episode ids) |
| works | `works/<slug>.yaml` | title, kind (`game`/`collectible`/`artwork`/`stage`/`attraction`/`parody`/`convention`/`television`/`soundtrack`/`event`/`link`/`fan-community`/`memorial`/`education`/`other`) | year, creator, publisher, description (own words), subtype, details (free-form map) |
| locations | `locations/<slug>.yaml` | name | kind (`backlot-set`/`filming-location`/`serling-place`/`attraction`/`museum-exhibit`/`memorial`/`archive`), address, city, region, country, lat, lng, status, opened, closed, filmed[] ({ref, note}), notes |

`connections.kind`: `official-adaptation`, `remake`, `inspired-by`, `homage`, `parody`, `reference`, `lyric-mention`.
`connections.confidence`: `confirmed-by-creator`, `documented`, `fan-noted` (shown on the site as "Unconfirmed"). Use `documented` or
better only with a source URL in `sources`.

## Night Gallery and Rod Serling

- Night Gallery lives in `films`: `night-gallery` (series), `night-gallery-pilot` (1969 film), and one record per broadcast
  episode, `night-gallery-s<season>e<NN>` (kind `tv-episode`), whose `segments[]` carry each story's writers, director,
  cast, own-words summary and source story. `/night-gallery/` lists them in order; the Films index leaves the episodes out.
- Serling's work outside the show is ordinary `films`, `radio` and `works` records with `Rod Serling` in their credits.
  `/rod-serling/` gathers them with the timeline from `people/rod-serling.yaml`. Honors are `works` with `kind: event`,
  `subtype: honor`.

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

## Site taxonomy and new fields (2026-11-20)

The site is organised around Adam's category list. Records are placed automatically from their
collection and fields (rules in `src/lib/taxonomy.mjs`); a record can sit in more than one place
(a person who wrote and acted; a film that is also a homage). Categories and subcategories that
were not on Adam's list are flagged **new** on the site and in the review sheet so he can drop them.

### Categories and subcategory slugs

Use these slugs in `categories[]` (`"<category>/<subcategory>"`). An unknown subcategory slug under a
known category creates a new subcategory, labelled from the slug and flagged new.

| Category | Subcategory slugs | Filled automatically from |
|---|---|---|
| `people` | `writers`, `directors`, `producers`, `actors`, `narrators-hosts`, `voice-actors`, `composers`, `crew`, `characters`, `scholars-historians`, `fans`, `family`, `inspired-creators` | people (roles[] and credits), characters, quote authors |
| `places` | `real-life`, `in-story` | locations (`kind: in-story` goes to in-story) |
| `events` | `conventions`, `honors-awards`, `anniversaries-festivals`, `broadcasts-marathons`, `premieres`, `exhibitions`, `production-history`, `other-events` | works kind event/convention/memorial (by subtype), series/film history[] |
| `series` | `tv`, `radio`, `podcast` | series, films kind tv-series, radio series, podcasts |
| `episodes` | `tv`, `radio`, `podcast` | episodes, Night Gallery episodes, radio, podcasts featured_episodes |
| `movies` | `twilight-zone-films`, `rod-serling-films`, `linked-films`, `tv-films`, `documentaries`, `shorts-and-other` | films |
| `music` | `composers`, `theme`, `songs`, `soundtracks` | people with composer role, songs, works kind soundtrack |
| `reading` | `books`, `comics`, `magazines`, `essays`, `articles`, `scripts` | books, comics, magazines, essays |
| `games` | `pinball-arcade`, `video-games`, `board-card-games`, `other-games` | works kind game (by subtype) |
| `artwork` | `posters-key-art`, `art-illustration`, `title-design`, `other-artwork` | works kind artwork (by subtype) |
| `homages` | `adaptations-remakes`, `inspired-by`, `homages`, `parodies`, `references`, `in-other-shows` | connections, films kind tv-episode/tv-segment/sketch, works kind parody |
| `merchandise` | `collectibles`, `toys-figures`, `trading-cards`, `home-media`, `household-apparel`, `other-merchandise` | works kind collectible/home-media, series/film releases[] |
| `lectures` | `serling-lectures`, `academic`, `classroom`, `readings-panels` | essays kind speech/lecture, works kind lecture/education |
| `reviews` | `contemporary`, `retrospective`, `rankings`, `awards-citations` | essays kind review (by review_type) |
| `archives` *(new)* | `collections`, `documents` | archives |
| `stage` *(new)* | `theatre`, `live-readings`, `attractions` | works kind stage/attraction, films kind stage |
| `quotes` *(new)* | `rod-serling`, `admirers` | quotes |
| `advertising` *(new)* | `commercials`, `promos-trailers`, `print-ads` | films kind commercial, works kind advertisement, media type ad |
| `community` *(new)* | `fan-communities`, `websites-databases`, `organizations` | works kind fan-community/link |
| `production` *(new)* | `companies-studios`, `broadcast-syndication`, `ratings`, `international`, `behind-the-scenes` | works kind production, series/film history[] |
| `legal-history` *(new)* | `accident-trial`, `rights-ownership`, `disputes`, `censorship` | works kind legal |
| `cultural-impact` *(new)* | `catchphrases`, `theme-as-shorthand`, `dictionary-references`, `public-uses` | works kind cultural-impact |
| `props` *(new)* | `surviving-props`, `auctions`, `museum-holdings`, `replicas` | works kind prop, collectible subtype replica-prop |
| `media` *(new)* | `video`, `audio`, `documents`, `images`, `ads`, `links` | every record's media[] |

People `roles[]` are matched loosely (case and plural ignored): writer, director, producer, actor,
host, narrator, voice, composer/musician, cinematographer/editor/makeup/effects/crew, scholar/historian,
fan/collaborator, family, inspired-by.

### New optional fields (every collection)

- `categories[]`: extra `"<category>/<subcategory>"` placements, on top of the automatic ones.
- `media[]`: legitimately hosted media about the record.

```yaml
media:
  - type: video          # video | audio | document | image | ad | article | interview | transcript | website | link
    subtype: promo       # optional finer label: trailer, promo, full-episode, script, poster, interview...
    title: CBS promo for the 1959 premiere
    url: https://archive.org/details/...
    host: Internet Archive          # archive.org, official YouTube channel, a museum or library
    date: '1959-10'
    rights: public-domain           # public-domain | cc | licensed | link-only (default) | unknown
    file: media/series/1959/promo.mp4   # only for public-domain/cc files saved under public/media/<collection>/<id>/
    duration: '1:02'
    note: One line, own words.
```

Put media in the record's top-level `media[]`, not inside `details`. `kind` and `license` are accepted as aliases of `type` and `rights`; finer kinds (trailer, promo,
clip, full-episode, script, photo, advertisement, commercial) fold into the main types automatically
and are kept as `subtype`. Copyrighted material is linked (`link-only` or `licensed`), never re-hosted.

### Other additions

- **characters** collection, `characters/<slug>.yaml`: name (required), aka[], kind
  (`human`/`alien`/`robot`/`supernatural`/`animal`/`object`/`other`), played_by[] (exact person names),
  appears_in[] (episode ids or `films/<id>`, `radio/<id>`, `comics/<id>`), description (own words), recurring.
- locations.kind adds `in-story` (fictional settings; `filmed[]` lists where they appear) and
  `event-venue`; locations also take `episodes[]`.
- works.kind adds `lecture`, `advertisement`, `home-media`, `legal`, `cultural-impact`, `prop`, `production`. Events stay kind `event`/`convention`/`memorial`
  with subtype (premiere, marathon, broadcast, festival, anniversary, honor, exhibition, trial...).
- essays.kind adds `article`, `lecture`, `script`, `academic-thesis`; essays also take `reviews[]`
  (refs reviewed), `review_type` (`contemporary`/`retrospective`/`ranking`/`awards-citation`) and
  `outlet_rating` (free text).
- podcasts add `episode_count`, `covers[]` (series ids or `films/<id>`), `featured_episodes[]`
  ({title, date?, url?, covers_episode?}).
- Do not use `tags: [new-subcategory]` or `new-subcategory:<name>` tags; use `categories[]` with a new slug instead.
