// Everything the accounts API reads from Cloudflare: bindings (DB, UPLOADS, EMAIL) and settings.
// Bindings and secrets are set in the Cloudflare dashboard (see docs/ACCOUNTS_SETUP.md). Any that are
// missing switch the matching feature off rather than breaking the site.

export interface SendEmailBinding {
  send(message: { from: string | { email: string; name?: string }; to: string; subject: string; text: string; html?: string }): Promise<unknown>;
}

export interface Env {
  DB?: D1Database;
  /** The built site's files (Cloudflare Pages provides this binding to every Function). */
  ASSETS?: Fetcher;
  UPLOADS?: R2Bucket;
  EMAIL?: SendEmailBinding;
  /** Cloudflare Turnstile. Leave both unset to switch the human check off (development only). */
  TURNSTILE_SITE_KEY?: string;
  TURNSTILE_SECRET?: string;
  /** Google sign-in (optional). */
  GOOGLE_CLIENT_ID?: string;
  GOOGLE_CLIENT_SECRET?: string;
  /** Microsoft sign-in (optional): an app registration in Microsoft Entra for any organisation and personal accounts. */
  MICROSOFT_CLIENT_ID?: string;
  MICROSOFT_CLIENT_SECRET?: string;
  /** Email sign-in links: either the EMAIL binding (Cloudflare Email Service) or a Resend API key. */
  RESEND_API_KEY?: string;
  EMAIL_FROM?: string;
  /** Secret used to hash IP addresses for rate limits (never stored in the clear). */
  AUTH_SECRET?: string;
  /** Comma-separated emails that become admins when they verify them. */
  ADMIN_EMAILS?: string;
  /** Who gets an email when fans vote a record below zero. Defaults to the first of ADMIN_EMAILS. */
  VOTE_ALERT_EMAIL?: string;
  /** One-time code a signed-in member can enter on their account page to become admin. */
  ADMIN_BOOTSTRAP_TOKEN?: string;
  /** Passkey "relying party" id. Defaults to intothetwilightzone.com on that domain, else the host. */
  RP_ID?: string;
  /** Forum pre-moderation: "all", "new" (default: a member's first 2 posts), or "none". */
  FORUM_PREMODERATE?: string;
  /** "1" to print email links to the log instead of sending them (local development only). */
  DEV_EMAIL_LOG?: string;
}

export const SITE_NAME = 'IntoTheTwilightZone.com';

export function features(env: Env) {
  return {
    accounts: !!env.DB,
    uploads: !!env.DB && !!env.UPLOADS,
    email: !!env.DB && (!!env.EMAIL || !!env.RESEND_API_KEY || env.DEV_EMAIL_LOG === '1') && !!env.EMAIL_FROM,
    google: !!env.DB && !!env.GOOGLE_CLIENT_ID && !!env.GOOGLE_CLIENT_SECRET,
    microsoft: !!env.DB && !!env.MICROSOFT_CLIENT_ID && !!env.MICROSOFT_CLIENT_SECRET,
    turnstile: !!env.TURNSTILE_SITE_KEY && !!env.TURNSTILE_SECRET,
  };
}
