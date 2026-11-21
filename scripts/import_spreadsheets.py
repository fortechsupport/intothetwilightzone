#!/usr/bin/env python3
"""Convert Adam's research spreadsheets into one YAML record per entry.

Usage:  python3 scripts/import_spreadsheets.py [--source data/source] [--out src/content]

Re-running is safe: generated files are overwritten, but any record whose YAML
has `locked: true` is left untouched, so hand-edited entries survive re-imports.
"""
import argparse
import datetime as dt
import re
import sys
import unicodedata
from collections import Counter, defaultdict
from pathlib import Path

import openpyxl
import yaml

SERIES_KEYS = ["1959", "1985", "2002", "2019"]


def _str_representer(dumper, value):
    # Quote number-like strings (e.g. ISBN "0886776627") so YAML 1.2 parsers keep them as strings.
    style = "'" if re.fullmatch(r"[-+0-9.eE_:xXoO]+", value) else None
    return dumper.represent_scalar("tag:yaml.org,2002:str", value, style=style)


yaml.SafeDumper.add_representer(str, _str_representer)


# ---------- helpers ----------

def slugify(text):
    text = re.sub(r"['\u2019\u2018]", "", str(text))
    text = unicodedata.normalize("NFKD", text).encode("ascii", "ignore").decode()
    text = text.lower().replace("&", " and ")
    text = re.sub(r"[^a-z0-9]+", "-", text).strip("-")
    return text or "untitled"


def clean(v):
    if v is None:
        return None
    if isinstance(v, str):
        v = re.sub(r"[\u200a\xa0 \t]+", " ", v)
        v = re.sub(r"\s+:", ":", v).strip()
        if v in ("", "N/A", "n/a", "None"):
            return None
        return v
    return v


def iso_date(v):
    v = clean(v)
    if v is None:
        return None
    if isinstance(v, (dt.datetime, dt.date)):
        return v.strftime("%Y-%m-%d")
    return str(v)


def split_names(v):
    v = clean(v)
    if not v:
        return []
    parts = re.split(r";|\n|,(?!\s*(?:Jr|Sr|II|III|IV)\b)", str(v))
    return [p.strip() for p in parts if p.strip()]


def song_length(v):
    if isinstance(v, dt.time):
        # sheet stores m:ss as h:mm
        return f"{v.hour}:{v.minute:02d}"
    return clean(v) if v is None or isinstance(v, str) else str(v)


def as_str(v):
    v = clean(v)
    if v is None:
        return None
    if isinstance(v, float) and v.is_integer():
        v = int(v)
    return str(v)


def as_int(v):
    v = clean(v)
    if v is None:
        return None
    try:
        return int(float(v))
    except (TypeError, ValueError):
        return None


def rows(path, sheet):
    ws = openpyxl.load_workbook(path, read_only=True, data_only=True)[sheet]
    it = ws.iter_rows(values_only=True)
    header = [clean(h) for h in next(it)]
    out = []
    for r in it:
        rec = {h: r[i] if i < len(r) else None for i, h in enumerate(header) if h}
        if any(clean(v) is not None for v in rec.values()):
            out.append(rec)
    return out


def drop_empty(d):
    return {k: v for k, v in d.items() if v not in (None, [], "", {})}


class Writer:
    def __init__(self, out_dir):
        self.out = Path(out_dir)
        self.counts = Counter()

    def write(self, collection, rec_id, data):
        path = self.out / collection / f"{rec_id}.yaml"
        path.parent.mkdir(parents=True, exist_ok=True)
        if path.exists():
            existing = yaml.safe_load(path.read_text()) or {}
            if existing.get("locked"):
                self.counts[collection + " (locked, kept)"] += 1
                return
        for key in ("ids", "links"):
            if isinstance(data.get(key), dict):
                data[key] = {k: as_str(v) for k, v in data[key].items() if as_str(v)}
        body = yaml.safe_dump(drop_empty(data), sort_keys=False, allow_unicode=True, width=100)
        path.write_text(body)
        self.counts[collection] += 1


def unique(slug, used):
    base, n = slug, 2
    while slug in used:
        slug = f"{base}-{n}"
        n += 1
    used.add(slug)
    return slug


