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
  periodNumberToDayjs,
  parsePeriodInt,
  parsePMTilesMetadata,
  clampRangeToMetadata,
  clampPeriodsToMetadata,
  metadataRangeToDayjs,
  sumSparseCountFromProperties,
  coerceCountValue,
  buildFeatureStateTotalExpression,
  buildFeatureStateTotalIsSetExpression,
  buildFeatureStateHasCountExpression,
  buildDensityLayerFilter,
  buildPresenceFilter,
  getPlaceholderPaintProperties,
  getFeatureStatePaintProperties,
  applyHexLayerStyle,
  updateFeatureStateTotals,
  scheduleDeferredWork,
  scheduleDebouncedWork,
  scheduleChunkedWork,
  buildCountFilterRange,
  buildCountFilterRangeFromPeriods,
  isCountKeyInFilterRange,
  parseCountPropertyKey,
  createFeatureStateTotalsSession,
  featureStateSessionKey,
  getActivePmtilesLayers,
  clearInactivePmtilesFeatureState,
  PMTILE_LAYERS,
  FEATURE_STATE_TOTAL,
  DENSITY_TOTAL_CAP,
  DENSITY_COLOR_STOPS,
  DENSITY_OPACITY_STOPS,
  buildDensityInterpolateStops,
  PLACEHOLDER_FILL_COLOR,
  ZERO_COUNT_FILL_COLOR,
  ZERO_COUNT_FILL_OPACITY,
  ZERO_COUNT_OUTLINE_COLOR,
} from "../PMTilesLayer";
import {
  COUNT_KEY_SET_MAX,
  DEFAULT_TIME_GROUP_BY,
  FEATURE_STATE_CHUNK_SIZE,
  parseTimeGroupBy,
  densityStopValue,
  PMTilesMetadataRange,
  TimeGroupBy,
} from "../Common";
import { dayjsToDayPeriod, dayjsToMonthPeriod } from "@/utils/DateUtils";

/** Test helper: parsePeriodInt that throws if parse fails. */
const requirePeriodInt = (
  value: unknown,
  timeGroupBy: TimeGroupBy = TimeGroupBy.Date
) => {
  const p = parsePeriodInt(value, timeGroupBy);
  if (p === undefined) {
    throw new Error(`Expected period ${String(value)} to parse`);
  }
  return p;
};

const metaRange = (
  min: unknown,
  max: unknown,
  timeGroupBy: TimeGroupBy = TimeGroupBy.Date,
  hasTime: boolean = true
): PMTilesMetadataRange => ({
  minPeriod: requirePeriodInt(min, timeGroupBy),
  maxPeriod: requirePeriodInt(max, timeGroupBy),
  hasTime,
});

