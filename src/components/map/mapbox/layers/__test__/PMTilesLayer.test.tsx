import dayjs from "dayjs";
import { vi } from "vitest";
import type { Map } from "mapbox-gl";
import {
  getMonthKeysInRange,
  getDayKeysInRange,
  getDateKeysInRange,
  formatDateKey,
  isCountPropertyInRange,
  buildPopupHtml,
  buildSumExpression,
  parseTimeGroupBy,
  periodNumberToDayjs,
  clampRangeToMetadata,
  sumSparseCountFromProperties,
  coerceCountValue,
  buildFeatureStateTotalExpression,
  buildFeatureStateTotalIsSetExpression,
  buildDensityLayerFilter,
  buildPresenceFilter,
  getPlaceholderPaintProperties,
  getFeatureStatePaintProperties,
  applyHexLayerStyle,
  updateFeatureStateTotals,
  scheduleDeferredWork,
  scheduleDebouncedWork,
  FEATURE_STATE_TOTAL,
  PLACEHOLDER_FILL_COLOR,
  DEFAULT_TIME_GROUP_BY,
} from "../PMTilesLayer";

describe("PMTilesLayer - parseTimeGroupBy", () => {
  it("accepts date and month, falls back to default for anything else", () => {
    expect(parseTimeGroupBy("date")).toBe("date");
    expect(parseTimeGroupBy("month")).toBe("month");
    expect(parseTimeGroupBy(undefined)).toBe(DEFAULT_TIME_GROUP_BY);
    expect(parseTimeGroupBy("week")).toBe(DEFAULT_TIME_GROUP_BY);
    expect(parseTimeGroupBy(null)).toBe(DEFAULT_TIME_GROUP_BY);
  });
});

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

describe("PMTilesLayer - periodNumberToDayjs", () => {
  it("parses day periods as calendar days", () => {
    expect(periodNumberToDayjs(20100815, "date")?.format("YYYY-MM-DD")).toBe(
      "2010-08-15"
    );
    expect(
      periodNumberToDayjs(20100815, "date", "end")?.format("YYYY-MM-DD")
    ).toBe("2010-08-15");
  });

  it("parses month periods as month start/end", () => {
    expect(
      periodNumberToDayjs(201008, "month", "start")?.format("YYYY-MM-DD")
    ).toBe("2010-08-01");
    expect(
      periodNumberToDayjs(201008, "month", "end")?.format("YYYY-MM-DD")
    ).toBe("2010-08-31");
  });

  it("returns undefined for missing or invalid values", () => {
    expect(periodNumberToDayjs(undefined, "date")).toBeUndefined();
    expect(periodNumberToDayjs(NaN, "date")).toBeUndefined();
    expect(periodNumberToDayjs(12, "month")).toBeUndefined();
  });
});

describe("PMTilesLayer - clampRangeToMetadata", () => {
  it("clamps the UI filter to metadata day coverage", () => {
    const { start, end } = clampRangeToMetadata(
      dayjs("2000-01-01"),
      dayjs("2030-12-31"),
      { minDate: 20100815, maxDate: 20100901 },
      "date"
    );
    expect(start.format("YYYY-MM-DD")).toBe("2010-08-15");
    expect(end.format("YYYY-MM-DD")).toBe("2010-09-01");
  });

  it("clamps month metadata to month boundaries", () => {
    const { start, end } = clampRangeToMetadata(
      dayjs("2000-01-01"),
      dayjs("2030-12-31"),
      { minDate: 201008, maxDate: 201010 },
      "month"
    );
    expect(start.format("YYYY-MM-DD")).toBe("2010-08-01");
    expect(end.format("YYYY-MM-DD")).toBe("2010-10-31");
  });

  it("leaves the filter unchanged when metadata bounds are absent", () => {
    const { start, end } = clampRangeToMetadata(
      dayjs("2020-01-01"),
      dayjs("2020-01-31"),
      {},
      "date"
    );
    expect(start.format("YYYY-MM-DD")).toBe("2020-01-01");
    expect(end.format("YYYY-MM-DD")).toBe("2020-01-31");
  });
});

