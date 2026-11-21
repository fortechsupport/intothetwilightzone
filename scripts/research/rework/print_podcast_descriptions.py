#!/usr/bin/env python3
"""Fill empty descriptions for books, magazines and podcasts (Nov 2026 rework). Own words; facts that
could not be checked are stated as unverified rather than guessed."""
import datetime, re
from pathlib import Path
import yaml
C = Path("src/content")
BOOKS = {
 "b-c-strikes-back": "A 1970s collection of Johnny Hart's B.C. comic strips. The original spreadsheet credits Rod Serling as co-author, which research could not confirm; any Serling contribution (such as an introduction) still needs checking. Not Twilight Zone material.",
 "diary-of-a-nerd-volume-3-diary-of-super-hero-the-twilight-zone": "A children's book in Philip Osbourne's Diary of a Nerd series whose subtitle borrows the phrase \"The Twilight Zone\". Nothing indicates it is about the show.",
 "george-clayton-johnson-fictioneer-from-oceans-eleven-through-the-twilight-zone-to-logans-run": "Vivien Cooper's biography of George Clayton Johnson, who wrote \"A Game of Pool\", \"Nothing in the Dark\" and \"Kick the Can\" for the original series and co-wrote the novel Logan's Run.",
 "memo-to-the-twilight-zone-personal-reflections-on-all-five-seasons": "Ken Ardizzone's personal essays on every season of the original series. It appears to be self-published; no library catalogue record was found.",
 "my-mystical-life-with-rod-serling-a-real-twilight-zone": "A memoir by filmmaker Raul daSilva about his association with Rod Serling and the coincidences he connects to him. No independent source has been checked yet.",
 "patterns-four-television-plays-with-the-authors-personal-commentaries": "Rod Serling's 1957 collection of four of his live-television plays (Patterns, The Rack, Old MacDonald Had a Curve and Requiem for a Heavyweight), with his own commentary on writing for television. It predates The Twilight Zone and shows the dramatist Serling was before it.",
 "reimagining-the-twilight-zone-a-young-fans-stories": "Short stories by Elayne Zalis that retell or riff on Twilight Zone episodes from a young fan's point of view. Probably self-published fan fiction.",
 "requiem-for-a-heavyweight-and-other-plays-tragedy-in-a-temporary-town-the-white-cane-and-the-elevator": "An anthology of live-television plays that includes Serling's Requiem for a Heavyweight alongside plays by other writers (Reginald Rose's Tragedy in a Temporary Town among them). Serling's pre-Twilight Zone work.",
 "rod-serlings-night-gallery-reader": "An anthology edited by Carol Serling and Martin H. Greenberg of the short stories that Night Gallery adapted, by writers such as H. P. Lovecraft, Fritz Leiber and Basil Copper.",
 "sci-fi-tv-from-the-twilight-zone-to-deep-space-nine": "James Van Hise's survey of American science-fiction television from the late 1950s to the early 1990s, which opens with The Twilight Zone.",
 "submitted-for-your-approval-volume-1": "A 2015 collection whose listed publisher, Rod Serling Books, and contents could not be verified; Barnes & Noble credits Anne Serling. Check before publishing.",
 "the-gospel-according-to-science-fiction-from-the-twilight-zone-to-the-final-frontier": "Gabriel McKee's study of religious ideas in science fiction, which uses The Twilight Zone as one of its main examples. Only part of the book is about the show.",
 "the-new-twilight-zone-21-tales-by-the-greatest-sci-fi-and-dark-fantasy-writers-of-our-time": "An anthology edited by Martin H. Greenberg of new stories in the Twilight Zone tradition, published under license from Carol Serling.",
 "the-twilight-zone-and-philosophy-a-dangerous-dimension-to-visit": "A 2018 volume in Open Court's Popular Culture and Philosophy series, edited by Heather L. Rivera and Alexander E. Hooke, in which philosophers use episodes to discuss free will, identity, ethics and reality.",
 "the-twilight-zone-coloring-book": "An unlicensed, self-published coloring book that uses the show's name. Low reference value.",
 "the-twilight-zone-complete-stories": "An omnibus of Rod Serling's prose adaptations of his own episodes (the stories first published in Stories from the Twilight Zone and its sequels). The listed 1963 date is impossible for TV Books; the edition is probably from 1998.",
 "the-twilight-zone-dots-lines-swirls-coloring-book": "A templated, self-published pattern coloring book that uses the show's name. Low reference value.",
 "the-twilight-zone-essential-guide": "A short guide of uncertain authorship that appears to be self-published or machine-generated; compare The Twilight Zone Ultimate Guide.",
 "the-twilight-zone-faq-all-thats-left-to-know-about-the-fifth-dimension-and-beyond": "Dave Thompson's 2015 entry in the Applause FAQ series: a fact-packed history of the original series, its makers, the revivals and the wider franchise.",
 "the-twilight-zone-haiku": "A small-press book of haiku about Twilight Zone episodes, co-written by Tom Elliot, host of The Twilight Zone Podcast.",
 "the-twilight-zone-omnibus-vol-1": "A 1998 Amereon hardcover listed under Rod Serling's name. Its contents could not be verified; it is probably a reprint of one of Serling's story collections.",
 "the-twilight-zone-retrospective": "A title credited to James Forster for which no catalogue record was found; probably a low-quality self-published book.",
 "the-twilight-zone-revisited-and-reviewed-volume-i-analysis-and-critique-of-all-36-episodes-of-season-one": "Ken Ardizzone's episode-by-episode critique of the original series' first season. It appears to be self-published.",
 "the-twilight-zone-room-2426": "The teleplay by Jeremy Bertrand Finch and Paul Chitlik for \"Room 2426\", a 1989 episode of the 1985 revival's syndicated third season. Publisher and year not yet verified.",
 "the-twilight-zone-stranger-in-possum-meadows": "The teleplay by Jeremy Bertrand Finch and Paul Chitlik for \"Stranger in Possum Meadows\", a 1989 episode of the 1985 revival's syndicated third season. Publisher and year not yet verified.",
 "the-twilight-zone-the-complete-episode-guide": "A self-published 2021 episode guide by Nick Naughton.",
 "the-twilight-zone-the-crossing": "Ralph Phillips's script for \"The Crossing\", a 1988 episode of the 1985 revival's third season. It is not yet confirmed that a print edition exists.",
 "the-twilight-zone-the-trunk": "The teleplay by Jeremy Bertrand Finch and Paul Chitlik for \"The Trunk\", a 1988 episode of the 1985 revival's third season. Publisher and year not yet verified.",
 "the-twilight-zone-trivia-for-fans-questions-and-answer-about-the-twilight-zone-for-ultimate-fans": "A templated, self-published trivia book.",
 "the-twilight-zone-ultimate-guide": "A short guide of uncertain authorship that appears to be self-published or machine-generated, possibly a duplicate of The Twilight Zone Essential Guide.",
 "the-ultimate-twilight-zone-word-search-puzzle-book": "A self-published word-search puzzle book built on episode titles, characters and cast names.",
 "twists-in-the-twilight-unlock-the-twilight-zones-secrets-how-to-craft-unforgettable-twist-endings": "A writing guide on twist endings that uses the show as its hook. It appears to be self-published, possibly machine-generated.",
 "writing-for-the-twilight-zone": "George Clayton Johnson's 1980 Outré House volume of his Twilight Zone scripts, with his own account of writing for the series.",
}
def podcast(d):
    hosts = [h.strip("& ").strip() for h in d.get("hosts") or [] if h.strip("& ").strip()]
    who = hosts[0] if len(hosts) == 1 else (", ".join(hosts[:-1]) + " and " + hosts[-1] if hosts else "")
    fe = str(d.get("first_episode") or "")
    when = datetime.date.fromisoformat(fe).strftime("%B %Y") if re.match(r"^\d{4}-\d{2}-\d{2}$", fe) else fe
    t = d["title"]; low = t.lower()
    if "85" in t: what = "A fan podcast devoted to the 1985 revival of The Twilight Zone"
    elif "queer" in low: what = "A fan podcast that discusses The Twilight Zone from a queer perspective"
    elif "highlight zone" in low: what = "A podcast on The Twilight Zone from Game Informer editors"
    else: what = "An independent fan podcast that discusses episodes of The Twilight Zone"
    s = what + (f", hosted by {who}" if who else "") + (f", with its first episode in {when}" if when else "") + "."
    return s + " Its name and RSS feed are listed; how many episodes it covers has not been checked."
def magazine(d, stem):
    if stem.startswith("the-twilight-zone-magazine-"):
        n = stem.rsplit("-", 1)[1]
        return (f"Issue {n} of Rod Serling's The Twilight Zone Magazine ({d.get('cover_date')}), the horror and fantasy fiction magazine "
                "published by TZ Publications from 1981 to 1989 under license from Carol Serling. Each issue mixed new short fiction "
                "with interviews, film and book coverage and Twilight Zone history; this issue's contents are on the linked ISFDB page.")
    if "famous-monsters" in stem:
        return "An issue of the revived Famous Monsters of Filmland listed in the original spreadsheet for its Twilight Zone coverage; the coverage has not been verified."
n = 0
for col in ("books", "magazines", "podcasts"):
    for f in sorted((C / col).glob("*.yaml")):
        d = yaml.safe_load(f.read_text())
        if d.get("description") or d.get("duplicate_of"): continue
        desc = BOOKS.get(f.stem) if col == "books" else magazine(d, f.stem) if col == "magazines" else podcast(d)
        if not desc: print("none", col, f.stem); continue
        d["description"] = desc; f.write_text(yaml.safe_dump(d, sort_keys=False, allow_unicode=True, width=110)); n += 1
print("changed", n)
