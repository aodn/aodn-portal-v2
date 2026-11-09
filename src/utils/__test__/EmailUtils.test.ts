// @vitest-environment node
import { expect, test } from "vitest";
import { buildSesEmailPayload, parseEmailRecipients } from "@/utils/EmailUtils";
import {
  buildSesEmailPayload as lighthousePayload,
  parseEmailRecipients as lighthouseRecipients,
} from "@/lighthouse/releaseEmail";

test("Lighthouse preserves its existing shared utility exports", () => {
  expect(lighthousePayload).toBe(buildSesEmailPayload);
  expect(lighthouseRecipients).toBe(parseEmailRecipients);
});

test("SES accepts workflow email content with explicitly configured recipients", () => {
  const email = {
    recipients: parseEmailRecipients("qa-one@example.org;QA-TWO@example.org"),
    subject: "[AODN Portal] SEO Report: SUCCESS",
    text: "SEO Workflow Report",
    html: "<p>SEO Workflow Report</p>",
  };
  expect(buildSesEmailPayload(email, " sender@example.org ")).toEqual({
    Source: "sender@example.org",
    Destination: {
      ToAddresses: ["qa-one@example.org", "qa-two@example.org"],
    },
    Message: {
      Subject: { Data: email.subject, Charset: "UTF-8" },
      Body: {
        Text: { Data: email.text, Charset: "UTF-8" },
        Html: { Data: email.html, Charset: "UTF-8" },
      },
    },
  });
});
