#!/usr/bin/env python3
"""Merge the 2026-11-20 music / games / artwork / merchandise research into src/content.

Input: JSONL files (one record per line) produced by the research pass, format described in
docs/research/music-games-art-merch-2.md. Each row is a new record or, with `update_of`, an
enrichment of an existing one. The script

  * writes new YAML records (works, songs, people) and enriches existing ones without dropping data,
  * places records in the site taxonomy through `categories[]` (new subcategory slugs are flagged new
    by the site automatically),
  * converts media links to the shared `media[]` shape (link-only unless public domain),
  * writes connection records for named episodes, and
  * writes the researcher's connection / tier / recommendation reasons to
    data/review/assessment-overrides.yaml so Adam's review sheet explains every row.

Usage: python3 scripts/research/merge_music_games_art_merch.py FILE.jsonl [FILE.jsonl ...]
"""
from __future__ import annotations

import json
import re
import sys
import unicodedata
from pathlib import Path

import yaml

ROOT = Path(__file__).resolve().parents[2]
CONTENT = ROOT / "src" / "content"
OVERRIDES = ROOT / "data" / "review" / "assessment-overrides.yaml"
TODAY = "2026-11-20"


class Dumper(yaml.SafeDumper):
    pass


def _str(dumper, s):
    style = ">" if len(s) > 100 and "\n" not in s else None
    return dumper.represent_scalar("tag:yaml.org,2002:str", s, style=style)


Dumper.add_representer(str, _str)


def slugify(s: str) -> str:
    s = unicodedata.normalize("NFKD", str(s)).encode("ascii", "ignore").decode()
    s = re.sub(r"['’]", "", s.lower())
    return re.sub(r"[^a-z0-9]+", "-", s).strip("-")[:90].strip("-")


EPISODES = {str(p.relative_to(CONTENT / "episodes"))[:-5] for p in (CONTENT / "episodes").rglob("*.yaml")}

# ------------------------------------------------------------------ taxonomy placement
GAME_SUB = [
    (r"tabletop|rpg|role-?play|d20", "games/tabletop-rpgs"),
    (r"slot|casino|lottery|scratch", "games/slot-and-casino-games"),
    (r"homage|reference|inspired", "games/game-homages"),
    (r"escape", "games/escape-rooms"),
    (r"pinball|arcade", "games/pinball-arcade"),
    (r"video|computer|mobile|app|vr|console|digital|handheld|lcd|electronic", "games/video-games"),
    (r"board|card|trivia|dice|party|puzzle", "games/board-card-games"),
]
ART_SUB = [
    (r"night-gallery|gallery-painting", "artwork/night-gallery-paintings"),
    (r"title|opening|end-card|logo", "artwork/title-design"),
    (r"poster|key-art|one-sheet|screen-print|print|lobby", "artwork/posters-key-art"),
    (r"comic|magazine|cover", "artwork/comic-and-magazine-covers"),
    (r"exhibit|show|gallery-show", "artwork/exhibitions"),
    (r"mural|statue|sculpture|public|monument", "artwork/murals-and-public-art"),
    (r"makeup|prosthetic|costume|production-design|set-design|prop", "artwork/makeup-and-production-design"),
    (r"concept|storyboard", "artwork/concept-art-and-storyboards"),
    (r"caricature|illustration|painting|portrait|fan-art|sketch|drawing|artist", "artwork/art-illustration"),
]
MERCH_SUB = [
    (r"trading-card|card-set|sketch-card|cards", "merchandise/trading-cards"),
    (r"home-video|vhs|dvd|blu|laserdisc|4k|home-media|streaming", "merchandise/home-media"),
    (r"replica|prop", "merchandise/prop-replicas"),
    (r"mask|costume", "merchandise/masks-and-costumes"),
    (r"ornament", "merchandise/ornaments"),
    (r"model-kit|model kit", "merchandise/model-kits"),
    (r"puzzle", "merchandise/puzzles"),
    (r"premium|fast-food|promo", "merchandise/promotional-premiums"),
    (r"figure|bobble|statue|bust|plush|doll|toy|vinyl|funko|lego", "merchandise/toys-figures"),
    (r"apparel|shirt|hat|sock|pin|patch|jewel|mug|household|calendar|lunch|coaster|poster|stationery|book", "merchandise/household-apparel"),
]


