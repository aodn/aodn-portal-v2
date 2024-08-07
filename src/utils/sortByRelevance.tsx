import { sortBy } from "lodash";

/**
 * Sorts an array of strings based on their relevance to a target string.
 *
 * @param items An array of strings to sort
 * @param target The target string to compare against
 * @returns A new array of sorted strings
 */
export function sortByRelevance(items: string[], target: string): string[] {
  return sortBy(items, [
    // Exact match first
    (item) => item.toLowerCase() !== target.toLowerCase(),
    // Then by whether it starts with the target
    (item) => !item.toLowerCase().startsWith(target.toLowerCase()),
    // Then by the index where the target appears in the item
    (item) => item.toLowerCase().indexOf(target.toLowerCase()),
    // Finally by length (shorter items first)
    (item) => item.length,
  ]);
}
