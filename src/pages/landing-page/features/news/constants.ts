import { SearchKeys } from "@/components/search/constants";
import { CONTRIBUTORS } from "@/pages/landing-page/features/partners/constants";
import news1 from "@/assets/images/news1.webp";
import news1Card from "@/assets/images/news1-card-400.webp";
import news2 from "@/assets/images/news2.webp";
import news2Card from "@/assets/images/news2-card-400.webp";
import news3 from "@/assets/images/news3.webp";
import news3Card from "@/assets/images/news3-card-400.webp";
import aims1 from "@/assets/images/aims1.webp";
import aims1Card from "@/assets/images/aims1-card-400.webp";
import aims2 from "@/assets/images/aims2.webp";
import aims2Card from "@/assets/images/aims2-card-400.webp";
import aims3 from "@/assets/images/aims3.webp";
import aims3Card from "@/assets/images/aims3-card-400.webp";
import wamsi1 from "@/assets/images/wamsi1.webp";
import wamsi1Card from "@/assets/images/wamsi1-card-400.webp";
import wamsi2 from "@/assets/images/wamsi2.webp";
import wamsi2Card from "@/assets/images/wamsi2-card-400.webp";
import wamsi3 from "@/assets/images/wamsi3.webp";
import wamsi3Card from "@/assets/images/wamsi3-card-400.webp";
import eatlas1 from "@/assets/images/eatlas1.webp";
import eatlas1Card from "@/assets/images/eatlas1-card-400.webp";
import eatlas2 from "@/assets/images/eatlas2.webp";
import eatlas2Card from "@/assets/images/eatlas2-card-400.webp";
import eatlas3 from "@/assets/images/eatlas3.webp";
import eatlas3Card from "@/assets/images/eatlas3-card-400.webp";
import ga1 from "@/assets/images/ga1.webp";
import ga1Card from "@/assets/images/ga1-card-400.webp";
import ga2 from "@/assets/images/ga2.webp";
import ga2Card from "@/assets/images/ga2-card-400.webp";
import ga3 from "@/assets/images/ga3.webp";
import ga3Card from "@/assets/images/ga3-card-400.webp";

