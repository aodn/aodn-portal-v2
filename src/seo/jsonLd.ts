/**
 * Builds the Dataset JSON-LD each detail page carries — what gets records
 * into Google Dataset Search.
 */

import type { BreadcrumbList, Dataset, WithContext } from "schema-dts";
import type { OGCCollection } from "./fetchCollections";
import { BASE_URL, detailsUrl, SITE_NAME } from "./constants";
import type { ILink, ITheme } from "@/app/store/OGCCollectionDefinitions";

// The abstract the Detail_Page shows
export const abstractOf = (collection: OGCCollection) =>
  collection.getEnhancedDescription() || collection.description || "";

// Keyword rule of the Detail_Page (AdditionalInfoPanel): no "Categories"
// scheme, no AI-predicted concepts.
export const visibleKeywords = (themes: ITheme[] = []) => [
  ...new Set(
    themes
      .filter((theme) => theme.scheme !== "Categories")
      .flatMap((theme) => theme.concepts ?? [])
      .filter((concept) => !("ai:description" in concept))
      .map((concept) => concept.id?.trim())
      .filter((id): id is string => !!id)
  ),
];

// https://developers.google.com/search/docs/appearance/structured-data/dataset
export const buildJsonLd = (
  collection: OGCCollection
): WithContext<Dataset> => ({
  "@context": "https://schema.org",
  "@type": "Dataset",
  name: collection.title,
  // Google recommends descriptions under 5000 characters
  description: abstractOf(collection).slice(0, 5000) || undefined,
  url: detailsUrl(collection.id),
  identifier: collection.id,
  // date only: the metadata timestamps carry no timezone
  datePublished: collection.getCreation()?.slice(0, 10),
  dateModified: collection.getRevision()?.slice(0, 10),
  keywords: toKeywords(collection.getThemes()),
  creator: toCreator(collection),
  spatialCoverage: toSpatialCoverage(collection.getBBox()),
  distribution: toDistribution(collection.links),
  temporalCoverage: toTemporalCoverage(collection.extent?.temporal?.interval),
  // Google asks for a URL identifying the license; the name is the fallback
  license:
    collection.links?.find((link) => link.rel?.toLowerCase() === "license")
      ?.href || collection.getLicense(),
  citation: collection.getCitation()?.suggestedCitation,
  includedInDataCatalog: {
    "@type": "DataCatalog",
    name: SITE_NAME,
    url: `${BASE_URL}/`,
  },
});

// Mirrors the visible breadcrumb in the crawler body, telling Google the page
// sits under the home page rather than floating on its own.
export const buildBreadcrumbJsonLd = (
  collection: OGCCollection
): WithContext<BreadcrumbList> => ({
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  itemListElement: [
    { "@type": "ListItem", position: 1, name: SITE_NAME, item: `${BASE_URL}/` },
    {
      "@type": "ListItem",
      position: 2,
      name: collection.title,
      item: detailsUrl(collection.id),
    },
  ],
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

// Who made the data, best role first: a distributor or metadata contact hands
// the data on without having created it.
const CREATOR_ROLES = [
  "author",
  "originator",
  "principalInvestigator",
  "owner",
  "processor",
];

const toCreator = (collection: OGCCollection): Dataset["creator"] => {
  const contacts = collection.getContacts() ?? [];
  const name =
    CREATOR_ROLES.flatMap((role) =>
      contacts.filter((contact) => contact.roles?.includes(role))
    ).find((contact) => contact.organization)?.organization ??
    collection.getDatasetProvider();
  return name ? { "@type": "Organization", name } : undefined;
};

// Google needs the download link to show a dataset as downloadable
const toDistribution = (links: ILink[] = []): Dataset["distribution"] => {
  const downloads = links
    .filter((link) => link.href && link["ai:role"]?.includes("download"))
    .map((link) => ({
      "@type": "DataDownload" as const,
      contentUrl: link.href,
      encodingFormat: link.type || undefined,
      name: link.title || undefined,
    }));
  return downloads.length ? downloads : undefined;
};

const toKeywords = (themes?: ITheme[]): Dataset["keywords"] => {
  const keywords = visibleKeywords(themes);
  return keywords.length ? keywords : undefined;
};
