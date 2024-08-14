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
    console.error("Invalid JSON string:", error);
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
