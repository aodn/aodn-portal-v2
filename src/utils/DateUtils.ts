import dayjs, { Dayjs, getAppTimezone } from "@/utils/dayjs";
import { dateDefault } from "@/components/common/constants";

export type DateInput = string | number | Date | Dayjs | null | undefined;

/** Instant in the app timezone (`setAppTimezone` / UTC by default). */
export const toAppDayjs = (value?: DateInput, format?: string): Dayjs => {
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

/**
 * Renders a metadata creation/revision date with its time, forced to UTC and
 * labelled GMT+0000. Scoped to GeoNetwork metadata dates on purpose — don't
 * reuse this as a general "date with time" formatter, reach for
 * formatDateTime() instead.
 *
 * TODO: hard code using GMT+0000 for now. Change the implementation after
 *  the timezone issue in GeoNetwork is resolved.
 *
 * @example
 * formatMetadataDate("2021-08-01T00:00:00.000Z"); // "Sun 01 Aug 2021 00:00:00 GMT+0000"
 */
export const formatMetadataDate = (dateString: DateInput): string =>
  formatDateTime(dateString, dateDefault.METADATA_DISPLAY_FORMAT);

export const dayjsToUnixMs = (
  date: Dayjs,
  endOfDay: boolean = false
): number => {
  return endOfDay ? date.endOf("day").valueOf() : date.valueOf();
};

/** Unix ms → Dayjs in the app timezone. Inverse of {@link dayjsToUnixMs}. */
export const unixMsToAppDayjs = (value: number): Dayjs => dayjs.tz(value);

/** Live "now" in the app timezone (`dateDefault.max`). */
export const getAppMaxDate = (): Dayjs => dateDefault.max;

/** Calendar day → YYYYMMDD integer. */
export const dayjsToDayPeriod = (d: Dayjs): number =>
  d.year() * 10000 + (d.month() + 1) * 100 + d.date();

/** Calendar month → YYYYMM integer. */
export const dayjsToMonthPeriod = (d: Dayjs): number =>
  d.year() * 100 + (d.month() + 1);

/**
 * Strict "YYYY-MM-DD" day key → Unix ms at UTC midnight, or undefined if the
 * key isn't a real calendar day. The key is read as UTC, not local time.
 */
export const utcDayKeyToUnixMs = (key: string): number | undefined => {
  const parsed = dayjs.utc(key, dateDefault.DATE_FORMAT, true);
  return parsed.isValid() ? parsed.valueOf() : undefined;
};
