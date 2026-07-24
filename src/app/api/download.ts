/**
 * Dataset download and size-estimate requests.
 *
 * Write (POST), all under /ogc/processes/:
 *   postDatasetDownload(req)   .../download/execution        (plain JSON)
 *   postWfsDownload(req)       .../downloadWfs/execution     (SSE stream)
 *   postWfsEstimate(req)       .../estimateWfsDownload/execution  (SSE)
 *   postCoEstimate(req)        .../estimateCOdownload/execution   (SSE)
 *
 * The SSE endpoints return the raw axios response — callers consume the
 * event stream from response.data. Every function throws a normalized
 * ErrorResponse on HTTP failure. Optional AbortSignal to cancel.
 */
import {
  ogcAxiosWithRetry,
  WFS_DOWNLOAD_TIMEOUT,
  SIZE_ESTIMATE_TIMEOUT,
  toErrorResponse,
} from "./httpClient";
import {
  CoEstimateRequest,
  DatasetDownloadRequest,
  WFSDownloadRequest,
} from "@/pages/detail-page/context/DownloadDefinitions";
import {
  getDateConditionFrom,
  getFormatFrom,
  getKeyFrom,
  getMultiPolygonFrom,
} from "@/utils/DownloadConditionUtils";

// Headers shared by the SSE (server-sent events) process endpoints.
const SSE_REQUEST_CONFIG = {
  adapter: "fetch" as const, // Use fetch adapter for streaming
  responseType: "stream" as const,
  headers: {
    "Content-Type": "application/json",
    Accept: "text/event-stream",
    "Cache-Control": "no-cache",
  },
};

export const postDatasetDownload = (request: DatasetDownloadRequest) =>
  ogcAxiosWithRetry
    .post("/ogc/processes/download/execution", request)
    .then((response) => response.data)
    .catch(toErrorResponse);

// Returns the raw response: callers consume the SSE stream themselves.
export const postWfsDownload = (
  request: WFSDownloadRequest,
  signal?: AbortSignal
) => {
  const dateRange = getDateConditionFrom(request.downloadConditions);
  const requestBody = {
    inputs: {
      uuid: request.uuid,
      start_date: dateRange.start,
      end_date: dateRange.end,
      multi_polygon: getMultiPolygonFrom(request.downloadConditions),
      layer_name: request.layerName,
      output_format: getFormatFrom(request.downloadConditions),
    },
    outputs: {},
    subscriber: {
      successUri: "",
      inProgressUri: "",
      failedUri: "",
    },
  };
  return ogcAxiosWithRetry
    .post("/ogc/processes/downloadWfs/execution", requestBody, {
      ...SSE_REQUEST_CONFIG,
      timeout: WFS_DOWNLOAD_TIMEOUT,
      signal,
    })
    .catch(toErrorResponse);
};

export const postWfsEstimate = (
  request: WFSDownloadRequest,
  signal?: AbortSignal
) => {
  const dateRange = getDateConditionFrom(request.downloadConditions);
  const requestBody = {
    inputs: {
      uuid: request.uuid,
      layer_name: request.layerName,
      start_date: dateRange.start,
      end_date: dateRange.end,
      output_format: getFormatFrom(request.downloadConditions),
      multi_polygon: getMultiPolygonFrom(request.downloadConditions),
    },
  };
  return ogcAxiosWithRetry
    .post("/ogc/processes/estimateWfsDownload/execution", requestBody, {
      ...SSE_REQUEST_CONFIG,
      timeout: SIZE_ESTIMATE_TIMEOUT,
      signal,
    })
    .catch(toErrorResponse);
};

// Estimate the size of a Cloud Optimised (zarr/parquet) download.
// Mirrors the WFS estimate SSE flow, but hits the CO estimate endpoint and
// identifies the dataset by `key` (from the KEY condition) instead of a layer.
export const postCoEstimate = (
  request: CoEstimateRequest,
  signal?: AbortSignal
) => {
  const dateRange = getDateConditionFrom(request.downloadConditions);
  const requestBody = {
    inputs: {
      uuid: request.uuid,
      key: getKeyFrom(request.downloadConditions),
      start_date: dateRange.start,
      end_date: dateRange.end,
      output_format: getFormatFrom(request.downloadConditions),
      multi_polygon: getMultiPolygonFrom(request.downloadConditions),
    },
  };
  return ogcAxiosWithRetry
    .post("/ogc/processes/estimateCOdownload/execution", requestBody, {
      ...SSE_REQUEST_CONFIG,
      timeout: SIZE_ESTIMATE_TIMEOUT,
      signal,
    })
    .catch(toErrorResponse);
};
