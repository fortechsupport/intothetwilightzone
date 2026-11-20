#!/usr/bin/env python3
"""Merge the 2026-11-20 homages / new-areas research into src/content.

Inputs (JSONL, produced by research agents, then hand-checked):
  verify-*.jsonl      verdicts on fan-noted connections
  new-homages.jsonl   new homage / parody / reference works
  new-areas.jsonl     advertising, legal history, cultural impact, props, production records

Usage: python3 scripts/research/merge_homages_new_areas.py <dir with the jsonl files> [--dry-run]

Rules: never deletes a record. Upgrades a connection's confidence only with a source URL.
Hand corrections go in data/research/homages-new-areas/fixups.json:
  {"skip_verify": [file...], "skip_new": [title...], "skip_area": [title...],
   "verify": {file: {field: value}}, "new": {title: {field: value}}, "area": {title: {field: value}}}
"""
from __future__ import annotations

import glob
import json
import os
import re
import sys
import unicodedata

import yaml

ROOT = os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
C = os.path.join(ROOT, "src", "content")
TODAY = "2026-11-20"
FIX = os.path.join(ROOT, "data", "research", "homages-new-areas", "fixups.json")


class Dumper(yaml.SafeDumper):
    pass


def _str(d, s):
    return d.represent_scalar("tag:yaml.org,2002:str", s, style="'" if re.fullmatch(r"\d{4}(-\d\d){0,2}", s) else None)


Dumper.add_representer(str, _str)


def dump(path, d, dry):
    if dry:
        return
    os.makedirs(os.path.dirname(path), exist_ok=True)
    with open(path, "w") as f:
        yaml.dump(d, f, Dumper=Dumper, sort_keys=False, allow_unicode=True, width=110)


def slugify(s: str) -> str:
    s = unicodedata.normalize("NFKD", s).encode("ascii", "ignore").decode()
    s = s.lower().replace("'", "").replace("’", "")
    return re.sub(r"[^a-z0-9]+", "-", s).strip("-")[:90]


def norm(s: str) -> str:
    s = re.sub(r"^(the|a|an)\s+", "", (s or "").lower().strip().strip('"“”'))
    return re.sub(r"[^a-z0-9]+", "", s)


def load_jsonl(path):
    out = []
    if not os.path.exists(path):
        return out
    for line in open(path):
        line = line.strip()
        if not line:
            continue
        try:
            out.append(json.loads(line))
        except json.JSONDecodeError:
            print("bad json line in", path, line[:80], file=sys.stderr)
    return out


EPISODES = {}  # norm title -> [ids]
for f in glob.glob(os.path.join(C, "episodes", "*", "*.yaml")):
    d = yaml.safe_load(open(f))
    rid = os.path.relpath(f, os.path.join(C, "episodes"))[:-5]
    for t in [d["title"], *(d.get("aka") or [])]:
        EPISODES.setdefault(norm(t), []).append(rid)

SERIES_REF = {"1959": "series/1959", "1985": "series/1985", "2002": "series/2002", "2019": "series/2019",
              "film-1983": "films/twilight-zone-the-movie"}


def episode_refs(target: str, series: str | None) -> list[str]:
    """Map a free-text TZ target to episode ids (or a series ref)."""
    t = (target or "").strip()
    if not t or t.lower() in ("series", "the series", "show", "general") or "serling" in t.lower() and len(t) < 20:
        return [SERIES_REF.get(series or "1959", "series/1959")]
    if series == "film-1983":
        return ["films/twilight-zone-the-movie"]
    refs = []
    for part in re.split(r"\s*(?:;|,| and | / )\s*", t):
        ids = EPISODES.get(norm(part), [])
        if series and series in SERIES_REF and any(i.startswith(series + "/") for i in ids):
            ids = [i for i in ids if i.startswith(series + "/")]
        elif len(ids) > 1:
            ids = [i for i in ids if i.startswith("1959/")] or ids[:1]
        refs += ids[:1]
    return refs or [SERIES_REF.get(series or "1959", "series/1959")]


def good_sources(srcs):
    out = []
    for s in srcs or []:
        if not isinstance(s, dict) or not s.get("title"):
            continue
        u = s.get("url")
        if u and not re.match(r"https?://", u):
            u = None
        e = {"title": s["title"]}
        if u:
            e["url"] = u
        if s.get("note"):
            e["note"] = s["note"]
        out.append(e)
    return out


def merge_sources(old, new):
    seen = {(s.get("url") or s.get("title")) for s in old}
    for s in new:
        k = s.get("url") or s.get("title")
        if k not in seen:
            old.append(s)
            seen.add(k)
    return old


RANK = {"fan-noted": 0, "documented": 1, "confirmed-by-creator": 2}


