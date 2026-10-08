// @vitest-environment node
import fs from "fs";
import os from "os";
import path from "path";
import { afterEach, beforeEach, expect, test, vi } from "vitest";
import { prepareReleaseEmail } from "@/lighthouse/prepareReleaseEmail";
import { buildReleaseReport } from "@/lighthouse/releaseReport";

let directory: string;
beforeEach(() => {
  directory = fs.mkdtempSync(path.join(os.tmpdir(), "lh-ses-payload-"));
});
afterEach(() => {
  fs.rmSync(directory, { recursive: true, force: true });
  vi.restoreAllMocks();
});

const input = () => ({
  directory,
  environment: "staging",
  ref: "v1.2.3",
  commit: "release-sha",
  runUrl: "https://github.com/aodn/aodn-portal-v2/actions/runs/123",
  artifactUrl:
    "https://github.com/aodn/aodn-portal-v2/actions/runs/123#artifacts",
  sender: "sender@example.org",
  recipientConfiguration: "test@example.org",
});

const report = (performance = 80) =>
  buildReleaseReport({
    environment: "staging",
    branch: "v1.2.3",
    commit: "release-sha",
    apiHost: "https://example.org",
    generatedAt: "2026-10-08",
    runs: 3,
    routes: {
      "/": {
        id: "landing",
        metrics: {
          mobile: {
            performance,
            accessibility: 90,
            bestPractices: 90,
            seo: 90,
            lcp: 4000,
            tbt: 100,
            cls: 0.02,
            fcp: 2000,
          },
        },
        measuredRuns: {
          mobile: [80, 70, 90].map((performance) => ({
            performance,
            accessibility: 90,
            bestPractices: 90,
            seo: 90,
            lcp: 4000,
            tbt: 100,
            cls: 0.02,
            fcp: 2000,
          })),
        },
      },
    },
  });

const save = (
  results: ReturnType<typeof report>["results"],
  markdown?: string
) => {
  fs.writeFileSync(
    path.join(directory, "release-results.json"),
    JSON.stringify(results)
  );
  if (markdown) fs.writeFileSync(path.join(directory, "report.md"), markdown);
};

test.each([80, 74])(
  "prepares a SES request for Performance %s using existing reports",
  (performance) => {
    const current = report(performance);
    save(current.results, current.markdown);
    const payload = prepareReleaseEmail(input());
    expect(payload.Message.Subject.Data).toContain(
      performance >= 75 ? ": PASS" : ": FAIL"
    );
    expect(payload.Message.Body.Text.Data).toContain(current.markdown);
    expect(payload.Message.Body.Text.Data).toContain(input().artifactUrl);
    expect(payload.Destination.ToAddresses).toEqual(["test@example.org"]);
    expect(payload.Source).toBe("sender@example.org");
  }
);

test("execution ERROR stays distinct from valid performance FAIL", () => {
  const current = report(74);
  save(
    {
      ...current.results,
      executionStatus: "ERROR",
      executionError: "Chrome failed",
    },
    current.markdown
  );
  const payload = prepareReleaseEmail(input());
  expect(payload.Message.Subject.Data).toContain(": ERROR");
  expect(payload.Message.Body.Text.Data).toContain("Performance status: FAIL");
  expect(payload.Message.Body.Text.Data).toContain(
    "Execution error: Chrome failed"
  );
});

test("missing artifacts still produce an ERROR request with a logs link", () => {
  const payload = prepareReleaseEmail({ ...input(), artifactUrl: undefined });
  expect(payload.Message.Subject.Data).toContain(": ERROR");
  expect(payload.Message.Body.Text.Data).toContain(
    "Performance status: INCOMPLETE"
  );
  expect(payload.Message.Body.Text.Data).toContain(
    "No measurement report was produced"
  );
  expect(payload.Message.Body.Text.Data).toContain(input().runUrl);
});

test("structured results preserve metrics and measured runs when Markdown is missing", () => {
  save(report().results);
  const payload = prepareReleaseEmail(input());
  const text = payload.Message.Body.Text.Data;
  expect(payload.Message.Subject.Data).toContain(": PASS");
  expect(text).toContain(
    "Performance: 80/100; minimum 75; measured runs: 80, 70, 90"
  );
  expect(text).toContain(
    "LCP: 4000 ms; maximum 6500 ms; PASS; measured runs: 4000, 4000, 4000"
  );
  expect(text).toContain("CLS: 0.02 unitless");
});

test.each([
  "not JSON",
  '{"executionStatus":"SUCCESS"}',
  '{"executionStatus":"SUCCESS","performanceStatus":"PASS","pages":[{}]}',
])("malformed results %s degrade to an ERROR notification", (content) => {
  const warn = vi.spyOn(console, "warn").mockImplementation(() => {});
  fs.writeFileSync(path.join(directory, "release-results.json"), content);
  const payload = prepareReleaseEmail(input());
  expect(payload.Message.Subject.Data).toContain(": ERROR");
  expect(warn).toHaveBeenCalled();
});

test("delivery configuration is mandatory even when artifacts are missing", () => {
  expect(() =>
    prepareReleaseEmail({ ...input(), recipientConfiguration: "" })
  ).toThrow(/LH_EMAIL_RECIPIENTS/);
  expect(() => prepareReleaseEmail({ ...input(), sender: "" })).toThrow(
    /valid plain email/
  );
});
