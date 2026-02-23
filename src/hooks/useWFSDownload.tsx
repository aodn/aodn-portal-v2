import { useCallback, useState, useRef } from "react";
import { useAppDispatch } from "../components/common/store/hooks";
import { processWFSDownload } from "../components/common/store/searchReducer";
import { IDownloadCondition } from "../pages/detail-page/context/DownloadDefinitions";

// Aligned with backend WFS SSE event names
enum EventName {
  CONNECTION_ESTABLISHED = "connection-established",
  KEEP_ALIVE = "keep-alive",
  WFS_REQUEST_READY = "wfs-request-ready",
  DOWNLOAD_STARTED = "download-started",
  FILE_CHUNK = "file-chunk",
  DOWNLOAD_COMPLETE = "download-complete",
  ERROR = "error",
}

// Aligned with backend WFS SSE event status
enum EventStatus {
  STREAMING = "streaming",
  WAITING_FOR_WFS_SERVER = "waiting-for-wfs-server",
}

// Aligned with backend WFS SSE event data
interface SSEEventData {
  data?: string;
  status?: EventStatus;
  message?: string;
  timestamp?: number;
  chunkSize?: number;
  chunkNumber?: number;
  totalChunks?: number;
  totalBytes?: number;
  final?: boolean;
  filename?: string;
  error?: string;
  mediaType?: string;
}

// Download status from frontend use
enum DownloadProgressMessage {
  INITIALIZING = "Initializing download...",
  CONNECTING = "Connecting to WFS server...",
  WAITING_SERVER = "Waiting for WFS server response...",
  STARTING = "Starting download...",
  IN_PROGRESS = "Downloading in progress...",
  COMPLETED = "Download completed",
  ERROR = "Download error",
  FAILED = "Download failed",
  CANCELED = "Download cancelled",
}

// Download status for frontend use
enum DownloadStatus {
  NOT_STARTED = "not-started",
  WAITING_SERVER = "waiting-server",
  IN_PROGRESS = "in-progress",
  COMPLETED = "completed",
  ERROR = "error",
}

