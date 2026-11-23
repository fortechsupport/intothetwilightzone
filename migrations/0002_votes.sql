-- Fan votes: a thumbs up or thumbs down on any record, one per member per record (docs/plans/fan-votes.md).
-- Up and down cancel out; when a record's net score falls below zero, Adam gets an alert and decides.

CREATE TABLE votes (
  user_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  item_key TEXT NOT NULL,                    -- "collection/id", the same key as data/review/decisions.json
  value INTEGER NOT NULL CHECK (value IN (-1, 1)),
  created_at INTEGER NOT NULL,
  updated_at INTEGER NOT NULL,
  PRIMARY KEY (user_id, item_key)
);
CREATE INDEX votes_item ON votes (item_key);

-- Counts per record, recomputed from votes by active members after every change, so they never drift.
CREATE TABLE vote_totals (
  item_key TEXT PRIMARY KEY,
  up INTEGER NOT NULL DEFAULT 0,
  down INTEGER NOT NULL DEFAULT 0,
  updated_at INTEGER NOT NULL
);
CREATE INDEX vote_totals_net ON vote_totals (up - down);

-- One row per record that has fallen below zero.
--   open       waiting for Adam
--   kept       Adam kept it; no new alert unless it climbs back to zero or above and falls again
--   remove     Adam wants it removed; applied to data/review/decisions.json with scripts/apply-vote-removals.mjs
--   applied    the removal is in decisions.json (marked by the editor after the next deploy)
--   recovered  the score went back to zero or above before anyone decided
CREATE TABLE vote_alerts (
  item_key TEXT PRIMARY KEY,
  title TEXT NOT NULL DEFAULT '',
  path TEXT NOT NULL DEFAULT '',
  status TEXT NOT NULL DEFAULT 'open' CHECK (status IN ('open', 'kept', 'remove', 'applied', 'recovered')),
  up INTEGER NOT NULL DEFAULT 0,
  down INTEGER NOT NULL DEFAULT 0,
  times INTEGER NOT NULL DEFAULT 1,          -- how many times it has fallen below zero
  opened_at INTEGER NOT NULL,
  emailed_at INTEGER,                        -- last alert email, if email is set up
  decided_by TEXT REFERENCES users(id) ON DELETE SET NULL,
  decided_at INTEGER,
  note TEXT NOT NULL DEFAULT ''
);
CREATE INDEX vote_alerts_status ON vote_alerts (status, opened_at);
