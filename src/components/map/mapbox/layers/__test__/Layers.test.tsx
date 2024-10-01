import { describe, it, expect, vi } from "vitest";
import { FeatureCollection, Point } from "geojson";
import { findSuitableVisiblePoint } from "../Layers";
import { Map } from "mapbox-gl";

// Mock the MapboxGL Map class
vi.mock("mapbox-gl", () => ({
  Map: vi.fn().mockImplementation(() => ({
    getBounds: vi.fn().mockReturnValue({
      contains: vi.fn().mockReturnValue(true),
    }),
    getCenter: vi.fn().mockReturnValue({
      lng: 0,
      lat: 0,
    }),
  })),
}));

// Define the test
describe("findMostVisiblePoint", () => {
  it("should return the most visible and closest points by uuid", () => {
    // Define a mock feature collection
    const featureCollection: FeatureCollection<Point> = {
      type: "FeatureCollection",
      features: [
        {
          type: "Feature",
          geometry: {
            type: "Point",
            coordinates: [1, 1],
          },
          properties: {
            uuid: "abc123",
          },
        },
        {
          type: "Feature",
          geometry: {
            type: "Point",
            coordinates: [2, 2],
          },
          properties: {
            uuid: "abc123",
          },
        },
        {
          type: "Feature",
          geometry: {
            type: "Point",
            coordinates: [3, 3],
          },
          properties: {
            uuid: "xyz456",
          },
        },
      ],
    };

    // Create a mock map object
    const map = new Map();

    // Call the function with mock inputs
    const result = findSuitableVisiblePoint(featureCollection, map);

    // Define the expected output
    const expected: FeatureCollection<Point> = {
      type: "FeatureCollection",
      features: [
        {
          type: "Feature",
          geometry: {
            type: "Point",
            coordinates: [1, 1],
          },
          properties: {
            uuid: "abc123",
          },
        },
        {
          type: "Feature",
          geometry: {
            type: "Point",
            coordinates: [3, 3],
          },
          properties: {
            uuid: "xyz456",
          },
        },
      ],
    };

    // Expect the result to match the expected output
    expect(result).toEqual(expected);
  });

  it("should return the same feature collection if no map is provided", () => {
    const featureCollection: FeatureCollection<Point> = {
      type: "FeatureCollection",
      features: [],
    };

    const result = findSuitableVisiblePoint(featureCollection, null);

    // Expect the same input to be returned since the map is null
    expect(result).toEqual(featureCollection);
  });
});
