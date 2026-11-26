export enum DatasetFrequency {
  REALTIME = "real-time",
  DELAYED = "delayed",
  OTHER = "other",
  BOTH = "both",
}

export enum DatasetStatus {
  ONGOING = "onGoing",
  COMPLETED = "completed",
}

export enum DownloadServiceType {
  WFS = "WFS",
  CloudOptimised = "CloudOptimised",
  OriginalNetcdfs = "OriginalNetcdfs",
  Unavailable = "Unavailable",
}
