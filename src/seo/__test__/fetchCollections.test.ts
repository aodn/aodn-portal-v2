import { afterEach, describe, expect, test, vi } from "vitest";
import { AxiosError } from "axios";
import { ogcAxiosWithRetry } from "@/app/store/searchReducer";
import { createErrorResponse } from "@/utils/ErrorBoundary";
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

  test("shows the status and the backend's own message of an HTTP error", () => {
    // searchReducer passes the backend's details as message and its message as details
    const error = createErrorResponse(
      500,
      "uri=/api/v1/ogc/collections;client=10.64.3.210",
      "Invalid properties in query [creation, revision, citation, license], check ?properties=xx"
    );

    expect(describeFetchError(error)).toBe(
      "HTTP 500 — Invalid properties in query [creation, revision, citation, license], check ?properties=xx — uri=/api/v1/ogc/collections;client=10.64.3.210"
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

  test("keeps the status and reason of an HTTP error the backend rejected", async () => {
    // The production backend replies 500 to properties it does not know yet
    const response = {
      status: 500,
      statusText: "Internal Server Error",
      headers: {},
      config: {},
      data: {
        message:
          "Invalid properties in query [creation, revision, citation, license], check ?properties=xx",
        details: "uri=/api/v1/ogc/collections;client=10.64.3.210",
      },
    };
    vi.spyOn(ogcAxiosWithRetry, "get").mockRejectedValue(
      new AxiosError(
        "Request failed with status code 500",
        AxiosError.ERR_BAD_RESPONSE,
        undefined,
        undefined,
        response as never
      )
    );

    await expect(fetchCollections()).rejects.toThrow(
      /Failed to fetch collections from .* — HTTP 500 — Invalid properties in query \[creation, revision, citation, license\], check \?properties=xx — uri=/
    );
  });

  test("shows a 2xx body that is not the collections JSON, such as a WAF challenge page", async () => {
    const challengePage = `<!DOCTYPE html><html><head><title>Checking your browser</title></head><body>${"x".repeat(5000)}</body></html>`;
    vi.spyOn(ogcAxiosWithRetry, "get").mockResolvedValue({
      data: challengePage,
    } as never);

    const failure = await fetchCollections().catch((error: Error) => error);

    expect(failure).toBeInstanceOf(Error);
    const message = (failure as Error).message;
    expect(message).toMatch(
      /^Unexpected response from .*\/ogc\/collections, expected collections JSON but got string: <!DOCTYPE html><html><head><title>Checking your browser<\/title>/
    );
    // a preview, not the whole page
    expect(message).not.toContain("x".repeat(3000));
    expect(message).toMatch(/… \(\d+ chars in total\)$/);
  });

  test("says so when the 2xx body is empty", async () => {
    vi.spyOn(ogcAxiosWithRetry, "get").mockResolvedValue({ data: "" } as never);

    await expect(fetchCollections()).rejects.toThrow(
      /expected collections JSON but got string: \(empty body\)$/
    );
  });
});
