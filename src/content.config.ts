import { defineCollection } from 'astro:content';
import { glob, type Loader } from 'astro/loaders';
import { isVisible, loadDecisions, reviewMode, statusOf } from './lib/review';
import { z } from 'astro/zod';

// Credit where credit is due (Adam, 2026-11-21): a source names its author and its publication when known.
const source = z.object({
  title: z.string(),
  url: z.string().url().optional(),
  author: z.string().optional(), // the writer or researcher: "Marc Scott Zicree"
  publisher: z.string().optional(), // the publication or site: "Bantam Books", "The Twilight Zone Wiki (Fandom)"
  note: z.string().optional(),
});
const ids = z.record(z.string(), z.string()).optional();
// A media attachment. `kind` and `license` are accepted as aliases of `type` and `rights`.
// The Media Library groups these as Video, Audio, Images, Maps, Documents, Articles and text, Reviews,
// Interviews, Quotes, Advertisements, Links and Other files (LIBRARY_TYPES in src/lib/taxonomy.mjs).
const MEDIA_TYPES = ['video', 'audio', 'document', 'image', 'map', 'ad', 'article', 'text', 'review', 'interview', 'quote', 'transcript', 'website', 'link', 'file'] as const;
const mediaItem = z.preprocess((raw) => {
  if (!raw || typeof raw !== 'object') return raw;
  const m = { ...(raw as Record<string, unknown>) };
  if (m.type === undefined && m.kind !== undefined) m.type = m.kind;
  if (m.rights === undefined && m.license !== undefined) m.rights = m.license;
  // Finer kinds other threads use fold into the main types; the original word is kept as `subtype`.
  const t = String(m.type ?? '');
  const fold: Record<string, string> = {
    advertisement: 'ad', commercial: 'ad', promo: 'video', trailer: 'video', clip: 'video', 'full-episode': 'video',
    script: 'document', letter: 'document', memo: 'document', 'call-sheet': 'document', 'press-kit': 'document', teleplay: 'document',
    photo: 'image', still: 'image', poster: 'image', 'key-art': 'image', 'cover-art': 'image', illustration: 'image', painting: 'image',
    other: 'link', podcast: 'audio', 'radio': 'audio', listing: 'link', pdf: 'file', plan: 'map',
  };
  if (fold[t]) { m.subtype ??= t; m.type = fold[t]; }
  const r = String(m.rights ?? '');
  const rfold: Record<string, string> = {
    copyrighted: 'link-only', official: 'licensed', archive: 'link-only', 'hosted-by-rights-holder': 'licensed', 'hosted-by-archive': 'link-only',
  };
  if (rfold[r]) m.rights = rfold[r];
  delete m.kind; delete m.license;
  return m;
}, z.object({
  type: z.enum(MEDIA_TYPES),
  subtype: z.string().optional(), // trailer, promo, full-episode, interview, script, poster...
  title: z.string(),
  url: z.string().url(),
  // Who hosts it: archive.org, an official YouTube channel, a museum, a library.
  host: z.string().optional(),
  date: z.string().optional(),
  // public-domain and cc files may be saved under public/media/<collection>/<id>/ and named in `file`;
  // licensed and link-only items are linked, never re-hosted.
  rights: z.enum(['public-domain', 'cc', 'licensed', 'link-only', 'unknown']).default('link-only'),
  file: z.string().optional(),
  duration: z.string().optional(),
  // Who made it: the cover artist, photographer, poster designer or speaker. An image with a subtype
  // of cover-art, poster, key-art or illustration is also listed under Artwork.
  creator: z.string().optional(),
  // Who owns the rights, when it is not the creator: "CBS Studios", "Rod Serling Trust", "Associated Press".
  rights_holder: z.string().optional(),
  note: z.string().max(400).optional(),
}));
const media = z.array(mediaItem).default([]);
const links = z.record(z.string(), z.string()).optional();
const common = {
  sources: z.array(source).default([]),
  ids,
  links,
  locked: z.boolean().optional(),
  last_verified: z.string().optional(),
  // How sure the researcher is about the record as a whole (connections use their own `confidence`).
  research_confidence: z.enum(['high', 'medium', 'low']).optional(),
  // How closely the item relates to the franchise: core (about The Twilight Zone itself),
  // related (Rod Serling, Night Gallery, the show's writers), tangential (mentions or borrows the name).
  relevance: z.enum(['core', 'related', 'tangential']).optional(),
  // Light labels such as self-published, unverified, unlicensed, teleplay.
  tags: z.array(z.string()).default([]),
  // Set on a record that duplicates another; pages hide it and the importer leaves it alone.
  duplicate_of: z.string().optional(),
  // Extra places for this record in the site taxonomy, as "<category>/<subcategory>" slugs
  // (see src/lib/taxonomy.ts). Added on top of the automatic placement. An unknown subcategory
  // slug creates a new subcategory, flagged "new" so Adam can keep or drop it.
  categories: z.array(z.string().regex(/^[a-z0-9-]+\/[a-z0-9-]+$/)).default([]),
  // Legitimately hosted media about the record: videos, audio, documents, ads, images, links.
  media,
  // Official (made, broadcast, licensed or published by the franchise's makers or by Rod Serling) or
  // unofficial (made by others about, after or inspired by the show). Leave unset to use the rules in
  // src/lib/taxonomy.mjs isOfficial().
  official: z.boolean().optional(),
  // Organizations involved, by name (sponsor, publisher, maker, holder). Each name gets an
  // organization page; an organizations/<id> record with that name or aka adds its details.
  organizations: z.array(z.string()).default([]),
  // For content records (advertisements, archival holdings, quotes, documents): the records it belongs
  // on, as refs: "series/1959", an episode id "1959/<slug>", "films/<id>", "people/<slug>",
  // "organizations/<id>", "works/<id>"... It is shown on each of those pages.
  content_of: z.array(z.string()).default([]),
};
// Every collection loads through the review filter: a build only keeps the records its
// REVIEW_MODE allows (see src/lib/review.ts), so pages never need to check review status.
const yaml = (dir: string): Loader => {
  const inner = glob({ pattern: '**/*.yaml', base: `./src/content/${dir}` });
  return {
    name: 'reviewed-glob-loader',
    load: async (context) => {
      await inner.load(context);
      // Films kept on file only for a writer's filmography links have no page in any mode.
      for (const id of context.store.keys()) if ((context.store.get(id)?.data as any)?.filmography_only) context.store.delete(id);
      const mode = reviewMode();
      if (mode === 'all') return;
      const decisions = loadDecisions();
      for (const id of context.store.keys()) {
        if (!isVisible(statusOf(decisions, `${context.collection}/${id}`), mode)) context.store.delete(id);
      }
    },
  };
};
const names = z.array(z.string()).default([]);
// A connection endpoint: "films/<id>", "songs/<id>", "series/<year>", or a bare episode id "<year>/<slug>".
const ref = z.string().regex(/^([a-z]+\/[a-z0-9-]+|\d{4}\/[a-z0-9-]+)$/);

