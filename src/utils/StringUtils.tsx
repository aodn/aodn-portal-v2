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
