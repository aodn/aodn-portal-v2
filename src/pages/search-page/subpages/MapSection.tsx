import React, { useCallback, useMemo, useState } from "react";
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
import Layers, {
  createStaticLayers,
} from "../../../components/map/mapbox/layers/Layers";
import ClusterLayer from "../../../components/map/mapbox/layers/ClusterLayer";
import HeatmapLayer from "../../../components/map/mapbox/layers/HeatmapLayer";
import { StaticLayersDef } from "../../../components/map/mapbox/layers/StaticLayer";
import { MapboxWorldLayersDef } from "../../../components/map/mapbox/layers/MapboxWorldLayer";
import SnackbarLoader from "../../../components/loading/SnackbarLoader";
import DisplayCoordinate from "../../../components/map/mapbox/controls/DisplayCoordinate";
import { generateFeatureCollectionFrom } from "../../../utils/GeoJsonUtils";
import { capitalizeFirstLetter } from "../../../utils/StringUtils";
import useTabNavigation from "../../../hooks/useTabNavigation";
import { useSearchPageContext } from "../context/SearchPageContext";
import { SearchResultLayoutEnum } from "../../../components/common/buttons/ResultListLayoutButton";

const mapContainerId = "map-container-id";

enum LayerName {
  Heatmap = "heatmap",
  Cluster = "cluster",
}
interface MapSectionProps {
  sx?: SxProps<Theme>;
}

const MapSection: React.FC<MapSectionProps> = ({ sx }) => {
  const [selectedLayer, setSelectedLayer] = useState<string | null>(
    LayerName.Cluster
  );
  const [staticLayer, setStaticLayer] = useState<Array<string>>([]);

  const tabNavigation = useTabNavigation();

  const {
    onToggleDisplay,
    selectedLayout,
    layers: collections,
    onMapZoomOrMove,
    bbox,
    zoom,
    isLoading,
    selectedUuids,
    onSelectDataset,
  } = useSearchPageContext();

  const showFullMap = useMemo(
    () => selectedLayout === SearchResultLayoutEnum.FULL_MAP,
    [selectedLayout]
  );

  const createPresentationLayers = useCallback(
    (id: string | null) => {
      switch (id) {
        case LayerName.Heatmap:
          return (
            <HeatmapLayer
              features={generateFeatureCollectionFrom(collections)}
              selectedUuids={selectedUuids}
              showFullMap={showFullMap}
              onDatasetSelected={onSelectDataset}
              tabNavigation={tabNavigation}
            />
          );

        default:
          return (
            <ClusterLayer
              features={generateFeatureCollectionFrom(collections)}
              selectedUuids={selectedUuids}
              showFullMap={showFullMap}
              onDatasetSelected={onSelectDataset}
              tabNavigation={tabNavigation}
            />
          );
      }
    },
    [collections, onSelectDataset, selectedUuids, showFullMap, tabNavigation]
  );

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
            onToggleClicked={onToggleDisplay}
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