const historyEvent = z.object({
  date: z.string(),
  title: z.string(),
  text: z.string().max(600),
  sources: z.array(source).min(1),
});
const internationalTitle = z.object({
  country: z.string(),
  language: z.string().optional(),
  title: z.string(),
  broadcaster: z.string().optional(),
  year: z.number().optional(),
  note: z.string().optional(),
  sources: z.array(source).min(1),
});
const release = z.object({
  date: z.string().optional(),
  format: z.string(),
  title: z.string(),
  publisher: z.string().optional(),
  region: z.string().optional(),
  note: z.string().max(400).optional(),
  // The record that describes this release in full ("works/<id>"), when there is one: the row links to it.
  record: z.string().optional(),
  sources: z.array(source).min(1),
});
const releases = z.array(release).default([]);
const history = z.array(historyEvent).default([]);
const internationalTitles = z.array(internationalTitle).default([]);

const series = defineCollection({
  loader: yaml('series'),
  schema: z.object({
    title: z.string(),
    years: z.string(),
    network: z.string(),
    host: z.string(),
    seasons: z.number(),
    order: z.number(),
    summary: z.string(),
    history,
    international_titles: internationalTitles,
    releases,
    ...common,
  }),
});

const episodes = defineCollection({
  loader: yaml('episodes'),
  schema: z.object({
    title: z.string(),
    aka: names,
    series: z.enum(['1959', '1985', '2002', '2019']),
    season: z.number(),
    episode: z.string(),
    air_date: z.string().optional(),
    runtime_min: z.number().optional(),
    production_code: z.string().optional(),
    writers: names,
    writing_credit_note: z.string().optional(),
    source_authors: names,
    directors: names,
    cast: names,
    narrator: z.string().optional(),
    synopsis: z.string().optional(),
    themes: names,
    trivia: z.array(z.object({ text: z.string().max(400), sources: z.array(source).min(1) })).default([]),
    // Who wrote the episode's music (Music plan Q4). score: original (written for the episode), stock (CBS library
    // cues chosen by a music editor) or both. composers: the original score's composers; library_composers: the
    // library cues' composers, only where a cue sheet is sourced.
    music: z
      .object({
        score: z.enum(['original', 'stock', 'original-and-stock']),
        composers: names,
        library_composers: names,
        note: z.string().max(400).optional(),
        sources: z.array(source).min(1),
      })
      .optional(),
    ...common,
  }),
});

