import { Feature, FeatureCollection, Point } from "geojson";
import { OGCCollection } from "../components/common/store/OGCCollectionDefinitions";
import * as turf from "@turf/turf";

export const generateFeatureCollectionFrom = (
  collections: OGCCollection[] | undefined
): FeatureCollection<Point> => {
  const featureCollections: FeatureCollection<Point> = {
    type: "FeatureCollection",
    features: new Array<Feature<Point>>(),
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
      // Do calculation base on extents bounding box, this is old way of doing things
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
