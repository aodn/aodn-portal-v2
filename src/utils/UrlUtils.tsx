import { escapeRegExp } from "lodash";

// Table lookup for param shortening, simple replacement
const paramLookup: Map<string, string> = new Map<string, string>([
  ["bbox.bbox", "B1"],
  ["bbox.geometry.type", "B2"],
  ["bbox.geometry.coordinates", "B3"],
  ["bbox.type", "B4"],
  ["isImosOnlyDataset", "I1"],
  ["hasCOData", "I2"],
  ["polygon.geometry.coordinates", "P1"],
  ["polygon.geometry.type", "P2"],
  ["polygon.type", "P3"],
  ["polygon.properties.NETNAME", "P4"],
  ["polygon.properties.RESNAME", "P5"],
  ["polygon.properties.OBJECTID", "P6"],
  ["polygon.properties.SHAPEAREA", "P7"],
  ["polygon.properties.SHAPELEN", "P8"],
]);

const paramReverseLookup = new Map(
  [...paramLookup].map(([key, value]) => [value, key])
);

/**
 * Creates a URL with query parameters from any parameter object
 * @param  Object containing baseUrl and params
 * @returns A formatted URL string
 */
const formatToUrl = <T extends Record<string, any>>({
  baseUrl,
  params,
}: {
  baseUrl: string;
  params: T;
}): string => {
  // Process parameters
  const queryParams = Object.entries(params)
    .filter(([_, value]) => value !== undefined && value !== null)
    .map(([key, value]) => {
      // Check if the value matches the pattern {something}
      // This used for the WMS parameters BBOX
      // e.g. {bbox-epsg-3857} {placehoder}
      const stringValue = String(value);
      const isBracketTemplate = /^\{.*}$/.test(stringValue);

      // Don't encode if it's a template in brackets
      const encodedValue = isBracketTemplate
        ? stringValue
        : encodeURIComponent(stringValue);

      return `${key}=${encodedValue}`;
    })
    .join("&");

  return `${baseUrl}?${queryParams}`;
};

/**
 * Converts HTTP URLs to HTTPS
 * @param {string} url - The URL to check and potentially convert
 * @returns {string} - The URL with HTTPS protocol
 */
const ensureHttps = (url: string): string => {
  if (!url) {
    return "";
  }

  // Check if URL starts with http:// and convert to https://
  if (url.toLowerCase().startsWith("http://")) {
    return url.replace(/^http:\/\//i, "https://");
  }

  // If already HTTPS or protocol-relative, return as is
  if (url.toLowerCase().startsWith("https://") || url.startsWith("//")) {
    return url;
  }

  // If no protocol specified, assume HTTPS
  if (!url.includes("://")) {
    return "https://" + url;
  }

  // For other protocols (ftp, file, etc.), return as is
  return url;
};

const encodeParam = (url: string): string => {
  let result = url;
  for (const [key, value] of paramLookup.entries()) {
    result = result.replace(new RegExp(escapeRegExp(key), "g"), value);
  }
  return result;
};

const decodeParam = (url: string): string => {
  let result = url;
  for (const [key, value] of paramReverseLookup.entries()) {
    result = result.replace(new RegExp(escapeRegExp(key), "g"), value);
  }
  return result;
};

export { formatToUrl, ensureHttps, encodeParam, decodeParam };
