/**
 * Builds both SEO artifacts in one pass over the records: yarn seo:artifacts
 * dist/index.html must already exist — it is the pre-render template.
 */

import { seoDistDir } from "./cli";
import { OGC_API_BASE } from "./constants";
import { fetchCollections } from "./fetchCollections";
import { prerenderDetailPages } from "./prerender";
import { generateSitemap } from "./sitemap";

// There is no default API host — refuse to run rather than guess an environment
if (!OGC_API_BASE) {
  throw new Error(
    "VITE_API_HOST is not set. Set it in the shell or .env (seo.yml passes the matrix site)."
  );
}

const outDir = seoDistDir();

// One fetchResultNoStore walk, shared by the sitemap and the detail pages
const collections = await fetchCollections();
await generateSitemap(outDir, collections);
await prerenderDetailPages(outDir, collections);
