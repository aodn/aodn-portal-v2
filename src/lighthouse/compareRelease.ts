/** Compare release measurements using retained Actions artifacts, not run status. */
import fs from "fs";
import os from "os";
import path from "path";
import { execFileSync } from "child_process";
import { isLighthouseCli, runCli, workDir } from "@/lighthouse/cli";
import { MINIMUM_RELEASE_PERFORMANCE } from "@/lighthouse/releaseReport";
import type { buildReleaseReport } from "@/lighthouse/releaseReport";

type Results = ReturnType<typeof buildReleaseReport>["results"];
export type ReleaseHistory = Pick<
  Results,
  "environment" | "ref" | "commit" | "executionStatus" | "performanceStatus"
> & {
  pages: Pick<
    Results["pages"][number],
    "id" | "url" | "formFactor" | "performance"
  >[];
};
export interface ReleaseArtifact {
  id: number;
  name: string;
  expired: boolean;
  expires_at?: string;
  created_at: string;
  workflow_run?: { id: number; head_sha?: string };
}

const pageKey = (page: ReleaseHistory["pages"][number]) => {
  const url = new URL(page.url);
  if (!["http:", "https:"].includes(url.protocol))
    throw new Error("Invalid page URL");
  url.searchParams.sort();
  // Origins may change within an environment; datasets, states and devices must match.
  return `${page.id}:${page.formFactor}:${url.pathname}${url.search}${url.hash}`;
};

export const parseReleaseHistory = (
  value: unknown,
  environment: string
): ReleaseHistory | undefined => {
  try {
    const report = value as ReleaseHistory;
    if (
      !report ||
      report.environment !== environment ||
      !["SUCCESS", "ERROR"].includes(report.executionStatus) ||
      !["PASS", "FAIL", "INCOMPLETE"].includes(report.performanceStatus) ||
      typeof report.ref !== "string" ||
      typeof report.commit !== "string" ||
      !Array.isArray(report.pages) ||
      !report.pages.length
    )
      return undefined;
    const keys = new Set<string>();
    for (const page of report.pages) {
      if (
        !page ||
        typeof page.id !== "string" ||
        !["mobile", "desktop"].includes(page.formFactor) ||
        !Number.isFinite(page.performance) ||
        page.performance < 0 ||
        page.performance > 100
      )
        return undefined;
      const key = pageKey(page);
      if (keys.has(key)) return undefined;
      keys.add(key);
    }
    return report;
  } catch {
    return undefined;
  }
};

const MAX_HISTORY_CANDIDATES = 5;

export const selectPreviousArtifacts = (
  artifacts: ReleaseArtifact[],
  environment: string,
  currentRunId: number,
  currentCommit: string,
  now = Date.now()
) =>
  artifacts
    .filter((artifact) => {
      const match =
        /^lighthouse-(staging|production)-([a-f0-9]+)-(\d+)-(\d+)$/.exec(
          artifact.name
        );
      const id = artifact.workflow_run?.id;
      return (
        match &&
        match[1] === environment &&
        id &&
        Number(match[3]) === id &&
        id < currentRunId &&
        match[2].toLowerCase() !== currentCommit.toLowerCase() &&
        artifact.workflow_run?.head_sha?.toLowerCase() !==
          currentCommit.toLowerCase() &&
        !artifact.expired &&
        (!artifact.expires_at || Date.parse(artifact.expires_at) > now)
      );
    })
    .sort(
      (a, b) =>
        b.workflow_run!.id - a.workflow_run!.id ||
        Date.parse(b.created_at) - Date.parse(a.created_at)
    )
    .slice(0, MAX_HISTORY_CANDIDATES);

export const findPreviousRelease = async (
  artifacts: ReleaseArtifact[],
  current: ReleaseHistory,
  currentRunId: number,
  readArtifact: (artifact: ReleaseArtifact) => Promise<unknown>
) => {
  const candidates = selectPreviousArtifacts(
    artifacts,
    current.environment,
    currentRunId,
    current.commit
  );
  for (const artifact of candidates) {
    try {
      const report = parseReleaseHistory(
        await readArtifact(artifact),
        current.environment
      );
      // Threshold FAIL is usable; errors and the same release are not baselines.
      if (
        report?.executionStatus === "SUCCESS" &&
        report.performanceStatus !== "INCOMPLETE" &&
        report.ref !== current.ref &&
        report.commit.toLowerCase() !== current.commit.toLowerCase()
      )
        return { artifact, report };
    } catch {
      // A missing/corrupt archive must not hide an older valid release.
    }
  }
  return undefined;
};

