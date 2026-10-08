// @vitest-environment node
import { expect, test } from "vitest";
import {
  buildReleaseEmail,
  buildSesEmailPayload,
  parseEmailRecipients,
  QA_EMAIL_RECIPIENTS,
} from "@/lighthouse/releaseEmail";
import { buildReleaseReport } from "@/lighthouse/releaseReport";

const input = {
  environment: "staging",
  ref: "v1.2.3",
  commit: "release-sha",
  runUrl: "https://github.com/aodn/aodn-portal-v2/actions/runs/123",
  artifactUrl:
    "https://github.com/aodn/aodn-portal-v2/actions/runs/123/artifacts/456",
  reportMarkdown: "# Report\nLCP <= 6500 ms\nMeasured runs: 4000, 5000, 6000",
};

const results = () =>
  buildReleaseReport({
    environment: "staging",
    branch: "v1.2.3",
    commit: "release-sha",
    apiHost: "https://example.org",
    generatedAt: "2026-10-07",
    runs: 3,
    routes: {},
  }).results;

test.each(["PASS", "FAIL"] as const)(
  "email reports %s independently of execution success",
  (performanceStatus) => {
    const email = buildReleaseEmail({
      ...input,
      results: { ...results(), performanceStatus },
    });
    expect(email.subject).toContain(`staging: ${performanceStatus} (v1.2.3)`);
    expect(email.text).toContain("Execution status: SUCCESS");
    expect(email.text).toContain(`Performance status: ${performanceStatus}`);
    expect(email.text).toContain(input.commit);
    expect(email.text).toContain(input.runUrl);
    expect(email.text).toContain(input.artifactUrl);
    expect(email.text).toContain(input.reportMarkdown);
    expect(email.recipients).toEqual(QA_EMAIL_RECIPIENTS);
    expect(email.recipients).toHaveLength(5);
  }
);

test("execution error takes precedence over an earlier performance failure", () => {
  const email = buildReleaseEmail({
    ...input,
    results: {
      ...results(),
      executionStatus: "ERROR",
      performanceStatus: "FAIL",
      executionError: "Chrome failed",
    },
  });
  expect(email.subject).toContain(": ERROR");
  expect(email.text).toContain("Execution status: ERROR");
  expect(email.text).toContain("Performance status: FAIL");
});

test("setup failures without reports still provide an error notification and log link", () => {
  const email = buildReleaseEmail({
    ...input,
    artifactUrl: undefined,
    reportMarkdown: undefined,
  });
  expect(email.subject).toContain(": ERROR");
  expect(email.text).toContain("Performance status: INCOMPLETE");
  expect(email.text).toContain("No measurement report was produced");
  expect(email.text).toContain(input.runUrl);
});

test("report content is escaped in HTML email", () => {
  const email = buildReleaseEmail({
    ...input,
    reportMarkdown: '<script>alert("x")</script>&',
  });
  expect(email.html).not.toContain("<script>");
  expect(email.html).toContain("&lt;script&gt;");
  expect(email.html).toContain("&amp;");
});

test("explicit recipients override the QA list without changing the preserved defaults", () => {
  const email = buildReleaseEmail({
    ...input,
    recipients: parseEmailRecipients("test@example.org"),
  });
  expect(email.recipients).toEqual([
    { name: "test@example.org", address: "test@example.org" },
  ]);
  expect(QA_EMAIL_RECIPIENTS).toHaveLength(5);
  expect(
    QA_EMAIL_RECIPIENTS.some(({ address }) => address === "test@example.org")
  ).toBe(false);
});

test("recipient configuration accepts delimiters, trims and deduplicates addresses", () => {
  expect(
    parseEmailRecipients(" One@example.org, two@example.org;\nONE@example.org ")
  ).toEqual([
    { name: "one@example.org", address: "one@example.org" },
    { name: "two@example.org", address: "two@example.org" },
  ]);
});

test.each(["", " , ; ", "invalid", "a@example.org\rb@example.org"])(
  "invalid recipient configuration %s cannot fall back to QA",
  (configuration) => {
    expect(() => parseEmailRecipients(configuration)).toThrow();
  }
);

test("SES request preserves the email content and uses UTF-8 text and HTML", () => {
  const email = buildReleaseEmail({
    ...input,
    recipients: parseEmailRecipients("test@example.org"),
  });
  expect(buildSesEmailPayload(email, "sender@example.org")).toEqual({
    Source: "sender@example.org",
    Destination: { ToAddresses: ["test@example.org"] },
    Message: {
      Subject: { Data: email.subject, Charset: "UTF-8" },
      Body: {
        Text: { Data: email.text, Charset: "UTF-8" },
        Html: { Data: email.html, Charset: "UTF-8" },
      },
    },
  });
});

test("SES rejects missing recipients and an invalid sender", () => {
  expect(() =>
    buildSesEmailPayload(
      buildReleaseEmail({ ...input, recipients: [] }),
      "sender@example.org"
    )
  ).toThrow(/recipient/);
  expect(() =>
    buildSesEmailPayload(buildReleaseEmail(input), "invalid")
  ).toThrow(/valid plain email/);
});
