import { CustomEvent } from "./constants";
import { trackCustomEvent } from "./customEventTracker";

/**
 * Parameter mapping from URL shortcodes to meaningful names
 */
const URL_PARAM_MAPPING: Map<string, string> = new Map([
  ["B1", "bbox_bbox"],
  ["B2", "bbox_geometry_type"],
  ["B3", "bbox_geometry_coordinates"],
  ["B4", "bbox_type"],
  ["I1", "dataset_group"],
  ["I2", "has_co_data"],
  ["P1", "polygon_geometry_coordinates"],
  ["P2", "polygon_geometry_type"],
  ["P3", "polygon_type"],
  ["P4", "polygon_network_name"],
  ["P5", "polygon_resource_name"],
  ["P6", "polygon_object_id"],
  ["P7", "polygon_shape_area"],
  ["P8", "polygon_shape_length"],
  ["searchText", "search_term"],
  ["layout", "layout_type"],
  ["zoom", "zoom_level"],
]);

/**
 * Parse URL search string and convert to meaningful parameter names
 */
function parseUrlParameters(urlSearch: string): Record<string, string> {
  if (!urlSearch) return {};

  const params = new URLSearchParams(urlSearch);
  const result: Record<string, string> = {};

  // URLSearchParams.entries() returns pairs like ["I2", "false"], ["searchText", "111"]
  // The [key, value] syntax extracts the first element as 'key' and second as 'value'
  for (const [paramKey, paramValue] of params.entries()) {
    // Convert to readable name using mapping, fallback to original key
    const parameterName = URL_PARAM_MAPPING.get(paramKey) || paramKey;
    result[parameterName] = paramValue;
  }

  return result;
}

/**
 * Track search URL parameters to analytics
 */
export function trackSearchUrlParameters(urlSearch: string): void {
  // Convert URL params like "?I2=false&searchText=111" into object like {has_co_data: "false", search_term: "111"}
  const parameters = parseUrlParameters(urlSearch);

  if (Object.keys(parameters).length > 0) {
    trackCustomEvent(CustomEvent.SEARCH_URL_PARAMS, parameters);
  }
}
