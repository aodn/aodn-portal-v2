import { FC, useCallback, useMemo, useRef, useState } from "react";
import Box from "@mui/material/Box";
import { IconButton, Stack } from "@mui/material";
import ArrowBackIosNewIcon from "@mui/icons-material/ArrowBackIosNew";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";
import { useAppDispatch } from "../../../../components/common/store/hooks";
import useRedirectSearch from "../../../../hooks/useRedirectSearch";
import useTopicsPanelSize from "../../../../hooks/useTopicsPanelSize";
import { useDebounce } from "../../../../hooks/useDebounce";
import { gap } from "../../../../styles/constants";
import { TOPICS_PANEL_GAP, SCROLL_BUTTON_SIZE } from "./constants";
import TopicCard, { TopicCardType } from "./TopicCard";
import {
  clearComponentParam,
  updateDatasetGroup,
  updateSearchText,
} from "../../../../components/common/store/componentParamReducer";
import { portalTheme } from "../../../../styles";
import { AnalyticsEvent } from "../../../../analytics/analyticsEvents";
import { trackCustomEvent } from "../../../../analytics/customEventTracker";
import iconTutorials from "@/assets/topics-panel-icons/icon_tutorials.png";
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
import iconReef from "@/assets/topics-panel-icons/icon_reef.png";
import iconAllTopics from "@/assets/topics-panel-icons/icon_all_topics.png";
import iconLessTopics from "@/assets/topics-panel-icons/icon_less_topics.png";
import { IconImos } from "../../../../assets/topics-panel-icons/icon_imos";
import { SearchKeys } from "../../../../components/search/constants";

interface TopicsPanelProps {}

