import axios, { AxiosError } from "axios";
import { AnalyticsEvent } from "./analyticsEvents";
import { trackCustomEvent } from "./customEventTracker";

/**
 * Track failed backend HTTP requests for developer debugging.
 * Wired into the axios response interceptor in searchReducer.tsx.
 *
 * OUTPUT TO GA4:
 * {
 *   "endpoint": "/ogc/collections",
 *   "method": "GET",
 *   "status": 500,
 *   "status_text": "Internal Server Error",
 *   "message": "backend message (truncated to 100 chars)",
 *   "details": "error.response.data.details (truncated)"
 * }
 */

// GA4 caps custom param values at 100 chars
const MAX_VALUE_LENGTH = 100;
const UNKNOWN = "unknown";

type HttpErrorPayload = {
  endpoint: string;
  method: string;
  status: number;
  status_text: string;
  message: string;
  details?: string;
  retry_count: number;
};

type BackendErrorBody = {
  message?: string;
  details?: string;
};

// axios-retry stores state under this key on the request config
type AxiosRetryState = { retryCount?: number };
const getRetryCount = (error: AxiosError): number =>
  (error.config as { ["axios-retry"]?: AxiosRetryState } | undefined)?.[
    "axios-retry"
  ]?.retryCount ?? 0;

const truncate = (value: unknown): string => {
  if (value === undefined || value === null) return "";
  const str = typeof value === "string" ? value : JSON.stringify(value);
  return str.length > MAX_VALUE_LENGTH ? str.slice(0, MAX_VALUE_LENGTH) : str;
};

const isUserCanceled = (error: unknown): boolean =>
  axios.isCancel(error) ||
  (axios.isAxiosError(error) && error.code === "ERR_CANCELED");

const fromAxiosResponse = (
  error: AxiosError<BackendErrorBody>
): HttpErrorPayload => ({
  endpoint: error.config?.url ?? UNKNOWN,
  method: error.config?.method?.toUpperCase() ?? UNKNOWN,
  status: error.response!.status,
  status_text: truncate(error.response!.statusText),
  message: truncate(error.response!.data?.message),
  details: truncate(error.response!.data?.details),
  retry_count: getRetryCount(error),
});

const fromAxiosNetworkError = (error: AxiosError): HttpErrorPayload => ({
  endpoint: error.config?.url ?? UNKNOWN,
  method: error.config?.method?.toUpperCase() ?? UNKNOWN,
  status: 0,
  status_text: error.code ?? "NETWORK_ERROR",
  message: truncate(error.message),
  retry_count: getRetryCount(error),
});

const fromUnknownError = (error: unknown): HttpErrorPayload => ({
  endpoint: UNKNOWN,
  method: UNKNOWN,
  status: 0,
  status_text: "UNKNOWN_ERROR",
  message: truncate((error as Error)?.message),
  retry_count: 0,
});

const buildPayload = (error: unknown): HttpErrorPayload => {
  if (!axios.isAxiosError(error)) return fromUnknownError(error);
  if (error.response) return fromAxiosResponse(error);
  return fromAxiosNetworkError(error);
};

export function trackHttpRequestError(error: unknown): void {
  if (isUserCanceled(error)) return;

  const payload = buildPayload(error);
  trackCustomEvent(
    AnalyticsEvent.HTTP_REQUEST_ERRORS,
    payload as unknown as Gtag.CustomParams
  );
}
