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

export enum ScrollDirection {
  LEFT = "LEFT",
  RIGHT = "RIGHT",
}

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

  const totalCols = useMemo(
    () => Math.ceil(topicCardsCount / TOPICS_PANEL_ROWS_DEFAULT),
    [topicCardsCount]
  );

  const getTopicsPanelHeight = useCallback(() => {
    const topicsPanelRows = calcRows(topicCardsCount);
    return (
      TOPICS_CARD_HEIGHT * topicsPanelRows +
      TOPICS_PANEL_GAP * (topicsPanelRows - 1)
    );
  }, [calcRows, topicCardsCount]);

  const getTopicsPanelWidth = useCallback(() => {
    return (
      TOPICS_CARD_ICON_BOX_SIZE * totalCols + TOPICS_PANEL_GAP * (totalCols - 1)
    );
  }, [totalCols]);

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
      return (
        TOPICS_CARD_ICON_BOX_SIZE * TOPICS_PANEL_COLS_DESKTOP +
        TOPICS_PANEL_GAP * (TOPICS_PANEL_COLS_DESKTOP - 1)
      );
    }

    return (
      TOPICS_CARD_ICON_BOX_SIZE * TOPICS_PANEL_COLS_MOBILE +
      TOPICS_PANEL_GAP * (TOPICS_PANEL_COLS_MOBILE - 1)
    );
  }, [isMobile, isTablet, isLaptop, isAboveDesktop]);

  const getScrollDistance = useCallback(
    (direction: ScrollDirection) => {
      const scrollDistance = (cols: number) =>
        TOPICS_CARD_ICON_BOX_SIZE * cols + TOPICS_PANEL_GAP * (cols - 1);

      if (isMobile) {
        return direction === ScrollDirection.LEFT
          ? -scrollDistance(TOPICS_PANEL_COLS_MOBILE)
          : scrollDistance(TOPICS_PANEL_COLS_MOBILE);
      }

      if (isTablet) {
        return direction === ScrollDirection.LEFT
          ? -scrollDistance(TOPICS_PANEL_COLS_TABLET)
          : scrollDistance(TOPICS_PANEL_COLS_TABLET);
      }

      if (isLaptop) {
        return direction === ScrollDirection.LEFT
          ? -scrollDistance(TOPICS_PANEL_COLS_LAPTOP)
          : scrollDistance(TOPICS_PANEL_COLS_LAPTOP);
      }
      if (isAboveDesktop) {
        return direction === ScrollDirection.LEFT
          ? -scrollDistance(TOPICS_PANEL_COLS_DESKTOP)
          : scrollDistance(TOPICS_PANEL_COLS_DESKTOP);
      }

      return direction === ScrollDirection.LEFT
        ? -getTopicsPanelWidth() / 3
        : getTopicsPanelWidth() / 3;
    },
    [getTopicsPanelWidth, isAboveDesktop, isLaptop, isMobile, isTablet]
  );

  return {
    showAllTopics,
    setShowAllTopics,
    getTopicsPanelHeight,
    getTopicsPanelWidth,
    topicsPanelContainerWidth,
    getScrollDistance,
  };
};

export default useTopicsPanelSize;
