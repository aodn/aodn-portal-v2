/**
 * SEO — the Vite plugins that build the static parts of the head.
 *
 * What must hold:
 * - the head tags land in index.html in place of the placeholder
 * - each environment ships its own robots.txt
 * - the build never fetches records; sitemap.xml and the pre-rendered
 *   /details pages come from the Publish SEO Artifacts workflow
 */

import { afterEach, describe, expect, test, vi } from "vitest";
import fs from "fs";
import {
  copyRobotsPlugin,
  inlineSeoTagsPlugin,
  seoPlugins,
} from "../vitePlugins";

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

describe("seoPlugins", () => {
  test("no plugin fetches records at build time", () => {
    const names = seoPlugins(options("prod")).map((plugin) => plugin.name);

    expect(names).toEqual(["inline-seo", "copy-robots-txt"]);
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
