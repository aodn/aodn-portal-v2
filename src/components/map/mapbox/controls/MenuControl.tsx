import React, {
  useContext,
  useEffect,
  useState,
  useCallback,
  useRef,
  cloneElement,
} from "react";
import { createRoot, Root } from "react-dom/client";
import MapContext from "../MapContext";
import { Map as MapBox, IControl, MapMouseEvent } from "mapbox-gl";
import {
  Box,
  Typography,
  Radio,
  RadioGroup,
  FormControlLabel,
  Checkbox,
  FormControl,
  FormGroup,
  IconButton,
  Popper,
  Divider,
} from "@mui/material";
import LayersIcon from "@mui/icons-material/Layers";
import PublicIcon from "@mui/icons-material/Public";
import grey from "../../../common/colors/grey";
import blue from "../../../common/colors/blue";
import { styles as mapStyles, defaultStyle } from "../Map";
import { borderRadius, fontSize } from "../../../../styles/constants";
import EventEmitter from "events";

const eventEmitter: EventEmitter = new EventEmitter();

const leftPadding = "15px";
const rightPadding = "15px";

const EVENT_MENU_CLICKED = "event-menu-clicked";
const EVENT_MAP_CLICKED = "event-map-clicked";
const EVENT_MAP_MOVE_START = "event-map-movestart";

interface ControlProps {
  map?: MapBox;
  onEvent?: (...args: any[]) => void;
}

type Menus = React.ReactElement<
  ControlProps,
  string | React.JSXElementConstructor<any>
>;

interface MenuClickedEvent {
  event: MouseEvent;
  component: Menus;
}

interface BaseMapSwitcherProps extends ControlProps {
  // Static layer to be added to the switch
  layers: Array<{
    id: string;
    name: string;
    label?: string;
    default?: boolean;
  }>;
}

interface LayerSwitcherProps extends ControlProps {
  layers: Array<{ id: string; name: string; default?: boolean }>;
}

interface MenuControlProps {
  menu: Menus;
}

