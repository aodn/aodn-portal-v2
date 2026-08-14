import { afterEach, describe, expect, test, vi } from "vitest";
import { ogcAxiosWithRetry } from "@/app/store/searchReducer";
import {
  describeFetchError,
  fetchCollections,
  SEO_PROPERTIES,
} from "../fetchCollections";
import { BASE_URL, OGC_API_BASE } from "../constants";

const singlePage = { total: 1, collections: [{ id: "abc-123" }] };

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

describe("fetchCollections uses fetchResultNoStore", () => {
  afterEach(() => {
    vi.restoreAllMocks();
  });

  test("fetches from the API origin, not the public site host", async () => {
    const get = vi
      .spyOn(ogcAxiosWithRetry, "get")
      .mockImplementation(async () => {
        expect(ogcAxiosWithRetry.defaults.baseURL).toBe(
          `${OGC_API_BASE}/api/v1`
        );
        expect(ogcAxiosWithRetry.defaults.baseURL).not.toContain(BASE_URL);
        expect(ogcAxiosWithRetry.defaults.baseURL).not.toContain("//api");
        return { data: singlePage } as never;
      });

    const collections = await fetchCollections();

    expect(collections.map((item) => item.id)).toEqual(["abc-123"]);
    expect(get).toHaveBeenCalledWith(
      "/ogc/collections",
      expect.objectContaining({
        params: expect.objectContaining({
          properties: SEO_PROPERTIES,
          filter: "page_size=1000",
        }),
      })
    );
    expect(ogcAxiosWithRetry.defaults.baseURL).toBe("/api/v1");
  });

  test("overrides axios's default UA, which WAF bot rules flag", async () => {
    vi.spyOn(ogcAxiosWithRetry, "get").mockImplementation(async () => {
      expect(
        String(ogcAxiosWithRetry.defaults.headers.common["User-Agent"])
      ).toContain("Mozilla/5.0");
      return { data: singlePage } as never;
    });

    await fetchCollections();
  });
});

// Only axios is mocked, so the real Redux store and thunk run: a Redux
// upgrade that changes createAsyncThunk, dispatch or unwrap fails here first
describe("fetchCollections walks every page", () => {
  afterEach(() => {
    vi.restoreAllMocks();
  });

  test("follows search_after until every collection is fetched", async () => {
    const pages = [
      {
        total: 3,
        collections: [{ id: "a" }, { id: "b" }],
        search_after: ["cursor-1"],
      },
      { total: 3, collections: [{ id: "c" }], search_after: ["cursor-2"] },
    ];
    const get = vi
      .spyOn(ogcAxiosWithRetry, "get")
      .mockImplementation(async () => ({ data: pages.shift() }) as never);

    const collections = await fetchCollections();

    expect(collections.map((item) => item.id)).toEqual(["a", "b", "c"]);
    expect(get).toHaveBeenCalledTimes(2);
    // the second request must carry the first page's cursor
    expect(get.mock.calls[1][1]?.params?.filter).toContain(
      "search_after='cursor-1'"
    );
  });

  test("stops on an empty page and warns when total was not reached", async () => {
    const warn = vi.spyOn(console, "warn").mockImplementation(() => {});
    const pages = [
      { total: 5, collections: [{ id: "a" }], search_after: ["cursor-1"] },
      { total: 5, collections: [], search_after: [] },
    ];
    const get = vi
      .spyOn(ogcAxiosWithRetry, "get")
      .mockImplementation(async () => ({ data: pages.shift() }) as never);

    const collections = await fetchCollections("id");

    expect(collections.map((item) => item.id)).toEqual(["a"]);
    expect(get).toHaveBeenCalledTimes(2);
    expect(warn).toHaveBeenCalledWith("Expected 5 collections but got 1");
  });

  test("wraps a failed request with the API URL for the CI log", async () => {
    vi.spyOn(ogcAxiosWithRetry, "get").mockRejectedValue(new Error("boom"));

    await expect(fetchCollections()).rejects.toThrow(
      /Failed to fetch collections from .* — boom/
    );
  });
});