export const FEATURED_CONTRIBUTORS = CONTRIBUTORS;

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
  {
    id: 4,
    tab: SearchKeys.AIMS,
    description:
      "Weather and ocean observations from AIMS stations across northern Australia, supporting long-term marine and coral reef research.",
    image: aims1,
    imageSrcSet: `${aims1Card} 400w, ${aims1} 600w`,
    title:
      "Northern Australia Automated Marine Weather and Oceanographic Stations",
    link: `${window.location.origin}/details/0887cb5b-b443-4e08-a169-038208109466?tab=summary`,
  },
  {
    id: 5,
    tab: SearchKeys.AIMS,
    description:
      "Long-term seawater temperature observations from coral reefs across Australia, supporting research into climate change and coral bleaching.",
    image: aims2,
    imageSrcSet: `${aims2Card} 400w, ${aims2} 600w`,
    title:
      "AIMS Sea Water Temperature Observing System (AIMS Temperature Logger Program)",
    link: `${window.location.origin}/details/4a12a8c0-c573-11dc-b99b-00008a07204e?tab=summary`,
  },
  {
    id: 6,
    tab: SearchKeys.AIMS,
    description:
      "Measures the distribution, abundance and characteristics of small debris particles to understand pollution across diverse marine environments.",
    image: aims3,
    imageSrcSet: `${aims3Card} 400w, ${aims3} 600w`,
    title: "Microdebris contamination in Australian coastal and marine waters",
    link: `${window.location.origin}/details/fd3d74b0-0234-4864-bbc6-751c44e41f5e?tab=summary`,
  },
  {
    id: 7,
    tab: SearchKeys.WAMSI,
    description:
      "Data to ensure the EIA for WA’s future container port is informed by rigorous, independent science, and to assist and improve the management of Cockburn Sound.",
    image: wamsi1,
    imageSrcSet: `${wamsi1Card} 400w, ${wamsi1} 600w`,
    title: "WAMSI Westport Marine Science Program",
    link: `${window.location.origin}/details/bf3bdbd7-7058-429a-b8ab-0f2ac2cbcf85?tab=summary`,
  },
  {
    id: 8,
    tab: SearchKeys.WAMSI,
    description:
      "Oceanographic and biogeochemical data collected over two field campaigns to support development of a biogeochemical model.",
    image: wamsi2,
    imageSrcSet: `${wamsi2Card} 400w, ${wamsi2} 600w`,
    title:
      "The role of rivers and estuaries in sustaining marine productivity in the Kimberley",
    link: `${window.location.origin}/details/fc8bbadc-3242-06db-e043-08114f8c34f5?tab=summary`,
  },
  {
    id: 9,
    tab: SearchKeys.WAMSI,
    description:
      "Geomorphological and sedimentary characteristics (biological and physical) of the Ningaloo Reef and shelf.",
    image: wamsi3,
    imageSrcSet: `${wamsi3Card} 400w, ${wamsi3} 600w`,
    title:
      "Characterisation of Geomorphology and Sedimentology in Ningaloo Marine Park",
    link: `${window.location.origin}/details/67984a64-c5bd-485d-8ace-7b0b22806ffa?tab=summary`,
  },
  {
    id: 10,
    tab: SearchKeys.EATLAS,
    description:
      "Over 30,000 geotagged photographs of the shoreline from Weipa to Blue Mud Bay, documenting the 2015 mangrove mass dieback and coastal habitat condition.",
    image: eatlas1,
    imageSrcSet: `${eatlas1Card} 400w, ${eatlas1} 600w`,
    title:
      "Gulf of Carpentaria Mangrove Aerial Shoreline Surveys 2017 & 2019 (NESP TWQ 4.13, JCU)",
    link: `${window.location.origin}/details/2d71917c-dbd6-4c28-b3c7-918fd0b8c0d9?tab=summary`,
  },
  {
    id: 11,
    tab: SearchKeys.EATLAS,
    description:
      "Cloud-free, 10 m resolution true colour imagery (2015–2024), optimised for mapping shallow marine habitats.",
    image: eatlas2,
    imageSrcSet: `${eatlas2Card} 400w, ${eatlas2} 600w`,
    title:
      "North Australia Sentinel 2 Satellite Composite Imagery (NESP MaC 3.17, AIMS)",
    link: `${window.location.origin}/details/c38d2227-25c0-4d1e-adbc-bddb4aac1929?tab=summary`,
  },
  {
    id: 12,
    tab: SearchKeys.EATLAS,
    description:
      "Presence and absence of seagrass species at 48,612 sites and 641 mapped seagrass meadows from 1983-2022.",
    image: eatlas3,
    imageSrcSet: `${eatlas3Card} 400w, ${eatlas3} 600w`,
    title:
      "Four Decades of Seagrass Data from Torres Strait and Gulf of Carpentaria (NESP MaC 1.13, TropWATER JCU)",
    link: `${window.location.origin}/details/d9a67694-d803-46ca-8f4b-63fc12d51bd1?tab=summary`,
  },
  {
    id: 13,
    tab: SearchKeys.GA,
    description:
      "A 250m resolution grid of Australia’s bathymetry and elevation, derived from surveys and satellite observations.",
    image: ga1,
    imageSrcSet: `${ga1Card} 400w, ${ga1} 600w`,
    title:
      "AusBathyTopo 250m (Australia) 2026 Grid: A national-scale depth and elevation dataset and derived terrain variables",
    link: `${window.location.origin}/details/7ff1f558-8ef4-427b-9696-007b76aab2c6?tab=summary`,
  },
  {
    id: 15,
    tab: SearchKeys.GA,
    description:
      "A 30m resolution seamless grid of the bathymetry and elevation of the Perth region, derived from surveys and satellite observations.",
    image: ga3,
    imageSrcSet: `${ga3Card} 400w, ${ga3} 600w`,
    title:
      "AusBathyTopo 30m (Perth) 2026 Grid - A regional-scale depth and elevation dataset and derived terrain variables",
    link: `${window.location.origin}/details/61a348f7-077f-476a-b8a2-b8e3feb2a304?tab=summary`,
  },
  {
    id: 14,
    tab: SearchKeys.GA,
    description:
      "Marine sediment grain size, carbonate content, mineralogy, geochemistry and age from samples around Australia’s coasts, oceans and Antarctic.",
    image: ga2,
    imageSrcSet: `${ga2Card} 400w, ${ga2} 600w`,
    title: "Marine Sediments (MARS) Database",
    link: `${window.location.origin}/details/a05f7892-eef2-7506-e044-00144fdd4fa6?tab=summary`,
  },
];

// Cards of one tab; an empty list means the tab has no content yet
export const getNewsCards = (
  tab: SearchKeys,
  cards: NewsCardData[] = NEWS_CARDS_DATA
) => cards.filter((card) => card.tab === tab);

// Reads ?featured= (case-insensitive); undefined if unknown or the tab has no cards
export const getFeaturedGroup = (
  value: string | null,
  cards: NewsCardData[] = NEWS_CARDS_DATA
) => {
  const requestedGroup = value?.toLowerCase();
  return Object.values(SearchKeys).find(
    (group) => group === requestedGroup && getNewsCards(group, cards).length > 0
  );
};
