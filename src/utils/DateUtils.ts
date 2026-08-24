// This file is only for date time related helper methods e.g comparing dates, convert timezone, etc.

import dayjs, { Dayjs } from "@/utils/DayjsUtils";
import { dateDefault } from "@/components/common/constants";

/** Anything a caller might reasonably hold a date in. */
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
 * Formats a metadata creation/revision date, which shows a time as well as a day.
 *
 * @param dateString A date string in ISO 8601 format (e.g., "2021-08-01T00:00:00.000Z")
 * @returns e.g. "01 Aug 2021 05:30 GMT+0000"
 *
 * @note The time is rendered in the local timezone but labelled GMT+0000.
 * TODO: hard code using GMT+0000 for now. Change the implementation after
 *  the issue in geonetwork is resolved.
 */
export const convertDateFormat = (dateString: string): string =>
  formatDate(dateString, dateDefault.DISPLAY_FORMAT_WITH_TIME);

// Utility function to convert a date to a numeric value
export const dateToValue = (date: Dayjs, endOfDay: boolean = false): number => {
  return endOfDay ? date.endOf("day").valueOf() : date.valueOf();
};

// Utility function to convert a numeric value back to a date
export const valueToDate = (value: number): Dayjs => dayjs(value);

/** Calendar day → YYYYMMDD integer (local calendar fields from dayjs). */
export const dayjsToDayPeriod = (d: Dayjs): number =>
  d.year() * 10000 + (d.month() + 1) * 100 + d.date();

/** Calendar month → YYYYMM integer. */
export const dayjsToMonthPeriod = (d: Dayjs): number =>
  d.year() * 100 + (d.month() + 1);

export const dayKeyToUtcValue = (key: string): number | undefined => {
  const parsed = dayjs.utc(key, dateDefault.DATE_FORMAT, true);
  return parsed.isValid() ? parsed.valueOf() : undefined;
};
