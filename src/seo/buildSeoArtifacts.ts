/**
 * Builds both SEO artifacts in one pass over the records: yarn seo:artifacts
 * dist/index.html must already exist — it is the pre-render template.
 */

import path from "path";
import { fileURLToPath } from "url";
import { fetchCollections, prerenderDetailPages } from "./prerender";
import { generateSitemap } from "./sitemap";

const outDir = path.resolve(
  path.dirname(fileURLToPath(import.meta.url)),
  "../../dist"
);

// One fetchResultNoStore walk, shared by the sitemap and the detail pages
const collections = await fetchCollections();
await generateSitemap(outDir, collections);
await prerenderDetailPages(outDir, collections);
