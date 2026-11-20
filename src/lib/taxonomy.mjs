// The site's category structure: Adam's list of top-level categories and subcategories, plus
// categories added during research (flagged `isNew` so Adam can remove them). Every record is
// placed by the rules in `place()` below; a record's own `categories: ["cat/sub"]` adds more.
// Plain JavaScript so both the Astro build and the review-sheet export (scripts/taxonomy-export.mjs)
// use the same rules. All copy is our own words; keep facts conservative.

/** @typedef {{ slug: string, title: string, blurb: string, intro?: string, isNew?: boolean, order?: 'az' | 'chrono' }} Sub */
/** @typedef {{ slug: string, title: string, isNew?: boolean, description: string, intro: string[], connection: string, subs: Sub[], seeAlso?: [string, string][] }} Category */

/** @type {Category[]} */
export const TAXONOMY = [
  {
    slug: 'people',
    title: 'People',
    description: 'The writers, directors, actors, narrators, composers, crew, characters and admirers of The Twilight Zone.',
    intro: [
      "The Twilight Zone was Rod Serling's show, but it was made by a remarkable group: the writers Charles Beaumont, Richard Matheson and George Clayton Johnson; the producers Buck Houghton, Herbert Hirschman, Bert Granet and William Froug; composers including Bernard Herrmann, Jerry Goldsmith and Fred Steiner; and a cast list that runs from silent-era veterans to future stars such as Robert Redford, William Shatner and Burt Reynolds.",
      'The revivals added their own: Wes Craven, Harlan Ellison and Philip DeGuere in 1985, Forest Whitaker as host in 2002, Jordan Peele in 2019, and Stacy Keach as the voice of the radio dramas. This section also gathers the characters the stories made famous and the writers and filmmakers who say the show shaped them.',
    ],
    connection: 'Everyone here has a credit on the franchise, worked with Serling on Night Gallery or elsewhere, is a character from the stories, or has spoken publicly about what the show meant to them. Each person page lists every credit we hold, with links.',
    seeAlso: [['Rod Serling', '/rod-serling/']],
    subs: [
      { slug: 'actors', title: 'Actors', blurb: 'Everyone who appeared on screen in a Twilight Zone series or film.', intro: 'The original series cast character actors and stars alike, often against type; the revivals continued the habit. Each name links to every role they played across the franchise.' },
      { slug: 'characters', title: 'Characters', blurb: 'Talky Tina, the Kanamits, Henry Bemis and the other figures the stories made famous.', isNew: false, intro: "Some of the show's characters outgrew their episodes: the doll who says \"My name is Talky Tina, and I'm going to kill you,\" the gremlin on the wing, the last man with time enough at last. Each entry names who played them and where they appear." },
      { slug: 'composers', title: 'Composers', blurb: 'The composers behind the themes and scores.', intro: 'CBS commissioned original scores for many episodes and drew the rest from its music library, so the show carries work by Bernard Herrmann, Jerry Goldsmith, Fred Steiner, Nathan Van Cleave and Marius Constant, whose library cues became the famous theme.' },
      { slug: 'crew', title: 'Crew', blurb: 'Cinematographers, editors, make-up and effects artists, story editors and other crew.', intro: "The look of the show came from people who rarely get named: cinematographer George T. Clemens, make-up artist William Tuttle, and the MGM art department that turned backlot streets into Maple Street and Willoughby." },
      { slug: 'directors', title: 'Directors', blurb: 'Everyone who directed an episode, segment or film.', intro: 'The original series used many directors from film and live television, among them John Brahm, Douglas Heyes, Buzz Kulik, Richard Donner, Lamont Johnson and Don Siegel. The film brought in John Landis, Steven Spielberg, Joe Dante and George Miller.' },
      { slug: 'family', title: 'Family', blurb: "Rod Serling's family, who have kept his work alive.", intro: "Carol Serling licensed and championed the franchise for decades after her husband's death; their daughters Jodi and Anne have written and spoken about him." },
      { slug: 'fans', title: 'Fans and admirers', blurb: 'Writers, filmmakers and performers who have said in public what the show means to them.', intro: 'Stephen King, Steven Spielberg, Jordan Peele, Guillermo del Toro, Vince Gilligan and many others have said the show shaped how they tell stories. Each name links to their sourced quotes.' },
      { slug: 'inspired-creators', title: 'Creators it inspired', blurb: 'Artists whose work credits The Twilight Zone as an influence.', isNew: true, intro: 'Creators with a documented link between their own work and the show, beyond a single quote.' },
      { slug: 'narrators-hosts', title: 'Narrators and hosts', blurb: "Rod Serling and those who followed him in the narrator's role.", intro: 'Serling opened and closed almost every original episode. Charles Aidman narrated the 1985 revival (with Robin Ward in syndication), Forest Whitaker hosted in 2002, Jordan Peele in 2019, and Stacy Keach voiced the radio dramas.' },
      { slug: 'producers', title: 'Producers', blurb: 'Producers, executive producers and developers.', intro: "Serling's company Cayuga Productions made the original series with CBS; Buck Houghton produced the first three seasons. Later producers include Philip DeGuere (1985), Ira Steven Behr (2002), and Simon Kinberg and Win Rosenfeld with Peele (2019)." },
      { slug: 'scholars-historians', title: 'Scholars and historians', blurb: 'The people who documented the show: historians, biographers and critics.', intro: 'Marc Scott Zicree, Martin Grams Jr., Gordon F. Sander, Tony Albarella and others did the research most later writing relies on.' },
      { slug: 'voice-actors', title: 'Voice actors', blurb: 'The casts of The Twilight Zone Radio Dramas and other audio work.', intro: 'The radio dramas cast film and television actors in the leads, with Stacy Keach in Serling\'s narrator role. Each name links to every part they voiced.' },
      { slug: 'writers', title: 'Writers', blurb: 'Teleplay writers and the authors of the stories the episodes adapt.', intro: 'Serling wrote 92 of the 156 original episodes. Charles Beaumont, Richard Matheson and George Clayton Johnson wrote most of the rest, and the show adapted stories by writers such as Ray Bradbury, Lucille Fletcher, Jerome Bixby and Damon Knight.' },
      { slug: 'other-people', title: 'Other people', blurb: 'People connected to the franchise in other ways.', intro: 'People whose role does not fit another group yet.' },
    ],
  },
  {
    slug: 'places',
    title: 'Places',
    description: 'Real places tied to The Twilight Zone, from MGM backlots to Rod Serling\'s hometown, and the fictional places of its stories.',
    intro: [
      "The original series was made almost entirely at MGM in Culver City, on soundstages and the backlot streets that stood in for small-town America, with location trips to Death Valley, Lone Pine and the Malibu coast. The revivals moved north to Vancouver and Toronto. Serling's own story runs from Syracuse and Binghamton, New York, through Antioch College and Cincinnati, to Pacific Palisades and his summer cottage on Cayuga Lake.",
      'The stories built places of their own: Willoughby, where a tired commuter steps off the train into 1888; Peaksville, Ohio, ruled by a six-year-old; Maple Street on the day the power fails. Both kinds are here.',
    ],
    connection: 'Real places are where episodes were made, where Serling lived and is remembered, or where the franchise can be visited today. In-story places are settings named in the episodes, each linked to where it appears.',
    subs: [
      { slug: 'real-life', title: 'Real-life places', blurb: 'Filming locations, backlots, Serling\'s homes, memorials, museums and attractions.', intro: 'Each place says what was filmed or happened there and whether you can still visit.' },
      { slug: 'lecture-event-venues', title: 'Lecture and event venues', isNew: true, blurb: 'Halls and campuses where Serling spoke and where Twilight Zone events are held.' },
      { slug: 'in-story', title: 'Places in the stories', blurb: 'Willoughby, Peaksville, Maple Street and the other settings of the stories.', intro: 'Fictional towns, planets and rooms from the episodes, with the episodes they appear in.' },
    ],
  },
  {
    slug: 'events',
    title: 'Events',
    description: 'Conventions, premieres, marathons, anniversaries, exhibitions, honors and the moments that shaped Twilight Zone history.',
    intro: [
      "The Twilight Zone's history is a run of events as much as episodes: its October 2, 1959 premiere on CBS, Serling's Emmy wins, cancellation and revival, the 1982 helicopter accident on the film set and the trial that followed, the New Year's marathons that introduced the show to new generations, and the anniversaries, festivals and conventions fans still hold.",
    ],
    connection: 'Every event here is part of the franchise\'s own history, honors Rod Serling or the show, or is a gathering devoted to it.',
    seeAlso: [['Timeline', '/timeline/']],
    subs: [
      { slug: 'anniversaries-festivals', title: 'Anniversaries and festivals', blurb: 'Anniversary celebrations and festivals, including Binghamton\'s Rod Serling festivals.' },
      { slug: 'broadcasts-marathons', title: 'Broadcasts and marathons', blurb: 'Notable airings, from the premiere to the holiday marathons.' },
      { slug: 'conventions', title: 'Conventions', blurb: 'Fan conventions and gatherings devoted to the show.' },
      { slug: 'exhibitions', title: 'Exhibitions', blurb: 'Museum shows and exhibits about Serling and the series.' },
      { slug: 'honors-awards', title: 'Honors and awards', blurb: 'Emmys, Hugos, halls of fame, stamps and other honors to Serling and the show.', intro: 'Serling won six Emmys, three of them before The Twilight Zone, and the show won Hugo Awards in 1960, 1961 and 1962. Later honors include the Television Academy Hall of Fame and a star on the Hollywood Walk of Fame.' },
      { slug: 'premieres', title: 'Premieres', blurb: 'Premieres of the series, revivals and films.' },
      { slug: 'production-history', title: 'Production and broadcast history', blurb: 'Dated milestones in how each series was made, scheduled and syndicated.', intro: 'From the history notes on each series and film: pilots, renewals, format changes, cancellations and syndication.' },
      { slug: 'serling-life', title: "Milestones in Rod Serling's life", isNew: true, blurb: 'Dated events in Serling\'s life, from his birth in 1924 to his death in 1975.' },
      { slug: 'other-events', title: 'Other events', blurb: 'Events that fit no other group.' },
    ],
  },
  {
    slug: 'series',
    title: 'Series',
    description: 'Every Twilight Zone series on television, radio and podcast, plus Night Gallery and the anthology series in its tradition.',
    intro: [
      'There have been four Twilight Zone television series: the original (CBS, 1959-1964), the first revival (CBS and syndication, 1985-1989), a second revival (UPN, 2002-2003) and Jordan Peele\'s (CBS All Access, 2019-2020). Serling followed the original with Night Gallery (NBC, 1969-1973).',
      'The franchise also lives on audio, in The Twilight Zone Radio Dramas from 2002, and in the many podcasts that revisit it episode by episode.',
    ],
    connection: 'The four television series and the radio dramas are the franchise itself. Night Gallery and Serling\'s other series are one step away. Fellow anthology series and podcasts are here for a specific, stated link.',
    seeAlso: [['Night Gallery guide', '/night-gallery/'], ['Episodes', '/episodes/']],
    subs: [
      { slug: 'tv', title: 'Television series', blurb: 'The four Twilight Zone series, Night Gallery, Serling\'s other series and fellow anthologies.', order: 'chrono' },
      { slug: 'radio', title: 'Radio series', blurb: 'The Twilight Zone Radio Dramas and the radio series Serling wrote for.' },
      { slug: 'podcast', title: 'Podcasts', blurb: 'Podcasts devoted to the show, most working through it episode by episode.' },
      { slug: 'international', title: 'International titles and dubs', blurb: 'The names the series went by around the world.', isNew: true, intro: 'The show was dubbed and retitled in many countries: La Dimensión Desconocida, La Quatrième Dimension, Ai confini della realtà, Unglaubliche Geschichten. Each title is sourced.' },
    ],
  },
  {
    slug: 'episodes',
    title: 'Episodes',
    description: 'Every Twilight Zone episode on television and radio, Night Gallery segment by segment, and notable podcast episodes about the show.',
    intro: [
      'The four television series total more than 300 episodes, from "Where Is Everybody?" in 1959 to the last of Jordan Peele\'s run in 2020. The radio dramas add more than 170 audio adaptations, and Night Gallery 43 episodes of one to four segments each.',
      'Listings here are alphabetical. For broadcast order, open a series page.',
    ],
    connection: 'Television and radio episodes are the franchise itself; Night Gallery is Serling\'s second anthology; podcast episodes are single episodes of other shows devoted to The Twilight Zone.',
    seeAlso: [['Original series in air order', '/series/1959/'], ['All series', '/series/tv/']],
    subs: [
      { slug: 'tv', title: 'Television episodes', blurb: 'All four series and Night Gallery, alphabetically within each series.' },
      { slug: 'radio', title: 'Radio episodes', blurb: 'The Twilight Zone Radio Dramas and Serling\'s radio plays.' },
      { slug: 'radio-original-stories', title: 'Original radio stories', isNew: true, blurb: 'Radio drama episodes written for audio rather than adapted from television.' },
      { slug: 'radio-unmade-tv-scripts', title: 'Radio versions of unmade scripts', isNew: true, blurb: 'Radio dramas made from Twilight Zone scripts that were never filmed.' },
      { slug: 'podcast', title: 'Podcast episodes', blurb: 'Single podcast episodes about the show or the 1983 film.' },
    ],
  },
  {
    slug: 'movies',
    title: 'Movies',
    description: 'Twilight Zone films, Rod Serling\'s films, documentaries, and the films linked to specific episodes.',
    intro: [
      'Warner Bros. brought the show to cinemas in Twilight Zone: The Movie (1983), four segments directed by John Landis, Steven Spielberg, Joe Dante and George Miller. CBS assembled Rod Serling\'s Lost Classics (1994) from unproduced material, and Serling himself wrote Patterns, Requiem for a Heavyweight, Seven Days in May and the first Planet of the Apes.',
      'Most entries are later films that remake, adapt, borrow from or parody an episode. Each one says what the link is and how well it is documented.',
    ],
    connection: 'Twilight Zone films are part of the franchise; Serling\'s films are one step away; linked films are here for a specific episode they draw on, stated with its evidence on the film\'s page.',
    seeAlso: [['Homages', '/homages/']],
    subs: [
      { slug: 'documentaries', title: 'Documentaries', blurb: 'Documentaries about Serling and the show.' },
      { slug: 'linked-films', title: 'Films linked to an episode', blurb: 'Feature films that remake, adapt, echo or parody a specific episode.' },
      { slug: 'rod-serling-films', title: "Rod Serling's films", blurb: 'Films and television films Serling wrote, hosted or narrated.' },
      { slug: 'unmade-projects', title: 'Unmade projects', isNew: true, blurb: 'Twilight Zone films and specials that were announced or developed but never made.' },
      { slug: 'shorts-and-other', title: 'Shorts, pilots and other screen works', blurb: 'Short films, music videos, pilots, specials and unproduced projects.' },
      { slug: 'tv-films', title: 'Television films', blurb: 'Made-for-television films.' },
      { slug: 'twilight-zone-films', title: 'Twilight Zone films', blurb: 'Official Twilight Zone films and specials.' },
    ],
  },
  {
    slug: 'music',
    title: 'Music',
    description: 'The Twilight Zone theme, its composers and scores, soundtrack releases, and the songs that name or are about the show.',
    intro: [
      "Few pieces of television music are as recognisable as The Twilight Zone's theme. The first season used a main title by Bernard Herrmann; from the second season CBS combined two short library pieces by the French composer Marius Constant, and its repeating guitar figure became shorthand for the uncanny.",
      "That motif has been covered, sampled and quoted ever since, and the show's name turns up in hundreds of lyrics and song titles, from Rush and Golden Earring to Iron Maiden and Ariana Grande.",
    ],
    connection: 'Themes and scores are part of the show itself. Songs written about it are one step away. Songs that only use the phrase "twilight zone" are tangential, and where nobody has yet checked a reference, the entry says so.',
    subs: [
      { slug: 'composers', title: 'Composers', blurb: 'The composers who scored the series and films.' },
      { slug: 'songs', title: 'Songs', blurb: 'Songs about, titled after, or mentioning the show.' },
      { slug: 'soundtracks', title: 'Soundtracks and score releases', blurb: 'Albums and releases of the scores and themes.' },
      { slug: 'theme', title: 'The theme', blurb: 'The theme music, its covers and samples.' },
    ],
  },
  {
    slug: 'reading',
    title: 'Reading',
    description: 'Books, comics, magazines, essays, articles and published scripts about The Twilight Zone and Rod Serling.',
    intro: [
      "Print is where The Twilight Zone has been studied, preserved and continued. Serling turned his teleplays into three bestselling story collections in 1960-1962; Gold Key published Twilight Zone comics for twenty years; Rod Serling's The Twilight Zone Magazine ran from 1981 to 1989; Marc Scott Zicree's The Twilight Zone Companion (1982) set the standard for episode guides; and Gauntlet Press later published Serling's complete scripts.",
      'Alongside them sit anthologies of the stories the show adapted, new licensed fiction, scholarship on its politics and craft, biographies, and a long tail of guides of uneven quality, each labelled.',
    ],
    connection: 'Everything here is about the show, reprints or adapts its scripts and source stories, continues it under license, or documents Rod Serling and Night Gallery. Self-published, unverified and duplicate titles are labelled rather than removed.',
    subs: [
      { slug: 'articles', title: 'Articles and interviews', blurb: 'Newspaper and magazine articles and interviews.' },
      { slug: 'books', title: 'Books', blurb: 'Histories, companions, story collections, novels and biographies.' },
      { slug: 'comics', title: 'Comics', blurb: 'Dell, Gold Key, Now Comics, Walker & Company, Dynamite and IDW.' },
      { slug: 'essays', title: 'Essays and scholarship', blurb: 'Journal articles, essays and book chapters.' },
      { slug: 'magazines', title: 'Magazines', blurb: 'The Twilight Zone Magazine, Night Cry and other magazines\' coverage.' },
      { slug: 'accident-and-trial', title: 'The accident and trial in print', isNew: true, blurb: 'Reporting and books on the 1982 Twilight Zone: The Movie accident and the trial.' },
      { slug: 'anniversary-coverage', title: 'Anniversary coverage', isNew: true, blurb: 'Articles marking the show\'s anniversaries.' },
      { slug: 'cast-and-crew-memoirs', title: 'Cast and crew memoirs', isNew: true, blurb: 'Memoirs by people who worked on the series and films.' },
      { slug: 'foreign-language', title: 'Foreign-language editions', isNew: true, blurb: 'Translations and books published outside English.' },
      { slug: 'serling-foundation-papers', title: 'Rod Serling Memorial Foundation publications', isNew: true, blurb: 'Journals and papers published by the foundation.' },
      { slug: 'serling-own-writing', title: "Rod Serling's own writing", isNew: true, blurb: 'Articles, essays and fiction Serling wrote himself.' },
      { slug: 'scripts', title: 'Scripts and teleplays', blurb: 'Published scripts, including Gauntlet Press\'s Serling volumes.', isNew: true },
    ],
  },
  {
    slug: 'games',
    title: 'Games',
    description: 'Twilight Zone pinball, video games, board and card games.',
    intro: [
      "Bally's The Twilight Zone pinball machine (1993), designed by Pat Lawlor, is one of the best-selling and most complex pinball tables ever made. The show has also been a board game, trivia games, computer adventures from the 1980s onward, slot machines and a virtual-reality game.",
    ],
    connection: 'Each game is either a licensed Twilight Zone product or a game that adapts or references the show, as stated on its entry.',
    subs: [
      { slug: 'board-card-games', title: 'Board and card games', blurb: 'Board, card and trivia games.' },
      { slug: 'other-games', title: 'Other games', blurb: 'Games that fit no other group.' },
      { slug: 'pinball-arcade', title: 'Pinball, arcade and slots', blurb: 'Pinball tables, arcade cabinets and slot machines.' },
      { slug: 'video-games', title: 'Video games', blurb: 'Computer, console, mobile and VR games, and appearances in other games.' },
    ],
  },
  {
    slug: 'artwork',
    title: 'Artwork',
    description: 'Posters, key art, title design, illustration and art inspired by The Twilight Zone.',
    intro: [
      "The show's look is part of its legend: the drifting eye, window and clock of the opening titles, the key art of the 1983 film, Gold Key's painted comic covers, and decades of posters and gallery work by artists who grew up with it.",
    ],
    connection: 'Each work is official art for the franchise or art that takes the show as its subject.',
    subs: [
      { slug: 'art-illustration', title: 'Art and illustration', blurb: 'Paintings, illustration and artists inspired by the show.' },
      { slug: 'other-artwork', title: 'Other artwork', blurb: 'Artwork that fits no other group.' },
      { slug: 'posters-key-art', title: 'Posters and key art', blurb: 'Official posters, key art and print art.' },
      { slug: 'title-design', title: 'Title design', blurb: 'The opening title sequences.' },
    ],
  },
  {
    slug: 'homages',
    title: 'Homages',
    description: 'Remakes, adaptations, homages, parodies and references to The Twilight Zone across film, television, music and print, with the evidence for each.',
    intro: [
      'The Twilight Zone is one of the most borrowed-from works in popular culture. The Simpsons\' "Treehouse of Horror" episodes, Futurama and countless sitcoms have parodied it, anthologies such as Black Mirror openly work in its tradition, and Jordan Peele has said his film Us grew from the episode "Mirror Image".',
      'Every link is labelled by its evidence: confirmed by the makers, documented by a published source, or noted by fans only. A resemblance is never presented as an influence.',
    ],
    connection: 'Each entry names the later work, the episode it draws on, the kind of link and the evidence for it.',
    seeAlso: [['Movies linked to an episode', '/movies/linked-films/']],
    subs: [
      { slug: 'adaptations-remakes', title: 'Adaptations and remakes', blurb: 'Official adaptations and remakes of episodes.' },
      { slug: 'homages', title: 'Homages', blurb: 'Deliberate tributes to an episode or the show.' },
      { slug: 'in-other-shows', title: 'In other shows', blurb: 'Episodes, segments and sketches of other series that adapt, spoof or reference the show.' },
      { slug: 'inspired-by', title: 'Inspired by', blurb: 'Works whose makers, or published sources, say an episode inspired them.' },
      { slug: 'parodies', title: 'Parodies', blurb: 'Spoofs and send-ups.' },
      { slug: 'references', title: 'References', blurb: 'Passing references, quotations and lyric mentions.' },
    ],
  },
  {
    slug: 'merchandise',
    title: 'Merchandise',
    description: 'Twilight Zone collectibles, toys, trading cards, home video releases and other licensed products.',
    intro: [
      'Licensed Twilight Zone products run from 1960s board games to Talky Tina replicas, Bif Bang Pow! bobbleheads, Rittenhouse trading cards, and a long line of home video releases: VHS and laserdisc collections, the Definitive Edition DVDs, and the remastered Blu-ray sets.',
      'This is a reference catalogue: nothing here is for sale, and licensed and unlicensed items are labelled.',
    ],
    connection: 'Each item is an official Twilight Zone product, a release of the series or films, or an item clearly labelled as unlicensed.',
    subs: [
      { slug: 'collectibles', title: 'Collectibles', blurb: 'Replicas, stamps and other memorabilia.' },
      { slug: 'home-media', title: 'Home video and streaming', blurb: 'VHS, laserdisc, DVD, Blu-ray and streaming releases.' },
      { slug: 'household-apparel', title: 'Household and apparel', blurb: 'Clothing, homewares and everyday goods.' },
      { slug: 'other-merchandise', title: 'Other merchandise', blurb: 'Products that fit no other group.' },
      { slug: 'toys-figures', title: 'Toys and figures', blurb: 'Action figures, bobbleheads and vinyl figures.' },
      { slug: 'trading-cards', title: 'Trading cards', blurb: 'Card sets and inserts.' },
    ],
  },
  {
    slug: 'lectures',
    title: 'Lectures',
    description: "Rod Serling's lectures and speeches, academic talks about the show, and The Twilight Zone in the classroom.",
    intro: [
      'Serling was a tireless speaker. He lectured at colleges across the country, taught writing and film at Ithaca College and Antioch, and used his speeches to argue for television as serious drama and against the censorship of sponsors. Since then the show has become a set text: its teleplays appear in school anthologies, and scholars lecture on it at conferences and universities.',
    ],
    connection: 'Each entry is a talk by Rod Serling, a lecture or course about the show, or classroom material built on it.',
    subs: [
      { slug: 'academic', title: 'Academic lectures and courses', blurb: 'University lectures, conference talks and courses about the show.' },
      { slug: 'classroom', title: 'In the classroom', blurb: 'Teleplays in school anthologies and lesson plans.' },
      { slug: 'readings-panels', title: 'Readings and panels', blurb: 'Panel discussions and public readings.' },
      { slug: 'serling-lectures', title: "Rod Serling's lectures and speeches", blurb: 'Serling speaking at colleges, award dinners and conferences.' },
    ],
  },
  {
    slug: 'reviews',
    title: 'Reviews',
    description: 'Reviews of The Twilight Zone, from 1959 newspaper notices to modern retrospectives and episode rankings.',
    intro: [
      'Critics were divided on the show at first and warmer by its second season; its reputation has grown ever since. This section gathers reviews from the original broadcasts, of each revival and of the 1983 film, together with retrospective reappraisals and the rankings that still argue over the best episode.',
    ],
    connection: 'Every review is of a Twilight Zone series, episode or film. Summaries are our own; follow the source for the text.',
    subs: [
      { slug: 'aggregate-scores', title: 'Aggregate scores', isNew: true, blurb: 'Review-aggregator scores for the series and films.' },
      { slug: 'awards-citations', title: 'Award citations', blurb: 'What juries said when they honored the show.' },
      { slug: 'contemporary', title: 'Contemporary reviews', blurb: 'Reviews written when the episode, series or film was new.' },
      { slug: 'rankings', title: 'Rankings', blurb: 'Best-of and episode-ranking lists.' },
      { slug: 'retrospective', title: 'Retrospective reviews', blurb: 'Later reappraisals.' },
    ],
  },
  // ---- Categories added during research (flagged new) ----
  {
    slug: 'advertising',
    title: 'Advertising',
    isNew: true,
    description: 'Twilight Zone sponsors, promos and trailers, print ads, and the commercials Rod Serling made.',
    intro: [
      'The original series was sold to sponsors such as General Foods, Kimberly-Clark and Liggett & Myers, and Serling promoted the next week\'s episode on camera. After the show he became one of television\'s busiest commercial voices. The revivals and the film had their own promos, trailers and print campaigns, and advertisers have parodied the show for decades.',
    ],
    connection: 'Each entry advertised the show, was made by Serling, or borrows the show\'s style in an advertisement.',
    subs: [
      { slug: 'commercials', title: 'Commercials', blurb: 'Television and radio commercials.' },
      { slug: 'print-ads', title: 'Print ads', blurb: 'Newspaper and magazine advertisements.' },
      { slug: 'promos-trailers', title: 'Promos and trailers', blurb: 'Network promos and film trailers.' },
      { slug: 'sponsors', title: 'Sponsors', blurb: 'The companies that sponsored the series.' },
    ],
  },
  {
    slug: 'archives',
    title: 'Archives and documents',
    isNew: true,
    description: 'Where the original Twilight Zone scripts, papers, recordings and production records are kept.',
    intro: [
      "Most of what we know about how The Twilight Zone was made comes from a handful of collections: Rod Serling's papers at the Wisconsin Center for Film and Theater Research and Ithaca College, the network's records, and the files of the writers and composers who worked on the show.",
      'This section lists those collections and notable single documents, what each holds, and how to reach it. Nothing here is reproduced on the site; these are pointers for researchers.',
    ],
    connection: "Each collection holds original Twilight Zone material (scripts, correspondence, recordings, call sheets) or the papers of someone who made the show. Entries say plainly when a collection's Twilight Zone content is thin.",
    subs: [
      { slug: 'collections', title: 'Collections', blurb: 'Archival collections and where they are held.' },
      { slug: 'documents', title: 'Documents', blurb: 'Notable single documents, scripts and memos.' },
    ],
  },
  {
    slug: 'community',
    title: 'Fans and resources',
    isNew: true,
    description: 'Twilight Zone fan communities, reference websites, databases and organizations.',
    intro: [
      'Fans have kept the show\'s history for decades: in fanzines and newsletters, on early web episode guides, in wikis and forums, and in organizations such as the Rod Serling Memorial Foundation. This section lists the communities and reference sites worth knowing.',
    ],
    connection: 'Each entry is a community, reference resource or organization devoted to the show or to Serling.',
    subs: [
      { slug: 'fan-communities', title: 'Fan communities', blurb: 'Forums, wikis, subreddits and fan sites.' },
      { slug: 'organizations', title: 'Organizations', blurb: 'Foundations and societies.' },
      { slug: 'websites-databases', title: 'Websites and databases', blurb: 'Reference sites, databases and official pages.' },
    ],
  },
  {
    slug: 'cultural-impact',
    title: 'Cultural impact',
    isNew: true,
    description: 'How "twilight zone" entered the language: catchphrases, the theme as shorthand, dictionary entries and public uses.',
    intro: [
      'Few television shows have changed the language. "Twilight zone" is now an ordinary phrase for anything uncanny or in-between, the four-note theme is hummed to mean "something strange is going on", and lines such as "It\'s a cookbook!" and "Time enough at last" are quoted by people who have never seen the episodes.',
    ],
    connection: 'Each entry documents a way the show\'s name, music or lines passed into general use, with a source.',
    subs: [
      { slug: 'catchphrases', title: 'Catchphrases', blurb: 'Lines and phrases from the show in everyday use.' },
      { slug: 'dictionary-rankings', title: 'Dictionaries and rankings', blurb: 'Dictionary entries and greatest-show rankings.' },
      { slug: 'public-uses', title: 'Public uses', blurb: 'Politicians, journalists and public figures invoking the show.' },
      { slug: 'theme-shorthand', title: 'The theme as shorthand', blurb: 'The theme used to signal strangeness.' },
    ],
  },
  {
    slug: 'legal-history',
    title: 'Legal history',
    isNew: true,
    description: 'The 1982 film accident and trial, rights and ownership of the franchise, credit disputes and sponsor censorship.',
    intro: [
      'The franchise has a legal history of its own. The 1982 helicopter accident on the set of Twilight Zone: The Movie killed Vic Morrow and two child actors and led to a manslaughter trial that ended in acquittals in 1987, and to changes in how film sets use children and stunts. Rights to the series passed from Cayuga Productions to CBS, with Carol Serling licensing her husband\'s name; writers disputed credits; and Serling fought sponsors over what he could say.',
    ],
    connection: 'Each entry is a legal event, dispute or rights question that directly involves the franchise or Serling\'s work.',
    subs: [
      { slug: 'censorship', title: 'Censorship', blurb: 'Sponsor and network interference with scripts.' },
      { slug: 'lawsuits', title: 'Lawsuits', blurb: 'Civil suits and plagiarism claims.' },
      { slug: 'rights-ownership', title: 'Rights and ownership', blurb: 'Who has owned and licensed the franchise.' },
      { slug: 'trials', title: 'Trials', blurb: 'Criminal trials, chiefly the Twilight Zone accident case.' },
    ],
  },
  {
    slug: 'media',
    title: 'Media library',
    isNew: true,
    description: 'Videos, audio, documents, advertisements and images about The Twilight Zone, linked where they are legitimately hosted.',
    intro: [
      'Every video, recording, document, advertisement and image attached to a record on this site, in one place. Most are links to where the rights holder or an archive hosts them; public-domain items may be kept here. Nothing copyrighted is re-hosted.',
    ],
    connection: 'Each item is attached to a record elsewhere on the site, which explains its connection to the show.',
    subs: [
      { slug: 'ads', title: 'Advertisements', blurb: 'Print and broadcast advertisements.' },
      { slug: 'audio', title: 'Audio', blurb: 'Radio, interviews and recordings.' },
      { slug: 'documents', title: 'Documents', blurb: 'Scripts, letters, articles and transcripts.' },
      { slug: 'images', title: 'Images', blurb: 'Photographs, posters and artwork.' },
      { slug: 'links', title: 'Links', blurb: 'Web pages and other resources.' },
      { slug: 'video', title: 'Video', blurb: 'Clips, interviews, promos, trailers and full programs.' },
    ],
  },
  {
    slug: 'props-collecting',
    title: 'Props and collecting',
    isNew: true,
    description: 'Surviving Twilight Zone props and costumes, auctions, museum holdings and replicas.',
    intro: [
      'Some of the original series\' props have survived the decades since MGM cleared its prop rooms, among them the Mystic Seer fortune-telling machine from "Nick of Time", which has sold at auction. Others sit in museums and private collections, and licensed replicas of pieces such as Talky Tina are made for collectors. Each entry says what is known about a piece and where the claim comes from.',
    ],
    connection: 'Each entry is a prop or costume from the franchise, a sale or holding of one, or a replica of one.',
    subs: [
      { slug: 'auctions', title: 'Auctions', blurb: 'Notable sales of props and memorabilia.' },
      { slug: 'museum-holdings', title: 'Museum holdings', blurb: 'Props and costumes held by museums.' },
      { slug: 'props-costumes', title: 'Props and costumes', blurb: 'Surviving props and costumes.' },
      { slug: 'replicas', title: 'Replicas', blurb: 'Licensed and fan-made replicas.' },
    ],
  },
  {
    slug: 'quotes',
    title: 'Quotes',
    isNew: true,
    description: 'Filmmakers, writers and performers on what The Twilight Zone meant to them, and Rod Serling in his own words.',
    intro: [
      'Stephen King, Steven Spielberg, Jordan Peele, Guillermo del Toro and many others have said in interviews and speeches that The Twilight Zone shaped how they tell stories. Here they are in their own words, with Serling\'s own remarks about his work.',
    ],
    connection: 'Every quote is exact, short, about the show or Serling, and linked to where it was said.',
    subs: [
      { slug: 'admirers', title: 'Admirers on the show', blurb: 'What other artists have said about the show.' },
      { slug: 'rod-serling', title: 'Rod Serling in his own words', blurb: 'Serling on his work.' },
    ],
  },
  {
    slug: 'stage',
    title: 'Stage and attractions',
    isNew: true,
    description: 'Twilight Zone stage adaptations, live readings, and the Tower of Terror and other attractions.',
    intro: [
      'The stories work on stage: Anne Washburn\'s adaptation played at London\'s Almeida Theatre in 2017 and the West End after, and theatre companies across America stage episodes from the published scripts. Disney\'s The Twilight Zone Tower of Terror opened at Walt Disney World in 1994, with later versions in California and Paris.',
    ],
    connection: 'Each production is licensed from or adapts the show; each attraction is a licensed Twilight Zone experience or one built on it.',
    subs: [
      { slug: 'attractions', title: 'Attractions', blurb: 'Theme park rides, escape rooms and experiences.' },
      { slug: 'live-readings', title: 'Live readings', blurb: 'Staged readings and live audio performances.' },
      { slug: 'theatre', title: 'Theatre', blurb: 'Stage plays and productions.' },
    ],
  },
];

