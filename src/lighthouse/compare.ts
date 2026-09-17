/**
 * `yarn lh:compare` — turns the current report and the `main` baseline into the
 * Markdown posted on the PR.
 *
 * Nothing here fails on a score: a regression is a warning line in the report.
 * Node-only.
 */

import fs from "fs";
import path from "path";
import {
  COMMENT_MARKER,
  blockingPerformanceDrop,
  isScoreMetric,
  metricLabels,
  metricOrder,
  warnThresholds,
} from "./constants";
import {
  argValue,
  baselineJsonPath,
  gateJsonPath,
  isLighthouseCli,
  reportJsonPath,
  reportMarkdownPath,
  runCli,
} from "./cli";
import type {
  LighthouseReport,
  MetricKey,
  RouteMetrics,
  RouteReport,
} from "./types";

/** Lower is better for the web metrics, higher is better for the categories. */
const higherIsBetter = (metric: MetricKey) => isScoreMetric(metric);

/** 0.032 stays 0.032, 0.100 becomes 0.1, 0.000 becomes 0. */
const shortDecimal = (value: number) => String(Number(value.toFixed(3)));

export const formatValue = (metric: MetricKey, value: number): string => {
  if (isScoreMetric(metric)) return String(Math.round(value));
  if (metric === "cls") return shortDecimal(value);
  if (metric === "tbt") return `${Math.round(value)}ms`;
  // LCP and FCP read better in seconds, like the Lighthouse UI.
  return `${(value / 1000).toFixed(1)}s`;
};

export const formatDelta = (metric: MetricKey, delta: number): string => {
  const sign = delta > 0 ? "+" : "-";
  const magnitude = Math.abs(delta);
  if (isScoreMetric(metric)) return `${sign}${Math.round(magnitude)}`;
  if (metric === "cls") return `${sign}${shortDecimal(magnitude)}`;
  if (metric === "tbt") return `${sign}${Math.round(magnitude)}ms`;
  return `${sign}${(magnitude / 1000).toFixed(1)}s`;
};

/** How much worse the PR is; negative means an improvement. */
const regression = (metric: MetricKey, baseline: number, current: number) =>
  higherIsBetter(metric) ? baseline - current : current - baseline;

const isWarning = (metric: MetricKey, baseline: number, current: number) => {
  const threshold = warnThresholds[metric];
  if (threshold === null) return false;
  // Floating point: CLS deltas like 0.030000000000000002 must still count.
  return regression(metric, baseline, current) >= threshold - 1e-9;
};

const warningSentence = (
  metric: MetricKey,
  routePath: string,
  baseline: number,
  current: number,
  baselineLabel: string
) => {
  const amount = regression(metric, baseline, current);
  const direction = higherIsBetter(metric) ? "decreased" : "increased";
  const unit = isScoreMetric(metric)
    ? `${Math.round(amount)} point${Math.round(amount) === 1 ? "" : "s"}`
    : formatDelta(metric, amount).replace(/^\+/, "");
  return `⚠️ ${metricLabels[metric]} on \`${routePath}\` ${direction} by ${unit} compared with \`${baselineLabel}\`.`;
};

const findBaselineRoute = (
  baseline: LighthouseReport | undefined,
  routePath: string,
  route: RouteReport
): RouteMetrics | undefined => {
  if (!baseline) return undefined;
  const exact = baseline.routes[routePath];
  if (exact) return exact;
  // The path can change without the route changing — a different
  // /details/<uuid>, for instance.
  return Object.values(baseline.routes).find((entry) => entry.id === route.id);
};

const routeTable = (
  routePath: string,
  current: RouteReport,
  baseline: RouteMetrics | undefined,
  baselineLabel: string,
  blockingDrop: number
) => {
  const lines = [
    `### \`${routePath}\``,
    "",
    `| Metric | ${baselineLabel} | PR | Change |`,
    "|---|---:|---:|---:|",
  ];
  const warnings: string[] = [];
  const blocking: string[] = [];

  for (const metric of metricOrder) {
    const value = current[metric];
    const before = baseline?.[metric];

    if (before === undefined) {
      lines.push(
        `| ${metricLabels[metric]} | n/a | ${formatValue(metric, value)} | — |`
      );
      continue;
    }

    const drop = regression(metric, before, value);
    const blocks =
      metric === "performance" &&
      blockingDrop > 0 &&
      drop >= blockingDrop - 1e-9;
    const warns = isWarning(metric, before, value);

    const delta = value - before;
    let change = "—";
    if (delta !== 0) {
      const marker = drop > 0 ? (blocks ? " ❌" : warns ? " ⚠️" : "") : " ✅";
      change = `${formatDelta(metric, delta)}${marker}`;
    }

    if (blocks) {
      blocking.push(
        `❌ Performance on \`${routePath}\` dropped by ${Math.round(drop)} points ` +
          `compared with \`${baselineLabel}\` — this check fails at ${blockingDrop} or more.`
      );
    } else if (warns) {
      warnings.push(
        warningSentence(metric, routePath, before, value, baselineLabel)
      );
    }

    lines.push(
      `| ${metricLabels[metric]} | ${formatValue(metric, before)} | ${formatValue(
        metric,
        value
      )} | ${change} |`
    );
  }

  return { lines, warnings, blocking };
};

