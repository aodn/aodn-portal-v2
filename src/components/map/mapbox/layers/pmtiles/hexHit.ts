import type { Geometry, Position } from "geojson";

export type HexHitSource = "point" | "box";

type H3Module = typeof import("h3-js");

let h3Module: H3Module | undefined;
let h3Load: Promise<H3Module> | undefined;

/** Load the H3 runtime on first hex hover/click — not on details-page parse. */
export const loadH3 = (): Promise<H3Module> => {
  h3Load ??= import("h3-js").then((mod) => {
    h3Module = mod;
    return mod;
  });
  return h3Load;
};

export const getH3 = (): H3Module | undefined => h3Module;

export const h3ResolutionFromSourceLayer = (sourceLayer: string): number => {
  const match = /^hex_z(\d+)$/.exec(sourceLayer);
  return match ? Number(match[1]) : 0;
};

export const featureH3CellId = (feature: {
  id?: string | number;
  properties?: { h?: unknown } | null;
}): string => {
  const fromProp = feature.properties?.h;
  if (fromProp !== undefined && fromProp !== null && fromProp !== "") {
    return String(fromProp);
  }
  if (feature.id !== undefined && feature.id !== null) {
    return String(feature.id);
  }
  return "";
};

export const tapH3Cell = (
  lat: number,
  lng: number,
  resolution: number
): string | undefined => {
  const h3 = getH3();
  if (!h3) return undefined;
  try {
    return h3.latLngToCell(lat, lng, resolution);
  } catch {
    return undefined;
  }
};

/** Prefer the resolution encoded in a real cell id over the `hex_zN` band name. */
export const inferH3Resolution = (
  candidates: Array<{
    id?: string | number;
    properties?: { h?: unknown } | null;
  }>,
  sourceLayer: string
): number => {
  const h3 = getH3();
  if (h3) {
    for (const feature of candidates) {
      const id = featureH3CellId(feature);
      if (!id) continue;
      try {
        if (h3.isValidCell(id)) return h3.getResolution(id);
      } catch {
        // keep scanning
      }
    }
  }
  return h3ResolutionFromSourceLayer(sourceLayer);
};

export const h3CellLngLat = (
  cellId: string
): { lng: number; lat: number } | undefined => {
  const h3 = getH3();
  if (!h3) return undefined;
  try {
    if (!h3.isValidCell(cellId)) return undefined;
    const [lat, lng] = h3.cellToLatLng(cellId);
    return { lng, lat };
  } catch {
    return undefined;
  }
};

export const h3CellPolygon = (cellId: string): Geometry | undefined => {
  const h3 = getH3();
  if (!h3) return undefined;
  try {
    if (!h3.isValidCell(cellId)) return undefined;
    const ring = h3.cellToBoundary(cellId, true);
    if (ring.length < 3) return undefined;
    const first = ring[0];
    const last = ring[ring.length - 1];
    const closed =
      first[0] === last[0] && first[1] === last[1] ? ring : [...ring, first];
    return { type: "Polygon", coordinates: [closed] };
  } catch {
    return undefined;
  }
};

const pointInRing = (lng: number, lat: number, ring: Position[]): boolean => {
  let inside = false;
  for (let i = 0, j = ring.length - 1; i < ring.length; j = i++) {
    const xi = ring[i][0];
    const yi = ring[i][1];
    const xj = ring[j][0];
    const yj = ring[j][1];
    const intersect =
      yi > lat !== yj > lat &&
      lng < ((xj - xi) * (lat - yi)) / (yj - yi + Number.EPSILON) + xi;
    if (intersect) inside = !inside;
  }
  return inside;
};

export const pointInPolygonGeometry = (
  lng: number,
  lat: number,
  geometry: Geometry | undefined
): boolean => {
  if (!geometry) return false;
  if (geometry.type === "Polygon") {
    const [outer, ...holes] = geometry.coordinates;
    if (!outer || !pointInRing(lng, lat, outer)) return false;
    return !holes.some((hole) => pointInRing(lng, lat, hole));
  }
  if (geometry.type === "MultiPolygon") {
    return geometry.coordinates.some((polygon) => {
      const [outer, ...holes] = polygon;
      if (!outer || !pointInRing(lng, lat, outer)) return false;
      return !holes.some((hole) => pointInRing(lng, lat, hole));
    });
  }
  return false;
};

/**
 * Choose the hex under a tap.
 *
 * Prefer the H3 cell for the tap (true cell, independent of tile clipping).
 * A Mapbox point query already hit-tested the fill; if H3 is missing from the
 * result set, keep that feature. A padded box query only keeps a hex that
 * actually contains the tap — never the nearest neighbour in an occupancy gap.
 */
export const pickHexAmongFeatures = <
  T extends {
    id?: string | number;
    geometry?: Geometry;
    properties?: { h?: unknown } | null;
  },
>(
  candidates: T[],
  opts: {
    sourceLayer: string;
    hitSource: HexHitSource;
    lngLat?: { lng: number; lat: number };
  }
): T | undefined => {
  if (!candidates.length) return undefined;

  if (opts.lngLat) {
    const cell = tapH3Cell(
      opts.lngLat.lat,
      opts.lngLat.lng,
      inferH3Resolution(candidates, opts.sourceLayer)
    );
    if (cell) {
      const matched = candidates.find(
        (feature) => featureH3CellId(feature) === cell
      );
      if (matched) return matched;
    }
  }

  if (opts.hitSource === "point") {
    return candidates[0];
  }

  if (opts.lngLat) {
    return candidates.find((feature) =>
      pointInPolygonGeometry(
        opts.lngLat!.lng,
        opts.lngLat!.lat,
        feature.geometry
      )
    );
  }

  return undefined;
};
