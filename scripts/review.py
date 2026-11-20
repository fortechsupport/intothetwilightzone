#!/usr/bin/env python3
"""Review workflow for IntoTheTwilightZone.com: decide record by record what the public site shows.

Decisions live in data/review/decisions.json, keyed "<collection>/<id>". No entry means pending.

  python3 scripts/review.py export [--out DIR]     write review-queue.xlsx and review-queue.csv
  python3 scripts/review.py import FILE [FILE...]  read decisions from a marked-up .xlsx or .csv
  python3 scripts/review.py status                 counts per category, and decisions for missing records

Import reads the "Key" (or "key") column and the "Decision" column, plus "Notes" when present.
Decision accepts include/exclude/pending and the shortcuts y/yes/i/+ and n/no/x/-.
A blank Decision cell leaves that record as it was. Rows are matched by key, never by position,
so the sheet can be sorted, filtered or trimmed freely.

Needs PyYAML and openpyxl (pip install pyyaml openpyxl).
"""
from __future__ import annotations

import argparse
import csv
import datetime as dt
import json
import re
import sys
import unicodedata
from pathlib import Path

import yaml

ROOT = Path(__file__).resolve().parent.parent
CONTENT = ROOT / "src" / "content"
LEDGER = ROOT / "data" / "review" / "decisions.json"
STATUSES = ("pending", "include", "exclude")
SHORTCUTS = {
    "y": "include", "yes": "include", "i": "include", "in": "include", "+": "include", "included": "include",
    "n": "exclude", "no": "exclude", "x": "exclude", "out": "exclude", "-": "exclude", "excluded": "exclude",
    "p": "pending", "?": "pending",
}

# Keep in step with src/lib/review-queue.ts.
CATEGORY_LABELS = {
    "series": "Series",
    "episodes": "TV episodes",
    "films": "Films and other screen works",
    "connections": "Influence links",
    "people": "People",
    "characters": "Characters",
    "quotes": "Quotes",
    "locations": "Places",
    "songs": "Songs",
    "radio": "Radio dramas",
    "podcasts": "Podcasts",
    "books": "Books",
    "comics": "Comics",
    "magazines": "Magazines",
    "essays": "Essays and articles",
    "archives": "Archives",
    "organizations": "Organizations",
    "works": "Games, merchandise and other works",
}
KIND = ["kind", "tz_connection", "series_title", "series_name", "magazine"]
DATE = ["air_date", "release_date", "published", "cover_date", "year", "volume_released", "first_episode",
        "date", "born", "opened", "dates", "years"]
WHO = ["artist", "authors", "creators", "creator", "writers", "hosts", "original_writer", "publisher",
       "institution", "person", "roles"]
SUMMARY = ["description", "summary", "synopsis", "bio", "evidence", "notes", "context", "text", "lyric_excerpt"]

COLUMNS = [
    # header, key in row dict, width, wrap
    ("Decision", "decision", 11, False),
    ("Notes", "notes", 26, False),
    ("Category", "category", 16, False),
    ("Subcategory", "subcategory", 22, False),
    ("Group", "group", 20, False),
    ("New category?", "is_new", 12, False),
    ("Official?", "official", 12, False),
    ("Also listed in", "also_in", 30, True),
    ("Title", "title", 38, True),
    ("Connection to TZ", "connection", 62, True),
    ("Tier", "tier", 11, False),
    ("Why this tier", "tier_reason", 34, False),
    ("Recommendation", "recommendation", 15, False),
    ("Why", "reason", 48, True),
    ("Source", "source_title", 30, False),
    ("Source link", "source_url", 30, False),
    ("Date", "date", 11, False),
    ("Who", "who", 22, False),
    ("Description", "summary", 60, False),
    ("Research confidence", "confidence", 12, False),
    ("Tags", "tags", 14, False),
    ("Duplicate of", "duplicate_of", 18, False),
    ("Page", "page", 28, False),
    ("Reviewed", "reviewed", 11, False),
    ("Key", "key", 36, False),
]
ASSESSMENTS = ROOT / "data" / "review" / "assessments.json"
TAXONOMY = ROOT / "data" / "review" / "taxonomy.json"


