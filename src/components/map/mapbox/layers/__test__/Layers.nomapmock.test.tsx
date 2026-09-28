import { describe, it, expect } from "vitest";
import { Feature, FeatureCollection, GeoJsonProperties, Point } from "geojson";
import { findSuitableVisiblePoint, isFeatureVisible } from "../Layers";
import { LngLatBounds, Map as Mapbox } from "mapbox-gl";

const pointFeature = (
  uuid: string,
  coordinates: [number, number]
): Feature<Point> => ({
  type: "Feature",
  geometry: { type: "Point", coordinates },
  properties: { uuid },
});

// Bounds cover x in [0, 5]. getSouthWest/getNorthEast return LngLats so
// splitLngLatBounds keeps this object and uses contains.
const mapWithVisibleRange = (): Mapbox =>
  ({
    getBounds: () => ({
      getSouthWest: () => ({ lng: 0, lat: -10 }),
      getNorthEast: () => ({ lng: 5, lat: 10 }),
      contains: (coord: [number, number]) => coord[0] >= 0 && coord[0] <= 5,
    }),
    getCenter: () => ({ lng: 0, lat: 0 }),
  }) as unknown as Mapbox;

// Define the test where we do not need to mock the Map
describe("Test case where no map mock needed", () => {
  it("should return the same feature collection if no map is provided", () => {
    const featureCollection: FeatureCollection<Point> = {
      type: "FeatureCollection",
      features: [],
    };

    const result = findSuitableVisiblePoint(featureCollection, null);

    // Expect the same input to be returned since the map is null
    expect(result).toEqual(featureCollection);
  });

  it("verfiy anti-meridian works for isFeatureVisible", () => {
    // The point value isn't too important as long as it is below 180 for x
    const target: Feature<Point, GeoJsonProperties> = {
      type: "Feature",
      geometry: {
        type: "Point",
        coordinates: [158.72, -25.95],
      },
      properties: {
        name: "Example Point",
        description: "This is an example of a GeoJSON Point Feature",
      },
    };

    const bounds: LngLatBounds = new LngLatBounds([
      [-203.62, -43.828],
      [-142.79, -8.759],
    ]);
    // We set a LngLat where x is < -180 to create anti-meridian
    expect(isFeatureVisible(target, bounds)).toBeTruthy();
  });

  it("keeps the previous centroid when it is still visible", () => {
    const closer = pointFeature("abc123", [1, 1]);
    const farther = pointFeature("abc123", [2, 2]);
    const previous = pointFeature("abc123", [4, 4]);
    const other = pointFeature("xyz456", [3, 3]);
    const featureCollection: FeatureCollection<Point> = {
      type: "FeatureCollection",
      features: [closer, farther, other],
    };
    const currentVisible: FeatureCollection<Point> = {
      type: "FeatureCollection",
      features: [previous],
    };

    const result = findSuitableVisiblePoint(
      featureCollection,
      mapWithVisibleRange(),
      currentVisible,
      true
    );

    expect(result.features).toEqual([previous, other]);
  });

  it("picks the closest point when the previous centroid is off screen", () => {
    const closer = pointFeature("abc123", [1, 1]);
    const farther = pointFeature("abc123", [2, 2]);
    const previous = pointFeature("abc123", [9, 9]);
    const featureCollection: FeatureCollection<Point> = {
      type: "FeatureCollection",
      features: [farther, closer],
    };
    const currentVisible: FeatureCollection<Point> = {
      type: "FeatureCollection",
      features: [previous],
    };

    const result = findSuitableVisiblePoint(
      featureCollection,
      mapWithVisibleRange(),
      currentVisible,
      true
    );

    expect(result.features).toEqual([closer]);
  });

  it("picks the closest point when preferCurrentCentroid is false", () => {
    const closer = pointFeature("abc123", [1, 1]);
    const farther = pointFeature("abc123", [2, 2]);
    const previous = pointFeature("abc123", [4, 4]);
    const featureCollection: FeatureCollection<Point> = {
      type: "FeatureCollection",
      features: [farther, closer],
    };
    const currentVisible: FeatureCollection<Point> = {
      type: "FeatureCollection",
      features: [previous],
    };

    const result = findSuitableVisiblePoint(
      featureCollection,
      mapWithVisibleRange(),
      currentVisible,
      false
    );

    expect(result.features).toEqual([closer]);
  });
});
