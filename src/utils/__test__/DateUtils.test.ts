import { afterEach, describe, expect, it } from "vitest";
import {
  formatDate,
  formatDateRange,
  formatDateTime,
  formatMetadataDate,
  formatUtcDateTime,
  getAppMaxDate,
  toAppDayjs,
  toUtcEndOfDay,
  toUtcStartOfDay,
  utcDayKeyToUnixMs,
  valueToDate,
} from "../DateUtils";
import { dateDefault } from "@/components/common/constants";
import dayjs, { DEFAULT_APP_TIMEZONE, setAppTimezone } from "../dayjs";

describe("utcDayKeyToUnixMs", () => {
  it("maps a day key to UTC midnight", () => {
    const value = utcDayKeyToUnixMs("2024-01-02") as number;
    expect(new Date(value).toISOString()).toBe("2024-01-02T00:00:00.000Z");
  });

  it("rejects impossible dates, not just badly-shaped ones", () => {
    expect(utcDayKeyToUnixMs("2024-02-31")).toBeUndefined();
    expect(utcDayKeyToUnixMs("2023-02-29")).toBeUndefined();
    expect(utcDayKeyToUnixMs("2024-13-01")).toBeUndefined();
    expect(utcDayKeyToUnixMs("2024-00-10")).toBeUndefined();
    expect(utcDayKeyToUnixMs("not-a-date")).toBeUndefined();
    expect(utcDayKeyToUnixMs("2024-1-2")).toBeUndefined();
    // A leap day is genuinely valid.
    expect(utcDayKeyToUnixMs("2024-02-29")).toBeDefined();
  });

  it("rejects a shape carrying time or timezone info", () => {
    expect(utcDayKeyToUnixMs("2024-01-02T00:00:00Z")).toBeUndefined();
    expect(utcDayKeyToUnixMs("2024-01-02 ")).toBeUndefined();
  });
});

describe("formatDateTime", () => {
  it("keeps the time of day that formatDate drops", () => {
    expect(formatDateTime("2021-08-01T03:30:00.000Z")).toBe(
      "01 Aug 2021 03:30 UTC"
    );
    expect(formatDate("2021-08-01T03:30:00.000Z")).toBe("01 Aug 2021");
  });

  // The GeoServer popup feeds this raw UTC ISO strings from the WMS time axis.
  // Rendering in local time would shift the *day* either side of midnight UTC.
  it("renders in UTC regardless of the machine timezone", () => {
    expect(formatDateTime("2021-08-01T22:00:00.000Z")).toBe(
      "01 Aug 2021 22:00 UTC"
    );
    expect(formatDateTime("2021-08-01T01:00:00.000Z")).toBe(
      "01 Aug 2021 01:00 UTC"
    );
  });

  it("honours a format override and falls back on bad input", () => {
    expect(formatDateTime("2021-08-01T03:30:00.000Z", "YYYY-MM-DD HH:mm")).toBe(
      "2021-08-01 03:30"
    );
    expect(formatDateTime(null)).toBe("");
    expect(formatDateTime("not-a-date", undefined, "N/A")).toBe("N/A");
  });
});

describe("formatMetadataDate", () => {
  it("renders a metadata date with its time, forced to UTC and labelled GMT+0000", () => {
    expect(formatMetadataDate("2021-08-01T00:00:00.000Z")).toBe(
      "Sun 01 Aug 2021 00:00:00 GMT+0000"
    );
  });

  it("returns empty for nullish or unparseable input", () => {
    expect(formatMetadataDate(undefined)).toBe("");
    expect(formatMetadataDate("not-a-date")).toBe("");
  });
});

describe("formatDate", () => {
  it("formats an ISO string, a Date, an epoch number and a Dayjs the same way", () => {
    expect(formatDate("2021-08-01T00:00:00.000Z")).toBe("01 Aug 2021");
    expect(formatDate(new Date(Date.UTC(2021, 7, 1)))).toBe("01 Aug 2021");
    expect(formatDate(Date.UTC(2021, 7, 1))).toBe("01 Aug 2021");
    expect(formatDate(valueToDate(Date.UTC(2021, 7, 1)))).toBe("01 Aug 2021");
  });

  it("falls back for nullish, empty or unparseable input", () => {
    expect(formatDate(null)).toBe("");
    expect(formatDate(undefined)).toBe("");
    expect(formatDate("")).toBe("");
    expect(formatDate("not-a-date", undefined, "N/A")).toBe("N/A");
  });

  it("honours an explicit format override", () => {
    expect(
      formatDate("2021-08-01T00:00:00.000Z", dateDefault.DATE_FORMAT)
    ).toBe("2021-08-01");
  });
});

describe("formatDateRange", () => {
  it("joins both ends with the default separator", () => {
    expect(
      formatDateRange("2021-01-01T00:00:00.000Z", "2021-12-31T00:00:00.000Z")
    ).toBe("01 Jan 2021 to 31 Dec 2021");
  });

  it("supports a custom separator and independent fallback", () => {
    expect(
      formatDateRange(undefined, "2021-12-31T00:00:00.000Z", {
        separator: " - ",
        fallback: "...",
      })
    ).toBe("... - 31 Dec 2021");
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
