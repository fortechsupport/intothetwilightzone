// The site's category structure: Adam's list of top-level categories and subcategories, plus
// categories added during research (flagged `isNew` so Adam can remove them). Every record is
// placed by the rules in `place()` below; a record's own `categories: ["cat/sub"]` adds more.
// Plain JavaScript so both the Astro build and the review-sheet export (scripts/taxonomy-export.mjs)
// use the same rules. All copy is our own words; keep facts conservative.

import { hostShow, ENTRY_KINDS } from './tv-shows.mjs';

// Three kinds of top-level entry:
//   section   People, Places, Organizations: who and where, linked from everything else.
//   category  the things themselves (Series, Episodes, Reading...). `split: true` shows each list in two
//             parts, Official and Unofficial and inspired (see isOfficial below).
// Media and content are never categories (Adam, 2026-11-20 22:02 UTC): videos, audio, images, documents,
// reviews, interviews, quotes, advertisements and archival holdings attach to the records they are about
// (contentOf below, and every record's media[]) and show on those records' pages, on the category and
// subcategory pages that list those records, and in the Media Library (/media/), which says where each
// item appears.
/** @typedef {{ slug: string, title: string, blurb: string, intro?: string, isNew?: boolean, order?: 'az' | 'chrono', side?: 'official' | 'unofficial', groups?: string[], orderNote?: string, connection?: string, splitLabels?: [string, string] }} Sub */
/** @typedef {{ slug: string, title: string, kind?: 'section' | 'category', group?: string, split?: boolean, isNew?: boolean, description: string, intro: string[], connection: string, subs: Sub[], seeAlso?: [string, string][] }} Category */

/** @type {Category[]} */
/**
 * Music: the shows and films a theme or release belongs to, in the order they were made (Music plan, shelves A
 * and B). The last two hold releases that span several shows and any record Serling himself made.
 */
export const MUSIC_GROUPS = ['The Twilight Zone (1959)', 'Night Gallery', 'Twilight Zone: The Movie (1983)', 'The Twilight Zone (1985)', "Rod Serling's Lost Classics (1994)", 'The Tower of Terror', 'The Twilight Zone (2002)', 'The Twilight Zone (2019)', 'The radio dramas', 'Compilations', 'Rod Serling on record'];

// Podcasts (docs/plans/research-podcasts.md, section 2): shelf B is grouped by what a podcast covers, shelf C by
// the subject of the episode, both in this fixed order.
/** Conventions and conferences (Attend plan, section 2). */
const CONVENTION_GROUP = (id, d) => (/conference|symposium|serling-at-100|st-john-fisher/.test(id) ? 'Conferences and symposia' : /twilight-zone-convention|stars-of-the-zone|mausoleum/.test(id) ? 'Twilight Zone conventions' : 'Panels and salutes');
/** Home video groups, in the order the shows were made (Collect plan, section 2). */
// Discover plan (docs/plans/research-discover.md, section 2): History shelves grouped by show or kind of honor.
export const PRODUCTION_GROUPS = ['The Twilight Zone (1959)', 'The Twilight Zone (1985)', 'The Twilight Zone (2019)', 'Around the world', 'The Tower of Terror'];
export const HONOR_GROUPS = ['Emmy Awards', 'Hugo Awards', 'Other awards and honors', 'Halls of fame and rankings', 'Memorials'];
function historyGroup(sub, d) {
  const t = lc(`${d.title ?? ''} ${d.subtype ?? ''}`);
  if (sub === 'production-history') {
    if (/\bdub\b/.test(lc(d.subtype))) return 'Around the world';
    if (/tower of terror/.test(t)) return 'The Tower of Terror';
    if (/2019|peele|blurryman/.test(t)) return 'The Twilight Zone (2019)';
    if (/1985|1988|revival \(1984\)/.test(t)) return 'The Twilight Zone (1985)';
    return 'The Twilight Zone (1959)';
  }
  if (sub === 'honors-awards') {
    if (/memorial|grave|marker|school of fine arts|tribute/.test(t)) return 'Memorials';
    if (/\bemmy\b/.test(t)) return 'Emmy Awards';
    if (/\bhugo\b/.test(t)) return 'Hugo Awards';
    if (/hall of fame|walk of fame|ranking|greatest|best series|best-written|legends/.test(t)) return 'Halls of fame and rankings';
    return 'Other awards and honors';
  }
  return undefined;
}
/** Fill a milestone's group (and date order for premieres) when the rule that placed it gave none. */
const MILESTONES = ['honors-awards', 'premieres', 'production-history', 'serling-life', 'legal'];
function historyDefaults(p, d) {
  if (p.cat !== 'events' || !MILESTONES.includes(p.sub)) return p;
  const q = { ...p };
  if (!q.group) q.group = historyGroup(q.sub, d);
  if (q.sub === 'premieres' && !q.sort) q.sort = chronoSort(d);
  return q;
}
export const HOME_VIDEO_GROUPS = ['The Twilight Zone (1959)', 'Night Gallery', 'Twilight Zone: The Movie (1983)', 'The Twilight Zone (1985)', 'The Twilight Zone (2002)', 'The Twilight Zone (2019)'];
export function homeVideoShow(title) {
  const t = String(title ?? '');
  if (/night gallery/i.test(t)) return 'Night Gallery';
  if (/the movie/i.test(t)) return 'Twilight Zone: The Movie (1983)';
  if (/2019/.test(t)) return 'The Twilight Zone (2019)';
  if (/2002/.test(t)) return 'The Twilight Zone (2002)';
  if (/80s|1985|new twilight zone/i.test(t)) return 'The Twilight Zone (1985)';
  return 'The Twilight Zone (1959)';
}
const TOY_MAKER = (id, pub) => (/^bif-bang-pow|bif bang pow/.test(`${id} ${pub}`) ? 'Bif Bang Pow!' : /sideshow/.test(pub) ? 'Sideshow' : /funko/.test(pub) ? 'Funko' : 'Other makers');
export const PODCAST_GROUPS = ['The Twilight Zone (1959)', 'More than one Twilight Zone series', 'The Twilight Zone (1985)', 'The Twilight Zone (2019)', 'Night Gallery', 'Recurring segments in other podcasts', 'Coverage not yet recorded'];
export const PODCAST_SUBJECTS = { show: 'The show', serling: 'Rod Serling', 'film-1983': 'Twilight Zone: The Movie and the accident', 'night-gallery': 'Night Gallery', 'revival-2019': 'The 2019 series' };
const TZ_SERIES = ['1959', '1985', '2002', '2019'];
export function podcastGroup(d) {
  if (d.kind === 'segment') return 'Recurring segments in other podcasts';
  const c = d.covers ?? [];
  const tz = c.filter((x) => TZ_SERIES.includes(x));
  if (tz.length > 1) return 'More than one Twilight Zone series';
  if (tz.length === 1) return `The Twilight Zone (${tz[0]})`;
  if (c.includes('films/night-gallery')) return 'Night Gallery';
  return 'Coverage not yet recorded';
}

