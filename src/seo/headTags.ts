/**
 * Static SEO head tags baked into index.html at build time, replacing the
 * "<!-- seo-tags -->" placeholder (see vitePlugins.ts).
 */

import { BASE_URL, SHARE_IMAGE_URL } from "./constants";

const SITE_TITLE = "AODN Portal – Australian Ocean Data Network";
const SITE_DESCRIPTION =
  "Open access to Australian marine and climate science data.";

export const buildSeoHeadTags = (isProduction: boolean) => `
        <!-- SEO -->

        <meta name="description" content="${SITE_DESCRIPTION}" />

        ${
          !isProduction
            ? `<!-- Non-prod: block indexing -->
        <meta name="robots" content="noindex, nofollow" />`
            : ""
        }

        <!-- Social link previews; detail pages replace these during prerender -->
        <meta property="og:type" content="website" />
        <meta property="og:site_name" content="AODN Portal" />
        <meta property="og:title" content="${SITE_TITLE}" />
        <meta property="og:description" content="${SITE_DESCRIPTION}" />
        <meta property="og:url" content="${BASE_URL}/" />
        <meta property="og:image" content="${SHARE_IMAGE_URL}" />
        <meta name="twitter:card" content="summary" />

        <!-- Bing Webmaster Tools Verification -->
        <meta name="msvalidate.01" content="02593ED7942BD40F39C6E03B5EF2265E" />

        <!-- End SEO -->
      `;