const useWFSDownload = (onCallback?: () => void) => {
  const dispatch = useAppDispatch();
  const [downloadingStatus, setDownloadingStatus] = useState<DownloadStatus>(
    DownloadStatus.NOT_STARTED
  );
  const [progressMessage, setProgressMessage] = useState<string>("");
  const [downloadedBytes, setDownloadedBytes] = useState<number>(0);
  const downloadPromiseRef = useRef<any>(null);
  const fileChunksRef = useRef<string[]>([]);
  const receivedChunksRef = useRef<Set<number>>(new Set());
  const expectedTotalChunksRef = useRef<number>(0);

  // Helper functions
  const formatBytes = (bytes: number) => {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
  };

  const generateFileName = (layerName: string) => {
    const timestamp = new Date().toISOString().slice(0, 19).replace(/:/g, "-");
    const sanitizedLayerName = layerName.replace(/[^a-z0-9]/gi, "_");
    return `${sanitizedLayerName}_${timestamp}.csv`;
  };

  const downloadFile = (blob: Blob, filename: string) => {
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    window.URL.revokeObjectURL(url);
  };

  // Clean up function
  const cleanupDownload = useCallback(() => {
    fileChunksRef.current = [];
    receivedChunksRef.current.clear();
    expectedTotalChunksRef.current = 0;
  }, []);

  // Cancel download function
  const cancelDownload = useCallback(() => {
    if (downloadPromiseRef.current) {
      downloadPromiseRef.current.abort();
      downloadPromiseRef.current = null;
    }
    cleanupDownload();
    setDownloadedBytes(0);
    setDownloadingStatus(DownloadStatus.NOT_STARTED);
    setProgressMessage(DownloadProgressMessage.CANCELED);
    onCallback && onCallback();
  }, [cleanupDownload, onCallback]);

  // Process SSE data according to event type
  const processSSEData = useCallback(
    async (eventType: string, data: SSEEventData, layerName: string) => {
      switch (eventType) {
        case EventName.CONNECTION_ESTABLISHED:
          setDownloadingStatus(DownloadStatus.WAITING_SERVER);
          setProgressMessage(DownloadProgressMessage.CONNECTING);
          onCallback?.();
          break;

        case EventName.WFS_REQUEST_READY:
          setDownloadingStatus(DownloadStatus.WAITING_SERVER);
          setProgressMessage(
            data.message || DownloadProgressMessage.CONNECTING
          );
          onCallback?.();
          break;

        case EventName.KEEP_ALIVE:
          if (data.status === EventStatus.WAITING_FOR_WFS_SERVER) {
            setDownloadingStatus(DownloadStatus.WAITING_SERVER);
            setProgressMessage(DownloadProgressMessage.WAITING_SERVER);
            onCallback?.();
          } else if (data.status === EventStatus.STREAMING) {
            setDownloadingStatus(DownloadStatus.IN_PROGRESS);
          }
          break;

        case EventName.DOWNLOAD_STARTED:
          setDownloadingStatus(DownloadStatus.IN_PROGRESS);
          setProgressMessage(
            data.message || DownloadProgressMessage.IN_PROGRESS
          );
          onCallback?.();
          // Reset chunk tracking on download start
          fileChunksRef.current = [];
          receivedChunksRef.current.clear();
          expectedTotalChunksRef.current = 0;
          break;

        case EventName.FILE_CHUNK:
          if (data.data && data.chunkNumber && data.chunkNumber > 0) {
            const index = data.chunkNumber - 1; // Convert to 0-based index

            // Expand array if needed to accommodate this chunk
            while (fileChunksRef.current.length < index + 1) {
              fileChunksRef.current.push("");
            }

            // Store chunk data (base64 encoded)
            fileChunksRef.current[index] = data.data;
            receivedChunksRef.current.add(data.chunkNumber);

            // Track highest chunk number seen (but prioritize server totalChunks)
            if (
              !data.totalChunks &&
              data.chunkNumber > expectedTotalChunksRef.current
            ) {
              expectedTotalChunksRef.current = data.chunkNumber;
            }

            // Update progress display
            if (data.totalBytes) {
              setDownloadedBytes(data.totalBytes);
              setProgressMessage(DownloadProgressMessage.IN_PROGRESS);
            }
          }
          break;

        case EventName.DOWNLOAD_COMPLETE:
          // Reconstruct file from base64 chunks
          try {
            // Use server-provided totalChunks first, fallback to our tracking
            const totalChunks =
              data.totalChunks || expectedTotalChunksRef.current;

            // Validate array size matches total chunks
            if (fileChunksRef.current.length !== totalChunks) {
              console.warn(
                `Array size mismatch: Got ${fileChunksRef.current.length}, expected ${totalChunks}`
              );
              // Trim any extra empty chunks at the end
              fileChunksRef.current.length = totalChunks;
            }

            // For very large files, process chunks in batches to avoid string length limits
            const batchSize = 1000; // Process 1000 chunks at a time
            const binaryChunks: Uint8Array[] = [];

            for (
              let batchStart = 0;
              batchStart < totalChunks;
              batchStart += batchSize
            ) {
              const batchEnd = Math.min(batchStart + batchSize, totalChunks);
              const batchChunks = fileChunksRef.current.slice(
                batchStart,
                batchEnd
              );

              // Join this batch of base64 strings
              const batchBase64 = batchChunks.join("");

              if (batchBase64.length > 0) {
                try {
                  // Decode this batch
                  const batchBinary = atob(batchBase64);
                  const batchBytes = new Uint8Array(batchBinary.length);
                  for (let i = 0; i < batchBinary.length; i++) {
                    batchBytes[i] = batchBinary.charCodeAt(i);
                  }
                  binaryChunks.push(batchBytes);
                } catch (batchError) {
                  console.error(
                    `Error processing batch ${batchStart}-${batchEnd}:`,
                    batchError
                  );
                }
              }
            }

            // Calculate total size and merge all binary chunks
            const totalSize = binaryChunks.reduce(
              (sum, chunk) => sum + chunk.length,
              0
            );

            const finalBytes = new Uint8Array(totalSize);
            let offset = 0;
            for (const chunk of binaryChunks) {
              finalBytes.set(chunk, offset);
              offset += chunk.length;
            }

            // Create and download file
            const blob = new Blob([finalBytes], {
              type: data.mediaType || "text/csv",
            });
            const filename = data.filename || generateFileName(layerName);
            downloadFile(blob, filename);

            setDownloadingStatus(DownloadStatus.COMPLETED);
            setProgressMessage(
              data.message || DownloadProgressMessage.COMPLETED
            );
            onCallback && onCallback();
          } catch (decodeError) {
            console.error("Error decoding file data:", decodeError);
            setDownloadingStatus(DownloadStatus.ERROR);
            setProgressMessage("Error processing downloaded data in batch");
            onCallback && onCallback();
          }
          break;
        case EventName.ERROR:
          console.error("SSE Error event:", data.error || data.message);
          setDownloadingStatus(DownloadStatus.ERROR);
          setProgressMessage(data.message || "Unknown error");
          onCallback && onCallback();
          break;
        default:
          if (data.error || data.message?.includes("Error")) {
            setDownloadingStatus(DownloadStatus.ERROR);
            setProgressMessage(
              data.message || data.error || "Unknown error occurred"
            );
            onCallback && onCallback();
          }
          break;
      }
    },
    [onCallback]
  );

  // Process SSE event text and extract type + data
  const processSSEEvent = useCallback(
    async (eventText: string, layerName: string) => {
      try {
        const lines = eventText.split("\n");
        let eventType = "";
        let dataContent = "";

        // Parse event type and data
        for (const line of lines) {
          const trimmedLine = line.trim();
          if (trimmedLine.startsWith("event:")) {
            eventType = trimmedLine.slice(6).trim();
          } else if (trimmedLine.startsWith("data:")) {
            dataContent = trimmedLine.slice(5).trim();
          }
        }

        if (eventType && dataContent) {
          const data: SSEEventData = JSON.parse(dataContent);
          await processSSEData(eventType, data, layerName);
        }
      } catch (error) {
        console.error("Failed to process SSE event:", error, eventText);
      }
    },
    [processSSEData]
  );

  // Main download function using manual fetch + streaming
  const startDownload = useCallback(
    async (
      uuid: string,
      layerName: string,
      downloadConditions: IDownloadCondition[]
    ) => {
      // Clean up any existing download
      cleanupDownload();

      if (!layerName || !uuid) {
        setDownloadingStatus(DownloadStatus.ERROR);
        setProgressMessage("Missing required parameters");
        onCallback && onCallback();
        return;
      }

      // Initialize download state
      setDownloadedBytes(0);
      setDownloadingStatus(DownloadStatus.WAITING_SERVER);
      setProgressMessage(DownloadProgressMessage.INITIALIZING);
      onCallback && onCallback();

      try {
        const downloadPromise = dispatch(
          processWFSDownload({
            uuid,
            layerName,
            downloadConditions,
          })
        );

        // Store the promise so we can abort it later
        downloadPromiseRef.current = downloadPromise;

        const resultAction = await downloadPromise;

        if (processWFSDownload.rejected.match(resultAction)) {
          setDownloadingStatus(DownloadStatus.ERROR);
          setProgressMessage(
            resultAction.payload?.message || "Failed to start WFS download"
          );
          onCallback && onCallback();
          return;
        }

        const responseStream = resultAction.payload.data as ReadableStream;

        if (!responseStream) {
          console.error("Response stream is null");
          setDownloadingStatus(DownloadStatus.ERROR);
          setProgressMessage("Response stream is null");
          onCallback && onCallback();
          cleanupDownload();
          return;
        }

        // Parse SSE stream manually
        const reader = responseStream.getReader();
        const decoder = new TextDecoder();
        let buffer = "";
        let done = false;
        let downloadCompleted = false;

        try {
          while (!done) {
            const result = await reader.read();
            done = result.done;
            if (done) break;

            const value = result.value;
            buffer += decoder.decode(value, { stream: true });

            // Process complete SSE events
            let eventStart = 0;
            while (eventStart < buffer.length) {
              // Look for complete event (ends with double newline)
              const eventEnd = buffer.indexOf("\n\n", eventStart);
              if (eventEnd === -1) {
                // No complete event found, keep remaining buffer for next iteration
                buffer = buffer.slice(eventStart);
                break;
              }

              // Extract and process complete event
              const eventText = buffer.slice(eventStart, eventEnd);
              if (eventText.trim()) {
                await processSSEEvent(eventText, layerName);
                if (eventText.includes("download-complete")) {
                  downloadCompleted = true;
                }
              }

              eventStart = eventEnd + 2; // Skip the double newline
            }
          }
        } finally {
          await reader.cancel("Cleaning up stream");
        }

        // Only show error if we haven't successfully completed the download
        if (!downloadCompleted) {
          setDownloadingStatus(DownloadStatus.ERROR);
          setProgressMessage(
            "Download incomplete - connection closed unexpectedly"
          );
          onCallback && onCallback();
        }

        // Clean up immediately after processing
        cleanupDownload();
      } catch (error) {
        setDownloadedBytes(0);
        cleanupDownload();
      }
    },
    [cleanupDownload, onCallback, processSSEEvent, dispatch]
  );

  return {
    downloadingStatus,
    downloadedBytes,
    progressMessage,
    startDownload,
    cancelDownload,
    formatBytes,
    isDownloading:
      downloadingStatus === DownloadStatus.IN_PROGRESS ||
      downloadingStatus === DownloadStatus.WAITING_SERVER,
  };
};

export default useWFSDownload;
export { DownloadProgressMessage, DownloadStatus };
