import { IconButton, ListItemIcon, MenuItem } from "@mui/material";
import ArrowDropDownSharpIcon from "@mui/icons-material/ArrowDropDownSharp";
import React, { useContext, useState } from "react";
import Menu from "@mui/material/Menu";
import { SearchResultLayoutEnum } from "../../../pages/search-page/subpages/ResultSection";
import ActionButtonPaper from "./ActionButtonPaper";
import GridAndMapIcon from "../../icon/GridAndMapIcon";
import ListAndMapIcon from "../../icon/ListAndMapIcon";
import FullMapViewIcon from "../../icon/FullMapViewIcon";
import { SearchResultLayoutContext } from "../../../pages/search-page/SearchPage";

const MapListToggleButton = () => {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);

  const { resultLayout, setResultLayout, setIsShowingResult } = useContext(
    SearchResultLayoutContext
  );

  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const determineShowingIcon = () => {
    if (resultLayout === SearchResultLayoutEnum.LIST) {
      return (
        <>
          <ListAndMapIcon />
        </>
      );
    }
    if (resultLayout === SearchResultLayoutEnum.GRID) {
      return <GridAndMapIcon />;
    }
    // TODO: May need to handle error in the future
    return undefined;
  };

  return (
    <ActionButtonPaper>
      <IconButton
        id="map-list-toggle-button"
        onClick={handleClick}
        aria-controls={open ? "map-list-toggle-menu" : undefined}
        aria-haspopup="true"
        aria-expanded={open ? "true" : undefined}
        data-testid="map-list-toggle-button"
      >
        {determineShowingIcon()}
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
          <ListItemIcon>
            <FullMapViewIcon />
          </ListItemIcon>
          Full Map View
        </MenuItem>
        <MenuItem
          onClick={() => {
            setResultLayout(SearchResultLayoutEnum.LIST);
            handleClose();
          }}
        >
          <ListItemIcon>
            <ListAndMapIcon />
          </ListItemIcon>
          List and Map
        </MenuItem>
        <MenuItem
          onClick={() => {
            setResultLayout(SearchResultLayoutEnum.GRID);
            handleClose();
          }}
        >
          <ListItemIcon>
            <GridAndMapIcon />
          </ListItemIcon>
          Grid and Map
        </MenuItem>
      </Menu>
    </ActionButtonPaper>
  );
};

export default MapListToggleButton;
