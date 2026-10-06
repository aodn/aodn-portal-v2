// @vitest-environment node
import { expect, test } from "vitest";
import { medianMetrics } from "@/lighthouse/metrics";
import {
  buildReleaseReport,
  RELEASE_METRIC_LIMITS,
} from "@/lighthouse/releaseReport";
import type { FormFactor, LighthouseReport } from "@/lighthouse/types";

const METRICS = ["lcp", "tbt", "cls", "fcp"] as const;
const configurations = Object.entries(RELEASE_METRIC_LIMITS).flatMap(
  ([page, factors]) =>
    Object.keys(factors).map((factor) => ({
      page: page as keyof typeof RELEASE_METRIC_LIMITS,
      factor: factor as FormFactor,
    }))
);

const report = (
  page: keyof typeof RELEASE_METRIC_LIMITS = "landing",
  factor: FormFactor = "mobile"
): LighthouseReport => {
  const metrics = {
    performance: 75,
    accessibility: 90,
    bestPractices: 90,
    seo: 90,
    ...RELEASE_METRIC_LIMITS[page][factor],
  };
  return {
    commit: "sha",
    branch: "release",
    generatedAt: "2026-10-07",
    runs: 3,
    apiHost: "https://example.org",
    environment: "staging",
    routes: {
      "/": {
        id: page,
        metrics: { [factor]: metrics },
        measuredRuns: { [factor]: [metrics, metrics, metrics] },
      },
    },
  };
};

test.each(configurations)(
  "$page/$factor passes at all exact boundaries and reports values and units",
  ({ page, factor }) => {
    const output = buildReleaseReport(report(page, factor));
    expect(output.results.performanceStatus).toBe("PASS");
    expect(output.failures).toEqual([]);
    expect(output.results.metricLimits).toEqual(RELEASE_METRIC_LIMITS);
    for (const check of output.results.pages[0].metricChecks) {
      expect(check.status).toBe("PASS");
      expect(check.measuredValues).toEqual([
        check.value,
        check.value,
        check.value,
      ]);
      expect(check.comparison).toBe("<=");
      const label = `${check.metric.toUpperCase()} <= ${check.metric === "cls" ? check.threshold.toFixed(2) : `${check.threshold} ms`}`;
      expect(output.markdown).toContain(label);
      expect(check.unit).toBe(check.metric === "cls" ? "unitless" : "ms");
    }
    expect(output.markdown).not.toContain("Median score");
  }
);

test.each(
  configurations.flatMap((configuration) =>
    METRICS.map((metric) => ({ ...configuration, metric }))
  )
)(
  "$page/$factor fails when $metric is slightly above its limit",
  ({ page, factor, metric }) => {
    const input = report(page, factor);
    input.routes["/"].metrics[factor]![metric] +=
      metric === "cls" ? 0.0001 : 0.1;
    const output = buildReleaseReport(input);
    expect(output.results.executionStatus).toBe("SUCCESS");
    expect(output.results.performanceStatus).toBe("FAIL");
    expect(output.results.pages[0].status).toBe("FAIL");
    expect(output.failures).toHaveLength(1);
    expect(output.failures[0]).toContain(metric.toUpperCase());
  }
);

test.each(configurations)(
  "$page/$factor median protects against a single outlier and shows all measured values",
  ({ page, factor }) => {
    const input = report(page, factor);
    const boundary = input.routes["/"].metrics[factor]!;
    const good = { ...boundary, performance: 80 };
    const outlier = {
      ...boundary,
      performance: 10,
      lcp: boundary.lcp * 10,
      tbt: boundary.tbt * 10,
      cls: 1,
      fcp: boundary.fcp * 10,
    };
    const runs = [good, outlier, boundary];
    input.routes["/"].metrics[factor] = medianMetrics(runs, true);
    input.routes["/"].measuredRuns = { [factor]: runs };
    const output = buildReleaseReport(input);
    expect(output.results.performanceStatus).toBe("PASS");
    expect(output.results.pages[0].measuredScores).toEqual([80, 10, 75]);
    expect(output.markdown).toContain("80, 10, 75");
    for (const check of output.results.pages[0].metricChecks) {
      expect(check.value).toBe(boundary[check.metric]);
      expect(check.measuredValues).toEqual(
        runs.map((run) => run[check.metric])
      );
      expect(output.markdown).toContain(check.measuredValues.join(", "));
    }
  }
);

test.each([74, 75, 76])(
  "Performance %s is checked independently of passing metric guardrails",
  (score) => {
    const input = report();
    input.routes["/"].metrics.mobile!.performance = score;
    const output = buildReleaseReport(input);
    expect(
      output.results.pages[0].metricChecks.every(
        (check) => check.status === "PASS"
      )
    ).toBe(true);
    expect(output.results.performanceStatus).toBe(
      score >= 75 ? "PASS" : "FAIL"
    );
    expect(output.failures).toHaveLength(score >= 75 ? 0 : 1);
  }
);

test.each([false, true])(
  "execution errors remain separate, including an earlier threshold failure (%s)",
  (thresholdFailure) => {
    const input = report();
    input.executionError = "Chrome failed";
    if (thresholdFailure) input.routes["/"].metrics.mobile!.tbt += 1;
    expect(buildReleaseReport(input).results).toMatchObject({
      executionStatus: "ERROR",
      performanceStatus: thresholdFailure ? "FAIL" : "INCOMPLETE",
      executionError: "Chrome failed",
    });
  }
);

test("an error before any measurements reports INCOMPLETE, not PASS", () => {
  const input = report();
  input.routes = {};
  input.executionError = "Chrome failed";
  expect(buildReleaseReport(input).results).toMatchObject({
    executionStatus: "ERROR",
    performanceStatus: "INCOMPLETE",
    pages: [],
  });
});
