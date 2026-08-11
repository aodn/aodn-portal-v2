/**
 * SEO — the verifier must accept exactly what renderPage produces, so a valid
 * page is built with the real generator rather than a hand-written fixture.
 */

import { describe, expect, test } from "vitest";
import { BASE_URL } from "../constants";
import { renderPage } from "../prerender";
import {
  checkDetailPage,
  checkHomePage,
  checkRobotsTxt,
  checkSitemap,
} from "../verifySeoArtifacts";

const template =
  "<!doctype html><html><head><title>AODN Portal</title>" +
  '<meta name="description" content="site-wide" />' +
  '</head><body><div id="root"></div></body></html>';

const collection = {
  id: "abc-123",
  title: "Sea Surface Temperature",
  description: "Gridded SST records.",
};

describe("checkDetailPage", () => {
  test("passes the exact output of renderPage", () => {
    const page = renderPage(template, collection);
    expect(checkDetailPage(page, "abc-123")).toEqual([]);
  });

  test("flags a page that kept the generic site title", () => {
    expect(checkDetailPage(template, "abc-123")).toContain(
      "title is missing or still the generic site title"
    );
  });

  test("flags a canonical pointing at a different record", () => {
    const page = renderPage(template, collection);
    expect(checkDetailPage(page, "other-uuid")).toContain(
      "canonical does not point at this record"
    );
  });

  test("flags JSON-LD that no longer parses", () => {
    const page = renderPage(template, collection).replace(
      '"@type":"Dataset"',
      '"@type":"Dataset",,'
    );
    expect(checkDetailPage(page, "abc-123")).toContain(
      "Dataset JSON-LD is not valid JSON"
    );
  });

  test("flags a page without social preview tags", () => {
    const page = renderPage(template, collection).replace(
      /<meta property="og:[^>]*>/g,
      ""
    );
    expect(checkDetailPage(page, "abc-123")).toContain(
      "social preview (Open Graph) tags are missing"
    );
  });

  test("flags a page that lost the app shell", () => {
    const page = renderPage(template, collection).replace(
      '<div id="root">',
      "<div>"
    );
    expect(checkDetailPage(page, "abc-123")).toContain(
      "page no longer boots the app shell"
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
    "<!doctype html><html><head><title>AODN Portal</title>" +
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
