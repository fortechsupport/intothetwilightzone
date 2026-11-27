# Deploying IntoTheTwilightZone.com

The site is static (Astro + Pagefind) and deploys free on **Cloudflare Pages**, straight from this
GitHub repository. The domain stays registered at Bluehost.

## One project, three kinds of address

| Address | Serves | Search engines |
| --- | --- | --- |
| `intothetwilightzone.com` (from launch) | `main`, public build | allowed |
| `www.intothetwilightzone.com`, `preview.intothetwilightzone.com` | redirect (301) to the bare domain | n/a |
| `<branch>.intothetwilightzone-preview.pages.dev` | that branch, preview build | blocked |

Everything runs in the one Cloudflare Pages project, `intothetwilightzone-preview` (the name is only a
label; renaming a Pages project isn't possible without recreating it). That project already holds the fan
accounts' D1 database, R2 bucket, Turnstile keys and secrets (docs/ACCOUNTS_SETUP.md), so the public site
keeps them by staying in it. A second project, as first planned, would have needed all of that set up twice.

Production deploys of `main` build in **public** mode: the project's Production variable `REVIEW_MODE` is
`public` from launch (it was `preview` before). Public mode shows every record marked include (6,619 of 6,651
on 2026-11-27; the 32 excluded and a handful of pending ones stay hidden), has no `/review/` page and no
preview banner, and its robots.txt lets crawlers in and points to the sitemap. Branch deploys still build in
preview mode (`CF_PAGES_BRANCH` is not `main`), so `/review/` stays available on any branch address.

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
| Environment variable (Production) | `REVIEW_MODE` = `public` (was `preview` until launch) |

A build takes about a minute and produces about 7,900 files (Pages allows 20,000).

## Phase 1: preview site (no nameserver change)

1. Cloudflare: create the `intothetwilightzone-preview` Pages project from this repository with the
   settings above.
2. In that project: **Custom domains → Set up a custom domain →** `preview.intothetwilightzone.com`.
   Cloudflare then shows the CNAME it needs.
3. Bluehost DNS: add `CNAME  preview  →  intothetwilightzone-preview.pages.dev`.
4. Cloudflare verifies the record and issues the certificate (minutes, occasionally a few hours).

The preview project's production branch must be `main` (**Settings → Build → Branch control**).
If it points at any other branch, `preview.intothetwilightzone.com` stops updating: builds of `main`
then show up as "Preview" rows in **Deployments** and the site keeps serving the old branch. This
happened from 2026-11-21 to 2026-11-25, when the production branch was still a work branch.

Nothing else at Bluehost changes: the bare domain, `www`, any email and the old WordPress install keep
working exactly as before.

## Phase 2: public launch (Adam approved 2026-11-27)

Pages can only serve the bare domain when the domain's DNS is on Cloudflare, so the nameservers move from
Bluehost to Cloudflare. Registration stays at Bluehost. Email runs on Microsoft 365, so its records must
come across exactly:

| Type | Name | Value | Proxy |
| --- | --- | --- | --- |
| MX | `@` | `intothetwilightzone-com.mail.protection.outlook.com` (priority 0) | DNS only |
| TXT | `@` | `v=spf1 include:spf.protection.outlook.com -all` | DNS only |
| CNAME | `autodiscover` | `autodiscover.outlook.com` | **DNS only** |
| SRV | `_autodiscover._tcp` | `0 0 443 cpanelemaildiscovery.cpanel.net` | DNS only |
| TXT | `default._domainkey` | the `v=DKIM1; ...` key from Bluehost | DNS only |

Plus every record added at Bluehost after 2026-11-20 (for example sign-in email records from
docs/ACCOUNTS_SETUP.md). Compare Cloudflare's import with a fresh Bluehost zone export before step 2.

1. **Cloudflare → Add a domain** → `intothetwilightzone.com` → quick scan → **Free** plan. On the record review
   screen, check the table above and the fresh Bluehost export; set `autodiscover` and every mail record to
   **DNS only** (grey cloud). Don't switch the nameservers yet.
2. **Bluehost → Domains → intothetwilightzone.com → Nameservers → Change → Custom**: enter the two
   nameservers Cloudflare shows, save. (DNSSEC must be off at Bluehost; it is off unless someone turned it on.)
3. Wait for Cloudflare's "now active" email (usually under an hour, at most 24 hours). Nothing visible
   changes in the meantime: the imported records point where Bluehost's did.
4. **Cloudflare → DNS → Records**: delete the `A @ 162.241.218.130` record and the `CNAME www` record (they
   point at the old Bluehost hosting and would block step 5).
5. **Workers & Pages → intothetwilightzone-preview → Custom domains**: add `intothetwilightzone.com`, then
   `www.intothetwilightzone.com`. Cloudflare creates their DNS records itself.
6. **Settings → Variables and secrets → Production**: set `REVIEW_MODE` to `public`. Then **Deployments** →
   latest production deployment → **Retry deployment** (variables only apply to new builds).
7. **Rules → Redirect Rules → Create rule**: when hostname is `www.intothetwilightzone.com` or
   `preview.intothetwilightzone.com`, redirect dynamically to
   `concat("https://intothetwilightzone.com", http.request.uri.path)`, status 301, preserve query string.
8. **SSL/TLS → Edge Certificates**: turn on **Always Use HTTPS**.

Afterwards: the old WordPress install stays on Bluehost's hosting but nothing points at it. Members' passkeys
keep working (their relying party is intothetwilightzone.com on every subdomain, see server/auth.ts); they sign
in once more because cookies belong to the old hostname.

Undo: put Bluehost's nameservers back (`ns1.bluehost.com`, `ns2.bluehost.com`) and set `REVIEW_MODE` back
to `preview`. Bluehost's own DNS records are untouched by the switch, so they take over again as they were.