def apply_verify(rows, fix, dry, report):
    for r in rows:
        fn = r.get("file")
        if not fn or fn in fix.get("skip_verify", []):
            continue
        r.update(fix.get("verify", {}).get(fn, {}))
        path = os.path.join(C, "connections", fn)
        if not os.path.exists(path):
            report["missing"].append(fn)
            continue
        d = yaml.safe_load(open(path))
        v = r.get("verdict")
        srcs = good_sources(r.get("sources"))
        has_url = any(s.get("url") for s in srcs)
        ev = (r.get("evidence") or "").strip()
        if v in ("documented", "confirmed-by-creator") and has_url:
            if RANK[v] > RANK[d["confidence"]]:
                d["confidence"] = v
            if ev:
                d["evidence"] = ev
            if r.get("kind") in ("homage", "parody", "reference", "inspired-by", "remake") and r["kind"] != d["kind"]:
                report["kind_changed"].append(f"{fn}: {d['kind']} -> {r['kind']}")
                d["kind"] = r["kind"]
            # the spreadsheet placeholder source is superseded once a real one exists
            d["sources"] = [s for s in d.get("sources", []) if s.get("url") or "spreadsheet" not in s.get("title", "").lower()]
            report["upgraded"].append(f"{fn} -> {v}")
        elif v == "wrong-episode":
            note = f" Research note ({TODAY}): published sources tie this work to \"{r.get('suggested_episode')}\" rather than this episode."
            d["evidence"] = ((d.get("evidence") or d.get("summary") or "").rstrip() + note + (" " + ev if ev else "")).strip()
            d["research_confidence"] = "low"
            report["wrong_episode"].append(f"{fn}: {r.get('suggested_episode')}")
            new_to = episode_refs(r.get("suggested_episode") or "", None)
            if new_to and not new_to[0].startswith("series/") and has_url:
                report["wrong_episode_new_links"].append((d["from"], new_to[0], srcs, ev, d["kind"]))
        elif v == "doubtful":
            d["research_confidence"] = "low"
            if ev:
                d["evidence"] = ((d.get("evidence") or "").rstrip() + f" Research note ({TODAY}): {ev}").strip()
            report["doubtful"].append(fn)
        else:
            report["kept"].append(fn)
            check = " ".join(x for x in (ev, (r.get("note") or "").strip()) if x)
            if check:
                prior = re.sub(r"\s*Checked \d{4}-\d\d-\d\d:.*$", "", d.get("evidence") or "", flags=re.S).strip()
                d["evidence"] = (prior + " " if prior else "") + f"Checked {TODAY}: {check}"
        d["sources"] = merge_sources(d.get("sources", []), srcs)
        d["last_verified"] = TODAY
        d["locked"] = True
        dump(path, d, dry)
    # Add the corrected-episode links alongside the original (never replace)
    for frm, to, srcs, ev, kind in report["wrong_episode_new_links"]:
        fn = f"{frm.split('/', 1)[1]}--{to.split('/')[-1]}.yaml"
        path = os.path.join(C, "connections", fn)
        if os.path.exists(path):
            continue
        dump(path, {"from": frm, "to": to, "kind": kind, "confidence": "documented", "evidence": ev,
                    "sources": srcs, "last_verified": TODAY, "locked": True}, dry)
        report["created_connections"].append(fn)


MEDIUM_FILM_KIND = {"tv-episode": "tv-episode", "tv-segment": "tv-segment", "film": "film", "sketch": "sketch",
                    "commercial": "commercial", "music-video": "music-video", "web-series": "web-series",
                    "stage": "stage", "short": "short", "tv-series": "tv-series"}
MEDIUM_WORK = {"comic": ("parody", "comic"), "game": ("game", "video-game"), "print-ad": ("advertisement", "print-ads"),
               "podcast": ("parody", "podcast"), "other": ("parody", "other")}


def existing_index():
    idx = {}
    for col in ("films", "works"):
        for f in glob.glob(os.path.join(C, col, "*.yaml")):
            d = yaml.safe_load(open(f))
            t = d.get("title", "")
            idx[norm((d.get("parent_series") or "").split(",")[0] + t)] = f"{col}/{os.path.basename(f)[:-5]}"
            idx.setdefault(norm(t), f"{col}/{os.path.basename(f)[:-5]}")
    return idx


def unique_path(col, slug):
    p = os.path.join(C, col, slug + ".yaml")
    n = 2
    while os.path.exists(p):
        p = os.path.join(C, col, f"{slug}-{n}.yaml")
        n += 1
    return p


def year_of(y):
    y = str(y or "").strip()
    return y if re.fullmatch(r"\d{4}(-\d\d){0,2}", y) else None