const segment = z.object({
  title: z.string(),
  adapts_episode: z.string().optional(),
  // Own-words summary and the story a segment adapts (used by Night Gallery and other anthologies).
  summary: z.string().optional(),
  source_title: z.string().optional(),
  source_authors: names,
  writers: names,
  directors: names,
  cast: names,
});

const films = defineCollection({
  loader: yaml('films'),
  schema: z.object({
    title: z.string(),
    aka: names, // other titles a source gives the work ("Old MacDonald Has a Curve")
    kind: z.enum(['film', 'tv-film', 'tv-episode', 'tv-segment', 'tv-series', 'sketch', 'documentary', 'special', 'pilot', 'stage', 'unproduced', 'short', 'music-video', 'commercial', 'web-series']).default('film'),
    summary: z.string().optional(),
    parent_series: z.string().optional(),
    segments: z.array(segment).default([]),
    history,
    international_titles: internationalTitles,
    releases,
    release_date: z.string().optional(),
    rating: z.string().optional(),
    runtime_min: z.number().optional(),
    writers: names,
    writing_credit_note: z.string().optional(), // co-writers, adaptation, or how the credit is known
    // The story, novel, play or teleplay the work is based on, and who wrote it (Movies plan, section 3).
    source_title: z.string().optional(),
    source_authors: names,
    directors: names,
    cast: names,
    composer: names, // who wrote the score
    // Rod Serling's part in it, for the shelf "Rod Serling's films" (grouped by role, Movies plan section 2):
    // written (his screenplay or teleplay, made in his lifetime), from-his-work (others' scripts from his
    // teleplays or stories, or his scripts produced after his death), narrated (voice or narration),
    // appeared (on screen as himself or a character).
    serling_role: z.enum(['written', 'from-his-work', 'narrated', 'appeared']).optional(),
    // A film by a Twilight Zone writer with no tie to the show, its episodes or Serling (Adam, 2026-11-23, Q2):
    // no page of its own. The record is kept, and the writer's People page links out to it and to their
    // filmography. The loader drops it from every build; src/lib/filmography.ts reads it from the YAML.
    filmography_only: z.boolean().optional(),
    // A series' run (kind tv-series), from its sourced reference page (decision 0002, plan section 5).
    network: z.string().optional(),
    end_date: z.string().optional(), // last first-run broadcast; release_date is the first
    seasons: z.number().optional(),
    episode_count: z.number().optional(),
    created_by: names,
    presented_by: names, // hosts and narrators
    country: z.string().optional(),
    // Sourced statements of how a series connects to The Twilight Zone (own words, one sentence each).
    ties: z.array(z.object({ text: z.string().max(400), sources: z.array(source).min(1) })).default([]),
    ...common,
  }),
});

