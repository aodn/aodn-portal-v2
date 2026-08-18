import dayjs, { Dayjs } from "dayjs";
import { extend } from "dayjs";
import utc from "dayjs/plugin/utc";
import timezone from "dayjs/plugin/timezone";
import customParseFormat from "dayjs/plugin/customParseFormat";

extend(utc);
extend(timezone);
extend(customParseFormat);

export default dayjs;
export type { Dayjs };
