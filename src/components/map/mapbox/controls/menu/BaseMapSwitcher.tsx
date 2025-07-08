import React, { useEffect, useState, useCallback, useRef } from "react";
import {
  ControlProps,
  EVENT_MAP,
  EVENT_MENU,
  MenuClickedEvent,
} from "./Definition";
import PublicIcon from "@mui/icons-material/Public";
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
import { eventEmitter, leftPadding, rightPadding } from "./MenuControl";
import grey from "../../../../common/colors/grey";
import blue from "../../../../common/colors/blue";
import { borderRadius, fontSize } from "../../../../../styles/constants";
import { MapDefaultConfig } from "../../constants";

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
        sx={{ paddingTop: "2px !important" }}
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
          </Box>
        </Box>
      </Popper>
    </>
  );
};

export { MENU_ID };

export default BaseMapSwitcher;