describe("PMTilesLayer - getDateKeysInRange", () => {
  const start = dayjs("2024-01-30");
  const end = dayjs("2024-02-01");

  it("defaults to day keys when time_group_by is omitted", () => {
    expect(getDateKeysInRange(start, end)).toEqual([
      "m20240130",
      "m20240131",
      "m20240201",
    ]);
    expect(getDateKeysInRange(start, end, "date")).toEqual([
      "m20240130",
      "m20240131",
      "m20240201",
    ]);
  });

  it("returns only month keys when time_group_by is month", () => {
    expect(getDateKeysInRange(start, end, "month")).toEqual([
      "m202401",
      "m202402",
    ]);
  });

  it("returns empty when start is after end", () => {
    expect(
      getDateKeysInRange(dayjs("2024-06-01"), dayjs("2024-01-01"), "month")
    ).toEqual([]);
    expect(
      getDateKeysInRange(dayjs("2024-06-01"), dayjs("2024-01-01"), "date")
    ).toEqual([]);
  });

  it("clamps day keys to metadata min_date/max_date (pre-baked coverage)", () => {
    // Wide UI filter, narrow tile coverage — only expand keys that can exist
    const keys = getDateKeysInRange(
      dayjs("2000-01-01"),
      dayjs("2030-12-31"),
      "date",
      { minDate: 20100814, maxDate: 20100816 }
    );
    expect(keys).toEqual(["m20100814", "m20100815", "m20100816"]);
  });

  it("clamps month keys to metadata min_date/max_date", () => {
    const keys = getDateKeysInRange(
      dayjs("2000-01-01"),
      dayjs("2030-12-31"),
      "month",
      { minDate: 201008, maxDate: 201010 }
    );
    expect(keys).toEqual(["m201008", "m201009", "m201010"]);
  });

  it("intersects metadata clamp with a partial UI filter", () => {
    const keys = getDateKeysInRange(
      dayjs("2010-08-15"),
      dayjs("2010-08-20"),
      "date",
      { minDate: 20100801, maxDate: 20100831 }
    );
    expect(keys[0]).toBe("m20100815");
    expect(keys[keys.length - 1]).toBe("m20100820");
    expect(keys.length).toBe(6);
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

  it("includes day keys on days inside the filter when time_group_by is date", () => {
    expect(isCountPropertyInRange("m20240115", start, end, "date")).toBe(true);
    expect(isCountPropertyInRange("m20240110", start, end, "date")).toBe(true);
    expect(isCountPropertyInRange("m20240120", start, end, "date")).toBe(true);
  });

  it("excludes day keys outside the filter when time_group_by is date", () => {
    expect(isCountPropertyInRange("m20240109", start, end, "date")).toBe(false);
    expect(isCountPropertyInRange("m20240121", start, end, "date")).toBe(false);
  });

  it("includes month keys that overlap the filter when time_group_by is month", () => {
    expect(isCountPropertyInRange("m202401", start, end, "month")).toBe(true);
    expect(isCountPropertyInRange("m202312", start, end, "month")).toBe(false);
    expect(isCountPropertyInRange("m202402", start, end, "month")).toBe(false);
  });

  it("rejects keys that do not match the active time_group_by format", () => {
    // Month tile must not sum day properties
    expect(isCountPropertyInRange("m20240115", start, end, "month")).toBe(
      false
    );
    // Date tile must not sum month properties
    expect(isCountPropertyInRange("m202401", start, end, "date")).toBe(false);
  });

  it("defaults to date grouping when time_group_by is omitted", () => {
    expect(isCountPropertyInRange("m20240115", start, end)).toBe(true);
    expect(isCountPropertyInRange("m202401", start, end)).toBe(false);
  });

  it("rejects non-count property names", () => {
    expect(isCountPropertyInRange("h", start, end, "month")).toBe(false);
    expect(isCountPropertyInRange("m2024", start, end, "month")).toBe(false);
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

  it("sums monthly counts when time_group_by is month", () => {
    const html = buildPopupHtml(
      { m202401: 5, m202403: 7, m202405: 0 },
      filterStart,
      filterEnd,
      "month"
    );
    expect(html).toContain("Data Records In This Area:");
    expect(html).toContain("Data Record Count: 12");
    expect(html).toContain("Time Range: 2024-01 to 2024-03");
  });

  it("sums daily counts when time_group_by is date", () => {
    const html = buildPopupHtml(
      { m20240101: 5, m20240302: 7, m20240501: 0 },
      filterStart,
      filterEnd,
      "date"
    );
    expect(html).toContain("Data Records In This Area:");
    expect(html).toContain("Data Record Count: 12");
    expect(html).toContain("Time Range: 2024-01-01 to 2024-03-02");
  });

  it("ignores day keys when time_group_by is month", () => {
    const html = buildPopupHtml(
      { m202401: 5, m20240101: 99 },
      filterStart,
      filterEnd,
      "month"
    );
    expect(html).toContain("Data Record Count: 5");
    expect(html).toContain("Time Range: 2024-01 to 2024-01");
  });

  it("ignores month keys when time_group_by is date", () => {
    const html = buildPopupHtml(
      { m202401: 99, m20240101: 5 },
      filterStart,
      filterEnd,
      "date"
    );
    expect(html).toContain("Data Record Count: 5");
    expect(html).toContain("Time Range: 2024-01-01 to 2024-01-01");
  });

  it("ignores day keys outside the filter range and non-numeric values", () => {
    const html = buildPopupHtml(
      { m20240101: 5, m20250601: 99, m20240201: "not-a-number" },
      filterStart,
      filterEnd,
      "date"
    );
    expect(html).toContain("Data Record Count: 5");
    expect(html).toContain("Time Range: 2024-01-01 to 2024-01-01");
  });

  it("ignores month keys outside the filter range", () => {
    const html = buildPopupHtml(
      { m202401: 5, m202506: 99, m202402: "not-a-number" },
      filterStart,
      filterEnd,
      "month"
    );
    expect(html).toContain("Data Record Count: 5");
    expect(html).toContain("Time Range: 2024-01 to 2024-01");
  });

  it("shows zero count and N/A range when the hexbin has no records in range", () => {
    const html = buildPopupHtml(
      { m20250601: 99 },
      filterStart,
      filterEnd,
      "date"
    );
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
    const monthHtml = buildPopupHtml(monthProps, start, end, "month");
    const dayHtml = buildPopupHtml(dayProps, start, end, "date");
    expect(monthHtml).toContain("Data Record Count: 175196");
    expect(dayHtml).toContain("Data Record Count: 175196");
  });

  it("partial-month filters count whole months on month tiles but only in-range days on day tiles", () => {
    const start = dayjs("2010-08-01");
    const end = dayjs("2010-08-15");
    const monthHtml = buildPopupHtml({ m201008: 175196 }, start, end, "month");
    const dayHtml = buildPopupHtml(
      { m20100801: 10000, m20100815: 9120, m20100816: 50000 },
      start,
      end,
      "date"
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
      dayjs("2023-06-30"),
      "date"
    );
    expect(html).toContain(`Data Record Count: ${expected}`);
  });

  it("defaults to date grouping when time_group_by is omitted", () => {
    const html = buildPopupHtml(
      { m202401: 5, m20240101: 99 },
      filterStart,
      filterEnd
    );
    expect(html).toContain("Data Record Count: 99");
  });
});

describe("PMTilesLayer - sparse sum and feature-state", () => {
  const start = dayjs("2024-01-01");
  const end = dayjs("2024-03-31");

  it("sums only in-range m* properties that exist on the feature", () => {
    const { total, matchedKeys } = sumSparseCountFromProperties(
      { h: "abc", m20240101: 5, m20240201: 7, m20240501: 99, m202401: 3 },
      start,
      end,
      "date"
    );
    expect(total).toBe(12);
    expect(matchedKeys).toEqual(["m20240101", "m20240201"]);
  });

  it("coerces string counts from vector tiles", () => {
    expect(coerceCountValue("9120")).toBe(9120);
    expect(coerceCountValue(9120)).toBe(9120);
    expect(coerceCountValue("x")).toBeNaN();
    const { total } = sumSparseCountFromProperties(
      { m20240115: "10", m20240201: "3" },
      start,
      end,
      "date"
    );
    expect(total).toBe(13);
  });

  it("returns zero when no properties match", () => {
    expect(
      sumSparseCountFromProperties(
        { h: "abc", m20250601: 1 },
        start,
        end,
        "date"
      ).total
    ).toBe(0);
    expect(sumSparseCountFromProperties(null, start, end, "date").total).toBe(
      0
    );
  });

  it("builds feature-state paint; layer filter does not use feature-state", () => {
    expect(buildFeatureStateTotalExpression()).toEqual([
      "coalesce",
      ["feature-state", FEATURE_STATE_TOTAL],
      0,
    ]);
    expect(buildFeatureStateTotalIsSetExpression()).toEqual([
      "!=",
      ["feature-state", FEATURE_STATE_TOTAL],
      null,
    ]);
    // feature-state is illegal in filters — density uses presence only
    expect(buildDensityLayerFilter()).toEqual(["has", "h"]);
    expect(JSON.stringify(buildDensityLayerFilter())).not.toContain(
      "feature-state"
    );
    expect(buildPresenceFilter()).toEqual(["has", "h"]);
    expect(typeof getPlaceholderPaintProperties()["fill-color"]).toBe("string");
    // Density paint must reference feature-state, not a dense + of day keys
    const density = getFeatureStatePaintProperties();
    const colorJson = JSON.stringify(density["fill-color"]);
    expect(colorJson).toContain("feature-state");
    expect(colorJson).not.toContain("m2024");
    // Unset feature-state keeps placeholder so mid-load tiles do not vanish
    expect(colorJson).toContain(PLACEHOLDER_FILL_COLOR);
    expect(colorJson).toContain("case");
  });

  it("writes sparse totals via setFeatureState for loaded features", () => {
    const setFeatureState = vi.fn();
    const map = {
      getSource: (id: string) => (id === "pmtiles-source-id" ? {} : undefined),
      querySourceFeatures: (_source: string, opts: { sourceLayer: string }) => {
        if (opts.sourceLayer !== "hex_z0") return [];
        return [
          {
            id: "cell-a",
            properties: { h: "cell-a", m20240115: 10, m20240601: 50 },
          },
          {
            id: "cell-b",
            properties: { h: "cell-b", m20240201: 3 },
          },
        ];
      },
      setFeatureState,
      getLayer: () => undefined,
      setFilter: vi.fn(),
      setPaintProperty: vi.fn(),
    } as unknown as Map;

    const updated = updateFeatureStateTotals(
      map,
      dayjs("2024-01-01"),
      dayjs("2024-03-31"),
      "date"
    );
    // 2 features × 6 source layers queried, but only hex_z0 returns features
    // updateFeatureStateTotals loops all layers; only hex_z0 has features
    expect(updated).toBe(2);
    expect(setFeatureState).toHaveBeenCalledWith(
      {
        source: "pmtiles-source-id",
        sourceLayer: "hex_z0",
        id: "cell-a",
      },
      { [FEATURE_STATE_TOTAL]: 10 }
    );
    expect(setFeatureState).toHaveBeenCalledWith(
      {
        source: "pmtiles-source-id",
        sourceLayer: "hex_z0",
        id: "cell-b",
      },
      { [FEATURE_STATE_TOTAL]: 3 }
    );
  });

  it("applies filter and paint to existing hex layers only", () => {
    const setFilter = vi.fn();
    const setPaintProperty = vi.fn();
    const map = {
      getLayer: (id: string) =>
        id === "pmtiles-hex-z0" || id === "pmtiles-hex-z2" ? {} : undefined,
      setFilter,
      setPaintProperty,
    } as unknown as Map;
    applyHexLayerStyle(
      map,
      buildDensityLayerFilter(),
      getFeatureStatePaintProperties()
    );
    expect(setFilter).toHaveBeenCalledTimes(2);
    expect(setPaintProperty).toHaveBeenCalledTimes(6);
  });

  it("runs deferred work and supports cancellation", async () => {
    const work = vi.fn();
    const cancel = scheduleDeferredWork(work);
    cancel();
    await new Promise((r) => setTimeout(r, 30));
    expect(work).not.toHaveBeenCalled();

    const work2 = vi.fn();
    scheduleDeferredWork(work2);
    await new Promise((r) => setTimeout(r, 50));
    expect(work2).toHaveBeenCalledTimes(1);
  });

  it("debounces work so tile storms collapse to one pass", async () => {
    const work = vi.fn();
    const cancel1 = scheduleDebouncedWork(work, 40);
    cancel1();
    scheduleDebouncedWork(work, 40);
    await new Promise((r) => setTimeout(r, 20));
    expect(work).not.toHaveBeenCalled();
    await new Promise((r) => setTimeout(r, 40));
    expect(work).toHaveBeenCalledTimes(1);
  });
});
