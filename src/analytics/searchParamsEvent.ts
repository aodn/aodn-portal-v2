import { AnalyticsEvent } from "./analyticsEvents";
import { trackCustomEvent } from "./customEventTracker";
import { SearchParameters } from "../components/common/store/searchReducer";

/**
 * Track search result parameters at the API call level with session-based deduplication
 * @function trackSearchResultParameters
 * @file searchReducer.tsx
 *
 * INPUT EXAMPLE:
 * {
 *   "sortby": "id",
 *   "text": "test",
 *   "filter": "page_size=1500 AND
 *             dataset_group='australian_antarctic_division' AND
 *             (assets_summary IS NOT NULL) AND
 *             update_frequency='real-time' AND
 *             temporal DURING 1984-06-08T00:00:00Z/2010-05-13T00:00:00Z AND
 *             BBOX(geometry,143.50138888902995,-39.349999999219214,144.0000000000374,-38.911111109994) AND
 *             INTERSECTS(geometry,POLYGON ((143.66805555580834 -39.17650016820424,
 *                                          143.66805555580834 -38.911111109994,
 *                                          143.50138888902995 -38.911111109994,
 *                                          143.50138888902995 -39.3499999992192,
 *                                          144.0000000000374 -39.349999999219214,
 *                                          144.0000000000374 -39.19861111010624,
 *                                          143.66805555580834 -39.17650016820424))) AND
 *             (parameter_vocabs='aerosols' or parameter_vocabs='air pressure') AND
 *             (platform_vocabs='glider' or platform_vocabs='float' or platform_vocabs='mooring and buoy')",
 *   "properties": "id,centroid",
 * }
 *
 * OUTPUT TO GA4:
 * {
 *   "search_text": "test", // user input
 *   "bbox": "143.50138888902995,-39.349999999219214,144.0000000000374,-38.911111109994", // initial map or onMapZoomOrMove
 *   "temporal_start": "1984-06-08T00:00:00Z", // start date
 *   "temporal_end": "2010-05-13T00:00:00Z", // end date
 *   "polygon": "143.66805555580834 -39.17650016820424, 143.66805555580834 -38.911111109994, 143.50138888902995 -38.911111109994, 143.50138888902995 -39.3499999992192, 144.0000000000374 -39.349999999219214, 144.0000000000374 -39.19861111010624, 143.66805555580834 -39.17650016820424", // location
 *   "parameter_vocabs": "aerosols,air pressure", // parameters
 *   "platform_vocabs": "glider,float,mooring and buoy", // platform
 *   "dataset_group": "australian_antarctic_division", // organisation
 *   "update_frequency": "real-time", // data delivery mode
 *   "has_co_data": "true" // assets_summary IS NOT NULL or download service
 * }
 */

export function trackSearchResultParameters(searchParams: SearchParameters) {
  // Skip list searches
  if (searchParams.properties !== "id,centroid") {
    return;
  }

  // Create unique key for this search, including meaningful filters but excluding BBOX
  const extractUserFilters = (filter: string): string => {
    if (!filter) return "";

    // Remove BBOX and page_size (technical parameters)
    return filter
      .replace(/\s+AND\s+BBOX[^)]+\)/g, "") // Remove BBOX
      .replace(/\s+AND\s+INTERSECTS[^)]+\)\)\)/g, "") // Remove INTERSECTS
      .replace(/page_size=\d+\s+AND\s+/g, "") // Remove page_size
      .replace(/\s+AND\s+/g, " AND ") // Clean up multiple ANDs
      .replace(/^AND\s+|AND\s+$/g, "") // Remove leading/trailing AND
      .trim();
  };

  const searchKey = `${(searchParams.text || "").toLowerCase()}_${searchParams.sortby || ""}_${extractUserFilters(searchParams.filter || "")}`;

  // Check if already tracked in this session
  const lastTracked = sessionStorage.getItem("lastSearch") || "";
  if (searchKey === lastTracked) {
    return;
  }

  // Remember this search
  sessionStorage.setItem("lastSearch", searchKey);

  // Clear the stored search key after 2 seconds to prevent duplicate tracking
  setTimeout(() => {
    const currentSearch = sessionStorage.getItem("lastSearch");
    if (currentSearch === searchKey) {
      sessionStorage.removeItem("lastSearch");
    }
  }, 2000);

  // Prepare analytics data
  const analyticsData: Gtag.CustomParams = {};

  // Add search text
  if (searchParams.text) {
    analyticsData.search_text = String(searchParams.text).toLowerCase();
  }

  if (searchParams.filter) {
    // Extract BBOX coordinates
    const bboxMatch = searchParams.filter.match(
      /BBOX\(geometry,([\d.-]+,[\d.-]+,[\d.-]+,[\d.-]+)\)/
    );
    if (bboxMatch) {
      analyticsData.bbox = bboxMatch[1];
    }

    // Extract temporal range
    const temporalMatch = searchParams.filter.match(
      /temporal DURING ([^Z]+Z)\/([^Z]+Z)/
    );
    if (temporalMatch) {
      analyticsData.temporal_start = temporalMatch[1];
      analyticsData.temporal_end = temporalMatch[2];
    }

    // Extract polygon coordinates
    const polygonMatch = searchParams.filter.match(
      /INTERSECTS\(geometry,POLYGON \(\(([^)]+)\)\)\)/
    );
    if (polygonMatch) {
      analyticsData.polygon = polygonMatch[1];
    }

    // Extract parameter vocabularies
    const paramMatches = searchParams.filter.match(
      /parameter_vocabs='([^']+)'/g
    );
    if (paramMatches) {
      const paramVocabs = paramMatches
        .map((match) => match.match(/parameter_vocabs='([^']+)'/)?.[1])
        .filter(Boolean);
      analyticsData.parameter_vocabs = paramVocabs.join(",");
    }

    // Extract platform vocabularies
    const platformMatches = searchParams.filter.match(
      /platform_vocabs='([^']+)'/g
    );
    if (platformMatches) {
      const platformVocabs = platformMatches
        .map((match) => match.match(/platform_vocabs='([^']+)'/)?.[1])
        .filter(Boolean);
      analyticsData.platform_vocabs = platformVocabs.join(",");
    }

    // Extract dataset group
    const datasetGroupMatch = searchParams.filter.match(
      /dataset_group='([^']+)'/
    );
    if (datasetGroupMatch) {
      analyticsData.dataset_group = datasetGroupMatch[1];
    }

    // Extract update frequency
    const updateFreqMatch = searchParams.filter.match(
      /update_frequency='([^']+)'/
    );
    if (updateFreqMatch) {
      analyticsData.update_frequency = updateFreqMatch[1];
    }

    // Check for assets summary (has_co_data)
    analyticsData.has_co_data = searchParams.filter.includes(
      "assets_summary IS NOT NULL"
    )
      ? "true"
      : "false";
  }

  // Send to analytics
  if (Object.keys(analyticsData).length > 0) {
    // console.log(
    //   "🚀 ~ trackSearchResultParameters ~ searchParams:",
    //   searchParams
    // );
    // console.log(
    //   "🚀 ~ trackSearchResultParameters ~ analyticsData:",
    //   analyticsData
    // );
    trackCustomEvent(AnalyticsEvent.SEARCH_RESULT_PARAMS, analyticsData);
  }
}
