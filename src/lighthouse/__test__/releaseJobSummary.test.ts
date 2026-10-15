// @vitest-environment node
import { expect, test } from "vitest";
import {
  buildReleaseReport,
  RELEASE_METRIC_LIMITS,
} from "@/lighthouse/releaseReport";
import { buildReleaseJobSummary } from "@/lighthouse/releaseJobSummary";
import type { LighthouseReport } from "@/lighthouse/types";

const input = (): LighthouseReport => ({
  commit: "abc",
  branch: "v2",
  environment: "staging",
  generatedAt: "today",
  runs: 3,
  apiHost: "https://example.org",
  routes: {
    "/search": {
      id: "search",
      metrics: {
        mobile: {
          performance: 81,
          accessibility: 90,
          bestPractices: 90,
          seo: 90,
          ...RELEASE_METRIC_LIMITS.search.mobile,
        },
      },
    },
  },
});
const render = (report: LighthouseReport) => {
  const { results, markdown } = buildReleaseReport(report);
  return buildReleaseJobSummary(results, markdown);
};
test("passing audits, missing baseline and detailed values", () => {
  const report = input();
  const summary = render(report);
  expect(summary).toContain(
    "Audits completed: **1** · Passed: **1** · Failed: **0** · Failed checks: **0**"
  );
  expect(summary).toContain("🟢 All performance checks passed.");
  expect(summary).toContain("No previous release available.");
  expect(summary).not.toContain("| Previous |");
  expect(summary).toContain(
    `<details><summary>View all metric results</summary>\n\n${buildReleaseReport(report).markdown.trim()}`
  );
});
test.each([62, 81])(
  "score %s and multiple metric failures count independently",
  (score) => {
    const report = input();
    Object.assign(report.routes["/search"].metrics.mobile!, {
      performance: score,
      lcp: 6270,
      tbt: 800,
    });
    const summary = render(report);
    expect(summary).toContain(`${score} · 🔴 FAIL`);
    expect(summary).toContain(`Failed checks: **${score < 75 ? 3 : 2}**`);
    expect(summary).toContain("LCP | 6270 ms | <= 5500 ms | 🔴 +770 ms");
    expect(summary).toContain("TBT | 800 ms | <= 700 ms | 🔴 +100 ms");
    if (score < 75)
      expect(summary).toContain("Performance | 62 | >= 75 | 🔴 -13 points");
  }
);
test("Performance alone fails", () => {
  const report = input();
  report.routes["/search"].metrics.mobile!.performance = 74;
  expect(render(report)).toContain("Failed checks: **1**");
});
test.each([false, true])(
  "execution errors with completed measurements: %s",
  (completed) => {
    const report = input();
    report.executionError = "Chrome failed";
    if (!completed) report.routes = {};
    const summary = render(report);
    expect(summary).toContain("🔴 ERROR");
    expect(summary).toContain("🔴 INCOMPLETE");
    expect(summary).toContain("Chrome failed");
    expect(summary).not.toContain("🟢 All performance checks passed.");
  }
);
test.each([70, 90, 81])(
  "historical score %s uses signed informational differences",
  (score) => {
    const { results, markdown } = buildReleaseReport(input());
    const previous = {
      ...results,
      ref: "v1",
      commit: "old",
      pages: results.pages.map((p) => ({ ...p, performance: score })),
    };
    const summary = buildReleaseJobSummary(results, markdown, previous);
    expect(summary).toContain(
      `| ${score} | 81 | ${score < 81 ? "🟢 +11 points" : score > 81 ? "🔴 -9 points" : "0 points"} |`
    );
    expect(summary).not.toContain("No previous release available.");
  }
);

test.each([
  [407.00000000000045, 400, "407", "400", "+7"],
  [6115.0379999999996, 4200, "6115.038", "4200", "+1915.038"],
  [4622.014499999999, 4200, "4622.014", "4200", "+422.014"],
  [407.123456, 400.012345, "407.123", "400.012", "+7.111"],
])(
  "formats failed check values %s and limit %s",
  (value, threshold, actual, limit, difference) => {
    const { results, markdown } = buildReleaseReport(input());
    const check = results.pages[0].metricChecks.find(
      (c) => c.metric === "tbt"
    )!;
    Object.assign(check, { value, threshold, status: "FAIL" });
    const summary = buildReleaseJobSummary(results, markdown);
    expect(summary).toContain(
      `TBT | ${actual} ms | <= ${limit} ms | 🔴 ${difference} ms`
    );
    expect(check.value).toBe(value);
    expect(check.threshold).toBe(threshold);
  }
);

test.each([
  [74.123456, 70.00000000000001, "74.123", "70", "🟢 +4.123"],
  [74.123456, 81.12345599999999, "74.123", "81.123", "🔴 -7"],
])(
  "formats overview, failed Performance and previous-release scores %s / %s",
  (current, baseline, currentLabel, previousLabel, difference) => {
    const report = input();
    report.routes["/search"].metrics.mobile!.performance = current;
    const { results, markdown } = buildReleaseReport(report);
    const previous = {
      ...results,
      pages: results.pages.map((p) => ({ ...p, performance: baseline })),
    };
    const summary = buildReleaseJobSummary(results, markdown, previous);
    expect(summary).toContain(`| Search | ${currentLabel} · 🔴 FAIL |`);
    expect(summary).toContain(
      `Performance | ${currentLabel} | >= 75 | 🔴 -0.877 points`
    );
    expect(summary).toContain(
      `| ${previousLabel} | ${currentLabel} | ${difference} points |`
    );
  }
);

test("rounding to the threshold preserves full-precision failures", () => {
  const report = input();
  Object.assign(report.routes["/search"].metrics.mobile!, {
    tbt: 700.0000000000005,
    cls: 0.10000000000000002,
  });
  const { results, markdown } = buildReleaseReport(report);
  const original = structuredClone(results);
  const summary = buildReleaseJobSummary(results, markdown);
  expect(summary).toContain("81 · 🔴 FAIL");
  expect(summary).toContain("Failed checks: **2**");
  expect(summary).toContain("TBT | 700 ms | <= 700 ms | 🔴 +0 ms");
  expect(summary).toContain("CLS (unitless) | 0.1 | <= 0.1 | 🔴 +0");
  expect(results).toEqual(original);
  expect(results.performanceStatus).toBe("FAIL");
});
