import { PropsWithChildren } from "react";
import {
  Feature,
  FeatureCollection,
  GeoJsonProperties,
  Geometry,
} from "geojson";
import { centerOfMass } from "@turf/turf";
import { MapMouseEvent } from "mapbox-gl";
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
): FeatureCollection => {
  const featureCollections: FeatureCollection = {
    type: "FeatureCollection",
    features: new Array<Feature<Geometry, GeoJsonProperties>>(),
  };

  collections?.forEach((collection) => {
    // We skip the first one which is the overall bounding box, then add the remaining
    collection.extent?.getGeojsonExtents(1).features.forEach((i) =>
      featureCollections.features.push({
        ...centerOfMass(i.geometry),
        // Add the id so we can reference it easily
        properties: { uuid: collection.id },
      })
    );
  });

  return featureCollections;
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
};
