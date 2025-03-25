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
} from "../pages/landing-page/subpages/topics-panel/constants";

interface UseTopicsPanelSizeProps {
  topicCardsCount: number;
}

const useTopicsPanelSize = ({ topicCardsCount }: UseTopicsPanelSizeProps) => {
  const [showAllTopics, setShowAllTopics] = useState<boolean>(false);
  const { isMobile, isTablet, isLaptop, isAboveDesktop } = useBreakpoint();

  const calcRows = useCallback(
    (topicCardsCount: number) => {
      if (isMobile)
        return showAllTopics
          ? Math.ceil(topicCardsCount / TOPICS_PANEL_COLS_MOBILE)
          : TOPICS_PANEL_ROWS_DEFAULT;
      if (isTablet)
        return showAllTopics
          ? Math.ceil(topicCardsCount / TOPICS_PANEL_COLS_TABLET)
          : TOPICS_PANEL_ROWS_DEFAULT;
      if (isLaptop)
        return showAllTopics
          ? Math.ceil(topicCardsCount / TOPICS_PANEL_COLS_LAPTOP)
          : TOPICS_PANEL_ROWS_DEFAULT;
      if (isAboveDesktop)
        return showAllTopics
          ? Math.ceil(topicCardsCount / TOPICS_PANEL_COLS_DESKTOP)
          : TOPICS_PANEL_ROWS_DEFAULT;

      return TOPICS_PANEL_ROWS_DEFAULT;
    },
    [isAboveDesktop, isLaptop, isMobile, isTablet, showAllTopics]
  );

  const getTopicsPanelHeight = useCallback(() => {
    const topicsPanelRows = calcRows(topicCardsCount);
    return (
      TOPICS_CARD_HEIGHT * topicsPanelRows +
      TOPICS_PANEL_GAP * (topicsPanelRows - 1)
    );
  }, [calcRows, topicCardsCount]);

  const topicsPanelWidth = useMemo(() => {
    return (
      TOPICS_CARD_ICON_BOX_SIZE * TOPICS_PANEL_COLS_DESKTOP +
      TOPICS_PANEL_GAP * (TOPICS_PANEL_COLS_DESKTOP - 1)
    );
  }, []);

  const topicsPanelContainerWidth = useMemo(() => {
    if (isMobile)
      return (
        TOPICS_CARD_ICON_BOX_SIZE * TOPICS_PANEL_COLS_MOBILE +
        TOPICS_PANEL_GAP * (TOPICS_PANEL_COLS_MOBILE - 1)
      );
    if (isTablet)
      return (
        TOPICS_CARD_ICON_BOX_SIZE * TOPICS_PANEL_COLS_TABLET +
        TOPICS_PANEL_GAP * (TOPICS_PANEL_COLS_TABLET - 1)
      );
    if (isLaptop)
      return (
        TOPICS_CARD_ICON_BOX_SIZE * TOPICS_PANEL_COLS_LAPTOP +
        TOPICS_PANEL_GAP * (TOPICS_PANEL_COLS_LAPTOP - 1)
      );
    if (isAboveDesktop) {
      return topicsPanelWidth;
    }

    return (
      TOPICS_CARD_ICON_BOX_SIZE * TOPICS_PANEL_COLS_MOBILE +
      TOPICS_PANEL_GAP * (TOPICS_PANEL_COLS_MOBILE - 1)
    );
  }, [isAboveDesktop, isLaptop, isMobile, isTablet, topicsPanelWidth]);

  return {
    showAllTopics,
    setShowAllTopics,
    getTopicsPanelHeight,
    topicsPanelWidth,
    topicsPanelContainerWidth,
  };
};

export default useTopicsPanelSize;
