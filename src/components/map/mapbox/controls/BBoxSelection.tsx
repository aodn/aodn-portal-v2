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

interface BBoxSelectionProps {
  map: Map | null | undefined;
}

const BBoxSelection: React.FC<BBoxSelectionProps> = ({ map }) => {
  const [open, setOpen] = useState<boolean>(false);

  const anchorRef = useRef(null);
  const popperRef = useRef<HTMLDivElement>(null);

  const handleAddBBox = useCallback(() => {
    setOpen(false);
  }, []);

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
            Bounding Box Selection
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

export default BBoxSelection;
