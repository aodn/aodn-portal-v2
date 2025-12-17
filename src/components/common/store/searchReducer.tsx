import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios, { AxiosError } from "axios";
import axiosRetry, { isNetworkError, isRetryableError } from "axios-retry";
import { ParameterState, Vocab } from "./componentParamReducer";
import {
  cqlDefaultFilters,
  DatasetGroup,
  IsNotNull,
  ParameterVocabsIn,
  PlatformFilter,
  PolygonOperation,
  TemporalAfterOrBefore,
  TemporalDuring,
  UpdateFrequency,
} from "../cqlFilters";
import { OGCCollection, OGCCollections } from "./OGCCollectionDefinitions";
import {
  createErrorResponse,
  errorHandling,
  ErrorResponse,
} from "../../../utils/ErrorBoundary";
import { FeatureCollection, Point } from "geojson";
import { mergeWithDefaults } from "../../../utils/ObjectUtils";
import {
  DatasetDownloadRequest,
  WFSDownloadRequest,
} from "../../../pages/detail-page/context/DownloadDefinitions";
import {
  getDateConditionFrom,
  getMultiPolygonFrom,
} from "../../../utils/DownloadConditionUtils";
import { trackSearchResultParameters } from "../../../analytics/searchParamsEvent";
import {
  MapFeatureRequest,
  MapFeatureResponse,
  MapFieldResponse,
  MapLayerResponse,
} from "./GeoserverDefinitions";
import dayjs from "dayjs";
import { dateDefault } from "../constants";
import { CloudOptimizedFeature } from "./CloudOptimizedDefinitions";

export enum DatasetFrequency {
  REALTIME = "real-time",
  DELAYED = "delayed",
  OTHER = "other",
}

export type SuggesterParameters = {
  input?: string;
  filter?: string;
};

export type SearchParameters = {
  text?: string;
  filter?: string;
  properties?: string;
  sortby?: string;
};
// Control the behavior of search behavior not part of the query
export type SearchControl = {
  pagesize?: number;
  searchafter?: Array<string>;
  score?: number;
};

type OGCSearchParameters = {
  q?: string;
  filter?: string;
  properties?: string;
  sortby?: string;
};

export interface CollectionsQueryType {
  result: OGCCollections;
  query: SearchParameters;
}

interface ObjectValue {
  collectionsQueryResult: CollectionsQueryType;
  parameterVocabsResult: Array<Vocab>;
}
export const DEFAULT_SEARCH_PAGE_SIZE = 11;
export const DEFAULT_SEARCH_MAP_SIZE = 1500;
export const FULL_LIST_PAGE_SIZE = 21;

const DEFAULT_SEARCH_SCORE = import.meta.env.VITE_ELASTIC_RELEVANCE_SCORE;
const TIMEOUT = 60000;
const WFS_DOWNLOAD_TIMEOUT =
  Number(import.meta.env.VITE_WFS_DOWNLOADING_TIMEOUT) || 1200000; // Default 20 minutes timeout for WFS downloads

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

const initialState: ObjectValue = {
  collectionsQueryResult: {
    result: new OGCCollections(),
    query: {},
  },
  parameterVocabsResult: new Array<Vocab>(),
};

// ---------------------------------------------------------------------
// 1. Create a **dedicated** axios instance for the OGC endpoint
//     (you can reuse the default `axios` if you want global retries)
const ogcAxiosWithRetry = axios.create({
  baseURL: "/api/v1",
  timeout: 15_000,
});

// 2. Attach retry logic
axiosRetry(ogcAxiosWithRetry, {
  retries: 10,
  retryDelay: (retryCount) => {
    // exponential back-off: start with 1000ms
    return 1000 * Math.pow(2, retryCount - 1);
  },

  // -----------------------------------------------------------------
  // 3. **Which errors should trigger a retry?**
  // -----------------------------------------------------------------
  retryCondition: (error) => {
    // 1. Network / DNS / timeout errors
    if (isNetworkError(error)) return true;

    // 2. 5xx server errors + a few 4xx that are usually transient
    if (error.response) {
      const code = error.response.status;
      return code >= 500 || [408, 429].includes(code);
    }

    // 3. Timeout (axios sets `code: 'ECONNABORTED'`)
    if (error.code === "ECONNABORTED") return true;

    // 4. Any other retryable error flagged by axios-retry
    return isRetryableError(error);
  },
});
/**
 Define search functions
 */
