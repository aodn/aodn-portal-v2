import React, { useState } from "react";
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
import useTabNavigation, {
  TabNavigation,
} from "../../../hooks/useTabNavigation";
import MapLayerSwitcher from "../../../components/map/mapbox/controls/menu/MapLayerSwitcher";
import BookmarkListMenu, {
  BookmarkListMenuBasicType,
} from "../../../components/map/mapbox/controls/menu/BookmarkListMenu";
import useBreakpoint from "../../../hooks/useBreakpoint";
import { ParameterState } from "../../../components/common/store/componentParamReducer";
import store, {
  getComponentState,
} from "../../../components/common/store/store";
import ReferenceLayerSwitcher from "../../../components/map/mapbox/controls/menu/ReferenceLayerSwitcher";
import { mapSectionStyles } from "../../../components/map/mapbox/styles/custom";

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
  Cluster = "Centre points (clustered)",
  Uncluster = "Centre point (unclustered)",
  Heatmap = "Centre point (heatmap)",
}

const createPresentationLayers = (
  id: string | null,
  collections: OGCCollection[],
  selectedUuids: string[] | undefined,
  tabNavigation: TabNavigation,
  onClickMapPoint: ((uuids: Array<string>) => void) | undefined
) => {
  // If user set polygon search area, that means user have strong preference
  // and expect result within the area
  const componentParam: ParameterState = getComponentState(store.getState());

  switch (id) {
    case LayerName.Heatmap:
      return (
        <HeatmapLayer
          featureCollection={generateFeatureCollectionFrom(collections)}
          selectedUuids={selectedUuids}
          onClickMapPoint={onClickMapPoint}
          tabNavigation={tabNavigation}
          preferCurrentCentroid={componentParam.polygon === undefined}
        />
      );

    case LayerName.Uncluster:
      return (
        <UnclusterLayer
          featureCollection={generateFeatureCollectionFrom(collections)}
          selectedUuids={selectedUuids}
          onClickMapPoint={onClickMapPoint}
          tabNavigation={tabNavigation}
          preferCurrentCentroid={componentParam.polygon === undefined}
        />
      );

    default:
      return (
        <ClusterLayer
          featureCollection={generateFeatureCollectionFrom(collections)}
          selectedUuids={selectedUuids}
          onClickMapPoint={onClickMapPoint}
          tabNavigation={tabNavigation}
          preferCurrentCentroid={componentParam.polygon === undefined}
        />
      );
  }
};

const MapSection: React.FC<MapSectionProps> = ({
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
}) => {
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
      sx={
        {
          ...mapSectionStyles,
          ...sx,
        } as SxProps<Theme>
      }
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
          <MenuControl menu={<BaseMapSwitcher />} />
          <MenuControl
            menu={
              <ReferenceLayerSwitcher
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
                    name: LayerName.Cluster,
                    default: selectedLayer === LayerName.Cluster,
                  },
                  {
                    id: LayerName.Uncluster,
                    name: LayerName.Uncluster,
                    default: selectedLayer === LayerName.Uncluster,
                  },
                  {
                    id: LayerName.Heatmap,
                    name: LayerName.Heatmap,
                    default: selectedLayer === LayerName.Heatmap,
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
};

export default MapSection;
