import { useCallback, useState, useRef } from "react";

interface SSEEventData {
  status?: string;
  message?: string;
  timestamp?: number;
  chunkNumber?: number;
  data?: string;
  chunkSize?: number;
  totalBytes?: number;
  final?: boolean;
  filename?: string;
  error?: string;
  totalChunks?: number;
}

enum DownloadStatus {
  NOT_STARTED = "Download not started",
  IN_PROGRESS = "Downloading in progress",
  WAITING_SERVER = "Waiting for WFS server response",
  STREAMING = "Streaming data",
  COMPLETED = "Download completed",
  ERROR = "Download error",
  FAILED = "Download failed",
}

const useWFSDownload = (onCallback?: () => void) => {
  const [downloadingStatus, setDownloadingStatus] = useState<DownloadStatus>(
    DownloadStatus.NOT_STARTED
  );
  const [downloadedBytes, setDownloadedBytes] = useState<number>(0);
  const [progressMessage, setProgressMessage] = useState<string>("");

  // Refs for managing download state
  const abortControllerRef = useRef<AbortController | null>(null);
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
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
      abortControllerRef.current = null;
    }
    fileChunksRef.current = [];
    receivedChunksRef.current.clear();
    expectedTotalChunksRef.current = 0;
  }, []);

  // Cancel download function
  const cancelDownload = useCallback(() => {
    cleanupDownload();
    setDownloadedBytes(0);
    setDownloadingStatus(DownloadStatus.NOT_STARTED);
    setProgressMessage("Download cancelled");
    onCallback && onCallback();
  }, [cleanupDownload, onCallback]);

  // Process SSE events
  const processSSEEvent = useCallback(
    async (eventType: string, data: SSEEventData, layerName: string) => {
      switch (eventType) {
        case "connection-established":
          setDownloadingStatus(DownloadStatus.NOT_STARTED);
          setProgressMessage("Connected to server");
          onCallback && onCallback();
          break;

        case "keep-alive":
          setProgressMessage("Waiting for server...");
          if (data.status === "waiting-for-wfs-server") {
            setDownloadingStatus(DownloadStatus.WAITING_SERVER);
          } else if (data.status === "streaming") {
            setDownloadingStatus(DownloadStatus.STREAMING);
          }
          break;

        case "wfs-request-ready":
          setProgressMessage("Connecting to WFS server...");
          setDownloadingStatus(DownloadStatus.WAITING_SERVER);
          onCallback && onCallback();
          break;

        case "download-started":
          // Reset chunk tracking on download start
          fileChunksRef.current = [];
          receivedChunksRef.current.clear();
          expectedTotalChunksRef.current = 0;
          break;

        case "file-chunk":
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
              setProgressMessage(DownloadStatus.IN_PROGRESS);
              //   setProgressMessage(`${formatBytes(data.totalBytes)} received`);
            }
          }
          break;

        case "download-complete":
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
            const blob = new Blob([finalBytes], { type: "text/csv" });
            const filename = data.filename || generateFileName(layerName);
            downloadFile(blob, filename);

            setDownloadingStatus(DownloadStatus.COMPLETED);
            setProgressMessage("Download completed successfully");
            onCallback && onCallback();
          } catch (decodeError) {
            console.error("Error decoding file data:", decodeError);
            setDownloadingStatus(DownloadStatus.ERROR);
            setProgressMessage("Error processing downloaded data in batch");
            onCallback && onCallback();
          }
          break;
        case "error":
        default:
          if (data.error || data.message?.includes("Error")) {
            console.error("SSE Error:", data.error || data.message);
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

  // Helper function to process complete SSE events
  const processCompleteSSEEvent = useCallback(
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
          await processSSEEvent(eventType, data, layerName);
        }
      } catch (error) {
        console.error("Failed to process SSE event:", error, eventText);
      }
    },
    [processSSEEvent]
  );

  // Main download function using manual fetch + streaming (your original approach)
  const startDownload = useCallback(
    async (uuid: string, layerName: string) => {
      // Clean up any existing download
      cleanupDownload();

      if (!layerName || !uuid) {
        console.error("UUID or layer name is not provided for download");
        setDownloadingStatus(DownloadStatus.ERROR);
        setProgressMessage("Missing required parameters");
        onCallback && onCallback();
        return;
      }

      // Initialize download state
      setDownloadedBytes(0);
      setDownloadingStatus(DownloadStatus.NOT_STARTED);
      setProgressMessage("Initializing download...");
      onCallback && onCallback();

      try {
        const controller = new AbortController();
        abortControllerRef.current = controller;
        const timeoutId = setTimeout(() => controller.abort(), 600000); // Frontend 10 minutes timeout

        const response = await fetch(
          "/api/v1/ogc/processes/downloadWfs/execution/sse",
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Accept: "text/event-stream",
            },
            body: JSON.stringify({
              inputs: {
                uuid: uuid,
                recipient: "",
                layer_name: layerName,
              },
              outputs: {},
              subscriber: {
                successUri: "",
                inProgressUri: "",
                failedUri: "",
              },
            }),
            signal: controller.signal,
          }
        );

        clearTimeout(timeoutId);

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        if (!response.body) {
          throw new Error("Response body is null");
        }

        // Parse SSE stream manually with improved robustness
        const reader = response.body.getReader();
        const decoder = new TextDecoder();
        let buffer = "";
        let done = false;
        let downloadCompleted = false;
        while (!done && !controller.signal.aborted) {
          const result = await reader.read();
          done = result.done;
          if (done) break;

          const value = result.value;
          buffer += decoder.decode(value, { stream: true });

          // Process complete SSE events (improved parsing)
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
              await processCompleteSSEEvent(eventText, layerName);
              if (eventText.includes("download-complete")) {
                downloadCompleted = true;
              }
            }

            eventStart = eventEnd + 2; // Skip the double newline
          }
        }

        // Only show error if we haven't successfully completed the download
        if (!downloadCompleted && !controller.signal.aborted) {
          setDownloadingStatus(DownloadStatus.ERROR);
          setProgressMessage(
            "Download incomplete - connection closed unexpectedly"
          );
          onCallback && onCallback();
        }

        cleanupDownload();
      } catch (error) {
        setDownloadingStatus(DownloadStatus.ERROR);
        setDownloadedBytes(0);
        setProgressMessage(
          error instanceof Error
            ? `Download failed: ${error.message}`
            : "Download failed: Unknown error"
        );
        onCallback && onCallback();
        cleanupDownload();
      }
    },
    [cleanupDownload, onCallback, processCompleteSSEEvent]
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
      downloadingStatus === DownloadStatus.WAITING_SERVER ||
      downloadingStatus === DownloadStatus.STREAMING,
  };
};

export default useWFSDownload;
export { DownloadStatus };
