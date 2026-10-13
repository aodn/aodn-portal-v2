/** Reporting data only: generation and deployment keep their existing behavior. */
export const SEO_ENVIRONMENTS = ["edge", "staging", "production"] as const;
export type SeoEnvironment = (typeof SEO_ENVIRONMENTS)[number];
export type JobResult = "success" | "failure" | "cancelled" | "skipped";
export type StepResult = JobResult;

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
}

const isResult = (value: unknown): value is JobResult =>
  ["success", "failure", "cancelled", "skipped"].includes(String(value));

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
    ![
      report.publishJob,
      report.verifyJob,
      report.generation,
      report.localVerification,
      report.publishing,
      report.verification,
    ].every(isResult) ||
    ![report.generated, report.published, report.verified].every(isCounts) ||
    !Array.isArray(report.errors) ||
    !report.errors.every((error) => typeof error === "string") ||
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
