import type { OGCCollection } from "@/seo/fetchCollections";
import { isSafeCollectionId } from "@/seo/constants";

export const isSeoEligibleCollection = (collection: OGCCollection) =>
  isSafeCollectionId(collection.id) &&
  collection.id !== "." &&
  collection.id !== ".." &&
  Boolean(collection.title?.trim() && collection.description?.trim());
