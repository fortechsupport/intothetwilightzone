# Switching on fan accounts

Member accounts (sign-in, synced lists, forums, suggestions, uploads, moderation) run on Cloudflare,
on the free plan: a **D1** database, an **R2** bucket for uploaded files, and **Turnstile** for the
"I am human" check. The code is already in the site. Until the steps below are done, every account
page says "being set up" and the rest of the site works as before.

Everything here is done once, in the Cloudflare dashboard, in about 15 minutes. Do steps 1 to 5 for the
**Preview** environment first (branch previews such as
`claude-project-thread-gflqxq.intothetwilightzone-preview.pages.dev`), check it, then repeat step 4 for
**Production** when the branch is merged.

## 1. Create the database (D1)

1. Cloudflare dashboard → **Storage & databases** → **D1 SQL database** → **Create database**.
2. Name: `intothetwilightzone`. Location: leave automatic. **Create**.
3. Open the new database → **Console** tab.
4. Open [`migrations/0001_accounts.sql`](../migrations/0001_accounts.sql) on GitHub, click **Raw**, copy all
   of it, paste it into the console, and click **Execute**. It creates the tables and the ten forums.
   (Command-line alternative: `npx wrangler d1 migrations apply intothetwilightzone --remote`.)

## 2. Create the uploads bucket (R2)

1. Dashboard → **R2 object storage**. If R2 isn't switched on yet, Cloudflare asks you to subscribe to the
   R2 plan and may ask for a payment method; the free allowance (10 GB stored) costs nothing, and the site
   stops accepting files at 9 GB so it stays inside it.
2. **Create bucket** → name `intothetwilightzone-uploads` → leave everything else as it is → **Create**.
3. Leave **Public access** off. Files are served only through the site, which checks they were approved.

## 3. Create the "I am human" check (Turnstile)

1. Dashboard → **Turnstile** → **Add widget**.
2. Name: `IntoTheTwilightZone`. Hostnames: `intothetwilightzone.com` and `intothetwilightzone-preview.pages.dev`
   (also add `preview.intothetwilightzone.com` if the widget page doesn't accept a parent domain as covering it).
3. Widget mode: **Managed**. **Create**.
4. Keep the page open: you need the **Site key** and **Secret key** in step 4.

## 4. Connect them to the Pages project

Dashboard → **Workers & Pages** → **intothetwilightzone-preview** → **Settings**.

**Bindings** (choose the **Preview** environment first, then later **Production**) → **Add**:

| Type | Variable name | Value |
|---|---|---|
| D1 database | `DB` | `intothetwilightzone` |
| R2 bucket | `UPLOADS` | `intothetwilightzone-uploads` |

**Variables and secrets** (same environment) → **Add**:

| Type | Name | Value |
|---|---|---|
| Text | `TURNSTILE_SITE_KEY` | the Site key from step 3 |
| Secret | `TURNSTILE_SECRET` | the Secret key from step 3 |
| Secret | `AUTH_SECRET` | any long random text (for example, 40 characters from a password generator) |
| Secret | `ADMIN_BOOTSTRAP_TOKEN` | another long random text, at least 16 characters. You'll type it once in step 5 |

Then **Deployments** → the latest deployment of the branch → **⋯** → **Retry deployment**, because
settings only reach new deployments.

## 5. Make yourself the site editor

1. Open the branch preview → **Sign in** (top right) → **Create an account**: pick a username and create a
   passkey (your phone or computer asks for your face, fingerprint or screen lock).
2. On your account page, open **Have a site editor code?**, paste the `ADMIN_BOOTSTRAP_TOKEN`, **Use code**.
3. A **Moderation** link appears on your account page. That's the review queue for suggestions, uploads,
   held forum posts, reports and copyright notices.
4. Optional: once you're admin, delete the `ADMIN_BOOTSTRAP_TOKEN` secret so the code can't be used again.
   You can make other members moderators from Moderation → Members.

## Optional later

- **Email sign-in links** (a backup for people who lose their passkey). Either:
  - after the nameservers move to Cloudflare (launch phase 2): Dashboard → **Email** → **Email Sending**,
    onboard `intothetwilightzone.com`, add a `send_email` binding named `EMAIL` to the project, and a text
    variable `EMAIL_FROM` such as `signin@intothetwilightzone.com`; or
  - now, with [Resend](https://resend.com) (free tier): verify the domain there (it gives you DNS records to
    add at Bluehost, alongside the Microsoft 365 records, which must stay), then add secret `RESEND_API_KEY`
    and variable `EMAIL_FROM`.
  Optionally add `ADMIN_EMAILS` (your address) so confirming that email makes you admin.
- **Google sign-in**: Google Cloud console → APIs & Services → Credentials → Create OAuth client ID (Web
  application). Authorised redirect URIs: `https://intothetwilightzone.com/api/auth/google/callback` and the
  preview address with the same path. Then add text variable `GOOGLE_CLIENT_ID` and secret
  `GOOGLE_CLIENT_SECRET`.
- **Forum pre-moderation**: text variable `FORUM_PREMODERATE` = `all` (every post checked), `new` (default:
  a member's first two posts) or `none`.
- **US DMCA safe harbor**: register a designated agent with the U.S. Copyright Office's DMCA Designated
  Agent Directory (copyright.gov/dmca-directory; a small fee, renewed every three years), then add the
  agent's contact to the copyright page.

## Running it on a computer

```
cp wrangler.example.toml wrangler.toml
npm run dev:accounts        # builds, creates a local database, serves on http://localhost:8788
```

Local mode prints sign-in emails to the terminal instead of sending them, and the editor code is
`local-dev-admin-code-123`. `npm run check:server` type-checks the API.

## Limits built in

| What | Limit |
|---|---|
| Files | images 15 MB, audio 50 MB, video 95 MB, PDF 25 MB; type checked from the file's bytes |
| Storage | 1 GB per member, 9 GB for the whole site |
| Uploads / suggestions / new topics | 10 / 15 / 5 per member per day |
| Forum posts | 30 per member per hour; first 2 posts of a new member held for review |
| Reports | 20 per member per day |
| Sign-up attempts / email links | 10 / 5 per hour per visitor, 3 links per hour per address |
| Sessions | 30 days, renewed while used |