export const FILMING_GROUPS = ['The Twilight Zone (1959)', 'Twilight Zone: The Movie (1983)', 'The Twilight Zone (1985)', 'The Twilight Zone (2002)', 'The Twilight Zone (2019)', 'Other films'];
export const TAXONOMY = [
  {
    slug: 'people',
    title: 'People',
    kind: 'section',
    group: 'discover',
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
      { slug: 'artists', title: 'Artists and illustrators', isNew: true, blurb: 'Comic artists, cover artists, painters and illustrators.', intro: 'The artists who drew the Twilight Zone comics and painted their covers, from Gold Key\'s George Wilson to the artists of the Dynamite and IDW series. Each name links to every cover and issue credited to them.' },
      { slug: 'composers', title: 'Composers', blurb: 'The composers behind the themes and scores.', intro: 'CBS commissioned original scores for many episodes and drew the rest from its music library, so the show carries work by Bernard Herrmann, Jerry Goldsmith, Fred Steiner, Nathan Van Cleave and Marius Constant, whose library cues became the famous theme.' },
      { slug: 'crew', title: 'Crew', blurb: 'Cinematographers, editors, make-up and effects artists, story editors and other crew.', intro: "The look of the show came from people who rarely get named: cinematographer George T. Clemens, make-up artist William Tuttle, and the MGM art department that turned backlot streets into Maple Street and Willoughby." },
      { slug: 'directors', title: 'Directors', blurb: 'Everyone who directed an episode, segment or film.', intro: 'The original series used many directors from film and live television, among them John Brahm, Douglas Heyes, Buzz Kulik, Richard Donner, Lamont Johnson and Don Siegel. The film brought in John Landis, Steven Spielberg, Joe Dante and George Miller.' },
      { slug: 'game-makers', title: 'Game makers', isNew: true, blurb: 'Designers, programmers, artists and sound makers of the licensed games, above all the 1993 pinball machine.', intro: 'Pat Lawlor\'s team at Midway built the Twilight Zone pinball machine (1993), widely ranked among the most complex ever made. Each name links to the game they worked on.' },
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
    kind: 'section',
    group: 'discover',
    description: 'Real places tied to The Twilight Zone, from MGM backlots to Rod Serling\'s hometown, and the fictional places of its stories.',
    intro: [
      "The original series was made almost entirely at MGM in Culver City, on soundstages and the backlot streets that stood in for small-town America, with location trips to Death Valley, Lone Pine and the Malibu coast. The revivals moved north to Vancouver and Toronto. Serling's own story runs from Syracuse and Binghamton, New York, through Antioch College and Cincinnati, to Pacific Palisades and his summer cottage on Cayuga Lake.",
      'The stories built places of their own: Willoughby, where a tired commuter steps off the train into 1888; Peaksville, Ohio, ruled by a six-year-old; Maple Street on the day the power fails. Both kinds are here.',
    ],
    connection: 'Real places are where episodes were made, where Serling lived and is remembered, or where the franchise can be visited today. In-story places are settings named in the episodes, each linked to where it appears.',
    subs: [
      { slug: 'attractions', title: 'Attractions', groups: ['The Tower of Terror', 'Experiences'], blurb: 'Theme-park rides such as the Tower of Terror, and other Twilight Zone experiences you can visit.' },
      { slug: 'filming-locations', title: 'Filming locations', groups: FILMING_GROUPS, blurb: 'Where episodes and films were shot, from Death Valley to Vancouver.' },
      { slug: 'memorials-exhibits', title: 'Memorials and exhibits', isNew: true, blurb: 'Memorials, plaques, statues, museum exhibits and Serling\'s grave.' },
      { slug: 'serling-places', title: "Rod Serling's places", isNew: true, blurb: 'Where Serling was born, grew up, studied, lived and worked.' },
      { slug: 'sets-backlots', title: 'Sets and backlots', isNew: true, blurb: 'Studio lots and standing sets, such as MGM\'s Lot 2 and CBS Television City.' },
      { slug: 'venues', title: 'Venues and archives', blurb: 'Halls and campuses where Serling spoke, where events are held, and where his papers are kept.' },
      { slug: 'real-life', title: 'Other real places', blurb: 'Real places that fit no other group.', intro: 'Each place says what was filmed or happened there and whether you can still visit.' },
      { slug: 'in-story', title: 'Settings', blurb: 'Willoughby, Peaksville, Maple Street and the other settings of the stories.', intro: 'Fictional towns, planets and rooms from the episodes, with the episodes they appear in.' },
    ],
  },
  {
    slug: 'organizations',
    title: 'Organizations',
    kind: 'section',
    group: 'discover',
    description: 'The networks, studios, production companies, publishers, licensees and sponsors behind The Twilight Zone, and the archives, museums, foundations, award bodies and fan groups around it.',
    intro: [
      "Every part of the franchise passed through an organization. Serling's company Cayuga Productions made the original series with CBS, which broadcast it and the first revival and now owns the franchise; the original series was filmed at MGM; UPN carried the 2002 series and CBS All Access the 2019 one. Licensees carried it into print and products: Dell and Gold Key comics, TZ Publications' Twilight Zone Magazine, Gauntlet Press's script volumes, Bif Bang Pow! figures and Rittenhouse cards. Sponsors such as General Foods and Kimberly-Clark paid for the first season.",
      'Around the franchise are the organizations that keep its history: the archives and libraries that hold Serling\'s papers, the Rod Serling Memorial Foundation and other societies, museums in Binghamton and elsewhere, the bodies that gave the show its Emmys and Hugos, and the fan groups that study it.',
    ],
    connection: 'Official organizations made, broadcast, licensed or paid for the franchise. Related organizations hold its records, honor it or study it. Each organization page lists every record on this site that names it, with its holdings, sponsorships and advertisements attached.',
    subs: [
      { slug: 'networks-studios', title: 'Networks, studios and streamers', blurb: 'The broadcasters, studios and streaming services that made or carried the series and films.', side: 'official' },
      { slug: 'production-companies', title: 'Production companies', blurb: 'Cayuga Productions and the companies that produced the revivals, radio dramas and films.', side: 'official' },
      { slug: 'publishers', title: 'Publishers', blurb: 'Publishers of Twilight Zone books, comics and magazines, and of books about the show.' },
      { slug: 'licensees', title: 'Product licensees', blurb: 'The makers of Twilight Zone toys, games, cards, home video and recordings.' },
      { slug: 'sponsors', title: 'Sponsors and advertisers', blurb: 'The companies that sponsored the series (official), and the brands Rod Serling advertised.', splitLabels: ['Sponsors of the Twilight Zone', "Sponsors of Serling's other work, and brands he advertised"] },
      { slug: 'archives-libraries', title: 'Archives and libraries', blurb: 'Where Twilight Zone scripts, papers and recordings are kept, with their holdings.', side: 'unofficial' },
      { slug: 'museums', title: 'Museums', blurb: 'Museums with Serling or Twilight Zone collections and exhibits.', side: 'unofficial' },
      { slug: 'foundations-societies', title: 'Foundations and societies', blurb: 'The Rod Serling Memorial Foundation and other societies.', side: 'unofficial' },
      { slug: 'award-bodies', title: 'Award bodies', blurb: 'The academies and societies that honored the show and Serling.', side: 'unofficial' },
      { slug: 'schools', title: 'Schools and universities', blurb: 'Where Serling studied and taught, and where the show is studied.', side: 'unofficial' },
      { slug: 'fan-groups', title: 'Fan clubs and communities', blurb: 'Fan clubs, forums, wikis and other communities devoted to the show.', side: 'unofficial' },
      { slug: 'other-organizations', title: 'Other organizations', blurb: 'Organizations that fit no other group.' },
    ],
  },
  {
    slug: 'events',
    title: 'Events',
    group: 'discover',
    split: true,
    description: 'Gatherings people could go to, and the milestones of the show\'s history: conventions, festivals, exhibitions, screenings, premieres, awards, production history, the trials and Rod Serling\'s life.',
    intro: [
      "Fans have gathered around The Twilight Zone for decades: the New Year's marathons that introduced the show to new generations, Binghamton's Rod Serling festivals, conventions, and museum exhibitions.",
      "The show's history is here too (Adam's menu sheet, 2026-11-27, joined History to Events): it premiered on CBS on October 2, 1959; Serling won Emmys for it and it won three Hugo Awards; it was cancelled, revived and syndicated around the world. In 1982 a helicopter accident on the set of Twilight Zone: The Movie killed Vic Morrow and two child actors and led to a manslaughter trial that ended in acquittals in 1987. Each milestone is dated and sourced, and the Timeline plots them all in order.",
    ],
    connection: 'Every event here is part of the franchise\'s own history, honors Rod Serling or the show, or is a gathering devoted to it; every milestone is part of the franchise\'s history or Serling\'s life.',
    seeAlso: [['Timeline', '/timeline/']],
    subs: [
      { slug: 'upcoming', title: 'Coming up', isNew: true, order: 'chrono', blurb: 'Events whose dates are still ahead, worked out from each record\'s dates each time the site is built. Once an event\'s last day passes, it leaves this shelf and stays on its own.' },
      { slug: 'anniversaries-festivals', title: 'Anniversaries and festivals', groups: ['SerlingFest', 'Film festivals', 'Anniversaries and days'], blurb: 'Anniversary celebrations and festivals, including SerlingFest in Binghamton.' },
      { slug: 'broadcasts-marathons', title: 'Screenings and marathons', groups: ['TV marathons', 'Screenings'], blurb: 'The holiday marathons on television, and screenings in cinemas, schools and theatres.' },
      { slug: 'conventions', title: 'Conventions and conferences', groups: ['Twilight Zone conventions', 'Conferences and symposia', 'Panels and salutes'], blurb: 'Twilight Zone conventions, Rod Serling conferences, and panels about the show at other gatherings.' },
      { slug: 'exhibitions', title: 'Exhibitions', groups: ['Museum exhibits', 'Art exhibitions'], blurb: 'Museum shows and exhibits about Serling and the series, and art shows inspired by it.' },
      { slug: 'other-events', title: 'Other events', blurb: 'Events that fit no other group.' },
      // History's shelves (Adam's menu sheet, 2026-11-27: Events "combines History and Events").
      { slug: 'honors-awards', title: 'Honors and awards', groups: HONOR_GROUPS, blurb: 'Emmys, Hugos, halls of fame, stamps and other honors to Serling and the show.', intro: 'Serling won six Emmys, three of them before The Twilight Zone, and the show won Hugo Awards in 1960, 1961 and 1962. Later honors include the Television Academy Hall of Fame and a star on the Hollywood Walk of Fame.' },
      { slug: 'premieres', title: 'Premieres', order: 'chrono', orderNote: 'In date order, from the 1958 pilot play on.', blurb: 'Premieres of the series, revivals, films, the play and the Tower of Terror.' },
      { slug: 'production-history', title: 'Production and broadcast history', groups: PRODUCTION_GROUPS, blurb: 'Dated milestones in how each series was made, scheduled and syndicated.', intro: 'From the history notes on each series and film: pilots, renewals, format changes, cancellations and syndication.' },
      { slug: 'serling-life', title: "Rod Serling's life", isNew: true, blurb: 'Dated events in Serling\'s life, from his birth in 1924 to his death in 1975.' },
      { slug: 'legal', title: 'Trials, lawsuits and rights', isNew: true, blurb: 'The 1982 accident trial, lawsuits and credit disputes, sponsor censorship, and who has owned the franchise.', intro: 'The 1982 helicopter accident on the set of Twilight Zone: The Movie killed Vic Morrow and two child actors and led to a manslaughter trial that ended in acquittals in 1987. Rights to the series passed from Cayuga Productions to CBS; writers disputed credits; and Serling fought sponsors over what he could say.' },
    ],
  },
  {
    slug: 'series',
    title: 'Television',
    group: 'view',
    split: true,
    description: 'The four Twilight Zone series and every episode, Rod Serling\'s other series and television plays, the anthology series in its tradition, and the shows that pay it homage.',
    intro: [
      'There have been four Twilight Zone television series: the original (CBS, 1959-1964), the first revival (CBS and syndication, 1985-1989), a second revival (UPN, 2002-2003) and Jordan Peele\'s (CBS All Access, 2019-2020). Each has a page, and every one of their episodes has its own page.',
      'Serling followed the original with Night Gallery (NBC, 1969-1973), and before it wrote plays for the live anthologies of the 1950s. Those series, the anthologies in the same tradition and the shows that pay homage each have one page, where every episode is an entry you can filter, search and link to.',
    ],
    connection: 'The four Twilight Zone series are the franchise itself. Night Gallery and Serling\'s other television are official Serling work one step away. Similar anthologies are here for a stated link or a shared tradition, each tagged with how it connects, and homages for a specific episode or sketch.',
    seeAlso: [['Night Gallery', '/night-gallery/'], ['All homages', '/television/homages/'], ['Rod Serling', '/rod-serling/']],
    subs: [
      { slug: 'twilight-zone', title: 'The Twilight Zone', blurb: 'The original series and its three revivals, each with every episode.', order: 'chrono', side: 'official' },
      { slug: 'episodes', title: 'All Twilight Zone episodes', blurb: 'Every episode and segment of the four series, by series.', side: 'official' },
      { slug: 'serling-series', title: "Rod Serling's series", blurb: 'Night Gallery, The Loner and his other series, and the plays he wrote for other anthologies.', side: 'official' },
      { slug: 'anthologies', title: 'Fellow anthologies', blurb: 'Anthology series in the same tradition, each tagged with how it connects.', side: 'unofficial' },
      { slug: 'homages', title: 'Homages in other shows', blurb: 'Episodes and sketches of other shows that parody, honor or reference it, by show.', side: 'unofficial' },
      { slug: 'pilots-unmade', title: 'Pilots and unmade projects', isNew: true, blurb: 'Pilots, unaired material and announced projects tied to the series and their episodes.' },
      { slug: 'international', title: 'Around the world', blurb: 'The titles and dubs the series went by abroad.', isNew: true, intro: 'The show was dubbed and retitled in many countries: La Dimensión Desconocida, La Quatrième Dimension, Ai confini della realtà, Unglaubliche Geschichten. Each title is sourced.' },
    ],
  },
  {
    slug: 'radio',
    title: 'Radio',
    group: 'listen',
    split: true,
    description: 'The Twilight Zone Radio Dramas, narrated by Stacy Keach, and Rod Serling\'s own radio work.',
    intro: [
      'The Twilight Zone Radio Dramas, produced under license from 2002 with Stacy Keach in Serling\'s narrator role, adapted the original teleplays and later added new stories and scripts that were never filmed. Serling himself started in radio, writing for stations in Cincinnati and for network series before television.',
    ],
    connection: 'The radio dramas are licensed Twilight Zone productions; Serling\'s radio plays are his own work.',
    subs: [
      { slug: 'radio-dramas', title: 'Radio dramas', order: 'chrono', side: 'official', blurb: 'The Twilight Zone Radio Dramas (2002 to 2012), narrated by Stacy Keach: the series page, then all 176 episodes season by season.', intro: 'Falcon Picture Group made the series under license from CBS and the Serling estate, with a different film or television actor starring in each story. The series page has the seasons, the cast, the broadcast and release history and where to listen.', connection: 'The officially licensed radio version of the show: 155 of the 156 original episodes, the 1958 pilot play, unmade scripts and 16 stories written for radio.' },
      { slug: 'serling-radio', title: "Rod Serling's radio work", side: 'official', blurb: 'Everything Serling wrote, acted in or hosted on radio, from WNYC in 1946 to The Zero Hour in 1974.', intro: 'Serling started in radio: as an unpaid intern at WNYC, in Antioch College\'s radio workshop, as a staff writer at WLW in Cincinnati, and selling scripts to network series. Late in life he hosted radio again. Most dates come from Martin Grams Jr.\'s history of his radio career.', connection: 'The radio work of the show\'s creator, grouped by his part in it.' },
      { slug: 'original-stories', title: 'Original radio stories', isNew: true, blurb: 'Radio drama episodes written for audio rather than adapted from television.' },
      { slug: 'unmade-scripts', title: 'Radio versions of unmade scripts', isNew: true, blurb: 'Radio dramas made from Twilight Zone scripts that were never filmed.' },
      { slug: 'adaptations', title: 'Other radio and audio adaptations', isNew: true, blurb: "Radio and audio versions of Serling's work made by producers other than Falcon Picture Group.", connection: "Each one adapts a teleplay or story by Rod Serling; none was made under the radio dramas' license." },
      { slug: 'anthologies', title: 'Fellow radio anthologies', side: 'unofficial', blurb: 'Radio anthologies with a sourced tie to Serling or the show, stated on each page.', connection: 'Each series is here for a documented tie to Serling, stated on its page; radio anthologies with no such tie are listed with the other fellow anthologies in Television.' },
      { slug: 'fan-audio', title: 'Fan and independent audio', isNew: true, side: 'unofficial', blurb: 'Fan-made audio dramas of the episodes, credited to their makers and linked, never copied.', connection: 'Fans adapting the episodes for audio. Nothing here is licensed; each is credited to its maker.' },
    ],
  },
  {
    slug: 'podcasts',
    title: 'Podcasts',
    group: 'listen',
    split: true,
    description: 'Podcasts devoted to The Twilight Zone, single episodes of other podcasts, fiction it inspired, and every episode in one searchable table.',
    intro: [
      'The show is one of the most podcasted series in television history: whole shows work through it episode by episode, and many others have devoted an episode to a favorite story or to the 1983 film.',
      'Every episode of every podcast here is also in one searchable table, read from the podcasts\' own feeds, and each episode of the show lists the podcast episodes about it.',
    ],
    connection: 'Each podcast or episode is about The Twilight Zone, Night Gallery or Rod Serling, or is fiction that names the show as its model. None is official: no podcast made or licensed by CBS, Paramount or the Serling family was found (2026-11-24).',
    // Four shelves (plan section 2). Shelf A, official podcasts, appears only once one is found: none was in
    // round 1 (2026-11-24). Every episode of every podcast is in one table at /podcasts/episodes/.
    seeAlso: [['Every podcast episode, searchable', '/podcasts/episodes/'], ['The radio dramas', '/radio/radio-dramas/']],
    subs: [
      {
        slug: 'shows', title: 'Podcasts about the show', side: 'unofficial', groups: PODCAST_GROUPS,
        orderNote: 'Groups go from the original series to Night Gallery, then segments inside other podcasts; within each, podcasts are A to Z.',
        blurb: 'Podcasts devoted to The Twilight Zone, Night Gallery or Rod Serling, most working through the episodes one by one, grouped by what they cover.',
        connection: 'Fans and critics talking about the show, episode by episode. None is made or licensed by CBS, Paramount or the Serling family.',
      },
      {
        slug: 'single-episodes', title: 'Single episodes', side: 'unofficial', groups: Object.values(PODCAST_SUBJECTS),
        orderNote: 'Groups follow the subject; within each, episodes are A to Z.',
        blurb: 'Episodes of other podcasts given over to the show, Rod Serling, the 1983 film or Night Gallery.',
        connection: 'Podcasts about other things that spent an episode on the show or its creator.',
      },
      {
        slug: 'fiction', title: 'Fiction inspired by the show', isNew: true, side: 'unofficial',
        blurb: 'Audio-fiction podcasts that say they were inspired by The Twilight Zone.',
        connection: 'New stories, not the show: each is here because the podcast names The Twilight Zone as its model, or is marked where that has not yet been confirmed.',
      },
    ],
  },
  {
    slug: 'movies',
    title: 'Movies',
    group: 'view',
    split: true,
    description: 'Twilight Zone films, Rod Serling\'s films, documentaries, and the films linked to specific episodes.',
    intro: [
      'Warner Bros. brought the show to cinemas in Twilight Zone: The Movie (1983), four segments directed by John Landis, Steven Spielberg, Joe Dante and George Miller. CBS assembled Rod Serling\'s Lost Classics (1994) from unproduced material, and Serling himself wrote Patterns, Requiem for a Heavyweight, Seven Days in May and the first Planet of the Apes.',
      'Most entries are later films that remake, adapt, borrow from or parody an episode. Each one says what the link is and how well it is documented.',
    ],
    connection: 'Twilight Zone films are part of the franchise. Rod Serling\'s films (ones he wrote, ones made from his work, and ones he narrated) are one step away, and so are the documentaries about him and the show. Every other film is here for a sourced link to an episode or to the show, stated on its page with how sure that link is.',
    seeAlso: [['Legacy', '/homages/'], ['Music videos', '/music/music-videos/'], ['Pilots and unmade projects in Television', '/series/pilots-unmade/']],
    subs: [
      // Six shelves (Movies plan, docs/plans/research-movies.md section 2, approved by Adam 2026-11-23).
      { slug: 'documentaries', title: 'Documentaries', blurb: 'Documentaries about Serling and the show, and the documentaries Serling narrated.' },
      { slug: 'tz-makers', title: 'Films by Twilight Zone makers', isNew: true, side: 'unofficial', blurb: 'Films by the show\'s writers and directors that a source ties to the show or to Serling.', intro: 'Only films with a sourced tie to the series, its episodes or Rod Serling are listed (Adam, 2026-11-23). The other films of the show\'s writers are linked from their People pages instead.' },
      { slug: 'linked-films', title: 'Films linked to the show', blurb: 'Films that remake, adapt, honor, parody or reference an episode or the show, each with how well the link is documented.' },
      { slug: 'rod-serling-films', title: "Rod Serling's films", side: 'official', blurb: 'Every film Serling wrote, that was made from his work, or that he narrated, grouped by his part in it.' },
      { slug: 'twilight-zone-films', title: 'Twilight Zone films', blurb: 'Films and specials made under the Twilight Zone name.' },
      { slug: 'unmade-projects', title: 'Unmade and lost projects', isNew: true, blurb: 'Twilight Zone films that were announced but never made, and Serling\'s unproduced screen scripts.' },
    ],
  },
  {
    slug: 'music',
    title: 'Music',
    group: 'listen',
    split: true,
    description: 'The Twilight Zone theme, its composers and scores, soundtrack releases, and the songs that name or are about the show.',
    intro: [
      "Few pieces of television music are as recognisable as The Twilight Zone's theme. The first season used a main title by Bernard Herrmann; from the second season CBS combined two short library pieces by the French composer Marius Constant, and its repeating guitar figure became shorthand for the uncanny.",
      "That motif has been covered, sampled and quoted ever since, and the show's name turns up in hundreds of lyrics and song titles, from Rush and Golden Earring to Iron Maiden and Ariana Grande.",
    ],
    connection: 'Themes and scores are part of the show itself. Songs written about it are one step away. Songs that only use the phrase "twilight zone" are tangential, and where nobody has yet checked a reference, the entry says so.',
    subs: [
      // The six shelves of docs/plans/research-music.md (section 2). Songs and releases are placed by placeSong and
      // placeWork below; groups on the first two shelves follow MUSIC_GROUPS, the order the shows were made in.
      {
        slug: 'theme', title: 'The themes', order: 'chrono', side: 'official', groups: MUSIC_GROUPS,
        orderNote: 'Groups follow the order the shows were made in; within each, themes are in date order.',
        blurb: 'Every main title of the series, the film, Night Gallery and the Tower of Terror, in date order, with its composer.',
        intro: "Bernard Herrmann wrote the first season's main title. In 1960 CBS wanted something less gloomy and commissioned replacements from Herrmann, Jerry Goldsmith and Leith Stevens, none of which was used on screen. Instead music director Lud Gluskin joined two short library cues by Marius Constant, “Etrange No. 3” and “Milieu No. 2”, and that guitar figure became the theme. Each revival reworked it: the Grateful Dead with Merl Saunders in 1985, Jonathan Davis in 2002 and Marco Beltrami in 2019. Night Gallery had three themes of its own, by Billy Goldenberg, Gil Mellé and Eddie Sauter. Each entry gives its sources.",
        connection: 'The music that opened the shows themselves, made by or for their producers.',
      },
      {
        slug: 'soundtracks', title: 'Scores and soundtrack albums', side: 'official', groups: MUSIC_GROUPS,
        blurb: "Releases of the shows' and films' music, grouped by series or film: score LPs and CDs, soundtrack albums, library cues and compilations.",
        connection: 'Recordings of the music written for, or chosen for, the series and films.',
      },
      { slug: 'covers-samples', title: 'Covers and samples', side: 'unofficial', blurb: "Recordings of the theme by other artists, and tracks that sample the show's music or narration, each marked by how the sample is known.", connection: 'Other artists using the show\'s own music and voices. A sample counts as confirmed when WhoSampled or the artist\'s credits list it; otherwise it is marked as noted by fans.' },
      { slug: 'songs-about', title: 'Songs about the show', side: 'unofficial', blurb: 'Songs written about the show, an episode or Rod Serling, or named after them, and tributes.', connection: 'Songs one step away from the show: about it, or named after it.' },
      { slug: 'songs-mention', title: 'Songs that mention it', side: 'unofficial', blurb: 'Songs whose lyrics name the show, songs that only use the phrase "twilight zone", and songs not yet checked.', connection: 'Lyrics that name the show are a passing reference. Songs that only use the everyday phrase are tangential (Adam, Music Q1). Where nobody has confirmed the lyric yet, the entry says so and what was tried.' },
      { slug: 'music-videos', title: 'Music videos', isNew: true, side: 'unofficial', blurb: 'Music videos that borrow from, honor or reference the show.' },
    ],
  },
  {
    slug: 'reading',
    title: 'Reading',
    group: 'read',
    split: true,
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
      // Read plan (docs/plans/research-read.md, section 2): one record per published story, play or radio play an
      // episode or segment adapts. The stories belong to their authors, so the shelf shows no official split.
      // Adam (2026-11-28) named it Short stories; Serling's own short stories join it.
      { slug: 'short-stories', title: 'Short stories', isNew: true, side: 'neither', groups: ['The Twilight Zone (1959)', 'The Twilight Zone (1985)', 'The Twilight Zone (2019)', 'Night Gallery', "Rod Serling's short stories"], blurb: 'The short stories the episodes and Night Gallery segments adapt (with the one radio play and one book of anecdotes they also draw on), and Rod Serling\'s own short stories: who wrote them and where they first appeared.', connection: 'Each story was adapted as an episode of The Twilight Zone or a segment of Night Gallery, or was written by Rod Serling; the page links to it. Where it first appeared is given only where a source we read says so.' },
    ],
  },
  {
    slug: 'games',
    title: 'Games',
    group: 'play',
    split: true,
    description: 'Twilight Zone pinball, video games, board and card games.',
    intro: [
      "Bally's The Twilight Zone pinball machine (1993), designed by Pat Lawlor, is one of the best-selling and most complex pinball tables ever made, and it lives on in licensed digital versions. The show has also been a board game (Ideal, 1964), a computer adventure (1988), a hidden-object game (2014), a slot machine and a virtual-reality game (2022).",
      'Many other games nod to it: a quest in Fallout 3, the Night Springs show inside Alan Wake, callouts on later Lawlor tables. Those are kept on their own shelf, so the licensed games are easy to find.',
    ],
    connection: 'Licensed games are made under license from CBS (or Disney, for the Tower of Terror). Nods in other games are unlicensed references, each explained on its entry.',
    subs: [
      // Five shelves (docs/plans/research-games.md, section 2). Each record sits on one; nods are only on their own.
      // Adam's menu sheet (2026-11-27): Board games, Card games and Mini golf each have their own shelf, and trivia
      // games sit beside the site's own quiz.
      { slug: 'board-games', title: 'Board games', groups: ['Published', 'Proposed, never made'], blurb: "Ideal's 1964 board game, Clue's Tower of Terror edition, and a board game proposed before the pilot was made." },
      { slug: 'card-games', title: 'Card games', isNew: true, keepEmpty: true, blurb: 'Card and party games themed to the show.', intro: 'Adam asked for this shelf (menu sheet, 2026-11-27). No card game made about The Twilight Zone has been found yet: "Twilight Zone Solitaire", a two-deck patience game, shares only the name, and the Rittenhouse and Rod Serling trading cards are collectibles, listed under Collect. Know of one? Tell us through Contribute, with a source.' },
      { slug: 'mini-golf', title: 'Mini golf', isNew: true, blurb: 'Licensed mini-golf courses themed to the show.' },
      { slug: 'trivia-games', title: 'Trivia games', isNew: true, blurb: 'Published and online trivia games about the show.' },
      { slug: 'game-homages', title: 'Nods in other games', isNew: true, side: 'unofficial', groups: ['Video games', 'Pinball tables', 'Fan-made games', 'Name only, link not confirmed'], blurb: 'Games that reference or borrow from the show without a license: a quest, a callout, a host in the Serling mold.', connection: 'Each entry says what the nod is and who noticed it. None of these games is licensed from the show.' },
      { slug: 'other-games', title: 'Other games and play', blurb: 'Licensed play that is not a board, card, video or pinball game or mini golf.' },
      { slug: 'pinball-arcade', title: 'Pinball and slot machines', groups: ['The 1993 table', 'Digital versions of the table', 'Slot machines', 'Home software and the rumored remake'], blurb: "Bally's 1993 Twilight Zone pinball machine and its licensed digital versions, the IGT slot machine, and the table's unofficial home software." },
      { slug: 'video-games', title: 'Video games', groups: ['Released', 'Unreleased and unmade', 'Tower of Terror tie-ins'], blurb: 'Licensed computer, console and VR games, from the 1988 adventure to The Twilight Zone VR, and the ones never finished.' },
    ],
  },
  {
    slug: 'artwork',
    title: 'Artwork',
    group: 'view',
    split: true,
    description: 'How the shows look: title design, make-up and production design, Night Gallery\'s paintings, cover art, and art inspired by The Twilight Zone.',
    intro: [
      "The show's look is part of its legend: the drifting eye, window and clock of the opening titles, William Tuttle's make-up, the paintings Serling stood beside in Night Gallery, the key art of the 1983 film, Gold Key's painted comic covers, and decades of posters and gallery work by artists who grew up with it.",
      'Artwork is both a category and content. Every piece is listed here, and a cover also shows on the comic or magazine it covers, a poster on the film it advertised.',
    ],
    connection: 'Official artwork was made for the franchise or under its licence: posters, title design, Night Gallery\'s paintings, licensed covers and prints, make-up and props. Unofficial artwork takes the show as its subject; a print is listed as official only where a source says it was licensed. Cover art also appears on the comic, magazine or book it covers.',
    // Collect plan (docs/plans/research-collect.md, section 2): one shelf per record, chosen by subtype.
    // Art and design moved from Collect to Discover (Adam, 2026-11-26); props, costumes, posters and prints went to
    // Collect with Merchandise, since they are objects people own (MOVES below).
    seeAlso: [['Art exhibitions', '/events/exhibitions/'], ['Props, costumes, posters and prints', '/merchandise/props-costumes/']],
    subs: [
      { slug: 'art-illustration', title: 'Art and illustration', blurb: 'Artists and works inspired by the show, and art made for the revival\'s campaigns.' },
      { slug: 'covers', title: 'Cover and comic art', isNew: true, groups: ['Comics', 'Magazines'], blurb: 'Covers and interior art for the comics and magazines. Each cover also appears on the item it covers.' },
      { slug: 'night-gallery-paintings', title: 'Night Gallery paintings', isNew: true, groups: ['The paintings', 'About the paintings'], blurb: 'The paintings Serling introduced each Night Gallery story with, and the book about them.' },
      { slug: 'production-design', title: 'Make-up and production design', isNew: true, blurb: 'Make-up and effects designs from the productions, above all William Tuttle\'s.' },
      { slug: 'other-artwork', title: 'Other artwork', blurb: 'Artwork that fits no other group.' },
      { slug: 'title-design', title: 'Title design', blurb: 'The opening title sequences.' },
    ],
  },
  {
    slug: 'homages',
    title: 'Legacy by relationship',
    group: 'legacy',
    split: true,
    description: 'Remakes, adaptations, homages, parodies and references to The Twilight Zone across film, television, music and print, with the evidence for each.',
    intro: [
      'The Twilight Zone is one of the most borrowed-from works in popular culture. The Simpsons\' "Treehouse of Horror" episodes, Futurama and countless sitcoms have parodied it, anthologies such as Black Mirror openly work in its tradition, and Jordan Peele has said his film Us grew from the episode "Mirror Image".',
      'Every link is labelled by its evidence: confirmed by the makers, documented by a published source, or noted by fans only. A resemblance is never presented as an influence: it is shown as "Compared to".',
    ],
    connection: 'Each entry names the later work, the episode it draws on, the kind of link and the evidence for it.',
    seeAlso: [['Films linked to the show', '/movies/linked-films/']],
    subs: [
      { slug: 'adaptations-remakes', title: 'Adaptations and remakes', blurb: 'Official adaptations and remakes of episodes.' },
      { slug: 'compared', title: 'Compared to the show', isNew: true, blurb: 'Works that critics or fans compare with an episode or the show, where neither the makers nor a published source say the show inspired them.', connection: 'Each entry names the later work, the episode or series it is compared with, who makes the comparison, and what the makers themselves named instead, where they have said.' },
      { slug: 'fan-made', title: 'Fan-made', isNew: true, side: 'unofficial', groups: ['Fan films', 'Fan edits and supercuts', 'Fan audio dramas', 'Fan games'], blurb: 'Fan films, edits, supercuts, audio dramas and games made by fans, credited to their makers and linked, never copied.' },
      { slug: 'homages', title: 'Homages', blurb: 'Deliberate tributes to an episode or the show.' },
      { slug: 'in-other-shows', title: 'In other shows', blurb: 'Episodes, segments and sketches of other series that adapt, spoof or reference the show.' },
      { slug: 'inspired-by', title: 'Inspired by', blurb: 'Works whose makers, or published sources, say an episode inspired them.' },
      { slug: 'in-everyday-language', title: 'In everyday language', isNew: true, blurb: 'Catchphrases, the theme as shorthand, dictionary entries and public figures invoking the show. Rankings of the show are under Events > Honors and awards.', intro: 'Few television shows have changed the language. "Twilight zone" is now an ordinary phrase for anything uncanny, the theme is hummed to mean "something strange is going on", and lines such as "It\'s a cookbook!" are quoted by people who have never seen the episodes.' },
      { slug: 'parodies', title: 'Parodies', blurb: 'Spoofs and send-ups.' },
      // Adam (2026-11-28): Websites left Read for Legacy, "all the kinds of links" (docs/plans/navigation-2026-11-28.md).
      { slug: 'websites', title: 'Websites and fan sites', isNew: true, groups: ['Fan sites', 'Reference sites', 'Databases', 'Academic', 'Official sites', 'Streaming'], blurb: 'Fan sites, fan wikis, reference entries and databases about the show and Serling, each credited to whoever runs it.', connection: 'Each site is about The Twilight Zone, Rod Serling or Night Gallery, or tracks the show\'s references in other works. Fan sites and community wikis are unofficial; a site is official only where the rights holders run it.' },
      { slug: 'references', title: 'References', groups: ['Confirmed by its makers', 'Documented', 'Noted by fans'], blurb: 'Passing references, quotations and lyric mentions, grouped by how well each is documented.' },
    ],
  },
  {
    slug: 'merchandise',
    title: 'Merchandise',
    group: 'collect',
    split: true,
    description: 'Twilight Zone collectibles, toys, trading cards, home video releases and other licensed products.',
    intro: [
      'Licensed Twilight Zone products run from 1960s board games to Talky Tina replicas, Bif Bang Pow! bobbleheads, Rittenhouse trading cards, and a long line of home video releases: VHS and laserdisc collections, the Definitive Edition DVDs, and the remastered Blu-ray sets.',
      'This is a reference catalogue: nothing here is for sale, and licensed and unlicensed items are labelled.',
    ],
    connection: 'Each item is a Twilight Zone product or a release of the series and films. It is official where the rights holders made it or a source states a licence; otherwise it is under "Unofficial and inspired", with what is known.',
    // Collect plan (docs/plans/research-collect.md, section 2): one shelf per record, chosen by subtype.
    seeAlso: [['Art and design', '/artwork/'], ['Games', '/games/']],
    subs: [
      { slug: 'props-costumes', title: 'Props and costumes', isNew: true, groups: ['Surviving pieces', 'Sold at auction', 'In museums and collections', 'Reused props'], blurb: 'Surviving props, costumes, make-up pieces, paintings and scripts: where they are now and what they sold for.', intro: 'Some of the original series\' props have survived the decades since MGM cleared its prop rooms, among them the Mystic Seer fortune-telling machine from "Nick of Time", which has sold at auction. Others sit in museums and private collections. Each entry says what is known about a piece and where the claim comes from. Licensed replicas are under Prop replicas.' },
      { slug: 'posters-prints', title: 'Posters and prints', groups: ['Posters and key art', 'Art prints'], blurb: 'Studio posters and key art, and art prints of the show. A print is official where a source says it was licensed.' },
      { slug: 'collectibles', title: 'Collectibles and souvenirs', groups: ['Tower of Terror souvenirs', 'Sheet music', 'Other collectibles'], blurb: 'Tin totes, wooden figure sets, sheet music and Tower of Terror souvenirs.' },
      { slug: 'home-media', title: 'Home video', groups: HOME_VIDEO_GROUPS, blurb: 'Every VHS, laserdisc, DVD and Blu-ray release of the series and films.', intro: 'Every VHS, laserdisc, DVD and Blu-ray release recorded on the series and film pages is listed here under its show, with a link to the release table on that page and its sources. A few releases also have a record of their own, with reviews, extras and where copies are held.' },
      { slug: 'household-apparel', title: 'Household and apparel', groups: ['Clothing', 'Mugs and drinkware', 'Pins, decals and ornaments'], blurb: 'Clothing, mugs, pins, decals and ornaments.' },
      { slug: 'masks-and-costumes', title: 'Masks and costumes', blurb: 'Masks and costumes to wear.' },
      { slug: 'other-merchandise', title: 'Other merchandise', blurb: 'Products that fit no other group.' },
      { slug: 'replicas', title: 'Prop replicas', isNew: true, blurb: 'Replicas of props such as Talky Tina and the Mystic Seer.' },
      { slug: 'toys-figures', title: 'Toys and figures', groups: ['Bif Bang Pow!', 'Sideshow', 'Funko', 'Other makers'], blurb: 'Action figures, bobbleheads, vinyl figures and building sets.' },
      { slug: 'trading-cards', title: 'Trading cards', blurb: 'Card sets and inserts.' },
    ],
  },
  {
    slug: 'lectures',
    title: 'Lectures',
    group: 'listen',
    split: true,
    description: "Rod Serling's lectures and speeches, academic talks about the show, and The Twilight Zone in the classroom.",
    intro: [
      'Serling was a tireless speaker. He lectured at colleges across the country, taught writing and film at Ithaca College and Antioch, and used his speeches to argue for television as serious drama and against the censorship of sponsors. Since then the show has become a set text: its teleplays appear in school anthologies, and scholars lecture on it at conferences and universities.',
    ],
    connection: 'Each entry is a talk by Rod Serling, a lecture or course about the show, or classroom material built on it.',
    subs: [
      { slug: 'academic', title: 'Talks about the show', blurb: 'Lectures, keynotes, readings and panels about Serling and the show, by scholars, family and fans.' },
      { slug: 'classroom', title: 'In the classroom', groups: ['School lessons and resources', 'University and adult courses'], blurb: 'Teleplays in school anthologies, lesson plans, and university and adult-education courses.' },
      { slug: 'serling-lectures', title: "Rod Serling's lectures and teaching", groups: ['Speeches and lectures', 'Teaching'], blurb: 'Serling speaking at colleges and conferences, and the classes he taught at Antioch and Ithaca.' },
    ],
  },
  // ---- Categories added during research (flagged new) ----
  {
    slug: 'stage',
    title: 'Stage',
    group: 'view',
    isNew: true,
    split: true,
    description: 'The Twilight Zone on stage: Anne Washburn\'s play, stagings of the episodes, Rod Serling\'s own plays, live readings and parodies.',
    intro: [
      'Anne Washburn\'s adaptation, licensed from CBS, wove eight episodes into one evening at London\'s Almeida Theatre in 2017, moved to the West End in 2019 and reached Edmonton in 2025. Companies across America stage the episodes themselves, perform them as live radio drama or send them up, and Serling\'s own Requiem for a Heavyweight and Patterns are still played.',
      'The Rod Serling Memorial Foundation says CBS holds the rights to stage any episode, and that the Serling family can allow only readings, usually free to the public. So a staging here is marked official only where a source says it was licensed or permitted; every page says what its source says.',
    ],
    connection: 'Official entries are Washburn\'s licensed play, productions with a sourced permission from CBS, and Serling\'s own work; the rest were staged by others without a stated licence. Theme-park attractions are under Places.',
    subs: [
      { slug: 'the-play', title: 'The Twilight Zone, the play', side: 'official', blurb: 'Anne Washburn\'s adaptation of eight episodes: the play page, with every production found.', connection: 'The stage play licensed from CBS, with the blessing of the Serling, Beaumont and Matheson estates (Den of Geek, 2019).' },
      { slug: 'episode-stagings', title: 'Stagings of the episodes', blurb: 'Professional, community, college and public-broadcaster productions of the original teleplays, each with its press source.', connection: 'Each performs one or more original episodes. Licensed only where a source says so; most sources do not say.' },
      { slug: 'serling-on-stage', title: "Rod Serling's work on stage", isNew: true, side: 'official', blurb: 'Stage versions of Serling\'s other teleplays: Requiem for a Heavyweight on Broadway and beyond, and Patterns.', connection: 'Serling\'s own plays. The Foundation names Concord Theatricals for the stage rights to Requiem for a Heavyweight and Patterns; each page says whether its source states a licence.' },
      { slug: 'live-readings', title: 'Live readings and radio-style shows', blurb: 'Staged readings with scripts in hand, and live performances in the style of radio drama.' },
      { slug: 'parodies', title: 'Parodies and tributes on stage', side: 'unofficial', blurb: 'Original comic, improvised and themed shows built on the show\'s format. Also listed with Parodies in Legacy.', connection: 'Original material in the show\'s style, not stagings of the episodes. None is licensed.' },
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
const byTitle = (a, b) => sortKey(a.title).localeCompare(sortKey(b.title));
/**
 * The nine verbs (Adam, 2026-11-21; site/INFORMATION_ARCHITECTURE.md): what a visitor wants to do. Each
 * holds categories, A-Z; Discover opens the directories. Pages at /<verb>/; the old /explore/<group>/
 * pages redirect (OLD_GROUPS).
 */
// The menu is Adam's sheet (2026-11-27, decision 0015): seven groups in this order, each listing its categories in
// the order he numbered them (`order`); a category it leaves out follows A to Z.
export const VERBS = [
  { slug: 'discover', title: 'Discover', blurb: 'The organizations and people behind it, its characters and fans, the places real and imagined, and its events and history.', order: ['organizations', 'people', 'places', 'events'] },
  { slug: 'view', title: 'View', blurb: 'TV series and episodes, movies, documentaries, the stage, and the art and design.', order: ['series', 'movies', 'stage', 'artwork'] },
  { slug: 'listen', title: 'Listen', blurb: 'Songs, soundtracks and the theme, radio dramas, podcasts and lectures.', order: ['music', 'radio', 'podcasts', 'lectures'] },
  { slug: 'read', title: 'Read', blurb: 'Scripts, books, comics, magazines, articles and essays, and the stories behind the episodes.' },
  { slug: 'play', title: 'Play', blurb: 'Pinball, video games, board and card games, mini golf, and games to play here: trivia and Six Degrees.' },
  { slug: 'collect', title: 'Collect', blurb: 'Everything a fan can own, category by category: merchandise and home video, books, comics and magazines, soundtrack albums and games.' },
  { slug: 'legacy', title: 'Legacy', blurb: 'Everything it inspired, by kind of link and category by category: homages, parodies, references, adaptations and fan-made work.' },
].map((g) => {
  const rank = (c) => { const i = (g.order ?? []).indexOf(c.slug); return i < 0 ? Infinity : i; };
  const categories = TAXONOMY.filter((c) => c.group === g.slug).sort((a, b) => rank(a) - rank(b) || byTitle(a, b));
  return { ...g, href: `/${g.slug}/`, categories };
});
export const GROUPS = VERBS;
export const groupHref = (g) => g.href;
export const verbOf = (catSlug) => VERBS.find((v) => v.categories.some((c) => c.slug === catSlug));
/** Old group pages and the verb that replaced each. */
export const OLD_GROUPS = { screen: 'view', audio: 'listen', print: 'read', games: 'play', live: 'discover', art: 'collect', legacy: 'legacy' };
/** Reading subcategories that are topics, not formats: shown as collections on Read. */
/** Collect (Adam's menu sheet, 2026-11-27: "{All categories}"): the shelves of each category that hold things a fan can
 * own, in menu order. Merchandise lists every shelf. */
export const COLLECT_FROM = [
  ['merchandise', null],
  ['reading', ['books', 'comics', 'magazines', 'scripts']],
  ['music', ['soundtracks']],
  ['games', ['pinball-arcade', 'video-games', 'board-games', 'card-games', 'trivia-games']],
];
/** Legacy (same sheet): every category with unofficial and inspired works, in menu order; each gets /legacy/<slug>/. */
export const LEGACY_FROM = ['series', 'movies', 'stage', 'artwork', 'music', 'radio', 'podcasts', 'lectures', 'reading', 'games', 'merchandise'];
/** Categories merged into another, and where their landing pages now point (shelves redirect through MOVES). */
export const MERGED_CATEGORIES = { history: '/events/' };
/** Retired menu groups and where their old pages now point: Attend and Visit (2026-11-26), Watch (Adam's menu sheet,
 * 2026-11-27), then Meet, renamed Discover (Adam, 2026-11-28; /discover/ had pointed at /legacy/ for a day). */
export const RETIRED_VERBS = { attend: '/events/', visit: '/places/', watch: '/view/', meet: '/discover/' };
/** Read's formats, exactly Adam's seven (2026-11-28, A to Z). Websites moved to Legacy (MOVES). */
export const READ_ORDER = ['articles', 'books', 'comics', 'essays', 'magazines', 'scripts', 'short-stories'];
export const READ_COLLECTIONS = ['accident-and-trial', 'anniversary-coverage', 'cast-and-crew-memoirs', 'foreign-language', 'serling-foundation-papers', 'serling-own-writing'];

/** People, Places, Organizations, in that order. */
export const SECTIONS = TAXONOMY.filter((c) => c.kind === 'section');
/** Categories A-Z, as shown in navigation. */
export const CATEGORIES_AZ = TAXONOMY.filter((c) => !c.kind || c.kind === 'category').sort(byTitle);

/** Media Library types, in display order: [key, label, what it covers]. */
export const LIBRARY_TYPES = [
  ['video', 'Video', 'Clips, interviews, promos, trailers and full programs'],
  ['audio', 'Audio', 'Radio, recordings and podcasts'],
  ['image', 'Images', 'Photographs, stills, posters, key art, covers and illustrations'],
  ['map', 'Maps', 'Maps and plans'],
  ['document', 'Documents', 'Scripts, transcripts, letters, memos and production papers'],
  ['text', 'Articles and text', 'Articles and other text published elsewhere'],
  ['review', 'Reviews', 'Reviews, rankings, award citations and aggregate scores'],
  ['interview', 'Interviews', 'Interviews in print, audio and video'],
  ['quote', 'Quotes', 'What people have said about the show'],
  ['ad', 'Advertisements', 'Commercials, promos, print ads and sponsor material'],
  ['holding', 'Archival holdings', 'Collections of papers, scripts and recordings'],
  ['link', 'Links', 'Web pages about records on this site'],
  ['file', 'Other files', 'Anything else'],
];
const MEDIA_TO_LIBRARY = { video: 'video', audio: 'audio', image: 'image', map: 'map', document: 'document', transcript: 'document', article: 'text', text: 'text', review: 'review', interview: 'interview', quote: 'quote', ad: 'ad', website: 'link', link: 'link', file: 'file' };
/** A media[] item's Media Library type. */
export function libraryType(m) {
  return MEDIA_TO_LIBRARY[m.type] ?? 'file';
}

export const OFFICIAL_LABEL = 'Official';
export const UNOFFICIAL_LABEL = 'Unofficial and inspired';

export function subTitleFromSlug(slug) {
  const s = slug.replace(/-/g, ' ');
  return s.charAt(0).toUpperCase() + s.slice(1);
}

const lc = (v) => String(v ?? '').toLowerCase();
const isSerlingName = (n) => /rod serling/i.test(String(n ?? ''));

const SERIES_LABEL = { 1959: 'The Twilight Zone (1959-1964)', 1985: 'The Twilight Zone (1985-1989)', 2002: 'The Twilight Zone (2002-2003)', 2019: 'The Twilight Zone (2019-2020)' };
export { SERIES_LABEL };

const CONN_SUB = {
  'official-adaptation': 'adaptations-remakes', remake: 'adaptations-remakes', 'inspired-by': 'inspired-by', compared: 'compared',
  homage: 'homages', parody: 'parodies', reference: 'references', 'lyric-mention': 'references',
};
/** A real place's subcategory, from its kind. */
const LOC_SUB = {
  attraction: 'attractions', 'filming-location': 'filming-locations', memorial: 'memorials-exhibits', 'museum-exhibit': 'memorials-exhibits',
  'serling-place': 'serling-places', 'backlot-set': 'sets-backlots', 'event-venue': 'venues', archive: 'venues',
};
/** Which show a filming location was used for: its first `filmed` reference, else its name. */
function filmingShow(d) {
  const ref = (d.filmed ?? [])[0]?.ref ?? '';
  const t = `${ref} ${d.name ?? ''}`;
  if (/^1959\//.test(ref)) return FILMING_GROUPS[0];
  if (/twilight-zone-the-movie/.test(ref)) return FILMING_GROUPS[1];
  if (/^films\//.test(ref)) return FILMING_GROUPS[5];
  for (const text of [t, String(d.notes ?? '')]) {
    if (/^2019\/|2019/.test(text)) return FILMING_GROUPS[4];
    if (/^2002\/|2002/.test(text)) return FILMING_GROUPS[3];
    if (/^1985\/|1985|1988/.test(text)) return FILMING_GROUPS[2];
  }
  return undefined;
}
const LOC_GROUP = {
  'backlot-set': 'Studio backlots and sets', 'filming-location': 'Filming locations', 'serling-place': "Rod Serling's places",
  attraction: 'Attractions', 'museum-exhibit': 'Museums and exhibits', memorial: 'Memorials', archive: 'Archives', 'event-venue': 'Event venues',
};
/**
 * How a song connects, and so which Music shelf and group it sits on (Music plan, sections 2 and 3, Q1 and Q3).
 * A main title (subtype main-title) goes on The themes. A sample is "confirmed" when WhoSampled or the
 * artist's credits list it (a source says so), otherwise "noted by fans". The label shows on the song's page.
 */
export function songConnection(d) {
  const tags = d.tags ?? [];
  const st = lc(d.subtype);
  const srcs = d.sources ?? [];
  if (st === 'main-title') return { shelf: 'theme', label: 'Main title' };
  const sample = st === 'sample' || tags.includes('sample') || srcs.some((x) => /\bsample of\b/i.test(x.title ?? ''));
  if (sample) {
    const sure = srcs.some((x) => /whosampled\.com/.test(x.url ?? '') || /artist'?s? credits|liner notes|album credits/i.test(x.note ?? ''));
    return { shelf: 'covers-samples', group: sure ? 'Samples listed by WhoSampled or the artist' : 'Samples noted by fans', label: d.tz_connection === 'theme' ? 'Samples the theme' : 'Samples the show' };
  }
  switch (d.tz_connection) {
    case 'theme': return { shelf: 'covers-samples', group: 'Covers and arrangements of the theme', label: 'Covers or arranges the theme' };
    case 'reference': return st === 'tribute'
      ? { shelf: 'songs-about', group: 'Tributes', label: 'A tribute to the show' }
      : { shelf: 'songs-about', group: 'About or named after the show', label: 'About or named after the show' };
    case 'lyric-mention': return tags.includes('lyric-idiom')
      ? { shelf: 'songs-mention', group: 'Uses the phrase "twilight zone"', label: 'Uses the phrase "twilight zone"' }
      : { shelf: 'songs-mention', group: 'Names the show', label: 'Names the show' };
    default: return { shelf: 'songs-mention', group: 'Not yet confirmed', label: 'Not yet confirmed' };
  }
}
/** The show or film a theme or music release belongs to (MUSIC_GROUPS), from its id, title and credits. */
const MUSIC_SERIES = [
  [/night gallery/, 'Night Gallery'],
  [/lost classics/, "Rod Serling's Lost Classics (1994)"],
  [/tower of terror/, 'The Tower of Terror'],
  [/radio drama/, 'The radio dramas'],
  [/the movie/, 'Twilight Zone: The Movie (1983)'],
  [/1985|grateful dead|merl saunders/, 'The Twilight Zone (1985)'],
  [/2002|jonathan davis/, 'The Twilight Zone (2002)'],
  [/2019|beltrami/, 'The Twilight Zone (2019)'],
];
export function musicSeries(id, d) {
  const t = lc(`${id} ${d.title ?? ''} ${d.creator ?? ''} ${d.artist ?? ''}`).replace(/-/g, ' ');
  return MUSIC_SERIES.find(([re]) => re.test(t))?.[1] ?? 'The Twilight Zone (1959)';
}
/** Date order inside a group: the year, then the title. */
const chronoSort = (d) => `${String(d.year ?? '9999').slice(0, 4)} ${sortKey(d.title ?? '')}`;
/** Kinds of book record that are a story an episode adapts (Read plan, section 2). */
export const SOURCE_KINDS = new Set(['short-story', 'radio-play', 'source-book']);
const BOOK_GROUP = {
  anthology: 'Story anthologies', scripts: 'Scripts and teleplays', scholarly: 'Scholarship and criticism', novel: 'Novels', reference: 'Guides and reference',
  novelization: 'Novelizations', biography: 'Biography and memoir', memoir: 'Biography and memoir', juvenile: 'Young readers', 'puzzle-trivia': 'Art, poetry and puzzle books',
  'art-book': 'Art, poetry and puzzle books', 'graphic-novel': 'Graphic novels', play: 'Scripts and teleplays', other: 'Other books',
  poetry: 'Art, poetry and puzzle books', accident: 'The 1982 accident and the trial', lessons: 'Lessons, faith and self-help',
};
const LEGAL_GROUP = (st) => (/trial|investigation|safety|child|regulat/.test(st) ? 'The 1982 accident and trial'
  : /censor|sponsor/.test(st) ? 'Censorship'
  : /suit|plagiar|dispute|credit/.test(st) ? 'Lawsuits and credit disputes'
  : 'Rights and ownership');
const LANGUAGE_GROUP = (st) => (/theme|sound/.test(st) ? 'The theme as shorthand'
  : /dictionar|ranking/.test(st) ? 'Dictionaries'
  : /public|politic/.test(st) ? 'Public uses'
  : 'Catchphrases and idioms');

/**
 * Old "category/subcategory" slugs, from before Adam's category-versus-content rule (2026-11-20), and
 * where they go now. A function returns the placement; 'content' means the record is content on
 * other records rather than a category entry.
 */
const ALIASES = {
  'advertising/*': 'content',
  'archives/*': 'content',
  'quotes/*': 'content',
  'reviews/*': 'content',
  'series/radio': ['radio', 'radio-dramas'],
  'series/podcast': ['podcasts', 'shows'],
  'episodes/radio': ['radio', 'radio-dramas'],
  'episodes/radio-original-stories': ['radio', 'original-stories'],
  'episodes/radio-unmade-tv-scripts': ['radio', 'unmade-scripts'],
  'episodes/podcast': ['podcasts', 'single-episodes'],
  'media/*': 'content',
  'community/fan-communities': ['organizations', 'fan-groups'],
  'community/organizations': ['organizations', 'foundations-societies'],
  'community/websites-databases': ['homages', 'websites'],
  'cultural-impact/catchphrases': ['homages', 'in-everyday-language', 'Catchphrases and idioms'],
  'cultural-impact/theme-shorthand': ['homages', 'in-everyday-language', 'The theme as shorthand'],
  'cultural-impact/public-uses': ['homages', 'in-everyday-language', 'Public uses'],
  'cultural-impact/dictionary-rankings': ['homages', 'in-everyday-language', 'Dictionaries'],
  'legal-history/trials': ['events', 'legal', 'The 1982 accident and trial'],
  'legal-history/accident-trial': ['events', 'legal', 'The 1982 accident and trial'],
  'legal-history/lawsuits': ['events', 'legal', 'Lawsuits and credit disputes'],
  'legal-history/censorship': ['events', 'legal', 'Censorship'],
  'legal-history/rights-ownership': ['events', 'legal', 'Rights and ownership'],
  'props-collecting/props-costumes': ['artwork', 'props-costumes'],
  'props-collecting/auctions': ['artwork', 'props-costumes', 'Sold at auction'],
  'props-collecting/museum-holdings': ['artwork', 'props-costumes', 'In museums'],
  'props-collecting/replicas': ['merchandise', 'replicas'],
  'merchandise/prop-replicas': ['merchandise', 'replicas'],
  'artwork/comic-and-magazine-covers': ['artwork', 'covers'],
  'artwork/makeup-and-production-design': ['artwork', 'production-design'],
  'artwork/exhibitions': ['events', 'exhibitions', 'Art exhibitions'],
  'events/broadcasts-marathons': ['events', 'broadcasts-marathons', 'TV marathons'],
};
/**
 * The nine-verb structure (Adam, 2026-11-21) moved some subcategories. Every placement, however it was
 * made, passes through here: milestones went from Events to History (and back in 2026-11-27), attractions from Stage to Places,
 * composers from Music to People, and two one-record subcategories fold into their neighbours.
 */
const MOVES = {
  // Adam (2026-11-28): Read lists seven items. Websites became a kind of link in Legacy, and the stories behind the
  // episodes became Short stories.
  'reading/websites': ['homages', 'websites'],
  'reading/source-stories': ['reading', 'short-stories'],
  // Adam's menu sheet (2026-11-27): board and card games split.
  'games/board-card-games': ['games', 'board-games'],
  // Television (2026-11-21): TV series and TV episodes became one category.
  'episodes/tv': ['series', 'episodes'],
  // Adam's menu sheet (2026-11-27): History's shelves joined Events, where they had first been (2026-11-21).
  'history/honors-awards': ['events', 'honors-awards'],
  'history/premieres': ['events', 'premieres'],
  'history/production-history': ['events', 'production-history'],
  'history/serling-life': ['events', 'serling-life'],
  'history/legal': ['events', 'legal'],
  'stage/attractions': ['places', 'attractions'],
  'music/composers': ['people', 'composers'],
  'places/lecture-event-venues': ['places', 'venues'],
  'merchandise/ornaments': ['merchandise', 'household-apparel'],
  'games/slot-and-casino-games': ['games', 'pinball-arcade'],
  // Radio (2026-11-24): the five shelves of docs/plans/research-radio.md replace Radio series and Radio episodes.
  'radio/series': ['radio', 'radio-dramas'],
  'radio/episodes': ['radio', 'radio-dramas'],
  // Stage (2026-11-24): the five shelves of docs/plans/research-stage.md replace Theatre.
  'stage/theatre': ['stage', 'episode-stagings'],
  // Music (2026-11-24): docs/plans/research-music.md splits Songs into three shelves; the old address goes to the
  // largest of them.
  'music/songs': ['music', 'songs-mention'],
  // Attend (2026-11-24): docs/plans/research-attend.md folds Readings and panels into Talks about the show.
  'lectures/readings-panels': ['lectures', 'academic'],
  // Collect (Adam, 2026-11-26): physical art belongs with Merchandise; the rest of Artwork became Art and design in
  // Discover.
  'artwork/props-costumes': ['merchandise', 'props-costumes'],
  'artwork/posters-key-art': ['merchandise', 'posters-prints'],
};
export function remap(cat, sub) {
  const m = MOVES[`${cat}/${sub}`];
  return m ? { cat: m[0], sub: m[1] } : { cat, sub };
}
/** Old category addresses and where they live now, for redirects. */
export const MOVED_PATHS = Object.fromEntries(Object.entries(MOVES).map(([k, [c, s]]) => [`/${k}/`, `/${c}/${s}/`]));
function alias(cat, sub) {
  const a = ALIASES[`${cat}/${sub}`] ?? ALIASES[`${cat}/*`];
  if (!a) return { cat, sub };
  if (a === 'content') return { content: true };
  return { cat: a[0], sub: a[1], group: a[2] };
}

/**
 * Content: a record that belongs on other records' pages instead of in a category.
 * Returns { kind, label } or null; kind is a Media Library type.
 */
export function contentOf(col, d) {
  if (col === 'quotes') return { kind: 'quote', label: 'Quote' };
  if (col === 'essays' && d.kind === 'review') return { kind: 'review', label: 'Review' };
  if (col === 'essays' && d.kind === 'interview') return { kind: 'interview', label: 'Interview' };
  if (col === 'archives') return { kind: 'holding', label: 'Archival holding' };
  if ((col === 'works' && d.kind === 'advertisement') || (col === 'films' && d.kind === 'commercial')) return { kind: 'ad', label: 'Advertisement' };
  // A page about a record elsewhere (a database entry, an official or streaming page, an archive's or
  // foundation's site) is a link on that record, not a website in its own right.
  if (col === 'works' && d.kind === 'link' && /^(database|official|streaming|archive|foundation|museum)$/.test(lc(d.subtype))) return { kind: 'link', label: 'Link' };
  // Media are never categories (Collect plan, section 2): a radio segment, podcast episode, interview or reference
  // list about a record attaches to that record and is gathered in the Media Library.
  if (col === 'works') {
    const st = lc(d.subtype);
    if (/^(radio-segment|podcast-episode)$/.test(st)) return { kind: 'audio', label: 'Audio' };
    if (/^(artist-interview|interview)$/.test(st)) return { kind: 'interview', label: 'Interview' };
    if (/^(episode-song-list|reference-index)$/.test(st)) return { kind: 'link', label: 'Link' };
  }
  for (const s of d.categories ?? []) {
    const [cat] = s.split('/');
    if (cat === 'advertising') return { kind: 'ad', label: 'Advertisement' };
    if (cat === 'archives') return { kind: 'holding', label: 'Archival holding' };
    if (cat === 'reviews') return { kind: 'review', label: 'Review' };
  }
  return null;
}

/**
 * What a content record is attached to, as references or names for the catalogue to resolve:
 * `content_of` refs ("series/1959", "people/rod-serling", "organizations/cbs", "films/<id>", an episode id),
 * then `details.relates_to` names, a quote's person and episodes, an archive's institution.
 */
export function contentParents(col, d) {
  const out = [...(d.content_of ?? [])];
  for (const t of d.details?.relates_to ?? []) out.push(String(t));
  if (col === 'quotes') { if (d.person) out.push(`person:${d.person}`); for (const e of d.episodes ?? []) out.push(e); }
  if (col === 'archives' && d.institution) out.push(`org:${d.institution}`);
  if (col === 'essays') { for (const r of d.reviews ?? []) out.push(r); for (const e of d.episodes ?? []) out.push(e); }
  for (const o of d.organizations ?? []) out.push(`org:${o}`);
  return [...new Set(out)];
}

/**
 * Where a record belongs. Returns [{ cat, sub, group? }]; empty for content (see contentOf).
 * `ctx` carries cross-collection facts:
 *   assessSub(key) -> the review assessment's subcategory label, if any
 *   connKinds(key) -> connection kinds where this record is the `from` end
 */
/** Groups on "Rod Serling's films", by his part in each (film field serling_role). */
const SERLING_ROLE = {
  written: 'Written by Serling',
  'from-his-work': 'From his work',
  narrated: 'Narrated by Serling',
  appeared: 'Serling on screen',
  play: 'TV plays of 70 minutes or more',
};
/**
 * Anthology series whose plays all ran 70 minutes or more, with the source. Playhouse 90: "Running time:
 * 72–78 minutes" (Wikipedia, Playhouse 90, read 2026-11-23).
 */
const FEATURE_SLOTS = new Set(['Playhouse 90']);
/** Is a TV play 70 minutes or longer (Adam, Q1)? Its own runtime, or its series' slot. */
export function isFeatureLength(d) {
  return (d.runtime_min ?? 0) >= 70 || FEATURE_SLOTS.has(String(d.parent_series ?? '').trim());
}

/** Rod Serling's part in a radio work, as the group headings on Radio > Rod Serling's radio work. */
const SERLING_RADIO_ROLE = { wrote: 'Written by Serling', acted: 'Serling as an actor', hosted: 'Hosted or narrated by Serling', unproduced: 'Scripts and series never produced' };

export function place(col, id, d, ctx = {}) {
  /** @type {{cat: string, sub: string, group?: string}[]} */
  const out = [];
  const add = (cat, sub, group, sort) => out.push(historyDefaults({ ...remap(cat, sub), group, ...(sort ? { sort } : {}) }, d));
  const asub = ctx.assessSub?.(`${col}/${id}`);
  const tags = d.tags ?? [];
  const subtype = lc(d.subtype);
  const content = contentOf(col, d);
  if (content) {
    // Artwork is both a category and content: a poster is listed under Artwork as well.
    if (content.kind === 'ad' && /poster|one-sheet|key-art/.test(subtype)) add('artwork', 'posters-key-art', 'Posters and key art');
    return out;
  }

  switch (col) {
    case 'series':
      add('series', 'twilight-zone');
      break;
    case 'episodes':
      add('series', 'episodes', SERIES_LABEL[d.series] ?? d.series);
      break;
    case 'films': {
      const k = d.kind ?? 'film';
      const conns = ctx.connKinds?.(`films/${id}`) ?? [];
      const host = hostShow(id, d);
      if (host === 'Night Gallery' || id === 'night-gallery') { add('series', 'serling-series', 'Night Gallery'); break; }
      if (k === 'tv-series') {
        if (tags.includes('radio-only')) { add('radio', 'anthologies'); break; }
        // A record for a show whose entries are already on shelves (finish-open-items plan, 2026-11-24): it sits in its
        // show's own group, beside its episodes, rather than being counted as a homage or an anthology of its own.
        if (tags.includes('host-show')) {
          if (tags.includes('serling-plays')) add('series', 'serling-series', 'Anthologies he wrote plays for');
          else add('series', 'homages', d.title);
          break;
        }
        if (asub === "Rod Serling's other screen work") add('series', 'serling-series', "Rod Serling's series");
        else if (tags.includes('tz-writers')) add('series', 'anthologies', 'Series by Twilight Zone writers');
        else if (tags.includes('anthology-family') || asub === 'Fellow anthology series') add('series', 'anthologies', 'Anthology series');
        else add('series', 'homages', 'Whole series');
        break;
      }
      if (ENTRY_KINDS.has(k)) {
        if (asub === "Rod Serling's other screen work" && !conns.length) {
          add('series', 'serling-series', 'Plays for other series');
          // A TV play of 70 minutes or more is also listed in Movies (Adam, Q1, 2026-11-23).
          if (isFeatureLength(d)) add('movies', 'rod-serling-films', SERLING_ROLE.play);
        } else {
          add('homages', 'in-other-shows', { 'tv-episode': 'Episodes', 'tv-segment': 'Segments', sketch: 'Sketches', 'web-series': 'Web series' }[k]);
          add('series', 'homages', host ?? d.title);
        }
        break;
      }
      if (k === 'stage') { add('stage', 'the-play', 'The play'); break; } // Stage plan, shelf A
      // Movies: six shelves (docs/plans/research-movies.md, section 2).
      // A record placed by hand somewhere else and nowhere in Movies (pilots in Television, the holiday
      // marathons in broadcast history) is not a film.
      if ((d.categories ?? []).length && !(d.categories ?? []).some((c) => c.startsWith('movies/'))) break;
      if (k === 'music-video') { add('music', 'music-videos'); break; } // Adam, Q3: music videos are Music
      if (tags.includes('fan-made') || /\bfan film\b/i.test(d.summary ?? '')) { add('homages', 'fan-made', /\bfan film\b/i.test(d.summary ?? '') ? 'Fan films' : 'Fan edits and supercuts'); break; }
      if (k === 'unproduced') {
        add('movies', 'unmade-projects', (d.writers ?? []).some(isSerlingName) ? "Rod Serling's unproduced scripts" : 'Twilight Zone films');
        break;
      }
      // A: made under the Twilight Zone name. A documentary about Serling made elsewhere is on C only.
      const tzFilm = asub === 'Twilight Zone productions' && (k !== 'documentary' || /^The Twilight Zone\b/.test(d.title ?? ''));
      if (tzFilm) add('movies', 'twilight-zone-films');
      // B: anything Serling wrote, that was made from his work, or that he narrated (Adam, Q5).
      if (d.serling_role) add('movies', 'rod-serling-films', SERLING_ROLE[d.serling_role]);
      // C: documentaries, including the ones Serling narrated (listed on B as well).
      if (k === 'documentary') add('movies', 'documentaries', d.serling_role === 'narrated' ? 'Narrated by Rod Serling' : 'About Rod Serling and the show');
      // E: films by the show's makers with a sourced tie (tag tz-makers); D: every other film with a link.
      if (tags.includes('tz-makers')) add('movies', 'tz-makers');
      else if (!tzFilm && !d.serling_role && k !== 'documentary') add('movies', 'linked-films');
      break;
    }
    case 'connections': {
      // References are grouped by their evidence (finish-open-items plan, 2026-11-24, decided for Adam): a reader can
      // see at once which passing references the makers confirmed and which only fans have noted.
      const sub = CONN_SUB[d.kind] ?? 'references';
      if (sub === 'references') add('homages', sub, EVIDENCE_GROUP[d.confidence] ?? 'Documented');
      else add('homages', sub);
      break;
    }
    case 'songs': {
      const c = songConnection(d);
      if (c.shelf === 'theme') add('music', 'theme', musicSeries(id, d), chronoSort(d));
      else add('music', c.shelf, c.group);
      break;
    }
    case 'books': {
      // Read plan (2026-11-24): a script book sits on Scripts and teleplays only; every other book takes its
      // group from its kind. Books with no Twilight Zone in them ("related") are grouped by who made them.
      if (d.kind === 'scripts' || d.kind === 'play') { add('reading', 'scripts', 'Books'); break; }
      if (SOURCE_KINDS.has(d.kind)) {
        const first = String((d.episodes ?? [])[0] ?? '');
        add('reading', 'short-stories', /^films\/night-gallery/.test(first) ? 'Night Gallery' : /^(1985|2019)\//.test(first) ? `The Twilight Zone (${first.slice(0, 4)})` : 'The Twilight Zone (1959)');
        break;
      }
      const authors = (d.authors ?? []).join(' ');
      const g = asub === 'Audiobooks' ? 'Audiobooks'
        : /night gallery/i.test(d.title ?? '') ? 'Night Gallery'
        : asub === 'Rod Serling and Night Gallery' ? (/\bRod Serling\b/.test(authors) ? "Rod Serling's other books" : "Books by the show's writers")
        : BOOK_GROUP[d.kind] ?? 'Other books';
      add('reading', 'books', g);
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
        add('lectures', (d.authors ?? []).some(isSerlingName) ? 'serling-lectures' : 'academic', (d.authors ?? []).some(isSerlingName) ? 'Speeches and lectures' : undefined);
      } else if (k === 'script') add('reading', 'scripts', 'Single scripts');
      // A short story by Serling himself (The Strand, 2024) sits on Short stories (Adam, 2026-11-28), not Essays.
      else if (/\bshort story\b/i.test(d.description ?? '') && (d.authors ?? []).some(isSerlingName)) add('reading', 'short-stories', "Rod Serling's short stories");
      else if (k === 'interview' || k === 'article') add('reading', 'articles', k === 'interview' ? 'Interviews' : 'Articles');
      else add('reading', 'essays', { 'journal-article': 'Journal articles', 'book-chapter': 'Book chapters', essay: 'Essays', 'academic-thesis': 'Theses and dissertations' }[k] ?? 'Essays');
      break;
    }
    case 'radio':
      // Radio (plan docs/plans/research-radio.md, approved 2026-11-23): five shelves. The series record and its
      // broadcast and release records are shown on the series page, not on a shelf (Q2).
      if (d.series_title === 'The Twilight Zone Radio Dramas') {
        if (id === 'twilight-zone-radio-dramas-series') { add('radio', 'radio-dramas', 'The Twilight Zone Radio Dramas', '00-00'); break; }
        if (d.subtype === 'audio-series' || d.subtype === 'radio-broadcast') break;
        const pad = (n) => String(n ?? 99).padStart(2, '0');
        add('radio', 'radio-dramas', d.season ? `Season ${d.season}` : 'Season not yet confirmed', `${pad(d.season)}-${pad(d.season_order)}`);
      } else if (tags.includes('fan-made')) { add('radio', 'fan-audio'); add('homages', 'fan-made', 'Fan audio dramas'); }
      else if (tags.includes('audio-adaptation')) add('radio', 'adaptations');
      else add('radio', 'serling-radio', SERLING_RADIO_ROLE[d.serling_role] ?? "Rod Serling's radio work");
      break;
    case 'podcasts':
      // Podcasts plan round 1: the record's kind says what it is; the assessment label is the fallback.
      // Podcasts step 3: four shelves by kind; shows grouped by coverage, single episodes by subject.
      if (d.kind === 'single-episode' || (!d.kind && asub === 'Single episodes of other podcasts')) add('podcasts', 'single-episodes', PODCAST_SUBJECTS[d.subject] ?? 'The show');
      else if (d.kind === 'fiction') add('podcasts', 'fiction', (d.tags ?? []).includes('needs-tie-check') ? 'Tie not yet confirmed' : 'Inspired by the show, in their own words');
      else add('podcasts', 'shows', podcastGroup(d));
      break;
    case 'characters':
      add('people', 'characters', { human: 'People', alien: 'Aliens', robot: 'Robots and machines', supernatural: 'Supernatural beings', animal: 'Animals', object: 'Objects' }[d.kind] ?? undefined);
      break;
    case 'locations':
      // Visit plan (docs/plans/research-visit.md, section 2).
      if (d.kind === 'in-story') add('places', 'in-story');
      else if (!d.kind && /\bfest\b|festival|serlingfest/i.test(d.name ?? '')) add('events', 'anniversaries-festivals', /serlingfest/i.test(d.name ?? '') ? 'SerlingFest' : 'Film festivals');
      else {
        add('places', LOC_SUB[d.kind] ?? 'real-life', d.kind === 'filming-location' ? filmingShow(d) : d.kind === 'attraction' ? (/tower of terror/i.test(d.name ?? '') ? 'The Tower of Terror' : 'Experiences') : undefined);
        if (d.kind === 'memorial') add('events', 'honors-awards', 'Memorials');
        if (d.kind === 'museum-exhibit') add('events', 'exhibitions', 'Museum exhibits');
      }
      break;
    case 'organizations':
      add('organizations', ORG_SUB[d.kind] ?? 'other-organizations');
      break;
    case 'works':
      placeWork(d, subtype, add, id);
      break;
    default:
      break;
  }
  return out;
}

function ad_group(st, d) {
  if (/sponsor|billboard/.test(st) || /sponsor/i.test(d.title ?? '')) return 'Sponsors and sponsor material';
  if (/trailer|promo|sales-pitch/.test(st)) return 'Promos, trailers and sales films';
  if (/print|vintage|poster|magazine|newspaper/.test(st)) return 'Print advertising and posters';
  if (/psa/.test(st)) return 'Public service announcements';
  if (/licens/.test(st)) return 'Licensing offers';
  return 'Commercials';
}

/** The three evidence marks (src/lib/data.ts CONFIDENCE_LABELS), as group names on the References shelf. */
const EVIDENCE_GROUP = { 'confirmed-by-creator': 'Confirmed by its makers', documented: 'Documented', 'fan-noted': 'Noted by fans' };

/** True when an event's last known day is today or later (dates in details.date or details.dates, else the year). */
export function isUpcoming(d, today = new Date().toISOString().slice(0, 10)) {
  const txt = [d.details?.date, d.details?.dates, d.date].filter(Boolean).join(' ');
  const days = String(txt).match(/\b(19|20)\d\d-\d\d-\d\d\b/g);
  if (days?.length) return days.sort().at(-1) >= today;
  const y = Number(String(d.year ?? '').match(/(19|20)\d\d/)?.[0]);
  return Boolean(y) && y > Number(today.slice(0, 4));
}

/** organizations.kind -> subcategory */
export const ORG_KINDS = ['network', 'studio', 'streamer', 'production-company', 'publisher', 'licensee', 'record-label', 'game-company', 'toy-company', 'home-video', 'sponsor', 'advertiser', 'archive', 'library', 'museum', 'foundation', 'society', 'award-body', 'school', 'fan-group', 'website', 'auction-house', 'other'];
const ORG_SUB = {
  network: 'networks-studios', studio: 'networks-studios', streamer: 'networks-studios', 'production-company': 'production-companies',
  publisher: 'publishers', licensee: 'licensees', 'record-label': 'licensees', 'game-company': 'licensees', 'toy-company': 'licensees', 'home-video': 'licensees',
  sponsor: 'sponsors', advertiser: 'sponsors', archive: 'archives-libraries', library: 'archives-libraries', museum: 'museums',
  foundation: 'foundations-societies', society: 'foundations-societies', 'award-body': 'award-bodies', school: 'schools', 'fan-group': 'fan-groups',
  website: 'other-organizations', 'auction-house': 'other-organizations', other: 'other-organizations',
};
export const orgSub = (kind) => ORG_SUB[kind] ?? 'other-organizations';

function placeWork(d, st, add, id) {
  const k = d.kind;
  const isSerling = isSerlingName(d.creator) || /rod serling/i.test(d.title);
  switch (k) {
    case 'soundtrack': {
      // Music plan, shelves A to C: a recording of the theme by others is a cover; a main title, an unused
      // theme or an attraction's music is a theme; everything else is a release, grouped by show or film.
      // A compilation that mixes other shows' music, or pairs the theme with another show's, is a compilation.
      if (st === 'theme-cover') { add('music', 'covers-samples', 'Covers and arrangements of the theme'); return; }
      const mixed = (st === 'compilation' && !/twilight zone/i.test(d.title ?? '')) || /outer limits/i.test(d.title ?? '');
      if (!mixed && /^theme|unused-theme|attraction-music/.test(st)) { add('music', 'theme', musicSeries(id, d), chronoSort(d)); return; }
      add('music', 'soundtracks', mixed ? 'Compilations' : musicSeries(id, d));
      return;
    }
    case 'game':
      // Games plan (docs/plans/research-games.md, section 2): one shelf per record, nods kept apart.
      if (st === 'fan-game') add('homages', 'fan-made', 'Fan games'); // Discover plan: fan work is also listed in Legacy
      if (/homage|reference|fan-game|name-only/.test(st)) add('games', 'game-homages', st === 'fan-game' ? 'Fan-made games' : st === 'name-only' ? 'Name only, link not confirmed' : /pinball/.test(st) ? 'Pinball tables' : 'Video games');
      else if (st === 'pinball') add('games', 'pinball-arcade', 'The 1993 table');
      else if (st === 'game-appearance') add('games', 'pinball-arcade', 'Digital versions of the table');
      else if (/slot/.test(st)) add('games', 'pinball-arcade', 'Slot machines');
      else if (/pinball/.test(st)) add('games', 'pinball-arcade', 'Home software and the rumored remake');
      else if (/unreleased|interactive-film/.test(st)) add('games', 'video-games', 'Unreleased and unmade');
      else if (/promotional/.test(st)) add('games', 'video-games', 'Tower of Terror tie-ins');
      else if (/video|vr|mobile|computer/.test(st)) add('games', 'video-games', 'Released');
      else if (/unrealized/.test(st)) add('games', 'board-games', 'Proposed, never made');
      else if (/trivia/.test(st)) add('games', 'trivia-games');
      else if (/card/.test(st)) add('games', 'card-games');
      else if (st === 'mini-golf') add('games', 'mini-golf');
      else if (/board|puzzle/.test(st)) add('games', 'board-games', 'Published');
      else add('games', 'other-games');
      return;
    case 'collectible': {
      // Collect plan (docs/plans/research-collect.md, section 2): one shelf per record, chosen by subtype.
      const pub = lc(d.publisher);
      if (/home-video|dvd|blu|laserdisc|vhs/.test(st)) add('merchandise', 'home-media', homeVideoShow(d.title));
      else if (/replica/.test(st)) add('merchandise', 'replicas');
      else if (/trading-card/.test(st)) add('merchandise', 'trading-cards');
      else if (/mask|costume/.test(st)) add('merchandise', 'masks-and-costumes');
      else if (/figure|bobblehead|doll|toy|diorama|building-set/.test(st)) add('merchandise', 'toys-figures', TOY_MAKER(id, pub));
      else if (/apparel|shirt|polo/.test(st)) add('merchandise', 'household-apparel', 'Clothing');
      else if (/mug|drinkware|home-goods/.test(st)) add('merchandise', 'household-apparel', 'Mugs and drinkware');
      else if (/\bpin\b|enamel-pin|decal|ornament/.test(st)) add('merchandise', 'household-apparel', 'Pins, decals and ornaments');
      else if (/theme-park/.test(st) || /tower of terror/i.test(d.title ?? '')) add('merchandise', 'collectibles', 'Tower of Terror souvenirs');
      else if (/sheet-music/.test(st)) add('merchandise', 'collectibles', 'Sheet music');
      else add('merchandise', 'collectibles', 'Other collectibles');
      return;
    }
    case 'home-media':
      add('merchandise', 'home-media', homeVideoShow(d.title));
      return;
    case 'artwork':
      if (/gallery-show|exhibition/.test(st)) add('events', 'exhibitions', 'Art exhibitions');
      else if (/auction/.test(st)) add('artwork', 'props-costumes', 'Sold at auction');
      else if (/poster|key-art/.test(st)) add('artwork', 'posters-key-art', 'Posters and key art');
      else if (/print/.test(st)) add('artwork', 'posters-key-art', 'Art prints');
      else if (/title/.test(st)) add('artwork', 'title-design');
      else if (/cover|comic-art|magazine-illustration/.test(st)) add('artwork', 'covers', /magazine/.test(st) || /magazine|tv guide/i.test(d.title ?? '') ? 'Magazines' : 'Comics');
      else if (/night-gallery-painting/.test(st)) add('artwork', 'night-gallery-paintings', 'The paintings');
      else if (/art-book/.test(st) && /night gallery/i.test(d.title ?? '')) add('artwork', 'night-gallery-paintings', 'About the paintings');
      else if (/make-?up|mask|design|effects/.test(st)) add('artwork', 'production-design');
      else if (st) add('artwork', 'art-illustration');
      else add('artwork', 'other-artwork');
      return;
    case 'stage':
      // Five shelves (docs/plans/research-stage.md, section 2), chosen by the record's subtype.
      if (st === 'washburn-production') add('stage', 'the-play', 'Productions');
      else if (st === 'serling-play') add('stage', 'serling-on-stage', String(d.title ?? '').replace(/\s*\(.*$/, ''));
      else if (/reading|audio|radio/.test(st)) add('stage', 'live-readings', /radio|audio/.test(st) ? 'Radio-style shows' : 'Readings');
      else if (st === 'parody' || st === 'tribute-show') {
        add('stage', 'parodies', st === 'parody' ? 'Parodies' : 'Tributes and themed shows');
        if (st === 'parody') add('homages', 'parodies');
      } else add('stage', 'episode-stagings');
      return;
    case 'attraction':
      // Visit plan: a marker or plaque is a memorial; museum exhibits are memorials and exhibits, and Events.
      if (/museum|exhibit/.test(st) || /marker|plaque|statue|memorial/i.test(d.title ?? '')) add('places', 'memorials-exhibits');
      else add('places', 'attractions', /tower of terror/i.test(d.title ?? '') ? 'The Tower of Terror' : 'Experiences');
      if (/museum|exhibit/.test(st)) add('events', 'exhibitions', 'Museum exhibits');
      return;
    case 'event':
      // Attend plan (docs/plans/research-attend.md, section 2): Events lists gatherings; milestones go to its History shelves.
      // Finish-open-items plan (2026-11-24): an event still to come is also listed under Coming up.
      if (st !== 'history' && isUpcoming(d)) add('events', 'upcoming');
      if (st === 'history') {
        if (/accident/.test(lc(d.title))) add('events', 'legal', 'The 1982 accident and trial');
        else if (!(d.categories ?? []).length) add('events', /serling/i.test(d.title ?? '') ? 'serling-life' : 'production-history');
        return;
      }
      if (/honor|award|stamp/.test(st)) add('events', 'honors-awards');
      else if (/festival|anniversary/.test(st)) add('events', 'anniversaries-festivals', /serlingfest/.test(id) ? 'SerlingFest' : /festival/.test(st) ? 'Film festivals' : 'Anniversaries and days');
      else if (/marathon/.test(st)) add('events', 'broadcasts-marathons', 'TV marathons');
      else if (/screening/.test(st)) add('events', 'broadcasts-marathons', 'Screenings');
      else if (/broadcast/.test(st)) add('events', 'production-history');
      else if (/premiere/.test(st)) add('events', 'premieres');
      else if (/exhibit/.test(st)) add('events', 'exhibitions', 'Museum exhibits');
      else if (/concert/.test(st)) add('music', 'covers-samples', 'Covers and arrangements of the theme');
      else if (/convention/.test(st)) add('events', 'conventions', CONVENTION_GROUP(id, d));
      else if (/trial|lawsuit|suit/.test(st)) add('events', 'legal', LEGAL_GROUP(st));
      else if (/production|accident/.test(st)) add('events', 'production-history');
      else add('events', 'other-events');
      if (/accident/.test(lc(d.title)) && !/trial/.test(st)) add('events', 'legal', 'The 1982 accident and trial');
      return;
    case 'convention':
      add('events', 'conventions', CONVENTION_GROUP(id, d));
      return;
    case 'memorial':
      add('places', 'memorials-exhibits');
      add('events', 'honors-awards', 'Memorials');
      return;
    case 'parody':
      // Discover plan: a record placed by hand on a Legacy shelf (a gag, a passing reference) sits there only.
      if (!(d.categories ?? []).some((c) => c.startsWith('homages/'))) add('homages', 'parodies');
      return;
    case 'television':
      if (/around the world|international|local titles/i.test(d.title ?? '')) add('series', 'international');
      else add('series', 'serling-series', 'Rod Serling on television');
      return;
    case 'link':
      if (/fan-site|fan site/.test(st)) add('homages', 'websites', 'Fan sites');
      else if (/fan|community|subreddit|wiki|forum/.test(st)) add('organizations', 'fan-groups');
      else if (/foundation|society/.test(st)) add('organizations', 'foundations-societies');
      else if (/museum/.test(st)) add('organizations', 'museums');
      else if (/archive/.test(st)) add('organizations', 'archives-libraries', 'Online archives');
      else add('homages', 'websites', { database: 'Databases', reference: 'Reference sites', official: 'Official sites', streaming: 'Streaming', academic: 'Academic' }[st]);
      return;
    case 'fan-community':
      add('organizations', 'fan-groups', /contest/.test(st) ? 'Contests' : undefined);
      return;
    case 'education':
      add('lectures', 'classroom', /course|university|college|seminar|olli|themester|lifelong/i.test(`${st} ${d.title} ${d.publisher ?? ''}`) ? 'University and adult courses' : 'School lessons and resources');
      return;
    case 'lecture':
      // Attend plan, section 2: a talk is Serling's only when he gave it (the record's creator), not when its title
      // names him. His seminars and classes are "Teaching".
      if (isSerlingName(d.creator)) add('lectures', 'serling-lectures', /seminar|class/.test(st) ? 'Teaching' : 'Speeches and lectures');
      else add('lectures', 'academic');
      return;
    case 'legal':
      add('events', 'legal', LEGAL_GROUP(st));
      return;
    case 'cultural-impact':
      if (/parody/.test(st)) add('homages', 'parodies');
      else add('homages', 'in-everyday-language', LANGUAGE_GROUP(st));
      return;
    case 'prop':
      if (/collector/.test(st)) add('organizations', 'fan-groups', 'Collectors');
      else if (/make-?up/.test(st)) add('artwork', 'production-design');
      else add('artwork', 'props-costumes', /auction/.test(st) ? 'Sold at auction' : /museum|collection/.test(st) ? 'In museums and collections' : /reuse/.test(st) ? 'Reused props' : 'Surviving pieces');
      return;
    case 'production':
      add('events', 'production-history');
      return;
    default: // other
      if (/audiobook/.test(st)) add('reading', 'books', 'Audiobooks');
      else if (/language|idiom|phrase/.test(st)) add('homages', 'in-everyday-language', 'Catchphrases and idioms');
      else if (/prop|costume/.test(st)) add('artwork', 'props-costumes', 'Surviving pieces');
      // Collect plan, section 2: what used to fall into "Other merchandise" goes where it belongs.
      else if (/home-video|dvd|blu|laserdisc|vhs/.test(st)) add('merchandise', 'home-media', homeVideoShow(d.title));
      else if (/script-archive|auction/.test(st)) add('artwork', 'props-costumes', 'Sold at auction');
      else if (/stock-music-library/.test(st)) add('events', 'production-history');
      else if (/theme-use/.test(st)) add('homages', 'in-everyday-language', 'The theme as shorthand');
      else if (st === 'book') add('reading', 'books', 'Scholarship and criticism');
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
  if (r.some((x) => /producer|developer|showrunner/.test(x)) || c.some((x) => /producer|series creator/.test(x))) out.add('producers');
  if (r.some((x) => /^actor|actress|performer/.test(x)) || c.includes('cast')) out.add('actors');
  if (c.includes('radio cast') || r.some((x) => /voice/.test(x))) out.add('voice-actors');
  if (any(/narrator|host/)) out.add('narrators-hosts');
  if (any(/composer|theme music|music|musician|conductor|orchestrat/)) out.add('composers');
  if (r.some((x) => /cinematograph|editor|make-?up|effects|crew|art director|set decorat|designer|artist|costume|photograph|casting/.test(x) && !/pinball|game/.test(x)) && !r.some((x) => /story editor/.test(x) && r.length === 1)) out.add('crew');
  if (r.some((x) => /story editor/.test(x))) out.add('writers');
  if (c.some((x) => /comics artist|cover artist|inker|colorist/.test(x)) || r.some((x) => /illustrat|painter|comic artist|cover artist/.test(x))) out.add('artists');
  if (r.some((x) => /pinball|game (designer|programmer|artist)/.test(x))) out.add('game-makers'); // Meet plan: the pinball and game teams
  if (r.some((x) => /historian|scholar|biographer|critic|teacher|professor|archivist/.test(x))) out.add('scholars-historians');
  if (r.some((x) => /family|wife|daughter|son|brother|widow/.test(x))) out.add('family');
  if (r.some((x) => /inspired/.test(x))) out.add('inspired-creators');
  if (quoted || r.some((x) => /^fan|collaborator|admirer/.test(x))) out.add('fans');
  if (isSerling) { out.add('writers'); out.add('narrators-hosts'); out.add('producers'); }
  if (!out.size) out.add('other-people');
  return [...out];
}

/** The `categories[]` field: explicit "cat/sub" placements, with old slugs mapped to the current structure. */
export function explicitPlacements(d) {
  const out = [];
  for (const s of d.categories ?? []) {
    const [cat, sub] = s.split('/');
    const a = alias(cat, sub);
    if (a.content) continue;
    out.push(historyDefaults({ ...remap(a.cat, a.sub), group: a.group, explicit: true }, d));
  }
  return out;
}

// ---- Official versus unofficial -----------------------------------------------------------
// Official: made, broadcast, licensed or published by the franchise's makers and rights holders, or by
// Rod Serling himself (Night Gallery, his films, lectures and writing). Unofficial and inspired: everything
// made by others about, after or in the spirit of the show. A record's own `official: true|false` wins.

const UNOFF_RE = /\b(unlicensed|unofficial|unauthori[sz]ed|fan[- ]made|fan art|fan film|bootleg|knock-?off|not (officially )?licensed|without (a )?licen[cs]e)/;
const OFF_RE = /\b(officially licensed|licensed|authori[sz]ed)\b|\bofficial (tie-in|release|companion|magazine|novel|novelization|soundtrack|score|album|merchandise|product|adaptation|game|replica|figure|trading cards?|poster|key art|trailer|site|page|channel|book|encyclopedia|biography)/;
const OFFICIAL_PUBLISHER = /gold key|western publishing|whitman|dell|now comics|dynamite|idw|walker|bloomsbury|cayuga|world distributors|novaro|tz publications|montcalm|gauntlet|falcon|cbs|bif bang pow|rittenhouse|image entertainment|varèse|varese|sideshow|bally|midway|williams|stern|zen studios|funko|trick or treat|universal television|disney/;

/** Is this placement of a record official? true, false, or undefined where the split does not apply. */
export function isOfficial(col, d, p, ctx = {}) {
  if (typeof d.official === 'boolean') return d.official;
  const cat = CATEGORY[p.cat];
  if (!cat?.split && p.cat !== 'organizations') return undefined;
  const sub = cat?.subs.find((s) => s.slug === p.sub);
  if (sub?.side === 'neither') return undefined;
  if (sub?.side) return sub.side === 'official';
  const text = lc([d.title, d.name, d.description, d.summary, d.notes, d.details?.why_it_matters, ctx.why, (d.tags ?? []).join(' ')].filter(Boolean).join(' '));
  const unoff = UNOFF_RE.test(text) || (d.tags ?? []).some((t) => /unlicensed|unofficial|fan/.test(lc(t)));
  const off = !unoff && OFF_RE.test(text);
  const serling = (d.authors ?? []).some(isSerlingName) || isSerlingName(d.creator) || (d.writers ?? []).some?.(isSerlingName);
  const pub = lc(d.publisher);
  switch (`${p.cat}/${p.sub}`) {
    case 'series/pilots-unmade': return serling || !unoff;
    case 'radio/original-stories': case 'radio/unmade-scripts': return true;
    case 'radio/adaptations': return false;
    case 'stage/episode-stagings': case 'stage/live-readings': return false; // Stage plan Q2: unofficial unless a source says licensed
    case 'series/international':
      return p.group ? !/^(Episodes|Segments|Sketches|Web series)$/.test(p.group) : true;
    case 'movies/twilight-zone-films': case 'movies/rod-serling-films': case 'movies/unmade-projects': return !unoff;
    case 'music/theme': case 'music/soundtracks': return !unoff;
    case 'reading/comics': return !unoff && (OFFICIAL_PUBLISHER.test(pub) || off);
    case 'reading/magazines': return !unoff && (/twilight zone magazine|night cry/i.test(d.magazine ?? '') || /tz publications|montcalm/.test(pub));
    case 'reading/scripts': case 'reading/serling-own-writing': return !unoff;
    case 'homages/websites': return p.group === 'Official sites';
    case 'reading/books': case 'reading/foreign-language':
      return !unoff && (serling || ['scripts', 'novelization', 'play'].includes(d.kind) || /gauntlet|cbs/.test(pub) || off);
    case 'artwork/art-illustration': return off;
    // Discover plan: a remake made for a later Twilight Zone series is the franchise remaking itself.
    case 'homages/adaptations-remakes': return d.kind === 'official-adaptation' || (d.kind === 'remake' && /^(1959|1985|2002|2019)\//.test(d.from ?? '')) || off;
    case 'lectures/serling-lectures': return true;
    case 'events/premieres': case 'events/production-history': case 'events/honors-awards': case 'events/serling-life':
    case 'events/legal': case 'events/broadcasts-marathons': return true;
    default: break;
  }
  if (p.cat === 'homages') return false;
  if (p.cat === 'merchandise' || p.cat === 'artwork') return !unoff;
  if (p.cat === 'organizations') return undefined; // decided from what each organization made (catalog)
  if (serling && (p.cat === 'reading' || p.cat === 'lectures')) return true;
  return off;
}

/** Is a media item artwork (cover art, a poster, key art, an illustration)? Returns the artwork subcategory. */
export function mediaArtwork(m) {
  if (m.type !== 'image') return undefined;
  const st = lc(m.subtype);
  if (/cover/.test(st)) return 'covers';
  if (/poster|key-art|one-sheet/.test(st)) return 'posters-key-art';
  if (/painting|illustration|artwork|art/.test(st)) return 'art-illustration';
  return undefined;
}
