/** Email content shared by the release notification and its delivery provider. */
import type { buildReleaseReport } from "@/lighthouse/releaseReport";

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
}

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
}: ReleaseEmailInput) => {
  const status =
    !results || results.executionStatus === "ERROR"
      ? "ERROR"
      : results.performanceStatus;
  const subject = `[AODN Portal] Lighthouse ${environment}: ${status} (${ref})`;
  const text = [
    `Release Lighthouse: ${status}`,
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
      "No measurement report was produced. See the failed step in the GitHub Actions logs.",
  ].join("\n");
  // Reuse the complete QA summary instead of duplicating metric validation or
  // hiding the measured runs. A monospace block preserves its tables in email.
  const html = `<p><a href="${escapeHtml(runUrl)}">GitHub Actions summary and logs</a>${artifactUrl ? ` · <a href="${escapeHtml(artifactUrl)}">Download reports</a>` : ""}</p><pre style="white-space:pre-wrap;font-family:monospace">${escapeHtml(text)}</pre>`;
  return { recipients: QA_EMAIL_RECIPIENTS, subject, text, html };
};
