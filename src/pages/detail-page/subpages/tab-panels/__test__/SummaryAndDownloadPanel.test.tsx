import { describe, expect, it, vi } from "vitest";
import dayjs from "dayjs";
import { FeatureCollection, Point } from "geojson";
import {
  buildMapLayerConfig,
  getMinMaxDateStamps,
} from "../SummaryAndDownloadPanel";
import { dateDefault } from "../../../../../components/common/constants";
import { LayerName } from "../../../../../components/map/mapbox/controls/menu/MapLayerSwitcher";
import {
  OGCCollection,
  DatasetType,
} from "../../../../../components/common/store/OGCCollectionDefinitions";

// Helper to create a FeatureCollection for testing
const createFeatureCollection = (
  dates: string[]
): FeatureCollection<Point> => ({
  type: "FeatureCollection",
  features: dates.map((date, index) => ({
    type: "Feature",
    geometry: { type: "Point", coordinates: [index, index] },
    properties: { date },
  })),
});

describe("getMinMaxDateStamps", () => {
  it("returns default min/max dates for undefined featureCollection", () => {
    const [minDate, maxDate] = getMinMaxDateStamps(undefined);
    expect(minDate.isSame(dayjs(dateDefault.min))).toBe(true);
    expect(maxDate.isSame(dayjs(dateDefault.max))).toBe(true);
  });

  it("returns default min/max dates for empty featureCollection", () => {
    const featureCollection: FeatureCollection<Point> = {
      type: "FeatureCollection",
      features: [],
    };
    const [minDate, maxDate] = getMinMaxDateStamps(featureCollection);
    expect(minDate.isSame(dayjs(dateDefault.min))).toBe(true);
    expect(maxDate.isSame(dayjs(dateDefault.max))).toBe(true);
  });

  it("returns correct min/max dates for valid dates", () => {
    const dates = ["2023-01-01", "2022-06-15", "2024-03-10"];
    const featureCollection = createFeatureCollection(dates);
    const [minDate, maxDate] = getMinMaxDateStamps(featureCollection);
    expect(minDate.isSame(dayjs("2022-06-15"))).toBe(true);
    expect(maxDate.isSame(dayjs("2024-03-10"))).toBe(true);
  });

  it("handles single valid date", () => {
    const featureCollection = createFeatureCollection(["2023-05-20"]);
    const [minDate, maxDate] = getMinMaxDateStamps(featureCollection);
    expect(minDate.isSame(dayjs("2023-05-20"))).toBe(true);
    expect(maxDate.isSame(dayjs("2023-05-20"))).toBe(true);
  });

  it("ignores invalid date strings and returns defaults if no valid dates", () => {
    const featureCollection: FeatureCollection<Point> = {
      type: "FeatureCollection",
      features: [
        {
          type: "Feature",
          geometry: { type: "Point", coordinates: [0, 0] },
          properties: { date: "invalid-date" },
        },
        {
          type: "Feature",
          geometry: { type: "Point", coordinates: [1, 1] },
          properties: { date: "" },
        },
      ],
    };
    const [minDate, maxDate] = getMinMaxDateStamps(featureCollection);
    expect(minDate.isSame(dayjs(dateDefault.min))).toBe(true);
    expect(maxDate.isSame(dayjs(dateDefault.max))).toBe(true);
  });

  it("handles mix of valid and invalid dates", () => {
    const featureCollection: FeatureCollection<Point> = {
      type: "FeatureCollection",
      features: [
        {
          type: "Feature",
          geometry: { type: "Point", coordinates: [0, 0] },
          properties: { date: "2023-01-01" },
        },
        {
          type: "Feature",
          geometry: { type: "Point", coordinates: [1, 1] },
          properties: { date: "invalid-date" },
        },
        {
          type: "Feature",
          geometry: { type: "Point", coordinates: [2, 2] },
          properties: { date: "2022-12-01" },
        },
      ],
    };
    const [minDate, maxDate] = getMinMaxDateStamps(featureCollection);
    expect(minDate.isSame(dayjs("2022-12-01"))).toBe(true);
    expect(maxDate.isSame(dayjs("2023-01-01"))).toBe(true);
  });

  it("handles missing date properties", () => {
    const featureCollection: FeatureCollection<Point> = {
      type: "FeatureCollection",
      features: [
        {
          type: "Feature",
          geometry: { type: "Point", coordinates: [0, 0] },
          properties: { date: "2023-01-01" },
        },
        {
          type: "Feature",
          geometry: { type: "Point", coordinates: [1, 1] },
          properties: {}, // Missing date
        },
        {
          type: "Feature",
          geometry: { type: "Point", coordinates: [2, 2] },
          properties: { date: "2022-12-01" },
        },
      ],
    };
    const [minDate, maxDate] = getMinMaxDateStamps(featureCollection);
    expect(minDate.isSame(dayjs("2022-12-01"))).toBe(true);
    expect(maxDate.isSame(dayjs("2023-01-01"))).toBe(true);
  });

  it("handles non-string date properties", () => {
    const featureCollection: FeatureCollection<Point> = {
      type: "FeatureCollection",
      features: [
        {
          type: "Feature",
          geometry: { type: "Point", coordinates: [0, 0] },
          properties: { date: "2023-01-01" },
        },
        {
          type: "Feature",
          geometry: { type: "Point", coordinates: [1, 1] },
          properties: { date: 12345 }, // Non-string
        },
        {
          type: "Feature",
          geometry: { type: "Point", coordinates: [2, 2] },
          properties: { date: "2022-12-01" },
        },
      ],
    };
    const [minDate, maxDate] = getMinMaxDateStamps(featureCollection);
    expect(minDate.isSame(dayjs("2022-12-01"))).toBe(true);
    expect(maxDate.isSame(dayjs("2023-01-01"))).toBe(true);
  });

  it("returns default dates when all features have null properties", () => {
    const featureCollection: FeatureCollection<Point> = {
      type: "FeatureCollection",
      features: [
        {
          type: "Feature",
          geometry: { type: "Point", coordinates: [0, 0] },
          properties: null,
        },
        {
          type: "Feature",
          geometry: { type: "Point", coordinates: [1, 1] },
          properties: null,
        },
      ],
    };
    const [minDate, maxDate] = getMinMaxDateStamps(featureCollection);
    expect(minDate.isSame(dayjs(dateDefault.min))).toBe(true);
    expect(maxDate.isSame(dayjs(dateDefault.max))).toBe(true);
  });
});

