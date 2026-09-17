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
  ALL_FORM_FACTORS,
  COMMENT_MARKER,
  blockingPerformanceDrop,
  formFactorLabels,
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
  FormFactor,
  LighthouseReport,
  MetricKey,
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
  formFactor: FormFactor,
  baseline: number,
  current: number,
  baselineLabel: string
) => {
  const amount = regression(metric, baseline, current);
  const direction = higherIsBetter(metric) ? "decreased" : "increased";
  const unit = isScoreMetric(metric)
    ? `${Math.round(amount)} point${Math.round(amount) === 1 ? "" : "s"}`
    : formatDelta(metric, amount).replace(/^\+/, "");
  return (
    `⚠️ ${metricLabels[metric]} (${formFactorLabels[formFactor]}) on \`${routePath}\` ` +
    `${direction} by ${unit} compared with \`${baselineLabel}\`.`
  );
};

const findBaselineRoute = (
  baseline: LighthouseReport | undefined,
  routePath: string,
  route: RouteReport
): RouteReport | undefined => {
  if (!baseline) return undefined;
  const exact = baseline.routes[routePath];
  if (exact) return exact;
  // The path can change without the route changing — a different
  // /details/<uuid>, for instance.
  return Object.values(baseline.routes).find((entry) => entry.id === route.id);
};

/** A metric's baseline and PR cells for one form factor, plus any regression it hit. */
const cellPair = (
  metric: MetricKey,
  routePath: string,
  formFactor: FormFactor,
  before: number | undefined,
  value: number | undefined,
  baselineLabel: string,
  blockingDrop: number
): {
  mainText: string;
  prText: string;
  warning?: string;
  blocking?: string;
} => {
  const mainText = before === undefined ? "n/a" : formatValue(metric, before);

  if (value === undefined) {
    return { mainText, prText: "—" };
  }
  if (before === undefined) {
    return { mainText, prText: formatValue(metric, value) };
  }

  const drop = regression(metric, before, value);
  const blocks =
    metric === "performance" && blockingDrop > 0 && drop >= blockingDrop - 1e-9;
  const warns = isWarning(metric, before, value);

  const delta = value - before;
  let prText = formatValue(metric, value);
  if (delta !== 0) {
    const marker = drop > 0 ? (blocks ? " ❌" : warns ? " ⚠️" : "") : " ✅";
    prText = `${formatValue(metric, value)} (${formatDelta(metric, delta)}${marker})`;
  }

  return {
    mainText,
    prText,
    blocking: blocks
      ? `❌ Performance (${formFactorLabels[formFactor]}) on \`${routePath}\` dropped by ` +
        `${Math.round(drop)} points compared with \`${baselineLabel}\` — this check fails at ${blockingDrop} or more.`
      : undefined,
    warning:
      !blocks && warns
        ? warningSentence(
            metric,
            routePath,
            formFactor,
            before,
            value,
            baselineLabel
          )
        : undefined,
  };
};

const routeTable = (
  routePath: string,
  current: RouteReport,
  baseline: RouteReport | undefined,
  baselineLabel: string,
  blockingDrop: number
) => {
  const lines = [
    `### \`${routePath}\``,
    "",
    `| Metric | ${baselineLabel} Mobile | ${baselineLabel} Desktop | PR Mobile | PR Desktop |`,
    "|---|---:|---:|---:|---:|",
  ];
  const warnings: string[] = [];
  const blocking: string[] = [];

  for (const metric of metricOrder) {
    const [mobile, desktop] = ALL_FORM_FACTORS.map((formFactor) =>
      cellPair(
        metric,
        routePath,
        formFactor,
        baseline?.metrics[formFactor]?.[metric],
        current.metrics[formFactor]?.[metric],
        baselineLabel,
        blockingDrop
      )
    );
    for (const result of [mobile, desktop]) {
      if (result.blocking) blocking.push(result.blocking);
      if (result.warning) warnings.push(result.warning);
    }
    lines.push(
      `| ${metricLabels[metric]} | ${mobile.mainText} | ${desktop.mainText} | ${mobile.prText} | ${desktop.prText} |`
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

  return {
    markdown: `${lines.join("\n").replace(/\n+$/, "")}\n`,
    warnings,
    blocking,
  };
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
