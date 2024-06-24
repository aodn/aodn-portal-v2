import { defineConfig, loadEnv } from "vite";
import react from "@vitejs/plugin-react-swc";
import eslint from "vite-plugin-eslint";
import path from "path";
import fs from "fs";
import { createHtmlPlugin } from "vite-plugin-html";

// https://vitejs.dev/config/
export default ({ mode }) => {
  process.env = { ...process.env, ...loadEnv(mode, process.cwd()) };

  const apiPath = process.env.VITE_API_HOST;

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
        "/api/v1/ogc/ext/parameter/categories": {
          target: apiPath,
          changeOrigin: true,
        },
      },
    },
    plugins: [
      react(),
      eslint({ exclude: ["/virtual:/**", "node_modules/**"] }),
      // We need to inline the relic_script in the index.html, you can dynamic include based on env here
      // https://docs.newrelic.com/docs/browser/new-relic-browser/page-load-timing-resources/instrumentation-browser-monitoring/#javascript-placement
      createHtmlPlugin({
        inject: {
          data: {
            inlineNewRelic: fs.readFileSync(
              path.resolve(__dirname, "public/relic_script.js"),
              "utf-8"
            ),
          },
        },
      }),
    ],
    build: {
      outDir: "dist",
    },
    test: {
      globals: true,
      // 👋 add the line below to add jsdom to vite
      environment: "jsdom",
      setupFiles: "./src/setupTests.ts",
    },
    publicDir: "public",
    resolve: {
      alias: [{ find: "@", replacement: path.resolve(__dirname, "src") }],
    },
    base: "",
  });
};
