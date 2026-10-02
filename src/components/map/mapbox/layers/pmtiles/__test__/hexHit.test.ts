import { describe, expect, it, vi } from "vitest";
import type { Geometry, Polygon } from "geojson";
import { cellToBoundary } from "h3-js";
import {
  featureH3CellId,
  h3CellPolygon,
  h3ResolutionFromSourceLayer,
  pickHexAmongFeatures,
  pointInPolygonGeometry,
} from "../hexHit";

vi.mock("h3-js", () => ({
  latLngToCell: vi.fn((lat: number, lng: number, res: number) => {
    if (res === 4 && lat === -42 && lng === 147) return "cell-from-h3";
    return "other-cell";
  }),
  isValidCell: vi.fn((id: string) => id === "cell-from-h3"),
  getResolution: vi.fn(() => 4),
  cellToLatLng: vi.fn(() => [-42, 147]),
  cellToBoundary: vi.fn(() => [
    [147, -42],
    [147.1, -42],
    [147.1, -42.1],
    [147, -42.1],
  ]),
}));

const square = (
  minLng: number,
  minLat: number,
  maxLng: number,
  maxLat: number
): Geometry => ({
  type: "Polygon",
  coordinates: [
    [
      [minLng, minLat],
      [maxLng, minLat],
      [maxLng, maxLat],
      [minLng, maxLat],
      [minLng, minLat],
    ],
  ],
});

describe("hexHit", () => {
  it("parses H3 resolution from the PMTiles source-layer name", () => {
    expect(h3ResolutionFromSourceLayer("hex_z0")).toBe(0);
    expect(h3ResolutionFromSourceLayer("hex_z10")).toBe(10);
    expect(h3ResolutionFromSourceLayer("other")).toBe(0);
  });

  it("reads the cell id from property h, then feature id", () => {
    expect(featureH3CellId({ properties: { h: "abc" }, id: "id" })).toBe("abc");
    expect(featureH3CellId({ id: "id" })).toBe("id");
  });

  it("prefers the H3 cell of the tap over a geometrically closer neighbour", () => {
    const closer = {
      id: "closer",
      properties: { h: "closer" },
      geometry: square(146.9, -42.1, 147.0, -42.0),
    };
    const trueCell = {
      id: "cell-from-h3",
      properties: { h: "cell-from-h3" },
      geometry: square(10, 10, 11, 11),
    };
    const picked = pickHexAmongFeatures([closer, trueCell], {
      sourceLayer: "hex_z4",
      hitSource: "box",
      lngLat: { lng: 147, lat: -42 },
    });
    expect(picked?.id).toBe("cell-from-h3");
  });

  it("keeps the Mapbox point-query feature when H3 is not in the result set", () => {
    const rendered = {
      id: "rendered",
      properties: { h: "rendered" },
      geometry: square(0, 0, 1, 1),
    };
    const picked = pickHexAmongFeatures([rendered], {
      sourceLayer: "hex_z4",
      hitSource: "point",
      lngLat: { lng: 147, lat: -42 },
    });
    expect(picked?.id).toBe("rendered");
  });

  it("uses point-in-polygon when a box query misses the H3 id", () => {
    const outside = {
      id: "outside",
      properties: { h: "outside" },
      geometry: square(0, 0, 1, 1),
    };
    const inside = {
      id: "inside",
      properties: { h: "inside" },
      geometry: square(146, -43, 148, -41),
    };
    const picked = pickHexAmongFeatures([outside, inside], {
      sourceLayer: "hex_z2",
      hitSource: "box",
      lngLat: { lng: 147, lat: -42 },
    });
    expect(picked?.id).toBe("inside");
  });

  it("does not pick a neighbour when a box query hits occupancy gaps", () => {
    const neighbour = {
      id: "neighbour",
      properties: { h: "neighbour" },
      geometry: square(0, 0, 1, 1),
    };
    const picked = pickHexAmongFeatures([neighbour], {
      sourceLayer: "hex_z4",
      hitSource: "box",
      lngLat: { lng: 147, lat: -42 },
    });
    expect(picked).toBeUndefined();
  });

  it("keeps a cell straddling the antimeridian in one piece", () => {
    // A real res-4 hex on the antimeridian, as H3 returns it
    vi.mocked(cellToBoundary).mockReturnValueOnce([
      [-179.8, -59.94],
      [-179.87, -59.74],
      [179.74, -59.7],
      [179.42, -59.85],
      [179.49, -60.05],
      [179.88, -60.09],
      [-179.8, -59.94],
    ]);
    const ring = (h3CellPolygon("cell-from-h3") as Polygon).coordinates[0];
    const lngs = ring.map(([lng]) => lng);
    expect(Math.max(...lngs) - Math.min(...lngs)).toBeLessThan(1);
    expect(ring).toHaveLength(7);
    expect(ring[0]).toEqual(ring[ring.length - 1]);
    expect(ring.map(([, lat]) => lat)).toEqual([
      -59.94, -59.74, -59.7, -59.85, -60.05, -60.09, -59.94,
    ]);
  });

  it("leaves a cell away from the antimeridian untouched", () => {
    const ring = (h3CellPolygon("cell-from-h3") as Polygon).coordinates[0];
    expect(ring).toEqual([
      [147, -42],
      [147.1, -42],
      [147.1, -42.1],
      [147, -42.1],
      [147, -42],
    ]);
  });

  it("detects a point inside a polygon", () => {
    expect(pointInPolygonGeometry(0.5, 0.5, square(0, 0, 1, 1))).toBe(true);
    expect(pointInPolygonGeometry(2, 2, square(0, 0, 1, 1))).toBe(false);
  });
});
