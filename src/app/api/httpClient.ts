import axios from "axios";
import axiosRetry, { isNetworkError, isRetryableError } from "axios-retry";
import { trackHttpRequestError } from "@/analytics/httpRequestErrEvent";
import { createErrorResponse } from "@/utils/ErrorBoundary";

export const TIMEOUT = 60000;
export const WFS_DOWNLOAD_TIMEOUT =
  Number(import.meta.env.VITE_WFS_DOWNLOADING_TIMEOUT) || 1200000; // Default 20 minutes timeout for WFS downloads
export const SIZE_ESTIMATE_TIMEOUT =
  Number(import.meta.env.VITE_WFS_ESTIMATE_TIMEOUT) || 300000; // Default 5 minutes timeout for WFS size estimation

// ---------------------------------------------------------------------
// 1. Create a **dedicated** axios instance for the OGC endpoint
//     (you can reuse the default `axios` if you want global retries)
const ogcAxiosWithRetry = axios.create({
  baseURL: "/api/v1",
  timeout: 15_000,
});

// 2. Attach retry logic
axiosRetry(ogcAxiosWithRetry, {
  retries: 10,
  retryDelay: (retryCount) => {
    // exponential back-off: start with 1000ms
    return 1000 * Math.pow(2, retryCount - 1);
  },

  // -----------------------------------------------------------------
  // 3. **Which errors should trigger a retry?**
  // -----------------------------------------------------------------
  retryCondition: (error) => {
    // 1. Network / DNS / timeout errors
    if (isNetworkError(error)) return true;

    // 2. 5xx server errors + a few 4xx that are usually transient
    if (error.response) {
      const code = error.response.status;
      return code >= 500 || [408, 429].includes(code);
    }

    // 3. Timeout (axios sets `code: 'ECONNABORTED'`)
    if (error.code === "ECONNABORTED") return true;

    // 4. Any other retryable error flagged by axios-retry
    return isRetryableError(error);
  },
});

// Centralized HTTP error tracking — fires once per final failure
// (after retries), so every request through this instance is covered.
ogcAxiosWithRetry.interceptors.response.use(
  (response) => response,
  (error) => {
    trackHttpRequestError(error);
    return Promise.reject(error);
  }
);

// The ONE place a failed HTTP response becomes an ErrorResponse.
// Non-HTTP errors (aborts, network failures) pass through untouched.
export const normalizeHttpError = (error: unknown): unknown => {
  if (axios.isAxiosError(error) && error.response) {
    return createErrorResponse(
      error.response.status,
      error.response.data?.details
        ? error.response.data.details
        : error.response.statusText,
      error.response.data?.message,
      error.response.data?.timestamp,
      error.response.data?.parameters
    );
  }
  return error;
};

// Throwing variant for promise .catch chains.
export const toErrorResponse = (error: unknown): never => {
  throw normalizeHttpError(error);
};

export { ogcAxiosWithRetry };
