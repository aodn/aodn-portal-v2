import iconAllTopics from "@/assets/topics-panel-icons/icon_all_topics.png";
import iconLessTopics from "@/assets/topics-panel-icons/icon_less_topics.png";

import { TopicCardType } from "./TopicCard";

export const SCROLL_BUTTON_SIZE = 18;

export const TOPICS_PANEL_GAP = 12;

export const TOPICS_PANEL_ROWS_DEFAULT = 2;

export const TOPICS_PANEL_COLS_DESKTOP = 9; // Change this number carefully, it will affect the fixed width of smart panel
export const TOPICS_PANEL_COLS_LAPTOP = 8;
export const TOPICS_PANEL_COLS_TABLET = 6;
export const TOPICS_PANEL_COLS_MOBILE = 3;

export const TOPICS_CARD_ICON_BOX_SIZE = 88;
export const TOPICS_CARD_HEIGHT = 120;

export const ALL_TOPICS_CARD: TopicCardType = {
  title: "Show All",
  icon: iconAllTopics,
};

export const LESS_TOPICS_CARD: TopicCardType = {
  title: "Show Less",
  icon: iconLessTopics,
};