const searchResult = async (
  param: SearchParameters & { signal?: AbortSignal },
  thunkApi: any
) => {
  const p: OGCSearchParameters = {
    properties:
      param.properties !== undefined
        ? param.properties
        : // Including the keyword "bbox" to ensure spatial extents is returned
          "id,title,description,status,links,assets_summary,bbox",
  };

  if (param.text !== undefined && param.text.length !== 0) {
    p.q = param.text;
  }
  // DO NOT EXPOSE score externally, you should not allow share
  // url with score, alter UI behavior which is hard to control
  if (param.filter !== undefined && param.filter.length !== 0) {
    p.filter = param.filter;
  }

  if (param.sortby !== undefined && param.sortby.length !== 0) {
    p.sortby = param.sortby;
  }

  // Track search page url parameters, do not block the search
  setTimeout(() => trackSearchResultParameters(param), 500);

  return ogcAxiosWithRetry
    .get<string>("/ogc/collections", {
      params: p,
      timeout: TIMEOUT,
      signal: param.signal || thunkApi.signal,
    })
    .then((response) => response.data)
    .catch((error: Error | AxiosError | ErrorResponse) => {
      if (axios.isAxiosError(error) && error.response) {
        return thunkApi.rejectWithValue(
          createErrorResponse(
            error?.response?.status,
            error?.response?.data.details
              ? error?.response?.data.details
              : error?.response?.statusText,
            error?.response?.data.message,
            error?.response?.data.timestamp,
            error?.response?.data.parameters
          )
        );
      } else {
        return thunkApi.rejectWithValue(error);
      }
    });
};
// TODO: Why no param needed?
const searchParameterVocabs = async (
  param: Map<string, string> | null,
  thunkApi: any
) =>
  ogcAxiosWithRetry
    .get<Array<Vocab>>("/ogc/ext/parameter/vocabs", {
      timeout: TIMEOUT,
    })
    .then((response) => response.data)
    .catch((error: Error | AxiosError | ErrorResponse) => {
      if (axios.isAxiosError(error) && error.response) {
        return thunkApi.rejectWithValue(
          createErrorResponse(
            error?.response?.status,
            error?.response?.data.details
              ? error?.response?.data.details
              : error?.response?.statusText,
            error?.response?.data.message,
            error?.response?.data.timestamp,
            error?.response?.data.parameters
          )
        );
      } else {
        return thunkApi.rejectWithValue(error);
      }
    });

const fetchSuggesterOptions = createAsyncThunk<
  any,
  SuggesterParameters,
  { rejectValue: ErrorResponse }
>(
  "search/fetchSuggesterOptions",
  async (params: SuggesterParameters, thunkApi: any) =>
    ogcAxiosWithRetry
      .get<any>("/ogc/ext/autocomplete", {
        params: params,
        timeout: TIMEOUT,
      })
      .then((response) => response.data)
      .catch((error: Error | AxiosError | ErrorResponse) => {
        if (axios.isAxiosError(error) && error.response) {
          return thunkApi.rejectWithValue(
            createErrorResponse(
              error?.response?.status,
              error?.response?.data.details
                ? error?.response?.data.details
                : error?.response?.statusText,
              error?.response?.data.message,
              error?.response?.data.timestamp,
              error?.response?.data.parameters
            )
          );
        } else {
          return thunkApi.rejectWithValue(error);
        }
      })
);

/**
 * Trunk for async action and update searcher, limited return properties to reduce load time,
 * default it, title,description
 */
