/**
 * SEO — the verifier must accept exactly what renderCrawlerPage produces, so a valid
 * page is built with the real generator rather than a hand-written fixture.
 */

import { afterEach, describe, expect, test, vi } from "vitest";
import { mkdtemp, mkdir, rm, writeFile } from "fs/promises";
import { tmpdir } from "os";
import path from "path";
import { toSitemapXml } from "@/seo/sitemap";
import { OGCCollection } from "@/app/store/OGCCollectionDefinitions";
import { BASE_URL } from "../constants";
import { renderCrawlerPage } from "../prerender";
import {
  verifyDist,
  checkDetailPage,
  checkHomePage,
  checkRobotsTxt,
  checkSitemap,
} from "../verifySeoArtifacts";

const template =
  "<!doctype html><html lang='en'><head><title>AODN Portal</title>" +
  '<meta name="description" content="site-wide" />' +
  '</head><body><div id="root"></div></body></html>';

const collection = Object.assign(new OGCCollection(), {
  id: "abc-123",
  title: "Sea Surface Temperature",
  description: "Gridded SST records.",
});

describe("checkDetailPage", () => {
  test("passes the exact output of renderCrawlerPage", () => {
    const page = renderCrawlerPage(template, collection);
    expect(checkDetailPage(page, "abc-123")).toEqual([]);
  });

  test("passes a dated record whose visible date matches the JSON-LD", () => {
    const dated = Object.assign(new OGCCollection(), {
      id: "abc-123",
      title: "Sea Surface Temperature",
      description: "Gridded SST records.",
      properties: { revision: "2026-08-12T15:24:43" },
    });

    expect(
      checkDetailPage(renderCrawlerPage(template, dated), "abc-123")
    ).toEqual([]);
  });

  test("flags a page whose visible date no longer matches the JSON-LD", () => {
    const dated = Object.assign(new OGCCollection(), {
      id: "abc-123",
      title: "Sea Surface Temperature",
      description: "Gridded SST records.",
      properties: { revision: "2026-08-12T15:24:43" },
    });
    const page = renderCrawlerPage(template, dated).replace(
      "<p>Updated: 2026-08-12</p>",
      ""
    );

    expect(checkDetailPage(page, "abc-123")).toContain(
      "visible date does not match the JSON-LD dates"
    );
  });

  test("flags a page that kept the generic site title", () => {
    expect(checkDetailPage(template, "abc-123")).toContain(
      "title is missing or still the generic site title"
    );
  });

  test("flags the full shell title the live site serves on a rewrite miss", () => {
    const shell = template.replace(
      "<title>AODN Portal</title>",
      "<title>AODN Portal – Australian Ocean Data Network</title>"
    );
    expect(checkDetailPage(shell, "abc-123")).toContain(
      "title is missing or still the generic site title"
    );
  });

  test("flags a canonical pointing at a different record", () => {
    const page = renderCrawlerPage(template, collection);
    expect(checkDetailPage(page, "other-uuid")).toContain(
      "canonical does not point at this record"
    );
  });

  test("flags JSON-LD that no longer parses", () => {
    const page = renderCrawlerPage(template, collection).replace(
      '"@type":"Dataset"',
      '"@type":"Dataset",,'
    );
    expect(checkDetailPage(page, "abc-123")).toContain(
      "Dataset JSON-LD is not valid JSON"
    );
  });

  test("flags a page without social preview tags", () => {
    const page = renderCrawlerPage(template, collection).replace(
      /<meta property="og:[^>]*>/g,
      ""
    );
    expect(checkDetailPage(page, "abc-123")).toContain(
      "social preview (Open Graph) tags are missing"
    );
  });

  test("flags a page that lost the content container", () => {
    const page = renderCrawlerPage(template, collection).replace(
      '<div id="root">',
      "<div>"
    );
    expect(checkDetailPage(page, "abc-123")).toContain(
      "page is missing the content container"
    );
  });

  test("flags a page that does not link back to the home page", () => {
    const page = renderCrawlerPage(template, collection).replace(
      '<a href="/">',
      "<span>"
    );
    expect(checkDetailPage(page, "abc-123")).toContain(
      "body does not link back to the home page"
    );
  });

  test("flags a page that still ships the app bundle", () => {
    const page = renderCrawlerPage(template, collection).replace(
      "</body>",
      '<script type="module" crossorigin src="/assets/index-abc.js"></script></body>'
    );
    expect(checkDetailPage(page, "abc-123")).toContain(
      "ships the app bundle, which erases the body on render"
    );
  });
});

describe("checkSitemap", () => {
  const sitemapXml = (locs: string[]) =>
    '<?xml version="1.0" encoding="UTF-8"?>\n<urlset>' +
    locs.map((loc) => `<url><loc>${loc}</loc></url>`).join("") +
    "</urlset>";

  test("accepts a sitemap with the home page and enough URLs", () => {
    const xml = sitemapXml([`${BASE_URL}/`, `${BASE_URL}/details/abc-123`]);
    const { urls, problems } = checkSitemap(xml, 2);

    expect(problems).toEqual([]);
    expect(urls).toEqual([`${BASE_URL}/`, `${BASE_URL}/details/abc-123`]);
  });

  test("flags URLs on a foreign host", () => {
    const xml = sitemapXml([`${BASE_URL}/`, "https://evil.example/page"]);
    const { problems } = checkSitemap(xml, 2);

    expect(problems).toEqual([
      `1 URLs are not under ${BASE_URL}, e.g. https://evil.example/page`,
    ]);
  });

  test("flags a sitemap missing the home page", () => {
    const { problems } = checkSitemap(sitemapXml([`${BASE_URL}/details/a`]), 1);
    expect(problems).toContain("is missing the home page");
  });

  test("flags a sitemap that lost most of its URLs", () => {
    const { problems } = checkSitemap(sitemapXml([`${BASE_URL}/`]), 2);
    expect(problems).toContain("has 1 URLs, expected at least 2");
  });
});

