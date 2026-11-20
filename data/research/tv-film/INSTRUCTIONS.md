# Shared research rules (Twilight Zone fan site, non-commercial "living history")

Tools: use WebSearch and WebFetch. curl/Bash cannot reach the internet. Good sources: Wikipedia episode list
and season pages, IMDb, TV Guide, the Twilight Zone Wiki (fandom), Twilight Zone Vortex blog, ISFDB (for
source stories), official studio/press pages, interviews, reputable press (Variety, THR, AV Club, Vulture,
Den of Geek, Screen Rant only for creator quotes they cite).

Rules:
1. Accuracy first. Never guess. If a fact is not confirmed by a source you read, leave the field null.
2. Every record needs at least one `sources` entry with a real URL you actually fetched or saw in search results.
3. Synopses: write ORIGINAL prose in your own words, 25-55 words, present tense, spoiler-light (set up the
   premise; do not reveal the final twist). Never copy or closely paraphrase a sentence from any source.
4. No images, no long quotes (a quote max 400 chars and only with a source).
5. Write your output as a single valid JSON file at the path given in your task (use the Write tool),
   then reply with a short report: counts, anything you could not verify, any conflicts you found with
   the spreadsheet data, and any franchise aspects you noticed that seem missing from the site.
6. Use exact name strings for people as credited (e.g. "Rod Serling", "Charles Beaumont").
