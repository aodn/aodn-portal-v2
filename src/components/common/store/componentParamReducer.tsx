/**
 * This reducer is used to allow different component share value between pages, it is useful for filter
 * to preserve value between pages. The number below must be unique across the whole application
 */
const UPDATE_DATETIME_FILTER_VARIABLE = 1000;
const UPDATE_SEARCH_TEXT_FILTER_VARIABLE = 1001;
const UPDATE_IMOS_ONLY_DATASET_FILTER_VARIABLE = 1002;

interface DataTimeFilterRange {
    start?: Date,
    end?: Date
}

export interface ParameterState {
    isImosOnlyDataset: boolean,
    // Use in RemovableDateTimeFilter
    dateTimeFilterRange?: DataTimeFilterRange
    // Use in search box
    searchText?: string
}

interface ActionType {
    type: number,
    payload: ParameterState
}

// Action Creator
const updateDateTimeFilterRange = (range: DataTimeFilterRange): ActionType => {
    return {
        type: UPDATE_DATETIME_FILTER_VARIABLE,
        payload: { dateTimeFilterRange: range } as ParameterState
    };
};

const updateSearchText = (q: string): ActionType => {
    return {
        type: UPDATE_SEARCH_TEXT_FILTER_VARIABLE,
        payload: { searchText: q } as ParameterState
    };
};

const updateImosOnly = (isImosOnly: boolean | undefined): ActionType => {
    return {
        type: UPDATE_IMOS_ONLY_DATASET_FILTER_VARIABLE,
        payload: { isImosOnlyDataset: isImosOnly === undefined ? false : isImosOnly } as ParameterState
    };
};

// Initial State
const initialState : ParameterState = {
    isImosOnlyDataset: true,
    dateTimeFilterRange : {},
    searchText: ''
};

// Reducer
const paramReducer = (state: ParameterState = initialState, action: ActionType) => {
    switch (action.type) {
        case UPDATE_DATETIME_FILTER_VARIABLE:
            return {
                ...state,
                dateTimeFilterRange: action.payload
            };
        case UPDATE_SEARCH_TEXT_FILTER_VARIABLE:
            return {
                ...state,
                searchText: action.payload.searchText
            };
        case UPDATE_IMOS_ONLY_DATASET_FILTER_VARIABLE:
            return {
                ...state,
                isImosOnlyDataset: action.payload.isImosOnlyDataset
            };
        default:
            return state;
    }
};

export default paramReducer;

export {
    updateDateTimeFilterRange,
    updateSearchText,
    updateImosOnly
}