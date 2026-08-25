import dayjs, { Dayjs, getAppTimezone } from "@/utils/DayjsUtils";
import { dateDefault } from "@/components/common/constants";

/** Instant in the app timezone (`setAppTimezone` / UTC by default). */
export const toAppDayjs = (
  value?: string | number | Date | Dayjs,
  format?: string
): Dayjs => {
  if (format) {
    return dayjs.tz(value, format, getAppTimezone());
  }
  return value === undefined ? dayjs.tz() : dayjs.tz(value);
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

/** ISO instant → `Sun Aug 01 2021 00:00:00 GMT+0000` in UTC. */
export const convertDateFormat = (dateString: string): string => {
  const parsed = dayjs.utc(dateString);
  if (!parsed.isValid()) {
    return dateString;
  }
  return parsed.format("ddd MMM DD YYYY HH:mm:ss [GMT+0000]");
};

export const dateToValue = (date: Dayjs, endOfDay: boolean = false): number => {
  return endOfDay ? date.endOf("day").valueOf() : date.valueOf();
};

export const valueToDate = (value: number): Dayjs => dayjs.tz(value);

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
