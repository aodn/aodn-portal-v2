#!/usr/bin/env bash
#
# publish.sh — write the result to the job summary and a sticky PR comment.
# Tool-agnostic.
#
#   In:  STATUS              ok | empty | skipped | failed
#        AI_REVIEW_WORK_DIR  holds review.md (for ok)
#        PR_NUMBER, HEAD_SHA, CREDITS (optional), GH_TOKEN
#
set -euo pipefail

marker="<!-- ai-code-review -->"
run_url="${GITHUB_SERVER_URL}/${GITHUB_REPOSITORY}/actions/runs/${GITHUB_RUN_ID}"
body="$AI_REVIEW_WORK_DIR/comment.md"

{
  echo "$marker"
  echo "## 🤖 AI code review"
  echo
  case "$STATUS" in
    ok) head -c 60000 "$AI_REVIEW_WORK_DIR/review.md" ;;
    empty) echo "Nothing to review: only excluded files (lockfiles, generated files, images) changed." ;;
    skipped)
      echo "Skipped: the AI review credential is not available to this run. Pull requests from forks and"
      echo "Dependabot do not receive Actions secrets; otherwise the \`KIRO_API_KEY\` secret is not configured."
      echo "A maintainer can run it manually from this repository's code review workflow (**Actions → Run workflow**)."
      ;;
    *) echo "The review could not be completed. See the [workflow run](${run_url})." ;;
  esac
  echo
  echo "---"
  echo "<sub>Advisory AI review; it does not replace human review or block merging." \
    "Commit \`${HEAD_SHA:0:7}\`${CREDITS:+ · ${CREDITS} credits} · [run](${run_url}).</sub>"
} >"$body"

cat "$body" >>"$GITHUB_STEP_SUMMARY"
[[ "$STATUS" == failed ]] && echo "::warning title=AI review did not complete::See the step logs."

# Update our previous comment if there is one, else create it. Best effort:
# fork PRs get a read-only token, and the summary already has the result.
api="repos/${GITHUB_REPOSITORY}/issues"
id="$(gh api --paginate "$api/$PR_NUMBER/comments" --jq ".[]
  | select(.user.login == \"github-actions[bot]\" and (.body | startswith(\"$marker\"))) | .id" | head -n 1)" || id=""
if [[ "$id" =~ ^[0-9]+$ ]]; then
  gh api -X PATCH "$api/comments/$id" -F body=@"$body" >/dev/null
else
  gh api -X POST "$api/$PR_NUMBER/comments" -F body=@"$body" >/dev/null
fi || echo "::warning title=Could not post the AI review comment::The review is in the job summary."
