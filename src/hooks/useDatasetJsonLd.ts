import { useEffect } from "react";
import { OGCCollection } from "@/app/store/OGCCollectionDefinitions";
import { CANONICAL_BASE_URL } from "@/utils/seo/canonicalUrl";

// schema.org GeoShape box is "south west north east"; OGC bbox is [west, south, east, north]
const toSpatialCoverage = (collection: OGCCollection) => {
  const bbox = collection.extent?.bbox?.[0];
  if (!bbox || bbox.length !== 4) return undefined;
  const [west, south, east, north] = bbox;
  return {
    "@type": "Place",
    geo: { "@type": "GeoShape", box: `${south} ${west} ${north} ${east}` },
  };
};

// ISO interval "start/end"; ".." for an open end
const toTemporalCoverage = (collection: OGCCollection) => {
  const interval = collection.extent?.temporal?.interval?.[0];
  if (!interval || (!interval[0] && !interval[1])) return undefined;
  return `${interval[0] ?? ".."}/${interval[1] ?? ".."}`;
};

const toKeywords = (collection: OGCCollection) => {
  const keywords = collection
    .getThemes()
    ?.flatMap((theme) => theme.concepts?.map((concept) => concept.id) ?? [])
    .filter(Boolean);
  return keywords?.length ? keywords : undefined;
};

const toCreators = (collection: OGCCollection) => {
  const organizations = collection
    .getContacts()
    ?.map((contact) => contact.organization)
    .filter(Boolean);
  const unique = [...new Set(organizations)];
  return unique.length
    ? unique.map((name) => ({ "@type": "Organization", name }))
    : undefined;
};

/**
 * Injects schema.org/Dataset JSON-LD for the given collection while mounted,
 * so the page is eligible for Google Dataset Search. Optional fields are
 * omitted when the record doesn't have them.
 */
export const useDatasetJsonLd = (collection: OGCCollection | undefined) => {
  useEffect(() => {
    if (!collection?.title || !collection?.description) return;
    const jsonLd = {
      "@context": "https://schema.org",
      "@type": "Dataset",
      name: collection.title,
      // Google recommends descriptions under 5000 characters
      description: collection.description.slice(0, 5000),
      url: `${CANONICAL_BASE_URL}/details/${collection.id}`,
      identifier: collection.id,
      keywords: toKeywords(collection),
      license: collection.getLicense(),
      citation: collection.getCitation()?.suggestedCitation,
      creator: toCreators(collection),
      spatialCoverage: toSpatialCoverage(collection),
      temporalCoverage: toTemporalCoverage(collection),
      dateCreated: collection.properties?.creation,
      dateModified: collection.properties?.revision,
    };
    const script = document.createElement("script");
    script.type = "application/ld+json";
    // JSON.stringify drops undefined-valued fields
    script.text = JSON.stringify(jsonLd);
    document.head.appendChild(script);
    return () => script.remove();
  }, [collection]);
};
