import fs from "fs";
import path from "path";

/** Reporting data only: generation and deployment keep their existing behavior. */
export const SEO_ENVIRONMENTS = ["edge", "staging", "production"] as const;
export type SeoEnvironment = (typeof SEO_ENVIRONMENTS)[number];
export type JobResult = "success" | "failure" | "cancelled" | "skipped";
export type StepResult = JobResult | "unknown";

export interface SeoCounts {
  sitemapUrls: number | null;
  pages: number | null;
}

export interface SeoEnvironmentReport {
  environment: SeoEnvironment;
  runId: string;
  runAttempt: string;
  publishJob: JobResult;
  verifyJob: JobResult;
  generation: StepResult;
  localVerification: StepResult;
  publishing: StepResult;
  verification: StepResult;
  generated: SeoCounts;
  published: SeoCounts;
  verified: SeoCounts;
  errors: string[];
  logsUrl: string;
  jobLinks?: { name: string; url: string }[];
  searchConsole?: StepResult;
  indexing?: { sampledUrls: number; coverage: Record<string, number> } | null;
}

const isResult = (value: unknown): value is JobResult =>
  typeof value === "string" &&
  ["success", "failure", "cancelled", "skipped"].includes(value);

const isCounts = (value: unknown): value is SeoCounts => {
  if (!value || typeof value !== "object") return false;
  const counts = value as SeoCounts;
  return [counts.sitemapUrls, counts.pages].every(
    (count) => count === null || (Number.isSafeInteger(count) && count! >= 0)
  );
};

/** Reject incomplete/stale artifacts rather than treating missing data as PASS. */
export const parseSeoEnvironmentReport = (
  value: unknown,
  environment: SeoEnvironment,
  runId: string,
  runAttempt: string
): SeoEnvironmentReport => {
  const report = value as SeoEnvironmentReport | null;
  if (
    !report ||
    report.environment !== environment ||
    report.runId !== runId ||
    report.runAttempt !== runAttempt ||
    ![report.publishJob, report.verifyJob].every(isResult) ||
    ![
      report.generation,
      report.localVerification,
      report.publishing,
      report.verification,
    ].every((result) => isResult(result) || result === "unknown") ||
    ![report.generated, report.published, report.verified].every(isCounts) ||
    !Array.isArray(report.errors) ||
    !report.errors.every((error) => typeof error === "string") ||
    (report.searchConsole !== undefined &&
      !isResult(report.searchConsole) &&
      report.searchConsole !== "unknown") ||
    (report.indexing != null &&
      (!Number.isSafeInteger(report.indexing.sampledUrls) ||
        report.indexing.sampledUrls < 0 ||
        !report.indexing.coverage ||
        typeof report.indexing.coverage !== "object" ||
        !Object.values(report.indexing.coverage).every(
          (total) => Number.isSafeInteger(total) && total >= 0
        ) ||
        Object.values(report.indexing.coverage).reduce(
          (sum, total) => sum + total,
          0
        ) !== report.indexing.sampledUrls)) ||
    (report.jobLinks !== undefined &&
      (!Array.isArray(report.jobLinks) ||
        !report.jobLinks.every(
          (link) =>
            typeof link.name === "string" &&
            typeof link.url === "string" &&
            link.url.startsWith("https://")
        ))) ||
    typeof report.logsUrl !== "string" ||
    !report.logsUrl.startsWith("https://")
  ) {
    throw new Error(
      `Missing or invalid ${environment} report for this attempt`
    );
  }
  return report;
};

export const isSeoEnvironmentSuccessful = (report: SeoEnvironmentReport) =>
  [
    report.publishJob,
    report.verifyJob,
    report.generation,
    report.localVerification,
    report.publishing,
    report.verification,
  ].every((result) => result === "success");

export interface WorkflowReportInput {
  directory: string;
  runId: string;
  runAttempt: string;
  runUrl: string;
  executionDate: string;
  workflowResult: JobResult;
}

const markdownText = (value: string) =>
  value.replace(
    /[&<>|\r\n]/g,
    (character) =>
      ({
        "&": "&amp;",
        "<": "&lt;",
        ">": "&gt;",
        "|": "&#124;",
        "\r": " ",
        "\n": " ",
      })[character]!
  );

const count = (value: number | null | undefined) =>
  value == null ? "N/A" : value.toLocaleString("en-AU");
const status = (value?: StepResult) =>
  value === "success"
    ? "PASS"
    : value === "failure"
      ? "FAIL"
      : value?.toUpperCase() || "N/A";

