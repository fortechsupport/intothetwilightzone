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
