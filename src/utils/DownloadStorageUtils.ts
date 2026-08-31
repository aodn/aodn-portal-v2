const TRACKED_DOWNLOAD_IDS_KEY = "aodn_tracked_download_job_ids_v1";

const parseTrackedDownloadIds = (value: string | null): string[] => {
  if (!value) return [];

  try {
    const parsed: unknown = JSON.parse(value);
    if (!Array.isArray(parsed)) return [];

    return Array.from(
      new Set(
        parsed.filter(
          (jobID): jobID is string =>
            typeof jobID === "string" && jobID.trim().length > 0
        )
      )
    );
  } catch {
    return [];
  }
};

export const getTrackedDownloadIds = (): string[] => {
  try {
    return parseTrackedDownloadIds(
      localStorage.getItem(TRACKED_DOWNLOAD_IDS_KEY)
    );
  } catch {
    return [];
  }
};

const saveTrackedDownloadIds = (jobIDs: string[]): boolean => {
  try {
    localStorage.setItem(TRACKED_DOWNLOAD_IDS_KEY, JSON.stringify(jobIDs));
    return true;
  } catch {
    // Download submission should still succeed when browser storage is unavailable.
    return false;
  }
};

export const addTrackedDownloadId = (jobID: string): boolean =>
  saveTrackedDownloadIds([
    jobID,
    ...getTrackedDownloadIds().filter((storedID) => storedID !== jobID),
  ]);

export const removeTrackedDownloadId = (jobID: string): void => {
  saveTrackedDownloadIds(
    getTrackedDownloadIds().filter((storedID) => storedID !== jobID)
  );
};

export { TRACKED_DOWNLOAD_IDS_KEY };