def apply_new(rows, fix, dry, report):
    idx = existing_index()
    for r in rows:
        title = (r.get("title") or "").strip()
        if not title or title in fix.get("skip_new", []):
            continue
        r.update(fix.get("new", {}).get(title, {}))
        srcs = good_sources(r.get("sources"))
        conf = r.get("confidence") if r.get("confidence") in RANK else "fan-noted"
        if conf != "fan-noted" and not any(s.get("url") for s in srcs):
            conf = "fan-noted"
        parent = (r.get("parent_series") or "").strip()
        key = norm(parent.split(",")[0] + title)
        if key in idx or (not parent and norm(title) in idx):
            report["dupes"].append(f"{parent + ': ' if parent else ''}{title} (exists as {idx.get(key) or idx.get(norm(title))})")
            continue
        medium = r.get("medium") or "other"
        summ = (r.get("summary") or "").strip()
        tzk = r.get("kind") if r.get("kind") in ("homage", "parody", "reference", "inspired-by") else "homage"
        base = slugify((parent.split(",")[0] + " " + title) if parent else title)
        if medium in MEDIUM_FILM_KIND:
            col = "films"
            rec = {"title": title, "kind": MEDIUM_FILM_KIND[medium]}
            if parent:
                rec["parent_series"] = parent
            if year_of(r.get("year")):
                rec["release_date"] = year_of(r.get("year"))
            if r.get("creators"):
                rec["writers"] = [c for c in r["creators"] if isinstance(c, str)][:6]
            rec["summary"] = summ
        else:
            col = "works"
            k, sub = MEDIUM_WORK.get(medium, ("parody", medium))
            rec = {"title": title, "kind": k, "subtype": sub}
            if year_of(r.get("year")):
                rec["year"] = year_of(r.get("year"))
            if r.get("creators"):
                rec["creator"] = ", ".join(c for c in r["creators"] if isinstance(c, str))
            if parent:
                rec["publisher"] = parent
            rec["description"] = summ
            rec["categories"] = [f"homages/{'parodies' if tzk == 'parody' else 'references' if tzk == 'reference' else 'homages'}"]
            if k == "advertisement":
                rec["categories"].append("advertising/print-ads")
        rec["relevance"] = "related" if conf != "fan-noted" else "tangential"
        if r.get("imdb") and re.fullmatch(r"tt\d+", str(r["imdb"])):
            rec["ids"] = {"imdb": r["imdb"]}
        rec["sources"] = srcs or [{"title": "Research note", "note": "No source URL recorded."}]
        rec["research_confidence"] = {"confirmed-by-creator": "high", "documented": "medium"}.get(conf, "low")
        rec["last_verified"] = TODAY
        rec["locked"] = True
        path = unique_path(col, base)
        rid = os.path.basename(path)[:-5]
        dump(path, rec, dry)
        idx[key] = f"{col}/{rid}"
        report["new_records"].append(f"{col}/{rid}")
        for to in episode_refs(r.get("tz_target") or "", r.get("tz_series")):
            cfn = f"{rid}--{to.split('/')[-1]}.yaml"
            cpath = os.path.join(C, "connections", cfn)
            if os.path.exists(cpath):
                continue
            c = {"from": f"{col}/{rid}", "to": to, "kind": tzk, "confidence": conf}
            if summ:
                c["evidence" if conf != "fan-noted" else "summary"] = summ
            c["sources"] = rec["sources"]
            c["last_verified"] = TODAY
            c["locked"] = True
            dump(cpath, c, dry)
            report["new_connections"].append(cfn)


AREA = {  # area -> (works.kind, top-level category)
    "advertising": ("advertisement", "advertising"),
    "legal-history": ("legal", "legal-history"),
    "catchphrases-and-cultural-impact": ("cultural-impact", "cultural-impact"),
    "props-and-collecting": ("prop", "props-collecting"),
    "production-and-broadcast": ("production", "events"),
}
SUBCAT = {  # agent subtype keywords -> "<category>/<subcategory>" (slugs agreed with the taxonomy thread)
    "advertising": [("print", "advertising/print-ads"), ("promo", "advertising/promos-trailers"), ("trailer", "advertising/promos-trailers"),
                    ("sponsor", "advertising/sponsors"), ("", "advertising/commercials")],
    "legal-history": [("accident", "legal-history/trials"), ("trial", "legal-history/trials"), ("criminal", "legal-history/trials"),
                      ("rights", "legal-history/rights-ownership"), ("owner", "legal-history/rights-ownership"),
                      ("trademark", "legal-history/rights-ownership"), ("censor", "legal-history/censorship"),
                      ("sponsor", "legal-history/censorship"), ("", "legal-history/lawsuits")],
    "catchphrases-and-cultural-impact": [("theme", "cultural-impact/theme-shorthand"), ("dictionar", "cultural-impact/dictionary-rankings"),
                                         ("poll", "cultural-impact/dictionary-rankings"), ("rank", "cultural-impact/dictionary-rankings"),
                                         ("idiom", "cultural-impact/catchphrases"), ("catchphrase", "cultural-impact/catchphrases"),
                                         ("phrase", "cultural-impact/catchphrases"), ("", "cultural-impact/public-uses")],
    "props-and-collecting": [("auction", "props-collecting/auctions"), ("museum", "props-collecting/museum-holdings"),
                             ("replica", "props-collecting/replicas"), ("", "props-collecting/props-costumes")],
    "production-and-broadcast": [("dub", "series/international"), ("international", "series/international"),
                                 ("title", "series/international"), ("syndic", "events/broadcasts-marathons"),
                                 ("broadcast", "events/broadcasts-marathons"), ("slot", "events/broadcasts-marathons"),
                                 ("", "events/production-history")],
}
RIGHTS = {True: "public-domain", False: "link-only", None: "link-only"}
MEDIA_TYPES = {"video", "audio", "document", "image", "ad", "article", "interview", "transcript", "website", "link"}


