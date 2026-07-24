import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { Vocab } from "./searchParamsReducer";
import { OGCCollection, OGCCollections } from "@/app/api/ogcCollectionTypes";
import { ErrorResponse } from "@/utils/ErrorBoundary";
import { FeatureCollection, Point } from "geojson";
import { trackSearchResultParameters } from "@/analytics/searchParamsEvent";
import { CloudOptimizedFeature } from "@/app/api/cloudOptimizedTypes";
import { ogcAxiosWithRetry } from "@/app/api/httpClient";
import * as searchApi from "@/app/api/search";
import * as datasetApi from "@/app/api/dataset";
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
  parameterVocabsResult: Array<Vocab>;
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
  parameterVocabsResult: new Array<Vocab>(),
};

// All thunks below delegate the HTTP work to the @/app/api modules, which
// throw a normalized ErrorResponse. This catch forwards it to redux.
const rejectWith = (thunkApi: any) => (error: unknown) =>
  thunkApi.rejectWithValue(error);

// Shared by the three fetchResult* thunks.
const searchCollections = (
  param: SearchParameters & { signal?: AbortSignal },
  thunkApi: any
) => {
  // Track search page url parameters, do not block the search
  setTimeout(() => trackSearchResultParameters(param), 500);
  return searchApi
    .getCollections(param, param.signal || thunkApi.signal)
    .catch(rejectWith(thunkApi));
};

const fetchSuggesterOptions = createAsyncThunk<
  any,
  SuggesterParameters,
  { rejectValue: ErrorResponse }
>("search/fetchSuggesterOptions", (params, thunkApi) =>
  searchApi.getAutocomplete(params).catch(rejectWith(thunkApi))
);

/**
 * Trunk for async action and update searcher, limited return properties to reduce load time,
 * default it, title,description
 */
const fetchResultWithStore = createAsyncThunk<
  OGCCollections,
  SearchParameters,
  { rejectValue: ErrorResponse }
>("search/fetchResultWithStore", searchCollections);
/**
 * Trunk for async action and update searcher, limited return properties to reduce load time,
 * default it, title,description. This one do not attach extraReducer and must return string due to redux expect
 * payload to be string. The caller need to call the jsonToCollections to convert it to OGCCollections class instance
 */
const fetchResultNoStore = createAsyncThunk<
  string,
  SearchParameters,
  { rejectValue: ErrorResponse }
>("search/fetchResultNoStore", searchCollections);

const fetchResultAppendStore = createAsyncThunk<
  OGCCollections,
  SearchParameters,
  { rejectValue: ErrorResponse }
>("search/fetchResultAppendStore", searchCollections);

const fetchResultByUuidNoStore = createAsyncThunk<
  OGCCollection,
  string,
  { rejectValue: ErrorResponse }
>("search/fetchResultByUuidNoStore", (id, thunkApi) =>
  searchApi.getCollectionById(id).catch(rejectWith(thunkApi))
);

export interface DatasetMetadataItem {
  uuid: string;
  dname: string;
  lat?: Record<string, unknown>;
  lng?: Record<string, unknown>;
  depth?: Record<string, unknown>;
}

export type DatasetMetadata = Record<string, DatasetMetadataItem>;

const fetchDatasetMetadataByUuid = createAsyncThunk<
  DatasetMetadata,
  string,
  { rejectValue: ErrorResponse }
>("search/fetchDatasetMetadataByUuid", (id, thunkApi) =>
  datasetApi.getDatasetMetadata(id).catch(rejectWith(thunkApi))
);

const fetchFeaturesByUuid = createAsyncThunk<
  FeatureCollection<Point, CloudOptimizedFeature>,
  string,
  { rejectValue: ErrorResponse }
>("search/fetchFeaturesByUuid", (id, thunkApi) =>
  datasetApi.getFeatureSummary(id).catch(rejectWith(thunkApi))
);

const fetchParameterVocabsWithStore = createAsyncThunk<
  Array<Vocab>,
  Map<string, string> | null,
  { rejectValue: ErrorResponse }
>("search/fetchParameterVocabsWithStore", (_param, thunkApi) =>
  searchApi.getParameterVocabs().catch(rejectWith(thunkApi))
);

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
      })
      .addCase(fetchParameterVocabsWithStore.fulfilled, (state, action) => {
        state.parameterVocabsResult = action.payload;
      });
  },
});

// Selector for this reducer's slice of the state.
const getSearchQueryResult = (state: RootState) =>
  state.search.collectionsQueryResult;

export {
  fetchSuggesterOptions,
  fetchResultWithStore,
  fetchResultNoStore,
  fetchResultAppendStore,
  fetchResultByUuidNoStore,
  fetchFeaturesByUuid,
  fetchDatasetMetadataByUuid,
  fetchParameterVocabsWithStore,
  jsonToOGCCollections,
  getSearchQueryResult,
};

export default searcher.reducer;