def load_taxonomy() -> dict:
    """Each record's places in the site's category structure (scripts/taxonomy-export.mjs)."""
    import subprocess
    try:
        subprocess.run(["node", str(ROOT / "scripts" / "taxonomy-export.mjs")], check=True, cwd=ROOT)
    except (OSError, subprocess.CalledProcessError) as e:  # fall back to the last export
        print(f"taxonomy export skipped: {e}", file=sys.stderr)
    try:
        return json.loads(TAXONOMY.read_text(encoding="utf-8"))
    except (OSError, ValueError):
        return {}


def slugify(text: str) -> str:
    text = re.sub(r"['’‘]", "", text)
    text = unicodedata.normalize("NFKD", text)
    text = "".join(c for c in text if not unicodedata.combining(c)).lower().replace("&", " and ")
    return re.sub(r"[^a-z0-9]+", "-", text).strip("-") or "untitled"


def first(d: dict, fields: list[str]):
    for f in fields:
        v = d.get(f)
        if v not in (None, "", []):
            return v
    return None


def text(v) -> str:
    if v is None:
        return ""
    if isinstance(v, list):
        return ", ".join(str(x) for x in v)
    return str(v)


def page_url(collection: str, rid: str, d: dict) -> str:
    if collection == "episodes":
        return f"/episodes/{rid}/"
    if collection in ("films", "works", "series"):
        return f"/{collection}/{rid}/"
    if collection == "locations":
        return f"/places/{rid}/"
    if collection == "people":
        return f"/people/{slugify(str(d.get('name') or rid))}/"
    if collection == "connections":
        return "/homages/"
    if collection in ("books", "comics", "magazines", "podcasts", "radio", "songs", "essays", "archives", "quotes", "characters", "organizations"):
        return f"/{collection}/{rid}/"
    return ""


def title_of(collection: str, rid: str, d: dict) -> str:
    if collection == "quotes":
        t = str(d.get("text") or "")
        return f'{d.get("person")}: "{t[:80]}{"…" if len(t) > 80 else ""}"'
    if collection == "connections":
        return f"{d.get('from')} → {d.get('to')}"
    if collection == "episodes":
        return f"{d.get('title')} ({d.get('series')}, S{d.get('season')}E{d.get('episode')})"
    return str(d.get("title") or d.get("name") or rid)


def load_ledger() -> dict:
    if not LEDGER.exists():
        return {}
    return json.loads(LEDGER.read_text(encoding="utf-8"))


def save_ledger(ledger: dict) -> None:
    LEDGER.parent.mkdir(parents=True, exist_ok=True)
    clean = {k: {f: v for f, v in ledger[k].items() if v not in (None, "")} for k in sorted(ledger)}
    LEDGER.write_text(json.dumps(clean, indent=1, ensure_ascii=False) + "\n", encoding="utf-8")


def records(content: Path = CONTENT):
    """Yield (collection, id, data) for every YAML record."""
    for cdir in sorted(p for p in content.iterdir() if p.is_dir()):
        for f in sorted(cdir.rglob("*.yaml")):
            rid = f.relative_to(cdir).with_suffix("").as_posix()
            data = yaml.safe_load(f.read_text(encoding="utf-8")) or {}
            yield cdir.name, rid, data


def load_assessments() -> dict:
    """Run scripts/assess.py so the explanations match the content, then read them."""
    import subprocess
    subprocess.run([sys.executable, str(ROOT / "scripts" / "assess.py")], check=True, cwd=ROOT, stdout=subprocess.DEVNULL)
    return json.loads(ASSESSMENTS.read_text(encoding="utf-8"))


EPISODE_ORDER = {"Original series": 0, "1985 revival": 1, "2002 revival": 2, "2019 revival": 3}


def sub_rank(sub: str) -> tuple:
    for k, v in EPISODE_ORDER.items():
        if sub.startswith(k):
            return (0, v, "")
    if re.match(r"(?i)^(other|connection not yet confirmed|fellow anthology)", sub):
        return (2, 0, sub.lower())
    return (1, 0, sub.lower())


