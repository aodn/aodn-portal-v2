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
    expect(sitemap).toContain(`<loc>${BASE_URL}/</loc>`);
    expect(sitemap).toContain(`<loc>${BASE_URL}/details/rec-1</loc>`);
    expect(sitemap).toContain(`<loc>${BASE_URL}/details/rec-2</loc>`);
    expect(sitemap.match(/<loc>/g)).toHaveLength(3);

    // only the record with id, title and description becomes a page
    expect(await readdir(path.join(outDir, "details"))).toEqual(["rec-1"]);
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
