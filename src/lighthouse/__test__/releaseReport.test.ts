// @vitest-environment node
import { expect, test } from "vitest";
import {
  buildReleaseReport,
  RELEASE_METRIC_MINIMUMS,
} from "@/lighthouse/releaseReport";
import type { LighthouseReport } from "@/lighthouse/types";

const report = (): LighthouseReport => ({
  commit: "sha",
  branch: "release",
  generatedAt: "2026-10-07",
  runs: 3,
  apiHost: "https://example.org",
  environment: "staging",
  routes: {
    "/": {
      id: "landing",
      metrics: {
        mobile: {
          performance: 75,
          accessibility: 90,
          bestPractices: 90,
          seo: 90,
          lcp: 2000,
          tbt: 100,
          cls: 0.01,
          fcp: 1000,
          metricScores: { ...RELEASE_METRIC_MINIMUMS.landing.mobile },
        },
      },
    },
  },
});

test("all limits are inclusive and appear in the summary and structured report", () => {
  const input = report();
  const metrics = input.routes["/"].metrics.mobile!;
  input.routes["/"].measuredRuns = { mobile: [metrics, metrics, metrics] };
  const output = buildReleaseReport(input);
  expect(output.results.performanceStatus).toBe("PASS");
  expect(output.failures).toEqual([]);
  for (const check of output.results.pages[0].metricChecks) {
    expect(check.status).toBe("PASS");
    expect(check.measuredScores).toEqual([
      check.score,
      check.score,
      check.score,
    ]);
    expect(output.markdown).toContain(check.metric.toUpperCase());
    expect(output.markdown).toContain(`≥ ${check.threshold}`);
  }
});

test.each(["lcp", "tbt", "cls", "fcp"] as const)(
  "%s below its minimum reports a non-blocking measurement failure",
  (metric) => {
    const input = report();
    input.routes["/"].metrics.mobile!.metricScores![metric] -= 1;
    const output = buildReleaseReport(input);
    expect(output.results.executionStatus).toBe("SUCCESS");
    expect(output.results.performanceStatus).toBe("FAIL");
    expect(output.results.pages[0].status).toBe("FAIL");
    expect(output.failures).toHaveLength(1);
    expect(output.failures[0]).toContain(metric.toUpperCase());
  }
);

test("execution errors remain distinct from metric failures", () => {
  const input = report();
  input.executionError = "Chrome failed";
  expect(buildReleaseReport(input).results).toMatchObject({
    executionStatus: "ERROR",
    performanceStatus: "INCOMPLETE",
    executionError: "Chrome failed",
  });
});
