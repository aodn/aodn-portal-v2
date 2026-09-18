/**
 * `yarn lh:comment` — puts the Markdown report on the pull request, updating
 * the comment this workflow already owns instead of adding another one. The
 * hidden marker in the body is how the previous one is found.
 *
 * Uses the workflow's GITHUB_TOKEN. A pull request from a fork only gets a
 * read-only token, so a refused write is reported and ignored rather than
 * failing the job. Node-only.
 */

import fs from "fs";
import { COMMENT_MARKER } from "./constants";
import { argValue, isLighthouseCli, reportMarkdownPath, runCli } from "./cli";

const API = process.env.GITHUB_API_URL || "https://api.github.com";
const MAX_COMMENT_PAGES = 5;

interface Comment {
  id: number;
  body?: string;
}

const required = (name: string, value: string | undefined) => {
  if (!value) throw new Error(`${name} is required`);
  return value;
};

const pullRequestNumber = () => {
  const explicit = argValue("--pr") || process.env.LH_PR_NUMBER;
  if (explicit) return Number(explicit);

  const eventPath = process.env.GITHUB_EVENT_PATH;
  if (eventPath && fs.existsSync(eventPath)) {
    const event = JSON.parse(fs.readFileSync(eventPath, "utf8"));
    const number = event?.pull_request?.number;
    if (number) return Number(number);
  }
  throw new Error(
    "no pull request number: pass --pr or run this on a pull_request event"
  );
};

export const postComment = async () => {
  const token = required(
    "GITHUB_TOKEN",
    process.env.GITHUB_TOKEN || process.env.GH_TOKEN
  );
  const repo = required("GITHUB_REPOSITORY", process.env.GITHUB_REPOSITORY);
  const pr = pullRequestNumber();
  const body = fs.readFileSync(
    argValue("--file") || reportMarkdownPath(),
    "utf8"
  );

  const headers = {
    authorization: `Bearer ${token}`,
    accept: "application/vnd.github+json",
    "content-type": "application/json",
  };

  const existing = await findExistingComment({ repo, pr, headers });

  const response = existing
    ? await fetch(`${API}/repos/${repo}/issues/comments/${existing}`, {
        method: "PATCH",
        headers,
        body: JSON.stringify({ body }),
      })
    : await fetch(`${API}/repos/${repo}/issues/${pr}/comments`, {
        method: "POST",
        headers,
        body: JSON.stringify({ body }),
      });

  if (response.status === 403 || response.status === 404) {
    // Fork pull requests get a read-only token; the report is still in the job
    // summary and the run artifact.
    console.warn(
      `cannot write to PR #${pr} (${response.status}); skipping the comment. ` +
        "Expected for pull requests from forks."
    );
    return;
  }

  if (!response.ok) {
    throw new Error(
      `GitHub refused the comment: ${response.status} ${await response.text()}`
    );
  }

  console.log(
    existing
      ? `updated the Lighthouse comment on PR #${pr}`
      : `commented on PR #${pr}`
  );
};

const findExistingComment = async ({
  repo,
  pr,
  headers,
}: {
  repo: string;
  pr: number;
  headers: Record<string, string>;
}): Promise<number | undefined> => {
  for (let page = 1; page <= MAX_COMMENT_PAGES; page += 1) {
    const response = await fetch(
      `${API}/repos/${repo}/issues/${pr}/comments?per_page=100&page=${page}`,
      { headers }
    );
    if (!response.ok) {
      throw new Error(
        `could not list comments on PR #${pr}: ${response.status} ${await response.text()}`
      );
    }
    const comments = (await response.json()) as Comment[];
    const match = comments.find((comment) =>
      comment.body?.includes(COMMENT_MARKER)
    );
    if (match) return match.id;
    if (comments.length < 100) return undefined;
  }
  return undefined;
};

if (isLighthouseCli("postComment.ts")) runCli(postComment());