def queue(content: Path = CONTENT) -> list[dict]:
    ledger = load_ledger()
    assess = load_assessments()
    tax = load_taxonomy()
    rows = []
    for collection, rid, d in records(content):
        key = f"{collection}/{rid}"
        dec = ledger.get(key, {})
        a = assess.get(key, {})
        places = tax.get(key) or []
        p0 = places[0] if places else {}
        rows.append({
            "key": key,
            "collection": collection,
            "category": p0.get("catTitle") or CATEGORY_LABELS.get(collection, collection),
            "subcategory": p0.get("subTitle") or a.get("subcategory", ""),
            "group": p0.get("group") or "",
            "is_new": "new" if p0.get("isNew") else "",
            "official": {True: "official", False: "unofficial"}.get(p0.get("official"), ""),
            "also_in": "; ".join(f"{p['catTitle']}: {p['subTitle']}" for p in places[1:]),
            "title": a.get("title") or title_of(collection, rid, d),
            "sort": a.get("sort", ""),
            "connection": a.get("connection", ""),
            "tier": a.get("tier", ""),
            "tier_reason": a.get("tier_reason", ""),
            "recommendation": a.get("recommendation", ""),
            "reason": a.get("reason", ""),
            "source_title": a.get("source_title", ""),
            "source_url": a.get("source_url", ""),
            "kind": text(first(d, KIND)),
            "date": text(first(d, DATE)),
            "who": text(first(d, WHO)),
            "summary": text(first(d, SUMMARY)),
            "relevance": text(d.get("relevance")),
            "confidence": text(d.get("confidence") or d.get("research_confidence")),
            "tags": text(d.get("tags")),
            "duplicate_of": text(d.get("duplicate_of")),
            "sources": len(d.get("sources") or []),
            "page": page_url(collection, rid, d),
            "decision": dec.get("status", "pending"),
            "notes": dec.get("notes", ""),
            "reviewed": dec.get("date", ""),
        })
    # Grouped by category (alphabetical), then subcategory, then title ignoring a leading The/A/An.
    rows.sort(key=lambda r: (r["category"].lower(), sub_rank(r["subcategory"]), sub_rank(r["group"]), r["sort"], natural(r["key"])))
    return rows


def natural(s: str):
    return [int(t) if t.isdigit() else t for t in re.split(r"(\d+)", s)]


