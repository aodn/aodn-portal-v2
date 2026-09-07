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

// The spatial extents tied for the smallest bbox holding the feature. Ties matter:
// several sites can share one spot, and each keeps its own text
const findExtentsAround = (
  feature: Feature,
  spatialExtents: Array<ISpatialExtent>
): Array<ISpatialExtent> => {
  const featureBbox = turfBbox(feature);
  const around = spatialExtents.filter((extent) =>
    bboxContains(extent.bbox, featureBbox)
  );
  if (around.length === 0) return [];
  const smallestArea = Math.min(
    ...around.map((extent) => bboxArea(extent.bbox))
  );
  return around.filter((extent) => bboxArea(extent.bbox) <= smallestArea);
};

// Read back what attachSpatialExtentDescriptions wrote on the clicked features, without repeats.
// Mapbox returns array properties as JSON strings, so parse them.
export const readDescriptions = (
  features: Array<Feature> | undefined
): Array<string> => {
  const ofOneFeature = (value: unknown): Array<string> => {
    if (Array.isArray(value)) return value;
    try {
      return typeof value === "string" ? JSON.parse(value) : [];
    } catch {
      return [];
    }
  };
  return [
    ...new Set(
      (features ?? []).flatMap((feature) =>
        ofOneFeature(feature.properties?.descriptions)
      )
    ),
  ];
};

// Set properties.descriptions on every feature that sits inside one of the spatial extents,
// so the map popup can list them. A feature inside several extents gets the smallest ones.
export const attachSpatialExtentDescriptions = (
  featureCollection: FeatureCollection | undefined,
  spatialExtents: Array<ISpatialExtent> | undefined
): FeatureCollection | undefined => {
  if (!featureCollection || !spatialExtents?.length) return featureCollection;

  const features = featureCollection.features.map((feature) => {
    const extents = findExtentsAround(feature, spatialExtents);
    if (extents.length === 0) return feature;
    return {
      ...feature,
      properties: {
        ...feature.properties,
        descriptions: extents.map((extent) => extent.description),
      },
    };
  });

  return { ...featureCollection, features };
};
