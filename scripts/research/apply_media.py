#!/usr/bin/env python3
"""Merge research data from data/research/series-episodes-movies/ into src/content.

media.yaml   {record_path: [media items]}  appended to media[], deduped by (url, title)
patches.yaml {record_path: {field: value}} sets scalar fields, appends to lists (deduped)
Keys starting with "_" are YAML anchors only and are skipped. Records must already exist
unless the patch carries `_create: true`.
Usage: python3 scripts/research/apply_media.py
"""
import pathlib, sys, yaml

ROOT = pathlib.Path(__file__).resolve().parents[2]
CONTENT = ROOT / 'src/content'
DATA = ROOT / 'data/research/series-episodes-movies'


class Dumper(yaml.SafeDumper):
    pass


def _str(d, s):
    style = "'" if s[:4].isdigit() and len(s) <= 10 else None
    return d.represent_scalar('tag:yaml.org,2002:str', s, style=style)


Dumper.add_representer(str, _str)


def path_for(key):
    coll, _, rest = key.partition('/')
    if coll.isdigit():  # episode id
        return CONTENT / 'episodes' / coll / f'{rest}.yaml'
    return CONTENT / coll / f'{rest}.yaml'


def load(p):
    return yaml.safe_load(p.read_text()) or {}


def save(p, d):
    p.parent.mkdir(parents=True, exist_ok=True)
    p.write_text(yaml.dump(d, Dumper=Dumper, sort_keys=False, allow_unicode=True, width=115))


def merge_list(old, new):
    out = list(old or [])
    seen = [yaml.safe_dump(x, sort_keys=True) for x in out]
    for x in new:
        k = yaml.safe_dump(x, sort_keys=True)
        if isinstance(x, dict) and 'url' in x:
            if any(isinstance(o, dict) and o.get('url') == x.get('url') and o.get('title') == x.get('title') for o in out):
                continue
        if k not in seen:
            out.append(x)
            seen.append(k)
    return out


def main():
    missing = []
    changed = 0
    for fname in ('patches.yaml', 'media.yaml'):
        f = DATA / fname
        if not f.exists():
            continue
        for key, val in (yaml.safe_load(f.read_text()) or {}).items():
            if key.startswith('_'):
                continue
            p = path_for(key)
            create = isinstance(val, dict) and val.pop('_create', False)
            if not p.exists() and not create:
                missing.append(key)
                continue
            d = load(p) if p.exists() else {}
            if fname == 'media.yaml':
                d['media'] = merge_list(d.get('media'), [dict(m) for m in val])
            else:
                for k, v in val.items():
                    if isinstance(v, list) and k not in ('overview',):
                        d[k] = merge_list(d.get(k), v)
                    else:
                        d[k] = v
            save(p, d)
            changed += 1
    print(f'updated {changed} records')
    if missing:
        print('MISSING records:', *missing, sep='\n  ')
        sys.exit(1)


if __name__ == '__main__':
    main()
