import { ALL_FORM_FACTORS, formFactorLabels } from "@/lighthouse/constants";
import type { LighthouseReport } from "@/lighthouse/types";

/** Informational release minimum; independent of the PR's baseline gate. */
export const MINIMUM_RELEASE_PERFORMANCE = 70;

export const buildReleaseReport = (report: LighthouseReport) => {
  const rows: string[] = [];
  const failures: string[] = [];
  const pages = [];
  for (const [route, { id, metrics, measuredRuns }] of Object.entries(
    report.routes
  )) {
    for (const formFactor of ALL_FORM_FACTORS) {
      const result = metrics[formFactor];
      if (!result) continue;
      const passed = result.performance >= MINIMUM_RELEASE_PERFORMANCE;
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
        status,
      });
      rows.push(
        `| [${id}](${report.apiHost}${route}) | ${formFactorLabels[formFactor]} | ${measuredScores.join(", ") || "Unavailable"} | ${result.performance} | ${MINIMUM_RELEASE_PERFORMANCE} | **${status}** |`
      );
      if (!passed) {
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
    "Valid measurements below the threshold are non-blocking for deployment and release.",
    `Performance minimum: ${MINIMUM_RELEASE_PERFORMANCE}/100. Each result is the median of ${report.runs} measured runs after one warm-up.`,
    "",
    "| Tested page | Emulation | Measured scores | Median Performance | Threshold | PASS/FAIL |",
    "| --- | --- | --- | --- | --- | --- |",
    ...rows,
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
      executionStatus,
      performanceStatus,
      executionError: report.executionError,
      pages,
    },
  };
};
