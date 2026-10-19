// @vitest-environment node
import { spawnSync } from "child_process";
import fs from "fs";
import os from "os";
import path from "path";
import { afterEach, beforeEach, expect, test } from "vitest";
import { buildReleaseEmail } from "@/lighthouse/releaseEmail";
import {
  buildReleaseReport,
  RELEASE_METRIC_LIMITS,
} from "@/lighthouse/releaseReport";

const workflow = fs.readFileSync(
  path.resolve(__dirname, "../../../.github/workflows/lighthouse_release.yml"),
  "utf8"
);
// Execute the actual workflow's Bash, including its inline Node execution check.
const executionStep = workflow.split(
  "      - name: Check release audit execution\n"
)[1];
const command = executionStep
  .split("        run: |\n")[1]
  .split("\n\n  notify:")[0]
  .split("\n")
  .map((line) => line.slice(10))
  .join("\n");
let directory: string;
beforeEach(() => {
  directory = fs.mkdtempSync(path.join(os.tmpdir(), "lh-release-workflow-"));
  fs.mkdirSync(path.join(directory, ".lighthouse"));
});
afterEach(() => {
  fs.rmSync(directory, { recursive: true, force: true });
});
const execute = () =>
  spawnSync("bash", ["-eo", "pipefail", "-c", command], {
    cwd: directory,
    encoding: "utf8",
  });
const writeResults = (results: unknown) =>
  fs.writeFileSync(
    path.join(directory, ".lighthouse/release-results.json"),
    JSON.stringify(results)
  );

test.each(["PASS", "FAIL"])(
  "successful execution with performance %s keeps the job green and email status accurate",
  (performanceStatus) => {
    const { results } = buildReleaseReport({
      commit: "abc",
      branch: "v2",
      environment: "staging",
      generatedAt: "today",
      runs: 3,
      apiHost: "https://example.org",
      routes: {
        "/": {
          id: "landing",
          metrics: {
            mobile: {
              performance: performanceStatus === "PASS" ? 90 : 74,
              accessibility: 90,
              bestPractices: 90,
              seo: 90,
              ...RELEASE_METRIC_LIMITS.landing.mobile,
            },
          },
        },
      },
    });
    expect(results.performanceStatus).toBe(performanceStatus);
    writeResults(results);
    const outcome = execute();
    expect(outcome.status).toBe(0);
    expect(outcome.stderr).not.toContain("::error");
    if (performanceStatus === "FAIL") {
      expect(outcome.stderr).toContain("::warning");
    }
    const email = buildReleaseEmail({
      environment: results.environment,
      ref: results.ref,
      commit: results.commit,
      runUrl: "https://example.org/actions/123",
      results,
    });
    expect(email.subject).toContain(`: ${performanceStatus} (v2)`);
    expect(email.text).toContain("Execution status: SUCCESS");
    expect(email.text).toContain(`Performance status: ${performanceStatus}`);
  }
);

test.each([
  { executionStatus: "ERROR", performanceStatus: "INCOMPLETE" },
  { executionStatus: "ERROR", performanceStatus: "FAIL" },
  { executionStatus: "SUCCESS", performanceStatus: "INCOMPLETE" },
  { executionStatus: "SUCCESS", performanceStatus: "invalid" },
  {},
])("execution check rejects incomplete or invalid results: %j", (results) => {
  writeResults(results);
  const outcome = execute();
  expect(outcome.status).toBe(1);
  expect(outcome.stderr).toContain("execution did not complete successfully");
});

test("missing or corrupt structured reports fail the execution check", () => {
  expect(execute().status).toBe(1);
  fs.writeFileSync(
    path.join(directory, ".lighthouse/release-results.json"),
    "invalid JSON"
  );
  expect(execute().status).toBe(1);
});

test("measurement errors remain fatal while reports and notifications run afterwards", () => {
  const measurement = workflow
    .split("- name: Audit the deployed pages and report Performance results")[1]
    .split("- name: Compare with the previous release")[0];
  expect(measurement).toContain("run: yarn lh:measure");
  expect(measurement).not.toContain("continue-on-error");
  expect(executionStep.split("run: |")[0]).not.toContain("continue-on-error");
  expect(workflow).toContain("if: always() && !cancelled()");
  expect(workflow).toContain(
    "- name: Upload Lighthouse reports\n        if: always()"
  );
  expect(workflow).toContain("needs: lighthouse");
  expect(workflow).toContain("needs.lighthouse.result != 'skipped'");
  expect(workflow).not.toContain("needs.lighthouse.result == 'failure'");
});

test("setup failure summary keeps the heading and independent statuses readable", () => {
  const summaryPath = path.join(directory, "summary.md");
  const summaryCommand = workflow
    .split("      - name: Add the report to the job summary\n")[1]
    .split("        run: |\n")[1]
    .split("\n\n      - name: Upload Lighthouse reports")[0]
    .split("\n")
    .map((line) => line.slice(10))
    .join("\n");
  const outcome = spawnSync("bash", ["-eo", "pipefail", "-c", summaryCommand], {
    cwd: directory,
    encoding: "utf8",
    env: {
      ...process.env,
      GITHUB_STEP_SUMMARY: summaryPath,
      LH_ENVIRONMENT: "staging",
      GITHUB_REF_NAME: "v2",
      GITHUB_SHA: "abc",
    },
  });
  expect(outcome.status).toBe(0);
  const summary = fs.readFileSync(summaryPath, "utf8");
  expect(summary).toMatch(/^## Release Performance Audit \(Lighthouse\)\n/);
  expect(summary).toContain("**Execution status: 🔴 ERROR**");
  expect(summary).toContain("\n\n**Performance status: 🔴 INCOMPLETE**\n\n");
  expect(summary).toContain(
    "**Mobile: 🔴 INCOMPLETE | Desktop: 🔴 INCOMPLETE**"
  );
});
