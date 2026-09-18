// @vitest-environment node
import fs from "fs";
import http from "http";
import os from "os";
import path from "path";
import { gzipSync } from "zlib";
import { afterEach, describe, expect, test } from "vitest";
import {
  MANIFEST_FILE,
  createApiRecorder,
  createApiReplayer,
  type ApiFixtureManifest,
  type ApiHandler,
} from "../apiFixtures";

const tempDir = () => fs.mkdtempSync(path.join(os.tmpdir(), "lh-fixtures-"));

const servers: http.Server[] = [];

const listen = async (server: http.Server) => {
  servers.push(server);
  await new Promise<void>((resolve) => server.listen(0, "127.0.0.1", resolve));
  const address = server.address();
  const port = typeof address === "object" && address ? address.port : 0;
  return `http://127.0.0.1:${port}`;
};

afterEach(async () => {
  await Promise.all(
    servers
      .splice(0)
      .map(
        (server) =>
          new Promise<void>((resolve) => server.close(() => resolve()))
      )
  );
});

/** Upstream stand-in for the OGC API, gzipping like the real one. */
const startUpstream = async () => {
  const calls: string[] = [];
  const url = await listen(
    http.createServer((req, res) => {
      const chunks: Buffer[] = [];
      req.on("data", (chunk: Buffer) => chunks.push(chunk));
      req.on("end", () => {
        calls.push(`${req.method} ${req.url}`);
        if (req.url?.includes("boom")) {
          res.writeHead(500, { "content-type": "application/json" });
          res.end('{"error":"nope"}');
          return;
        }
        const body = JSON.stringify({
          url: req.url,
          method: req.method,
          received: Buffer.concat(chunks).toString("utf8"),
        });
        res.writeHead(200, {
          "content-type": "application/json",
          "content-encoding": "gzip",
        });
        res.end(gzipSync(body));
      });
    })
  );
  return { url, calls };
};

/** Serves an ApiHandler the way appServer does, so fetch can talk to it. */
const serve = (api: ApiHandler) =>
  listen(http.createServer((req, res) => void api.handle(req, res)));

describe("createApiRecorder", () => {
  test("proxies to the upstream once per request and answers repeats from memory", async () => {
    const upstream = await startUpstream();
    const recorder = createApiRecorder({ upstream: upstream.url });
    const origin = await serve(recorder);

    const first = await fetch(`${origin}/api/v1/ogc/collections?q=wave`);
    const second = await fetch(`${origin}/api/v1/ogc/collections?q=wave`);

    expect(await first.json()).toMatchObject({
      url: "/api/v1/ogc/collections?q=wave",
    });
    expect(await second.json()).toMatchObject({
      url: "/api/v1/ogc/collections?q=wave",
    });
    expect(upstream.calls).toEqual(["GET /api/v1/ogc/collections?q=wave"]);
  });

  test("forwards a POST body to the upstream", async () => {
    const upstream = await startUpstream();
    const origin = await serve(createApiRecorder({ upstream: upstream.url }));

    const response = await fetch(`${origin}/api/v1/ogc/processes/x/execution`, {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: '{"uuid":"abc"}',
    });

    expect(await response.json()).toMatchObject({
      method: "POST",
      received: '{"uuid":"abc"}',
    });
  });

  test("records error responses as they are, and reports them", async () => {
    const upstream = await startUpstream();
    const recorder = createApiRecorder({ upstream: upstream.url });
    const origin = await serve(recorder);

    const response = await fetch(`${origin}/api/v1/ogc/boom`);

    expect(response.status).toBe(500);
    expect(recorder.stats().errors).toEqual(["500 GET /api/v1/ogc/boom"]);
    const manifest = recorder.save(tempDir());
    expect(manifest.fixtures).toEqual([
      expect.objectContaining({ url: "/api/v1/ogc/boom", status: 500 }),
    ]);
  });

  test("an unreachable upstream is a 502 and a failure, and is not recorded", async () => {
    // Nothing listens on port 1
    const recorder = createApiRecorder({ upstream: "http://127.0.0.1:1" });
    const origin = await serve(recorder);

    const response = await fetch(`${origin}/api/v1/ogc/manage/health`);

    expect(response.status).toBe(502);
    expect(recorder.stats().failures).toHaveLength(1);
    expect(recorder.save(tempDir()).fixtures).toEqual([]);
  });

  test("save replaces the directory with a manifest and readable JSON bodies", async () => {
    const upstream = await startUpstream();
    const recorder = createApiRecorder({ upstream: upstream.url });
    const origin = await serve(recorder);
    await fetch(`${origin}/api/v1/ogc/manage/health`);

    const dir = tempDir();
    fs.writeFileSync(path.join(dir, "stale.json"), "{}");
    const manifest = recorder.save(dir);

    expect(fs.existsSync(path.join(dir, "stale.json"))).toBe(false);
    expect(manifest.recordedFrom).toBe(upstream.url);
    const [fixture] = manifest.fixtures;
    expect(fixture).toMatchObject({
      method: "GET",
      url: "/api/v1/ogc/manage/health",
      status: 200,
      contentType: "application/json",
    });
    expect(fixture.file).toMatch(/^get-health-[0-9a-f]{8}\.json$/);
    // Stored decoded and pretty-printed, so a refresh diffs readably
    const stored = fs.readFileSync(path.join(dir, fixture.file), "utf8");
    expect(stored).toContain('\n  "url": "/api/v1/ogc/manage/health"');
    expect(
      JSON.parse(fs.readFileSync(path.join(dir, MANIFEST_FILE), "utf8"))
    ).toEqual(manifest);
  });
});

