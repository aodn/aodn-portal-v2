import {createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { MediaType } from 'media-typer';
import { searchUrl } from "../constants";
import axios from 'axios';

interface Link {
    href: string,
    rel: string,
    type: MediaType
}

interface Spatial {
    bbox: Array<Array<number>>,
    crs: string,
}

export interface StacCollection {
    id: string,
    title: string,
    description: string,
    itemType: string,
    links: Array<Link>,
    extent: Spatial
};

export interface StacCollections {
    collections: Array<StacCollection>,
    links: Array<Link>
}

export interface FailedResponse {
    error: string
}

export type SearchParameters = {
    text?: string,
    filters?: Array<any>
}

interface ObjectValue {
    collectionsQueryResult: StacCollections,
}

const initialState : ObjectValue = {
    collectionsQueryResult: {
        links: new Array<Link>(),
        collections: new Array<StacCollection>()
    }
}

// Trunk for async action and update searcher
const fetchResult = createAsyncThunk<StacCollections, SearchParameters, {rejectValue: FailedResponse}>(
    'search/fetchResult',
    async (param, thunkApi) => {
        try {
            const response = await axios.get<StacCollections>(
                searchUrl + '/collections', {
                    params: {
                        q: param.text
                    }
                }
            );
            return response.data;
        }
        catch(error: any){
            return thunkApi.rejectWithValue(error?.response.data);
        }
    });

const collectionsQueryResult = (state : ObjectValue) => state.collectionsQueryResult;

const searcher = createSlice({
    name: 'search',
    initialState: initialState,
    reducers: {
    },
    extraReducers(builder) {
        builder
            .addCase(fetchResult.fulfilled, (state, action) => {
                state.collectionsQueryResult = action.payload
            })
    }
});

export {
    fetchResult,
    collectionsQueryResult
}

export default searcher.reducer;