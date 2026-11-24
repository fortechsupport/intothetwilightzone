// Landing-page copy for every category: what it is, how it ties to The Twilight Zone, and what each
// subcategory holds. Subcategory names match the "subcategory" values scripts/assess.py writes.
// All text is our own words. Keep facts conservative; anything uncertain belongs in a record, with a source.

export interface CategoryInfo {
  title: string;
  description: string; // meta description
  intro: string[]; // paragraphs (may contain inline HTML links)
  connection: string; // "How this connects to The Twilight Zone"
  subgroups?: Record<string, string>; // subcategory -> one-line blurb
}

export const CATEGORIES: Record<string, CategoryInfo> = {
  archives: {
    title: 'Archives and documents',
    description: 'Where the original Twilight Zone scripts, papers, recordings and production records are kept.',
    intro: [
      "Most of what we know about how The Twilight Zone was made comes from a handful of collections: Rod Serling's own papers, the network's records, and the files of the writers and composers who worked on the show.",
      'This section lists those collections, what each one holds, and how to reach it. Nothing here is reproduced on the site; these are pointers for researchers.',
    ],
    connection: "Each collection holds original Twilight Zone material (scripts, correspondence, recordings, call sheets) or the papers of someone who made the show. Entries say plainly when a collection's Twilight Zone content is thin.",
  },
  books: {
    title: 'Books',
    description: 'Books about The Twilight Zone: histories, companions, script collections, anthologies, novels and Rod Serling\'s wider work.',
    intro: [
      "Books are where The Twilight Zone has been studied, preserved and continued. Rod Serling turned his own teleplays into three bestselling story collections in 1960-1962, Marc Scott Zicree's The Twilight Zone Companion (1982) set the standard for episode guides, and Gauntlet Press later published Serling's complete Twilight Zone scripts in annotated volumes.",
      'Alongside them sit anthologies of the stories the show adapted, new fiction written under license, scholarship on the show\'s politics and craft, biographies of Serling and his writers, and a long tail of guides and puzzle books of very uneven quality.',
    ],
    connection: 'Every book here is about the show, reprints or adapts its scripts and source stories, continues it in new fiction, or documents Rod Serling and Night Gallery. Self-published, unverified and duplicate titles are labelled rather than removed.',
    subgroups: {
      'Art and puzzle books': 'Coloring, trivia, word-search and art books.',
      'Biography and memoir': 'Lives of Rod Serling and the show\'s writers.',
      'Graphic novels': 'Book-length comics.',
      'Guides and reference': 'Episode guides, companions and fact books.',
      'Novelizations': 'Prose versions of the films and episodes.',
      'Novels': 'New novels set in the Twilight Zone.',
      'Other books': 'Books that fit no other shelf.',
      'Rod Serling and Night Gallery': "Serling's work outside the show, and Night Gallery.",
      'Scholarship and criticism': 'Academic and critical studies.',
      'Scripts and teleplays': 'Published scripts, including Gauntlet Press\'s Serling volumes.',
      'Story anthologies': "Collections of the show's stories and the fiction it adapted, plus new licensed anthologies.",
      'Young readers': 'Books for children and teenagers.',
    },
  },
  comics: {
    title: 'Comics',
    description: 'Every Twilight Zone comic: Dell, Gold Key, Now Comics, the Walker & Company graphic novels, Dynamite and IDW.',
    intro: [
      'The Twilight Zone has been a comic almost continuously since 1961. Dell published four issues before Western Publishing moved the license to its own Gold Key imprint, which ran new anthology stories, introduced by a drawn Rod Serling, until 1982.',
      "The Gold Key years are a who's who of comics art, with work by Alex Toth, Reed Crandall, Al Williamson, George Evans, Joe Orlando, Walter Simonson, Frank Frazetta as an inker and, in 1978, the young Frank Miller. Later licensees took different approaches: Now Comics in the early 1990s, Walker & Company's faithful graphic-novel adaptations of Serling's own teleplays in 2008-2009, J. Michael Straczynski's series for Dynamite from 2014, and most recently IDW.",
    ],
    connection: 'Every comic here was published under license as The Twilight Zone, or adapts Rod Serling\'s scripts. Issue entries list the stories and artists where the contents have been recorded.',
    subgroups: {
      'Dell (1961-1962)': 'The first four Twilight Zone comics.',
      'Dynamite': "J. Michael Straczynski's 2014 relaunch and its follow-ups.",
      'Gold Key (1962-1982)': 'Twenty years of original stories hosted by a drawn Rod Serling.',
      'IDW': 'The current licensed series.',
      'Now Comics': 'The early-1990s revival.',
      'Promotional comics': 'Small giveaway comics.',
      'Rod Serling adaptations': 'Comics built from Serling scripts outside the show.',
      'Walker & Company graphic novels': "Faithful adaptations of Serling's teleplays, each with the script reprinted.",
    },
  },
  essays: {
    title: 'Essays and scholarship',
    description: 'Scholarly articles, criticism, interviews and speeches about The Twilight Zone and Rod Serling.',
    intro: [
      'The show has attracted serious criticism almost from the start: Serling himself argued in interviews and speeches that fantasy let him say what sponsors would not allow in realist drama, and scholars have since read the series as Cold War political fantasy, as civil-rights advocacy and as a model of the short television story.',
      'This section gathers that writing: journal articles, book chapters, reviews, interviews and Serling\'s own speeches, each with a short summary of its argument.',
    ],
    connection: 'Each piece is about The Twilight Zone or by or about Rod Serling. Summaries are our own; follow the source link for the text.',
  },
  films: {
    title: 'Films and other screen works',
    description: 'Twilight Zone films, Night Gallery, Rod Serling\'s other screen work, and the films and shows that adapt, borrow from or parody the series.',
    intro: [
      'The Twilight Zone reached far beyond its four television series. Warner Bros. brought it to cinemas in Twilight Zone: The Movie (1983), CBS made a television film from Serling\'s unproduced material in 1994, and Serling himself followed it with Night Gallery and a long career in film and television.',
      'Most entries here are later films and episodes of other shows that adapt, echo, parody or simply mention a Twilight Zone story. Each one says what the link is and how well it is documented, so a confirmed influence is never confused with a resemblance fans have spotted.',
    ],
    connection: 'Official productions are part of the franchise; Night Gallery and Serling\'s own work are one step away; everything else is here because of a specific link to an episode, stated on its entry with its evidence.',
    subgroups: {
      'Twilight Zone productions': 'Official Twilight Zone films and documentaries.',
      'Night Gallery': "Rod Serling's second anthology (1969-1973), episode by episode.",
      "Rod Serling's other screen work": 'Films and television Serling wrote, hosted or narrated outside the show.',
      'Feature films': 'Films linked to a specific episode.',
      'Episodes of other shows': 'Television episodes that adapt, spoof or reference the show.',
      'Segments of other shows': 'Segments within other anthologies and specials.',
      'Fellow anthology series': 'Anthology series in the tradition the show defined, with no direct link of their own.',
      'Television series': 'Whole series with a link to the show.',
      'Television films': 'Made-for-television films.',
      'Sketches': 'Comedy sketches that parody the show.',
    },
  },
  works: {
    title: 'Games, collectibles and more',
    description: 'Twilight Zone soundtracks, games, collectibles, artwork, stage shows, attractions, events, honors and fan communities.',
    intro: [
      "The show's afterlife off the screen is enormous: the 1993 Twilight Zone pinball machine designed by Pat Lawlor, Disney's Twilight Zone Tower of Terror rides, stage adaptations in London and across America, toys of Talky Tina and the Kanamit, soundtrack albums, conventions, and the honors Rod Serling received in his lifetime and after.",
      'This is a reference catalogue: nothing here is for sale, and licensed and unlicensed items are labelled.',
    ],
    connection: 'Each item is either an official Twilight Zone product or event, an honor to Rod Serling, or a resource about the show. Entries without a direct tie are marked tangential.',
  },
  locations: {
    title: 'Places',
    description: 'Filming locations, studio backlots, Rod Serling\'s homes and memorials, and the Twilight Zone attractions.',
    intro: [
      "The original series was made almost entirely at MGM in Culver City, on soundstages and the backlot streets that stood in for small-town America, with trips to the desert at Lone Pine and Death Valley. The revivals moved north to Vancouver and Toronto. Serling's own story runs from Syracuse and Binghamton, New York, through Antioch College and Cincinnati, to Pacific Palisades and his summer cottage on Cayuga Lake.",
      'Each place lists what was filmed or happened there and whether you can still visit.',
    ],
    connection: 'Filming locations and backlots are where episodes were made; Serling\'s places and memorials belong to the life behind the show; the Tower of Terror rides are licensed Twilight Zone attractions.',
  },
  magazines: {
    title: 'Magazines',
    description: "Rod Serling's The Twilight Zone Magazine, Night Cry, and other magazines' Twilight Zone coverage.",
    intro: [
      "Rod Serling's The Twilight Zone Magazine (1981-1989) was a licensed horror and fantasy fiction magazine that also printed Serling's teleplays, an episode guide, interviews and film coverage, and published early work by many writers who became major names in the field. Its companion Night Cry (1984-1987) ran eleven issues of horror fiction.",
      'Other magazines, from TV Guide to Cinefantastique, covered the show and its revivals; those issues are listed for the coverage they contain.',
    ],
    connection: 'The Twilight Zone Magazine and Night Cry are part of the franchise; other magazines are listed only for specific Twilight Zone coverage, described on each entry.',
  },
  podcasts: {
    title: 'Podcasts',
    description: 'Episode-by-episode Twilight Zone podcasts and notable single episodes of other podcasts about the show.',
    intro: [
      'Dozens of podcasts have worked through The Twilight Zone episode by episode, some for the original series, some for the 1985 or 2019 revivals, and some for Night Gallery. Many general culture, film and history podcasts have also given whole episodes to the show and to the 1983 film.',
    ],
    connection: 'Dedicated podcasts are wholly about the show; single episodes of other podcasts are listed for that one episode.',
  },
  radio: {
    title: 'Radio',
    description: 'The Twilight Zone Radio Dramas: full-cast audio adaptations of classic episodes, plus Rod Serling\'s radio work.',
    intro: [
      "The Twilight Zone Radio Dramas, produced by Falcon Picture Group under license from Carol Serling from 2002, re-recorded the original scripts as full-cast audio plays, with Stacy Keach taking Serling's narrator role and film and television actors in the leads. The run grew to well over 170 episodes, released on CD and download and broadcast on radio, and later added new stories written for it.",
      "Rod Serling began in radio, writing for Cincinnati station WLW before television, and returned to it later in his career; that work is listed separately.",
    ],
    connection: 'Each radio drama is part of the licensed franchise and, where it adapts a television episode, links to it.',
  },
  songs: {
    title: 'Music and songs',
    description: 'The Twilight Zone theme, its covers and samples, and songs that name or are about the show.',
    intro: [
      "Few pieces of television music are as recognisable as The Twilight Zone's theme. The first season used a main title by Bernard Herrmann; from the second season CBS used a combination of two short library pieces by the French composer Marius Constant, and its repeating guitar figure became shorthand for the uncanny.",
      'That motif has been covered, sampled and quoted ever since, and the show\'s name turns up in hundreds of lyrics and song titles, from Rush\'s 1976 tribute to Golden Earring, Iron Maiden and Ariana Grande.',
    ],
    connection: "Theme music is part of the show itself. Songs written about it are one step away. Songs that only use the phrase \"twilight zone\" are tangential, and where nobody has yet checked the reference, the entry says so.",
    subgroups: {
      'The theme and its uses': 'Official themes and scores, covers and samples of the theme.',
      'Songs about or titled after the show': 'Songs that take their title or subject from the show.',
      'Lyrics that mention the show': 'Songs whose lyrics name the Twilight Zone.',
      'Other references and samples': 'Other documented references, such as sampled dialogue.',
      'Connection not yet confirmed': 'From the original research list; the reference has not been checked yet.',
      'Lyric mentions (the show)': 'Lyrics that name The Twilight Zone as the show.',
      'Lyric mentions (Rod Serling)': 'Lyrics that name Rod Serling.',
      'Lyric mentions (idiom)': 'Lyrics that use "twilight zone" as a phrase, not about the show.',
      'Serling narration samples': "Tracks that sample Rod Serling's narration.",
      'Dialogue samples': "Tracks that sample an episode's dialogue.",
      'Theme samples': 'Tracks that sample the theme.',
      'Possible references (unconfirmed)': 'A possible reference that no source has confirmed yet.',
      'Duplicates': 'Records that repeat another record; hidden on the site.',
    },
  },
  connections: {
    title: 'Influence',
    description: 'Films, television, songs and books traced back to the Twilight Zone episodes that inspired them, with the evidence for each link.',
    intro: [
      'The Twilight Zone is one of the most borrowed-from works in popular culture. This page traces later films, shows, songs and books back to the specific episodes behind them, from official remakes and adaptations to homages, parodies and passing references.',
      'Every link is labelled by its evidence: confirmed by the makers, documented by a published source, or noted by fans only. A resemblance is never presented as an influence.',
    ],
    connection: 'Each link names the later work, the episode it draws on, the kind of link and the evidence for it.',
  },
  people: {
    title: 'People',
    description: 'Writers, directors, cast, narrators, composers and voice actors across every Twilight Zone series, film and radio drama.',
    intro: [
      "The Twilight Zone was Rod Serling's show, but it was made by a remarkable group: writers Charles Beaumont, Richard Matheson and George Clayton Johnson, producers Buck Houghton and later Herbert Hirschman and Bert Granet, composers including Bernard Herrmann and Jerry Goldsmith, and a cast list that runs from veterans of the silent era to future stars.",
      'Each person\'s page gathers everything they made for the franchise across the series, films and radio dramas.',
    ],
    connection: 'Everyone here has a credit on the franchise, worked with Serling on Night Gallery or elsewhere, or has spoken publicly about the show\'s influence on them.',
  },
  quotes: {
    title: 'Voices',
    description: 'Filmmakers, writers and performers on what The Twilight Zone meant to them, in their own words, with sources.',
    intro: [
      'Stephen King, Steven Spielberg, Jordan Peele, Guillermo del Toro and many others have said, in interviews and speeches, that The Twilight Zone shaped how they tell stories. Here they are in their own words.',
    ],
    connection: 'Every quote is exact, short and linked to where it was said.',
  },
};

