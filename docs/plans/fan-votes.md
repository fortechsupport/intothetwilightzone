# Plan: fan votes (thumbs up and thumbs down) with alerts to Adam

**Date:** 2026-11-23. **Approved by Adam** (2026-11-23, 22:18 UTC, in the Movies thread; decision 0005 in PR #42):

> Mentions from fans about movies having ties are okay, but should be verified, otherwise users can thumbs up/down
> items across all aspects of the site. If any items fall below 0 thumbs up (thumbs down counteracts thumbs up and
> vice versa), notify me so I can decide if that item should or should not be removed from IntoTheTwilightZone.com.

He asked for the feature itself, so this went straight to a build with screenshots rather than mock-ups first.
The rules it follows are in [decision 0006](../decisions/0006-fan-votes.md).

## Steps (one pull request each)

1. **Votes on every record page, and Adam's alerts** (this PR). Built on the fan accounts work (PR #25), which this
   branch carries, brought up to date with `main`. Merging this merges #25 too.
   - A thumbs up and a thumbs down with counts in the actions bar of every record page: 6,045 pages today (people,
     characters, places, organizations, episodes, films, books, comics, essays, magazines, songs, radio, podcasts,
     works, quotes, archives, series). The list is built from the published pages at build time, so a new record
     page gets votes without any extra work.
   - One vote per member per record; press it again to withdraw it, or press the other thumb to switch.
   - When a record's score (ups minus downs) falls below zero: an alert on the Moderation page (tab "Votes below
     zero", with a count on the tab), and an email to Adam once email sending is set up.
   - Adam's two buttons: **Keep it** or **Mark for removal**. Removals are applied to `data/review/decisions.json`
     with `scripts/apply-vote-removals.mjs` and reach the site with the next deploy.
2. **Adam's Cloudflare setup** (docs/ACCOUNTS_SETUP.md): the accounts steps, plus the votes table (step 1 of that
   page now runs both migrations) and, for emails, `VOTE_ALERT_EMAIL` once email sending works.
3. **Votes on connections** (next PR, needs Adam's yes): a thumbs pair on each "Why it's here" link and homage row,
   so fans can vote on a single tie (a fan-noted film link) rather than the whole record. It replaces the "Seconded
   by N fans" count planned in the Television plan. The API already takes any record key; this step adds the
   connection keys to the build list and a compact control on list rows.

## Acceptance checks (pass/fail)

Run on 2026-11-23 against `wrangler pages dev` with a local D1 database, four test members and the built preview
site (`npm run build:preview`). API checks: 36 (`scripts/e2e/votes-api.mjs`); page checks: 26 in Playwright
(`scripts/e2e/votes-ui.cjs`). Setup steps are at the top of `scripts/e2e/votes-seed.py`.

| Check | Result |
|---|---|
| A signed-out visitor sees the counts; pressing a thumb says "Sign in to vote" and casts nothing | Pass (401 from the API; message shown) |
| A member's vote counts once: voting up twice still shows 1 | Pass |
| Pressing the other thumb moves the vote; pressing your own again withdraws it | Pass |
| A member sees their own vote after reloading | Pass |
| Votes on a record that isn't on the site are refused | Pass (404) |
| A cross-site vote is refused | Pass (403) |
| More than 120 votes an hour from one member is refused | Pass (429 on the 121st) |
| Score 0 raises no alert; score -1 raises one, with the record's title and page | Pass |
| An email goes to the alert address with the score, page, record key and the Moderation link | Pass (local mode prints it) |
| No second email for the same record within a day | Pass |
| A record that climbs back to 0 is marked "back above zero"; a new fall below zero alerts again | Pass |
| After Adam keeps a record, no new alert while it stays below zero | Pass |
| Members can't see alerts, decide, or download removals; moderators see them but only Adam decides | Pass (403) |
| "Download removals" gives `decisions.json` entries that `apply-vote-removals.mjs` merges, keeping the file's format | Pass (a no-op run leaves the file byte-identical) |
| Suspending a member stops their votes counting and recounts; lifting it counts them again | Pass |
| Deleting an account removes its votes and recounts | Pass |
| A member's data export includes their votes | Pass |
| With no D1 binding (today's preview), the vote buttons stay hidden and nothing errors | Pass (API answers 503; the group is only shown when counts arrive) |
| axe finds no WCAG 2.2 AA problems on a record page with votes and on the Moderation votes tab, dark and light | Pass |
| No sideways scroll at 320 px; screenshots at 320 and 1440 px, dark and light | Pass |
| CI checks: data, tokens, both builds, site, a11y, server types | See the pull request |

## Decided here (Adam reviews later)

- **Votes need a member account**, so one person can't vote many times. Counts are public; who voted is private.
- **Counts shown as two numbers** (ups and downs) rather than one net score, so a contested record reads as
  contested. The alert uses the net score, as Adam asked.
- **No label on the thumbs** ("Do you like it?" or "Does it belong here?"). Adam's words were thumbs up and down.
  A label is a one-line change if he wants to steer what the vote means.
- **Alert rule:** an alert the first time a record goes below zero. If it climbs back to zero or above before Adam
  decides, it is marked "back above zero" and closes itself; if it falls again, it alerts again. Once Adam keeps a
  record there is no new alert unless it first climbs back to zero or above and then falls again.
- **How Adam is told:** the Moderation page always (a "Votes below zero" tab with a count, also shown on his account
  page's Moderation badge), plus an email when email sending is set up (see "Waiting on Adam"). At most one email per
  record a day, and 25 a day in all, so a vote war can't flood his inbox; the Moderation page still lists everything.
- **Only Adam (the admin) decides.** Moderators can see the list.
- **Nothing is hidden automatically.** "Mark for removal" records his decision; the record leaves the site when the
  removal is applied to `data/review/decisions.json` and deployed, like every other decision.
- **Only active members' votes count.** Suspending a member undoes their votes until the suspension is lifted;
  deleting an account removes its votes.
- **Limits:** 120 votes an hour and 600 a day per member.
- **Signed-out counts are cached for a minute** at Cloudflare's edge, so a busy page costs one database read a minute.
  This changes one promise from the accounts plan: record pages now make one request for the counts for every
  visitor (it was "visitors who never sign in make no API requests"). Other pages still make none.
- **Thumb icons** are from Feather Icons (MIT licence), credited in `public/account.js`.

## Waiting on Adam

- **The Cloudflare setup for accounts** (docs/ACCOUNTS_SETUP.md). Votes switch on with it; step 1 now also runs
  `migrations/0002_votes.sql`.
- **Alert emails:** they need email sending, which is the same setup as email sign-in links: Resend now (DNS records
  added at Bluehost next to the Microsoft 365 ones, which stay) or Cloudflare Email Service after the nameserver move.
  Then add `VOTE_ALERT_EMAIL` (or `ADMIN_EMAILS`) with the address to notify. Until then the Moderation page is the
  only alert.
- **Step 3 (votes on single connections):** yes or no.

## Found, for later

- Records shown only as rows (connections, homages, media library items such as reviews and quotes) have no page of
  their own and so no votes yet: step 3 covers connections; media library items would follow the same pattern.
- Counts aren't shown on cards in lists, and lists can't be sorted by score yet.
- A weekly summary email of open alerts, if Adam wants one.
- Applying removals still needs a pull request; a "Removal applied" button marks them done afterwards. A GitHub
  token secret could let the Moderation page open that pull request itself.
