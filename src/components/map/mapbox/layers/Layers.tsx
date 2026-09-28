import { Dispatch, PropsWithChildren, SetStateAction } from "react";
import { Feature, FeatureCollection, GeoJsonProperties, Point } from "geojson";
import { LngLatBounds, MapMouseEvent, LngLat, Map as Mapbox } from "mapbox-gl";
import { distance } from "@turf/distance";
import { point } from "@turf/helpers";
import { TabNavigation } from "@/hooks/useTabNavigation";
import { OGCCollection } from "@/app/store/OGCCollectionDefinitions";

export interface LayerBasicType<P = GeoJsonProperties> {
  // Tile layer should add to map
  featureCollection?: FeatureCollection<Point, P>;
  // Event fired when user clicks on the point layer
  onClickMapPoint?: (uuids: Array<string>) => void;
  // dataset that user selected from the result list or map
  selectedUuids?: string[];
  tabNavigation?: TabNavigation;
  // True to make the centroid more sticky, so that centroid will stay in current
  // location even map drag. Centroid only move when it is an absolute necessary like
  // outside of viewport.
  preferCurrentCentroid?: boolean;
  visible?: boolean;
  setTimeSliderSupport?: Dispatch<SetStateAction<boolean>>;
  setDiscreteTimeSliderValues?: Dispatch<
    SetStateAction<Map<string, Array<number>> | null | undefined>
  >;
  setDrawRectSupportSupport?: Dispatch<SetStateAction<boolean>>;
  collection?: OGCCollection;
}

/** Layer-owned dataset/product picker. UI is portaled above the map. */
export interface LayerSelectable<T> {
  layerConfig: T;
  onLayerChange?: (layerName: string) => void;
}

const normalizeLongitude = (lng: number) =>
  ((((lng + 180) % 360) + 360) % 360) - 180;

// Use to handle bounds across meridian
const splitLngLatBounds = (bounds: LngLatBounds): Array<LngLatBounds> => {
  const sw = bounds.getSouthWest(); // Southwest corner
  const ne = bounds.getNorthEast(); // Northeast corner

  // We need to make it between -180 to 180 for checking
  const normalNeLng = normalizeLongitude(ne.lng);
  const normalSwLng = normalizeLongitude(sw.lng);
  // Check if the bounds cross the anti-meridian
  if (normalNeLng < normalSwLng) {
    // Split into two parts: one from -180 to 180 and one from 180 to -180

    const leftBounds = new LngLatBounds(
      new LngLat(normalSwLng, sw.lat), // Left side (from -180 to 180)
      new LngLat(180, ne.lat)
    );

    const rightBounds = new LngLatBounds(
      new LngLat(-180, sw.lat), // Right side (from 180 to -180)
      new LngLat(normalNeLng, ne.lat)
    );

    return [leftBounds, rightBounds];
  }
  // If it doesn't cross the anti-meridian, return the original bounds
  return [bounds];
};

// Function to check if a point is within the map's visible bounds
const isFeatureVisible = (
  feature: Feature<Point, GeoJsonProperties>,
  bounds: LngLatBounds
): boolean => {
  const coordinates = feature.geometry.coordinates as [number, number];
  return splitLngLatBounds(bounds).some((polygon) =>
    polygon.contains(coordinates)
  );
};

// One visible point per dataset. Keep the previous centroid when it is still
// on screen; otherwise keep the candidate closest to the map centre.
// Distance is computed only when a uuid has more than one candidate.
const findSuitableVisiblePoint = (
  featureCollection: FeatureCollection<Point>,
  map: Mapbox | null | undefined = undefined,
  currentVisibleCollection: FeatureCollection<Point> | undefined = undefined,
  preferCurrentCentroid: boolean = true
): FeatureCollection<Point> => {
  if (!map) return featureCollection;

  const bounds = map.getBounds();
  if (!bounds) {
    return { type: "FeatureCollection", features: [] };
  }
  const currentByUuid = new Map<string, Feature<Point, GeoJsonProperties>>();
  if (preferCurrentCentroid) {
    for (const feature of currentVisibleCollection?.features ?? []) {
      if (!isFeatureVisible(feature, bounds)) continue;
      const id = feature.properties?.uuid;
      if (id !== undefined && !currentByUuid.has(id)) {
        currentByUuid.set(id, feature);
      }
    }
  }

  const chosen = new Map<
    string,
    { feature: Feature<Point, GeoJsonProperties>; distanceKm: number }
  >();
  let mapCenter: ReturnType<typeof point> | undefined;
  const distanceToCenter = (feature: Feature<Point, GeoJsonProperties>) => {
    mapCenter ??= point([map.getCenter().lng, map.getCenter().lat]);
    return distance(mapCenter, feature.geometry.coordinates, {
      units: "kilometers",
    });
  };

  for (const feature of featureCollection.features) {
    if (!isFeatureVisible(feature, bounds)) continue;
    const id = feature.properties?.uuid;
    if (id === undefined) continue;

    const previous = currentByUuid.get(id);
    if (previous) {
      if (!chosen.has(id)) {
        chosen.set(id, { feature: previous, distanceKm: 0 });
      }
      continue;
    }

    const existing = chosen.get(id);
    if (!existing) {
      chosen.set(id, { feature, distanceKm: Number.NaN });
      continue;
    }

    const nextDistance = distanceToCenter(feature);
    const currentDistance = Number.isNaN(existing.distanceKm)
      ? distanceToCenter(existing.feature)
      : existing.distanceKm;
    existing.distanceKm = currentDistance;
    if (nextDistance < currentDistance) {
      chosen.set(id, { feature, distanceKm: nextDistance });
    }
  }

  return {
    type: "FeatureCollection",
    features: [...chosen.values()]
      .map((entry) => entry.feature)
      .sort((a, b) => a.properties?.uuid.localeCompare(b.properties?.uuid)),
  };
};

const defaultMouseEnterEventHandler = (ev: MapMouseEvent): void => {
  ev.target.getCanvas().style.cursor = "pointer";
};

const defaultMouseLeaveEventHandler = (ev: MapMouseEvent): void => {
  ev.target.getCanvas().style.cursor = "";
};

const Layers = (props: PropsWithChildren<LayerBasicType>) => {
  return <>{props.children}</>;
};

export default Layers;

export {
  defaultMouseEnterEventHandler,
  defaultMouseLeaveEventHandler,
  findSuitableVisiblePoint,
  isFeatureVisible,
};
