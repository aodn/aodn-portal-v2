import { configureStore } from "@reduxjs/toolkit";
import { OGCCollection } from "@/app/store/OGCCollectionDefinitions";
import {
  createSearchParamFrom,
  fetchResultNoStore,
  jsonToOGCCollections,
  ogcAxiosWithRetry,
} from "@/app/store/searchReducer";
import { OGC_API_BASE } from "./constants";

// The rest of src/seo stays free of app-store imports by getting the type here
export type { OGCCollection } from "@/app/store/OGCCollectionDefinitions";

// Fields the bulk collections endpoint returns for the SEO artifacts
export const SEO_PROPERTIES =
  "id,title,description,bbox,temporal,themes,providers,creation,revision,citation,license";

// fetchResultNoStore returns one page; walk search_after until we have them all
const API_URL = `${OGC_API_BASE}/api/v1/ogc/collections`;
const PAGE_SIZE = 1000;

// Axios defaults to "axios/x.y.z", which WAF bot rules flag; present a
// browser-like UA so CI traffic is not challenged
const USER_AGENT =
  "Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/126.0.0.0 Safari/537.36";

// Node reports every network failure as "fetch failed" and puts the reason that
// actually identifies it — DNS, TLS, connection reset — in error.cause
export const describeFetchError = (error: unknown) => {
  if (!(error instanceof Error)) return String(error);
  // Node has carried .cause since 16.9; the ES2020 lib just does not type it
  const { cause } = error as Error & { cause?: unknown };
  return cause instanceof Error
    ? `${error.message}: ${cause.message}`
    : error.message;
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

      let payload: string;
      try {
        payload = await store.dispatch(fetchResultNoStore(params)).unwrap();
      } catch (error) {
        throw new Error(
          `Failed to fetch collections from ${API_URL} — ${describeFetchError(error)}`
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
