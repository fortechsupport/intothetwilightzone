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
- Every record has `sources: [{title, url?, author?, publisher?, note?}]` (name the author and the publication
  whenever they are known: credit where credit is due), optional `last_verified: 'YYYY-MM-DD'`,
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
`connections.confidence`: `confirmed-by-creator`, `documented`, `fan-noted`, shown on the site as "Confirmed by its makers",
"Documented" and "Noted by fans" (decision 0002). Use `documented` or better only with a source URL in `sources`.

## Night Gallery and Rod Serling

- Night Gallery lives in `films`: `night-gallery` (series), `night-gallery-pilot` (1969 film), and one record per broadcast
  episode, `night-gallery-s<season>e<NN>` (kind `tv-episode`), whose `segments[]` carry each story's writers, director,
  cast, own-words summary and source story. `/night-gallery/` is the one page for the series: the episodes are entries
  in its episode explorer (`#night-gallery-s1e01`), with no page of their own.

## Shows and their entries (decision 0002, 2026-11-21)

- Only the four Twilight Zone series have a page per episode. A `films` record of kind `tv-episode`, `tv-segment`,
  `sketch` or `web-series` with a `parent_series`, or a `tv-series` record with one, is an **entry** on its show's page,
  at `<show page>#<record id>`. The rule is `isEntryOnly()` in `src/lib/tv-shows.mjs`; `filmHref()` gives the address.
- The show is `parent_series` without its season or episode note (`The Simpsons, S5E5` → The Simpsons). Its page is the
  matching `tv-series` record's page when there is one, else `/television/<show-slug>/`.
- Old `/films/<entry id>/` addresses redirect to the entry. Decision keys stay `films/<id>`.
- Tags on `tv-series` records place them in Television: `anthology-family` (Fellow anthology series),
  `tz-writers` (a series by Twilight Zone writers), `radio-only` (moves to Listen).
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

## Site taxonomy and new fields (2026-11-20, revised the same day)

The site follows Adam's list, reorganized on his rules that **things that attach to other things are
content, not categories** (15:32 UTC) and that **media and content are never categories** (22:02 UTC).
There are four layers:

- **Directories**: People, Places, Organizations. The who and where that everything else links to. Each
  has a sortable, filterable index (`/people/`, `/places/`, `/organizations/`) that shows every page an
  entry appears on, and every category and record page lists its relevant people, places and
  organizations, linking both ways. They sit at the top of the main navigation.
