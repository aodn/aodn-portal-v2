import { afterEach, describe, expect, it } from "vitest";
import {
  convertDateFormat,
  dayKeyToUtcValue,
  formatUtcDateTime,
  getAppMaxDate,
  toAppDayjs,
  toUtcEndOfDay,
  toUtcStartOfDay,
  valueToDate,
} from "../DateUtils";
import { dateDefault } from "@/components/common/constants";
import dayjs, { DEFAULT_APP_TIMEZONE, setAppTimezone } from "../DayjsUtils";

describe("dayKeyToUtcValue", () => {
  it("maps a day key to UTC midnight", () => {
    const value = dayKeyToUtcValue("2024-01-02") as number;
    expect(new Date(value).toISOString()).toBe("2024-01-02T00:00:00.000Z");
  });

  it("rejects impossible dates, not just badly-shaped ones", () => {
    expect(dayKeyToUtcValue("2024-02-31")).toBeUndefined();
    expect(dayKeyToUtcValue("2023-02-29")).toBeUndefined();
    expect(dayKeyToUtcValue("2024-13-01")).toBeUndefined();
    expect(dayKeyToUtcValue("2024-00-10")).toBeUndefined();
    expect(dayKeyToUtcValue("not-a-date")).toBeUndefined();
    expect(dayKeyToUtcValue("2024-1-2")).toBeUndefined();
    // A leap day is genuinely valid.
    expect(dayKeyToUtcValue("2024-02-29")).toBeDefined();
  });

  it("rejects a shape carrying time or timezone info", () => {
    expect(dayKeyToUtcValue("2024-01-02T00:00:00Z")).toBeUndefined();
    expect(dayKeyToUtcValue("2024-01-02 ")).toBeUndefined();
  });
});

describe("convertDateFormat", () => {
  it("renders an ISO instant as UTC, not host-local wall clock", () => {
    expect(convertDateFormat("2021-08-01T00:00:00.000Z")).toBe(
      "Sun Aug 01 2021 00:00:00 GMT+0000"
    );
  });
});

describe("formatUtcDateTime", () => {
  it("formats an epoch as UTC with a literal Z", () => {
    expect(formatUtcDateTime(0)).toBe("1970-01-01T00:00:00Z");
    expect(formatUtcDateTime(Date.UTC(2024, 5, 1, 15, 30, 45))).toBe(
      "2024-06-01T15:30:45Z"
    );
  });
});

describe("getAppMaxDate", () => {
  it("returns now in the app timezone", () => {
    const now = getAppMaxDate();
    expect(now.isValid()).toBe(true);
    expect(Math.abs(now.valueOf() - Date.now())).toBeLessThan(1000);
  });
});

describe("valueToDate / toAppDayjs", () => {
  it("reads epoch ms in the app timezone (UTC by default)", () => {
    const d = valueToDate(Date.UTC(2024, 0, 2, 0, 0, 0));
    expect(d.format("Z")).toBe("+00:00");
    expect(d.format(dateDefault.DATE_FORMAT)).toBe("2024-01-02");
  });

  it("parses a date-only string as midnight in the app timezone", () => {
    const d = toAppDayjs("2024-01-02", dateDefault.DATE_FORMAT);
    expect(d.toISOString()).toBe("2024-01-02T00:00:00.000Z");
  });

  it("ignores format when value is missing", () => {
    const d = toAppDayjs(undefined, dateDefault.DATE_FORMAT);
    expect(d.isValid()).toBe(true);
    expect(Math.abs(d.valueOf() - Date.now())).toBeLessThan(1000);
  });

  it("ignores format for non-string values", () => {
    const epoch = Date.UTC(2024, 0, 2, 0, 0, 0);
    const d = toAppDayjs(epoch, dateDefault.DATE_FORMAT);
    expect(d.toISOString()).toBe("2024-01-02T00:00:00.000Z");
  });
});

describe("toUtcStartOfDay / toUtcEndOfDay", () => {
  afterEach(() => {
    setAppTimezone(DEFAULT_APP_TIMEZONE);
  });

  it("keeps the picked calendar day at UTC 00:00:00, not host midnight", () => {
    setAppTimezone("Pacific/Auckland");
    const picked = dayjs.tz(
      "1970-01-08",
      dateDefault.DATE_FORMAT,
      "Pacific/Auckland"
    );
    // Host-zone midnight is not UTC midnight (e.g. NZDT → 11:00Z).
    expect(formatUtcDateTime(picked)).not.toBe("1970-01-08T00:00:00Z");
    expect(formatUtcDateTime(toUtcStartOfDay(picked))).toBe(
      "1970-01-08T00:00:00Z"
    );
    expect(formatUtcDateTime(toUtcEndOfDay(picked))).toBe(
      "1970-01-08T23:59:59Z"
    );
  });
});
