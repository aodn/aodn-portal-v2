// @vitest-environment node
import fs from "fs";
import os from "os";
import path from "path";
import { afterEach, beforeEach, expect, test } from "vitest";
import { writeWorkflowSummary } from "@/seo/prepareWorkflowSummary";
import { prepareWorkflowEmail } from "@/seo/prepareWorkflowEmail";
import {
  parseSeoEnvironmentReport,
  prepareWorkflowReport,
  SEO_ENVIRONMENTS,
  type SeoEnvironment,
  type SeoEnvironmentReport,
} from "@/seo/workflowReport";

let directory: string;
beforeEach(() => {
  directory = fs.mkdtempSync(path.join(os.tmpdir(), "seo-email-"));
});
afterEach(() => fs.rmSync(directory, { recursive: true, force: true }));

const input = () => ({
  directory,
  runId: "123",
  runAttempt: "2",
  runUrl: "https://github.com/aodn/aodn-portal-v2/actions/runs/123",
  executionDate: "2026-10-14T00:00:00Z",
  workflowResult: "success" as const,
  sender: "sender@example.org",
  recipientConfiguration: "qa@example.org;QA@example.org;other@example.org",
});
const report = (environment: SeoEnvironment): SeoEnvironmentReport => ({
  environment,
  runId: "123",
  runAttempt: "2",
  publishJob: "success",
  verifyJob: "success",
  generation: "success",
  localVerification: "success",
  publishing: "success",
  verification: "success",
  generated: { sitemapUrls: 12346, pages: 12345 },
  published: { sitemapUrls: 12346, pages: 12345 },
  verified: { sitemapUrls: 12346, pages: 3 },
  errors: [],
  logsUrl: `https://github.com/aodn/aodn-portal-v2/actions/runs/123#${environment}`,
});
const save = (value: SeoEnvironmentReport) =>
  fs.writeFileSync(
    path.join(directory, `${value.environment}.json`),
    JSON.stringify(value)
  );
const saveAll = () =>
  SEO_ENVIRONMENTS.forEach((environment) => save(report(environment)));

test("successful environments produce one consolidated SES request with real counts", () => {
  saveAll();
  const payload = prepareWorkflowEmail(input());
  expect(payload.Message.Subject.Data).toBe(
    "[AODN Portal] SEO Report: SUCCESS"
  );
  expect(payload.Source).toBe("sender@example.org");
  expect(payload.Destination.ToAddresses).toEqual([
    "qa@example.org",
    "other@example.org",
  ]);
  expect(payload.Message.Subject.Charset).toBe("UTF-8");
  expect(payload.Message.Body.Text.Charset).toBe("UTF-8");
  expect(payload.Message.Body.Html.Charset).toBe("UTF-8");
  const text = payload.Message.Body.Text.Data;
  for (const environment of SEO_ENVIRONMENTS) {
    expect(text).toContain(
      `| ${environment} | PASS | PASS | PASS | PASS | 12,346 / 12,345 | 12,346 / 12,345 | 12,346 / 3 |`
    );
    expect(text).toContain(report(environment).logsUrl);
  }
  expect(text).toContain(input().executionDate);
  expect(text).toContain(`${input().runUrl}#artifacts`);
  expect(text).toContain("Errors: None");
});

test("one failed live verification is a partial failure even after successful publication", () => {
  saveAll();
  save({
    ...report("staging"),
    verifyJob: "failure",
    verification: "failure",
    verified: { sitemapUrls: null, pages: null },
    errors: ["Smoke check failed: missing canonical"],
  });
  const payload = prepareWorkflowEmail({
    ...input(),
    workflowResult: "failure",
  });
  expect(payload.Message.Subject.Data).toContain("PARTIAL FAILURE");
  expect(payload.Message.Body.Text.Data).toContain(
    "| staging | PASS | PASS | PASS | FAIL | 12,346 / 12,345 | 12,346 / 12,345 | N/A / N/A |"
  );
  expect(payload.Message.Body.Text.Data).toContain(
    "staging: Smoke check failed: missing canonical"
  );
});

