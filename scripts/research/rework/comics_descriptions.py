#!/usr/bin/env python3
"""Fill empty descriptions for Gold Key, Dell, Whitman and other comic records (Nov 2026 rework)."""
import re, datetime
from pathlib import Path
import yaml
C = Path("src/content/comics")
contents = {}
for line in Path("scripts/research/rework/goldkey_contents.txt").read_text().splitlines():
    if not line.strip() or line.startswith("#"): continue
    n, stories, cover, notes = [x.strip() for x in line.split("|")]
    contents[int(n)] = (stories, cover, notes)
def MONTH(s):
    s = str(s or "")
    if re.match(r"^\d{4}-\d{2}", s): return datetime.date(int(s[:4]), int(s[5:7]), 1).strftime("%B %Y")
    return s
MANUAL = {
    "planet-of-the-apes-visionaries": "BOOM! Studios' 2018 graphic novel adapting Rod Serling's original, unfilmed draft screenplay for Planet of the Apes, drawn by Chad Lewis and adapted by Dana Gould. It shows the film as Serling first imagined it, with a modern ape city and a different ending.",
}
n_changed = 0
for f in sorted(C.glob("*.yaml")):
    d = yaml.safe_load(f.read_text())
    if d.get("description"): continue
    pub, title = d.get("publisher", ""), d.get("title", "")
    desc = MANUAL.get(f.stem)
    m = re.search(r"#\s*(\d+)", title)
    if not desc and pub == "Gold Key Comics" and m:
        n = int(m.group(1)); date = MONTH(d.get("cover_date"))
        head = f"Issue {n} of Gold Key's licensed Twilight Zone anthology comic ({date})" if date else f"Issue {n} of Gold Key's licensed Twilight Zone anthology comic"
        if n in contents:
            stories, cover, notes = contents[n]
            cov = "" if cover == "painted" else (f", with a painted cover by {cover}" if cover[0].isupper() and " " in cover and not cover.startswith("painted") else f", with a cover {cover}")
            desc = f"{head}{cov}. Stories: {stories}."
            if notes: desc += f" Note: {notes[0].upper() + notes[1:]}."
            d.setdefault("sources", []).append({"title": "MyComicShop: Twilight Zone (1962 Gold Key) issue listing with contents", "url": "https://www.mycomicshop.com/search?TID=193921"})
        else:
            desc = f"{head}. Gold Key's title ran from 1962 to 1982, with new stories in the show's spirit framed by a drawn Rod Serling host; this issue's contents are not yet recorded here (see the Grand Comics Database link)."
    elif not desc and pub == "Dell Comics":
        desc = f"One of the four Twilight Zone comics Dell published in 1961-1962 (this one dated {MONTH(d.get('cover_date'))}), before the packager Western Publishing moved the license to its own new Gold Key imprint. Like the later Gold Key run, it carries new stories rather than adaptations of episodes."
    elif not desc and pub == "Whitman Comics":
        desc = f"Issue {m.group(1) if m else ''} ({MONTH(d.get('cover_date'))}), from the end of Western Publishing's run, issued under its Whitman label, which Western used for comics sold in bagged multi-packs. It continues the Gold Key Twilight Zone numbering."
    elif not desc and "Bloomsbury" in pub:
        ep = title.split(":", 1)[-1].strip()
        desc = f"A graphic-novel adaptation of Rod Serling's teleplay for “{ep}”, part of the 2008-2009 series of officially licensed Twilight Zone adaptations from Walker & Company (Bloomsbury), each written by Mark Kneece and drawn by a different artist, with the original script reprinted."
    elif not desc and pub == "Cayuga Productions":
        desc = "A small promotional mini comic published under Cayuga Productions, Rod Serling's production company and the show's original copyright holder. Its contents have not been verified."
    if not desc: print("no desc", f.stem); continue
    d["description"] = desc
    f.write_text(yaml.safe_dump(d, sort_keys=False, allow_unicode=True, width=110)); n_changed += 1
print("changed", n_changed)
