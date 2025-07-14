/**
 * This reducer is used to allow different component share value between pages, it is useful for filter
 * to preserve value between pages. The number below must be unique across the whole application
 */
import { bboxPolygon } from "@turf/turf";
import { Feature, Polygon, GeoJsonProperties } from "geojson";
import { DatasetFrequency } from "./searchReducer";
import { MapDefaultConfig } from "../../map/mapbox/constants";
import { SearchResultLayoutEnum } from "../buttons/ResultListLayoutButton";
import { SortResultEnum } from "../buttons/ResultListSortButton";
import {
  compressToEncodedURIComponent,
  decompressFromEncodedURIComponent,
} from "lz-string";

const UPDATE_PARAMETER_STATES = "UPDATE_PARAMETER_STATES";
const UPDATE_DATETIME_FILTER_VARIABLE = "UPDATE_DATETIME_FILTER_VARIABLE";
const UPDATE_SEARCH_TEXT_FILTER_VARIABLE = "UPDATE_SEARCH_TEXT_FILTER_VARIABLE";
const UPDATE_IMOS_ONLY_DATASET_FILTER_VARIABLE =
  "UPDATE_IMOS_ONLY_DATASET_FILTER_VARIABLE";
const UPDATE_POLYGON_FILTER_VARIABLE = "UPDATE_POLYGON_FILTER_VARIABLE";
const UPDATE_BBOX_FILTER_VARIABLE = "UPDATE_BBOX_FILTER_VARIABLE";
const UPDATE_PARAMETER_VOCAB_FILTER_VARIABLE =
  "UPDATE_PARAMETER_VOCAB_FILTER_VARIABLE";
const UPDATE_PLATFORM_FILTER_VARIABLE = "UPDATE_PLATFORM_FILTER_VARIABLE";
const UPDATE_UPDATE_FREQ_VARIABLE = "UPDATE_UPDATE_FREQ_VARIABLE";
const UPDATE_SORT_BY_VARIABLE = "UPDATE_SORT_BY_VARIABLE";
const UPDATE_ZOOM_VARIABLE = "UPDATE_ZOOM_VARIABLE";
// Contains cloud optimized data where download possible
const UPDATE_HAS_DATA = "UPDATE_HAS_DATA";
const UPDATE_SORT = "UPDATE_SORT";
const UPDATE_LAYOUT = "UPDATE_LAYOUT";
const CLEAR_COMPONENT_PARAM = "CLEAR_COMPONENT_PARAM";

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
  bbox?: Feature<Polygon>;
  polygon?: Feature<Polygon>;
  isImosOnlyDataset?: boolean;
  hasCOData?: boolean;
  dateTimeFilterRange?: DateTimeFilterRange;
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

interface ActionType {
  type: string;
  payload: ParameterState;
}

// Action Creator
const updateParameterStates = (param: ParameterState): ActionType => {
  return {
    type: UPDATE_PARAMETER_STATES,
    payload: param,
  };
};

const updateDateTimeFilterRange = (range: DateTimeFilterRange): ActionType => {
  return {
    type: UPDATE_DATETIME_FILTER_VARIABLE,
    payload: { dateTimeFilterRange: range } as ParameterState,
  };
};

// This const should only be used in InputWithSuggester.tsx component.
const updateSearchText = (q: string): ActionType => {
  return {
    type: UPDATE_SEARCH_TEXT_FILTER_VARIABLE,
    payload: { searchText: q } as ParameterState,
  };
};

const updatePlatform = (platform: Array<string>): ActionType => {
  return {
    type: UPDATE_PLATFORM_FILTER_VARIABLE,
    payload: { platform: platform } as ParameterState,
  };
};

const updateFilterPolygon = (
  polygon: Feature<Polygon, GeoJsonProperties> | undefined
): ActionType => {
  return {
    type: UPDATE_POLYGON_FILTER_VARIABLE,
    payload: { polygon: polygon } as ParameterState,
  };
};

const updateFilterBBox = (
  bbox: Feature<Polygon, GeoJsonProperties> | undefined
): ActionType => {
  return {
    type: UPDATE_BBOX_FILTER_VARIABLE,
    payload: { bbox: bbox } as ParameterState,
  };
};

const updateImosOnly = (isImosOnly: boolean | undefined): ActionType => {
  return {
    type: UPDATE_IMOS_ONLY_DATASET_FILTER_VARIABLE,
    payload: {
      isImosOnlyDataset: isImosOnly === undefined ? false : isImosOnly,
    } as ParameterState,
  };
};

const updateHasData = (hasCOData: boolean | undefined): ActionType => {
  return {
    type: UPDATE_HAS_DATA,
    payload: {
      hasCOData: hasCOData,
    } as ParameterState,
  };
};

const updateParameterVocabs = (input: Array<Vocab>): ActionType => {
  // We only need to store label, the other is not needed and will create a massive
  // url.
  const mappedInput = input.map((v) => {
    return {
      label: v.label,
    };
  });
  return {
    type: UPDATE_PARAMETER_VOCAB_FILTER_VARIABLE,
    payload: {
      parameterVocabs: mappedInput,
    } as ParameterState,
  };
};

const updateUpdateFreq = (input: DatasetFrequency | undefined): ActionType => {
  return {
    type: UPDATE_UPDATE_FREQ_VARIABLE,
    payload: {
      updateFreq: input,
    } as ParameterState,
  };
};

