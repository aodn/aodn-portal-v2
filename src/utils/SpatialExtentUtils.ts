import { Feature, FeatureCollection, GeometryCollection } from "geojson";
import { bbox as turfBbox } from "@turf/turf";

// One described location from the record's metadata, e.g. a named site
export interface ISpatialExtent {
  description: string;
  bbox: Array<number>;
}

// The indexer writes each extent's description onto its geometries, turn those
// members into {description, bbox} entries for the matcher below
export const spatialExtentsFromGeometry = (
  geometry: GeometryCollection | undefined
): Array<ISpatialExtent> => {
  if (!geometry?.geometries) return [];
  const extents: Array<ISpatialExtent> = [];
  for (const geometryMember of geometry.geometries) {
    const description = (geometryMember as { description?: unknown })
      .description;
    if (typeof description !== "string" || description === "") continue;
    extents.push({ description, bbox: [...turfBbox(geometryMember)] });
  }
  return extents;
};

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
  const containingExtents = spatialExtents.filter((extent) =>
    bboxContains(extent.bbox, featureBbox)
  );
  if (containingExtents.length === 0) return [];
  const smallestArea = Math.min(
    ...containingExtents.map((extent) => bboxArea(extent.bbox))
  );
  return containingExtents.filter(
    (extent) => bboxArea(extent.bbox) <= smallestArea
  );
};

// Read back what attachSpatialExtentDescriptions wrote on the clicked features, without repeats.
// Mapbox returns array properties as JSON strings, so parse them.
export const readDescriptions = (
  features: Array<Feature> | undefined
): Array<string> => {
  const parseDescriptions = (propertyValue: unknown): Array<string> => {
    if (Array.isArray(propertyValue)) return propertyValue;
    try {
      return typeof propertyValue === "string" ? JSON.parse(propertyValue) : [];
    } catch {
      return [];
    }
  };
  return [
    ...new Set(
      (features ?? []).flatMap((feature) =>
        parseDescriptions(feature.properties?.descriptions)
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
