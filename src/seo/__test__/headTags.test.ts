/**
 * SEO — static head tags baked into index.html at build time.
 *
 * Every page gets the site-wide meta description (detail pages replace it
 * during prerender) and the Bing verification tag. The noindex tag is the
 * environment gate: it must be present on every non-prod build and absent
 * on prod, otherwise either prod is never indexed or edge/staging leak into
 * search results.
 */

import { describe, expect, test } from "vitest";
import { buildSeoHeadTags } from "../headTags";

describe("buildSeoHeadTags", () => {
  test("every build carries the site-wide description and Bing verification", () => {
    for (const isProduction of [true, false]) {
      const tags = buildSeoHeadTags(isProduction);
      expect(tags).toContain(
        '<meta name="description" content="Open access to Australian marine and climate science data." />'
      );
      expect(tags).toContain('<meta name="msvalidate.01"');
    }
  });

  test("every build carries social link-preview tags", () => {
    for (const isProduction of [true, false]) {
      const tags = buildSeoHeadTags(isProduction);
      expect(tags).toContain('<meta property="og:title"');
      expect(tags).toContain('<meta property="og:image"');
      expect(tags).toContain('<meta name="twitter:card" content="summary" />');
    }
  });

  test("non-prod builds are noindex", () => {
    expect(buildSeoHeadTags(false)).toContain(
      '<meta name="robots" content="noindex, nofollow" />'
    );
  });

  test("prod builds are indexable", () => {
    expect(buildSeoHeadTags(true)).not.toContain('<meta name="robots"');
  });
});