IMPORT_NOTE = "Imported from Adam's research spreadsheets; not yet verified against a primary source."


def import_source():
    return [{"title": "IntoTheTwilightZone research spreadsheets", "note": IMPORT_NOTE}]


# ---------- importers ----------

def import_episodes(src, w):
    credits = rows(src / "Data_IntoTheTwilightZone.xlsx", "television")
    meta = rows(src / "db_Projects_TheTwilightZone.xlsx", "television")
    if len(credits) != len(meta):
        sys.exit(f"television sheets differ in length: {len(credits)} vs {len(meta)}")
    used = defaultdict(set)
    index = []  # (series, title, id) for connection matching
    for c, m in zip(credits, meta):
        series = as_str(m["Series"])
        title = clean(c["episode_title"]) or clean(m["Title"])
        aka = None
        for cand in (title, clean(m["Title"]) or ""):
            mm = re.search(r"\s*\(aka (.+)\)\s*$", cand)
            if mm:
                aka = mm.group(1)
        title = re.sub(r"\s*\(aka .+\)\s*$", "", title)
        slug = unique(slugify(title), used[series])
        rec_id = f"{series}/{slug}"
        imdb = clean(c["imdb_id"])
        wiki = clean(m["Wikipedia"])
        if not wiki and clean(c["wiki_part_url"]):
            wiki = "https://en.wikipedia.org/wiki/" + clean(c["wiki_part_url"])
        data = {
            "title": title,
            "aka": [aka] if aka else [],
            "series": series,
            "season": as_int(m["Season"]),
            "episode": as_str(m["Episode"]),
            "air_date": iso_date(c["episode_date"]) or iso_date(m["AirDate"]),
            "runtime_min": as_int(c["runtime"]),
            "production_code": as_str(m["ProdCode"]),
            "writers": split_names(c["written_by"]),
            "writing_credit_note": clean(m["WrittenBy"]) if m["WrittenBy"] and ":" in str(m["WrittenBy"]) else None,
            "directors": split_names(c["directed_by"]),
            "cast": split_names(c["acted_by"]),
            "narrator": clean(c["narrated_by"]),
            "ids": drop_empty({"imdb": imdb}),
            "links": drop_empty({"wikipedia": wiki, "justwatch": clean(m["JustWatch"])}),
            "sources": import_source(),
        }
        w.write("episodes", rec_id, data)
        index.append((series, title, rec_id))
        if aka:
            index.append((series, aka, rec_id))
    return index


def loose(title):
    return "-".join(w for w in slugify(title).split("-") if w not in ("a", "an", "the"))


def match_episode(index, title):
    if not title:
        return None
    # prefer the original series when titles repeat across revivals; exact slug first, then loose
    for key in (slugify, loose):
        t = key(title)
        for series in SERIES_KEYS:
            for s, et, rid in index:
                if s == series and key(et) == t:
                    return rid
    return None


