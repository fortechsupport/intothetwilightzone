# Plan: fan accounts

**Date:** 2026-11-21. **Approved by Adam** (2026-11-21, 02:56 UTC): "User accounts so users can do things that
an account would allow (ie favorite items, watch/listen/read later, participate in user forums, upload content
(video, audio, text, etc), suggest things for the site." He asked for the build itself overnight, so it went
straight to a branch preview rather than screenshots first.

## Steps

1. **PR #25** (this plan): accounts API on Cloudflare Pages Functions + D1 + R2 + Turnstile; sign-in with
   passkeys (email links and Google switch on with settings); synced lists; forums; suggestions; uploads;
   moderation; terms, privacy, copyright and guidelines pages. Safe to merge before Cloudflare is set up.
2. **Adam's Cloudflare setup** ([ACCOUNTS_SETUP.md](../ACCOUNTS_SETUP.md)), first for Preview, then Production.
3. Later, separate PRs: anything on "Found, for later" that Adam picks.

## Acceptance checks (pass/fail)

| Check | Result (2026-11-21, local `wrangler pages dev` with D1/R2, Chromium virtual passkey) |
|---|---|
| A visitor who never signs in makes no API requests and every page works as before | Pass (account.js waits for the sign-in cookie). Amended 2026-11-23: record pages now ask for vote counts (docs/plans/fan-votes.md) |
| With no D1 binding, account pages say "being set up" and nothing errors | Pass (static `astro preview` run of check:a11y) |
| Create an account with a passkey; sign out; sign in with the passkey | Pass |
| Items marked before signing up are in the account after sign-up | Pass |
| Signing out clears the browser copy; signing in restores it | Pass |
| Suggestion, image upload, written piece, link reach the moderation queue and nowhere else | Pass |
| A file that isn't really an image/audio/video/PDF is refused | Pass (HTML renamed .png refused) |
| New member's first two posts are held; approving the first post publishes the topic | Pass |
| HTML in a post shows as text | Pass |
| Cross-site POST refused; moderation API refuses non-moderators | Pass (403 / 401) |
| Data export and account deletion work | Pass |
| CI checks (data, tokens, both builds, site, a11y incl. 10 new pages) | Pass locally |
| axe, dark and light, signed in, on 14 member pages; no sideways scroll at 320 px | Pass |

## Decided here (Adam reviews later)

- Passkeys are the only sign-in until email links (Resend now, or Cloudflare Email Service after the
  nameserver move) or Google are configured. See decision 0007.
- A new member's first 2 forum posts are held for review (`FORUM_PREMODERATE`).
- Accounts are for ages 13 and up.
- File limits: images 15 MB, audio 50 MB, video 95 MB (Cloudflare's 100 MB request limit), PDF 25 MB;
  1 GB per member; uploads stop at 9 GB site-wide (R2 free tier is 10 GB).
- Suggestions and uploads need an account; the public GitHub forms stay for people without one.
- Deleting an account deletes the member's posts unless they choose to keep them as "Deleted member".
- Favorites are private unless the member chooses to show them on their profile.
- Ten forums: General; The original series; Later series and the movie; Rod Serling and Night Gallery;
  Radio, books, comics and games; Collecting; Inspired by the Zone; Fan creations; Places and events; About
  this site.

## Waiting on Adam

- Cloudflare setup (ACCOUNTS_SETUP.md).
- Whether to register a DMCA designated agent with the U.S. Copyright Office, and in whose name.
- Whether to switch on email sign-in links now (Resend, DNS records at Bluehost) or after launch.

## Found, for later

- Email notifications (a reply to your topic; your upload was approved) and a daily queue digest for Adam.
- Image thumbnails and stripping photo location data on upload (needs Cloudflare Images or a resize step).
- Moving approved suggestions into the review ledger automatically (today the editor reads them in /moderation/).
- Search across forum posts (Pagefind only indexes static pages).
- Retrying a failed file upload reuses a new draft; drafts that never got a file are left in the table.
