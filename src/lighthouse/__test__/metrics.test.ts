import { describe, expect, test } from "vitest";
import { HEALTH_REQUEST, lighthouseRoutes } from "../constants";
import {
  checkRendered,
  extractMetrics,
  lcpElement,
  median,
  medianMetrics,
} from "../metrics";
import type { Lhr, RouteMetrics } from "../types";

const [landing, , details] = lighthouseRoutes("uuid-1");

const lhrFixture = (overrides: Partial<Lhr> = {}): Lhr => ({
  finalDisplayedUrl: "http://127.0.0.1:4173/",
  categories: {
    performance: { score: 0.76 },
    accessibility: { score: 0.955 },
    "best-practices": { score: 0.96 },
    seo: { score: 0.91 },
  },
  audits: {
    "largest-contentful-paint": { numericValue: 2499.6 },
    "cumulative-layout-shift": { numericValue: 0.0234 },
    "total-blocking-time": { numericValue: 180.4 },
    "first-contentful-paint": { numericValue: 1200 },
    "dom-size": { numericValue: 384 },
    "network-requests": {
      details: {
        items: [{ url: `http://x${HEALTH_REQUEST}`, statusCode: 200 }],
      },
    },
  },
  ...overrides,
});

const metrics = (values: Partial<RouteMetrics>): RouteMetrics => ({
  performance: 0,
  accessibility: 0,
  bestPractices: 0,
  seo: 0,
  lcp: 0,
  cls: 0,
  tbt: 0,
  fcp: 0,
  ...values,
});

describe("median", () => {
  test("returns the middle value of an odd number of runs", () => {
    expect(median([3, 1, 2])).toBe(2);
  });

  test("averages the two middle values of an even number of runs", () => {
    expect(median([1, 2, 3, 10])).toBe(2.5);
  });

  test("refuses to invent a value when there are no runs", () => {
    expect(() => median([])).toThrow();
  });
});

describe("extractMetrics", () => {
  test("scores become 0-100 integers and timings are rounded", () => {
    expect(extractMetrics(lhrFixture())).toEqual({
      performance: 76,
      accessibility: 96,
      bestPractices: 96,
      seo: 91,
      lcp: 2500,
      cls: 0.023,
      tbt: 180,
      fcp: 1200,
    });
  });

  test("fails loudly when a category did not run", () => {
    const lhr = lhrFixture();
    lhr.categories.seo = { score: null };
    expect(() => extractMetrics(lhr)).toThrow(/seo score/);
  });

  test("fails loudly when an audit produced no value", () => {
    const lhr = lhrFixture();
    lhr.audits["total-blocking-time"] = {};
    expect(() => extractMetrics(lhr)).toThrow(/total-blocking-time/);
  });
});

describe("medianMetrics", () => {
  test("takes the median of each metric independently", () => {
    const runs = [
      metrics({ performance: 70, lcp: 3000, cls: 0.01 }),
      metrics({ performance: 60, lcp: 2000, cls: 0.05 }),
      metrics({ performance: 65, lcp: 4000, cls: 0.03 }),
    ];
    const result = medianMetrics(runs);
    expect(result.performance).toBe(65);
    expect(result.lcp).toBe(3000);
    expect(result.cls).toBe(0.03);
  });

  test("keeps CLS at three decimals", () => {
    const result = medianMetrics([
      metrics({ cls: 0.0123 }),
      metrics({ cls: 0.0126 }),
    ]);
    expect(result.cls).toBe(0.012);
  });
});

describe("checkRendered", () => {
  test("accepts a fully rendered page", () => {
    expect(
      checkRendered(lhrFixture(), landing, "http://127.0.0.1:4173")
    ).toEqual([]);
  });

  test("reports a Lighthouse runtime error and stops there", () => {
    const problems = checkRendered(
      lhrFixture({
        runtimeError: { code: "NO_FCP", message: "no paint" },
      }),
      landing
    );
    expect(problems).toHaveLength(1);
    expect(problems[0]).toContain("NO_FCP");
  });

  test("catches a redirect away from the route", () => {
    const problems = checkRendered(
      lhrFixture({ finalDisplayedUrl: "http://127.0.0.1:4173/search" }),
      landing
    );
    expect(problems).toContainEqual(expect.stringContaining("/search"));
  });

  test("query strings the app adds to the URL are not a redirect", () => {
    const problems = checkRendered(
      lhrFixture({ finalDisplayedUrl: "http://127.0.0.1:4173/?zoom=3.5" }),
      landing
    );
    expect(problems).toEqual([]);
  });

  test("catches a shell instead of the page", () => {
    const lhr = lhrFixture();
    lhr.audits["dom-size"] = { numericValue: 46 };
    expect(checkRendered(lhr, landing)).toContainEqual(
      expect.stringContaining("46 DOM elements")
    );
  });

  test("catches the record request failing on the details route", () => {
    const lhr = lhrFixture({
      finalDisplayedUrl: "http://127.0.0.1:4173/details/uuid-1",
    });
    lhr.audits["dom-size"] = { numericValue: 900 };
    lhr.audits["network-requests"] = {
      details: {
        items: [
          { url: `http://x${HEALTH_REQUEST}`, statusCode: 200 },
          { url: "http://x/api/v1/ogc/collections/uuid-1", statusCode: 404 },
        ],
      },
    };
    expect(checkRendered(lhr, details)).toContainEqual(
      expect.stringContaining("answered 404")
    );
  });

  test("catches the health check never happening", () => {
    const lhr = lhrFixture();
    lhr.audits["network-requests"] = { details: { items: [] } };
    expect(checkRendered(lhr, landing)).toContainEqual(
      expect.stringContaining(HEALTH_REQUEST)
    );
  });
});

describe("lcpElement", () => {
  test("reads the node label when Lighthouse reported one", () => {
    const lhr = lhrFixture();
    lhr.audits["largest-contentful-paint-element"] = {
      details: {
        items: [{ items: [{ node: { nodeLabel: "banner-image-1" } }] }],
      },
    };
    expect(lcpElement(lhr)).toBe("banner-image-1");
  });

  test("is undefined when the audit did not run", () => {
    expect(lcpElement(lhrFixture())).toBeUndefined();
  });
});
