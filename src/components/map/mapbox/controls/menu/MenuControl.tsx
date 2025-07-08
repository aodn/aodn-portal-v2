import React, {
  cloneElement,
  RefObject,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";
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
import { Box, SxProps, Theme } from "@mui/material";

const eventEmitter: EventEmitter = new EventEmitter();

const leftPadding = "20px";
const rightPadding = "15px";
const topPadding = "10px";
const bottomPadding = "14px";

interface MenuControlProps {
  menu: MapControlType | null;
  position?: "bottom-right" | "top-right";
  sx?: SxProps<Theme>;
  visible?: boolean;
  className?: string;
}

class MapControl implements IControl {
  private container: HTMLDivElement;
  private root: Root | null = null;
  private readonly component: MapControlType;
  private height: string = "";
  private marginTop: string = "";
  private additionalProps: Partial<ControlProps> = {}; // Store dynamic props separately

  // When the user clicks somewhere on the map, notify the MenuControl
  private readonly mapClickHandler: (event: MapMouseEvent) => void;
  private readonly mapMoveStartHandler: (event: MapMouseEvent) => void;

  constructor(component: MapControlType, container: HTMLDivElement) {
    this.component = component;
    this.container = container; // Use provided container

    // Handlers for map events
    this.mapClickHandler = (event: MapMouseEvent) =>
      this.onClickHandler(event, undefined, EVENT_MAP.CLICKED);
    this.mapMoveStartHandler = (event: MapMouseEvent) =>
      this.onClickHandler(event, undefined, EVENT_MAP.MOVE_START);
  }

  private render() {
    if (this.root && this.container) {
      const updatedComponent = cloneElement(this.component, {
        ...this.component.props,
        ...this.additionalProps,
      });
      this.root.render(updatedComponent);
    }
  }

  setVisible(visible: boolean): void {
    if (this.container) {
      this.container.style.visibility = visible ? "visible" : "hidden";
      // Magic numbers below are Mapbox default styles for controls
      this.container.style.height = visible ? this.height : "0px";
      this.container.style.marginTop = visible ? this.marginTop : "0px";
    }
  }

  // Method to update additional props
  updateProps(newProps: Partial<ControlProps>) {
    this.additionalProps = { ...this.additionalProps, ...newProps };
    this.render();
  }

  onAdd(map: MapBox) {
    this.container.addEventListener("click", (event: MouseEvent) =>
      this.onClickHandler(event, this.component)
    );

    // https://react.dev/blog/2022/03/08/react-18-upgrade-guide#updates-to-client-rendering-apis
    // according to document, you need "!" at the end of container
    this.root = createRoot(this.container!);
    this.render();
    // Remember the initial height and marginTop
    this.height = this.container!.style.height;
    this.marginTop = this.container!.style.marginTop;

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
// !! Change this control with care, it impacted many location, please regression
// test all control on map in different page !!
const MenuControl: React.FC<MenuControlProps> = ({
  menu,
  position = "top-right",
  sx,
  visible = true,
  className,
}: MenuControlProps) => {
  const { map } = useContext(MapContext);
  const containerRef: RefObject<HTMLDivElement> = useRef<HTMLDivElement>(null);
  const [control, setControl] = useState<MapControl | null>(null);

  // Creation effect
  useEffect(() => {
    if (!map || !menu) return;

    setControl((prev) => {
      if (!prev && containerRef && containerRef.current) {
        // !!Must use cloneElement, to inject the map to the argument, so you
        // can get it in the ControlProps
        const newControl = new MapControl(
          cloneElement<ControlProps>(menu, { map: map }),
          containerRef.current
        );
        map?.addControl(newControl, position);
        return newControl;
      }
      return prev;
    });
  }, [map, menu, control, containerRef, position]);

  useEffect(() => {
    // Once the control set, you cannot change it, in case the props of menu update
    // you can call the update function which clone the existing one and then
    // apply the updated props to it.
    if (menu?.props && control) {
      control.updateProps(menu?.props);
    }
  }, [control, menu?.props]);

  useEffect(() => {
    control?.setVisible(visible);
  }, [control, visible]);

  return (
    <Box
      ref={containerRef}
      className={`mapboxgl-ctrl mapboxgl-ctrl-group ${className || ""}`}
      sx={sx}
    />
  );
};

export {
  eventEmitter,
  leftPadding,
  rightPadding,
  topPadding,
  bottomPadding,
  MapControl,
};
export default MenuControl;
