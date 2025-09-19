import { AnalyticsEvent } from "./analyticsEvents";

/**
 * Send custom events to Google Analytics
 */
export function trackCustomEvent(
  eventName: AnalyticsEvent,
  eventParameters?: Gtag.CustomParams
) {
  window.gtag?.("event", eventName, eventParameters);
}
