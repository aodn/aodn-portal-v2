import React, { cloneElement, useContext, useEffect, useState } from "react";
import { createRoot, Root } from "react-dom/client";
import MapContext from "../../MapContext";
import { Map as MapBox, IControl, MapMouseEvent } from "mapbox-gl";
import EventEmitter from "events";
import {
  ControlProps,
  EVENT_MAP,
  EVENT_MENU,
  MapControlType,
} from "./Definition";

const eventEmitter: EventEmitter = new EventEmitter();

const leftPadding = "15px";
const rightPadding = "15px";

interface MenuControlProps {
  menu: MapControlType | null;
}

class MapControl implements IControl {
  private container: HTMLDivElement | null = null;
  private root: Root | null = null;
  private readonly component: MapControlType;

  // When the user clicks somewhere on the map, notify the MenuControl
  private readonly mapClickHandler: (event: MapMouseEvent) => void;
  private readonly mapMoveStartHandler: (event: MapMouseEvent) => void;

  constructor(component: MapControlType) {
    this.component = component;

    // Handlers for map events
    this.mapClickHandler = (event: MapMouseEvent) =>
      this.onClickHandler(event, undefined, EVENT_MAP.CLICKED);
    this.mapMoveStartHandler = (event: MapMouseEvent) =>
      this.onClickHandler(event, undefined, EVENT_MAP.MOVE_START);
  }

  private render() {
    if (this.root && this.container) {
      this.root.render(this.component);
    }
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
    this.render();

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
    component: MapControlType | undefined,
    type: string = EVENT_MENU.CLICKED
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
  const [_, setControl] = useState<MapControl | null>(null);

  // Creation effect
  useEffect(() => {
    if (!map || !menu) return;

    setControl((prev) => {
      if (!prev) {
        // !!Must use cloneElement, to inject the map to the argument, so you
        // can get it in the ControlProps
        const newControl = new MapControl(
          cloneElement<ControlProps>(menu, { map: map })
        );
        map?.addControl(newControl, "top-right");
        return newControl;
      }
      return prev;
    });
  }, [map, menu]);

  return <React.Fragment />;
};

export default MenuControl;

export { eventEmitter, leftPadding, rightPadding, MapControl };