const TopicsPanel: FC<TopicsPanelProps> = () => {
  const dispatch = useAppDispatch();
  const redirectSearch = useRedirectSearch();
  // This is a simple click topic card function that with updates search input text and clear all the filters
  // Can be changed to a function-switcher if any other functions are designed in the future
  const handleClickTopicCard = useCallback(
    (value: string) => {
      // Clear the component states
      dispatch(clearComponentParam());
      // Then update the search text with the selected topic value
      dispatch(updateSearchText(value));
      // Track topics panel button click
      trackCustomEvent(AnalyticsEvent.SEARCH_TOPIC_CLICK, {
        search_topic: value,
      });

      redirectSearch("TopicsPanel");
    },
    [dispatch, redirectSearch]
  );

  const TOPICS_CARDS: TopicCardType[] = useMemo(
    () => [
      {
        title: "IMOS",
        icon: IconImos,
        handler: () => {
          // Clear the component states
          dispatch(clearComponentParam());
          // Then update the search text with the selected topic value
          dispatch(updateDatasetGroup(SearchKeys.IMOS));
          // Track topics panel button click
          trackCustomEvent(AnalyticsEvent.SEARCH_TOPIC_CLICK, {
            search_topic: SearchKeys.IMOS,
          });

          redirectSearch("TopicsPanel");
        },
      },
      {
        title: "Sea Temperature",
        icon: iconSeaTemperature,
        handler: () => handleClickTopicCard("Sea Temperature"),
      },
      {
        title: "Moorings",
        icon: iconMoorings,
        handler: () => handleClickTopicCard("Moorings"),
      },
      {
        title: "Argo Floats",
        icon: iconArgoFloats,
        handler: () => handleClickTopicCard("Argo Floats"),
      },
      {
        title: "Gliders",
        icon: iconGliders,
        handler: () => handleClickTopicCard("Gliders"),
      },
      {
        title: "Satellite",
        icon: iconSatellite,
        handler: () => handleClickTopicCard("Satellite"),
      },
      {
        title: "Waves",
        icon: iconWaves,
        handler: () => handleClickTopicCard("Waves"),
      },
      {
        title: "Vessels",
        icon: iconVessels,
        handler: () => handleClickTopicCard("Vessels"),
      },
      {
        title: "Animal Tracking",
        icon: iconAnimalTracking,
        handler: () => handleClickTopicCard("Animal Tracking"),
      },
      {
        title: "Tutorials",
        icon: iconTutorials,
        handler: () => handleClickTopicCard("Tutorials"),
      },
      {
        title: "Currents",
        icon: iconCurrents,
        handler: () => handleClickTopicCard("Currents"),
      },
      {
        title: "Water Quality",
        icon: iconWaterQuality,
        handler: () => handleClickTopicCard("Water Quality"),
      },
      {
        title: "Ocean Biota",
        icon: iconOceanBiota,
        handler: () => handleClickTopicCard("Ocean Biota"),
      },
      {
        title: "Molecular",
        icon: iconMolecular,
        handler: () => handleClickTopicCard("Molecular"),
      },
      {
        title: "Weather & Climate",
        icon: iconWeatherClimate,
        handler: () => handleClickTopicCard("Weather & Climate"),
      },
      {
        title: "Acidification",
        icon: iconAcidification,
        handler: () => handleClickTopicCard("Acidification"),
      },
      {
        title: "Ocean Chemistry",
        icon: iconOceanChemistry,
        handler: () => handleClickTopicCard("Ocean Chemistry"),
      },
      {
        title: "Tides",
        icon: iconTide,
        handler: () => handleClickTopicCard("Tides"),
      },
      {
        title: "Fisheries",
        icon: iconFisheries,
        handler: () => handleClickTopicCard("Fisheries"),
      },
      {
        title: "Reef",
        icon: iconReef,
        handler: () => handleClickTopicCard("National Reef Monitoring Network"),
      },
      {
        title: "Industry",
        icon: iconIndustry,
        handler: () => handleClickTopicCard("Industry"),
      },
      {
        title: "Gridded Datasets",
        icon: iconGriddedDatasets,
        handler: () => handleClickTopicCard("Gridded Datasets"),
      },
      {
        title: "Ocean Physics",
        icon: iconOceanPhysics,
        handler: () => handleClickTopicCard("Ocean Physics"),
      },
      {
        title: "Underwater Vehicles",
        icon: iconUnderwaterVehicles,
        handler: () => handleClickTopicCard("Underwater Vehicles"),
      },
      {
        title: "Plankton",
        icon: iconPlankton,
        handler: () => handleClickTopicCard("Plankton"),
      },
      {
        title: "Ocean Color",
        icon: iconOceanColor,
        handler: () => handleClickTopicCard("Ocean Color"),
      },
      {
        title: "Benthic",
        icon: iconBenthic,
        handler: () => handleClickTopicCard("Benthic"),
      },
      {
        title: "Time Series Datasets",
        icon: iconTimeSeriesDatasets,
        handler: () => handleClickTopicCard("Time Series Datasets"),
      },
    ],
    [dispatch, handleClickTopicCard, redirectSearch]
  );

  const {
    showAllTopics,
    setShowAllTopics,
    topicsPanelHeight,
    topicsPanelWidth,
    topicsPanelContainerWidth,
  } = useTopicsPanelSize({ topicCardsCount: TOPICS_CARDS.length + 1 });
  // Reference to the scrollable container element
  const containerRef = useRef<HTMLDivElement>(null);
  // Reference to the panel of topics inside the container
  const topicsPanelRef = useRef<HTMLDivElement>(null);

  // States to track if left/right arrows should be disabled
  const [isLeftDisabled, setIsLeftDisabled] = useState(true);
  const [isRightDisabled, setIsRightDisabled] = useState(false);

  const LESS_TOPICS_CARD: TopicCardType = useMemo(
    () => ({
      title: "Show Less",
      icon: iconLessTopics,
      handler: () => setShowAllTopics((prev) => !prev),
    }),
    [setShowAllTopics]
  );

  const ALL_TOPICS_CARD: TopicCardType = useMemo(
    () => ({
      title: "Show All",
      icon: iconAllTopics,
      handler: () => setShowAllTopics((prev) => !prev),
    }),
    [setShowAllTopics]
  );

  // Helper to check the position of the topics panel relative to its container
  const checkPosition = useCallback(() => {
    if (containerRef.current && topicsPanelRef.current) {
      // Get the boundaries of both container and panel
      const containerLeft = containerRef.current.getBoundingClientRect().left;
      const panelLeft = topicsPanelRef.current.getBoundingClientRect().left;
      const containerRight = containerRef.current.getBoundingClientRect().right;
      const panelRight = topicsPanelRef.current.getBoundingClientRect().right;

      // Use a small tolerance to handle precision issues
      const tolerance = 10;

      // Disable left arrow when panel's left edge is at/near container's left edge
      setIsLeftDisabled(panelLeft + tolerance >= containerLeft);

      // Disable right arrow when panel's right edge is at/near container's right edge
      setIsRightDisabled(panelRight - tolerance <= containerRight);
    }
  }, []);

  // Handler for programmatic scrolling triggered by arrow button clicks
  const handleScroll = useCallback(
    (scrollOffset: number) => {
      if (containerRef && containerRef.current) {
        containerRef.current.scrollTo({
          left: containerRef.current.scrollLeft + scrollOffset,
          behavior: "smooth",
        });
      }

      // Check position after scrolling completes
      // Apply delay to allow animation to finish
      setTimeout(() => {
        checkPosition();
      }, 500);
    },
    [checkPosition]
  );

  // Handler for user-initiated swiping of the topics panel
  const handleManualScroll = useDebounce(() => {
    checkPosition();
  }, 150);

  return (
    <Box display="flex" justifyContent="space-between" alignItems="center">
      {!showAllTopics && (
        <Box
          sx={{
            transform: "translate(-50%, -50%)",
          }}
        >
          <IconButton
            onClick={() => handleScroll(-topicsPanelContainerWidth)}
            disabled={isLeftDisabled}
            sx={{
              visibility: isLeftDisabled ? "hidden" : "visible",
              backgroundColor: "#FFF",
              borderRadius: "50%",
              height: "32px",
              width: "32px",
              "&:hover": {
                backgroundColor: "#FFF",
              },
              "&:focus": {
                backgroundColor: "#FFF",
              },
              "&:active": {
                backgroundColor: "#FFF",
              },
            }}
          >
            <ArrowBackIosNewIcon
              sx={{
                pr: gap.sm,
                height: SCROLL_BUTTON_SIZE,
                width: SCROLL_BUTTON_SIZE,
                color: portalTheme.palette.grey700,
              }}
            />
          </IconButton>
        </Box>
      )}
      <Box
        ref={containerRef}
        sx={{
          width: topicsPanelContainerWidth,
          height: topicsPanelHeight,
          "&::-webkit-scrollbar": {
            display: "none",
          },
          msOverflowStyle: "none",
          scrollbarWidth: "none",
          overflow: "hidden",
          overflowX: "scroll",
        }}
        onScroll={handleManualScroll}
      >
        <Stack
          ref={topicsPanelRef}
          direction="row"
          flexWrap="wrap"
          gap={`${TOPICS_PANEL_GAP}px`}
          width={showAllTopics ? topicsPanelContainerWidth : topicsPanelWidth}
        >
          <TopicCard
            cardData={showAllTopics ? LESS_TOPICS_CARD : ALL_TOPICS_CARD}
          />
          {TOPICS_CARDS.map((item) => (
            <TopicCard key={item.title} cardData={item} />
          ))}
        </Stack>
      </Box>
      {!showAllTopics && (
        <Box
          sx={{
            transform: "translate(50%, -50%)",
          }}
        >
          <IconButton
            onClick={() => handleScroll(topicsPanelContainerWidth)}
            disabled={isRightDisabled}
            sx={{
              visibility: isRightDisabled ? "hidden" : "visible",
              backgroundColor: "#FFF",
              borderRadius: "50%",
              height: "32px",
              width: "32px",
              "&:hover": {
                backgroundColor: "#FFF",
              },
              "&:focus": {
                backgroundColor: "#FFF",
              },
              "&:active": {
                backgroundColor: "#FFF",
              },
            }}
          >
            <ArrowForwardIosIcon
              sx={{
                pl: gap.sm,
                height: SCROLL_BUTTON_SIZE,
                width: SCROLL_BUTTON_SIZE,
                color: portalTheme.palette.grey700,
              }}
            />
          </IconButton>
        </Box>
      )}
    </Box>
  );
};

export default TopicsPanel;