def place(row: dict) -> list[str]:
    kind, sub = row.get("kind") or "", slugify(row.get("subtype") or "")
    text = f"{sub} {slugify(row.get('title', ''))}"
    table = {"game": GAME_SUB, "artwork": ART_SUB, "collectible": MERCH_SUB, "home-media": MERCH_SUB}.get(kind)
    if kind == "advertisement":
        return ["advertising/print-ads"]
    if kind == "soundtrack":
        return ["music/soundtracks"]
    if not table:
        return []
    for pat, cat in table:
        if re.search(pat, text):
            return [cat]
    return [{"game": "games/other-games", "artwork": "artwork/other-artwork"}.get(kind, "merchandise/other-merchandise")]


# ------------------------------------------------------------------ media
MEDIA_TYPE = {"advertisement": "ad", "ad": "ad", "listing": "link", "audio": "audio", "video": "video", "image": "image",
              "document": "document", "article": "article", "interview": "interview", "website": "website", "link": "link"}
RIGHTS = {"public-domain": "public-domain", "hosted-by-rights-holder": "licensed", "licensed": "licensed",
          "cc": "cc", "hosted-by-archive": "link-only", "link-only": "link-only"}


def media(row: dict) -> list[dict]:
    out = []
    for m in row.get("media") or []:
        url = m.get("url")
        if not url or not str(url).startswith("http"):
            continue
        item = {"type": MEDIA_TYPE.get(str(m.get("type", "link")).lower(), "link"), "title": m.get("title") or url, "url": url}
        if m.get("host"):
            item["host"] = m["host"]
        if m.get("date"):
            item["date"] = str(m["date"])
        item["rights"] = RIGHTS.get(str(m.get("rights", "link-only")).lower(), "unknown")
        if m.get("note"):
            item["note"] = m["note"]
        if str(m.get("type", "")).lower() == "listing":
            item["subtype"] = "listing"
        out.append(item)
    return out


def sources(row: dict) -> list[dict]:
    out = []
    for s in row.get("sources") or []:
        if isinstance(s, str):
            s = {"title": s, "url": s} if s.startswith("http") else {"title": s}
        if not s.get("title"):
            continue
        item = {"title": s["title"]}
        if s.get("url") and str(s["url"]).startswith("http"):
            item["url"] = s["url"]
        if s.get("note"):
            item["note"] = s["note"]
        out.append(item)
    return out


def merge_list(old: list, new: list, key: str) -> list:
    seen = {str(x.get(key)) for x in old if isinstance(x, dict)}
    return old + [x for x in new if str(x.get(key)) not in seen]


def year(v):
    if v in (None, ""):
        return None
    if isinstance(v, int):
        return v
    s = str(v).strip()
    return int(s) if re.fullmatch(r"\d{4}", s) else s


# ------------------------------------------------------------------ record builders
SONG_CONN = {"theme", "lyric-mention", "reference", "unclassified"}
WORK_KINDS = {"game", "collectible", "artwork", "stage", "attraction", "parody", "convention", "television", "soundtrack",
              "event", "link", "fan-community", "memorial", "education", "other", "lecture", "advertisement", "home-media"}


