# Reviewing records

Research documents everything even remotely related to *The Twilight Zone*. Adam then decides,
record by record, what the public site shows. Every record starts **pending**.

| Status | Public site (`main`) | Preview builds and `npm run dev` |
|---|---|---|
| `include` | shown | shown |
| `pending` (default) | hidden | shown |
| `exclude` | hidden | hidden (still listed on `/review/`) |

## Where decisions live

One ledger, `data/review/decisions.json`, keyed `<collection>/<id>`:

```json
{
  "books/rod-serlings-devils-and-demons": { "status": "include", "notes": "Keep: Serling anthology", "date": "2026-11-20" },
  "songs/some-band-twilight-zone": { "status": "exclude", "notes": "Different song with the same title", "date": "2026-11-20" }
}
```

A record with no entry is pending. Records themselves carry no review field, so research threads
and `npm run import` never conflict with review work, and nothing needs a schema change.
If a record is renamed, move its ledger entry too; `npm run review:status` lists entries that no
longer match a record.

## Two ways to review

**Spreadsheet.** `npm run review:export` writes `review/review-queue.xlsx` (and `.csv`): one row
per record with category, title, date, people, relevance (core / related / tangential), confidence,
tags, a short summary and the first source. Set **Decision** to `include` / `exclude` (or `y` / `n`),
add **Notes**, sort and filter freely; rows are matched by **Key**. A blank Decision leaves the record
as it was. Import with `npm run review:import -- path/to/review-queue.xlsx` (add `--dry-run` to preview).

**Review page.** Preview builds have `/review/`: every record grouped by category, filterable by
status, category, relevance and text, with Include / Exclude / Pending buttons, bulk actions and notes.
Choices stay in the browser until **Download decisions** saves a CSV, which imports the same way.

## Build modes

`REVIEW_MODE` picks what a build shows: `public` (included only), `preview` (everything not excluded)
or `all`. Unset, it is `preview` for `npm run dev` and Cloudflare Pages preview branches
(`CF_PAGES_BRANCH` other than `main`) and `public` for other builds. `npm run build:preview` builds a
preview locally. Preview builds carry a banner and `noindex`.

Included records often mention hidden ones (a person credited on a pending episode, a book listing
episodes). The `unlink-hidden-records` build step turns those links into plain text instead of
404s, so pages need no review logic of their own.
