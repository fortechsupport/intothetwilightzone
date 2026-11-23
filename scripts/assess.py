#!/usr/bin/env python3
"""Explain, for every record, why it belongs on IntoTheTwilightZone.com and what Adam should do with it.

Writes data/review/assessments.json, keyed "<collection>/<id>", with:
  connection       one specific sentence on how the record relates to The Twilight Zone
  tier             core | related | tangential
  tier_reason      why that tier
  recommendation   include | maybe | exclude
  reason           why that recommendation
  source_title, source_url   the best independent source for the connection

The text is built from each record's own data (credits, episode links, connection records, descriptions)
and from two hand-written files:
  data/review/resemblances.yaml          what a film shares with an episode when only fans have noticed it
  data/review/assessment-overrides.yaml  any field, for any key, replacing what the rules produce

Run after changing content:  python3 scripts/assess.py   (review.py export runs it too).
"""
from __future__ import annotations

import json
import re
import sys
from collections import defaultdict
from pathlib import Path

import yaml

ROOT = Path(__file__).resolve().parent.parent
CONTENT = ROOT / "src" / "content"
OUT = ROOT / "data" / "review" / "assessments.json"
RESEMBLANCES = ROOT / "data" / "review" / "resemblances.yaml"
OVERRIDES = ROOT / "data" / "review" / "assessment-overrides.yaml"
PRINT_NOTES = ROOT / "data" / "review" / "print-review-notes.md"

SERIES_NAME = {"1959": "the original series (1959-1964)", "1985": "the 1985 revival (1985-1989)",
               "2002": "the 2002 revival", "2019": "the 2019 revival"}
SERIES_SHORT = {"1959": "1959", "1985": "1985", "2002": "2002", "2019": "2019"}
TIER_MEANING = {
    "core": "Part of The Twilight Zone itself, or wholly about it.",
    "related": "One step from the show: Rod Serling's other work, Night Gallery, the show's writers, or a work that adapts or is documented as drawing on a specific episode.",
    "tangential": "Only touches the show: a mention, homage, parody, borrowed title, genre cousin or unconfirmed resemblance.",
}
SPREADSHEET = "spreadsheet"


# ---------------------------------------------------------------- loading
def load(collection: str) -> dict[str, dict]:
    out = {}
    base = CONTENT / collection
    if not base.exists():
        return out
    for f in sorted(base.rglob("*.yaml")):
        out[f.relative_to(base).with_suffix("").as_posix()] = yaml.safe_load(f.read_text(encoding="utf-8")) or {}
    return out


DB = {c.name: load(c.name) for c in sorted(CONTENT.iterdir()) if c.is_dir()}
EP = DB.get("episodes", {})
FILMS = DB.get("films", {})
CONN_FROM: dict[str, list[tuple[str, dict]]] = defaultdict(list)
CONN_TO: dict[str, list[tuple[str, dict]]] = defaultdict(list)
for cid, c in DB.get("connections", {}).items():
    CONN_FROM[c.get("from", "")].append((cid, c))
    CONN_TO[c.get("to", "")].append((cid, c))


def yaml_or_empty(p: Path) -> dict:
    return (yaml.safe_load(p.read_text(encoding="utf-8")) or {}) if p.exists() else {}


RESEMBLE = yaml_or_empty(RESEMBLANCES)
OVERRIDE = yaml_or_empty(OVERRIDES)


def print_notes() -> dict[str, str]:
    """Book-by-book notes from the print research (title -> note)."""
    notes = {}
    if PRINT_NOTES.exists():
        for m in re.finditer(r"^- \*\*(.+?)\*\*: (.+)$", PRINT_NOTES.read_text(encoding="utf-8"), re.M):
            notes[norm(m.group(1))] = m.group(2).strip()
    return notes


def norm(s: str) -> str:
    return re.sub(r"[^a-z0-9]", "", str(s).lower().replace("’", "'"))


NOTES = print_notes()


# ---------------------------------------------------------------- helpers
def names(xs, limit=3) -> str:
    xs = [str(x) for x in (xs or []) if x]
    if not xs:
        return ""
    if len(xs) > limit:
        xs = xs[:limit] + ["others"]
    return xs[0] if len(xs) == 1 else ", ".join(xs[:-1]) + " and " + xs[-1]


def q(t: str) -> str:
    return f"“{t}”"


def first_sentence(s: str, limit=260) -> str:
    s = re.sub(r"\s+", " ", str(s or "")).strip()
    out = s
    for m in re.finditer(r"[.!?](?=\s+[A-Z\"\u201c(])", s):
        before = s[: m.start()].rsplit(" ", 1)[-1].strip("(\"\u201c")
        if len(before) <= 2 or "." in before or before in ("Dr", "Mr", "Mrs", "Ms", "St", "No", "Vol", "Jr", "Sr", "vs", "Ltd", "Inc", "Co"):
            continue
        out = s[: m.end()]
        break
    return out if len(out) <= limit else out[: limit - 1].rsplit(" ", 1)[0] + "\u2026"


def ep_label(ref: str) -> str:
    e = EP.get(ref)
    if not e:
        return ref
    return f"{q(e['title'])} ({SERIES_SHORT.get(str(e.get('series')), e.get('series'))})"


def ref_label(ref: str) -> str:
    if re.match(r"^\d{4}/", ref):
        return ep_label(ref)
    col, _, rid = ref.partition("/")
    if col == "series":
        return {"1959": "The Twilight Zone (original series)", "1985": "The Twilight Zone (1985 revival)", "2002": "The Twilight Zone (2002 revival)", "2019": "The Twilight Zone (2019 revival)"}.get(rid, f"The Twilight Zone ({rid} series)")
    d = DB.get(col, {}).get(rid)
    if d:
        t = d.get("title") or d.get("name") or rid
        return q(t) if col in ("songs",) else t
    return ref


def nice_date(v) -> str:
    import datetime as _dt
    v = str(v)
    try:
        return _dt.date.fromisoformat(v[:10]).strftime("%B %-d, %Y")
    except ValueError:
        return v


def best_source(d: dict) -> tuple[str, str]:
    for s in d.get("sources") or []:
        if isinstance(s, dict) and s.get("url") and SPREADSHEET not in str(s.get("title", "")).lower():
            return str(s.get("title") or ""), str(s["url"])
    links = d.get("links") or {}
    for k in ("wikipedia", "official", "info", "isfdb", "online", "podchaser", "imdb"):
        if isinstance(links.get(k), str) and links[k].startswith("http"):
            return k.capitalize(), links[k]
    if isinstance(d.get("url"), str) and d["url"].startswith("http"):
        return "Record link", d["url"]
    return "", ""