def build(row: dict) -> tuple[str, str, dict]:
    col = row.get("collection", "works")
    if col == "people":
        rid = row.get("update_of") or slugify(row.get("name") or row.get("title"))
        d = {"name": row.get("name") or row.get("title")}
        for k in ("born", "died"):
            if row.get(k):
                d[k] = str(row[k])
        if row.get("bio") or row.get("description"):
            d["bio"] = row.get("bio") or row.get("description")
        d["roles"] = row.get("roles") or (["composer"] if "compos" in json.dumps(row).lower() else [])
        credits = (row.get("details") or {}).get("tz_credits") or row.get("tz_credits") or []
        tc = []
        for c in credits:
            if isinstance(c, str):
                tc.append({"series": "The Twilight Zone", "work": c})
                continue
            item = {"series": str(c.get("series") or "The Twilight Zone"), "work": str(c.get("work") or c.get("title") or c.get("episode") or "")}
            if c.get("role"):
                item["role"] = c["role"]
            ref = c.get("ref") or c.get("episode_id") or c.get("episode")
            if ref and ref in EPISODES:
                item["ref"] = ref
            if item["work"]:
                tc.append(item)
        if tc:
            d["tz_credits"] = tc
    elif col == "songs":
        rid = row.get("update_of") or row.get("id") or slugify(f"{row.get('artist', '')}-{row.get('title', '')}")
        d = {"title": row.get("title")}
        for k in ("artist", "album", "genre", "length"):
            if row.get(k):
                d[k] = row[k]
        if year(row.get("year")) and isinstance(year(row.get("year")), int):
            d["year"] = year(row["year"])
        conn = row.get("song_connection") or row.get("tz_connection_type")
        d["tz_connection"] = conn if conn in SONG_CONN else "unclassified"
        if row.get("lyric_excerpt"):
            d["lyric_excerpt"] = str(row["lyric_excerpt"])[:200]
        if row.get("description"):
            d["description"] = row["description"]
    else:
        col = "works"
        rid = row.get("update_of") or row.get("id") or slugify(row.get("title"))
        kind = row.get("kind") or "other"
        if kind == "collectible" and re.search(r"home-video|vhs|dvd|blu-ray|laserdisc|home-media", slugify(row.get("subtype") or "")):
            kind = "home-media"
        if kind == "artwork" and re.search(r"vintage-ad|print-ad|advert", slugify(row.get("subtype") or "")):
            kind = "advertisement"
        d = {"title": row.get("title"), "kind": kind if kind in WORK_KINDS else "other"}
        if year(row.get("year")) is not None:
            d["year"] = year(row["year"])
        for k in ("creator", "publisher", "description", "subtype"):
            if row.get(k):
                d[k] = row[k]
        det = dict(row.get("details") or {})
        if row.get("licensed") is not None:
            det["licensed"] = row["licensed"]
        if row.get("people"):
            det["people"] = row["people"]
        if det:
            d["details"] = det
    rid = slugify(rid) if "/" not in rid else rid
    if row.get("relevance") in ("core", "related", "tangential"):
        d["relevance"] = row["relevance"]
    if row.get("research_confidence") in ("high", "medium", "low"):
        d["research_confidence"] = row["research_confidence"]
    cats = list(dict.fromkeys((row.get("categories") or []) + (place({**row, "kind": d.get("kind")}) if col == "works" else [])))
    if col == "songs" and d["tz_connection"] == "theme":
        cats = cats or ["music/theme"]
    if cats:
        d["categories"] = cats
    d["sources"] = sources(row)
    m = media(row)
    if m:
        d["media"] = m
    d["last_verified"] = TODAY
    return col, rid, d


def enrich(old: dict, new: dict, col: str) -> dict:
    out = dict(old)
    spreadsheet_only = all("spreadsheet" in str(s.get("title", "")).lower() for s in old.get("sources", []))
    for k, v in new.items():
        if k in ("sources", "media", "categories", "tz_credits", "roles"):
            continue
        if k == "details":
            out["details"] = {**(old.get("details") or {}), **v}
        elif k in ("description", "bio") and old.get(k) and not spreadsheet_only:
            continue  # keep hand-written prose
        elif k in ("title", "name", "kind") and old.get(k):
            continue
        elif k == "tz_connection" and v == "unclassified" and old.get(k):
            continue
        else:
            out[k] = v
    out["sources"] = merge_list([s for s in old.get("sources", [])], new.get("sources", []), "url")
    if new.get("media"):
        out["media"] = merge_list(old.get("media") or [], new["media"], "url")
    if new.get("categories"):
        out["categories"] = list(dict.fromkeys((old.get("categories") or []) + new["categories"]))
    if new.get("tz_credits"):
        seen = {(c.get("series"), c.get("work")) for c in old.get("tz_credits") or []}
        out["tz_credits"] = (old.get("tz_credits") or []) + [c for c in new["tz_credits"] if (c["series"], c["work"]) not in seen]
    if new.get("roles"):
        out["roles"] = list(dict.fromkeys((old.get("roles") or []) + new["roles"]))
    return out


