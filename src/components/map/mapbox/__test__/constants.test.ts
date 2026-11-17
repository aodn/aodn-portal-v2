import { describe, expect, it } from "vitest";
import { decomposeColor, getContrastRatio } from "@mui/material/styles";
import { portalTheme } from "@/styles";
import { EXTENT_OUTLINE_SYMBOLOGY } from "../constants";

// Search page extent outline: "fill-outline-color": "yellow" in SpatialExtents.tsx
const SEARCH_MAP_OUTLINE = "#FFFF00";

// One colour name on a 12-colour wheel spans 30 degrees of hue
const MAX_HUE_DIFFERENCE = 15;

// Most common colours of each base map behind a dataset extent, read from
// detail page screenshots of dataset 30892ff0 (2026-11-17)
const BASE_MAP_COLOURS = {
  "Street Map": ["#98DFE6", "#8CD9FF", "#86D7FF", "#9DE1E6"],
  "Topographic Map": ["#81C3D5", "#6EB7EA", "#69B4EA", "#85C5D5"],
  "Satellite Map": ["#081120", "#324032", "#334133", "#07101F"],
  "World Imagery": ["#3E6256", "#163B4B", "#3E6155", "#3D6154"],
};

// WCAG 1.4.11 Non-text Contrast: graphics need 3:1 against adjacent colours
const WCAG_NON_TEXT_CONTRAST = 3;

const hue = (colour: string) => {
  const [r, g, b] = decomposeColor(colour).values.map((v) => v / 255);
  const max = Math.max(r, g, b);
  const range = max - Math.min(r, g, b);
  if (range === 0) return 0;
  const sector =
    max === r
      ? (g - b) / range
      : max === g
        ? (b - r) / range + 2
        : (r - g) / range + 4;
  return (sector * 60 + 360) % 360;
};

describe("dataset extent outline", () => {
  const { COLOR, CASING_COLOR } = EXTENT_OUTLINE_SYMBOLOGY;

  describe("consistent across maps", () => {
    it("uses the same yellow colour family as the search page map", () => {
      expect(
        Math.abs(hue(COLOR) - hue(SEARCH_MAP_OUTLINE))
      ).toBeLessThanOrEqual(MAX_HUE_DIFFERENCE);
    });

    it("takes the casing colour from the portal theme", () => {
      expect(CASING_COLOR).toBe(portalTheme.palette.primary2);
    });
  });

  describe("WCAG 1.4.11 non-text contrast", () => {
    it.each(Object.entries(BASE_MAP_COLOURS))(
      "keeps the line or its casing at 3:1 or more on the %s",
      (_, colours) => {
        colours.forEach((background) => {
          const best = Math.max(
            getContrastRatio(COLOR, background),
            getContrastRatio(CASING_COLOR, background)
          );
          expect(best, background).toBeGreaterThanOrEqual(
            WCAG_NON_TEXT_CONTRAST
          );
        });
      }
    );

    it("keeps the line at 3:1 or more against its casing", () => {
      expect(getContrastRatio(COLOR, CASING_COLOR)).toBeGreaterThanOrEqual(
        WCAG_NON_TEXT_CONTRAST
      );
    });
  });
});
