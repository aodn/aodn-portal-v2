import iconTutorials from "@/assets/topics-panel-icons/icon_tutorials.png";
import iconAllTopics from "@/assets/topics-panel-icons/icon_all_topics.png";
import iconSatellite from "@/assets/topics-panel-icons/icon_satellite.png";
import iconWaves from "@/assets/topics-panel-icons/icon_waves.png";
import iconSeaTemperature from "@/assets/topics-panel-icons/icon_sea_temperature.png";
import iconWeatherClimate from "@/assets/topics-panel-icons/icon_weather_climate.png";
import iconMoorings from "@/assets/topics-panel-icons/icon_moorings.png";
import iconGliders from "@/assets/topics-panel-icons/icon_gliders.png";
import iconUnderwaterVehicles from "@/assets/topics-panel-icons/icon_underwater_vehicles.png";
import iconOceanBiota from "@/assets/topics-panel-icons/icon_ocean_biota.png";
import iconFisheries from "@/assets/topics-panel-icons/icon_fisheries.png";
import iconOceanChemistry from "@/assets/topics-panel-icons/icon_ocean_chemistry.png";
import iconAnimalTracking from "@/assets/topics-panel-icons/icon_animal_tracking.png";
import iconTide from "@/assets/topics-panel-icons/icon_tide.png";
import iconArgoFloats from "@/assets/topics-panel-icons/icon_argo_floats.png";
import iconVessels from "@/assets/topics-panel-icons/icon_vessels.png";
import iconCurrents from "@/assets/topics-panel-icons/icon_currents.png";
import iconWaterQuality from "@/assets/topics-panel-icons/icon_water_quality.png";
import iconMolecular from "@/assets/topics-panel-icons/icon_molecular.png";
import iconAcidification from "@/assets/topics-panel-icons/icon_acidification.png";
import iconIndustry from "@/assets/topics-panel-icons/icon_industry.png";
import iconGriddedDatasets from "@/assets/topics-panel-icons/icon_gridded_datasets.png";
import iconOceanPhysics from "@/assets/topics-panel-icons/icon_ocean_physics.png";
import iconPlankton from "@/assets/topics-panel-icons/icon_plankton.png";
import iconOceanColor from "@/assets/topics-panel-icons/icon_ocean_color.png";
import iconBenthic from "@/assets/topics-panel-icons/icon_benthic.png";
import iconTimeSeriesDatasets from "@/assets/topics-panel-icons/icon_time_series_datasets.png";

import { TopicCardType } from "./TopicCard";

export const SCROLL_BUTTON_SIZE = 20;

export const TOPICS_PANEL_GAP = 16;

export const TOPICS_PANEL_ROWS = 2;

const TOPICS_PANEL_COLS_DESKTOP = 9; // Change this number carefully, it will affect the fixed width of smart panel
const TOPICS_PANEL_COLS_LAPTOP = 8;
const TOPICS_PANEL_COLS_TABLET = 6;
const TOPICS_PANEL_COLS_MOBILE = 3;

export const TOPICS_CARD_ICON_BOX_SIZE = 90;
export const TOPICS_CARD_HEIGHT = 136;

export const TOPICS_PANEL_HEIGHT =
  TOPICS_CARD_HEIGHT * TOPICS_PANEL_ROWS +
  TOPICS_PANEL_GAP * (TOPICS_PANEL_ROWS - 1);
export const TOPICS_PANEL_WIDTH =
  TOPICS_CARD_ICON_BOX_SIZE * TOPICS_PANEL_COLS_DESKTOP +
  TOPICS_PANEL_GAP * (TOPICS_PANEL_COLS_DESKTOP - 1);

export const TOPICS_PANEL_CONTAINER_WIDTH_DESKTOP =
  TOPICS_CARD_ICON_BOX_SIZE * TOPICS_PANEL_COLS_DESKTOP +
  TOPICS_PANEL_GAP * (TOPICS_PANEL_COLS_DESKTOP - 1);
