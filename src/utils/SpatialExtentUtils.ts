import { Feature, FeatureCollection } from "geojson";
import { bbox as turfBbox } from "@turf/turf";
import { ISpatialExtent } from "@/app/store/OGCCollectionDefinitions";

// Coordinates this close are the same place: far above float noise, far below the spacing of real sites
const ONE_DEGREE_IN_METERS = 111_000;
const SAME_PLACE_IN_METERS = 0.1;
const BBOX_TOLERANCE = SAME_PLACE_IN_METERS / ONE_DEGREE_IN_METERS;

// A bbox is [west, south, east, north]
const bboxContains = (outer: Array<number>, inner: Array<number>): boolean => {
  if (outer.length !== 4 || inner.length !== 4) return false;
  const [outerWest, outerSouth, outerEast, outerNorth] = outer;
  const [west, south, east, north] = inner;
  return (
    west >= outerWest - BBOX_TOLERANCE &&
    south >= outerSouth - BBOX_TOLERANCE &&
    east <= outerEast + BBOX_TOLERANCE &&
    north <= outerNorth + BBOX_TOLERANCE
  );
};

const bboxArea = (bbox: Array<number>): number => {
  const [west, south, east, north] = bbox;
  return (east - west) * (north - south);
};

// The smallest spatial extent whose bbox holds the feature, undefined if none does
const findExtentAround = (
  feature: Feature,
  spatialExtents: Array<ISpatialExtent>
): ISpatialExtent | undefined => {
  const featureBbox = turfBbox(feature);
  const around = spatialExtents.filter((extent) =>
    bboxContains(extent.bbox, featureBbox)
  );
  if (around.length === 0) return undefined;
  return around.reduce((smallest, extent) =>
    bboxArea(extent.bbox) < bboxArea(smallest.bbox) ? extent : smallest
  );
};

// Set properties.description on every feature that sits inside one of the spatial extents,
// so the map popup can show it. A feature inside several extents gets the smallest one.
export const attachSpatialExtentDescriptions = (
  featureCollection: FeatureCollection | undefined,
  spatialExtents: Array<ISpatialExtent> | undefined
): FeatureCollection | undefined => {
  if (!featureCollection || !spatialExtents?.length) return featureCollection;

  const features = featureCollection.features.map((feature) => {
    const extent = findExtentAround(feature, spatialExtents);
    if (!extent) return feature;
    return {
      ...feature,
      properties: { ...feature.properties, description: extent.description },
    };
  });

  return { ...featureCollection, features };
};
