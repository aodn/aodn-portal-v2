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
import { Map as MapBox, IControl } from "mapbox-gl";
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

const overlays = [
  { name: "Australian Marine Parks", id: "marine-parks-layer", visible: false },
  {
    name: "World Boundaries and Places",
    id: "world-boundaries-layer",
    visible: false,
  },
  // Add more overlays as needed
];

const leftPadding = "15px";
const rightPadding = "15px";

const EVENT_MENU_CLICKED = "event-menu-clicked";

interface ControlProps {
  map?: MapBox;
}

type Menus = React.ReactElement<
  ControlProps,
  string | React.JSXElementConstructor<any>
>;

interface MenuClickedEvent {
  event: MouseEvent;
  component: Menus;
}

interface BaseMapSwitcherProps extends ControlProps {}

interface LayerSwitcherProps extends ControlProps {
  layers: Array<{ id: string; name: string }>;
}

interface MenuControlProps {
  menu: Menus;
}

const BaseMapSwitcher: React.FC<BaseMapSwitcherProps> = ({ map }) => {
  const [currentStyle, setCurrentStyle] = useState<string>(
    mapStyles[defaultStyle].id
  );
  const [overlaysChecked, setOverlaysChecked] = useState(new Map());
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

  const toggleOverlay = useCallback(
    (layerId: string, visible: boolean) => {
      if (map) {
        // if (visible) {
        //  map.setLayoutProperty(layerId, "visibility", "visible");
        //} else {
        //  map.setLayoutProperty(layerId, "visibility", "none");
        // }
        setOverlaysChecked((map) => {
          map.set(layerId, visible);
          return map;
        });
      }
    },
    [map]
  );

  useEffect(() => {
    const handleEvent = (evt: MenuClickedEvent) => {
      if (evt.component.type !== BaseMapSwitcher) {
        setOpen(false);
      }
    };

    eventEmitter.on(EVENT_MENU_CLICKED, handleEvent);

    return () => {
      eventEmitter.off(EVENT_MENU_CLICKED, handleEvent);
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
                {overlays.map((ol) => (
                  <FormControlLabel
                    key={ol.name}
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
                        }}
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

const MapLayerSwitcher: React.FC<LayerSwitcherProps> = ({ map, layers }) => {
  const anchorRef = useRef(null);
  const [open, setOpen] = useState(false);
  const [currentLayer, setCurrentLayer] = useState(null);

  const handleToggle = useCallback(() => {
    setOpen((prevOpen) => !prevOpen);
  }, [setOpen]);

  useEffect(() => {
    const handleEvent = (evt: MenuClickedEvent) => {
      if (evt.component.type !== MapLayerSwitcher) {
        setOpen(false);
      }
    };

    eventEmitter.on(EVENT_MENU_CLICKED, handleEvent);

    return () => {
      eventEmitter.off(EVENT_MENU_CLICKED, handleEvent);
    };
  }, []);

  const updateLayerStyle = useCallback((id: string) => {}, []);

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
                onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                  updateLayerStyle(e.target.value)
                }
              >
                {layers.map((l) => (
                  <FormControlLabel
                    key={l.name}
                    value={l.id}
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

  constructor(component: Menus) {
    this.component = component;
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

    return this.container;
  }

  onRemove() {
    console.log("onRemove");
    if (this.container?.parentNode) {
      // https://github.com/facebook/react/issues/25675#issuecomment-1518272581
      // Keep the old pointer
      setTimeout(() => {
        this.container?.parentNode?.removeChild(this.container);
        this.container = null;
        this.root?.unmount();
      });
    }
  }

  onClickHandler(event: MouseEvent, component: Menus) {
    eventEmitter.emit(EVENT_MENU_CLICKED, {
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
