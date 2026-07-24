/**
 * State of the search parameters (keyword, date range, bbox, filters...)
 * shared across pages, plus helpers to encode/decode them to URL params.
 */
import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { bboxPolygon } from "@turf/turf";
import { Feature, Polygon, MultiPolygon, GeoJsonProperties } from "geojson";
import { MapDefaultConfig } from "@/components/map/mapbox/constants";
import { SearchResultLayoutEnum } from "@/components/common/buttons/ResultListLayoutButton";
import { SortResultEnum } from "@/components/common/buttons/ResultListSortButton";
import { decodeParam, encodeParam } from "@/utils/UrlUtils";
import type { RootState } from "./store";

// Possible values of the dataset filters. Defined here with the rest of the
// parameter state; searchReducer re-exports them for existing importers.
export enum DatasetFrequency {
  REALTIME = "real-time",
  DELAYED = "delayed",
  OTHER = "other",
  BOTH = "both",
}

export enum DatasetStatus {
  ONGOING = "onGoing",
  COMPLETED = "completed",
}

const { WEST_LON, EAST_LON, NORTH_LAT, SOUTH_LAT } =
  MapDefaultConfig.BBOX_ENDPOINTS;

// The default area now is Australia. When changing it, please make
// sure it matches the default centerLongitude, centerLatitude, and
// zoom level in the Map.tsx
const DEFAULT_SEARCH_LOCATION: Feature<Polygon> = {
  type: "Feature",
  bbox: [WEST_LON, SOUTH_LAT, EAST_LON, NORTH_LAT],
  geometry: {
    type: "Polygon",
    coordinates: [
      [
        [WEST_LON, SOUTH_LAT],
        [EAST_LON, SOUTH_LAT],
        [EAST_LON, NORTH_LAT],
        [WEST_LON, NORTH_LAT],
        [WEST_LON, SOUTH_LAT],
      ],
    ],
  },
  properties: {},
};

export interface DateTimeFilterRange {
  // Cannot use Date in Redux as it is non-serializable
  start?: number | undefined;
  end?: number | undefined;
}

export interface ParameterState {
  datasetGroup?: string;
  datasetStatus?: DatasetStatus | undefined;
  dateTimeFilterRange?: DateTimeFilterRange;
  // Usually the viewable area of the map
  bbox?: Feature<Polygon>;
  // Use to remember what user draw on the map
  polygon?: Feature<Polygon | MultiPolygon>;
  // User filter using static map areas
  staticAreas?: Array<SelectedStaticArea>;
  hasCOData?: boolean;
  excludeDocument?: boolean;
  includeNoGeometry?: boolean;
  searchText?: string;
  parameterVocabs?: Array<Vocab>;
  platform?: Array<string>;
  updateFreq?: DatasetFrequency | undefined;
  sortby?: string;
  zoom?: number;
  sort?: SortResultEnum;
  layout?: SearchResultLayoutEnum;
}
// Function use to test an input value is of type Vocab
const isVocabType = (value: any): value is Vocab =>
  value && (value as Vocab).label !== undefined;

export interface Vocab {
  // The label is never undefined
  label: string;
  definition?: string;
  about?: string;
  broader?: Array<Vocab>;
  narrower?: Array<Vocab>;
}

export interface SelectedStaticArea {
  boundaryName: string;
  value: string;
}

// Initial State
const createInitialParameterState = (
  withDefaultBBox: boolean = true
): ParameterState => {
  const state: ParameterState = {
    datasetGroup: undefined,
    hasCOData: false,
    excludeDocument: false,
    dateTimeFilterRange: {},
    searchText: "",
    zoom: MapDefaultConfig.ZOOM,
  };

  if (withDefaultBBox) {
    state.bbox = DEFAULT_SEARCH_LOCATION;
  }

  return state;
};

