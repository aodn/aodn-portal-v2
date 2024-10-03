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
import * as turf from "@turf/turf";

export interface LayersProps {
  // Tile layer should added to map
  collections?: Array<OGCCollection>;
  // Event fired when user click on the point layer
  onDatasetSelected?: (uuids: Array<string>) => void;
  // dataset that user selected from result list or map
  selectedUuids?: string[];
  showFullMap?: boolean;
  onNavigateToDetail?: (uuid: string) => void;
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
    if (collection.getCentroid()) {
      // If data contains pre-calculated centroid then use it
      collection.getCentroid()?.forEach((i) =>
        featureCollections.features.push({
          ...i,
          // Add the id so we can reference it easily
          properties: { uuid: collection.id },
        })
      );
    } else {
      // Do calculation based on extents bounding box, this is old way of doing things
      // for backward compatable
      // We skip the first one which is the overall bounding box, then add the remaining
      collection.extent?.getGeojsonExtents(1).features.forEach((i) =>
        featureCollections.features.push({
          ...turf.centerOfMass(i.geometry),
          // Add the id so we can reference it easily
          properties: { uuid: collection.id },
        })
      );
    }
  });

  return featureCollections;
};

// Function to check if a point is within the map's visible bounds
const isFeatureVisible = (
  feature: Feature<Point, GeoJsonProperties>,
  bounds: LngLatBounds
): boolean => {
  const coordinates = feature.geometry.coordinates as [number, number];
  return bounds.contains(coordinates);
};

// Function to determine the most "visible" point
const findSuitableVisiblePoint = (
  featureCollection: FeatureCollection<Point>,
  map: mapboxgl.Map | null | undefined = undefined,
  currentVisibleCollection: FeatureCollection<Point> | undefined = undefined
): FeatureCollection<Point> => {
  const featureCollections: FeatureCollection<Point> = {
    type: "FeatureCollection",
    features: new Array<Feature<Point, GeoJsonProperties>>(),
  };
  if (!map) return featureCollection;

  const bounds: LngLatBounds = map.getBounds();
  // Filter the points that are visible
  const visibleFeatures = featureCollection.features.filter((feature) =>
    isFeatureVisible(feature, bounds)
  );
  // After map move some currentVisible point no longer visible.
  const currentVisible = currentVisibleCollection?.features.filter((feature) =>
    isFeatureVisible(feature, bounds)
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
      // for the same visible record
      const f = currentVisible?.find((o) => o.properties?.uuid === id);
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

const Layers = (props: PropsWithChildren<LayersProps>) => {
  return <>{props.children}</>;
};

export default Layers;

export {
  createStaticLayers,
  createCenterOfMassDataSource,
  defaultMouseEnterEventHandler,
  defaultMouseLeaveEventHandler,
  findSuitableVisiblePoint,
};
