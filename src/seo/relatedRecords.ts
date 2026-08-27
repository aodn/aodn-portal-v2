/**
 * Picks related records for each pre-rendered page so detail pages link to
 * each other. Crawlers only discover pages through <a href> — pages reachable
 * only via the sitemap stall in GSC as "Discovered - currently not crawled".
 */

import type { OGCCollection } from "./fetchCollections";

export interface RelatedLink {
  id: string;
  title: string;
}

const conceptIds = (collection: OGCCollection): string[] => [
  ...new Set(
    (collection.getThemes() ?? [])
      .flatMap((theme) => theme.concepts?.map((concept) => concept.id) ?? [])
      .filter(Boolean)
  ),
];

/**
 * Related = shares a theme concept, rarest first (specific keywords beat
 * catch-alls like "MARINE"). Each record links to the next members of a
 * bucket, cyclically, so incoming links spread evenly.
 */
export const buildRelatedLinks = (
  collections: OGCCollection[],
  maxLinks = 8
): Map<string, RelatedLink[]> => {
  const conceptsPerCollection = collections.map(conceptIds);
  const collectionsByConcept = new Map<string, number[]>();
  conceptsPerCollection.forEach((concepts, index) =>
    concepts.forEach((concept) => {
      const bucket = collectionsByConcept.get(concept);
      if (bucket) bucket.push(index);
      else collectionsByConcept.set(concept, [index]);
    })
  );

  const related = new Map<string, RelatedLink[]>();
  collections.forEach((collection, index) => {
    const sharedBuckets = conceptsPerCollection[index]
      .map((concept) => collectionsByConcept.get(concept)!)
      .filter((bucket) => bucket.length > 1)
      .sort((a, b) => a.length - b.length);

    const relatedIndexes = new Set<number>();
    for (const bucket of sharedBuckets) {
      const myPosition = bucket.indexOf(index);
      for (let step = 1; step < bucket.length; step++) {
        if (relatedIndexes.size >= maxLinks) break;
        relatedIndexes.add(bucket[(myPosition + step) % bucket.length]);
      }
      if (relatedIndexes.size >= maxLinks) break;
    }

    related.set(
      collection.id,
      [...relatedIndexes].map((relatedIndex) => ({
        id: collections[relatedIndex].id,
        title: collections[relatedIndex].title ?? "",
      }))
    );
  });
  return related;
};
