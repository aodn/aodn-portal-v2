# AI code review (trial)

Advisory AI code review for pull requests, trialled on `aodn-portal-v2`
([aodn/backlog#9311](https://github.com/aodn/backlog/issues/9311)). An AI agent
reviews the diff, reading surrounding code in a read-only checkout, for bugs,
regressions, security issues and missing tests. Each push gets a new PR
comment, and earlier reviews are collapsed as "Outdated" (one click to expand,
for comparing runs). It complements human review and never blocks merging.

## Files

| File                           | Role                                                                                                                 |
| ------------------------------ | -------------------------------------------------------------------------------------------------------------------- |
| `workflows/ai-code-review.yml` | Kiro trial workflow: triggers, resolve PR → check out head → review → publish.                                       |
| `ai-review/resolve-pr.sh`      | Fetches PR metadata, checks it is open, and outputs the head SHA and credential availability.                        |
| `ai-review/prepare-context.sh` | Builds the prompt from `prompt.md`, `instructions.md` and the PR diff.                                               |
| `ai-review/review.sh`          | Runs the step: prepare context → engine → credential check.                                                          |
| `ai-review/test.sh`            | Tests for `prepare-context.sh` and `review.sh`, with throwaway repos and fake engines (no credits).                  |
| `ai-review/code-reviewer.json` | Versioned Kiro agent definition; `kiro.sh` appends runtime denied paths and installs it in the isolated `KIRO_HOME`. |
| `ai-review/kiro.sh`            | **Kiro engine**: install, sandbox, run, extract the review.                                                          |
| `ai-review/publish.sh`         | Job summary, a new PR comment, and collapsing earlier reviews.                                                       |
| `ai-review/prompt.md`          | What to review and the output format (shared).                                                                       |
| `ai-review/instructions.md`    | Guidance specific to this repository, read from the PR's base branch.                                                |

The workflow calls `resolve-pr.sh`, checks out the PR head, runs `review.sh`,
and calls `publish.sh`. Inside `review.sh`, `prepare-context.sh` builds the
prompt and `kiro.sh` executes it. All scripts use `KIRO_REVIEW_WORK_DIR` for
`pr.json`, `prompt.md`, and `review.md`; no separate file-path variables are needed.

## Behaviour

- Runs on PRs to `main` when opened, pushed, reopened or marked ready. Drafts
  and PRs labelled `skip-ai-review` are skipped. A new push cancels the
  in-flight review.
- **No credential** (fork PRs, Dependabot, or secret not set): skipped, with an
  explanatory comment or summary. Maintainers can run it manually from
  _Actions → AI code review (Kiro) → Run workflow_ with the PR number.
- Only lockfiles, generated files or images changed: "nothing to review".
- Diffs over 150 KB are truncated and the review says it is partial.
- Errors or timeouts (15 min): a comment links to the run. The check stays green.

## Configuration

- `KIRO_API_KEY` **secret**: a Kiro API key
  ([docs](https://kiro.dev/docs/getting-started/authentication/#api-key-authentication-cli)),
  which needs a Kiro Pro or higher subscription. A ~20 KB diff cost 1–3
  credits in testing; each comment shows its cost.
- `KIRO_MODEL` **variable** (optional): model id. Unset uses the account default.

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

The trial uses one self-contained workflow. To adopt it elsewhere, copy
`.github/workflows/ai-code-review.yml` and `.github/ai-review/`, update
`instructions.md` for that repository, and add the `KIRO_API_KEY` secret.
Adjust the `excludes` array in `prepare-context.sh` if needed. Extract a reusable
workflow when cross-repository or multi-tool reuse is needed.

## Upgrading kiro-cli

`kiro.sh` pins a kiro-cli release because the review depends on Kiro's flags
and event format. To upgrade, check the latest version in the manifest,
update `kiro_version`, and run the local tests below:

```bash
curl -fsSL https://prod.download.cli.kiro.dev/stable/latest/manifest.json |
  jq -r '.version'
```

The published review is whatever the model writes inside `<review>` tags. If
Kiro's final event disappears, `kiro.sh` falls back to the standard Agent
Client Protocol message chunks and prints a warning.

## Testing locally

The diff logic (merge-base diff, base-branch guidance, exclusions, truncation)
and the review outcomes (including the credential check) have tests that need
only git and jq, and use no credits:

```bash
.github/ai-review/test.sh
```

For a full review, with `kiro-cli` logged in (no API key needed), from a repo that has the PR's
base and head commits, and not under `/tmp`:

```bash
export KIRO_REVIEW_WORK_DIR=$(mktemp -d) KIRO_REVIEW_REPO_DIR=$PWD
gh api repos/aodn/aodn-portal-v2/pulls/<N> >"$KIRO_REVIEW_WORK_DIR/pr.json"
.github/ai-review/review.sh && cat "$KIRO_REVIEW_WORK_DIR/review.md"
```
