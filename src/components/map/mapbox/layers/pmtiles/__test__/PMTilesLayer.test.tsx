import dayjs from "dayjs";
import { vi } from "vitest";
import type { Map } from "mapbox-gl";
import {
  buildPopupHtml,
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
  createFeatureStateTotalsSession,
  featureStateSessionKey,
  resolvePmtilesFeatureId,
  countUnwrittenLoadedFeatures,
  getActivePmtilesLayers,
  clearInactivePmtilesFeatureState,
  addPmtilesSourceAndLayers,
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
  COUNTS_PROPERTY,
  DAYS_KEY,
  TOTAL_KEY,
  densityStopValue,
  periodNumberToDayjs,
  parsePeriodInt,
  parsePMTilesMetadata,
  clampRangeToMetadata,
  clampPeriodsToMetadata,
  metadataRangeToDayjs,
  sumSparseCountFromProperties,
  sumCountsTreeInRange,
  parseCountsTree,
  formatPeriodInt,
  coerceCountValue,
  dayjsToPeriodInt,
  daysInMonth,
  buildCountFilterRange,
  buildCountFilterRangeFromPeriods,
  PMTilesMetadataRange,
  buildPmtilesSourceUrl,
  buildPmtilesMetadataUrl,
  parquetKeyCandidates,
  probePmtilesMetadata,
} from "../Common";

/** Test helper: parsePeriodInt that throws if parse fails. */
const requirePeriodInt = (value: unknown) => {
  const p = parsePeriodInt(value);
  if (p === undefined) {
    throw new Error(`Expected period ${String(value)} to parse`);
  }
  return p;
};

const metaRange = (
  min: unknown,
  max: unknown,
  hasTime: boolean = true
): PMTilesMetadataRange => ({
  minPeriod: requirePeriodInt(min),
  maxPeriod: requirePeriodInt(max),
  hasTime,
});

/** Feature properties with nested counts tree as MVT-style JSON string. */
const countsProps = (
  tree: Record<string, unknown>,
  h: string = "cell"
): Record<string, unknown> => ({
  h,
  [COUNTS_PROPERTY]: JSON.stringify(tree),
});

/** Sample all-grain tree matching the generator encoding. */
const sampleDateTree = {
  "2012": {
    [TOTAL_KEY]: 20,
    "11": { [TOTAL_KEY]: 20, [DAYS_KEY]: { "05": 10, "06": 10 } },
  },
  "2014": {
    [TOTAL_KEY]: 2,
    "07": { [TOTAL_KEY]: 2, [DAYS_KEY]: { "01": 2 } },
  },
};

describe("PMTilesLayer - parsePeriodInt / periodNumberToDayjs", () => {
  it("parses day periods as integers (not unix ms)", () => {
    // Regression: dayjs(20100815) is ~1970; period keys must stay as YYYYMMDD ints
    expect(dayjs(20100815).format("YYYY-MM-DD")).toBe("1970-01-01");
    expect(parsePeriodInt(20100815)).toBe(20100815);
    expect(parsePeriodInt("20260304")).toBe(20260304);
    expect(periodNumberToDayjs(20100815)?.format("YYYY-MM-DD")).toBe(
      "2010-08-15"
    );
  });

  it("returns undefined for missing or invalid values", () => {
    expect(parsePeriodInt(undefined)).toBeUndefined();
    expect(parsePeriodInt(NaN)).toBeUndefined();
    expect(parsePeriodInt(12)).toBeUndefined();
    expect(parsePeriodInt(201008)).toBeUndefined(); // month int not accepted
    expect(parsePeriodInt(2010)).toBeUndefined(); // year int not accepted
    expect(periodNumberToDayjs(undefined)).toBeUndefined();
  });

  it("dayjsToPeriodInt is always YYYYMMDD", () => {
    expect(dayjsToPeriodInt(dayjs("2010-08-15"))).toBe(20100815);
  });

  it("daysInMonth handles leap years", () => {
    expect(daysInMonth(2024, 2)).toBe(29);
    expect(daysInMonth(2023, 2)).toBe(28);
    expect(daysInMonth(2024, 11)).toBe(30);
    expect(daysInMonth(2024, 12)).toBe(31);
  });
});

