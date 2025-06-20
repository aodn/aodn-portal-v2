import React, { useEffect, useState, useCallback, useRef } from "react";
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
  bottomPadding,
  eventEmitter,
  leftPadding,
  rightPadding,
  topPadding,
} from "./MenuControl";
import grey from "../../../../common/colors/grey";
import {
  borderRadius,
  color,
  fontColor,
  fontFamily,
  fontSize,
  fontWeight,
} from "../../../../../styles/constants";
import { BaseMapSwitcherLayer } from "./BaseMapSwitcher";
import { ReferenceLayerIcon } from "../../../../../assets/map/ref_layer";

interface ReferenceLayerSwitcherProps extends ControlProps {
  // Static layer to be added to the switch
  layers: Array<BaseMapSwitcherLayer>;
}

const MENU_ID = "reference-show-hide-menu-button";

const ReferenceLayerSwitcher: React.FC<ReferenceLayerSwitcherProps> = ({
  layers,
  onEvent,
}) => {
  // Must init the map so that it will not throw error indicate uncontrol to control component
  const [overlaysChecked, setOverlaysChecked] = useState<Map<string, boolean>>(
    new Map(layers?.map((i) => [i.id, !!i.default]))
  );
  const anchorRef = useRef(null);
  const [open, setOpen] = useState(false);

  const handleToggle = useCallback(() => {
    setOpen((prevOpen) => !prevOpen);
  }, [setOpen]);

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
        aria-label="reference-show-hide-menu"
        id={MENU_ID}
        data-testid={MENU_ID}
        ref={anchorRef}
        onClick={handleToggle}
        sx={{
          backgroundColor: `${open ? fontColor.blue.dark : "transparent"} !important`,
          color: open ? "white" : color.gray.dark,
        }}
      >
        <ReferenceLayerIcon />
      </IconButton>
      <Popper
        id="reference-popper-id"
        open={open}
        anchorEl={anchorRef.current}
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
            Reference Layers
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
              <FormGroup>
                {layers?.map((ol) => (
                  <FormControlLabel
                    key={"fc-" + ol.id}
                    control={
                      <Checkbox
                        id={"cb-" + ol.id}
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
                        checked={overlaysChecked.get(ol.id)}
                        onChange={(e) => {
                          toggleOverlay(ol.id, e.target.checked);
                          onEvent && onEvent(e.target);
                        }}
                        value={ol.id}
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

export { MENU_ID };

export default ReferenceLayerSwitcher;
