/** Prepare a consolidated SES message locally, without network or delivery. */
import fs from "fs";
import path from "path";
import { isSeoCli, runCli } from "@/seo/cli";
import {
  isSeoEnvironmentSuccessful,
  parseSeoEnvironmentReport,
  SEO_ENVIRONMENTS,
  type JobResult,
  type StepResult,
  type SeoEnvironmentReport,
} from "@/seo/workflowReport";
import { buildSesEmailPayload, parseEmailRecipients } from "@/utils/EmailUtils";

interface WorkflowEmailInput {
  directory: string;
  runId: string;
  runAttempt: string;
  runUrl: string;
  executionDate: string;
  workflowResult: JobResult;
  sender: string;
  recipientConfiguration: string;
}

const escapeHtml = (text: string) =>
  text.replace(/[&<>"']/g, (character) => `&#${character.charCodeAt(0)};`);
const count = (value: number | null | undefined) =>
  value == null ? "N/A" : value.toLocaleString("en-AU");
const status = (value?: StepResult) =>
  value === "success"
    ? "PASS"
    : value === "failure"
      ? "FAIL"
      : value?.toUpperCase() || "N/A";

export const prepareWorkflowEmail = (input: WorkflowEmailInput) => {
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
  const text = [
    "SEO Workflow Report",
    `Overall Status: ${overall}`,
    `Execution date: ${input.executionDate}`,
    `Run attempt: ${input.runAttempt}`,
    "",
    "| Environment | Generation | Local validation | Publishing | Live verification | Generated URLs / pages | Published URLs / pages | Verified URLs / sampled pages |",
    "|---|---|---|---|---|---|---|---|",
    ...rows,
    "",
    "Published counts confirm completed S3 uploads. Live verification checks the sitemap and samples detail pages; it does not verify every generated page.",
    "Unavailable counts are N/A; skipped steps have not passed.",
    "",
    `Errors: ${errors.length ? `\n${errors.join("\n")}` : "None"}`,
    "",
    `GitHub Actions summary and logs: ${input.runUrl}`,
    ...links.map((report) => `${report.environment} logs: ${report.logsUrl}`),
    ...(links.length
      ? [`Available environment reports: ${input.runUrl}#artifacts`]
      : []),
  ].join("\n");
  const html = `<p><a href="${escapeHtml(input.runUrl)}">GitHub Actions summary and logs</a>${links.length ? ` · <a href="${escapeHtml(input.runUrl)}#artifacts">Environment reports</a>` : ""}</p><pre style="white-space:pre-wrap;font-family:monospace">${escapeHtml(text)}</pre>`;
  return buildSesEmailPayload(
    {
      recipients: parseEmailRecipients(input.recipientConfiguration),
      subject: `[AODN Portal] SEO Report: ${overall}`,
      text,
      html,
    },
    input.sender
  );
};

const required = (name: string) => {
  const value = process.env[name];
  if (!value?.trim()) throw new Error(`${name} is required`);
  return value;
};

const prepare = async () => {
  const directory = path.resolve(".seo-reports");
  const workflowResult = required("SEO_WORKFLOW_RESULT");
  if (!["success", "failure", "cancelled", "skipped"].includes(workflowResult))
    throw new Error("Invalid SEO_WORKFLOW_RESULT");
  const runId = required("GITHUB_RUN_ID");
  const runUrl = `${process.env.GITHUB_SERVER_URL || "https://github.com"}/${required("GITHUB_REPOSITORY")}/actions/runs/${runId}`;
  const payload = prepareWorkflowEmail({
    directory,
    runId,
    runAttempt: required("GITHUB_RUN_ATTEMPT"),
    runUrl,
    executionDate: required("SEO_EXECUTION_DATE"),
    workflowResult: workflowResult as JobResult,
    sender: required("LH_EMAIL_FROM"),
    recipientConfiguration: required("LH_EMAIL_RECIPIENTS"),
  });
  fs.mkdirSync(directory, { recursive: true });
  fs.writeFileSync(
    path.join(directory, "email-ses.json"),
    `${JSON.stringify(payload, null, 2)}\n`
  );
};

if (isSeoCli("prepareWorkflowEmail.ts")) runCli(prepare());
