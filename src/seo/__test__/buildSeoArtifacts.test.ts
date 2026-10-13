/**
 * Pipeline test on controlled data: mocks the API (the only external input),
 * runs the real fetch → sitemap → prerender chain into a temp dir, then
 * asserts the files on disk. Mirrors buildSeoArtifacts.ts, which cannot be
 * imported directly — importing it runs the build.
 */

import { mkdtemp, readFile, readdir, writeFile } from "fs/promises";
import { tmpdir } from "os";
import path from "path";
import { afterEach, beforeEach, describe, expect, test, vi } from "vitest";
import { http, HttpResponse } from "msw";
import { setupServer } from "msw/node";
import { ogcAxiosWithRetry } from "@/app/store/searchReducer";
import { fetchCollections } from "../fetchCollections";
import { generateSitemap } from "../sitemap";
import { prerenderDetailPages } from "../prerender";
import { checkDetailPage, checkSitemap } from "../verifySeoArtifacts";
import { BASE_URL } from "../constants";

const TEMPLATE =
  '<!doctype html><html lang="en"><head><title>AODN Portal</title></head><body><div id="root"></div></body></html>';

const page = {
  total: 2,
  collections: [
    {
      id: "rec-1",
      title: "Sea Surface Temperature",
      description: "Daily SST observations around Australia.",
      properties: { revision: "2026-08-12T15:24:43" },
    },
    // no description: sitemap lists it, prerender skips it
    { id: "rec-2", title: "Half-filled record" },
  ],
  search_after: [],
};

describe("the artifacts pipeline on controlled data", () => {
  let outDir: string;

  beforeEach(async () => {
    vi.spyOn(ogcAxiosWithRetry, "get").mockResolvedValue({
      data: page,
    } as never);
    outDir = await mkdtemp(path.join(tmpdir(), "seo-artifacts-"));
    await writeFile(path.join(outDir, "index.html"), TEMPLATE);
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  test("writes the sitemap and detail pages the verifier accepts", async () => {
    const collections = await fetchCollections();
    await generateSitemap(outDir, collections);
    await prerenderDetailPages(outDir, collections);

    const sitemap = await readFile(path.join(outDir, "sitemap.xml"), "utf8");
    expect(sitemap).toContain(`<loc>${BASE_URL}/</loc></url>`);
    expect(sitemap).toContain(
      `<loc>${BASE_URL}/details/rec-1</loc><lastmod>2026-08-12</lastmod>`
    );
    expect(sitemap).toContain(`<loc>${BASE_URL}/details/rec-2</loc></url>`);
    expect(sitemap.match(/<loc>/g)).toHaveLength(3);

    // only the record with id, title and description becomes a page
    const detailsDir = path.join(outDir, "prerender", "details");
    expect(await readdir(detailsDir)).toEqual(["rec-1"]);
    const detailPage = await readFile(
      path.join(detailsDir, "rec-1", "index.html"),
      "utf8"
    );
    expect(detailPage).toContain(
      "<title>Sea Surface Temperature | AODN Portal</title>"
    );
    expect(detailPage).toContain(
      `<link rel="canonical" href="${BASE_URL}/details/rec-1" />`
    );

    // the same checks the publish gate runs, against this controlled output
    expect(checkSitemap(sitemap, 2).problems).toEqual([]);
    expect(checkDetailPage(detailPage, "rec-1")).toEqual([]);
  });

  test("the build entry point writes no artifacts when fetching is incomplete", async () => {
    vi.restoreAllMocks();
    const server = setupServer(
      http.get("*/api/v1/ogc/collections", () =>
        HttpResponse.json({ total: 3, collections: page.collections })
      )
    );
    server.listen({ onUnhandledRequest: "error" });
    vi.doMock("@/seo/cli", () => ({ seoDistDir: () => outDir }));
    vi.doMock("@/seo/constants", async () => ({
      ...(await vi.importActual("@/seo/constants")),
      OGC_API_BASE: "http://localhost",
    }));

    try {
      await expect(import("@/seo/buildSeoArtifacts")).rejects.toThrow(
        /missing required search_after cursor; fetched 2\/3/
      );
      expect(await readdir(outDir)).toEqual(["index.html"]);
      expect(await readFile(path.join(outDir, "index.html"), "utf8")).toBe(
        TEMPLATE
      );
    } finally {
      server.close();
      vi.doUnmock("@/seo/cli");
      vi.doUnmock("@/seo/constants");
    }
  });
});
