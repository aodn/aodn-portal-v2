export enum InfoStatusType {
  INFO = "info",
  WARNING = "warning",
  ERROR = "error",
}

export interface InfoContentType {
  title?: string;
  body: string;
}
