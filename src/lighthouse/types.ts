/**
 * Shapes shared by the Lighthouse CI scripts. Node-only — never import in app
 * code.
 */

/** Category scores (0-100) and web metrics collected for one route. */
export interface RouteMetrics {
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

export type MetricKey = keyof RouteMetrics;

/**
 * A route's medians plus the route id. Keys of `routes` are paths (so the PR
 * comment can show them), and the id lets a comparison still line up when a
 * path changes — e.g. a different `/details/<uuid>`.
 */
export interface RouteReport extends RouteMetrics {
  id: string;
}

/** What gets uploaded as the `lighthouse-baseline` artifact. */
export interface LighthouseReport {
  commit: string;
  branch: string;
  generatedAt: string;
  formFactor: FormFactor;
  /** Lighthouse runs per route; every value above is their median. */
  runs: number;
  /** Upstream the recorded API responses came from. */
  apiHost: string;
  routes: Record<string, RouteReport>;
}

export type FormFactor = "mobile" | "desktop";

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