def import_films(src, w, ep_index):
    a = rows(src / "Data_IntoTheTwilightZone.xlsx", "movies")
    b = rows(src / "db_Projects_TheTwilightZone.xlsx", "movies")
    by_imdb = {}
    for r in b:
        imdb = clean(r["movie_imdb_id"])
        if imdb:
            by_imdb[imdb] = r
    used, seen = set(), set()
    unmatched = []
    connections = []

    film_slug_by_imdb = {}

    def emit(title, imdb, extra, inspired):
        if imdb and imdb in film_slug_by_imdb:
            slug = film_slug_by_imdb[imdb]
            ep = match_episode(ep_index, inspired)
            if ep:
                connections.append((f"films/{slug}", ep, title, inspired))
            elif inspired:
                unmatched.append((title, inspired))
            return
        slug = unique(slugify(title), used)
        if imdb:
            film_slug_by_imdb[imdb] = slug
        data = {
            "title": title,
            "kind": "film",
            "release_date": extra.get("release_date"),
            "rating": extra.get("rating"),
            "runtime_min": extra.get("runtime"),
            "writers": extra.get("writers", []),
            "directors": extra.get("directors", []),
            "cast": extra.get("cast", []),
            "ids": drop_empty({"imdb": imdb}),
            "links": drop_empty({
                "wikipedia": extra.get("wiki"),
                "justwatch": extra.get("justwatch"),
                "trailer_youtube": extra.get("trailer"),
            }),
            "sources": import_source(),
        }
        w.write("films", slug, data)
        if inspired:
            ep = match_episode(ep_index, inspired)
            if ep:
                connections.append((f"films/{slug}", ep, title, inspired))
            else:
                unmatched.append((title, inspired))

    for r in a:
        title = clean(r["movie_title"])
        if not title:
            continue
        imdb = clean(r["imdb_id"])
        seen.add(imdb)
        extra = {
            "release_date": iso_date(r["release_date"]),
            "rating": clean(r["mpaa_rating"]),
            "runtime": as_int(r["runtime"]),
            "writers": split_names(r["written_by"]),
            "directors": split_names(r["directed_by"]),
            "cast": split_names(r["acted_by"]),
            "wiki": ("https://en.wikipedia.org/wiki/" + clean(r["wiki_part_url"])) if clean(r["wiki_part_url"]) else None,
            "trailer": clean(r["trailer_id"]),
            "justwatch": clean(r["justwatch_url"]),
        }
        inspired = clean(r["inspired_by_episode"])
        if imdb in by_imdb:
            o = by_imdb[imdb]
            extra["trailer"] = extra["trailer"] or clean(o["trailer_yt_id"])
            inspired = inspired or clean(o["episode_title"])
        emit(title, imdb, extra, inspired)
    for imdb, r in by_imdb.items():
        if imdb in seen:
            continue
        emit(clean(r["movie_title"]), imdb, {"trailer": clean(r["trailer_yt_id"])}, clean(r["episode_title"]))
    return connections, unmatched


def import_connections(w, film_links):
    used = set()
    for work, ep, title, ep_title in film_links:
        slug = unique(slugify(f"{work.split('/')[1]}--{ep.split('/')[1]}"), used)
        w.write("connections", slug, {
            "from": work,
            "to": ep,
            "kind": "inspired-by",
            "confidence": "fan-noted",
            "summary": f"{title} is listed in Adam's research as inspired by \"{ep_title}\".",
            "sources": import_source(),
        })


def import_songs(src, w):
    cat = {"Theme": "theme", "Mentioned": "lyric-mention", "References": "reference"}
    used = set()
    for r in rows(src / "_IntoTheTwilightZone.xlsx", "songs"):
        title, artist = as_str(r["Song"]), as_str(r["Artist"])
        if not title:
            continue
        slug = unique(slugify(f"{artist or 'unknown'}-{title}"), used)
        w.write("songs", slug, {
            "title": title,
            "artist": artist,
            "album": as_str(r["Album"]),
            "genre": as_str(r["Genre"]),
            "length": song_length(r["Length"]),
            "year": as_int(r["Year"]),
            "tz_connection": cat.get(clean(r["Category"]), "unclassified"),
            "ids": drop_empty({"amazon_asin": clean(r["AudioURL"])}),
            "links": drop_empty({
                "lyrics": clean(r["LyricsURL"]),
                "youtube": clean(r["VideoURL"]),
            }),
            "sources": import_source(),
        })


def import_books(src, w):
    used = set()
    for r in rows(src / "_IntoTheTwilightZone.xlsx", "books"):
        title = as_str(r["book_title"])
        if not title:
            continue
        slug = unique(slugify(title), used)
        w.write("books", slug, {
            "title": title,
            "authors": [a.strip() for a in re.split(r",|;", clean(r["authored_by"]) or "") if a.strip()],
            "publisher": clean(r["published_by"]),
            "published": iso_date(r["pub_date"]),
            "pages": as_int(r["pages"]),
            "ids": drop_empty({
                "goodreads": as_str(r["goodreads_id"]),
                "amazon_asin": clean(r["pb_asin"]) or clean(r["hc_asin"]) or clean(r["kd_asin"]),
            }),
            "sources": import_source(),
        })


