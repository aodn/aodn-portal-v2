import { FC, useCallback, useRef, useState } from "react";
import Box from "@mui/material/Box";
import { IconButton, Stack } from "@mui/material";
import ArrowBackIosNewIcon from "@mui/icons-material/ArrowBackIosNew";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";
import useBreakpoint from "../../../../hooks/useBreakpoint";
import { useAppDispatch } from "../../../../components/common/store/hooks";
import useRedirectSearch from "../../../../hooks/useRedirectSearch";
import { color, gap, padding } from "../../../../styles/constants";
import {
  TOPICS_CARDS,
  TOPICS_PANEL_GAP,
  TOPICS_PANEL_HEIGHT,
  TOPICS_PANEL_CONTAINER_WIDTH_DESKTOP,
  TOPICS_PANEL_CONTAINER_WIDTH_LAPTOP,
  TOPICS_PANEL_CONTAINER_WIDTH_MOBILE,
  TOPICS_PANEL_CONTAINER_WIDTH_TABLET,
  TOPICS_PANEL_WIDTH,
  SCROLL_BUTTON_SIZE,
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
  const { isAboveDesktop } = useBreakpoint();
  const boxRef = useRef<HTMLDivElement>(null);
  const [shouldShowAll, setShouldShowAll] = useState<boolean>(false);

  const handleClickShowMore = useCallback(() => {
    setShouldShowAll((prev) => !prev);
  }, [setShouldShowAll]);

  // This is a simple click topic card function that with update search input text and clear all the filters
  // Can be change to a function-switcher if any other functions are designed in the future
  const handleClickTopicCard = useCallback(
    (value: string) => {
      if (value === TOPICS_CARDS[0].title) {
        handleClickShowMore();
      } else {
        dispatch(updateParameterVocabs([]));
        dispatch(updateDateTimeFilterRange({}));
        dispatch(updateImosOnly(false));
        dispatch(updateUpdateFreq(undefined));
        dispatch(updateSearchText(value));
        redirectSearch("TopicsPanel");
      }
    },
    [dispatch, handleClickShowMore, redirectSearch]
  );

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
      {!isAboveDesktop && (
        <Box sx={{ pr: { sm: padding.small } }}>
          <IconButton onClick={() => handleScroll(-TOPICS_PANEL_WIDTH / 3)}>
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
          width: {
            xs: TOPICS_PANEL_CONTAINER_WIDTH_MOBILE,
            sm: TOPICS_PANEL_CONTAINER_WIDTH_TABLET,
            md: TOPICS_PANEL_CONTAINER_WIDTH_LAPTOP,
            lg: TOPICS_PANEL_CONTAINER_WIDTH_DESKTOP,
          },
          height: TOPICS_PANEL_HEIGHT,
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
          width={TOPICS_PANEL_WIDTH + 2}
        >
          {TOPICS_CARDS.map((item) => (
            <TopicCard
              key={item.title}
              cardData={item}
              handleClickTopicCard={handleClickTopicCard}
              hide={shouldShowAll ? false : item.hide}
            />
          ))}
        </Stack>
      </Box>
      {!isAboveDesktop && (
        <Box sx={{ pl: { sm: padding.small } }}>
          <IconButton onClick={() => handleScroll(TOPICS_PANEL_WIDTH / 3)}>
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
