import { IconButton, MenuItem, Paper } from "@mui/material";
import VerticalSplitSharpIcon from "@mui/icons-material/VerticalSplitSharp";
import ArrowDropDownSharpIcon from "@mui/icons-material/ArrowDropDownSharp";
import { margin } from "../../../styles/constants";
import React, { useState } from "react";
import Menu from "@mui/material/Menu";
import { SearchResultLayoutEnum } from "../../subPage/SearchPageResultList";

// type ToolKit = {};
interface MapListToggleButtonProps {
  setLayout: (layout: SearchResultLayoutEnum) => void;
  setIsShowingResult: (value: boolean) => void;
}

const MapListToggleButton: React.FC<MapListToggleButtonProps> = ({
  setLayout,
  setIsShowingResult,
}) => {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);

  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  return (
    <Paper
      variant="outlined"
      component="form"
      sx={{
        p: "2px 14px",
        marginLeft: margin.small,
        display: "flex",
        alignItems: "center",

        width: { md: "50px" },
      }}
    >
      <IconButton
        id="map-list-toggle-button"
        onClick={handleClick}
        aria-controls={open ? "map-list-toggle-menu" : undefined}
        aria-haspopup="true"
        aria-expanded={open ? "true" : undefined}
      >
        <VerticalSplitSharpIcon />
        <ArrowDropDownSharpIcon />
      </IconButton>
      <Menu
        open={open}
        onClose={handleClose}
        id="map-list-toggle-menu"
        anchorEl={anchorEl}
        MenuListProps={{
          "aria-labelledby": "map-list-toggle-button",
        }}
      >
        <MenuItem
          onClick={() => {
            setIsShowingResult(false);
            handleClose();
          }}
        >
          Full Map View
        </MenuItem>
        <MenuItem
          onClick={() => {
            setLayout(SearchResultLayoutEnum.LIST);
            handleClose();
          }}
        >
          List and Map
        </MenuItem>
        <MenuItem
          onClick={() => {
            setLayout(SearchResultLayoutEnum.GRID);
            handleClose();
          }}
        >
          Grid and Map
        </MenuItem>
      </Menu>
    </Paper>
  );
};

export default MapListToggleButton;
