import { describe, expect, it } from "vitest";
// @ts-expect-error mapbox-gl ships no types for this file path
import { validate } from "mapbox-gl/dist/style-spec/index.cjs";
import drawStyles from "../drawStyles";

describe("drawStyles", () => {
  it("contains only valid Mapbox style layers", () => {
    const style = {
      version: 8,
      sources: {
        draw: {
          type: "geojson",
          data: { type: "FeatureCollection", features: [] },
        },
      },
      layers: drawStyles.map((layer) => ({ ...layer, source: "draw" })),
    };

    expect(validate(style)).toEqual([]);
  });
});
