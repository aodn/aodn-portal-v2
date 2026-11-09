import { SearchKeys } from "@/components/search/constants";

// Approximate display figures for the landing page; not live catalogue totals.
export const FEATURED_DATASET_COUNTS: Partial<Record<SearchKeys, number>> = {
  [SearchKeys.IMOS]: 400,
  [SearchKeys.AAD]: 1860,
  [SearchKeys.AIMS]: 2560,
  [SearchKeys.CSIRO]: 4620,
  [SearchKeys.IMAS]: 1100,
};
