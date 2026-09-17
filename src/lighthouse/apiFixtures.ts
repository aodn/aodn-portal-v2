/**
 * Mocked OGC API for the Lighthouse runs.
 *
 * /search and /details render nothing worth measuring without API data, but
 * calling a live backend makes the job fail whenever that environment is down
 * or slow, and puts its latency and its data changes into the numbers. So the
 * measured runs replay responses committed in `fixtures/api/` and never touch
 * the network (`createApiReplayer`). `yarn lh:record` refreshes those fixtures
 * from a real environment (`createApiRecorder`, see record.ts); run it when the
 * OGC API or the requests the app makes change, and commit the result.
 *
 * On disk: `manifest.json` lists every recorded request (method, URL, status,
 * content type) and names the file holding its body. JSON bodies are stored
 * pretty-printed so a fixtures refresh can be reviewed in a PR, and served
 * compact again.
 *
 * Node-only — never import in app code.
 */

import { createHash } from "crypto";
import fs from "fs";
import http from "http";
import https from "https";
import path from "path";
import { gunzipSync, gzipSync } from "zlib";
import type { IncomingMessage, ServerResponse } from "http";

export interface ApiHandler {
  handle: (req: IncomingMessage, res: ServerResponse) => Promise<void>;
}

export interface ApiFixture {
  method: string;
  /** Path and query string, exactly as the app requested it. */
  url: string;
  status: number;
  contentType?: string;
  /** Body file, relative to the fixtures directory. */
  file: string;
}

export interface ApiFixtureManifest {
  recordedFrom: string;
  recordedAt: string;
  fixtures: ApiFixture[];
}

export const MANIFEST_FILE = "manifest.json";

const UPSTREAM_TIMEOUT_MS = 30_000;
const MAX_REDIRECTS = 3;

/**
 * Requests are told apart by method and URL. The body of a POST is not part of
 * the key: the routes measured always send the same body for a given URL.
 */
const fixtureKey = (method: string, url: string) =>
  `${method.toUpperCase()} ${url}`;

const isJson = (contentType?: string) => (contentType ?? "").includes("json");

const readBody = (req: IncomingMessage): Promise<Buffer> =>
  new Promise((resolve, reject) => {
    const chunks: Buffer[] = [];
    req.on("data", (chunk: Buffer) => chunks.push(chunk));
    req.on("end", () => resolve(Buffer.concat(chunks)));
    req.on("error", reject);
  });

const sendBody = (
  req: IncomingMessage,
  res: ServerResponse,
  {
    status,
    contentType,
    body,
    gzipped,
  }: { status: number; contentType?: string; body: Buffer; gzipped?: Buffer }
) => {
  const wantsGzip = (req.headers["accept-encoding"] ?? "").includes("gzip");
  const payload = wantsGzip && gzipped ? gzipped : body;
  const headers: Record<string, string> = {
    "content-length": String(payload.byteLength),
    // Identical bytes for every run; nothing is served from the HTTP cache.
    "cache-control": "no-store",
  };
  if (contentType) headers["content-type"] = contentType;
  if (payload === gzipped) headers["content-encoding"] = "gzip";
  res.writeHead(status, headers);
  res.end(payload);
};

const sendError = (res: ServerResponse, status: number, error: string) => {
  res.writeHead(status, { "content-type": "application/json" });
  res.end(JSON.stringify({ error }));
};

interface UpstreamResult {
  status: number;
  contentType?: string;
  /** Decoded: never gzipped, whatever the upstream sent. */
  body: Buffer;
}

const fetchUpstream = (
  target: string,
  method: string,
  requestHeaders: http.IncomingHttpHeaders,
  requestBody: Buffer,
  redirectsLeft = MAX_REDIRECTS
): Promise<UpstreamResult> =>
  new Promise((resolve, reject) => {
    const url = new URL(target);
    const client = url.protocol === "http:" ? http : https;
    const headers: Record<string, string> = {
      accept: requestHeaders.accept ?? "application/json",
      "accept-encoding": "gzip",
      "user-agent": "aodn-portal-lighthouse-ci",
      host: url.host,
    };
    if (requestBody.byteLength > 0) {
      headers["content-type"] =
        requestHeaders["content-type"] ?? "application/json";
      headers["content-length"] = String(requestBody.byteLength);
    }

    const request = client.request(url, { method, headers }, (response) => {
      const status = response.statusCode ?? 0;
      const location = response.headers.location;

      if (status >= 300 && status < 400 && location && redirectsLeft > 0) {
        response.resume();
        fetchUpstream(
          new URL(location, url).toString(),
          method,
          requestHeaders,
          requestBody,
          redirectsLeft - 1
        ).then(resolve, reject);
        return;
      }

      const chunks: Buffer[] = [];
      response.on("data", (chunk: Buffer) => chunks.push(chunk));
      response.on("end", () => {
        const raw = Buffer.concat(chunks);
        try {
          resolve({
            status,
            contentType: response.headers["content-type"],
            body:
              response.headers["content-encoding"] === "gzip"
                ? gunzipSync(raw)
                : raw,
          });
        } catch (error) {
          reject(error);
        }
      });
      response.on("error", reject);
    });

    request.setTimeout(UPSTREAM_TIMEOUT_MS, () =>
      request.destroy(new Error(`upstream timeout after ${target}`))
    );
    request.on("error", reject);
    request.end(requestBody.byteLength > 0 ? requestBody : undefined);
  });

