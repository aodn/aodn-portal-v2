/**
 * Shapes shared by the Lighthouse CI scripts. Node-only — never import in app
 * code.
 */

/** Category scores (0-100) and web metrics collected for one route. */
export interface RouteMetrics {
  /** Individual Lighthouse audit scores (0–100), used by release reports. */
  metricScores?: Record<"lcp" | "tbt" | "cls" | "fcp", number>;
  performance: number;
  accessibility: number;
  bestPractices: number;
  seo: number;
  /** Largest Contentful Paint, ms */
  lcp: number;
  /** Cumulative Layout Shift, unitless */
  cls: number;
  /** Total Blocking Time, ms */
  tbt: number;
  /** First Contentful Paint, ms */
  fcp: number;
}

export type MetricKey = Exclude<keyof RouteMetrics, "metricScores">;

export type FormFactor = "mobile" | "desktop";

/**
 * A route's medians plus the route id. Keys of `routes` are paths (so the PR
 * comment can show them), and the id lets a comparison still line up when a
 * path changes — e.g. a different `/details/<uuid>`. `metrics` is keyed by
 * form factor because Lighthouse scores mobile and desktop very differently
 * (different throttling, different config) — a run can measure either or
 * both, so a factor missing from `metrics` just means it was not measured.
 */
export interface RouteReport {
  id: string;
  metrics: Partial<Record<FormFactor, RouteMetrics>>;
  /** Valid measured runs for deployed audits; excludes the warm-up. */
  measuredRuns?: Partial<Record<FormFactor, RouteMetrics[]>>;
}

/** Median measurements for local PR builds or deployed release sites. */
export interface LighthouseReport {
  commit: string;
  branch: string;
  generatedAt: string;
  /** Lighthouse runs per route/form factor; every value above is their median. */
  runs: number;
  /** Recorded API upstream, or the actual site origin for deployed audits. */
  apiHost: string;
  routes: Record<string, RouteReport>;
  /** Deployment context and execution errors are used only in release reports. */
  environment?: string;
  executionError?: string;
}

/** Minimal view of the Lighthouse result the scripts read. */
export interface Lhr {
  requestedUrl?: string;
  finalDisplayedUrl?: string;
  runtimeError?: { code: string; message: string };
  categories: Record<string, { score: number | null }>;
  audits: Record<
    string,
    {
      numericValue?: number;
      score?: number | null;
      details?: {
        items?: Array<Record<string, any>>;
      };
    }
  >;
}
