// Builds the site catalogue: every record (and a few derived entries such as home-media releases
// and production-history events) placed into the taxonomy in src/lib/taxonomy.mjs, as list items
// ready for the category and subcategory landing pages.
import { getCollection } from 'astro:content';
import { allEpisodes, allPeople, episodeNumber, splitCredit, CONNECTION_LABELS, CONFIDENCE_LABELS } from './data';
import { assess } from './assessments';
import { slugify } from './slug';
import { TAXONOMY, CATEGORY, place, placePerson, explicitPlacements, mediaArtwork, libraryType, LIBRARY_TYPES, sortKey, subTitleFromSlug, SERIES_LABEL, contentOf, contentParents, isOfficial, orgSub, remap } from './taxonomy.mjs';
import { filmHref, tv } from './television';
import { watchFor, watchShort } from './watch';

const FILM_TYPE: Record<string, string> = { film: 'Feature film', 'tv-film': 'Television film', documentary: 'Documentary', special: 'Special', short: 'Short film', pilot: 'Pilot', 'tv-episode': 'TV play', unproduced: 'Unmade', 'music-video': 'Music video' };
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
  official?: boolean; // Official or Unofficial and inspired, in categories that split
  watch?: string; // where a series or show streams in the US, shown beside its name (src/lib/watch.ts)
  // Values for the extra filters on list pages (ListTools `facets`): type, decade, episode, confidence.
  facets?: Record<string, string[]>;
}
/** A content record (advertisement, holding, quote, link) shown on another record's page. */
export interface Attachment { key: string; kind: string; label: string; title: string; href: string; meta?: string; desc?: string }
export interface OrgLink { key: string; title: string; href?: string; role: string; official?: boolean }
/** One item in the Media Library: a media[] item (merged by URL) or a content record. */
export interface LibItem {
  id: string; type: string; typeLabel: string; subtype?: string; title: string; href: string; external: boolean;
  host?: string; date?: string; creator?: string; rights_holder?: string; rights?: string; note?: string;
  on: { key: string; title: string; href?: string }[]; // record pages it appears on
  cats: { slug: string; title: string; href: string }[]; // category and subcategory pages it appears on
  recordKey?: string; // for content records, the record itself
}
export interface Org { slug: string; name: string; aka: string[]; kind: string; official: boolean; record?: any; links: OrgLink[]; href: string }
export interface SubInfo { slug: string; title: string; blurb: string; intro?: string; connection?: string; isNew?: boolean; order?: 'az' | 'chrono'; side?: 'official' | 'unofficial'; entries: Entry[] }
export interface CatInfo { slug: string; title: string; kind?: 'section' | 'category' | 'library'; split?: boolean; isNew?: boolean; description: string; intro: string[]; connection: string; seeAlso?: [string, string][]; subs: SubInfo[] }

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
    case 'films': return filmHref(id);
    case 'locations': return `/places/${id}/`;
    case 'organizations': return `/organizations/${id}/`;
    default: return `/${col}/${id}/`;
  }
}

const COLLECTIONS = ['series', 'episodes', 'films', 'connections', 'songs', 'books', 'comics', 'magazines', 'radio', 'podcasts', 'people', 'quotes', 'locations', 'works', 'essays', 'archives', 'characters', 'organizations'] as const;

let cache: Map<string, CatInfo> | undefined;
let byRecord: Map<string, { cat: string; sub: string }[]> | undefined;
let attachCache: Map<string, Attachment[]> | undefined; // parent key -> content on it
let parentsCache: Map<string, { key: string; title: string; href?: string }[]> | undefined; // content key -> parents
let orgCache: Map<string, Org> | undefined;
let libCache: LibItem[] | undefined;
let relCache: Map<string, Map<string, Set<string>>> | undefined; // record key -> 'people'|'places'|'orgs' -> entity keys
let entCache: Map<string, Set<string>> | undefined; // entity key -> record keys
let entInfo: Map<string, { title: string; href: string; subs: string[] }> | undefined;
let libByRecord: Map<string, LibItem[]> | undefined;
const TYPE_LABEL = Object.fromEntries(LIBRARY_TYPES.map(([k, l]) => [k, l]));
const hash = (t: string) => { let h = 5381; for (let i = 0; i < t.length; i++) h = ((h << 5) + h + t.charCodeAt(i)) | 0; return (h >>> 0).toString(36); };

