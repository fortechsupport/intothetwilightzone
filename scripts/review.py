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
    "works": "Games, merchandise and other works",
}
KIND = ["kind", "tz_connection", "series_title", "series_name", "magazine"]
DATE = ["air_date", "release_date", "published", "cover_date", "year", "volume_released", "first_episode",
        "date", "born", "opened", "dates", "years"]
WHO = ["artist", "authors", "creators", "creator", "writers", "hosts", "original_writer", "publisher",
       "institution", "person", "roles"]
SUMMARY = ["description", "summary", "synopsis", "bio", "evidence", "notes", "context", "text", "lyric_excerpt"]

COLUMNS = [
    # header, key in row dict, width
    ("Decision", "decision", 11),
    ("Notes", "notes", 30),
    ("Category", "category", 18),
    ("Title", "title", 44),
    ("Kind", "kind", 16),
    ("Date", "date", 11),
    ("Who", "who", 24),
    ("Relevance", "relevance", 11),
    ("Confidence", "confidence", 12),
    ("Tags", "tags", 16),
    ("Duplicate of", "duplicate_of", 18),
    ("Summary", "summary", 60),
    ("Sources", "sources", 10),
    ("First source", "source_url", 30),
    ("Page", "page", 30),
    ("Reviewed", "reviewed", 11),
    ("Key", "key", 40),
]


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
    if collection == "quotes":
        return f"/voices/#{rid}"
    if collection == "connections":
        return "/influence/"
    if collection in ("books", "comics", "magazines", "podcasts", "radio", "songs", "essays", "archives"):
        return f"/{collection}/#{rid}"
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


def queue(content: Path = CONTENT) -> list[dict]:
    ledger = load_ledger()
    order = list(CATEGORY_LABELS)
    rows = []
    for collection, rid, d in records(content):
        key = f"{collection}/{rid}"
        dec = ledger.get(key, {})
        sources = d.get("sources") or []
        rows.append({
            "key": key,
            "collection": collection,
            "category": CATEGORY_LABELS.get(collection, collection),
            "title": title_of(collection, rid, d),
            "kind": text(first(d, KIND)),
            "date": text(first(d, DATE)),
            "who": text(first(d, WHO)),
            "summary": text(first(d, SUMMARY)),
            "relevance": text(d.get("relevance")),
            "confidence": text(d.get("confidence") or d.get("research_confidence")),
            "tags": text(d.get("tags")),
            "duplicate_of": text(d.get("duplicate_of")),
            "sources": len(sources),
            "source_url": next((s.get("url") for s in sources if isinstance(s, dict) and s.get("url")), ""),
            "page": page_url(collection, rid, d),
            "decision": dec.get("status", "pending"),
            "notes": dec.get("notes", ""),
            "reviewed": dec.get("date", ""),
        })
    rank = lambda c: order.index(c) if c in order else len(order)
    rows.sort(key=lambda r: (rank(r["collection"]), r["collection"], natural(r["key"])))
    return rows


def natural(s: str):
    return [int(t) if t.isdigit() else t for t in re.split(r"(\d+)", s)]


def export(out: Path, base_url: str) -> None:
    from openpyxl import Workbook
    from openpyxl.formatting.rule import FormulaRule
    from openpyxl.styles import Alignment, Font, PatternFill
    from openpyxl.worksheet.datavalidation import DataValidation

    rows = queue()
    out.mkdir(parents=True, exist_ok=True)
    stamp = dt.date.today().isoformat()

    wb = Workbook()
    ws = wb.active
    ws.title = "Review"
    ws.append([c[0] for c in COLUMNS])
    for r in rows:
        values = []
        for _, k, _ in COLUMNS:
            v = r[k]
            if k == "summary" and len(v) > 500:
                v = v[:500] + "…"
            if k == "page" and v and base_url:
                v = base_url.rstrip("/") + v
            values.append(v)
        ws.append(values)
    bold = Font(bold=True, color="FFFFFF")
    head = PatternFill("solid", fgColor="1F2A44")
    for i, (_, k, width) in enumerate(COLUMNS, start=1):
        cell = ws.cell(row=1, column=i)
        cell.font, cell.fill = bold, head
        ws.column_dimensions[cell.column_letter].width = width
    for row in ws.iter_rows(min_row=2):
        for cell in row:
            cell.alignment = Alignment(vertical="top", wrap_text=cell.column_letter in ("B", "D", "L"))
    last = ws.max_row
    ws.freeze_panes = "C2"
    ws.auto_filter.ref = f"A1:{ws.cell(row=1, column=len(COLUMNS)).column_letter}{last}"
    dv = DataValidation(type="list", formula1='"pending,include,exclude"', allow_blank=True,
                        showErrorMessage=False)
    dv.add(f"A2:A{max(last, 2)}")
    ws.add_data_validation(dv)
    for word, color in (("include", "D8EED8"), ("exclude", "F4D6D6")):
        ws.conditional_formatting.add(f"A2:A{max(last, 2)}", FormulaRule(formula=[f'$A2="{word}"'],
                                      fill=PatternFill("solid", fgColor=color)))
    for col in ("N", "O"):
        for cell in ws[col][1:]:
            if cell.value and str(cell.value).startswith("http"):
                cell.hyperlink = str(cell.value)
                cell.font = Font(color="1F5FAD", underline="single")

    summary = wb.create_sheet("Summary")
    summary.append(["Category", "Records", "Pending", "Include", "Exclude"])
    for c in summary[1]:
        c.font, c.fill = bold, head
    by_cat: dict[str, list[dict]] = {}
    for r in rows:
        by_cat.setdefault(r["category"], []).append(r)
    for cat, rs in by_cat.items():
        summary.append([cat, len(rs)] + [sum(1 for r in rs if r["decision"] == s) for s in STATUSES])
    summary.append(["All", len(rows)] + [sum(1 for r in rows if r["decision"] == s) for s in STATUSES])
    summary.column_dimensions["A"].width = 36
    help_ws = wb.create_sheet("How to use")
    for line in [
        "How to review",
        "",
        "1. On the Review sheet, set Decision to include or exclude (or type y / n). Leave pending to decide later.",
        "2. Add anything you want remembered in Notes, for example why something is out or what to fix.",
        "3. Sort and filter as you like: rows are matched by the Key column, so do not edit Key.",
        "4. You can delete rows you have not touched. A blank Decision cell leaves that record unchanged.",
        "5. Save the file (xlsx or csv) and hand it back. It is imported with: python3 scripts/review.py import FILE",
        "",
        "Relevance: core = about The Twilight Zone itself; related = Rod Serling, Night Gallery, the show's writers;",
        "tangential = mentions or borrows the name. Blank = not yet labelled.",
        "The public site shows only records marked include. Preview builds show everything not excluded.",
        f"Generated {stamp} from {len(rows)} records.",
    ]:
        help_ws.append([line])
    help_ws.column_dimensions["A"].width = 120
    help_ws["A1"].font = Font(bold=True, size=14)
    wb.move_sheet("How to use", offset=-2)
    wb.active = 1

    xlsx = out / "review-queue.xlsx"
    wb.save(xlsx)
    with open(out / "review-queue.csv", "w", newline="", encoding="utf-8-sig") as fh:
        w = csv.writer(fh)
        w.writerow([c[0] for c in COLUMNS])
        for r in rows:
            w.writerow([r[k] for _, k, _ in COLUMNS])
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
