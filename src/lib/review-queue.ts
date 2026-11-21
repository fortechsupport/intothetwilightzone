// Builds the review queue: one summary row per record in src/content, read straight from the
// YAML files so it includes records the current REVIEW_MODE hides. scripts/review.py builds the
// same rows for the spreadsheet; keep the two field lists in step.
import { existsSync, readdirSync, readFileSync, statSync } from 'node:fs';
import { join, relative, resolve } from 'node:path';
import { parse } from 'yaml';
import { loadDecisions, statusOf, type ReviewStatus } from './review';
import { slugify } from './slug';
import { assess } from './assessments';
import { subRank } from './categories';

export interface QueueRow {
  key: string;
  collection: string;
  id: string;
  title: string;
  kind?: string;
  date?: string;
  who?: string;
  summary?: string;
  relevance?: string;
  confidence?: string;
  tags: string[];
  duplicate_of?: string;
  locked: boolean;
  sources: { title: string; url?: string }[];
  url?: string;
  status: ReviewStatus;
  notes?: string;
  reviewed?: string;
  // From data/review/assessments.json (scripts/assess.py): why the record is here and what to do with it.
  subcategory?: string;
  sort?: string;
  connection?: string;
  tier?: string;
  tier_reason?: string;
  recommendation?: string;
  reason?: string;
  source_title?: string;
  source_url?: string;
}

// Display names and order of categories on the review page and in the spreadsheet.
export const CATEGORY_LABELS: Record<string, string> = {
  series: 'Series',
  episodes: 'TV episodes',
  films: 'Films and other screen works',
  connections: 'Influence links',
  people: 'People',
  characters: 'Characters',
  quotes: 'Quotes',
  locations: 'Places',
  songs: 'Songs',
  radio: 'Radio dramas',
  podcasts: 'Podcasts',
  books: 'Books',
  comics: 'Comics',
  magazines: 'Magazines',
  essays: 'Essays and articles',
  archives: 'Archives',
  submissions: 'Fan submissions',
  organizations: 'Organizations',
  works: 'Games, merchandise and other works',
};

const first = (d: any, fields: string[]) => {
  for (const f of fields) {
    const v = d[f];
    if (v !== undefined && v !== null && v !== '' && !(Array.isArray(v) && v.length === 0)) return v;
  }
  return undefined;
};
const text = (v: unknown) => (v === undefined ? undefined : Array.isArray(v) ? v.join(', ') : String(v));

function title(collection: string, id: string, d: any): string {
  if (collection === 'quotes') return `${d.person}: "${String(d.text ?? '').slice(0, 80)}${String(d.text ?? '').length > 80 ? '…' : ''}"`;
  if (collection === 'connections') return `${d.from} → ${d.to}`;
  if (collection === 'episodes') return `${d.title} (${d.series}, S${d.season}E${d.episode})`;
  return String(d.title ?? d.name ?? id);
}

function pageUrl(collection: string, id: string, d: any): string | undefined {
  switch (collection) {
    case 'episodes': return `/episodes/${id}/`;
    case 'films': case 'works': case 'series': return `/${collection}/${id}/`;
    case 'locations': return `/places/${id}/`;
    case 'people': return `/people/${slugify(d.name ?? id)}/`;
    case 'connections': return '/homages/';
    case 'books': case 'comics': case 'magazines': case 'podcasts': case 'radio': case 'songs':
    case 'essays': case 'archives': case 'quotes': case 'characters': case 'organizations':
      return `/${collection}/${id}/`;
  }
  return undefined;
}

