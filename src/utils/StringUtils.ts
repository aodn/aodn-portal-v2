// This file is only for string manipulation related helper methods
// e.g capitalize, concatenate, ...

import { decode } from "he";

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
export const formatNumber = (number: number): string => {
  return number.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
};

/**
 * Truncates a string to a specified length. If the string is not longer than the specified length, the original string is returned.
 * @param {string} str - The string to truncate.
 * @param {number} truncateCount - The number of characters to truncate the string to.
 * @returns {string} The truncated string.
 */
export const truncateText = (str: string, truncateCount: number): string => {
  return str.length > truncateCount ? str.slice(0, truncateCount) + "..." : str;
};

export const decodeHtmlEntities = (str: string): string => {
  try {
    return decode(str, { strict: true });
  } catch (ignored) {
    return str;
  }
};
