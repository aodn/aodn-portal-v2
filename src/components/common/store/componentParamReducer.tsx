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
  categories?: Array<string>;
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
    default:
      return state;
  }
};

export default paramReducer;

export {
  updateDateTimeFilterRange,
  updateSearchText,
  updateImosOnly,
  updateFilterPolygon,
};
