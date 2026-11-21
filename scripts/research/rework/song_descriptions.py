#!/usr/bin/env python3
"""Fill empty song descriptions (Nov 2026 rework). Facts are from the sources noted per entry or from the
original spreadsheet's classification; anything unchecked is labelled unverified, never guessed."""
from pathlib import Path
import yaml
C = Path("src/content/songs")
TZWIKI = {"title": "Twilight Zone Wiki: Audio recordings with references to The Twilight Zone",
          "url": "https://twilightzone.fandom.com/wiki/Audio_recordings_with_references_to_The_Twilight_Zone"}
# key: (description, tz_connection or None, extra source or None, research_confidence)
M = {
 "bernard-herrmann-the-twilight-zone-1959": ("Bernard Herrmann's original main and end title music, used for the first season of the original series (1959-60) before CBS replaced it with the Marius Constant theme.", None, None, "high"),
 "marius-constant-the-twilight-zone-1959": ("The theme everyone knows: two short library cues by French composer Marius Constant, \"Etrange 3\" and \"Milieu 2\", which CBS joined together as the main title from the second season (1960) onward.", None, {"title": "Wikipedia: Marius Constant", "url": "https://en.wikipedia.org/wiki/Marius_Constant"}, "high"),
 "grateful-dead-the-twilight-zone-1985": ("The Grateful Dead's rearrangement of the Constant theme for the 1985 CBS revival, recorded with Merl Saunders, who also scored episodes; the band also contributed incidental music.", None, None, "medium"),
 "jonathan-davis-the-twilight-zone-2002": ("The main title of the 2002 UPN revival, a new arrangement of the theme by Korn singer Jonathan Davis.", None, None, "medium"),
 "jerry-goldsmith-twilight-zone-the-movie-1983": ("Jerry Goldsmith's score for Twilight Zone: The Movie (1983). Goldsmith had scored original-series episodes such as \"The Big Tall Wish\" and \"Back There\", and his score opens with a version of the Constant theme.", None, None, "medium"),
 "marco-beltrami-the-twilight-zone-2019": ("Marco Beltrami's music for the 2019 Jordan Peele revival on CBS All Access, including its reworking of the classic theme.", None, None, "medium"),
 "rush-the-twilight-zone": ("Rush's tribute to the show, the third track on 2112 (1976) and its first single, dedicated to the memory of Rod Serling. Neil Peart based its two verses on \"Will the Real Martian Please Stand Up?\" and \"Stopover in a Quiet Town\".", "reference", {"title": "Wikipedia: The Twilight Zone (Rush song)", "url": "https://en.wikipedia.org/wiki/The_Twilight_Zone_(Rush_song)"}, "high"),
 "golden-earring-twilight-zone": ("Golden Earring's 1982 hit from Cut, written by George Kooymans. It borrows the show's name for a spy-on-the-run story inspired by Robert Ludlum's novel The Bourne Identity, not by the series.", "reference", {"title": "Songfacts: Twilight Zone by Golden Earring", "url": "https://www.songfacts.com/facts/golden-earring/twilight-zone"}, "high"),
 "big-audio-dynamite-dial-a-hitman": ("A track from No. 10, Upping St. (1986) whose lyric has the narrator hiring \"a hitman from the twilight zone\".", "lyric-mention", TZWIKI, "high"),
 "epmd-strictly-business": ("EPMD's 1988 title track; a lyric announces that the listener is entering \"the dimension called the Twilight Zone\", and the Mantronik remix appeared on the Blade soundtrack.", "lyric-mention", TZWIKI, "high"),
 "the-manhattan-transfer-twilight-zone-twilight-tone": ("The Manhattan Transfer's 1979 single from Extensions, produced by Jay Graydon, which opens by quoting the show's famous guitar motif and turns the Twilight Zone into a disco-era dance-floor dream.", "theme", None, "medium"),
 "2-unlimited-twilight-zone": ("2 Unlimited's 1992 Eurodance hit from Get Ready!, which uses the show's name in its title and chorus as a metaphor for the trance of the dance floor.", None, None, "medium"),
 "iron-maiden-twilight-zone": ("Iron Maiden's 1981 single (added to the US edition of Killers), sung by the ghost of a man trying to reach the woman he loved. It borrows the show's name for its title.", "reference", None, "medium"),
 "ariana-grande-twilight-zone": ("A track from Ariana Grande's 2019 album thank u, next that uses the Twilight Zone as an image for the disorienting end of a relationship.", "reference", None, "medium"),
 "ministry-twilight-zone": ("Ministry's 2018 track from AmeriKKKant, a political song that uses the show's name for a nation that seems to have slipped into another dimension.", None, None, "medium"),
 "rockwell-somebodys-watching-me": ("Rockwell's 1984 paranoia hit (with Michael Jackson singing the chorus). The original research lists a lyric mention of the Twilight Zone.", None, None, "medium"),
}
done = 0
for f in sorted(C.glob("*.yaml")):
    d = yaml.safe_load(f.read_text())
    if d.get("description") or d.get("duplicate_of"): continue
    title, artist, tzc = d.get("title", ""), d.get("artist", ""), d.get("tz_connection")
    if f.stem in M:
        desc, newc, src, conf = M[f.stem]
        if newc: d["tz_connection"] = newc
        if src: d.setdefault("sources", []).append(src)
        d["research_confidence"] = conf
    else:
        has = "twilight" in title.lower() or "zone" in title.lower()
        album = f" from {d['album']}" if d.get("album") else ""
        year = f" ({d['year']})" if d.get("year") else ""
        if tzc == "lyric-mention":
            desc = f"A song by {artist}{album}{year}. The original research lists it for a lyric that mentions the Twilight Zone; the exact line has not yet been checked against a lyric source."
        elif tzc == "reference":
            desc = f"A song by {artist}{album}{year} that the original research lists as referring to The Twilight Zone; the nature of the reference has not yet been checked."
        elif has:
            desc = f"A song by {artist} whose title borrows the show's name. It has not been checked whether the song itself refers to the series or only uses the phrase."
        else:
            desc = f"A song by {artist} listed in the original research with no stated Twilight Zone connection. The tie is probably a lyric line or sample, but it has not been verified."
        d["research_confidence"] = "low"
    d["description"] = desc
    f.write_text(yaml.safe_dump(d, sort_keys=False, allow_unicode=True, width=110)); done += 1
print("changed", done)