const connections = defineCollection({
  loader: yaml('connections'),
  schema: z.object({
    from: ref,
    to: ref,
    kind: z.enum(['official-adaptation', 'remake', 'inspired-by', 'compared', 'homage', 'parody', 'reference', 'lyric-mention']),
    confidence: z.enum(['confirmed-by-creator', 'documented', 'fan-noted']),
    summary: z.string().optional(),
    evidence: z.string().optional(),
    ...common,
  }),
});

const songs = defineCollection({
  loader: yaml('songs'),
  schema: z.object({
    title: z.string(),
    artist: z.string().optional(),
    album: z.string().optional(),
    genre: z.string().optional(),
    length: z.string().optional(),
    year: z.number().optional(),
    tz_connection: z.enum(['theme', 'lyric-mention', 'reference', 'unclassified']),
    // How the song uses the show, where tz_connection is not enough (Music plan, shelves A to D): main-title (a
    // show's own theme), sample, tribute or title-reference. songConnection() in src/lib/taxonomy.mjs reads it.
    subtype: z.enum(['main-title', 'sample', 'tribute', 'title-reference']).optional(),
    lyric_excerpt: z.string().max(200).optional(),
    description: z.string().optional(),
    ...common,
  }),
});

const books = defineCollection({
  loader: yaml('books'),
  schema: z.object({
    title: z.string(),
    authors: names,
    publisher: z.string().optional(),
    published: z.string().optional(),
    pages: z.number().optional(),
    description: z.string().optional(),
    kind: z.string().optional(),
    isbn: z.string().optional(),
    // A story an episode adapts (Read plan, 2026-11-24): where and when it first appeared, only as a source states it.
    first_published_in: z.string().optional(),
    first_published: z.string().optional(),
    episodes: names,
    ...common,
  }),
});

const comics = defineCollection({
  loader: yaml('comics'),
  schema: z.object({
    title: z.string(),
    series_name: z.string().optional(),
    publisher: z.string().optional(),
    cover_date: z.string().optional(),
    order: z.number().optional(),
    creators: names,
    description: z.string().optional(),
    kind: z.string().optional(),
    isbn: z.string().optional(),
    episodes: names,
    ...common,
  }),
});

const magazines = defineCollection({
  loader: yaml('magazines'),
  schema: z.object({
    title: z.string(),
    magazine: z.string().optional(),
    cover_date: z.string().optional(),
    order: z.number().optional(),
    publisher: z.string().optional(),
    editor: z.string().optional(),
    // Who painted or drew the cover (Read plan, 2026-11-24), only as a source names them.
    cover_artist: z.string().optional(),
    description: z.string().optional(),
    kind: z.string().optional(),
    isbn: z.string().optional(),
    episodes: names,
    ...common,
  }),
});

