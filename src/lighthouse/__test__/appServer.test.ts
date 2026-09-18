// @vitest-environment node
import fs from "fs";
import os from "os";
import path from "path";
import { afterEach, describe, expect, test } from "vitest";
import { MANIFEST_FILE, createApiReplayer } from "../apiFixtures";
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

/** Fixtures for one API call, enough to prove /api reaches the API handler. */
const writeFixtures = () => {
  const dir = tempDir();
  fs.writeFileSync(path.join(dir, "get-health.json"), '{ "status": "UP" }\n');
  fs.writeFileSync(
    path.join(dir, MANIFEST_FILE),
    JSON.stringify({
      recordedFrom: "https://portal-edge.aodn.org.au",
      recordedAt: "2026-09-17T00:00:00.000Z",
      fixtures: [
        {
          method: "GET",
          url: "/api/v1/ogc/manage/health",
          status: 200,
          contentType: "application/json",
          file: "get-health.json",
        },
      ],
    })
  );
  return dir;
};

let app: AppServer | undefined;

afterEach(async () => {
  await app?.close();
  app = undefined;
});

const start = async () => {
  const api = createApiReplayer({ fixturesDir: writeFixtures() });
  app = await startAppServer({ distDir: writeDist(), port: 0, api });
  return { app };
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
    const api = createApiReplayer({ fixturesDir: writeFixtures() });
    await expect(
      startAppServer({ distDir: tempDir(), port: 0, api })
    ).rejects.toThrow(/yarn lh:build/);
  });

  test("/api goes to the API handler, not to the app shell", async () => {
    const { app: server } = await start();
    const response = await fetch(`${server.url}/api/v1/ogc/manage/health`);
    expect(response.status).toBe(200);
    expect(await response.json()).toEqual({ status: "UP" });
  });
});
