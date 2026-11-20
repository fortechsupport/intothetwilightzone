import { defineCollection } from 'astro:content';
import { glob, type Loader } from 'astro/loaders';
import { isVisible, loadDecisions, reviewMode, statusOf } from './lib/review';
import { z } from 'astro/zod';

const source = z.object({
  title: z.string(),
  url: z.string().url().optional(),
  note: z.string().optional(),
});
const ids = z.record(z.string(), z.string()).optional();
// A media attachment. `kind` and `license` are accepted as aliases of `type` and `rights`.
const MEDIA_TYPES = ['video', 'audio', 'document', 'image', 'ad', 'article', 'interview', 'transcript', 'website', 'link'] as const;
const mediaItem = z.preprocess((raw) => {
  if (!raw || typeof raw !== 'object') return raw;
  const m = { ...(raw as Record<string, unknown>) };
  if (m.type === undefined && m.kind !== undefined) m.type = m.kind;
  if (m.rights === undefined && m.license !== undefined) m.rights = m.license;
  // Finer kinds other threads use fold into the main types; the original word is kept as `subtype`.
  const t = String(m.type ?? '');
  const fold: Record<string, string> = {
    advertisement: 'ad', commercial: 'ad', promo: 'video', trailer: 'video', clip: 'video', 'full-episode': 'video',
    script: 'document', photo: 'image', poster: 'image', other: 'link', podcast: 'audio', 'radio': 'audio', listing: 'link',
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
};
// Every collection loads through the review filter: a build only keeps the records its
// REVIEW_MODE allows (see src/lib/review.ts), so pages never need to check review status.
const yaml = (dir: string): Loader => {
  const inner = glob({ pattern: '**/*.yaml', base: `./src/content/${dir}` });
  return {
    name: 'reviewed-glob-loader',
    load: async (context) => {
      await inner.load(context);
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
    directors: names,
    cast: names,
    ...common,
  }),
});

const connections = defineCollection({
  loader: yaml('connections'),
  schema: z.object({
    from: ref,
    to: ref,
    kind: z.enum(['official-adaptation', 'remake', 'inspired-by', 'homage', 'parody', 'reference', 'lyric-mention']),
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
    original_writer: z.string().optional(),
    adapted_by: z.string().optional(),
    voiced_by: names,
    adapts_episode: z.string().optional(),
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
    covers: names, // series ids or films/<id> the podcast covers
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
  essays,
  archives,
  works,
  locations,
  series, episodes, films, connections, songs, books, comics, magazines, radio, podcasts, people, quotes,
};
