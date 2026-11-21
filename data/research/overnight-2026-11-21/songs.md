# Songs worker report (PKG songs), 2026-11-21

## Summary
- 75 unclassified (non-duplicate) song records in scope. 10 updated with confirmed findings, 5 new records added, 60 left unchanged (not reached or checks failed at the fetch level).
- Web use: 25/25 WebFetch (budget spent), about 50 WebSearch. The search tool returned titles and URLs only, no snippets, so a lyric check needed a fetch every time.

## Updated (10)
| id | result |
|---|---|
| ice-cube-ghetto-horror-show | lyric-mention (idiom). **Artist corrected** to Mack 10 feat. Jayo Felony and Ice Cube; phrase is in Mack 10's verse. |
| kid-cudi-m3tamorphosis | lyric-mention (idiom). **Artist corrected** to Playboi Carti feat. Kid Cudi; Whole Lotta Red, 2020. Phrase is in Carti's verse. |
| mf-doom-go-with-the-flow | lyric-mention: names Rod Serling (middle verse). |
| loudon-wainwright-living-alone | lyric-mention: watching Twilight Zone reruns (verse 5). Artist set to Loudon Wainwright III. |
| john-entwistle-sleeping-man | lyric-mention (idiom); Too Late the Hero, 1981. |
| tech-n9ne-strangeland | lyric-mention: verse 3 asks if he's in the Twilight Zone; 2011. |
| vanilla-ice-get-loose | lyric-mention: direct mention. |
| kid-rock-killin-brain-cells | lyric-mention: names the show and Rod Serling. |
| chamillionaire-go-hard | lyric-mention: lyric text includes a Twilight Zone theme cue plus "Twilight zone". |
| morose-code-willoughby | stays unclassified, tagged no-tz-link-found; Bandcamp page has no lyrics or notes; artist set to Morose Code (Columbus, Ohio), 2022. Recommend exclude. |

Lyric checks used letras.mus.br, vagalume.com.br and muztext.com (Genius and AZLyrics are blocked). Tags `lyric-idiom` and `serling-mention` mark idiom-only uses and Serling name-checks. `artist-corrected` marks the two credit fixes.

## New (5), all WhoSampled sample listings (seen as search-result titles, as WhoSampled refuses fetches)
- world-class-wreckin-cru-planet (title-sequence theme; early Dr. Dre group)
- unkle-unkle-main-title-theme (TV promo)
- killah-priest-the-seer-the-poet (clip "The Devil's All Around Us"; episode unidentified)
- the-buggers-the-bugger-groove (clip "There Is a Sixth Dimension")
- shanti-and-deedrah-twilight-zone (Season 3 intro)
No album/year set on these; none confirmed.

## Tried but not resolved (checks failed, not negative; left unchanged)
- dennis-deyoung-little-did-we-know: letras slug fell back to another song; search found nothing usable. Lead: 26 East Vol. 1/2 coverage (michaelsrecordcollection.substack.com post on his final album).
- e-40-zombie: letras slug fell back ("Personal"), vagalume 404.
- the-roots-new-years-eve-polka-5-4-3-2-1, wc-put-on-tha-set: vagalume 404; no lyric URL found.
- warren-haynes-twilight-zone, gary-portnoy-alien: search found no trace of these titles. Possible unverified-existence, but not tagged because the searches were weak.
- thirsty-merc-thats-when-i-think-of-you: letras slug fell back to another Thirsty Merc song. Lead: this is probably the 1927 song (1988); check its lyric and the George White Group row together.
- moses-pelham-twilight-zone: almost certainly a duplicate of moses-p-twilight-zone (recommended exclude in the overrides; duplicate_of not set, so confirm first).
- lisa-brokop-when-you-get-to-be-you: the song exists (Wikipedia has an article); lyric not checked. Letras print URL lead: https://www.letras.mus.br/lisa-brokop/582647/print.html (may be another song).
- Billy Creepshow, The Ideals, Rise From Your Grave, Levana, Mila Jam, Ky Armani: searches returned nothing relevant.

## Not reached (about 50)
All other obscure rows (Amphabian, Anthony Bieler, ASD Band, B.L.A.K, Banaroo, Brett Sekoya, Brian Derba, CDM Project, Clipma, Cotton Brain, Da Band, Davey Dips, Drew Anton, Electrik Emblem, Freedom Fry, Huycat, J Rock, James K. Agostino, Jim Cooney, Jim Kroft, Joe Goodson, Jolaade, Jona, King Tune, Lacobra, Larry Zanier, LilAce, Lilies of Megiddo, New World Revolution, NMSXS, Paleshifter, Paul Wilcock, Peboop Jimdog, POLARBOY, Quinston Pugh, Sahera, Sci-Fi Godfather, Solo Jones, Sophie Naglik, Spoken Nerd, The Effex, The Gubs, The Limes, The Revenants, The Rudy Schwartz Project, The Strange Hours, Witheren, Wolf, Z Channel).
These are mostly self-released tracks; the web search engine here does not index Bandcamp, SoundCloud or Spotify well. A later pass needs a fresh fetch budget: for each one, open the Bandcamp/Spotify page or a letras slug and check the lyric.

## Method notes for the next pass
- letras.mus.br slug guesses fail quietly: the site falls back to another song by the same artist. Always check the returned title. vagalume.com.br works for some artists and 404s for others. muztext.com worked twice.
- WhoSampled cannot be fetched, but its sample-page titles in search results state the sampled scene, which is enough as a medium-confidence source. Searches restricted to whosampled.com for "scene in The Twilight Zone" mostly return songs already in the collection, so the theme-sample coverage is now close to complete.
- Schema: no changes needed. Existing records use a `subtype: sample` key that is not in the songs schema; I used the `sample` tag instead.
