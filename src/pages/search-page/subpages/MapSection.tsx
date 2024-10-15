import { Paper, SxProps, Theme } from "@mui/material";
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
import { LngLatBoundsLike, MapboxEvent as MapEvent } from "mapbox-gl";
import Layers, {
  createStaticLayers,
} from "../../../components/map/mapbox/layers/Layers";
import ClusterLayer from "../../../components/map/mapbox/layers/ClusterLayer";
import HeatmapLayer from "../../../components/map/mapbox/layers/HeatmapLayer";
import { OGCCollection } from "../../../components/common/store/OGCCollectionDefinitions";
import { StaticLayersDef } from "../../../components/map/mapbox/layers/StaticLayer";
import { MapboxWorldLayersDef } from "../../../components/map/mapbox/layers/MapboxWorldLayer";
import SnackbarLoader from "../../../components/loading/SnackbarLoader";
import DisplayCoordinate from "../../../components/map/mapbox/controls/DisplayCoordinate";

const mapContainerId = "map-container-id";

interface MapSectionProps {
  collections: OGCCollection[];
  showFullMap: boolean;
  bbox?: LngLatBoundsLike;
  sx?: SxProps<Theme>;
  selectedUuids: string[];
  onMapZoomOrMove: (
    event: MapEvent<MouseEvent | WheelEvent | TouchEvent | undefined>
  ) => void;
  onToggleClicked: (v: boolean) => void;
  onDatasetSelected?: (uuids: Array<string>) => void;
  isLoading: boolean;
}

const MapSection: React.FC<MapSectionProps> = ({
  bbox,
  onMapZoomOrMove,
  onToggleClicked,
  onDatasetSelected,
  collections,
  showFullMap,
  sx,
  selectedUuids,
  isLoading,
}) => {
  const [selectedLayer, setSelectedLayer] = useState<string | null>("heatmap");
  const [staticLayer, setStaticLayer] = useState<Array<string>>([]);

  const createPresentationLayers = useCallback(
    (id: string | null) => {
      switch (id) {
        case "heatmap":
          return (
            <HeatmapLayer
              collections={collections}
              selectedUuids={selectedUuids}
              showFullMap={showFullMap}
              onDatasetSelected={onDatasetSelected}
            />
          );

        default:
          return (
            <ClusterLayer
              collections={collections}
              selectedUuids={selectedUuids}
              showFullMap={showFullMap}
              onDatasetSelected={onDatasetSelected}
            />
          );
      }
    },
    [collections, onDatasetSelected, selectedUuids, showFullMap]
  );

  return (
    <Paper id={mapContainerId} sx={{ ...sx, position: "relative" }}>
      <SnackbarLoader isLoading={isLoading} message="Searching..." />
      <Map
        panelId={mapContainerId}
        bbox={bbox}
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
          <DisplayCoordinate />
          <MenuControl
            menu={
              <BaseMapSwitcher
                layers={[
                  {
                    id: StaticLayersDef.AUSTRALIA_MARINE_PARKS.id,
                    name: StaticLayersDef.AUSTRALIA_MARINE_PARKS.name,
                    label: StaticLayersDef.AUSTRALIA_MARINE_PARKS.label,
                    default: false,
                  },
                  {
                    id: MapboxWorldLayersDef.WORLD.id,
                    name: MapboxWorldLayersDef.WORLD.name,
                    default: false,
                  },
                ]}
                onEvent={(target: EventTarget & HTMLInputElement) =>
                  setStaticLayer((values) => {
                    // Remove the item and add it back if selected
                    const e = values?.filter((i) => i !== target.value);
                    if (target.checked) {
                      e.push(target.value);
                    }
                    return [...e];
                  })
                }
              />
            }
          />
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
        <Layers>
          {createPresentationLayers(selectedLayer)}
          {createStaticLayers(staticLayer)}
        </Layers>
      </Map>
    </Paper>
  );
};

export default MapSection;