def has_independent_source(d: dict) -> bool:
    return bool(best_source(d)[1])


def year(d: dict) -> str:
    for k in ("air_date", "release_date", "published", "cover_date", "year", "first_episode", "date"):
        v = d.get(k)
        if v:
            m = re.search(r"(1[89]\d\d|20\d\d)", str(v))
            if m:
                return m.group(1)
    return ""


def is_serling(d: dict) -> bool:
    blob = json.dumps(d, ensure_ascii=False, default=str).lower()
    return "serling" in blob


def mentions_tz(*texts) -> bool:
    return any("twilight zone" in str(t or "").lower() for t in texts)


def result(connection, tier, tier_reason, rec, reason, d=None):
    st, su = best_source(d or {})
    return {"connection": connection, "tier": tier, "tier_reason": tier_reason,
            "recommendation": rec, "reason": reason, "source_title": st, "source_url": su}


def rec_by_evidence(tier: str, d: dict, what: str) -> tuple[str, str]:
    """Default recommendation from tier and sourcing."""
    sourced = has_independent_source(d)
    if tier == "core":
        return ("include", f"Core {what}: a complete record of the franchise should have it." if sourced else
                f"Core {what}: include, though its details still rest only on the original spreadsheet.")
    if tier == "related":
        return ("include", f"A documented, direct link to the show or to Rod Serling; it adds context a fan would expect.") if sourced \
            else ("maybe", "Related to the show, but nothing beyond the original spreadsheet backs it up yet.")
    return ("maybe", "A light, sourced tie: worth keeping if you want the site to map the show's wider footprint.") if sourced \
        else ("maybe", "A light tie with no independent source yet; keep only if you want breadth over certainty.")


CONF_TEXT = {"confirmed-by-creator": "the makers have said so", "documented": "a published source makes the link",
             "fan-noted": "only fans have pointed it out; no source confirms it"}
KIND_VERB = {"official-adaptation": "an official adaptation of", "remake": "a remake of", "inspired-by": "inspired by", "compared": "often compared with",
             "homage": "an homage to", "parody": "a parody of", "reference": "a reference to",
             "lyric-mention": "a lyric mention of"}


def fan_rec(kind: str, summ: str, res: dict):
    """Recommendation for a fan-noted link that is an explicit on-screen reference rather than a resemblance."""
    if kind == "compared":
        return ("include", "Shown as a comparison, not an influence: critics or fans compare it with the episode, and the evidence says what is known.")
    if res:
        return None
    if kind in ("parody", "homage", "reference", "lyric-mention") and (not summ or len(summ) < 30 or " is a reference to " in summ or " is an homage to " in summ or " is a parody of " in summ):
        return ("maybe", "Fan sources record it as a deliberate nod to the episode, but nobody has described what the nod is; check the scene before including.")
    if not summ or len(summ) < 30:
        return None
    if kind == "inspired-by":
        return ("maybe", "Only a critic's or list-writer's comparison supports it, not the makers. Include as a labelled resemblance if you like the comparison.")
    if kind in ("parody", "homage"):
        return ("include", "An explicit on-screen spoof or homage. Fan episode guides record it rather than the press, but anyone can confirm it by watching.")
    if kind in ("reference", "lyric-mention"):
        return ("maybe", "A passing mention of the show, recorded by fan sources. Keep if you want the Influence section to show how far the name travelled.")
    return None


def conn_tier(kind: str, confidence: str) -> str:
    if confidence == "fan-noted":
        return "tangential"
    if kind in ("official-adaptation",):
        return "core"
    if kind in ("remake", "inspired-by"):
        return "related"
    return "tangential"


# ---------------------------------------------------------------- per collection
def a_series(rid, d):
    return result(f"One of the four official Twilight Zone television series: {d.get('title')} ({d.get('years')}, {d.get('network')}), hosted by {d.get('host')}.",
                  "core", "An official Twilight Zone series.", "include", "The backbone of the site: every page hangs off the four series.", d)


def a_episode(rid, d):
    s = str(d.get("series"))
    when = d.get("air_date") or ""
    w = names(d.get("writers"))
    conn = f"Season {d.get('season')}, episode {d.get('episode')} of {SERIES_NAME.get(s, s)}" + (f", first aired {nice_date(when)}" if when else "") + (f", written by {w}" if w else "")
    conn = conn.rstrip(".") + "."
    rec = "include"
    reason = "Every episode of the four official series belongs in a complete episode guide."
    if not d.get("synopsis"):
        reason += " Its page still needs a synopsis."
    return result(conn, "core", "An episode of an official Twilight Zone series.", rec, reason, d)


def film_connection(rid, d) -> tuple[str, str, str, str] | None:
    """(sentence, tier, rec, reason) from the film's connection records, or None."""
    conns = CONN_FROM.get(f"films/{rid}", [])
    if not conns:
        return None
    order = {"confirmed-by-creator": 0, "documented": 1, "fan-noted": 2}
    conns = sorted(conns, key=lambda x: order.get(x[1].get("confidence"), 3))
    cid, c = conns[0]
    kind, conf = c.get("kind", ""), c.get("confidence", "")
    target = ref_label(c.get("to", ""))
    others = [ref_label(x[1].get("to", "")) for x in conns[1:]]
    res = RESEMBLE.get(rid) or RESEMBLE.get(f"connections/{cid}") or {}
    summ = str(c.get("summary") or "").strip()
    if "listed in adam's research" in summ.lower():
        summ = ""
    if res.get("text"):
        sentence = f"Suggested link to {target}: {res['text']}"
    elif summ and len(summ) > 40 and str(c.get("to", "")).startswith("series/"):
        sentence = summ
    elif summ and len(summ) > 40:
        sentence = summ if target.strip("“”") in summ or "episode" in summ.lower() else f"{KIND_VERB.get(kind, kind).capitalize()} {target}. {summ}"
    else:
        sentence = f"{KIND_VERB.get(kind, kind).capitalize()} {target} ({CONF_TEXT.get(conf, conf)})."
    if others:
        sentence += f" Also linked to {names(others)}."
    tier = conn_tier(kind, conf)
    if conf == "fan-noted":
        fr = fan_rec(kind, summ, res)
        if fr:
            return sentence, "tangential", fr[0], fr[1]
        strength = res.get("strength", "weak" if not res else "strong")
        if strength == "strong":
            return sentence, "tangential", "maybe", "The premises are strikingly close, but no maker or critic has confirmed the link. Include as a labelled \"resemblance\" or leave out."
        return sentence, "tangential", "exclude", "The resemblance is loose and no source supports it; it would weaken the Influence section."
    if conf == "confirmed-by-creator":
        return sentence, tier, "include", "Its makers have said the show influenced it: the strongest kind of influence record."
    return sentence, tier, "include" if kind != "reference" else "maybe", (
        "A published source makes the link, so it is a well-founded influence record." if kind != "reference"
        else "A documented but passing reference; useful for completeness in the Influence section.")


