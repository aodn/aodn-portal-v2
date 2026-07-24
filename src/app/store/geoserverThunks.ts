/**
 * Thunks for the geoserver-backed map queries (WMS/WFS layers, fields,
 * features). HTTP work lives in @/app/api/geoserver; these wrappers only
 * forward errors to redux.
 */
import { createAsyncThunk } from "@reduxjs/toolkit";
import { ErrorResponse } from "@/utils/ErrorBoundary";
import * as geoserverApi from "@/app/api/geoserver";
import {
  MapFeatureRequest,
  MapFeatureResponse,
  GeoserverFieldsResponse,
  MapLayerResponse,
  DownloadLayersResponse,
} from "@/app/api/geoserverTypes";

const rejectWith = (thunkApi: any) => (error: unknown) =>
  thunkApi.rejectWithValue(error);

export const fetchGeoServerMapFeature = createAsyncThunk<
  MapFeatureResponse,
  MapFeatureRequest,
  { rejectValue: ErrorResponse }
>("geoserver/fetchGeoServerMapFeature", (request, thunkApi) =>
  geoserverApi
    .getWmsMapFeature(request, thunkApi.signal)
    .catch(rejectWith(thunkApi))
);

export const fetchGeoServerMapFields = createAsyncThunk<
  Array<GeoserverFieldsResponse>,
  MapFeatureRequest,
  { rejectValue: ErrorResponse }
>("geoserver/fetchGeoServerMapFields", (request, thunkApi) =>
  geoserverApi
    .getWmsFields(request, thunkApi.signal)
    .catch(rejectWith(thunkApi))
);

export const fetchGeoServerFieldValues = createAsyncThunk<
  Record<string, Array<object>>,
  MapFeatureRequest,
  { rejectValue: ErrorResponse }
>("geoserver/fetchGeoServerFieldValues", (request, thunkApi) =>
  geoserverApi
    .getWfsFieldValues(request, thunkApi.signal)
    .catch(rejectWith(thunkApi))
);

export const fetchGeoServerMapLayers = createAsyncThunk<
  Array<MapLayerResponse>,
  MapFeatureRequest,
  { rejectValue: ErrorResponse }
>("geoserver/fetchGeoServerMapLayers", (request, thunkApi) =>
  geoserverApi
    .getWmsLayers(request, thunkApi.signal)
    .catch(rejectWith(thunkApi))
);

export const fetchGeoServerDownloadLayers = createAsyncThunk<
  Array<DownloadLayersResponse>,
  MapFeatureRequest,
  { rejectValue: ErrorResponse }
>("geoserver/fetchGeoServerDownloadLayers", (request, thunkApi) =>
  geoserverApi
    .getWfsLayers(request, thunkApi.signal)
    .catch(rejectWith(thunkApi))
);
