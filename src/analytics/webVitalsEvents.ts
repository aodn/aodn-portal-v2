import {
  onLCP,
  onINP,
  onCLS,
  LCPMetric,
  INPMetric,
  CLSMetric,
} from "web-vitals";
import { AnalyticsEvent } from "./analyticsEvents";
import { trackCustomEvent } from "./customEventTracker";

export function trackWebVitals() {
  // Track LCP - Largest Contentful Paint
  // Triggers: Automatically when largest content element finishes loading
  onLCP((metric) => {
    trackLCP(metric);
  });

  // Track INP - Interaction to Next Paint
  // Triggers: Only on page unload/navigation, and only if user interacted (clicked, tapped, typed)
  // Note: Not 100% guaranteed - won't trigger if user has no interactions or force-closes browser
  // Console logs won't be visible as they trigger during page unload, but data will appear in GA4
  onINP((metric) => {
    trackINP(metric);
  });

  // Track CLS - Cumulative Layout Shift
  // Triggers: On page unload/navigation or when page becomes hidden
  // Note: Not 100% guaranteed - may not trigger if browser is force-closed or crashes
  // Console logs won't be visible as they trigger during page unload, but data will appear in GA4
  onCLS((metric) => {
    trackCLS(metric);
  });
}

function trackLCP(metric: LCPMetric) {
  const lcpValue: number = Math.round(metric.value);
  const currentUrl: string = window.location.href;

  // console.log(
  //   `🎯 LCP completed in ${lcpValue}ms (${metric.rating}) @ ${currentUrl}`
  // );

  trackCustomEvent(AnalyticsEvent.WEB_VITALS_LCP, {
    lcp_value_ms: lcpValue,
    lcp_rating: metric.rating,
    url: currentUrl,
  });
}

function trackINP(metric: INPMetric) {
  const inpValue: number = Math.round(metric.value);
  const currentUrl: string = window.location.href;

  // Console log omitted - INP triggers on page unload when console is cleared
  // Data will be successfully sent to GA4 via sendBeacon API before page closes
  trackCustomEvent(AnalyticsEvent.WEB_VITALS_INP, {
    inp_value_ms: inpValue,
    inp_rating: metric.rating,
    url: currentUrl,
  });
}

function trackCLS(metric: CLSMetric) {
  const clsValue: number = Math.round(metric.value * 1000) / 1000;
  const currentUrl: string = window.location.href;

  // Console log omitted - CLS triggers on page unload when console is cleared
  // Data will be successfully sent to GA4 via sendBeacon API before page closes
  trackCustomEvent(AnalyticsEvent.WEB_VITALS_CLS, {
    cls_value: clsValue,
    cls_rating: metric.rating,
    url: currentUrl,
  });
}
