import {
  Feature,
  FeatureCollection,
  MultiPolygon,
  Point,
  Polygon,
} from "geojson";
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
      collection.extent?.getGeojsonFromBBox(1).features.forEach((i) =>
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

const bboxToPolygon = (bbox: [number, number, number, number]): Polygon => {
  const [minLon, minLat, maxLon, maxLat] = bbox;
  return {
    type: "Polygon",
    coordinates: [
      [
        [minLon, minLat],
        [maxLon, minLat],
        [maxLon, maxLat],
        [minLon, maxLat],
        [minLon, minLat],
      ],
    ],
  };
};

export const combineBBoxesToMultiPolygon = (
  bboxes: [number, number, number, number][]
): MultiPolygon => {
  const polygons = bboxes.map(bboxToPolygon);
  return {
    type: "MultiPolygon",
    coordinates: polygons.map((polygon) => polygon.coordinates),
  };
};

export const combineToMultiPolygon = (
  bboxes: [number, number, number, number][],
  polygonCoords: [number, number][][]
): MultiPolygon => {
  const bboxPolygons = bboxes.map(bboxToPolygon);

  const freeformPolygons: Polygon[] = polygonCoords.map((coords) => {
    // Ensure ring is closed (first and last coordinate must match)
    const closed =
      coords.length > 0 &&
      (coords[0][0] !== coords[coords.length - 1][0] ||
        coords[0][1] !== coords[coords.length - 1][1])
        ? [...coords, coords[0]]
        : coords;
    return {
      type: "Polygon",
      coordinates: [closed],
    };
  });

  const allPolygons = [...bboxPolygons, ...freeformPolygons];
  return {
    type: "MultiPolygon",
    coordinates: allPolygons.map((polygon) => polygon.coordinates),
  };
};

export const layernameRoughlyMatch = (text1: string, text2: string) => {
  if (text1 == null || text2 == null) {
    return false;
  }

  let normalized1 = text1.includes(":")
    ? text1.substring(text1.indexOf(":") + 1)
    : text1;
  let normalized2 = text2.includes(":")
    ? text2.substring(text2.indexOf(":") + 1)
    : text2;

  normalized1 = normalized1.split("/")[0];
  normalized2 = normalized2.split("/")[0];

  return normalized1 === normalized2;
};
