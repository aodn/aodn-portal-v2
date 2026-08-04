/**
 * Static SEO head tags injected into index.html at build time (replacing the
 * "<!-- seo-tags -->" placeholder via inlineSEOPlugin in vite.config.ts).
 * Per-route tags are handled elsewhere: canonical at runtime (canonicalUrl.ts)
 * and detail-page title/description/JSON-LD at build time (PrerenderUtils.ts).
 */

export const buildSeoHeadTags = (isProduction: boolean) => `
        <!-- SEO -->

        <meta name="description" content="Open access to Australian marine and climate science data." />

        ${
          !isProduction
            ? `<!-- Non-prod: block indexing -->
        <meta name="robots" content="noindex, nofollow" />`
            : ""
        }

        <!-- Bing Webmaster Tools Verification -->
        <meta name="msvalidate.01" content="02593ED7942BD40F39C6E03B5EF2265E" />

        <!-- End SEO -->
      `;
