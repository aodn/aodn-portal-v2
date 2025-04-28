import { describe, it, expect, beforeEach, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import TimeRangeBarChart, { Bucket, DividedBy } from "../TimeRangeBarChart";
import { OGCCollections } from "../../store/OGCCollectionDefinitions"; // Adjust path as needed

// Helper to access private functions for testing
// This assumes you add a test-only export at the bottom of TimeRangeBarChart.tsx
const getPrivateFunctions = () => {
  // This will be available if we add a test-only export (see below)
  return (TimeRangeBarChart as any).__testExports;
};

// Mock the @mui/x-charts module
vi.mock("@mui/x-charts", () => ({
  BarChart: ({ series, xAxis, yAxis }: any) => (
    <div data-testid="bar-chart">
      <div data-testid="x-axis">{xAxis[0].label}</div>
      <div data-testid="y-axis">{yAxis[0].label}</div>
      <div data-testid="series">{JSON.stringify(series)}</div>
    </div>
  ),
  axisClasses: {
    left: "left-axis",
    label: "axis-label",
  },
}));

// Mock the color constants
vi.mock("../../../styles/constants", () => ({
  color: {
    blue: {
      dark: "#0000FF",
      darkSemiTransparent: "rgba(0, 0, 255, 0.5)",
    },
  },
}));

// Sample test data
const mockImosDataIds = ["imos-1", "imos-2"];
const mockTotalDataset: OGCCollections = Object.assign(new OGCCollections(), {
  collections: [
    {
      id: "imos-1",
      extent: {
        temporal: {
          interval: [["2023-01-01T00:00:00Z", "2023-01-02T00:00:00Z"]],
        },
      },
    },
    {
      id: "non-imos",
      extent: {
        temporal: {
          interval: [["2023-01-01T00:00:00Z", "2023-01-03T00:00:00Z"]],
        },
      },
    },
  ],
});
const mockStartDate = new Date("2023-01-01T00:00:00Z");
const mockEndDate = new Date("2023-01-03T00:00:00Z");

describe("TimeRangeBarChart", () => {
  beforeEach(() => {
    // Mock window.matchMedia directly in the test file
    Object.defineProperty(window, "matchMedia", {
      writable: true,
      configurable: true, // Make the property configurable to allow redefinition
      value: vi.fn().mockImplementation((query) => ({
        matches: false,
        media: query,
        onchange: null,
        addListener: vi.fn(), // Deprecated
        removeListener: vi.fn(), // Deprecated
        addEventListener: vi.fn(),
        removeEventListener: vi.fn(),
        dispatchEvent: vi.fn(),
      })),
    });
  });
  // Clean up window.matchMedia after each test
  afterEach(() => {
    // Reset the mock behavior instead of deleting the property
    vi.clearAllMocks();
  });
  // Test component rendering
  it("renders BarChart with correct props", () => {
    render(
      <TimeRangeBarChart
        imosDataIds={mockImosDataIds}
        totalDataset={mockTotalDataset}
        selectedStartDate={mockStartDate}
        selectedEndDate={mockEndDate}
      />
    );

    expect(screen.getByTestId("bar-chart")).toBeInTheDocument();
    expect(screen.getByTestId("x-axis")).toHaveTextContent("Day");
    expect(screen.getByTestId("y-axis")).toHaveTextContent("Count of Records");

    const series = JSON.parse(screen.getByTestId("series").textContent!);
    expect(series).toHaveLength(2);
    expect(series[0].label).toBe("IMOS Records");
    expect(series[1].label).toBe("All Records");
  });

  // Test determineChartUnit
  it("determineChartUnit returns correct unit based on date range", () => {
    const { determineChartUnit } = getPrivateFunctions();
    const start = new Date("2023-01-01");
    const end = new Date("2023-01-10"); // 10 days
    expect(determineChartUnit(start, end)).toBe(DividedBy.day);

    const endMonth = new Date("2023-12-01"); // ~11 months
    expect(determineChartUnit(start, endMonth)).toBe(DividedBy.month);

    let endYear = new Date("2031-01-01"); // 8 years
    expect(determineChartUnit(start, endYear)).toBe(DividedBy.month);

    endYear = new Date("2032-01-01"); // 9 years
    expect(determineChartUnit(start, endYear)).toBe(DividedBy.year);
  });

  // Test calculateDaysBetween
  it("calculateDaysBetween returns correct number of days", () => {
    const { calculateDaysBetween } = getPrivateFunctions();
    const start = new Date("2023-01-01");
    const end = new Date("2023-01-03");
    expect(calculateDaysBetween(start, end)).toBe(3); // Inclusive
  });

  // Test calculateMonthBetween
  it("calculateMonthBetween returns correct number of months", () => {
    const { calculateMonthBetween } = getPrivateFunctions();
    const start = new Date("2023-01-01");
    const end = new Date("2023-03-01");
    expect(calculateMonthBetween(start, end)).toBe(3); // Inclusive
  });

  // Test calculateYearBetween
  it("calculateYearBetween returns correct number of years", () => {
    const { calculateYearBetween } = getPrivateFunctions();
    const start = new Date("2023-01-01");
    const end = new Date("2025-01-01");
    expect(calculateYearBetween(start, end)).toBe(3); // Inclusive
  });

  // Test isIncludedInBucket
  it("isIncludedInBucket correctly determines if interval is in bucket", () => {
    const { isIncludedInBucket, MS_PER_DAY } = getPrivateFunctions();
    const targetStart = new Date("2023-01-01").getTime();
    const targetEnd = new Date("2023-01-02").getTime();
    const bucketStart = new Date("2023-01-01").getTime();
    const bucketEnd = new Date("2023-01-01T23:59:59").getTime();

    expect(
      isIncludedInBucket(targetStart, targetEnd, bucketStart, bucketEnd)
    ).toBe(true);
    expect(
      isIncludedInBucket(
        targetStart,
        targetEnd,
        targetEnd + 1,
        bucketEnd + MS_PER_DAY
      )
    ).toBe(false);
  });

  // Test determineXWithBucketsBy
  it("determineXWithBucketsBy generates correct buckets and xValues", () => {
    const { determineXWithBucketsBy } = getPrivateFunctions();
    const { xValues, buckets } = determineXWithBucketsBy(
      mockStartDate,
      mockEndDate,
      mockImosDataIds,
      mockTotalDataset,
      "Day"
    );

    expect(xValues).toHaveLength(3);
    expect(buckets).toHaveLength(3);
    expect(buckets[0].imosOnlyCount).toBe(1); // imos-1 overlaps
    expect(buckets[0].total).toBe(2); // Both collections overlap
  });

  // Test createSeries
  it("createSeries generates correct series data", () => {
    const { createSeries } = getPrivateFunctions();
    const buckets: Bucket[] = [
      { start: 0, end: 1, imosOnlyCount: 1, total: 2 },
      { start: 1, end: 2, imosOnlyCount: 0, total: 1 },
    ];
    const series = createSeries(buckets);

    expect(series).toHaveLength(2);
    expect(series[0].data).toEqual([1, 0]);
    expect(series[1].data).toEqual([1, 1]);
  });
});
