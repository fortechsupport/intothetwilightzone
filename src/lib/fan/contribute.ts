// Links into the GitHub issue forms in .github/ISSUE_TEMPLATE, prefilled with the page they came from.
export const REPO_URL = 'https://github.com/fortechsupport/intothetwilightzone';
export function correctionUrl(pageUrl: string, pageTitle?: string) {
  const p = new URLSearchParams({ template: 'correction.yml', title: `[Correction] ${pageTitle ?? pageUrl}`, page: pageUrl });
  return `${REPO_URL}/issues/new?${p}`;
}
export function submissionUrl(kind?: string) {
  const p = new URLSearchParams({ template: 'submission.yml', title: '[Submission] ' });
  if (kind) p.set('kind', kind);
  return `${REPO_URL}/issues/new?${p}`;
}

/** Which checklist buttons suit a record: what "seen" means for it, and whether it can be owned. */
export function trackFor(col: string, kind?: string): { seen: 'watched' | 'read' | 'heard' | 'played' | 'visited' | false; own: boolean } {
  if (['books', 'comics', 'magazines'].includes(col)) return { seen: 'read', own: true };
  if (col === 'essays') return { seen: 'read', own: false };
  if (['songs', 'radio'].includes(col)) return { seen: 'heard', own: true };
  if (col === 'podcasts') return { seen: 'heard', own: false };
  if (col === 'films') return { seen: 'watched', own: true };
  if (col === 'locations') return { seen: 'visited', own: false };
  if (col === 'works') {
    if (['collectible', 'prop', 'soundtrack'].includes(kind ?? '')) return { seen: kind === 'soundtrack' ? 'heard' : false, own: true };
    if (kind === 'game') return { seen: 'played', own: true };
    if (kind === 'artwork') return { seen: false, own: true };
    if (['event', 'convention', 'lecture', 'stage', 'attraction', 'memorial'].includes(kind ?? '')) return { seen: 'visited', own: false };
    if (['television', 'parody', 'production'].includes(kind ?? '')) return { seen: 'watched', own: false };
  }
  return { seen: false, own: false };
}
