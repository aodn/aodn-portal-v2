/**
 * Builds both SEO artifacts from a single pass over the records, for the
 * Publish SEO Artifacts workflow: yarn seo:artifacts
 *
 * dist/index.html must already be there — it is the pre-render template.
 */

import path from "path";
import { fileURLToPath } from "url";
import { prerenderDetailPages, SEO_PROPERTIES } from "./PrerenderUtils";
import { fetchAllCollections, generateSitemap } from "./SitemapUtils";

const outDir = path.resolve(
  path.dirname(fileURLToPath(import.meta.url)),
  "../../../dist"
);

// The sitemap only needs ids, which the pre-render properties already include
const collections = await fetchAllCollections(SEO_PROPERTIES);
await generateSitemap(outDir, collections);
await prerenderDetailPages(outDir, collections);
