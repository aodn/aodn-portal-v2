import { FC, useCallback, useMemo, useRef, useState } from "react";
import Box from "@mui/material/Box";
import { IconButton, Stack } from "@mui/material";
import ArrowBackIosNewIcon from "@mui/icons-material/ArrowBackIosNew";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";
import { useAppDispatch } from "@/app/store/hooks";
import useBreakpoint from "../../../../hooks/useBreakpoint";
import useRedirectSearch from "../../../../hooks/useRedirectSearch";
import useTopicsPanelSize from "../../../../hooks/useTopicsPanelSize";
import { useDebounce } from "../../../../hooks/useDebounce";
import { gap } from "../../../../styles/constants";
import {
  TOPICS_PANEL_ROW_GAP,
  TOPICS_PANEL_ROWS_DEFAULT,
  TOPICS_CARD_HEIGHT,
  TOPICS_CARD_ICON_BOX_SIZE,
  TOPICS_CARD_SHADOW_SPACE,
  SCROLL_BUTTON_GAP,
  SCROLL_BUTTON_ICON_SIZE,
  SCROLL_BUTTON_SIZE,
} from "./constants";
import TopicCard, { TopicCardType } from "./TopicCard";
import {
  clearComponentParam,
  updateDatasetGroup,
  updateParameterVocabs,
  updateSearchText,
} from "@/app/store/componentParamReducer";
import { portalTheme } from "../../../../styles";
import { AnalyticsEvent } from "../../../../analytics/analyticsEvents";
import { trackCustomEvent } from "../../../../analytics/customEventTracker";

import { SearchKeys } from "../../../../components/search/constants";
import IconImos from "@/assets/topics-panel-icons/icon_imos.svg";
import IconWaterTemperature from "@/assets/topics-panel-icons/icon_water_temperature.svg";
import IconMoorings from "@/assets/topics-panel-icons/icon_moorings.svg";
import IconArgoFloats from "@/assets/topics-panel-icons/icon_argo_floats.svg";
import IconGliders from "@/assets/topics-panel-icons/icon_gliders.svg";
import IconSatellite from "@/assets/topics-panel-icons/icon_satellite.svg";
import IconVessels from "@/assets/topics-panel-icons/icon_vessels.svg";
import IconWaves from "@/assets/topics-panel-icons/icon_waves.svg";
import IconFisheries from "@/assets/topics-panel-icons/icon_fisheries.svg";
import IconAnimalTracking from "@/assets/topics-panel-icons/icon_animal_tracking.svg";
import IconCurrents from "@/assets/topics-panel-icons/icon_currents.svg";
import IconWaterQuality from "@/assets/topics-panel-icons/icon_water_quality.svg";
import IconOceanBiota from "@/assets/topics-panel-icons/icon_ocean_biota.svg";
import IconMolecular from "@/assets/topics-panel-icons/icon_molecular.svg";
import IconWeather from "@/assets/topics-panel-icons/icon_weather.svg";
import IconClimate from "@/assets/topics-panel-icons/icon_climate.svg";
import IconAllTopics from "@/assets/topics-panel-icons/icon_all_topics.svg";
import IconLessTopics from "@/assets/topics-panel-icons/icon_less_topics.svg";
import IconAcidification from "@/assets/topics-panel-icons/icon_acidification.svg";
import IconPlankton from "@/assets/topics-panel-icons/icon_plankton.svg";
import IconIndustry from "@/assets/topics-panel-icons/icon_industry.svg";
import IconAutonomousUnderwaterVehicles from "@/assets/topics-panel-icons/icon_autonomous_underwater_vehicles.svg";
import IconOceanColor from "@/assets/topics-panel-icons/icon_ocean_color.svg";
import IconBenthic from "@/assets/topics-panel-icons/icon_benthic.svg";
import IconTide from "@/assets/topics-panel-icons/icon_tide.svg";
import IconReef from "@/assets/topics-panel-icons/icon_reef.svg";

interface TopicsPanelProps {}

