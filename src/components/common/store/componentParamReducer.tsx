/**
 * This reducer is used to allow different component share value between pages, it is useful for filter
 * to preserve value between pages. The number below must be unique across the whole application
 */
import { Feature, Polygon, Properties } from "@turf/turf";
import axios from "axios";

const UPDATE_DATETIME_FILTER_VARIABLE = "UPDATE_DATETIME_FILTER_VARIABLE";
const UPDATE_SEARCH_TEXT_FILTER_VARIABLE = "UPDATE_SEARCH_TEXT_FILTER_VARIABLE";
const UPDATE_IMOS_ONLY_DATASET_FILTER_VARIABLE =
  "UPDATE_IMOS_ONLY_DATASET_FILTER_VARIABLE";
const UPDATE_POLYGON_FILTER_VARIABLE = "UPDATE_POLYGON_FILTER_VARIABLE";
const UPDATE_CATEGORY_FILTER_VARIABLE = "UPDATE_CATEGORY_FILTER_VARIABLE";

interface DataTimeFilterRange {
  // Cannot use Date in Redux as it is non-serializable
  start?: number | undefined;
  end?: number | undefined;
}

export interface ParameterState {
  polygon?: Feature<Polygon, Properties>;
  isImosOnlyDataset: boolean;
  // Use in RemovableDateTimeFilter
  dateTimeFilterRange?: DataTimeFilterRange;
  // Use in search box
  searchText?: string;
  categories?: Array<Category>;
}
// Function use to test an input value is of type Category
const isTypeCategory = (value: any): value is Category =>
  value && (value as Category).label !== undefined;

export interface Category {
  // The label is never undefined
  label: string;
  definition?: string;
  about: string;
  broader: Array<Category>;
  narrower: Array<Category>;
}

interface ActionType {
  type: string;
  payload: ParameterState;
}

// Action Creator
const updateDateTimeFilterRange = (range: DataTimeFilterRange): ActionType => {
  return {
    type: UPDATE_DATETIME_FILTER_VARIABLE,
    payload: { dateTimeFilterRange: range } as ParameterState,
  };
};

const updateSearchText = (q: string): ActionType => {
  return {
    type: UPDATE_SEARCH_TEXT_FILTER_VARIABLE,
    payload: { searchText: q } as ParameterState,
  };
};

const updateFilterPolygon = (
  polygon: Feature<Polygon, Properties> | undefined
): ActionType => {
  return {
    type: UPDATE_POLYGON_FILTER_VARIABLE,
    payload: { polygon: polygon } as ParameterState,
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

const updateCategories = (input: Array<Category>): ActionType => {
  return {
    type: UPDATE_CATEGORY_FILTER_VARIABLE,
    payload: {
      categories: input,
    } as ParameterState,
  };
};

// Initial State
const initialState: ParameterState = {
  isImosOnlyDataset: false,
  dateTimeFilterRange: {},
  searchText: "",
};

// Reducer
const paramReducer = (
  state: ParameterState = initialState,
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
    case UPDATE_POLYGON_FILTER_VARIABLE:
      return {
        ...state,
        polygon: action.payload.polygon,
      };
    case UPDATE_CATEGORY_FILTER_VARIABLE:
      return {
        ...state,
        categories: action.payload.categories,
      };
    default:
      return state;
  }
};

const flattenToProperties = (
  param: ParameterState,
  parentKey = "",
  result = {}
) => {
  for (const key in param) {
    if (Object.prototype.hasOwnProperty.call(param, key)) {
      const propName = parentKey ? `${parentKey}.${key}` : key;
      if (typeof param[key] === "object" && param[key] !== null) {
        flattenToProperties(param[key], propName, result);
      } else {
        // Special handle for category type
        if (isTypeCategory(param)) {
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

const formatToUrlParam = (param: ParameterState) => {
  const result = flattenToProperties(param);
  const parts = [];
  for (const key in result) {
    if (Object.prototype.hasOwnProperty.call(result, key)) {
      parts.push(
        `${encodeURIComponent(key)}=${encodeURIComponent(result[key])}`
      );
    }
  }
  return parts.join("&");
};

const parseQueryString = (queryString: string) => {
  const obj = {};
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

const unFlattenToParameterState = (input: string) => {
  const result = {};
  const flatObject = parseQueryString(input);

  for (const key in flatObject) {
    if (Object.prototype.hasOwnProperty.call(flatObject, key)) {
      const parts = key.split("."); // Split the key into parts based on '.'
      let current = result;

      for (let i = 0; i < parts.length; i++) {
        const part = parts[i];
        if (i === parts.length - 1) {
          // If it's the last part, set the value
          current[part] = flatObject[key];
        } else {
          // If not the last part, update or create the nested object
          if (!current[part]) {
            current[part] = {};
          }
          current = current[part];
        }
      }
    }
  }

  return result;
};

export default paramReducer;

export {
  formatToUrlParam,
  updateDateTimeFilterRange,
  updateSearchText,
  updateImosOnly,
  updateFilterPolygon,
  updateCategories,
};
