/**
 * SEO — the collections FETCH host is overridable, the PUBLIC host is not.
 *
 * Sitemap and prerender fetch every record at build time. When the build
 * machine cannot reach BASE_URL (e.g. a WAF blocks CI runners), SEO_API_BASE
 * redirects only the fetches; URLs written into the sitemap must keep using
 * the public BASE_URL.
 */

import { afterEach, describe, expect, test, vi } from "vitest";
import { BASE_URL } from "../constants";

// One page with no search_after ends the pagination loop immediately
const singlePage = { total: 1, collections: [{ id: "abc-123" }] };

// API_URL is computed when the module loads, so each test imports a fresh copy
const importFreshSitemapUtils = async () => {
  vi.resetModules();
  return await import("../SitemapUtils");
};

const interceptFetch = () => {
  const fetch = vi.fn().mockResolvedValue({
    ok: true,
    json: async () => singlePage,
  });
  vi.stubGlobal("fetch", fetch);
  return fetch;
};

const requestedUrl = (fetch: ReturnType<typeof interceptFetch>) =>
  String(fetch.mock.calls[0][0]);

describe("fetchAllCollections fetch host", () => {
  afterEach(() => {
    vi.unstubAllEnvs();
    vi.unstubAllGlobals();
  });

  test("without SEO_API_BASE it fetches from the public BASE_URL", async () => {
    const fetch = interceptFetch();
    const { fetchAllCollections } = await importFreshSitemapUtils();

    const collections = await fetchAllCollections();

    expect(collections).toEqual(singlePage.collections);
    expect(requestedUrl(fetch)).toContain(`${BASE_URL}/api/v1/ogc/collections`);
  });

  test("with SEO_API_BASE it fetches from the override host instead", async () => {
    vi.stubEnv("SEO_API_BASE", "https://api.example.internal");
    const fetch = interceptFetch();
    const { fetchAllCollections } = await importFreshSitemapUtils();

    await fetchAllCollections();

    expect(requestedUrl(fetch)).toContain(
      "https://api.example.internal/api/v1/ogc/collections"
    );
    expect(requestedUrl(fetch)).not.toContain(BASE_URL);
  });
});
