export enum InfoStatusType {
  NONE = "none",
  INFO = "info",
  WARNING = "warning",
  ERROR = "error",
}

export interface InfoContentType {
  title?: string;
  body: string;
}
