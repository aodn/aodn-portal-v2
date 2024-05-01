import React, {
  useContext,
  useEffect,
  useState,
  useCallback,
  cloneElement,
} from "react";
import { createRoot } from "react-dom/client";
import MapContext from "../MapContext";
import { Map, IControl } from "mapbox-gl";
import {
  Container,
  Typography,
  Radio,
  RadioGroup,
  FormControlLabel,
  Checkbox,
  FormControl,
  FormGroup,
} from "@mui/material";

const styles = [
  { name: "Streets", styleUrl: "mapbox://styles/mapbox/streets-v11" },
  { name: "Topo", styleUrl: "mapbox://styles/mapbox/outdoors-v11" },
  { name: "Satellite", styleUrl: "mapbox://styles/mapbox/satellite-v9" },
  // Add more styles as needed
];

const overlays = [
  { name: "Australian Marine Parks", id: "marine-parks-layer", visible: true },
  {
    name: "World Boundaries and Places",
    id: "world-boundaries-layer",
    visible: false,
  },
  // Add more overlays as needed
];

const BaseMapSwitcher: React.FC<{ map: Map | null }> = ({ map }) => {
  const [currentStyle, setCurrentStyle] = useState<string>(styles[0].styleUrl);

  const updateCurrentStyle = useCallback(
    (styleUrl) => {
      map.setStyle(styleUrl);
      setCurrentStyle(styleUrl);
    },
    [map]
  );

  const toggleOverlay = useCallback(
    (layerId: string, visible: boolean) => {
      if (map) {
        if (visible) {
          map.setLayoutProperty(layerId, "visibility", "visible");
        } else {
          map.setLayoutProperty(layerId, "visibility", "none");
        }
      }
    },
    [map]
  );

  return (
    <Container
      style={{ padding: "10px", backgroundColor: "#f0f0f0", zIndex: 1 }}
    >
      <Typography variant="h6">Map Base Layers</Typography>
      <FormControl component="fieldset">
        <RadioGroup
          value={currentStyle}
          onChange={(e) => updateCurrentStyle(e.target.value)}
        >
          {styles.map((style) => (
            <FormControlLabel
              key={style.name}
              value={style.styleUrl}
              control={<Radio />}
              label={style.name}
            />
          ))}
        </RadioGroup>
      </FormControl>

      <Typography variant="h6">Overlays</Typography>
      <FormControl component="fieldset">
        <FormGroup>
          {overlays.map((overlay) => (
            <FormControlLabel
              key={overlay.name}
              control={
                <Checkbox
                  checked={overlay.visible}
                  onChange={(e) => {
                    overlay.visible = e.target.checked;
                    toggleOverlay(overlay.id, overlay.visible);
                  }}
                />
              }
              label={overlay.name}
            />
          ))}
        </FormGroup>
      </FormControl>
    </Container>
  );
};

type Menus = BaseMapSwitcher;

class MapMenuControl implements IControl {
  private container: HTMLDivElement;
  private root: ReactNode;
  private component: Menus;

  constructor(component: Menus) {
    this.component = component;
  }

  onAdd(map: Map) {
    this.container = document.createElement("div");
    this.container.className = "mapboxgl-ctrl mapboxgl-ctrl-group";

    // https://react.dev/blog/2022/03/08/react-18-upgrade-guide#updates-to-client-rendering-apis
    // according to document, you need "!" at the end of container
    this.root = createRoot(this.container!);
    this.root.render(this.component, this.container);

    return this.container;
  }

  onRemove() {
    if (this.container.parentNode) {
      this.root.unmount();
      this.container.parentNode.removeChild(this.container);
    }
  }
}

interface MenuControlProps {
  menu: Menus;
}

const MenuControl = (props: PropsWithChildren<MenuControlProps>) => {
  const { map } = useContext(MapContext);

  useEffect(() => {
    if (map === null) return;

    const n = new MapMenuControl(cloneElement(props.menu, { map: map }));

    map.addControl(n, "top-right");
    return () => {
      map.removeControl(n);
    };
  }, [map, props.menu]);

  return <React.Fragment />;
};

MenuControl.defaultProps = {};

export default MenuControl;

export { BaseMapSwitcher };