test("all early failures show N/A counts and skipped stages without hiding the job failures", () => {
  for (const environment of SEO_ENVIRONMENTS) {
    save({
      ...report(environment),
      publishJob: "failure",
      verifyJob: "skipped",
      generation: "skipped",
      localVerification: "skipped",
      publishing: "skipped",
      verification: "skipped",
      generated: { sitemapUrls: null, pages: null },
      published: { sitemapUrls: null, pages: null },
      verified: { sitemapUrls: null, pages: null },
      errors: ["Resolve deployed revision: failure"],
    });
  }
  const payload = prepareWorkflowEmail({
    ...input(),
    workflowResult: "failure",
  });
  expect(payload.Message.Subject.Data).toBe(
    "[AODN Portal] SEO Report: FAILURE"
  );
  expect(payload.Message.Body.Text.Data).toContain(
    "SKIPPED | SKIPPED | SKIPPED | SKIPPED | N/A / N/A"
  );
  expect(payload.Message.Body.Text.Data).not.toContain("0 / 0");
});

test.each([undefined, "not JSON", JSON.stringify({ environment: "edge" })])(
  "missing/incomplete artifacts %s cannot be successful",
  (content) => {
    if (content) fs.writeFileSync(path.join(directory, "edge.json"), content);
    const payload = prepareWorkflowEmail(input());
    expect(payload.Message.Subject.Data).toContain("FAILURE");
    expect(payload.Message.Body.Text.Data).toContain(
      "edge: missing or invalid report"
    );
    expect(payload.Message.Body.Text.Data).toContain(
      "| edge | N/A | N/A | N/A | N/A | N/A / N/A"
    );
    expect(payload.Message.Body.Text.Data).not.toContain(
      "Available environment reports:"
    );
    expect(payload.Message.Body.Text.Data).toContain(input().runUrl);
  }
);

test("a missing environment report yields partial failure when others succeeded", () => {
  save(report("edge"));
  save(report("production"));
  expect(prepareWorkflowEmail(input()).Message.Subject.Data).toContain(
    "PARTIAL FAILURE"
  );
});

test("failed matrix result cannot be hidden by successful artifacts", () => {
  saveAll();
  const payload = prepareWorkflowEmail({
    ...input(),
    workflowResult: "failure",
  });
  expect(payload.Message.Subject.Data).toContain("PARTIAL FAILURE");
  expect(payload.Message.Body.Text.Data).toContain(
    "SEO matrix result: failure"
  );
});

test("publication follow-up failure cannot mark the environment successful", () => {
  saveAll();
  save({
    ...report("edge"),
    publishJob: "failure",
    verifyJob: "skipped",
    verification: "skipped",
    errors: ["CloudFront invalidation: failure"],
  });
  expect(
    prepareWorkflowEmail({ ...input(), workflowResult: "failure" }).Message
      .Subject.Data
  ).toContain("PARTIAL FAILURE");
});

test("zero measured artifacts stays distinct from unavailable counts", () => {
  save({
    ...report("edge"),
    generated: { sitemapUrls: 0, pages: 0 },
    published: { sitemapUrls: 0, pages: null },
  });
  expect(prepareWorkflowEmail(input()).Message.Body.Text.Data).toContain(
    "| 0 / 0 | 0 / N/A |"
  );
});

test.each([-1, 1.5, "12345", undefined])(
  "invalid count %s is rejected",
  (pages) => {
    const value = {
      ...report("edge"),
      generated: { sitemapUrls: 12346, pages },
    };
    expect(() => parseSeoEnvironmentReport(value, "edge", "123", "2")).toThrow(
      /invalid/
    );
  }
);

test("reports from a previous attempt or another environment are rejected", () => {
  expect(() =>
    parseSeoEnvironmentReport(report("edge"), "edge", "123", "3")
  ).toThrow();
  expect(() =>
    parseSeoEnvironmentReport(report("edge"), "staging", "123", "2")
  ).toThrow();
});

