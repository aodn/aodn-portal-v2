import dayjs, { Dayjs } from "dayjs";
import { createFilteredFeatures, filterFeaturesByKey } from "../HexbinLayer";
import { Feature, Point } from "geojson";
import { CloudOptimizedFeature } from "../../../../common/store/CloudOptimizedDefinitions";
import { dateDefault } from "../../../../common/constants";

const mockFeature = (
  date: Dayjs,
  key?: string
): Feature<Point, CloudOptimizedFeature> => ({
  type: "Feature" as const,
  geometry: { type: "Point" as const, coordinates: [0, 0] },
  properties: {
    date: date.toISOString(),
    timestamp: date.valueOf(),
    count: 0,
    key: key || "test.parquet",
  },
});

const mockCollection = (dates: Dayjs[], keys?: string[]) => ({
  type: "FeatureCollection" as const,
  features: dates.map((date, index) =>
    mockFeature(date, keys ? keys[index] : undefined)
  ),
});

describe("HexbinLayer - createFilteredFeatures", () => {
  // The createFilteredFeature function assume data sorted by timestamp asc !!!
  const fc = mockCollection([
    dayjs(
      "2023-01-15",
      [dateDefault.DATE_FORMAT, dateDefault.DATE_YEAR_MONTH_FORMAT],
      true
    ),
    dayjs(
      "2023-06-20",
      [dateDefault.DATE_FORMAT, dateDefault.DATE_YEAR_MONTH_FORMAT],
      true
    ),
    dayjs(
      "2024-01-01",
      [dateDefault.DATE_FORMAT, dateDefault.DATE_YEAR_MONTH_FORMAT],
      true
    ),
    dayjs(
      "2024-12-31",
      [dateDefault.DATE_FORMAT, dateDefault.DATE_YEAR_MONTH_FORMAT],
      true
    ),
    dayjs(
      "2025-03",
      [dateDefault.DATE_FORMAT, dateDefault.DATE_YEAR_MONTH_FORMAT],
      true
    ),
  ]);

  it("returns undefined when no collection", () => {
    expect(createFilteredFeatures(undefined)).toBeUndefined();
  });

  it("returns original when no filters", () => {
    expect(createFilteredFeatures(fc)).toBe(fc);
  });

  it("filters by start date only", () => {
    const start = dayjs("2024-01-01");
    const result = createFilteredFeatures(fc, start);
    expect(result?.features.length).toBe(3); // 2024-01-01, 2024-12-31, 2025-03
  });

  it("filters by end date only", () => {
    const end = dayjs("2024-01-01");
    const result = createFilteredFeatures(fc, undefined, end);
    expect(result?.features.length).toBe(3); // 2023-01-15, 2023-06-20, 2024-01-01
  });

  it("filters by both start and end dates", () => {
    const start = dayjs("2023-06-01");
    const end = dayjs("2024-06-01");
    const result = createFilteredFeatures(fc, start, end);
    expect(result?.features.length).toBe(2); // 2023-06-20, 2024-01-01
  });

  it("handles year-month format correctly", () => {
    const start = dayjs("2025-01-01");
    const end = dayjs("2025-12-31");
    const result = createFilteredFeatures(fc, start, end);
    expect(result?.features.length).toBe(1); // only "2025-03"
  });

  it("returns empty features array when nothing matches", () => {
    const start = dayjs("2030-01-01");
    const result = createFilteredFeatures(fc, start);
    expect(result?.features).toEqual([]);
  });

  it("preserves original collection structure", () => {
    const start = dayjs("2023-01-01");
    const result = createFilteredFeatures(fc, start);
    expect(result).toMatchObject({
      type: "FeatureCollection",
      features: expect.any(Array),
    });
  });
});

describe("HexbinLayer - with key filtering", () => {
  const dates = [
    dayjs("2023-01-15"),
    dayjs("2023-06-20"),
    dayjs("2024-01-01"),
    dayjs("2024-12-31"),
    dayjs("2025-03-01"),
  ];

  // Expected to filter by grouped keys
  const fcWithKeys = mockCollection(dates, [
    "wave_buoy.parquet",
    "argo.parquet",
    "wave_buoy.parquet",
    "argo.parquet",
    "wave_buoy.parquet",
  ]);

  it("filters by key and date range", () => {
    // First filter by key
    const keyFiltered = filterFeaturesByKey(fcWithKeys, "wave_buoy.parquet");
    // Then filter by date
    const start = dayjs("2023-06-01");
    const end = dayjs("2024-12-31");
    const result = createFilteredFeatures(keyFiltered, start, end);

    expect(result?.features.length).toBe(1); // Only 2024-01-01 wave_buoy
    expect(result?.features[0].properties.key).toBe("wave_buoy.parquet");
  });

  it("filters by key only", () => {
    const keyFiltered = filterFeaturesByKey(fcWithKeys, "wave_buoy.parquet");
    const result = createFilteredFeatures(keyFiltered);

    expect(result?.features.length).toBe(3); // All wave_buoy entries
    result?.features.forEach((feature) => {
      expect(feature.properties.key).toBe("wave_buoy.parquet");
    });
  });

  it("returns empty when key has no matches in date range", () => {
    const keyFiltered = filterFeaturesByKey(fcWithKeys, "argo.parquet");
    const start = dayjs("2024-01-01");
    const result = createFilteredFeatures(keyFiltered, start);

    expect(result?.features.length).toBe(0);
  });
});
