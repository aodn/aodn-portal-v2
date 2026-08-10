/**
 * Static SEO head tags baked into index.html at build time, replacing the
 * "<!-- seo-tags -->" placeholder (see vitePlugins.ts).
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
