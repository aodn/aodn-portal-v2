// This file includes all initial data of Smart Panel
import img_get_started from "@/assets/smartPanelIcons/img_get_started.png";
import icon_tutorials from "@/assets/smartPanelIcons/icon_tutorials.png";
import icon_all_topics from "@/assets/smartPanelIcons/icon_all_topics.png";
import img_surface_waves from "@/assets/smartPanelIcons/img_surface_waves.png";
import icon_reef from "@/assets/smartPanelIcons/icon_reef.png";
import img_popular_search from "@/assets/smartPanelIcons/img_popular_search.png";
import img_ocean_current from "@/assets/smartPanelIcons/img_ocean_current.png";
import icon_environment from "@/assets/smartPanelIcons/icon_environment.png";
import icon_climate from "@/assets/smartPanelIcons/icon_climate.png";
import icon_moorings from "@/assets/smartPanelIcons/icon_moorings.png";
import icon_glider from "@/assets/smartPanelIcons/icon_glider.png";
import icon_AUV from "@/assets/smartPanelIcons/icon_AUV.png";
import img_contributing_data from "@/assets/smartPanelIcons/img_contributing_data.png";
import icon_ocean_biota from "@/assets/smartPanelIcons/icon_ocean_biota.png";
import img_explore_on_map from "@/assets/smartPanelIcons/img_explore_on_map.png";
import icon_fishery from "@/assets/smartPanelIcons/icon_fishery.png";
import icon_tourism from "@/assets/smartPanelIcons/icon_tourism.png";
import icon_animal_tracking from "@/assets/smartPanelIcons/icon_animal_tracking.png";
import icon_tide from "@/assets/smartPanelIcons/icon_tide.png";
import icon_argo from "@/assets/smartPanelIcons/icon_argo.png";
import icon_vessel from "@/assets/smartPanelIcons/icon_vessel.png";
import icon_geoscientific from "@/assets/smartPanelIcons/icon_geoscientific.png";
import img_visual_tools from "@/assets/smartPanelIcons/img_visual_tools.png";
import icon_location from "@/assets/smartPanelIcons/icon_location.png";
import { CardProps } from "./SmartCard";

export const SMART_PANEL_HEIGHT = 180;
export const SMART_PANEL_WIDTH = 800;

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
    image: img_get_started,
  },
  {
    type: ItemType.small,
    title: "All Topics",
    icon: icon_all_topics,
  },
  {
    type: ItemType.large,
    title: "Surface Waves",
    image: img_surface_waves,
    additionalInfo: ["Surface Temperature", "Current Velocity", "Salinity"],
  },
  {
    type: ItemType.small,
    title: "Reef",
    icon: icon_reef,
  },
  {
    type: ItemType.small,
    title: "Satellite",
    icon: icon_location,
  },
  {
    type: ItemType.medium,
    title: "Popular Search",
    image: img_popular_search,
  },
  {
    type: ItemType.large,
    title: "Ocean Current",
    image: img_ocean_current,
    additionalInfo: ["Four-hour SST", "Ocean Colour", "Adjusted Sea Level"],
  },
  {
    type: ItemType.small,
    title: "Environment",
    icon: icon_environment,
  },
  {
    type: ItemType.small,
    title: "Climate",
    icon: icon_climate,
  },
  {
    type: ItemType.small,
    title: "Moorings",
    icon: icon_moorings,
  },
  {
    type: ItemType.small,
    title: "Gliders",
    icon: icon_glider,
  },
  {
    type: ItemType.small,
    title: "AUV",
    icon: icon_AUV,
  },
  {
    type: ItemType.medium,
    title: "Contributing Data",
    image: img_contributing_data,
  },
  {
    type: ItemType.small,
    title: "Tutorials",
    icon: icon_tutorials,
  },
  {
    type: ItemType.small,
    title: "Location",
    icon: icon_location,
  },
  {
    type: ItemType.small,
    title: "Ocean Biota",
    icon: icon_ocean_biota,
  },
  {
    type: ItemType.medium,
    title: "Explore on Map",
    image: img_explore_on_map,
  },
  {
    type: ItemType.small,
    title: "Fishery",
    icon: icon_fishery,
  },
  {
    type: ItemType.small,
    title: "Tourism",
    icon: icon_tourism,
  },
  {
    type: ItemType.small,
    title: "Animal Tracking",
    icon: icon_animal_tracking,
  },
  {
    type: ItemType.small,
    title: "Tide",
    icon: icon_tide,
  },
  {
    type: ItemType.medium,
    title: "Visualisation Tools",
    image: img_visual_tools,
  },
  {
    type: ItemType.small,
    title: "Argo",
    icon: icon_argo,
  },
  {
    type: ItemType.small,
    title: "Vessel",
    icon: icon_vessel,
  },
  {
    type: ItemType.small,
    title: "Geoscientific",
    icon: icon_geoscientific,
  },
];