def a_film(rid, d):
    title = d.get("title", rid)
    kind = d.get("kind", "film")
    rel = d.get("relevance")
    tags = d.get("tags") or []
    summ = first_sentence(d.get("summary"))
    if re.match(r"^night-gallery-s\de\d\d$", rid) or rid in ("night-gallery", "night-gallery-pilot"):
        segs = [s.get("title") for s in d.get("segments") or [] if s.get("title")]
        conn = ("Rod Serling's follow-up anthology (NBC, 1970-1973), which he hosted and wrote for." if rid == "night-gallery" else
                "The 1969 NBC television film that launched Night Gallery, with three stories written by Rod Serling." if rid == "night-gallery-pilot" else
                f"An episode of Night Gallery ({d.get('parent_series', '').replace('Night Gallery, ', '')}), Rod Serling's follow-up anthology, which he hosted" +
                (f"; stories: {names([q(s) for s in segs], 5)}." if segs else "."))
        return result(conn, "related", "Night Gallery is Rod Serling's own second anthology series, within the site's Serling scope.",
                      "include", "You asked for complete Night Gallery coverage; this is part of the full episode guide.", d)
    if mentions_tz(title) and kind in ("film", "tv-film", "documentary", "special", "pilot") and summ:
        return result(f"A Twilight Zone production in its own right. {summ}", "core", "An official or documentary Twilight Zone production.",
                      "include", "Part of the franchise's own screen history.", d)
    fc = film_connection(rid, d)
    if "anthology-family" in tags:
        conn = f"A fellow anthology series: {summ}" if summ else "A fellow anthology series in the tradition The Twilight Zone defined."
        return result(conn, "tangential", "A genre cousin rather than a work that draws on the show itself.", "maybe",
                      "Useful to map the anthology genre around the show, but it has no direct Twilight Zone tie.", d)
    if fc:
        sentence, tier, rec, reason = fc
        if rel == "related" and tier == "tangential" and rec != "exclude":
            tier = "related"
        return result(sentence, tier, TIER_MEANING[tier], rec, reason, d)
    if mentions_tz(title) and kind in ("film", "tv-film", "documentary", "special", "pilot"):
        return result(f"An official or documentary Twilight Zone production: {summ}" if summ else f"A Twilight Zone production: {title}.",
                      "core", "A Twilight Zone production in its own right.", "include", "Part of the franchise's screen history.", d)
    if is_serling(d) and rel in ("related", None):
        return result(f"Rod Serling's work beyond The Twilight Zone: {summ}" if summ else f"Rod Serling's work beyond The Twilight Zone ({title}).",
                      "related", "Serling's wider career is within the site's scope.", "include", "You asked for all of Rod Serling's work to be documented.", d)
    if rel == "related":
        return result(summ or f"{title} is connected to the show's makers.", "related", TIER_MEANING["related"], *rec_by_evidence("related", d, "screen work"), d)
    if summ:
        return result(summ, rel or "tangential", TIER_MEANING[rel or "tangential"], *rec_by_evidence(rel or "tangential", d, "screen work"), d)
    return result(f"{title}: no Twilight Zone tie is recorded yet.", "tangential", "No connection recorded.", "exclude",
                  "Nothing in the record says how it relates to the show; add a connection or leave it out.", d)


def a_connection(rid, d):
    kind, conf = d.get("kind", ""), d.get("confidence", "")
    frm, to = ref_label(d.get("from", "")), ref_label(d.get("to", ""))
    summ = str(d.get("summary") or "").strip()
    res = RESEMBLE.get(f"connections/{rid}") or RESEMBLE.get(d.get("from", "").partition("/")[2]) or {}
    if res.get("text"):
        conn = f"{frm} and {to}: {res['text']}"
    elif summ and "listed in adam's research" not in summ.lower():
        conn = summ
    else:
        conn = f"{frm} is {KIND_VERB.get(kind, kind)} {to}."
    tier = conn_tier(kind, conf)
    if conf == "confirmed-by-creator":
        rec, reason = "include", "The makers have confirmed the influence."
    elif conf == "documented":
        rec, reason = "include", "A published source documents the link."
    elif fan_rec(kind, summ if "listed in adam's research" not in summ.lower() else "", res):
        rec, reason = fan_rec(kind, summ if "listed in adam's research" not in summ.lower() else "", res)
    else:
        strong = res.get("strength") == "strong"
        rec = "maybe" if strong else "exclude"
        reason = ("Close premise, but only fans have made the link; show it labelled as unconfirmed or leave it out." if strong
                  else "Only fans have made this link and the resemblance is loose; leaving it out keeps the Influence section credible.")
    return result(conn, tier, f"{kind.replace('-', ' ').capitalize()} link, {CONF_TEXT.get(conf, conf)}.", rec, reason, d)


def credit_index():
    idx: dict[str, list[tuple[str, str, str]]] = defaultdict(list)  # name -> (role, series, ref)
    for rid, e in EP.items():
        s = str(e.get("series"))
        for role, field in (("wrote", "writers"), ("directed", "directors"), ("acted in", "cast"), ("source author of", "source_authors")):
            for n in e.get(field) or []:
                idx[n].append((role, s, rid))
        if e.get("narrator"):
            idx[e["narrator"]].append(("narrated", s, rid))
    for rid, f in FILMS.items():
        grp = "ng" if rid.startswith("night-gallery") else "tzfilm" if mentions_tz(f.get("title")) else "film"
        people = [(r, n) for r, fld in (("wrote", "writers"), ("directed", "directors"), ("acted in", "cast")) for n in f.get(fld) or []]
        for seg in f.get("segments") or []:
            people += [(r, n) for r, fld in (("wrote", "writers"), ("directed", "directors"), ("acted in", "cast")) for n in seg.get(fld) or []]
        for r, n in people:
            idx[n].append((r, grp, f"films/{rid}"))
    for rid, r in DB.get("radio", {}).items():
        if r.get("subtype") or r.get("series_title") != "The Twilight Zone Radio Dramas":
            continue
        for n in r.get("voiced_by") or []:
            idx[n].append(("voiced", "radio", f"radio/{rid}"))
        for fld in ("adapted_by",):
            if r.get(fld):
                idx[r[fld]].append(("adapted", "radio", f"radio/{rid}"))
    return idx


