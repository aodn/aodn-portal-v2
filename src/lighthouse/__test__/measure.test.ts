// @vitest-environment node
import fs from "fs";
import os from "os";
import path from "path";
import { afterEach, beforeEach, expect, test, vi } from "vitest";
import { createApiReplayer } from "@/lighthouse/apiFixtures";
import { startAppServer } from "@/lighthouse/appServer";
import {
  DEFAULT_DETAILS_UUID,
  HEALTH_REQUEST,
  lighthouseRoutes,
} from "@/lighthouse/constants";
import { measure } from "@/lighthouse/measure";
import { runLighthouse } from "@/lighthouse/runLighthouse";
import type { Lhr } from "@/lighthouse/types";

vi.mock("@/lighthouse/apiFixtures");
vi.mock("@/lighthouse/appServer");
vi.mock("@/lighthouse/runLighthouse");
const { directory } = vi.hoisted(() => ({ directory: { path: "" } }));
vi.mock("@/lighthouse/cli", async (importOriginal) => ({
  ...(await importOriginal<typeof import("@/lighthouse/cli")>()),
  workDir: () => directory.path,
  lhrDir: () => path.join(directory.path, "lhr"),
  reportJsonPath: () => path.join(directory.path, "report.json"),
  reportMarkdownPath: () => path.join(directory.path, "report.md"),
}));

const originalArgv = process.argv;
const origin = "https://portal-staging.aodn.org.au";

const result = (url: string, performance: number): Lhr => ({
  finalDisplayedUrl: url,
  categories: {
    performance: { score: performance },
    accessibility: { score: 0.9 },
    "best-practices": { score: 0.9 },
    seo: { score: 0.9 },
  },
  audits: {
    "dom-size": { numericValue: 500 },
    "largest-contentful-paint": { numericValue: 2000 },
    "total-blocking-time": { numericValue: 100 },
    "cumulative-layout-shift": { numericValue: 0.01 },
    "first-contentful-paint": { numericValue: 1000 },
    "network-requests": {
      details: {
        items: [
          HEALTH_REQUEST,
          ...lighthouseRoutes().flatMap((route) => route.requiredRequests),
        ].map((fragment) => ({ url: `${origin}${fragment}`, statusCode: 200 })),
      },
    },
  },
});

beforeEach(() => {
  directory.path = fs.mkdtempSync(path.join(os.tmpdir(), "lh-measure-"));
  process.argv = [
    "node",
    "test",
    "--url",
    `${origin}/`,
    "--form-factor",
    "mobile",
    "--runs",
    "3",
  ];
  vi.stubEnv("LH_URL", "");
  vi.stubEnv("LH_DETAILS_UUID", "");
  vi.spyOn(console, "log").mockImplementation(() => {});
  vi.mocked(runLighthouse).mockImplementation(
    async ({ url, warmup, reportPath }) => {
      // A low outlier must not fail a page whose median meets the minimum.
      const performance = warmup
        ? 0.99
        : [0.8, 0.4, 0.7][Number(reportPath?.slice(-1)) - 1];
      const lhr = result(url, performance);
      if (reportPath) {
        fs.writeFileSync(`${reportPath}.json`, JSON.stringify(lhr));
        fs.writeFileSync(`${reportPath}.html`, "<html>debug report</html>");
      }
      return lhr;
    }
  );
});

afterEach(() => {
  process.argv = originalArgv;
  fs.rmSync(directory.path, { recursive: true, force: true });
  vi.restoreAllMocks();
  vi.clearAllMocks();
  vi.unstubAllEnvs();
});