def apply_areas(rows, fix, dry, report):
    titles = {norm(yaml.safe_load(open(f)).get("title", "")) for f in glob.glob(os.path.join(C, "works", "*.yaml"))}
    for r in rows:
        title = (r.get("title") or "").strip()
        area = r.get("area")
        if not title or area not in AREA or title in fix.get("skip_area", []):
            continue
        r.update(fix.get("area", {}).get(title, {}))
        if norm(title) in titles:
            report["dupes"].append(f"{title} (works title exists)")
            continue
        kind, cat = AREA[area]
        sub_raw = (r.get("subtype") or "").lower()
        placement = next(slug for kw, slug in SUBCAT[area] if kw in sub_raw)
        rec = {"title": title, "kind": kind, "subtype": sub_raw or placement.split("/")[1]}
        if year_of(r.get("year")):
            rec["year"] = year_of(r.get("year"))
        if r.get("who"):
            rec["creator"] = r["who"] if isinstance(r["who"], str) else ", ".join(r["who"])
        rec["description"] = (r.get("description") or "").strip()
        if r.get("why"):
            rec["details"] = {"why_it_matters": r["why"].strip()}
        if r.get("tz_refs"):
            refs = r["tz_refs"] if isinstance(r["tz_refs"], list) else [r["tz_refs"]]
            rec.setdefault("details", {})["relates_to"] = refs
        rec["categories"] = [placement]
        if r.get("relevance") in ("core", "related", "tangential"):
            rec["relevance"] = r["relevance"]
        media = []
        for m in r.get("media") or []:
            if not isinstance(m, dict) or not re.match(r"https?://", str(m.get("url", ""))):
                continue
            t = m.get("type") if m.get("type") in MEDIA_TYPES else ("website" if m.get("type") == "page" else "link")
            e = {"type": t, "title": m.get("title") or title, "url": m["url"]}
            if m.get("hosting"):
                e["host"] = m["hosting"]
            e["rights"] = RIGHTS.get(m.get("public_domain"), "link-only")
            media.append(e)
        if media:
            rec["media"] = media
        rec["sources"] = good_sources(r.get("sources")) or [{"title": "Research note", "note": "No source URL recorded."}]
        rec["research_confidence"] = r.get("confidence") if r.get("confidence") in ("high", "medium", "low") else "medium"
        rec["last_verified"] = TODAY
        rec["locked"] = True
        path = unique_path("works", slugify(title))
        dump(path, rec, dry)
        titles.add(norm(title))
        report["area_records"].append(f"{placement}: works/{os.path.basename(path)[:-5]}")


def main():
    src = sys.argv[1]
    dry = "--dry-run" in sys.argv
    fix = json.load(open(FIX)) if os.path.exists(FIX) else {}
    report = {k: [] for k in ("missing", "upgraded", "kind_changed", "wrong_episode", "wrong_episode_new_links", "doubtful", "kept",
                              "created_connections", "dupes", "new_records", "new_connections", "area_records")}
    verify = sum((load_jsonl(p) for p in sorted(glob.glob(os.path.join(src, "verify-*.jsonl")))), [])
    apply_verify(verify, fix, dry, report)
    apply_new(load_jsonl(os.path.join(src, "new-homages.jsonl")), fix, dry, report)
    apply_areas(load_jsonl(os.path.join(src, "new-areas.jsonl")), fix, dry, report)
    report.pop("wrong_episode_new_links")
    print(json.dumps({k: len(v) for k, v in report.items()}, indent=1))
    with open(os.path.join(src, "merge-report.json"), "w") as f:
        json.dump(report, f, indent=1)


if __name__ == "__main__":
    main()