export async function catalog(): Promise<Map<string, CatInfo>> {
  if (cache) return cache;
  const cats = new Map<string, CatInfo>();
  for (const c of TAXONOMY) {
    cats.set(c.slug, { ...c, subs: c.subs.map((s) => ({ ...s, entries: [] })) });
  }
  const recPlaces = new Map<string, { cat: string; sub: string }[]>();
  const put = (cat0: string, sub0: string, e: Entry, recKey?: string) => {
    const { cat, sub } = remap(cat0, sub0);
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
  // For the Movies filters: each record's Twilight Zone episodes and how sure each link is.
  const connInfo = new Map<string, { to: string; confidence: string }[]>();
  for (const c of data.connections) {
    if (!connInfo.has(c.data.from)) connInfo.set(c.data.from, []);
    connInfo.get(c.data.from)!.push({ to: c.data.to, confidence: c.data.confidence });
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

  const filmFacets = (id: string, d: any): Record<string, string[]> => {
    const links = connInfo.get(`films/${id}`) ?? [];
    const y = Number(yearOf(d.release_date));
    return {
      type: [FILM_TYPE[d.kind] ?? human(d.kind)],
      decade: y ? [`${Math.floor(y / 10) * 10}s`] : [],
      episode: [...new Set(links.filter((l) => epTitle.has(l.to)).map((l) => epTitle.get(l.to)!))],
      confidence: [...new Set(links.map((l) => CONFIDENCE_LABELS[l.confidence as keyof typeof CONFIDENCE_LABELS]).filter(Boolean))],
    };
  };
  const describe = (col: string, r: any): Entry => {
    const d = r.data;
    switch (col) {
      case 'series': return base(col, r.id, `${d.title} (${d.years})`, { sort: String(d.order).padStart(3, '0'), meta: meta(d.network, d.host && `host ${d.host}`, `${d.seasons} seasons`), desc: d.summary, watch: watchShort(watchFor({ series: r.id }).w) });
      case 'episodes': return base(col, r.id, d.title, { meta: meta(`${d.series} series, ${episodeNumber(d)}`, yearOf(d.air_date), d.writers.length ? `written by ${d.writers.slice(0, 2).join(', ')}` : undefined), desc: d.synopsis });
      case 'films': return base(col, r.id, d.parent_series ? `${d.title} (${d.parent_series})` : d.title, { sort: sortKey(d.title), facets: filmFacets(r.id, d), meta: meta(yearOf(d.release_date), d.kind !== 'film' && human(d.kind), d.directors.length ? `dir. ${d.directors.slice(0, 2).join(', ')}` : undefined), desc: d.summary, watch: d.kind === 'tv-series' && !d.parent_series ? watchShort(watchFor({ slug: tv.showByRecord(r.id)?.slug ?? `film-${r.id}` }).w) : undefined });
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

  // ---- Resolving references and names ----
  const peopleMap = await allPeople();
  const titleIndex = new Map<string, string>(); // normalized title -> record key
  const norm = (t: string) => sortKey(t).replace(/\s+/g, ' ');
  const index = (t: string | undefined, key: string) => { if (t && !titleIndex.has(norm(t))) titleIndex.set(norm(t), key); };
  for (const e of eps) index(e.data.title, `episodes/${e.id}`);
  for (const col of ['series', 'films', 'works', 'books', 'locations', 'songs', 'magazines'] as const) for (const r of data[col]) index(r.data.title ?? r.data.name, `${col}/${r.id}`);
  for (const p of peopleMap.values()) index(p.name, `people/${p.slug}`);
  const keyTitle = new Map<string, { title: string; href?: string }>();
  const describeKey = (key: string): { title: string; href?: string } | undefined => {
    if (keyTitle.has(key)) return keyTitle.get(key);
    const [col, ...rest] = key.split('/');
    const id = rest.join('/');
    let out: { title: string; href?: string } | undefined;
    if (col === 'episodes') { const t = epTitle.get(id); if (t) out = { title: t, href: `/episodes/${id}/` }; }
    else if (col === 'people') { const p = peopleMap.get(id); if (p) out = { title: p.name, href: `/people/${id}/` }; }
    else if (col === 'organizations') { const o = orgs.get(id); if (o) out = { title: o.name, href: o.href }; }
    else if (col === 'series') { const r = data.series.find((x: any) => x.id === id); if (r) out = { title: `${r.data.title} (${r.data.years})`, href: `/series/${id}/` }; }
    else { const r = data[col]?.find((x: any) => x.id === id); if (r) out = { title: r.data.title ?? r.data.name ?? id, href: recordHref(col, id) }; }
    if (out) keyTitle.set(key, out);
    return out;
  };

  // ---- Organizations: records plus every name in a publisher, institution, network or organizations field ----
  const orgs = new Map<string, Org>();
  const orgAlias = new Map<string, string>(); // slugified name -> org slug
  const orgNorm = (n: string) => slugify(n.replace(/\b(inc|ltd|llc|corp|corporation|co)\b\.?/gi, '').replace(/\s*(&|and) company\s*$/i, '').replace(/\s+books\s*$/i, '').trim());
  for (const r of data.organizations) {
    const o: Org = { slug: r.id, name: r.data.name, aka: r.data.aka ?? [], kind: r.data.kind, official: r.data.official, record: r, links: [], href: `/organizations/${r.id}/` };
    orgs.set(r.id, o);
    for (const n of [o.name, ...o.aka]) orgAlias.set(orgNorm(n), r.id);
  }
  const reserved = new Set(CATEGORY.organizations.subs.map((x: any) => x.slug));
  const orgFor = (name: string, kind: string): Org | undefined => {
    const n = name.replace(/\s+/g, ' ').trim();
    if (!n || /^(independently published|self-published|unknown|various)$/i.test(n)) return undefined;
    const nk = orgNorm(n);
    let id = orgAlias.get(nk) ?? orgAlias.get(orgNorm(n.replace(/\s*\(.*\)\s*$/, '')));
    if (!id) {
      id = reserved.has(nk) ? `${nk}-organization` : nk;
      orgs.set(id, { slug: id, name: n, aka: [], kind, official: undefined as any, links: [], href: `/organizations/${id}/` });
      orgAlias.set(nk, id);
    }
    return orgs.get(id);
  };
  const orgNames = (v: unknown): string[] => (Array.isArray(v) ? v : v ? [v] : []).flatMap((x: any) => String(x).split(/\s+\/\s+|;\s*/)).map((x) => x.trim()).filter(Boolean);
  const linkOrg = (name: string, kind: string, link: OrgLink) => {
    const o = orgFor(name, kind);
    if (!o || o.links.some((l) => l.key === link.key && l.role === link.role)) return;
    if (o.kind === 'other' && kind !== 'other' && !o.record) o.kind = kind;
    o.links.push(link);
  };
  // A work's publisher is an organization only for products (elsewhere the field holds outlets and
  // authors, which are credited on the record itself).
  const WORK_ORG_KIND: Record<string, string> = { collectible: 'toy-company', game: 'game-company', soundtrack: 'record-label', 'home-media': 'home-video', artwork: 'licensee', attraction: 'licensee' };
  const SERIES_NET: Record<string, string> = {};
  for (const r of data.series) SERIES_NET[r.id] = r.data.network;

  // Each record's official flag and description, for organization links.
  const recOfficial = new Map<string, boolean | undefined>();

  // ---- Content (advertisements, holdings, quotes, links): attach to parents ----
  const attachments = new Map<string, Attachment[]>();
  const library = new Map<string, LibItem>();
  const addMedia = (m: any, on: { key: string; title: string; href?: string }) => {
    const id = `m-${hash(m.url)}`;
    let it = library.get(id);
    if (!it) {
      const local = m.file && (m.rights === 'public-domain' || m.rights === 'cc') ? `/${String(m.file).replace(/^\/?(public\/)?/, '')}` : undefined;
      it = { id, type: libraryType(m), typeLabel: TYPE_LABEL[libraryType(m)], subtype: m.subtype, title: m.title, href: local ?? m.url, external: !local, host: m.host, date: m.date, creator: m.creator, rights_holder: m.rights_holder, rights: m.rights ?? 'link-only', note: m.note, on: [], cats: [] };
      library.set(id, it);
    }
    if (!it.on.some((x) => x.key === on.key)) it.on.push(on);
  };
  const parentsOf = new Map<string, { key: string; title: string; href?: string }[]>();
  const resolveParent = (ref: string): string | undefined => {
    if (ref.startsWith('org:')) return undefined; // organizations are linked separately
    if (ref.startsWith('person:')) { const sl = slugify(ref.slice(7)); return peopleMap.has(sl) ? `people/${sl}` : undefined; }
    if (/^\d{4}\/[a-z0-9-]+$/.test(ref)) return `episodes/${ref}`;
    const m = ref.match(/^series (\d{4})/i);
    if (m) return `series/${m[1]}`;
    if (/^[a-z]+\/[a-z0-9-]+(\/[a-z0-9-]+)?$/.test(ref)) return describeKey(ref) ? ref : undefined;
    if (/^seasons? \d/i.test(ref)) return undefined;
    return titleIndex.get(norm(ref));
  };

  for (const col of COLLECTIONS) {
    if (col === 'people' || col === 'organizations') continue; // placed below
    for (const r of data[col]) {
      const e = describe(col, r);
      const key = `${col}/${r.id}`;
      const d = r.data;
      const why = assess(key)?.connection;
      const placements = [...place(col, r.id, d, ctx), ...explicitPlacements(d)];
      let first: boolean | undefined;
      for (const p of placements) {
        const official = isOfficial(col, d, p, { why });
        if (first === undefined) first = official;
        put(p.cat, p.sub, { ...e, group: p.group ?? undefined, official, ...(p.sort ? { sort: p.sort } : {}) }, key);
      }
      recOfficial.set(key, first);
      const content = contentOf(col, d);
      if (content) {
        const parents: { key: string; title: string; href?: string }[] = [];
        for (const ref of contentParents(col, d)) {
          const pk = resolveParent(ref);
          if (!pk || pk === key || parents.some((x) => x.key === pk)) continue;
          const t = describeKey(pk);
          if (!t) continue;
          parents.push({ key: pk, ...t });
          if (!attachments.has(pk)) attachments.set(pk, []);
          attachments.get(pk)!.push({ key, kind: content.kind, label: content.label, title: e.title, href: e.href!, meta: e.meta, desc: e.desc });
        }
        // Nothing named: attach to the people and works its title names (an interview with X, a review of Y).
        if (!parents.length) {
          const t = ` ${norm(`${d.title ?? ''}`)} `;
          for (const [nt, k] of titleIndex) {
            if (nt.length < 8 || !t.includes(` ${nt} `) || parents.some((x) => x.key === k)) continue;
            const info = describeKey(k);
            if (info) { parents.push({ key: k, ...info }); if (!attachments.has(k)) attachments.set(k, []); attachments.get(k)!.push({ key, kind: content.kind, label: content.label, title: e.title, href: e.href!, meta: e.meta, desc: e.desc }); }
          }
        }
        parentsOf.set(key, parents);
        library.set(`c-${key}`, {
          id: `c-${key.replace(/[^a-z0-9]+/g, '-')}`, type: content.kind, typeLabel: TYPE_LABEL[content.kind] ?? content.label, subtype: d.review_type ?? d.subtype ?? undefined,
          title: col === 'quotes' ? `${d.person}: “${clamp(d.text, 120)}”` : e.title, href: e.href!, external: false,
          host: d.published_in ?? d.institution ?? (Array.isArray(d.organizations) ? d.organizations.join(', ') : undefined), date: d.published ?? d.date ?? (d.year ? String(d.year) : undefined) ?? d.dates,
          creator: (d.authors ?? []).join(', ') || d.creator || d.person || undefined, rights: 'link-only', note: e.desc, on: parents, cats: [], recordKey: key,
        });
      }
      // Organizations named by this record.
      const role = col === 'archives' ? 'Holds' : content?.kind === 'ad' ? (/sponsor|billboard/i.test(`${d.subtype} ${d.title}`) ? 'Sponsored' : 'Advertised') : content?.kind === 'link' ? 'Hosts a page about' : ['books', 'comics', 'magazines'].includes(col) ? 'Published' : col === 'works' ? 'Made or released' : 'Named in';
      const okind = col === 'archives' ? 'archive' : content?.kind === 'ad' ? (role === 'Sponsored' ? 'sponsor' : 'advertiser') : ['books', 'comics', 'magazines'].includes(col) ? 'publisher' : col === 'works' ? WORK_ORG_KIND[d.kind] ?? 'other' : 'other';
      const link = { key, title: e.title, href: e.href, role, official: first };
      if (col !== 'works' || WORK_ORG_KIND[d.kind]) for (const n of orgNames(d.publisher)) linkOrg(n, okind, link);
      for (const n of orgNames(d.institution)) linkOrg(n, 'archive', link);
      for (const n of orgNames(d.organizations)) linkOrg(n, ['sponsor', 'advertiser', 'archive'].includes(okind) ? okind : 'other', link);
      if (col === 'series' && d.network) for (const n of orgNames(String(d.network).replace(/, then .*/, ''))) linkOrg(n, 'network', { ...link, role: 'Broadcast' });
      // Derived entries
      for (const m of d.media ?? []) {
        const me: Entry = {
          key: `${key}#media:${m.url}`, title: m.title, href: m.url, external: true, sort: sortKey(m.title),
          meta: meta(m.creator, m.host, m.date, m.rights === 'public-domain' ? 'public domain' : m.rights === 'cc' ? 'Creative Commons' : undefined, m.duration),
          desc: m.note, why: `Attached to ${e.title}.`, group: undefined,
        };
        addMedia(m, { key, title: e.title, href: e.href });
        const art = mediaArtwork(m);
        if (art) put('artwork', art, { ...me, group: art === 'covers' ? { comics: 'Comics', magazines: 'Magazines', books: 'Books' }[col as string] ?? 'Other covers' : undefined, official: first });
      }
      if (col === 'series' || col === 'films') {
        for (const rel of d.releases ?? []) {
          put('merchandise', 'home-media', { key: `${key}#release:${rel.title}:${rel.date ?? ''}`, title: rel.title, href: e.href, sort: sortKey(rel.title), meta: meta(rel.format, yearOf(rel.date), rel.publisher, rel.region), desc: rel.note, group: e.title, official: true });
          for (const n of orgNames(rel.publisher)) linkOrg(n, 'home-video', { key, title: `${rel.title} (${e.title})`, href: e.href, role: 'Released on home video', official: true });
        }
        for (const h of d.history ?? []) {
          put('events', 'production-history', { key: `${key}#history:${h.date}:${h.title}`, title: h.title, href: e.href, sort: `${h.date}`, meta: meta(h.date), desc: clamp(h.text), group: e.title, official: true });
        }
        for (const it of d.international_titles ?? []) {
          put('series', 'international', { key: `${key}#intl:${it.country}:${it.title}`, title: it.title, href: e.href, sort: sortKey(it.title), meta: meta(it.country, it.language, it.broadcaster, it.year && String(it.year)), desc: it.note, group: e.title, official: true });
          for (const n of orgNames(it.broadcaster)) linkOrg(n, 'network', { key, title: `${it.title} (${it.country})`, href: e.href, role: 'Broadcast', official: true });
        }
      }
      // Cover art is artwork and content: listed under Artwork, and credited on the comic itself.
      if (col === 'comics') {
        const artists = (d.creators ?? []).map(splitCredit).filter((c: any) => c.roles.includes('cover')).map((c: any) => c.name);
        if (artists.length) put('artwork', 'covers', { key: `${key}#cover`, title: `Cover: ${e.title}`, href: e.href, sort: sortKey(e.title), meta: meta(`cover by ${artists.join(', ')}`, d.publisher, yearOf(d.cover_date)), group: 'Comics', official: first });
      }
      if (col === 'podcasts') {
        for (const fe of d.featured_episodes ?? []) {
          put('podcasts', 'episodes', { key: `${key}#ep:${fe.title}`, title: fe.title, href: fe.url ?? e.href, external: !!fe.url, sort: sortKey(fe.title), meta: meta(d.title, fe.date), group: d.title, official: first });
        }
      }
    }
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
    if (subs.includes('composers')) put('music', 'composers', { ...e, official: true }, e.key);
    if (rec) for (const x of explicitPlacements(rec.data)) put(x.cat, x.sub, e, e.key);
    if (rec) for (const m of rec.data.media ?? []) addMedia(m, { key: e.key, title: p.name, href: e.href });
  }

  // Organizations as entries, with content records (holdings, sponsorships, ads, links) attached.
  const OFFICIAL_KINDS = new Set(['network', 'studio', 'streamer', 'production-company', 'sponsor']);
  const contentKeys = new Set(parentsOf.keys());
  for (const o of orgs.values()) {
    if (!o.links.length && !o.record) continue;
    if (typeof o.official !== 'boolean') o.official = OFFICIAL_KINDS.has(o.kind) || o.links.some((l) => l.official === true && !contentKeys.has(l.key));
    const okey = `organizations/${o.slug}`;
    for (const l of o.links) {
      if (!contentKeys.has(l.key)) continue;
      const rec = data[l.key.split('/')[0]]?.find((x: any) => `${l.key.split('/')[0]}/${x.id}` === l.key);
      const c = rec && contentOf(l.key.split('/')[0], rec.data);
      if (!c) continue;
      if (!attachments.has(okey)) attachments.set(okey, []);
      if (!attachments.get(okey)!.some((x) => x.key === l.key)) attachments.get(okey)!.push({ key: l.key, kind: c.kind, label: c.label, title: l.title, href: l.href! });
      const ps = parentsOf.get(l.key)!;
      if (!ps.some((x) => x.key === okey)) ps.push({ key: okey, title: o.name, href: o.href });
    }
    const counts = new Map<string, number>();
    for (const l of o.links) counts.set(l.role, (counts.get(l.role) ?? 0) + 1);
    const a = assess(okey);
    const e: Entry = {
      key: okey, title: o.name, href: o.href, sort: sortKey(o.name), official: o.official, tier: a?.tier,
      meta: meta(...[...counts.entries()].map(([r, n]) => `${r.toLowerCase()} ${n}`)),
      desc: clamp(o.record?.data.description, 240),
    };
    put('organizations', orgSub(o.kind), e, okey);
    if (o.record) for (const x of explicitPlacements(o.record.data)) put(x.cat, x.sub, e, okey);
  }

  // Sort entries and drop empty subcategories from view (they stay defined).
  for (const c of cats.values()) {
    for (const s of c.subs) s.entries.sort((a, b) => a.sort.localeCompare(b.sort) || a.title.localeCompare(b.title));
    c.subs.sort((a, b) => sortKey(a.title).localeCompare(sortKey(b.title)));
    // Catch-all subcategories go last.
    c.subs.sort((a, b) => Number(/^other-/.test(a.slug)) - Number(/^other-/.test(b.slug)));
  }
  // Organization records' own media.
  for (const r of data.organizations) for (const m of r.data.media ?? []) addMedia(m, { key: `organizations/${r.id}`, title: r.data.name, href: `/organizations/${r.id}/` });
  // Where each library item appears: its records, and every category and subcategory page listing them.
  const libBy = new Map<string, LibItem[]>();
  for (const it of library.values()) {
    const seen = new Set<string>();
    for (const o of it.on) {
      if (!libBy.has(o.key)) libBy.set(o.key, []);
      libBy.get(o.key)!.push(it);
      for (const p of recPlaces.get(o.key) ?? []) {
        const c = cats.get(p.cat)!;
        const sb = c.subs.find((x) => x.slug === p.sub)!;
        if (!seen.has(p.cat)) { seen.add(p.cat); it.cats.push({ slug: p.cat, title: c.title, href: `/${p.cat}/` }); }
        const k = `${p.cat}/${p.sub}`;
        if (!seen.has(k)) { seen.add(k); it.cats.push({ slug: k, title: `${c.title}: ${sb.title}`, href: `/${k}/` }); }
      }
    }
  }
  // ---- People, places and organizations related to each record (both directions) ----
  const rel = new Map<string, Map<string, Set<string>>>();
  const ent = new Map<string, Set<string>>();
  const link = (kind: string, ek: string, rk: string) => {
    if (ek === rk) return;
    if (!rel.has(rk)) rel.set(rk, new Map());
    const m = rel.get(rk)!;
    if (!m.has(kind)) m.set(kind, new Set());
    m.get(kind)!.add(ek);
    if (!ent.has(ek)) ent.set(ek, new Set());
    ent.get(ek)!.add(rk);
  };
  const keyFromUrl = (u?: string) => {
    if (!u || !u.startsWith('/')) return undefined;
    const parts = u.replace(/^\/|\/$/g, '').split('/');
    if (parts[0] === 'places') parts[0] = 'locations';
    return parts.join('/');
  };
  for (const p of peopleMap.values()) for (const c of p.credits) { const k = keyFromUrl(c.url); if (k) link('people', `people/${p.slug}`, k); }
  for (const q of data.quotes) for (const e of q.data.episodes ?? []) link('people', `people/${slugify(q.data.person)}`, `episodes/${e}`);
  for (const c of data.characters) for (const r of c.data.appears_in ?? []) for (const n of c.data.played_by ?? []) link('people', `people/${slugify(n)}`, /^\d{4}\//.test(r) ? `episodes/${r}` : r);
  for (const l of data.locations) {
    for (const f of l.data.filmed ?? []) if (f.ref) link('places', `locations/${l.id}`, /^\d{4}\//.test(f.ref) ? `episodes/${f.ref}` : f.ref);
    for (const e of l.data.episodes ?? []) link('places', `locations/${l.id}`, /^\d{4}\//.test(e) ? `episodes/${e}` : e);
    // Places with no structured links: read the records named in their "Twilight Zone connections" note
    // ("Title: what happened there."), the series a production base served, and Rod Serling for his places.
    const lk = `locations/${l.id}`;
    for (const r of (l.data as any).content_of ?? []) { const k = resolveParent(r); if (k) link('places', lk, k); }
    const conn = String(l.data.notes ?? '').split(/Twilight Zone connections:/i)[1] ?? '';
    for (const seg of conn.split(/(?<=\.)\s+|;\s*/)) {
      const head = seg.split(':')[0].replace(/\s*\([^)]*\)\s*$/, '').trim();
      const k = head.length >= 5 ? titleIndex.get(norm(head)) : undefined;
      if (k && k !== lk && !k.startsWith('locations/')) link('places', lk, k);
    }
    const sm = l.id.match(/(1959|1985|2002|2019)-series/);
    if (sm) link('places', lk, `series/${sm[1]}`);
    if (/serling/i.test(`${l.id} ${l.data.name} ${conn}`) || l.data.kind === 'serling-place') link('places', lk, 'people/rod-serling');
    if (/tower of terror/i.test(l.data.name)) { const k = titleIndex.get(norm('The Twilight Zone Tower of Terror')); if (k) link('places', lk, k); }
  }
  // Events, lectures and attractions name their venue in details.location / details.venue.
  const locByName = new Map(data.locations.map((l) => [norm(l.data.name), `locations/${l.id}`]));
  for (const col of ['works', 'films'] as const) for (const r of data[col]) {
    const det = (r.data as any).details ?? {};
    for (const v of [det.location, det.venue].filter((x) => typeof x === 'string')) {
      const k = v.startsWith('locations/') ? v : locByName.get(norm(v)) ?? locByName.get(norm(v.split(',')[0]));
      if (k && describeKey(k)) link('places', k, `${col}/${r.id}`);
    }
  }
  for (const o of orgs.values()) for (const l of o.links) link('orgs', `organizations/${o.slug}`, l.key);
  const info = new Map<string, { title: string; href: string; subs: string[] }>();
  for (const sec of ['people', 'places', 'organizations']) {
    for (const sb of cats.get(sec)!.subs) for (const e of sb.entries) {
      if (!info.has(e.key)) info.set(e.key, { title: e.title, href: e.href!, subs: [] });
      info.get(e.key)!.subs.push(sb.slug);
    }
  }
  relCache = rel; entCache = ent; entInfo = info;

  const typeOrder = new Map(LIBRARY_TYPES.map(([k], i) => [k, i]));
  libCache = [...library.values()].sort((a, b) => (typeOrder.get(a.type) ?? 99) - (typeOrder.get(b.type) ?? 99) || sortKey(a.title).localeCompare(sortKey(b.title)));
  libByRecord = libBy;
  cache = cats;
  byRecord = recPlaces;
  attachCache = attachments;
  parentsCache = parentsOf;
  orgCache = orgs;
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

/** Content attached to a record: advertisements, archival holdings, links and quotes about it. */
export async function attachmentsOf(key: string): Promise<Attachment[]> {
  await catalog();
  return [...(attachCache!.get(key) ?? [])].sort((a, b) => a.label.localeCompare(b.label) || sortKey(a.title).localeCompare(sortKey(b.title)));
}
/** For a content record: the records it is shown on. */
export async function parentsOfContent(key: string) {
  await catalog();
  return parentsCache!.get(key);
}
/** Every organization with a page. */
export async function allOrganizations(): Promise<Org[]> {
  await catalog();
  return [...orgCache!.values()].filter((o) => o.links.length || o.record);
}

/** Every Media Library item, by type then title. */
export async function mediaLibrary(): Promise<LibItem[]> {
  await catalog();
  return libCache!;
}
/** Media and content that appear on a record's page. */
export async function mediaFor(key: string): Promise<LibItem[]> {
  await catalog();
  return libByRecord!.get(key) ?? [];
}
/** Media and content for a category or subcategory page: everything attached to the records it lists. */
export function mediaForEntries(entries: Entry[]): LibItem[] {
  const out = new Map<string, LibItem>();
  for (const e of entries) for (const it of libByRecord?.get(e.key) ?? []) out.set(it.id, it);
  return [...out.values()];
}

export interface Related { key: string; title: string; href: string; count?: number }
/** People, places and organizations related to one record. */
export async function relatedFor(key: string): Promise<Record<'people' | 'places' | 'orgs', Related[]>> {
  await catalog();
  const m = relCache!.get(key);
  const pick = (k: string) => [...(m?.get(k) ?? [])].map((ek) => ({ key: ek, ...entInfo!.get(ek)! })).filter((x) => x.href).sort((a, b) => sortKey(a.title).localeCompare(sortKey(b.title)));
  return { people: pick('people'), places: pick('places'), orgs: pick('orgs') };
}
/** For a category page: the people, places and organizations most connected to the records it lists. */
export function relatedForEntries(entries: Entry[]): Record<'people' | 'places' | 'orgs', Related[]> {
  const out: Record<string, Map<string, number>> = { people: new Map(), places: new Map(), orgs: new Map() };
  for (const e of entries) for (const [k, set] of relCache?.get(e.key) ?? []) for (const ek of set) out[k].set(ek, (out[k].get(ek) ?? 0) + 1);
  const pick = (k: string) => [...out[k].entries()].map(([ek, count]) => ({ key: ek, count, ...entInfo!.get(ek)! })).filter((x) => x.href).sort((a, b) => b.count - a.count || sortKey(a.title).localeCompare(sortKey(b.title)));
  return { people: pick('people'), places: pick('places'), orgs: pick('orgs') } as any;
}
/** Index rows for a section (people, places, organizations): every entry with where it appears. */
export async function entityRows(section: 'people' | 'places' | 'organizations') {
  const cats = await catalog();
  const c = cats.get(section)!;
  const subTitle = new Map(c.subs.map((s) => [s.slug, s.title]));
  const seen = new Map<string, Entry>();
  for (const s of c.subs) for (const e of s.entries) if (!seen.has(e.key)) seen.set(e.key, e);
  return [...seen.values()].map((e) => {
    const recs = [...(entCache!.get(e.key) ?? [])];
    const where = new Map<string, { slug: string; title: string; href: string }>();
    for (const rk of recs) for (const p of byRecord!.get(rk) ?? []) {
      const cc = cats.get(p.cat)!;
      if (!where.has(p.cat)) where.set(p.cat, { slug: p.cat, title: cc.title, href: `/${p.cat}/` });
      const k = `${p.cat}/${p.sub}`;
      if (!where.has(k)) where.set(k, { slug: k, title: `${cc.title}: ${cc.subs.find((x) => x.slug === p.sub)!.title}`, href: `/${k}/` });
    }
    return { ...e, subs: [...new Set(entInfo!.get(e.key)?.subs ?? [])].map((s) => ({ slug: s, title: subTitle.get(s)! })), records: recs.length, where: [...where.values()] };
  }).sort((a, b) => a.sort.localeCompare(b.sort));
}

/** The A to Z letter an index row files under: a to z, or "0-9" for anything else. */
export function letterOf(sort: string) {
  const c = sort.trim().charAt(0).toLowerCase();
  return c >= 'a' && c <= 'z' ? c : '0-9';
}
/** Sections whose A to Z index is too long for one page are split into one page per letter. */
export const SPLIT_INDEX_AT = 800;