const searchParamsSlice = createSlice({
  name: "searchParams",
  initialState: createInitialParameterState(),
  reducers: {
    // Merge a partial ParameterState (e.g. restored from the URL)
    updateParameterStates: (state, action: PayloadAction<ParameterState>) => ({
      ...state,
      ...action.payload,
    }),
    updateDateTimeFilterRange: (
      state,
      action: PayloadAction<DateTimeFilterRange>
    ) => {
      state.dateTimeFilterRange = {
        start: action.payload.start,
        end: action.payload.end,
      };
    },
    // This action should only be used in InputWithSuggester.tsx component.
    updateSearchText: (state, action: PayloadAction<string>) => {
      state.searchText = action.payload;
    },
    updatePlatform: (state, action: PayloadAction<Array<string>>) => {
      state.platform = action.payload;
    },
    updateFilterStaticAreas: (
      state,
      action: PayloadAction<Array<SelectedStaticArea>>
    ) => {
      state.staticAreas = action.payload;
    },
    updateFilterPolygon: (
      state,
      action: PayloadAction<
        Feature<Polygon | MultiPolygon, GeoJsonProperties> | undefined
      >
    ) => {
      state.polygon = action.payload;
    },
    updateFilterBBox: (
      state,
      action: PayloadAction<Feature<Polygon, GeoJsonProperties> | undefined>
    ) => {
      state.bbox = action.payload;
    },
    updateDatasetGroup: (state, action: PayloadAction<string | undefined>) => {
      state.datasetGroup = action.payload;
    },
    updateHasData: (state, action: PayloadAction<boolean | undefined>) => {
      state.hasCOData = action.payload;
    },
    updateExcludeDocument: (
      state,
      action: PayloadAction<boolean | undefined>
    ) => {
      state.excludeDocument = action.payload;
    },
    updateParameterVocabs: {
      reducer: (state, action: PayloadAction<Array<Vocab>>) => {
        state.parameterVocabs = action.payload;
      },
      // We only need to store label, the other is not needed and will
      // create a massive url.
      prepare: (input: Array<Vocab>) => ({
        payload: input.map((v) => ({ label: v.label })),
      }),
    },
    updateUpdateFreq: (
      state,
      action: PayloadAction<DatasetFrequency | undefined>
    ) => {
      state.updateFreq = action.payload;
    },
    updateStatus: (state, action: PayloadAction<DatasetStatus | undefined>) => {
      state.datasetStatus = action.payload;
    },
    updateSortBy: {
      reducer: (state, action: PayloadAction<string>) => {
        state.sortby = action.payload;
      },
      // "+field" means ascending, "-field" descending
      prepare: (input: Array<{ field: string; order: "ASC" | "DESC" }>) => ({
        payload: input
          .map((item) =>
            item.order === "ASC" ? `+${item.field}` : `-${item.field}`
          )
          .join(","),
      }),
    },
    updateZoom: (state, action: PayloadAction<number | undefined>) => {
      state.zoom = action.payload;
    },
    updateSort: (state, action: PayloadAction<SortResultEnum>) => {
      state.sort = action.payload;
    },
    updateLayout: (state, action: PayloadAction<SearchResultLayoutEnum>) => {
      state.layout = action.payload;
    },
    // Reset to defaults but keep the user's layout / sort choices
    clearComponentParam: (state) => ({
      ...createInitialParameterState(),
      layout: state.layout,
      sort: state.sort,
      sortby: state.sortby,
    }),
  },
});

export const {
  updateParameterStates,
  updateDateTimeFilterRange,
  updateSearchText,
  updatePlatform,
  updateFilterStaticAreas,
  updateFilterPolygon,
  updateFilterBBox,
  updateDatasetGroup,
  updateHasData,
  updateExcludeDocument,
  updateParameterVocabs,
  updateUpdateFreq,
  updateStatus,
  updateSortBy,
  updateZoom,
  updateSort,
  updateLayout,
  clearComponentParam,
} = searchParamsSlice.actions;

