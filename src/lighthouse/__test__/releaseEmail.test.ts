// @vitest-environment node
import { expect, test } from "vitest";
import {
  buildReleaseEmail,
  QA_EMAIL_RECIPIENTS,
} from "@/lighthouse/releaseEmail";
import { buildReleaseReport } from "@/lighthouse/releaseReport";

const input = {
  environment: "staging",
  ref: "v1.2.3",
  commit: "release-sha",
  runUrl: "https://github.com/aodn/aodn-portal-v2/actions/runs/123",
  artifactUrl:
    "https://github.com/aodn/aodn-portal-v2/actions/runs/123/artifacts/456",
  reportMarkdown: "# Report\nLCP <= 6500 ms\nMeasured runs: 4000, 5000, 6000",
};

const results = () =>
  buildReleaseReport({
    environment: "staging",
    branch: "v1.2.3",
    commit: "release-sha",
    apiHost: "https://example.org",
    generatedAt: "2026-10-07",
    runs: 3,
    routes: {},
  }).results;

test.each(["PASS", "FAIL"] as const)(
  "email reports %s independently of execution success",
  (performanceStatus) => {
    const email = buildReleaseEmail({
      ...input,
      results: { ...results(), performanceStatus },
    });
    expect(email.subject).toContain(`staging: ${performanceStatus} (v1.2.3)`);
    expect(email.text).toContain("Execution status: SUCCESS");
    expect(email.text).toContain(`Performance status: ${performanceStatus}`);
    expect(email.text).toContain(input.commit);
    expect(email.text).toContain(input.runUrl);
    expect(email.text).toContain(input.artifactUrl);
    expect(email.text).toContain(input.reportMarkdown);
    expect(email.recipients).toEqual(QA_EMAIL_RECIPIENTS);
    expect(email.recipients).toHaveLength(5);
  }
);

test("execution error takes precedence over an earlier performance failure", () => {
  const email = buildReleaseEmail({
    ...input,
    results: {
      ...results(),
      executionStatus: "ERROR",
      performanceStatus: "FAIL",
      executionError: "Chrome failed",
    },
  });
  expect(email.subject).toContain(": ERROR");
  expect(email.text).toContain("Execution status: ERROR");
  expect(email.text).toContain("Performance status: FAIL");
});

test("setup failures without reports still provide an error notification and log link", () => {
  const email = buildReleaseEmail({
    ...input,
    artifactUrl: undefined,
    reportMarkdown: undefined,
  });
  expect(email.subject).toContain(": ERROR");
  expect(email.text).toContain("Performance status: INCOMPLETE");
  expect(email.text).toContain("No measurement report was produced");
  expect(email.text).toContain(input.runUrl);
});

test("report content is escaped in HTML email", () => {
  const email = buildReleaseEmail({
    ...input,
    reportMarkdown: '<script>alert("x")</script>&',
  });
  expect(email.html).not.toContain("<script>");
  expect(email.html).toContain("&lt;script&gt;");
  expect(email.html).toContain("&amp;");
});
