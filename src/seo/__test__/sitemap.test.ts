/**
 * SEO — records are fetched from OGC_API_BASE, while the URLs written into
 * the sitemap use the site host (BASE_URL). The fetch host must stay distinct
 * from BASE_URL and must build clean URLs (no "//api" — the server 500s it).
 */

import { afterEach, describe, expect, test, vi } from "vitest";
import { BASE_URL, OGC_API_BASE } from "../constants";
import { describeFetchError } from "../sitemap";

// One page with no search_after ends the pagination loop immediately
const singlePage = { total: 1, collections: [{ id: "abc-123" }] };

// API_URL is computed when the module loads, so each test imports a fresh copy
const importFreshSitemap = async () => {
  vi.resetModules();
  return await import("../sitemap");
};

const interceptFetch = () => {
  const fetch = vi.fn().mockResolvedValue({
    ok: true,
    text: async () => JSON.stringify(singlePage),
  });
  vi.stubGlobal("fetch", fetch);
  return fetch;
};

const requestedUrl = (fetch: ReturnType<typeof interceptFetch>) =>
  String(fetch.mock.calls[0][0]);

describe("describeFetchError", () => {
  test("surfaces the cause, without which every network failure reads the same", () => {
    const error = new Error("fetch failed");
    (error as Error & { cause?: unknown }).cause = new Error(
      "getaddrinfo ENOTFOUND ogcapi-production.aodn.org.au"
    );

    expect(describeFetchError(error)).toBe(
      "fetch failed: getaddrinfo ENOTFOUND ogcapi-production.aodn.org.au"
    );
  });

  test("falls back to the message when there is no cause", () => {
    expect(describeFetchError(new Error("HTTP 503 for /collections"))).toBe(
      "HTTP 503 for /collections"
    );
  });
});

describe("fetchAllCollections fetch host", () => {
  afterEach(() => {
    vi.unstubAllGlobals();
  });

  test("fetches from the API origin, not the public site host", async () => {
    const fetch = interceptFetch();
    const { fetchAllCollections } = await importFreshSitemap();

    const collections = await fetchAllCollections();

    expect(collections).toEqual(singlePage.collections);
    expect(requestedUrl(fetch)).toContain(
      `${OGC_API_BASE}/api/v1/ogc/collections`
    );
    expect(requestedUrl(fetch)).not.toContain(BASE_URL);
    // A trailing slash in OGC_API_BASE would build "//api" URLs, which 500
    expect(requestedUrl(fetch)).not.toContain("//api");
  });

  test("overrides Node's default UA, which WAF bot rules flag", async () => {
    const fetch = interceptFetch();
    const { fetchAllCollections } = await importFreshSitemap();

    await fetchAllCollections();

    const headers = (fetch.mock.calls[0][1] as RequestInit).headers as Record<
      string,
      string
    >;
    expect(headers["User-Agent"]).toContain("Mozilla/5.0");
  });
});