/** `get-health-1a2b3c4d.json`: readable, and unique through the hash. */
const bodyFileName = (method: string, url: string, contentType?: string) => {
  const pathname = url.split("?")[0];
  const lastSegment =
    pathname.split("/").filter(Boolean).pop()?.slice(0, 40) ?? "root";
  const slug = lastSegment.replace(/[^a-zA-Z0-9-]/g, "-");
  const hash = createHash("sha1")
    .update(fixtureKey(method, url))
    .digest("hex")
    .slice(0, 8);
  const extension = isJson(contentType) ? "json" : "body";
  return `${method.toLowerCase()}-${slug}-${hash}.${extension}`;
};

interface Recording {
  method: string;
  url: string;
  status: number;
  contentType?: string;
  body: Buffer;
}

export interface ApiRecorderStats {
  /** Upstream answered >= 400. Recorded as-is, so replay stays faithful. */
  errors: string[];
  /** Upstream could not be reached at all; nothing was recorded for these. */
  failures: string[];
}

export interface ApiRecorder extends ApiHandler {
  stats: () => ApiRecorderStats;
  /** Replaces everything in `fixturesDir` with what was recorded. */
  save: (fixturesDir: string) => ApiFixtureManifest;
}

/**
 * Proxies /api to `upstream` and remembers every response. A request already
 * recorded is answered from memory, so each distinct call reaches the real
 * environment once.
 */
export const createApiRecorder = ({
  upstream,
}: {
  upstream: string;
}): ApiRecorder => {
  const recordings = new Map<string, Recording>();
  const errors: string[] = [];
  const failures: string[] = [];

  const handle = async (req: IncomingMessage, res: ServerResponse) => {
    const url = req.url ?? "/";
    const method = (req.method ?? "GET").toUpperCase();
    const key = fixtureKey(method, url);
    const requestBody = await readBody(req);

    const existing = recordings.get(key);
    if (existing) {
      sendBody(req, res, existing);
      return;
    }

    try {
      const result = await fetchUpstream(
        `${upstream}${url}`,
        method,
        req.headers,
        requestBody
      );
      const recording: Recording = { method, url, ...result };
      recordings.set(key, recording);
      if (result.status >= 400) errors.push(`${result.status} ${key}`);
      sendBody(req, res, recording);
    } catch (error) {
      const reason = error instanceof Error ? error.message : String(error);
      failures.push(`${key}: ${reason}`);
      sendError(res, 502, "upstream request failed");
    }
  };

  const save = (fixturesDir: string): ApiFixtureManifest => {
    fs.rmSync(fixturesDir, { recursive: true, force: true });
    fs.mkdirSync(fixturesDir, { recursive: true });

    const fixtures = [...recordings.values()]
      // Stable order, so a refresh only diffs where the API really changed
      .sort((a, b) =>
        fixtureKey(a.method, a.url).localeCompare(fixtureKey(b.method, b.url))
      )
      .map((recording): ApiFixture => {
        const file = bodyFileName(
          recording.method,
          recording.url,
          recording.contentType
        );
        const contents = isJson(recording.contentType)
          ? `${JSON.stringify(JSON.parse(recording.body.toString("utf8")), null, 2)}\n`
          : recording.body;
        fs.writeFileSync(path.join(fixturesDir, file), contents);
        return {
          method: recording.method,
          url: recording.url,
          status: recording.status,
          contentType: recording.contentType,
          file,
        };
      });

    const manifest: ApiFixtureManifest = {
      recordedFrom: upstream,
      recordedAt: new Date().toISOString(),
      fixtures,
    };
    fs.writeFileSync(
      path.join(fixturesDir, MANIFEST_FILE),
      `${JSON.stringify(manifest, null, 2)}\n`,
      "utf8"
    );
    return manifest;
  };

  return {
    handle,
    stats: () => ({ errors: [...errors], failures: [...failures] }),
    save,
  };
};

export interface ApiReplayer extends ApiHandler {
  manifest: ApiFixtureManifest;
  /** Requests the app made that have no fixture; each was answered 504. */
  missing: () => string[];
}

/**
 * Answers /api only from the fixtures. A request with no fixture gets a 504
 * and is reported, so a PR that changes how the app calls the OGC API shows up
 * as "run yarn lh:record" rather than as a mysterious unrendered page.
 */
export const createApiReplayer = ({
  fixturesDir,
}: {
  fixturesDir: string;
}): ApiReplayer => {
  const manifestPath = path.join(fixturesDir, MANIFEST_FILE);
  if (!fs.existsSync(manifestPath)) {
    throw new Error(
      `No API fixtures at ${fixturesDir} — run "yarn lh:record" to create them.`
    );
  }
  const manifest = JSON.parse(
    fs.readFileSync(manifestPath, "utf8")
  ) as ApiFixtureManifest;

  const responses = new Map(
    manifest.fixtures.map((fixture) => {
      const stored = fs.readFileSync(path.join(fixturesDir, fixture.file));
      const body = isJson(fixture.contentType)
        ? Buffer.from(JSON.stringify(JSON.parse(stored.toString("utf8"))))
        : stored;
      return [
        fixtureKey(fixture.method, fixture.url),
        {
          status: fixture.status,
          contentType: fixture.contentType,
          body,
          gzipped: gzipSync(body),
        },
      ];
    })
  );
  const missing: string[] = [];

  const handle = async (req: IncomingMessage, res: ServerResponse) => {
    const key = fixtureKey(req.method ?? "GET", req.url ?? "/");
    // Drain any request body so the connection is not left half-read
    await readBody(req);

    const response = responses.get(key);
    if (!response) {
      if (!missing.includes(key)) missing.push(key);
      sendError(res, 504, "no recorded fixture for this request");
      return;
    }
    sendBody(req, res, response);
  };

  return { handle, manifest, missing: () => [...missing] };
};
