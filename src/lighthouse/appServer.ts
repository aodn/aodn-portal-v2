/**
 * Serves the production build for the Lighthouse runs.
 *
 * `vite preview` would also serve dist, but its /api proxy target comes from
 * VITE_API_HOST after Vite has merged the .env files — so a developer's local
 * .env (which points at localhost:8080) silently wins and the run measures
 * DegradedPage. This server takes the upstream as an argument instead, holds
 * every file in memory pre-gzipped so file I/O never shows up in a metric, and
 * mirrors what CloudFront does for the app: gzip, immutable /assets, and
 * index.html for any client-side route such as /details/<uuid>.
 *
 * Node-only — never import in app code.
 */

import fs from "fs";
import http from "http";
import path from "path";
import { gzipSync } from "zlib";
import type { ApiHandler } from "./apiFixtures";

const CONTENT_TYPES: Record<string, string> = {
  ".html": "text/html; charset=utf-8",
  ".js": "text/javascript; charset=utf-8",
  ".mjs": "text/javascript; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".json": "application/json; charset=utf-8",
  ".svg": "image/svg+xml",
  ".png": "image/png",
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".webp": "image/webp",
  ".avif": "image/avif",
  ".gif": "image/gif",
  ".ico": "image/x-icon",
  ".woff": "font/woff",
  ".woff2": "font/woff2",
  ".ttf": "font/ttf",
  ".txt": "text/plain; charset=utf-8",
  ".xml": "application/xml; charset=utf-8",
  ".webmanifest": "application/manifest+json",
  ".pmtiles": "application/octet-stream",
};

const COMPRESSIBLE = new Set([
  ".html",
  ".js",
  ".mjs",
  ".css",
  ".json",
  ".svg",
  ".txt",
  ".xml",
  ".webmanifest",
]);

interface Asset {
  body: Buffer;
  gzipped?: Buffer;
  contentType: string;
  immutable: boolean;
}

const loadAssets = (distDir: string) => {
  const assets = new Map<string, Asset>();

  const walk = (dir: string) => {
    for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
      const absolute = path.join(dir, entry.name);
      if (entry.isDirectory()) {
        walk(absolute);
        continue;
      }
      const urlPath = `/${path.relative(distDir, absolute).split(path.sep).join("/")}`;
      const extension = path.extname(urlPath).toLowerCase();
      const body = fs.readFileSync(absolute);
      assets.set(urlPath, {
        body,
        gzipped: COMPRESSIBLE.has(extension) ? gzipSync(body) : undefined,
        contentType: CONTENT_TYPES[extension] ?? "application/octet-stream",
        // Hashed filenames, same as the CloudFront behaviour for /assets/*
        immutable: urlPath.startsWith("/assets/"),
      });
    }
  };

  walk(distDir);
  return assets;
};

export interface AppServer {
  url: string;
  close: () => Promise<void>;
}

export const startAppServer = async ({
  distDir,
  port,
  api,
}: {
  distDir: string;
  port: number;
  api: ApiHandler;
}): Promise<AppServer> => {
  const indexPath = path.join(distDir, "index.html");
  if (!fs.existsSync(indexPath)) {
    throw new Error(
      `No build to measure at ${distDir} — run "yarn lh:build" first.`
    );
  }

  const assets = loadAssets(distDir);
  const index = assets.get("/index.html");
  if (!index) throw new Error(`index.html missing from ${distDir}`);

  const server = http.createServer((req, res) => {
    const url = req.url ?? "/";

    if (url.startsWith("/api/")) {
      void api.handle(req, res);
      return;
    }

    const pathname = url.split("?")[0];
    const asset =
      assets.get(pathname === "/" ? "/index.html" : pathname) ??
      // Any other path is a client-side route (/search, /details/<uuid>);
      // a missing file with an extension is a real 404.
      (path.extname(pathname) === "" ? index : undefined);

    if (!asset) {
      res.writeHead(404, { "content-type": "text/plain" });
      res.end("Not found");
      return;
    }

    const wantsGzip = (req.headers["accept-encoding"] ?? "").includes("gzip");
    const body = wantsGzip && asset.gzipped ? asset.gzipped : asset.body;
    const headers: Record<string, string> = {
      "content-type": asset.contentType,
      "content-length": String(body.byteLength),
      "cache-control": asset.immutable
        ? "public, max-age=31536000, immutable"
        : "no-cache",
    };
    if (body === asset.gzipped) headers["content-encoding"] = "gzip";

    res.writeHead(200, headers);
    res.end(req.method === "HEAD" ? undefined : body);
  });

  await new Promise<void>((resolve, reject) => {
    server.once("error", reject);
    server.listen(port, "127.0.0.1", () => resolve());
  });

  const address = server.address();
  const boundPort =
    typeof address === "object" && address ? address.port : port;

  return {
    url: `http://127.0.0.1:${boundPort}`,
    close: () =>
      new Promise<void>((resolve, reject) =>
        server.close((error) => (error ? reject(error) : resolve()))
      ),
  };
};
