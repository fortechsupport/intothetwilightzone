# Release notes

What a visitor can do after each change, in plain words. Newest first. Every entry ends with what is
known not to work yet.

## 2026-11-21 — Fan accounts (switch on after Cloudflare setup)

**Free member accounts.** Once switched on (docs/ACCOUNTS_SETUP.md), a visitor can:
- Create an account with a passkey (face, fingerprint or screen lock; no password) and sign in on any device.
- Keep **Favorites** and **Watch, listen, read or play later** lists, alongside Watched, I own it and Want it,
  on every device. Anything marked before signing up comes with them. My Zone shows all five lists.
- Join the **forums** (/community/): ten forums, a Discuss link on record pages, replies, editing and deleting
  their own posts, and reporting.
- **Suggest** a correction, something new or an idea, privately, and follow its review status.
- **Share their work**: images, audio, video, PDFs, written pieces or links, shown in Fan contributions
  once approved.
- Download all their data, or delete their account.

The editor gets a **Moderation** page for suggestions, uploads, held posts, reports and copyright notices.
New pages: Terms of use, Privacy notice, Copyright (with a notice form), Community guidelines.

**Known not to work yet**
- Nothing member-related works until the Cloudflare setup is done; until then those pages say "being set up".
- Email sign-in links and Google sign-in are off until their settings are added.
- No email notifications (replies, approvals); members see statuses on their account page.
- Photos are not resized and their location data is not removed automatically (the upload form says so).
- Forum posts are not in site search.
## 2026-11-21 (later) — Faster long pages and a polish pass

**The three heaviest pages now open quickly.**
- **People** shows the 60 people in the most records, with A to Z letters at the top. Every person is on a
  letter page ("People: S", filed by surname). Filtering or searching on the People page still covers all
  2,979 entries; it loads the full index only when you use it. The page went from 1.1 MB to 50 KB.
- **Timeline** opens on the franchise's own milestones (premieres, finales, films, production and legal
  history) with a card for each decade. Each decade has its own page with every dated entry and the same
  show/hide filter. 1.4 MB became 67 KB, and the largest decade page is 185 KB.
- **Media Library** opens on an overview of the types, each with its own sortable page ("Reviews",
  "Interviews"...). Old links (`/media/?type=review`, `/media/#item`) still land in the right place.
  607 KB became 56 KB.

**Polish.**
- On phones, the Media Library and index tables show each row as a card with every column, instead of hiding
  columns.
- The small label above a record's title no longer starts a wrapped line with a stray dot.
- Dates in record facts read as dates ("November 21, 2026", not "2026 11 21"), and hyphenated words keep their
  hyphens. Outside links say what they are ("Read it online", "Official site", "Apple Podcasts") instead of
  showing a field name.
- The "page not found" page offers a search (filled in from the missing address) and the nine ways in.
- Map colors moved into the design tokens, and a few leftover raw colors were removed.

**Sources.** The 14 organizations that had none now cite the archive finding aids, catalogue pages and press
the site already relies on for their holdings. `check:data` now fails any record without a source.

**Checked:** data, tokens, both builds, links and titles (6,272 public pages), accessibility on 34 page types
in both themes at 320 px. Load times on a simulated slow 4G phone with a slowed processor: 0.7 to 1.4 s to
fully loaded for the home, record, index, timeline, Media Library, map and search pages.

**Known not to work yet**
- Without JavaScript, the People page's filters do nothing; the letter pages list everyone.
- Sorting index tables is not available on phones (the column headers are hidden there).
- Map marker colors are the same in both themes and are not part of the contrast check.

## 2026-11-21 — The redesign

**Everything is on `main`.** The fan features, the nine-verb navigation and the structure document, which
had been waiting in a stack of 23 pull requests, are now one site on `main`.

**A new look.** The site now has a design of its own, in the spirit of the 1959 series: midnight black, warm
brass, a serif headline face and a clean mid-century sans for reading.

- A light theme ("Paper") beside the dark one ("Midnight"). The site follows the visitor's system setting,
  and a switch in the header remembers a choice.
- A new home page: a search box, the four series, episode of the day, the nine ways in, the features, the
  Media Library and what the site is.
- Every record page opens the same way: what kind of thing it is and its context ("Song · by Iron Maiden ·
  1981"), then the title. Facts read like a spec sheet. A share image appears when a page is posted to social
  media.
- A footer with the site's sections and tools, and the fan-site notice.
- Fonts are served from the site itself (no calls to outside font services).

**Fixes a reader would notice.**
- No page repeats a role any more ("Writer · ... · writer" on 372 people pages).
- No two pages share a title. 84 titles were shared by 2 to 37 pages each ("Twilight Zone" was the title
  of 37 song pages). Record pages now say what they are in the browser tab: "Twilight Zone (song, by Iron
  Maiden · 1981)".
- Seven actors with accented names (E. J. André, Mel Tormé, Michael Peña, Miguel A. Núñez Jr., René
  Auberjonois, Richard Yñiguez, Rudy Vallée) each had two pages with their credits split between them. Each
  now has one.
- Six records that were entered twice now point at one page, and the old address redirects: Asemblance,
  Duel (1971), Monsters (1988), Persona 2: Eternal Punishment, The Adventures of Willy Beamish, and Moses P's
  "Twilight Zone".
- "On this day" no longer reads "Joseph Campanella was born · Born".

**Adam's review decisions.** The 28 records Adam chose to exclude on November 21 (10 books, 17 songs and
one game) are hidden from the public site. They stay in the data and the review queue with their reasons.

**Checks on every change.** A pull request now has to pass: the data check, the design-token contrast test
in both themes, a build in public and preview mode, a sweep of every page for broken links, duplicate titles,
missing headings or descriptions, repeated roles and page weight, and an accessibility pass (axe-core, WCAG
2.2 AA) on one page of every type in both themes, with a 320-pixel phone check. The working standards are
in CLAUDE.md.

**Known not to work yet**
- Three pages are heavier than the 300 KB target: the Timeline (1.4 MB), the People index (1.1 MB) and the
  Media Library (0.6 MB). They need splitting by decade or letter.
- Share images are one image for the whole site, not one per record.
- 14 organizations created from names in other records have no sources yet (listed as warnings by
  `npm run check:data`).
- Accounts (favorites, watch later, forums, uploads) are being built separately; the header shows My Zone,
  which keeps lists in the browser, until then.
