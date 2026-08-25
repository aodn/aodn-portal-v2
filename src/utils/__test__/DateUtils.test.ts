import { describe, expect, it } from "vitest";
import dayjs from "../dayjs";
import {
  formatMetadataDate,
  utcDayKeyToUnixMs,
  formatDate,
  formatDateTime,
  formatDateRange,
} from "../DateUtils";
import { dateDefault } from "@/components/common/constants";

describe("formatDate", () => {
  it("accepts an ISO string, Date, epoch number or Dayjs", () => {
    const expected = "02 Jan 2024";
    // Local-time rendering of a UTC instant is timezone-dependent — assert
    // against the same conversion path rather than a hardcoded calendar day.
    expect(formatDate("2024-01-02T00:00:00.000Z")).toBe(
      dayjs("2024-01-02T00:00:00.000Z").format(dateDefault.DISPLAY_FORMAT)
    );
    expect(formatDate(new Date(2024, 0, 2))).toBe(expected);
    expect(formatDate(dayjs("2024-01-02").valueOf())).toBe(expected);
    expect(formatDate(dayjs("2024-01-02"))).toBe(expected);
  });

  it("defaults to the portal display format", () => {
    expect(formatDate("2024-01-02")).toBe(
      dayjs("2024-01-02").format(dateDefault.DISPLAY_FORMAT)
    );
  });

  it("honours an explicit format override", () => {
    expect(formatDate("2024-01-02", dateDefault.DATE_FORMAT)).toBe(
      "2024-01-02"
    );
  });

  it("falls back rather than rendering 'Invalid Date'", () => {
    expect(formatDate(null)).toBe("");
    expect(formatDate(undefined)).toBe("");
    expect(formatDate("")).toBe("");
    expect(formatDate("not-a-date")).toBe("");
    expect(formatDate(undefined, undefined, "N/A")).toBe("N/A");
    expect(formatDate("not-a-date", undefined, "N/A")).toBe("N/A");
  });
});

describe("formatDateTime", () => {
  it("keeps the time of day that formatDate drops", () => {
    expect(formatDateTime("2021-08-01T03:30:00.000Z")).toBe(
      "01 Aug 2021 03:30 UTC"
    );
    expect(formatDate("2021-08-01T03:30:00.000Z")).toBe(
      dayjs("2021-08-01T03:30:00.000Z").format(dateDefault.DISPLAY_FORMAT)
    );
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

describe("formatDateRange", () => {
  it("joins both ends with a default separator", () => {
    expect(formatDateRange("2024-01-02", "2024-03-04")).toBe(
      "02 Jan 2024 to 04 Mar 2024"
    );
  });

  it("accepts a custom separator and format", () => {
    expect(
      formatDateRange("2024-01-02", "2024-03-04", {
        separator: " - ",
        format: dateDefault.DATE_FORMAT,
      })
    ).toBe("2024-01-02 - 2024-03-04");
  });

  it("falls back per end, so a half-open range still reads", () => {
    expect(formatDateRange("2024-01-02", undefined, { fallback: "..." })).toBe(
      "02 Jan 2024 to ..."
    );
    expect(formatDateRange(undefined, "2024-03-04", { fallback: "..." })).toBe(
      "... to 04 Mar 2024"
    );
  });
});

describe("formatMetadataDate", () => {
  it("renders a metadata date with its time, labelled GMT+0000", () => {
    // Rendered in local time but labelled GMT+0000 — see the TODO on the fn.
    const local = dayjs("2021-08-01T00:00:00.000Z");
    expect(formatMetadataDate("2021-08-01T00:00:00.000Z")).toBe(
      `${local.format("ddd DD MMM YYYY HH:mm:ss")} GMT+0000`
    );
  });

  it("returns empty for an unparseable date", () => {
    expect(formatMetadataDate("not-a-date")).toBe("");
  });
});

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
