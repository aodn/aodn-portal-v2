/**
 * Controls whether the download status tracking UI is exposed in an
 * environment. An unset value keeps local development and test builds
 * enabled by default.
 */
export const isDownloadStatusTrackingEnabled =
  import.meta.env.VITE_ENABLE_DOWNLOAD_STATUS_TRACKING !== "false";
