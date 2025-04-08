import { describe, it } from "vitest";
import { hexGrid } from "@turf/turf";
import { BBox } from "geojson";
import { createHexGrid } from "../HexbinLayer";

describe("findMostVisiblePoint", () => {
  it("Verify hexGrid generate correct value", () => {
    const bbox: BBox = [-180, -67, 180, 15.2];
    const cellSide = 40; // 50 kilometers

    const hexgrid = createHexGrid(bbox, cellSide);
    console.log(hexgrid);
    expect(hexgrid.features.length).not.toBe(0);
  });
});
