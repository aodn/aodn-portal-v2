// This file includes all initial data of Smart Panel
import imgGetStarted from "@/assets/smartPanelIcons/img_get_started.png";
import iconTutorials from "@/assets/smartPanelIcons/icon_tutorials.png";
import iconAllTopics from "@/assets/smartPanelIcons/icon_all_topics.png";
import imgSurfaceWaves from "@/assets/smartPanelIcons/img_surface_waves.png";
import iconReef from "@/assets/smartPanelIcons/icon_reef.png";
import imgPopularSearch from "@/assets/smartPanelIcons/img_popular_search.png";
import imgOceanCurrent from "@/assets/smartPanelIcons/img_ocean_current.png";
import iconEnvironment from "@/assets/smartPanelIcons/icon_environment.png";
import iconClimate from "@/assets/smartPanelIcons/icon_climate.png";
import iconMoorings from "@/assets/smartPanelIcons/icon_moorings.png";
import iconGlider from "@/assets/smartPanelIcons/icon_glider.png";
import iconAUV from "@/assets/smartPanelIcons/icon_AUV.png";
import imgContributingData from "@/assets/smartPanelIcons/img_contributing_data.png";
import iconOceanBiota from "@/assets/smartPanelIcons/icon_ocean_biota.png";
import imgExploreOnMap from "@/assets/smartPanelIcons/img_explore_on_map.png";
import iconFishery from "@/assets/smartPanelIcons/icon_fishery.png";
import iconTourism from "@/assets/smartPanelIcons/icon_tourism.png";
import iconAnimalTracking from "@/assets/smartPanelIcons/icon_animal_tracking.png";
import iconTide from "@/assets/smartPanelIcons/icon_tide.png";
import iconArgo from "@/assets/smartPanelIcons/icon_argo.png";
import iconVessel from "@/assets/smartPanelIcons/icon_vessel.png";
import iconGeoscientific from "@/assets/smartPanelIcons/icon_geoscientific.png";
import imgVisualTools from "@/assets/smartPanelIcons/img_visual_tools.png";
import iconLocation from "@/assets/smartPanelIcons/icon_location.png";
import { calculateImageListWidth } from "./utils";

export const SMART_PANEL_GAP = 12;

export const SMART_PANEL_HEIGHT = 180;

// if this constant changed, we may need modify utils accordingly
const SMART_PANEL_ROWS = 2;

export interface CardData {
  title: string;
  icon?: string;
  image?: string;
  additionalInfo?: string[];
}

export interface ItemData extends CardData {
  type: ItemType;
}

export enum ItemType {
  Small = "small",
  Medium = "medium",
  Large = "large",
}

export const ITEM_DATA: ItemData[] = [
  {
    type: ItemType.Medium,
    title: "Get Started",
    image: imgGetStarted,
  },
  {
    type: ItemType.Small,
    title: "All Topics",
    icon: iconAllTopics,
  },
  {
    type: ItemType.Large,
    title: "Surface Waves",
    image: imgSurfaceWaves,
    additionalInfo: ["Surface Temperature", "Current Velocity", "Salinity"],
  },
  {
    type: ItemType.Small,
    title: "Reef",
    icon: iconReef,
  },
  {
    type: ItemType.Small,
    title: "Satellite",
    icon: iconLocation,
  },
  {
    type: ItemType.Medium,
    title: "Popular Search",
    image: imgPopularSearch,
  },
  {
    type: ItemType.Large,
    title: "Ocean Current",
    image: imgOceanCurrent,
    additionalInfo: ["Four-hour SST", "Ocean Colour", "Adjusted Sea Level"],
  },
  {
    type: ItemType.Small,
    title: "Environment",
    icon: iconEnvironment,
  },
  {
    type: ItemType.Small,
    title: "Climate",
    icon: iconClimate,
  },
  {
    type: ItemType.Small,
    title: "Moorings",
    icon: iconMoorings,
  },
  {
    type: ItemType.Small,
    title: "Gliders",
    icon: iconGlider,
  },
  {
    type: ItemType.Small,
    title: "AUV",
    icon: iconAUV,
  },
  {
    type: ItemType.Medium,
    title: "Contributing Data",
    image: imgContributingData,
  },
  {
    type: ItemType.Small,
    title: "Tutorials",
    icon: iconTutorials,
  },
  {
    type: ItemType.Small,
    title: "Location",
    icon: iconLocation,
  },
  {
    type: ItemType.Small,
    title: "Ocean Biota",
    icon: iconOceanBiota,
  },
  {
    type: ItemType.Medium,
    title: "Explore on Map",
    image: imgExploreOnMap,
  },
  {
    type: ItemType.Small,
    title: "Fishery",
    icon: iconFishery,
  },
  {
    type: ItemType.Small,
    title: "Tourism",
    icon: iconTourism,
  },
  {
    type: ItemType.Small,
    title: "Animal Tracking",
    icon: iconAnimalTracking,
  },
  {
    type: ItemType.Small,
    title: "Tide",
    icon: iconTide,
  },
  {
    type: ItemType.Medium,
    title: "Visualisation Tools",
    image: imgVisualTools,
  },
  {
    type: ItemType.Small,
    title: "Argo",
    icon: iconArgo,
  },
  {
    type: ItemType.Small,
    title: "Vessel",
    icon: iconVessel,
  },
  {
    type: ItemType.Small,
    title: "Geoscientific",
    icon: iconGeoscientific,
  },
];

export const SMART_PANEL_CARD_SIZE =
  (SMART_PANEL_HEIGHT - SMART_PANEL_GAP * (SMART_PANEL_ROWS - 1)) /
  SMART_PANEL_ROWS;

// the smart panel width will be the half width of the full image list width for now
// if the full width is too large, should divide into a smaller size
// to keep the smart panel width in a proper size
export const SMART_PANEL_WIDTH =
  calculateImageListWidth(ITEM_DATA) / 2 + SMART_PANEL_GAP / 2;

export const SCROLL_DISTANCE = SMART_PANEL_WIDTH / 2 + SMART_PANEL_GAP;