describe("PMTilesLayer - parsePMTilesMetadata", () => {
  it("stores sidecar day periods as PeriodInt (not Dayjs / not unix ms)", () => {
    const range = parsePMTilesMetadata({
      min_date: 20080109,
      max_date: 20260304,
      time_group_by: "all",
    });
    expect(range?.minPeriod).toBe(20080109);
    expect(range?.maxPeriod).toBe(20260304);
    expect(range?.hasTime).toBe(true);
    const dayjsRange = range ? metadataRangeToDayjs(range) : null;
    expect(dayjsRange?.minDate.format("YYYY-MM-DD")).toBe("2008-01-09");
    expect(dayjsRange?.maxDate.format("YYYY-MM-DD")).toBe("2026-03-04");
  });

  it("ignores time_group_by (always all-grain day periods)", () => {
    const range = parsePMTilesMetadata({
      min_date: 20100815,
      max_date: 20101001,
      time_group_by: "month",
    });
    // Still requires YYYYMMDD bounds regardless of time_group_by string
    expect(range?.minPeriod).toBe(20100815);
    expect(range?.maxPeriod).toBe(20101001);
  });

  it("rejects non-day period widths", () => {
    expect(
      parsePMTilesMetadata({
        min_date: 201008,
        max_date: 201010,
        time_group_by: "month",
      })
    ).toBeNull();
    expect(
      parsePMTilesMetadata({
        min_date: 2010,
        max_date: 2014,
        time_group_by: "year",
      })
    ).toBeNull();
  });

  it("parses has_time false for synthetic timeless tiles", () => {
    const range = parsePMTilesMetadata({
      min_date: 19700101,
      max_date: 19700101,
      time_group_by: "all",
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
      time_group_by: "all",
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
    const range = buildCountFilterRange(
      dayjs("2020-01-01"),
      dayjs("2024-12-31"),
      { bounds }
    );
    expect(range.empty).toBe(false);
    expect(range.startPeriod).toBe(19700101);
    expect(range.endPeriod).toBe(19700101);

    const { total } = sumSparseCountFromProperties(
      countsProps({
        "1970": {
          [TOTAL_KEY]: 99,
          "01": { [TOTAL_KEY]: 99, [DAYS_KEY]: { "01": 99 } },
        },
      }),
      dayjs("2020-01-01"),
      dayjs("2024-12-31"),
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
      { bounds }
    );
    expect(range.empty).toBe(true);
  });

  it("accepts numeric strings and rejects incomplete bounds", () => {
    expect(
      parsePMTilesMetadata({
        min_date: "20080109",
        max_date: "20260304",
        time_group_by: "all",
      })?.minPeriod
    ).toBe(20080109);
    expect(
      parsePMTilesMetadata({ min_date: 20100815, time_group_by: "all" })
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
      metaRange(20100815, 20100901)
    );
    expect(clamped).toEqual({
      startPeriod: 20100815,
      endPeriod: 20100901,
      empty: false,
    });
  });

  it("marks empty when the filter does not intersect coverage", () => {
    const clamped = clampPeriodsToMetadata(
      20200101,
      20200131,
      metaRange(20100815, 20100901)
    );
    expect(clamped.empty).toBe(true);
  });

  it("Dayjs clamp helper uses integer clamp under the hood", () => {
    const { start, end } = clampRangeToMetadata(
      dayjs("2000-01-01"),
      dayjs("2030-12-31"),
      metaRange(20100815, 20100901)
    );
    expect(start.format("YYYY-MM-DD")).toBe("2010-08-15");
    expect(end.format("YYYY-MM-DD")).toBe("2010-09-01");
  });

  it("leaves the filter unchanged when metadata bounds are absent", () => {
    const { start, end } = clampRangeToMetadata(
      dayjs("2020-01-01"),
      dayjs("2020-01-31"),
      null
    );
    expect(start.format("YYYY-MM-DD")).toBe("2020-01-01");
    expect(end.format("YYYY-MM-DD")).toBe("2020-01-31");
  });

  it("uses full metadata bounds when no UI filter is provided", () => {
    const { start, end } = clampRangeToMetadata(
      undefined,
      undefined,
      metaRange(19700121, 19700121)
    );
    expect(start.format("YYYY-MM-DD")).toBe("1970-01-21");
    expect(end.format("YYYY-MM-DD")).toBe("1970-01-21");
  });
});

describe("PMTilesLayer - formatPeriodInt", () => {
  it("formats day periods as YYYY-MM-DD", () => {
    expect(formatPeriodInt(20240115)).toBe("2024-01-15");
    expect(formatPeriodInt(19991207)).toBe("1999-12-07");
  });
});

describe("PMTilesLayer - parseCountsTree", () => {
  it("parses JSON string and accepts already-parsed objects", () => {
    const tree = sampleDateTree;
    expect(parseCountsTree(countsProps(tree))).toEqual(tree);
    expect(parseCountsTree({ h: "x", [COUNTS_PROPERTY]: tree })).toEqual(tree);
  });

  it("returns null for missing or invalid c", () => {
    expect(parseCountsTree(null)).toBeNull();
    expect(parseCountsTree({ h: "x" })).toBeNull();
    expect(parseCountsTree({ [COUNTS_PROPERTY]: "not-json" })).toBeNull();
    expect(parseCountsTree({ [COUNTS_PROPERTY]: "[]" })).toBeNull();
    expect(parseCountsTree({ [COUNTS_PROPERTY]: "null" })).toBeNull();
  });
});

describe("PMTilesLayer - buildCountFilterRange", () => {
  it("builds day periods from Dayjs window", () => {
    const range = buildCountFilterRange(
      dayjs("2024-01-10"),
      dayjs("2024-01-20")
    );
    expect(range.empty).toBe(false);
    expect(range.startPeriod).toBe(20240110);
    expect(range.endPeriod).toBe(20240120);
  });

  it("marks empty when start is after end", () => {
    const range = buildCountFilterRange(
      dayjs("2024-06-01"),
      dayjs("2024-01-01")
    );
    expect(range.empty).toBe(true);
  });

  it("uses full metadata when no UI filter is set", () => {
    const bounds = metaRange(19700121, 19700121);
    const range = buildCountFilterRange(undefined, undefined, { bounds });
    expect(range.empty).toBe(false);
    expect(range.startPeriod).toBe(19700121);
    expect(range.endPeriod).toBe(19700121);

    const { total } = sumSparseCountFromProperties(
      countsProps({
        "1970": {
          [TOTAL_KEY]: 42,
          "01": { [TOTAL_KEY]: 42, [DAYS_KEY]: { "21": 42 } },
        },
      }),
      undefined,
      undefined,
      { range }
    );
    expect(total).toBe(42);
  });

  it("still empties when an explicit UI filter is entirely after metadata", () => {
    const bounds = metaRange(19700121, 19700121);
    const range = buildCountFilterRange(
      dayjs("2000-01-01"),
      dayjs("2020-01-01"),
      { bounds }
    );
    expect(range.empty).toBe(true);
  });

  it("buildCountFilterRangeFromPeriods clamps to bounds", () => {
    const range = buildCountFilterRangeFromPeriods(20000101, 20301231, {
      bounds: metaRange(20100815, 20100901),
    });
    expect(range.startPeriod).toBe(20100815);
    expect(range.endPeriod).toBe(20100901);
  });
});

describe("PMTilesLayer - sumCountsTreeInRange (hierarchical all-grain)", () => {
  it("uses year.t for a fully covered year (fast path)", () => {
    const range = buildCountFilterRange(
      dayjs("2012-01-01"),
      dayjs("2012-12-31")
    );
    const { total } = sumCountsTreeInRange(sampleDateTree, range);
    expect(total).toBe(20);
  });

  it("sums only in-range days for a partial month", () => {
    const range = buildCountFilterRange(
      dayjs("2012-11-05"),
      dayjs("2012-11-05")
    );
    const { total, minPeriod, maxPeriod } = sumCountsTreeInRange(
      sampleDateTree,
      range,
      { collectPeriodBounds: true }
    );
    expect(total).toBe(10);
    expect(minPeriod).toBe(20121105);
    expect(maxPeriod).toBe(20121105);
  });

  it("mixes full years with partial edges", () => {
    const range = buildCountFilterRange(
      dayjs("2012-01-01"),
      dayjs("2014-07-01")
    );
    const { total } = sumCountsTreeInRange(sampleDateTree, range);
    expect(total).toBe(22);
  });

  it("sums full month.t when month is fully covered", () => {
    const tree = {
      "2024": {
        [TOTAL_KEY]: 12,
        "01": { [TOTAL_KEY]: 5, [DAYS_KEY]: { "01": 5 } },
        "03": { [TOTAL_KEY]: 7, [DAYS_KEY]: { "02": 7 } },
      },
    };
    const range = buildCountFilterRange(
      dayjs("2024-01-01"),
      dayjs("2024-03-31")
    );
    expect(sumCountsTreeInRange(tree, range).total).toBe(12);
  });
});

describe("PMTilesLayer - buildPopupHtml", () => {
  const filterStart = dayjs("2024-01-01");
  const filterEnd = dayjs("2024-12-31");

  it("sums daily counts from the nested tree", () => {
    const html = buildPopupHtml(
      countsProps({
        "2024": {
          [TOTAL_KEY]: 12,
          "01": { [TOTAL_KEY]: 5, [DAYS_KEY]: { "01": 5 } },
          "03": { [TOTAL_KEY]: 7, [DAYS_KEY]: { "02": 7 } },
        },
      }),
      filterStart,
      filterEnd
    );
    expect(html).toContain("Data Records In This Area:");
    expect(html).toContain("Data Record Count: 12");
    expect(html).toContain("Time Range: 2024-01-01 to 2024-03-02");
  });

  it("omits Time Range on timeless (has_time false) tiles", () => {
    const range = buildCountFilterRange(
      dayjs("2020-01-01"),
      dayjs("2024-12-31"),
      {
        bounds: {
          minPeriod: 19700101,
          maxPeriod: 19700101,
          hasTime: false,
        },
      }
    );
    const html = buildPopupHtml(
      countsProps({
        "1970": {
          [TOTAL_KEY]: 42,
          "01": { [TOTAL_KEY]: 42, [DAYS_KEY]: { "01": 42 } },
        },
      }),
      dayjs("2020-01-01"),
      dayjs("2024-12-31"),
      range,
      false
    );
    expect(html).toContain("Data Record Count: 42");
    expect(html).not.toContain("Time Range");
  });

  it("ignores days outside the filter range", () => {
    const html = buildPopupHtml(
      countsProps({
        "2024": {
          [TOTAL_KEY]: 5,
          "01": { [TOTAL_KEY]: 5, [DAYS_KEY]: { "01": 5 } },
        },
        "2025": {
          [TOTAL_KEY]: 99,
          "06": { [TOTAL_KEY]: 99, [DAYS_KEY]: { "01": 99 } },
        },
      }),
      filterStart,
      filterEnd
    );
    expect(html).toContain("Data Record Count: 5");
    expect(html).toContain("Time Range: 2024-01-01 to 2024-01-01");
  });

  it("shows zero count and N/A range when the density cell has no records in range", () => {
    const html = buildPopupHtml(
      countsProps({
        "2025": {
          [TOTAL_KEY]: 99,
          "06": { [TOTAL_KEY]: 99, [DAYS_KEY]: { "01": 99 } },
        },
      }),
      filterStart,
      filterEnd
    );
    expect(html).toContain("Data Record Count: 0");
    expect(html).toContain("Time Range: N/A to N/A");
  });

  it("for a full month, day tree sum matches month.t", () => {
    const start = dayjs("2010-08-01");
    const end = dayjs("2010-08-31");
    const dayHtml = buildPopupHtml(
      countsProps({
        "2010": {
          [TOTAL_KEY]: 175196,
          "08": {
            [TOTAL_KEY]: 175196,
            [DAYS_KEY]: { "01": 50000, "15": 75196, "31": 50000 },
          },
        },
      }),
      start,
      end
    );
    expect(dayHtml).toContain("Data Record Count: 175196");
  });

  it("partial-month filters only count in-range days", () => {
    const start = dayjs("2010-08-01");
    const end = dayjs("2010-08-15");
    const dayHtml = buildPopupHtml(
      countsProps({
        "2010": {
          [TOTAL_KEY]: 69120,
          "08": {
            [TOTAL_KEY]: 69120,
            [DAYS_KEY]: { "01": 10000, "15": 9120, "16": 50000 },
          },
        },
      }),
      start,
      end
    );
    expect(dayHtml).toContain("Data Record Count: 19120");
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

  it("sums only in-range days from the nested tree", () => {
    const { total, matchedKeys, minPeriod, maxPeriod } =
      sumSparseCountFromProperties(
        countsProps({
          "2024": {
            [TOTAL_KEY]: 111,
            "01": { [TOTAL_KEY]: 5, [DAYS_KEY]: { "01": 5 } },
            "02": { [TOTAL_KEY]: 7, [DAYS_KEY]: { "01": 7 } },
            "05": { [TOTAL_KEY]: 99, [DAYS_KEY]: { "01": 99 } },
          },
        }),
        start,
        end
      );
    expect(total).toBe(12);
    expect(minPeriod).toBe(20240101);
    expect(maxPeriod).toBe(20240201);
    expect(matchedKeys).toEqual(["2024-01-01", "2024-02-01"]);
  });

  it("coerces string counts from vector tiles", () => {
    expect(coerceCountValue("9120")).toBe(9120);
    expect(coerceCountValue(9120)).toBe(9120);
    expect(coerceCountValue("x")).toBeNaN();
    const { total } = sumSparseCountFromProperties(
      countsProps({
        "2024": {
          [TOTAL_KEY]: 13,
          "01": { [TOTAL_KEY]: 10, [DAYS_KEY]: { "15": "10" } },
          "02": { [TOTAL_KEY]: 3, [DAYS_KEY]: { "01": "3" } },
        },
      }),
      start,
      end
    );
    expect(total).toBe(13);
  });

  it("returns zero when no properties match or c is missing", () => {
    expect(
      sumSparseCountFromProperties(
        countsProps({
          "2025": {
            [TOTAL_KEY]: 1,
            "06": { [TOTAL_KEY]: 1, [DAYS_KEY]: { "01": 1 } },
          },
        }),
        start,
        end
      ).total
    ).toBe(0);
    expect(sumSparseCountFromProperties(null, start, end).total).toBe(0);
    expect(sumSparseCountFromProperties({ h: "abc" }, start, end).total).toBe(
      0
    );
  });

  it("stops summing at maxTotal so density paint can early-exit", () => {
    const { total, matchedKeys } = sumSparseCountFromProperties(
      countsProps({
        "2024": {
          [TOTAL_KEY]: 70001,
          "01": {
            [TOTAL_KEY]: 12000,
            [DAYS_KEY]: { "01": 6000, "02": 6000 },
          },
          "02": { [TOTAL_KEY]: 50000, [DAYS_KEY]: { "01": 50000 } },
          "03": { [TOTAL_KEY]: 1, [DAYS_KEY]: { "01": 1 } },
        },
      }),
      start,
      end,
      { maxTotal: DENSITY_TOTAL_CAP, collectMatchedKeys: false }
    );
    expect(total).toBe(DENSITY_TOTAL_CAP);
    expect(matchedKeys).toEqual([]);
  });

  it("does not clamp totals below the density cap", () => {
    const { total } = sumSparseCountFromProperties(
      countsProps({
        "2024": {
          [TOTAL_KEY]: 12,
          "01": { [TOTAL_KEY]: 5, [DAYS_KEY]: { "01": 5 } },
          "02": { [TOTAL_KEY]: 7, [DAYS_KEY]: { "01": 7 } },
        },
      }),
      start,
      end,
      { maxTotal: DENSITY_TOTAL_CAP, collectMatchedKeys: false }
    );
    expect(total).toBe(12);
  });

  it("uses a precomputed CountFilterRange for sparse sums", () => {
    const range = buildCountFilterRange(start, end);
    const { total } = sumSparseCountFromProperties(
      countsProps({
        "2024": {
          [TOTAL_KEY]: 103,
          "01": { [TOTAL_KEY]: 4, [DAYS_KEY]: { "15": 4 } },
          "06": { [TOTAL_KEY]: 99, [DAYS_KEY]: { "01": 99 } },
        },
      }),
      undefined,
      undefined,
      { range, collectMatchedKeys: false }
    );
    expect(total).toBe(4);
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
    expect(buildDensityLayerFilter()).toEqual(["has", "h"]);
    expect(JSON.stringify(buildDensityLayerFilter())).not.toContain(
      "feature-state"
    );
    expect(buildPresenceFilter()).toEqual(["has", "h"]);
    expect(typeof getPlaceholderPaintProperties()["fill-color"]).toBe("string");
    const density = getFeatureStatePaintProperties();
    const colorJson = JSON.stringify(density["fill-color"]);
    const opacityJson = JSON.stringify(density["fill-opacity"]);
    const outlineJson = JSON.stringify(density["fill-outline-color"]);
    expect(colorJson).toContain("feature-state");
    expect(colorJson).toContain(String(DENSITY_TOTAL_CAP));
    expect(colorJson).toContain(PLACEHOLDER_FILL_COLOR);
    expect(colorJson).toContain("case");
    expect(colorJson).toContain(ZERO_COUNT_FILL_COLOR);
    expect(opacityJson).toContain(String(ZERO_COUNT_FILL_OPACITY));
    expect(outlineJson).toContain("feature-state");
    expect(outlineJson).toContain(ZERO_COUNT_OUTLINE_COLOR);
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
    expect(pairs[0]).toBe(0);
    expect(pairs[pairs.length - 2]).toBe(DENSITY_TOTAL_CAP);
    expect(pairs[pairs.length - 1]).toBe("#14B8A6");
    for (let i = 2; i < pairs.length; i += 2) {
      expect(pairs[i] as number).toBeGreaterThan(pairs[i - 2] as number);
    }
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
            properties: countsProps(
              {
                "2024": {
                  [TOTAL_KEY]: 60,
                  "01": { [TOTAL_KEY]: 10, [DAYS_KEY]: { "15": 10 } },
                  "06": { [TOTAL_KEY]: 50, [DAYS_KEY]: { "01": 50 } },
                },
              },
              "cell-a"
            ),
          },
          {
            id: "cell-b",
            properties: countsProps(
              {
                "2024": {
                  [TOTAL_KEY]: 3,
                  "02": { [TOTAL_KEY]: 3, [DAYS_KEY]: { "01": 3 } },
                },
              },
              "cell-b"
            ),
          },
          {
            id: "cell-hot",
            properties: countsProps(
              {
                "2024": {
                  [TOTAL_KEY]: 66000,
                  "01": {
                    [TOTAL_KEY]: 16000,
                    [DAYS_KEY]: { "01": 8000, "02": 8000 },
                  },
                  "02": { [TOTAL_KEY]: 50000, [DAYS_KEY]: { "01": 50000 } },
                },
              },
              "cell-hot"
            ),
          },
        ];
      },
      setFeatureState,
      getLayer: () => undefined,
      setFilter: vi.fn(),
      setPaintProperty: vi.fn(),
    } as unknown as Map;

    const { updated } = updateFeatureStateTotals(
      map,
      dayjs("2024-01-01"),
      dayjs("2024-03-31")
    );
    expect(updated).toBe(3);
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
    const setFeatureState = vi.fn();
    const map = {
      getSource: (id: string) => (id === "pmtiles-source-id" ? {} : undefined),
      querySourceFeatures: (_source: string, opts: { sourceLayer: string }) => {
        if (opts.sourceLayer !== "hex_z0") return [];
        return [
          {
            id: "in-range",
            properties: countsProps(
              {
                "2024": {
                  [TOTAL_KEY]: 4,
                  "01": { [TOTAL_KEY]: 4, [DAYS_KEY]: { "15": 4 } },
                },
              },
              "in-range"
            ),
          },
          {
            id: "out-of-range",
            properties: countsProps(
              {
                "2024": {
                  [TOTAL_KEY]: 99,
                  "06": { [TOTAL_KEY]: 99, [DAYS_KEY]: { "01": 99 } },
                },
              },
              "out-of-range"
            ),
          },
        ];
      },
      setFeatureState,
    } as unknown as Map;

    const { updated } = updateFeatureStateTotals(
      map,
      dayjs("2024-01-14"),
      dayjs("2024-01-16")
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
      properties: Record<string, unknown>;
    }> = [
      {
        id: "cell-a",
        properties: countsProps(
          {
            "2024": {
              [TOTAL_KEY]: 10,
              "01": { [TOTAL_KEY]: 10, [DAYS_KEY]: { "15": 10 } },
            },
          },
          "cell-a"
        ),
      },
      {
        id: "cell-b",
        properties: countsProps(
          {
            "2024": {
              [TOTAL_KEY]: 3,
              "02": { [TOTAL_KEY]: 3, [DAYS_KEY]: { "01": 3 } },
            },
          },
          "cell-b"
        ),
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
      dayjs("2024-03-31")
    );

    const first = updateFeatureStateTotals(
      map,
      dayjs("2024-01-01"),
      dayjs("2024-03-31"),
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
      { range, session }
    );
    expect(second.updated).toBe(0);
    expect(setFeatureState).not.toHaveBeenCalled();

    features.push({
      id: "cell-c",
      properties: countsProps(
        {
          "2024": {
            [TOTAL_KEY]: 7,
            "03": { [TOTAL_KEY]: 7, [DAYS_KEY]: { "01": 7 } },
          },
        },
        "cell-c"
      ),
    });
    const third = updateFeatureStateTotals(
      map,
      dayjs("2024-01-01"),
      dayjs("2024-03-31"),
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

  it("resolves feature id from promoteId, preferring feature.id", () => {
    expect(
      resolvePmtilesFeatureId({ id: "abc", properties: { h: "other" } })
    ).toBe("abc");
    expect(resolvePmtilesFeatureId({ properties: { h: "from-prop" } })).toBe(
      "from-prop"
    );
    expect(resolvePmtilesFeatureId({ id: 0, properties: { h: "x" } })).toBe(0);
    expect(resolvePmtilesFeatureId({ properties: {} })).toBeUndefined();
  });

  it("counts loaded features that still lack session feature-state", () => {
    const features = [
      {
        id: "cell-a",
        properties: countsProps(
          {
            "2024": {
              [TOTAL_KEY]: 10,
              "01": { [TOTAL_KEY]: 10, [DAYS_KEY]: { "15": 10 } },
            },
          },
          "cell-a"
        ),
      },
      {
        id: "cell-b",
        properties: countsProps(
          {
            "2024": {
              [TOTAL_KEY]: 3,
              "02": { [TOTAL_KEY]: 3, [DAYS_KEY]: { "01": 3 } },
            },
          },
          "cell-b"
        ),
      },
      {
        id: "cell-a",
        properties: countsProps(
          {
            "2024": {
              [TOTAL_KEY]: 10,
              "01": { [TOTAL_KEY]: 10, [DAYS_KEY]: { "15": 10 } },
            },
          },
          "cell-a"
        ),
      },
    ];
    const map = {
      getSource: () => ({}),
      querySourceFeatures: (_s: string, opts: { sourceLayer: string }) =>
        opts.sourceLayer === "hex_z0" ? features : [],
    } as unknown as Map;

    const session = createFeatureStateTotalsSession();
    const layers = getActivePmtilesLayers(0);
    expect(countUnwrittenLoadedFeatures(map, session, layers)).toBe(2);

    session.written.add(featureStateSessionKey("hex_z0", "cell-a"));
    expect(countUnwrittenLoadedFeatures(map, session, layers)).toBe(1);

    session.written.add(featureStateSessionKey("hex_z0", "cell-b"));
    expect(countUnwrittenLoadedFeatures(map, session, layers)).toBe(0);
  });

  it("only queries and writes the layers option (active zoom band)", () => {
    const setFeatureState = vi.fn();
    const querySourceFeatures = vi.fn(
      (_s: string, opts: { sourceLayer: string }) => {
        if (opts.sourceLayer === "hex_z0") {
          return [
            {
              id: "z0-cell",
              properties: countsProps(
                {
                  "2024": {
                    [TOTAL_KEY]: 10,
                    "01": { [TOTAL_KEY]: 10, [DAYS_KEY]: { "15": 10 } },
                  },
                },
                "z0-cell"
              ),
            },
          ];
        }
        if (opts.sourceLayer === "hex_z4") {
          return [
            {
              id: "z4-cell",
              properties: countsProps(
                {
                  "2024": {
                    [TOTAL_KEY]: 20,
                    "01": { [TOTAL_KEY]: 20, [DAYS_KEY]: { "15": 20 } },
                  },
                },
                "z4-cell"
              ),
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

    const { updated } = updateFeatureStateTotals(
      map,
      dayjs("2024-01-01"),
      dayjs("2024-03-31"),
      { layers: active }
    );

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
});

describe("PMTilesLayer - base style restoration", () => {
  it("restores PMTiles layers as hidden while another style is selected", () => {
    const addLayer = vi.fn();
    const map = {
      getSource: vi.fn().mockReturnValue(undefined),
      addSource: vi.fn(),
      getLayer: vi.fn().mockReturnValue(undefined),
      getStyle: vi.fn().mockReturnValue({ layers: [] }),
      addLayer,
    } as unknown as Map;

    addPmtilesSourceAndLayers(map, "pmtiles://density", false);

    const restoredLayers = addLayer.mock.calls.map(([layer]) => layer);
    expect(restoredLayers).toHaveLength(PMTILE_LAYERS.length + 1);
    expect(restoredLayers).toEqual(
      expect.arrayContaining(
        PMTILE_LAYERS.map((layer) =>
          expect.objectContaining({
            id: layer.id,
            layout: expect.objectContaining({ visibility: "none" }),
          })
        )
      )
    );
    expect(restoredLayers).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          id: "pmtiles-hex-hover-outline",
          layout: expect.objectContaining({ visibility: "none" }),
        }),
      ])
    );
  });
});

describe("PMTilesLayer - URL helpers and metadata probe", () => {
  const collectionId = "collection-id";

  it("builds sibling .pmtiles and .metadata URLs", () => {
    const source = buildPmtilesSourceUrl(collectionId, "soop_ba.parquet");
    const metadata = buildPmtilesMetadataUrl(collectionId, "soop_ba.parquet");
    expect(source).toContain(
      `/portal/visualization/${collectionId}/soop_ba.parquet.pmtiles`
    );
    expect(metadata).toContain(
      `/portal/visualization/${collectionId}/soop_ba.parquet.metadata`
    );
    expect(source.replace(".pmtiles", ".metadata")).toBe(metadata);
  });

  it("puts the selected parquet key first among candidates", () => {
    expect(
      parquetKeyCandidates(["a.parquet", "b.parquet"], "b.parquet")
    ).toEqual(["b.parquet", "a.parquet"]);
    expect(parquetKeyCandidates(["a.parquet"], "zarr-only.zarr")).toEqual([
      "a.parquet",
    ]);
    expect(parquetKeyCandidates(["a.parquet"], "  ")).toEqual(["a.parquet"]);
  });

  it("treats HTTP OK as support even when JSON is malformed", async () => {
    const fetchMock = vi.fn().mockResolvedValue({
      ok: true,
      json: () => Promise.reject(new Error("not json")),
    });
    vi.stubGlobal("fetch", fetchMock);

    const result = await probePmtilesMetadata(collectionId, ["a.parquet"]);
    expect(result).toEqual({
      key: "a.parquet",
      metadataUrl: buildPmtilesMetadataUrl(collectionId, "a.parquet"),
      data: null,
    });
    vi.unstubAllGlobals();
  });

  it("walks remaining keys after 404 and skips failed fetches", async () => {
    const fetchMock = vi.fn(async (url: string) => {
      if (String(url).includes("missing.parquet")) {
        return { ok: false, status: 404, json: async () => ({}) };
      }
      return {
        ok: true,
        json: async () => ({ min_date: 20100101, max_date: 20101231 }),
      };
    });
    vi.stubGlobal("fetch", fetchMock);

    const result = await probePmtilesMetadata(collectionId, [
      "missing.parquet",
      "ok.parquet",
    ]);
    expect(result?.key).toBe("ok.parquet");
    expect(result?.data).toEqual({
      min_date: 20100101,
      max_date: 20101231,
    });
    expect(fetchMock).toHaveBeenCalledTimes(2);
    vi.unstubAllGlobals();
  });

  it("returns null when no sidecar exists so no source URL can be built", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn().mockResolvedValue({
        ok: false,
        status: 404,
        json: async () => ({}),
      })
    );

    const result = await probePmtilesMetadata(collectionId, ["gone.parquet"]);
    expect(result).toBeNull();
    expect(
      result ? buildPmtilesSourceUrl(collectionId, result.key) : undefined
    ).toBeUndefined();
    vi.unstubAllGlobals();
  });
});
