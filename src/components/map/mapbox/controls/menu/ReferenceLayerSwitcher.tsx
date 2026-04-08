import React, { useEffect, useState, useCallback, MouseEvent } from "react";
import {
  ControlProps,
  EVENT_MAP,
  EVENT_MENU,
  MenuClickedEvent,
} from "./Definition";
import {
  Box,
  Typography,
  FormControlLabel,
  Checkbox,
  FormControl,
  FormGroup,
  IconButton,
  Popper,
  Divider,
} from "@mui/material";
import {
  eventEmitter,
  formControlLabelSx,
  switcherIconButtonSx,
  switcherMenuBoxSx,
  switcherMenuContentBoxSx,
  switcherMenuContentIconSx,
  switcherMenuContentLabelTypographySx,
} from "./MenuControl";
import MenuHintTooltip from "./MenuHintTooltip";
import { BaseMapSwitcherLayer } from "./BaseMapSwitcher";
import { ReferenceLayerIcon } from "../../../../../assets/icons/map/ref_layer";
import MenuTitle from "./MenuTitle";
import { StaticLayersDef } from "../../layers/StaticLayer";
import { MapboxWorldLayersDef } from "../../layers/MapboxWorldLayer";

interface ReferenceLayerSwitcherProps extends ControlProps {
  // Static layer to be added to the switch
  layers: Array<BaseMapSwitcherLayer>;
}

const MENU_ID = "reference-show-hide-menu-button";

const staticBaseLayerConfig: Array<BaseMapSwitcherLayer> = [
  {
    id: StaticLayersDef.ALLEN_CORAL_ATLAS.id,
    name: StaticLayersDef.ALLEN_CORAL_ATLAS.name,
    label: StaticLayersDef.ALLEN_CORAL_ATLAS.label,
    default: false,
  },
  {
    id: StaticLayersDef.AUSTRALIA_MARINE_PARKS.id,
    name: StaticLayersDef.AUSTRALIA_MARINE_PARKS.name,
    label: StaticLayersDef.AUSTRALIA_MARINE_PARKS.label,
    default: false,
  },
  {
    id: StaticLayersDef.MEOW.id,
    name: StaticLayersDef.MEOW.name,
    label: StaticLayersDef.MEOW.label,
    default: false,
  },
  {
    id: MapboxWorldLayersDef.WORLD.id,
    name: MapboxWorldLayersDef.WORLD.name,
    default: false,
  },
];

const ReferenceLayerSwitcher: React.FC<ReferenceLayerSwitcherProps> = ({
  layers,
  onEvent,
}) => {
  // Must init the map so that it will not throw error indicate uncontrol to control component
  const [overlaysChecked, setOverlaysChecked] = useState<Map<string, boolean>>(
    new Map(layers?.map((i) => [i.id, !!i.default]))
  );
  const [anchorEl, setAnchorEl] = useState<HTMLButtonElement | null>(null);

  const handleToggle = useCallback((event: MouseEvent<HTMLButtonElement>) => {
    setAnchorEl((prev) => (prev === null ? event.currentTarget : null));
  }, []);

  const handleClose = useCallback(() => {
    setAnchorEl(null);
  }, []);

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
      if (evt.component.type !== ReferenceLayerSwitcher) {
        setAnchorEl(null);
      }
    };

    const handleMapEvent = () => setAnchorEl(null);

    eventEmitter.on(EVENT_MENU.CLICKED, handleEvent);
    eventEmitter.on(EVENT_MAP.CLICKED, handleMapEvent);
    eventEmitter.on(EVENT_MAP.MOVE_START, handleMapEvent);

    return () => {
      eventEmitter.off(EVENT_MENU.CLICKED, handleEvent);
      eventEmitter.off(EVENT_MAP.CLICKED, handleMapEvent);
      eventEmitter.off(EVENT_MAP.MOVE_START, handleMapEvent);
    };
  }, []);
  const open = Boolean(anchorEl);
  return (
    <>
      <MenuHintTooltip hint="Reference Layers" disable={open}>
        <IconButton
          aria-label="reference-show-hide-menu"
          id={MENU_ID}
          data-testid={MENU_ID}
          onClick={handleToggle}
          sx={switcherIconButtonSx(open)}
        >
          <ReferenceLayerIcon color={open ? "white" : undefined} />
        </IconButton>
      </MenuHintTooltip>
      <Popper
        id="reference-popper-id"
        open={open}
        anchorEl={anchorEl}
        role={undefined}
        placement="left-start"
        disablePortal
        modifiers={[
          {
            name: "offset",
            options: {
              offset: [0, 10], // This applies an offset of 14px downward
            },
          },
        ]}
      >
        {
          // Dynamic size so menu is big enough to have no text wrap, whiteSpace : nowrap
        }
        <Box sx={switcherMenuBoxSx}>
          <MenuTitle title="Reference Layers" onClose={handleClose} />
          <Divider />
          <Box sx={switcherMenuContentBoxSx}>
            <FormControl component="fieldset">
              <FormGroup>
                {layers?.map((ol) => (
                  <FormControlLabel
                    key={"fc-" + ol.id}
                    sx={formControlLabelSx}
                    control={
                      <Checkbox
                        id={"cb-" + ol.id}
                        sx={switcherMenuContentIconSx}
                        checked={overlaysChecked.get(ol.id)}
                        onChange={(e) => {
                          toggleOverlay(ol.id, e.target.checked);
                          onEvent && onEvent(e.target);
                        }}
                        value={ol.id}
                      />
                    }
                    label={
                      <Typography sx={switcherMenuContentLabelTypographySx}>
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

export { staticBaseLayerConfig };

export default ReferenceLayerSwitcher;
