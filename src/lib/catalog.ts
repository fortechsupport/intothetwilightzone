// Builds the site catalogue: every record (and a few derived entries such as home-media releases
// and production-history events) placed into the taxonomy in src/lib/taxonomy.mjs, as list items
// ready for the category and subcategory landing pages.
import { getCollection } from 'astro:content';
import { allEpisodes, allPeople, episodeNumber, CONNECTION_LABELS, CONFIDENCE_LABELS } from './data';
import { assess } from './assessments';
import { slugify } from './slug';
import { TAXONOMY, CATEGORY, place, placePerson, explicitPlacements, mediaSub, sortKey, subTitleFromSlug, SERIES_LABEL } from './taxonomy.mjs';

export interface Entry {
  key: string; // "<collection>/<id>" or a derived key
  title: string;
  href?: string;
  meta?: string;
  desc?: string;
  why?: string;
  tier?: string;
  sort: string;
  group?: string;
  external?: boolean;
  isNew?: boolean; // placed through a categories[] slug that created a new subcategory
}
export interface SubInfo { slug: string; title: string; blurb: string; intro?: string; isNew?: boolean; order?: 'az' | 'chrono'; entries: Entry[] }
export interface CatInfo { slug: string; title: string; isNew?: boolean; description: string; intro: string[]; connection: string; seeAlso?: [string, string][]; subs: SubInfo[] }

const clamp = (s: string | undefined, n = 360) => {
  if (!s) return undefined;
  const t = s.replace(/\s+/g, ' ').trim();
  if (t.length <= n) return t;
  const cut = t.slice(0, n);
  const end = Math.max(cut.lastIndexOf('. '), cut.lastIndexOf('; '));
  return end > n * 0.5 ? cut.slice(0, end + 1) : cut.slice(0, cut.lastIndexOf(' ')) + '…';
};
const yearOf = (v?: string | number | null) => String(v ?? '').match(/(1[89]\d\d|20\d\d)/)?.[1];
const meta = (...xs: (string | undefined | null | false)[]) => xs.filter(Boolean).join(' · ') || undefined;
const human = (s?: string) => (s ? (s.charAt(0).toUpperCase() + s.slice(1)).replace(/-/g, ' ') : undefined);

/** URL of a record's own page. */
export function recordHref(col: string, id: string): string {
  switch (col) {
    case 'episodes': return `/episodes/${id}/`;
    case 'locations': return `/places/${id}/`;
    default: return `/${col}/${id}/`;
  }
}

const COLLECTIONS = ['series', 'episodes', 'films', 'connections', 'songs', 'books', 'comics', 'magazines', 'radio', 'podcasts', 'people', 'quotes', 'locations', 'works', 'essays', 'archives', 'characters'] as const;

let cache: Map<string, CatInfo> | undefined;
let byRecord: Map<string, { cat: string; sub: string }[]> | undefined;

