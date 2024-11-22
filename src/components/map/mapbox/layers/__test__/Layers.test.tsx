import { describe, it, expect, vi } from "vitest";
import { FeatureCollection, Point } from "geojson";
import { findSuitableVisiblePoint } from "../Layers";
import { LngLatBounds, Map } from "mapbox-gl";

// Define the test
describe("findMostVisiblePoint", () => {
  beforeAll(() => {
    // Mock the MapboxGL Map class
    vi.mock("mapbox-gl", async () => {
      const actual =
        await vi.importActual<typeof import("mapbox-gl")>("mapbox-gl");

      return {
        ...actual,
        Map: vi.fn().mockImplementation(() => ({
          // This is the current visible area of the map,
          // we mock some random value to make test work
          getBounds: vi.fn().mockReturnValue({
            getSouthWest: () => [-203.62, -43.828],
            getNorthEast: () => [-142.79, -8.759],
            contains: vi.fn().mockReturnValue(true),
          }),
          getCenter: vi.fn().mockReturnValue({
            lng: 0,
            lat: 0,
          }),
        })),
      };
    });
  });

  afterEach(() => {
    vi.resetAllMocks();
  });

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
});