/** Alphabetical key: ignore a leading The/A/An, quotes and punctuation; pad numbers so #2 sorts before #10. Matches scripts/assess.py. */
export function sortKey(title: string): string {
  let t = String(title).replace(/^["'“‘(\[.…]+/, '').trim();
  t = t.replace(/^(the|a|an)\s+/i, '');
  t = t.toLowerCase().replace(/\d+/g, (m) => m.padStart(6, '0'));
  return t.replace(/[^a-z0-9 ]/g, '').trim();
}

export const byTitle = <T,>(get: (x: T) => string) => (a: T, b: T) => sortKey(get(a)).localeCompare(sortKey(get(b)));

/** Subcategory order: the four series chronologically, everything else alphabetically. */
export function subRank(sub: string): string {
  const order = ['Original series', '1985 revival', '2002 revival', '2019 revival'];
  const i = order.findIndex((o) => sub.startsWith(o));
  if (i >= 0) return `0${i}`;
  // Catch-all and unverified groups go last so a section opens with its strongest material.
  if (/^(other|connection not yet confirmed|fellow anthology)/i.test(sub)) return `2${sub.toLowerCase()}`;
  return `1${sub.toLowerCase()}`;
}

export const anchor = (s: string) => s.toLowerCase().replace(/&/g, 'and').replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
