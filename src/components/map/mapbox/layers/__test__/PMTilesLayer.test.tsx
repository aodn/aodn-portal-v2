import dayjs from "dayjs";
import {
  getMonthKeysInRange,
  getDayKeysInRange,
  getDateKeysInRange,
  formatDateKey,
  isCountPropertyInRange,
  buildPopupHtml,
  buildSumExpression,
} from "../PMTilesLayer";

describe("PMTilesLayer - getMonthKeysInRange", () => {
  it("returns one key per month between start and end inclusive", () => {
    const keys = getMonthKeysInRange(dayjs("2024-01-15"), dayjs("2024-04-02"));
    expect(keys).toEqual(["m202401", "m202402", "m202403", "m202404"]);
  });

  it("returns a single key when start and end are in the same month", () => {
    const keys = getMonthKeysInRange(dayjs("2024-06-01"), dayjs("2024-06-30"));
    expect(keys).toEqual(["m202406"]);
  });

  it("returns an empty array when start is after end", () => {
    const keys = getMonthKeysInRange(dayjs("2024-06-01"), dayjs("2024-01-01"));
    expect(keys).toEqual([]);
  });

  it("defaults to 2000-01 through the current month when no dates given", () => {
    const keys = getMonthKeysInRange();
    expect(keys[0]).toBe("m200001");
    expect(keys[keys.length - 1]).toBe(`m${dayjs().format("YYYYMM")}`);
  });

  it("caps the number of keys at 1200", () => {
    const keys = getMonthKeysInRange(dayjs("1800-01-01"), dayjs("2024-01-01"));
    expect(keys.length).toBe(1200);
  });
});

describe("PMTilesLayer - getDayKeysInRange", () => {
  it("returns one key per day between start and end inclusive", () => {
    const keys = getDayKeysInRange(dayjs("2024-01-30"), dayjs("2024-02-01"));
    expect(keys).toEqual(["m20240130", "m20240131", "m20240201"]);
  });

  it("returns a single key when start and end are the same day", () => {
    const keys = getDayKeysInRange(dayjs("2024-06-15"), dayjs("2024-06-15"));
    expect(keys).toEqual(["m20240615"]);
  });

  it("returns an empty array when start is after end", () => {
    const keys = getDayKeysInRange(dayjs("2024-06-01"), dayjs("2024-01-01"));
    expect(keys).toEqual([]);
  });

  it("covers multi-decade spans used by daily PMTiles (no 5000-day truncation)", () => {
    // ~15 years of daily data (typical wireless-sensor series) must fit
    const keys = getDayKeysInRange(dayjs("2008-11-01"), dayjs("2023-06-30"));
    expect(keys[0]).toBe("m20081101");
    expect(keys[keys.length - 1]).toBe("m20230630");
    expect(keys.length).toBe(
      dayjs("2023-06-30").diff(dayjs("2008-11-01"), "day") + 1
    );
  });

  it("caps the number of keys at 20000", () => {
    const keys = getDayKeysInRange(dayjs("1800-01-01"), dayjs("2024-01-01"));
    expect(keys.length).toBe(20000);
  });
});

describe("PMTilesLayer - getDateKeysInRange", () => {
  it("includes both month and day keys for the same range", () => {
    const keys = getDateKeysInRange(dayjs("2024-01-30"), dayjs("2024-02-01"));
    expect(keys).toEqual([
      "m202401",
      "m202402",
      "m20240130",
      "m20240131",
      "m20240201",
    ]);
  });

  it("returns empty when start is after end", () => {
    expect(
      getDateKeysInRange(dayjs("2024-06-01"), dayjs("2024-01-01"))
    ).toEqual([]);
  });
});

describe("PMTilesLayer - formatDateKey", () => {
  it("formats a month key for display", () => {
    expect(formatDateKey("m202401")).toBe("2024-01");
    expect(formatDateKey("m199912")).toBe("1999-12");
  });

  it("formats a day key for display", () => {
    expect(formatDateKey("m20240105")).toBe("2024-01-05");
    expect(formatDateKey("m19991207")).toBe("1999-12-07");
  });
});

describe("PMTilesLayer - isCountPropertyInRange", () => {
  const start = dayjs("2024-01-10");
  const end = dayjs("2024-01-20");

  it("includes day keys on days inside the filter", () => {
    expect(isCountPropertyInRange("m20240115", start, end)).toBe(true);
    expect(isCountPropertyInRange("m20240110", start, end)).toBe(true);
    expect(isCountPropertyInRange("m20240120", start, end)).toBe(true);
  });

  it("excludes day keys outside the filter", () => {
    expect(isCountPropertyInRange("m20240109", start, end)).toBe(false);
    expect(isCountPropertyInRange("m20240121", start, end)).toBe(false);
  });

  it("includes month keys that overlap the filter (whole-month bucket)", () => {
    expect(isCountPropertyInRange("m202401", start, end)).toBe(true);
    expect(isCountPropertyInRange("m202312", start, end)).toBe(false);
    expect(isCountPropertyInRange("m202402", start, end)).toBe(false);
  });

  it("rejects non-count property names", () => {
    expect(isCountPropertyInRange("h", start, end)).toBe(false);
    expect(isCountPropertyInRange("m2024", start, end)).toBe(false);
  });
});

