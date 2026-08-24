import dayjs, { Dayjs } from "dayjs";
import { extend } from "dayjs";
import utc from "dayjs/plugin/utc";
import timezone from "dayjs/plugin/timezone";
import customParseFormat from "dayjs/plugin/customParseFormat";

// Initialising plugins in App.tsx is too late for dependencies that use Day.js
// during module evaluation, and consumers such as unit tests may bypass App entirely.
extend(utc);
extend(timezone);
extend(customParseFormat);

export default dayjs;
export type { Dayjs };
