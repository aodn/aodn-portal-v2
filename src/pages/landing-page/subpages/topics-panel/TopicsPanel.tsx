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
import iconUnderwaterVehicles from "@/assets/topics-panel-icons/icon_underwater_vehicles.png";
import iconTide from "@/assets/topics-panel-icons/icon_tide.png";
import iconOceanPhysics from "@/assets/topics-panel-icons/icon_ocean_physics.png";
import iconOceanColor from "@/assets/topics-panel-icons/icon_ocean_color.png";
import iconBenthic from "@/assets/topics-panel-icons/icon_benthic.png";
import iconTimeSeriesDatasets from "@/assets/topics-panel-icons/icon_time_series_datasets.png";
import iconReef from "@/assets/topics-panel-icons/icon_reef.png";
import { SearchKeys } from "../../../../components/search/constants";
import { IconImos } from "../../../../assets/topics-panel-icons/icon_imos";
import { IconSeaTemperature } from "../../../../assets/topics-panel-icons/icon_sea_temperature";
import { IconMoorings } from "../../../../assets/topics-panel-icons/icon_moorings";
import { IconArgoFloats } from "../../../../assets/topics-panel-icons/icon_argo_floats";
import { IconGliders } from "../../../../assets/topics-panel-icons/icon_gliders";
import { IconSatellite } from "../../../../assets/topics-panel-icons/icon_satellite";
import { IconVessels } from "../../../../assets/topics-panel-icons/icon_vessels";
import { IconWaves } from "../../../../assets/topics-panel-icons/icon_waves";
import { IconFisheries } from "../../../../assets/topics-panel-icons/icon_fisheries";
import { IconAnimalTracking } from "../../../../assets/topics-panel-icons/icon_animal_tracking";
import { IconTutorials } from "../../../../assets/topics-panel-icons/icon_tutorials";
import { IconCurrents } from "../../../../assets/topics-panel-icons/icon_currents";
import { IconWaterQuality } from "../../../../assets/topics-panel-icons/icon_water_quality";
import { IconOceanBiota } from "../../../../assets/topics-panel-icons/icon_ocean_biota";
import { IconMolecular } from "../../../../assets/topics-panel-icons/icon_molecular";
import { IconWeatherClimate } from "../../../../assets/topics-panel-icons/icon_weather_climate";
import { IconAllTopics } from "../../../../assets/topics-panel-icons/icon_all_topics";
import { IconLessTopics } from "../../../../assets/topics-panel-icons/icon_less_topics";
import { IconAcidification } from "../../../../assets/topics-panel-icons/icon_acidification";
import { IconOceanChemistry } from "../../../../assets/topics-panel-icons/icon_ocean_chemistry";
import { IconPlankton } from "../../../../assets/topics-panel-icons/icon_plankton";
import { IconIndustry } from "../../../../assets/topics-panel-icons/icon_industry";
import { IconGriddedDatasets } from "../../../../assets/topics-panel-icons/icon_gridded_datasets";

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
        icon: IconSeaTemperature,
        handler: () => handleClickTopicCard("Sea Temperature"),
      },
      {
        title: "Moorings",
        icon: IconMoorings,
        handler: () => handleClickTopicCard("Moorings"),
      },
      {
        title: "Argo Floats",
        icon: IconArgoFloats,
        handler: () => handleClickTopicCard("Argo Floats"),
      },
      {
        title: "Gliders",
        icon: IconGliders,
        handler: () => handleClickTopicCard("Gliders"),
      },
      {
        title: "Satellite",
        icon: IconSatellite,
        handler: () => handleClickTopicCard("Satellite"),
      },
      {
        title: "Waves",
        icon: IconWaves,
        handler: () => handleClickTopicCard("Waves"),
      },
      {
        title: "Vessels",
        icon: IconVessels,
        handler: () => handleClickTopicCard("Vessels"),
      },
      {
        title: "Animal Tracking",
        icon: IconAnimalTracking,
        handler: () => handleClickTopicCard("Animal Tracking"),
      },
      {
        title: "Tutorials",
        icon: IconTutorials,
        handler: () => handleClickTopicCard("Tutorials"),
      },
      {
        title: "Currents",
        icon: IconCurrents,
        handler: () => handleClickTopicCard("Currents"),
      },
      {
        title: "Water Quality",
        icon: IconWaterQuality,
        handler: () => handleClickTopicCard("Water Quality"),
      },
      {
        title: "Ocean Biota",
        icon: IconOceanBiota,
        handler: () => handleClickTopicCard("Ocean Biota"),
      },
      {
        title: "Molecular",
        icon: IconMolecular,
        handler: () => handleClickTopicCard("Molecular"),
      },
      {
        title: "Weather & Climate",
        icon: IconWeatherClimate,
        handler: () => handleClickTopicCard("Weather & Climate"),
      },
      {
        title: "Acidification",
        icon: IconAcidification,
        handler: () => handleClickTopicCard("Acidification"),
      },
      {
        title: "Ocean Chemistry",
        icon: IconOceanChemistry,
        handler: () => handleClickTopicCard("Ocean Chemistry"),
      },
      {
        title: "Tides",
        icon: iconTide,
        handler: () => handleClickTopicCard("Tides"),
      },
      {
        title: "Fisheries",
        icon: IconFisheries,
        handler: () => handleClickTopicCard("Fisheries"),
      },
      {
        title: "Reef",
        icon: iconReef,
        handler: () => handleClickTopicCard("National Reef Monitoring Network"),
      },
      {
        title: "Industry",
        icon: IconIndustry,
        handler: () => handleClickTopicCard("Industry"),
      },
      {
        title: "Gridded Datasets",
        icon: IconGriddedDatasets,
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
        icon: IconPlankton,
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
      icon: IconLessTopics,
      handler: () => setShowAllTopics((prev) => !prev),
    }),
    [setShowAllTopics]
  );

  const ALL_TOPICS_CARD: TopicCardType = useMemo(
    () => ({
      title: "Show All",
      icon: IconAllTopics,
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

      // Disable left arrow when panel's left edge is at/near the container's left edge
      setIsLeftDisabled(panelLeft + tolerance >= containerLeft);

      // Disable right arrow when panel's right edge is at/near the container's right edge
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
