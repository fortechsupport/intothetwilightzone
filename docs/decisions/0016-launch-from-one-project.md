# 0016 Launch the public site from the existing Cloudflare project

**Date:** 2026-11-27. **Decided by:** Adam approved the launch ("Yes, we can move to Cloudflare whenever you're
ready", 2026-11-27 18:43 ET); the single-project approach was decided in the publish thread.

## Decision

- intothetwilightzone.com is served by the existing Pages project `intothetwilightzone-preview`, not a second
  project. That project already holds the fan accounts' D1 database, R2 bucket, Turnstile keys and secrets.
- Its Production variable `REVIEW_MODE` becomes `public`: no preview banner, no `/review/`, crawlers allowed.
  Branch deploys stay in preview mode on `*.pages.dev`.
- `www.` and `preview.` redirect (301) to the bare domain.
- DNS moves to Cloudflare (nameservers changed at Bluehost); registration and Microsoft 365 email stay as they are.

## Why

The two-project plan in the first DEPLOY.md predates fan accounts. A second project would need every binding and
secret set up again, and members would have two separate databases. Public and preview builds now differ by only
a handful of pending records, so a separate preview site adds little.

Steps: docs/DEPLOY.md, "Phase 2".
