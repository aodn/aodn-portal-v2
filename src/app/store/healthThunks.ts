/**
 * Thunk for the backend health check used by the HealthChecker gate.
 */
import { createAsyncThunk } from "@reduxjs/toolkit";
import { ErrorResponse } from "@/utils/ErrorBoundary";
import * as healthApi from "@/app/api/health";
import { Health } from "@/app/api/healthTypes";

const rejectWith = (thunkApi: any) => (error: unknown) =>
  thunkApi.rejectWithValue(error);

export const fetchSystemHealthNoStore = createAsyncThunk<
  Health,
  void,
  { rejectValue: ErrorResponse }
>("system/fetchSystemHealthNoStore", (_, thunkApi) =>
  healthApi.getHealth(thunkApi.signal).catch(rejectWith(thunkApi))
);
