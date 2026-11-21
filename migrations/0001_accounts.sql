-- Fan accounts for IntoTheTwilightZone.com (D1 / SQLite).
-- Apply with: npx wrangler d1 migrations apply intothetwilightzone --remote
-- Times are Unix milliseconds. Ids are random strings made by the server.

CREATE TABLE users (
  id TEXT PRIMARY KEY,
  handle TEXT NOT NULL UNIQUE COLLATE NOCASE,
  display_name TEXT NOT NULL,
  email TEXT UNIQUE COLLATE NOCASE,
  email_verified INTEGER NOT NULL DEFAULT 0,
  bio TEXT NOT NULL DEFAULT '',
  role TEXT NOT NULL DEFAULT 'member' CHECK (role IN ('member', 'moderator', 'admin')),
  status TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'suspended')),
  show_favorites INTEGER NOT NULL DEFAULT 0,
  created_at INTEGER NOT NULL,
  updated_at INTEGER NOT NULL
);

-- Passkeys (WebAuthn). Only the public key is stored.
CREATE TABLE passkeys (
  id TEXT PRIMARY KEY,               -- credential id, base64url
  user_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  public_key TEXT NOT NULL,          -- COSE public key, base64url
  counter INTEGER NOT NULL DEFAULT 0,
  transports TEXT NOT NULL DEFAULT '',
  device_type TEXT NOT NULL DEFAULT '',
  backed_up INTEGER NOT NULL DEFAULT 0,
  nickname TEXT NOT NULL DEFAULT '',
  created_at INTEGER NOT NULL,
  last_used_at INTEGER
);
CREATE INDEX passkeys_user ON passkeys(user_id);

-- Sign-in with another provider (Google). subject is the provider's stable user id.
CREATE TABLE identities (
  provider TEXT NOT NULL,
  subject TEXT NOT NULL,
  user_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  created_at INTEGER NOT NULL,
  PRIMARY KEY (provider, subject)
);
CREATE INDEX identities_user ON identities(user_id);

-- Sessions. Only a SHA-256 hash of the cookie value is stored.
CREATE TABLE sessions (
  id_hash TEXT PRIMARY KEY,
  user_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  created_at INTEGER NOT NULL,
  seen_at INTEGER NOT NULL,
  expires_at INTEGER NOT NULL,
  label TEXT NOT NULL DEFAULT ''     -- rough device description, e.g. "Safari on iPhone"
);
CREATE INDEX sessions_user ON sessions(user_id);

-- Short-lived single-use values: WebAuthn challenges, email link tokens (hashed), OAuth state, sign-up tickets.
CREATE TABLE challenges (
  id TEXT PRIMARY KEY,
  kind TEXT NOT NULL,
  data TEXT NOT NULL DEFAULT '{}',
  expires_at INTEGER NOT NULL
);
CREATE INDEX challenges_expiry ON challenges(expires_at);

-- Favorites, later, watched/read/heard, owned and wanted. item_key is "collection/id", e.g. "episodes/walking-distance".
CREATE TABLE list_items (
  user_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  list TEXT NOT NULL CHECK (list IN ('favorite', 'later', 'watched', 'owned', 'wanted')),
  item_key TEXT NOT NULL,
  added_on TEXT NOT NULL,            -- YYYY-MM-DD, matching the browser checklist
  PRIMARY KEY (user_id, list, item_key)
);
CREATE INDEX list_items_item ON list_items(item_key, list);

-- Suggestions for the site: new records, corrections, ideas.
CREATE TABLE suggestions (
  id TEXT PRIMARY KEY,
  user_id TEXT REFERENCES users(id) ON DELETE SET NULL,
  kind TEXT NOT NULL CHECK (kind IN ('new', 'correction', 'idea')),
  page_url TEXT NOT NULL DEFAULT '',
  title TEXT NOT NULL,
  body TEXT NOT NULL,
  sources TEXT NOT NULL DEFAULT '',
  credit INTEGER NOT NULL DEFAULT 1,
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'accepted', 'declined')),
  review_note TEXT NOT NULL DEFAULT '',
  reviewed_by TEXT,
  reviewed_at INTEGER,
  created_at INTEGER NOT NULL
);
CREATE INDEX suggestions_status ON suggestions(status, created_at);
CREATE INDEX suggestions_user ON suggestions(user_id);

-- Fan contributions: a file in R2, a written piece, or a link to something hosted elsewhere.
CREATE TABLE uploads (
  id TEXT PRIMARY KEY,
  user_id TEXT REFERENCES users(id) ON DELETE SET NULL,
  kind TEXT NOT NULL CHECK (kind IN ('file', 'text', 'link')),
  title TEXT NOT NULL,
  description TEXT NOT NULL DEFAULT '',
  item_key TEXT NOT NULL DEFAULT '',  -- the record it relates to, if any
  rights TEXT NOT NULL CHECK (rights IN ('own', 'public-domain', 'licensed', 'permission')),
  license TEXT NOT NULL DEFAULT '',
  body TEXT NOT NULL DEFAULT '',      -- written pieces
  link_url TEXT NOT NULL DEFAULT '',  -- links
  r2_key TEXT NOT NULL DEFAULT '',
  filename TEXT NOT NULL DEFAULT '',
  media_type TEXT NOT NULL DEFAULT '', -- checked from the file's first bytes, not from the browser
  size INTEGER NOT NULL DEFAULT 0,
  status TEXT NOT NULL DEFAULT 'draft' CHECK (status IN ('draft', 'pending', 'approved', 'rejected', 'removed')),
  review_note TEXT NOT NULL DEFAULT '',
  reviewed_by TEXT,
  reviewed_at INTEGER,
  created_at INTEGER NOT NULL
);
CREATE INDEX uploads_status ON uploads(status, created_at);
CREATE INDEX uploads_user ON uploads(user_id);
CREATE INDEX uploads_item ON uploads(item_key, status);

