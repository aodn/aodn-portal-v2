import {createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { MediaType } from 'media-typer';
import axios from 'axios';
import {ParameterState} from "./componentParamReducer";
import {cqlDefaultFilters, TemporalBetween} from "../cqlFilters";

interface Link {
    href: string,
    rel: string,
    type: MediaType
}

interface Spatial {
    bbox: Array<Array<number>>,
    temporal: {
        interval: Array<Array<string | null>>
    }
    crs: string,
}

export interface OGCCollection {
    id: string,
    title?: string,
    description?: string,
    itemType?: string,
    links?: Array<Link>,
    extent?: Spatial,
};

export interface OGCCollections {
    collections: Array<OGCCollection>,
    links: Array<Link>
}

export interface FailedResponse {
    error: string
}

export type SearchParameters = {
    text?: string,
    filter?: string,
    property?: string
}

export interface CollectionsQueryType {
    result: OGCCollections,
    query: SearchParameters
}

interface ObjectValue {
    collectionsQueryResult: CollectionsQueryType,
}

const initialState : ObjectValue = {
    collectionsQueryResult: {
        result: {
            links: new Array<Link>(),
            collections: new Array<OGCCollection>()
        },
        query: {}
    }
}

const searchResult = async (param: SearchParameters, thunkApi: any) => {
    try {
        const response = await axios.get<OGCCollections>(
            '/api/v1/ogc/collections', {
                params: {
                    q: param.text !== undefined ? param.text : null,
                    filter: param.filter !== undefined ? param.filter : null,
                    property: param.property !== undefined ? param.property : 'id,title,description'
                }
            }
        );
        return response.data;
    }
    catch(error: any){
        return thunkApi.rejectWithValue(error?.response.data);
    }
};
/**
 * Trunk for async action and update searcher, limited return properties to reduce load time,
 * default it, title,description
 */
const fetchResultWithStore = createAsyncThunk<OGCCollections, SearchParameters, {rejectValue: FailedResponse}>(
    'search/fetchResultWithStore', searchResult);

/**
 * Trunk for async action and update searcher, limited return properties to reduce load time,
 * default it, title,description. This one do not attach extraReducer
 */
const fetchResultNoStore = createAsyncThunk<OGCCollections, SearchParameters, {rejectValue: FailedResponse}>(
    'search/fetchResultNoStore', searchResult);

const searcher = createSlice({
    name: 'search',
    initialState: initialState,
    reducers: {
    },
    extraReducers(builder) {
        builder
            .addCase(fetchResultWithStore.fulfilled, (state, action) => {
                state.collectionsQueryResult.result = action.payload;
                state.collectionsQueryResult.query = action.meta.arg;
            })
    }
});

const appendFilter = (f: string | undefined, a: string | undefined) =>
    f === undefined ? a : f + ' AND ' + a;

const createSearchParamFrom = (i: ParameterState) : SearchParameters => {

    const p : SearchParameters = {};
    p.text = (i.searchText + '').replace(' ',',');
    p.filter = undefined;

    if(i.isImosOnlyDataset) {
        p.filter = appendFilter(p.filter, cqlDefaultFilters.get('IMOS_ONLY') as string);
    }

    if(i.dateTimeFilterRange) {
        if(i.dateTimeFilterRange.start && i.dateTimeFilterRange.end) {
            const f = cqlDefaultFilters.get('BETWEEN_TIME_RANGE') as TemporalBetween;
            p.filter = appendFilter(p.filter, f(i.dateTimeFilterRange.start, i.dateTimeFilterRange.end));
        }
    }

    return p;
}

export {
    createSearchParamFrom,
    fetchResultWithStore,
    fetchResultNoStore
}

export default searcher.reducer;