def export(out: Path, base_url: str) -> None:
    from openpyxl import Workbook
    from openpyxl.formatting.rule import FormulaRule
    from openpyxl.styles import Alignment, Border, Font, PatternFill, Side
    from openpyxl.utils import get_column_letter
    from openpyxl.worksheet.datavalidation import DataValidation

    rows = queue()
    out.mkdir(parents=True, exist_ok=True)
    stamp = dt.date.today().isoformat()
    letter = {k: get_column_letter(i) for i, (_, k, _, _) in enumerate(COLUMNS, start=1)}

    wb = Workbook()
    ws = wb.active
    ws.title = "Review"
    ws.append([c[0] for c in COLUMNS])
    first_row: dict[str, int] = {}
    for r in rows:
        values = []
        for _, k, _, _ in COLUMNS:
            v = r[k]
            if k == "summary" and len(v) > 600:
                v = v[:600] + "\u2026"
            if k == "page" and v and base_url:
                v = base_url.rstrip("/") + v
            values.append(v)
        ws.append(values)
        first_row.setdefault(r["category"], ws.max_row)

    white_bold = Font(bold=True, color="FFFFFF")
    head = PatternFill("solid", fgColor="1F2A44")
    thin = Side(style="thin", color="C9CED8")
    for i, (_, k, width, _) in enumerate(COLUMNS, start=1):
        cell = ws.cell(row=1, column=i)
        cell.font, cell.fill = white_bold, head
        cell.alignment = Alignment(vertical="center", wrap_text=True)
        ws.column_dimensions[cell.column_letter].width = width
    ws.row_dimensions[1].height = 30
    wrap_cols = {letter[k] for _, k, _, w in COLUMNS if w}
    band = [PatternFill("solid", fgColor="EEF1F6"), PatternFill("solid", fgColor="FFFFFF")]
    group, prev = 0, None
    for row in ws.iter_rows(min_row=2):
        cat = row[2].value
        if cat != prev:
            group, prev = group + 1, cat
            for cell in row:
                cell.border = Border(top=Side(style="medium", color="1F2A44"))
        for cell in row:
            cell.alignment = Alignment(vertical="top", wrap_text=cell.column_letter in wrap_cols)
        for k in ("category", "subcategory"):
            c = row[list(letter).index(k)]
            c.fill = band[group % 2]
            c.font = Font(bold=(k == "category"))
        row[list(letter).index("title")].font = Font(bold=True)
    last = ws.max_row
    ws.freeze_panes = "F2"  # header row plus Decision..Title stay visible while scrolling
    ws.auto_filter.ref = f"A1:{get_column_letter(len(COLUMNS))}{last}"
    for col, choices in (("decision", "pending,include,exclude"),):
        dv = DataValidation(type="list", formula1=f'"{choices}"', allow_blank=True, showErrorMessage=False)
        dv.add(f"{letter[col]}2:{letter[col]}{max(last, 2)}")
        ws.add_data_validation(dv)
    rng = lambda k: f"{letter[k]}2:{letter[k]}{max(last, 2)}"
    for k, word, color in (("decision", "include", "D8EED8"), ("decision", "exclude", "F4D6D6"),
                           ("recommendation", "include", "D8EED8"), ("recommendation", "maybe", "FFF1C2"), ("recommendation", "exclude", "F4D6D6"),
                           ("tier", "core", "DCE6F7"), ("tier", "related", "E9E2F5"), ("tier", "tangential", "F2F2F2")):
        ws.conditional_formatting.add(rng(k), FormulaRule(formula=[f'${letter[k]}2="{word}"'], fill=PatternFill("solid", fgColor=color)))
    link_font = Font(color="1F5FAD", underline="single")
    src_col, url_col, page_col = list(letter).index("source_title"), list(letter).index("source_url"), list(letter).index("page")
    for row in ws.iter_rows(min_row=2):
        url = row[url_col].value
        if url and str(url).startswith("http"):
            row[src_col].hyperlink = str(url)
            row[src_col].font = link_font
            row[url_col].hyperlink = str(url)
            row[url_col].font = link_font
        pv = row[page_col].value
        if pv and str(pv).startswith("http"):
            row[page_col].hyperlink = str(pv)
            row[page_col].font = link_font

    summary = wb.create_sheet("Summary")
    summary.append(["Category (click to jump)", "Records", "Recommended include", "Recommended maybe", "Recommended exclude",
                    "Core", "Related", "Tangential", "Decided include", "Decided exclude", "Still pending"])
    for c in summary[1]:
        c.font, c.fill = white_bold, head
        c.alignment = Alignment(wrap_text=True, vertical="center")
    by_cat: dict[str, list[dict]] = {}
    for r in rows:
        by_cat.setdefault(r["category"], []).append(r)
    cnt = lambda rs, f, v: sum(1 for r in rs if r[f] == v)
    for cat, rs in by_cat.items():
        summary.append([cat, len(rs), cnt(rs, "recommendation", "include"), cnt(rs, "recommendation", "maybe"), cnt(rs, "recommendation", "exclude"),
                        cnt(rs, "tier", "core"), cnt(rs, "tier", "related"), cnt(rs, "tier", "tangential"),
                        cnt(rs, "decision", "include"), cnt(rs, "decision", "exclude"), cnt(rs, "decision", "pending")])
        cell = summary.cell(row=summary.max_row, column=1)
        cell.hyperlink = f"#Review!A{first_row[cat]}"
        cell.font = link_font
    summary.append(["All", len(rows), cnt(rows, "recommendation", "include"), cnt(rows, "recommendation", "maybe"), cnt(rows, "recommendation", "exclude"),
                    cnt(rows, "tier", "core"), cnt(rows, "tier", "related"), cnt(rows, "tier", "tangential"),
                    cnt(rows, "decision", "include"), cnt(rows, "decision", "exclude"), cnt(rows, "decision", "pending")])
    for c in summary[summary.max_row]:
        c.font = Font(bold=True)
    summary.column_dimensions["A"].width = 38
    for col in "BCDEFGHIJK":
        summary.column_dimensions[col].width = 13
    summary.row_dimensions[1].height = 32
    summary.freeze_panes = "B2"

    help_ws = wb.create_sheet("How to use")
    for line in [
        "How to review",
        "",
        "Every row is one record. Rows are grouped by category (A to Z), then subcategory (A to Z, with catch-all and unconfirmed groups last; TV episodes by series), then sorted alphabetically by title (a leading The, A or An is ignored).",
        "Categories follow your list, reorganized on your category-versus-content rule: three sections (People, Places, Organizations), then the categories (Artwork, Episodes, Events, Games, Homages, Lectures, Merchandise, Movies, Music, Reading, Reviews, Series, and the new Stage and attractions). Records whose Category says Content (shown on other records) are advertisements, archival holdings, quotes and links: they appear on the pages named in Group (On: ...) and in the Media library, not as category entries.",
        "New category? says new when the category or subcategory was added during research; drop any you do not want. Official? says official (made, broadcast, licensed or published by the franchise or by Rod Serling) or unofficial (made by others about or inspired by the show), in the categories that split that way. Also listed in shows the record's other places on the site.",
        "Read three columns to decide: Connection to TZ (how it relates to the show), Tier (how close it is) and Recommendation with Why (what I suggest and the reason).",
        "Source / Source link is the best independent evidence for the connection. Page opens the record on the preview site.",
        "",
        "1. Set Decision to include or exclude (or type y / n). Leave pending to decide later.",
        "2. Add anything you want remembered in Notes, for example why something is out or what to fix.",
        "3. Sort and filter freely (the header row has filters; Summary links jump to each category). Rows are matched by the Key column, so do not edit Key.",
        "4. You can delete rows you have not touched. A blank Decision cell leaves that record unchanged.",
        "5. Save the file (xlsx or csv) and hand it back. It is imported with: python3 scripts/review.py import FILE",
        "",
        "Tiers",
        "core: part of The Twilight Zone itself (the four series, their episodes, official films, licensed radio, comics, magazines and merchandise) or wholly about it.",
        "related: one step away: Rod Serling's other work, Night Gallery, the show's writers, or a work that adapts or is documented as drawing on a specific episode.",
        "tangential: only touches the show: a passing mention, homage, parody, borrowed title, fellow anthology or unconfirmed resemblance.",
        "",
        "Recommendations",
        "include: belongs on the site; the Why column says what it adds.",
        "maybe: a real but weak or unverified tie; your call, and Why says what is uncertain.",
        "exclude: duplicate, loose resemblance or no evident connection; kept in the data so nothing is lost.",
        "",
        "The public site shows only records you mark include. Preview builds show everything not excluded.",
        f"Generated {stamp} from {len(rows)} records.",
    ]:
        help_ws.append([line])
    help_ws.column_dimensions["A"].width = 150
    help_ws["A1"].font = Font(bold=True, size=14)
    for r in (13, 18):
        help_ws[f"A{r}"].font = Font(bold=True)
    wb.move_sheet("How to use", offset=-2)
    wb.active = 1

    xlsx = out / "review-queue.xlsx"
    wb.save(xlsx)
    with open(out / "review-queue.csv", "w", newline="", encoding="utf-8-sig") as fh:
        w = csv.writer(fh)
        w.writerow([c[0] for c in COLUMNS])
        for r in rows:
            w.writerow([r[k] for _, k, _, _ in COLUMNS])
    print(f"Wrote {xlsx} and review-queue.csv: {len(rows)} records "
          + ", ".join(f"{sum(1 for r in rows if r['decision'] == s)} {s}" for s in STATUSES))


