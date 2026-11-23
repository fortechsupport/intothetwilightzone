# 0007 Fan accounts sign in with passkeys, on Cloudflare

**Date:** 2026-11-21. **Decided by:** the fan accounts thread, for Adam to review (he asked for accounts and
for defaults to be chosen overnight).

**Decision.** Accounts run on the Cloudflare free plan the site already uses: a Pages Function at `/api/*`,
D1 for data, R2 for uploaded files, Turnstile against bots. People sign in with **passkeys**. Email links and
Google sign-in are built and switch on when their settings are added. No passwords are ever stored.

**Why.**
- Nothing to run or pay for beyond Cloudflare, which already hosts the site; static pages stay static and
  visitors who never sign in cost nothing.
- Passkeys can't be guessed, reused or phished, and need no email service, so they work today while the
  domain's DNS is still at Bluehost.
- Every member feature degrades to "being set up" if a binding is missing, so the code can merge first.

**Set aside.**
- *Passwords*: a store of password hashes to protect and a reset-by-email flow anyway.
- *A hosted identity service (Auth0, Clerk, Supabase)*: another account and vendor, and free tiers that
  change; member data would live outside Cloudflare.
- *Email links as the only method*: needs an email sender, which needs DNS changes at Bluehost or the
  nameserver move first.
- *GitHub sign-in*: most fans don't have GitHub accounts (the GitHub forms stay for those who do).
