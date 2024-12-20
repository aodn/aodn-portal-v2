import React from "react";
import { Map as MapBox } from "mapbox-gl";

enum EVENT_MENU {
  CLICKED = "event-menu-clicked",
}

enum EVENT_MAP {
  CLICKED = "event-map-clicked",
  MOVE_START = "event-map-movestart",
}

enum EVENT_BOOKMARK {
  ADD = "event-bookmark-added",
  REMOVE = "event-bookmark-removed",
  // Temp item, do not need to store in local store, and only 1 temp item
  TEMP = "event-bookmark-temp",
  // Temp item, do not need to store in local store, a status to indicate status
  EXPAND = "event-bookmark-expand",
  REMOVE_ALL = "event-bookmark-remove-all",
}
// For those who use MenuControl, please extend you props with this interface
// and the MenuControl will inject the map instance automatically for you
// you can define your onEvent if you want
export interface ControlProps {
  map?: MapBox;
  onEvent?: (...args: any[]) => void;
}

export type MapControlType = React.ReactElement<
  ControlProps,
  string | React.JSXElementConstructor<any>
>;

export interface MenuClickedEvent {
  event: MouseEvent;
  component: MapControlType;
}

export interface BookmarkEvent {
  event: MouseEvent;
  id: string;
  action: string;
  value: any;
}

export { EVENT_MAP, EVENT_MENU, EVENT_BOOKMARK };
