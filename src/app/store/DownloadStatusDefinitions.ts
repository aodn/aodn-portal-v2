export type DownloadStatus =
  | "accepted"
  | "running"
  | "successful"
  | "failed"
  | "dismissed";

export interface DownloadExecutionResponse {
  message: { type?: "InlineValue"; message: string };
  status: { type?: "InlineValue"; message: string };
  jobID?: string;
  // True when ogcapi held the job because the user already has the maximum
  // number of downloads in flight. It is released to AWS Batch automatically.
  queued?: boolean;
  // Place in this user's own hold queue, this download included, so 1 means it
  // is next to start. Omitted when queued is false. Not a time estimate.
  queuePosition?: number;
}

export const getSubmittedDownloadJobID = (
  response: DownloadExecutionResponse
): string | undefined => {
  const jobID = response?.jobID;
  return response?.status?.message === "200" &&
    typeof jobID === "string" &&
    jobID.trim().length > 0
    ? jobID
    : undefined;
};

export interface DownloadStatusInfo {
  processID?: string;
  type: "process";
  jobID: string;
  status: DownloadStatus;
  message?: string;
  collection?: string;
  dataSelection?: string;
  format?: string;
  metadataUrl?: string;
  created?: string;
  started?: string;
  finished?: string;
  updated?: string;
  progress?: number;
}

export type DownloadLookupState =
  | "checking"
  | "available"
  | "unavailable"
  | "error";

export interface TrackedDownload {
  jobID: string;
  status?: DownloadStatus;
  message?: string;
  collection?: string;
  dataSelection?: string;
  format?: string;
  metadataUrl?: string;
  created?: string;
  started?: string;
  finished?: string;
  updated?: string;
  progress?: number;
  lastCheckedAt?: string;
  pollingError?: string;
  lookupState: DownloadLookupState;
}

const DOWNLOAD_STATUSES: ReadonlySet<string> = new Set([
  "accepted",
  "running",
  "successful",
  "failed",
  "dismissed",
]);

export const isDownloadStatusInfo = (
  value: unknown
): value is DownloadStatusInfo => {
  if (!value || typeof value !== "object") return false;

  const statusInfo = value as Partial<DownloadStatusInfo>;
  return (
    (statusInfo.processID === undefined ||
      typeof statusInfo.processID === "string") &&
    statusInfo.type === "process" &&
    typeof statusInfo.jobID === "string" &&
    typeof statusInfo.status === "string" &&
    DOWNLOAD_STATUSES.has(statusInfo.status) &&
    (statusInfo.message === undefined ||
      typeof statusInfo.message === "string") &&
    (statusInfo.collection === undefined ||
      typeof statusInfo.collection === "string") &&
    (statusInfo.dataSelection === undefined ||
      typeof statusInfo.dataSelection === "string") &&
    (statusInfo.format === undefined ||
      typeof statusInfo.format === "string") &&
    (statusInfo.metadataUrl === undefined ||
      typeof statusInfo.metadataUrl === "string") &&
    (statusInfo.created === undefined ||
      typeof statusInfo.created === "string") &&
    (statusInfo.started === undefined ||
      typeof statusInfo.started === "string") &&
    (statusInfo.finished === undefined ||
      typeof statusInfo.finished === "string") &&
    (statusInfo.updated === undefined ||
      typeof statusInfo.updated === "string") &&
    (statusInfo.progress === undefined ||
      typeof statusInfo.progress === "number")
  );
};

export const isTerminalDownloadStatus = (status: DownloadStatus): boolean =>
  status === "successful" || status === "failed" || status === "dismissed";