export async function catalog(): Promise<Map<string, CatInfo>> {
  if (cache) return cache;
  const cats = new Map<string, CatInfo>();
  for (const c of TAXONOMY) {
    cats.set(c.slug, { ...c, subs: c.subs.map((s) => ({ ...s, entries: [] })) });
  }
  const recPlaces = new Map<string, { cat: string; sub: string }[]>();
  const put = (cat: string, sub: string, e: Entry, recKey?: string) => {
    let c = cats.get(cat);
    if (!c) {
      c = { slug: cat, title: subTitleFromSlug(cat), isNew: true, description: `${subTitleFromSlug(cat)}: added during research.`, intro: ['A category added during research. Adam decides whether to keep it.'], connection: 'Each entry states its own connection to The Twilight Zone.', subs: [] };
      cats.set(cat, c);
    }
    let s = c.subs.find((x) => x.slug === sub);
    if (!s) {
      s = { slug: sub, title: subTitleFromSlug(sub), blurb: 'A subcategory added during research.', isNew: true, entries: [] };
      c.subs.push(s);
    }
    if (s.entries.some((x) => x.key === e.key && x.group === e.group)) return;
    s.entries.push(e);
    if (recKey) {
      if (!recPlaces.has(recKey)) recPlaces.set(recKey, []);
      const list = recPlaces.get(recKey)!;
      if (!list.some((p) => p.cat === cat && p.sub === sub)) list.push({ cat, sub });
    }
  };

  const data: Record<string, any[]> = {};
  for (const col of COLLECTIONS) data[col] = (await getCollection(col as any)).filter((r: any) => !r.data.duplicate_of);
  const connFrom = new Map<string, string[]>();
  for (const c of data.connections) {
    if (!connFrom.has(c.data.from)) connFrom.set(c.data.from, []);
    connFrom.get(c.data.from)!.push(c.data.kind);
  }
  const ctx = { assessSub: (k: string) => assess(k)?.subcategory, connKinds: (k: string) => connFrom.get(k) ?? [] };

  // Titles for connection endpoints.
  const eps = await allEpisodes();
  const epTitle = new Map(eps.map((e) => [e.id, `"${e.data.title}" (${e.data.series})`]));
  const titleOf = (ref: string): string => {
    if (epTitle.has(ref)) return epTitle.get(ref)!;
    const [col, ...rest] = ref.split('/');
    const id = rest.join('/');
    if (col === 'series') return SERIES_LABEL[id as keyof typeof SERIES_LABEL] ?? 'The Twilight Zone';
    const r = data[col]?.find((x: any) => x.id === id);
    return r ? (r.data.title ?? r.data.name ?? id) : id;
  };
  const hrefOf = (ref: string) => (epTitle.has(ref) ? `/episodes/${ref}/` : (() => { const [col, ...rest] = ref.split('/'); return data[col] ? recordHref(col, rest.join('/')) : undefined; })());

  const base = (col: string, id: string, title: string, opts: Partial<Entry> = {}): Entry => {
    const a = assess(`${col}/${id}`);
    const desc = clamp(opts.desc);
    let why = a?.connection;
    if (why && desc && desc.includes(why.slice(0, 60).replace(/…$/, ''))) why = undefined;
    return { key: `${col}/${id}`, title, href: recordHref(col, id), sort: sortKey(title), tier: a?.tier, why, ...opts, desc };
  };

  const describe = (col: string, r: any): Entry => {
    const d = r.data;
    switch (col) {
      case 'series': return base(col, r.id, `${d.title} (${d.years})`, { sort: String(d.order).padStart(3, '0'), meta: meta(d.network, d.host && `host ${d.host}`, `${d.seasons} seasons`), desc: d.summary });
      case 'episodes': return base(col, r.id, d.title, { meta: meta(`${d.series} series, ${episodeNumber(d)}`, yearOf(d.air_date), d.writers.length ? `written by ${d.writers.slice(0, 2).join(', ')}` : undefined), desc: d.synopsis });
      case 'films': return base(col, r.id, d.parent_series ? `${d.title} (${d.parent_series})` : d.title, { sort: sortKey(d.title), meta: meta(yearOf(d.release_date), d.kind !== 'film' && human(d.kind), d.directors.length ? `dir. ${d.directors.slice(0, 2).join(', ')}` : undefined), desc: d.summary });
      case 'connections': {
        const t = `${titleOf(d.from)} → ${titleOf(d.to)}`;
        return base(col, r.id, t, { sort: sortKey(titleOf(d.from)), href: hrefOf(d.from), meta: meta(CONNECTION_LABELS[d.kind], CONFIDENCE_LABELS[d.confidence]), desc: d.summary ?? d.evidence });
      }
      case 'songs': return base(col, r.id, d.artist ? `${d.title} (${d.artist})` : d.title, { sort: sortKey(d.title), meta: meta(d.album, d.year && String(d.year), d.genre), desc: d.description });
      case 'books': return base(col, r.id, d.title, { meta: meta(d.authors.join(', '), d.publisher, yearOf(d.published), ...(d.tags ?? [])), desc: d.description });
      case 'comics': return base(col, r.id, d.title, { meta: meta(d.publisher, yearOf(d.cover_date), d.creators.slice(0, 3).join(', ')), desc: d.description });
      case 'magazines': return base(col, r.id, d.title, { meta: meta(d.magazine, yearOf(d.cover_date), d.publisher), desc: d.description });
      case 'radio': return base(col, r.id, d.title, { meta: meta(d.series_title !== 'The Twilight Zone Radio Dramas' && d.series_title, d.volume && `volume ${d.volume}`, d.original_writer && `by ${d.original_writer}`), desc: d.description });
      case 'podcasts': return base(col, r.id, d.title, { meta: meta(d.hosts.join(', '), yearOf(d.first_episode), d.status && d.status !== 'unknown' && d.status), desc: d.description });
      case 'quotes': return base(col, r.id, d.person, { meta: meta(yearOf(d.date), d.context && clamp(d.context, 80)), desc: `“${d.text}”` });
      case 'locations': return base(col, r.id, d.name, { meta: meta([d.city, d.region, d.country].filter(Boolean).join(', ')), desc: d.notes });
      case 'works': return base(col, r.id, d.title, { meta: meta(human(d.subtype), d.year && String(d.year), d.creator ?? d.publisher), desc: d.description });
      case 'essays': return base(col, r.id, d.title, { meta: meta(d.authors.join(', '), d.published_in, yearOf(d.published), d.outlet_rating), desc: d.description });
      case 'archives': return base(col, r.id, d.name, { meta: meta(d.institution, d.dates), desc: d.description });
      case 'characters': return base(col, r.id, d.name, { meta: meta(d.played_by.length ? `played by ${d.played_by.slice(0, 3).join(', ')}` : undefined, human(d.kind)), desc: d.description });
      default: return base(col, r.id, d.title ?? d.name ?? r.id);
    }
  };

  for (const col of COLLECTIONS) {
    if (col === 'people') continue; // placed below from the merged credits list
    for (const r of data[col]) {
      const e = describe(col, r);
      const key = `${col}/${r.id}`;
      for (const p of place(col, r.id, r.data, ctx)) put(p.cat, p.sub, { ...e, group: p.group ?? undefined }, key);
      for (const p of explicitPlacements(r.data)) put(p.cat, p.sub, e, key);
      // Derived entries
      for (const m of r.data.media ?? []) {
        put('media', mediaSub(m), {
          key: `${key}#media:${m.url}`, title: m.title, href: m.url, external: true, sort: sortKey(m.title),
          meta: meta(m.host, m.date, m.rights === 'public-domain' ? 'public domain' : m.rights === 'cc' ? 'Creative Commons' : undefined, m.duration),
          desc: m.note, why: `Attached to ${e.title}.`, group: undefined,
        });
      }
      if (col === 'series' || col === 'films') {
        for (const rel of r.data.releases ?? []) {
          put('merchandise', 'home-media', { key: `${key}#release:${rel.title}:${rel.date ?? ''}`, title: rel.title, href: e.href, sort: sortKey(rel.title), meta: meta(rel.format, yearOf(rel.date), rel.publisher, rel.region), desc: rel.note, group: e.title });
        }
        for (const h of r.data.history ?? []) {
          put('events', 'production-history', { key: `${key}#history:${h.date}:${h.title}`, title: h.title, href: e.href, sort: `${h.date}`, meta: meta(h.date), desc: clamp(h.text), group: e.title });
        }
        for (const it of r.data.international_titles ?? []) {
          put('series', 'international', { key: `${key}#intl:${it.country}:${it.title}`, title: it.title, href: e.href, sort: sortKey(it.title), meta: meta(it.country, it.language, it.broadcaster, it.year && String(it.year)), desc: it.note, group: e.title });
        }
      }
      if (col === 'podcasts') {
        for (const fe of r.data.featured_episodes ?? []) {
          put('episodes', 'podcast', { key: `${key}#ep:${fe.title}`, title: fe.title, href: fe.url ?? e.href, external: !!fe.url, sort: sortKey(fe.title), meta: meta(r.data.title, fe.date), group: r.data.title });
        }
      }
    }
  }

  // Radio series as series entries.
  const radioSeries = new Map<string, number>();
  for (const r of data.radio) radioSeries.set(r.data.series_title ?? 'Other radio', (radioSeries.get(r.data.series_title ?? 'Other radio') ?? 0) + 1);
  for (const [t, n] of radioSeries) {
    const tz = t === 'The Twilight Zone Radio Dramas';
    put('series', 'radio', {
      key: `radio-series/${slugify(t)}`, title: t, href: '/episodes/radio/', sort: sortKey(t),
      meta: `${n} ${n === 1 ? 'episode' : 'episodes'} listed`,
      desc: tz ? 'Full-cast audio adaptations of the original teleplays produced under license from 2002, with Stacy Keach as narrator, later adding new stories.' : 'A radio series Rod Serling wrote for, listed for his work on it.',
      group: tz ? 'The Twilight Zone Radio Dramas' : "Rod Serling's radio work",
    });
  }

  // People: everyone with a credit or a record.
  const quoted = new Set(data.quotes.map((q: any) => slugify(q.data.person)));
  const played = new Set(data.characters.flatMap((c: any) => c.data.played_by.map((n: string) => slugify(n))));
  for (const p of (await allPeople()).values()) {
    const rec = p.record;
    if (rec?.data.duplicate_of) continue;
    const roles = rec?.data.roles ?? [];
    const creditRoles = [...new Set(p.credits.map((c) => c.role))];
    const subs = placePerson({ roles, creditRoles, quoted: quoted.has(p.slug), played: played.has(p.slug), isSerling: p.slug === 'rod-serling' });
    const surname = p.name.replace(/,? (jr\.?|sr\.?|iii|ii)$/i, '').split(' ').slice(-1)[0];
    const a = assess(`people/${p.slug}`);
    const e: Entry = {
      key: `people/${p.slug}`, title: p.name, href: `/people/${p.slug}/`, sort: sortKey(`${surname} ${p.name}`),
      meta: meta(p.credits.length ? `${p.credits.length} ${p.credits.length === 1 ? 'credit' : 'credits'}` : undefined, rec?.data.born && rec?.data.died ? `${yearOf(rec.data.born)}-${yearOf(rec.data.died)}` : rec?.data.born ? `born ${yearOf(rec.data.born)}` : undefined),
      desc: clamp(rec?.data.bio, 240), tier: a?.tier,
    };
    for (const s of subs) put('people', s, e, e.key);
    if (subs.includes('composers')) put('music', 'composers', e, e.key);
    if (rec) for (const x of explicitPlacements(rec.data)) put(x.cat, x.sub, e, e.key);
    if (rec) for (const m of rec.data.media ?? []) put('media', mediaSub(m), { key: `${e.key}#media:${m.url}`, title: m.title, href: m.url, external: true, sort: sortKey(m.title), meta: meta(m.host, m.date), desc: m.note, why: `Attached to ${p.name}.` });
  }

  // Sort entries and drop empty subcategories from view (they stay defined).
  for (const c of cats.values()) {
    for (const s of c.subs) s.entries.sort((a, b) => a.sort.localeCompare(b.sort) || a.title.localeCompare(b.title));
    c.subs.sort((a, b) => sortKey(a.title).localeCompare(sortKey(b.title)));
    // Catch-all subcategories go last.
    c.subs.sort((a, b) => Number(/^other-/.test(a.slug)) - Number(/^other-/.test(b.slug)));
  }
  cache = cats;
  byRecord = recPlaces;
  return cats;
}

/** Where a record sits in the taxonomy, for breadcrumbs on record pages. */
export async function placesOf(key: string) {
  await catalog();
  return (byRecord!.get(key) ?? []).map(({ cat, sub }) => {
    const c = cache!.get(cat)!;
    const s = c.subs.find((x) => x.slug === sub)!;
    return { cat, sub, catTitle: c.title, subTitle: s.title, href: `/${cat}/${sub}/` };
  });
}

export const countOf = (c: CatInfo) => new Set(c.subs.flatMap((s) => s.entries.map((e) => e.key))).size;
export const isCategory = (slug: string) => slug in CATEGORY;
