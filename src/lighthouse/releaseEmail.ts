/** Email content shared by the release notification and its delivery provider. */
import { formatMetricValue } from "@/lighthouse/metrics";
import type { buildReleaseReport } from "@/lighthouse/releaseReport";

// Preserve existing imports for Lighthouse callers.
export { buildSesEmailPayload, parseEmailRecipients } from "@/utils/EmailUtils";

export const QA_EMAIL_RECIPIENTS = [
  { name: "Man Fai Ng", address: "manfai.ng@utas.edu.au" },
  { name: "Nirali Pandya", address: "nirali.pandya@utas.edu.au" },
  { name: "Md Ashraful Rahman", address: "mdashraful.rahman@utas.edu.au" },
  { name: "Victoria Isaac", address: "victoria.isaac@utas.edu.au" },
  { name: "Alex McKeown", address: "a.mckeown@utas.edu.au" },
];

type ReleaseResults = ReturnType<typeof buildReleaseReport>["results"];

interface ReleaseEmailInput {
  environment: string;
  ref: string;
  commit: string;
  runUrl: string;
  artifactUrl?: string;
  reportMarkdown?: string;
  results?: ReleaseResults;
  recipients?: typeof QA_EMAIL_RECIPIENTS;
}

const resultDetails = (results?: ReleaseResults) =>
  results?.pages
    .flatMap((page) => [
      `${page.id} (${page.formFactor}): ${page.status} — ${page.url}`,
      `Performance: ${formatMetricValue(page.performance)}/100; minimum ${page.threshold}; measured runs: ${page.measuredScores.map(formatMetricValue).join(", ")}`,
      ...page.metricChecks.map(
        (check) =>
          `${check.metric.toUpperCase()}: ${formatMetricValue(check.value)} ${check.unit}; maximum ${formatMetricValue(check.threshold)} ${check.unit}; ${check.status}; measured runs: ${check.measuredValues.map(formatMetricValue).join(", ")}`
      ),
    ])
    .join("\n");

const escapeHtml = (text: string) =>
  text.replace(/[&<>"']/g, (character) => {
    const entities: Record<string, string> = {
      "&": "&amp;",
      "<": "&lt;",
      ">": "&gt;",
      '"': "&quot;",
      "'": "&#39;",
    };
    return entities[character];
  });

export const buildReleaseEmail = ({
  environment,
  ref,
  commit,
  runUrl,
  artifactUrl,
  reportMarkdown,
  results,
  recipients = QA_EMAIL_RECIPIENTS,
}: ReleaseEmailInput) => {
  const status =
    !results || results.executionStatus === "ERROR"
      ? "ERROR"
      : results.performanceStatus;
  const subject = `[AODN Portal] Lighthouse ${environment}: ${status} (${ref})`;
  const text = [
    `Release Performance Audit (Lighthouse): ${status}`,
    `Environment: ${environment}`,
    `Release/ref: ${ref}`,
    `SHA: ${commit}`,
    `Execution status: ${results?.executionStatus || "ERROR"}`,
    `Performance status: ${results?.performanceStatus || "INCOMPLETE"}`,
    ...(results?.executionError
      ? [`Execution error: ${results.executionError}`]
      : []),
    "",
    "This audit does not block deployment or release.",
    `GitHub Actions summary and logs: ${runUrl}`,
    artifactUrl
      ? `Download reports: ${artifactUrl}`
      : `Reports, when available, are listed under Artifacts: ${runUrl}`,
    "",
    reportMarkdown ||
      resultDetails(results) ||
      "No measurement report was produced. See the failed step in the GitHub Actions logs.",
  ].join("\n");
  // Reuse the complete QA summary instead of duplicating metric validation or
  // hiding the measured runs. A monospace block preserves its tables in email.
  const html = `<p><a href="${escapeHtml(runUrl)}">GitHub Actions summary and logs</a>${artifactUrl ? ` · <a href="${escapeHtml(artifactUrl)}">Download reports</a>` : ""}</p><pre style="white-space:pre-wrap;font-family:monospace">${escapeHtml(text)}</pre>`;
  return { recipients, subject, text, html };
};
