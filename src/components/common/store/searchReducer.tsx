import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";
import { Category, ParameterState } from "./componentParamReducer";

import {
  CategoriesIn,
  cqlDefaultFilters,
  PolygonOperation,
  TemporalAfterOrBefore,
  TemporalDuring,
} from "../cqlFilters";
import {
  ILink,
  OGCCollection,
  OGCCollections,
} from "./OGCCollectionDefinitions";

export interface FailedResponse {
  error: string;
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

const DEFAULT_SEARCH_SCORE = import.meta.env.VITE_ELASTIC_RELEVANCE_SCORE;

const jsonToOGCCollections = (json: any): OGCCollections => {
  return {
    collections: json.collections.map((collection: any) =>
      Object.assign(new OGCCollection(), collection)
    ),
    links: json.links,
  };
};

const initialState: ObjectValue = {
  collectionsQueryResult: {
    result: {
      links: new Array<ILink>(),
      collections: new Array<OGCCollection>(),
    },
    query: {},
  },
  categoriesResult: new Array<Category>(),
};
/**
  Define search functions
 */
const searchResult = async (param: SearchParameters, thunkApi: any) => {
  try {
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
      p.filter = param.filter + ` AND score>=${DEFAULT_SEARCH_SCORE}`;
    } else {
      p.filter = `score>=${DEFAULT_SEARCH_SCORE}`;
    }

    if (param.sortby !== undefined && param.sortby.length !== 0) {
      p.sortby = param.sortby;
    }

    const response = await axios.get<OGCCollections>(
      "/api/v1/ogc/collections",
      {
        params: p,
      }
    );

    // We need to fill in the index value here before return,
    // TODO: The index value may not start from 1 if it is paged
    return jsonToOGCCollections(response.data);
  } catch (error: unknown) {
    const errorMessage = "Unkown error occurred. Please try again later.";
    if (axios.isAxiosError(error)) {
      return thunkApi.rejectWithValue(error?.response?.data);
    } else {
      return thunkApi.rejectWithValue({
        error: errorMessage,
      } as FailedResponse);
    }
  }
};
// TODO: Why no param needed?
const searchParameterCategories = async (
  param: Map<string, string> | null,
  thunkApi: any
) => {
  try {
    const response = await axios.get<Array<Category>>(
      "/api/v1/ogc/ext/parameter/categories"
    );
    return response.data;
  } catch (error: unknown) {
    const errorMessage = "Unkown error occurred. Please try again later.";
    if (axios.isAxiosError(error)) {
      return thunkApi.rejectWithValue(error?.response?.data);
    } else {
      return thunkApi.rejectWithValue({
        error: errorMessage,
      } as FailedResponse);
    }
  }
};

const fetchSuggesterOptions = createAsyncThunk<
  any,
  SuggesterParameters,
  { rejectValue: FailedResponse }
>(
  "search/fetchSuggesterOptions",
  async (params: SuggesterParameters, thunkApi: any) => {
    try {
      const response = await axios.get<any>("/api/v1/ogc/ext/autocomplete", {
        params: params,
      });
      return response.data;
    } catch (error: unknown) {
      const errorMessage = "Unkown error occurred. Please try again later.";
      if (axios.isAxiosError(error)) {
        return thunkApi.rejectWithValue(error?.response?.data);
      } else {
        return thunkApi.rejectWithValue({
          error: errorMessage,
        } as FailedResponse);
      }
    }
  }
);

/**
 * Trunk for async action and update searcher, limited return properties to reduce load time,
 * default it, title,description
 */
const fetchResultWithStore = createAsyncThunk<
  OGCCollections,
  SearchParameters,
  { rejectValue: FailedResponse }
>("search/fetchResultWithStore", searchResult);

/**
 * Trunk for async action and update searcher, limited return properties to reduce load time,
 * default it, title,description. This one do not attach extraReducer
 */
const fetchResultNoStore = createAsyncThunk<
  OGCCollections,
  SearchParameters,
  { rejectValue: FailedResponse }
>("search/fetchResultNoStore", searchResult);

const fetchResultByUuidNoStore = createAsyncThunk<
  OGCCollection,
  string,
  { rejectValue: FailedResponse }
>("search/fetchResultNoStore", async (id: string, thunkApi) => {
  try {
    const response = await axios.get<OGCCollection>(
      `/api/v1/ogc/collections/${id}`
    );
    return Object.assign(new OGCCollection(), response.data);
  } catch (error: unknown) {
    const errorMessage = "Unkown error occurred. Please try again later.";
    if (axios.isAxiosError(error)) {
      return thunkApi.rejectWithValue(error?.response?.data);
    } else {
      return thunkApi.rejectWithValue({
        error: errorMessage,
      } as FailedResponse);
    }
  }
});

const fetchParameterCategoriesWithStore = createAsyncThunk<
  Array<Category>,
  Map<string, string> | null,
  { rejectValue: FailedResponse }
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
      .addCase(fetchParameterCategoriesWithStore.fulfilled, (state, action) => {
        state.categoriesResult = action.payload;
      });
  },
});

const appendFilter = (f: string | undefined, a: string | undefined) =>
  f === undefined ? a : f + " AND " + a;

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

const createSearchParamFrom = (i: ParameterState): SearchParameters => {
  const p: SearchParameters = {};
  p.text = i.searchText;
  p.filter = undefined;
  p.sortby = i.sortby;

  if (i.isImosOnlyDataset) {
    p.filter = appendFilter(
      p.filter,
      cqlDefaultFilters.get("IMOS_ONLY") as string
    );
  }

  if (i.dateTimeFilterRange) {
    if (i.dateTimeFilterRange.start && i.dateTimeFilterRange.end) {
      const f = cqlDefaultFilters.get("BETWEEN_TIME_RANGE") as TemporalDuring;
      p.filter = appendFilter(
        p.filter,
        f(i.dateTimeFilterRange.start, i.dateTimeFilterRange.end)
      );
    }
    if (
      i.dateTimeFilterRange.start === undefined &&
      i.dateTimeFilterRange.end
    ) {
      const f = cqlDefaultFilters.get("BEFORE_TIME") as TemporalAfterOrBefore;
      p.filter = appendFilter(p.filter, f(i.dateTimeFilterRange.end));
    }
    if (
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

  if (i.categories) {
    const f = cqlDefaultFilters.get("CATEGORIES_IN") as CategoriesIn;
    p.filter = appendFilter(p.filter, f(i.categories));
  }

  return p;
};

const createSearchParamForImosRealTime = () => {
  const p: SearchParameters = {};
  p.filter = cqlDefaultFilters.get("REAL_TIME_ONLY") as string;

  return p;
};

export {
  createSuggesterParamFrom,
  createSearchParamFrom,
  createSearchParamForImosRealTime,
  fetchSuggesterOptions,
  fetchResultWithStore,
  fetchResultNoStore,
  fetchResultByUuidNoStore,
  fetchParameterCategoriesWithStore,
};

export default searcher.reducer;
