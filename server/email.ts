// Sending the one kind of email the site sends: sign-in links.
// Uses Cloudflare Email Service (EMAIL binding) when present, else Resend (RESEND_API_KEY).
import type { Env } from './env';
import { SITE_NAME } from './env';
import { HttpError } from './http';

export async function sendEmail(env: Env, to: string, subject: string, text: string) {
  const from = env.EMAIL_FROM!;
  if (env.DEV_EMAIL_LOG === '1') {
    console.log(`[dev email] to=${to} subject=${subject}\n${text}`);
    return;
  }
  try {
    if (env.EMAIL) {
      await env.EMAIL.send({ from: { email: from, name: SITE_NAME }, to, subject, text });
      return;
    }
    if (env.RESEND_API_KEY) {
      const r = await fetch('https://api.resend.com/emails', {
        method: 'POST',
        headers: { Authorization: `Bearer ${env.RESEND_API_KEY}`, 'Content-Type': 'application/json' },
        body: JSON.stringify({ from: `${SITE_NAME} <${from}>`, to: [to], subject, text }),
      });
      if (!r.ok) throw new Error(`Resend ${r.status}: ${(await r.text()).slice(0, 200)}`);
      return;
    }
  } catch (e) {
    console.error('Email send failed', e);
    throw new HttpError(502, 'email_failed', 'We could not send the email just now. Please try again in a few minutes, or use a passkey.');
  }
  throw new HttpError(503, 'email_off', 'Email sign-in is not switched on yet.');
}
