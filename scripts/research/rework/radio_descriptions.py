#!/usr/bin/env python3
"""Fill empty radio-drama descriptions from the TV episode each one adapts (Nov 2026 rework).

Run from the repo root. Only touches records with no description; writes own-words text built
from the episode record (title, series, season, year, writers, synopsis) and the radio credits.
"""
import re
from pathlib import Path
import yaml

C = Path("src/content")
SERIES = {"1959": "original 1959 series", "1985": "1985 revival", "2002": "2002 revival", "2019": "2019 revival"}
# Title fixes and episode links the spreadsheet import missed.
FIX = {
    "four-o-clock": {"title": "Four O'Clock", "adapts_episode": "1959/four-oclock"},
    "i-am-the-night-color-me-black": {"adapts_episode": "1959/i-am-the-nightcolor-me-black"},
    "the-hitchhiker": {"adapts_episode": "1959/the-hitch-hiker"},
    "the-passerby": {"title": "The Passersby", "adapts_episode": "1959/the-passersby"},
    "now-you-hear-it-now-you-dont": {"title": "Now You Hear It, Now You Don't"},
}
# Radio stories with no TV episode behind them, in our own words.
ORIGINAL = {
    "the-time-element": "Rod Serling's 1958 Desilu Playhouse play, the unofficial pilot of The Twilight Zone, in which a man tells a psychiatrist about a recurring dream of Honolulu on the eve of Pearl Harbor. The radio series adapted it as a prequel to the show it led to.",
    "free-dirt": "An adaptation of a Charles Beaumont short story, one of several Beaumont stories the radio series dramatized beyond the episodes he wrote for television.",
    "gentlemen-be-seated": "An adaptation of a Charles Beaumont story, one of several Beaumont stories the radio series dramatized beyond the episodes he wrote for television.",
    "pattern-for-doomsday": "An adaptation of a story by Jerry Sohl, who ghost-wrote three episodes of the original series under Charles Beaumont's name.",
    "who-am-i": "An adaptation of a story by Jerry Sohl, who ghost-wrote three episodes of the original series under Charles Beaumont's name.",
}
writers_note = lambda d: d.get("original_writer")

def fmt_names(xs):
    xs = [x for x in xs if x]
    return xs[0] if len(xs) == 1 else ", ".join(xs[:-1]) + " and " + xs[-1] if xs else ""

changed = 0
for f in sorted((C / "radio").glob("*.yaml")):
    rid = f.stem
    d = yaml.safe_load(f.read_text())
    for k, v in FIX.get(rid, {}).items():
        d[k] = v
    if d.get("description") or d.get("series_title") != "The Twilight Zone Radio Dramas":
        if rid in FIX:
            f.write_text(yaml.safe_dump(d, sort_keys=False, allow_unicode=True, width=110)); changed += 1
        continue
    star = fmt_names(d.get("voiced_by") or [])
    adapter = d.get("adapted_by")
    ep_ref = d.get("adapts_episode")
    epf = C / "episodes" / f"{ep_ref}.yaml" if ep_ref else None
    if epf and epf.exists():
        e = yaml.safe_load(epf.read_text())
        year = str(e.get("air_date", ""))[:4]
        who = fmt_names(e.get("writers") or [])
        parts = [f"A full-cast audio remake of “{e['title']}” from the {SERIES[e['series']]} (season {e['season']}{', ' + year if year else ''})"]
        if who: parts[0] += f", written for television by {who}"
        parts[0] += "."
        credit = []
        if adapter: credit.append(f"adapted for radio by {adapter}")
        if star: credit.append(f"starring {star}")
        if credit: parts.append(credit[0][0].upper() + ", ".join(credit)[1:] + ".")
        if e.get("synopsis"): parts.append("The story: " + e["synopsis"].strip())
    else:
        base = ORIGINAL.get(rid)
        w = d.get("original_writer")
        if not base:
            base = (f"A story by {w} written for the radio series itself" if w else "A story written for the radio series itself") + \
                   ". It is one of the new stories, not adapted from a television episode, that the series added in its later seasons."
        parts = [base]
        credit = []
        if adapter and adapter != w: credit.append(f"adapted for radio by {adapter}")
        if star: credit.append(f"starring {star}")
        if credit: parts.append(credit[0][0].upper() + ", ".join(credit)[1:] + ".")
    d["description"] = " ".join(parts)
    f.write_text(yaml.safe_dump(d, sort_keys=False, allow_unicode=True, width=110))
    changed += 1
print("changed", changed)
