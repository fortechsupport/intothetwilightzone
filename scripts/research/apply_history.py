"""Apply legal/history events and international titles. Run from repo's src/content."""
import json, os, sys, yaml
HERE = os.path.dirname(os.path.abspath(__file__))
RES = sys.argv[1]
exec(open(os.path.join(HERE, 'merge_tv_film.py' if os.path.exists(os.path.join(HERE, 'merge_tv_film.py')) else 'merge.py')).read()
     .split('# ---------- load snapshot')[0].replace('SNAP, RES, OUT = sys.argv[1:4]', ''))
def load(p): return yaml.safe_load(open(p))
def save(p, d):
    with open(p, 'w') as f: yaml.dump(d, f, Dumper=Dumper, sort_keys=False, allow_unicode=True, width=110)
def target(rel):
    if rel.startswith('series/'): return f"series/{rel.split('/')[1]}.yaml"
    if rel.startswith('films/'): return f"{rel}.yaml"
    p = f"episodes/{rel}.yaml"
    return p if os.path.exists(p) else p.replace('/the-', '/', 1)
SKIP_EPISODE_TRIVIA = {'1959/sounds-and-silences'}  # already has a sourced trivia fact on the suit
recs = {}
def get(rel):
    p = target(rel)
    if p not in recs: recs[p] = load(p)
    return recs[p]
for e in json.load(open(f'{RES}/legal.json')):
    rel = e['relates_to']; srcs = clean_sources(e['sources'])
    if rel.startswith(('series/', 'films/')):
        d = get(rel); h = d.setdefault('history', [])
        if all(x['title'] != e['title'] for x in h):
            h.append({'date': e['date'], 'title': e['title'], 'text': e['text'], 'sources': srcs})
    elif rel not in SKIP_EPISODE_TRIVIA:
        d = get(rel); t = d.setdefault('trivia', [])
        if all(x['text'] != e['text'] for x in t):
            t.append({'text': e['text'], 'sources': srcs})
for e in json.load(open(f'{RES}/international.json')):
    rel = e['series'] if e['series'].startswith('films/') else f"series/{e['series']}"
    d = get(rel); it = d.setdefault('international_titles', [])
    row = {k: e[k] for k in ('country', 'language', 'title', 'broadcaster', 'year', 'note') if e.get(k) not in (None, '')}
    row['sources'] = clean_sources(e['sources'])
    if all((x['country'], x['title']) != (row['country'], row['title']) for x in it):
        it.append(row)
for p, d in recs.items():
    for k in ('history',):
        if d.get(k): d[k].sort(key=lambda x: x['date'])
    d['locked'] = True
    if 'last_verified' in d or p.startswith(('films', 'episodes')): d['last_verified'] = '2026-11-19'
    save(p, d)
print(len(recs), 'records updated')
