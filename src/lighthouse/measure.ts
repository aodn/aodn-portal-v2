/**
 * `yarn lh:measure` — measures the configured routes against the production build in
 * dist/ and writes .lighthouse/report.json.
 *
 * Local measurements fail when a run could not be trusted: no build, Chrome or Lighthouse
 * erroring, or a page that did not actually render (wrong URL, degraded shell,
 * failed API call). --url measures a deployed site and reports the release
 * minimum Performance score without failing valid measurements below it.
 * Local PR comparisons stay in
 * compare.ts. Node-only.
 */

import { execFileSync } from "child_process";
import fs from "fs";
import path from "path";
import { createApiReplayer, type ApiReplayer } from "@/lighthouse/apiFixtures";
import { startAppServer, type AppServer } from "@/lighthouse/appServer";
import {
  ALL_FORM_FACTORS,
  DEFAULT_PORT,
  DEFAULT_RUNS,
  detailsUuid,
  lighthouseRoutes,
  metricOrder,
  type LighthouseRoute,
} from "@/lighthouse/constants";
import {
  apiFixturesDir,
  argValue,
  distDir,
  isLighthouseCli,
  lhrDir,
  reportJsonPath,
  reportMarkdownPath,
  runCli,
  workDir,
} from "@/lighthouse/cli";
import {
  checkRendered,
  extractMetrics,
  lcpElement,
  medianMetrics,
} from "@/lighthouse/metrics";
import { buildReleaseReport } from "@/lighthouse/releaseReport";
import { runLighthouse } from "@/lighthouse/runLighthouse";
import type {
  FormFactor,
  LighthouseReport,
  RouteMetrics,
  RouteReport,
} from "@/lighthouse/types";

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
  api?: ApiReplayer;
}): Promise<{ metrics: RouteMetrics; measuredRuns: RouteMetrics[] }> => {
  const url = `${origin}${route.path}`;

  // Discarded: warms Chrome and the OS caches so the first measured run is
  // not the odd one out.
  console.log(`[${route.id}] warm-up run`);
  await runLighthouse({
    url,
    formFactor,
    warmup: true,
    matchDevToolsSettings: !api,
  });

  const collected: RouteMetrics[] = [];
  for (let run = 1; run <= runs; run += 1) {
    const lhr = await runLighthouse({
      url,
      formFactor,
      // DevTools settings apply to live release audits, not PR baselines.
      matchDevToolsSettings: !api,
      // Deployed runs preserve HTML as well as JSON, including invalid pages.
      ...(!api && keepLhr
        ? {
            reportPath: path.join(lhrDir(), `${formFactor}-${route.id}-${run}`),
          }
        : {}),
    });

    const problems = checkRendered(lhr, route, origin);
    if (problems.length > 0) {
      const missing = api?.missing() ?? [];
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

    if (keepLhr && api) {
      fs.writeFileSync(
        path.join(lhrDir(), `${formFactor}-${route.id}-${run}.json`),
        JSON.stringify(lhr),
        "utf8"
      );
    }

    const metrics = extractMetrics(lhr, !api);
    collected.push(metrics);
    console.log(
      `[${route.id}] run ${run}/${runs} ${formatMetrics(metrics)}` +
        (lcpElement(lhr) ? ` lcp-element="${lcpElement(lhr)}"` : "")
    );
  }

  const medians = medianMetrics(collected);
  console.log(`[${route.id}] median ${formatMetrics(medians)}`);
  return { metrics: medians, measuredRuns: collected };
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
  const deployedUrl = argValue("--url") || process.env.LH_URL;
  const origin = deployedUrl ? new URL(deployedUrl).origin : undefined;
  if (deployedUrl && !/^https?:$/.test(new URL(deployedUrl).protocol)) {
    throw new Error("--url must be an HTTP or HTTPS site URL");
  }
  if (origin && process.argv.includes("--serve-only")) {
    throw new Error("--serve-only cannot be used with a deployed --url");
  }

  fs.mkdirSync(workDir(), { recursive: true });
  if (keepLhr) fs.mkdirSync(lhrDir(), { recursive: true });
  // Local measurements replay the committed API fixtures. Deployed audits
  // bypass both the fixture replayer and the local server entirely.
  let api: ApiReplayer | undefined;
  let server: AppServer | undefined;
  if (origin) {
    console.log(`measuring deployed site ${origin} with its real API`);
  } else {
    api = createApiReplayer({ fixturesDir });
    server = await startAppServer({ distDir: distDir(), port, api });
    console.log(
      `serving ${distDir()} on ${server.url}, /api replayed from ` +
        `${api.manifest.fixtures.length} fixtures recorded from ` +
        `${api.manifest.recordedFrom} on ${api.manifest.recordedAt}`
    );
  }

  // Handy when a run reports an unrendered page: serve the exact same build
  // and API data, then open it in a browser to see what Lighthouse saw.
  if (process.argv.includes("--serve-only")) {
    console.log("--serve-only: press Ctrl+C to stop");
    await new Promise(() => {});
  }

  const routes: Record<string, RouteReport> = {};
  const report: LighthouseReport = {
    commit: commitSha(),
    branch: branchName(),
    generatedAt: new Date().toISOString(),
    runs,
    apiHost: origin ?? api!.manifest.recordedFrom,
    routes,
    ...(origin ? { environment: process.env.LH_ENVIRONMENT } : {}),
  };
  const saveReport = () => {
    fs.mkdirSync(path.dirname(outputPath), { recursive: true });
    fs.writeFileSync(
      outputPath,
      `${JSON.stringify(report, null, 2)}\n`,
      "utf8"
    );
    if (origin) {
      const { markdown, failures, results } = buildReleaseReport(report);
      fs.writeFileSync(reportMarkdownPath(), markdown, "utf8");
      fs.writeFileSync(
        path.join(workDir(), "release-results.json"),
        `${JSON.stringify(results, null, 2)}\n`,
        "utf8"
      );
      for (const failure of failures) {
        console.warn(
          `::warning title=Lighthouse performance threshold::${failure}`
        );
      }
    }
  };
  let activePage = "";
  try {
    for (const route of lighthouseRoutes(uuid)) {
      activePage = route.path;
      const metrics: RouteReport["metrics"] = {};
      const measuredRuns: NonNullable<RouteReport["measuredRuns"]> = {};
      routes[route.path] = {
        id: route.id,
        metrics,
        ...(origin ? { measuredRuns } : {}),
      };
      for (const formFactor of formFactors) {
        const measurement = await measureRoute({
          route,
          origin: origin ?? server!.url,
          runs,
          formFactor,
          keepLhr,
          api,
        });
        metrics[formFactor] = measurement.metrics;
        measuredRuns[formFactor] = measurement.measuredRuns;
      }
    }
  } catch (error) {
    if (origin) {
      report.executionError = `${activePage}: ${error instanceof Error ? error.message : String(error)}`;
      saveReport();
    }
    throw error;
  } finally {
    await server?.close();
  }

  const missing = api?.missing() ?? [];
  if (missing.length > 0) {
    // The readiness checks above already passed, so these were requests the
    // pages tolerate — worth seeing, not worth failing on.
    console.warn(
      `API requests with no recorded fixture (answered 504): ${missing.join(", ")}`
    );
  }

  saveReport();
  console.log(`wrote ${outputPath}`);
  return report;
};

if (isLighthouseCli("measure.ts")) runCli(measure());
