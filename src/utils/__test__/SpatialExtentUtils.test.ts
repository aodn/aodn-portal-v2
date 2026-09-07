import { describe, expect, it } from "vitest";
import { Feature, FeatureCollection } from "geojson";
import { attachSpatialExtentDescriptions } from "../SpatialExtentUtils";

describe("attachSpatialExtentDescriptions", () => {
  const point = (lng: number, lat: number): Feature => ({
    type: "Feature",
    properties: {},
    geometry: { type: "Point", coordinates: [lng, lat] },
  });

  // two points far apart, the first one is Magnetic Island
  const input = (): FeatureCollection => ({
    type: "FeatureCollection",
    features: [point(146.862133, -19.10415), point(150.0, -20.0)],
  });

  const magneticIsland = {
    description: "Magnetic Island",
    bbox: [146.862133, -19.10415, 146.862133, -19.10415],
  };

  const descriptions = (result: FeatureCollection | undefined) =>
    result?.features.map((feature) => feature.properties?.description);

  it("describes the feature whose bbox matches", () => {
    const result = attachSpatialExtentDescriptions(input(), [magneticIsland]);
    expect(descriptions(result)).toEqual(["Magnetic Island", undefined]);
  });

  it("returns input unchanged when no extents", () => {
    const collection = input();
    expect(attachSpatialExtentDescriptions(collection, undefined)).toBe(
      collection
    );
    expect(attachSpatialExtentDescriptions(collection, [])).toBe(collection);
    expect(attachSpatialExtentDescriptions(undefined, [])).toBeUndefined();
  });

  it("matches within tolerance", () => {
    const nudged = {
      ...magneticIsland,
      bbox: [146.8621330000001, -19.10415, 146.862133, -19.1041500000001],
    };
    const result = attachSpatialExtentDescriptions(input(), [nudged]);
    expect(descriptions(result)).toEqual(["Magnetic Island", undefined]);
  });

  it("describes every feature inside a shared extent", () => {
    const survey = {
      description: "Survey area",
      bbox: [146.0, -21.0, 151.0, -18.0],
    };
    const result = attachSpatialExtentDescriptions(input(), [survey]);
    expect(descriptions(result)).toEqual(["Survey area", "Survey area"]);
  });

  it("smallest extent wins on overlap", () => {
    const wide = {
      description: "Wide area",
      bbox: [140.0, -25.0, 155.0, -15.0],
    };
    const result = attachSpatialExtentDescriptions(input(), [
      wide,
      magneticIsland,
    ]);
    expect(descriptions(result)).toEqual(["Magnetic Island", "Wide area"]);
  });

  it("does not mutate input", () => {
    const collection = input();
    attachSpatialExtentDescriptions(collection, [magneticIsland]);
    expect(descriptions(collection)).toEqual([undefined, undefined]);
  });
});
