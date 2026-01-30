import { Dispatch, PropsWithChildren, SetStateAction } from "react";
import { Feature, FeatureCollection, GeoJsonProperties, Point } from "geojson";
import { LngLatBounds, MapMouseEvent, LngLat, Map as Mapbox } from "mapbox-gl";
import { MarineParkLayer, StaticLayersDef } from "./StaticLayer";
import MapboxWorldLayer, { MapboxWorldLayersDef } from "./MapboxWorldLayer";
import * as turf from "@turf/turf";
import { TabNavigation } from "../../../../hooks/useTabNavigation";
import { OGCCollection } from "../../../common/store/OGCCollectionDefinitions";

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
    SetStateAction<Map<string, Array<number>> | undefined>
  >;
  setDrawRectSupportSupport?: Dispatch<SetStateAction<boolean>>;
  collection?: OGCCollection;
}
// Use to create a static layer on a map, you need to add a menu item to select those layers,
// refer to a map section
const createStaticLayers = (ids: Array<string>) => (
  <>
    {ids.map((id) => {
      switch (id) {
        case StaticLayersDef.AUSTRALIA_MARINE_PARKS.id: {
          return (
            <MarineParkLayer
              key={"s" + id}
              {...StaticLayersDef.AUSTRALIA_MARINE_PARKS}
            />
          );
        }
        case StaticLayersDef.MEOW.id: {
          return <MarineParkLayer key={"s" + id} {...StaticLayersDef.MEOW} />;
        }
        case MapboxWorldLayersDef.WORLD.id:
          return (
            <MapboxWorldLayer key={"mb" + MapboxWorldLayersDef.WORLD.id} />
          );
      }
    })}
  </>
);

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

// Function to determine the most "visible" point
const findSuitableVisiblePoint = (
  featureCollection: FeatureCollection<Point>,
  map: Mapbox | null | undefined = undefined,
  currentVisibleCollection: FeatureCollection<Point> | undefined = undefined,
  preferCurrentCentroid: boolean = true
): FeatureCollection<Point> => {
  const featureCollections: FeatureCollection<Point> = {
    type: "FeatureCollection",
    features: new Array<Feature<Point>>(),
  };
  if (!map) return featureCollection;

  const bounds: LngLatBounds | null = map.getBounds();

  // Filter the points that are visible
  const visibleFeatures = featureCollection.features.filter((feature) =>
    isFeatureVisible(feature, bounds!)
  );
  // After map move some currentVisible point no longer visible.
  const currentVisible = currentVisibleCollection?.features.filter((feature) =>
    isFeatureVisible(feature, bounds!)
  );

  if (visibleFeatures.length === 0) return featureCollections;

  // If more than one point is visible, we select one (e.g., based on proximity to the center)
  // This part can be adjusted based on criteria (distance from center, zoom, etc.)
  const mapCenter = turf.point([map.getCenter().lng, map.getCenter().lat]);
  visibleFeatures.sort((a, b) => {
    const distA = turf.distance(mapCenter, a.geometry.coordinates, {
      units: "kilometers",
    });
    const distB = turf.distance(mapCenter, b.geometry.coordinates, {
      units: "kilometers",
    });
    return distA - distB; // Sort by proximity to the map center
  });
  // Since it is sorted by distance, we just need to add a feature once
  // based on uuid. So each uuid appear once with the visible area and
  // it is as close to center as it can.
  const uniqueFeatures = new Map<string, Feature<Point, GeoJsonProperties>>();

  for (const feature of visibleFeatures) {
    const id = feature.properties?.uuid;
    if (!uniqueFeatures.has(id)) {
      // Is this point visible in previous search? If yes then we prefer this
      // point over the most center point, this helps to reduce point change
      // for the same visible record if preferCurrentCentroid is true
      const f = preferCurrentCentroid
        ? currentVisible?.find((o) => o.properties?.uuid === id)
        : feature;
      uniqueFeatures.set(feature.properties?.uuid, f ? f : feature);
    }
  }
  // Get all values and sort by uuid because cluster map require
  // consistance sorting order. Used map and get values() destroy order
  featureCollections.features = [...uniqueFeatures.values()].sort((a, b) =>
    a.properties?.uuid.localeCompare(b.properties?.uuid)
  );
  return featureCollections; // Return the most visible point (closest to center)
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
  createStaticLayers,
  defaultMouseEnterEventHandler,
  defaultMouseLeaveEventHandler,
  findSuitableVisiblePoint,
  isFeatureVisible,
};
