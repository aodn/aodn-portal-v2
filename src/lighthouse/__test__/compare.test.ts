import { describe, expect, test } from "vitest";
import { buildMarkdown, formatDelta, formatValue } from "../compare";
import { COMMENT_MARKER } from "../constants";
import type { LighthouseReport, RouteMetrics } from "../types";

const routeMetrics = (values: Partial<RouteMetrics> = {}): RouteMetrics => ({
  performance: 76,
  accessibility: 96,
  bestPractices: 96,
  seo: 91,
  lcp: 2500,
  cls: 0.02,
  tbt: 180,
  fcp: 1200,
  ...values,
});

const report = (
  routes: Record<string, RouteMetrics & { id: string }>,
  overrides: Partial<LighthouseReport> = {}
): LighthouseReport => ({
  commit: "abc1234567",
  branch: "feature/x",
  generatedAt: "2026-09-17T00:00:00.000Z",
  formFactor: "mobile",
  runs: 3,
  apiHost: "https://portal-edge.aodn.org.au",
  routes,
  ...overrides,
});

describe("formatValue", () => {
  test("categories are whole numbers, timings carry their unit", () => {
    expect(formatValue("performance", 76)).toBe("76");
    expect(formatValue("lcp", 2450)).toBe("2.5s");
    expect(formatValue("tbt", 180.6)).toBe("181ms");
    expect(formatValue("cls", 0.02)).toBe("0.02");
    expect(formatValue("cls", 0)).toBe("0");
  });
});

describe("formatDelta", () => {
  test("always carries a sign", () => {
    expect(formatDelta("performance", 3)).toBe("+3");
    expect(formatDelta("performance", -3)).toBe("-3");
    expect(formatDelta("lcp", -100)).toBe("-0.1s");
    expect(formatDelta("tbt", 10)).toBe("+10ms");
    expect(formatDelta("cls", 0.03)).toBe("+0.03");
  });
});