export const buildReleaseComparison = (
  current: ReleaseHistory,
  previous?: ReleaseHistory,
  previousRunUrl?: string
) => {
  if (previous?.environment !== current.environment) previous = undefined;
  const lines = ["## Performance compared with the previous release", ""];
  if (previous) {
    lines.push(
      `Previous release: \`${previous.ref}\` · SHA: \`${previous.commit}\`${previousRunUrl ? ` · [Actions report](${previousRunUrl})` : ""}`,
      ""
    );
  } else lines.push("No previous release available", "");
  lines.push(
    "PASS/FAIL here checks Performance only. The full audit also validates its existing metric guardrails. Differences are informational and do not add a regression gate.",
    "",
    "| Page | Device | Previous score | Current score | Difference | Minimum | Performance PASS/FAIL |",
    "| --- | --- | --- | --- | --- | --- | --- |"
  );
  for (const page of current.pages) {
    const baseline =
      previous?.environment === current.environment
        ? previous.pages.find(
            (candidate) => pageKey(candidate) === pageKey(page)
          )
        : undefined;
    const difference = baseline
      ? page.performance - baseline.performance
      : undefined;
    lines.push(
      `| [${page.id}](${page.url}) | ${page.formFactor} | ${baseline?.performance ?? "Unavailable"} | ${page.performance} | ${difference === undefined ? "—" : `${difference > 0 ? "+" : ""}${difference}`} | ${MINIMUM_RELEASE_PERFORMANCE} | **${page.performance >= MINIMUM_RELEASE_PERFORMANCE ? "PASS" : "FAIL"}** |`
    );
  }
  lines.push(
    "",
    "Unavailable means no equivalent previous page/device measurement exists (including a changed dataset or query state)."
  );
  return `${lines.join("\n")}\n`;
};

const compare = async () => {
  const directory = workDir();
  const reportPath = path.join(directory, "report.md");
  const environment = process.env.LH_ENVIRONMENT || "";
  let markdown =
    "## Performance compared with the previous release\n\nNo previous release available\n";
  try {
    const current = parseReleaseHistory(
      JSON.parse(
        fs.readFileSync(path.join(directory, "release-results.json"), "utf8")
      ),
      environment
    );
    if (!current) throw new Error("Current results unavailable");
    const api = process.env.GITHUB_API_URL || "https://api.github.com";
    const repo = process.env.GITHUB_REPOSITORY;
    const runId = Number(process.env.GITHUB_RUN_ID);
    const token = process.env.GITHUB_TOKEN;
    const headers = {
      authorization: `Bearer ${token}`,
      accept: "application/vnd.github+json",
      "X-GitHub-Api-Version": "2022-11-28",
    };
    let previous: Awaited<ReturnType<typeof findPreviousRelease>>;
    try {
      if (!repo || !token || !Number.isSafeInteger(runId) || runId <= 0)
        throw new Error("History API configuration missing");
      const artifacts: ReleaseArtifact[] = [];
      for (let page = 1; ; page++) {
        const response = await fetch(
          `${api}/repos/${repo}/actions/artifacts?per_page=100&page=${page}`,
          { headers, signal: AbortSignal.timeout(30000) }
        );
        if (!response.ok)
          throw new Error(`History lookup returned HTTP ${response.status}`);
        const data = (await response.json()) as {
          artifacts: ReleaseArtifact[];
        };
        artifacts.push(...data.artifacts);
        if (data.artifacts.length < 100) break;
      }
      previous = await findPreviousRelease(
        artifacts,
        current,
        runId,
        async (artifact) => {
          const response = await fetch(
            `${api}/repos/${repo}/actions/artifacts/${artifact.id}/zip`,
            { headers, redirect: "manual", signal: AbortSignal.timeout(30000) }
          );
          if (response.status !== 302 || !response.headers.get("location"))
            throw new Error("Historical archive unavailable");
          // The signed storage redirect is fetched without forwarding GITHUB_TOKEN.
          const archive = await fetch(response.headers.get("location")!, {
            signal: AbortSignal.timeout(30000),
          });
          if (!archive.ok) throw new Error("Historical archive unavailable");
          const temporary = fs.mkdtempSync(
            path.join(os.tmpdir(), "lh-release-history-")
          );
          try {
            const zip = path.join(temporary, "reports.zip");
            fs.writeFileSync(zip, Buffer.from(await archive.arrayBuffer()));
            const json = execFileSync(
              "unzip",
              ["-p", zip, "release-results.json"],
              {
                encoding: "utf8",
                maxBuffer: 16 * 1024 * 1024,
                stdio: ["ignore", "pipe", "pipe"],
              }
            );
            return JSON.parse(json);
          } finally {
            fs.rmSync(temporary, { recursive: true, force: true });
          }
        }
      );
    } catch {
      console.warn(
        "::warning title=Lighthouse history::Previous artifacts unavailable; continuing without a comparison baseline."
      );
    }
    markdown = buildReleaseComparison(
      current,
      previous?.report,
      previous
        ? `${process.env.GITHUB_SERVER_URL || "https://github.com"}/${repo}/actions/runs/${previous.artifact.workflow_run!.id}`
        : undefined
    );
  } catch {
    console.warn(
      "::warning title=Lighthouse history::Current results unavailable; no release comparison produced."
    );
  }
  fs.mkdirSync(directory, { recursive: true });
  fs.writeFileSync(
    path.join(directory, "release-comparison.md"),
    markdown,
    "utf8"
  );
  fs.appendFileSync(reportPath, `\n${markdown}`, "utf8");
};

if (isLighthouseCli("compareRelease.ts")) runCli(compare());
