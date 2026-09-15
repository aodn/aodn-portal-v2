/**
 * SEO — runs the CloudFront function exactly as deployed: crawlers must get the
 * pre-rendered page, real users /index.html, and the verify UA must count as a
 * crawler or seo:verify can never pass.
 */

import { describe, expect, test } from "vitest";
import fs from "fs";
import path from "path";
import vm from "vm";
import { CRAWLER_UA, PRERENDER_DETAILS_DIR } from "../constants";

const FUNCTION_FILE = path.resolve(
  __dirname,
  "../../../artifacts/functions/cloudfront/aodn_portal_frontend_route_by_user_agent.js"
);

type Request = { uri: string; headers: Record<string, { value: string }> };

// CloudFront Functions have no module system: the file declares a global
// `handler`, so run it in a bare context and pick the function up from there.
const context = vm.createContext({});
vm.runInContext(fs.readFileSync(FUNCTION_FILE, "utf8"), context);
const handler: (event: { request: Request }) => Request = context.handler;

const request = (uri: string, userAgent?: string): Request => ({
  uri,
  headers:
    userAgent === undefined ? {} : { "user-agent": { value: userAgent } },
});

const GOOGLEBOT =
  "Mozilla/5.0 (compatible; Googlebot/2.1; +http://www.google.com/bot.html)";
const CHROME =
  "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/126.0.0.0 Safari/537.36";

describe("route by user agent", () => {
  test("sends crawlers to the pre-rendered page", () => {
    const crawlers = [
      CRAWLER_UA,
      GOOGLEBOT,
      "Mozilla/5.0 (compatible; bingbot/2.0; +http://www.bing.com/bingbot.htm)",
      "Mozilla/5.0 AppleWebKit/537.36 (KHTML, like Gecko); compatible; GPTBot/1.0",
      "Mozilla/5.0 (compatible; ClaudeBot/1.0; +claudebot@anthropic.com)",
      "facebookexternalhit/1.1 (+http://www.facebook.com/externalhit_uatext.php)",
      "GOOGLEBOT", // matched case-insensitively
    ];
    for (const ua of crawlers) {
      expect(handler({ request: request("/details/abc-123", ua) }).uri).toBe(
        `/${PRERENDER_DETAILS_DIR}/abc-123/index.html`
      );
    }
  });

  test("sends real users to the app shell", () => {
    const browsers = [
      CHROME,
      "Mozilla/5.0 (iPhone; CPU iPhone OS 17_5 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.5 Mobile/15E148 Safari/604.1",
      "Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:127.0) Gecko/20100101 Firefox/127.0",
    ];
    for (const ua of browsers) {
      expect(handler({ request: request("/details/abc-123", ua) }).uri).toBe(
        "/index.html"
      );
    }
  });

  test("treats a request without a user-agent as a real user", () => {
    expect(handler({ request: request("/details/abc-123") }).uri).toBe(
      "/index.html"
    );
  });

  test("accepts a trailing slash", () => {
    expect(
      handler({ request: request("/details/abc-123/", GOOGLEBOT) }).uri
    ).toBe(`/${PRERENDER_DETAILS_DIR}/abc-123/index.html`);
    expect(handler({ request: request("/details/abc-123/", CHROME) }).uri).toBe(
      "/index.html"
    );
  });

  test("routes ids containing a dot like any other page", () => {
    // Real ids from the sitemap; a "looks like a file" check would skip them
    expect(
      handler({ request: request("/details/ASAC_2201_HCL_0.5", GOOGLEBOT) }).uri
    ).toBe(`/${PRERENDER_DETAILS_DIR}/ASAC_2201_HCL_0.5/index.html`);
    expect(
      handler({ request: request("/details/survey_1995-96_V3.1", CHROME) }).uri
    ).toBe("/index.html");
  });

  test("leaves everything else untouched, whoever asks", () => {
    const untouched = [
      "/",
      "/details",
      "/details/",
      "/details/abc-123/extra",
      "/assets/index-abc123.js",
      "/robots.txt",
      `/${PRERENDER_DETAILS_DIR}/abc-123/index.html`,
    ];
    for (const uri of untouched) {
      expect(handler({ request: request(uri, GOOGLEBOT) }).uri).toBe(uri);
      expect(handler({ request: request(uri, CHROME) }).uri).toBe(uri);
    }
  });

  test("returns the request object CloudFront expects", () => {
    const event = { request: request("/details/abc-123", GOOGLEBOT) };
    expect(handler(event)).toBe(event.request);
  });
});