describe("PMTilesLayer - buildSumExpression", () => {
  it("returns 0 for no keys", () => {
    expect(buildSumExpression([])).toBe(0);
  });

  it("returns a single coalesce expression for one key", () => {
    expect(buildSumExpression(["m20240110"])).toEqual([
      "coalesce",
      ["get", "m20240110"],
      0,
    ]);
  });

  it("returns a sum of coalesce expressions for multiple keys", () => {
    expect(buildSumExpression(["m20240120", "m20240221"])).toEqual([
      "+",
      ["coalesce", ["get", "m20240120"], 0],
      ["coalesce", ["get", "m20240221"], 0],
    ]);
  });
});

describe("PMTilesLayer - buildPopupHtml", () => {
  const filterStart = dayjs("2024-01-01");
  const filterEnd = dayjs("2024-12-31");

  it("sums monthly counts and shows the month range of non-zero counts", () => {
    const html = buildPopupHtml(
      { m202401: 5, m202403: 7, m202405: 0 },
      filterStart,
      filterEnd
    );
    expect(html).toContain("Data Records In This Area:");
    expect(html).toContain("Data Record Count: 12");
    expect(html).toContain("Time Range: 2024-01 to 2024-03");
  });

  it("sums daily counts and shows the day range of non-zero counts", () => {
    const html = buildPopupHtml(
      { m20240101: 5, m20240302: 7, m20240501: 0 },
      filterStart,
      filterEnd
    );
    expect(html).toContain("Data Records In This Area:");
    expect(html).toContain("Data Record Count: 12");
    expect(html).toContain("Time Range: 2024-01-01 to 2024-03-02");
  });

  it("ignores day keys outside the filter range and non-numeric values", () => {
    const html = buildPopupHtml(
      { m20240101: 5, m20250601: 99, m20240201: "not-a-number" },
      filterStart,
      filterEnd
    );
    expect(html).toContain("Data Record Count: 5");
    expect(html).toContain("Time Range: 2024-01-01 to 2024-01-01");
  });

  it("ignores month keys outside the filter range", () => {
    const html = buildPopupHtml(
      { m202401: 5, m202506: 99, m202402: "not-a-number" },
      filterStart,
      filterEnd
    );
    expect(html).toContain("Data Record Count: 5");
    expect(html).toContain("Time Range: 2024-01 to 2024-01");
  });

  it("shows zero count and N/A range when the hexbin has no records in range", () => {
    const html = buildPopupHtml({ m20250601: 99 }, filterStart, filterEnd);
    expect(html).toContain("Data Record Count: 0");
    expect(html).toContain("Time Range: N/A to N/A");
  });

  it("for a full month, day buckets sum to the same total as the month bucket", () => {
    const start = dayjs("2010-08-01");
    const end = dayjs("2010-08-31");
    // Synthetic equal totals for the same hex under both encodings
    const monthProps = { h: "hex1", m201008: 175196 };
    const dayProps = {
      h: "hex1",
      m20100801: 50000,
      m20100815: 75196,
      m20100831: 50000,
    };
    const monthHtml = buildPopupHtml(monthProps, start, end);
    const dayHtml = buildPopupHtml(dayProps, start, end);
    expect(monthHtml).toContain("Data Record Count: 175196");
    expect(dayHtml).toContain("Data Record Count: 175196");
  });

  it("partial-month filters count whole months on month tiles but only in-range days on day tiles", () => {
    const start = dayjs("2010-08-01");
    const end = dayjs("2010-08-15");
    const monthHtml = buildPopupHtml({ m201008: 175196 }, start, end);
    const dayHtml = buildPopupHtml(
      { m20100801: 10000, m20100815: 9120, m20100816: 50000 },
      start,
      end
    );
    // Month encoding cannot subdivide the month
    expect(monthHtml).toContain("Data Record Count: 175196");
    // Day encoding respects the day window (16th excluded)
    expect(dayHtml).toContain("Data Record Count: 19120");
  });

  it("sums all day properties on the feature even when the span exceeds the old paint key cap", () => {
    // Popup reads properties directly — not limited by getDayKeysInRange
    const props: Record<string, unknown> = {};
    let expected = 0;
    let current = dayjs("2008-11-01");
    const last = dayjs("2023-06-30");
    while (current.isBefore(last) || current.isSame(last, "day")) {
      // sparse non-zero days so the object stays small
      if (current.date() === 1) {
        props[`m${current.format("YYYYMMDD")}`] = 3;
        expected += 3;
      }
      current = current.add(1, "day");
    }
    const html = buildPopupHtml(
      props,
      dayjs("2008-11-01"),
      dayjs("2023-06-30")
    );
    expect(html).toContain(`Data Record Count: ${expected}`);
  });
});
