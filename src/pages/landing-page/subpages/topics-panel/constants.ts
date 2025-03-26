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
};

export const LESS_TOPICS_CARD: TopicCardType = {
  title: "Show Less",
  icon: iconLessTopics,
};

export const TOPICS_CARDS: TopicCardType[] = [
  {
    title: "Sea Temperature",
    icon: iconSeaTemperature,
  },
  {
    title: "Moorings",
    icon: iconMoorings,
  },
  {
    title: "Argo Floats",
    icon: iconArgoFloats,
  },
  {
    title: "Gliders",
    icon: iconGliders,
  },
  {
    title: "Satellite",
    icon: iconSatellite,
  },
  {
    title: "Waves",
    icon: iconWaves,
  },
  {
    title: "Vessels",
    icon: iconVessels,
  },
  {
    title: "Animal Tracking",
    icon: iconAnimalTracking,
  },
  {
    title: "Tutorials",
    icon: iconTutorials,
  },
  {
    title: "Currents",
    icon: iconCurrents,
  },
  {
    title: "Water Quality",
    icon: iconWaterQuality,
  },
  {
    title: "Ocean Biota",
    icon: iconOceanBiota,
  },
  {
    title: "Molecular",
    icon: iconMolecular,
  },
  {
    title: "Weather & Climate",
    icon: iconWeatherClimate,
  },
  {
    title: "Acidification",
    icon: iconAcidification,
  },
  {
    title: "Ocean Chemistry",
    icon: iconOceanChemistry,
  },
  {
    title: "Tides",
    icon: iconTide,
  },
  {
    title: "Fisheries",
    icon: iconFisheries,
  },
  {
    title: "Industry",
    icon: iconIndustry,
  },
  {
    title: "Gridded Datasets",
    icon: iconGriddedDatasets,
  },
  {
    title: "Ocean Physics",
    icon: iconOceanPhysics,
  },
  {
    title: "Underwater Vehicles",
    icon: iconUnderwaterVehicles,
  },
  {
    title: "Plankton",
    icon: iconPlankton,
  },
  {
    title: "Ocean Color",
    icon: iconOceanColor,
  },
  {
    title: "Benthic",
    icon: iconBenthic,
  },
  {
    title: "Time Series Datasets",
    icon: iconTimeSeriesDatasets,
  },
];
