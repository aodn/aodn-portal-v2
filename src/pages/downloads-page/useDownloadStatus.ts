import axios from "axios";
import { useCallback, useEffect, useRef, useState } from "react";
import {
  isDownloadStatusInfo,
  isTerminalDownloadStatus,
  TrackedDownload,
} from "@/app/store/DownloadStatusDefinitions";
import {
  getTrackedDownloadIds,
  removeTrackedDownloadId,
} from "@/utils/DownloadStorageUtils";
import { toAppDayjs } from "@/utils/DateUtils";
import { fetchDownloadStatus } from "./api";

const POLLING_INTERVAL_MS = 5 * 60_000;
const RETRY_DELAYS_MS = [5_000, 10_000, 20_000] as const;
const STATUS_ERROR_MESSAGE =
  "Unable to retrieve download status. Please try again.";
const NOT_FOUND_MESSAGE = "Download job unavailable.";

const createTrackedDownload = (jobID: string): TrackedDownload => ({
  jobID,
  lookupState: "checking",
});

const useDownloadStatus = () => {
  const [downloads, setDownloads] = useState<TrackedDownload[]>(() =>
    getTrackedDownloadIds().map(createTrackedDownload)
  );
  const mountedRef = useRef(false);
  const controllersRef = useRef(new Map<string, AbortController>());
  const timersRef = useRef(new Map<string, ReturnType<typeof setTimeout>>());
  const retryCountsRef = useRef(new Map<string, number>());

  const clearJobWork = useCallback((jobID: string) => {
    const timer = timersRef.current.get(jobID);
    if (timer) clearTimeout(timer);
    timersRef.current.delete(jobID);

    controllersRef.current.get(jobID)?.abort();
    controllersRef.current.delete(jobID);
  }, []);

  const pollJob = useCallback(async function pollDownloadJob(jobID: string) {
    if (!mountedRef.current || controllersRef.current.has(jobID)) return;

    const scheduleNextPoll = (delay: number) => {
      const currentTimer = timersRef.current.get(jobID);
      if (currentTimer) clearTimeout(currentTimer);

      const timer = setTimeout(() => {
        timersRef.current.delete(jobID);
        void pollDownloadJob(jobID);
      }, delay);
      timersRef.current.set(jobID, timer);
    };

    const controller = new AbortController();
    controllersRef.current.set(jobID, controller);

    try {
      const statusInfo = await fetchDownloadStatus(jobID, controller.signal);
      if (!mountedRef.current || controller.signal.aborted) return;

      if (!isDownloadStatusInfo(statusInfo) || statusInfo.jobID !== jobID) {
        throw new Error("Unexpected download status response");
      }

      retryCountsRef.current.set(jobID, 0);
      setDownloads((current) =>
        current.map((download) =>
          download.jobID === jobID
            ? {
                ...download,
                status: statusInfo.status,
                message: statusInfo.message,
                collection: statusInfo.collection ?? download.collection,
                dataSelection:
                  statusInfo.dataSelection ?? download.dataSelection,
                format: statusInfo.format ?? download.format,
                metadataUrl: statusInfo.metadataUrl ?? download.metadataUrl,
                created: statusInfo.created ?? download.created,
                started: statusInfo.started ?? download.started,
                finished: statusInfo.finished ?? download.finished,
                updated: statusInfo.updated ?? download.updated,
                progress: statusInfo.progress ?? download.progress,
                lastCheckedAt: toAppDayjs().toISOString(),
                pollingError: undefined,
                lookupState: "available",
              }
            : download
        )
      );

      if (!isTerminalDownloadStatus(statusInfo.status)) {
        scheduleNextPoll(POLLING_INTERVAL_MS);
      }
    } catch (error) {
      if (
        !mountedRef.current ||
        controller.signal.aborted ||
        axios.isCancel(error)
      ) {
        return;
      }

      const checkedAt = toAppDayjs().toISOString();
      if (axios.isAxiosError(error) && error.response?.status === 404) {
        retryCountsRef.current.delete(jobID);
        setDownloads((current) =>
          current.map((download) =>
            download.jobID === jobID
              ? {
                  ...download,
                  lookupState: "unavailable",
                  pollingError: NOT_FOUND_MESSAGE,
                  lastCheckedAt: checkedAt,
                }
              : download
          )
        );
        return;
      }

      const retryCount = (retryCountsRef.current.get(jobID) ?? 0) + 1;
      retryCountsRef.current.set(jobID, retryCount);
      const willRetry = retryCount <= RETRY_DELAYS_MS.length;

      setDownloads((current) =>
        current.map((download) =>
          download.jobID === jobID
            ? {
                ...download,
                lookupState: willRetry ? "checking" : "error",
                pollingError: willRetry
                  ? "Unable to retrieve download status. Retrying…"
                  : STATUS_ERROR_MESSAGE,
                lastCheckedAt: checkedAt,
              }
            : download
        )
      );

      if (willRetry) {
        scheduleNextPoll(RETRY_DELAYS_MS[retryCount - 1]);
      }
    } finally {
      if (controllersRef.current.get(jobID) === controller) {
        controllersRef.current.delete(jobID);
      }
    }
  }, []);

  useEffect(() => {
    mountedRef.current = true;
    getTrackedDownloadIds().forEach((jobID) => void pollJob(jobID));
    const timers = timersRef.current;
    const controllers = controllersRef.current;

    return () => {
      mountedRef.current = false;
      timers.forEach((timer) => clearTimeout(timer));
      timers.clear();
      controllers.forEach((controller) => controller.abort());
      controllers.clear();
    };
  }, [pollJob]);

  const retryDownload = useCallback(
    (jobID: string) => {
      clearJobWork(jobID);
      retryCountsRef.current.set(jobID, 0);
      setDownloads((current) =>
        current.map((download) =>
          download.jobID === jobID
            ? {
                ...download,
                lookupState: "checking",
                message: undefined,
                pollingError: undefined,
              }
            : download
        )
      );
      void pollJob(jobID);
    },
    [clearJobWork, pollJob]
  );

  const removeDownload = useCallback(
    (jobID: string) => {
      clearJobWork(jobID);
      retryCountsRef.current.delete(jobID);
      removeTrackedDownloadId(jobID);
      setDownloads((current) =>
        current.filter((download) => download.jobID !== jobID)
      );
    },
    [clearJobWork]
  );

  return { downloads, retryDownload, removeDownload };
};

export default useDownloadStatus;

export {
  NOT_FOUND_MESSAGE,
  POLLING_INTERVAL_MS,
  RETRY_DELAYS_MS,
  STATUS_ERROR_MESSAGE,
};
