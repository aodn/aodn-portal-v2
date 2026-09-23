#!/usr/bin/env bash
#
# kiro.sh — run the review with the Kiro headless CLI.
#
#   In:   KIRO_REVIEW_REPO_DIR     PR checkout the agent may read
#         KIRO_REVIEW_WORK_DIR     holds prompt.md; receives review.md and logs
#         KIRO_API_KEY      API key read directly by kiro-cli
#         KIRO_MODEL        optional model id
#   Out:  $KIRO_REVIEW_WORK_DIR/review.md, and "credits=<n>" on stdout
#   Exit: 0 on success
#
set -euo pipefail

: "${KIRO_REVIEW_REPO_DIR:?}" "${KIRO_REVIEW_WORK_DIR:?}"

# Pinned release: the review depends on its CLI flags and event format, so
# upgrades are deliberate. See "Upgrading kiro-cli" in README.md.
kiro_version="2.23.1"

# Real paths, so the deniedPaths globs below match what Kiro checks.
KIRO_REVIEW_WORK_DIR="$(realpath "$KIRO_REVIEW_WORK_DIR")"
repo="$(realpath "$KIRO_REVIEW_REPO_DIR")"
work="$KIRO_REVIEW_WORK_DIR/kiro"
mkdir -p "$work/cwd"

# 1. Install the pinned build.
arch="$(uname -m)"
curl -fsSL --retry 3 -o "$work/kiro.tar.gz" \
  "https://prod.download.cli.kiro.dev/stable/${kiro_version}/kirocli-${arch}-linux.tar.gz"
tar -xzf "$work/kiro.tar.gz" -C "$work" && rm "$work/kiro.tar.gz"
export PATH="$work/kirocli/bin:$PATH"

# 2. Isolate Kiro: a private KIRO_HOME holding only our agent, run from an empty
#    directory so the PR's own .kiro/ (agents, hooks, MCP servers) never loads.
export KIRO_HOME="$work/home"
kiro-cli settings telemetry.enabled false >/dev/null
kiro-cli settings app.disableAutoupdates true >/dev/null

# 3. A read-only agent. Kiro's allowedPaths does not restrict absolute paths,
#    so everything sensitive is denied explicitly: /proc (holds the API key),
#    system config, home dotfiles, runner internals, this work dir and .git.
denied=(
  "/proc/**" "/sys/**" "/dev/**" "/etc/**" "/root/**" "/run/**" "/var/**" "/tmp/**" "/mnt/**" "/opt/**"
  "$HOME/.*" "$HOME/.*/**" "$HOME/actions-runner/**" "$HOME/runners/**"
  "$KIRO_REVIEW_WORK_DIR/**" "$repo/.git" "$repo/.git/**"
  # Local .env files can hold real secrets on a workstation; list the repo
  # root explicitly as well, whether or not "**/" also matches it.
  "$repo/.env" "$repo/.env.*" "$repo/**/.env" "$repo/**/.env.*"
)
[[ -n "${RUNNER_TEMP:-}" ]] && denied+=("$RUNNER_TEMP/**")
[[ -n "${RUNNER_WORKSPACE:-}" ]] && denied+=("$(dirname "$RUNNER_WORKSPACE")/_*/**")

mkdir -p "$KIRO_HOME/agents"
# Load the versioned agent definition and append runner-specific denied paths.
printf '%s\n' "${denied[@]}" | jq -R . | jq -s \
  --slurpfile agent "$(dirname "${BASH_SOURCE[0]}")/ai-code-reviewer.json" '
  . as $denied | $agent[0]
  | .toolsSettings.read.deniedPaths += $denied
  | .toolsSettings.glob.deniedPaths += $denied
  | .toolsSettings.grep.deniedPaths += $denied
' >"$KIRO_HOME/agents/ai-code-reviewer.json"

# 4. Run headless, streaming JSON Lines events.
args=(chat --no-interactive --agent-engine v2 --output-format stream-json --agent ai-code-reviewer)
[[ -n "${KIRO_MODEL:-}" ]] && args+=(--model "$KIRO_MODEL")
echo "kiro-cli ${kiro_version}, model ${KIRO_MODEL:-default}" >&2
(cd "$work/cwd" && kiro-cli "${args[@]}") <"$KIRO_REVIEW_WORK_DIR/prompt.md" >"$work/events.jsonl" 2>"$work/stderr.log" ||
  { tail -n 20 "$work/stderr.log" >&2; exit 1; }

# 5. Extract the review: the text between our <review> tags, taken from the
#    final event, or from the standard ACP message chunks if that is missing.
events="$work/events.jsonl"
if jq -se 'any(.[]; .type == "runError")' "$events" >/dev/null; then
  jq -r 'select(.type == "runError") | .data.message' "$events" >&2
  exit 1
fi
jq -se 'any(.[]; .type == "runFinished")' "$events" >/dev/null ||
  echo "::warning title=Kiro output format changed::No runFinished event; used ACP message chunks. Check kiro-cli ${kiro_version}."
jq -rs '
  ((map(select(.type == "runFinished")) | last | .data.finalText)
   // (map(select(.data.update.sessionUpdate? == "agent_message_chunk") | .data.update.content.text) | join("")))
  | ([scan("<review>\\s*([\\s\\S]*?)\\s*</review>")] | last | .[0]?) // .' \
  "$events" >"$KIRO_REVIEW_WORK_DIR/review.md"
grep -q '[^[:space:]]' "$KIRO_REVIEW_WORK_DIR/review.md" || { echo "Empty review" >&2; exit 1; }

echo "credits=$(jq -rs '[.[] | .data.meteringUsage? // empty] | last // [] | map(.value) | add // empty | . * 100 | round / 100' "$events")"
