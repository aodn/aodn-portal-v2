// This file is only for string manipulation related helper methods
// e.g capitalize, concatenate, ...

/**
 * Capitalizes the first letter of a given string.
 *
 * @param str The input string to be capitalized
 * @returns A new string with the first letter capitalized
 *
 * @example
 * const result = capitalizeFirstLetter('hello');
 * // result: 'Hello'
 *
 * @example
 * const result = capitalizeFirstLetter('alReAdY cOrReCt');
 * // result: 'Already correct'
 */
export const capitalizeFirstLetter = (str: string): string =>
  str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();

/**
 * Formats a number with comma separators for thousands.
 * @param {number} number - The number to format.
 * @returns {string} The formatted number as a string.
 */
export const formatNumber = (number: number) => {
  return number.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
};

/**
 * Trims a string to a specified length and adds an ellipsis if necessary.
 * @param c - The input string to trim. Can be undefined.
 * @param size - The maximum length of the trimmed string. Defaults to 90.
 * @returns The trimmed string, or an empty string if the input is undefined.
 */
export const trimContent = (
  c: string | undefined,
  size: number = 90
): string => {
  if (c) {
    return `${c.slice(0, 90)}${c.length > size ? "..." : ""}`;
  } else {
    return "";
  }
};
