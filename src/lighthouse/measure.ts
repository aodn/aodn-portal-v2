/**
 * `yarn lh` — measures the configured routes against the production build in
 * dist/ and writes .lighthouse/report.json.
 *
 * Fails only when a run could not be trusted: no build, Chrome or Lighthouse
 * erroring, or a page that did not actually render (wrong URL, degraded shell,
 * failed API call). Scores are never a failure — comparing them is compare.ts's
 * job. Node-only.
 */

import { execFileSync } from "child_process";
import fs from "fs";
import path from "path";
import { createApiCache } from "./apiCache";
import { startAppServer } from "./appServer";
import {
  ALL_FORM_FACTORS,
  DEFAULT_PORT,
  DEFAULT_RUNS,
  apiHost,
  detailsUuid,
  lighthouseRoutes,
  metricOrder,
  type LighthouseRoute,
} from "./constants";
import {
  argValue,
  apiCacheDir,
  distDir,
  isLighthouseCli,
  lhrDir,
  reportJsonPath,
  runCli,
  workDir,
} from "./cli";
import {
  checkRendered,
  extractMetrics,
  lcpElement,
  medianMetrics,
} from "./metrics";
import { runLighthouse } from "./runLighthouse";
import type {
  FormFactor,
  LighthouseReport,
  RouteMetrics,
  RouteReport,
} from "./types";

const git = (...args: string[]) => {
  try {
    return execFileSync("git", args, { encoding: "utf8" }).trim();
  } catch {
    return "";
  }
};

const commitSha = () =>
  argValue("--commit") ||
  // On pull_request GITHUB_SHA is the merge commit, so the head SHA is passed
  // in by the workflow.
  process.env.LH_COMMIT ||
  process.env.GITHUB_SHA ||
  git("rev-parse", "HEAD") ||
  "unknown";

const branchName = () =>
  process.env.GITHUB_HEAD_REF ||
  process.env.GITHUB_REF_NAME ||
  git("rev-parse", "--abbrev-ref", "HEAD") ||
  "unknown";

/**
 * Both mobile and desktop by default — Lighthouse scores them very
 * differently, so the report and the PR comment carry both. `--form-factor`
 * restricts a run to one, for a quick check while iterating on this tooling.
 */
const formFactorsArg = (): FormFactor[] => {
  const value = (
    argValue("--form-factor") ||
    process.env.LH_FORM_FACTOR ||
    "both"
  ).trim();
  if (value === "both" || value === "") return [...ALL_FORM_FACTORS];
  if (value !== "mobile" && value !== "desktop") {
    throw new Error(
      `--form-factor must be mobile, desktop or both, got "${value}"`
    );
  }
  return [value];
};

const positiveInt = (value: string | undefined, fallback: number) => {
  if (!value) return fallback;
  const parsed = Number(value);
  if (!Number.isInteger(parsed) || parsed < 1) {
    throw new Error(`expected a positive integer, got "${value}"`);
  }
  return parsed;
};

const formatMetrics = (metrics: RouteMetrics) =>
  metricOrder.map((key) => `${key}=${metrics[key]}`).join(" ");

const measureRoute = async ({
  route,
  origin,
  runs,
  formFactor,
  keepLhr,
}: {
  route: LighthouseRoute;
  origin: string;
  runs: number;
  formFactor: FormFactor;
  keepLhr: boolean;
}): Promise<RouteMetrics> => {
  const url = `${origin}${route.path}`;

  // Records the API responses (and warms the OS caches) so the measured runs
  // replay them instead of waiting on a backend.
  console.log(`[${route.id}] warm-up run`);
  await runLighthouse({ url, formFactor, warmup: true });

  const collected: RouteMetrics[] = [];
  for (let run = 1; run <= runs; run += 1) {
    const lhr = await runLighthouse({ url, formFactor });

    const problems = checkRendered(lhr, route, origin);
    if (problems.length > 0) {
      throw new Error(
        `${route.path} did not render a page worth measuring:\n` +
          problems.map((problem) => `  - ${problem}`).join("\n")
      );
    }

    if (keepLhr) {
      fs.writeFileSync(
        path.join(lhrDir(), `${formFactor}-${route.id}-${run}.json`),
        JSON.stringify(lhr),
        "utf8"
      );
    }

    const metrics = extractMetrics(lhr);
    collected.push(metrics);
    console.log(
      `[${route.id}] run ${run}/${runs} ${formatMetrics(metrics)}` +
        (lcpElement(lhr) ? ` lcp-element="${lcpElement(lhr)}"` : "")
    );
  }

  const medians = medianMetrics(collected);
  console.log(`[${route.id}] median ${formatMetrics(medians)}`);
  return medians;
};

export const measure = async () => {
  const formFactors = formFactorsArg();
  const runs = positiveInt(
    argValue("--runs") ?? process.env.LH_RUNS,
    DEFAULT_RUNS
  );
  const port = positiveInt(
    argValue("--port") ?? process.env.LH_PORT,
    DEFAULT_PORT
  );
  const uuid = argValue("--uuid") || detailsUuid();
  const upstream = argValue("--api-host") || apiHost();
  const outputPath = argValue("--out") || reportJsonPath();
  const cacheDir = argValue("--cache-dir") || apiCacheDir();
  const keepLhr = !process.argv.includes("--no-keep-lhr");

  fs.mkdirSync(workDir(), { recursive: true });
  if (keepLhr) fs.mkdirSync(lhrDir(), { recursive: true });
  // Recorded responses are kept between local runs for speed; --fresh
  // re-records them when the upstream data has moved on.
  if (process.argv.includes("--fresh")) {
    fs.rmSync(cacheDir, { recursive: true, force: true });
  }

  const api = createApiCache({ upstream, cacheDir });
  const server = await startAppServer({ distDir: distDir(), port, api });
  console.log(
    `serving ${distDir()} on ${server.url}, /api recorded from ${upstream}`
  );

  // Handy when a run reports an unrendered page: serve the exact same build
  // and API data, then open it in a browser to see what Lighthouse saw.
  if (process.argv.includes("--serve-only")) {
    console.log("--serve-only: press Ctrl+C to stop");
    await new Promise(() => {});
  }

  const routes: Record<string, RouteReport> = {};
  try {
    for (const route of lighthouseRoutes(uuid)) {
      const metrics: RouteReport["metrics"] = {};
      for (const formFactor of formFactors) {
        metrics[formFactor] = await measureRoute({
          route,
          origin: server.url,
          runs,
          formFactor,
          keepLhr,
        });
      }
      routes[route.path] = { id: route.id, metrics };
    }
  } finally {
    await server.close();
  }

  const stats = api.stats();
  console.log(
    `api cache: ${stats.hits} replayed, ${stats.misses} recorded` +
      (stats.errors.length > 0
        ? `, upstream errors: ${stats.errors.join(", ")}`
        : "")
  );
  if (stats.failures.length > 0) {
    // The readiness checks above already passed, so these were requests the
    // pages tolerate — worth seeing, not worth failing on.
    console.warn(`unreachable upstream requests: ${stats.failures.join(", ")}`);
  }

  const report: LighthouseReport = {
    commit: commitSha(),
    branch: branchName(),
    generatedAt: new Date().toISOString(),
    runs,
    apiHost: upstream,
    routes,
  };

  fs.mkdirSync(path.dirname(outputPath), { recursive: true });
  fs.writeFileSync(outputPath, `${JSON.stringify(report, null, 2)}\n`, "utf8");
  console.log(`wrote ${outputPath}`);
  return report;
};

if (isLighthouseCli("measure.ts")) runCli(measure());
