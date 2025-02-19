import iconTutorials from "@/assets/smartPanelIcons/icon_tutorials.png";
import iconAllTopics from "@/assets/smartPanelIcons/icon_all_topics.png";
import iconReef from "@/assets/smartPanelIcons/icon_reef.png";
import iconSatellite from "@/assets/smartPanelIcons/icon_satellite.png";
import iconWaves from "@/assets/smartPanelIcons/icon_waves.png";
import iconTemperature from "@/assets/smartPanelIcons/icon_temperature.png";
import iconEnvironment from "@/assets/smartPanelIcons/icon_environment.png";
import iconClimate from "@/assets/smartPanelIcons/icon_climate.png";
import iconMoorings from "@/assets/smartPanelIcons/icon_moorings.png";
import iconGlider from "@/assets/smartPanelIcons/icon_glider.png";
import iconAUV from "@/assets/smartPanelIcons/icon_AUV.png";
import iconOceanBiota from "@/assets/smartPanelIcons/icon_ocean_biota.png";
import iconFishery from "@/assets/smartPanelIcons/icon_fishery.png";
import iconTourism from "@/assets/smartPanelIcons/icon_tourism.png";
import iconChemical from "@/assets/smartPanelIcons/icon_chemical.png";
import iconAnimalTrack from "@/assets/smartPanelIcons/icon_animal_track.png";
import iconTide from "@/assets/smartPanelIcons/icon_tide.png";
import iconArgo from "@/assets/smartPanelIcons/icon_argo.png";
import iconVessel from "@/assets/smartPanelIcons/icon_vessel.png";
import iconGeoscientific from "@/assets/smartPanelIcons/icon_geoscientific.png";
import { SmartCardType } from "./SmartCard";

export const SCROLL_BUTTON_SIZE = 20;

export const SMART_PANEL_GAP = 16;

export const SMART_PANEL_ROWS = 2;

const SMART_PANEL_COLS_DESKTOP = 10; // Change this number carefully, it will affect the fixed width of smart panel
const SMART_PANEL_COLS_LAPTOP = 8;
const SMART_PANEL_COLS_TABLET = 6;
const SMART_PANEL_COLS_MOBILE = 3;

export const SMART_CARD_ICON_BOX_SIZE = 90;
export const SMART_CARD_HEIGHT = 115;

export const SMART_PANEL_HEIGHT =
  SMART_CARD_HEIGHT * SMART_PANEL_ROWS +
  SMART_PANEL_GAP * (SMART_PANEL_ROWS - 1);
export const SMART_PANEL_WIDTH =
  SMART_CARD_ICON_BOX_SIZE * SMART_PANEL_COLS_DESKTOP +
  SMART_PANEL_GAP * (SMART_PANEL_COLS_DESKTOP - 1);

export const SMART_PANEL_CONTAINER_WIDTH_DESKTOP =
  SMART_CARD_ICON_BOX_SIZE * SMART_PANEL_COLS_DESKTOP +
  SMART_PANEL_GAP * (SMART_PANEL_COLS_DESKTOP - 1);
export const SMART_PANEL_CONTAINER_WIDTH_LAPTOP =
  SMART_CARD_ICON_BOX_SIZE * SMART_PANEL_COLS_LAPTOP +
  SMART_PANEL_GAP * (SMART_PANEL_COLS_LAPTOP - 1);
export const SMART_PANEL_CONTAINER_WIDTH_TABLET =
  SMART_CARD_ICON_BOX_SIZE * SMART_PANEL_COLS_TABLET +
  SMART_PANEL_GAP * (SMART_PANEL_COLS_TABLET - 1);
export const SMART_PANEL_CONTAINER_WIDTH_MOBILE =
  SMART_CARD_ICON_BOX_SIZE * SMART_PANEL_COLS_MOBILE +
  SMART_PANEL_GAP * (SMART_PANEL_COLS_MOBILE - 1);

export const SMART_CARDS: SmartCardType[] = [
  {
    title: "All Topics",
    icon: iconAllTopics,
    disable: true,
  },
  {
    title: "Reef",
    icon: iconReef,
    disable: false,
  },
  {
    title: "Satellite",
    icon: iconSatellite,
    disable: false,
  },
  {
    title: "Waves",
    icon: iconWaves,
    disable: false,
  },
  {
    title: "Fishery",
    icon: iconFishery,
    disable: false,
  },
  {
    title: "Temperature",
    icon: iconTemperature,
    disable: false,
  },
  {
    title: "Climate",
    icon: iconClimate,
    disable: false,
  },
  {
    title: "Moorings",
    icon: iconMoorings,
    disable: false,
  },
  {
    title: "Gliders",
    icon: iconGlider,
    disable: false,
  },
  {
    title: "AUV",
    icon: iconAUV,
    disable: false,
  },
  {
    title: "Tutorials",
    icon: iconTutorials,
    disable: true,
  },
  {
    title: "Ocean Biota",
    icon: iconOceanBiota,
    disable: false,
  },
  {
    title: "Environment",
    icon: iconEnvironment,
    disable: false,
  },
  {
    title: "Chemical",
    icon: iconChemical,
    disable: false,
  },
  {
    title: "Tourism",
    icon: iconTourism,
    disable: false,
  },
  {
    title: "Animal Track",
    icon: iconAnimalTrack,
    disable: false,
  },
  {
    title: "Tide",
    icon: iconTide,
    disable: false,
  },
  {
    title: "Argo",
    icon: iconArgo,
    disable: false,
  },
  {
    title: "Vessel",
    icon: iconVessel,
    disable: false,
  },
  {
    title: "Geoscientific",
    icon: iconGeoscientific,
    disable: false,
  },
];