CREDITS = None


def a_person(rid, d):
    global CREDITS
    if CREDITS is None:
        CREDITS = credit_index()
    name = d.get("name", rid)
    cr = CREDITS.get(name, [])
    tzc = d.get("tz_credits") or []
    parts = []
    tz_series = defaultdict(lambda: defaultdict(list))
    for role, s, ref in cr:
        if s in SERIES_NAME:
            tz_series[s][role].append(ref)
    for s in ("1959", "1985", "2002", "2019"):
        for role in ("wrote", "directed", "narrated", "acted in", "source author of"):
            refs = sorted(set(tz_series[s][role]), key=lambda r: EP.get(r, {}).get("air_date", ""))
            if role == "source author of":
                refs = [r for r in refs if r not in set(tz_series[s]["wrote"])]
            if role == "narrated" and set(refs) <= set(tz_series[s]["wrote"]) | set(tz_series[s]["acted in"]) and len(refs) < 3:
                refs = []
            if not refs:
                continue
            ex = names([q(EP[r]["title"]) for r in refs[:2]], 2)
            n = len(refs)
            verb = {"source author of": "wrote the story behind"}.get(role, role)
            parts.append(f"{verb} {n} episode{'s' if n > 1 else ''} of the {SERIES_SHORT[s]} series" + (f" (including {ex})" if n > 2 else f" ({ex})"))
    others = defaultdict(set)
    for role, s, ref in cr:
        if s in ("ng", "tzfilm", "radio"):
            others[s].add(ref)
    if others.get("tzfilm"):
        parts.append("worked on " + names([FILMS[r.split('/', 1)[1]]["title"] for r in sorted(others["tzfilm"])], 2))
    if others.get("ng"):
        parts.append(f"worked on {len(others['ng'])} Night Gallery production{'s' if len(others['ng']) > 1 else ''}")
    for verb, role in (("voiced", "performed in"), ("adapted", "adapted")):
        refs = sorted({ref for r, s_, ref in cr if s_ == "radio" and r == verb})
        if refs:
            rt = [q(DB["radio"][r.split("/", 1)[1]]["title"]) for r in refs]
            parts.append(f"{role} {len(rt)} Twilight Zone radio drama{'s' if len(rt) > 1 else ''} ({names(rt, 3)})")
    if not parts and tzc:
        parts = ["was credited as " + "; ".join(f"{c.get('role') or 'contributor'} on {q(str(c.get('work')))} ({c.get('series')})" for c in tzc[:3])]
    quotes = [qid for qid, qd in DB.get("quotes", {}).items() if qd.get("person") == name]
    if parts:
        extra = len(parts) - 4
        conn = f"{name} " + "; ".join(parts[:4]) + ("; and more" if extra > 0 else "") + "."
        conn = conn[0].upper() + conn[1:]
        core = any(s in SERIES_NAME for _, s, _ in cr) or others.get("tzfilm") or others.get("radio") or any("Twilight Zone" in str(c.get("series")) for c in tzc)
        tier = "core" if core else "related"
        return result(conn, tier, "Has screen, radio or production credits on the franchise." if core else "Credits on Night Gallery or Serling's wider work.",
                      "include", "A credited contributor; their page ties together everything they made for the franchise.", d)
    if quotes:
        return result(f"{name} has spoken publicly about the show's influence on their work (see Voices).", "tangential",
                      "Influenced by the show rather than part of it.", "include" if has_independent_source(d) else "maybe",
                      "Their sourced quote is the reason they are here; the page gives it context.", d)
    bio = first_sentence(d.get("bio"))
    if is_serling(d):
        return result(bio or f"{name} is connected to Rod Serling.", "related", "Part of Rod Serling's life or circle.", "include" if has_independent_source(d) else "maybe",
                      "Within the Serling scope you asked for.", d)
    cats = set(d.get("categories") or [])
    for cat, tier, why, rec_why in (
            ("people/scholars-historians", "related", "Has written or researched the show's history.", "A historian or author whose work documents the show; their page points readers to it."),
            ("people/family", "related", "Part of Rod Serling's family or early life.", "Within the Serling scope you asked for."),
            ("people/inspired-creators", "tangential", "Made work that draws on the show rather than working on it.", "Documents the show's influence; the bio names the work and the source for the link."),
            ("people/fans", "tangential", "A notable admirer, not a contributor.", "Their documented praise or debt to the show is the reason they are here.")):
        if cat in cats and bio:
            return result(bio, tier, why, "include" if has_independent_source(d) and d.get("research_confidence") != "low" else "maybe", rec_why, d)
    return result(bio or f"No Twilight Zone credit is recorded for {name}.", "tangential", "No franchise credit found in the records.", "maybe",
                  "No credit or quote links this person to the show in the data; check the bio before including.", d)


def a_character(rid, d):
    eps = [r for r in d.get("appears_in") or []]
    titles = [q(EP[r]["title"]) if r in EP else q(FILMS.get(r.split("/", 1)[1], {}).get("title", r)) for r in eps]
    who = names(d.get("played_by") or [], 2)
    conn = f"A character in {names(titles, 3) or 'the franchise'}" + (f", played by {who}" if who else "") + ". " + first_sentence(d.get("description"))
    ng = all(r.startswith("films/night-gallery") for r in eps) and eps
    conf = d.get("research_confidence")
    return result(conn, "related" if ng else "core", "A character from Night Gallery." if ng else "A character from a Twilight Zone episode or film.",
                  "include" if conf in (None, "high") else "maybe",
                  "Character pages connect episodes to the actors who played them." if conf in (None, "high") else f"Names or casting are {conf} confidence; check against the episode before including.", d)


