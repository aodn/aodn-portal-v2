import { configureStore } from "@reduxjs/toolkit";
import { OGCCollection } from "@/app/store/OGCCollectionDefinitions";
import {
  createSearchParamFrom,
  fetchResultNoStore,
  jsonToOGCCollections,
  ogcAxiosWithRetry,
} from "@/app/store/searchReducer";
import { ErrorResponse } from "@/utils/ErrorBoundary";
import { OGC_API_BASE } from "./constants";

// The rest of src/seo stays free of app-store imports by getting the type here
export type { OGCCollection } from "@/app/store/OGCCollectionDefinitions";

// Fields the bulk collections endpoint returns for the SEO artifacts
export const SEO_PROPERTIES =
  "id,title,description,bbox,temporal,themes,creation,revision,citation,license,dataset_provider";

// fetchResultNoStore returns one page; walk search_after until we have them all
const API_URL = `${OGC_API_BASE}/api/v1/ogc/collections`;
const PAGE_SIZE = 1000;

// How much of an unexpected body the CI log shows
const BODY_PREVIEW_CHARS = 2000;

// Axios defaults to "axios/x.y.z", which WAF bot rules flag; present a
// browser-like UA so CI traffic is not challenged
const USER_AGENT =
  "Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/126.0.0.0 Safari/537.36";

// Node reports every network failure as "fetch failed" and puts the reason that
// actually identifies it — DNS, TLS, connection reset — in error.cause.
// searchReducer turns an HTTP error into an ErrorResponse whose message holds
// the backend's details and whose details holds the backend's message.
export const describeFetchError = (error: unknown) => {
  if (error instanceof ErrorResponse) {
    return [`HTTP ${error.statusCode}`, error.details, error.message]
      .filter(Boolean)
      .join(" — ");
  }
  if (!(error instanceof Error)) return String(error);
  // Node has carried .cause since 16.9; the ES2020 lib just does not type it
  const { cause } = error as Error & { cause?: unknown };
  return cause instanceof Error
    ? `${error.message}: ${cause.message}`
    : error.message;
};

const isCollectionsPage = (
  payload: unknown
): payload is { collections: unknown[] } =>
  typeof payload === "object" &&
  payload !== null &&
  Array.isArray((payload as { collections?: unknown }).collections);

// A WAF challenge page or an empty body is a 2xx too; the CI log needs to
// show what came back instead of a TypeError inside jsonToOGCCollections
const describePayload = (payload: unknown) => {
  const text = typeof payload === "string" ? payload : JSON.stringify(payload);
  if (!text) return `${typeof payload}: (empty body)`;
  const preview =
    text.length > BODY_PREVIEW_CHARS
      ? `${text.slice(0, BODY_PREVIEW_CHARS)}… (${text.length} chars in total)`
      : text;
  return `${typeof payload}: ${preview}`;
};

const withOgcHost = async <T>(run: () => Promise<T>): Promise<T> => {
  // Point the shared app client at the absolute OGC host; restore afterwards
  // so importing this module in tests does not leak Node-only defaults
  const originalBaseURL = ogcAxiosWithRetry.defaults.baseURL;
  const originalUA = ogcAxiosWithRetry.defaults.headers.common["User-Agent"];
  ogcAxiosWithRetry.defaults.baseURL = `${OGC_API_BASE}/api/v1`;
  ogcAxiosWithRetry.defaults.headers.common["User-Agent"] = USER_AGENT;
  try {
    return await run();
  } finally {
    ogcAxiosWithRetry.defaults.baseURL = originalBaseURL;
    if (originalUA === undefined) {
      delete ogcAxiosWithRetry.defaults.headers.common["User-Agent"];
    } else {
      ogcAxiosWithRetry.defaults.headers.common["User-Agent"] = originalUA;
    }
  }
};

export const fetchCollections = async (
  properties = SEO_PROPERTIES
): Promise<OGCCollection[]> => {
  console.log(`Fetching ${properties} from ${API_URL}`);

  return withOgcHost(async () => {
    const collections: OGCCollection[] = [];
    let searchAfter: string[] | undefined;
    let total: number | undefined;
    const store = configureStore({ reducer: (state = {}) => state });

    for (;;) {
      const params = createSearchParamFrom(
        {},
        { pagesize: PAGE_SIZE, searchafter: searchAfter }
      );
      params.properties = properties;

      let payload: unknown;
      try {
        payload = await store.dispatch(fetchResultNoStore(params)).unwrap();
      } catch (error) {
        throw new Error(
          `Failed to fetch collections from ${API_URL} — ${describeFetchError(error)}`
        );
      }

      if (!isCollectionsPage(payload)) {
        throw new Error(
          `Unexpected response from ${API_URL}, expected collections JSON but got ${describePayload(payload)}`
        );
      }

      const pageResult = jsonToOGCCollections(payload);
      total = pageResult.total;
      if (pageResult.collections.length === 0) break;
      collections.push(...pageResult.collections);
      console.log(`Fetched ${collections.length}/${total} collections`);

      if (
        pageResult.search_after.length === 0 ||
        collections.length >= (total ?? 0)
      ) {
        break;
      }
      searchAfter = pageResult.search_after;
    }

    if (collections.length !== total) {
      console.warn(
        `Expected ${total} collections but got ${collections.length}`
      );
    }
    return collections;
  });
};
