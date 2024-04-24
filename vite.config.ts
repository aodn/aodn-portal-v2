import { defineConfig, loadEnv } from "vite";
import react from "@vitejs/plugin-react-swc";
import eslint from "vite-plugin-eslint";
import path from "path";

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
    ],
    build: {
      outDir: "dist",
    },
    test: {
      // 👋 add the line below to add jsdom to vite
      environment: "jsdom",
    },
    publicDir: "public",
    resolve: {
      alias: [{ find: "@", replacement: path.resolve(__dirname, "src") }],
    },
    base: "",
  });
};
