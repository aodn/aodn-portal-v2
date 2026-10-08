/** Build an SES request from downloaded audit reports; no network or delivery. */
import fs from "fs";
import path from "path";
import { isLighthouseCli, runCli, workDir } from "@/lighthouse/cli";
import {
  buildReleaseEmail,
  buildSesEmailPayload,
  parseEmailRecipients,
} from "@/lighthouse/releaseEmail";

type EmailInput = Parameters<typeof buildReleaseEmail>[0];

const readOptional = (file: string) =>
  fs.existsSync(file) ? fs.readFileSync(file, "utf8") : undefined;

export const prepareReleaseEmail = (
  input: Omit<EmailInput, "results" | "reportMarkdown" | "recipients"> & {
    directory: string;
    sender: string;
    recipientConfiguration: string;
  }
) => {
  let results: EmailInput["results"];
  const raw = readOptional(path.join(input.directory, "release-results.json"));
  if (raw) {
    try {
      const parsed = JSON.parse(raw);
      if (
        !["SUCCESS", "ERROR"].includes(parsed.executionStatus) ||
        !["PASS", "FAIL", "INCOMPLETE"].includes(parsed.performanceStatus) ||
        !Array.isArray(parsed.pages) ||
        !parsed.pages.every(
          (page: NonNullable<EmailInput["results"]>["pages"][number]) =>
            page &&
            typeof page.id === "string" &&
            ["mobile", "desktop"].includes(page.formFactor) &&
            ["PASS", "FAIL"].includes(page.status) &&
            Number.isFinite(page.performance) &&
            Array.isArray(page.measuredScores) &&
            Array.isArray(page.metricChecks) &&
            page.metricChecks.every(
              (check) =>
                check &&
                typeof check.metric === "string" &&
                Number.isFinite(check.value) &&
                Number.isFinite(check.threshold) &&
                Array.isArray(check.measuredValues)
            )
        )
      )
        throw new Error("Invalid report status");
      results = parsed;
    } catch {
      console.warn(
        "::warning title=Lighthouse email report::Invalid results file; sending an ERROR notification with the logs link."
      );
    }
  }
  const email = buildReleaseEmail({
    ...input,
    results,
    reportMarkdown: readOptional(path.join(input.directory, "report.md")),
    recipients: parseEmailRecipients(input.recipientConfiguration),
  });
  return buildSesEmailPayload(email, input.sender);
};

const required = (name: string) => {
  const value = process.env[name];
  if (!value?.trim()) throw new Error(`${name} is required`);
  return value;
};

const prepare = async () => {
  const directory = workDir();
  const runUrl = `${process.env.GITHUB_SERVER_URL || "https://github.com"}/${required("GITHUB_REPOSITORY")}/actions/runs/${required("GITHUB_RUN_ID")}`;
  const payload = prepareReleaseEmail({
    directory,
    environment: required("LH_ENVIRONMENT"),
    ref: required("GITHUB_REF_NAME"),
    commit: required("GITHUB_SHA"),
    runUrl,
    artifactUrl:
      process.env.LH_EMAIL_REPORTS_AVAILABLE === "true"
        ? `${runUrl}#artifacts`
        : undefined,
    sender: required("LH_EMAIL_FROM"),
    recipientConfiguration: required("LH_EMAIL_RECIPIENTS"),
  });
  fs.mkdirSync(directory, { recursive: true });
  fs.writeFileSync(
    path.join(directory, "email-ses.json"),
    `${JSON.stringify(payload, null, 2)}\n`,
    "utf8"
  );
};

if (isLighthouseCli("prepareReleaseEmail.ts")) runCli(prepare());
