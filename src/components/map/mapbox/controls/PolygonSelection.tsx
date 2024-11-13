import React, { useCallback, useEffect, useRef, useState } from "react";
import {
  Box,
  Divider,
  FormControl,
  FormControlLabel,
  FormGroup,
  IconButton,
  Popper,
  Typography,
} from "@mui/material";
import BBoxIcon from "../../../icon/BBoxIcon";
import grey from "../../../common/colors/grey";
import { borderRadius, fontSize } from "../../../../styles/constants";
import AddIcon from "../../../icon/AddIcon";
import XIcon from "../../../icon/XIcon";
import { Map } from "mapbox-gl";
import MapboxDraw from "@mapbox/mapbox-gl-draw";
import * as turf from "@turf/turf";

interface PolygonSelectionProps {
  map: Map | undefined | null;
}

const PolygonSelection: React.FC<PolygonSelectionProps> = ({ map }) => {
  const [open, setOpen] = useState<boolean>(false);

  const anchorRef = useRef(null);
  const popperRef = useRef<HTMLDivElement>(null);
  const [roundedArea, setRoundedArea] = useState<number | undefined>(undefined);

  const handleAddBBox = useCallback(() => {
    setOpen(false);
  }, []);

  useEffect(() => {
    console.log("aaamap", map);
  }, [map]);

  const handleClickOutside = useCallback((event: MouseEvent) => {
    if (!popperRef.current || !anchorRef.current) {
      return;
    }
    if (!popperRef.current.contains(event.target as Node)) {
      setOpen(false);
    }
  }, []);

  useEffect(() => {
    if (open) {
      document.addEventListener("mousedown", handleClickOutside);
    } else {
      document.removeEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [handleClickOutside, open]);

  useEffect(() => {
    const draw = new MapboxDraw({
      displayControlsDefault: false,
      controls: {
        polygon: true,
        trash: true,
      },
      defaultMode: "draw_polygon",
    });

    const updateArea = (e: any) => {
      const data = draw.getAll();
      if (data.features.length > 0) {
        const area = turf.area(data);
        setRoundedArea(Math.round(area * 100) / 100);
      } else {
        setRoundedArea(undefined);
      }
    };
    if (map) {
      map.addControl(draw);
      map.on("draw.create", updateArea);
      map.on("draw.delete", updateArea);
      map.on("draw.update", updateArea);
    }

    return () => {
      if (!map) return;
      map.off("draw.create", updateArea);
      map.off("draw.delete", updateArea);
      map.off("draw.update", updateArea);
      map.removeControl(draw);
    };
  }, [map]);

  return (
    <>
      <IconButton
        ref={anchorRef}
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
        onClick={() => setOpen(!open)}
      >
        <BBoxIcon />
      </IconButton>
      <Popper
        id="detailmap-popper-id"
        open={open}
        anchorEl={anchorRef.current}
        ref={popperRef}
        role={undefined}
        placement={"left-start"}
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
              paddingLeft: "15px",
              fontWeight: "bold",
            }}
          >
            Polygon Selection
          </Typography>
          <Divider />
          <Box sx={{ paddingLeft: "15px", paddingRight: "15px" }}>
            <Divider />
            <Box sx={{ paddingLeft: "15px", paddingRight: "15px" }}>
              <Divider />
              <FormControl component="fieldset">
                <FormGroup>
                  <FormControlLabel
                    onClick={handleAddBBox}
                    control={<AddIcon />}
                    label={
                      <Typography sx={{ fontSize: fontSize["mapMenuSubItem"] }}>
                        Add More Selection
                      </Typography>
                    }
                  />
                  <FormControlLabel
                    control={<XIcon />}
                    label={
                      <Typography sx={{ fontSize: fontSize["mapMenuSubItem"] }}>
                        Clear Selection
                      </Typography>
                    }
                  />
                </FormGroup>
              </FormControl>
            </Box>
          </Box>
        </Box>
      </Popper>
    </>
  );
};

export default PolygonSelection;