def a_quote(rid, d):
    who = d.get("person", "")
    ctx = first_sentence(re.sub(r"^.*?\)\.\s*", "", str(d.get("context") or "")), 220)
    conn = f"A sourced quote from {who}." + (f" {ctx}" if ctx else "")
    sourced = has_independent_source(d)
    return result(conn, "related", "A first-hand statement about the show's influence.", "include" if sourced else "maybe",
                  "Exact, sourced words from a notable admirer; this is what the Voices section is for." if sourced else "Exact words, but the source link is missing; check before publishing.", d)


LOC_KIND = {"backlot-set": ("core", "A studio set where episodes were filmed."), "filming-location": ("core", "A real place where episodes were filmed."),
            "serling-place": ("related", "A place from Rod Serling's life."), "memorial": ("related", "A memorial to Rod Serling."),
            "attraction": ("core", "A licensed Twilight Zone attraction."), "museum-exhibit": ("related", "An exhibit about Serling or the show."),
            "archive": ("related", "Where Twilight Zone papers or recordings are kept.")}


def a_location(rid, d):
    kind = d.get("kind")
    tier, why = LOC_KIND.get(kind, ("related", "A place connected to the show."))
    filmed = [ep_label(x.get("ref")) if re.match(r"^\d{4}/", str(x.get("ref"))) else ref_label(str(x.get("ref"))) for x in d.get("filmed") or [] if x.get("ref")]
    place = ", ".join(x for x in (d.get("city"), d.get("region")) if x)
    if filmed:
        conn = f"{d.get('name')}{' (' + place + ')' if place else ''} was used for {names(filmed, 3)}."
    else:
        conn = first_sentence(d.get("notes")) or f"{d.get('name')} ({place})."
    if kind == "attraction" and not mentions_tz(d.get("name"), d.get("notes")):
        tier, why = "tangential", "An attraction that echoes the show without its name."
    return result(conn, tier, why, *rec_by_evidence(tier, d, "place"), d)


def a_song(rid, d):
    tzc = d.get("tz_connection")
    artist, title = d.get("artist", ""), d.get("title", "")
    desc = first_sentence(d.get("description"), 300)
    conf = d.get("research_confidence")
    if tzc == "theme":
        tier = "core" if any(k in title for k in ("(1959)", "(1985)", "(2002)", "(2019)", "Movie")) else "related"
        conn = desc or f"{artist} uses or covers the show's theme."
        return result(conn, tier, "The show's own music." if tier == "core" else "Uses or covers the show's music.",
                      "include", "The theme is the most recognisable thing about the show; its uses are core to the Music section.", d)
    if conf == "low" or tzc == "unclassified":
        intitle = "twilight" in title.lower() or "zone" in title.lower()
        return result(desc or f"{q(title)} by {artist}: tie not recorded.", "tangential", "A song that names or borrows from the show.",
                      "maybe",
                      "Its title uses the show's name, but nobody has checked whether it means the series; worth a quick listen." if intitle else
                      "From your original song list, but the reference (probably a passing lyric line) has not been found yet. Include it if you remember why you added it.", d)
    tier = "related" if tzc == "reference" and "tribute" in desc.lower() else "tangential"
    return result(desc or f"{q(title)} by {artist} mentions the show.", tier,
                  "Written about the show." if tier == "related" else "A song that names or borrows from the show.",
                  "include" if tier == "related" or has_independent_source(d) else "maybe",
                  "A documented tribute that belongs in the Music section." if tier == "related" else
                  ("A sourced lyric or title reference; fits a list of songs that name the show." if has_independent_source(d) else
                   "Listed in the original research as a lyric or title reference, but the line has not been checked."), d)


def a_radio(rid, d):
    desc = first_sentence(d.get("description"), 300)
    if d.get("series_title") == "The Twilight Zone Radio Dramas":
        if d.get("subtype") == "radio-broadcast":
            return result(desc, "related", "A rebroadcast of the official radio series rather than the series itself.", "maybe", "A secondary listing; the dramas themselves are already covered.", d)
        ep = d.get("adapts_episode")
        conn = (f"An episode of The Twilight Zone Radio Dramas (Falcon Picture Group, licensed from Carol Serling) adapting {ep_label(ep)}." if ep in EP
                else "An episode of The Twilight Zone Radio Dramas (Falcon Picture Group, licensed from Carol Serling): " + desc)
        return result(conn, "core", "Part of the officially licensed radio series.", "include", "The licensed radio series is part of the franchise; the full run is listed.", d)
    return result(f"Rod Serling's radio work: {desc}" if desc else f"Rod Serling's radio work ({d.get('series_title')}).", "related",
                  "Serling's radio work outside the show.", "include", "You asked for all of Rod Serling's work to be documented.", d)


def a_podcast(rid, d):
    desc = first_sentence(d.get("description"), 300)
    t = d.get("title", "")
    if "night gallery" in t.lower():
        return result(desc, "related", "About Night Gallery.", "include", "Covers Serling's other anthology.", d)
    whole = mentions_tz(t) or any(w in t.lower() for w in ("fifth dimension", "submitted for your approval", "zone", "light and shadow", "light, shadow", "science and superstition", "imagine if you will", "time enough", "key of imagination", "shadow and substance", "monsters are due", "strange highways"))
    if "episode" in t.lower() and " - " in t or re.search(r"episode \d+|ep \d+|^\d+\.", t.lower()):
        return result(desc, "related", "A single episode of a wider podcast given over to the show.", "maybe",
                      "One episode of a general podcast; include if you want a full media list, otherwise the dedicated podcasts cover it.", d)
    if whole:
        return result(desc, "core", "A podcast wholly about The Twilight Zone.", "include" if has_independent_source(d) or d.get("links") else "maybe",
                      "A dedicated companion podcast; fans looking for discussion of an episode will want these.", d)
    return result(desc or t, "tangential", "Mentions the show in passing.", "maybe", "Only partly about the show.", d)


def print_rec(d, tier, what):
    note = NOTES.get(norm(d.get("title", "")))
    tags = d.get("tags") or []
    if note:
        low = note.lower()
        if "recommend removal" in low:
            return "exclude", f"Print research: {note}"
        if "duplicate" in low or "merging" in low or "merge" in low:
            return "exclude", f"Likely duplicate. {note}"
        if "not a twilight zone book" in low:
            return "include" if is_serling(d) else "maybe", f"Not about the show itself, but in the Serling scope. {note}"
        return "maybe", f"Print research flag: {note}"
    if "self-published" in tags or "unverified" in tags:
        return "maybe", "Self-published or unverified; low reference value unless you want completeness."
    return rec_by_evidence(tier, d, what)


