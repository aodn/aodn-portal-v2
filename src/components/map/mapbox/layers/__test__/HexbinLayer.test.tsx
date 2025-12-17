import dayjs, { Dayjs } from "dayjs";
import { createFilteredFeatures } from "../HexbinLayer";
import { Feature, Point } from "geojson";
import { CloudOptimizedFeature } from "../../../../common/store/CloudOptimizedDefinitions";
import { dateDefault } from "../../../../common/constants";

const mockFeature = (date: Dayjs): Feature<Point, CloudOptimizedFeature> => ({
  type: "Feature" as const,
  geometry: { type: "Point" as const, coordinates: [0, 0] },
  properties: { date: date.toISOString(), timestamp: date.valueOf(), count: 0 },
});

const mockCollection = (dates: Dayjs[]) => ({
  type: "FeatureCollection" as const,
  features: dates.map(mockFeature),
});

describe("HexbinLayer - createFilteredFeatures", () => {
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
    expect(result?.features.length).toBe(3); // 2024-12-31, 2025-03
  });

  it("filters by end date only", () => {
    const end = dayjs("2024-01-01");
    const result = createFilteredFeatures(fc, undefined, end);
    expect(result?.features.length).toBe(3); // 2023 dates
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
