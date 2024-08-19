import { CardProps } from "./SmartPanel";
import img_get_started from "@/assets/smartPanelIcons/img_get_started.png";
import icon_tutorials from "@/assets/smartPanelIcons/icon_tutorials.png";
import icon_location from "@/assets/smartPanelIcons/icon_location.png";

export const SMART_PANEL_HEIGHT = 160;
export const SMART_PANEL_WIDTH = 1000;

const SMART_PANEL_ROWS = 2;

export const DEFAULT_CARD_SIZE = SMART_PANEL_HEIGHT / SMART_PANEL_ROWS;
export const DEFAULT_GAP = 4;

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
    icon: icon_location,
  },
  {
    type: ItemType.large,
    title: "Surface Waves",
    image: img_get_started,
    additionalInfo: ["Surface Temperature", "Current Velocity", "Salinity"],
  },
  {
    type: ItemType.small,
    title: "Reef",
    icon: icon_location,
  },
  {
    type: ItemType.small,
    title: "Satellite",
    icon: icon_location,
  },
  {
    type: ItemType.medium,
    title: "Popular Search",
    image: img_get_started,
  },
  {
    type: ItemType.large,
    title: "Ocean Current",
    image: img_get_started,
    additionalInfo: ["Four-hour SST", "Ocean Colour", "Adjusted Sea Level"],
  },
  {
    type: ItemType.small,
    title: "Environment",
    icon: icon_location,
  },
  {
    type: ItemType.small,
    title: "Climate",
    icon: icon_location,
  },
  {
    type: ItemType.small,
    title: "Moorings",
    icon: icon_location,
  },
  {
    type: ItemType.small,
    title: "Gliders",
    icon: icon_location,
  },
  {
    type: ItemType.small,
    title: "AUV",
    icon: icon_location,
  },
  {
    type: ItemType.medium,
    title: "Contributing Data",
    image: img_get_started,
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
    icon: icon_location,
  },

  {
    type: ItemType.small,
    title: "Fishery",
    icon: icon_location,
  },
  {
    type: ItemType.small,
    title: "Tourism",
    icon: icon_location,
  },
];