def a_book(rid, d):
    desc = first_sentence(d.get("description"), 300)
    tier = d.get("relevance") or ("core" if mentions_tz(d.get("title"), d.get("description")) else "related" if is_serling(d) else "tangential")
    rec, reason = print_rec(d, tier, "book")
    eps = d.get("episodes") or []
    conn = desc or f"{d.get('title')}, by {names(d.get('authors'))}."
    if eps and len(conn) < 200:
        conn += f" Covers {names([ep_label(e) for e in eps], 3)}."
    return result(conn, tier, TIER_MEANING[tier], rec, reason, d)


def a_comic(rid, d):
    desc = first_sentence(d.get("description"), 300)
    t, sn = d.get("title", ""), d.get("series_name", "")
    tier = d.get("relevance") or ("core" if mentions_tz(t, sn) else "related" if is_serling(d) else "tangential")
    conn = desc or f"{t} ({d.get('publisher')})."
    pub = d.get("publisher", "")
    if tier == "core":
        reason = f"A licensed Twilight Zone comic from {pub}; part of the complete print history." if pub else "A Twilight Zone comic; part of the print history."
        return result(conn, tier, "A Twilight Zone comic.", "include", reason, d)
    return result(conn, tier, TIER_MEANING[tier], *rec_by_evidence(tier, d, "comic"), d)


def a_magazine(rid, d):
    desc = first_sentence(d.get("description"), 300)
    mag = d.get("magazine") or d.get("title", "")
    core = "twilight zone magazine" in str(mag).lower() or "night cry" in str(mag).lower()
    tier = "core" if core else "related"
    conn = desc or f"{d.get('title')}."
    if core:
        return result(conn, "core", "An issue of the show's own licensed magazine.", "include", "The official magazine run is part of the franchise; list every issue.", d)
    return result(conn, "related", "Another magazine's coverage of the show.", *rec_by_evidence("related", d, "magazine issue"), d)


def a_essay(rid, d):
    desc = first_sentence(d.get("description"), 300)
    tier = d.get("relevance") or ("core" if mentions_tz(d.get("title"), d.get("description")) else "related")
    if d.get("kind") == "review" and d.get("review_type"):
        about = names([ref_label(r) for r in d.get("reviews") or []], 2) or "the show"
        by = f" by {names(d.get('authors'), 2)}" if d.get("authors") else ""
        outlet = f" in {d.get('published_in')}" if d.get("published_in") else ""
        when = f" ({year(d)})" if year(d) else ""
        rt = d.get("review_type")
        lead = {"contemporary": f"Review of {about}{outlet}{by}{when}, written at the time of release.",
                "retrospective": f"Later appraisal of {about}{outlet}{by}{when}.",
                "ranking": f"Ranking or best-of list{outlet}{when} that places {about}.",
                "awards-citation": f"Awards citation for {about}{when}."}[rt]
        if d.get("outlet_rating"):
            lead += f" Rating: {d['outlet_rating']}."
        conn = f"{lead} {desc}".strip()
        why = {"contemporary": "Shows how critics received it when it was new; part of the reception history.",
               "retrospective": "Shows how its reputation has held up; useful context for readers.",
               "ranking": "Documents where the show stands in critics' and viewers' estimation.",
               "awards-citation": "Records an honor the show received."}[rt]
        if d.get("research_confidence") == "low":
            return result(conn, tier, "Reception of the show.", "maybe", "Only lightly verified; " + why[0].lower() + why[1:], d)
        return result(conn, tier, "Reception of the show.", "include", why, d)
    if d.get("research_confidence") == "low":
        return result(desc, tier, "Writing about the show." if tier == "core" else "Writing by or about Rod Serling.", "maybe",
                      "Only the title and a listing were checked; keep if you want the fullest bibliography.", d)
    return result(desc, tier, "Writing about the show." if tier == "core" else "Writing by or about Rod Serling.", *rec_by_evidence(tier, d, "piece of writing"), d)


def a_archive(rid, d):
    desc = first_sentence(d.get("description"), 300)
    tz = mentions_tz(d.get("name"), d.get("description")) and "does not single out" not in str(d.get("description"))
    tier = "core" if tz else "related"
    return result(desc, tier, "Holds Twilight Zone scripts, papers or recordings." if tz else "Holds papers of a Twilight Zone contributor.",
                  "include", "Tells researchers where the primary sources are; low effort, high value.", d)


ORG_OFFICIAL_KINDS = {"network", "studio", "streamer", "production-company", "sponsor"}


def a_organization(rid, d):
    desc = first_sentence(d.get("description"), 300) or f"{d.get('name')}: an organization named in records on this site."
    kind = d.get("kind", "other")
    official = d.get("official")
    if official is None:
        official = kind in ORG_OFFICIAL_KINDS
    tier = "core" if official else "related"
    why = ("Made, broadcast, licensed, published or paid for Twilight Zone material." if official
           else "Holds, honors, studies or publishes work about the show or Rod Serling.")
    reason = ("Organizations are a section Adam asked for; this one ties together the records that name it."
              + ("" if d.get("description") else " Seed record without a description yet."))
    return result(desc, tier, why, "include", reason, d)


WORK_TIER = {"memorial": "related", "education": "core", "convention": "related", "event": "related", "link": "core",
             "fan-community": "core", "parody": "tangential", "other": "related"}


