/**
 * SEO — sitemap URLs use the public site host (BASE_URL), not the OGC fetch
 * host. Record fetching lives in fetchCollections.ts (fetchResultNoStore).
 */

import { describe, expect, test } from "vitest";
import { BASE_URL } from "../constants";
import { toSitemapXml } from "../sitemap";

describe("toSitemapXml", () => {
  test("lists the home page and each details URL on the public host", () => {
    const xml = toSitemapXml(["abc-123"], new Date("2026-01-01T00:00:00Z"));

    expect(xml).toContain(`<loc>${BASE_URL}/</loc>`);
    expect(xml).toContain(`<loc>${BASE_URL}/details/abc-123</loc>`);
    expect(xml).toContain("2026-01-01T00:00:00.000Z");
  });
});
