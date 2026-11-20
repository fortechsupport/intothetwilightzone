"""Merge research JSON into the site's content snapshot.

Usage: python3 -I merge.py <snapshot src/content dir> <research dir> <out content dir>
Writes only changed/new files into <out>, plus <out>/../merge_report.json.
"""
import sys, os, re, json, glob, copy, unicodedata
import yaml

SNAP, RES, OUT = sys.argv[1:4]
TODAY = '2026-11-19'
report = {'episodes_updated': 0, 'episodes_new': [], 'conflicts': [], 'unmatched': [],
          'films_updated': [], 'films_new': [], 'connections_updated': [], 'connections_new': [],
          'doubtful': [], 'skipped': []}


def slugify(s):
    s = unicodedata.normalize('NFKD', s).encode('ascii', 'ignore').decode()
    s = s.lower().replace("'", '').replace('’', '').replace('½', '12')
    s = re.sub(r'[^a-z0-9]+', '-', s).strip('-')
    return s


def norm(s):
    return slugify(s.replace('&', 'and'))


def load(path):
    with open(path) as f:
        return yaml.safe_load(f)


class Dumper(yaml.SafeDumper):
    pass


def _str(d, v):
    style = "'" if re.fullmatch(r'\d{4}(-\d\d){0,2}|[0-9.]+|\d+[a-z]?', v) else None
    if '\n' in v:
        style = '|'
    return d.represent_scalar('tag:yaml.org,2002:str', v, style=style)


Dumper.add_representer(str, _str)


def dump(path, rec):
    os.makedirs(os.path.dirname(path), exist_ok=True)
    with open(path, 'w') as f:
        yaml.dump(rec, f, Dumper=Dumper, sort_keys=False, allow_unicode=True, width=110)


def clean_sources(srcs):
    out, seen = [], set()
    for s in srcs or []:
        if not s or not s.get('title'):
            continue
        key = s.get('url') or s['title']
        if key in seen:
            continue
        seen.add(key)
        if s.get('url'):
            s = {**s, 'url': re.sub(r'^https://(Www|www|en)\.wikipedia\.(org|com)/', 'https://en.wikipedia.org/', s['url'])}
        out.append({k: v for k, v in s.items() if k in ('title', 'url', 'note') and v})
    return out


def research_source_list(srcs):
    return [s for s in clean_sources(srcs) if s.get('url')]


# ---------- load snapshot ----------
episodes = {}  # id -> rec
for p in glob.glob(f'{SNAP}/episodes/*/*.yaml'):
    eid = os.path.relpath(p, f'{SNAP}/episodes')[:-5]
    episodes[eid] = load(p)
films = {os.path.basename(p)[:-5]: load(p) for p in glob.glob(f'{SNAP}/films/*.yaml')}
conns = {os.path.basename(p)[:-5]: load(p) for p in glob.glob(f'{SNAP}/connections/*.yaml')}
changed_eps, changed_films, changed_conns = set(), set(), set()

by_title = {}
for eid, r in episodes.items():
    by_title.setdefault((r['series'], norm(r['title'])), []).append(eid)
    for a in r.get('aka') or []:
        by_title.setdefault((r['series'], norm(a)), []).append(eid)

FIX = json.load(open(os.path.join(os.path.dirname(os.path.abspath(sys.argv[0])), 'fixups.json')))
ALIASES = FIX['aliases']


def find_episode(series, title, air_date=None):
    title = re.sub(r'\s*\((sequel|remake)\)\s*$', '', title)
    key = (series, norm(title))
    k2 = ALIASES.get(f'{series}/{norm(title)}')
    if k2:
        return k2
    ids = by_title.get(key, [])
    if len(ids) == 1:
        return ids[0]
    if len(ids) > 1 and air_date:
        for i in ids:
            if episodes[i].get('air_date') == air_date:
                return i
    # loose: ignore hyphens / leading "the"
    c = norm(title).replace('-', '')
    for (s, nt), ids in by_title.items():
        if s == series and nt.replace('-', '') == c:
            return ids[0]
    t = norm(title)
    for (s, nt), ids in by_title.items():
        if s == series and (nt.replace('the-', '', 1) == t.replace('the-', '', 1)):
            return ids[0]
    return None


def ep_ref(series, title):
    eid = find_episode(series, title)
    return eid


