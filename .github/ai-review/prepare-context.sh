#!/usr/bin/env bash
#
# prepare-context.sh — build the review prompt for a pull request. Tool-agnostic.
#
#   In:   AI_REVIEW_REPO_DIR       PR head checkout, with base history
#         AI_REVIEW_PR_JSON        PR from the GitHub REST API (file)
#         AI_REVIEW_WORK_DIR       where to write prompt.md
#         AI_REVIEW_EXCLUDE_PATHS  optional newline-separated globs to leave out
#   Out:  $AI_REVIEW_WORK_DIR/prompt.md, and "empty=true|false" on stdout
#
set -euo pipefail

: "${AI_REVIEW_REPO_DIR:?}" "${AI_REVIEW_PR_JSON:?}" "${AI_REVIEW_WORK_DIR:?}"

max_diff_bytes=150000
here="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
pr() { jq -r "$1 // empty" "$AI_REVIEW_PR_JSON"; }
repo_git() { git -C "$AI_REVIEW_REPO_DIR" -c core.quotepath=false "$@"; }

repository="$(pr .base.repo.full_name)"
base_sha="$(pr .base.sha)"
head_sha="$(pr .head.sha)"
# Diff from the merge base, like GitHub's "Files changed" tab.
merge_base="$(repo_git merge-base "$base_sha" "$head_sha")" || {
  echo "::error title=AI review::No merge base for ${base_sha:0:7}..${head_sha:0:7}; is the full history checked out?" >&2
  exit 1
}

excludes=()
while read -r pattern; do
  [[ -n "$pattern" ]] && excludes+=(":(exclude,glob)${pattern}")
done <<<"${AI_REVIEW_EXCLUDE_PATHS:-}"

diff="$(repo_git diff --no-color -M "$merge_base" "$head_sha" -- . "${excludes[@]}")"
if (( ${#diff} > max_diff_bytes )); then
  diff="${diff:0:max_diff_bytes}"
  diff="${diff%$'\n'*}"$'\n[... diff truncated: the review is partial; say so in the Summary ...]'
fi

# Maintainer guidance comes from the BASE commit, so a PR cannot rewrite it.
instructions="$(repo_git show "${base_sha}:.github/ai-review/instructions.md" 2>/dev/null || true)"

# A random tag, so PR content cannot forge the end of the untrusted block.
tag="untrusted-pr-content-$(od -An -N8 -tx1 /dev/urandom | tr -d ' \n')"

prompt="$(cat "$here/prompt.md")"
prompt="${prompt//\{\{REPOSITORY\}\}/$repository}"
prompt="${prompt//\{\{REPO_DIR\}\}/$AI_REVIEW_REPO_DIR}"
prompt="${prompt//\{\{HEAD_SHA\}\}/$head_sha}"

cat >"$AI_REVIEW_WORK_DIR/prompt.md" <<EOF
$prompt

## Repository-specific guidance

${instructions:-None.}

## Pull request #$(pr .number)

<$tag>
<title>$(pr .title)</title>
<description>
$(pr .body | head -c 4000)
</description>
<changed-files>
$(repo_git diff --name-status -M "$merge_base" "$head_sha")
</changed-files>
<diff>
$diff
</diff>
</$tag>
EOF

echo "empty=$([[ -z "$diff" ]] && echo true || echo false)"
