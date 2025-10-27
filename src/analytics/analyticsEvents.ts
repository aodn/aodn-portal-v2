/**
 * GA4 Analytics Custom Events
 *
 * Naming Convention:
 * - Use underscores (not hyphens) for GA4 compatibility
 */
export enum AnalyticsEvent {
  DOWNLOAD_CO_DATA = "download_co_data",
  COPY_CITATION_CLICK = "copy_citation_click",
  PAGE_RESPONSE_TIME = "page_response_time",
  SEARCH_RESULT_PARAMS = "search_result_params",
  // Web Vitals events
  WEB_VITALS_LCP = "web_vitals_lcp", // Largest Contentful Paint
  WEB_VITALS_INP = "web_vitals_inp", // Interaction to Next Paint
  WEB_VITALS_CLS = "web_vitals_cls", // Cumulative Layout Shift
  DATA_ACCESS_CLICK = "data_access_click",
  DETAILS_PAGE_DATASET = "details_page_dataset",
}
