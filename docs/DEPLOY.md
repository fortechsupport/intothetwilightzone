# Deploying IntoTheTwilightZone.com

The site is static (Astro + Pagefind) and deploys free on **Cloudflare Pages**, straight from this
GitHub repository. The domain stays registered at Bluehost.

## Two sites from one repository

| Address | Cloudflare Pages project | Shows | Search engines |
| --- | --- | --- | --- |
| `preview.intothetwilightzone.com` | `intothetwilightzone-preview` | every record not excluded, plus `/review/` | blocked |
| `<branch>.intothetwilightzone-preview.pages.dev` | same project, one per branch / PR | the same, for that branch | blocked |
| `intothetwilightzone.com` (at launch) | `intothetwilightzone` | only records marked include | allowed |

Both projects build the `main` branch. The preview project sets `REVIEW_MODE=preview`; the public
project leaves it unset, so `CF_PAGES_BRANCH=main` makes it a public build (see `src/lib/review.ts`).
Every push to `main` redeploys both. Every other pushed branch gets its own preview address, and
Cloudflare posts it on the pull request.

Search engines are kept off preview builds three ways: a `noindex` meta tag on every page
(`src/layouts/Base.astro`), a `Disallow: /` robots.txt (`src/pages/robots.txt.ts`), and an
`X-Robots-Tag: noindex` header on every `*.pages.dev` address (`public/_headers`).

## Build settings (both projects)

| Setting | Value |
| --- | --- |
| Framework preset | Astro |
| Build command | `npm run build` |
| Build output directory | `dist` |
| Root directory | *(blank)* |
| Production branch | `main` |
| Node version | from `.node-version` (22) |
| Environment variable (preview project only) | `REVIEW_MODE` = `preview` |

A build takes well under a minute and produces about 5,800 files (Pages allows 20,000).

## Phase 1: preview site (no nameserver change)

1. Cloudflare: create the `intothetwilightzone-preview` Pages project from this repository with the
   settings above.
2. In that project: **Custom domains → Set up a custom domain →** `preview.intothetwilightzone.com`.
   Cloudflare then shows the CNAME it needs.
3. Bluehost DNS: add `CNAME  preview  →  intothetwilightzone-preview.pages.dev`.
4. Cloudflare verifies the record and issues the certificate (minutes, occasionally a few hours).

Until PR #1 merges the site into `main`, set the preview project's production branch to
`claude/milestone-1-site` (**Settings → Builds → Branch control**) and switch it to `main` afterwards.

Nothing else at Bluehost changes: the bare domain, `www`, any email and the old WordPress install keep
working exactly as before.

## Phase 2: public launch (needs Adam's go-ahead)

Pages can only serve the bare domain (`intothetwilightzone.com`) when the domain's DNS is on
Cloudflare. At launch:

1. Cloudflare: **Add a domain** → `intothetwilightzone.com` (Free plan). Check the imported DNS
   records against Bluehost's list, especially MX/TXT records for email.
2. Bluehost: replace the nameservers with the two Cloudflare gives. Registration stays at Bluehost.
3. Create the `intothetwilightzone` Pages project (settings above, no `REVIEW_MODE`), then add the
   custom domains `intothetwilightzone.com` and `www.intothetwilightzone.com`, and a redirect rule
   from `www` to the bare domain.
4. In the public project, **Settings → Builds → Branch control**: turn preview deployments off (the
   preview project already handles branches).

Undo: put Bluehost's nameservers back (`ns1.bluehost.com`, `ns2.bluehost.com`).