-- Forums.
CREATE TABLE forum_categories (
  id TEXT PRIMARY KEY,               -- slug
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  sort INTEGER NOT NULL
);
CREATE TABLE topics (
  id TEXT PRIMARY KEY,
  category_id TEXT NOT NULL REFERENCES forum_categories(id),
  user_id TEXT REFERENCES users(id) ON DELETE SET NULL,
  title TEXT NOT NULL,
  item_key TEXT NOT NULL DEFAULT '',  -- set when the topic discusses one record
  status TEXT NOT NULL DEFAULT 'visible' CHECK (status IN ('pending', 'visible', 'hidden')),
  locked INTEGER NOT NULL DEFAULT 0,
  pinned INTEGER NOT NULL DEFAULT 0,
  post_count INTEGER NOT NULL DEFAULT 0,
  created_at INTEGER NOT NULL,
  last_post_at INTEGER NOT NULL
);
CREATE INDEX topics_category ON topics(category_id, status, pinned, last_post_at);
CREATE INDEX topics_item ON topics(item_key);
CREATE TABLE posts (
  id TEXT PRIMARY KEY,
  topic_id TEXT NOT NULL REFERENCES topics(id) ON DELETE CASCADE,
  user_id TEXT REFERENCES users(id) ON DELETE SET NULL,
  body TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'visible' CHECK (status IN ('pending', 'visible', 'hidden', 'deleted')),
  created_at INTEGER NOT NULL,
  edited_at INTEGER
);
CREATE INDEX posts_topic ON posts(topic_id, created_at);
CREATE INDEX posts_user ON posts(user_id, status);
CREATE INDEX posts_status ON posts(status, created_at);

-- Reports from members about posts, topics, uploads or profiles.
CREATE TABLE reports (
  id TEXT PRIMARY KEY,
  reporter_id TEXT REFERENCES users(id) ON DELETE SET NULL,
  target_type TEXT NOT NULL CHECK (target_type IN ('post', 'topic', 'upload', 'user')),
  target_id TEXT NOT NULL,
  reason TEXT NOT NULL CHECK (reason IN ('spam', 'abuse', 'copyright', 'privacy', 'off-topic', 'other')),
  note TEXT NOT NULL DEFAULT '',
  status TEXT NOT NULL DEFAULT 'open' CHECK (status IN ('open', 'actioned', 'dismissed')),
  created_at INTEGER NOT NULL,
  resolved_by TEXT,
  resolved_at INTEGER
);
CREATE INDEX reports_status ON reports(status, created_at);

-- Copyright notices (DMCA-style). No account needed to send one.
CREATE TABLE takedowns (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  organization TEXT NOT NULL DEFAULT '',
  email TEXT NOT NULL,
  work TEXT NOT NULL,
  urls TEXT NOT NULL,
  statement_good_faith INTEGER NOT NULL,
  statement_accurate INTEGER NOT NULL,
  signature TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'open' CHECK (status IN ('open', 'actioned', 'dismissed')),
  note TEXT NOT NULL DEFAULT '',
  created_at INTEGER NOT NULL,
  resolved_at INTEGER
);

-- Fixed-window counters for rate limits. key is e.g. "post:<user id>" or "email-ip:<hashed ip>".
CREATE TABLE rate_limits (
  key TEXT NOT NULL,
  window_start INTEGER NOT NULL,
  count INTEGER NOT NULL,
  PRIMARY KEY (key, window_start)
);

-- What moderators did, for accountability.
CREATE TABLE audit_log (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  actor_id TEXT,
  action TEXT NOT NULL,
  target_type TEXT NOT NULL,
  target_id TEXT NOT NULL,
  note TEXT NOT NULL DEFAULT '',
  at INTEGER NOT NULL
);

INSERT INTO forum_categories (id, title, description, sort) VALUES
  ('general', 'General discussion', 'Anything about The Twilight Zone that doesn''t fit elsewhere.', 1),
  ('original-series', 'The original series (1959-1964)', 'Episodes, writers, actors and the making of Rod Serling''s original series.', 2),
  ('later-series', 'Later series and the movie', 'The 1983 film and the 1985, 2002 and 2019 revivals.', 3),
  ('serling-night-gallery', 'Rod Serling and Night Gallery', 'Serling''s life and other work, Night Gallery, Patterns, Requiem for a Heavyweight and more.', 4),
  ('radio-print-games', 'Radio, books, comics and games', 'The radio dramas, magazines, comics, novels, board and video games.', 5),
  ('collecting', 'Collecting', 'Merchandise, props, autographs, home video releases and where to find them.', 6),
  ('inspired-by', 'Inspired by the Zone', 'Films, songs, shows and stories that borrowed from or tipped their hat to the series.', 7),
  ('fan-creations', 'Fan creations', 'Share and talk about fan art, fan films, stories and recordings.', 8),
  ('places-events', 'Places and events', 'Filming locations, Binghamton, conventions, screenings and meetups.', 9),
  ('site-feedback', 'About this site', 'Ideas, bugs and requests for IntoTheTwilightZone.com.', 10);
