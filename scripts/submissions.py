#!/usr/bin/env python3
"""Pull fan corrections and submissions from GitHub issues into the review queue.

Visitors send them through the issue forms in .github/ISSUE_TEMPLATE (linked from /contribute/ and
every page's "Suggest a correction" link). This script reads those issues and keeps
data/review/submissions.json in step: one entry per issue, keyed "submissions/<number>", with
the form's fields parsed out. Decisions use the same ledger as every other record
(data/review/decisions.json): include = accepted for research, exclude = declined.

  python3 scripts/submissions.py fetch            # read open and closed issues from GitHub
  python3 scripts/submissions.py fetch --from FILE # or from a saved API response (JSON list)
  python3 scripts/submissions.py list              # print pending ones

GITHUB_TOKEN is optional (public repository); without it GitHub allows 60 requests an hour.
"""
from __future__ import annotations

import argparse
import json
import os
import re
import sys
import urllib.request
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
OUT = ROOT / "data/review/submissions.json"
LEDGER = ROOT / "data/review/decisions.json"
REPO = "fortechsupport/intothetwilightzone"

FIELD_KEYS = {
    "page": "page", "what is wrong or missing": "problem", "what it should say": "fix", "source": "source",
    "your connection to this": "relation", "what kind of thing is it": "kind", "name or title": "title",
    "description": "description", "connection to the twilight zone": "connection", "links and sources": "links",
    "how you would like to be credited": "credit",
}


def kind_of(issue: dict) -> str | None:
    labels = {(l["name"] if isinstance(l, dict) else l).lower() for l in issue.get("labels", [])}
    title = issue.get("title", "")
    if "submission" in labels or title.startswith("[Submission]"):
        return "submission"
    if "correction" in labels or title.startswith("[Correction]"):
        return "correction"
    return None


def parse_form(body: str) -> dict:
    """Issue forms render as '### Label' headings followed by the answer."""
    fields: dict[str, str] = {}
    for m in re.finditer(r"^###\s+(.+?)\s*\n(.*?)(?=^###\s|\Z)", body or "", re.S | re.M):
        key = FIELD_KEYS.get(m.group(1).strip().lower())
        val = m.group(2).strip()
        if key and val and val != "_No response_":
            fields[key] = val
    return fields


def fetch_issues() -> list[dict]:
    issues, page = [], 1
    headers = {"Accept": "application/vnd.github+json", "User-Agent": "intothetwilightzone-submissions"}
    if os.environ.get("GITHUB_TOKEN"):
        headers["Authorization"] = f"Bearer {os.environ['GITHUB_TOKEN']}"
    while True:
        url = f"https://api.github.com/repos/{REPO}/issues?state=all&per_page=100&page={page}"
        with urllib.request.urlopen(urllib.request.Request(url, headers=headers), timeout=30) as r:
            batch = json.load(r)
        issues += [i for i in batch if "pull_request" not in i]
        if len(batch) < 100:
            return issues
        page += 1


def load() -> dict:
    return json.loads(OUT.read_text()) if OUT.exists() else {}


def cmd_fetch(args) -> int:
    issues = json.loads(Path(args.from_file).read_text()) if args.from_file else fetch_issues()
    current = load()
    added = updated = 0
    for i in issues:
        kind = kind_of(i)
        if not kind:
            continue
        key = f"submissions/{i['number']}"
        fields = parse_form(i.get("body") or "")
        entry = {
            "type": kind,
            "issue": i["number"],
            "url": i.get("html_url"),
            "title": fields.get("title") or re.sub(r"^\[(Submission|Correction)\]\s*", "", i.get("title", "")).strip(),
            "opened": (i.get("created_at") or "")[:10],
            "state": i.get("state"),
            "fields": fields,
        }
        if key not in current:
            added += 1
        elif current[key] != entry:
            updated += 1
        current[key] = entry
    OUT.write_text(json.dumps(dict(sorted(current.items(), key=lambda kv: int(kv[0].split("/")[1]))), indent=2, ensure_ascii=False) + "\n")
    print(f"{len(current)} submissions and corrections ({added} new, {updated} updated) -> {OUT.relative_to(ROOT)}")
    return 0


def cmd_list(_args) -> int:
    ledger = json.loads(LEDGER.read_text()) if LEDGER.exists() else {}
    for key, s in load().items():
        status = ledger.get(key, {}).get("status", "pending")
        if status == "pending":
            print(f"{key}\t{s['type']}\t{s['title']}\t{s['url']}")
    return 0


def main() -> int:
    ap = argparse.ArgumentParser(description=__doc__, formatter_class=argparse.RawDescriptionHelpFormatter)
    sub = ap.add_subparsers(dest="cmd", required=True)
    f = sub.add_parser("fetch")
    f.add_argument("--from", dest="from_file")
    f.set_defaults(func=cmd_fetch)
    sub.add_parser("list").set_defaults(func=cmd_list)
    args = ap.parse_args()
    return args.func(args)


if __name__ == "__main__":
    sys.exit(main())
