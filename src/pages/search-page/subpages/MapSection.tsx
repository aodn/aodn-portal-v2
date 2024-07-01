import { padding } from "../../../styles/constants";
import { Grid, Paper } from "@mui/material";
import Map from "../../../components/map/mapbox/Map";
import Controls from "../../../components/map/mapbox/controls/Controls";
import ToggleControl from "../../../components/map/mapbox/controls/ToggleControl";
import NavigationControl from "../../../components/map/mapbox/controls/NavigationControl";
import ScaleControl from "../../../components/map/mapbox/controls/ScaleControl";
import MenuControl, {
  BaseMapSwitcher,
} from "../../../components/map/mapbox/controls/MenuControl";
import React from "react";
import { MapboxEvent as MapEvent } from "mapbox-gl";
import { OGCCollection } from "../../../components/common/store/searchReducer";
import Layers from "../../../components/map/mapbox/layers/Layers";
import ClusterLayer from "../../../components/map/mapbox/layers/ClusterLayer";

const mapContainerId = "map-container-id";

interface SearchPageProps {
  layers: OGCCollection[];
  showFullMap: boolean;
  onMapZoomOrMove: (
    event: MapEvent<MouseEvent | WheelEvent | TouchEvent | undefined>
  ) => void;
  onToggleClicked: (v: boolean) => void;
  onDatasetSelected?: (uuid: Array<string>) => void;
}

const MapSection: React.FC<SearchPageProps> = ({
  onMapZoomOrMove,
  onToggleClicked,
  onDatasetSelected,
  layers,
  showFullMap,
}) => {
  return (
    <Grid
      item
      sx={{
        paddingLeft: padding.medium,
        pr: 2,
        pb: 2,
        flex: 1,
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
              onToggleClicked={onToggleClicked}
              showFullMap={showFullMap}
            />
            <NavigationControl />
            <ScaleControl />
            <MenuControl menu={<BaseMapSwitcher />} />
          </Controls>
          <Layers>
            <ClusterLayer
              collections={layers}
              onDatasetSelected={onDatasetSelected}
            />
          </Layers>
        </Map>
      </Paper>
    </Grid>
  );
};

export default MapSection;
