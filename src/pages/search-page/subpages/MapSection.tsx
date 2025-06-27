import React, { memo, useState } from "react";
import { MapboxEvent as MapEvent } from "mapbox-gl";
import { Paper, SxProps, Theme } from "@mui/material";
import Map, { MapBasicType } from "../../../components/map/mapbox/Map";
import Controls from "../../../components/map/mapbox/controls/Controls";
import ToggleControl, {
  ToggleControlProps,
} from "../../../components/map/mapbox/controls/ToggleControl";
import NavigationControl from "../../../components/map/mapbox/controls/NavigationControl";
import ScaleControl from "../../../components/map/mapbox/controls/ScaleControl";
import MenuControl from "../../../components/map/mapbox/controls/menu/MenuControl";
import BaseMapSwitcher from "../../../components/map/mapbox/controls/menu/BaseMapSwitcher";
import Layers, {
  createStaticLayers,
  LayerBasicType,
} from "../../../components/map/mapbox/layers/Layers";
import ClusterLayer from "../../../components/map/mapbox/layers/ClusterLayer";
import HeatmapLayer from "../../../components/map/mapbox/layers/HeatmapLayer";
import UnclusterLayer from "../../../components/map/mapbox/layers/UnclusterLayer";
import { OGCCollection } from "../../../components/common/store/OGCCollectionDefinitions";
import { StaticLayersDef } from "../../../components/map/mapbox/layers/StaticLayer";
import { MapboxWorldLayersDef } from "../../../components/map/mapbox/layers/MapboxWorldLayer";
import DisplayCoordinate from "../../../components/map/mapbox/controls/DisplayCoordinate";
import { generateFeatureCollectionFrom } from "../../../utils/GeoJsonUtils";
import { capitalizeFirstLetter } from "../../../utils/StringUtils";
import useTabNavigation, {
  TabNavigation,
} from "../../../hooks/useTabNavigation";
import MapLayerSwitcher from "../../../components/map/mapbox/controls/menu/MapLayerSwitcher";
import BookmarkListMenu, {
  BookmarkListMenuBasicType,
} from "../../../components/map/mapbox/controls/menu/BookmarkListMenu";
import useBreakpoint from "../../../hooks/useBreakpoint";
import MenuControlGroup from "../../../components/map/mapbox/controls/menu/MenuControlGroup";

interface MapSectionProps
  extends Partial<MapBasicType>,
    Partial<LayerBasicType>,
    BookmarkListMenuBasicType,
    ToggleControlProps {
  showFullMap: boolean;
  showFullList: boolean;
  collections: OGCCollection[];
  sx?: SxProps<Theme>;
  onMapZoomOrMove: (
    event: MapEvent<MouseEvent | WheelEvent | TouchEvent | undefined>
  ) => void;
  isLoading: boolean;
}

const mapContainerId = "result-page-main-map";

enum LayerName {
  Heatmap = "heatmap",
  Cluster = "cluster",
  Uncluster = "uncluster",
}

const createPresentationLayers = (
  id: string | null,
  collections: OGCCollection[],
  selectedUuids: string[] | undefined,
  tabNavigation: TabNavigation,
  onClickMapPoint: ((uuids: Array<string>) => void) | undefined
) => {
  switch (id) {
    case LayerName.Heatmap:
      return (
        <HeatmapLayer
          featureCollection={generateFeatureCollectionFrom(collections)}
          selectedUuids={selectedUuids}
          onClickMapPoint={onClickMapPoint}
          tabNavigation={tabNavigation}
        />
      );

    case LayerName.Uncluster:
      return (
        <UnclusterLayer
          featureCollection={generateFeatureCollectionFrom(collections)}
          selectedUuids={selectedUuids}
          onClickMapPoint={onClickMapPoint}
          tabNavigation={tabNavigation}
        />
      );

    default:
      return (
        <ClusterLayer
          featureCollection={generateFeatureCollectionFrom(collections)}
          selectedUuids={selectedUuids}
          onClickMapPoint={onClickMapPoint}
          tabNavigation={tabNavigation}
        />
      );
  }
};

const MapSection: React.FC<MapSectionProps> = memo(
  ({
    showFullList,
    showFullMap,
    bbox,
    zoom,
    onMapZoomOrMove,
    onToggleClicked,
    onClickMapPoint,
    collections,
    sx,
    selectedUuids,
    isLoading,
    onDeselectDataset,
  }: MapSectionProps) => {
    const { isUnderLaptop } = useBreakpoint();

    const [selectedLayer, setSelectedLayer] = useState<string | null>(
      LayerName.Cluster
    );
    const [staticLayer, setStaticLayer] = useState<Array<string>>([]);
    const tabNavigation = useTabNavigation();
    // Early return if it is full list view
    if (showFullList) return null;
    return (
      <Paper
        id={mapContainerId}
        sx={{
          position: "relative",
          height: "100%",
          width: "100%",
          ...sx,
        }}
      >
        <Map
          panelId={mapContainerId}
          bbox={bbox}
          zoom={zoom}
          announcement={isLoading ? "Searching..." : undefined}
          onZoomEvent={onMapZoomOrMove}
          onMoveEvent={onMapZoomOrMove}
        >
          <Controls>
            <ToggleControl
              onToggleClicked={onToggleClicked}
              showFullMap={showFullMap}
            />
            <NavigationControl visible={!isUnderLaptop} />
            <ScaleControl />
            <DisplayCoordinate />
            <MenuControl
              visible={!isUnderLaptop}
              menu={
                <BookmarkListMenu
                  onDeselectDataset={onDeselectDataset}
                  tabNavigation={tabNavigation}
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
                    {
                      id: LayerName.Uncluster,
                      name: capitalizeFirstLetter(LayerName.Uncluster),
                      default: selectedLayer === LayerName.Uncluster,
                    },
                  ]}
                  onEvent={(id: string) => setSelectedLayer(id)}
                />
              }
            />
          </Controls>
          <Layers>
            {createPresentationLayers(
              selectedLayer,
              collections,
              selectedUuids,
              tabNavigation,
              onClickMapPoint
            )}
            {createStaticLayers(staticLayer)}
          </Layers>
        </Map>
      </Paper>
    );
  }
);

MapSection.displayName = "MapSection";

export default MapSection;
