// Matching podcast episode titles to the show's episodes (docs/plans/research-podcasts.md, Q3; the rule is
// written out in data/research/podcasts-2026-11-24/round-2.md). A match is shown as "matched by title": it is
// read from the podcast's own episode title and nothing else, so it can be wrong, and the page says so.
//
// The rule:
// 1. Titles are compared in lower case with quotes, dashes and other punctuation reduced to spaces.
// 2. A title of three or more words matches wherever it appears as whole words.
// 3. A title of one or two words ("Two", "Dust", "The Hunt") matches only where the podcast title sets it apart:
//    in quotation marks, as the whole title once an episode number is removed, or after a colon, dash, bar or
//    episode number and running to the end or to the next such mark or bracket.
// 4. A podcast only matches the series it covers (its record's `covers`). When a title belongs to more than one of
//    those series, a series word in the podcast title decides ("2019", "Peele", "'85", "2002"); failing that the
//    original series is taken, since the podcasts that cover several series are mainly about it.
// 5. Longer titles win where two overlap ("Nightmare at 20,000 Feet" over "Nightmare as a Child" never overlap, but
//    "The Lonely" inside "The Lonely Ones" must not count), and a podcast title can match several episodes
//    ("Shadow Play / Grace Note").

const norm = (s) => ` ${String(s).toLowerCase()
  .replace(/[‘’ʼ`]/g, "'")
  .replace(/'(?=\s|$)|(?<=\s|^)'/g, ' ')
  .replace(/[“”"«»]/g, ' ')
  .replace(/&/g, ' and ')
  .replace(/[^a-z0-9',]+/g, ' ')
  .replace(/,(?!\d)/g, ' ')
  .replace(/\s+/g, ' ').trim()} `;

const SERIES_HINT = [
  ['2019', /\b(2019|2020|peele|cbs all access|paramount\+?)\b/i],
  ['2002', /\b(2002|2003|upn|forest whitaker)\b/i],
  ['1985', /('85|\b1985|\b1986|\b1987|\b1988|\b1989|\b80s\b|\beighties\b)/i],
];

/** Pieces of a podcast title that are set apart: quoted, or between delimiters (rule 3). */
function setApart(title) {
  const t = String(title);
  const out = [];
  for (const m of t.matchAll(/["“‘']([^"”’']{1,80})["”’']/g)) out.push(m[1]);
  const stripped = t.replace(/^\s*(?:(?:episode|ep\.?|#|no\.?|s\d+\s*e\d+|\d+x\d+|season \d+,? episode \d+|part \d+)\s*[\d.:-]*\s*|\d+\s*[.:)-]\s*)+/i, '');
  out.push(stripped);
  for (const piece of t.split(/\s*(?:[:|/–—]|\s-\s|\(|\)|\[|\]|#\d+|\bep(?:isode)?\.?\s*\d+\b|\bs\d+\s*e\d+\b|\b\d+x\d+\b)\s*/i)) if (piece) out.push(piece);
  return out.map(norm);
}

export function makeMatcher(targets) {
  // targets: [{ key, title, series, href }]; series is '1959' | '1985' | '2002' | '2019' | 'night-gallery'
  const byTitle = new Map();
  for (const t of targets) {
    const n = norm(t.title);
    if (!byTitle.has(n)) byTitle.set(n, []);
    byTitle.get(n).push(t);
  }
  const titles = [...byTitle.keys()].sort((a, b) => b.length - a.length);
  return function match(podcastTitle, covers = []) {
    const whole = norm(podcastTitle);
    const apart = setApart(podcastTitle);
    const allowed = new Set(covers.map((c) => (c === 'films/night-gallery' ? 'night-gallery' : c)));
    const taken = [];
    const found = [];
    for (const n of titles) {
      const words = n.trim().split(' ').length;
      let at = -1;
      if (words >= 3) at = whole.indexOf(n);
      else if (apart.some((p) => p === n)) at = whole.indexOf(n);
      if (at < 0) continue;
      // Rule 5: skip a title inside a longer match (the spaces padding each title are not counted).
      const [a0, b0] = [at + 1, at + n.length - 1];
      if (taken.some(([a, b]) => a0 < b && b0 > a)) continue;
      let cands = byTitle.get(n).filter((t) => allowed.size === 0 || allowed.has(t.series));
      if (!cands.length) continue;
      if (cands.length > 1) {
        const hinted = SERIES_HINT.find(([s, re]) => re.test(podcastTitle) && cands.some((c) => c.series === s));
        cands = hinted ? cands.filter((c) => c.series === hinted[0]) : cands.filter((c) => c.series === '1959').slice(0, 1).concat(cands.some((c) => c.series === '1959') ? [] : cands.slice(0, 1));
      }
      taken.push([a0, b0]);
      found.push([at, cands[0].key]);
    }
    return found.sort((x, y) => x[0] - y[0]).map(([, k]) => k);
  };
}
