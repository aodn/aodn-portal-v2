import { ALL_FORM_FACTORS, formFactorLabels } from "@/lighthouse/constants";
import type { FormFactor, LighthouseReport } from "@/lighthouse/types";

/** Informational release minimum; independent of the PR's baseline gate. */
export const MINIMUM_RELEASE_PERFORMANCE = 75;

/** Initial audit score minima, rounded down to multiples of five from edge. */
export const RELEASE_METRIC_MINIMUMS = {
  landing: {
    mobile: { lcp: 55, tbt: 80, cls: 100, fcp: 55 },
    desktop: { lcp: 95, tbt: 75, cls: 95, fcp: 95 },
  },
  search: {
    mobile: { lcp: 60, tbt: 65, cls: 100, fcp: 55 },
    desktop: { lcp: 85, tbt: 100, cls: 100, fcp: 95 },
  },
  details: {
    mobile: { lcp: 50, tbt: 70, cls: 100, fcp: 50 },
    desktop: { lcp: 85, tbt: 100, cls: 100, fcp: 95 },
  },
} satisfies Record<
  string,
  Record<FormFactor, Record<"lcp" | "tbt" | "cls" | "fcp", number>>
>;

const RELEASE_METRICS = ["lcp", "tbt", "cls", "fcp"] as const;

export const buildReleaseReport = (report: LighthouseReport) => {
  const rows: string[] = [];
  const metricRows: string[] = [];
  const failures: string[] = [];
  const pages = [];
  for (const [route, { id, metrics, measuredRuns }] of Object.entries(
    report.routes
  )) {
    for (const formFactor of ALL_FORM_FACTORS) {
      const result = metrics[formFactor];
      if (!result) continue;
      const metricChecks = RELEASE_METRICS.map((metric) => {
        const value = result[metric];
        const minima =
          RELEASE_METRIC_MINIMUMS[id as keyof typeof RELEASE_METRIC_MINIMUMS];
        const threshold = minima?.[formFactor][metric];
        const score = result.metricScores?.[metric];
        if (
          threshold === undefined ||
          score === undefined ||
          !Number.isFinite(score)
        ) {
          throw new Error(
            `Missing release metric configuration or score for ${id}/${formFactor}/${metric}`
          );
        }
        const status = score >= threshold ? "PASS" : "FAIL";
        const runs =
          measuredRuns?.[formFactor]?.map(
            (run) => run.metricScores?.[metric]
          ) || [];
        metricRows.push(
          `| [${id}](${report.apiHost}${route}) | ${formFactorLabels[formFactor]} | ${metric.toUpperCase()}${metric === "cls" ? "" : " (ms)"} | ${runs.join(", ") || "Unavailable"} | ${value} | ${score} | ≥ ${threshold} | **${status}** |`
        );
        if (status === "FAIL") {
          failures.push(
            `${formFactorLabels[formFactor]} ${metric.toUpperCase()} on ${route} score is ${score}, below the minimum ${threshold}`
          );
        }
        return {
          metric,
          value,
          score,
          threshold,
          measuredScores: runs,
          measuredValues:
            measuredRuns?.[formFactor]?.map((run) => run[metric]) || [],
          status,
        };
      });
      const performancePassed =
        result.performance >= MINIMUM_RELEASE_PERFORMANCE;
      const passed =
        performancePassed &&
        metricChecks.every((check) => check.status === "PASS");
      const status = passed ? "PASS" : "FAIL";
      const measuredScores =
        measuredRuns?.[formFactor]?.map((run) => run.performance) || [];
      pages.push({
        id,
        url: `${report.apiHost}${route}`,
        formFactor,
        measuredScores,
        performance: result.performance,
        threshold: MINIMUM_RELEASE_PERFORMANCE,
        metricChecks,
        status,
      });
      rows.push(
        `| [${id}](${report.apiHost}${route}) | ${formFactorLabels[formFactor]} | ${measuredScores.join(", ") || "Unavailable"} | ${result.performance} | ${MINIMUM_RELEASE_PERFORMANCE} | **${status}** |`
      );
      if (!performancePassed) {
        failures.push(
          `${formFactorLabels[formFactor]} Performance on ${route} is ${result.performance}, below the minimum ${MINIMUM_RELEASE_PERFORMANCE}`
        );
      }
    }
  }
  const executionStatus = report.executionError ? "ERROR" : "SUCCESS";
  const performanceStatus = failures.length
    ? "FAIL"
    : report.executionError
      ? "INCOMPLETE"
      : "PASS";
  const lines = [
    "# Release Lighthouse",
    "",
    `Environment: **${report.environment || "unspecified"}**`,
    `Release/ref: \`${report.branch}\` · SHA: \`${report.commit}\``,
    `Site: ${report.apiHost}`,
    "",
    `Execution status: **${executionStatus}** · Performance status: **${performanceStatus}**`,
    "Valid measurements outside configured thresholds are non-blocking for deployment and release.",
    `Performance minimum: ${MINIMUM_RELEASE_PERFORMANCE}/100. Each result is the median of ${report.runs} measured runs after one warm-up.`,
    "",
    "| Tested page | Emulation | Measured scores | Median Performance | Threshold | PASS/FAIL |",
    "| --- | --- | --- | --- | --- | --- |",
    ...rows,
    "",
    "## Timing and layout metrics",
    "",
    "Each metric is validated independently using its median Lighthouse score (0–100). A page passes only if Performance and all four metric checks pass. These are initial lab score minima, not field Core Web Vitals targets; TBT is not INP.",
    "",
    "| Tested page | Emulation | Metric | Measured scores | Median value | Median score | Minimum score | PASS/FAIL |",
    "| --- | --- | --- | --- | --- | --- | --- | --- |",
    ...metricRows,
  ];
  if (report.executionError) {
    lines.push(
      "",
      "## Execution error",
      "",
      "The audit did not complete. Only completed measurements are listed; unfinished pages have no final score.",
      "",
      "```text",
      report.executionError,
      "```"
    );
  }
  return {
    markdown: `${lines.join("\n")}\n`,
    failures,
    results: {
      environment: report.environment || "unspecified",
      ref: report.branch,
      commit: report.commit,
      generatedAt: report.generatedAt,
      site: report.apiHost,
      threshold: MINIMUM_RELEASE_PERFORMANCE,
      metricMinimums: RELEASE_METRIC_MINIMUMS,
      executionStatus,
      performanceStatus,
      executionError: report.executionError,
      pages,
    },
  };
};