describe("PMTilesLayer - parseTimeGroupBy", () => {
  it("accepts date and month, falls back to default for anything else", () => {
    expect(parseTimeGroupBy("date")).toBe(TimeGroupBy.Date);
    expect(parseTimeGroupBy("month")).toBe(TimeGroupBy.Month);
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

  it("defaults from 1900-01 when no dates given (capped by MONTH_KEY_LIMIT)", () => {
    // Fallback only when no UI filter and no .metadata bounds (see DEFAULT_RANGE_START).
    // 1200 months from 1900-01 stops before the current month.
    const keys = getMonthKeysInRange();
    expect(keys[0]).toBe("m190001");
    expect(keys.length).toBe(1200);
    expect(keys[keys.length - 1]).toBe("m199912");
  });

  it("caps the number of keys at 1200", () => {
    const keys = getMonthKeysInRange(dayjs("1800-01-01"), dayjs("2024-01-01"));
    expect(keys.length).toBe(1200);
  });
});

describe("PMTilesLayer - getDayKeysInRange", () => {
  it("returns one key per day between start and end inclusive", () => {
    const keys = getDayKeysInRange(dayjs("2024-01-30"), dayjs("2024-02-01"));
    expect(keys).toEqual(["d20240130", "d20240131", "d20240201"]);
  });

  it("returns a single key when start and end are the same day", () => {
    const keys = getDayKeysInRange(dayjs("2024-06-15"), dayjs("2024-06-15"));
    expect(keys).toEqual(["d20240615"]);
  });

  it("returns an empty array when start is after end", () => {
    const keys = getDayKeysInRange(dayjs("2024-06-01"), dayjs("2024-01-01"));
    expect(keys).toEqual([]);
  });

  it("covers multi-decade spans used by daily PMTiles (no 5000-day truncation)", () => {
    // ~15 years of daily data (typical wireless-sensor series) must fit
    const keys = getDayKeysInRange(dayjs("2008-11-01"), dayjs("2023-06-30"));
    expect(keys[0]).toBe("d20081101");
    expect(keys[keys.length - 1]).toBe("d20230630");
    expect(keys.length).toBe(
      dayjs("2023-06-30").diff(dayjs("2008-11-01"), "day") + 1
    );
  });

  it("caps the number of keys at 20000", () => {
    const keys = getDayKeysInRange(dayjs("1800-01-01"), dayjs("2024-01-01"));
    expect(keys.length).toBe(20000);
  });
});

describe("PMTilesLayer - parsePeriodInt / periodNumberToDayjs", () => {
  it("parses day periods as integers (not unix ms)", () => {
    // Regression: dayjs(20100815) is ~1970; period keys must stay as YYYYMMDD ints
    expect(dayjs(20100815).format("YYYY-MM-DD")).toBe("1970-01-01");
    expect(parsePeriodInt(20100815, TimeGroupBy.Date)).toBe(20100815);
    expect(parsePeriodInt("20260304", TimeGroupBy.Date)).toBe(20260304);
    expect(
      periodNumberToDayjs(20100815, TimeGroupBy.Date)?.format("YYYY-MM-DD")
    ).toBe("2010-08-15");
    expect(
      periodNumberToDayjs(20100815, TimeGroupBy.Date, "end")?.format(
        "YYYY-MM-DD"
      )
    ).toBe("2010-08-15");
  });

  it("parses month periods as YYYYMM ints; Dayjs edge expands start/end of month", () => {
    expect(parsePeriodInt(201008, TimeGroupBy.Month)).toBe(201008);
    expect(
      periodNumberToDayjs(201008, TimeGroupBy.Month, "start")?.format(
        "YYYY-MM-DD"
      )
    ).toBe("2010-08-01");
    expect(
      periodNumberToDayjs(201008, TimeGroupBy.Month, "end")?.format(
        "YYYY-MM-DD"
      )
    ).toBe("2010-08-31");
  });

  it("returns undefined for missing or invalid values", () => {
    expect(parsePeriodInt(undefined, TimeGroupBy.Date)).toBeUndefined();
    expect(parsePeriodInt(NaN, TimeGroupBy.Date)).toBeUndefined();
    expect(parsePeriodInt(12, TimeGroupBy.Month)).toBeUndefined();
    expect(parsePeriodInt(20100815, TimeGroupBy.Month)).toBeUndefined(); // day int in month mode
    expect(parsePeriodInt(201008, TimeGroupBy.Date)).toBeUndefined(); // month int in date mode
    expect(periodNumberToDayjs(undefined, TimeGroupBy.Date)).toBeUndefined();
  });
});

describe("PMTilesLayer - parsePMTilesMetadata", () => {
  it("stores sidecar day periods as PeriodInt (not Dayjs / not unix ms)", () => {
    const range = parsePMTilesMetadata({
      min_date: 20080109,
      max_date: 20260304,
      time_group_by: "date",
    });
    expect(range?.minPeriod).toBe(20080109);
    expect(range?.maxPeriod).toBe(20260304);
    expect(range?.timeGroupBy).toBe(TimeGroupBy.Date);
    expect(range?.hasTime).toBe(true); // default when has_time omitted
    // UI conversion at the edge
    const dayjsRange = range
      ? metadataRangeToDayjs(range, range.timeGroupBy)
      : null;
    expect(dayjsRange?.minDate.format("YYYY-MM-DD")).toBe("2008-01-09");
    expect(dayjsRange?.maxDate.format("YYYY-MM-DD")).toBe("2026-03-04");
  });

  it("stores month metadata as YYYYMM ints", () => {
    const range = parsePMTilesMetadata({
      min_date: 201008,
      max_date: 201010,
      time_group_by: "month",
      has_time: true,
    });
    expect(range?.minPeriod).toBe(201008);
    expect(range?.maxPeriod).toBe(201010);
    expect(range?.timeGroupBy).toBe(TimeGroupBy.Month);
    expect(range?.hasTime).toBe(true);
    const dayjsRange = range
      ? metadataRangeToDayjs(range, range.timeGroupBy)
      : null;
    expect(dayjsRange?.minDate.format("YYYY-MM-DD")).toBe("2010-08-01");
    expect(dayjsRange?.maxDate.format("YYYY-MM-DD")).toBe("2010-10-31");
  });

  it("parses has_time false for synthetic timeless tiles", () => {
    const range = parsePMTilesMetadata({
      min_date: 19700101,
      max_date: 19700101,
      time_group_by: "date",
      has_time: false,
    });
    expect(range?.minPeriod).toBe(19700101);
    expect(range?.maxPeriod).toBe(19700101);
    expect(range?.hasTime).toBe(false);
  });

  it("treats real single-day archive as has_time true", () => {
    const range = parsePMTilesMetadata({
      min_date: 19700101,
      max_date: 19700101,
      time_group_by: "date",
      has_time: true,
    });
    expect(range?.hasTime).toBe(true);
  });

  it("ignores UI date filter for timeless tiles so density is not zeroed", () => {
    const bounds = {
      minPeriod: 19700101,
      maxPeriod: 19700101,
      hasTime: false as const,
    };
    // Filter entirely outside the synthetic period
    const range = buildCountFilterRange(
      dayjs("2020-01-01"),
      dayjs("2024-12-31"),
      TimeGroupBy.Date,
      { bounds }
    );
    expect(range.empty).toBe(false);
    expect(range.startPeriod).toBe(19700101);
    expect(range.endPeriod).toBe(19700101);

    const { total } = sumSparseCountFromProperties(
      { h: "cell", d19700101: 99 },
      dayjs("2020-01-01"),
      dayjs("2024-12-31"),
      TimeGroupBy.Date,
      { range }
    );
    expect(total).toBe(99);
  });

  it("still clamps real single-day tiles to the UI filter", () => {
    const bounds = {
      minPeriod: 19700101,
      maxPeriod: 19700101,
      hasTime: true as const,
    };
    const range = buildCountFilterRange(
      dayjs("2020-01-01"),
      dayjs("2024-12-31"),
      TimeGroupBy.Date,
      { bounds }
    );
    // Real 1970 day does not intersect 2020–2024
    expect(range.empty).toBe(true);
  });

  it("accepts numeric strings and rejects incomplete bounds", () => {
    expect(
      parsePMTilesMetadata({
        min_date: "20080109",
        max_date: "20260304",
        time_group_by: "date",
      })?.minPeriod
    ).toBe(20080109);
    expect(
      parsePMTilesMetadata({ min_date: 20100815, time_group_by: "date" })
    ).toBeNull();
    expect(parsePMTilesMetadata({})).toBeNull();
    expect(parsePMTilesMetadata(null)).toBeNull();
  });
});

describe("PMTilesLayer - clampPeriodsToMetadata / clampRangeToMetadata", () => {
  it("clamps period ints to metadata day coverage", () => {
    const clamped = clampPeriodsToMetadata(
      20000101,
      20301231,
      metaRange(20100815, 20100901, TimeGroupBy.Date)
    );
    expect(clamped).toEqual({
      startPeriod: 20100815,
      endPeriod: 20100901,
      empty: false,
    });
  });

  it("clamps month periods with integers only", () => {
    const clamped = clampPeriodsToMetadata(
      200001,
      203012,
      metaRange(201008, 201010, TimeGroupBy.Month)
    );
    expect(clamped.startPeriod).toBe(201008);
    expect(clamped.endPeriod).toBe(201010);
    expect(clamped.empty).toBe(false);
  });

  it("marks empty when the filter does not intersect coverage", () => {
    const clamped = clampPeriodsToMetadata(
      20200101,
      20200131,
      metaRange(20100815, 20100901, TimeGroupBy.Date)
    );
    expect(clamped.empty).toBe(true);
  });

  it("Dayjs clamp helper uses integer clamp under the hood", () => {
    const { start, end } = clampRangeToMetadata(
      dayjs("2000-01-01"),
      dayjs("2030-12-31"),
      metaRange(20100815, 20100901, TimeGroupBy.Date),
      TimeGroupBy.Date
    );
    expect(start.format("YYYY-MM-DD")).toBe("2010-08-15");
    expect(end.format("YYYY-MM-DD")).toBe("2010-09-01");
  });

  it("clamps month metadata to month boundaries via Dayjs edge", () => {
    const { start, end } = clampRangeToMetadata(
      dayjs("2000-01-01"),
      dayjs("2030-12-31"),
      metaRange(201008, 201010, TimeGroupBy.Month),
      TimeGroupBy.Month
    );
    expect(start.format("YYYY-MM-DD")).toBe("2010-08-01");
    expect(end.format("YYYY-MM-DD")).toBe("2010-10-31");
  });

  it("leaves the filter unchanged when metadata bounds are absent", () => {
    const { start, end } = clampRangeToMetadata(
      dayjs("2020-01-01"),
      dayjs("2020-01-31"),
      null,
      TimeGroupBy.Date
    );
    expect(start.format("YYYY-MM-DD")).toBe("2020-01-01");
    expect(end.format("YYYY-MM-DD")).toBe("2020-01-31");
  });

  it("uses full metadata bounds when no UI filter is provided", () => {
    const { start, end } = clampRangeToMetadata(
      undefined,
      undefined,
      metaRange(19700121, 19700121, TimeGroupBy.Date),
      TimeGroupBy.Date
    );
    expect(start.format("YYYY-MM-DD")).toBe("1970-01-21");
    expect(end.format("YYYY-MM-DD")).toBe("1970-01-21");
  });
});

describe("PMTilesLayer - getDateKeysInRange", () => {
  const start = dayjs("2024-01-30");
  const end = dayjs("2024-02-01");

  it("defaults to day keys when time_group_by is omitted", () => {
    expect(getDateKeysInRange(start, end)).toEqual([
      "d20240130",
      "d20240131",
      "d20240201",
    ]);
    expect(getDateKeysInRange(start, end, TimeGroupBy.Date)).toEqual([
      "d20240130",
      "d20240131",
      "d20240201",
    ]);
  });

  it("returns only month keys when time_group_by is month", () => {
    expect(getDateKeysInRange(start, end, TimeGroupBy.Month)).toEqual([
      "m202401",
      "m202402",
    ]);
  });

  it("returns empty when start is after end", () => {
    expect(
      getDateKeysInRange(
        dayjs("2024-06-01"),
        dayjs("2024-01-01"),
        TimeGroupBy.Month
      )
    ).toEqual([]);
    expect(
      getDateKeysInRange(
        dayjs("2024-06-01"),
        dayjs("2024-01-01"),
        TimeGroupBy.Date
      )
    ).toEqual([]);
  });

  it("clamps day keys to metadata min_date/max_date (pre-baked coverage)", () => {
    // Wide UI filter, narrow tile coverage — only expand keys that can exist
    const keys = getDateKeysInRange(
      dayjs("2000-01-01"),
      dayjs("2030-12-31"),
      TimeGroupBy.Date,
      metaRange(20100814, 20100816, TimeGroupBy.Date)
    );
    expect(keys).toEqual(["d20100814", "d20100815", "d20100816"]);
  });

  it("clamps month keys to metadata min_date/max_date", () => {
    const keys = getDateKeysInRange(
      dayjs("2000-01-01"),
      dayjs("2030-12-31"),
      TimeGroupBy.Month,
      metaRange(201008, 201010, TimeGroupBy.Month)
    );
    expect(keys).toEqual(["m201008", "m201009", "m201010"]);
  });

  it("intersects metadata clamp with a partial UI filter", () => {
    const keys = getDateKeysInRange(
      dayjs("2010-08-15"),
      dayjs("2010-08-20"),
      TimeGroupBy.Date,
      metaRange(20100801, 20100831, TimeGroupBy.Date)
    );
    expect(keys[0]).toBe("d20100815");
    expect(keys[keys.length - 1]).toBe("d20100820");
    expect(keys.length).toBe(6);
  });
});

describe("PMTilesLayer - formatDateKey", () => {
  it("formats a month key for display", () => {
    expect(formatDateKey("m202401")).toBe("2024-01");
    expect(formatDateKey("m199912")).toBe("1999-12");
  });

  it("formats a day key for display", () => {
    expect(formatDateKey("d20240105")).toBe("2024-01-05");
    expect(formatDateKey("d19991207")).toBe("1999-12-07");
  });
});

describe("PMTilesLayer - isCountPropertyInRange", () => {
  const start = dayjs("2024-01-10");
  const end = dayjs("2024-01-20");

  it("includes day keys on days inside the filter when time_group_by is date", () => {
    expect(
      isCountPropertyInRange("d20240115", start, end, TimeGroupBy.Date)
    ).toBe(true);
    expect(
      isCountPropertyInRange("d20240110", start, end, TimeGroupBy.Date)
    ).toBe(true);
    expect(
      isCountPropertyInRange("d20240120", start, end, TimeGroupBy.Date)
    ).toBe(true);
  });

  it("excludes day keys outside the filter when time_group_by is date", () => {
    expect(
      isCountPropertyInRange("d20240109", start, end, TimeGroupBy.Date)
    ).toBe(false);
    expect(
      isCountPropertyInRange("d20240121", start, end, TimeGroupBy.Date)
    ).toBe(false);
  });

  it("includes month keys that overlap the filter when time_group_by is month", () => {
    expect(
      isCountPropertyInRange("m202401", start, end, TimeGroupBy.Month)
    ).toBe(true);
    expect(
      isCountPropertyInRange("m202312", start, end, TimeGroupBy.Month)
    ).toBe(false);
    expect(
      isCountPropertyInRange("m202402", start, end, TimeGroupBy.Month)
    ).toBe(false);
  });

  it("rejects keys that do not match the active time_group_by format", () => {
    // Month tile must not sum day properties
    expect(
      isCountPropertyInRange("d20240115", start, end, TimeGroupBy.Month)
    ).toBe(false);
    // Date tile must not sum month properties
    expect(
      isCountPropertyInRange("m202401", start, end, TimeGroupBy.Date)
    ).toBe(false);
  });

  it("defaults to date grouping when time_group_by is omitted", () => {
    expect(isCountPropertyInRange("d20240115", start, end)).toBe(true);
    expect(isCountPropertyInRange("m202401", start, end)).toBe(false);
  });

  it("rejects non-count property names", () => {
    expect(isCountPropertyInRange("h", start, end, TimeGroupBy.Month)).toBe(
      false
    );
    expect(isCountPropertyInRange("m2024", start, end, TimeGroupBy.Month)).toBe(
      false
    );
  });
});

describe("PMTilesLayer - CountFilterRange (integer + key set)", () => {
  const start = dayjs("2024-01-10");
  const end = dayjs("2024-01-20");

  it("parses count keys without dayjs", () => {
    expect(parseCountPropertyKey("d20240115")).toEqual({
      isDay: true,
      period: 20240115,
    });
    expect(parseCountPropertyKey("m202401")).toEqual({
      isDay: false,
      period: 202401,
    });
    expect(parseCountPropertyKey("h")).toBeNull();
    expect(parseCountPropertyKey("m2024")).toBeNull();
    expect(parseCountPropertyKey("d202401")).toBeNull(); // d requires 8 digits
    expect(parseCountPropertyKey("m20240115")).toBeNull(); // m is month only
    expect(parseCountPropertyKey("m202401ab")).toBeNull();
  });

  it("converts dayjs to period integers", () => {
    expect(dayjsToDayPeriod(dayjs("2024-01-15"))).toBe(20240115);
    expect(dayjsToMonthPeriod(dayjs("2024-01-15"))).toBe(202401);
  });

  it("builds a day range with integer bounds; key set is opt-in", () => {
    const range = buildCountFilterRange(start, end, TimeGroupBy.Date);
    expect(range.empty).toBe(false);
    expect(range.startPeriod).toBe(20240110);
    expect(range.endPeriod).toBe(20240120);
    // Default path uses integer compares only (safer for small tiles)
    expect(range.keySet).toBeUndefined();
    expect(isCountKeyInFilterRange("d20240115", range)).toBe(true);
    expect(isCountKeyInFilterRange("d20240109", range)).toBe(false);
    expect(isCountKeyInFilterRange("m202401", range)).toBe(false);

    const withSet = buildCountFilterRange(start, end, TimeGroupBy.Date, {
      includeKeySet: true,
    });
    expect(withSet.keySet?.has("d20240115")).toBe(true);
    expect(withSet.keySet?.has("d20240109")).toBe(false);
  });

  it("builds a month range with integer bounds", () => {
    const range = buildCountFilterRange(
      dayjs("2024-01-15"),
      dayjs("2024-03-10"),
      TimeGroupBy.Month
    );
    expect(range.startPeriod).toBe(202401);
    expect(range.endPeriod).toBe(202403);
    expect(isCountKeyInFilterRange("m202402", range)).toBe(true);
    expect(isCountKeyInFilterRange("m202312", range)).toBe(false);
    expect(isCountKeyInFilterRange("d20240115", range)).toBe(false);
  });

  it("omits keySet for wide day windows above COUNT_KEY_SET_MAX", () => {
    // More than COUNT_KEY_SET_MAX days
    const wideStart = dayjs("2000-01-01");
    const wideEnd = wideStart.add(COUNT_KEY_SET_MAX + 50, "day");
    const range = buildCountFilterRange(wideStart, wideEnd, TimeGroupBy.Date);
    expect(range.keySet).toBeUndefined();
    // Integer path still works
    expect(
      isCountKeyInFilterRange(
        `d${dayjsToDayPeriod(wideStart.add(10, "day"))}`,
        range
      )
    ).toBe(true);
    expect(
      isCountKeyInFilterRange(
        `d${dayjsToDayPeriod(wideStart.subtract(1, "day"))}`,
        range
      )
    ).toBe(false);
  });

  it("marks empty ranges when start is after end", () => {
    const range = buildCountFilterRange(end, start, TimeGroupBy.Date);
    expect(range.empty).toBe(true);
    expect(isCountKeyInFilterRange("d20240115", range)).toBe(false);
  });

  it("builds ranges from period ints and clamps to metadata bounds", () => {
    const range = buildCountFilterRangeFromPeriods(
      20000101,
      20301231,
      TimeGroupBy.Date,
      { bounds: metaRange(20240110, 20240120, TimeGroupBy.Date) }
    );
    expect(range.empty).toBe(false);
    expect(range.startPeriod).toBe(20240110);
    expect(range.endPeriod).toBe(20240120);
    expect(isCountKeyInFilterRange("d20240115", range)).toBe(true);
    expect(isCountKeyInFilterRange("d20240109", range)).toBe(false);
  });

  it("uses full metadata coverage when no UI filter is set (pre-2000 single day)", () => {
    // Regression: default window started 2000-01-01, so clamping against
    // min=max=19700121 produced an empty range and no hexbins at all.
    const bounds = metaRange(19700121, 19700121, TimeGroupBy.Date);
    const range = buildCountFilterRange(
      undefined,
      undefined,
      TimeGroupBy.Date,
      {
        bounds,
      }
    );
    expect(range.empty).toBe(false);
    expect(range.startPeriod).toBe(19700121);
    expect(range.endPeriod).toBe(19700121);
    expect(isCountKeyInFilterRange("d19700121", range)).toBe(true);
    expect(isCountKeyInFilterRange("d19700122", range)).toBe(false);

    const { total } = sumSparseCountFromProperties(
      { h: "cell", d19700121: 42, d20000101: 99 },
      undefined,
      undefined,
      TimeGroupBy.Date,
      { range }
    );
    expect(total).toBe(42);
  });

  it("still empties when an explicit UI filter is entirely after metadata", () => {
    const bounds = metaRange(19700121, 19700121, TimeGroupBy.Date);
    const range = buildCountFilterRange(
      dayjs("2000-01-01"),
      dayjs("2020-01-01"),
      TimeGroupBy.Date,
      { bounds }
    );
    expect(range.empty).toBe(true);
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
      TimeGroupBy.Month
    );
    expect(html).toContain("Data Records In This Area:");
    expect(html).toContain("Data Record Count: 12");
    expect(html).toContain("Time Range: 2024-01 to 2024-03");
  });

  it("sums daily counts when time_group_by is date", () => {
    const html = buildPopupHtml(
      { d20240101: 5, d20240302: 7, d20240501: 0 },
      filterStart,
      filterEnd,
      TimeGroupBy.Date
    );
    expect(html).toContain("Data Records In This Area:");
    expect(html).toContain("Data Record Count: 12");
    expect(html).toContain("Time Range: 2024-01-01 to 2024-03-02");
  });

  it("omits Time Range on timeless (has_time false) tiles", () => {
    const range = buildCountFilterRange(
      dayjs("2020-01-01"),
      dayjs("2024-12-31"),
      TimeGroupBy.Date,
      {
        bounds: {
          minPeriod: 19700101,
          maxPeriod: 19700101,
          hasTime: false,
        },
      }
    );
    const html = buildPopupHtml(
      { d19700101: 42 },
      dayjs("2020-01-01"),
      dayjs("2024-12-31"),
      TimeGroupBy.Date,
      range,
      false
    );
    expect(html).toContain("Data Record Count: 42");
    expect(html).not.toContain("Time Range");
  });

  it("ignores day keys when time_group_by is month", () => {
    const html = buildPopupHtml(
      { m202401: 5, d20240101: 99 },
      filterStart,
      filterEnd,
      TimeGroupBy.Month
    );
    expect(html).toContain("Data Record Count: 5");
    expect(html).toContain("Time Range: 2024-01 to 2024-01");
  });

  it("ignores month keys when time_group_by is date", () => {
    const html = buildPopupHtml(
      { m202401: 99, d20240101: 5 },
      filterStart,
      filterEnd,
      TimeGroupBy.Date
    );
    expect(html).toContain("Data Record Count: 5");
    expect(html).toContain("Time Range: 2024-01-01 to 2024-01-01");
  });

  it("ignores day keys outside the filter range and non-numeric values", () => {
    const html = buildPopupHtml(
      { d20240101: 5, d20250601: 99, d20240201: "not-a-number" },
      filterStart,
      filterEnd,
      TimeGroupBy.Date
    );
    expect(html).toContain("Data Record Count: 5");
    expect(html).toContain("Time Range: 2024-01-01 to 2024-01-01");
  });

  it("ignores month keys outside the filter range", () => {
    const html = buildPopupHtml(
      { m202401: 5, m202506: 99, m202402: "not-a-number" },
      filterStart,
      filterEnd,
      TimeGroupBy.Month
    );
    expect(html).toContain("Data Record Count: 5");
    expect(html).toContain("Time Range: 2024-01 to 2024-01");
  });

  it("shows zero count and N/A range when the hexbin has no records in range", () => {
    const html = buildPopupHtml(
      { d20250601: 99 },
      filterStart,
      filterEnd,
      TimeGroupBy.Date
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
      d20100801: 50000,
      d20100815: 75196,
      d20100831: 50000,
    };
    const monthHtml = buildPopupHtml(monthProps, start, end, TimeGroupBy.Month);
    const dayHtml = buildPopupHtml(dayProps, start, end, TimeGroupBy.Date);
    expect(monthHtml).toContain("Data Record Count: 175196");
    expect(dayHtml).toContain("Data Record Count: 175196");
  });

  it("partial-month filters count whole months on month tiles but only in-range days on day tiles", () => {
    const start = dayjs("2010-08-01");
    const end = dayjs("2010-08-15");
    const monthHtml = buildPopupHtml(
      { m201008: 175196 },
      start,
      end,
      TimeGroupBy.Month
    );
    const dayHtml = buildPopupHtml(
      { d20100801: 10000, d20100815: 9120, d20100816: 50000 },
      start,
      end,
      TimeGroupBy.Date
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
        props[`d${current.format("YYYYMMDD")}`] = 3;
        expected += 3;
      }
      current = current.add(1, "day");
    }
    const html = buildPopupHtml(
      props,
      dayjs("2008-11-01"),
      dayjs("2023-06-30"),
      TimeGroupBy.Date
    );
    expect(html).toContain(`Data Record Count: ${expected}`);
  });

  it("defaults to date grouping when time_group_by is omitted", () => {
    const html = buildPopupHtml(
      { m202401: 5, d20240101: 99 },
      filterStart,
      filterEnd
    );
    expect(html).toContain("Data Record Count: 99");
  });
});

