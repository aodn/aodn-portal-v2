// @vitest-environment node
import fs from "fs";
import http from "http";
import os from "os";
import path from "path";
import { afterEach, describe, expect, test } from "vitest";
import { createApiCache } from "../apiCache";
import { startAppServer } from "../appServer";
import type { AppServer } from "../appServer";

const tempDir = () => fs.mkdtempSync(path.join(os.tmpdir(), "lh-server-"));

const writeDist = () => {
  const dir = tempDir();
  fs.mkdirSync(path.join(dir, "assets"));
  fs.writeFileSync(
    path.join(dir, "index.html"),
    `<!doctype html><div id="root"></div>${"<!-- padding -->".repeat(100)}`
  );
  fs.writeFileSync(
    path.join(dir, "assets", "index-abc123.js"),
    "console.log(1)"
  );
  fs.writeFileSync(path.join(dir, "logo.png"), Buffer.from([1, 2, 3]));
  return dir;
};

/** Upstream stand-in for the OGC API. */
const startUpstream = async () => {
  let calls = 0;
  const server = http.createServer((req, res) => {
    calls += 1;
    if (req.url?.includes("boom")) {
      res.writeHead(500, { "content-type": "application/json" });
      res.end('{"error":"nope"}');
      return;
    }
    res.writeHead(200, { "content-type": "application/json" });
    res.end(JSON.stringify({ url: req.url, calls }));
  });
  await new Promise<void>((resolve) => server.listen(0, "127.0.0.1", resolve));
  const address = server.address();
  const port = typeof address === "object" && address ? address.port : 0;
  return {
    url: `http://127.0.0.1:${port}`,
    calls: () => calls,
    close: () => new Promise<void>((resolve) => server.close(() => resolve())),
  };
};

let app: AppServer | undefined;
let upstream: Awaited<ReturnType<typeof startUpstream>> | undefined;

afterEach(async () => {
  await app?.close();
  await upstream?.close();
  app = undefined;
  upstream = undefined;
});

const start = async ({ offline = false }: { offline?: boolean } = {}) => {
  upstream = await startUpstream();
  const api = createApiCache({
    upstream: upstream.url,
    cacheDir: tempDir(),
    offline,
  });
  app = await startAppServer({ distDir: writeDist(), port: 0, api });
  return { app, api, upstream };
};

describe("appServer", () => {
  test("serves index.html for a client-side route such as /details/<uuid>", async () => {
    const { app: server } = await start();
    const response = await fetch(`${server.url}/details/0015db7e-e684`);
    expect(response.status).toBe(200);
    expect(response.headers.get("content-type")).toContain("text/html");
    expect(await response.text()).toContain('id="root"');
  });

  test("hashed assets are immutable, index.html is not cached", async () => {
    const { app: server } = await start();
    const asset = await fetch(`${server.url}/assets/index-abc123.js`);
    expect(asset.headers.get("cache-control")).toBe(
      "public, max-age=31536000, immutable"
    );
    const index = await fetch(`${server.url}/`);
    expect(index.headers.get("cache-control")).toBe("no-cache");
  });

  test("text is gzipped like CloudFront serves it, binaries are not", async () => {
    const { app: server } = await start();
    const html = await fetch(`${server.url}/index.html`, {
      headers: { "accept-encoding": "gzip" },
    });
    // fetch decodes transparently; the header is what proves it was compressed
    expect(html.headers.get("content-encoding")).toBe("gzip");
    const png = await fetch(`${server.url}/logo.png`, {
      headers: { "accept-encoding": "gzip" },
    });
    expect(png.headers.get("content-encoding")).toBeNull();
  });

  test("a missing file is a 404, not the app shell", async () => {
    const { app: server } = await start();
    const response = await fetch(`${server.url}/assets/gone-123.js`);
    expect(response.status).toBe(404);
  });

  test("refuses to serve a directory with no build in it", async () => {
    upstream = await startUpstream();
    const api = createApiCache({ upstream: upstream.url, cacheDir: tempDir() });
    await expect(
      startAppServer({ distDir: tempDir(), port: 0, api })
    ).rejects.toThrow(/yarn lh:build/);
  });
});

describe("apiCache", () => {
  test("records the first request and replays it without the upstream", async () => {
    const { app: server, api, upstream: origin } = await start();

    const first = await fetch(`${server.url}/api/v1/ogc/collections?q=wave`);
    expect(await first.json()).toEqual({
      url: "/api/v1/ogc/collections?q=wave",
      calls: 1,
    });

    const second = await fetch(`${server.url}/api/v1/ogc/collections?q=wave`);
    // Same payload, and the upstream was never asked again
    expect(await second.json()).toEqual({
      url: "/api/v1/ogc/collections?q=wave",
      calls: 1,
    });
    expect(origin.calls()).toBe(1);
    expect(api.stats()).toMatchObject({ hits: 1, misses: 1 });
  });

  test("a different query string is a different recording", async () => {
    const { app: server, upstream: origin } = await start();
    await fetch(`${server.url}/api/v1/ogc/collections?q=wave`);
    await fetch(`${server.url}/api/v1/ogc/collections?q=temperature`);
    expect(origin.calls()).toBe(2);
  });

  test("upstream errors reach the page and are reported, not cached", async () => {
    const { app: server, api, upstream: origin } = await start();
    const response = await fetch(`${server.url}/api/v1/ogc/boom`);
    expect(response.status).toBe(500);
    await fetch(`${server.url}/api/v1/ogc/boom`);
    expect(origin.calls()).toBe(2);
    expect(api.stats().errors).toEqual([
      "500 /api/v1/ogc/boom",
      "500 /api/v1/ogc/boom",
    ]);
  });

  test("an unreachable upstream becomes a 502 the checks can see", async () => {
    upstream = await startUpstream();
    const api = createApiCache({
      // Nothing listens on port 1
      upstream: "http://127.0.0.1:1",
      cacheDir: tempDir(),
    });
    app = await startAppServer({ distDir: writeDist(), port: 0, api });
    const response = await fetch(`${app.url}/api/v1/ogc/manage/health`);
    expect(response.status).toBe(502);
    expect(api.stats().failures).toHaveLength(1);
  });

  test("offline mode never reaches for the network", async () => {
    const { app: server, upstream: origin } = await start({ offline: true });
    const response = await fetch(`${server.url}/api/v1/ogc/collections`);
    expect(response.status).toBe(504);
    expect(origin.calls()).toBe(0);
  });
});
