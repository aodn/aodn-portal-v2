import { AnalyticsEvent } from "./analyticsEvents";
import { trackCustomEvent } from "./customEventTracker";

export function trackPageResponseTime() {
  const responseTime = getResponseTime();

  if (responseTime > 0) {
    const currentUrl = window.location.href;
    const speedLabel = getSpeedLabel(responseTime);

    // console.log(
    //   `📊 Page response in ${responseTime}ms (${speedLabel}) @ ${currentUrl}`
    // );

    // Send to Google Analytics with speed labels
    trackCustomEvent(AnalyticsEvent.PAGE_RESPONSE_TIME, {
      response_time_ms: responseTime,
      speed: speedLabel,
      url: currentUrl,
    });
  }
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
