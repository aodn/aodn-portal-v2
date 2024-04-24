/**
 * This reducer is used to allow different component share value between pages, it is useful for filter
 * to preserve value between pages. The number below must be unique across the whole application
 */
import {
  Feature,
  Polygon,
  Properties,
  bboxPolygon as turfBboxPolygon,
} from "@turf/turf";
import axios from "axios";

const UPDATE_PARAMETER_STATES = "UPDATE_PARAMETER_STATES";
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
const updateParameterStates = (param: ParameterState): ActionType => {
  return {
    type: UPDATE_PARAMETER_STATES,
    payload: param,
  };
};

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
const createInitialParameterState = (): ParameterState => {
  return {
    isImosOnlyDataset: false,
    dateTimeFilterRange: {},
    searchText: "",
  };
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
    case UPDATE_PARAMETER_STATES:
      return {
        ...state,
        ...action.payload,
      };
    default:
      return state;
  }
};
// Flatten the ParameterState json to a properties like array, where key is
// the name.name.name... that describe multiple level json.
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
        if (isTypeCategory(param)) {
          // Special handle for category type, we only serializable
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
// Convert the url parameter back to ParameterState, check test case for more details
const unFlattenToParameterState = (input: string): ParameterState => {
  const result = createInitialParameterState();
  const flatObject = parseQueryString(input);

  for (const key in flatObject) {
    if (Object.prototype.hasOwnProperty.call(flatObject, key)) {
      const parts = key.split("."); // Split the key into parts based on '.'
      let current = result;

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
  // Special handle for polygon
  if (Object.prototype.hasOwnProperty.call(result, "polygon")) {
    // By default empty object will not be serialized, so when deserialize, we may miss some default empty value
    // in this case the polygon "properties" fields is missing, so we add it back by create an empty default object
    // then update all attributes with the same
    result.polygon = {
      ...turfBboxPolygon([0, 0, 0, 0]),
      ...result.polygon,
    };
  }
  return result;
};

export default paramReducer;

export {
  formatToUrlParam,
  unFlattenToParameterState,
  updateDateTimeFilterRange,
  updateSearchText,
  updateImosOnly,
  updateFilterPolygon,
  updateCategories,
  updateParameterStates,
};