const BaseMapSwitcher: React.FC<BaseMapSwitcherProps> = ({
  map,
  layers,
  onEvent,
}) => {
  const [currentStyle, setCurrentStyle] = useState<string>(
    mapStyles[defaultStyle].id
  );
  // Must init the map so that it will not throw error indicate uncontrol to control component
  const [overlaysChecked, setOverlaysChecked] = useState<Map<string, boolean>>(
    new Map(layers?.map((i) => [i.id, i.default ? true : false]))
  );
  const anchorRef = useRef(null);
  const [open, setOpen] = useState(false);

  const handleToggle = useCallback(() => {
    setOpen((prevOpen) => !prevOpen);
  }, [setOpen]);

  const updateCurrentStyle = useCallback(
    (id: string) => {
      const target = mapStyles.find((e) => e.id === id);
      if (target) {
        map?.setStyle(target.style);
        setCurrentStyle(id);
      }
    },
    [map]
  );

  const toggleOverlay = useCallback((layerId: string, visible: boolean) => {
    setOverlaysChecked((values) => {
      values.set(layerId, visible);
      return new Map(values);
    });
  }, []);

  useEffect(() => {
    // Handle event when other control clicked, this component should close
    // the menu
    const handleEvent = (evt: MenuClickedEvent) => {
      if (evt.component.type !== BaseMapSwitcher) {
        setOpen(false);
      }
    };

    const handleMapEvent = () => setOpen(false);

    eventEmitter.on(EVENT_MENU_CLICKED, handleEvent);
    eventEmitter.on(EVENT_MAP_CLICKED, handleMapEvent);
    eventEmitter.on(EVENT_MAP_MOVE_START, handleMapEvent);

    return () => {
      eventEmitter.off(EVENT_MENU_CLICKED, handleEvent);
      eventEmitter.off(EVENT_MAP_MOVE_START, handleEvent);
      eventEmitter.off(EVENT_MAP_CLICKED, handleMapEvent);
    };
  }, []);

  return (
    <>
      <IconButton
        aria-label="basemap-show-hide-menu"
        id="basemap-show-hide-menu-button"
        ref={anchorRef}
        onClick={handleToggle}
      >
        <PublicIcon />
      </IconButton>
      <Popper
        id="basemap-popper-id"
        open={open}
        anchorEl={anchorRef.current}
        role={undefined}
        placement="left-start"
        disablePortal
        modifiers={[
          {
            name: "offset",
            options: {
              offset: [0, 10], // This applies an offset of 10px downward
            },
          },
        ]}
      >
        {
          // Dynamic size so menu is big enough to have no text wrap, whiteSpace : nowrap
        }
        <Box
          sx={{
            color: grey["mapMenuText"],
            display: "inline-block",
            whiteSpace: "nowrap",
            borderRadius: borderRadius["menu"],
            backgroundColor: grey["resultCard"],
            zIndex: 1,
          }}
        >
          <Typography
            sx={{
              backgroundColor: "white",
              borderRadius: borderRadius["menuTop"],
              fontSize: fontSize["mapMenuItem"],
              paddingTop: "7px",
              paddingBottom: "7px",
              paddingLeft: leftPadding,
              fontWeight: "bold",
            }}
          >
            Map Base Layers
          </Typography>
          <Divider />
          <Box sx={{ paddingLeft: leftPadding, paddingRight: rightPadding }}>
            <FormControl component="fieldset">
              <RadioGroup
                value={currentStyle}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                  updateCurrentStyle(e.target.value)
                }
              >
                {mapStyles.map((style) => (
                  <FormControlLabel
                    key={style.name}
                    value={style.id}
                    control={
                      <Radio
                        sx={{
                          "& .MuiSvgIcon-root": {
                            fontSize: fontSize["mapMenuSubItem"],
                          },
                          "&.Mui-checked": {
                            color: blue["imosLightBlue"],
                          },
                        }}
                      />
                    }
                    label={
                      <Typography sx={{ fontSize: fontSize["mapMenuSubItem"] }}>
                        {style.name}
                      </Typography>
                    }
                  />
                ))}
              </RadioGroup>
            </FormControl>
            <Divider />
            <FormControl component="fieldset">
              <FormGroup>
                {layers?.map((ol) => (
                  <FormControlLabel
                    key={"fc-" + ol.id}
                    control={
                      <Checkbox
                        id={"cb-" + ol.id}
                        sx={{
                          "& .MuiSvgIcon-root": {
                            fontSize: fontSize["mapMenuSubItem"],
                          },
                          "&.Mui-checked": {
                            color: blue["imosLightBlue"],
                          },
                        }}
                        checked={overlaysChecked.get(ol.id)}
                        onChange={(e) => {
                          toggleOverlay(ol.id, e.target.checked);
                          if (onEvent) onEvent(e.target);
                        }}
                        value={ol.id}
                      />
                    }
                    label={
                      <Typography sx={{ fontSize: fontSize["mapMenuSubItem"] }}>
                        {ol.name}
                      </Typography>
                    }
                  />
                ))}
              </FormGroup>
            </FormControl>
          </Box>
        </Box>
      </Popper>
    </>
  );
};

