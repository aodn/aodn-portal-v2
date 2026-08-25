import dayjs, { Dayjs, getAppTimezone } from "@/utils/dayjs";
import { dateDefault } from "@/components/common/constants";

export type DateInput = string | number | Date | Dayjs | null | undefined;

/** Instant in the app timezone (`setAppTimezone` / UTC by default). */
export const toAppDayjs = (
  value?: string | number | Date | Dayjs,
  format?: string
): Dayjs => {
  if (value === undefined) {
    return dayjs.tz();
  }
  if (format && typeof value === "string") {
    return dayjs.tz(value, format, getAppTimezone());
  }
  return dayjs.tz(value);
};

/**
 * The single entry point for rendering a date to the user.
 *
 * Defaults to `dateDefault.DISPLAY_FORMAT` ("DD MMM YYYY"). Pass `format`
 * only when a screen genuinely needs something else — don't reach for
 * `.format()` at the call site, or the default stops being a default.
 *
 * @example
 * formatDate("2021-08-01T00:00:00.000Z");        // "01 Aug 2021"
 * formatDate(undefined, undefined, "N/A");        // "N/A"
 */
export const formatDate = (
  value: DateInput,
  format: string = dateDefault.DISPLAY_FORMAT,
  fallback: string = ""
): string => {
  if (value === null || value === undefined || value === "") return fallback;
  try {
    const d = dayjs.isDayjs(value) ? value : toAppDayjs(value);
    return d.isValid() ? d.format(format) : fallback;
  } catch {
    // dayjs.tz() throws (rather than returning an invalid Dayjs) on a
    // genuinely unparseable string — formatDate must tolerate that too.
    return fallback;
  }
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

/** Calendar Y-M-D of `date` as UTC midnight (date-only pickers). */
export const toUtcStartOfDay = (date: Dayjs): Dayjs =>
  dayjs.utc(date.format(dateDefault.DATE_FORMAT)).startOf("day");

/** Calendar Y-M-D of `date` as UTC 23:59:59.999. */
export const toUtcEndOfDay = (date: Dayjs): Dayjs =>
  toUtcStartOfDay(date).hour(23).minute(59).second(59).millisecond(999);

/** CQL / WMS datetimes: UTC wall clock plus a literal Z. */
export const formatUtcDateTime = (
  value: string | number | Date | Dayjs
): string => dayjs.utc(value).format(dateDefault.DATE_TIME_FORMAT);

/** ISO instant → `01 Aug 2021 00:00:00 GMT+0000` in UTC. */
export const convertDateFormat = (dateString: string): string => {
  const parsed = dayjs.utc(dateString);
  if (!parsed.isValid()) {
    return dateString;
  }
  return parsed.format(dateDefault.DISPLAY_FORMAT_WITH_TIME);
};

export const dateToValue = (date: Dayjs, endOfDay: boolean = false): number => {
  return endOfDay ? date.endOf("day").valueOf() : date.valueOf();
};

export const valueToDate = (value: number): Dayjs => dayjs.tz(value);

/** Live "now" in the app timezone (`dateDefault.max`). */
export const getAppMaxDate = (): Dayjs => dateDefault.max;

/** Calendar day → YYYYMMDD integer. */
export const dayjsToDayPeriod = (d: Dayjs): number =>
  d.year() * 10000 + (d.month() + 1) * 100 + d.date();

/** Calendar month → YYYYMM integer. */
export const dayjsToMonthPeriod = (d: Dayjs): number =>
  d.year() * 100 + (d.month() + 1);

export const dayKeyToUtcValue = (key: string): number | undefined => {
  const parsed = dayjs.utc(key, dateDefault.DATE_FORMAT, true);
  return parsed.isValid() ? parsed.valueOf() : undefined;
};
