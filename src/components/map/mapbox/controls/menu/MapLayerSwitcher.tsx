import React, { useCallback, useEffect, useRef, useState } from "react";
import {
  ControlProps,
  EVENT_MAP,
  EVENT_MENU,
  MenuClickedEvent,
} from "./Definition";
import {
  bottomPadding,
  eventEmitter,
  leftPadding,
  rightPadding,
  topPadding,
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
import grey from "../../../../common/colors/grey";
import {
  borderRadius,
  color,
  fontColor,
  fontFamily,
  fontSize,
  fontWeight,
} from "../../../../../styles/constants";
import { SearchStyleIcon } from "../../../../../assets/map/search_style";

export interface LayerSwitcherLayer<T = string> {
  id: T;
  name: string;
  default?: boolean;
}

interface LayerSwitcherProps extends ControlProps {
  layers: Array<LayerSwitcherLayer>;
}

const MapLayerSwitcher: React.FC<LayerSwitcherProps> = ({
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
        sx={{
          padding: "6px !important",
          backgroundColor: `${open ? fontColor.blue.dark : "transparent"} !important`,
          color: open ? "white" : color.gray.dark,
          "& svg": {
            width: 24,
            height: 24,
            fill: "currentColor",
          },
        }}
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
              offset: [-132, 14], // This applies an offset of 10px downward
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
            minWidth: "260px",
          }}
        >
          <Typography
            sx={{
              backgroundColor: color.blue.medium,
              borderRadius: borderRadius["menuTop"],
              fontSize: fontSize["mapMenuItem"],
              color: fontColor.gray.extraDark,
              fontWeight: fontWeight.bold,
              fontFamily: fontFamily.openSans,
              minHeight: "40px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            Search Style
          </Typography>
          <Divider />
          <Box
            sx={{
              paddingLeft: leftPadding,
              paddingRight: rightPadding,
              paddingTop: topPadding,
              paddingBottom: bottomPadding,
            }}
          >
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
                          padding: "6px",
                          "& .MuiSvgIcon-root": {
                            fontSize: fontSize["mapMenuSubItem"],
                          },
                          "&.Mui-checked": {
                            color: fontColor.blue.dark,
                          },
                          "&:not(.Mui-checked)": {
                            color: fontColor.gray.medium,
                          },
                        }}
                      />
                    }
                    label={
                      <Typography
                        sx={{
                          fontSize: fontSize.info,
                          color: fontColor.gray.extraDark,
                          fontFamily: fontFamily.openSans,
                          fontWeight: fontWeight.regular,
                          letterSpacing: "0.5px",
                        }}
                      >
                        {"Centre points (" + l.name + ")"}
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
