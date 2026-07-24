/**
 * Thunks for the WFS / Cloud-Optimized download and size estimates.
 * These endpoints stream server-sent events, so they stay as thunks —
 * RTK Query caching makes no sense for a one-off byte stream.
 * (Plain request/response downloads live in ogcApi.ts.)
 */
import { createAsyncThunk } from "@reduxjs/toolkit";
import { ErrorResponse } from "@/utils/ErrorBoundary";
import * as downloadApi from "@/app/api/download";
import {
  CoEstimateRequest,
  WFSDownloadRequest,
} from "@/pages/detail-page/context/DownloadDefinitions";

const rejectWith = (thunkApi: any) => (error: unknown) =>
  thunkApi.rejectWithValue(error);

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