const MapLayerSwitcher: React.FC<LayerSwitcherProps> = ({
  map,
  layers,
  onEvent,
}) => {
  const anchorRef = useRef(null);
  const [open, setOpen] = useState(false);
  const [currentLayer, setCurrentLayer] = useState<string | undefined>(
    layers.find((i) => i.default)?.id
  );

  const handleToggle = useCallback(() => {
    setOpen((prevOpen) => !prevOpen);
  }, [setOpen]);

  useEffect(() => {
    // Handle event when other control clicked, this component should close
    // the menu
    const handleEvent = (evt: MenuClickedEvent) => {
      if (evt.component.type !== MapLayerSwitcher) {
        setOpen(false);
      }
    };

    const handleMapEvent = () => setOpen(false);

    eventEmitter.on(EVENT_MENU_CLICKED, handleEvent);
    eventEmitter.on(EVENT_MAP_CLICKED, handleMapEvent);
    eventEmitter.on(EVENT_MAP_MOVE_START, handleMapEvent);

    return () => {
      eventEmitter.off(EVENT_MENU_CLICKED, handleEvent);
      eventEmitter.off(EVENT_MAP_MOVE_START, handleEvent);
      eventEmitter.off(EVENT_MAP_CLICKED, handleMapEvent);
    };
  }, []);

  return (
    <>
      <IconButton
        aria-label="layer-show-hide-menu"
        id="layer-show-hide-menu-button"
        ref={anchorRef}
        onClick={handleToggle}
      >
        <LayersIcon />
      </IconButton>
      <Popper
        id="layer-popper-id"
        open={open}
        anchorEl={anchorRef.current}
        role={undefined}
        placement="left-start"
        disablePortal
        modifiers={[
          {
            name: "offset",
            options: {
              offset: [0, 10], // This applies an offset of 10px downward
            },
          },
        ]}
      >
        {
          // Dynamic size so menu is big enough to have no text wrap, whiteSpace : nowrap
        }
        <Box
          sx={{
            color: grey["mapMenuText"],
            display: "inline-block",
            whiteSpace: "nowrap",
            borderRadius: borderRadius["menu"],
            backgroundColor: grey["resultCard"],
            zIndex: 1,
          }}
        >
          <Typography
            sx={{
              backgroundColor: "white",
              borderRadius: borderRadius["menuTop"],
              fontSize: fontSize["mapMenuItem"],
              paddingTop: "7px",
              paddingBottom: "7px",
              paddingLeft: leftPadding,
              fontWeight: "bold",
            }}
          >
            Layers
          </Typography>
          <Divider />
          <Box sx={{ paddingLeft: leftPadding, paddingRight: rightPadding }}>
            <FormControl component="fieldset">
              <RadioGroup
                value={currentLayer}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                  setCurrentLayer(e.target.value);
                  if (onEvent) onEvent(e.target.value);
                }}
              >
                {layers.map((l) => (
                  <FormControlLabel
                    key={l.name}
                    value={l.id}
                    control={
                      <Radio
                        checked={currentLayer === l.id}
                        sx={{
                          "& .MuiSvgIcon-root": {
                            fontSize: fontSize["mapMenuSubItem"],
                          },
                          "&.Mui-checked": {
                            color: blue["imosLightBlue"],
                          },
                        }}
                      />
                    }
                    label={
                      <Typography sx={{ fontSize: fontSize["mapMenuSubItem"] }}>
                        {l.name}
                      </Typography>
                    }
                  />
                ))}
              </RadioGroup>
            </FormControl>
          </Box>
        </Box>
      </Popper>
    </>
  );
};

class MapMenuControl implements IControl {
  private container: HTMLDivElement | null = null;
  private root: Root | null = null;
  private component: Menus;

  // When user click somewhere on map, you want to notify the MenuControl to
  // do suitable action.
  private mapClickHandler: (event: MapMouseEvent) => void;
  private mapMoveStartHandler: (event: MapMouseEvent) => void;

  constructor(component: Menus) {
    this.component = component;
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
  const [_, setInit] = useState<boolean>(false);

  useEffect(() => {
    if (map === null) return;

    // Make it atomic update
    setInit((prev) => {
      if (!prev) {
        // If prev state is false
        const n = new MapMenuControl(cloneElement(menu, { map: map }));
        map?.addControl(n, "top-right");
      }
      // Only update once.
      return true;
    });
  }, [map, menu]);

  return <React.Fragment />;
};

export default MenuControl;

export { BaseMapSwitcher, MapLayerSwitcher };
