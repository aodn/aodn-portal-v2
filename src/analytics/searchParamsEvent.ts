import { AnalyticsEvent } from "./analyticsEvents";
import { trackCustomEvent } from "./customEventTracker";
import { SearchParameters } from "../components/common/store/searchReducer";

/**
 * Track search parameters at the API call level
 *
 * INPUT EXAMPLE:
 * {
 *   "text": "123",
 *   "filter": "page_size=1500 AND (assets_summary IS NOT NULL) AND BBOX(geometry,104,-43,163,-8)"
 * }
 *
 * OUTPUT TO GA4:
 * {
 *   "search_text": "123",
 *   "bbox": "104,-43,163,-8",
 *   "has_co_data": "true"
 * }
 */
export function trackSearchUrlParameters(
  searchParams: SearchParameters & { signal?: AbortSignal }
) {
  const { text, filter } = searchParams;
  const analyticsParams: Gtag.CustomParams = {};

  // Extract search text
  if (text) {
    analyticsParams.search_text = String(text);
  }

  // Extract bbox and CO data from filter
  if (filter) {
    const bboxMatch = filter.match(/BBOX\(geometry,([-\d.,]+)\)/);
    if (bboxMatch) {
      analyticsParams.bbox = bboxMatch[1];
    }

    analyticsParams.has_co_data = filter.includes("assets_summary IS NOT NULL")
      ? "true"
      : "false";
  }

  // Send to GA4 if we have data
  if (Object.keys(analyticsParams).length > 0) {
    trackCustomEvent(AnalyticsEvent.SEARCH_URL_PARAMS, analyticsParams);
  }
}