describe("buildMapLayerConfig", () => {
  // Helper function to create a mock OGCCollection
  const createMockCollection = (
    overrides: Partial<{
      hasSummaryFeature: boolean;
      getDatasetType: () => DatasetType | undefined;
      getBBox: () => any;
    }> = {}
  ) => {
    const mockCollection = {
      hasSummaryFeature: vi
        .fn()
        .mockReturnValue(overrides.hasSummaryFeature ?? false),
      getDatasetType: vi
        .fn()
        .mockReturnValue(overrides.getDatasetType?.() ?? undefined),
      getBBox: vi.fn().mockReturnValue(overrides.getBBox?.() ?? undefined),
    } as unknown as OGCCollection;

    return mockCollection;
  };

  it("returns empty array when collection is null", () => {
    const result = buildMapLayerConfig(null, false, false, false, false);
    expect(result).toEqual([]);
  });

  it("returns empty array when collection is undefined", () => {
    const result = buildMapLayerConfig(undefined, false, false, false, false);
    expect(result).toEqual([]);
  });

  it("builds correct layer config with hexbin support", () => {
    const mockCollection = createMockCollection({
      hasSummaryFeature: true,
      getBBox: () => [0, 0, 1, 1],
    });

    const result = buildMapLayerConfig(
      mockCollection,
      true, // hasSummaryFeature
      false, // isZarrDataset
      true, // isWMSAvailable
      true // hasSpatialExtent
    );

    expect(result).toHaveLength(2);
    expect(result[0]).toEqual({
      id: LayerName.Hexbin,
      name: "Hex Grid",
      default: true,
    });
    expect(result[1]).toEqual({
      id: LayerName.GeoServer,
      name: "Geoserver",
      default: false,
    });
  });

  it("builds correct layer config for zarr dataset with spatial extent", () => {
    const mockCollection = createMockCollection({
      hasSummaryFeature: true,
      getDatasetType: () => DatasetType.ZARR,
      getBBox: () => [0, 0, 1, 1],
    });

    const result = buildMapLayerConfig(
      mockCollection,
      true, // hasSummaryFeature
      true, // isZarrDataset
      false, // isWMSAvailable
      true // hasSpatialExtent
    );

    expect(result).toHaveLength(1);
    expect(result[0]).toEqual({
      id: LayerName.SpatialExtent,
      name: "Spatial Extent",
      default: true, // Should be set to true as it's the only layer
    });
  });

  it("sets first layer as default when no layer has default set to true", () => {
    const mockCollection = createMockCollection({
      getBBox: () => [0, 0, 1, 1],
    });

    const result = buildMapLayerConfig(
      mockCollection,
      false, // hasSummaryFeature
      false, // isZarrDataset
      false, // isWMSAvailable (no WMS, no hexbin -> spatial extent should be available)
      true // hasSpatialExtent
    );

    expect(result).toHaveLength(1);
    expect(result[0]).toEqual({
      id: LayerName.SpatialExtent,
      name: "Spatial Extent",
      default: true, // Should be set to true as it's the only layer
    });
  });

  it("builds layer config with multiple layers and correct defaults", () => {
    const mockCollection = createMockCollection({
      getBBox: () => [0, 0, 1, 1],
    });

    const result = buildMapLayerConfig(
      mockCollection,
      true, // hasSummaryFeature
      false, // isZarrDataset
      true, // isWMSAvailable
      true // hasSpatialExtent
    );

    expect(result).toHaveLength(2);
    expect(result[0]).toEqual({
      id: LayerName.Hexbin,
      name: "Hex Grid",
      default: true,
    });
    expect(result[1]).toEqual({
      id: LayerName.GeoServer,
      name: "Geoserver",
      default: false, // Not default because hexbin is available
    });
  });

  it("returns empty array when no layers are available (no preview mode)", () => {
    const mockCollection = createMockCollection({
      hasSummaryFeature: false, // no hexbin
      getDatasetType: () => undefined, // not zarr
      getBBox: () => undefined, // no spatial extent
    });
    const result = buildMapLayerConfig(
      mockCollection,
      false, // hasSummaryFeature = false → no hexbin
      false, // isZarrDataset = false
      false, // isWMSAvailable = false
      false // hasSpatialExtent = false
    );
    // Should return empty array (no layers available)
    expect(result).toEqual([]);
    expect(result.length).toBe(0);
  });
});
