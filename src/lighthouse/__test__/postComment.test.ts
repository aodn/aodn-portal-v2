// @vitest-environment node
import fs from "fs";
import os from "os";
import path from "path";
import { afterEach, beforeEach, describe, expect, test, vi } from "vitest";
import { COMMENT_MARKER } from "../constants";
import { postComment } from "../postComment";

const reportFile = path.join(
  fs.mkdtempSync(path.join(os.tmpdir(), "lh-comment-")),
  "report.md"
);

const jsonResponse = (body: unknown, status = 200) =>
  new Response(JSON.stringify(body), { status });

let fetchMock: ReturnType<typeof vi.fn>;
const originalArgv = process.argv;

beforeEach(() => {
  fs.writeFileSync(
    reportFile,
    `${COMMENT_MARKER}\n\n## 🔦 Lighthouse Report\n`
  );
  process.env.GITHUB_TOKEN = "test-token";
  process.env.GITHUB_REPOSITORY = "aodn/aodn-portal-v2";
  process.argv = ["node", "postComment.ts", "--pr", "42", "--file", reportFile];
  fetchMock = vi.fn();
  vi.stubGlobal("fetch", fetchMock);
});

afterEach(() => {
  process.argv = originalArgv;
  delete process.env.GITHUB_TOKEN;
  delete process.env.GITHUB_REPOSITORY;
  delete process.env.LH_PR_NUMBER;
  vi.unstubAllGlobals();
  vi.restoreAllMocks();
});

describe("postComment", () => {
  test("updates the comment it already owns instead of adding another", async () => {
    fetchMock
      .mockResolvedValueOnce(
        jsonResponse([
          { id: 1, body: "unrelated review comment" },
          { id: 2, body: `${COMMENT_MARKER}\n\nolder report` },
        ])
      )
      .mockResolvedValueOnce(jsonResponse({ id: 2 }));

    await postComment();

    const [url, options] = fetchMock.mock.calls[1];
    expect(url).toBe(
      "https://api.github.com/repos/aodn/aodn-portal-v2/issues/comments/2"
    );
    expect(options.method).toBe("PATCH");
    expect(JSON.parse(options.body).body).toContain("Lighthouse Report");
  });

  test("creates the comment the first time", async () => {
    fetchMock
      .mockResolvedValueOnce(jsonResponse([{ id: 1, body: "unrelated" }]))
      .mockResolvedValueOnce(jsonResponse({ id: 9 }, 201));

    await postComment();

    const [url, options] = fetchMock.mock.calls[1];
    expect(url).toBe(
      "https://api.github.com/repos/aodn/aodn-portal-v2/issues/42/comments"
    );
    expect(options.method).toBe("POST");
  });

  test("a read-only token from a fork is reported, not thrown", async () => {
    const warn = vi.spyOn(console, "warn").mockImplementation(() => {});
    fetchMock
      .mockResolvedValueOnce(jsonResponse([]))
      .mockResolvedValueOnce(
        jsonResponse({ message: "Resource not accessible" }, 403)
      );

    await expect(postComment()).resolves.toBeUndefined();
    expect(warn).toHaveBeenCalledWith(
      expect.stringContaining("skipping the comment")
    );
  });

  test("a broken API is a real failure", async () => {
    fetchMock.mockResolvedValueOnce(jsonResponse({ message: "boom" }, 500));
    await expect(postComment()).rejects.toThrow(/could not list comments/);
  });

  test("needs to know which pull request to comment on", async () => {
    process.argv = ["node", "postComment.ts", "--file", reportFile];
    delete process.env.GITHUB_EVENT_PATH;
    await expect(postComment()).rejects.toThrow(/pull request number/);
  });

  test("needs a token", async () => {
    delete process.env.GITHUB_TOKEN;
    delete process.env.GH_TOKEN;
    await expect(postComment()).rejects.toThrow(/GITHUB_TOKEN/);
  });
});