// Flatten the ParameterState json to a properties like array, where key is
// the name.name.name... that describe multiple level json.
// Must use any due to multiple type complicated type casting
const flattenToProperties = (
  param: any,
  parentKey = "",
  result: Record<string, any> = {}
) => {
  for (const key in param) {
    if (Object.prototype.hasOwnProperty.call(param, key)) {
      const propName = parentKey ? `${parentKey}.${key}` : key;
      if (typeof param[key] === "object" && param[key] !== null) {
        flattenToProperties(param[key], propName, result);
      } else {
        if (isVocabType(param)) {
          // Special handle for vocab type, we only serializable
          // the label value, because other is of no use to search
          // and just waste space
          if (key === "label") {
            result[propName] = param[key];
          }
        } else {
          result[propName] = param[key];
        }
      }
    }
  }
  return result;
};

// Change the flatten json to xxx=yyy?xxxx=yyyy which can be use in url.
const formatToUrlParam = (param: ParameterState) => {
  const result = flattenToProperties(param);
  const parts = [];
  for (const key in result) {
    if (Object.prototype.hasOwnProperty.call(result, key)) {
      // Only add the parameter if it's not undefined, null, or an empty string
      if (
        result[key] !== undefined &&
        result[key] !== null &&
        result[key] !== ""
      ) {
        parts.push(
          `${encodeURIComponent(key)}=${encodeURIComponent(result[key])}`
        );
      }
    }
  }
  return encodeParam(parts.join("&"));
};

const parseQueryString = (queryString: string) => {
  const obj: Record<string, any> = {};
  const pairs = queryString.split("&"); // Split the query string into key-value pairs

  pairs.forEach((pair) => {
    const [key, value] = pair.split("="); // Split each pair into a key and a value
    // Ensure the key and value are present
    if (key && value) {
      // In x-www-form-urlencoded query strings "+" represents a space, but
      // decodeURIComponent does not convert it. So we need to
      // replace "+" with a space first
      obj[decodeURIComponent(key.replace(/\+/g, " "))] = decodeURIComponent(
        value.replace(/\+/g, " ")
      ); // Decode and store them in the object
    }
  });

  return obj;
};

// Convert the url parameter back to ParameterState, check test case for more details
const unFlattenToParameterState = (input: string): ParameterState => {
  const result = createInitialParameterState(false);
  const flatObject = parseQueryString(decodeParam(input));

  for (const key in flatObject) {
    if (Object.prototype.hasOwnProperty.call(flatObject, key)) {
      const parts = key.split("."); // Split the key into parts based on '.'
      let current: any = result; // Must use any, as it can be multiple type during unflattern

      for (let i = 0; i < parts.length; i++) {
        const part = parts[i];

        if (i === parts.length - 1) {
          // If it's the last part, set the value
          if (typeof current[part] === "boolean") {
            current[part] = flatObject[key] === "true";
          } else if (!isNaN(Number(flatObject[key]))) {
            current[part] = parseFloat(flatObject[key]);
          } else {
            current[part] = flatObject[key];
          }
        } else {
          // If not the last part, update or create the nested object
          if (!current[part]) {
            // Check if this key is array or not by forward looking the next key
            // if it is a number then create as array, else an object
            const isTypeArray = !isNaN(Number(parts[i + 1]));
            current[part] = isTypeArray ? [] : {};
          }
          current = current[part];
        }
      }
    }
  }

  // Special handle for bbox
  if (Object.prototype.hasOwnProperty.call(result, "bbox")) {
    // By default, empty object will not be serialized, so when de-serialize, we may miss some default empty value
    // in this case the polygon "properties" fields is missing, so we add it back by create an empty default object
    // then update all attributes with the same
    result.bbox = {
      ...bboxPolygon([0, 0, 0, 0]),
      ...result.bbox,
    };
  }
  return result;
};

export { DEFAULT_SEARCH_LOCATION, formatToUrlParam, unFlattenToParameterState };

// Selector for this reducer's slice of the state.
export const getSearchParams = (state: RootState) => state.searchParams;

export default searchParamsSlice.reducer;
