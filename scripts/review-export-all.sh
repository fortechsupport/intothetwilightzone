#!/usr/bin/env bash
# Regenerate the review spreadsheet from this branch plus every open research pull request,
# so Adam can review records before their PRs merge. Works in a throwaway worktree; when two
# PRs edit the same record, the earlier PR's version is kept (only the key matters for review).
#
#   scripts/review-export-all.sh [OUT_DIR] [PR numbers...]
# Defaults: OUT_DIR=review, PRs = every open PR head on origin except the site and this one.
set -euo pipefail
ROOT=$(git rev-parse --show-toplevel)
OUT=$(realpath -m "${1:-$ROOT/review}"); shift || true
SKIP=${REVIEW_SKIP_PRS:-"1 7"}
git -C "$ROOT" fetch -q origin '+refs/pull/*/head:refs/remotes/origin/pr/*'
if [ $# -gt 0 ]; then PRS="$*"; else
  PRS=$(git -C "$ROOT" for-each-ref --format='%(refname:lstrip=4)' refs/remotes/origin/pr | sort -n)
  # Only PRs that are still unmerged into this branch.
  PRS=$(for n in $PRS; do git -C "$ROOT" merge-base --is-ancestor "origin/pr/$n" HEAD || echo "$n"; done)
fi
TMP=$(mktemp -d)
trap 'git -C "$ROOT" worktree remove --force "$TMP" >/dev/null 2>&1 || true' EXIT
git -C "$ROOT" worktree add -q --detach "$TMP" HEAD
cd "$TMP"
for n in $PRS; do
  case " $SKIP " in *" $n "*) continue;; esac
  if git merge -q --no-edit -X ours "origin/pr/$n" >/dev/null 2>&1; then echo "merged PR #$n"
  else git merge --abort 2>/dev/null || true; echo "PR #$n did not merge, skipped" >&2; fi
done
cp "$ROOT/data/review/decisions.json" data/review/decisions.json
python3 "$ROOT/scripts/review.py" --help >/dev/null  # fail early if missing
cp "$ROOT/scripts/review.py" scripts/review.py
python3 scripts/review.py export --out "$OUT"
