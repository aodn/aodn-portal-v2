export const TRACKING_EVENTS = {
  COPY_CITATION_CLICK: "copy_citation_click",
} as const;

export type TrackingEventName =
  (typeof TRACKING_EVENTS)[keyof typeof TRACKING_EVENTS];
