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
import { createApiReplayer, type ApiReplayer } from "./apiFixtures";
import { startAppServer } from "./appServer";
import {
  ALL_FORM_FACTORS,
  DEFAULT_PORT,
  DEFAULT_RUNS,
  detailsUuid,
  lighthouseRoutes,
  metricOrder,
  type LighthouseRoute,
} from "./constants";
import {
  apiFixturesDir,
  argValue,
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
  api,
}: {
  route: LighthouseRoute;
  origin: string;
  runs: number;
  formFactor: FormFactor;
  keepLhr: boolean;
  api: ApiReplayer;
}): Promise<RouteMetrics> => {
  const url = `${origin}${route.path}`;

  // Discarded: warms Chrome and the OS caches so the first measured run is
  // not the odd one out.
  console.log(`[${route.id}] warm-up run`);
  await runLighthouse({ url, formFactor, warmup: true });

  const collected: RouteMetrics[] = [];
  for (let run = 1; run <= runs; run += 1) {
    const lhr = await runLighthouse({ url, formFactor });

    const problems = checkRendered(lhr, route, origin);
    if (problems.length > 0) {
      const missing = api.missing();
      throw new Error(
        `${route.path} did not render a page worth measuring:\n` +
          problems.map((problem) => `  - ${problem}`).join("\n") +
          (missing.length > 0
            ? "\nThe app made API requests that have no recorded fixture:\n" +
              missing.map((request) => `  - ${request}`).join("\n") +
              '\nIf it now calls the OGC API differently, run "yarn lh:build && ' +
              'yarn lh:record" and commit src/lighthouse/fixtures/api.'
            : "")
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
  const outputPath = argValue("--out") || reportJsonPath();
  const fixturesDir = argValue("--fixtures") || apiFixturesDir();
  const keepLhr = !process.argv.includes("--no-keep-lhr");

  fs.mkdirSync(workDir(), { recursive: true });
  if (keepLhr) fs.mkdirSync(lhrDir(), { recursive: true });
  // The OGC API is mocked: only the committed fixtures are served, so a
  // missing or slow environment can never fail or skew the run.
  const api = createApiReplayer({ fixturesDir });
  const server = await startAppServer({ distDir: distDir(), port, api });
  console.log(
    `serving ${distDir()} on ${server.url}, /api replayed from ` +
      `${api.manifest.fixtures.length} fixtures recorded from ` +
      `${api.manifest.recordedFrom} on ${api.manifest.recordedAt}`
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
          api,
        });
      }
      routes[route.path] = { id: route.id, metrics };
    }
  } finally {
    await server.close();
  }

  const missing = api.missing();
  if (missing.length > 0) {
    // The readiness checks above already passed, so these were requests the
    // pages tolerate — worth seeing, not worth failing on.
    console.warn(
      `API requests with no recorded fixture (answered 504): ${missing.join(", ")}`
    );
  }

  const report: LighthouseReport = {
    commit: commitSha(),
    branch: branchName(),
    generatedAt: new Date().toISOString(),
    runs,
    apiHost: api.manifest.recordedFrom,
    routes,
  };

  fs.mkdirSync(path.dirname(outputPath), { recursive: true });
  fs.writeFileSync(outputPath, `${JSON.stringify(report, null, 2)}\n`, "utf8");
  console.log(`wrote ${outputPath}`);
  return report;
};

if (isLighthouseCli("measure.ts")) runCli(measure());
