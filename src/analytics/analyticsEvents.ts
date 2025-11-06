/**
 * GA4 Analytics Custom Events
 *
 * Naming Convention:
 * - Use underscores (not hyphens) for GA4 compatibility
 */
export enum AnalyticsEvent {
  // User engagement and business events
  SEARCH_RESULT_PARAMS = "search_result_params",
  DETAILS_PAGE_DATASET = "details_page_dataset",
  COPY_CITATION_CLICK = "copy_citation_click",
  DATA_ACCESS_CLICK = "data_access_click",
  DOWNLOAD_CO_DATA = "download_co_data",
  DOWNLOAD_WFS_DATA = "download_wfs_data",

  // Performance and page speed events
  PAGE_RESPONSE_TIME = "page_response_time",
  WEB_VITALS_LCP = "web_vitals_lcp", // Largest Contentful Paint
  WEB_VITALS_INP = "web_vitals_inp", // Interaction to Next Paint
  WEB_VITALS_CLS = "web_vitals_cls", // Cumulative Layout Shift
}