// Centre the arrows on the tiles, not on the whole grid: the labels under
// the last row would otherwise push them down
const SCROLL_BUTTON_CENTRE_Y =
  ((TOPICS_PANEL_ROWS_DEFAULT - 1) *
    (TOPICS_CARD_HEIGHT + TOPICS_PANEL_ROW_GAP) +
    TOPICS_CARD_ICON_BOX_SIZE) /
  2;

const scrollButtonSx = {
  position: "absolute",
  top: SCROLL_BUTTON_CENTRE_Y,
  transform: "translateY(-50%)",
  zIndex: 1,
  width: SCROLL_BUTTON_SIZE,
  height: SCROLL_BUTTON_SIZE,
  borderRadius: "50%",
  backgroundColor: portalTheme.palette.common.white,
  "&:hover, &:focus, &:active": {
    backgroundColor: portalTheme.palette.common.white,
  },
} as const;

const TopicsPanel: FC<TopicsPanelProps> = () => {
  const dispatch = useAppDispatch();
  const redirectSearch = useRedirectSearch();
  const { isMobile } = useBreakpoint();
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

  // Same as handleClickTopicCard, but filters by a parameter vocab instead of
  // a free text search
  const handleClickParameterTopicCard = useCallback(
    (parameter: string) => {
      // Clear the component states
      dispatch(clearComponentParam());
      // Then update the parameter filter with the selected topic value
      dispatch(updateParameterVocabs([{ label: parameter }]));
      // Track topics panel button click
      trackCustomEvent(AnalyticsEvent.SEARCH_TOPIC_CLICK, {
        search_topic: parameter,
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
        iconSize: 88,
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
        title: "Water Temperature",
        icon: IconWaterTemperature,
        iconSize: 52,
        handler: () => handleClickParameterTopicCard("Temperature"),
      },
      {
        title: "Moorings",
        icon: IconMoorings,
        iconSize: 52,
        handler: () => handleClickTopicCard("Moorings"),
      },
      {
        title: "Argo Floats",
        icon: IconArgoFloats,
        iconSize: 64,
        handler: () => handleClickTopicCard("Argo Floats"),
      },
      {
        title: "Gliders",
        icon: IconGliders,
        iconSize: 64,
        handler: () => handleClickTopicCard("Gliders"),
      },
      {
        title: "Satellite",
        icon: IconSatellite,
        iconSize: 58,
        handler: () => handleClickTopicCard("Satellite"),
      },
      {
        title: "Waves",
        icon: IconWaves,
        iconSize: 72,
        handler: () => handleClickTopicCard("Waves"),
      },
      {
        title: "Vessels",
        icon: IconVessels,
        iconSize: 66,
        handler: () => handleClickTopicCard("Vessels"),
      },
      {
        title: "Animal Tracking",
        icon: IconAnimalTracking,
        iconSize: 50,
        handler: () => handleClickTopicCard("Animal Tracking"),
      },
      {
        title: "Currents",
        icon: IconCurrents,
        iconSize: 66,
        handler: () => handleClickTopicCard("Currents"),
      },
      {
        title: "Water Quality",
        icon: IconWaterQuality,
        iconSize: 62,
        handler: () => handleClickTopicCard("Water Quality"),
      },
      {
        title: "Ocean Biota",
        icon: IconOceanBiota,
        iconSize: 58,
        handler: () => handleClickParameterTopicCard("Ocean Biota"),
      },
      {
        title: "Molecular",
        icon: IconMolecular,
        handler: () => handleClickTopicCard("Molecular"),
      },
      {
        title: "Weather",
        icon: IconWeather,
        iconSize: 78,
        handler: () => handleClickTopicCard("Weather"),
      },
      {
        title: "Climate",
        icon: IconClimate,
        iconSize: 84,
        handler: () => handleClickTopicCard("Climate"),
      },
      {
        title: "Acidification",
        icon: IconAcidification,
        iconSize: 60,
        handler: () => handleClickTopicCard("Acidification"),
      },
      {
        title: "Tides",
        icon: IconTide,
        iconSize: 88,
        handler: () => handleClickTopicCard("Tides"),
      },
      {
        title: "Fisheries",
        icon: IconFisheries,
        iconSize: 55,
        handler: () => handleClickTopicCard("Fisheries"),
      },
      {
        title: "Reef",
        icon: IconReef,
        iconSize: 60,
        handler: () => handleClickTopicCard("Reef"),
      },
      {
        title: "Industry",
        icon: IconIndustry,
        handler: () => handleClickTopicCard("Industry"),
      },
      {
        title: "Autonomous Underwater Vehicles",
        icon: IconAutonomousUnderwaterVehicles,
        handler: () => handleClickTopicCard("Autonomous underwater vehicles"),
      },
      {
        title: "Plankton",
        icon: IconPlankton,
        iconSize: 64,
        handler: () => handleClickTopicCard("Plankton"),
      },
      {
        title: "Ocean Colour",
        icon: IconOceanColor,
        iconSize: 66,
        handler: () => handleClickTopicCard("Ocean Colour"),
      },
      {
        title: "Benthic",
        icon: IconBenthic,
        iconSize: 60,
        handler: () => handleClickTopicCard("Benthic"),
      },
    ],
    [
      dispatch,
      handleClickTopicCard,
      handleClickParameterTopicCard,
      redirectSearch,
    ]
  );

  const {
    showAllTopics,
    setShowAllTopics,
    topicsPanelHeight,
    topicsPanelWidth,
    topicsPanelContainerWidth,
    topicsPanelColumnGap,
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
      iconSize: 42,
      iconOpacity: 0.8,
      handler: () => setShowAllTopics((prev) => !prev),
    }),
    [setShowAllTopics]
  );

  const ALL_TOPICS_CARD: TopicCardType = useMemo(
    () => ({
      title: "Show All",
      icon: IconAllTopics,
      iconSize: 42,
      iconOpacity: 0.8,
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

  const showScrollButtons = !showAllTopics && !isMobile;
  // Arrows sit outside the grid so they don't take layout width
  const scrollButtonOffset = `-${SCROLL_BUTTON_GAP + SCROLL_BUTTON_SIZE}px`;

  return (
    <Box display="flex" justifyContent="center">
      <Box position="relative" width={topicsPanelContainerWidth}>
        {showScrollButtons && (
          <IconButton
            aria-label="Previous topics"
            onClick={() => handleScroll(-topicsPanelContainerWidth)}
            disabled={isLeftDisabled}
            sx={{
              ...scrollButtonSx,
              left: scrollButtonOffset,
              visibility: isLeftDisabled ? "hidden" : "visible",
            }}
          >
            <ArrowBackIosNewIcon
              sx={{
                pr: gap.sm,
                height: SCROLL_BUTTON_ICON_SIZE,
                width: SCROLL_BUTTON_ICON_SIZE,
                color: portalTheme.palette.grey700,
              }}
            />
          </IconButton>
        )}
        <Box
          ref={containerRef}
          sx={{
            // Extra room on the right so the last visible column's tile
            // shadow isn't clipped; the negative margin keeps the grid centred
            width: topicsPanelContainerWidth + TOPICS_CARD_SHADOW_SPACE,
            mr: `-${TOPICS_CARD_SHADOW_SPACE}px`,
            pr: `${TOPICS_CARD_SHADOW_SPACE}px`,
            boxSizing: "border-box",
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
            rowGap={`${TOPICS_PANEL_ROW_GAP}px`}
            columnGap={`${topicsPanelColumnGap}px`}
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
        {showScrollButtons && (
          <IconButton
            aria-label="Next topics"
            onClick={() => handleScroll(topicsPanelContainerWidth)}
            disabled={isRightDisabled}
            sx={{
              ...scrollButtonSx,
              right: scrollButtonOffset,
              visibility: isRightDisabled ? "hidden" : "visible",
            }}
          >
            <ArrowForwardIosIcon
              sx={{
                pl: gap.sm,
                height: SCROLL_BUTTON_ICON_SIZE,
                width: SCROLL_BUTTON_ICON_SIZE,
                color: portalTheme.palette.grey700,
              }}
            />
          </IconButton>
        )}
      </Box>
    </Box>
  );
};

export default TopicsPanel;
