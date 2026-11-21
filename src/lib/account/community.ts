// Shared bits for the forum and contribution pages.
import { api, esc, ApiError } from './client';

export const REPORT_REASONS: [string, string][] = [
  ['spam', 'Spam or advertising'],
  ['abuse', 'Harassment, hate or abuse'],
  ['copyright', 'Copyright: it copies someone else\'s work'],
  ['privacy', 'Shares someone\'s private information'],
  ['off-topic', 'Off-topic or in the wrong place'],
  ['other', 'Something else'],
];

/** A small inline "Report" form, opened from a button with data-report-type and data-report-id. */
export function wireReports(root: HTMLElement, signedIn: () => boolean) {
  root.addEventListener('click', (ev) => {
    const b = (ev.target as HTMLElement).closest<HTMLElement>('[data-report-type]');
    if (!b) return;
    if (!signedIn()) { location.href = '/account/'; return; }
    const host = b.closest('article, li, section') ?? b.parentElement!;
    if (host.querySelector('.report-form')) return;
    const f = document.createElement('form');
    f.className = 'report-form stack panel';
    f.innerHTML = `<fieldset class="stack"><legend>Why are you reporting this?</legend>${REPORT_REASONS.map(([v, l], i) => `<label class="check"><input type="radio" name="reason" value="${v}"/> <span>${esc(l)}</span></label>`).join('')}</fieldset>
      <label>Anything the moderators should know? <span class="muted small">(optional)</span><textarea name="note" maxlength="1000" rows="2"></textarea></label>
      <p><button class="btn" type="submit">Send report</button> <button class="link-btn" type="button" data-cancel>Cancel</button></p>
      <p class="form-error" data-error hidden role="alert"></p>`;
    host.appendChild(f);
    f.querySelector<HTMLInputElement>('input')?.focus();
    f.querySelector('[data-cancel]')!.addEventListener('click', () => f.remove());
    f.addEventListener('submit', async (e) => {
      e.preventDefault();
      const reason = (f.querySelector('input[name=reason]:checked') as HTMLInputElement | null)?.value;
      const err = f.querySelector<HTMLElement>('[data-error]')!;
      if (!reason) { err.textContent = 'Please choose a reason.'; err.hidden = false; return; }
      try {
        await api('/api/reports', { targetType: b.dataset.reportType, targetId: b.dataset.reportId, reason, note: (f.elements.namedItem('note') as HTMLTextAreaElement).value });
        f.innerHTML = '<p class="notice" role="status">Thanks. A moderator will look at it.</p>';
      } catch (x) { err.textContent = x instanceof ApiError ? x.message : 'That did not send.'; err.hidden = false; }
    });
  });
}

export function uploadKindLabel(u: { kind: string; media_type?: string }) {
  if (u.kind === 'text') return 'Written piece';
  if (u.kind === 'link') return 'Link';
  const t = u.media_type ?? '';
  return t.startsWith('image/') ? 'Image' : t.startsWith('audio/') ? 'Audio' : t.startsWith('video/') ? 'Video' : t === 'application/pdf' ? 'Document (PDF)' : 'File';
}

export const RIGHTS_LABEL: Record<string, string> = {
  own: 'Made by the member who shared it',
  'public-domain': 'Public domain',
  licensed: 'Openly licensed',
  permission: 'Shared with the rights holder\'s permission',
};