export const buildMarkdown = ({
  current,
  baseline,
  blockingDrop = blockingPerformanceDrop(),
}: {
  current: LighthouseReport;
  baseline?: LighthouseReport;
  blockingDrop?: number;
}): { markdown: string; warnings: string[]; blocking: string[] } => {
  const baselineLabel = "main";
  const lines: string[] = [COMMENT_MARKER, "", "## 🔦 Lighthouse Report", ""];

  if (baseline) {
    lines.push(
      `Compared with \`${baselineLabel}\` (\`${baseline.commit.slice(0, 7)}\`)`,
      ""
    );
  } else {
    lines.push(
      `No \`${baselineLabel}\` baseline is available yet, so this run only records the PR values. ` +
        "The next successful run on `main` publishes one.",
      ""
    );
  }

  const warnings: string[] = [];
  const blocking: string[] = [];
  for (const [routePath, route] of Object.entries(current.routes)) {
    const table = routeTable(
      routePath,
      route,
      findBaselineRoute(baseline, routePath, route),
      baselineLabel,
      blockingDrop
    );
    lines.push(...table.lines, "");
    warnings.push(...table.warnings);
    blocking.push(...table.blocking);
  }

  if (blocking.length > 0) lines.push(...blocking, "");
  if (warnings.length > 0) {
    lines.push(...warnings, "");
  } else if (blocking.length === 0 && baseline) {
    lines.push(
      `✅ No metric moved beyond the noise thresholds compared with \`${baselineLabel}\`.`,
      ""
    );
  }

  if (baseline && baseline.formFactor !== current.formFactor) {
    lines.push(
      `⚠️ The baseline was measured as \`${baseline.formFactor}\` and this run as ` +
        `\`${current.formFactor}\`; the numbers are not comparable.`,
      ""
    );
  }

  lines.push(
    "<details><summary>How this was measured</summary>",
    "",
    `- Median of ${current.runs} Lighthouse run${current.runs === 1 ? "" : "s"} per route, \`${current.formFactor}\` emulation`,
    `- Production build served locally, with API responses recorded once from \`${current.apiHost}\` and replayed to every run`,
    `- PR commit \`${current.commit.slice(0, 7)}\`, generated ${current.generatedAt}`,
    "- Warning thresholds: performance 5 points, accessibility/best practices/SEO 3 points, LCP 500ms, TBT 100ms, CLS 0.03",
    "",
    "</details>",
    "",
    blockingDrop > 0
      ? `Everything here is informational except one thing: a performance drop of ${blockingDrop} points or more against \`${baselineLabel}\` fails the check.`
      : "This report is informational and does not block the PR based on Lighthouse scores."
  );

  return { markdown: `${lines.join("\n")}\n`, warnings, blocking };
};

const readReport = (file: string): LighthouseReport =>
  JSON.parse(fs.readFileSync(file, "utf8")) as LighthouseReport;

export const compare = async () => {
  const currentPath = argValue("--current") || reportJsonPath();
  const baselinePath = argValue("--baseline") || baselineJsonPath();
  const outputPath = argValue("--out") || reportMarkdownPath();
  const gatePath = argValue("--gate-out") || gateJsonPath();

  const current = readReport(currentPath);
  const baseline = fs.existsSync(baselinePath)
    ? readReport(baselinePath)
    : undefined;
  if (!baseline) {
    console.warn(`no baseline at ${baselinePath}; reporting PR values only`);
  }

  const { markdown, warnings, blocking } = buildMarkdown({ current, baseline });

  fs.mkdirSync(path.dirname(outputPath), { recursive: true });
  fs.writeFileSync(outputPath, markdown, "utf8");
  console.log(`wrote ${outputPath}`);
  for (const warning of warnings) console.log(warning);
  for (const failure of blocking) console.log(failure);

  // The gate runs as its own step, after the comment has been posted — a
  // blocking regression must still be reported on the PR before the job fails.
  fs.mkdirSync(path.dirname(gatePath), { recursive: true });
  fs.writeFileSync(
    gatePath,
    `${JSON.stringify({ blocking }, null, 2)}\n`,
    "utf8"
  );

  return markdown;
};

if (isLighthouseCli("compare.ts")) runCli(compare());
