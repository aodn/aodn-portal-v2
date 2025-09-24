import { AnalyticsEvent } from "./analyticsEvents";
import { trackCustomEvent } from "./customEventTracker";

export function trackPageResponseTime(): void {
  window.addEventListener("load", () => {
    try {
      const responseTime = getResponseTime();

      if (responseTime > 0) {
        // Log to console
        // console.log(`📊 Response Time: ${responseTime}ms`);

        // Send to Google Analytics with speed labels
        trackCustomEvent(AnalyticsEvent.PAGE_RESPONSE_TIME, {
          response_time_ms: responseTime,
          speed: getSpeedLabel(responseTime), // fast, needs_improvement, or slow
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

function getSpeedLabel(responseTime: number): string {
  if (responseTime < 500) return "fast";
  if (responseTime < 1000) return "needs_improvement";
  return "slow";
}
