// This file is only for date time related helper methods e.g comparing dates, convert timezone, etc.

import dayjs, { Dayjs } from "@/utils/dayjs";
import { dateDefault } from "@/components/common/constants";

export type DateInput = string | number | Date | Dayjs | null | undefined;

/**
 * The single entry point for rendering a date to the user.
 *
 * Defaults to `dateDefault.DISPLAY_FORMAT` ("DD MMM YYYY"). Pass `format` only
 * when a screen genuinely needs something else — don't reach for
 * dayjs().format() at the call site, or the default stops being a default.
 *
 * @param value the date, in any of the shapes our call sites actually hold
 * @param format dayjs format string, defaults to the portal display format
 * @param fallback returned for nullish, empty or unparseable input
 *
 * @example
 * formatDate("2021-08-01T00:00:00.000Z");          // "01 Aug 2021"
 * formatDate(epochMs, dateDefault.DATE_FORMAT);    // "2021-08-01"
 * formatDate(undefined, undefined, "N/A");         // "N/A"
 */
export const formatDate = (
  value: DateInput,
  format: string = dateDefault.DISPLAY_FORMAT,
  fallback: string = ""
): string => {
  if (value === null || value === undefined || value === "") return fallback;
  const date = dayjs(value);
  return date.isValid() ? date.format(format) : fallback;
};

/**
 * Renders a date *and* its time of day, in UTC.
 *
 * Use this wherever the time of day carries meaning — an observation instant,
 * a WMS time-axis value — and formatDate() would silently throw it away.
 *
 * @example
 * formatDateTime("2021-08-01T22:00:00.000Z"); // "01 Aug 2021 22:00 UTC"
 */
export const formatDateTime = (
  value: DateInput,
  format: string = dateDefault.UTC_DATE_TIME_DISPLAY_FORMAT,
  fallback: string = ""
): string => {
  if (value === null || value === undefined || value === "") return fallback;
  const date = dayjs.utc(value);
  return date.isValid() ? date.format(format) : fallback;
};

interface FormatDateRangeOptions {
  format?: string;
  separator?: string;
  fallback?: string;
}

/**
 * Renders a pair of dates as one string, e.g. "01 Jan 2021 to 31 Dec 2021".
 * Each end falls back independently, so a half-open range still reads sensibly.
 */
export const formatDateRange = (
  start: DateInput,
  end: DateInput,
  options: FormatDateRangeOptions = {}
): string => {
  const { format, separator = " to ", fallback = "" } = options;
  return `${formatDate(start, format, fallback)}${separator}${formatDate(end, format, fallback)}`;
};

/**
 * Converts a metadata creation/revision date from ISO 8601 format to a more
 * readable format. Scoped to GeoNetwork metadata dates on purpose — the
 * GMT+0000 label below is a workaround, so don't reuse this as a general
 * "date with time" formatter. Reach for formatDateTime() instead.
 *
 * @param dateString A date string in ISO 8601 format (e.g., "2021-08-01T00:00:00.000Z")
 * @returns A string representing the date in a more readable format (e.g., "Sun 01 Aug 2021 05:30:00 GMT+0000")
 *
 * @example
 * const isoDate = "2021-08-01T00:00:00.000Z";
 * const result = formatMetadataDate(isoDate);
 * // result: "Sun 01 Aug 2021 05:30:00 GMT+0000" (actual result may vary based on local timezone)
 *
 * @note The exact output may vary depending on the local timezone of the system running the code.
 * @note An invalid or empty input returns an empty string.
 *
 * TODO: hard code using GMT+0000 for now. Change the implementation after
 *  the issue in geonetwork is resolved.
 */
export const formatMetadataDate = (dateString: DateInput): string =>
  formatDate(dateString, dateDefault.METADATA_DISPLAY_FORMAT);

export const dayjsToUnixMs = (
  date: Dayjs,
  endOfDay: boolean = false
): number => {
  return endOfDay ? date.endOf("day").valueOf() : date.valueOf();
};

/** Calendar day → YYYYMMDD integer (local calendar fields from dayjs). */
export const dayjsToDayPeriod = (d: Dayjs): number =>
  d.year() * 10000 + (d.month() + 1) * 100 + d.date();

/** Calendar month → YYYYMM integer. */
export const dayjsToMonthPeriod = (d: Dayjs): number =>
  d.year() * 100 + (d.month() + 1);

/**
 * Strict "YYYY-MM-DD" day key → Unix ms at UTC midnight, or undefined if the
 * key isn't a real calendar day. The key is read as UTC, not local time
 */
export const utcDayKeyToUnixMs = (key: string): number | undefined => {
  const parsed = dayjs.utc(key, dateDefault.DATE_FORMAT, true);
  return parsed.isValid() ? parsed.valueOf() : undefined;
};
