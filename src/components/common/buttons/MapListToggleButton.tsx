import { Button, ListItemIcon, MenuItem } from "@mui/material";
import React, { FC, useCallback, useState } from "react";
import Menu from "@mui/material/Menu";
import ActionButtonPaper from "./ActionButtonPaper";
import GridAndMapIcon from "../../icon/GridAndMapIcon";
import ListAndMapIcon from "../../icon/ListAndMapIcon";
import FullMapViewIcon from "../../icon/FullMapViewIcon";

enum SearchResultLayoutEnum {
  GRID = "GRID",
  LIST = "LIST",
  INVISIBLE = "INVISIBLE",
  VISIBLE = "VISIBLE",
}

export interface MapListToggleButtonProps {
  onChangeLayout: (layout: SearchResultLayoutEnum) => void;
}

const determineShowingIcon = (resultLayout: SearchResultLayoutEnum) => {
  switch (resultLayout) {
    case SearchResultLayoutEnum.LIST:
      return <ListAndMapIcon />;

    case SearchResultLayoutEnum.GRID:
      return <GridAndMapIcon />;

    default:
      return <FullMapViewIcon />;
  }
};

const MapListToggleButton: FC<MapListToggleButtonProps> = ({
  onChangeLayout,
}) => {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [resultLayout, setResultLayout] = useState<SearchResultLayoutEnum>(
    SearchResultLayoutEnum.GRID
  );

  const handleClick = useCallback(
    (event: React.MouseEvent<HTMLButtonElement>) => {
      setAnchorEl(event.currentTarget);
    },
    [setAnchorEl]
  );

  const handleClose = useCallback(() => {
    setAnchorEl(null);
  }, [setAnchorEl]);

  return (
    <ActionButtonPaper>
      <Button
        id="map-list-toggle-button"
        onClick={handleClick}
        aria-controls={anchorEl != null ? "map-list-toggle-menu" : undefined}
        aria-haspopup="true"
        aria-expanded={anchorEl != null ? "true" : undefined}
        data-testid="map-list-toggle-button"
        startIcon={determineShowingIcon(resultLayout)}
      >
        View
      </Button>
      <Menu
        open={anchorEl != null}
        onClose={handleClose}
        id="map-list-toggle-menu"
        anchorEl={anchorEl}
        MenuListProps={{
          "aria-labelledby": "map-list-toggle-button",
        }}
      >
        <MenuItem
          data-testid="maplist-toggle-menu-mapview"
          onClick={() => {
            // No need to set layout because we want to
            // remember the last layout
            handleClose();
            onChangeLayout(SearchResultLayoutEnum.INVISIBLE);
          }}
        >
          <ListItemIcon>
            <FullMapViewIcon />
          </ListItemIcon>
          Full Map View
        </MenuItem>
        <MenuItem
          data-testid="maplist-toggle-menu-listandmap"
          onClick={() => {
            setResultLayout(SearchResultLayoutEnum.LIST);
            handleClose();
            onChangeLayout(SearchResultLayoutEnum.LIST);
          }}
        >
          <ListItemIcon>
            <ListAndMapIcon />
          </ListItemIcon>
          List and Map
        </MenuItem>
        <MenuItem
          data-testid="maplist-toggle-menu-gridandmap"
          onClick={() => {
            setResultLayout(SearchResultLayoutEnum.GRID);
            handleClose();
            onChangeLayout(SearchResultLayoutEnum.GRID);
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

export { SearchResultLayoutEnum };
export default MapListToggleButton;
