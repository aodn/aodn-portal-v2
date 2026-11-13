/**
 * SEO — runs the viewer-response CloudFront function exactly as deployed. A
 * crawler asking for a record with no pre-rendered page must get 404; real
 * users must keep the app shell with 200, whatever the record.
 */

import { describe, expect, test } from "vitest";
import fs from "fs";
import path from "path";
import vm from "vm";
import { CRAWLER_UA } from "../constants";

const FUNCTIONS_DIR = path.resolve(
  __dirname,
  "../../../artifacts/functions/cloudfront"
);
const THIS_FUNCTION = path.join(
  FUNCTIONS_DIR,
  "aodn_portal_frontend_404_on_missing_page.js"
);
const ROUTING_FUNCTION = path.join(
  FUNCTIONS_DIR,
  "aodn_portal_frontend_route_by_user_agent.js"
);

type Headers = Record<string, { value: string }>;
type Response = { statusCode: number; headers: Headers };
type Event = { request: { uri: string; headers: Headers }; response: Response };

// CloudFront Functions have no module system: the file declares a global
// `handler`, so run it in a bare context and pick the function up from there.
const context = vm.createContext({});
vm.runInContext(fs.readFileSync(THIS_FUNCTION, "utf8"), context);
const handler: (event: Event) => Response = context.handler;

const GOOGLEBOT = "Mozilla/5.0 (compatible; Googlebot/2.1)";
const CHROME = "Mozilla/5.0 (Macintosh) AppleWebKit/537.36 Chrome/126.0.0.0";

// What S3 sends back: the marker is on every page the publish step uploads
const PAGE_FOUND: Headers = { "x-amz-meta-prerendered": { value: "1" } };
const PAGE_MISSING: Headers = {};

const statusSeenBy = (userAgent: string | undefined, fromS3: Headers) =>
  handler({
    request: {
      uri: "/details/009a1131-efc1-4a61-8f90-cf289e7c043d",
      headers:
        userAgent === undefined ? {} : { "user-agent": { value: userAgent } },
    },
    response: { statusCode: 200, headers: fromS3 },
  }).statusCode;

describe("404 on missing page", () => {
  test("a crawler gets 404 when the page is missing", () => {
    expect(statusSeenBy(GOOGLEBOT, PAGE_MISSING)).toBe(404);
  });

  test("a crawler gets 200 when the page is there", () => {
    expect(statusSeenBy(GOOGLEBOT, PAGE_FOUND)).toBe(200);
  });

  test("seo:verify counts as a crawler, or it can never catch a miss", () => {
    expect(statusSeenBy(CRAWLER_UA, PAGE_MISSING)).toBe(404);
  });

  test("a real user keeps 200, so the app can show 'Record not found'", () => {
    expect(statusSeenBy(CHROME, PAGE_MISSING)).toBe(200);
  });

  test("a request with no user agent counts as a real user", () => {
    expect(statusSeenBy(undefined, PAGE_MISSING)).toBe(200);
  });

  test("both functions carry the same crawler list, word for word", () => {
    const crawlerList = (file: string) =>
      fs
        .readFileSync(file, "utf8")
        .match(/const CRAWLER_TOKENS = \[.*?\];/s)?.[0];

    expect(crawlerList(THIS_FUNCTION)).toBe(crawlerList(ROUTING_FUNCTION));
  });
});