const fetchResultWithStore = createAsyncThunk<
  OGCCollections,
  SearchParameters,
  { rejectValue: ErrorResponse }
>("search/fetchResultWithStore", searchResult);
/**
 * Trunk for async action and update searcher, limited return properties to reduce load time,
 * default it, title,description. This one do not attach extraReducer and must return string due to redux expect
 * payload to be string. The caller need to call the jsonToCollections to convert it to OGCCollections class instance
 */
const fetchResultNoStore = createAsyncThunk<
  string,
  SearchParameters,
  { rejectValue: ErrorResponse }
>("search/fetchResultNoStore", searchResult);

const fetchResultAppendStore = createAsyncThunk<
  OGCCollections,
  SearchParameters,
  { rejectValue: ErrorResponse }
>("search/fetchResultAppendStore", searchResult);

const fetchResultByUuidNoStore = createAsyncThunk<
  OGCCollection,
  string,
  { rejectValue: ErrorResponse }
>("search/fetchResultByUuidNoStore", async (id: string, thunkApi: any) =>
  ogcAxiosWithRetry
    .get<OGCCollection>(`/ogc/collections/${id}`)
    .then((response) => Object.assign(new OGCCollection(), response.data))
    .catch(errorHandling(thunkApi))
);

const fetchFeaturesByUuid = createAsyncThunk<
  FeatureCollection<Point, CloudOptimizedFeature>,
  string,
  { rejectValue: ErrorResponse }
>("search/fetchDatasetByUuid", async (id: string, thunkApi: any) =>
  ogcAxiosWithRetry
    .get<FeatureCollection<Point>>(`/ogc/collections/${id}/items/summary`)
    .then((response) => ({
      ...response.data,
      features: response.data.features.map((feature: any) => ({
        ...feature,
        properties: {
          ...feature.properties,
          timestamp: dayjs(
            feature.properties?.date,
            [dateDefault.DATE_YEAR_MONTH_FORMAT, dateDefault.DATE_FORMAT],
            true
          ).valueOf(),
        },
      })),
    }))
    .catch(errorHandling(thunkApi))
);

const processDatasetDownload = createAsyncThunk<
  any,
  DatasetDownloadRequest,
  { rejectValue: ErrorResponse }
>(
  "download/downloadDataset",
  async (reequest: DatasetDownloadRequest, thunkAPI: any) => {
    try {
      const response = await ogcAxiosWithRetry.post(
        "/ogc/processes/download/execution",
        reequest
      );
      return response.data;
    } catch (error) {
      errorHandling(thunkAPI);
    }
  }
);

const processWFSDownload = createAsyncThunk<
  any,
  WFSDownloadRequest,
  { rejectValue: ErrorResponse }
>(
  "download/downloadWFS",
  async (request: WFSDownloadRequest, thunkAPI: any) => {
    try {
      // Extract download conditions
      const dateRange = getDateConditionFrom(request.downloadConditions);
      const multiPolygon = getMultiPolygonFrom(request.downloadConditions);

      const requestBody = {
        inputs: {
          uuid: request.uuid,
          start_date: dateRange.start,
          end_date: dateRange.end,
          multi_polygon: multiPolygon,
          layer_name: request.layerName,
        },
        outputs: {},
        subscriber: {
          successUri: "",
          inProgressUri: "",
          failedUri: "",
        },
      };

      return ogcAxiosWithRetry.post(
        "/ogc/processes/downloadWfs/execution",
        requestBody,
        {
          adapter: "fetch", // Use fetch adapter for streaming
          responseType: "stream",
          headers: {
            "Content-Type": "application/json",
            Accept: "text/event-stream",
            "Cache-Control": "no-cache",
          },
          timeout: WFS_DOWNLOAD_TIMEOUT,
          signal: thunkAPI.signal,
        }
      );
    } catch (error) {
      errorHandling(thunkAPI);
    }
  }
);