export const TOPICS_PANEL_CONTAINER_WIDTH_LAPTOP =
  TOPICS_CARD_ICON_BOX_SIZE * TOPICS_PANEL_COLS_LAPTOP +
  TOPICS_PANEL_GAP * (TOPICS_PANEL_COLS_LAPTOP - 1);
export const TOPICS_PANEL_CONTAINER_WIDTH_TABLET =
  TOPICS_CARD_ICON_BOX_SIZE * TOPICS_PANEL_COLS_TABLET +
  TOPICS_PANEL_GAP * (TOPICS_PANEL_COLS_TABLET - 1);
export const TOPICS_PANEL_CONTAINER_WIDTH_MOBILE =
  TOPICS_CARD_ICON_BOX_SIZE * TOPICS_PANEL_COLS_MOBILE +
  TOPICS_PANEL_GAP * (TOPICS_PANEL_COLS_MOBILE - 1);

export const TOPICS_CARDS: TopicCardType[] = [
  {
    title: "All Topics",
    icon: iconAllTopics,
    disable: true,
    hide: false,
  },
  {
    title: "Sea Temperature",
    icon: iconSeaTemperature,
    disable: false,
    hide: false,
  },
  {
    title: "Moorings",
    icon: iconMoorings,
    disable: false,
    hide: false,
  },
  {
    title: "Argo Floats",
    icon: iconArgoFloats,
    disable: false,
    hide: false,
  },
  {
    title: "Gliders",
    icon: iconGliders,
    disable: false,
    hide: false,
  },
  {
    title: "Satellite",
    icon: iconSatellite,
    disable: false,
    hide: false,
  },
  {
    title: "Waves",
    icon: iconWaves,
    disable: false,
    hide: false,
  },
  {
    title: "Vessels",
    icon: iconVessels,
    disable: false,
    hide: false,
  },
  {
    title: "Animal Tracking",
    icon: iconAnimalTracking,
    disable: false,
    hide: false,
  },
  {
    title: "Tutorials",
    icon: iconTutorials,
    disable: true,
    hide: false,
  },
  {
    title: "Currents",
    icon: iconCurrents,
    disable: true,
    hide: false,
  },
  {
    title: "Water Quality",
    icon: iconWaterQuality,
    disable: true,
    hide: false,
  },
  {
    title: "Ocean Biota",
    icon: iconOceanBiota,
    disable: false,
    hide: false,
  },
  {
    title: "Molecular",
    icon: iconMolecular,
    disable: false,
    hide: false,
  },
  {
    title: "Weather & Climate",
    icon: iconWeatherClimate,
    disable: false,
    hide: false,
  },
  {
    title: "Acidification",
    icon: iconAcidification,
    disable: false,
    hide: false,
  },
  {
    title: "Ocean Chemistry",
    icon: iconOceanChemistry,
    disable: false,
    hide: false,
  },
  {
    title: "Tides",
    icon: iconTide,
    disable: false,
    hide: false,
  },
  {
    title: "Fisheries",
    icon: iconFisheries,
    disable: false,
    hide: true,
  },
  {
    title: "Industry",
    icon: iconIndustry,
    disable: false,
    hide: true,
  },
  {
    title: "Gridded Datasets",
    icon: iconGriddedDatasets,
    disable: false,
    hide: true,
  },
  {
    title: "Ocean Physics",
    icon: iconOceanPhysics,
    disable: false,
    hide: true,
  },
  {
    title: "Underwater Vehicles",
    icon: iconUnderwaterVehicles,
    disable: false,
    hide: true,
  },
  {
    title: "Plankton",
    icon: iconPlankton,
    disable: false,
    hide: true,
  },
  {
    title: "Ocean Color",
    icon: iconOceanColor,
    disable: false,
    hide: true,
  },
  {
    title: "Benthic",
    icon: iconBenthic,
    disable: false,
    hide: true,
  },
  {
    title: "Time Series Datasets",
    icon: iconTimeSeriesDatasets,
    disable: false,
    hide: true,
  },
];
