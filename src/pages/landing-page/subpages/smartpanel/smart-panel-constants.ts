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
import { CardProps } from "./SmartCard";

export const SMART_PANEL_WIDTH = 800;
export const SMART_PANEL_HEIGHT = 180;

const SMART_PANEL_ROWS = 2;

export const DEFAULT_GAP = 12;
export const DEFAULT_CARD_SIZE = SMART_PANEL_HEIGHT / SMART_PANEL_ROWS;
export const SCROLL_DISTANCE = SMART_PANEL_WIDTH / 2 + DEFAULT_GAP;

export interface ItemData extends CardProps {
  type: ItemType;
}

export enum ItemType {
  small = "small",
  medium = "medium",
  large = "large",
}

export const ITEM_DATA: ItemData[] = [
  {
    type: ItemType.medium,
    title: "Get Started",
    image: imgGetStarted,
  },
  {
    type: ItemType.small,
    title: "All Topics",
    icon: iconAllTopics,
  },
  {
    type: ItemType.large,
    title: "Surface Waves",
    image: imgSurfaceWaves,
    additionalInfo: ["Surface Temperature", "Current Velocity", "Salinity"],
  },
  {
    type: ItemType.small,
    title: "Reef",
    icon: iconReef,
  },
  {
    type: ItemType.small,
    title: "Satellite",
    icon: iconLocation,
  },
  {
    type: ItemType.medium,
    title: "Popular Search",
    image: imgPopularSearch,
  },
  {
    type: ItemType.large,
    title: "Ocean Current",
    image: imgOceanCurrent,
    additionalInfo: ["Four-hour SST", "Ocean Colour", "Adjusted Sea Level"],
  },
  {
    type: ItemType.small,
    title: "Environment",
    icon: iconEnvironment,
  },
  {
    type: ItemType.small,
    title: "Climate",
    icon: iconClimate,
  },
  {
    type: ItemType.small,
    title: "Moorings",
    icon: iconMoorings,
  },
  {
    type: ItemType.small,
    title: "Gliders",
    icon: iconGlider,
  },
  {
    type: ItemType.small,
    title: "AUV",
    icon: iconAUV,
  },
  {
    type: ItemType.medium,
    title: "Contributing Data",
    image: imgContributingData,
  },
  {
    type: ItemType.small,
    title: "Tutorials",
    icon: iconTutorials,
  },
  {
    type: ItemType.small,
    title: "Location",
    icon: iconLocation,
  },
  {
    type: ItemType.small,
    title: "Ocean Biota",
    icon: iconOceanBiota,
  },
  {
    type: ItemType.medium,
    title: "Explore on Map",
    image: imgExploreOnMap,
  },
  {
    type: ItemType.small,
    title: "Fishery",
    icon: iconFishery,
  },
  {
    type: ItemType.small,
    title: "Tourism",
    icon: iconTourism,
  },
  {
    type: ItemType.small,
    title: "Animal Tracking",
    icon: iconAnimalTracking,
  },
  {
    type: ItemType.small,
    title: "Tide",
    icon: iconTide,
  },
  {
    type: ItemType.medium,
    title: "Visualisation Tools",
    image: imgVisualTools,
  },
  {
    type: ItemType.small,
    title: "Argo",
    icon: iconArgo,
  },
  {
    type: ItemType.small,
    title: "Vessel",
    icon: iconVessel,
  },
  {
    type: ItemType.small,
    title: "Geoscientific",
    icon: iconGeoscientific,
  },
];
