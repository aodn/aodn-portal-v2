import { useCallback, useRef, useState } from "react";
import { useAppDispatch } from "../components/common/store/hooks";
import { processWFSEstimateSize } from "../components/common/store/searchReducer";
import { IDownloadCondition } from "../pages/detail-page/context/DownloadDefinitions";
import { consumeSSEStream } from "../utils/SSEUtils";

// Aligned with backend SSE event names for the estimate endpoint
enum EstimateEventName {
  CONNECTION_ESTABLISHED = "connection-established",
  KEEP_ALIVE = "keep-alive",
  WFS_REQUEST_READY = "wfs-request-ready",
  ESTIMATE_COMPLETE = "estimate-complete",
  ERROR = "error",
}

// Aligned with backend SSE event data for the estimate endpoint
interface EstimateSSEEventData {
  status?: string;
  message?: string;
  timestamp?: number;
  size?: number;
  error?: string;
}

enum EstimateStatus {
  IDLE = "idle",
  ESTIMATING = "estimating",
  COMPLETED = "completed",
  ERROR = "error",
}

const useWFSEstimateSize = () => {
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
    async (
      uuid: string,
      layerName: string,
      downloadConditions: IDownloadCondition[]
    ) => {
      // Cancel any in-progress estimation before starting a new one
      if (estimatePromiseRef.current) {
        estimatePromiseRef.current.abort();
        estimatePromiseRef.current = null;
      }

      if (!uuid || !layerName) return;

      setEstimatedSizeBytes(null);
      setStatus(EstimateStatus.ESTIMATING);

      try {
        const estimatePromise = dispatch(
          processWFSEstimateSize({ uuid, layerName, downloadConditions })
        );
        estimatePromiseRef.current = estimatePromise;

        const resultAction = await estimatePromise;

        if (processWFSEstimateSize.rejected.match(resultAction)) {
          setStatus(EstimateStatus.ERROR);
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
            case EstimateEventName.WFS_REQUEST_READY:
            case EstimateEventName.KEEP_ALIVE:
              setStatus(EstimateStatus.ESTIMATING);
              break;

            case EstimateEventName.ESTIMATE_COMPLETE:
              if (eventData.size !== undefined) {
                setEstimatedSizeBytes(eventData.size);
              }
              setStatus(EstimateStatus.COMPLETED);
              break;

            case EstimateEventName.ERROR:
              setStatus(EstimateStatus.ERROR);
              break;
          }
        });
      } catch {
        setStatus(EstimateStatus.ERROR);
      }
    },
    [dispatch]
  );

  return {
    estimatedSizeBytes,
    isEstimating: status === EstimateStatus.ESTIMATING,
    estimateSize,
    cancelEstimate,
  };
};

export default useWFSEstimateSize;
export { EstimateStatus };
