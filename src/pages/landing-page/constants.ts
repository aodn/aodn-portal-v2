import { SearchKeys } from "@/components/search/constants";

// Approximate display figures for the landing page; not live catalogue totals.
export const FEATURED_DATASET_COUNTS: Partial<Record<SearchKeys, number>> = {
  [SearchKeys.IMOS]: 400,
  [SearchKeys.AAD]: 1860,
  [SearchKeys.AIMS]: 2560,
  [SearchKeys.CSIRO]: 4620,
  [SearchKeys.IMAS]: 1100,
};

// Hero spacing from Figma 8316-46882 (1920 frame), applied from laptop up.
// Smaller screens keep the tighter defaults.
export const HERO_PADDING_TOP = "40px"; // header to hero images
export const HERO_SEARCHBAR_GAP = "47px"; // hero images to search bar
export const HERO_PADDING_BOTTOM = "52px"; // search bar to topics section
export const HERO_TITLE_TO_QUOTE_GAP = "40px";
export const HERO_TEXT_INSET = "60px"; // desktop only