# ---------- episodes ----------
remakes = []  # (from_id, to_id, relation, sources)
for f in sorted(glob.glob(f'{RES}/ep_*.json')):
    data = json.load(open(f))
    for e in data:
        series = str(e['series'])
        eid = find_episode(series, e['title'], e.get('air_date'))
        srcs = research_source_list(e.get('sources'))
        if not eid:
            if not srcs:
                report['skipped'].append(f"{series}/{e['title']} (no source)")
                continue
            eid = f"{series}/{slugify(e['title'])}"
            if eid in episodes:
                eid += f"-{e.get('season')}"
            rec = {'title': e['title'], 'series': series, 'season': int(e['season']), 'episode': str(e['episode'])}
            episodes[eid] = rec
            by_title.setdefault((series, norm(e['title'])), []).append(eid)
            report['episodes_new'].append(eid)
        rec = episodes[eid]
        if rec.get('locked') and 'research-merge' not in json.dumps(rec.get('sources', [])):
            pass  # hand-locked by someone else: still only fill blanks
        hand_locked = bool(rec.get('locked'))
        # conflicts on core facts
        for fld in ('season', 'episode', 'air_date', 'production_code'):
            nv = e.get(fld)
            if nv in (None, ''):
                continue
            nv = int(nv) if fld == 'season' else str(nv)
            ov = rec.get(fld)
            if ov in (None, ''):
                rec[fld] = nv
            elif str(ov) != str(nv):
                report['conflicts'].append({'id': eid, 'field': fld, 'spreadsheet': ov, 'research': nv})
                if not hand_locked and fld in ('air_date', 'production_code'):
                    rec[fld] = nv
        if e.get('title') and e['title'] != rec['title'] and norm(e['title']) == norm(rec['title']):
            pass
        for fld in ('writers', 'directors'):
            nv = [x for x in (e.get(fld) or []) if x]
            ov = rec.get(fld) or []
            if nv and not ov:
                rec[fld] = nv
            elif nv and {norm(x) for x in nv} != {norm(x) for x in ov}:
                report['conflicts'].append({'id': eid, 'field': fld, 'spreadsheet': ov, 'research': nv})
        if e.get('cast') and not rec.get('cast'):
            rec['cast'] = e['cast']
        if e.get('writing_credit_note'):
            rec['writing_credit_note'] = e['writing_credit_note']
        if e.get('synopsis') and not (hand_locked and rec.get('synopsis')):
            rec['synopsis'] = e['synopsis'].strip()
        if e.get('themes'):
            rec['themes'] = sorted({t.strip().lower() for t in e['themes'] if t})
        if srcs:
            old = [s for s in rec.get('sources', [])]
            rec['sources'] = clean_sources(old + srcs)
            rec['last_verified'] = TODAY
        rec['locked'] = True
        changed_eps.add(eid)
        if e.get('remake_of'):
            remakes.append((eid, e['remake_of'], e.get('relation') or e['remake_of'].get('relation') or 'remake', srcs))
        for lr in e.get('later_remakes') or []:
            remakes.append((('LATER', lr), {'series': series, 'title': e['title']}, 'remake', srcs))

for eid, flds in FIX['episode_overrides'].items():
    episodes[eid].update(flds); changed_eps.add(eid); episodes[eid]['locked'] = True
for eid in list(changed_eps):
    r = episodes[eid]
    for fld in ('writers', 'directors', 'cast'):
        if r.get(fld):
            r[fld] = [FIX['names'].get(x.strip(), x.strip()) for x in r[fld] if x and x.strip()]
if os.path.exists(f'{RES}/synopsis_check.json'):
    report['synopsis_fixed'], report['synopsis_unverified'] = [], []
    for c in json.load(open(f'{RES}/synopsis_check.json')):
        eid = find_episode(str(c['series']), c['title'])
        if not eid:
            report['unmatched'].append({'synopsis': c['title']})
            continue
        src = research_source_list([c.get('source')] if c.get('source') else [])
        if c['status'] == 'fixed' and c.get('synopsis'):
            episodes[eid]['synopsis'] = c['synopsis'].strip()
            report['synopsis_fixed'].append(eid)
        elif c['status'] == 'unverified':
            report['synopsis_unverified'].append(eid)
        if src and c['status'] in ('ok', 'fixed'):
            episodes[eid]['sources'] = clean_sources(episodes[eid].get('sources', []) + src)
        changed_eps.add(eid)
