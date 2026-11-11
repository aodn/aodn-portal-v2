import React, {
  useEffect,
  useState,
  useCallback,
  startTransition,
  MouseEvent,
} from "react";
import MenuHintTooltip from "./MenuHintTooltip";
import {
  ControlProps,
  EVENT_MAP,
  EVENT_MENU,
  MenuClickedEvent,
} from "./Definition";
import {
  styles as mapStyles,
  getInitialStyle,
  BaseMapPreference,
} from "../../Map";
import { saveBaseMapId } from "@/utils/BaseMapStorageUtils";
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
} from "./MenuControl";
import { DataTestId } from "../../constants";
import { BaseLayerIcon } from "@/assets/icons/map/base_layer";
import MenuTitle from "./MenuTitle";
import { AttributionControl } from "mapbox-gl";

export interface BaseMapSwitcherLayer {
  id: string;
  name: string;
  label?: string;
  default?: boolean;
}

interface BaseMapSwitcherProps extends ControlProps {
  // Pass the same value as the Map so both use one remembered base map
  baseMap?: BaseMapPreference;
}

const MENU_ID = "basemap-show-hide-menu-button";

const BaseMapSwitcher: React.FC<BaseMapSwitcherProps> = ({ map, baseMap }) => {
  const [currentStyle, setCurrentStyle] = useState<string>(
    getInitialStyle(baseMap).id
  );
  const [_, setAttributionControl] = useState<AttributionControl | undefined>(
    undefined
  );
  const [anchorEl, setAnchorEl] = useState<HTMLButtonElement | null>(null);

  const handleClick = useCallback((event: MouseEvent<HTMLButtonElement>) => {
    setAnchorEl((prev) => (prev === null ? event.currentTarget : null));
  }, []);

  const handleClose = useCallback(() => {
    setAnchorEl(null);
  }, []);

  const updateCurrentStyle = useCallback(
    (id: string) => {
      const target = mapStyles.find((e) => e.id === id);
      if (target) {
        map?.setStyle(target.style);
        setCurrentStyle(id);
        setAttributionControl((a) => {
          if (a) {
            // Remove any existing custom attribution control
            map?.removeControl(a);
          }
          if (target.attribution) {
            // Set custom attribution if exist
            const control = new AttributionControl({
              customAttribution: target.attribution,
            });
            map?.addControl(control, "bottom-right");
            return control;
          } else {
            return undefined;
          }
        });
      }
    },
    [map]
  );

  useEffect(() => {
    // Handle event when other control clicked, this component should close
    // the menu
    const handleEvent = (evt: MenuClickedEvent) => {
      if (evt.component.type !== BaseMapSwitcher) {
        setAnchorEl(null);
      }
    };

    const handleMapEvent = () => setAnchorEl(null);
    // Make state update inside useEffect()
    startTransition(() => updateCurrentStyle(getInitialStyle(baseMap).id));

    eventEmitter.on(EVENT_MENU.CLICKED, handleEvent);
    eventEmitter.on(EVENT_MAP.CLICKED, handleMapEvent);
    eventEmitter.on(EVENT_MAP.MOVE_START, handleMapEvent);

    return () => {
      eventEmitter.off(EVENT_MENU.CLICKED, handleEvent);
      eventEmitter.off(EVENT_MAP.CLICKED, handleMapEvent);
      eventEmitter.off(EVENT_MAP.MOVE_START, handleMapEvent);
    };
  }, [updateCurrentStyle, baseMap]);

  const open = Boolean(anchorEl);
  return (
    <>
      <MenuHintTooltip hint="Base Layers" disable={open}>
        <IconButton
          aria-label="basemap-show-hide-menu"
          id={MENU_ID}
          data-testid={DataTestId.BaseMapSwitcher.MenuId}
          onClick={handleClick}
          sx={switcherIconButtonSx(open)}
        >
          <BaseLayerIcon color={open ? "white" : undefined} />
        </IconButton>
      </MenuHintTooltip>
      <Popper
        id="basemap-popper-id"
        open={open}
        anchorEl={anchorEl}
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
          <MenuTitle title="Map Base Layers" onClose={handleClose} />
          <Divider />
          <Box sx={switcherMenuContentBoxSx}>
            <FormControl component="fieldset">
              <RadioGroup
                value={currentStyle}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                  if (baseMap)
                    saveBaseMapId(baseMap.storageKey, e.target.value);
                  updateCurrentStyle(e.target.value);
                }}
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
