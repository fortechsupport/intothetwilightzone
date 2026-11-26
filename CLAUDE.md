# Working on IntoTheTwilightZone.com

A non-commercial fan site and living history of The Twilight Zone, built with Astro from YAML records
and deployed to Cloudflare Pages. Adam owns the site and decides what goes on it. These standards apply
to every change, by every person or Claude thread. They come from how Adam's Seymour project is run
(see "Matching the Seymour quality bar") and from Adam's own feedback on this project.

## Adam's rules for the content

- **Document everything** even remotely related to The Twilight Zone, Rod Serling or Night Gallery. Never
  drop a record: tag its relevance (core, related, tangential) and let Adam include or exclude it.
- **A reason on every record.** Anything Adam decides on says how it connects to the show, its tier and why,
  a recommendation and why, and a source link (`npm run assess`, `data/review/assessments.json`).
- **Never invent facts.** Every fact carries a source. An inference is labelled as one. If you cannot
  verify something, leave it out and say so.
- **Media and content are never categories.** Reviews, interviews, ads, archival holdings, quotes, links,
  documents and clips attach to the records they are about and are gathered in the Media Library (/media/).
- **Directories:** People, Characters, Organizations, Places. **Navigation:** the nine verbs Watch, Listen,
  Read, Play, Collect, Attend, Discover, Meet, Visit (docs/INFORMATION_ARCHITECTURE.md is the spec).
- **Official vs unofficial:** each category shows official items and "unofficial and inspired" ones on
  separate shelves (`isOfficial()` in src/lib/taxonomy.mjs; a record's `official:` overrides).
- **A to Z everywhere**, ignoring a leading The, A or An. Chronological only where order is the point.
- **Credit where credit is due** for everything: every record, image, quote, link and fact names its creator,
  its rights holder and its source (author and publication), and credits the researchers and fans who
  contributed. Every category plan has a "Blessing-ready" section: the aim is a site CBS/Paramount and the
  Serling family would gladly point fans to.
- **Copyright:** copyrighted media is linked, never copied. Only public-domain or CC files are hosted.
- **No money** is made from the site: no ads, no affiliate links, no sponsorships.
- **Where to watch** on every series, show, film and episode page, and once beside a show's name in lists
  (`data/fan/watch.yaml`, `WhereToWatch`; decision 0003). **Links** to other sites open in a new tab, links within the
  site in the same tab (applied at build by integrations/external-links.mjs, enforced by `npm run check:site`).
- New categories may be added but are flagged `new` so Adam can remove them.
- Records start **pending**; only Adam's decisions in `data/review/decisions.json` publish them
  (docs/REVIEW.md). Renaming a record id orphans its decision: carry the key over.

## How we work

1. **Plan before building.** Anything bigger than a fix gets `docs/plans/<name>.md` first: the date, what
   Adam approved, the steps (one pull request each), pass/fail acceptance checks, and three running lists:
   *Decided here (Adam reviews later)*, *Waiting on Adam*, *Found, for later*. Anything found mid-work goes
   on the last list instead of being slipped in.
2. **Show before building anything visual.** New layouts go to Adam as screenshots or a clickable preview
   first, unless he has asked for the build itself.
3. **Verify before replying.** A reply about finished work says what was checked and how: the CI result,
   which pages were viewed, screenshots at 320 px and 1440 px. If something wasn't checked, say so.
4. **Review before asking for a merge.** Self-review against the plan's acceptance checks; larger changes
   get an independent second read. Adam's go-ahead merges, except where he asked for the work to ship.
5. **Write it up.** Every merge adds a plain-words entry to `docs/releases.md`: what a visitor can now do,
   then "Known not to work yet". New decisions get a numbered record in `docs/decisions/`.
6. **One source of truth per topic.** Structure: docs/INFORMATION_ARCHITECTURE.md. Rules: docs/decisions/.
   Looks: design/tokens.json. Schema: docs/CONTENT_SCHEMA.md and src/content.config.ts. When a document and
   the site disagree, fix both in the same pull request.
7. **Few parallel stacks.** At most two open pull-request stacks; a stack reaches `main` within days.
   Branch from `main`, target `main`.

## Checks (CI runs all of these on every pull request; run them locally first)

| Command | What must be true |
|---|---|
| `npm run check:data` | People files are named for their slug; every decision key has a record; duplicate_of targets exist; no two records share a title, year and maker; every record has a source |
| `npm run tokens -- --check` | Every text color pair meets 4.5:1 contrast and every control border 3:1, in every theme |
| `npm run build` and `npm run build:preview` | The schema accepts every record (public and preview modes) |
| `npm run check:site` | External links open in a new tab and internal ones do not; no broken internal links, no duplicate page titles, one h1 and a description per page, headings that never skip a level, no repeated roles, no page over 1.5 MB (300 KB is the target) |
| `npm run check:a11y` | axe-core finds no WCAG 2.2 AA violations on one page of every type, dark and light, and on a sample in each era theme; at 320 x 640 nothing scrolls sideways or runs past the right edge and the h1 starts in the top third, also with wider text spacing on a sample; on a slow phone connection no sample page shifts its layout by more than 0.1 |

## Design system

- Colors, type, spacing and radii live in `design/tokens.json`; `npm run tokens` writes `public/tokens.css`.
  Never write a raw color in a stylesheet or template: add a token.
- Themes: Midnight (dark, default) and Paper (light), chosen by the visitor's system, plus four era themes in the
  header's Theme menu: 1959 Original, 1985 Neon, 2002 Steel, 2019 Crimson (decision 0010). Era themes evoke an era by
  palette, type and texture only, never the shows' logos or title designs, and pass the same contrast checks.
- Type: DM Serif Display for headings, Jost for text and interface, Courier Prime for narration and teleplay
  excerpts; the era themes add Michroma, Oswald and Fraunces for headings. All self-hosted in `public/fonts/`
  (SIL Open Font License).
- Every record page starts with `RecordHeader` (type label, context, title, actions bar); every grid uses
  `.card`; facts use `dl.facts`; connections use `.tz-link`. See the comments at the top of public/site.css.
- Record page titles come from `src/lib/titles.ts`, which adds type and context so no two pages share a title.

## Shared files

- `src/lib/site-links.ts` holds the utility bar and footer links. Add links there, not in the layout.
- `public/account.css`, `public/account.js` and `src/components/AccountSlot.astro` belong to the fan accounts
  work. Record pages carry an empty `.record-actions[data-record-key]` for its buttons.
- The deploy is described in docs/DEPLOY.md. Never change DNS or the apex domain without Adam's go-ahead.
