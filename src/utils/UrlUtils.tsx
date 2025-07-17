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
      const isBracketTemplate = /^\{.*\}$/.test(stringValue);

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
  if (!url || typeof url !== "string") {
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
  return url;
};

const decodeParam = (url: string): string => {
  return url;
};

export { formatToUrl, ensureHttps, encodeParam, decodeParam };
