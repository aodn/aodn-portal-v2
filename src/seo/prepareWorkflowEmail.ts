/** Prepare a consolidated SES message locally, without network or delivery. */
import fs from "fs";
import path from "path";
import { decode } from "he";
import { isSeoCli, runCli } from "@/seo/cli";
import { escapeEntities } from "@/seo/constants";
import {
  prepareWorkflowReport,
  type WorkflowReportInput,
  type JobResult,
} from "@/seo/workflowReport";
import { buildSesEmailPayload, parseEmailRecipients } from "@/utils/EmailUtils";

interface WorkflowEmailInput extends WorkflowReportInput {
  sender: string;
  recipientConfiguration: string;
}

export const prepareWorkflowEmail = (input: WorkflowEmailInput) => {
  const { overall, markdown: text } = prepareWorkflowReport(input);
  const html = `<p><a href="${escapeEntities(input.runUrl)}">GitHub Actions summary and logs</a> · <a href="${escapeEntities(input.runUrl)}#artifacts">Environment reports</a></p><pre style="white-space:pre-wrap;font-family:monospace">${escapeEntities(decode(text))}</pre>`;
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
