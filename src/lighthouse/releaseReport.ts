import { ALL_FORM_FACTORS, formFactorLabels } from "@/lighthouse/constants";
import type { LighthouseReport } from "@/lighthouse/types";

/** Absolute release gate; independent of the PR's baseline comparison. */
export const MINIMUM_RELEASE_PERFORMANCE = 70;

export const buildReleaseReport = (report: LighthouseReport) => {
  const lines = [
    "# Release Lighthouse",
    "",
    `Site: ${report.apiHost}`,
    `Performance minimum: ${MINIMUM_RELEASE_PERFORMANCE}/100. Each result is the median of ${report.runs} measured runs after one warm-up.`,
    "",
    "| Page | Emulation | Performance | Result |",
    "| --- | --- | --- | --- |",
  ];
  const failures: string[] = [];
  for (const [route, { metrics }] of Object.entries(report.routes)) {
    for (const formFactor of ALL_FORM_FACTORS) {
      const result = metrics[formFactor];
      if (!result) continue;
      const passed = result.performance >= MINIMUM_RELEASE_PERFORMANCE;
      lines.push(
        `| \`${route}\` | ${formFactorLabels[formFactor]} | ${result.performance} | ${passed ? "Pass" : "Fail"} |`
      );
      if (!passed) {
        failures.push(
          `${formFactorLabels[formFactor]} Performance on ${route} is ${result.performance}, below the minimum ${MINIMUM_RELEASE_PERFORMANCE}`
        );
      }
    }
  }
  return { markdown: `${lines.join("\n")}\n`, failures };
};
