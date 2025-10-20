import { loadEnv } from "vite";
import { defineConfig } from "vitest/config";
import react from "@vitejs/plugin-react-swc";
import eslint from "vite-plugin-eslint";
import path from "path";
import fs from "fs";

// https://vitejs.dev/config/
export default ({ mode }) => {
  process.env = { ...process.env, ...loadEnv(mode, process.cwd()) };

  const apiPath = process.env.VITE_API_HOST;

  const inlineNewRelicPlugin = () => {
    // We need to inline the relic_script in the index.html, you can dynamic include based on env here
    // https://docs.newrelic.com/docs/browser/new-relic-browser/page-load-timing-resources/instrumentation-browser-monitoring/#javascript-placement
    return {
      name: "inline-javascript",
      transformIndexHtml(html) {
        const inlineJs = fs.readFileSync(
          path.resolve(__dirname, "public/relic_script.js"),
          "utf8"
        );
        // Skip GA in test mode
        if (mode === "test") {
          return html.replace("<!-- new-relic-js -->", "");
        }

        return html.replace(
          "<!-- new-relic-js -->",
          `<script type='text/javascript'>${inlineJs}</script>`
        );
      },
    };
  };

  const inlineGoogleAnalyticsPlugin = () => {
    return {
      name: "inline-google-analytics",
      transformIndexHtml(html) {
        // Skip GA in test mode
        if (mode === "test") {
          return html.replace("<!-- google-analytics-js -->", "");
        }

        const gaScript = `
          <script async src="https://www.googletagmanager.com/gtag/js?id=${process.env.VITE_GA_MEASUREMENT_ID}"></script>
          <script>
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', '${process.env.VITE_GA_MEASUREMENT_ID}');
          </script>
        `;

        return html.replace("<!-- google-analytics-js -->", gaScript);
      },
    };
  };

  const inlineSEOPlugin = () => {
    return {
      name: "inline-seo",
      transformIndexHtml(html) {
        const canonicalUrl = process.env.VITE_CANONICAL_URL || "";

        const seoTags = `
          <!-- SEO: Canonical URL points all environments to production -->
          
          <!-- Bing Webmaster Tools Verification -->
          <meta name="msvalidate.01" content="02593ED7942BD40F39C6E03B5EF2265E" />
          
          <!-- Canonical URL: All environments point to production for SEO consolidation -->
          <link rel="canonical" href="${canonicalUrl}" />
          
          <!-- End SEO -->
        `;

        return html.replace("<!-- seo-tags -->", seoTags);
      },
    };
  };

  return defineConfig({
    server: {
      watch: {
        usePolling: true,
      },
      proxy: {
        "/api/v1/ogc/collections": {
          target: apiPath,
          changeOrigin: true,
        },
        "/api/v1/ogc/tiles": {
          target: apiPath,
          changeOrigin: true,
        },
        "/api/v1/ogc/ext/autocomplete": {
          target: apiPath,
          changeOrigin: true,
        },
        "/api/v1/ogc/ext/parameter/vocabs": {
          target: apiPath,
          changeOrigin: true,
        },
        "/api/v1/ogc/processes": {
          target: apiPath,
          changeOrigin: true,
        },
      },
    },
    plugins: [
      react(),
      mode !== "test" &&
        eslint({ exclude: ["/virtual:/**", "node_modules/**"] }),
      inlineNewRelicPlugin(),
      inlineGoogleAnalyticsPlugin(),
      inlineSEOPlugin(),
    ].filter(Boolean),
    build: {
      outDir: "dist",
    },
    test: {
      globals: true,
      // 👋 add the line below to add jsdom to vite
      environment: "jsdom",
      setupFiles: "./src/setupTests.ts",
      coverage: {
        provider: "v8",
        reporter: ["text", "json", "html"],
      },
    },
    publicDir: "public",
    resolve: {
      alias: [{ find: "@", replacement: path.resolve(__dirname, "src") }],
    },
    // Use absolute paths when building
    base: "/",
  });
};