test("audits the three deployed pages with one warm-up and three measured runs each", async () => {
  const report = await measure();

  expect(createApiReplayer).not.toHaveBeenCalled();
  expect(startAppServer).not.toHaveBeenCalled();
  expect(runLighthouse).toHaveBeenCalledTimes(12);
  for (const [index, route] of lighthouseRoutes().entries()) {
    const calls = vi
      .mocked(runLighthouse)
      .mock.calls.slice(index * 4, index * 4 + 4);
    expect(calls[0][0]).toEqual({
      url: `${origin}${route.path}`,
      formFactor: "mobile",
      warmup: true,
    });
    expect(calls.slice(1).map(([options]) => options.url)).toEqual(
      Array(3).fill(`${origin}${route.path}`)
    );
    expect(report.routes[route.path].metrics.mobile?.performance).toBe(70);
  }
  expect(report.apiHost).toBe(origin);
  expect(report.runs).toBe(3);
  expect(fs.readdirSync(path.join(directory.path, "lhr"))).toHaveLength(18);
  expect(
    fs.readFileSync(path.join(directory.path, "report.md"), "utf8")
  ).toContain("70 | Pass");
});

test("measures every page and saves results before failing a median below 70", async () => {
  vi.mocked(runLighthouse).mockImplementation(async ({ url }) =>
    result(url, url.endsWith("/search") ? 0.69 : 0.9)
  );

  await expect(measure()).rejects.toThrow(
    "Performance on /search is 69, below the minimum 70"
  );
  expect(runLighthouse).toHaveBeenCalledTimes(12);
  const report = JSON.parse(
    fs.readFileSync(path.join(directory.path, "report.json"), "utf8")
  );
  expect(Object.keys(report.routes)).toHaveLength(3);
  expect(
    fs.readFileSync(path.join(directory.path, "report.md"), "utf8")
  ).toContain("69 | Fail");
});

test("rejects a degraded or failed detail page instead of accepting its high score", async () => {
  vi.mocked(runLighthouse).mockImplementation(async ({ url, reportPath }) => {
    const lhr = result(url, 0.99);
    if (url.includes("/details/"))
      lhr.audits["dom-size"] = { numericValue: 46 };
    if (reportPath) fs.writeFileSync(`${reportPath}.json`, JSON.stringify(lhr));
    return lhr;
  });
  await expect(measure()).rejects.toThrow("46 DOM elements");
  expect(
    fs.existsSync(path.join(directory.path, "lhr", "mobile-details-1.json"))
  ).toBe(true);
});

test("uses the stable detail UUID and permits its existing override", async () => {
  expect(lighthouseRoutes()[2].path).toContain(DEFAULT_DETAILS_UUID);
  process.argv.push("--uuid", "replacement-dataset");
  const original = vi.mocked(runLighthouse).getMockImplementation()!;
  vi.mocked(runLighthouse).mockImplementation(async (options) => {
    const lhr = await original(options);
    lhr.audits["network-requests"].details?.items?.push({
      url: `${origin}/api/v1/ogc/collections/replacement-dataset`,
      statusCode: 200,
    });
    return lhr;
  });
  const report = await measure();
  expect(report.routes["/details/replacement-dataset"]).toBeDefined();
});

test("keeps local mocked measurements ungated by the release minimum", async () => {
  process.argv = ["node", "test", "--form-factor", "mobile", "--runs", "1"];
  const close = vi.fn();
  vi.mocked(createApiReplayer).mockReturnValue({
    manifest: {
      fixtures: [],
      recordedFrom: "https://recorded.invalid",
      recordedAt: "today",
    },
    missing: () => [],
  } as unknown as ReturnType<typeof createApiReplayer>);
  vi.mocked(startAppServer).mockResolvedValue({
    url: origin,
    close,
  } as unknown as Awaited<ReturnType<typeof startAppServer>>);
  vi.mocked(runLighthouse).mockImplementation(async ({ url }) =>
    result(url, 0.5)
  );

  const report = await measure();
  expect(report.routes["/"].metrics.mobile?.performance).toBe(50);
  expect(close).toHaveBeenCalledOnce();
  expect(fs.existsSync(path.join(directory.path, "report.md"))).toBe(false);
});
