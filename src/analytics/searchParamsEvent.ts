import { AnalyticsEvent } from "./analyticsEvents";
import { trackCustomEvent } from "./customEventTracker";
import { SearchParameters } from "../components/common/store/searchReducer";

/**
 * Track search parameters at the API call level with session-based deduplication
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
export function trackSearchUrlParameters(searchParams: SearchParameters) {
  // Skip list searches
  if (searchParams.properties !== "id,centroid") {
    return;
  }

  // Create unique key for this search
  const searchKey = `${searchParams.text || ""}_${searchParams.sortby || ""}`;

  // Check if already tracked in this session
  const lastTracked = sessionStorage.getItem("lastSearch") || "";
  if (searchKey === lastTracked) {
    return;
  }

  // Remember this search
  sessionStorage.setItem("lastSearch", searchKey);

  // Prepare analytics data
  const analyticsData: Gtag.CustomParams = {};

  if (searchParams.text) {
    analyticsData.search_text = String(searchParams.text);
  }

  if (searchParams.filter) {
    const bboxMatch = searchParams.filter.match(/BBOX\(geometry,([-\d.,]+)\)/);
    if (bboxMatch) {
      analyticsData.bbox = bboxMatch[1];
    }

    analyticsData.has_co_data = searchParams.filter.includes(
      "assets_summary IS NOT NULL"
    )
      ? "true"
      : "false";
  }

  // Send to analytics
  if (Object.keys(analyticsData).length > 0) {
    // console.log("🚀 ~ trackSearchUrlParameters ~ searchParams:", searchParams);
    trackCustomEvent(AnalyticsEvent.SEARCH_URL_PARAMS, analyticsData);
  }
}
