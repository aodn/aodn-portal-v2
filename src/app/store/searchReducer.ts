import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { OGCCollection, OGCCollections } from "@/app/api/ogcCollectionTypes";
import { ErrorResponse } from "@/utils/ErrorBoundary";
import { ogcAxiosWithRetry } from "@/app/api/httpClient";
import * as searchApi from "@/app/api/search";
import type { RootState } from "./store";
import {
  createSearchParamFrom,
  createSuggesterParamFrom,
  SearchControl,
  SearchParameters,
  SuggesterParameters,
} from "@/app/api/searchQueryBuilder";

// Re-export the API-layer building blocks so existing importers keep
// working; new code should import them from @/app/api and @/app/store.
export { DatasetFrequency, DatasetStatus } from "./searchParamsReducer";
export { createSearchParamFrom, createSuggesterParamFrom, ogcAxiosWithRetry };
export type { SearchControl, SearchParameters, SuggesterParameters };

export interface CollectionsQueryType {
  result: OGCCollections;
  query: SearchParameters;
}

interface SearchState {
  collectionsQueryResult: CollectionsQueryType;
}
export const DEFAULT_SEARCH_PAGE_SIZE = 11;
export const FULL_LIST_PAGE_SIZE = 21;

const jsonToOGCCollections = (json: any): OGCCollections => {
  return new OGCCollections(
    json.collections.map((collection: any) =>
      Object.assign(new OGCCollection(), collection)
    ),
    json.links,
    json.total,
    json.search_after
  );
};

const initialState: SearchState = {
  collectionsQueryResult: {
    result: new OGCCollections(),
    query: {},
  },
};

// These two thunks are the last hand-written fetches: unlike the RTK
// Query endpoints in ogcApi.ts, their results are written into this
// slice (replace vs append) which many components read via
// getSearchQueryResult. They migrate to RTK Query when those consumers
// move to hooks — see TECH_DEBT.md.
const rejectWith = (thunkApi: any) => (error: unknown) =>
  thunkApi.rejectWithValue(error);

const searchCollections = (
  param: SearchParameters & { signal?: AbortSignal },
  thunkApi: any
) =>
  searchApi
    .getCollections(param, param.signal || thunkApi.signal)
    .catch(rejectWith(thunkApi));

/**
 * Thunk for async action and update searcher, limited return properties to reduce load time,
 * default it, title,description
 */
const fetchResultWithStore = createAsyncThunk<
  OGCCollections,
  SearchParameters,
  { rejectValue: ErrorResponse }
>("search/fetchResultWithStore", searchCollections);

const fetchResultAppendStore = createAsyncThunk<
  OGCCollections,
  SearchParameters,
  { rejectValue: ErrorResponse }
>("search/fetchResultAppendStore", searchCollections);

const searcher = createSlice({
  name: "search",
  initialState: initialState,
  reducers: {},
  extraReducers(builder) {
    builder
      .addCase(fetchResultWithStore.fulfilled, (state, action) => {
        state.collectionsQueryResult.result = jsonToOGCCollections(
          // payload must be serializable aka no class method, so we need to defer class creation until here
          action.payload
        );
        state.collectionsQueryResult.query = action.meta.arg;
      })
      .addCase(fetchResultAppendStore.fulfilled, (state, action) => {
        // payload must be serializable aka no class method, so we need to defer class creation until here
        const new_collections = jsonToOGCCollections(action.payload);
        // Create a new instance so in case people need to use useState it signal an update
        const collections = state.collectionsQueryResult.result.clone();
        collections.merge(new_collections);

        state.collectionsQueryResult.result = collections;
        state.collectionsQueryResult.query = action.meta.arg;
      });
  },
});

// Selector for this reducer's slice of the state.
const getSearchQueryResult = (state: RootState) =>
  state.search.collectionsQueryResult;

export {
  fetchResultWithStore,
  fetchResultAppendStore,
  jsonToOGCCollections,
  getSearchQueryResult,
};

export default searcher.reducer;
