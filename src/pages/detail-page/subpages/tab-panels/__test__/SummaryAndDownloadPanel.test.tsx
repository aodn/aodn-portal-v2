import { describe, it, expect } from "vitest";
import dayjs from "dayjs";
import { FeatureCollection, Point } from "geojson";
import {
  getMinMaxDateStamps,
  overallBoundingBox,
} from "../SummaryAndDownloadPanel";
import { dateDefault } from "../../../../../components/common/constants"; // Adjust path as needed
import { OGCCollection } from "../../../../../components/common/store/OGCCollectionDefinitions";
import { MapDefaultConfig } from "../../../../../components/map/mapbox/constants";

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

  it("returns default bounding box when collection is undefined", () => {
    const result = overallBoundingBox(undefined);
    expect(result).toEqual([
      MapDefaultConfig.BBOX_ENDPOINTS.WEST_LON,
      MapDefaultConfig.BBOX_ENDPOINTS.SOUTH_LAT,
      MapDefaultConfig.BBOX_ENDPOINTS.EAST_LON,
      MapDefaultConfig.BBOX_ENDPOINTS.NORTH_LAT,
    ]);
  });

  it("returns default bounding box when extent is undefined", () => {
    const collection: OGCCollection = new OGCCollection();
    const result = overallBoundingBox(collection);
    expect(result).toEqual([
      MapDefaultConfig.BBOX_ENDPOINTS.WEST_LON,
      MapDefaultConfig.BBOX_ENDPOINTS.SOUTH_LAT,
      MapDefaultConfig.BBOX_ENDPOINTS.EAST_LON,
      MapDefaultConfig.BBOX_ENDPOINTS.NORTH_LAT,
    ]);
  });

  it("returns default bounding box when bbox is undefined", () => {
    const collection: OGCCollection = Object.assign(new OGCCollection(), {
      extent: {},
    });
    const result = overallBoundingBox(collection);
    expect(result).toEqual([
      MapDefaultConfig.BBOX_ENDPOINTS.WEST_LON,
      MapDefaultConfig.BBOX_ENDPOINTS.SOUTH_LAT,
      MapDefaultConfig.BBOX_ENDPOINTS.EAST_LON,
      MapDefaultConfig.BBOX_ENDPOINTS.NORTH_LAT,
    ]);
  });

  it("returns default bounding box when bbox[0] has fewer than 4 elements", () => {
    const collection: OGCCollection = Object.assign(new OGCCollection(), {
      extent: { spatial: { bbox: [[1, 2, 3]] } },
    });
    const result = overallBoundingBox(collection);
    expect(result).toEqual([
      MapDefaultConfig.BBOX_ENDPOINTS.WEST_LON,
      MapDefaultConfig.BBOX_ENDPOINTS.SOUTH_LAT,
      MapDefaultConfig.BBOX_ENDPOINTS.EAST_LON,
      MapDefaultConfig.BBOX_ENDPOINTS.NORTH_LAT,
    ]);
  });

  it("returns bbox[0] when bbox is valid with 4 elements", () => {
    const collection: OGCCollection = Object.assign(new OGCCollection(), {
      extent: { spatial: { bbox: [[10, 20, 30, 40]] } },
    });
    const result = overallBoundingBox(collection);
    expect(result).toEqual([10, 20, 30, 40]);
  });

  it("returns bbox[0] when bbox has more than 4 elements", () => {
    const collection: OGCCollection = Object.assign(new OGCCollection(), {
      extent: { spatial: { bbox: [[10, 20, 30, 40, 50]] } },
    });
    const result = overallBoundingBox(collection);
    expect(result).toEqual([
      MapDefaultConfig.BBOX_ENDPOINTS.WEST_LON,
      MapDefaultConfig.BBOX_ENDPOINTS.SOUTH_LAT,
      MapDefaultConfig.BBOX_ENDPOINTS.EAST_LON,
      MapDefaultConfig.BBOX_ENDPOINTS.NORTH_LAT,
    ]);
  });
});
