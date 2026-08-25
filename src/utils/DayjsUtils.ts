import dayjs, { Dayjs } from "dayjs";
import utc from "dayjs/plugin/utc";
import timezone from "dayjs/plugin/timezone";
import customParseFormat from "dayjs/plugin/customParseFormat";

dayjs.extend(utc);
dayjs.extend(timezone);
dayjs.extend(customParseFormat);

export const DEFAULT_APP_TIMEZONE = "UTC";

let appTimezone = DEFAULT_APP_TIMEZONE;

export const getAppTimezone = (): string => appTimezone;

/** Default zone for `dayjs.tz()` / `.tz()`. `dayjs()` stays host-local. */
export const setAppTimezone = (timezoneName: string): void => {
  dayjs.tz.setDefault(timezoneName);
  appTimezone = timezoneName;
};

setAppTimezone(DEFAULT_APP_TIMEZONE);

export default dayjs;
export type { Dayjs };
