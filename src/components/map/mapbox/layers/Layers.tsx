import { PropsWithChildren } from "react";
import {
  Feature,
  FeatureCollection,
  GeoJsonProperties,
  Geometry,
  Point,
} from "geojson";
import { LngLat, LngLatBounds, MapMouseEvent } from "mapbox-gl";
import { OGCCollection } from "../../../common/store/OGCCollectionDefinitions";
import { AustraliaMarineParkLayer, StaticLayersDef } from "./StaticLayer";
import MapboxWorldLayer, { MapboxWorldLayersDef } from "./MapboxWorldLayer";

export interface LayersProps {
  // Tile layer should added to map
  collections?: Array<OGCCollection>;
  // Event fired when user click on the point layer
  onDatasetSelected?: (uuids: Array<string>) => void;
  // dataset that user selected from result list or map
  selectedUuids?: string[];
}
// Use to create static layer on map, you need to add menu item to select those layers,
// refer to map section
const createStaticLayers = (ids: Array<string>) => (
  <>
    {ids.map((id) => {
      if (id === StaticLayersDef.AUSTRALIA_MARINE_PARKS.id) {
        return <AustraliaMarineParkLayer key={"s" + id} />;
      } else if (id === MapboxWorldLayersDef.WORLD.id) {
        return <MapboxWorldLayer key={"mb" + MapboxWorldLayersDef.WORLD.id} />;
      }
    })}
  </>
);

// Given an array of OGCCollections, we convert it to a cluster layer by adding all the feature items
// in a collection to the FeatureCollection
const createCenterOfMassDataSource = (
  collections: Array<OGCCollection> | undefined
): FeatureCollection<Point> => {
  const featureCollections: FeatureCollection<Point> = {
    type: "FeatureCollection",
    features: new Array<Feature<Point, GeoJsonProperties>>(),
  };

  collections?.forEach((collection) => {
    // We skip the first one which is the overall bounding box, then add the remaining
    collection.getCentroid()?.forEach((i) =>
      featureCollections.features.push({
        ...i,
        // Add the id so we can reference it easily
        properties: { uuid: collection.id },
      })
    );
  });

  return featureCollections;
};

// Function to check if a point is within the map's visible bounds
const isFeatureVisible = (
  feature: Feature<Point, GeoJsonProperties>,
  map: mapboxgl.Map
): boolean => {
  const bounds: LngLatBounds = map.getBounds();
  const coordinates = feature.geometry.coordinates as [number, number];
  const lngLat = new LngLat(coordinates[0], coordinates[1]);
  return bounds.contains(lngLat);
};

// Function to determine the most "visible" point
const findMostVisiblePoint = (
  featureCollection: FeatureCollection<Point>,
  map: mapboxgl.Map | null | undefined
): FeatureCollection<Geometry> => {
  const featureCollections: FeatureCollection<Point> = {
    type: "FeatureCollection",
    features: new Array<Feature<Point, GeoJsonProperties>>(),
  };
  if (!map) return featureCollection;

  // Filter the points that are visible
  const visibleFeatures = featureCollection.features.filter((feature) =>
    isFeatureVisible(feature, map)
  );

  if (visibleFeatures.length === 0) return featureCollections;

  // If more than one point is visible, we select one (e.g., based on proximity to the center)
  // This part can be adjusted based on criteria (distance from center, zoom, etc.)
  const mapCenter = map.getCenter();
  visibleFeatures.sort((a, b) => {
    const distA = mapCenter.distanceTo(
      new LngLat(a.geometry.coordinates[0], a.geometry.coordinates[1])
    );
    const distB = mapCenter.distanceTo(
      new LngLat(b.geometry.coordinates[0], b.geometry.coordinates[1])
    );
    return distA - distB; // Sort by proximity to the map center
  });
  // Since it is sorted by distance, we just need to add a feature once
  // based on uuid.
  const uniqueFeatures = new Map<string, Feature<Point, GeoJsonProperties>>();
  for (const feature of visibleFeatures) {
    if (!uniqueFeatures.has(feature.properties?.uuid)) {
      uniqueFeatures.set(feature.properties?.uuid, feature);
    }
  }
  // Get all values
  featureCollections.features = [...uniqueFeatures.values()];
  return featureCollections; // Return the most visible point (closest to center)
};

const defaultMouseEnterEventHandler = (ev: MapMouseEvent): void => {
  ev.target.getCanvas().style.cursor = "pointer";
};

const defaultMouseLeaveEventHandler = (ev: MapMouseEvent): void => {
  ev.target.getCanvas().style.cursor = "";
};

const Layers = (props: PropsWithChildren<LayersProps>) => {
  return <>{props.children}</>;
};

export default Layers;

export {
  createStaticLayers,
  createCenterOfMassDataSource,
  defaultMouseEnterEventHandler,
  defaultMouseLeaveEventHandler,
  findMostVisiblePoint,
};
