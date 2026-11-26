# Nightly photo batches

**Date:** 2026-11-25. **Approved by Adam:** "Nightly cloud runs" (decision card in the thread "Improve the whole
site in 5 cycles", 2026-11-25 21:37 UTC), for the pictures left over from docs/plans/site-quality-cycles.md.

Wikimedia lets this site's tools download only about 8 files every two hours, so the remaining checked pictures in
`data/images/pending-commons.json` (124 on 2026-11-25) are fetched by a scheduled cloud run each night. Each run
merges one pull request and the list shrinks until nothing is left.

## Steps for each nightly run (one pull request)

1. Branch from `main`.
2. `python3 -I scripts/fetch-commons-images.py /tmp/photos 100` fetches for at most 100 minutes. If it prints
   "finished: nothing left to fetch" and no picture is waiting, the job is done (see "When the list is empty").
3. Look at every downloaded picture. For each one, check:
   - It shows what its `title` and `records` say.
   - It is not a frame from an episode, a copyrighted poster or a cover.
   - The date doesn't contradict the record. For example, a photo dated after an episode aired is not "in" that
     episode, so it is credited only on the person's page.
   If a picture fails, drop it from the manifest and remove its entry from `pending-commons.json`, with the reason
   in the pull request.
4. Write `alt` for each picture: one plain sentence describing what is visible. Tidy `original_source` (for
   example "Original press photograph, front and back scanned (sold on eBay)").
5. Run `node scripts/import-images.mjs /tmp/photos/manifest.json`, then every check in CLAUDE.md. Then view two
   of the new record pages at 320 and 1440 px.
6. Remove the imported entries from `pending-commons.json`. Add a line to `docs/releases.md`.
7. Open the pull request and merge it when CI is green (Adam's standing rule).

## When the list is empty

Delete `data/images/pending-commons.json`, add a release note, and tell Adam in the project chat that the
nightly photo task can be switched off.

## Acceptance checks

- Every new picture has a creator, a license from the accepted list, a source page and alt text (the import
  script refuses anything else).
- All CI checks pass.
- No picture duplicates one already on the site.

## Decided here (Adam reviews later)

- Left out of the list as doubtful: the Buck Houghton portrait (identity not confirmed) and a Cayuga Lake view
  offered for the Serling cottage (does not show the cottage).
- 2026-11-26 run: Commons gives the upload date for some files. Jack Weston's photo is dated 1971 from its Commons
  title and description, not the 2013 upload date; William Shatner's "Live from Hollywood" photo carries no date
  (2018 is the Flickr upload, and the picture looks decades older).
- 2026-11-26 run: the fetch script now uses the first accepted license when a file carries several (the UCLA library
  photo is GFDL and CC BY-SA 4.0 and was skipped as GFDL-only), and writes the Creative Commons link from the license
  name.

## Waiting on Adam

- Nothing.

## Found, for later

- Nothing yet.
