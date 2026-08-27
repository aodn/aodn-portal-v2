/**
 * Builds the Dataset JSON-LD each detail page carries — what gets records
 * into Google Dataset Search.
 */

import type { Dataset, WithContext } from "schema-dts";
import type { OGCCollection } from "./fetchCollections";
import { detailsUrl } from "./constants";

// https://developers.google.com/search/docs/appearance/structured-data/dataset
export const buildJsonLd = (
  collection: OGCCollection
): WithContext<Dataset> => ({
  "@context": "https://schema.org",
  "@type": "Dataset",
  name: collection.title,
  // Google recommends descriptions under 5000 characters
  description: collection.description?.slice(0, 5000),
  url: detailsUrl(collection.id),
  identifier: collection.id,
  // date only: the metadata timestamps carry no timezone
  datePublished: collection.getCreation()?.slice(0, 10),
  dateModified: collection.getRevision()?.slice(0, 10),
  keywords: toKeywords(collection.getThemes()),
  // TODO IMOS records only; every record has one in contacts, which the bulk
  // endpoint does not return
  creator: toCreator(collection.getDatasetProvider()),
  spatialCoverage: toSpatialCoverage(collection.getBBox()),
  temporalCoverage: toTemporalCoverage(collection.extent?.temporal?.interval),
  license: collection.getLicense(),
  citation: collection.getCitation()?.suggestedCitation,
});

// schema.org GeoShape box is "south west north east"; OGC bbox is [west, south, east, north]
const toSpatialCoverage = (bbox?: number[][]): Dataset["spatialCoverage"] => {
  const box = bbox?.[0];
  if (!box || box.length !== 4) return undefined;
  const [west, south, east, north] = box;
  return {
    "@type": "Place",
    geo: { "@type": "GeoShape", box: `${south} ${west} ${north} ${east}` },
  };
};

// ISO interval "start/end"; ".." for an open end
const toTemporalCoverage = (
  intervals?: (string | null)[][]
): Dataset["temporalCoverage"] => {
  const interval = intervals?.[0];
  if (!interval || (!interval[0] && !interval[1])) return undefined;
  return `${interval[0] ?? ".."}/${interval[1] ?? ".."}`;
};

const toCreator = (organisation?: string): Dataset["creator"] =>
  organisation ? { "@type": "Organization", name: organisation } : undefined;

const toKeywords = (
  themes?: { concepts: { id: string }[] }[]
): Dataset["keywords"] => {
  const keywords = (themes ?? [])
    .flatMap((theme) => theme.concepts?.map((concept) => concept.id) ?? [])
    .filter(Boolean);
  return keywords.length ? keywords : undefined;
};
