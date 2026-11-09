/** Write the Actions summary without any email configuration or credentials. */
import fs from "fs";
import path from "path";
import { isSeoCli, runCli } from "@/seo/cli";
import {
  prepareWorkflowReport,
  type JobResult,
  type WorkflowReportInput,
} from "@/seo/workflowReport";

export const writeWorkflowSummary = (
  input: WorkflowReportInput,
  summaryFile: string
) => {
  const { markdown } = prepareWorkflowReport(input);
  fs.appendFileSync(summaryFile, `${markdown}\n`);
};

export const prepareWorkflowSummary = () => {
  const runId = process.env.GITHUB_RUN_ID || "";
  const runUrl = `${process.env.GITHUB_SERVER_URL || "https://github.com"}/${process.env.GITHUB_REPOSITORY}/actions/runs/${runId}`;
  writeWorkflowSummary(
    {
      directory: path.resolve(".seo-reports"),
      runId,
      runAttempt: process.env.GITHUB_RUN_ATTEMPT || "",
      runUrl,
      executionDate:
        process.env.SEO_EXECUTION_DATE || "N/A (run metadata unavailable)",
      workflowResult: (process.env.SEO_WORKFLOW_RESULT ||
        "failure") as JobResult,
    },
    process.env.GITHUB_STEP_SUMMARY!
  );
};

if (isSeoCli("prepareWorkflowSummary.ts")) {
  runCli(Promise.resolve().then(prepareWorkflowSummary));
}
