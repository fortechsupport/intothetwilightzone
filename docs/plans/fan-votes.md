# Plan: fan votes (thumbs up and thumbs down) with alerts to Adam

**Date:** 2026-11-23. **Approved by Adam** (2026-11-23, 22:18 UTC, in the Movies thread; decision 0005 in PR #42):

> Mentions from fans about movies having ties are okay, but should be verified, otherwise users can thumbs up/down
> items across all aspects of the site. If any items fall below 0 thumbs up (thumbs down counteracts thumbs up and
> vice versa), notify me so I can decide if that item should or should not be removed from IntoTheTwilightZone.com.

He asked for the feature itself, so this went straight to a build with screenshots rather than mock-ups first.
The rules it follows are in [decision 0008](../decisions/0008-fan-votes.md).

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
3. **Votes on single links** (Adam said yes, 2026-11-23 22:37 UTC; added to this PR because the thread works on one
   branch): a small thumbs pair beside every connection (homage, parody, reference, adaptation, remake...) wherever
   it is listed: record pages, film and show pages, episode "Draws on" and "Legacy" lists, the homages list, series
   pages and the episode explorer. Series pages show each homage with its label only (no thumbs), to keep that long
   page light; every one of those links is voted on from its own record page. All connections listed on a record page
   are votable (`src/components/fan/LinkVote.astro`). It replaces
   the "Seconded by N fans" count planned in the Television plan. A link's alert names both ends: "The Simpsons: The
   Devil and Homer Simpson → Escape Clause (1959): inspired by". Counts load as rows come near the screen, 50 at a
   time, so a long list doesn't load all at once. Removing a link works like removing a record: its
   `connections/<id>` key becomes `exclude` in decisions.json.

## Acceptance checks (pass/fail)

Run on 2026-11-23 against `wrangler pages dev` with a local D1 database, four test members and the built preview
site (`npm run build:preview`). API checks: 40 (`scripts/e2e/votes-api.mjs`); page checks in Playwright, at 320 and 1440 px, dark and light
(`scripts/e2e/votes-ui.cjs`). All pass. Setup steps are at the top of `scripts/e2e/votes-seed.py`.

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
| A single link can be voted on; its alert names both ends and the page it's on | Pass |
| On the homages list, counts load near the screen first and more load on scrolling | Pass (e.g. 9 of 174 at first on a phone) |
| Votes on records the site doesn't show can't be read (so they can't get round the cache) | Pass (404) |
| A decision can't skip a step ("Removal applied" on an open alert) or be made on a record back at zero | Pass (404) |
| Two votes landing together can't crash or leave an alert based on an older count (second read's findings) | Fixed: the alert step re-reads the totals and creates the alert with ON CONFLICT DO NOTHING (not load-tested) |
| axe clean on the homages list and /series/1959/ with link votes showing, dark and light | Pass |
| CI checks: data, tokens, server types, both builds, site, a11y (54 pages) | Pass locally; see the pull request for GitHub's run |

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
- **Page weight:** series pages have no link votes: `/series/1959/` was 327 KB with them, against the 300 KB target.
  The thumbs came off its homage rows, and the episode table now works out air order, writers and directors from its
  own cells instead of repeating them as attributes. It is now 289 KB (296 KB in preview mode). One connection that
  was only listed on a series page is no longer votable (6,415 votable items public, 6,601 preview).
- **Decision numbers:** this work's records are 0007 (fan account sign-in) and 0008 (fan votes); they were first
  numbered 0002 and 0006, which the Television and "Compared to" records already use.
- **Second read** (an independent review of the code) found two rare race conditions and a caching gap; all three are
  fixed, along with its two small points (decisions follow set steps; made-up record keys are refused).

## Waiting on Adam

- **The Cloudflare setup for accounts** (docs/ACCOUNTS_SETUP.md). Votes switch on with it; step 1 now also runs
  `migrations/0002_votes.sql`.
- **Alert emails:** they need email sending, which is the same setup as email sign-in links: Resend now (DNS records
  added at Bluehost next to the Microsoft 365 ones, which stay) or Cloudflare Email Service after the nameserver move.
  Then add `VOTE_ALERT_EMAIL` (or `ADMIN_EMAILS`) with the address to notify. Until then the Moderation page is the
  only alert.

## Found, for later

- Media library items that are not records (reviews, quotes and clips listed in the Media Library) have no key of
  their own yet and so no votes; they would follow the same pattern as links.
- A film's "Why it's here" ties (sentences with sources, not connections) are voted on through the film page.
- Counts aren't shown on cards in lists, and lists can't be sorted by score yet.
- A weekly summary email of open alerts, if Adam wants one.
- Applying removals still needs a pull request; a "Removal applied" button marks them done afterwards. A GitHub
  token secret could let the Moderation page open that pull request itself.
