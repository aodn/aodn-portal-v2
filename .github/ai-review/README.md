# AI code review (trial)

Advisory AI code review for pull requests, trialled on `aodn-portal-v2`
([aodn/backlog#9311](https://github.com/aodn/backlog/issues/9311)). An AI agent
reviews the diff, reading surrounding code in a read-only checkout, for bugs,
regressions, security issues and missing tests. It posts one PR comment, which
is updated on every push. It complements human review and never blocks merging.

## Files

| File | Role |
| --- | --- |
| `workflows/ai-code-review.yml` | This repo's triggers. |
| `workflows/ai-code-review-reusable.yml` | The shared pipeline: resolve PR → check out head → review → publish. |
| `ai-review/prepare-context.sh` | Builds the prompt from `prompt.md`, `instructions.md` and the PR diff. |
| `ai-review/prepare-context.test.sh` | Tests for the diff logic, using throwaway git repos. |
| `ai-review/kiro.sh` | **The only Kiro-specific file**: install, sandbox, run, extract the review. |
| `ai-review/publish.sh` | Job summary and the sticky PR comment. |
| `ai-review/prompt.md` | What to review and the output format (shared). |
| `ai-review/instructions.md` | Guidance specific to this repository, read from the PR's base branch. |

## Behaviour

- Runs on PRs to `main` when opened, pushed, reopened or marked ready. Drafts
  and PRs labelled `skip-ai-review` are skipped. A new push cancels the
  in-flight review.
- **No credential** (fork PRs, Dependabot, or secret not set): skipped, with an
  explanatory comment or summary. Maintainers can run it manually from
  *Actions → AI code review → Run workflow* with the PR number.
- Only lockfiles, generated files or images changed: "nothing to review".
- Diffs over 150 KB are truncated and the review says it is partial.
- Errors or timeouts (15 min): a comment links to the run. The check stays green.

## Configuration

- `KIRO_API_KEY` **secret**: a Kiro API key
  ([docs](https://kiro.dev/docs/getting-started/authentication/#api-key-authentication-cli)),
  which needs a Kiro Pro or higher subscription. A ~20 KB diff cost 1–3
  credits in testing; each comment shows its cost.
- `AI_REVIEW_MODEL` **variable** (optional): model id. Unset uses the account default.

**Pilot credential:** the trial may use a personal key. Temporary owner:
_<name, date>_. Replace it with the team key once Kiro/AWS confirm the
arrangement, then revoke the personal key.

## Security

The risk is a PR, for example via prompt injection, getting the reviewer to
leak a credential into the public comment, or to run code with one.

- `pull_request` trigger: fork PRs never receive the secret.
- Scripts come from the workflow's own commit (`job.workflow_sha`) and
  guidance from the base branch, never from the PR.
- Kiro runs from an empty directory with a private `KIRO_HOME`, so a PR's own
  `.kiro/` agents, hooks and MCP servers never load.
- The agent can only use `read`, `glob` and `grep`, with `deniedPaths` covering
  `/proc`, `/etc`, home dotfiles, runner directories and `.git`. Kiro's
  `allowedPaths` and `--trust-tools` do not restrict reads (verified), so they
  are not relied on.
- Checkouts do not persist credentials. The API key is only in the review step,
  and the GitHub token is only in steps that run no agent.
- Output containing the key, or anything that looks like a credential, is
  withheld.

## Adopting in another repository

Copy `workflows/ai-code-review.yml`, change `uses:` to
`aodn/aodn-portal-v2/.github/workflows/ai-code-review-reusable.yml@<commit-sha>`,
optionally pass `exclude-paths`, add `.github/ai-review/instructions.md`, and
add the `KIRO_API_KEY` secret. After the trial, the reusable workflow and
scripts should move to [`aodn/common-workflow`](https://github.com/aodn/common-workflow).

**Swapping the AI tool:** replace `kiro.sh` with a script that honours the
contract in its header (read the prompt, write `review.md`), and point the
"Run review" step at it.

## Upgrading kiro-cli

`kiro.sh` pins a kiro-cli release and verifies its checksum, because the review
depends on Kiro's flags and event format. To upgrade, take the version and
the `-linux.tar.gz` checksums from the manifest, update `kiro_version` and
`kiro_sha256`, and run the local test below:

```bash
curl -fsSL https://prod.download.cli.kiro.dev/stable/latest/manifest.json |
  jq -r '.version, (.packages[] | select(.download|endswith("-linux.tar.gz")) | "\(.targetTriple) \(.sha256)")'
```

The published review is whatever the model writes inside `<review>` tags. If
Kiro's final event disappears, `kiro.sh` falls back to the standard Agent
Client Protocol message chunks and prints a warning.

## Testing locally

The diff logic (merge-base diff, base-branch guidance, exclusions, truncation)
has tests that need only git and jq:

```bash
.github/ai-review/prepare-context.test.sh
```

For a full review, with `kiro-cli` logged in (no API key needed), from a repo that has the PR's
base and head commits, and not under `/tmp`:

```bash
export AI_REVIEW_WORK_DIR=$(mktemp -d) AI_REVIEW_REPO_DIR=$PWD
export AI_REVIEW_PR_JSON=$AI_REVIEW_WORK_DIR/pr.json AI_REVIEW_PROMPT_FILE=$AI_REVIEW_WORK_DIR/prompt.md
gh api repos/aodn/aodn-portal-v2/pulls/<N> >"$AI_REVIEW_PR_JSON"
.github/ai-review/prepare-context.sh && .github/ai-review/kiro.sh && cat "$AI_REVIEW_WORK_DIR/review.md"
```
