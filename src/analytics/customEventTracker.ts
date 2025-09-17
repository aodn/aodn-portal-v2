import { CustomEvent } from "./constants";

/**
 * Send custom events to Google Analytics
 */
export function trackCustomEvent(
  eventName: CustomEvent,
  eventParameters: Record<string, any> = {}
) {
  // Send event to GA4 via gtag
  window.gtag?.("event", eventName, eventParameters);
}
