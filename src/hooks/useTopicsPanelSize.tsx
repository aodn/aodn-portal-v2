import { useCallback, useMemo, useState } from "react";
import useBreakpoint from "./useBreakpoint";
import {
  TOPICS_CARD_HEIGHT,
  TOPICS_CARD_ICON_BOX_SIZE,
  TOPICS_PANEL_COLS_DESKTOP,
  TOPICS_PANEL_COLS_LAPTOP,
  TOPICS_PANEL_COLS_MOBILE,
  TOPICS_PANEL_COLS_TABLET,
  TOPICS_PANEL_GAP,
  TOPICS_PANEL_ROWS_DEFAULT,
} from "../pages/landing-page/sections/topics-panel/constants";
interface UseTopicsPanelSizeProps {
  topicCardsCount: number;
}

const useTopicsPanelSize = ({ topicCardsCount }: UseTopicsPanelSizeProps) => {
  const [showAllTopics, setShowAllTopics] = useState<boolean>(false);
  const { isMobile, isTablet, isLaptop, isAboveDesktop } = useBreakpoint();

  const calcRows = useCallback(
    (topicCardsCount: number) => {
      const getRows = (cols: number) =>
        showAllTopics
          ? Math.ceil(topicCardsCount / cols)
          : TOPICS_PANEL_ROWS_DEFAULT;
      if (isMobile) return getRows(TOPICS_PANEL_COLS_MOBILE);
      if (isTablet) return getRows(TOPICS_PANEL_COLS_TABLET);
      if (isLaptop) return getRows(TOPICS_PANEL_COLS_LAPTOP);
      if (isAboveDesktop) return getRows(TOPICS_PANEL_COLS_DESKTOP);

      return TOPICS_PANEL_ROWS_DEFAULT;
    },
    [isAboveDesktop, isLaptop, isMobile, isTablet, showAllTopics]
  );

  const totalCols = useMemo(
    () => Math.ceil(topicCardsCount / TOPICS_PANEL_ROWS_DEFAULT),
    [topicCardsCount]
  );

  const topicsPanelHeight = useMemo(() => {
    const topicsPanelRows = calcRows(topicCardsCount);
    return (
      TOPICS_CARD_HEIGHT * topicsPanelRows +
      TOPICS_PANEL_GAP * (topicsPanelRows - 1)
    );
  }, [calcRows, topicCardsCount]);

  const topicsPanelWidth = useMemo(() => {
    return (
      TOPICS_CARD_ICON_BOX_SIZE * totalCols + TOPICS_PANEL_GAP * (totalCols - 1)
    );
  }, [totalCols]);

  const topicsPanelContainerWidth = useMemo(() => {
    const getWidth = (cols: number) =>
      TOPICS_CARD_ICON_BOX_SIZE * cols + TOPICS_PANEL_GAP * (cols - 1);
    if (isMobile) return getWidth(TOPICS_PANEL_COLS_MOBILE);
    if (isTablet) return getWidth(TOPICS_PANEL_COLS_TABLET);
    if (isLaptop) return getWidth(TOPICS_PANEL_COLS_LAPTOP);
    if (isAboveDesktop) return getWidth(TOPICS_PANEL_COLS_DESKTOP);

    return getWidth(TOPICS_PANEL_COLS_MOBILE);
  }, [isMobile, isTablet, isLaptop, isAboveDesktop]);

  return {
    showAllTopics,
    setShowAllTopics,
    topicsPanelHeight,
    topicsPanelWidth,
    topicsPanelContainerWidth,
  };
};

export default useTopicsPanelSize;
