import React, {
  useContext,
  useEffect,
  useState,
  useCallback,
  useRef,
  cloneElement,
  ReactNode,
  PropsWithChildren,
} from "react";
import { createRoot, Root } from "react-dom/client";
import MapContext from "../MapContext";
import { Map as MapBox, IControl, Style } from "mapbox-gl";
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
import grey from "../../../common/colors/grey";
import blue from "../../../common/colors/blue";
import { fontSize, borderRadius } from "../../../common/constants";
import ERSIWorldImagery from "./styles/ESRIWorldImagery.json";

// Styles can be found here https://developers.arcgis.com/rest/basemap-styles/
// but require feeds.
const styles = [
  {
    id: "1",
    name: "Street map (MapBox)",
    style: "mapbox://styles/mapbox/streets-v11",
  },
  {
    id: "2",
    name: "Topographic map (MapBox)",
    style: "mapbox://styles/mapbox/outdoors-v11",
  },
  {
    id: "3",
    name: "Satellite map (MapBox)",
    style: "mapbox://styles/mapbox/satellite-v9",
  },
  {
    id: "4",
    name: "ESRI World Imagery (ArcGIS)",
    style: ERSIWorldImagery as Style,
  },
  // Add more styles as needed
];

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

const BaseMapSwitcher: React.FC<{ map?: MapBox }> = ({ map }) => {
  const [currentStyle, setCurrentStyle] = useState<string>(styles[0].id);
  const [overlaysChecked, setOverlaysChecked] = useState(new Map());
  const anchorRef = useRef(null);
  const [open, setOpen] = useState(false);

  const handleToggle = () => {
    setOpen((prevOpen) => !prevOpen);
  };

  const updateCurrentStyle = useCallback(
    (id) => {
      const target = styles.find((e) => e.id === id);
      map.setStyle(target.style);
      setCurrentStyle(id);
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

  return (
    <>
      <IconButton
        aria-label="show-hide-menu"
        ref={anchorRef}
        onClick={handleToggle}
      >
        <LayersIcon />
      </IconButton>
      <Popper
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
                onChange={(e) => updateCurrentStyle(e.target.value)}
              >
                {styles.map((style) => (
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

type Menus = React.ReactElement<
  { map: MapBox },
  string | React.JSXElementConstructor<any>
>;

class MapMenuControl implements IControl {
  private container: HTMLDivElement;
  private root: Root;
  private component: Menus;
  private map: MapBox;

  constructor(component: Menus) {
    this.component = component;
  }

  onAdd(map: MapBox) {
    this.container = document.createElement("div");
    this.container.className = "mapboxgl-ctrl mapboxgl-ctrl-group";

    // https://react.dev/blog/2022/03/08/react-18-upgrade-guide#updates-to-client-rendering-apis
    // according to document, you need "!" at the end of container
    this.root = createRoot(this.container!);
    this.root.render(this.component);

    return this.container;
  }

  onRemove() {
    console.log("onRemove");
    if (this.container.parentNode) {
      // https://github.com/facebook/react/issues/25675#issuecomment-1518272581
      // Keep the old pointer
      setTimeout(() => {
        this.container.parentNode.removeChild(this.container);
        this.container = null;
        this.root.unmount();
      });
    }
  }
}

interface MenuControlProps {
  menu: Menus;
}

const MenuControl = (props: PropsWithChildren<MenuControlProps>) => {
  const { map } = useContext(MapContext);
  const [init, setInit] = useState<boolean>(false);

  useEffect(() => {
    if (map === null) return;

    // Make it atomic update
    setInit((prev) => {
      if (!prev) {
        // If prev state is false
        const n = new MapMenuControl(cloneElement(props.menu, { map: map }));
        map.addControl(n, "top-right");
      }
      // Only update once.
      return true;
    });
  }, [map, props.menu]);

  return <React.Fragment />;
};

MenuControl.defaultProps = {};

export default MenuControl;

export { BaseMapSwitcher };
