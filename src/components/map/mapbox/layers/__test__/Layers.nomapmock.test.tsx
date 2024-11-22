import { describe, it, expect } from "vitest";
import { Feature, FeatureCollection, GeoJsonProperties, Point } from "geojson";
import { findSuitableVisiblePoint, isFeatureVisible } from "../Layers";
import * as turf from "@turf/turf";
import { LngLatBounds } from "mapbox-gl";

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
      [142.59, -46.021],
      [203.4169, -10.956],
    ]);
    // We set a LngLat where x is < -180 to create anti-meridian
    expect(isFeatureVisible(target, bounds)).toBeTruthy();
  });
});
