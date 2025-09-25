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
 * example of capitalizing first letter and lowercasing the rest
 * const result = capitalizeFirstLetter('alReAdY cOrReCt');
 * // result: 'Already correct'
 */
export const capitalizeFirstLetter = (
  str: string,
  shouldLowercaseTheRest: boolean = true
): string =>
  `${str.charAt(0).toUpperCase()}${
    shouldLowercaseTheRest ? str.slice(1).toLowerCase() : str.slice(1)
  }`;

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
// TODO: Keep it for now, we want to enhance the url later with http
export const enrichHTML = (text: string): string => {
  // Regular expression to match URLs with http:// or https://
  const urlPattern = /\bhttps?:\/\/[^\s/$.?#].[^\s]*\b/g;

  // Replace URLs in the text with anchor tags
  const h = text.replace(urlPattern, (url) => {
    return `<a href="${url}" target="_blank" rel="noopener noreferrer">${url}</a>`;
  });

  return h.replace(/\n/g, "<br>");
};

//util function for join uuids in a specific pattern for fetching data
export const createFilterString = (uuids: Array<string>): string => {
  if (!Array.isArray(uuids) || uuids.length === 0) {
    return "";
  }
  return uuids.map((uuid) => `id='${uuid}'`).join(" or ");
};

// Regex patterns for link detection
export const EMAIL_REGEX =
  /\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}\b/g;

export const URL_REGEX =
  /https?:\/\/(www\.)?[-a-zA-Z0-9@:%._+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b[-a-zA-Z0-9()@:%_+.~#?&//=]*(?<![.,;:!?)])/g;

export const COMBINED_LINK_REGEX =
  /(https?:\/\/[^\s]+(?<![.,;:!?)])|(?<![.,;:!?)])\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}\b)/g;

// Utility functions for validation
export const isEmail = (text: string): boolean => {
  return EMAIL_REGEX.test(text);
};

export const isUrl = (text: string): boolean => {
  return URL_REGEX.test(text);
};

// Helper to detect what type of link a string contains
export const getLinkType = (text: string): "email" | "url" | "text" => {
  if (isEmail(text)) return "email";
  if (isUrl(text)) return "url";
  return "text";
};
