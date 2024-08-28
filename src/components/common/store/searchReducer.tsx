import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios, { AxiosError } from "axios";
import { Category, ParameterState } from "./componentParamReducer";

import {
  CategoriesIn,
  CategoriesWithCommonKey,
  CommonKey,
  cqlDefaultFilters,
  PolygonOperation,
  TemporalAfterOrBefore,
  TemporalDuring,
  UpdateFrequency,
} from "../cqlFilters";
import { OGCCollection, OGCCollections } from "./OGCCollectionDefinitions";
import {
  createErrorResponse,
  ErrorResponse,
} from "../../../utils/ErrorBoundary";
import { mergeWithDefaults } from "../utils";

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
  categoriesResult: Array<Category>;
}
export const DEFAULT_SEARCH_PAGE = 11;

const DEFAULT_SEARCH_SCORE = import.meta.env.VITE_ELASTIC_RELEVANCE_SCORE;

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
  categoriesResult: new Array<Category>(),
};
/**
 Define search functions
 */
const searchResult = async (param: SearchParameters, thunkApi: any) => {
  const p: OGCSearchParameters = {
    properties:
      param.properties !== undefined
        ? param.properties
        : "id,title,description,status,links",
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

  return axios
    .get<OGCCollections>("/api/v1/ogc/collections", {
      params: p,
    })
    .then((response) => jsonToOGCCollections(response.data))
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
const searchParameterCategories = async (
  param: Map<string, string> | null,
  thunkApi: any
) =>
  axios
    .get<Array<Category>>("/api/v1/ogc/ext/parameter/vocabs")
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
    axios
      .get<any>("/api/v1/ogc/ext/autocomplete", {
        params: params,
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
 * default it, title,description. This one do not attach extraReducer
 */
const fetchResultNoStore = createAsyncThunk<
  OGCCollections,
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
>("search/fetchResultNoStore", async (id: string, thunkApi: any) =>
  axios
    .get<OGCCollection>(`/api/v1/ogc/collections/${id}`)
    .then((response) => Object.assign(new OGCCollection(), response.data))
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

const fetchParameterCategoriesWithStore = createAsyncThunk<
  Array<Category>,
  Map<string, string> | null,
  { rejectValue: ErrorResponse }
>("search/fetchParameterCategoriesWithStore", searchParameterCategories);

const searcher = createSlice({
  name: "search",
  initialState: initialState,
  reducers: {},
  extraReducers(builder) {
    builder
      .addCase(fetchResultWithStore.fulfilled, (state, action) => {
        state.collectionsQueryResult.result = action.payload;
        state.collectionsQueryResult.query = action.meta.arg;
      })
      .addCase(fetchResultAppendStore.fulfilled, (state, action) => {
        const new_collections = action.payload;
        // Create a new instance so in case people need to use useState it signal an update
        state.collectionsQueryResult.result =
          state.collectionsQueryResult.result.clone();
        state.collectionsQueryResult.result.merge(new_collections);
        state.collectionsQueryResult.query = action.meta.arg;
      })
      .addCase(fetchParameterCategoriesWithStore.fulfilled, (state, action) => {
        state.categoriesResult = action.payload;
      });
  },
});

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
  if (paramState.categories) {
    const filterGenerator = cqlDefaultFilters.get(
      "CATEGORIES_IN"
    ) as CategoriesIn;
    suggesterParam.filter = filterGenerator(paramState.categories);
  }
  return suggesterParam;
};
// Given a ParameterState object, we convert it to the correct Restful parameters
// always call this function and do not hand craft it elsewhere, some control isn't
// part the ParameterState and therefore express as optional argument here
const createSearchParamFrom = (
  i: ParameterState,
  control?: SearchControl
): SearchParameters => {
  const p: SearchParameters = {};
  p.text = i.searchText;
  p.sortby = i.sortby;

  const c = mergeWithDefaults(
    {
      score: DEFAULT_SEARCH_SCORE,
    } as SearchControl,
    control
  );

  // The score control how relevent the records
  p.filter = `score>=${c.score}`;

  // Control how many record return in 1 page.
  if (c.pagesize) {
    p.filter = appendFilter(p.filter, `page_size=${c.pagesize}`);
  }

  if (c.searchafter) {
    p.filter = appendFilter(
      p.filter,
      `search_after='${c.searchafter.join(",")}'`
    );
  }

  if (i.isImosOnlyDataset) {
    p.filter = appendFilter(
      p.filter,
      cqlDefaultFilters.get("IMOS_ONLY") as string
    );
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

  if (i.polygon) {
    const f = cqlDefaultFilters.get("INTERSECT_POLYGON") as PolygonOperation;
    p.filter = appendFilter(p.filter, f(i.polygon));
  }

  if (i.categories && i.categories.length > 0 && !i.commonKey) {
    const f = cqlDefaultFilters.get("CATEGORIES_IN") as CategoriesIn;
    const categoryFilter = f(i.categories);
    if (categoryFilter) {
      p.filter = appendFilter(p.filter, categoryFilter);
    }
  }

  if (i.commonKey) {
    if (i.categories && i.categories.length > 0) {
      const f = cqlDefaultFilters.get(
        "CATEGORIES_WITH_COMMON_KEY"
      ) as CategoriesWithCommonKey;
      p.filter = appendFilter(p.filter, f(i.categories, i.commonKey));
    } else {
      const f = cqlDefaultFilters.get("COMMON_KEY") as CommonKey;
      p.filter = appendFilter(p.filter, f(i.commonKey));
    }
    // clear search text because the value is handled by the filter section instead
    p.text = "";
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
  fetchParameterCategoriesWithStore,
};

export default searcher.reducer;
function createErrorRespons(): any {
  throw new Error("Function not implemented.");
}