if os.path.exists(f'{RES}/trivia.json'):
    report['trivia'] = 0
    for t in json.load(open(f'{RES}/trivia.json')):
        eid = find_episode(str(t['series']), t['title'])
        src = research_source_list([t.get('source')] if t.get('source') else [])
        if not eid or not src or not t.get('text'):
            report['unmatched'].append({'trivia': t.get('title')})
            continue
        tv = episodes[eid].setdefault('trivia', [])
        if all(x['text'] != t['text'] for x in tv):
            tv.append({'text': t['text'].strip()[:400], 'sources': src})
            report['trivia'] += 1
        changed_eps.add(eid)
report['episodes_updated'] = len(changed_eps)

KEY_ORDER = ['title', 'aka', 'series', 'season', 'episode', 'air_date', 'runtime_min', 'production_code', 'writers',
             'writing_credit_note', 'source_authors', 'directors', 'cast', 'narrator', 'synopsis', 'themes', 'trivia', 'ids', 'links', 'sources',
             'last_verified', 'locked']


def ordered(rec, order):
    out = {k: rec[k] for k in order if k in rec and rec[k] not in (None, [], {})}
    for k, v in rec.items():
        if k not in out and v not in (None, [], {}):
            out[k] = v
    return out


def add_conn(cid, rec):
    same = [k for k, c in conns.items() if c.get('from') == rec.get('from') and c.get('to') == rec.get('to')]
    if same:
        cid = same[0]
    if cid in conns:
        old = conns[cid]
        if cid not in changed_conns and rec.get('_merge_only'):
            new = dict(old)
            if rec.get('sources') and old.get('confidence') == 'fan-noted' and rec.get('confidence') != 'fan-noted':
                new['confidence'] = rec['confidence']
            for k in ('evidence',):
                if rec.get(k) and not new.get(k):
                    new[k] = rec[k]
            if rec.get('summary') and "listed in Adam's research" in (new.get('summary') or ''):
                new['summary'] = rec['summary']
            new['sources'] = rec.get('sources', [])
            rec = new
        rec['sources'] = clean_sources((old.get('sources') or []) + rec.get('sources', []))
        report['connections_updated'].append(cid)
    else:
        report['connections_new'].append(cid)
    rec = {k: v for k, v in rec.items() if v not in (None, '', []) and not k.startswith('_')}
    if rec.get('evidence') and rec.get('evidence') == rec.get('summary'):
        del rec['evidence']
    if rec.get('confidence') in ('documented', 'confirmed-by-creator') and not any(s.get('url') for s in rec.get('sources', [])):
        rec['confidence'] = 'fan-noted'
    rec['locked'] = True
    rec['last_verified'] = TODAY
    conns[cid] = rec
    changed_conns.add(cid)


# remakes within franchise
for frm, to, rel, srcs in sorted(remakes, key=lambda r: isinstance(r[0], tuple)):
    if isinstance(frm, tuple):
        lr = frm[1]
        s = str(lr.get('series'))
        if s not in ('1985', '2002', '2019'):
            continue  # films handled by films research
        fid = find_episode(s, lr['title'])
        tid = find_episode(to['series'], to['title'])
    else:
        fid = frm
        tid = find_episode(str(to.get('series', '1959')), to['title'])
    if not fid or not tid:
        report['unmatched'].append({'remake': [str(frm), to]})
        continue
    kind = {'remake': 'remake', 'reimagining': 'remake', 'sequel': 'inspired-by'}.get(rel, 'homage')
    cid = f"{fid.replace('/', '-')}--{tid.split('/')[1]}"
    if cid in conns and cid in changed_conns:
        continue
    keys = {norm(episodes[fid]['title']).replace('-', ''), norm(episodes[tid]['title']).replace('-', '')}
    rel_srcs = [x for x in srcs if any(k in norm(x['title'] + ' ' + x.get('url', '')).replace('-', '') for k in keys)
                and 'season' not in x['title'].lower()]
    srcs = rel_srcs or srcs
    note = {'sequel': 'sequel to', 'homage': 'homage to'}.get(rel, 'new version of')
    add_conn(cid, {'from': fid, 'to': tid, 'kind': kind,
                   'confidence': 'documented' if srcs else 'fan-noted',
                   'summary': f"{episodes[fid]['title']} ({fid[:4]}) is a {note} {episodes[tid]['title']} ({tid[:4]}).",
                   'sources': srcs})

# ---------- films ----------
FILM_ORDER = ['title', 'kind', 'release_date', 'rating', 'runtime_min', 'writers', 'directors', 'cast', 'summary',
              'segments', 'ids', 'links', 'sources', 'last_verified', 'locked']