export const prepareWorkflowReport = (input: WorkflowReportInput) => {
  const errors: string[] = [];
  const reports = SEO_ENVIRONMENTS.map((environment) => {
    try {
      return parseSeoEnvironmentReport(
        JSON.parse(
          fs.readFileSync(
            path.join(input.directory, `${environment}.json`),
            "utf8"
          )
        ),
        environment,
        input.runId,
        input.runAttempt
      );
    } catch {
      errors.push(
        `${environment}: missing or invalid report; results and counts are unavailable. See workflow logs.`
      );
      return undefined;
    }
  });
  const successes = reports.filter(
    (report) => report && isSeoEnvironmentSuccessful(report)
  ).length;
  const overall =
    successes === SEO_ENVIRONMENTS.length && input.workflowResult === "success"
      ? "SUCCESS"
      : successes > 0
        ? "PARTIAL FAILURE"
        : "FAILURE";
  reports.forEach((report) => {
    if (!report) return;
    errors.push(
      ...report.errors.map((error) => `${report.environment}: ${error}`)
    );
    if (!isSeoEnvironmentSuccessful(report) && !report.errors.length) {
      errors.push(
        `${report.environment}: publish job ${report.publishJob}; verify job ${report.verifyJob}; see failed or skipped steps in the logs.`
      );
    }
  });
  if (input.workflowResult !== "success") {
    errors.push(
      `SEO matrix result: ${input.workflowResult}. See workflow logs.`
    );
  }
  const rows = reports.map((report, index) => {
    const environment = SEO_ENVIRONMENTS[index];
    return `| ${environment} | ${status(report?.generation)} | ${status(report?.localVerification)} | ${status(report?.publishing)} | ${status(report?.verification)} | ${count(report?.generated.sitemapUrls)} / ${count(report?.generated.pages)} | ${count(report?.published.sitemapUrls)} / ${count(report?.published.pages)} | ${count(report?.verified.sitemapUrls)} / ${count(report?.verified.pages)} |`;
  });
  const links = reports.filter((report): report is SeoEnvironmentReport =>
    Boolean(report)
  );
  const production = reports[2];
  const indexing = production?.indexing;
  const indexingRows = indexing
    ? [
        `Sampled URLs inspected: ${count(indexing.sampledUrls)}`,
        "",
        "| Google coverage state | Sampled URLs |",
        "|---|---|",
        ...Object.entries(indexing.coverage).map(
          ([state, total]) => `| ${markdownText(state)} | ${count(total)} |`
        ),
      ]
    : ["Indexing results: N/A (no confirmed coverage sample available)."];
  const warnings = [
    "Live verification checks sitemap URLs and sampled detail pages only; the sample does not verify every page.",
    "Google coverage describes only inspected URLs. A successful submission does not mean Google indexed the published pages.",
    ...reports.flatMap((report, index) =>
      !report ||
      [report.generated, report.published, report.verified].some(
        (counts) => counts.sitemapUrls === null || counts.pages === null
      )
        ? [
            `${SEO_ENVIRONMENTS[index]}: some counts are unavailable; see job logs.`,
          ]
        : []
    ),
  ];
  const markdown = [
    "# SEO Workflow Report",
    "",
    `Overall Status: ${overall}`,
    "",
    `Execution date: ${input.executionDate}`,
    "",
    `Run attempt: ${input.runAttempt}`,
    "",
    "| Environment | Generation | Local validation | Publishing | Live verification | Generated URLs / pages | Published URLs / pages | Verified URLs / sampled pages |",
    "|---|---|---|---|---|---|---|---|",
    ...rows,
    "",
    "Published counts confirm completed S3 uploads. Live verification checks the sitemap and samples detail pages; it does not verify every generated page.",
    "Unavailable counts are N/A; skipped steps have not passed. Publication and live verification do not establish Google indexing.",
    "",
    `Errors: ${errors.length ? `\n\n${errors.map((error) => `- ${markdownText(error)}`).join("\n")}` : "None"}`,
    "",
    "## Warnings",
    "",
    ...warnings.map((warning) => `- ${warning}`),
    "",
    "## Google Search Console — production",
    "",
    `Submission / inspection step: ${status(production?.searchConsole)}`,
    "",
    ...indexingRows,
    "",
    `[GitHub Actions summary and logs](${input.runUrl})`,
    "",
    ...links.flatMap((report) => [
      `- [${report.environment} jobs and logs](${report.logsUrl})`,
      ...(report.jobLinks || []).map(
        (link) => `- [${markdownText(link.name)}](${link.url})`
      ),
    ]),
    "",
    ...(links.length
      ? [`[Available environment reports](${input.runUrl}#artifacts)`]
      : []),
  ].join("\n");
  return { overall, markdown };
};