describe("PMTilesLayer - getActivePmtilesLayers", () => {
  it("returns the half-open band for interior zooms", () => {
    expect(getActivePmtilesLayers(0).map((l) => l.sourceLayer)).toEqual([
      "hex_z0",
    ]);
    expect(getActivePmtilesLayers(1.9).map((l) => l.sourceLayer)).toEqual([
      "hex_z0",
    ]);
    expect(getActivePmtilesLayers(2).map((l) => l.sourceLayer)).toEqual([
      "hex_z2",
    ]);
    expect(getActivePmtilesLayers(5).map((l) => l.sourceLayer)).toEqual([
      "hex_z4",
    ]);
    expect(getActivePmtilesLayers(8).map((l) => l.sourceLayer)).toEqual([
      "hex_z8",
    ]);
    expect(getActivePmtilesLayers(12.9).map((l) => l.sourceLayer)).toEqual([
      "hex_z10",
    ]);
  });

  it("clamps underzoom to the first band and overzoom to the last", () => {
    expect(getActivePmtilesLayers(-1).map((l) => l.sourceLayer)).toEqual([
      "hex_z0",
    ]);
    expect(getActivePmtilesLayers(13).map((l) => l.sourceLayer)).toEqual([
      "hex_z10",
    ]);
    expect(getActivePmtilesLayers(20).map((l) => l.sourceLayer)).toEqual([
      "hex_z10",
    ]);
  });

  it("covers every PMTILE_LAYERS boundary without gaps or overlap", () => {
    for (const layer of PMTILE_LAYERS) {
      expect(getActivePmtilesLayers(layer.minzoom)[0]?.sourceLayer).toBe(
        layer.sourceLayer
      );
      // Just below maxzoom still this band; at maxzoom the next band (or clamp)
      if (layer.maxzoom < 13) {
        expect(
          getActivePmtilesLayers(layer.maxzoom - 0.001)[0]?.sourceLayer
        ).toBe(layer.sourceLayer);
      }
    }
  });
});