def a_work(rid, d):
    desc = first_sentence(d.get("description"), 300)
    kind, sub = d.get("kind", ""), d.get("subtype", "")
    title = d.get("title", "")
    rel = d.get("relevance")
    tz = mentions_tz(title, d.get("description"), json.dumps(d.get("details") or {}, default=str))
    if rel:
        tier = rel
    elif kind in ("soundtrack", "game", "collectible", "artwork", "stage", "attraction"):
        tier = "core" if tz else "tangential"
    elif kind == "event" and sub == "honor":
        tier = "related"
    else:
        tier = WORK_TIER.get(kind, "related") if tz or is_serling(d) else "tangential"
    if re.search(r"no twilight zone|non-twilight zone|without the twilight zone", str(d.get("description", "")) + title, re.I):
        tier = "tangential"
    licensed = (d.get("details") or {}).get("licensed")
    conn = desc or title
    for _, c in CONN_FROM.get(f"works/{rid}", [])[:1]:
        conn += f" Linked to {ref_label(c.get('to', ''))}."
    if kind == "event" and sub == "honor":
        return result(conn, "related", "An honor given to Rod Serling or the show.", "include", "Part of Serling's career record on his hub page.", d)
    if kind == "link":
        return result(conn, tier, "A reference resource about the show.", "include" if has_independent_source(d) else "maybe",
                      "Useful onward links for readers; keep the list to well-maintained resources.", d)
    if licensed is False:
        return result(conn, "tangential", "Unlicensed merchandise.", "maybe", "Unlicensed: document it only if you want a full merchandise record.", d)
    rec, reason = rec_by_evidence(tier, d, kind.replace("-", " ") or "item")
    if tier == "core" and kind in ("collectible", "game", "soundtrack"):
        reason = "Officially licensed Twilight Zone " + {"collectible": "merchandise", "game": "game", "soundtrack": "music release"}[kind] + "; part of the franchise's history (listed as a record, not for sale)."
    return result(conn, tier, TIER_MEANING[tier], rec, reason, d)


# ---------------------------------------------------------------- titles, subcategories and sorting
ARTICLE = re.compile(r"^(the|a|an)\s+", re.I)


def sort_key(title: str) -> str:
    """Alphabetical key: ignore a leading The/A/An, quotes and punctuation; pad numbers so #2 sorts before #10."""
    t = re.sub(r"^[\"'\u201c\u2018(\[.\u2026]+", "", str(title)).strip()
    t = ARTICLE.sub("", t)
    t = re.sub(r"\d+", lambda m: m.group(0).zfill(6), t.lower())
    return re.sub(r"[^a-z0-9 ]", "", t).strip()


FILM_KIND = {"film": "Feature films", "tv-film": "Television films", "tv-series": "Television series",
             "tv-episode": "Episodes of other shows", "tv-segment": "Segments of other shows", "sketch": "Sketches",
             "documentary": "Documentaries", "special": "Specials", "pilot": "Pilots", "stage": "Stage",
             "unproduced": "Unproduced scripts", "short": "Short films", "music-video": "Music videos",
             "commercial": "Commercials", "web-series": "Web series"}
WORK_KIND = {"soundtrack": "Soundtracks and theme releases", "game": "Games", "collectible": "Collectibles",
             "artwork": "Artwork", "stage": "Stage", "attraction": "Attractions", "event": "Events and honors",
             "convention": "Conventions", "parody": "Parodies", "television": "Television", "memorial": "Memorials",
             "education": "In the classroom", "fan-community": "Fan communities", "link": "Links and resources", "other": "Other"}
LOC_SUB = {"backlot-set": "Studio backlots and sets", "filming-location": "Filming locations", "serling-place": "Rod Serling's places",
           "memorial": "Memorials", "attraction": "Attractions", "museum-exhibit": "Museums and exhibits", "archive": "Archives"}
SONG_SUB = {"theme": "The theme and its uses", "lyric-mention": "Lyrics that mention the show",
            "reference": "Songs about or titled after the show", "unclassified": "Connection not yet confirmed"}
BOOK_SUB = {"anthology": "Story anthologies", "scripts": "Scripts and teleplays", "scholarly": "Scholarship and criticism",
            "novel": "Novels", "reference": "Guides and reference", "novelization": "Novelizations", "biography": "Biography and memoir",
            "memoir": "Biography and memoir", "juvenile": "Young readers", "art-book": "Art and puzzle books", "puzzle-trivia": "Art and puzzle books",
            "graphic-novel": "Graphic novels", "play": "Scripts and teleplays", "other": "Other books"}
ESSAY_SUB = {"journal-article": "Journal articles", "essay": "Essays", "book-chapter": "Book chapters", "review": "Reviews",
             "interview": "Interviews", "speech": "Speeches", "article": "Articles", "lecture": "Lectures", "script": "Scripts",
             "academic-thesis": "Theses and dissertations"}
REVIEW_SUB = {"contemporary": "Reviews: at release", "retrospective": "Reviews: retrospective", "ranking": "Rankings and best-of lists",
              "awards-citation": "Awards citations"}
CONN_SUB = {"official-adaptation": "Official adaptations", "remake": "Remakes", "inspired-by": "Inspired by an episode",
            "homage": "Homages", "parody": "Parodies", "reference": "References", "lyric-mention": "Lyric mentions"}


def display_title(col: str, rid: str, d: dict) -> str:
    if col == "quotes":
        t = str(d.get("text") or "")
        return f"{d.get('person')}: \u201c{t[:80]}{'\u2026' if len(t) > 80 else ''}\u201d"
    if col == "connections":
        return f"{ref_label(d.get('from', ''))} \u2192 {ref_label(d.get('to', ''))}"
    if col == "series":
        return f"{d.get('title')} ({d.get('years')})"
    if col == "episodes":
        return f"{d.get('title')} ({d.get('series')}, S{d.get('season')}E{d.get('episode')})"
    return str(d.get("title") or d.get("name") or rid)