const radio = defineCollection({
  loader: yaml('radio'),
  schema: z.object({
    title: z.string(),
    series_title: z.string().optional(),
    season: z.number().optional(),
    season_order: z.number().optional(),
    volume: z.number().optional(),
    volume_order: z.number().optional(),
    volume_released: z.string().optional(),
    // A dated broadcast in the 2003-04 syndicated run (Old Time Radio Researchers' log); not necessarily the first airing.
    broadcast_date: z.string().optional(),
    original_writer: z.string().optional(),
    adapted_by: z.string().optional(),
    voiced_by: names,
    adapts_episode: z.string().optional(),
    // What a radio drama adapts when it is not a Twilight Zone episode (a play, a short story).
    based_on: z.string().optional(),
    based_on_ref: z.string().optional(), // its record, as films/<id>
    // A record about a whole radio series or about how it was broadcast and released, rather than one episode.
    subtype: z.enum(['audio-series', 'radio-broadcast']).optional(),
    // Rod Serling's part in a radio work outside the radio dramas (Radio > Rod Serling's radio work, grouped by it).
    serling_role: z.enum(['wrote', 'acted', 'hosted', 'unproduced']).optional(),
    description: z.string().optional(),
    ...common,
  }),
});

const podcasts = defineCollection({
  loader: yaml('podcasts'),
  schema: z.object({
    title: z.string(),
    hosts: names,
    first_episode: z.string().optional(),
    description: z.string().optional(),
    status: z.enum(['active', 'ended', 'unknown']).optional(),
    episode_count: z.number().optional(),
    // The date episode_count was read from the feed (feeds can drop old episodes).
    episode_count_as_of: z.string().optional(),
    covers: names, // series ids or films/<id> the podcast covers
    // What the record is (docs/plans/research-podcasts.md, shelves B to D): a podcast devoted to the show, a
    // recurring segment inside another podcast, one episode (or a short run) of another podcast, or audio fiction.
    kind: z.enum(['podcast', 'segment', 'single-episode', 'fiction']).optional(),
    network: z.string().optional(),
    guests: names,
    // The episode table (Q3): feed false = never read this record's feed (a single episode of another podcast);
    // feed_filter = keep only feed episodes whose titles match this pattern (a segment inside another podcast).
    feed: z.boolean().optional(),
    feed_filter: z.string().optional(),
    // episode_links = 'apple' when the feed's episode pages are gone: episodes link to their Apple Podcasts pages.
    episode_links: z.enum(['apple']).optional(),
    // Shelf C's groups (a single episode's main subject); the show is the default.
    subject: z.enum(['show', 'serling', 'film-1983', 'night-gallery', 'revival-2019']).optional(),
    featured_episodes: z.array(z.object({
      title: z.string(),
      date: z.string().optional(),
      url: z.string().url().optional(),
      covers_episode: z.string().optional(),
    })).default([]),
    ...common,
  }),
});

const people = defineCollection({
  loader: yaml('people'),
  schema: z.object({
    name: z.string(),
    aka: names, // other names the person is credited under; their credits fold into this page
    born: z.string().optional(),
    died: z.string().optional(),
    bio: z.string().optional(),
    roles: names,
    // Credits that no episode or film record carries (composers, producers, crew, hosts, historians).
    tz_credits: z.array(z.object({
      series: z.string(),
      work: z.string(),
      role: z.string().optional(),
      ref: z.string().optional(),
    })).default([]),
    // Dated life events in own words, oldest first; the record's sources cover them.
    timeline: z.array(z.object({ date: z.string(), text: z.string() })).default([]),
    ...common,
  }),
});

const quotes = defineCollection({
  loader: yaml('quotes'),
  schema: z.object({
    person: z.string(),
    text: z.string().max(400),
    date: z.string().optional(),
    context: z.string().optional(),
    episodes: names,
    ...common,
  }),
});

const locations = defineCollection({
  loader: yaml('locations'),
  schema: z.object({
    name: z.string(),
    address: z.string().optional(),
    lat: z.number().optional(),
    lng: z.number().optional(),
    status: z.string().optional(),
    // in-story: a fictional place (Willoughby, Peaksville); its `filmed` entries list where it appears.
    kind: z.enum(['backlot-set', 'filming-location', 'serling-place', 'attraction', 'museum-exhibit', 'memorial', 'archive', 'event-venue', 'in-story']).optional(),
    episodes: names,
    city: z.string().optional(),
    region: z.string().optional(),
    country: z.string().optional(),
    opened: z.string().optional(),
    closed: z.string().optional(),
    filmed: z.array(z.object({ ref: z.string(), note: z.string().optional() })).default([]),
    notes: z.string().optional(),
    ...common,
  }),
});

