/**
 * Record/replay cache in front of the OGC API.
 *
 * The measured routes are useless without real API data — /search renders an
 * empty list and /details falls back to "not found" — but letting three
 * Lighthouse runs each hit a live backend puts that backend's latency, and its
 * variance, straight into LCP. So the warm-up run records every API response
 * to disk and the measured runs replay them from memory: real payloads, no
 * network in the numbers.
 *
 * Node-only — never import in app code.
 */

import { createHash } from "crypto";
import fs from "fs";
import http from "http";
import https from "https";
import path from "path";
import type { IncomingMessage, ServerResponse } from "http";

interface CachedResponse {
  url: string;
  status: number;
  contentType?: string;
  contentEncoding?: string;
  bodyBase64: string;
}

export interface ApiCacheStats {
  hits: number;
  misses: number;
  /** Upstream answered >= 400: recorded, but the caller should know. */
  errors: string[];
  /** Upstream could not be reached at all. */
  failures: string[];
}

export interface ApiCache {
  handle: (req: IncomingMessage, res: ServerResponse) => Promise<void>;
  stats: () => ApiCacheStats;
  /** Requests seen since the last reset, for the readiness checks. */
  reset: () => void;
}

const UPSTREAM_TIMEOUT_MS = 30_000;
const MAX_REDIRECTS = 3;

const cacheKey = (method: string, url: string) =>
  createHash("sha1").update(`${method} ${url}`).digest("hex");

interface UpstreamResult {
  status: number;
  headers: http.IncomingHttpHeaders;
  body: Buffer;
}

const fetchUpstream = (
  target: string,
  method: string,
  headers: http.IncomingHttpHeaders,
  redirectsLeft = MAX_REDIRECTS
): Promise<UpstreamResult> =>
  new Promise((resolve, reject) => {
    const url = new URL(target);
    const client = url.protocol === "http:" ? http : https;

    const request = client.request(
      url,
      {
        method,
        headers: {
          accept: headers.accept ?? "application/json",
          // Recorded as received; the bytes on the wire are what Lighthouse
          // should see.
          "accept-encoding": "gzip",
          "user-agent": "aodn-portal-lighthouse-ci",
          host: url.host,
        },
      },
      (response) => {
        const status = response.statusCode ?? 0;
        const location = response.headers.location;

        if (status >= 300 && status < 400 && location && redirectsLeft > 0) {
          response.resume();
          fetchUpstream(
            new URL(location, url).toString(),
            method,
            headers,
            redirectsLeft - 1
          ).then(resolve, reject);
          return;
        }

        const chunks: Buffer[] = [];
        response.on("data", (chunk: Buffer) => chunks.push(chunk));
        response.on("end", () =>
          resolve({
            status,
            headers: response.headers,
            body: Buffer.concat(chunks),
          })
        );
        response.on("error", reject);
      }
    );

    request.setTimeout(UPSTREAM_TIMEOUT_MS, () =>
      request.destroy(new Error(`upstream timeout after ${target}`))
    );
    request.on("error", reject);
    request.end();
  });

export const createApiCache = ({
  upstream,
  cacheDir,
  offline = false,
}: {
  upstream: string;
  cacheDir: string;
  /** Replay only; a miss becomes a 504 instead of an upstream request. */
  offline?: boolean;
}): ApiCache => {
  fs.mkdirSync(cacheDir, { recursive: true });
  const memory = new Map<string, CachedResponse>();
  let stats: ApiCacheStats = { hits: 0, misses: 0, errors: [], failures: [] };

  const readDisk = (key: string): CachedResponse | undefined => {
    const file = path.join(cacheDir, `${key}.json`);
    if (!fs.existsSync(file)) return undefined;
    try {
      return JSON.parse(fs.readFileSync(file, "utf8")) as CachedResponse;
    } catch {
      // A truncated file from an interrupted run: re-record it.
      return undefined;
    }
  };

  const writeDisk = (key: string, entry: CachedResponse) =>
    fs.writeFileSync(
      path.join(cacheDir, `${key}.json`),
      JSON.stringify(entry),
      "utf8"
    );

  const send = (res: ServerResponse, entry: CachedResponse) => {
    const body = Buffer.from(entry.bodyBase64, "base64");
    const headers: Record<string, string> = {
      "content-length": String(body.byteLength),
      // Identical bytes for every run; nothing is served from the HTTP cache.
      "cache-control": "no-store",
    };
    if (entry.contentType) headers["content-type"] = entry.contentType;
    if (entry.contentEncoding) {
      headers["content-encoding"] = entry.contentEncoding;
    }
    res.writeHead(entry.status, headers);
    res.end(body);
  };

  const handle = async (req: IncomingMessage, res: ServerResponse) => {
    const url = req.url ?? "/";
    const method = (req.method ?? "GET").toUpperCase();
    const cacheable = method === "GET";
    const key = cacheKey(method, url);

    if (cacheable) {
      const cached = memory.get(key) ?? readDisk(key);
      if (cached) {
        memory.set(key, cached);
        stats.hits += 1;
        send(res, cached);
        return;
      }
    }

    stats.misses += 1;

    if (offline) {
      stats.failures.push(`${method} ${url} (not recorded)`);
      res.writeHead(504, { "content-type": "application/json" });
      res.end(JSON.stringify({ error: "not recorded" }));
      return;
    }

    try {
      const result = await fetchUpstream(`${upstream}${url}`, method, {
        accept: req.headers.accept,
      });
      const entry: CachedResponse = {
        url,
        status: result.status,
        contentType: result.headers["content-type"],
        contentEncoding: result.headers["content-encoding"],
        bodyBase64: result.body.toString("base64"),
      };

      if (result.status >= 400) stats.errors.push(`${result.status} ${url}`);
      // Only successful GETs are worth replaying.
      if (cacheable && result.status < 400) {
        memory.set(key, entry);
        writeDisk(key, entry);
      }
      send(res, entry);
    } catch (error) {
      const reason = error instanceof Error ? error.message : String(error);
      stats.failures.push(`${method} ${url}: ${reason}`);
      res.writeHead(502, { "content-type": "application/json" });
      res.end(JSON.stringify({ error: reason }));
    }
  };

  return {
    handle,
    stats: () => ({
      ...stats,
      errors: [...stats.errors],
      failures: [...stats.failures],
    }),
    reset: () => {
      stats = { hits: 0, misses: 0, errors: [], failures: [] };
    },
  };
};