describe("checkHomePage", () => {
  const homePage = (extraHeadTags: string) =>
    "<!doctype html><html lang='en'><head><title>AODN Portal</title>" +
    '<meta name="description" content="Open access" />' +
    `${extraHeadTags}</head><body><div id="root"></div></body></html>`;
  const NOINDEX = '<meta name="robots" content="noindex, nofollow" />';

  test("non-prod needs the noindex tag", () => {
    expect(checkHomePage(homePage(NOINDEX), false)).toEqual([]);
    expect(checkHomePage(homePage(""), false)).toEqual([
      "non-prod must carry noindex so Google drops it",
    ]);
  });

  test("production must not have the noindex tag", () => {
    expect(checkHomePage(homePage(""), true)).toEqual([]);
    expect(checkHomePage(homePage(NOINDEX), true)).toEqual([
      "production must not carry noindex",
    ]);
  });

  test("flags a missing meta description", () => {
    const page = homePage(NOINDEX).replace(
      /<meta name="description"[^>]*>/,
      ""
    );
    expect(checkHomePage(page, false)).toEqual([
      "meta description is missing or empty",
    ]);
  });
});

describe("checkRobotsTxt", () => {
  test("flags Disallow: / — a blocked page can never be de-indexed", () => {
    expect(checkRobotsTxt("User-agent: *\nDisallow: /\n", false)).toEqual([
      'blocks all crawling ("Disallow: /")',
    ]);
  });

  test("allows path-specific Disallow rules", () => {
    expect(checkRobotsTxt("User-agent: *\nDisallow: /admin\n", false)).toEqual(
      []
    );
  });

  test("production must reference the sitemap", () => {
    expect(checkRobotsTxt("User-agent: *\nAllow: /\n", true)).toEqual([
      "production robots.txt should point at the sitemap",
    ]);
    expect(
      checkRobotsTxt(
        `User-agent: *\nAllow: /\nSitemap: ${BASE_URL}/sitemap.xml\n`,
        true
      )
    ).toEqual([]);
  });
});

describe("local artifact consistency", () => {
  const dirs: string[] = [];
  afterEach(async () => {
    vi.restoreAllMocks();
    await Promise.all(
      dirs.splice(0).map((dir) => rm(dir, { recursive: true }))
    );
  });

  const artifacts = async (sitemapIds: string[], pageIds: string[]) => {
    const dir = await mkdtemp(path.join(tmpdir(), "seo-verify-"));
    dirs.push(dir);
    await writeFile(
      path.join(dir, "sitemap.xml"),
      toSitemapXml(sitemapIds.map((id) => ({ id })))
    );
    await Promise.all(
      pageIds.map(async (id) => {
        const pageDir = path.join(dir, "prerender/details", id);
        await mkdir(pageDir, { recursive: true });
        await writeFile(
          path.join(pageDir, "index.html"),
          renderCrawlerPage(
            template,
            Object.assign(new OGCCollection(), collection, { id })
          )
        );
      })
    );
    return dir;
  };

  test("accepts matching sets and excludes the homepage", async () => {
    await expect(
      verifyDist(await artifacts(["abc-123"], ["abc-123"]), 1)
    ).resolves.toBeUndefined();
  });

  test("rejects a sitemap URL without a prerender", async () => {
    const error = vi.spyOn(console, "error").mockImplementation(() => {});
    await expect(
      verifyDist(await artifacts(["abc-123", "missing"], ["abc-123"]), 1)
    ).rejects.toThrow("problems found");
    expect(error).toHaveBeenCalledWith(
      expect.stringContaining(
        `${BASE_URL}/details/missing has no corresponding prerender index.html`
      )
    );
  });

  test("rejects an unsampled prerender without a sitemap entry", async () => {
    const ids = Array.from(
      { length: 50 },
      (_, i) => `record-${String(i).padStart(2, "0")}`
    );
    const error = vi.spyOn(console, "error").mockImplementation(() => {});
    await expect(
      verifyDist(
        await artifacts(
          ids.filter((id) => id !== "record-01"),
          ids
        ),
        1
      )
    ).rejects.toThrow("problems found");
    expect(error).toHaveBeenCalledWith(
      expect.stringContaining(
        `${BASE_URL}/details/record-01: prerender index.html is not listed`
      )
    );
  });

  test("rejects a directory without index.html", async () => {
    const dir = await artifacts(["abc-123", "missing"], ["abc-123"]);
    await mkdir(path.join(dir, "prerender/details/missing"));
    const error = vi.spyOn(console, "error").mockImplementation(() => {});
    await expect(verifyDist(dir, 1)).rejects.toThrow("problems found");
    expect(error).toHaveBeenCalledWith(
      expect.stringContaining("missing index.html or not a file")
    );
  });
});
