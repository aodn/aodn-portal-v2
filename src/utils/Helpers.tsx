// This component is for general purposes helper methods
import { sortBy } from "lodash";

/**
 * Parses a JSON string into a JavaScript object.
 *
 * @param jsonString A JSON string that needs to be parsed
 * @returns The parsed JavaScript object if successful, or null if parsing fails
 * @throws {Error} Logs an error to the console if parsing fails
 */
export const parseJson = (jsonString: string): any => {
  try {
    return JSON.parse(jsonString);
  } catch (error) {
    console.error(`Invalid JSON string: ${jsonString}`, error);
    return null;
  }
};

/**
 * Sorts an array of strings based on their relevance to a target string.
 *
 * @param items An array of strings to sort
 * @param target The target string to compare against
 * @returns A new array of sorted strings
 */
export const sortByRelevance = (
  items: string[] | Set<string>,
  target: string
): string[] => {
  const itemsArray = Array.from(items);
  return sortBy(itemsArray, [
    // Exact match first
    (item) => item.toLowerCase() !== target.toLowerCase(),
    // Then by whether it starts with the target
    (item) => !item.toLowerCase().startsWith(target.toLowerCase()),
    // Then by the index where the target appears in the item
    (item) => item.toLowerCase().indexOf(target.toLowerCase()),
    // Finally by length (shorter items first)
    (item) => item.length,
  ]);
};

// Check if array is undefined, null, empty array, or contains only empty strings
export const checkEmptyArray = (array?: any[]): boolean => {
  return array?.some((item) => item?.toString().trim() !== "") ?? false;
};

/**
 * Removes duplicate and empty items from an array of strings.
 * - Trims whitespace from each item
 * - Removes whitespace-only strings
 * - Removes duplicates based on trim + lowercase (case-insensitive comparison)
 * - Keeps the original text format of the first occurrence
 *
 * @param items Array of strings to deduplicate
 * @returns Array with duplicates and empty items removed
 *
 * @example
 * const result = removeDuplicatesAndEmpty(['PointOfContact', '  pointofcontact  ', '', '  ', 'SCIENCE', 'Science']);
 * // result: ['PointOfContact', 'SCIENCE']
 */
export const removeDuplicatesAndEmpty = (items: string[]): string[] => {
  const arr = new Set<string>();
  return items
    .map((item) => item.trim())
    .filter((item) => {
      // Remove whitespace-only strings
      if (item === "") return false;
      // Remove duplicates based on trim + lowercase
      const normalizedItem = item.toLowerCase();
      if (arr.has(normalizedItem)) return false;
      arr.add(normalizedItem);
      return true;
    });
};
