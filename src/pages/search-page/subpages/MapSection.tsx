import { padding } from "../../../styles/constants";
import { Grid, Paper } from "@mui/material";
import Map from "../../../components/map/mapbox/Map";
import Controls from "../../../components/map/mapbox/controls/Controls";
import ToggleControl from "../../../components/map/mapbox/controls/ToggleControl";
import NavigationControl from "../../../components/map/mapbox/controls/NavigationControl";
import ScaleControl from "../../../components/map/mapbox/controls/ScaleControl";
import MenuControl, {
  BaseMapSwitcher,
  MapLayerSwitcher,
} from "../../../components/map/mapbox/controls/MenuControl";
import React, { useCallback, useState } from "react";
import { MapboxEvent as MapEvent } from "mapbox-gl";
import { OGCCollection } from "../../../components/common/store/searchReducer";
import Layers from "../../../components/map/mapbox/layers/Layers";
import ClusterLayer from "../../../components/map/mapbox/layers/ClusterLayer";
import HeatmapLayer from "../../../components/map/mapbox/layers/HeatmapLayer";

const mapContainerId = "map-container-id";

interface MapSectionProps {
  collections: OGCCollection[];
  showFullMap: boolean;
  onMapZoomOrMove: (
    event: MapEvent<MouseEvent | WheelEvent | TouchEvent | undefined>
  ) => void;
  onToggleClicked: (v: boolean) => void;
  onDatasetSelected?: (uuid: Array<string>) => void;
  onClickPopup: (uuid: string) => void;
}

const MapSection: React.FC<MapSectionProps> = ({
  onMapZoomOrMove,
  onToggleClicked,
  onDatasetSelected,
  collections,
  showFullMap,
  onClickPopup,
}) => {
  const [selectedLayer, setSelectedLayer] = useState<string | null>("heatmap");

  const createPresentationLayers = useCallback(
    (id: string | null) => {
      switch (id) {
        case "heatmap":
          return (
            <HeatmapLayer
              collections={collections}
              onDatasetSelected={onDatasetSelected}
              onClickPopup={onClickPopup}
            />
          );

        default:
          return (
            <ClusterLayer
              collections={collections}
              onDatasetSelected={onDatasetSelected}
              onClickPopup={onClickPopup}
            />
          );
      }
    },
    [collections, onDatasetSelected, onClickPopup]
  );

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
      <Paper id={mapContainerId} sx={{ minHeight: "80vh" }}>
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
            <MenuControl
              menu={
                <MapLayerSwitcher
                  layers={[
                    {
                      id: "cluster",
                      name: "Cluster",
                      default: selectedLayer === "cluster",
                    },
                    {
                      id: "heatmap",
                      name: "Heatmap",
                      default: selectedLayer === "heatmap",
                    },
                  ]}
                  onEvent={(id: string) => setSelectedLayer(id)}
                />
              }
            />
          </Controls>
          <Layers>{createPresentationLayers(selectedLayer)}</Layers>
        </Map>
      </Paper>
    </Grid>
  );
};

export default MapSection;