if os.path.exists(f'{RES}/films_official.json'):
    for fr in json.load(open(f'{RES}/films_official.json')):
        slug = fr.get('slug') or slugify(fr['title'])
        if slug in FIX['skip_films']:
            report['skipped'].append(f'films/{slug} (reviewed out)')
            continue
        srcs = research_source_list(fr.get('sources'))
        if not srcs:
            report['skipped'].append(f'films/{slug} (no source)')
            continue
        rec = films.get(slug, {'title': fr['title']})
        (report['films_updated'] if slug in films else report['films_new']).append(slug)
        for fld in ('kind', 'release_date', 'rating', 'runtime_min'):
            if fr.get(fld) not in (None, ''):
                if rec.get(fld) not in (None, '') and str(rec[fld]) != str(fr[fld]) and fld != 'kind':
                    report['conflicts'].append({'id': f'films/{slug}', 'field': fld, 'spreadsheet': rec[fld], 'research': fr[fld]})
                rec[fld] = int(fr[fld]) if fld == 'runtime_min' else str(fr[fld])
        for fld in ('writers', 'directors', 'cast'):
            if fr.get(fld) and not rec.get(fld):
                rec[fld] = fr[fld]
        if fr.get('summary'):
            rec['summary'] = fr['summary'] + FIX['film_summary_append'].get(slug, '')
        if fr.get('segments'):
            segs = []
            for seg in fr['segments']:
                sg = {'title': seg['title']}
                if seg.get('adapts_episode'):
                    t = find_episode('1959', seg['adapts_episode'])
                    if t:
                        sg['adapts_episode'] = t
                for k in ('writers', 'directors', 'cast'):
                    if seg.get(k):
                        sg[k] = seg[k]
                segs.append(sg)
            rec['segments'] = segs
        rec['ids'] = {**(rec.get('ids') or {}), **{k: v for k, v in (fr.get('ids') or {}).items() if v}}
        rec['links'] = {**(rec.get('links') or {}), **{k: v for k, v in (fr.get('links') or {}).items() if v}}
        rec['sources'] = clean_sources((rec.get('sources') or []) + srcs)
        rec['last_verified'] = TODAY
        rec['locked'] = True
        films[slug] = rec
        changed_films.add(slug)
        for seg in (fr.get('segments') or []) if fr.get('kind') in ('film', 'tv-film') else []:
            if seg.get('adapts_episode'):
                tid = find_episode('1959', seg['adapts_episode'])
                if tid:
                    add_conn(f"{slug}--{tid.split('/')[1]}", {
                        'from': f'films/{slug}', 'to': tid, 'kind': 'official-adaptation', 'confidence': 'documented',
                        'summary': f"The \"{seg['title']}\" segment of {fr['title']} adapts {episodes[tid]['title']}.",
                        'sources': srcs})


for slug, extra in FIX.get('film_extra_sources', {}).items():
    films[slug]['sources'] = clean_sources(films[slug]['sources'] + extra)
for slug, flds in FIX['film_overrides'].items():
    if slug in films:
        films[slug].update(flds); films[slug]['locked'] = True; changed_films.add(slug)


def ensure_work(w, srcs):
    """Create a films/ record for a non-TZ work referenced by a connection."""
    w = {**w, **FIX['work_overrides'].get(w['title'], {})}
    if w.get('slug'):
        return w['slug']
    title = w['title']
    for k in report['films_new']:
        if norm(films[k]['title']) == norm(title) and films[k].get('kind') == (w.get('kind') or 'film'):
            films[k]['sources'] = clean_sources(films[k]['sources'] + srcs)
            return k
    if w.get('parent_series') and w.get('kind') in ('tv-episode', 'tv-segment', 'sketch'):
        show = re.split(r'[,(]| season| S\d', w['parent_series'])[0].strip()
        slug = slugify(f"{show} {title}")
        display = title
    else:
        slug = slugify(title)
        show = None
        display = title
    if slug in films and films[slug].get('kind', 'film') == 'film' and w.get('year') and films[slug].get('release_date') \
            and str(films[slug]['release_date'])[:4] != str(w['year']):
        slug = f"{slug}-{w['year']}"
    if slug not in films:
        rec = {'title': display, 'kind': w.get('kind') or 'film'}
        if w.get('year'):
            rec['release_date'] = str(w['year'])
        if show:
            rec['parent_series'] = w['parent_series']
        for fld in ('writers', 'directors'):
            if w.get(fld):
                rec[fld] = w[fld]
        if w.get('ids'):
            rec['ids'] = {k: v for k, v in w['ids'].items() if v}
        rec['sources'] = srcs
        rec['last_verified'] = TODAY
        rec['locked'] = True
        films[slug] = rec
        changed_films.add(slug)
        report['films_new'].append(slug)
    return slug