const fetchParameterVocabsWithStore = createAsyncThunk<
  Array<Vocab>,
  Map<string, string> | null,
  { rejectValue: ErrorResponse }
>("search/fetchParameterVocabsWithStore", searchParameterVocabs);

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

const fetchGeoServerMapFeature = createAsyncThunk<
  MapFeatureResponse,
  MapFeatureRequest,
  { rejectValue: ErrorResponse }
>(
  "geoserver/fetchGeoServerMapFeature",
  (request: MapFeatureRequest, thunkApi: any) => {
    return ogcAxiosWithRetry
      .get<MapFeatureResponse>(
        `/ogc/collections/${request.uuid}/items/wms_map_feature`,
        { params: request, timeout: TIMEOUT, signal: thunkApi.signal }
      )
      .then((response) => response.data)
      .catch(errorHandling(thunkApi));
  }
);

const fetchGeoServerMapFields = createAsyncThunk<
  Array<MapFieldResponse>,
  MapFeatureRequest,
  { rejectValue: ErrorResponse }
>(
  "geoserver/fetchGeoServerMapFields",
  (request: MapFeatureRequest, thunkApi: any) => {
    return ogcAxiosWithRetry
      .get<MapFeatureResponse>(
        `/ogc/collections/${request.uuid}/items/wms_downloadable_fields`,
        { params: request, timeout: TIMEOUT, signal: thunkApi.signal }
      )
      .then((response) => response.data)
      .catch(errorHandling(thunkApi));
  }
);

// TODO: refactor types and names that also used in fetchGeoServerMapFields
const fetchGeoServerMapLayers = createAsyncThunk<
  Array<MapLayerResponse>,
  MapFeatureRequest,
  { rejectValue: ErrorResponse }
>(
  "geoserver/fetchGeoServerMapLayers",
  (request: MapFeatureRequest, thunkApi: any) => {
    return ogcAxiosWithRetry
      .get<MapLayerResponse>(
        `/ogc/collections/${request.uuid}/items/wms_layers`,
        { params: request, timeout: TIMEOUT, signal: thunkApi.signal }
      )
      .then((response) => response.data)
      .catch(errorHandling(thunkApi));
  }
);

/**
 * Appends a filter condition using AND operation.
 */
const appendFilter = (
  f: string | undefined,
  a: string | undefined
): string | undefined => (f === undefined ? a : f + " AND " + a);

const createSuggesterParamFrom = (
  paramState: ParameterState
): SuggesterParameters => {
  const suggesterParam: SuggesterParameters = {};
  suggesterParam.input = paramState.searchText ? paramState.searchText : "";
  if (paramState.parameterVocabs) {
    const filterGenerator = cqlDefaultFilters.get(
      "PARAMETER_VOCABS_IN"
    ) as ParameterVocabsIn;
    suggesterParam.filter = filterGenerator(paramState.parameterVocabs);
  }
  return suggesterParam;
};
// The longer the text user query, there higher the score it require, this makes sense
// because user make specific query and result should be specific too.
// const calculateScore = (
//   base: number | undefined,
//   text: string | undefined
// ): number => {
//   const pump = text ? (text.length / 2 > 50 ? 50 : text.length / 2) : 0;
//   return base ? Number(base) + Number(pump) : Number(pump);
// };

