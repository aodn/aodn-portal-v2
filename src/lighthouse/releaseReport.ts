import { ALL_FORM_FACTORS, formFactorLabels } from "@/lighthouse/constants";
import type { FormFactor, LighthouseReport } from "@/lighthouse/types";

/** Informational release minimum; independent of the PR's baseline gate. */
export const MINIMUM_RELEASE_PERFORMANCE = 75;

/** Initial regression guardrails: milliseconds except unitless CLS; not SLAs. */
export const RELEASE_METRIC_LIMITS = {
  landing: {
    mobile: { lcp: 6500, tbt: 400, cls: 0.1, fcp: 4200 },
    desktop: { lcp: 2000, tbt: 150, cls: 0.1, fcp: 1000 },
  },
  search: {
    mobile: { lcp: 5500, tbt: 700, cls: 0.1, fcp: 4200 },
    desktop: { lcp: 2500, tbt: 150, cls: 0.1, fcp: 1000 },
  },
  details: {
    mobile: { lcp: 6500, tbt: 700, cls: 0.1, fcp: 4200 },
    desktop: { lcp: 2500, tbt: 150, cls: 0.1, fcp: 1000 },
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
        const limits =
          RELEASE_METRIC_LIMITS[id as keyof typeof RELEASE_METRIC_LIMITS];
        const threshold = limits?.[formFactor][metric];
        if (threshold === undefined || !Number.isFinite(value)) {
          throw new Error(
            `Missing release metric configuration or valid value for ${id}/${formFactor}/${metric}`
          );
        }
        const unit = metric === "cls" ? "unitless" : "ms";
        const thresholdLabel = `${metric.toUpperCase()} <= ${metric === "cls" ? threshold.toFixed(2) : threshold}${unit === "ms" ? " ms" : ""}`;
        const status = value <= threshold ? "PASS" : "FAIL";
        const measuredValues =
          measuredRuns?.[formFactor]?.map((run) => run[metric]) || [];
        metricRows.push(
          `| [${id}](${report.apiHost}${route}) | ${formFactorLabels[formFactor]} | ${metric.toUpperCase()} (${unit}) | ${measuredValues.join(", ") || "Unavailable"} | ${value} | ${thresholdLabel} | **${status}** |`
        );
        if (status === "FAIL") {
          failures.push(
            `${formFactorLabels[formFactor]} ${metric.toUpperCase()} on ${route} is ${value}${unit === "ms" ? " ms" : ""}, above the limit ${thresholdLabel}`
          );
        }
        return {
          metric,
          value,
          threshold,
          unit,
          comparison: "<=",
          measuredValues,
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
    "Each metric is validated independently using its median actual value; lower is better. A page passes only if Performance >= 75 and all four metric values meet their limits. These are initial regression guardrails, not official Core Web Vitals targets or SLAs; TBT is not INP.",
    "",
    "| Tested page | Emulation | Metric | Measured values | Median value | Maximum value | PASS/FAIL |",
    "| --- | --- | --- | --- | --- | --- | --- |",
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
      metricLimits: RELEASE_METRIC_LIMITS,
      executionStatus,
      performanceStatus,
      executionError: report.executionError,
      pages,
    },
  };
};