const updateSortBy = (
  input: Array<{ field: string; order: "ASC" | "DESC" }>
): ActionType => {
  return {
    type: UPDATE_SORT_BY_VARIABLE,
    payload: {
      sortby: input
        .map((item) =>
          item.order === "ASC" ? `+${item.field}` : `-${item.field}`
        )
        .join(","),
    },
  };
};

const updateZoom = (input: number | undefined): ActionType => {
  return {
    type: UPDATE_ZOOM_VARIABLE,
    payload: {
      zoom: input,
    } as ParameterState,
  };
};

const updateSort = (input: SortResultEnum): ActionType => {
  return {
    type: UPDATE_SORT,
    payload: {
      sort: input,
    } as ParameterState,
  };
};

const updateLayout = (input: SearchResultLayoutEnum): ActionType => {
  return {
    type: UPDATE_LAYOUT,
    payload: {
      layout: input,
    } as ParameterState,
  };
};

// Reset the component parameter to default value
const clearComponentParam = (): ActionType => {
  return {
    type: CLEAR_COMPONENT_PARAM,
    payload: createInitialParameterState(),
  };
};

// Initial State
const createInitialParameterState = (
  withDefaultBBox: boolean = true
): ParameterState => {
  const state: ParameterState = {
    isImosOnlyDataset: false,
    hasCOData: false,
    dateTimeFilterRange: {},
    searchText: "",
    zoom: MapDefaultConfig.ZOOM,
  };

  if (withDefaultBBox) {
    state.bbox = DEFAULT_SEARCH_LOCATION;
  }

  return state;
};

// Reducer
const paramReducer = (
  state: ParameterState = createInitialParameterState(),
  action: ActionType
) => {
  switch (action.type) {
    case UPDATE_DATETIME_FILTER_VARIABLE:
      return {
        ...state,
        dateTimeFilterRange: {
          start: action.payload.dateTimeFilterRange?.start,
          end: action.payload.dateTimeFilterRange?.end,
        },
      };
    case UPDATE_SEARCH_TEXT_FILTER_VARIABLE:
      return {
        ...state,
        searchText: action.payload.searchText,
      };
    case UPDATE_IMOS_ONLY_DATASET_FILTER_VARIABLE:
      return {
        ...state,
        isImosOnlyDataset: action.payload.isImosOnlyDataset,
      };
    case UPDATE_HAS_DATA:
      return {
        ...state,
        hasCOData: action.payload.hasCOData,
      };
    case UPDATE_PLATFORM_FILTER_VARIABLE:
      return {
        ...state,
        platform: action.payload.platform,
      };
    case UPDATE_POLYGON_FILTER_VARIABLE:
      return {
        ...state,
        polygon: action.payload.polygon,
      };
    case UPDATE_BBOX_FILTER_VARIABLE:
      return {
        ...state,
        bbox: action.payload.bbox,
      };
    case UPDATE_PARAMETER_VOCAB_FILTER_VARIABLE:
      return {
        ...state,
        parameterVocabs: action.payload.parameterVocabs,
      };
    case UPDATE_UPDATE_FREQ_VARIABLE:
      return {
        ...state,
        updateFreq: action.payload.updateFreq,
      };
    case UPDATE_SORT_BY_VARIABLE:
      return {
        ...state,
        sortby: action.payload.sortby,
      };
    case UPDATE_ZOOM_VARIABLE:
      return {
        ...state,
        zoom: action.payload.zoom,
      };
    case UPDATE_SORT:
      return {
        ...state,
        sort: action.payload.sort,
      };
    case UPDATE_LAYOUT:
      return {
        ...state,
        layout: action.payload.layout,
      };
    case UPDATE_PARAMETER_STATES:
      return {
        ...state,
        ...action.payload,
      };
    case CLEAR_COMPONENT_PARAM:
      return {
        ...action.payload,
        // For layout and sort, we want to keep them unchanged
        layout: state.layout,
        sort: state.sort,
        sortby: state.sortby,
      };
    default:
      return state;
  }
};

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
  return compressToEncodedURIComponent(parts.join("&"));
};

const parseQueryString = (queryString: string) => {
  const obj: Record<string, any> = {};
  const pairs = queryString.split("&"); // Split the query string into key-value pairs

  pairs.forEach((pair) => {
    const [key, value] = pair.split("="); // Split each pair into a key and a value
    // Ensure the key and value are present
    if (key && value) {
      obj[decodeURIComponent(key)] = decodeURIComponent(value); // Decode and store them in the object
    }
  });

  return obj;
};

// Convert the url parameter back to ParameterState, check test case for more details
const unFlattenToParameterState = (input: string): ParameterState => {
  const result = createInitialParameterState(false);
  const flatObject = parseQueryString(decompressFromEncodedURIComponent(input));

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

export default paramReducer;

export {
  DEFAULT_SEARCH_LOCATION,
  UPDATE_DATETIME_FILTER_VARIABLE,
  formatToUrlParam,
  unFlattenToParameterState,
  updateDateTimeFilterRange,
  updateSearchText,
  updateImosOnly,
  updateFilterBBox,
  updateFilterPolygon,
  updateParameterVocabs,
  updatePlatform,
  updateParameterStates,
  updateSortBy,
  updateUpdateFreq,
  updateZoom,
  updateHasData,
  updateSort,
  updateLayout,
  clearComponentParam,
};
