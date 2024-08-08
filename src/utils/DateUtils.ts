// This file is only for date time related helper methods e.g comparing dates, convert timezone, etc.

/**
 * Converts a date string from ISO 8601 format to a more readable format.
 *
 * @param dateString A date string in ISO 8601 format (e.g., "2021-08-01T00:00:00.000Z")
 * @returns A string representing the date in a more readable format (e.g., "Sun Aug 01 2021 05:30:00 GMT+0530")
 *
 * @example
 * const isoDate = "2021-08-01T00:00:00.000Z";
 * const result = convertDateFormat(isoDate);
 * // result: "Sun Aug 01 2021 05:30:00 GMT+0530" (actual result may vary based on local timezone)
 *
 * @note The exact output format may vary depending on the local timezone of the system running the code.
 * @note This function assumes the input is a valid ISO 8601 date string. Invalid inputs may produce unexpected results.
 */
export const convertDateFormat = (dateString: string): string => {
  const date = new Date(dateString);
  const convertedString = date.toString();
  const index = convertedString.indexOf("(");
  return convertedString.substring(0, index).trim();
};