def read_table(path: Path) -> list[dict]:
    if path.suffix.lower() in (".xlsx", ".xlsm"):
        from openpyxl import load_workbook
        wb = load_workbook(path, read_only=True, data_only=True)
        ws = wb["Review"] if "Review" in wb.sheetnames else wb.worksheets[0]
        it = ws.iter_rows(values_only=True)
        header = [str(h or "").strip() for h in next(it)]
        return [dict(zip(header, row)) for row in it]
    with open(path, newline="", encoding="utf-8-sig") as fh:
        return list(csv.DictReader(fh))


def col(row: dict, *names: str):
    low = {str(k).strip().lower(): v for k, v in row.items() if k is not None}
    for n in names:
        if n in low:
            return low[n]
    return None


def import_files(paths: list[Path], dry_run: bool) -> int:
    ledger = load_ledger()
    known = {f"{c}/{i}" for c, i, _ in records()}
    today = dt.date.today().isoformat()
    changed = unknown = bad = 0
    tally = {s: 0 for s in STATUSES}
    for path in paths:
        for n, row in enumerate(read_table(path), start=2):
            key = str(col(row, "key") or "").strip()
            raw = str(col(row, "decision", "status") or "").strip().lower()
            if not key and not raw:
                continue
            if not key:
                print(f"{path.name} row {n}: no Key, skipped", file=sys.stderr)
                bad += 1
                continue
            if not raw:
                continue
            status = SHORTCUTS.get(raw, raw)
            if status not in STATUSES:
                print(f"{path.name} row {n} ({key}): decision '{raw}' not understood, skipped", file=sys.stderr)
                bad += 1
                continue
            if key not in known:
                print(f"{path.name} row {n}: no record called {key}, skipped", file=sys.stderr)
                unknown += 1
                continue
            notes_raw = col(row, "notes")
            old = ledger.get(key, {"status": "pending"})
            notes = old.get("notes", "") if notes_raw is None else str(notes_raw).strip()
            if status == "pending" and not notes:
                if key in ledger:
                    del ledger[key]
                    changed += 1
                    tally[status] += 1
                continue
            if old.get("status") == status and old.get("notes", "") == notes:
                continue
            ledger[key] = {"status": status, "notes": notes, "date": today}
            changed += 1
            tally[status] += 1
    if not dry_run:
        save_ledger(ledger)
    print(f"{'Would change' if dry_run else 'Changed'} {changed} records: "
          + ", ".join(f"{v} {k}" for k, v in tally.items())
          + (f"; {unknown} unknown keys" if unknown else "") + (f"; {bad} rows skipped" if bad else ""))
    return 1 if (unknown or bad) else 0


