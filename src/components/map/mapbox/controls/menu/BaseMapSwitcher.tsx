import React, { useEffect, useState, useCallback, useRef } from "react";
import { ControlProps, MenuClickedEvent } from "./Definition";
import PublicIcon from "@mui/icons-material/Public";
import { styles as mapStyles, MapDefault } from "../../Map";
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
import {
  EVENT_MAP_CLICKED,
  EVENT_MAP_MOVE_START,
  EVENT_MENU_CLICKED,
  eventEmitter,
  leftPadding,
  rightPadding,
} from "./MenuControl";
import grey from "../../../../common/colors/grey";
import blue from "../../../../common/colors/blue";
import { borderRadius, fontSize } from "../../../../../styles/constants";

interface BaseMapSwitcherProps extends ControlProps {
  // Static layer to be added to the switch
  layers: Array<{
    id: string;
    name: string;
    label?: string;
    default?: boolean;
  }>;
}

const BaseMapSwitcher: React.FC<BaseMapSwitcherProps> = ({
  map,
  layers,
  onEvent,
}) => {
  const [currentStyle, setCurrentStyle] = useState<string>(
    mapStyles[MapDefault.DEFAULT_STYLE].id
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
                          onEvent && onEvent(e.target);
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

export default BaseMapSwitcher;