describe("buildMarkdown", () => {
  test("marks improvements, ignores noise and warns on real regressions", () => {
    const { markdown, warnings } = buildMarkdown({
      baseline: report(
        {
          "/": { id: "landing", ...routeMetrics() },
          "/search": { id: "search", ...routeMetrics({ performance: 60 }) },
        },
        { commit: "base1234567", branch: "main" }
      ),
      current: report({
        "/": {
          id: "landing",
          ...routeMetrics({ performance: 79, bestPractices: 95 }),
        },
        "/search": { id: "search", ...routeMetrics({ performance: 53 }) },
      }),
    });

    expect(markdown.startsWith(COMMENT_MARKER)).toBe(true);
    expect(markdown).toContain("Compared with `main` (`base123`)");
    // An improvement of any size is worth showing
    expect(markdown).toContain("| Performance | 76 | 79 | +3 ✅ |");
    // One point down is variability, not a regression
    expect(markdown).toContain("| Best Practices | 96 | 95 | -1 |");
    expect(markdown).toContain("| Performance | 60 | 53 | -7 ⚠️ |");
    expect(markdown).toContain("| Accessibility | 96 | 96 | — |");
    expect(warnings).toEqual([
      "⚠️ Performance on `/search` decreased by 7 points compared with `main`.",
    ]);
    expect(markdown).toContain(
      "a performance drop of 15 points or more against `main` fails the check"
    );
  });

  test("warns exactly at the threshold, not below it", () => {
    const atThreshold = buildMarkdown({
      baseline: report({
        "/": { id: "landing", ...routeMetrics({ lcp: 2000 }) },
      }),
      current: report({
        "/": { id: "landing", ...routeMetrics({ lcp: 2500 }) },
      }),
    });
    expect(atThreshold.warnings).toHaveLength(1);

    const belowThreshold = buildMarkdown({
      baseline: report({
        "/": { id: "landing", ...routeMetrics({ lcp: 2000 }) },
      }),
      current: report({
        "/": { id: "landing", ...routeMetrics({ lcp: 2499 }) },
      }),
    });
    expect(belowThreshold.warnings).toEqual([]);
  });

  test("a CLS threshold hit is not lost to floating point", () => {
    const { warnings } = buildMarkdown({
      baseline: report({
        "/": { id: "landing", ...routeMetrics({ cls: 0.01 }) },
      }),
      current: report({
        "/": { id: "landing", ...routeMetrics({ cls: 0.04 }) },
      }),
    });
    expect(warnings).toEqual([
      "⚠️ CLS on `/` increased by 0.03 compared with `main`.",
    ]);
  });

  test("FCP is reported but never warned about", () => {
    const { markdown, warnings } = buildMarkdown({
      baseline: report({
        "/": { id: "landing", ...routeMetrics({ fcp: 1000 }) },
      }),
      current: report({
        "/": { id: "landing", ...routeMetrics({ fcp: 4000 }) },
      }),
    });
    expect(markdown).toContain("| FCP | 1.0s | 4.0s | +3.0s |");
    expect(warnings).toEqual([]);
  });

  test("matches a baseline route by id when the path changed", () => {
    const { markdown } = buildMarkdown({
      baseline: report({
        "/details/old-uuid": { id: "details", ...routeMetrics({ tbt: 100 }) },
      }),
      current: report({
        "/details/new-uuid": { id: "details", ...routeMetrics({ tbt: 120 }) },
      }),
    });
    expect(markdown).toContain("### `/details/new-uuid`");
    expect(markdown).toContain("| TBT | 100ms | 120ms | +20ms |");
  });

  test("says so when main has no baseline yet, without failing", () => {
    const { markdown, warnings } = buildMarkdown({
      current: report({ "/": { id: "landing", ...routeMetrics() } }),
    });
    expect(markdown).toContain("No `main` baseline is available yet");
    expect(markdown).toContain("| Performance | n/a | 76 | — |");
    expect(warnings).toEqual([]);
  });

  test("confirms when nothing moved beyond the thresholds", () => {
    const { markdown } = buildMarkdown({
      baseline: report({ "/": { id: "landing", ...routeMetrics() } }),
      current: report({ "/": { id: "landing", ...routeMetrics() } }),
    });
    expect(markdown).toContain(
      "✅ No metric moved beyond the noise thresholds"
    );
  });

  test("blocks when performance drops 15 points or more, warns just below it", () => {
    const atThreshold = buildMarkdown({
      baseline: report({
        "/": { id: "landing", ...routeMetrics({ performance: 90 }) },
      }),
      current: report({
        "/": { id: "landing", ...routeMetrics({ performance: 75 }) },
      }),
    });
    expect(atThreshold.blocking).toEqual([
      "❌ Performance on `/` dropped by 15 points compared with `main` — this check fails at 15 or more.",
    ]);
    expect(atThreshold.warnings).toEqual([]);
    expect(atThreshold.markdown).toContain(
      "| Performance | 90 | 75 | -15 ❌ |"
    );
    expect(atThreshold.markdown).toContain(
      "❌ Performance on `/` dropped by 15 points"
    );

    const justBelow = buildMarkdown({
      baseline: report({
        "/": { id: "landing", ...routeMetrics({ performance: 90 }) },
      }),
      current: report({
        "/": { id: "landing", ...routeMetrics({ performance: 76 }) },
      }),
    });
    expect(justBelow.blocking).toEqual([]);
    expect(justBelow.warnings).toEqual([
      "⚠️ Performance on `/` decreased by 14 points compared with `main`.",
    ]);
  });

  test("only performance can block; other categories only ever warn", () => {
    const { blocking, warnings } = buildMarkdown({
      baseline: report({
        "/": { id: "landing", ...routeMetrics({ accessibility: 96 }) },
      }),
      current: report({
        "/": { id: "landing", ...routeMetrics({ accessibility: 78 }) },
      }),
    });
    expect(blocking).toEqual([]);
    expect(warnings).toEqual([
      "⚠️ Accessibility on `/` decreased by 18 points compared with `main`.",
    ]);
  });

  test("a blockingDrop of 0 turns the gate off and says so", () => {
    const { markdown, blocking } = buildMarkdown({
      baseline: report({
        "/": { id: "landing", ...routeMetrics({ performance: 90 }) },
      }),
      current: report({
        "/": { id: "landing", ...routeMetrics({ performance: 50 }) },
      }),
      blockingDrop: 0,
    });
    expect(blocking).toEqual([]);
    expect(markdown).toContain(
      "does not block the PR based on Lighthouse scores"
    );
  });

  test("flags a baseline measured with a different emulation", () => {
    const { markdown } = buildMarkdown({
      baseline: report(
        { "/": { id: "landing", ...routeMetrics() } },
        { formFactor: "desktop" }
      ),
      current: report({ "/": { id: "landing", ...routeMetrics() } }),
    });
    expect(markdown).toContain("not comparable");
  });
});
