/**
 * SEO — sitemap URLs use the public site host (BASE_URL), not the OGC fetch
 * host. Record fetching lives in fetchCollections.ts (fetchResultNoStore).
 */

import { describe, expect, test } from "vitest";
import { mkdtemp, readFile } from "fs/promises";
import os from "os";
import path from "path";
import { OGCCollection } from "@/app/store/OGCCollectionDefinitions";
import { BASE_URL } from "../constants";
import { generateSitemap, toSitemapXml } from "../sitemap";

describe("toSitemapXml", () => {
  test("lists the home page and each details URL on the public host", () => {
    const xml = toSitemapXml(
      [{ id: "abc-123" }],
      new Date("2026-01-01T00:00:00Z")
    );

    expect(xml).toContain(`<url><loc>${BASE_URL}/</loc></url>`);
    expect(xml).toContain(`<url><loc>${BASE_URL}/details/abc-123</loc></url>`);
    expect(xml).toContain("2026-01-01T00:00:00.000Z");
  });

  test("carries the record's revision date as lastmod", () => {
    const xml = toSitemapXml([{ id: "abc-123", lastmod: "2026-08-12" }]);

    expect(xml).toContain(
      `<url><loc>${BASE_URL}/details/abc-123</loc><lastmod>2026-08-12</lastmod></url>`
    );
  });
});

const toCollection = (data: Record<string, unknown>) =>
  Object.assign(new OGCCollection(), data);

const generate = async (collections: OGCCollection[]) => {
  const outDir = await mkdtemp(path.join(os.tmpdir(), "sitemap-"));
  await generateSitemap(outDir, collections);
  return readFile(path.join(outDir, "sitemap.xml"), "utf8");
};

describe("generateSitemap", () => {
  test("takes lastmod from the revision timestamp, date only", async () => {
    const xml = await generate([
      toCollection({
        id: "abc-123",
        properties: { revision: "2026-08-12T15:24:43" },
      }),
    ]);

    expect(xml).toContain(
      `<loc>${BASE_URL}/details/abc-123</loc><lastmod>2026-08-12</lastmod>`
    );
    // the home page changes with releases, not with the records
    expect(xml).toContain(`<loc>${BASE_URL}/</loc></url>`);
  });

  test("omits lastmod when the revision is missing or not a date", async () => {
    const xml = await generate([
      toCollection({ id: "def-456" }),
      toCollection({ id: "ghi-789", properties: { revision: "unknown" } }),
    ]);

    expect(xml).toContain(`<loc>${BASE_URL}/details/def-456</loc></url>`);
    expect(xml).toContain(`<loc>${BASE_URL}/details/ghi-789</loc></url>`);
    expect(xml).not.toContain("<lastmod>");
  });
});