// ---------------------------------------------------------------------------

/** Alphabetical key: ignore a leading The/A/An, quotes and punctuation; pad numbers. Matches scripts/assess.py. */
export function sortKey(title) {
  let t = String(title ?? '').replace(/^["'“‘(\[.…]+/, '').trim();
  t = t.replace(/^(the|a|an)\s+/i, '');
  t = t.toLowerCase().replace(/\d+/g, (m) => m.padStart(6, '0'));
  return t.replace(/[^a-z0-9 ]/g, '').trim();
}

export const CATEGORY = Object.fromEntries(TAXONOMY.map((c) => [c.slug, c]));

/** Categories in A-Z order (as shown in navigation). */
export const CATEGORIES_AZ = [...TAXONOMY].sort((a, b) => sortKey(a.title).localeCompare(sortKey(b.title)));

export function subTitleFromSlug(slug) {
  const s = slug.replace(/-/g, ' ');
  return s.charAt(0).toUpperCase() + s.slice(1);
}

const lc = (v) => String(v ?? '').toLowerCase();
const has = (arr, re) => (arr ?? []).some((x) => re.test(lc(x)));
const isSerlingName = (n) => /rod serling/i.test(String(n ?? ''));

const SERIES_LABEL = { 1959: 'The Twilight Zone (1959-1964)', 1985: 'The Twilight Zone (1985-1989)', 2002: 'The Twilight Zone (2002-2003)', 2019: 'The Twilight Zone (2019-2020)' };
export { SERIES_LABEL };

const CONN_SUB = {
  'official-adaptation': 'adaptations-remakes', remake: 'adaptations-remakes', 'inspired-by': 'inspired-by',
  homage: 'homages', parody: 'parodies', reference: 'references', 'lyric-mention': 'references',
};
const LOC_GROUP = {
  'backlot-set': 'Studio backlots and sets', 'filming-location': 'Filming locations', 'serling-place': "Rod Serling's places",
  attraction: 'Attractions', 'museum-exhibit': 'Museums and exhibits', memorial: 'Memorials', archive: 'Archives', 'event-venue': 'Event venues',
};
const SONG_GROUP = {
  theme: 'The theme and its uses', 'lyric-mention': 'Lyrics that mention the show', reference: 'Songs about or titled after the show', unclassified: 'Connection not yet confirmed',
};
const BOOK_GROUP = {
  anthology: 'Story anthologies', scripts: 'Scripts and teleplays', scholarly: 'Scholarship and criticism', novel: 'Novels', reference: 'Guides and reference',
  novelization: 'Novelizations', biography: 'Biography and memoir', memoir: 'Biography and memoir', juvenile: 'Young readers', 'puzzle-trivia': 'Art and puzzle books',
  'art-book': 'Art and puzzle books', 'graphic-novel': 'Graphic novels', play: 'Scripts and teleplays', other: 'Other books',
};

/**
 * Where a record belongs. Returns [{ cat, sub, group? }]. `ctx` carries cross-collection facts:
 *   assessSub(key) -> the review assessment's subcategory label, if any
 *   connKinds(key) -> connection kinds where this record is the `from` end
 */
export function place(col, id, d, ctx = {}) {
  /** @type {{cat: string, sub: string, group?: string}[]} */
  const out = [];
  const add = (cat, sub, group) => out.push({ cat, sub, group });
  const asub = ctx.assessSub?.(`${col}/${id}`);
  const tags = d.tags ?? [];
  const subtype = lc(d.subtype);

  switch (col) {
    case 'series':
      add('series', 'tv', 'The Twilight Zone');
      break;
    case 'episodes':
      add('episodes', 'tv', SERIES_LABEL[d.series] ?? d.series);
      break;
    case 'films': {
      const k = d.kind ?? 'film';
      const conns = ctx.connKinds?.(`films/${id}`) ?? [];
      if (/^night-gallery-s\d+e\d+$/.test(id)) { add('episodes', 'tv', 'Night Gallery (1969-1973)'); break; }
      if (k === 'tv-series') {
        const g = id === 'night-gallery' || /night gallery/i.test(d.title) ? 'Night Gallery'
          : asub === "Rod Serling's other screen work" ? "Rod Serling's other series"
          : tags.includes('anthology-family') || asub === 'Fellow anthology series' ? 'Fellow anthology series'
          : 'Other series linked to the show';
        add('series', 'tv', g);
        break;
      }
      if (['tv-episode', 'tv-segment', 'sketch', 'web-series'].includes(k)) {
        if (asub === "Rod Serling's other screen work" && !conns.length) add('episodes', 'tv', "Rod Serling's other television");
        else add('homages', 'in-other-shows', { 'tv-episode': 'Episodes', 'tv-segment': 'Segments', sketch: 'Sketches', 'web-series': 'Web series' }[k]);
        break;
      }
      if (k === 'commercial') { add('advertising', 'commercials'); break; }
      if (k === 'stage') { add('stage', 'theatre'); break; }
      if (id === 'night-gallery-pilot') { add('movies', 'rod-serling-films', 'Night Gallery'); break; }
      if (asub === 'Twilight Zone productions') add('movies', 'twilight-zone-films');
      else if (asub === "Rod Serling's other screen work") add('movies', 'rod-serling-films', k === 'film' ? 'Feature films' : 'Television and other');
      if (k === 'documentary') add('movies', 'documentaries');
      else if (k === 'tv-film' && asub !== 'Twilight Zone productions' && asub !== "Rod Serling's other screen work") add('movies', 'tv-films');
      else if (['short', 'music-video', 'unproduced', 'special', 'pilot'].includes(k) && asub !== 'Twilight Zone productions') add('movies', 'shorts-and-other', { short: 'Short films', 'music-video': 'Music videos', unproduced: 'Unproduced projects', special: 'Specials', pilot: 'Pilots' }[k]);
      else if (k === 'film' && asub !== 'Twilight Zone productions' && asub !== "Rod Serling's other screen work") add('movies', 'linked-films');
      break;
    }
    case 'connections':
      add('homages', CONN_SUB[d.kind] ?? 'references');
      break;
    case 'songs':
      if (d.tz_connection === 'theme') add('music', 'theme');
      else add('music', 'songs', asub === 'Other references and samples' ? 'Other references and samples' : SONG_GROUP[d.tz_connection]);
      break;
    case 'books': {
      const g = asub && asub !== 'Other books' ? asub : BOOK_GROUP[d.kind] ?? 'Other books';
      add('reading', 'books', g);
      if (d.kind === 'scripts' || d.kind === 'play' || g === 'Scripts and teleplays') add('reading', 'scripts', 'Books');
      break;
    }
    case 'comics':
      add('reading', 'comics', asub);
      break;
    case 'magazines':
      add('reading', 'magazines', asub);
      break;
    case 'essays': {
      const k = d.kind;
      if (k === 'review') {
        const yr = Number(String(d.published ?? '').slice(0, 4));
        const rt = d.review_type ?? (yr && yr <= 1965 ? 'contemporary' : 'retrospective');
        add('reviews', { contemporary: 'contemporary', retrospective: 'retrospective', ranking: 'rankings', 'awards-citation': 'awards-citations' }[rt]);
      } else if (k === 'speech' || k === 'lecture') {
        add('lectures', (d.authors ?? []).some(isSerlingName) ? 'serling-lectures' : 'academic');
      } else if (k === 'script') add('reading', 'scripts', 'Single scripts');
      else if (k === 'interview' || k === 'article') add('reading', 'articles', k === 'interview' ? 'Interviews' : 'Articles');
      else add('reading', 'essays', { 'journal-article': 'Journal articles', 'book-chapter': 'Book chapters', essay: 'Essays', 'academic-thesis': 'Theses and dissertations' }[k] ?? 'Essays');
      break;
    }
    case 'archives':
      add('archives', 'collections', d.institution);
      break;
    case 'radio':
      if (d.series_title === 'The Twilight Zone Radio Dramas') add('episodes', 'radio', 'The Twilight Zone Radio Dramas');
      else add('episodes', 'radio', "Rod Serling's radio work");
      break;
    case 'podcasts':
      if (asub === 'Single episodes of other podcasts') add('episodes', 'podcast');
      else add('series', 'podcast', d.status === 'active' ? 'Active' : d.status === 'ended' ? 'Ended' : undefined);
      break;
    case 'quotes':
      add('quotes', isSerlingName(d.person) ? 'rod-serling' : 'admirers');
      break;
    case 'characters':
      add('people', 'characters', { human: 'People', alien: 'Aliens', robot: 'Robots and machines', supernatural: 'Supernatural beings', animal: 'Animals', object: 'Objects' }[d.kind] ?? undefined);
      break;
    case 'locations':
      if (d.kind === 'in-story') add('places', 'in-story');
      else add('places', 'real-life', LOC_GROUP[d.kind] ?? 'Other places');
      if (d.kind === 'attraction') add('stage', 'attractions', 'Places');
      if (d.kind === 'archive') add('archives', 'collections', 'Places');
      break;
    case 'works':
      placeWork(d, subtype, add);
      break;
    default:
      break;
  }
  return out;
}

function placeWork(d, st, add) {
  const k = d.kind;
  const isSerling = isSerlingName(d.creator) || /rod serling/i.test(d.title);
  switch (k) {
    case 'soundtrack':
      if (/theme/.test(st)) add('music', 'theme', 'Releases of the theme');
      else add('music', 'soundtracks', { 'score-release': 'Score releases', 'soundtrack-album': 'Soundtrack albums', compilation: 'Compilations', 'episode-song': 'Songs from episodes' }[st]);
      return;
    case 'game':
      if (/pinball|slot|arcade/.test(st)) add('games', 'pinball-arcade');
      else if (/video|vr|mobile|game-appearance|computer/.test(st)) add('games', 'video-games', st === 'game-appearance' ? 'Appearances in other games' : undefined);
      else if (/board|card|trivia|puzzle/.test(st)) add('games', 'board-card-games');
      else add('games', 'other-games');
      return;
    case 'collectible':
      if (/trading-card|card/.test(st)) add('merchandise', 'trading-cards');
      else if (/figure|bobblehead|doll|toy/.test(st)) add('merchandise', 'toys-figures');
      else if (/home-goods|apparel|shirt|mug/.test(st)) add('merchandise', 'household-apparel');
      else if (/home-video|dvd|blu/.test(st)) add('merchandise', 'home-media');
      else add('merchandise', 'collectibles');
      if (/replica-prop/.test(st)) add('props-collecting', 'replicas');
      return;
    case 'home-media':
      add('merchandise', 'home-media', 'Releases');
      return;
    case 'artwork':
      if (/poster|key-art|print/.test(st)) add('artwork', 'posters-key-art');
      else if (/title/.test(st)) add('artwork', 'title-design');
      else if (st) add('artwork', 'art-illustration');
      else add('artwork', 'other-artwork');
      return;
    case 'stage':
      if (/reading|audio/.test(st)) add('stage', 'live-readings');
      else add('stage', 'theatre');
      return;
    case 'attraction':
      add('stage', 'attractions', /ride/.test(st) ? 'Rides' : /museum|exhibit/.test(st) ? 'Exhibits' : undefined);
      if (/museum|exhibit/.test(st)) add('events', 'exhibitions');
      return;
    case 'event':
      if (/honor|award/.test(st)) add('events', 'honors-awards');
      else if (/festival|anniversary/.test(st)) add('events', 'anniversaries-festivals');
      else if (/marathon|broadcast/.test(st)) add('events', 'broadcasts-marathons');
      else if (/premiere/.test(st)) add('events', 'premieres');
      else if (/exhibit/.test(st)) add('events', 'exhibitions');
      else if (/convention/.test(st)) add('events', 'conventions');
      else if (/trial/.test(st)) add('legal-history', 'trials');
      else if (/lawsuit|suit/.test(st)) add('legal-history', 'lawsuits');
      else if (/production|accident/.test(st)) add('events', 'production-history');
      else add('events', 'other-events');
      if (/accident/.test(lc(d.title)) && !/trial/.test(st)) add('legal-history', 'trials', 'Background');
      return;
    case 'convention':
      add('events', 'conventions');
      return;
    case 'memorial':
      add('places', 'real-life', 'Memorials');
      add('events', 'honors-awards', 'Memorials');
      return;
    case 'parody':
      add('homages', 'parodies');
      return;
    case 'television':
      add('series', 'tv', 'Other television');
      return;
    case 'link':
      if (/fan|community|subreddit|wiki|forum/.test(st)) add('community', 'fan-communities');
      else if (/foundation|society|museum/.test(st)) add('community', 'organizations');
      else if (/archive/.test(st)) add('archives', 'collections', 'Online archives');
      else add('community', 'websites-databases', { database: 'Databases', reference: 'Reference sites', official: 'Official sites', streaming: 'Streaming', academic: 'Academic' }[st]);
      return;
    case 'fan-community':
      add('community', 'fan-communities');
      return;
    case 'education':
      add('lectures', 'classroom');
      return;
    case 'lecture':
      if (/panel|reading/.test(st)) add('lectures', 'readings-panels');
      else add('lectures', isSerling ? 'serling-lectures' : 'academic');
      return;
    case 'advertisement':
      if (/print|magazine|newspaper/.test(st)) add('advertising', 'print-ads');
      else if (/promo|trailer/.test(st)) add('advertising', 'promos-trailers');
      else if (/sponsor/.test(st)) add('advertising', 'sponsors');
      else add('advertising', 'commercials');
      return;
    case 'legal':
      if (/trial/.test(st)) add('legal-history', 'trials');
      else if (/suit|plagiar|dispute/.test(st)) add('legal-history', 'lawsuits');
      else if (/censor/.test(st)) add('legal-history', 'censorship');
      else add('legal-history', 'rights-ownership');
      return;
    case 'cultural-impact':
      if (/theme/.test(st)) add('cultural-impact', 'theme-shorthand');
      else if (/dictionar|ranking/.test(st)) add('cultural-impact', 'dictionary-rankings');
      else if (/public|politic/.test(st)) add('cultural-impact', 'public-uses');
      else add('cultural-impact', 'catchphrases');
      return;
    case 'prop':
      if (/auction/.test(st)) add('props-collecting', 'auctions');
      else if (/museum/.test(st)) add('props-collecting', 'museum-holdings');
      else if (/replica/.test(st)) add('props-collecting', 'replicas');
      else add('props-collecting', 'props-costumes');
      return;
    case 'production':
      add('events', 'production-history');
      return;
    default: // other
      if (/audiobook/.test(st)) add('reading', 'books', 'Audiobooks');
      else if (/language|idiom|phrase/.test(st)) add('cultural-impact', 'catchphrases');
      else if (/prop|costume/.test(st)) add('props-collecting', 'props-costumes');
      else if (/dub|international/.test(st)) add('series', 'international');
      else if (/franchise/.test(st)) add('movies', 'rod-serling-films', 'Franchises');
      else add('merchandise', 'other-merchandise');
  }
}

/** People subcategories from roles[] and credit roles. */
export function placePerson({ roles = [], creditRoles = [], quoted = false, played = false, isSerling = false }) {
  const out = new Set();
  const r = roles.map(lc);
  const c = creditRoles.map(lc);
  const any = (re) => r.some((x) => re.test(x)) || c.some((x) => re.test(x));
  if (any(/writer|teleplay|story|ghostwriter|source|adaptation|author/)) out.add('writers');
  if (any(/director/) ) out.add('directors');
  if (r.some((x) => /producer|developer|showrunner/.test(x)) || c.some((x) => /producer/.test(x))) out.add('producers');
  if (r.some((x) => /^actor|actress|performer/.test(x)) || c.includes('cast')) out.add('actors');
  if (c.includes('radio cast') || r.some((x) => /voice/.test(x))) out.add('voice-actors');
  if (any(/narrator|host/)) out.add('narrators-hosts');
  if (any(/composer|theme music|music|musician|conductor/)) out.add('composers');
  if (r.some((x) => /cinematograph|editor|make-?up|effects|crew|art director|designer|artist|costume|photograph|casting/.test(x)) && !r.some((x) => /story editor/.test(x) && r.length === 1)) out.add('crew');
  if (r.some((x) => /story editor/.test(x))) out.add('writers');
  if (r.some((x) => /historian|scholar|biographer|critic|teacher|professor|archivist/.test(x))) out.add('scholars-historians');
  if (r.some((x) => /family|wife|daughter|son|brother|widow/.test(x))) out.add('family');
  if (r.some((x) => /inspired/.test(x))) out.add('inspired-creators');
  if (quoted || r.some((x) => /^fan|collaborator|admirer/.test(x))) out.add('fans');
  if (isSerling) { out.add('writers'); out.add('narrators-hosts'); out.add('producers'); }
  if (!out.size) out.add('other-people');
  return [...out];
}

/** The `categories[]` field: explicit "cat/sub" placements. */
export function explicitPlacements(d) {
  return (d.categories ?? []).map((s) => {
    const [cat, sub] = s.split('/');
    return { cat, sub, explicit: true };
  });
}

const MEDIA_SUB = { video: 'video', audio: 'audio', document: 'documents', transcript: 'documents', article: 'documents', interview: 'video', image: 'images', ad: 'ads', website: 'links', link: 'links' };
export function mediaSub(m) {
  if (m.type === 'interview') return /audio|podcast|radio/.test(lc(m.subtype) + lc(m.host)) ? 'audio' : 'video';
  return MEDIA_SUB[m.type] ?? 'links';
}
