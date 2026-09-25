# AI code review

Advisory AI code review for pull requests. It uses the shared workflow in
[`aodn/common-workflow`](https://github.com/aodn/common-workflow/tree/main/ai-code-review).
The scripts, tests, security notes and the Kiro engine are all documented there.
This repository only holds its configuration.

## Files

| File                                     | Role                                                                                        |
| ---------------------------------------- | ------------------------------------------------------------------------------------------- |
| `.github/workflows/ai-code-review.yml`   | Caller: triggers, skip rules (forks, drafts, `skip-ai-review` label), engine and credential |
| `.github/ai-code-review/prompt.md`       | The portal's review direction: what to review and how to judge                              |
| `.github/ai-code-review/instructions.md` | Repository context and conventions                                                          |

Both files are read from the PR head, so a PR that edits them is reviewed
with its own version. The shared workflow adds the sandbox description,
untrusted-content rules and output format around them.

## Behaviour

- Runs on PRs to `main` when opened, pushed, reopened or marked ready. Drafts,
  PRs labelled `skip-ai-review` and **PRs from forks** are skipped. A new push
  cancels the in-flight review.
- **No credential** (Dependabot, or secret not set): a "skipped" comment.
  Maintainers can run it manually from _Actions → AI code review (Kiro) → Run
  workflow_ with the PR number (fork PRs are still skipped).
- Errors or timeouts: a comment links to the run. The check stays green.

## Configuration

- `KIRO_API_KEY` **secret**: a Kiro API key (needs Kiro Pro or higher).
- `KIRO_MODEL` **variable** (optional): model id. Unset uses the account default.

**Pilot credential:** the trial may use a personal key. Temporary owner:
_<name, date>_. Replace it with the team key once Kiro/AWS confirm the
arrangement, then revoke the personal key.
