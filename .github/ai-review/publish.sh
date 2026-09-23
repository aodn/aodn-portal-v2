#!/usr/bin/env bash
#
# publish.sh — write the result to the job summary and a new PR comment,
# collapsing earlier review comments as outdated. Tool-agnostic.
#
#   In:  STATUS              ok | empty | skipped | failed
#        AI_REVIEW_WORK_DIR  holds review.md (for ok)
#        PR_NUMBER, HEAD_SHA, CREDITS (optional), GH_TOKEN
#
# shellcheck disable=SC2016 # $owner, $id etc. in queries are GraphQL variables
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

# Post a new comment for every run, so reviewers are notified and it sits next
# to the commit it reviewed, then collapse our earlier reviews as "Outdated".
# They stay one click away for comparing runs. Best effort throughout: fork
# PRs get a read-only token, and the job summary already has the result.

# Our earlier, still-visible reviews. Listed before posting, so the new comment
# is never collapsed; the marker keeps other bots' comments out.
previous="$(gh api graphql -f owner="${GITHUB_REPOSITORY%/*}" -f name="${GITHUB_REPOSITORY#*/}" -F pr="$PR_NUMBER" \
  -f query='query($owner: String!, $name: String!, $pr: Int!) {
    repository(owner: $owner, name: $name) { pullRequest(number: $pr) {
      comments(last: 100) { nodes { id isMinimized viewerDidAuthor body } } } } }' \
  --jq ".data.repository.pullRequest.comments.nodes[]
    | select(.viewerDidAuthor and (.isMinimized | not) and (.body | startswith(\"$marker\"))) | .id")" || previous=""

if ! gh api -X POST "repos/${GITHUB_REPOSITORY}/issues/$PR_NUMBER/comments" -F body=@"$body" >/dev/null; then
  echo "::warning title=Could not post the AI review comment::The review is in the job summary."
  exit 0
fi

for id in $previous; do
  gh api graphql -f id="$id" -f query='mutation($id: ID!) {
    minimizeComment(input: {subjectId: $id, classifier: OUTDATED}) { minimizedComment { isMinimized } } }' >/dev/null ||
    echo "::warning title=Could not collapse an earlier AI review comment::${id}"
done
