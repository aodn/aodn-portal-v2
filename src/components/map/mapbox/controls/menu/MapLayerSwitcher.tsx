import React, { useCallback, useEffect, useRef, useState } from "react";
import { ControlProps, MenuClickedEvent } from "./Definition";
import {
  EVENT_MAP_CLICKED,
  EVENT_MAP_MOVE_START,
  EVENT_MENU_CLICKED,
  eventEmitter,
  leftPadding,
  rightPadding,
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
import LayersIcon from "@mui/icons-material/Layers";
import grey from "../../../../common/colors/grey";
import blue from "../../../../common/colors/blue";
import { borderRadius, fontSize } from "../../../../../styles/constants";

interface LayerSwitcherProps extends ControlProps {
  layers: Array<{ id: string; name: string; default?: boolean }>;
}

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
        sx={{ paddingTop: "3px !important" }}
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

export default MapLayerSwitcher;
