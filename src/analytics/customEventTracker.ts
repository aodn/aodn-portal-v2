import { TrackingEventName } from "./constants";

export function trackCustomEvent(
  eventName: TrackingEventName,
  eventParameters: Record<string, any> = {}
) {
  console.log("Custom Event:", eventName);
  console.log("Event Parameters:", eventParameters);

  if (window.gtag) {
    window.gtag("event", eventName, eventParameters);
  }
}
