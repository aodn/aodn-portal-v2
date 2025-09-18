import { AnalyticsEvent } from "./analyticsEvents";

/**
 * Send custom events to Google Analytics
 */
export function trackCustomEvent(
  eventName: AnalyticsEvent,
  eventParameters: Record<string, string> = {}
) {
  // Send event to GA4 via gtag
  window.gtag?.("event", eventName, eventParameters);
}
