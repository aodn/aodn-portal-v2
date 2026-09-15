/**
 * SEO — runs the CloudFront function exactly as deployed: crawlers must get the
 * pre-rendered page and real users /index.html.
 */

import { describe, expect, test } from "vitest";
import fs from "fs";
import path from "path";
import vm from "vm";
import { PRERENDER_DETAILS_DIR } from "../constants";

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
  test("routes ids containing a dot like any other page", () => {
    // Real ids from the sitemap; a "looks like a file" check would skip them
    expect(
      handler({ request: request("/details/ASAC_2201_HCL_0.5", GOOGLEBOT) }).uri
    ).toBe(`/${PRERENDER_DETAILS_DIR}/ASAC_2201_HCL_0.5/index.html`);
    expect(
      handler({ request: request("/details/survey_1995-96_V3.1", CHROME) }).uri
    ).toBe("/index.html");
  });
});
