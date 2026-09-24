#!/usr/bin/env bash
#
# prepare-context.sh — build the review prompt for a pull request. Tool-agnostic.
#
#   In:   KIRO_REVIEW_REPO_DIR       PR head checkout, with base history
#         KIRO_REVIEW_WORK_DIR       holds pr.json; receives prompt.md
#   Out:  $KIRO_REVIEW_WORK_DIR/prompt.md, and "empty=true|false" on stdout
#
set -euo pipefail

: "${KIRO_REVIEW_REPO_DIR:?}" "${KIRO_REVIEW_WORK_DIR:?}"

max_diff_bytes=150000
here="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
pr() { jq -r "$1 // empty" "$KIRO_REVIEW_WORK_DIR/pr.json"; }
repo_git() { git -C "$KIRO_REVIEW_REPO_DIR" -c core.quotepath=false "$@"; }

repository="$(pr .base.repo.full_name)"
base_sha="$(pr .base.sha)"
head_sha="$(pr .head.sha)"
# Diff from the merge base, like GitHub's "Files changed" tab.
merge_base="$(repo_git merge-base "$base_sha" "$head_sha")" || {
  echo "::error title=AI review::No merge base for ${base_sha:0:7}..${head_sha:0:7}; is the full history checked out?" >&2
  exit 1
}

excludes=(
  ':(exclude,glob)**/*.lock'
  ':(exclude,glob)**/package-lock.json'
  ':(exclude,glob)**/pnpm-lock.yaml'
  ':(exclude,glob)**/dist/**'
  ':(exclude,glob)**/*.min.js'
  ':(exclude,glob)**/*.map'
  ':(exclude,glob)**/*.snap'
  ':(exclude,glob)**/*.png'
  ':(exclude,glob)**/*.jpg'
  ':(exclude,glob)**/*.svg'
)

diff="$(repo_git diff --no-color -M "$merge_base" "$head_sha" -- . "${excludes[@]}")"
# Limit bytes in a subshell so the rest of the script keeps its locale.
diff="$(
  export LC_ALL=C
  if (( ${#diff} > max_diff_bytes )); then
    diff="${diff:0:max_diff_bytes}"
    # Discard the partial final line, including any split UTF-8 character.
    if [[ "$diff" == *$'\n'* ]]; then
      diff="${diff%$'\n'*}"
    else
      diff=""
    fi
    diff+=$'\n[... diff truncated: the review is partial; say so in the Summary ...]'
  fi
  printf '%s' "$diff"
)"

# Maintainer guidance comes from the BASE commit, so a PR cannot rewrite it.
instructions="$(repo_git show "${base_sha}:.github/ai-review/instructions.md" 2>/dev/null || true)"

# A random tag, so PR content cannot forge the end of the untrusted block.
tag="untrusted-pr-content-$(od -An -N8 -tx1 /dev/urandom | tr -d ' \n')"

prompt="$(cat "$here/prompt.md")"
prompt="${prompt//\{\{REPOSITORY\}\}/$repository}"
prompt="${prompt//\{\{REPO_DIR\}\}/$KIRO_REVIEW_REPO_DIR}"
prompt="${prompt//\{\{HEAD_SHA\}\}/$head_sha}"

cat >"$KIRO_REVIEW_WORK_DIR/prompt.md" <<EOF
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
