/**
 * This reducer is used to allow different component share value between pages, it is useful for filter
 * to preserve value between pages.
 */
const UPDATE_DATETIME_FILTER_VARIABLE = 1;
const UPDATE_SEARCH_TEXT_FILTER_VARIABLE = 2;

interface DataTimeFilterRange {
    start?: Date,
    end?: Date
}

export interface ParameterState {
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

// Initial State
const initialState : ParameterState = {
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
                searchText: action.payload
            };
        default:
            return state;
    }
};

export default paramReducer;

export {
    updateDateTimeFilterRange,
    updateSearchText
}