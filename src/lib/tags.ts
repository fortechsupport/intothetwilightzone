// Tags that track our research work (batches, rounds, checks to do) rather than describe the record.
// They stay in the data for the review pages but are never shown to visitors.
const INTERNAL = [/-\d{4}-\d{2}-\d{2}$/, /-round-\d+$/, /^needs-/, /^seed-record$/, /^artist-corrected$/];

export const isInternalTag = (t: string): boolean => INTERNAL.some((re) => re.test(String(t)));
export const publicTags = (tags: readonly unknown[] | undefined): string[] =>
  (tags ?? []).map(String).filter((t) => !isInternalTag(t));