test("HTML escapes error content and links", () => {
  save({ ...report("edge"), errors: ['<script>alert("x")</script>&'] });
  const html = prepareWorkflowEmail(input()).Message.Body.Html.Data;
  expect(html).not.toContain("<script>");
  expect(html).toContain("&#60;script&#62;");
  expect(html).toContain("&#38;");
});

test("missing delivery configuration fails locally and leaves SEO reports untouched", () => {
  saveAll();
  const before = fs.readFileSync(path.join(directory, "edge.json"), "utf8");
  expect(() =>
    prepareWorkflowEmail({ ...input(), recipientConfiguration: "" })
  ).toThrow(/LH_EMAIL_RECIPIENTS/);
  expect(() => prepareWorkflowEmail({ ...input(), sender: "invalid" })).toThrow(
    /valid plain email/
  );
  expect(fs.readFileSync(path.join(directory, "edge.json"), "utf8")).toBe(
    before
  );
});

test("malformed status values are rejected instead of breaking email formatting", () => {
  saveAll();
  fs.writeFileSync(
    path.join(directory, "edge.json"),
    JSON.stringify({ ...report("edge"), generation: ["success"] })
  );
  const payload = prepareWorkflowEmail(input());
  expect(payload.Message.Subject.Data).toContain("PARTIAL FAILURE");
  expect(payload.Message.Body.Text.Data).toContain(
    "edge: missing or invalid report"
  );
});

test("Actions summary survives invalid email configuration with independent SEO status", () => {
  saveAll();
  const summary = path.join(directory, "summary.md");
  writeWorkflowSummary(input(), summary);
  const before = fs.readFileSync(summary, "utf8");
  expect(before).toBe(`${prepareWorkflowReport(input()).markdown}\n`);
  expect(before).toContain("# SEO Workflow Report");
  expect(before).toContain("Overall Status: SUCCESS");
  expect(() =>
    prepareWorkflowEmail({ ...input(), sender: "", recipientConfiguration: "" })
  ).toThrow();
  expect(fs.readFileSync(summary, "utf8")).toBe(before);
});

test("summary and email share counts, statuses and sampled Google coverage", () => {
  saveAll();
  save({
    ...report("production"),
    searchConsole: "success",
    indexing: {
      sampledUrls: 50,
      coverage: {
        "Submitted and indexed": 40,
        "Crawled - currently not indexed": 10,
      },
    },
    jobLinks: [
      {
        name: "production / Publish SEO Artifacts",
        url: `${input().runUrl}/job/456`,
      },
    ],
  });
  const summary = path.join(directory, "summary.md");
  writeWorkflowSummary(input(), summary);
  const markdown = fs.readFileSync(summary, "utf8");
  expect(markdown.trimEnd()).toBe(
    prepareWorkflowEmail(input()).Message.Body.Text.Data
  );
  expect(markdown).toContain("Sampled URLs inspected: 50");
  expect(markdown).toContain("| Submitted and indexed | 40 |");
  expect(markdown).toContain("| Crawled - currently not indexed | 10 |");
  expect(markdown).toContain("does not mean Google indexed");
  expect(markdown).toContain(`${input().runUrl}/job/456`);
});

test("unknown internal statuses cannot produce a successful summary", () => {
  saveAll();
  save({
    ...report("staging"),
    generation: "unknown",
    publishing: "unknown",
    generated: { sitemapUrls: null, pages: null },
  });
  const summary = path.join(directory, "summary.md");
  writeWorkflowSummary(input(), summary);
  const markdown = fs.readFileSync(summary, "utf8");
  expect(markdown).toContain("Overall Status: PARTIAL FAILURE");
  expect(markdown).toContain(
    "| staging | UNKNOWN | PASS | UNKNOWN | PASS | N/A / N/A |"
  );
});
