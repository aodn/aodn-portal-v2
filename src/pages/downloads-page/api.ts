import { DownloadStatusInfo } from "@/app/store/DownloadStatusDefinitions";
import { ogcAxiosWithRetry } from "@/app/store/searchReducer";

export const fetchDownloadStatus = async (
  jobID: string,
  signal: AbortSignal
): Promise<DownloadStatusInfo> => {
  const response = await ogcAxiosWithRetry.get<DownloadStatusInfo>(
    `/ogc/jobs/${encodeURIComponent(jobID)}`,
    {
      signal,
      "axios-retry": { retries: 0 },
    }
  );

  return response.data;
};
