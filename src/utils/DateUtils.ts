import dayjs, { Dayjs } from "@/utils/DayjsUtils";
import { dateDefault } from "@/components/common/constants";

export const convertDateFormat = (dateString: string): string => {
  const date = new Date(dateString);
  const convertedString = date.toString();
  const index = convertedString.indexOf("(");
  const dateTimeString = convertedString.substring(0, index).trim();

  // TODO: hard code using GMT+0000 for now. Change the implementation after
  //  the issue in geonetwork is resolved.
  return dateTimeString.replace(/GMT\+\d{4}/g, "GMT+0000");
};

export const dateToValue = (date: Dayjs, endOfDay: boolean = false): number => {
  return endOfDay ? date.endOf("day").valueOf() : date.valueOf();
};

export const valueToDate = (value: number): Dayjs => dayjs(value);

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
