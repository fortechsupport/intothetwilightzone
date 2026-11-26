// What kind of site an outside link goes to, shown as a small icon of the site's own design beside link lists
// (Adam, 2026-11-26: "our own icon per link type", decision 0012). The icons never use another site's logo, so
// no one's trademark is borrowed. The build (integrations/external-links.mjs) tags each outside link with
// data-link="<kind>"; public/site.css draws the icon. Hosts are matched on their last labels, so
// "en.wikipedia.org" and "m.imdb.com" match "wikipedia.org" and "imdb.com". Unlisted hosts get the globe.

/** Each kind: the words used in the legend, and the hosts it covers. Order matters only for the legend. */
export const LINK_KINDS = {
  encyclopedia: { label: 'Encyclopedia or wiki', hosts: ['wikipedia.org', 'britannica.com', 'encyclopedia.com', 'sf-encyclopedia.com', 'fandom.com', 'tvtropes.org', 'simpsonswiki.com', 'merriam-webster.com', 'museum.tv', 'wiktionary.org', 'wikiquote.org', 'wikisource.org', 'wikidata.org', 'troywiki.duckdns.org'] },
  screen: { label: 'Film and television database', hosts: ['imdb.com', 'tvmaze.com', 'thetvdb.com', 'ctva.biz', 'catalog.afi.com', 'rottentomatoes.com', 'metacritic.com', 'moviefone.com', 'scifi-movies.com', 'themoviedb.org', 'letterboxd.com', 'tv.com', 'epguides.com', 'blu-ray.com', 'dvdcompare.net', 'boxofficemojo.com', 'tcm.com', 'nightgallery.net', 'televisionacademy.com', 'emmys.com'] },
  watch: { label: 'Where to watch', hosts: ['justwatch.com', 'reelgood.com', 'paramountplus.com', 'pluto.tv', 'tubitv.com', 'peacocktv.com', 'netflix.com', 'hulu.com', 'max.com', 'primevideo.com', 'tv.apple.com', 'roku.com'] },
  video: { label: 'Video', hosts: ['youtube.com', 'youtu.be', 'vimeo.com', 'dailymotion.com', 'trailersfromhell.com'] },
  audio: { label: 'Podcast, radio or audiobook', hosts: ['podcasts.apple.com', 'itunes.apple.com', 'spotify.com', 'spreaker.com', 'anchor.fm', 'podbean.com', 'rss.com', 'otrr.org', 'audible.com', 'podchaser.com', 'feedspot.com', 'libsyn.com', 'buzzsprout.com', 'soundcloud.com', 'iheart.com', 'pocketcasts.com', 'bbc.co.uk', 'otrcat.com', 'radioechoes.com'] },
  music: { label: 'Music database or lyrics', hosts: ['whosampled.com', '45worlds.com', 'soundtrackcollector.com', 'filmtracks.com', 'classicthemes.com', 'discogs.com', 'musicbrainz.org', 'allmusic.com', 'genius.com', 'secondhandsongs.com', 'metalmusicarchives.com', 'bandcamp.com', 'americanmusicpreservation.com', 'setlist.fm', 'lyrics.com', 'azlyrics.com', 'intrada.com', 'lalalandrecords.com', 'varesesarabande.com'] },
  books: { label: 'Book, comic or story database', hosts: ['isfdb.org', 'goodreads.com', 'comics.org', 'authorwars.com', 'comiccollectorlive.com', 'comicvine.gamespot.com', 'openlibrary.org', 'worldcat.org', 'fantlab.ru', 'philsp.com', 'locusmag.com', 'gamesdatabase.org', 'boardgamegeek.com', 'mobygames.com', 'ipdb.org'] },
  archive: { label: 'Archive or library', hosts: ['archive.org', 'oac.cdlib.org', 'loc.gov', 'archives.gov', 'commons.wikimedia.org', 'hathitrust.org', 'newspapers.com', 'paperspast.natlib.govt.nz', 'trove.nla.gov.au', 'libcat.library.tamu.edu', 'ithaca.edu', 'si.edu', 'paleycenter.org', 'cinema.ucla.edu', 'library.ucla.edu', 'digitalcollections.nypl.org'] },
  scholarship: { label: 'Scholarship', hosts: ['doi.org', 'cambridge.org', 'jstor.org', 'tandfonline.com', 'muse.jhu.edu', 'springer.com', 'sagepub.com', 'academia.edu', 'researchgate.net', 'scholar.google.com', 'wiley.com', 'oup.com'] },
  map: { label: 'Map', hosts: ['openstreetmap.org', 'maps.google.com', 'google.com/maps'] },
  shop: { label: 'Shop, auction or catalogue (plain links, no affiliate codes)', hosts: ['amazon.com', 'mycomicshop.com', 'entertainmentearth.com', 'atomicavenue.com', 'hakes.com', 'ha.com', 'ebay.com', 'shop.', 'store.', 'bigbadtoystore.com', 'propstore.com', 'juliensauctions.com', 'profilesinhistory.com'] },
  official: { label: 'Official site', hosts: ['rodserling.com', 'paramount.com', 'paramountplus.com/shows/the-twilight-zone', 'cbs.com', 'disneyworld.disney.go.com', 'dynamite.com'] },
  website: { label: 'Other website, article or blog', hosts: [] },
};

// Links that are not about a record: the site's own repository (corrections) and licence deeds.
const SKIP = ['github.com', 'creativecommons.org'];

/** The kind of an outside link, or undefined for links that get no icon. */
export function linkKind(href) {
  let u;
  try { u = new URL(href); } catch { return undefined; }
  const host = u.hostname.toLowerCase().replace(/^www\./, '');
  const hp = `${host}${u.pathname}`;
  const hit = (h) => (h.endsWith('.') ? host.startsWith(h) : h.includes('/') ? hp.startsWith(h) : host === h || host.endsWith(`.${h}`));
  if (SKIP.some(hit)) return undefined;
  // Most specific first: a path rule (official) or a full sub-host beats a bare domain.
  for (const k of ['official', 'watch', 'archive', 'map']) if (LINK_KINDS[k].hosts.some(hit)) return k;
  for (const [k, v] of Object.entries(LINK_KINDS)) if (v.hosts.some(hit)) return k;
  return 'website';
}