def status() -> int:
    rows = queue()
    known = {r["key"] for r in rows}
    by_cat: dict[str, dict[str, int]] = {}
    for r in rows:
        c = by_cat.setdefault(r["category"], {s: 0 for s in STATUSES})
        c[r["decision"]] += 1
    print(f"{'Category':36} {'pending':>8} {'include':>8} {'exclude':>8}")
    for cat, c in by_cat.items():
        print(f"{cat:36} {c['pending']:>8} {c['include']:>8} {c['exclude']:>8}")
    tot = {s: sum(c[s] for c in by_cat.values()) for s in STATUSES}
    print(f"{'All ' + str(len(rows)) + ' records':36} {tot['pending']:>8} {tot['include']:>8} {tot['exclude']:>8}")
    orphans = sorted(k for k in load_ledger() if k not in known)
    if orphans:
        print(f"\n{len(orphans)} decisions point at records that no longer exist (renamed or removed):")
        for k in orphans:
            print("  " + k)
        return 1
    return 0


def main() -> int:
    ap = argparse.ArgumentParser(description=__doc__, formatter_class=argparse.RawDescriptionHelpFormatter)
    sub = ap.add_subparsers(dest="cmd", required=True)
    e = sub.add_parser("export", help="write the review spreadsheet")
    e.add_argument("--out", type=Path, default=ROOT / "review")
    e.add_argument("--base-url", default="", help="prefix for the Page column, e.g. a preview deploy URL")
    i = sub.add_parser("import", help="read decisions from a marked-up spreadsheet or CSV")
    i.add_argument("files", nargs="+", type=Path)
    i.add_argument("--dry-run", action="store_true")
    sub.add_parser("status", help="show review progress")
    a = ap.parse_args()
    if a.cmd == "export":
        export(a.out, a.base_url)
        return 0
    if a.cmd == "import":
        return import_files(a.files, a.dry_run)
    return status()


if __name__ == "__main__":
    sys.exit(main())