def import_comics(src, w):
    used = set()
    for r in rows(src / "_IntoTheTwilightZone.xlsx", "comics"):
        title = clean(r["issue_name"])
        if not title:
            continue
        slug = unique(slugify(title), used)
        w.write("comics", slug, {
            "title": title,
            "series_name": clean(r["comic_name"]),
            "publisher": clean(r["publisher_name"]),
            "cover_date": as_str(r["issue_date"]) if not isinstance(r["issue_date"], dt.datetime) else iso_date(r["issue_date"]),
            "order": as_int(r["order"]),
            "links": drop_empty({"info": clean(r["info_url"])}),
            "ids": drop_empty({"amazon_asin": clean(r["pb_asin"]) or clean(r["kd_asin"])}),
            "sources": import_source(),
        })


def import_magazines(src, w):
    used = set()
    for i, r in enumerate(rows(src / "_IntoTheTwilightZone.xlsx", "magazines")):
        title = clean(r["title"])
        if not title:
            continue
        slug = unique(slugify(title), used)
        w.write("magazines", slug, {
            "title": title,
            "magazine": clean(r["magazine"]),
            "cover_date": as_str(r["published_date"]) if not isinstance(r["published_date"], dt.datetime) else iso_date(r["published_date"]),
            "order": i + 1,
            "publisher": clean(r["publisher"]),
            "editor": clean(r["editor"]),
            # archive.org scan links are intentionally not imported (see Sources policy)
            "links": drop_empty({"isfdb": clean(r["info_url"])}),
            "sources": import_source(),
        })


def import_radio(src, w, ep_index):
    used = set()
    links = []
    for r in rows(src / "_IntoTheTwilightZone.xlsx", "radio"):
        title = clean(r["episode_title"])
        if not title:
            continue
        slug = unique(slugify(title), used)
        tv = match_episode([x for x in ep_index if x[0] == "1959"], title)
        w.write("radio", slug, {
            "title": title,
            "series_title": clean(r["series_title"]),
            "season": as_int(r["season"]),
            "season_order": as_int(r["ssn_order"]),
            "volume": as_int(r["volume"]),
            "volume_order": as_int(r["vol_order"]),
            "volume_released": as_str(r["vol_released"]),
            "original_writer": clean(r["written_by"]),
            "adapted_by": clean(r["adapted_by"]),
            "voiced_by": [v.strip() for v in re.split(r";| and |,", clean(r["voiced_by"]) or "") if v.strip()],
            "adapts_episode": tv,
            "ids": drop_empty({"imdb": clean(r["imdb_id"]), "audible_asin": clean(r["audible_asin"])}),
            "sources": import_source(),
        })
        if tv:
            links.append(slug)
    return len(links)


def import_podcasts(src, w):
    used = set()
    for r in rows(src / "db_Projects_TheTwilightZone.xlsx", "podcasts"):
        title = clean(r["title"])
        if not title:
            continue
        slug = unique(slugify(title), used)
        yt = clean(r["youtube_id"])
        w.write("podcasts", slug, {
            "title": title,
            "hosts": [h.strip() for h in re.split(r",|;| and ", clean(r["hosts"]) or "") if h.strip()],
            "first_episode": iso_date(r["ep1_date"]),
            "links": drop_empty({
                "podchaser": clean(r["podchaser_url"]),
                "rss": clean(r["rss_url"]),
                "youtube": (f"https://www.youtube.com/playlist?list={yt}" if yt and yt.startswith("PL")
                            else f"https://www.youtube.com/channel/{yt}" if yt and yt.startswith("UC") else None),
            }),
            "sources": import_source(),
        })


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("--source", default="data/source")
    ap.add_argument("--out", default="src/content")
    args = ap.parse_args()
    src = Path(args.source)
    w = Writer(args.out)
    ep_index = import_episodes(src, w)
    film_links, unmatched = import_films(src, w, ep_index)
    import_connections(w, film_links)
    radio_linked = import_radio(src, w, ep_index)
    import_songs(src, w)
    import_books(src, w)
    import_comics(src, w)
    import_magazines(src, w)
    import_podcasts(src, w)
    for k, v in sorted(w.counts.items()):
        print(f"{k:28} {v}")
    print(f"radio episodes linked to a 1959 TV episode: {radio_linked}")
    if unmatched:
        print("films whose 'inspired by' episode title did not match:")
        for t, e in unmatched:
            print(f"  {t}  <-  {e}")


if __name__ == "__main__":
    main()
