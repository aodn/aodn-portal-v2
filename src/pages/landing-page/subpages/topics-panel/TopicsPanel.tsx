import { FC, useCallback, useRef } from "react";
import Box from "@mui/material/Box";
import { IconButton, Stack } from "@mui/material";
import ArrowBackIosNewIcon from "@mui/icons-material/ArrowBackIosNew";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";
import useBreakpoint from "../../../../hooks/useBreakpoint";
import { useAppDispatch } from "../../../../components/common/store/hooks";
import useRedirectSearch from "../../../../hooks/useRedirectSearch";
import useTopicsPanelSize from "../../../../hooks/useTopicsPanelSize";
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
  updateDateTimeFilterRange,
  updateImosOnly,
  updateParameterVocabs,
  updateSearchText,
  updateUpdateFreq,
} from "../../../../components/common/store/componentParamReducer";

interface TopicsPanelProps {}

const TopicsPanel: FC<TopicsPanelProps> = () => {
  const dispatch = useAppDispatch();
  const redirectSearch = useRedirectSearch();
  const {
    showAllTopics,
    setShowAllTopics,
    getTopicsPanelHeight,
    getTopicsPanelWidth,
    topicsPanelContainerWidth,
  } = useTopicsPanelSize({ topicCardsCount: TOPICS_CARDS.length });
  const boxRef = useRef<HTMLDivElement>(null);

  // This is a simple click topic card function that with update search input text and clear all the filters
  // Can be change to a function-switcher if any other functions are designed in the future
  const handleClickTopicCard = useCallback(
    (value: string) => {
      dispatch(updateParameterVocabs([]));
      dispatch(updateDateTimeFilterRange({}));
      dispatch(updateImosOnly(false));
      dispatch(updateUpdateFreq(undefined));
      dispatch(updateSearchText(value));
      redirectSearch("TopicsPanel");
    },
    [dispatch, redirectSearch]
  );

  const handleClickAllTopicsCard = useCallback(() => {
    setShowAllTopics((prev) => !prev);
  }, [setShowAllTopics]);

  const handleScroll = useCallback(
    (scrollOffset: number) => {
      if (boxRef && boxRef.current) {
        boxRef.current.scrollTo({
          left: boxRef.current.scrollLeft + scrollOffset,
          behavior: "smooth",
        });
      }
    },
    [boxRef]
  );

  return (
    <Box display="flex" justifyContent="space-between" alignItems="center">
      {!showAllTopics && (
        <Box sx={{ pr: { sm: padding.small } }}>
          <IconButton
            onClick={() =>
              handleScroll((-getTopicsPanelWidth() - TOPICS_PANEL_GAP) / 3)
            }
          >
            <ArrowBackIosNewIcon
              sx={{
                pr: gap.sm,
                height: SCROLL_BUTTON_SIZE,
                width: SCROLL_BUTTON_SIZE,
                color: color.gray.dark,
              }}
            />
          </IconButton>
        </Box>
      )}
      <Box
        ref={boxRef}
        sx={{
          width: topicsPanelContainerWidth,
          height: getTopicsPanelHeight(),
          "&::-webkit-scrollbar": {
            display: "none",
          },
          "-ms-overflow-style": "none",
          "scrollbar-width": "none",
          overflow: "hidden",
          overflowX: "scroll",
        }}
      >
        <Stack
          direction="row"
          flexWrap="wrap"
          gap={`${TOPICS_PANEL_GAP}px`}
          width={
            showAllTopics ? topicsPanelContainerWidth : getTopicsPanelWidth()
          }
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
            onClick={() =>
              handleScroll((getTopicsPanelWidth() + TOPICS_PANEL_GAP) / 3)
            }
          >
            <ArrowForwardIosIcon
              sx={{
                pl: gap.sm,
                height: SCROLL_BUTTON_SIZE,
                width: SCROLL_BUTTON_SIZE,
                color: color.gray.dark,
              }}
            />
          </IconButton>
        </Box>
      )}
    </Box>
  );
};

export default TopicsPanel;
