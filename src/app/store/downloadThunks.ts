/**
 * Thunks for dataset download and size estimates. HTTP work lives in
 * @/app/api/download; these wrappers only forward errors to redux.
 */
import { createAsyncThunk } from "@reduxjs/toolkit";
import { ErrorResponse } from "@/utils/ErrorBoundary";
import * as downloadApi from "@/app/api/download";
import {
  CoEstimateRequest,
  DatasetDownloadRequest,
  WFSDownloadRequest,
} from "@/pages/detail-page/context/DownloadDefinitions";

const rejectWith = (thunkApi: any) => (error: unknown) =>
  thunkApi.rejectWithValue(error);

export const processDatasetDownload = createAsyncThunk<
  any,
  DatasetDownloadRequest,
  { rejectValue: ErrorResponse }
>("download/downloadDataset", (request, thunkApi) =>
  downloadApi.postDatasetDownload(request).catch(rejectWith(thunkApi))
);

export const processWFSDownload = createAsyncThunk<
  any,
  WFSDownloadRequest,
  { rejectValue: ErrorResponse }
>("download/downloadWFS", (request, thunkApi) =>
  downloadApi
    .postWfsDownload(request, thunkApi.signal)
    .catch(rejectWith(thunkApi))
);

export const processWFSEstimateSize = createAsyncThunk<
  any,
  WFSDownloadRequest,
  { rejectValue: ErrorResponse }
>("download/estimateWFSSize", (request, thunkApi) =>
  downloadApi
    .postWfsEstimate(request, thunkApi.signal)
    .catch(rejectWith(thunkApi))
);

export const processCoEstimateSize = createAsyncThunk<
  any,
  CoEstimateRequest,
  { rejectValue: ErrorResponse }
>("download/estimateCoSize", (request, thunkApi) =>
  downloadApi
    .postCoEstimate(request, thunkApi.signal)
    .catch(rejectWith(thunkApi))
);
