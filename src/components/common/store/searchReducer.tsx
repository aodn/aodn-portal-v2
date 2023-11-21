import {createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { MediaType } from 'media-typer';
import axios from 'axios';

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

export {
    fetchResultWithStore,
    fetchResultNoStore
}

export default searcher.reducer;