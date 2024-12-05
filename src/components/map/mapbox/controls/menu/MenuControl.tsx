import React, { useContext, useEffect, useState } from "react";
import { createRoot, Root } from "react-dom/client";
import MapContext from "../../MapContext";
import { Map as MapBox, IControl, MapMouseEvent } from "mapbox-gl";
import EventEmitter from "events";
import { Menus } from "./Definition";

const eventEmitter: EventEmitter = new EventEmitter();

const leftPadding = "15px";
const rightPadding = "15px";

const EVENT_MENU_CLICKED = "event-menu-clicked";
const EVENT_MAP_CLICKED = "event-map-clicked";
const EVENT_MAP_MOVE_START = "event-map-movestart";

interface MenuControlProps {
  menu: Menus | null;
}

class MapMenuControl implements IControl {
  private container: HTMLDivElement | null = null;
  private root: Root | null = null;
  private component: Menus;
  private map: MapBox | null = null;

  // When the user clicks somewhere on the map, notify the MenuControl
  private mapClickHandler: (event: MapMouseEvent) => void;
  private mapMoveStartHandler: (event: MapMouseEvent) => void;

  constructor(component: Menus, map: MapBox) {
    this.component = component;
    this.map = map;

    // Handlers for map events
    this.mapClickHandler = (event: MapMouseEvent) =>
      this.onClickHandler(event, undefined, EVENT_MAP_CLICKED);
    this.mapMoveStartHandler = (event: MapMouseEvent) =>
      this.onClickHandler(event, undefined, EVENT_MAP_MOVE_START);
  }

  onAdd(map: MapBox) {
    this.container = document.createElement("div");
    this.container.className = "mapboxgl-ctrl mapboxgl-ctrl-group";
    this.container.addEventListener("click", (event: MouseEvent) =>
      this.onClickHandler(event, this.component)
    );

    // https://react.dev/blog/2022/03/08/react-18-upgrade-guide#updates-to-client-rendering-apis
    // according to document, you need "!" at the end of container
    this.root = createRoot(this.container!);
    this.root.render(this.component);

    map?.on("click", this.mapClickHandler);
    map?.on("movestart", this.mapMoveStartHandler);

    return this.container;
  }

  onRemove(map: MapBox) {
    if (this.container?.parentNode) {
      // https://github.com/facebook/react/issues/25675#issuecomment-1518272581
      // Keep the old pointer
      setTimeout(() => {
        map?.off("click", this.mapClickHandler);
        map?.off("movestart", this.mapMoveStartHandler);
        this.container?.parentNode?.removeChild(this.container);
        this.container = null;
        this.root?.unmount();
      });
    }
  }

  onClickHandler(
    event: MouseEvent | MapMouseEvent,
    component: Menus | undefined,
    type: string = EVENT_MENU_CLICKED
  ) {
    eventEmitter.emit(type, {
      event: event,
      component: component,
    });
  }
}

const MenuControl: React.FC<MenuControlProps> = ({
  menu,
}: MenuControlProps) => {
  const { map } = useContext(MapContext);
  const [init, setInit] = useState<boolean>(false);

  useEffect(() => {
    if (!map || !menu) return;

    // Make it atomic update
    if (!init) {
      const control = new MapMenuControl(menu, map);
      map.addControl(control, "top-right");
      setInit(true);
    }
  }, [map, menu, init]);

  return <React.Fragment />;
};

export default MenuControl;

export {
  eventEmitter,
  leftPadding,
  rightPadding,
  EVENT_MAP_CLICKED,
  EVENT_MAP_MOVE_START,
  EVENT_MENU_CLICKED,
};