export function rowFor(collection: string, id: string, d: any, decisions = loadDecisions()): QueueRow {
  const key = `${collection}/${id}`;
  const dec = decisions[key];
  return {
    key, collection, id,
    title: title(collection, id, d),
    kind: text(first(d, ['kind', 'tz_connection', 'series_title', 'series_name', 'magazine'])),
    date: text(first(d, ['air_date', 'release_date', 'published', 'cover_date', 'year', 'volume_released', 'first_episode', 'date', 'born', 'opened', 'dates', 'years'])),
    who: text(first(d, ['artist', 'authors', 'creators', 'creator', 'writers', 'hosts', 'original_writer', 'publisher', 'institution', 'person', 'roles'])),
    summary: text(first(d, ['description', 'summary', 'synopsis', 'bio', 'evidence', 'notes', 'context', 'text', 'lyric_excerpt'])),
    relevance: d.relevance,
    confidence: d.confidence ?? d.research_confidence,
    tags: Array.isArray(d.tags) ? d.tags.map(String) : [],
    duplicate_of: d.duplicate_of,
    locked: d.locked === true,
    sources: (Array.isArray(d.sources) ? d.sources : []).map((s: any) => ({ title: String(s.title ?? s.url ?? 'Source'), url: s.url })),
    url: pageUrl(collection, id, d),
    status: statusOf(decisions, key),
    notes: dec?.notes,
    reviewed: dec?.date,
    ...(() => {
      const a = assess(key);
      return a ? { title: a.title || title(collection, id, d), subcategory: a.subcategory, sort: a.sort, connection: a.connection, tier: a.tier, tier_reason: a.tier_reason,
        recommendation: a.recommendation, reason: a.reason, source_title: a.source_title, source_url: a.source_url } : {};
    })(),
  };
}

function walk(dir: string): string[] {
  return readdirSync(dir).flatMap((name) => {
    const p = join(dir, name);
    return statSync(p).isDirectory() ? walk(p) : p.endsWith('.yaml') ? [p] : [];
  });
}

export function reviewQueue(root = resolve(process.cwd(), 'src/content')): QueueRow[] {
  const decisions = loadDecisions();
  const order = Object.keys(CATEGORY_LABELS);
  const rows: QueueRow[] = [];
  for (const collection of readdirSync(root)) {
    const dir = join(root, collection);
    if (!statSync(dir).isDirectory()) continue;
    for (const file of walk(dir)) {
      const id = relative(dir, file).replace(/\\/g, '/').replace(/\.yaml$/, '');
      const d = parse(readFileSync(file, 'utf8')) ?? {};
      rows.push(rowFor(collection, id, d, decisions));
    }
  }
  // Fan corrections and submissions from GitHub issues (scripts/submissions.py) are reviewed like records.
  const subsPath = resolve(process.cwd(), 'data/review/submissions.json');
  const subs: Record<string, any> = existsSync(subsPath) ? JSON.parse(readFileSync(subsPath, 'utf8')) : {};
  for (const [key, s] of Object.entries(subs)) {
    const f = s.fields ?? {};
    const isSub = s.type === 'submission';
    rows.push({
      key, collection: 'submissions', id: key.split('/')[1], title: s.title ?? key, kind: f.kind ?? s.type, date: s.opened, who: f.credit,
      summary: f.description ?? f.problem, tags: [], locked: false, url: f.page ?? s.url,
      sources: [{ title: `GitHub issue #${s.issue}`, url: s.url }],
      status: statusOf(decisions, key), notes: decisions[key]?.notes, reviewed: decisions[key]?.date,
      subcategory: isSub ? 'Submissions' : 'Corrections', sort: String(s.title ?? '').toLowerCase(),
      connection: f.connection ?? f.fix, recommendation: 'maybe',
      reason: isSub ? 'Fan submission: include to accept it for research and sourcing, exclude to decline.' : 'Fan correction: include to accept and apply it once the source checks out, exclude to decline.',
      source_title: `GitHub issue #${s.issue}`, source_url: s.url,
    });
  }
  // Grouped by category (alphabetical by label), then subcategory, then title ignoring a leading The/A/An.
  void order;
  const label = (c: string) => CATEGORY_LABELS[c] ?? c;
  return rows.sort((a, b) => label(a.collection).localeCompare(label(b.collection))
    || subRank(a.subcategory ?? '').localeCompare(subRank(b.subcategory ?? ''))
    || (a.sort ?? '').localeCompare(b.sort ?? '')
    || a.key.localeCompare(b.key, undefined, { numeric: true }));
}
