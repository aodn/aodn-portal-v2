// Keep the previous UI in production until TAG feedback is incorporated.
export const isFeaturedDatasetsSectionEnabled = import.meta.env.MODE !== "prod";

import { SearchKeys } from "@/components/search/constants";
import { CONTRIBUTORS } from "@/pages/landing-page/features/partners/constants";
import news1 from "@/assets/images/news1.webp";
import news1Card from "@/assets/images/news1-card-400.webp";
import news2 from "@/assets/images/news2.webp";
import news2Card from "@/assets/images/news2-card-400.webp";
import news3 from "@/assets/images/news3.webp";
import news3Card from "@/assets/images/news3-card-400.webp";

export const FEATURED_CONTRIBUTORS = CONTRIBUTORS.filter(({ datasetGroup }) =>
  [SearchKeys.AAD, SearchKeys.AIMS, SearchKeys.CSIRO, SearchKeys.IMAS].includes(
    datasetGroup
  )
);

// Reads the ?featured= value (case-insensitive); returns undefined if unknown
export const getFeaturedGroup = (value: string | null) => {
  const requestedGroup = value?.toLowerCase();
  const featuredGroups = [
    SearchKeys.IMOS,
    ...FEATURED_CONTRIBUTORS.map((contributor) => contributor.datasetGroup),
  ];
  return featuredGroups.find((group) => group === requestedGroup);
};

export interface NewsCardData {
  id: number;
  // The Featured Datasets tab this card belongs to
  tab: SearchKeys;
  image: string;
  imageSrcSet: string;
  description: string;
  title: string;
  link: string;
}
export const NEWS_CARDS_DATA: NewsCardData[] = [
  {
    id: 1,
    tab: SearchKeys.IMOS,
    description:
      "Satellite observations supporting the calibration and validation of ocean altimetry measurements.",
    image: news1,
    imageSrcSet: `${news1Card} 400w, ${news1} 600w`,
    title: "Satellite Altimetry Calibration and Validation",
    link: `${window.location.origin}/details/78d588ed-79dd-47e2-b806-d39025194e7e?tab=summary`,
  },
  {
    id: 2,
    tab: SearchKeys.IMOS,
    description:
      "Near real-time wave observations from coastal buoys around Australia.",
    image: news2,
    imageSrcSet: `${news2Card} 400w, ${news2} 410w`,
    title: " Wave buoys Observations - Australia - near real-time",
    link: `${window.location.origin}/details/b299cdcd-3dee-48aa-abdd-e0fcdbb9cadc?tab=summary`,
  },
  {
    id: 3,
    tab: SearchKeys.IMOS,
    description:
      "Ocean observations collected by fishing vessels through the Ships of Opportunity program.",
    image: news3,
    imageSrcSet: `${news3Card} 400w, ${news3} 373w`,
    title: "Fisheries vessels real-time data collection",
    link: `${window.location.origin}/details/bdb84466-dc53-49ad-a60f-83d9fa0baed5?tab=summary`,
  },
];

// Cards of one tab; a tab without its own cards yet shows the IMOS ones
export const getNewsCards = (
  tab: SearchKeys,
  cards: NewsCardData[] = NEWS_CARDS_DATA
) => {
  const tabCards = cards.filter((card) => card.tab === tab);
  return tabCards.length > 0
    ? tabCards
    : cards.filter((card) => card.tab === SearchKeys.IMOS);
};