const works = defineCollection({
  loader: yaml('works'),
  schema: z.object({
    title: z.string(),
    kind: z.enum(['game', 'collectible', 'artwork', 'stage', 'attraction', 'parody', 'convention', 'television', 'soundtrack', 'event', 'link', 'fan-community', 'memorial', 'education', 'lecture', 'advertisement', 'home-media', 'legal', 'cultural-impact', 'prop', 'production', 'other']),
    year: z.union([z.number(), z.string()]).optional(),
    creator: z.string().optional(),
    publisher: z.string().optional(),
    description: z.string().optional(),
    subtype: z.string().optional(),
    details: z.record(z.string(), z.unknown()).optional(),
    ...common,
  }),
});

const essays = defineCollection({
  loader: yaml('essays'),
  schema: z.object({
    title: z.string(),
    authors: names,
    published_in: z.string().optional(),
    published: z.string().optional(),
    kind: z.enum(['essay', 'journal-article', 'book-chapter', 'speech', 'interview', 'review', 'article', 'lecture', 'script', 'academic-thesis']).optional(),
    description: z.string().optional(),
    // Reviews: what is reviewed (refs like series/1959, films/<id>, or an episode id), the kind of review, the outlet's rating.
    reviews: names,
    review_type: z.enum(['contemporary', 'retrospective', 'ranking', 'awards-citation']).optional(),
    outlet_rating: z.string().optional(),
    episodes: names,
    ...common,
  }),
});

const archives = defineCollection({
  loader: yaml('archives'),
  schema: z.object({
    name: z.string(),
    institution: z.string().optional(),
    location: z.string().optional(),
    dates: z.string().optional(),
    extent: z.string().optional(),
    description: z.string().optional(),
    url: z.string().optional(),
    ...common,
  }),
});

// Organizations: networks, studios, production companies, publishers, licensees, sponsors, archives,
// museums, foundations, award bodies, schools and fan groups. Records named in other records'
// publisher, institution, network or organizations fields get a page even without a record here;
// a record adds the description, kind and links, and its `aka` folds variant names together.
const organizations = defineCollection({
  loader: yaml('organizations'),
  schema: z.object({
    name: z.string(),
    aka: names,
    kind: z.enum(['network', 'studio', 'streamer', 'production-company', 'publisher', 'licensee', 'record-label', 'game-company', 'toy-company', 'home-video', 'sponsor', 'advertiser', 'archive', 'library', 'museum', 'foundation', 'society', 'award-body', 'school', 'fan-group', 'website', 'auction-house', 'other']),
    founded: z.string().optional(),
    ended: z.string().optional(),
    location: z.string().optional(),
    website: z.string().url().optional(),
    description: z.string().optional(),
    parent: z.string().optional(), // another organization's name, e.g. Western Publishing for Gold Key
    ...common,
  }),
});

// Characters from the stories: Talky Tina, the Kanamits, Henry Bemis.
const characters = defineCollection({
  loader: yaml('characters'),
  schema: z.object({
    name: z.string(),
    aka: names,
    kind: z.enum(['human', 'alien', 'robot', 'supernatural', 'animal', 'object', 'other']).optional(),
    played_by: names, // exact person name strings
    appears_in: names, // episode ids or films/<id>, radio/<id>, comics/<id>
    description: z.string().optional(),
    recurring: z.boolean().optional(),
    ...common,
  }),
});

export const collections = {
  characters,
  organizations,
  essays,
  archives,
  works,
  locations,
  series, episodes, films, connections, songs, books, comics, magazines, radio, podcasts, people, quotes,
};
