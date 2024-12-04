import { Paper, SxProps, Theme } from "@mui/material";
import Map from "../../../components/map/mapbox/Map";
import Controls from "../../../components/map/mapbox/controls/Controls";
import ToggleControl from "../../../components/map/mapbox/controls/ToggleControl";
import NavigationControl from "../../../components/map/mapbox/controls/NavigationControl";
import ScaleControl from "../../../components/map/mapbox/controls/ScaleControl";
import MenuControl from "../../../components/map/mapbox/controls/menu/MenuControl";
import BaseMapSwitcher from "../../../components/map/mapbox/controls/menu/BaseMapSwitcher";
import React, { SetStateAction, useCallback, useState } from "react";
import { LngLatBounds, MapboxEvent as MapEvent } from "mapbox-gl";
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
import { generateFeatureCollectionFrom } from "../../../utils/GeoJsonUtils";
import { capitalizeFirstLetter } from "../../../utils/StringUtils";
import useTabNavigation from "../../../hooks/useTabNavigation";
import MapLayerSwitcher from "../../../components/map/mapbox/controls/menu/MapLayerSwitcher";
import BookmarkListMenu from "../../../components/map/mapbox/controls/menu/BookmarkListMenu";

const mapContainerId = "map-container-id";

enum LayerName {
  Heatmap = "heatmap",
  Cluster = "cluster",
}
interface MapSectionProps {
  showFullMap: boolean;
  showFullList: boolean;
  collections: OGCCollection[];
  bbox?: LngLatBounds;
  zoom?: number;
  sx?: SxProps<Theme>;
  selectedUuids: string[];
  setSelectedUuids?: (uuids: SetStateAction<string[]>) => void;
  onMapZoomOrMove: (
    event: MapEvent<MouseEvent | WheelEvent | TouchEvent | undefined>
  ) => void;
  onToggleClicked: (v: boolean) => void;
  onClickMapPoint?: (uuids: Array<string>) => void;
  // onClickAccordion?: (uuid: string | undefined) => void;
  // onRemoveFromBookmarkList?: (uuid: string) => void;
  isLoading: boolean;
}

const MapSection: React.FC<MapSectionProps> = ({
  showFullList,
  showFullMap,
  bbox,
  zoom,
  onMapZoomOrMove,
  onToggleClicked,
  onClickMapPoint: onDatasetSelected,
  // onClickAccordion,
  // onRemoveFromBookmarkList,
  collections,
  sx,
  selectedUuids,
  setSelectedUuids,
  isLoading,
}) => {
  const [selectedLayer, setSelectedLayer] = useState<string | null>(
    LayerName.Cluster
  );
  const [staticLayer, setStaticLayer] = useState<Array<string>>([]);

  const tabNavigation = useTabNavigation();

  const createPresentationLayers = useCallback(
    (id: string | null) => {
      switch (id) {
        case LayerName.Heatmap:
          return (
            <HeatmapLayer
              featureCollection={generateFeatureCollectionFrom(collections)}
              selectedUuids={selectedUuids}
              onDatasetSelected={onDatasetSelected}
              tabNavigation={tabNavigation}
            />
          );

        default:
          return (
            <ClusterLayer
              featureCollection={generateFeatureCollectionFrom(collections)}
              selectedUuids={selectedUuids}
              onDatasetSelected={onDatasetSelected}
              tabNavigation={tabNavigation}
            />
          );
      }
    },
    [collections, onDatasetSelected, selectedUuids, tabNavigation]
  );

  // Early return if it is full list view
  if (showFullList) return null;

  return (
    <Paper
      id={mapContainerId}
      sx={{ height: "100%", ...sx, position: "relative" }}
    >
      <SnackbarLoader isLoading={isLoading} message="Searching..." />
      <Map
        panelId={mapContainerId}
        bbox={bbox}
        zoom={zoom}
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
              <BookmarkListMenu
                setSelectedUuids={setSelectedUuids}
                // onClickAccordion={onClickAccordion}
                // onRemoveFromBookmarkList={onRemoveFromBookmarkList}
              />
            }
          />
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
                    id: LayerName.Cluster,
                    name: capitalizeFirstLetter(LayerName.Cluster),
                    default: selectedLayer === LayerName.Cluster,
                  },
                  {
                    id: LayerName.Heatmap,
                    name: capitalizeFirstLetter(LayerName.Heatmap),
                    default: selectedLayer === LayerName.Heatmap,
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
