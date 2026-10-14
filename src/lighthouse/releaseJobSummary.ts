import { formFactorLabels } from "@/lighthouse/constants";
import type { buildReleaseReport } from "@/lighthouse/releaseReport";

export const pageKey = (page: {
  id: string;
  url: string;
  formFactor: string;
}) => {
  const url = new URL(page.url);
  if (!["http:", "https:"].includes(url.protocol))
    throw new Error("Invalid page URL");
  url.searchParams.sort();
  // Origins may change within an environment; datasets, states and devices must match.
  return `${page.id}:${page.formFactor}:${url.pathname}${url.search}${url.hash}`;
};

type Results = ReturnType<typeof buildReleaseReport>["results"];
const statusLabel = (status: string) =>
  `${status === "PASS" || status === "SUCCESS" ? "🟢" : "🔴"} ${status}`;
const pageLabel = (id: string) => id.charAt(0).toUpperCase() + id.slice(1);
const signed = (value: number) => `${value > 0 ? "+" : ""}${value}`;

/** Presentation only: validation, medians and numeric precision belong to the report. */
export const buildReleaseJobSummary = (
  results: Results,
  detailedMarkdown: string,
  previous?: Pick<Results, "environment" | "ref" | "commit"> & {
    pages: Pick<
      Results["pages"][number],
      "id" | "url" | "formFactor" | "performance"
    >[];
  },
  previousRunUrl?: string
) => {
  const failedRows: string[] = [];
  for (const page of results.pages) {
    const prefix = `| ${pageLabel(page.id)} | ${formFactorLabels[page.formFactor]} |`;
    if (page.performance < page.threshold) {
      failedRows.push(
        `${prefix} Performance | ${page.performance} | >= ${page.threshold} | 🔴 ${signed(page.performance - page.threshold)} points |`
      );
    }
    for (const check of page.metricChecks.filter((c) => c.status === "FAIL")) {
      const unit = check.unit === "ms" ? " ms" : "";
      failedRows.push(
        `${prefix} ${check.metric.toUpperCase()}${unit ? "" : " (unitless)"} | ${check.value}${unit} | <= ${check.threshold}${unit} | 🔴 ${signed(check.value - check.threshold)}${unit} |`
      );
    }
  }
  const passed = results.pages.filter((page) => page.status === "PASS").length;
  const lines = [
    "# Release Lighthouse",
    "",
    `Environment: **${results.environment}** · Release/ref: \`${results.ref}\` · SHA: \`${results.commit}\``,
    "",
    `Execution status: **${statusLabel(results.executionStatus)}** · Performance status: **${statusLabel(results.performanceStatus)}**`,
    "",
    "**Performance failures do not block deployment or release.**",
    "",
    `Audits completed: **${results.pages.length}** · Passed: **${passed}** · Failed: **${results.pages.length - passed}** · Failed checks: **${failedRows.length}**`,
    ...(results.executionStatus === "ERROR"
      ? [
          "",
          "The audit did not complete. Only completed measurements are shown; unfinished audits have no final score.",
          "",
          "```text",
          results.executionError || "See the failed step logs.",
          "```",
        ]
      : []),
    "",
    "## Performance Overview",
    "",
    "PASS requires Performance >= 75 AND every configured metric threshold to pass. A score of 81 can still FAIL when LCP exceeds its limit.",
    "",
    "| Page | Mobile Performance / status | Desktop Performance / status |",
    "| --- | --- | --- |",
  ];
  for (const id of new Set(results.pages.map((page) => page.id))) {
    const cells = (["mobile", "desktop"] as const).map((factor) => {
      const page = results.pages.find(
        (p) => p.id === id && p.formFactor === factor
      );
      return page
        ? `${page.performance} · ${statusLabel(page.status)}`
        : "Unavailable";
    });
    lines.push(`| ${pageLabel(id)} | ${cells.join(" | ")} |`);
  }
  lines.push("", "## Failed Checks", "");
  if (failedRows.length) {
    lines.push(
      "| Page | Device | Metric | Actual | Limit | Difference |",
      "| --- | --- | --- | --- | --- | --- |",
      ...failedRows
    );
  } else {
    lines.push(
      results.executionStatus === "SUCCESS" && results.pages.length
        ? "🟢 All performance checks passed."
        : "No failed checks in completed measurements; performance validation is incomplete."
    );
  }
  lines.push(
    "",
    "## Previous release",
    "",
    "Score differences are informational and do not block deployment.",
    ""
  );
  if (previous?.environment === results.environment) {
    lines.push(
      `Previous: \`${previous.ref}\` · SHA: \`${previous.commit}\`${previousRunUrl ? ` · [Actions report](${previousRunUrl})` : ""}`,
      "",
      "| Page | Device | Previous | Current | Difference |",
      "| --- | --- | --- | --- | --- |"
    );
    for (const page of results.pages) {
      const baseline = previous.pages.find((p) => pageKey(p) === pageKey(page));
      const difference = baseline
        ? page.performance - baseline.performance
        : undefined;
      const label =
        difference === undefined
          ? "Unavailable"
          : difference > 0
            ? `🟢 ${signed(difference)} points`
            : difference < 0
              ? `🔴 ${signed(difference)} points`
              : "0 points";
      lines.push(
        `| ${pageLabel(page.id)} | ${formFactorLabels[page.formFactor]} | ${baseline?.performance ?? "Unavailable"} | ${page.performance} | ${label} |`
      );
    }
    lines.push(
      "",
      "Unavailable means no equivalent previous page/device measurement exists."
    );
  } else lines.push("No previous release available.");
  lines.push(
    "",
    "<details><summary>View all metric results</summary>",
    "",
    detailedMarkdown.trim(),
    "",
    "</details>",
    ""
  );
  return lines.join("\n");
};
