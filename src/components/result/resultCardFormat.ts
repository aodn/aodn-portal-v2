/**
 * Formatting helpers for result card summaries.
 */

/**
 * Formats a record count with comma thousands separators, e.g. 12345 -> "12,345".
 */
export const formatRecordCount = (count: number): string =>
  count.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");

/**
 * Shortens a card title to maxLength characters, adding an ellipsis when cut.
 */
export const shortenCardTitle = (title: string, maxLength: number): string =>
  title.length > maxLength ? `${title.slice(0, maxLength)}...` : title;

/**
 * Keeps at most maxWords whole words of a description, adding an ellipsis
 * when words were dropped, so a card never ends mid-word.
 */
export const truncateToWords = (text: string, maxWords: number): string => {
  const words = text.trim().split(/\s+/);
  return words.length > maxWords
    ? `${words.slice(0, maxWords).join(" ")}…`
    : text.trim();
};

/**
 * Formats a 0–1 fraction as a whole-number percentage, e.g. 0.256 -> "26%".
 */
export const formatCoveragePercent = (fraction: number): string =>
  `${Math.round(Math.min(Math.max(fraction, 0), 1) * 100)}%`;
