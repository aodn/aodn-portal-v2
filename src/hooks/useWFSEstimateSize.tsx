import { useCallback, useRef, useState } from "react";
import { useAppDispatch } from "../components/common/store/hooks";
import { processWFSEstimateSize } from "../components/common/store/searchReducer";
import { IDownloadCondition } from "../pages/detail-page/context/DownloadDefinitions";

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

const BYTES_PER_MB = 1024 * 1024;

const useWFSEstimateSize = () => {
  const dispatch = useAppDispatch();
  const [estimatedSizeMB, setEstimatedSizeMB] = useState<number | null>(null);
  const [status, setStatus] = useState<EstimateStatus>(EstimateStatus.IDLE);
  const estimatePromiseRef = useRef<any>(null);

  const cancelEstimate = useCallback(() => {
    if (estimatePromiseRef.current) {
      estimatePromiseRef.current.abort();
      estimatePromiseRef.current = null;
    }
    setStatus(EstimateStatus.IDLE);
  }, []);

  const processSSEEvent = useCallback(async (eventText: string) => {
    try {
      const lines = eventText.split("\n");
      let eventType = "";
      let dataContent = "";

      for (const line of lines) {
        const trimmedLine = line.trim();
        if (trimmedLine.startsWith("event:")) {
          eventType = trimmedLine.slice(6).trim();
        } else if (trimmedLine.startsWith("data:")) {
          dataContent = trimmedLine.slice(5).trim();
        }
      }

      if (!eventType || !dataContent) return;

      const data: EstimateSSEEventData = JSON.parse(dataContent);

      switch (eventType) {
        case EstimateEventName.CONNECTION_ESTABLISHED:
        case EstimateEventName.WFS_REQUEST_READY:
        case EstimateEventName.KEEP_ALIVE:
          setStatus(EstimateStatus.ESTIMATING);
          break;

        case EstimateEventName.ESTIMATE_COMPLETE:
          if (data.size !== undefined) {
            setEstimatedSizeMB(
              parseFloat((data.size / BYTES_PER_MB).toFixed(2))
            );
          }
          setStatus(EstimateStatus.COMPLETED);
          break;

        case EstimateEventName.ERROR:
          setStatus(EstimateStatus.ERROR);
          break;
      }
    } catch (error) {
      console.error("Failed to process estimate SSE event:", error, eventText);
    }
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

      setEstimatedSizeMB(null);
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

        const reader = responseStream.getReader();
        const decoder = new TextDecoder();
        let buffer = "";
        let done = false;

        try {
          while (!done) {
            const result = await reader.read();
            done = result.done;
            if (done) break;

            buffer += decoder.decode(result.value, { stream: true });

            let eventStart = 0;
            while (eventStart < buffer.length) {
              const eventEnd = buffer.indexOf("\n\n", eventStart);
              if (eventEnd === -1) {
                buffer = buffer.slice(eventStart);
                break;
              }

              const eventText = buffer.slice(eventStart, eventEnd);
              if (eventText.trim()) {
                await processSSEEvent(eventText);
              }

              eventStart = eventEnd + 2;
            }
          }
        } finally {
          await reader.cancel("Cleaning up estimate stream");
        }
      } catch {
        setStatus(EstimateStatus.ERROR);
      }
    },
    [dispatch, processSSEEvent]
  );

  return {
    estimatedSizeMB,
    isEstimating: status === EstimateStatus.ESTIMATING,
    estimateSize,
    cancelEstimate,
  };
};

export default useWFSEstimateSize;
export { EstimateStatus };
