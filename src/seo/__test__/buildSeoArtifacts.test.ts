/**
 * Pipeline test on controlled data: mocks the API (the only external input),
 * runs the real fetch → browse → sitemap → prerender chain into a temp dir,
 * then asserts the files on disk. Mirrors buildSeoArtifacts.ts, which cannot
 * be imported directly — importing it runs the build.
 */

import { mkdtemp, readFile, readdir, writeFile } from "fs/promises";
import { tmpdir } from "os";
import path from "path";
import { afterEach, beforeEach, describe, expect, test, vi } from "vitest";
import { ogcAxiosWithRetry } from "@/app/store/searchReducer";
import { generateBrowsePages } from "../browse";
import { fetchCollections } from "../fetchCollections";
import { generateSitemap } from "../sitemap";
import { prerenderDetailPages } from "../prerender";
import { checkDetailPage, checkSitemap } from "../verifySeoArtifacts";
import { BASE_URL } from "../constants";

const TEMPLATE =
  '<!doctype html><html lang="en"><head><title>AODN Portal</title></head><body><div id="root"></div></body></html>';

const themed = (id: string, title: string) => ({
  id,
  title,
  description: `About ${title}.`,
  properties: {
    themes: [{ scheme: "theme", concepts: [{ id: "Ocean Temperature" }] }],
  },
});

const page = {
  total: 4,
  collections: [
    themed("rec-1", "Sea Surface Temperature"),
    themed("rec-2", "Mooring Temperatures"),
    themed("rec-3", "Satellite SST"),
    // no description: sitemap lists it, prerender and browse skip it
    { id: "rec-4", title: "Half-filled record" },
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

  test("writes the browse, sitemap and detail pages the verifier accepts", async () => {
    const collections = await fetchCollections();
    const browseUrls = await generateBrowsePages(outDir, collections);
    await generateSitemap(outDir, collections, browseUrls);
    await prerenderDetailPages(outDir, collections);

    const sitemap = await readFile(path.join(outDir, "sitemap.xml"), "utf8");
    expect(sitemap).toContain(`<loc>${BASE_URL}/</loc>`);
    expect(sitemap).toContain(`<loc>${BASE_URL}/details/rec-1</loc>`);
    expect(sitemap).toContain(`<loc>${BASE_URL}/details/rec-4</loc>`);
    expect(sitemap).toContain(
      `<loc>${BASE_URL}/browse/ocean-temperature</loc>`
    );
    expect(sitemap.match(/<loc>/g)).toHaveLength(6);

    // only records with id, title and description are paged and linked
    expect(await readdir(path.join(outDir, "browse"))).toEqual([
      "ocean-temperature",
    ]);
    const browsePage = await readFile(
      path.join(outDir, "browse", "ocean-temperature"),
      "utf8"
    );
    expect(browsePage).toContain(
      `<a href="${BASE_URL}/details/rec-1">Sea Surface Temperature</a>`
    );
    expect(browsePage).toContain(`<a href="${BASE_URL}/details/rec-3">`);
    expect(browsePage).not.toContain("rec-4");

    expect(await readdir(path.join(outDir, "details"))).toEqual([
      "rec-1",
      "rec-2",
      "rec-3",
    ]);
    const detailPage = await readFile(
      path.join(outDir, "details", "rec-1"),
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
});