describe("PMTilesLayer - clearInactivePmtilesFeatureState", () => {
  it("removes feature-state only for inactive source-layers", () => {
    const removeFeatureState = vi.fn();
    const map = {
      getSource: (id: string) => (id === "pmtiles-source-id" ? {} : undefined),
      removeFeatureState,
    } as unknown as Map;

    clearInactivePmtilesFeatureState(map, 5); // hex_z4 active

    const cleared = removeFeatureState.mock.calls.map(
      (call) => (call[0] as { sourceLayer: string }).sourceLayer
    );
    expect(cleared).toEqual(
      expect.arrayContaining([
        "hex_z0",
        "hex_z2",
        "hex_z6",
        "hex_z8",
        "hex_z10",
      ])
    );
    expect(cleared).not.toContain("hex_z4");
    expect(cleared).toHaveLength(PMTILE_LAYERS.length - 1);
  });

  it("no-ops when the PMTiles source is missing", () => {
    const removeFeatureState = vi.fn();
    const map = {
      getSource: () => undefined,
      removeFeatureState,
    } as unknown as Map;
    clearInactivePmtilesFeatureState(map, 5);
    expect(removeFeatureState).not.toHaveBeenCalled();
  });
});

describe("PMTilesLayer - sparse sum and feature-state", () => {
  const start = dayjs("2024-01-01");
  const end = dayjs("2024-03-31");

  it("sums only in-range day properties that exist on the feature", () => {
    const { total, matchedKeys } = sumSparseCountFromProperties(
      { h: "abc", d20240101: 5, d20240201: 7, d20240501: 99, m202401: 3 },
      start,
      end,
      TimeGroupBy.Date
    );
    expect(total).toBe(12);
    expect(matchedKeys).toEqual(["d20240101", "d20240201"]);
  });

  it("coerces string counts from vector tiles", () => {
    expect(coerceCountValue("9120")).toBe(9120);
    expect(coerceCountValue(9120)).toBe(9120);
    expect(coerceCountValue("x")).toBeNaN();
    const { total } = sumSparseCountFromProperties(
      { d20240115: "10", d20240201: "3" },
      start,
      end,
      TimeGroupBy.Date
    );
    expect(total).toBe(13);
  });

  it("returns zero when no properties match", () => {
    expect(
      sumSparseCountFromProperties(
        { h: "abc", d20250601: 1 },
        start,
        end,
        TimeGroupBy.Date
      ).total
    ).toBe(0);
    expect(
      sumSparseCountFromProperties(null, start, end, TimeGroupBy.Date).total
    ).toBe(0);
  });

  it("stops summing at maxTotal so density paint can early-exit", () => {
    const { total, matchedKeys } = sumSparseCountFromProperties(
      {
        d20240101: 6000,
        d20240102: 6000,
        d20240201: 50000,
        d20240301: 1,
      },
      start,
      end,
      TimeGroupBy.Date,
      { maxTotal: DENSITY_TOTAL_CAP, collectMatchedKeys: false }
    );
    expect(total).toBe(DENSITY_TOTAL_CAP);
    // Density path does not collect keys
    expect(matchedKeys).toEqual([]);
  });

  it("does not clamp totals below the density cap", () => {
    const { total } = sumSparseCountFromProperties(
      { d20240101: 5, d20240201: 7 },
      start,
      end,
      TimeGroupBy.Date,
      { maxTotal: DENSITY_TOTAL_CAP, collectMatchedKeys: false }
    );
    expect(total).toBe(12);
  });

  it("uses a precomputed CountFilterRange for sparse sums", () => {
    const range = buildCountFilterRange(start, end, TimeGroupBy.Date);
    const { total } = sumSparseCountFromProperties(
      { d20240115: 4, d20240601: 99 },
      undefined,
      undefined,
      TimeGroupBy.Date,
      { range, collectMatchedKeys: false }
    );
    expect(total).toBe(4);
  });

  it("infers month buckets when date mode finds no day keys (small monthly tiles)", () => {
    // Default time_group_by is date; small archives often only have mYYYYMM keys
    // until `.metadata` arrives — without inference density paints total 0.
    const withoutInfer = sumSparseCountFromProperties(
      { h: "cell", m202401: 5, m202402: 7, m202406: 99 },
      dayjs("2024-01-01"),
      dayjs("2024-03-31"),
      TimeGroupBy.Date,
      { inferTimeGroupBy: false }
    );
    expect(withoutInfer.total).toBe(0);
    expect(withoutInfer.sawOtherFormat).toBe(true);
    expect(withoutInfer.sawExpectedFormat).toBe(false);

    const { total, timeGroupBy } = sumSparseCountFromProperties(
      { h: "cell", m202401: 5, m202402: 7, m202406: 99 },
      dayjs("2024-01-01"),
      dayjs("2024-03-31"),
      TimeGroupBy.Date
    );
    expect(timeGroupBy).toBe(TimeGroupBy.Month);
    expect(total).toBe(12);
  });

  it("does not infer when expected-format keys exist but fall outside the filter", () => {
    const { total, timeGroupBy } = sumSparseCountFromProperties(
      { d20240115: 5, d20240601: 99 },
      dayjs("2024-06-01"),
      dayjs("2024-06-30"),
      TimeGroupBy.Date,
      { inferTimeGroupBy: true }
    );
    // Day keys present (expected format) but only June is in range
    expect(timeGroupBy).toBe(TimeGroupBy.Date);
    expect(total).toBe(99);
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
    const opacityJson = JSON.stringify(density["fill-opacity"]);
    const outlineJson = JSON.stringify(density["fill-outline-color"]);
    expect(colorJson).toContain("feature-state");
    expect(colorJson).not.toContain("m2024");
    // Top color stop must match the early-stop cap
    expect(colorJson).toContain(String(DENSITY_TOTAL_CAP));
    // Unset feature-state keeps placeholder so mid-load tiles do not vanish
    expect(colorJson).toContain(PLACEHOLDER_FILL_COLOR);
    expect(colorJson).toContain("case");
    // Zero-count hexes (narrow time slider) must hide fill and outline
    expect(colorJson).toContain(ZERO_COUNT_FILL_COLOR);
    expect(opacityJson).toContain(String(ZERO_COUNT_FILL_OPACITY));
    expect(outlineJson).toContain("feature-state");
    expect(outlineJson).toContain(ZERO_COUNT_OUTLINE_COLOR);
    // Default cap preserves the historical absolute breakpoints
    expect(colorJson).toContain("#1E293B");
    expect(colorJson).toContain("#14B8A6");
    for (const input of [0, 1, 10, 100, 1000, 5000, DENSITY_TOTAL_CAP]) {
      expect(colorJson).toContain(String(input));
    }
  });

  it("builds has-count expression for zero-count transparent paint", () => {
    expect(buildFeatureStateHasCountExpression()).toEqual([
      ">",
      ["coalesce", ["feature-state", FEATURE_STATE_TOTAL], 0],
      0,
    ]);
  });

  it("scales density color breakpoints with the cap", () => {
    const doubled = getFeatureStatePaintProperties(DENSITY_TOTAL_CAP * 2);
    const colorJson = JSON.stringify(doubled["fill-color"]);
    // Intermediate stops scale with the new cap (1000 → 2000 at 0.1 ratio)
    expect(colorJson).toContain(String(DENSITY_TOTAL_CAP * 2));
    expect(colorJson).toContain(
      String(Math.round(0.1 * DENSITY_TOTAL_CAP * 2))
    );
    expect(colorJson).toContain(
      String(Math.round(0.5 * DENSITY_TOTAL_CAP * 2))
    );
  });

  it("builds monotonic interpolate stops from ratios", () => {
    const pairs = buildDensityInterpolateStops(
      DENSITY_COLOR_STOPS.map(({ ratio, color }) => ({ ratio, value: color })),
      DENSITY_TOTAL_CAP
    );
    // [input, color, input, color, ...]
    expect(pairs[0]).toBe(0);
    expect(pairs[pairs.length - 2]).toBe(DENSITY_TOTAL_CAP);
    expect(pairs[pairs.length - 1]).toBe("#14B8A6");
    for (let i = 2; i < pairs.length; i += 2) {
      expect(pairs[i] as number).toBeGreaterThan(pairs[i - 2] as number);
    }
    // Opacity ratios stay monotonic too
    const opacityPairs = buildDensityInterpolateStops(
      DENSITY_OPACITY_STOPS.map(({ ratio, opacity }) => ({
        ratio,
        value: opacity,
      })),
      DENSITY_TOTAL_CAP
    );
    expect(opacityPairs).toEqual([0, 0, 1, 0.4, 100, 0.65, 1000, 0.8]);
    expect(densityStopValue(1)).toBe(DENSITY_TOTAL_CAP);
    expect(densityStopValue(0)).toBe(0);
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
            properties: { h: "cell-a", d20240115: 10, d20240601: 50 },
          },
          {
            id: "cell-b",
            properties: { h: "cell-b", d20240201: 3 },
          },
          {
            // Hot cell: true sum far above paint max — density stores the cap
            id: "cell-hot",
            properties: {
              h: "cell-hot",
              d20240101: 8000,
              d20240102: 8000,
              d20240201: 50000,
            },
          },
        ];
      },
      setFeatureState,
      getLayer: () => undefined,
      setFilter: vi.fn(),
      setPaintProperty: vi.fn(),
    } as unknown as Map;

    const { updated, complete } = updateFeatureStateTotals(
      map,
      dayjs("2024-01-01"),
      dayjs("2024-03-31"),
      TimeGroupBy.Date
    );
    // 3 features × 6 source layers queried, but only hex_z0 returns features
    // updateFeatureStateTotals loops all layers; only hex_z0 has features
    expect(updated).toBe(3);
    expect(complete).toBe(true);
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
    expect(setFeatureState).toHaveBeenCalledWith(
      {
        source: "pmtiles-source-id",
        sourceLayer: "hex_z0",
        id: "cell-hot",
      },
      { [FEATURE_STATE_TOTAL]: DENSITY_TOTAL_CAP }
    );
  });

  it("writes total 0 when a hex has no records in the time-slider window", () => {
    // After narrowing the slider to a few days, cells that only have data
    // outside that window must store total 0 so density paint can hide them.
    const setFeatureState = vi.fn();
    const map = {
      getSource: (id: string) => (id === "pmtiles-source-id" ? {} : undefined),
      querySourceFeatures: (_source: string, opts: { sourceLayer: string }) => {
        if (opts.sourceLayer !== "hex_z0") return [];
        return [
          {
            id: "in-range",
            properties: { h: "in-range", d20240115: 4 },
          },
          {
            id: "out-of-range",
            properties: { h: "out-of-range", d20240601: 99 },
          },
        ];
      },
      setFeatureState,
    } as unknown as Map;

    const { updated } = updateFeatureStateTotals(
      map,
      dayjs("2024-01-14"),
      dayjs("2024-01-16"),
      TimeGroupBy.Date
    );
    expect(updated).toBe(2);
    expect(setFeatureState).toHaveBeenCalledWith(
      {
        source: "pmtiles-source-id",
        sourceLayer: "hex_z0",
        id: "in-range",
      },
      { [FEATURE_STATE_TOTAL]: 4 }
    );
    expect(setFeatureState).toHaveBeenCalledWith(
      {
        source: "pmtiles-source-id",
        sourceLayer: "hex_z0",
        id: "out-of-range",
      },
      { [FEATURE_STATE_TOTAL]: 0 }
    );
  });

  it("skips features already written in the session (incremental)", () => {
    const setFeatureState = vi.fn();
    const features: Array<{
      id: string;
      properties: Record<string, string | number>;
    }> = [
      {
        id: "cell-a",
        properties: { h: "cell-a", d20240115: 10 },
      },
      {
        id: "cell-b",
        properties: { h: "cell-b", d20240201: 3 },
      },
    ];
    const map = {
      getSource: () => ({}),
      querySourceFeatures: (_s: string, opts: { sourceLayer: string }) =>
        opts.sourceLayer === "hex_z0" ? features : [],
      setFeatureState,
    } as unknown as Map;

    const session = createFeatureStateTotalsSession();
    const range = buildCountFilterRange(
      dayjs("2024-01-01"),
      dayjs("2024-03-31"),
      TimeGroupBy.Date
    );

    const first = updateFeatureStateTotals(
      map,
      dayjs("2024-01-01"),
      dayjs("2024-03-31"),
      TimeGroupBy.Date,
      { range, session }
    );
    expect(first.updated).toBe(2);
    expect(
      session.written.has(featureStateSessionKey("hex_z0", "cell-a"))
    ).toBe(true);

    setFeatureState.mockClear();
    const second = updateFeatureStateTotals(
      map,
      dayjs("2024-01-01"),
      dayjs("2024-03-31"),
      TimeGroupBy.Date,
      { range, session }
    );
    expect(second.updated).toBe(0);
    expect(setFeatureState).not.toHaveBeenCalled();

    // New tile feature appears
    features.push({
      id: "cell-c",
      properties: { h: "cell-c", d20240301: 7 },
    });
    const third = updateFeatureStateTotals(
      map,
      dayjs("2024-01-01"),
      dayjs("2024-03-31"),
      TimeGroupBy.Date,
      { range, session }
    );
    expect(third.updated).toBe(1);
    expect(setFeatureState).toHaveBeenCalledWith(
      {
        source: "pmtiles-source-id",
        sourceLayer: "hex_z0",
        id: "cell-c",
      },
      { [FEATURE_STATE_TOTAL]: 7 }
    );
  });

  it("chunks feature-state writes when maxFeatures is set", () => {
    const setFeatureState = vi.fn();
    const features = Array.from({ length: 5 }, (_, i) => ({
      id: `cell-${i}`,
      properties: { h: `cell-${i}`, d20240115: i + 1 },
    }));
    const map = {
      getSource: () => ({}),
      querySourceFeatures: (_s: string, opts: { sourceLayer: string }) =>
        opts.sourceLayer === "hex_z0" ? features : [],
      setFeatureState,
    } as unknown as Map;

    const session = createFeatureStateTotalsSession();
    const range = buildCountFilterRange(
      dayjs("2024-01-01"),
      dayjs("2024-03-31"),
      TimeGroupBy.Date
    );

    const chunk1 = updateFeatureStateTotals(
      map,
      undefined,
      undefined,
      TimeGroupBy.Date,
      { range, session, maxFeatures: 2 }
    );
    expect(chunk1.updated).toBe(2);
    expect(chunk1.complete).toBe(false);

    const chunk2 = updateFeatureStateTotals(
      map,
      undefined,
      undefined,
      TimeGroupBy.Date,
      { range, session, maxFeatures: 2 }
    );
    expect(chunk2.updated).toBe(2);
    expect(chunk2.complete).toBe(false);

    const chunk3 = updateFeatureStateTotals(
      map,
      undefined,
      undefined,
      TimeGroupBy.Date,
      { range, session, maxFeatures: 2 }
    );
    expect(chunk3.updated).toBe(1);
    expect(chunk3.complete).toBe(true);
    expect(setFeatureState).toHaveBeenCalledTimes(5);
    expect(FEATURE_STATE_CHUNK_SIZE).toBeGreaterThan(0);
  });

  it("only queries and writes the layers option (active zoom band)", () => {
    const setFeatureState = vi.fn();
    const querySourceFeatures = vi.fn(
      (_s: string, opts: { sourceLayer: string }) => {
        if (opts.sourceLayer === "hex_z0") {
          return [
            {
              id: "z0-cell",
              properties: { h: "z0-cell", d20240115: 10 },
            },
          ];
        }
        if (opts.sourceLayer === "hex_z4") {
          return [
            {
              id: "z4-cell",
              properties: { h: "z4-cell", d20240115: 20 },
            },
          ];
        }
        return [];
      }
    );
    const map = {
      getSource: () => ({}),
      querySourceFeatures,
      setFeatureState,
    } as unknown as Map;

    const active = getActivePmtilesLayers(5); // hex_z4
    expect(active.map((l) => l.sourceLayer)).toEqual(["hex_z4"]);

    const { updated, complete } = updateFeatureStateTotals(
      map,
      dayjs("2024-01-01"),
      dayjs("2024-03-31"),
      TimeGroupBy.Date,
      { layers: active }
    );

    expect(complete).toBe(true);
    expect(updated).toBe(1);
    expect(querySourceFeatures).toHaveBeenCalledTimes(1);
    expect(querySourceFeatures).toHaveBeenCalledWith("pmtiles-source-id", {
      sourceLayer: "hex_z4",
    });
    expect(setFeatureState).toHaveBeenCalledTimes(1);
    expect(setFeatureState).toHaveBeenCalledWith(
      {
        source: "pmtiles-source-id",
        sourceLayer: "hex_z4",
        id: "z4-cell",
      },
      { [FEATURE_STATE_TOTAL]: 20 }
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

  it("runs chunked work until the worker reports done", async () => {
    let n = 0;
    const cancel = scheduleChunkedWork(() => {
      n += 1;
      return n >= 3;
    });
    await new Promise((r) => setTimeout(r, 150));
    expect(n).toBe(3);
    cancel();
  });

  it("stops chunked work when cancelled mid-flight", async () => {
    let n = 0;
    const cancel = scheduleChunkedWork(() => {
      n += 1;
      return false;
    });
    await new Promise((r) => setTimeout(r, 30));
    cancel();
    const afterCancel = n;
    await new Promise((r) => setTimeout(r, 80));
    expect(n).toBe(afterCancel);
  });
});
