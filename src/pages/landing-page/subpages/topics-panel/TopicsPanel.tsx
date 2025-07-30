import { FC, useCallback, useRef, useState } from "react";
import Box from "@mui/material/Box";
import { IconButton, Stack } from "@mui/material";
import ArrowBackIosNewIcon from "@mui/icons-material/ArrowBackIosNew";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";
import { useAppDispatch } from "../../../../components/common/store/hooks";
import useRedirectSearch from "../../../../hooks/useRedirectSearch";
import useTopicsPanelSize from "../../../../hooks/useTopicsPanelSize";
import { useDebounce } from "../../../../hooks/useDebounce";
import { color, gap, padding } from "../../../../styles/constants";
import {
  TOPICS_CARDS,
  TOPICS_PANEL_GAP,
  SCROLL_BUTTON_SIZE,
  ALL_TOPICS_CARD,
  LESS_TOPICS_CARD,
} from "./constants";
import TopicCard from "./TopicCard";
import {
  clearComponentParam,
  updateSearchText,
} from "../../../../components/common/store/componentParamReducer";

interface TopicsPanelProps {}

const TopicsPanel: FC<TopicsPanelProps> = () => {
  const dispatch = useAppDispatch();
  const redirectSearch = useRedirectSearch();
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

  // This is a simple click topic card function that with update search input text and clear all the filters
  // Can be change to a function-switcher if any other functions are designed in the future
  const handleClickTopicCard = useCallback(
    (value: string) => {
      // Clear the component states
      dispatch(clearComponentParam());
      // Then update search text with the selected topic value
      dispatch(updateSearchText(value));

      redirectSearch("TopicsPanel");
    },
    [dispatch, redirectSearch]
  );

  const handleClickAllTopicsCard = useCallback(() => {
    setShowAllTopics((prev) => !prev);
  }, [setShowAllTopics]);

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
        <Box sx={{ pr: { sm: padding.small } }}>
          <IconButton
            onClick={() => handleScroll(-topicsPanelContainerWidth)}
            disabled={isLeftDisabled}
          >
            <ArrowBackIosNewIcon
              sx={{
                pr: gap.sm,
                height: SCROLL_BUTTON_SIZE,
                width: SCROLL_BUTTON_SIZE,
                color: isLeftDisabled ? color.gray.extraLight : color.gray.dark,
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
            handleClickTopicCard={handleClickAllTopicsCard}
          />
          {TOPICS_CARDS.map((item) => (
            <TopicCard
              key={item.title}
              cardData={item}
              handleClickTopicCard={handleClickTopicCard}
            />
          ))}
        </Stack>
      </Box>
      {!showAllTopics && (
        <Box sx={{ pl: { sm: padding.small } }}>
          <IconButton
            onClick={() => handleScroll(topicsPanelContainerWidth)}
            disabled={isRightDisabled}
          >
            <ArrowForwardIosIcon
              sx={{
                pl: gap.sm,
                height: SCROLL_BUTTON_SIZE,
                width: SCROLL_BUTTON_SIZE,
                color: isRightDisabled
                  ? color.gray.extraLight
                  : color.gray.dark,
              }}
            />
          </IconButton>
        </Box>
      )}
    </Box>
  );
};

export default TopicsPanel;
