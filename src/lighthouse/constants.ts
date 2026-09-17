/**
 * What the Lighthouse CI measures and what counts as a regression. Node-only —
 * never import in app code.
 */

import { pageDefault } from "@/components/common/constants";
import type { FormFactor, MetricKey } from "./types";

/**
 * The record `/details` is measured against. Chosen because it is the record
 * the Playwright detail-page suite uses most (see
 * playwright/mocks/mock_data/dataset_detail/), so it is already treated as a
 * stable fixture by the repo, and it exists in the live catalogue — the API
 * responses are recorded from a real environment, not invented here.
 *
 * Override with LH_DETAILS_UUID if the record is ever retired.
 */
export const DEFAULT_DETAILS_UUID = "0015db7e-e684-7548-e053-08114f8cd4ad";

export const detailsUuid = () =>
  process.env.LH_DETAILS_UUID || DEFAULT_DETAILS_UUID;

/**
 * Where the recorded API responses come from. Any environment whose
 * CloudFront proxies /api works — the same convention seo.yml uses.
 */
export const DEFAULT_API_HOST = "https://portal-edge.aodn.org.au";

export const apiHost = () =>
  (process.env.LH_API_HOST || DEFAULT_API_HOST).replace(/\/$/, "");

export interface LighthouseRoute {
  /** Stable across path changes; how a baseline route is matched. */
  id: string;
  path: string;
  /** Shown in logs and in the PR comment. */
  label: string;
  /**
   * A rendered page has at least this many DOM elements. Measured floors, about
   * half of what each page really renders (landing 384, search 670, details
   * 1097 elements), and well above the shells that mean the run measured the
   * wrong thing: DegradedPage is ~46 elements and a details page whose record
   * failed to load is ~158.
   */
  minDomElements: number;
  /**
   * Requests that must have answered 2xx, or the page rendered without its
   * content. Substring match against the request URL.
   */
  requiredRequests: string[];
}

/**
 * Every page is wrapped in HealthChecker, which renders DegradedPage unless
 * /manage/health reports UP — so this request has to succeed on all routes.
 */
export const HEALTH_REQUEST = "/api/v1/ogc/manage/health";

export const lighthouseRoutes = (
  uuid: string = detailsUuid()
): LighthouseRoute[] => [
  {
    id: "landing",
    path: pageDefault.landing,
    label: "Landing",
    minDomElements: 200,
    requiredRequests: [],
  },
  {
    id: "search",
    path: pageDefault.search,
    label: "Search",
    minDomElements: 300,
    requiredRequests: ["/api/v1/ogc/collections?"],
  },
  {
    id: "details",
    path: `${pageDefault.details}/${uuid}`,
    label: "Details",
    minDomElements: 400,
    requiredRequests: [`/api/v1/ogc/collections/${uuid}`],
  },
];

/**
 * How much a metric has to move before the report calls it a regression.
 * Anything smaller is Lighthouse variability, not a code change. Tune these
 * once the team has a few weeks of runs to look at.
 */
export const warnThresholds: Record<MetricKey, number | null> = {
  performance: 5,
  accessibility: 3,
  bestPractices: 3,
  seo: 3,
  lcp: 500,
  tbt: 100,
  cls: 0.03,
  // Collected and reported, but FCP moves with LCP — warning on both would
  // just duplicate the same regression.
  fcp: null,
};

/**
 * The one number that fails the check: a performance score this far below the
 * `main` baseline on any route. Far outside run-to-run variability (which is a
 * few points), so hitting it means the PR really did make a page slower.
 * Everything else in the report is informational.
 *
 * LH_FAIL_PERFORMANCE_DROP tunes it; 0 turns the gate off.
 */
export const DEFAULT_BLOCKING_PERFORMANCE_DROP = 15;

export const blockingPerformanceDrop = () => {
  const override = process.env.LH_FAIL_PERFORMANCE_DROP;
  if (override === undefined || override === "") {
    return DEFAULT_BLOCKING_PERFORMANCE_DROP;
  }
  const parsed = Number(override);
  if (!Number.isFinite(parsed) || parsed < 0) {
    throw new Error(
      `LH_FAIL_PERFORMANCE_DROP must be a non-negative number, got "${override}"`
    );
  }
  return parsed;
};

export const metricLabels: Record<MetricKey, string> = {
  performance: "Performance",
  accessibility: "Accessibility",
  bestPractices: "Best Practices",
  seo: "SEO",
  lcp: "LCP",
  cls: "CLS",
  tbt: "TBT",
  fcp: "FCP",
};

/** Order the metrics appear in the PR comment. */
export const metricOrder: MetricKey[] = [
  "performance",
  "accessibility",
  "bestPractices",
  "seo",
  "lcp",
  "cls",
  "tbt",
  "fcp",
];

/** Categories are 0-100 scores; the rest are timings/unitless. */
export const isScoreMetric = (metric: MetricKey) =>
  metric === "performance" ||
  metric === "accessibility" ||
  metric === "bestPractices" ||
  metric === "seo";

/** Runs per route. Odd number so the median is an observed run. */
export const DEFAULT_RUNS = 3;

export const DEFAULT_PORT = 4173;

/** Measured by default — every PR sees how it moved on both. */
export const ALL_FORM_FACTORS: FormFactor[] = ["mobile", "desktop"];

export const formFactorLabels: Record<FormFactor, string> = {
  mobile: "Mobile",
  desktop: "Desktop",
};

/** Marks the PR comment this workflow owns, so it updates instead of piling up. */
export const COMMENT_MARKER = "<!-- lighthouse-ci-report -->";