describe("createApiReplayer", () => {
  const writeFixtures = (): string => {
    const dir = tempDir();
    fs.writeFileSync(
      path.join(dir, "get-health.json"),
      '{\n  "status": "UP"\n}\n'
    );
    fs.writeFileSync(
      path.join(dir, "post-execution.json"),
      '{\n  "size": 42\n}\n'
    );
    const manifest: ApiFixtureManifest = {
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
        {
          method: "POST",
          url: "/api/v1/ogc/processes/x/execution",
          status: 200,
          contentType: "application/json",
          file: "post-execution.json",
        },
      ],
    };
    fs.writeFileSync(path.join(dir, MANIFEST_FILE), JSON.stringify(manifest));
    return dir;
  };

  test("serves a recorded response, compact and gzipped", async () => {
    const replayer = createApiReplayer({ fixturesDir: writeFixtures() });
    const origin = await serve(replayer);

    const response = await fetch(`${origin}/api/v1/ogc/manage/health`, {
      headers: { "accept-encoding": "gzip" },
    });

    expect(response.status).toBe(200);
    expect(response.headers.get("content-encoding")).toBe("gzip");
    expect(await response.text()).toBe('{"status":"UP"}');
    expect(replayer.missing()).toEqual([]);
  });

  test("matches on method as well as URL", async () => {
    const replayer = createApiReplayer({ fixturesDir: writeFixtures() });
    const origin = await serve(replayer);

    const post = await fetch(`${origin}/api/v1/ogc/processes/x/execution`, {
      method: "POST",
      body: "{}",
    });
    const get = await fetch(`${origin}/api/v1/ogc/processes/x/execution`);

    expect(await post.json()).toEqual({ size: 42 });
    expect(get.status).toBe(504);
  });

  test("a request with no fixture is a 504 and is reported, never a network call", async () => {
    const replayer = createApiReplayer({ fixturesDir: writeFixtures() });
    const origin = await serve(replayer);

    const response = await fetch(`${origin}/api/v1/ogc/collections?q=new`);
    await fetch(`${origin}/api/v1/ogc/collections?q=new`);

    expect(response.status).toBe(504);
    // Reported once, however often the app asked
    expect(replayer.missing()).toEqual(["GET /api/v1/ogc/collections?q=new"]);
  });

  test("points at yarn lh:record when there are no fixtures", () => {
    expect(() => createApiReplayer({ fixturesDir: tempDir() })).toThrow(
      /yarn lh:record/
    );
  });
});
