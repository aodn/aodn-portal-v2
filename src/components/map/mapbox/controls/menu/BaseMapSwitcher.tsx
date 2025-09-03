import React, { useEffect, useState, useCallback, useRef } from "react";
import {
  ControlProps,
  EVENT_MAP,
  EVENT_MENU,
  MenuClickedEvent,
} from "./Definition";
import { styles as mapStyles } from "../../Map";
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
import {
  eventEmitter,
  formControlLabelSx,
  switcherIconButtonSx,
  switcherMenuBoxSx,
  switcherMenuContentBoxSx,
  switcherMenuContentIconSx,
  switcherMenuContentLabelTypographySx,
  switcherTitleTypographySx,
} from "./MenuControl";
import { MapDefaultConfig } from "../../constants";
import { BaseLayerIcon } from "../../../../../assets/icons/map/base_layer";

export interface BaseMapSwitcherLayer {
  id: string;
  name: string;
  label?: string;
  default?: boolean;
}

interface BaseMapSwitcherProps extends ControlProps {}

const MENU_ID = "basemap-show-hide-menu-button";

const BaseMapSwitcher: React.FC<BaseMapSwitcherProps> = ({ map }) => {
  const [currentStyle, setCurrentStyle] = useState<string>(
    mapStyles[MapDefaultConfig.DEFAULT_STYLE].id
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

  useEffect(() => {
    // Handle event when other control clicked, this component should close
    // the menu
    const handleEvent = (evt: MenuClickedEvent) => {
      if (evt.component.type !== BaseMapSwitcher) {
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
        aria-label="basemap-show-hide-menu"
        id={MENU_ID}
        data-testid={MENU_ID}
        ref={anchorRef}
        onClick={handleToggle}
        sx={switcherIconButtonSx(open)}
      >
        <BaseLayerIcon />
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
        <Box sx={switcherMenuBoxSx}>
          <Typography sx={switcherTitleTypographySx}>
            Map Base Layers
          </Typography>
          <Divider />
          <Box sx={switcherMenuContentBoxSx}>
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
                    sx={formControlLabelSx}
                    control={<Radio sx={switcherMenuContentIconSx} />}
                    label={
                      <Typography sx={switcherMenuContentLabelTypographySx}>
                        {style.name}
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

export default BaseMapSwitcher;