- **Verbs** (Adam, 2026-11-21; full spec in `site/INFORMATION_ARCHITECTURE.md`): the main navigation is
  nine verbs, each a page at `/<verb>/` and a menu of its categories and subcategories with counts
  (`VERBS` in `taxonomy.mjs`, menu model in `src/lib/nav.ts`). Old `/explore/<group>/` pages redirect.

  | Verb | Categories |
  |---|---|
  | Watch | Movies, Stage, TV episodes, TV series |
  | Listen | Music, Podcasts, Radio dramas |
  | Read | the Reading formats (Articles, Books, Comics, Essays, Magazines, Scripts, Websites), plus topic collections |
  | Play | Games |
  | Collect | Artwork, Merchandise |
  | Attend | Events, Lectures |
  | Discover | History *(new: honors, premieres, production history, trials and rights, Serling's life)*, Legacy (`/homages/`) |
  | Meet | People, Characters (`/people/characters/`), Organizations |
  | Visit | Real places (attractions, filming locations, memorials and exhibits, Serling's places, sets and backlots, venues), Settings (`/places/in-story/`) |

  Moves (`MOVES` in `taxonomy.mjs`, applied to every placement; old addresses redirect): Events'
  milestone subcategories → `history/*`; `stage/attractions` → `places/attractions`; `music/composers` →
  `people/composers`; `places/lecture-event-venues` → `places/venues`; `merchandise/ornaments` →
  household-apparel; `games/slot-and-casino-games` → pinball-arcade. Real places get their subcategory
  from `locations.kind`. The utility bar holds Search, Media Library, Timeline, Rod Serling, Night
  Gallery, Everything A to Z and About.

- **Categories**: the things themselves. Every category is split into **Official** (made, broadcast,
  licensed or published by the franchise's makers and rights holders, or by Rod Serling himself) and
  **Unofficial and inspired** (made by others about, after or in the spirit of the show).
- **Media and content**: videos, audio, images (photos, stills, posters, key art, covers), maps,
  documents (scripts, transcripts, letters, memos, call sheets, press kits), articles and text, reviews
  (including rankings, award citations and aggregate scores), interviews, quotes, advertisements,
  archival holdings, external links and other files. Each item shows on every page it belongs to,
  with its credit, source, date and rights, and is listed in the **Media Library** (`/media/`): a
  sortable table filterable by type, category, rights and text (`?type=review`, `?in=reading/comics`,
  `?q=`), where each row names every page it appears on and each page links back (`/media/#<id>`).
  Artwork is also a category of its own: a comic's cover art is listed under Artwork and credited on
  the comic.

Records are placed automatically from their collection and fields (rules in `src/lib/taxonomy.mjs`);
a record can sit in more than one place. Subcategories not on Adam's list are flagged **new** on the
site and in the review sheet.

### Sections, categories and subcategory slugs

Use these slugs in `categories[]` (`"<category>/<subcategory>"`). An unknown subcategory slug under a
known category creates a new subcategory, flagged new. Old slugs (advertising, archives, quotes,
reviews, media, series/radio, series/podcast, episodes/radio..., community, legal-history,
cultural-impact, props-collecting) still work and are mapped to the new places (see `ALIASES` in
`taxonomy.mjs`); old URLs redirect. Please use the new ones.

| Section or category | Subcategory slugs | Filled automatically from |
|---|---|---|
| `people` (section) | `writers`, `directors`, `producers`, `actors`, `narrators-hosts`, `voice-actors`, `composers`, `artists` *(new)*, `crew`, `characters`, `scholars-historians`, `fans`, `family`, `inspired-creators`, `other-people` | people (roles[] and credits), comic creators, characters, quote authors |
| `places` (section) | `real-life`, `lecture-event-venues`, `in-story` | locations |
| `organizations` (section) | `networks-studios`, `production-companies`, `publishers`, `licensees`, `sponsors`, `archives-libraries`, `museums`, `foundations-societies`, `award-bodies`, `schools`, `fan-groups`, `other-organizations` | organizations records, plus every name in a `publisher` (books, comics, magazines, product works), `institution`, series `network`, release `publisher`, international `broadcaster`, or `organizations[]` field |
| `artwork` | `posters-key-art`, `title-design`, `covers` *(new)*, `night-gallery-paintings` *(new)*, `production-design` *(new)*, `props-costumes` *(new)*, `art-illustration`, `other-artwork` | works kind artwork/prop, comic creators credited `(cover)`, media images with subtype cover-art/poster/key-art/illustration, poster ads |
| `episodes` (TV episodes) | `tv` | episodes, Night Gallery episodes |
| `radio` *(new)* | `series`, `episodes`, `original-stories`, `unmade-scripts` | radio series and radio episodes |
| `podcasts` *(new)* | `shows`, `episodes` | podcasts and their featured_episodes |
| `events` | `premieres`, `broadcasts-marathons`, `honors-awards`, `production-history`, `serling-life`, `legal` *(new: trials, lawsuits, censorship, rights)*, `anniversaries-festivals`, `conventions`, `exhibitions`, `other-events` | works kind event/convention/memorial/legal, series/film history[] |
| `games` | `pinball-arcade`, `video-games`, `board-card-games`, `game-homages` *(new)*, `other-games` | works kind game |
| `homages` | `adaptations-remakes`, `inspired-by`, `homages`, `parodies`, `references`, `in-other-shows`, `in-everyday-language` *(new)* | connections, films kind tv-episode/segment/sketch, works kind parody/cultural-impact |
| `lectures` | `serling-lectures`, `academic`, `classroom`, `readings-panels` | essays kind speech/lecture, works kind lecture/education |
| `merchandise` | `collectibles`, `toys-figures`, `trading-cards`, `home-media`, `household-apparel`, `replicas` *(new)*, `other-merchandise` | works kind collectible/home-media, series/film releases[] |
| `movies` | `twilight-zone-films`, `rod-serling-films`, `unmade-projects`, `linked-films`, `tv-films`, `documentaries`, `shorts-and-other` | films |
| `music` | `theme`, `soundtracks`, `composers`, `songs` | works kind soundtrack, songs, composers |
| `reading` | `books`, `comics`, `magazines`, `essays`, `articles`, `scripts`, `websites` *(new)*, and the reading thread's new subcategories | books, comics, magazines, essays, works kind link (reference, fan-site, academic) |
| `series` (TV series) | `tv`, `international` | series, films kind tv-series |
| `stage` *(new)* | `theatre`, `live-readings`, `attractions` | works kind stage/attraction, films kind stage, attraction locations |

### Content records

These records are content, not category entries. They show on every page they belong to (the "Media
and content" section), in the Media Library, and in the review sheet as Category "Content (shown on other
records)" with Group "On: ...".

| Content | Which records | Shown on |
|---|---|---|
| Advertisement | works kind `advertisement`, films kind `commercial` | what it promoted or sponsored, the sponsor or advertiser organization |
| Archival holding | archives | the holding organization (`institution`) and the person or series it documents |
| Quote | quotes | the person and the episodes it is about |
| Review | essays kind `review` (subtypes contemporary, retrospective, ranking, award citation, aggregate score) | the work, series or episode it reviews (`reviews[]`, `episodes[]`) |
| Interview | essays kind `interview` | the people and works it is about |
| Link | works kind `link` with subtype database, official, streaming, archive, foundation or museum | the record it is about, and its host organization |

Say where content belongs with `content_of[]` (refs: `series/1959`, an episode id `1959/<slug>`,
`films/<id>`, `people/<slug>`, `organizations/<id>`, `works/<id>`, `archives/<id>`, `locations/<id>`) and
name organizations with `organizations[]`. `details.relates_to` names are also matched.

### New optional fields (every collection)

- `official: true | false`: overrides the automatic Official / Unofficial and inspired split.
- `organizations[]`: organization names involved (sponsor, maker, holder, publisher). Each gets a page.
- `content_of[]`: for content records, the records it belongs on (above).
- `categories[]`: extra `"<category>/<subcategory>"` placements, on top of the automatic ones.
- `media[]`: legitimately hosted media about the record. A `creator` field credits the artist,
  photographer or designer, and `rights_holder` names who owns the rights when that is someone else
  (shown as "© CBS Studios"); an image with subtype `cover-art`, `poster`, `key-art` or `illustration` is
  also listed under Artwork.

### Organizations collection

`organizations/<slug>.yaml`: name (required), aka[] (every variant spelling used in other records, so
they fold into one page), kind (`network`, `studio`, `streamer`, `production-company`, `publisher`,
`licensee`, `record-label`, `game-company`, `toy-company`, `home-video`, `sponsor`, `advertiser`,
`archive`, `library`, `museum`, `foundation`, `society`, `award-body`, `school`, `fan-group`, `website`,
`auction-house`, `other`), official (true for the franchise's makers, broadcasters, licensees and
sponsors), founded, ended, location, website, description (own words), parent, plus the common fields.
An organization named in another record gets a page even without a record here; a record adds its
description and folds variant names. 47 seed records exist (tagged `seed-record`).

People `roles[]` are matched loosely (case and plural ignored): writer, director, producer, actor,
host, narrator, voice, composer/musician, cinematographer/editor/makeup/effects/crew, scholar/historian,
fan/collaborator, family, inspired-by.

### New optional fields (every collection)

- `categories[]`: extra `"<category>/<subcategory>"` placements, on top of the automatic ones.
- `media[]`: legitimately hosted media about the record.

```yaml
media:
  - type: video          # video | audio | image | map | document | article | text | review | interview | quote | ad | transcript | website | link | file
                         # also accepted and folded: letter, memo, call-sheet, press-kit, teleplay -> document; still, poster, key-art, cover-art, illustration, painting -> image; plan -> map; pdf -> file
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