def resolve_to(to):
    if to == 'series/1983':
        return 'films/twilight-zone-the-movie'
    if to.startswith('series/'):
        return to
    s, slug = to.split('/', 1)
    eid = f'{s}/{slug}'
    if eid in episodes:
        return eid
    return find_episode(s, slug.replace('-', ' '))


CONN_ORDER = ['from', 'to', 'kind', 'confidence', 'summary', 'evidence', 'sources', 'last_verified', 'locked']
if os.path.exists(f'{RES}/connections_inspired.json'):
    ci = json.load(open(f'{RES}/connections_inspired.json'))
    for v in ci.get('verified', []):
        frm, to = v['from'], v['to']
        tid = resolve_to(to)
        cid = next((k for k, c in conns.items() if c['from'] == frm and c['to'] == (tid or to)), None)
        if not cid:
            report['unmatched'].append({'verified': [frm, to]})
            continue
        if v.get('doubtful'):
            report['doubtful'].append({'id': cid, 'evidence': v.get('evidence')})
        rec = dict(conns[cid])
        srcs = research_source_list(v.get('sources'))
        if srcs:
            rec['confidence'] = v['confidence']
        if v.get('evidence'):
            rec['evidence'] = v['evidence']
            if "listed in Adam's research" in (rec.get('summary') or '') and srcs:
                rec['summary'] = v['evidence']
        rec['sources'] = srcs
        rec['_merge_only'] = False
        add_conn(cid, rec)
        report['connections_new'] = [c for c in report['connections_new'] if c != cid]
    new_items = ci.get('new', [])
else:
    new_items = []
for extra in ('connections_homages.json', 'connections_inbox.json', 'homages_tv_2.json', 'homages_film_2.json'):
    if os.path.exists(f'{RES}/{extra}'):
        new_items += json.load(open(f'{RES}/{extra}'))

series_targets = []
for n in new_items:
    if n['work']['title'] in FIX['drop_works']:
        report['skipped'].append(f"{n['work']['title']} (reviewed out)")
        continue
    srcs = research_source_list(n.get('sources')) + [x for x in FIX['extra_sources'].get(n['work']['title'], [])]
    if not srcs:
        report['skipped'].append(f"{n['work']['title']} (no source)")
        continue
    tid = resolve_to(n['to'])
    if not tid:
        if n['to'].startswith('series/'):
            series_targets.append(n)
        else:
            report['unmatched'].append({'new': [n['work']['title'], n['to']]})
        continue
    wslug = ensure_work(n['work'], srcs)
    if wslug in report['films_new'] and not films[wslug].get('summary') and n.get('summary'):
        films[wslug]['summary'] = n['summary']
    cid = f"{wslug}--{tid.split('/')[-1]}"
    if tid.startswith('series/'):
        cid = f"{wslug}--twilight-zone-{tid.split('/')[1]}"
    if cid in conns and cid in changed_conns:
        continue
    add_conn(cid, {'from': f'films/{wslug}', 'to': tid, 'kind': n['kind'], 'confidence': n['confidence'],
                   'summary': n.get('summary'), 'evidence': n.get('evidence'), 'sources': srcs, '_merge_only': True})
report['series_level_refs'] = [{'work': n['work'], 'to': n['to'], 'kind': n['kind'],
                                'summary': n.get('summary') or n.get('evidence'), 'sources': n.get('sources')}
                               for n in series_targets]

# ---------- write ----------
for eid in changed_eps:
    dump(f'{OUT}/episodes/{eid}.yaml', ordered(episodes[eid], KEY_ORDER))
for s in changed_films:
    dump(f'{OUT}/films/{s}.yaml', ordered(films[s], FILM_ORDER))
for c in changed_conns:
    dump(f'{OUT}/connections/{c}.yaml', ordered(conns[c], CONN_ORDER))
json.dump(report, open(os.path.join(os.path.dirname(OUT.rstrip('/')), 'merge_report.json'), 'w'), indent=1, default=str)
print({k: (len(v) if isinstance(v, list) else v) for k, v in report.items()})
