import React, { useCallback, useEffect, useRef, useState } from "react";
import {
  ControlProps,
  EVENT_MAP,
  EVENT_MENU,
  MenuClickedEvent,
} from "./Definition";
import {
  eventEmitter,
  formControlLabelSx,
  switcherIconButtonSx,
  switcherMenuBoxSx,
  switcherMenuContentBoxSx,
  switcherMenuContentIconSx,
  switcherMenuContentLabelTypographySx,
} from "./MenuControl";
import {
  Box,
  Typography,
  Radio,
  RadioGroup,
  FormControlLabel,
  FormControl,
  IconButton,
  Popper,
  Divider,
} from "@mui/material";
import { SearchStyleIcon } from "../../../../../assets/icons/map/search_style";
import MenuTitle from "./MenuTitle";

export enum LayerName {
  Hexbin = "hexbin",
  GeoServer = "geoServer",
  SpatialExtent = "spatialExtent",
}

export interface LayerSwitcherLayer<T = string> {
  id: T;
  name: string;
  default?: boolean;
}

interface LayerSwitcherProps extends ControlProps {
  layers: Array<LayerSwitcherLayer>;
}

export const MapLayers: Record<LayerName, LayerSwitcherLayer<LayerName>> = {
  [LayerName.Hexbin]: {
    id: LayerName.Hexbin,
    name: "Hex Grid",
    default: true,
  },
  [LayerName.GeoServer]: {
    id: LayerName.GeoServer,
    name: "Geoserver",
    default: true,
  },
  [LayerName.SpatialExtent]: {
    id: LayerName.SpatialExtent,
    name: "Spatial Extent",
    default: false,
  },
};

const MapLayerSwitcher: React.FC<LayerSwitcherProps> = ({
  layers,
  onEvent,
}) => {
  const anchorRef = useRef(null);
  const [open, setOpen] = useState(false);
  const [currentLayer, setCurrentLayer] = useState<string | undefined>(
    layers.find((layer) => layer.default)?.id
  );

  const handleToggle = useCallback(() => {
    setOpen((prevOpen) => !prevOpen);
  }, [setOpen]);

  useEffect(() => {
    setCurrentLayer(
      layers.filter((layer) => layer.default)[0]?.id || layers[0]?.id
    );
  }, [layers]);

  useEffect(() => {
    // Handle event when other control clicked, this component should close
    // the menu
    const handleEvent = (evt: MenuClickedEvent) => {
      if (evt.component.type !== MapLayerSwitcher) {
        setOpen(false);
      }
    };

    const handleMapEvent = () => setOpen(false);

    eventEmitter.on(EVENT_MENU.CLICKED, handleEvent);
    eventEmitter.on(EVENT_MAP.CLICKED, handleMapEvent);
    eventEmitter.on(EVENT_MAP.MOVE_START, handleMapEvent);

    return () => {
      eventEmitter.off(EVENT_MENU.CLICKED, handleEvent);
      eventEmitter.off(EVENT_MAP.MOVE_START, handleEvent);
      eventEmitter.off(EVENT_MAP.CLICKED, handleMapEvent);
    };
  }, []);

  return (
    <>
      <IconButton
        aria-label="layer-show-hide-menu"
        id="layer-show-hide-menu-button"
        ref={anchorRef}
        onClick={handleToggle}
        sx={switcherIconButtonSx(open)}
      >
        <SearchStyleIcon />
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
        <Box sx={switcherMenuBoxSx}>
          <MenuTitle title="Layer Style" onClose={handleToggle} />
          <Divider />
          <Box sx={switcherMenuContentBoxSx}>
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
                    sx={formControlLabelSx}
                    control={
                      <Radio
                        checked={currentLayer === l.id}
                        sx={switcherMenuContentIconSx}
                      />
                    }
                    label={
                      <Typography sx={switcherMenuContentLabelTypographySx}>
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

export default MapLayerSwitcher;
