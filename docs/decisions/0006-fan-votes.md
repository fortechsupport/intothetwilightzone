# 0006 Fan votes: thumbs up and down on every record; Adam decides when a score falls below zero

Date: 2026-11-23. Decided by Adam (22:18 UTC, Movies thread, quoted in 0005); the details below were chosen while
building it (docs/plans/fan-votes.md) and wait for his review.

## Decision

- Every record page has a **thumbs up** and a **thumbs down** with their counts. Up and down cancel out: the
  record's **score** is ups minus downs.
- Voting needs a free member account: **one vote per member per record**, which they can switch or withdraw.
  Only active members' votes count.
- When a record's score **falls below zero**, Adam is told: on the Moderation page ("Votes below zero") always, and by
  email once email sending is set up. He chooses **Keep it** or **Mark for removal**.
- **Nothing is removed automatically.** A removal is applied to `data/review/decisions.json` (as `exclude`, with a note
  naming the vote) and leaves the site with the next deploy, like every other decision.
- A kept record doesn't alert again unless its score first climbs back to zero or above and then falls again.

## Why

Adam doesn't want to judge every film link one by one (0005). Visitors' votes find the doubtful ones, and Adam keeps
the final say. Accounts stop one person voting many times; counting only active members lets a moderator undo a
spammer's votes by suspending them.

## Set aside

- **Hiding a record automatically below zero**: Adam asked to be told so that he decides.
- **Anonymous votes (one per browser)**: anyone could vote many times by clearing cookies.
- **Showing only the net score**: two numbers show when a record is contested; the alert still uses the net score.
- **An alert on every vote below zero**: one alert per fall below zero, and at most one email a day per record, so a
  vote war can't flood Adam's inbox.
