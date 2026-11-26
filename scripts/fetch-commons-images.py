#!/usr/bin/env python3
"""Fetch the next batch of checked Wikimedia Commons pictures for the nightly run.

    python3 -I scripts/fetch-commons-images.py <out-dir> [minutes]

Reads data/images/pending-commons.json (pictures already checked for subject and record), skips any whose
web copy is already in public/media/images/, and for the rest reads each Commons file page's machine-readable
license, author, date and source. Only public domain, CC0, CC BY and CC BY-SA files are downloaded (a 960 px
Commons thumbnail). Pages flagged for deletion or as copyright violations are skipped.

Writes <out-dir>/manifest.json in the shape scripts/import-images.mjs takes, minus `alt`, which a person (or
the nightly session) writes after looking at each picture. Stops after [minutes] (default 100), because
Wikimedia throttles this site's tools to a few files an hour. Safe to re-run: it resumes.
"""
import json, re, html, time, subprocess, os, sys, urllib.parse

REPO = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
OUT = os.path.abspath(sys.argv[1]); LIMIT = time.time() + 60 * float(sys.argv[2] if len(sys.argv) > 2 else 100)
UA = 'IntoTheTwilightZoneFanSite/1.0 (non-commercial fan site)'
os.makedirs(OUT, exist_ok=True)
pend = json.load(open(os.path.join(REPO, 'data/images/pending-commons.json')))
mf = os.path.join(OUT, 'manifest.json'); done = json.load(open(mf)) if os.path.exists(mf) else []
seen = {x['commons'] for x in done}
log = open(os.path.join(OUT, 'log.txt'), 'a')
tmp = os.path.join(OUT, '_page.html')

def note(s): log.write(s + '\n'); log.flush(); print(s, flush=True)
def get(url, path):
    for i in range(6):
        if time.time() > LIMIT: return False
        r = subprocess.run(['curl', '-s', '-L', '-A', UA, '-o', path, '-w', '%{http_code}', '-m', '60', url], capture_output=True, text=True)
        if r.stdout.strip() == '200' and os.path.getsize(path) > 4000 and b'Wikimedia Error' not in open(path, 'rb').read(3000): return True
        time.sleep(min(600, 45 * (2 ** i)))
    return False
def txt(x): return html.unescape(re.sub(r'<[^>]+>', '', x)).strip()
def year(d, title):
    b = re.match(r'before (\d{4})', d or '')
    if b: return 'before ' + b.group(1)
    y = re.search(r'(1[89]\d\d|20\d\d)', d or '') or re.search(r'\((\d{4})\)', title)
    return y.group(1) if y else None

for p in pend:
    if time.time() > LIMIT: note('time limit reached'); break
    web = os.path.join(REPO, p['planned_file'].replace('files/', 'public/media/images/').rsplit('.', 1)[0] + '.webp')
    if p['commons_file'] in seen or os.path.exists(web): continue
    title = p['commons_file'].replace(' ', '_')
    page = f'https://commons.wikimedia.org/wiki/{urllib.parse.quote(title)}'
    if not get(page, tmp): note(f'page fail {title}'); continue
    s = html.unescape(open(tmp, encoding='utf8', errors='ignore').read())
    if re.search(r'Deletion request|copyright violation|Non-free', s, re.I): note(f'flagged {title}'); continue
    lic = [txt(m) for m in re.findall(r'class="licensetpl_short"[^>]*>(.*?)</span>', s, re.S)]
    aut = re.search(r'id="fileinfotpl_aut".*?</td>\s*<td[^>]*>(.*?)</td>', s, re.S)
    src = re.search(r'id="fileinfotpl_src".*?</td>\s*<td[^>]*>(.*?)</td>', s, re.S)
    date = re.search(r'id="fileinfotpl_date".*?</td>\s*<td[^>]*>(.*?)</td>', s, re.S)
    orig = re.search(r'class="fullImageLink"[^>]*>\s*<a href="([^"]+)"', s)
    if not (lic and orig): note(f'no license/orig {title}'); continue
    # A file may carry several licenses (often GFDL plus a CC one): use the first one the site accepts.
    license = None
    for L in lic:
        if re.match(r'public domain|PD', L, re.I): license = 'Public domain'
        else:
            m = re.match(r'(CC BY(?:-SA)? [1-4]\.0|CC0)', L); license = m.group(1) if m else None
        if license: break
    if not license: note(f'license {" / ".join(lic)} {title}'); continue
    url = orig.group(1).split('?')[0]
    m = re.match(r'https://upload\.wikimedia\.org/wikipedia/commons/(\w/\w\w)/(.+)$', url)
    name = m.group(2) if m else ''
    # Commons renders TIFF and other formats as JPEG thumbnails.
    suffix = '.jpg' if re.search(r'\.tiff?$', name, re.I) else ''
    thumb = f'https://upload.wikimedia.org/wikipedia/commons/thumb/{m.group(1)}/{name}/960px-{name}{suffix}' if m else url
    dest = os.path.join(OUT, p['planned_file']); os.makedirs(os.path.dirname(dest), exist_ok=True)
    time.sleep(20)
    if not (get(thumb, dest) or (not suffix and get(url, dest))): note(f'img fail {title}'); continue
    ftype = subprocess.run(['file', '-b', dest], capture_output=True, text=True).stdout
    if not re.search('JPEG|PNG', ftype): note(f'not image {title}'); os.remove(dest); continue
    creator = txt(aut.group(1)) if aut else ''
    creator = re.sub(r'^(Unknown author)+$', 'Unknown photographer', creator) or 'Unknown photographer'
    e = {'commons': p['commons_file'], 'file': p['planned_file'], 'records': p['records'], 'role': p['role'],
         'title': p['title'], 'creator': creator, 'license': license, 'source_url': page}
    if len(creator) > 80: e['creator_note'] = creator[:400]; e['creator'] = creator[:77].rsplit(' ', 1)[0] + '…'
    if license == 'CC0': e['license_url'] = 'https://creativecommons.org/publicdomain/zero/1.0/'
    elif license != 'Public domain':
        kind, ver = license[3:].lower().split(' '); e['license_url'] = f'https://creativecommons.org/licenses/{kind}/{ver}/'
    y = year(txt(date.group(1)) if date else '', p['title'])
    if y: e['date'] = y
    if src: e['original_source'] = txt(src.group(1))[:120]
    done.append(e); json.dump(done, open(mf, 'w'), indent=1)
    note(f'ok {title}')
    time.sleep(25)
else:
    note('finished: nothing left to fetch')
