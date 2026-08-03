import { loadEnv, type ConfigEnv, type ViteDevServer } from "vite";
import { defineConfig } from "vitest/config";
import react from "@vitejs/plugin-react-swc";
import eslint from "vite-plugin-eslint";
import path from "path";
import fs from "fs";

// https://vitejs.dev/config/
export default ({ mode }: ConfigEnv) => {
  process.env = { ...process.env, ...loadEnv(mode, process.cwd()) };

  const apiPath = process.env.VITE_API_HOST?.replace(/\/$/, "");
  const port = Number(process.env.VITE_PORT);

  const inlineNewRelicPlugin = () => {
    // We need to inline the relic_script in the index.html, you can dynamic include based on env here
    // https://docs.newrelic.com/docs/browser/new-relic-browser/page-load-timing-resources/instrumentation-browser-monitoring/#javascript-placement
    return {
      name: "inline-javascript",
      transformIndexHtml(html: string) {
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
      transformIndexHtml(html: string) {
        // Skip GA in test mode
        if (mode === "test") {
          return html.replace("<!-- google-analytics-js -->", "");
        }

        const isNewRelic =
          "new URLSearchParams(window.location.search).get('nr_synthetic') === 'true'";

        const gaScript = `
          <script async src="https://www.googletagmanager.com/gtag/js?id=${process.env.VITE_GA_MEASUREMENT_ID}"></script>
          <script>
            if (!(${isNewRelic})) {
              window.dataLayer = window.dataLayer || [];
              window.gtag = function(){dataLayer.push(arguments);};
              gtag('js', new Date());
              gtag('config', '${process.env.VITE_GA_MEASUREMENT_ID}');
            }
          </script>
        `;

        return html.replace("<!-- google-analytics-js -->", gaScript);
      },
    };
  };

  const inlineSEOPlugin = () => {
    return {
      name: "inline-seo",
      transformIndexHtml(html: string) {
        const isProduction = mode === "prod";

        // Canonical is set at runtime per route in AppRouter.tsx (SPA has a single
        // index.html, so a static canonical would wrongly point every page at "/").
        const seoTags = `
        <!-- SEO -->

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

        return html.replace("<!-- seo-tags -->", seoTags);
      },
    };
  };

  const runningInGithubActions = Boolean(process.env.GITHUB_ACTIONS);

  const warnSeoStepFailed = (step: string, error: unknown) => {
    const message = error instanceof Error ? error.message : String(error);
    if (runningInGithubActions) {
      // "::warning ...::" renders as an annotation on the Actions run page
      console.warn(
        `::warning title=${step} failed::${message} — dist is missing SEO artifacts; deploy continues`
      );
    } else {
      console.warn(`${step} failed (non-prod, ignored):`, error);
    }
  };

  const generateSitemapPlugin = () => {
    return {
      name: "generate-sitemap",
      // Generate for prod (the indexable build) and edge (a rehearsal, so a
      // broken sitemap build is caught on merge day instead of release day)
      async closeBundle() {
        if (mode !== "prod" && mode !== "edge") return;
        try {
          const { generateSitemap } =
            await import("./src/utils/seo/SitemapUtils");
          await generateSitemap(path.resolve(__dirname, "dist"));
        } catch (error) {
          // Edge builds run on every merge; a beta API hiccup must not block deploys
          if (mode === "prod") throw error;
          warnSeoStepFailed("Sitemap generation", error);
        }
      },
    };
  };

  const prerenderDetailsPlugin = () => {
    return {
      name: "prerender-details",
      // Same prod/edge gating and error semantics as generate-sitemap
      async closeBundle() {
        if (mode !== "prod" && mode !== "edge") return;
        try {
          const { prerenderDetailPages } =
            await import("./src/utils/seo/PrerenderUtils");
          await prerenderDetailPages(path.resolve(__dirname, "dist"));
        } catch (error) {
          if (mode === "prod") throw error;
          warnSeoStepFailed("Detail prerender", error);
        }
      },
    };
  };

  const copyRobotsPlugin = () => {
    return {
      name: "copy-robots-txt",
      configureServer(server: ViteDevServer) {
        server.middlewares.use((req, res, next) => {
          if (req.url === "/robots.txt") {
            const file =
              mode === "prod" ? "robots.prod.txt" : "robots.nonprod.txt";
            const content = fs.readFileSync(
              path.resolve(__dirname, "public", file),
              "utf8"
            );
            res.setHeader("Content-Type", "text/plain");
            res.end(content);
            return;
          }
          next();
        });
      },
      closeBundle() {
        const file = mode === "prod" ? "robots.prod.txt" : "robots.nonprod.txt";
        fs.copyFileSync(
          path.resolve(__dirname, "public", file), // source from public
          path.resolve(__dirname, "dist/robots.txt") // output to dist
        );
      },
    };
  };

  return defineConfig({
    server: {
      port: port,
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
        "/api/v1/ogc/ext/static": {
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
        "/api/v1/ogc/manage": {
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
      generateSitemapPlugin(),
      prerenderDetailsPlugin(),
      copyRobotsPlugin(),
    ].filter(Boolean),
    build: {
      outDir: "dist",
    },
    // mapbox-gl 3.x emits a worker that uses dynamic imports (code-splitting),
    // which Vite's default "iife" worker format can't support. Build workers as
    // ES modules so the split chunks are allowed.
    worker: {
      format: "es",
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
