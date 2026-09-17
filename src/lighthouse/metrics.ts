/**
 * Turning Lighthouse results into the numbers the report compares. Pure
 * functions — everything here is unit tested. Node-only.
 */

import { HEALTH_REQUEST, type LighthouseRoute } from "./constants";
import type { Lhr, MetricKey, RouteMetrics } from "./types";

/** Middle value; for an even count, the mean of the two middle ones. */
export const median = (values: number[]): number => {
  if (values.length === 0) throw new Error("median of no values");
  const sorted = [...values].sort((a, b) => a - b);
  const middle = Math.floor(sorted.length / 2);
  return sorted.length % 2 === 1
    ? sorted[middle]
    : (sorted[middle - 1] + sorted[middle]) / 2;
};

const round = (value: number, decimals = 0) => {
  const factor = 10 ** decimals;
  return Math.round(value * factor) / factor;
};

const score = (lhr: Lhr, category: string) => {
  const raw = lhr.categories?.[category]?.score;
  if (raw === null || raw === undefined) {
    throw new Error(`Lighthouse returned no ${category} score`);
  }
  return Math.round(raw * 100);
};

const numeric = (lhr: Lhr, audit: string) => {
  const value = lhr.audits?.[audit]?.numericValue;
  if (typeof value !== "number") {
    throw new Error(`Lighthouse returned no value for ${audit}`);
  }
  return value;
};

export const extractMetrics = (lhr: Lhr): RouteMetrics => ({
  performance: score(lhr, "performance"),
  accessibility: score(lhr, "accessibility"),
  bestPractices: score(lhr, "best-practices"),
  seo: score(lhr, "seo"),
  lcp: round(numeric(lhr, "largest-contentful-paint")),
  cls: round(numeric(lhr, "cumulative-layout-shift"), 3),
  tbt: round(numeric(lhr, "total-blocking-time")),
  fcp: round(numeric(lhr, "first-contentful-paint")),
});

const METRIC_DECIMALS: Record<MetricKey, number> = {
  performance: 0,
  accessibility: 0,
  bestPractices: 0,
  seo: 0,
  lcp: 0,
  cls: 3,
  tbt: 0,
  fcp: 0,
};

/**
 * Median per metric rather than "the median run": each number is then the
 * middle of what was actually observed for that metric, which is what the
 * comparison needs.
 */
export const medianMetrics = (runs: RouteMetrics[]): RouteMetrics => {
  if (runs.length === 0) throw new Error("no runs to take the median of");
  const keys = Object.keys(METRIC_DECIMALS) as MetricKey[];
  return Object.fromEntries(
    keys.map((key) => [
      key,
      round(median(runs.map((run) => run[key])), METRIC_DECIMALS[key]),
    ])
  ) as unknown as RouteMetrics;
};

const requestStatus = (lhr: Lhr, urlFragment: string) => {
  const items = lhr.audits?.["network-requests"]?.details?.items ?? [];
  const match = items.find((item) => String(item.url).includes(urlFragment));
  return match ? Number(match.statusCode) : undefined;
};

const domElements = (lhr: Lhr) => lhr.audits?.["dom-size"]?.numericValue;

/**
 * Everything that means "this run did not measure the page we asked for": a
 * Lighthouse runtime error, a redirect somewhere else, the degraded/fallback
 * shell instead of the page, or content missing because an API call failed.
 * The caller turns any of these into a failed job — they are execution
 * problems, not score regressions.
 */
export const checkRendered = (
  lhr: Lhr,
  route: LighthouseRoute,
  expectedOrigin?: string
): string[] => {
  const problems: string[] = [];

  if (lhr.runtimeError) {
    problems.push(
      `Lighthouse runtime error ${lhr.runtimeError.code}: ${lhr.runtimeError.message}`
    );
    // Nothing else in the result is meaningful after this.
    return problems;
  }

  const finalUrl = lhr.finalDisplayedUrl;
  if (finalUrl) {
    const { pathname, origin } = new URL(finalUrl);
    if (pathname !== route.path) {
      problems.push(`ended up on ${pathname}, expected ${route.path}`);
    }
    if (expectedOrigin && origin !== expectedOrigin) {
      problems.push(`ended up on ${origin}, expected ${expectedOrigin}`);
    }
  }

  const elements = domElements(lhr);
  if (typeof elements !== "number") {
    problems.push("no dom-size audit, cannot tell whether the page rendered");
  } else if (elements < route.minDomElements) {
    problems.push(
      `only ${elements} DOM elements (expected at least ${route.minDomElements}) — ` +
        "looks like the degraded page, the suspense fallback or an empty shell"
    );
  }

  for (const fragment of [HEALTH_REQUEST, ...route.requiredRequests]) {
    const status = requestStatus(lhr, fragment);
    if (status === undefined) {
      problems.push(`the page never requested ${fragment}`);
    } else if (status >= 400) {
      problems.push(`${fragment} answered ${status}`);
    }
  }

  return problems;
};

/** Node label of the LCP element, logged to make a moved LCP easy to explain. */
export const lcpElement = (lhr: Lhr) => {
  const items = lhr.audits?.["largest-contentful-paint-element"]?.details
    ?.items as Array<Record<string, any>> | undefined;
  const node = items?.[0]?.items?.[0]?.node;
  return typeof node?.nodeLabel === "string" ? node.nodeLabel : undefined;
};
