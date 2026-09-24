#!/usr/bin/env bash
#
# review.sh — prepare the prompt, run the review engine, check its output.
#
#   In:   the KIRO_* variables used by prepare-context.sh and kiro.sh
#         KIRO_REVIEW_ENGINE  optional engine override (defaults to kiro.sh)
#   Out:  $KIRO_REVIEW_WORK_DIR/review.md, and "status=ok|empty|failed" plus
#         "credits=<n>" appended to $GITHUB_OUTPUT (stdout when run locally)
#
set -uo pipefail

here="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
engine="${KIRO_REVIEW_ENGINE:-$here/kiro.sh}"
review="$KIRO_REVIEW_WORK_DIR/review.md"
engine_out="$KIRO_REVIEW_WORK_DIR/engine.out"

# Real credential shapes only: a review may legitimately name a prefix such as
# github_pat_ (for example when it reviews this very check).
credential='gh[pousr]_[A-Za-z0-9]{36}|github_pat_[A-Za-z0-9_]{80,}|AKIA[0-9A-Z]{16}|-----BEGIN [A-Z ]*PRIVATE KEY-----'

status=failed
if [[ ! -x "$engine" ]]; then
  echo "::error title=AI review::No executable review engine at '${engine}'."
elif ! prepared="$("$here/prepare-context.sh")"; then
  echo "::error title=AI review::Could not prepare the review context."
elif [[ "$prepared" == empty=true ]]; then
  status=empty
elif ! timeout 15m "$engine" | tee "$engine_out"; then
  echo "::error title=AI review::The review engine failed or timed out."
elif [[ -n "${KIRO_API_KEY:-}" ]] && grep -qF -- "$KIRO_API_KEY" "$review"; then
  echo "::error title=AI review::The review contained the engine API key and was withheld."
elif match="$(grep -oE -m1 "$credential" "$review")"; then
  # Log only the first 4 characters, never the match itself.
  echo "::error title=AI review::The review matched a credential pattern (${match:0:4}...) and was withheld."
else
  status=ok
fi

{
  grep '^credits=' "$engine_out" 2>/dev/null
  echo "status=$status"
} >>"${GITHUB_OUTPUT:-/dev/stdout}"
