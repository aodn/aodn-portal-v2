import { describe, expect, it } from "vitest";
import { getContrastRatio } from "@mui/material/styles";
// @ts-expect-error mapbox-gl ships no types for this file path
import { validate } from "mapbox-gl/dist/style-spec/index.cjs";
import drawStyles from "../drawStyles";
import {
  DRAW_SELECTION_SYMBOLOGY,
  EXTENT_OUTLINE_SYMBOLOGY,
} from "../../../constants";

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

  it("keeps the selection line at 3:1 or more against its white casing (WCAG 1.4.11)", () => {
    expect(
      getContrastRatio(
        DRAW_SELECTION_SYMBOLOGY.COLOR,
        EXTENT_OUTLINE_SYMBOLOGY.CASING_COLOR
      )
    ).toBeGreaterThanOrEqual(3);
  });

  it("keeps white marker text at 4.5:1 or more on the selection colour (WCAG 1.4.3)", () => {
    expect(
      getContrastRatio("#FFFFFF", DRAW_SELECTION_SYMBOLOGY.COLOR)
    ).toBeGreaterThanOrEqual(4.5);
  });
});