def subcategory(col: str, rid: str, d: dict) -> str:
    if col == "episodes":
        return {"1959": "Original series (1959-1964)", "1985": "1985 revival (1985-1989)", "2002": "2002 revival (2002-2003)", "2019": "2019 revival (2019-2020)"}.get(str(d.get("series")), str(d.get("series")))
    if col == "series":
        return "The four series"
    if col == "films":
        if rid.startswith("night-gallery"):
            return "Night Gallery"
        if "anthology-family" in (d.get("tags") or []):
            return "Fellow anthology series"
        if mentions_tz(d.get("title")) and d.get("kind") in ("film", "tv-film", "documentary", "special", "pilot"):
            return "Twilight Zone productions"
        if is_serling(d) and d.get("relevance") == "related" and not CONN_FROM.get(f"films/{rid}"):
            return "Rod Serling's other screen work"
        return FILM_KIND.get(d.get("kind", "film"), "Other")
    if col == "works":
        if d.get("kind") == "event" and d.get("subtype") == "honor":
            return "Honors and awards"
        return WORK_KIND.get(d.get("kind"), "Other")
    if col == "locations":
        return LOC_SUB.get(d.get("kind"), "Other places")
    if col == "songs":
        if d.get("tz_connection") == "unclassified" and d.get("research_confidence") != "low":
            return "Other references and samples"
        return SONG_SUB.get(d.get("tz_connection"), "Other")
    if col == "books":
        if d.get("relevance") == "related" and not mentions_tz(d.get("title"), d.get("description")):
            return "Rod Serling and Night Gallery"
        k = d.get("kind")
        if not k:
            t = str(d.get("title", "")).lower()
            k = ("puzzle-trivia" if re.search(r"trivia|coloring|word search|puzzle|haiku", t) else
                 "anthology" if re.search(r"stories|tales|anthology|omnibus", t) else
                 "scripts" if re.search(r"teleplay|scripts|room 2426|possum|the trunk|the crossing|writing for", t) else
                 "reference" if re.search(r"guide|companion|faq|encyclopedia|revisited|reviewed|retrospective|memo to", t) else
                 "biography" if re.search(r"biograph|life|dreams and nightmares|fictioneer|serling:", t) else
                 "scholarly" if re.search(r"philosophy|gospel|irony|science fiction|sci fi|television|tv", t) else None)
        return BOOK_SUB.get(k, "Other books")
    if col == "comics":
        pub = str(d.get("publisher") or "Other")
        return {"Gold Key Comics": "Gold Key (1962-1982)", "Dell Comics": "Dell (1961-1962)", "Whitman Comics": "Gold Key (1962-1982)",
                "Bloomsbury, Walker & Company": "Walker & Company graphic novels", "Boom Comics": "Rod Serling adaptations",
                "Cayuga Productions": "Promotional comics", "Dynamite Entertainment": "Dynamite", "IDW Publishing": "IDW",
                "Now Comics": "Now Comics", "Western Publishing": "Promotional comics", "World Distributors": "World Distributors (UK)",
                "Editorial Novaro": "Foreign editions"}.get(pub, pub)
    if col == "magazines":
        m = str(d.get("magazine") or "Other magazines")
        return "The Twilight Zone Magazine" if "Twilight Zone Magazine" in m else m
    if col == "radio":
        if d.get("series_title") == "The Twilight Zone Radio Dramas" and not d.get("subtype"):
            return "The Twilight Zone Radio Dramas"
        if d.get("series_title") == "The Twilight Zone Radio Dramas":
            return "Rebroadcasts and other radio"
        return "Rod Serling on radio"
    if col == "podcasts":
        t = str(d.get("title"))
        return "Single episodes of other podcasts" if (" - " in t and "episode" in t.lower()) or re.search(r"episode \d+|ep \d+|^\d+\.", t.lower()) else "Twilight Zone podcasts"
    if col == "characters":
        eps = d.get("appears_in") or []
        first = eps[0] if eps else ""
        if first.startswith("films/night-gallery"):
            return "Night Gallery"
        if first.startswith("films/"):
            return "Twilight Zone: The Movie (1983)"
        return {"1959": "Original series (1959-1964)", "1985": "1985 revival (1985-1989)", "2002": "2002 revival (2002-2003)", "2019": "2019 revival (2019-2020)"}.get(first[:4], "Other")
    if col == "people":
        roles = d.get("roles") or []
        for r, label in (("writer", "Writers"), ("director", "Directors"), ("composer", "Composers"), ("producer", "Producers"), ("narrator", "Hosts and narrators"), ("host", "Hosts and narrators"), ("actor", "Actors")):
            if r in roles:
                return label
        cats = d.get("categories") or []
        for c, label in (("people/crew", "Crew"), ("people/scholars-historians", "Scholars and historians"), ("people/family", "Family and friends"),
                         ("people/inspired-creators", "Inspired creators"), ("people/fans", "Fans and champions"), ("people/voice-actors", "Voice actors")):
            if c in cats:
                return label
        if any(qd.get("person") == d.get("name") for qd in DB.get("quotes", {}).values()):
            return "Admirers and influenced artists"
        return "Actors" if CREDITS and any(role == "acted in" for role, _, _ in CREDITS.get(d.get("name"), [])) else "Other people"
    if col == "connections":
        return CONN_SUB.get(d.get("kind"), "Other links")
    if col == "essays":
        if d.get("kind") == "review" and d.get("review_type"):
            return REVIEW_SUB.get(d.get("review_type"), "Reviews")
        return ESSAY_SUB.get(d.get("kind"), "Other writing")
    if col == "quotes":
        return "Quotes"
    if col == "archives":
        return "Archives and collections"
    if col == "organizations":
        return "Organizations"
    return ""


DISPATCH = {"series": a_series, "episodes": a_episode, "films": a_film, "connections": a_connection, "people": a_person, "characters": a_character,
            "quotes": a_quote, "locations": a_location, "songs": a_song, "radio": a_radio, "podcasts": a_podcast,
            "books": a_book, "comics": a_comic, "magazines": a_magazine, "essays": a_essay, "archives": a_archive, "works": a_work, "organizations": a_organization}


def assess_all() -> dict[str, dict]:
    out = {}
    for col, recs in DB.items():
        fn = DISPATCH.get(col)
        if not fn:
            continue
        for rid, d in recs.items():
            key = f"{col}/{rid}"
            a = fn(rid, d)
            if d.get("duplicate_of"):
                a["recommendation"] = "exclude"
                a["reason"] = f"Duplicate of {d['duplicate_of']}; the other record is kept. This one stays hidden so the importer does not recreate it."
            a["title"] = display_title(col, rid, d)
            a["subcategory"] = subcategory(col, rid, d)
            a["sort"] = sort_key(d.get("title") or d.get("name") or d.get("person") or a["title"]) if col != "connections" else sort_key(a["title"])
            a.update(OVERRIDE.get(key) or {})
            a["connection"] = re.sub(r"\s+", " ", a["connection"]).strip()
            out[key] = a
    return out


def main() -> int:
    out = assess_all()
    OUT.parent.mkdir(parents=True, exist_ok=True)
    OUT.write_text(json.dumps(dict(sorted(out.items())), indent=1, ensure_ascii=False) + "\n", encoding="utf-8")
    counts = defaultdict(int)
    for a in out.values():
        counts[a["recommendation"]] += 1
    print(f"Wrote {OUT.relative_to(ROOT)}: {len(out)} records, " + ", ".join(f"{v} {k}" for k, v in sorted(counts.items())))
    return 0


if __name__ == "__main__":
    sys.exit(main())
