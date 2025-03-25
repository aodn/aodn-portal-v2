import iconTutorials from "@/assets/topics-panel-icons/icon_tutorials.png";
import iconAllTopics from "@/assets/topics-panel-icons/icon_all_topics.png";
import iconLessTopics from "@/assets/topics-panel-icons/icon_less_topics.png";
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

export const TOPICS_PANEL_ROWS_DEFAULT = 2;

export const TOPICS_PANEL_COLS_DESKTOP = 9; // Change this number carefully, it will affect the fixed width of smart panel
export const TOPICS_PANEL_COLS_LAPTOP = 8;
export const TOPICS_PANEL_COLS_TABLET = 6;
export const TOPICS_PANEL_COLS_MOBILE = 3;

export const TOPICS_CARD_ICON_BOX_SIZE = 90;
export const TOPICS_CARD_HEIGHT = 136;

export const ALL_TOPICS_CARD: TopicCardType = {
  title: "Show All",
  icon: iconAllTopics,
  hide: false,
};

export const LESS_TOPICS_CARD: TopicCardType = {
  title: "Show Less",
  icon: iconLessTopics,
  hide: false,
};

export const TOPICS_CARDS: TopicCardType[] = [
  {
    title: "Sea Temperature",
    icon: iconSeaTemperature,
    hide: false,
  },
  {
    title: "Moorings",
    icon: iconMoorings,
    hide: false,
  },
  {
    title: "Argo Floats",
    icon: iconArgoFloats,
    hide: false,
  },
  {
    title: "Gliders",
    icon: iconGliders,
    hide: false,
  },
  {
    title: "Satellite",
    icon: iconSatellite,
    hide: false,
  },
  {
    title: "Waves",
    icon: iconWaves,
    hide: false,
  },
  {
    title: "Vessels",
    icon: iconVessels,
    hide: false,
  },
  {
    title: "Animal Tracking",
    icon: iconAnimalTracking,
    hide: false,
  },
  {
    title: "Tutorials",
    icon: iconTutorials,
    hide: false,
  },
  {
    title: "Currents",
    icon: iconCurrents,
    hide: false,
  },
  {
    title: "Water Quality",
    icon: iconWaterQuality,
    hide: false,
  },
  {
    title: "Ocean Biota",
    icon: iconOceanBiota,
    hide: false,
  },
  {
    title: "Molecular",
    icon: iconMolecular,
    hide: false,
  },
  {
    title: "Weather & Climate",
    icon: iconWeatherClimate,
    hide: false,
  },
  {
    title: "Acidification",
    icon: iconAcidification,
    hide: false,
  },
  {
    title: "Ocean Chemistry",
    icon: iconOceanChemistry,
    hide: false,
  },
  {
    title: "Tides",
    icon: iconTide,
    hide: false,
  },
  {
    title: "Fisheries",
    icon: iconFisheries,
    hide: true,
  },
  {
    title: "Industry",
    icon: iconIndustry,
    hide: true,
  },
  {
    title: "Gridded Datasets",
    icon: iconGriddedDatasets,
    hide: true,
  },
  {
    title: "Ocean Physics",
    icon: iconOceanPhysics,
    hide: true,
  },
  {
    title: "Underwater Vehicles",
    icon: iconUnderwaterVehicles,
    hide: true,
  },
  {
    title: "Plankton",
    icon: iconPlankton,
    hide: true,
  },
  {
    title: "Ocean Color",
    icon: iconOceanColor,
    hide: true,
  },
  {
    title: "Benthic",
    icon: iconBenthic,
    hide: true,
  },
  {
    title: "Time Series Datasets",
    icon: iconTimeSeriesDatasets,
    hide: true,
  },
];
