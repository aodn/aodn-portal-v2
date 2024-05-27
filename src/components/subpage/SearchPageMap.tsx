import { padding } from "../../styles/constants";
import { Grid, Paper } from "@mui/material";
import Map from "../map/mapbox/Map";
import Controls from "../map/mapbox/controls/Controls";
import ToggleControl from "../map/mapbox/controls/ToggleControl";
import NavigationControl from "../map/mapbox/controls/NavigationControl";
import ScaleControl from "../map/mapbox/controls/ScaleControl";
import MenuControl, {
  BaseMapSwitcher,
} from "../map/mapbox/controls/MenuControl";
import Layers from "../map/mapbox/layers/Layers";
import React from "react";
import { MapboxEvent as MapEvent } from "mapbox-gl";

const mapContainerId = "map-container-id";

interface SearchPageProps {
  isShowingResult: boolean;
  onMapZoomOrMove: (
    event: MapEvent<MouseEvent | WheelEvent | TouchEvent | undefined>
  ) => void;
  setIsShowingResult: (value: boolean) => void;
}

const SearchPageMap: React.FC<SearchPageProps> = ({
  isShowingResult,
  onMapZoomOrMove,
  setIsShowingResult,
}) => {
  return (
    <Grid
      item
      sx={{
        paddingLeft: padding.medium,
        pr: 2,
        pb: 2,
        flex: 1,
        width: "100%",
      }}
    >
      <Paper id={mapContainerId} sx={{ minHeight: "726px" }}>
        <Map
          panelId={mapContainerId}
          onZoomEvent={onMapZoomOrMove}
          onMoveEvent={onMapZoomOrMove}
        >
          <Controls>
            <ToggleControl
              isShowingResult={isShowingResult}
              setIsShowingResult={setIsShowingResult}
            />
            <NavigationControl />
            <ScaleControl />
            <MenuControl menu={<BaseMapSwitcher />} />
          </Controls>
          <Layers>{/*<VectorTileLayers collections={layers} />*/}</Layers>
        </Map>
      </Paper>
    </Grid>
  );
};

export default SearchPageMap;
