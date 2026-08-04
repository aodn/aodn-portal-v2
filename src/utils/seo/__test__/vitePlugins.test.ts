/**
 * SEO — the Vite plugins that wire the SEO build steps together.
 *
 * What must hold:
 * - the head tags land in index.html in place of the placeholder
 * - sitemap/prerender run on prod and edge builds only
 * - a failing step throws on prod (blocks the release) but only warns on
 *   edge (deploys must not be blocked by an API hiccup)
 * - each environment ships its own robots.txt
 */

import { afterEach, describe, expect, test, vi } from "vitest";
import fs from "fs";
import {
  copyRobotsPlugin,
  generateSitemapPlugin,
  inlineSeoTagsPlugin,
  prerenderDetailsPlugin,
} from "../vitePlugins";

vi.mock("../SitemapUtils", () => ({
  generateSitemap: vi.fn(),
}));
vi.mock("../PrerenderUtils", () => ({
  prerenderDetailPages: vi.fn(),
}));

import { generateSitemap } from "../SitemapUtils";
import { prerenderDetailPages } from "../PrerenderUtils";

const options = (mode: string) => ({ mode, rootDir: "/repo" });

describe("inlineSeoTagsPlugin", () => {
  test("replaces the seo-tags placeholder with the head tags", () => {
    const html = inlineSeoTagsPlugin(options("prod")).transformIndexHtml(
      "<head><!-- seo-tags --></head>"
    );

    expect(html).not.toContain("<!-- seo-tags -->");
    expect(html).toContain('<meta name="description"');
  });
});

describe("generate-sitemap and prerender-details build steps", () => {
  afterEach(() => {
    vi.clearAllMocks();
    vi.restoreAllMocks();
  });

  test("run on prod and edge builds", async () => {
    for (const mode of ["prod", "edge"]) {
      await generateSitemapPlugin(options(mode)).closeBundle();
      await prerenderDetailsPlugin(options(mode)).closeBundle();
    }

    expect(generateSitemap).toHaveBeenCalledTimes(2);
    expect(prerenderDetailPages).toHaveBeenCalledTimes(2);
  });

  test("are skipped on dev and staging builds", async () => {
    for (const mode of ["dev", "staging", "test"]) {
      await generateSitemapPlugin(options(mode)).closeBundle();
      await prerenderDetailsPlugin(options(mode)).closeBundle();
    }

    expect(generateSitemap).not.toHaveBeenCalled();
    expect(prerenderDetailPages).not.toHaveBeenCalled();
  });

  test("a failing step blocks a prod build", async () => {
    vi.mocked(generateSitemap).mockRejectedValueOnce(new Error("api down"));

    await expect(
      generateSitemapPlugin(options("prod")).closeBundle()
    ).rejects.toThrow("api down");
  });

  test("a failing step only warns on an edge build", async () => {
    const warn = vi.spyOn(console, "warn").mockImplementation(() => {});
    vi.mocked(generateSitemap).mockRejectedValueOnce(new Error("api down"));

    await generateSitemapPlugin(options("edge")).closeBundle();

    expect(warn).toHaveBeenCalled();
    expect(warn.mock.calls[0].map(String).join(" ")).toContain("api down");
  });
});

describe("copyRobotsPlugin", () => {
  afterEach(() => vi.restoreAllMocks());

  const copiedRobotsSource = (mode: string) => {
    const copy = vi.spyOn(fs, "copyFileSync").mockImplementation(() => {});
    copyRobotsPlugin(options(mode)).closeBundle();
    return String(copy.mock.calls[0][0]);
  };

  test("prod builds ship robots.prod.txt", () => {
    expect(copiedRobotsSource("prod")).toContain("robots.prod.txt");
  });

  test("all other builds ship robots.nonprod.txt", () => {
    expect(copiedRobotsSource("edge")).toContain("robots.nonprod.txt");
  });
});
