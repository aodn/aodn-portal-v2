import { latLngToCell } from "h3-js";
import type { Geometry, Position } from "geojson";

export type HexHitSource = "point" | "box";

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
  try {
    return latLngToCell(lat, lng, resolution);
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

const minScreenDistSqToGeometry = (
  tapPoint: { x: number; y: number },
  geometry: Geometry | undefined,
  project: (lngLat: { lng: number; lat: number }) => { x: number; y: number }
): number => {
  if (!geometry) return Number.POSITIVE_INFINITY;
  const rings: Position[][] =
    geometry.type === "Polygon"
      ? geometry.coordinates
      : geometry.type === "MultiPolygon"
        ? geometry.coordinates.flat()
        : [];
  let min = Number.POSITIVE_INFINITY;
  for (const ring of rings) {
    for (const pos of ring) {
      const screen = project({ lng: pos[0], lat: pos[1] });
      const dx = screen.x - tapPoint.x;
      const dy = screen.y - tapPoint.y;
      const dist = dx * dx + dy * dy;
      if (dist < min) min = dist;
    }
  }
  return min;
};

/**
 * Choose the hex under a tap.
 *
 * Prefer the H3 cell for the tap (true cell, independent of tile clipping).
 * A Mapbox point query already hit-tested the fill; if H3 is missing from the
 * result set, keep that feature. A padded box query falls back to
 * point-in-polygon, then nearest vertex in screen space (fat-finger only).
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
    tapPoint?: { x: number; y: number };
    project: (lngLat: { lng: number; lat: number }) => { x: number; y: number };
  }
): T | undefined => {
  if (!candidates.length) return undefined;

  if (opts.lngLat) {
    const cell = tapH3Cell(
      opts.lngLat.lat,
      opts.lngLat.lng,
      h3ResolutionFromSourceLayer(opts.sourceLayer)
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
    const contained = candidates.find((feature) =>
      pointInPolygonGeometry(
        opts.lngLat!.lng,
        opts.lngLat!.lat,
        feature.geometry
      )
    );
    if (contained) return contained;
  }

  if (!opts.tapPoint) return candidates[0];

  let best: T | undefined;
  let bestDist = Number.POSITIVE_INFINITY;
  for (const feature of candidates) {
    const dist = minScreenDistSqToGeometry(
      opts.tapPoint,
      feature.geometry,
      opts.project
    );
    if (dist < bestDist) {
      bestDist = dist;
      best = feature;
    }
  }
  return best ?? candidates[0];
};
