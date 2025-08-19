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
import { Map as MapBox, IControl, MapMouseEvent, MapEvent } from "mapbox-gl";
import EventEmitter from "events";
import {
  ControlProps,
  EVENT_MAP,
  EVENT_MENU,
  MapControlType,
  MenuControlType,
} from "./Definition";
import { Box } from "@mui/material";
import {
  borderRadius,
  color,
  fontColor,
  fontFamily,
  fontSize,
  fontWeight,
} from "../../../../../styles/constants";
import grey from "../../../../common/colors/grey";
import rc8Theme from "../../../../../styles/themeRC8";

const eventEmitter: EventEmitter = new EventEmitter();

export const switcherIconButtonSx = (open: boolean) => ({
  "&.MuiIconButton-root.MuiIconButton-root": {
    backgroundColor: `${open ? fontColor.blue.dark : "transparent"}`,
    color: open ? "white" : color.gray.dark,
    minWidth: "40px",
    height: "40px",
    borderRadius: "6px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    "&:hover": {
      backgroundColor: open ? fontColor.blue.dark : "rgba(0, 0, 0, 0.12)",
    },
    "&.Mui-focusVisible": {
      backgroundColor: open ? fontColor.blue.dark : "rgba(0, 0, 0, 0.12)",
    },
  },
});

export const switcherTitleTypographySx = {
  ...rc8Theme.typography.title1Medium,
  color: rc8Theme.palette.text1,
  fontWeight: 500,
  backgroundColor: color.blue.medium,
  borderRadius: borderRadius["menuTop"],
  minHeight: "40px",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
};

export const switcherMenuBoxSx = {
  color: grey["mapMenuText"],
  display: "inline-block",
  whiteSpace: "nowrap",
  borderRadius: borderRadius["menu"],
  backgroundColor: grey["resultCard"],
  zIndex: 1,
  width: "260px",
};

export const switcherMenuContentBoxSx = {
  paddingTop: "10px",
  paddingBottom: "14px",
  paddingLeft: "20px",
  paddingRight: "15px",
};

export const formControlLabelSx = {
  gap: 0.4,
};

export const switcherMenuContentIconSx = {
  padding: "6px",
  "& .MuiSvgIcon-root": {
    fontSize: "20px",
  },
  "&.Mui-checked": {
    color: fontColor.blue.dark,
  },
  "&:not(.Mui-checked)": {
    color: fontColor.gray.medium,
  },
};

export const switcherMenuContentLabelTypographySx = {
  fontSize: fontSize.info,
  color: "#090C02",
  fontFamily: fontFamily.openSans,
  fontWeight: fontWeight.regular,
  letterSpacing: "0.5px",
  lineHeight: "22px",
};

interface MenuControlProps extends MenuControlType {
  menu: MapControlType | null;
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
  private readonly mapMoveStartHandler: (event: MapEvent) => void;
  private readonly mouseClickHandler: (event: MouseEvent) => void;

  constructor(component: MapControlType, container: HTMLDivElement) {
    this.component = component;
    this.container = container; // Use provided container

    // Handlers for map events
    this.mapClickHandler = (event: MapMouseEvent) =>
      this.onClickHandler(event, undefined, EVENT_MAP.CLICKED);
    this.mapMoveStartHandler = (event: MapEvent) =>
      this.onClickHandler(event, undefined, EVENT_MAP.MOVE_START);
    this.mouseClickHandler = (event: MouseEvent) =>
      this.onClickHandler(event, this.component);
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
    this.container.addEventListener("click", this.mouseClickHandler);

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
        this.container?.removeEventListener("click", this.mouseClickHandler);
        this.container?.parentNode?.removeChild(this.container);
        this.root?.unmount();
      });
    }
  }

  onClickHandler(
    event: MouseEvent | MapEvent,
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
  sx = { borderRadius: "8px" },
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

export { eventEmitter, MapControl };
export default MenuControl;
