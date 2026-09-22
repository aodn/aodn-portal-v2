import { loadEnv, transformWithEsbuild, type ConfigEnv } from "vite";
import { defineConfig } from "vitest/config";
import react from "@vitejs/plugin-react-swc";
import eslint from "vite-plugin-eslint2";
import path from "path";
import fs from "fs";
import { seoPlugins } from "./src/seo/vitePlugins";

// https://vitejs.dev/config/
export default ({ mode }: ConfigEnv) => {
  process.env = { ...process.env, ...loadEnv(mode, process.cwd()) };

  const apiPath = process.env.VITE_API_HOST?.replace(/\/$/, "");
  const port = Number(process.env.VITE_PORT);
  // Playwright-local mocks /api; do not register a proxy with no target
  // (Vite throws "Must set target or forward").
  const apiProxy = apiPath
    ? {
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
        "/api/v1/ogc/ext/tiles": {
          target: apiPath,
          changeOrigin: true,
        },
        "/api/v1/ogc/processes": {
          target: apiPath,
          changeOrigin: true,
        },
        "/api/v1/ogc/jobs": {
          target: apiPath,
          changeOrigin: true,
        },
        "/api/v1/ogc/manage": {
          target: apiPath,
          changeOrigin: true,
        },
      }
    : undefined;

  const inlineNewRelicPlugin = () => {
    // We need to inline the relic_script in the index.html, you can dynamic include based on env here
    // https://docs.newrelic.com/docs/browser/new-relic-browser/page-load-timing-resources/instrumentation-browser-monitoring/#javascript-placement
    return {
      name: "inline-javascript",
      async transformIndexHtml(html: string) {
        // Skip GA in test mode
        if (mode === "test") {
          return html.replace("<!-- new-relic-js -->", "");
        }

        const source = fs.readFileSync(
          path.resolve(__dirname, "public/relic_script.js"),
          "utf8"
        );
        // The snippet is ~120 kB and inlined into every HTML response, half of
        // it unminified config and loader code, so minify it on the way in.
        const { code: inlineJs } = await transformWithEsbuild(
          source,
          "relic_script.js",
          { minify: true }
        );

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

  return defineConfig({
    server: {
      port: port,
      watch: {
        usePolling: true,
      },
      proxy: apiProxy,
    },
    // `vite preview` serves the production build. Without the same proxy the
    // health check in HealthChecker 404s and every page renders DegradedPage,
    // which makes a local Lighthouse run measure the wrong thing.
    preview: {
      proxy: apiProxy,
    },
    plugins: [
      react(),
      mode !== "test" &&
        eslint({ exclude: ["/virtual:/**", "node_modules/**"] }),
      inlineNewRelicPlugin(),
      inlineGoogleAnalyticsPlugin(),
      ...seoPlugins({ mode, rootDir: __dirname }),
    ].filter(Boolean),
    build: {
      outDir: "dist",
      // mapbox-gl alone is ~800 kB; splitting it out is the point, so the
      // default 500 kB warning would just be noise.
      chunkSizeWarningLimit: 1500,
      rollupOptions: {
        output: {
          // Long-lived vendor chunks: a deploy touching only app code leaves
          // them cached.
          //
          // A listed package drags its own dependencies into the chunk, and
          // any other chunk needing one of those must then import this whole
          // chunk. So only list a package whose deps are either in here too
          // (react-redux and react-router-dom need react) or used nowhere
          // else. Ignoring that put a megabyte-scale chunk on the landing
          // page twice: @mui/x-charts via @mui/material internals, and
          // @mapbox/mapbox-gl-draw via @turf/helpers. mapbox-gl is not listed
          // for the same reason: its ESM build uses Vite's preload helper,
          // which the router also needs, so every page preloaded mapbox.
          manualChunks: {
            react: ["react", "react-dom", "react-router-dom", "react-redux"],
          },
        },
      },
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
      alias: [
        { find: "@", replacement: path.resolve(__dirname, "src") },
        // Point every "mapbox-gl" import at the one ESM copy the maps are built
        // from; otherwise the UMD build is bundled as well and mapbox-gl ships
        // twice. See src/components/map/mapbox/mapboxgl.ts. Skipped in tests,
        // whose vi.mock("mapbox-gl") calls expect the real package.
        ...(mode !== "test"
          ? [
              {
                find: /^mapbox-gl$/,
                replacement: path.resolve(
                  __dirname,
                  "src/components/map/mapbox/mapboxgl.ts"
                ),
              },
            ]
          : []),
      ],
    },
    // Use absolute paths when building
    base: "/",
  });
};
