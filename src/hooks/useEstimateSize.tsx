import { useCallback, useRef, useState } from "react";
import { AsyncThunk } from "@reduxjs/toolkit";
import { useAppDispatch } from "../components/common/store/hooks";
import { consumeSSEStream } from "../utils/SSEUtils";
import { ErrorResponse } from "../utils/ErrorBoundary";

// Aligned with backend SSE event names (ogc-api SseEventName enum)
enum EstimateEventName {
  CONNECTION_ESTABLISHED = "connection-established",
  KEEP_ALIVE = "keep-alive",
  ESTIMATE_COMPLETE = "estimate-complete",
  ESTIMATE_FAILED = "estimate-failed",
  ERROR = "error",
}

// Aligned with backend SSE event data for the estimate endpoint.
// The `estimate-complete` payload differs by service:
//  - WFS sends `{ size }`
//  - Cloud Optimised sends `{ estimated_output_bytes, estimated_uncompressed_bytes, ... }`
// so the size is pulled out via the `getEstimatedBytes` extractor below.
interface EstimateSSEEventData {
  message?: string;
  timestamp?: number;
  size?: number;
  estimated_output_bytes?: number;
  estimated_uncompressed_bytes?: number;
  error?: string;
}

// Default extractor matches the WFS `estimate-complete` payload
const defaultGetEstimatedBytes = (data: EstimateSSEEventData) => data.size;

enum EstimateStatus {
  IDLE = "idle",
  ESTIMATING = "estimating",
  COMPLETED = "completed",
  ERROR = "error",
}

/**
 * Generic download-size estimator. Dispatches the supplied estimate thunk,
 * consumes the resulting SSE stream, and exposes the estimated size + status.
 *
 * The WFS and Cloud Optimised estimates share the same SSE event names, so they
 * differ only by the thunk (the request body) and the `estimate-complete`
 * payload shape, handled by the `getEstimatedBytes` extractor.
 */
const useEstimateSize = <TArg,>(
  estimateThunk: AsyncThunk<any, TArg, { rejectValue: ErrorResponse }>,
  getEstimatedBytes: (
    data: EstimateSSEEventData
  ) => number | undefined = defaultGetEstimatedBytes
) => {
  const dispatch = useAppDispatch();
  const [estimatedSizeBytes, setEstimatedSizeBytes] = useState<number | null>(
    null
  );
  const [status, setStatus] = useState<EstimateStatus>(EstimateStatus.IDLE);
  const estimatePromiseRef = useRef<any>(null);

  const cancelEstimate = useCallback(() => {
    if (estimatePromiseRef.current) {
      estimatePromiseRef.current.abort();
      estimatePromiseRef.current = null;
    }
    setStatus(EstimateStatus.IDLE);
  }, []);

  const estimateSize = useCallback(
    async (arg: TArg) => {
      // Cancel any in-progress estimation before starting a new one
      if (estimatePromiseRef.current) {
        estimatePromiseRef.current.abort();
        estimatePromiseRef.current = null;
      }

      setEstimatedSizeBytes(null);
      setStatus(EstimateStatus.ESTIMATING);

      try {
        // Cast around the AsyncThunk action-creator's generic call signature,
        // which otherwise widens an unconstrained TArg to `TArg & undefined`
        const estimatePromise = dispatch(
          (estimateThunk as (a: TArg) => any)(arg)
        );
        estimatePromiseRef.current = estimatePromise;

        const resultAction = await estimatePromise;

        if (estimateThunk.rejected.match(resultAction)) {
          // An aborted request (cancel or superseding estimate) is not an error
          if (!resultAction.meta.aborted) {
            setStatus(EstimateStatus.ERROR);
          }
          return;
        }

        const responseStream = resultAction.payload?.data as ReadableStream;

        if (!responseStream) {
          setStatus(EstimateStatus.ERROR);
          return;
        }

        await consumeSSEStream(responseStream, async (eventType, data) => {
          const eventData = data as EstimateSSEEventData;
          switch (eventType) {
            case EstimateEventName.CONNECTION_ESTABLISHED:
            case EstimateEventName.KEEP_ALIVE:
              setStatus(EstimateStatus.ESTIMATING);
              break;

            case EstimateEventName.ESTIMATE_COMPLETE: {
              const sizeBytes = getEstimatedBytes(eventData);
              if (sizeBytes !== undefined) {
                setEstimatedSizeBytes(sizeBytes);
              }
              setStatus(EstimateStatus.COMPLETED);
              break;
            }

            case EstimateEventName.ESTIMATE_FAILED:
            case EstimateEventName.ERROR:
              setStatus(EstimateStatus.ERROR);
              break;
          }
        });
      } catch (error) {
        // Aborting the stream (cancel or superseding estimate) is not an error
        if (error instanceof DOMException && error.name === "AbortError") {
          return;
        }
        setStatus(EstimateStatus.ERROR);
      }
    },
    [dispatch, estimateThunk, getEstimatedBytes]
  );

  return {
    estimatedSizeBytes,
    isEstimating: status === EstimateStatus.ESTIMATING,
    estimateSize,
    cancelEstimate,
  };
};

export default useEstimateSize;
export { EstimateStatus };
