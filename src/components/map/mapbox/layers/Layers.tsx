import { PropsWithChildren } from "react";
import {
  Feature,
  FeatureCollection,
  GeoJsonProperties,
  Geometry,
} from "geojson";
import { centroid } from "@turf/turf";
import { MapMouseEvent } from "mapbox-gl";
import { OGCCollection } from "../../../common/store/OGCCollectionDefinitions";

export interface LayersProps {
  // Tile layer should added to map
  collections?: Array<OGCCollection>;
  // Event fired when user click on the point layer
  onDatasetSelected?: (uuid: Array<string>) => void;
  onClickPopup?: (uuid: string) => void;
}

// Given an array of OGCCollections, we convert it to a cluster layer by adding all the feature items
// in a collection to the FeatureCollection
const createCentroidDataSource = (
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
        ...centroid(i.geometry),
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
  createCentroidDataSource,
  defaultMouseEnterEventHandler,
  defaultMouseLeaveEventHandler,
};
