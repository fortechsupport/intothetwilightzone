#!/usr/bin/env python3
"""Four local test members with sessions for the fan votes end-to-end checks (docs/plans/fan-votes.md).

  cp wrangler.example.toml wrangler.toml && echo 'VOTE_ALERT_EMAIL = "editor@example.test"' >> wrangler.toml
  npm run build:preview && npx wrangler d1 migrations apply intothetwilightzone --local
  python3 scripts/e2e/votes-seed.py > /tmp/seed.sql && npx wrangler d1 execute intothetwilightzone --local --file /tmp/seed.sql
  npx wrangler pages dev dist --port 8788 &
  node scripts/e2e/votes-api.mjs              # on a fresh database
  node scripts/e2e/votes-ui.cjs <screenshot dir>   # on a fresh database (re-seed first)

Local only: the session tokens are fixed ("tok-<handle>").
"""
import hashlib, time

t = int(time.time() * 1000)
exp = t + 30 * 86400000
for uid, h, role in [("uadmin00000001", "adam", "admin"), ("umemberb000001", "bea", "member"), ("umemberc000001", "cal", "member"), ("umemberd000001", "dot", "member")]:
    print(f"INSERT INTO users (id, handle, display_name, role, created_at, updated_at) VALUES ('{uid}', '{h}', '{h.title()}', '{role}', {t}, {t});")
    tok = "tok-" + h
    print(f"INSERT INTO sessions (id_hash, user_id, created_at, seen_at, expires_at, label) VALUES ('{hashlib.sha256(tok.encode()).hexdigest()}', '{uid}', {t}, {t}, {exp}, 'test');")
