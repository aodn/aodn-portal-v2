#!/usr/bin/env bash
# Resolve the PR into $KIRO_REVIEW_WORK_DIR/pr.json for the review scripts.
# In: GITHUB_REPOSITORY, PR_NUMBER, GH_TOKEN, HAS_KEY, KIRO_REVIEW_WORK_DIR.
# Out: head_sha and has_key in GITHUB_OUTPUT; fail if the PR is not open.
set -euo pipefail

mkdir -p "$KIRO_REVIEW_WORK_DIR"
pr_json="$KIRO_REVIEW_WORK_DIR/pr.json"
gh api "repos/$GITHUB_REPOSITORY/pulls/$PR_NUMBER" >"$pr_json"
if [[ "$(jq -r .state "$pr_json")" != open ]]; then
  echo "::error::PR #$PR_NUMBER is not open."
  exit 1
fi
{
  echo "head_sha=$(jq -r .head.sha "$pr_json")"
  echo "has_key=$HAS_KEY"
} >>"$GITHUB_OUTPUT"
