/**
 * Creates a URL with query parameters from any parameter object
 * @param  Object containing baseUrl and params
 * @returns A formatted URL string
 */
export const formatToUrl = <T extends Record<string, any>>({
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
