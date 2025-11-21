import { describe, it, expect, vi } from "vitest";
import dayjs from "dayjs";
import { FeatureCollection, Point } from "geojson";
import {
  buildMapLayerConfig,
  getMinMaxDateStamps,
} from "../SummaryAndDownloadPanel";
import { dateDefault } from "../../../../../components/common/constants";
import { LayerName } from "../../../../../components/map/mapbox/controls/menu/MapLayerSwitcher";

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

describe("SummaryAndDownloadPanel - buildMapLayerConfig", () => {
  // Mimic useState set function behavior
  let current: LayerName | null = null;
  const setLast = vi.fn((updater) => {
    current = typeof updater === "function" ? updater(current) : updater;
  });

  it("Hexbin + GeoServer, summary true, Zarr false, WMS true", () => {
    current = null;
    const layers = buildMapLayerConfig(
      {} as any,
      true,
      false,
      true,
      true,
      setLast
    );

    expect(layers.map((l) => l.id)).toEqual([
      LayerName.Hexbin,
      LayerName.GeoServer,
    ]);
    expect(layers[0].default).toBe(true);
    expect(layers[1].default).toBe(false);
  });

  it("only GeoServer, no summary, WMS true", () => {
    current = null;
    const layers = buildMapLayerConfig(
      {} as any,
      false,
      false,
      true,
      true,
      setLast
    );

    expect(layers.map((l) => l.id)).toEqual([
      LayerName.GeoServer,
      LayerName.SpatialExtent,
    ]);
    expect(layers[0].default).toBe(true);
    expect(layers[1].default).toBe(false);
  });

  it("only SpatialExtent, no summary, no WMS, has extent", () => {
    current = null;
    const layers = buildMapLayerConfig(
      {} as any,
      false,
      false,
      false,
      true,
      setLast
    );

    expect(layers.map((l) => l.id)).toEqual([LayerName.SpatialExtent]);
    expect(layers[0].default).toBe(true);
  });

  it("Zarr, cloud optimized plus GeoServer", () => {
    current = null;
    const layers = buildMapLayerConfig(
      {} as any,
      true,
      true,
      true,
      true,
      setLast
    );

    expect(layers.map((l) => l.id)).toEqual([
      LayerName.GeoServer,
      LayerName.SpatialExtent,
    ]);
    expect(layers[0].default).toBe(true);
    expect(layers[1].default).toBe(false);
  });
});
