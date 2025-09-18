import { AnalyticsEvent } from "./analyticsEvents";
import { trackCustomEvent } from "./customEventTracker";

export function trackPageResponseTime(): void {
  window.addEventListener("load", () => {
    try {
      const responseTime = getResponseTime();

      if (responseTime > 0) {
        // Log to console
        // console.log(`📊 Response Time: ${responseTime}ms`);

        // Send to Google Analytics using existing trackCustomEvent
        trackCustomEvent(AnalyticsEvent.PAGE_RESPONSE_TIME, {
          response_time_ms: responseTime,
        });
      }
    } catch (error) {
      console.error("Response time tracking failed:", error);
    }
  });
}

function getResponseTime(): number {
  const navigation = performance.getEntriesByType(
    "navigation"
  )[0] as PerformanceNavigationTiming;
  if (!navigation) return 0;

  // Calculate: complete response time from request start to response end
  const responseTime = navigation.responseEnd - navigation.requestStart;

  // Round to whole milliseconds (e.g., 245.67ms → 246ms)
  return Math.round(responseTime);
}