def write_yaml(path: Path, d: dict):
    path.parent.mkdir(parents=True, exist_ok=True)
    path.write_text(yaml.dump(d, Dumper=Dumper, sort_keys=False, allow_unicode=True, width=110))


def main(files: list[str]) -> int:
    overrides = yaml.safe_load(OVERRIDES.read_text()) or {}
    stats = {"new": 0, "updated": 0, "connections": 0, "skipped": 0}
    seen_ids: dict[str, dict] = {}
    for f in files:
        for n, line in enumerate(Path(f).read_text().splitlines(), 1):
            line = line.strip()
            if not line:
                continue
            try:
                row = json.loads(line)
            except json.JSONDecodeError as e:
                print(f"{f}:{n}: bad JSON ({e})", file=sys.stderr)
                stats["skipped"] += 1
                continue
            if not (row.get("title") or row.get("name")) and not row.get("update_of"):
                stats["skipped"] += 1
                continue
            col, rid, d = build(row)
            if not d.get("sources") and not row.get("update_of"):
                print(f"{f}:{n}: {rid} has no source, skipped", file=sys.stderr)
                stats["skipped"] += 1
                continue
            path = CONTENT / col / f"{rid}.yaml"
            if path.exists():
                old = yaml.safe_load(path.read_text()) or {}
                if not (d.get("title") or d.get("name")):
                    d.pop("title", None), d.pop("name", None)
                d = enrich(old, d, col)
                stats["updated"] += 1
            else:
                if not (d.get("title") or d.get("name")):
                    print(f"{f}:{n}: update_of {rid} not found, skipped", file=sys.stderr)
                    stats["skipped"] += 1
                    continue
                stats["new"] += 1
            write_yaml(path, d)
            key = f"{col}/{rid}"
            seen_ids[key] = d
            ov = {}
            if row.get("tz_connection"):
                ov["connection"] = row["tz_connection"]
            if row.get("relevance") in ("core", "related", "tangential"):
                ov["tier"] = row["relevance"]
                ov["tier_reason"] = {"core": "About The Twilight Zone itself, or officially licensed.",
                                     "related": "Tied to Rod Serling, Night Gallery or the show's makers.",
                                     "tangential": "Mentions or borrows from the show."}[row["relevance"]]
            if row.get("recommendation") in ("include", "maybe", "exclude"):
                ov["recommendation"] = row["recommendation"]
            if row.get("recommendation_reason"):
                ov["reason"] = row["recommendation_reason"]
            if ov:
                overrides[key] = {**(overrides.get(key) or {}), **ov}
            # episode connections
            for ep in row.get("episodes") or []:
                ep = str(ep).strip().lstrip("/")
                if ep.startswith("episodes/"):
                    ep = ep[len("episodes/"):]
                if ep not in EPISODES or col == "people":
                    continue
                kind = {"lyric-mention": "lyric-mention"}.get(d.get("tz_connection"), "reference")
                if col == "works" and d.get("kind") in ("game", "collectible", "artwork", "home-media", "soundtrack"):
                    kind = "homage" if "homage" in str(d.get("subtype")) else "reference"
                    if d.get("kind") in ("artwork", "soundtrack", "home-media"):
                        kind = "reference"
                cpath = CONTENT / "connections" / f"{rid}--{ep.split('/')[-1]}.yaml"
                if cpath.exists():
                    continue
                write_yaml(cpath, {"from": key, "to": ep, "kind": kind,
                                   "confidence": "documented" if d.get("sources") else "fan-noted",
                                   "summary": row.get("tz_connection") or f"{d.get('title')} draws on this episode.",
                                   "sources": d.get("sources", [])[:2], "last_verified": TODAY})
                stats["connections"] += 1
    OVERRIDES.write_text(yaml.dump(dict(sorted(overrides.items())), Dumper=Dumper, sort_keys=False, allow_unicode=True, width=110))
    print(json.dumps(stats))
    return 0


if __name__ == "__main__":
    sys.exit(main(sys.argv[1:]))