// Given a ParameterState object, we convert it to the correct Restful parameters
// always call this function and do not handcraft it elsewhere, some control isn't
// part the ParameterState and therefore express as optional argument here
const createSearchParamFrom = (
  i: ParameterState,
  control?: SearchControl
): SearchParameters => {
  const p: SearchParameters = {};
  p.sortby = i.sortby;
  p.text = i.searchText;

  const c = mergeWithDefaults<SearchControl>(
    {
      score: DEFAULT_SEARCH_SCORE,
    },
    control
  );

  // The score control how relevant the records
  // ! DO NO USE SCORE !, it will cause no result in some case because
  // some text search only hit the filter which cause score become null
  // if you set score you got nothing.
  // p.filter = `score>=${calculateScore(c.score, p.text)}`;

  // Control how many record return in 1 page.
  if (c.pagesize) {
    p.filter = appendFilter(p.filter, `page_size=${c.pagesize}`);
  }

  if (c.searchafter) {
    p.filter = appendFilter(
      p.filter,
      `search_after='${c.searchafter.join("||")}'`
    );
  }

  if (i.datasetGroup) {
    const f = cqlDefaultFilters.get("DATASET_GROUP") as DatasetGroup;
    p.filter = appendFilter(p.filter, f(i.datasetGroup));
  }

  if (i.hasCOData) {
    // If this field is not null, that means we have indexed cloud optimized data
    const f = cqlDefaultFilters.get("IS_NOT_NULL") as IsNotNull;
    p.filter = appendFilter(p.filter, f("assets_summary"));
  }

  if (i.updateFreq) {
    const f = cqlDefaultFilters.get("UPDATE_FREQUENCY") as UpdateFrequency;
    p.filter = appendFilter(p.filter, f(i.updateFreq));
  }

  if (
    i.dateTimeFilterRange &&
    (i.dateTimeFilterRange.start || i.dateTimeFilterRange.end)
  ) {
    if (i.dateTimeFilterRange.start && i.dateTimeFilterRange.end) {
      const f = cqlDefaultFilters.get("BETWEEN_TIME_RANGE") as TemporalDuring;
      p.filter = appendFilter(
        p.filter,
        f(i.dateTimeFilterRange.start, i.dateTimeFilterRange.end)
      );
    } else if (
      i.dateTimeFilterRange.start === undefined &&
      i.dateTimeFilterRange.end
    ) {
      const f = cqlDefaultFilters.get("BEFORE_TIME") as TemporalAfterOrBefore;
      p.filter = appendFilter(p.filter, f(i.dateTimeFilterRange.end));
    } else if (
      i.dateTimeFilterRange.end === undefined &&
      i.dateTimeFilterRange.start
    ) {
      const f = cqlDefaultFilters.get("AFTER_TIME") as TemporalAfterOrBefore;
      p.filter = appendFilter(p.filter, f(i.dateTimeFilterRange.start));
    }
  }

  if (i.bbox) {
    const f = cqlDefaultFilters.get(
      i.includeNoGeometry ? "BBOX_POLYGON_OR_EMPTY_EXTENTS" : "BBOX_POLYGON"
    ) as PolygonOperation;
    p.filter = appendFilter(p.filter, f(i.bbox));
  }

  if (i.polygon) {
    const f = cqlDefaultFilters.get("INTERSECT_POLYGON") as PolygonOperation;
    p.filter = appendFilter(p.filter, f(i.polygon));
  }

  if (i.parameterVocabs && i.parameterVocabs.length > 0) {
    const f = cqlDefaultFilters.get("PARAMETER_VOCABS_IN") as ParameterVocabsIn;
    const parameterVocabFilter = f(i.parameterVocabs);
    if (parameterVocabFilter) {
      p.filter = appendFilter(p.filter, parameterVocabFilter);
    }
  }

  if (i.platform && i.platform.length > 0) {
    const f = cqlDefaultFilters.get(
      "UPDATE_PLATFORM_FILTER_VARIABLES"
    ) as PlatformFilter;
    p.filter = appendFilter(p.filter, f(i.platform));
  }

  return p;
};

export {
  createSuggesterParamFrom,
  createSearchParamFrom,
  fetchSuggesterOptions,
  fetchResultWithStore,
  fetchResultNoStore,
  fetchResultAppendStore,
  fetchResultByUuidNoStore,
  fetchFeaturesByUuid,
  fetchParameterVocabsWithStore,
  fetchGeoServerMapFeature,
  fetchGeoServerMapFields,
  fetchGeoServerMapLayers,
  processDatasetDownload,
  processWFSDownload,
  jsonToOGCCollections,
  ogcAxiosWithRetry,
};

export default searcher.reducer;
