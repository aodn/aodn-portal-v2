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

  // Log a custom warning if VITE_API_HOST is not set
  if (!apiPath) {
    console.warn(
      "Warning: VITE_API_HOST is not defined. API requests may fail. Please check .env file."
    );
  }

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

        return html.replace(
          "<!-- new-relic-js -->",
          `<script type='text/javascript'>${inlineJs}</script>`
        );
      },
    };
  };

  return defineConfig({
    server: {
      watch: {
        usePolling: true,
      },
      // Only add the proxy if apiPath is defined
      proxy: apiPath
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
            "/api/v1/ogc/ext/parameter/vocabs": {
              target: apiPath,
              changeOrigin: true,
            },
          }
        : {}, // No proxy setup if apiPath is not defined
    },
    plugins: [
      react(),
      mode !== "test" &&
        eslint({ exclude: ["/virtual:/**", "node_modules/**"] }),
      inlineNewRelicPlugin(),
    ],
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
    base: "",
  });
};
