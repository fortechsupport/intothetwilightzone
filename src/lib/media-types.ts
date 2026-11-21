// Media Library pages: one per type, at /media/<slug>/.
import { LIBRARY_TYPES } from './taxonomy.mjs';

const SLUG: Record<string, string> = {
  video: 'video', audio: 'audio', image: 'images', map: 'maps', document: 'documents', text: 'articles', review: 'reviews',
  interview: 'interviews', quote: 'quotes', ad: 'advertisements', holding: 'archival-holdings', link: 'links', file: 'other-files',
};
/** The Media Library page for a type, optionally filtered (?in=) and pointing at one item (#id). */
export function mediaTypeHref(type: string, opts: { in?: string; id?: string } = {}) {
  const q = opts.in ? `?in=${encodeURIComponent(opts.in)}` : '';
  return `/media/${SLUG[type] ?? type}/${q}${opts.id ? `#${opts.id}` : ''}`;
}
export const MEDIA_TYPES = (LIBRARY_TYPES as [string, string, string][]).map(([key, label, what]) => ({ key, slug: SLUG[key] ?? key, label, what }));
