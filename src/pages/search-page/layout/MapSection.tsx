import React, { memo, useEffect, useMemo, useRef, useState } from "react";
import { LngLatBounds, type MapEvent } from "mapbox-gl";
import { Box, Paper, SxProps, Theme } from "@mui/material";
import Map, { MapBasicType } from "@/components/map/mapbox/Map";
import Controls from "@/components/map/mapbox/controls/Controls";
import ToggleControl, {
  ToggleControlProps,
} from "@/components/map/mapbox/controls/ToggleControl";
import NavigationControl from "@/components/map/mapbox/controls/NavigationControl";
import ScaleControl from "@/components/map/mapbox/controls/ScaleControl";
import MenuControl from "@/components/map/mapbox/controls/menu/MenuControl";
import BaseMapSwitcher from "@/components/map/mapbox/controls/menu/BaseMapSwitcher";
import Layers, { LayerBasicType } from "@/components/map/mapbox/layers/Layers";
import ClusterLayer from "@/components/map/mapbox/layers/ClusterLayer";
import HeatmapLayer from "@/components/map/mapbox/layers/HeatmapLayer";
import UnclusterLayer from "@/components/map/mapbox/layers/UnclusterLayer";
import { OGCCollection } from "@/app/store/OGCCollectionDefinitions";
import DisplayCoordinate from "@/components/map/mapbox/controls/DisplayCoordinate";
import { generateFeatureCollectionFrom } from "@/utils/GeoJsonUtils";
import { capitalizeFirstLetter } from "@/utils/StringUtils";
import useTabNavigation, { TabNavigation } from "@/hooks/useTabNavigation";
import MapLayerSwitcher, {
  LayerName,
  LayerSwitcherLayer,
} from "@/components/map/mapbox/controls/menu/MapLayerSwitcher";
import BookmarkListMenu, {
  BookmarkListMenuBasicType,
} from "@/components/map/mapbox/controls/menu/BookmarkListMenu";
import useBreakpoint from "@/hooks/useBreakpoint";
import MenuControlGroup from "@/components/map/mapbox/controls/menu/MenuControlGroup";
import ReferenceLayerSwitcher, {
  staticBaseLayerConfig,
} from "@/components/map/mapbox/controls/menu/ReferenceLayerSwitcher";
import { ProgressType } from "@/components/map/mapbox/MapContext";
import { createStaticLayers } from "@/components/map/mapbox/layers/StaticLayer";
import { fitToDefaultExtent } from "@/utils/MapUtils";
import { MapEventEnum } from "@/components/map/mapbox/constants";
import MiniFooter, { MAP_FOOTER_HEIGHT } from "@/app/layout/MiniFooter";

interface MapSectionProps
  extends
    Omit<Partial<MapBasicType>, "bbox">,
    Partial<LayerBasicType>,
    BookmarkListMenuBasicType,
    ToggleControlProps {
  bbox?: [number, number, number, number];
  collections: OGCCollection[];
  onMapZoomOrMove: (
    event: MapEvent | undefined,
    force?: boolean
  ) => void | Promise<void>;
  progress?: ProgressType;
  showFullMap: boolean;
  showFullList: boolean;
  sx?: SxProps<Theme>;
}

const mapContainerId = "result-page-main-map";

const createPresentationLayers = (
  id: string | null,
  collections: OGCCollection[],
  selectedUuids: string[] | undefined,
  tabNavigation: TabNavigation,
  onClickMapPoint: ((uuids: Array<string>) => void) | undefined,
  preferCurrentCentroid: boolean = true
) => {
  switch (id) {
    case LayerName.Heatmap:
      return (
        <HeatmapLayer
          featureCollection={generateFeatureCollectionFrom(collections)}
          selectedUuids={selectedUuids}
          onClickMapPoint={onClickMapPoint}
          tabNavigation={tabNavigation}
          preferCurrentCentroid={preferCurrentCentroid}
        />
      );

    case LayerName.Uncluster:
      return (
        <UnclusterLayer
          featureCollection={generateFeatureCollectionFrom(collections)}
          selectedUuids={selectedUuids}
          onClickMapPoint={onClickMapPoint}
          tabNavigation={tabNavigation}
          preferCurrentCentroid={preferCurrentCentroid}
        />
      );

    default:
      return (
        <ClusterLayer
          featureCollection={generateFeatureCollectionFrom(collections)}
          selectedUuids={selectedUuids}
          onClickMapPoint={onClickMapPoint}
          tabNavigation={tabNavigation}
          preferCurrentCentroid={preferCurrentCentroid}
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
    progress,
    onDeselectDataset,
  }: MapSectionProps) => {
    const { isUnderLaptop } = useBreakpoint();
    const [preferCurrentCentroid, setPreferCurrentCentroid] =
      useState<boolean>(true);
    // Identifies the search this reset started. An older search settling
    // must not turn the centroid preference back on.
    const resetTokenRef = useRef(0);
    const disabledHandlersRef = useRef<
      Array<{ enable: () => void; disable: () => void }>
    >([]);
    const pendingResetRef = useRef<{
      map: { off: (type: string, listener: () => void) => void };
      listener: () => void;
    } | null>(null);
    const finishReset = (token: number) => {
      if (resetTokenRef.current !== token) return;
      setPreferCurrentCentroid(true);
      disabledHandlersRef.current.forEach((handler) => handler.enable());
      disabledHandlersRef.current = [];
    };
    useEffect(
      () => () => {
        const pending = pendingResetRef.current;
        if (pending) {
          pending.map.off(MapEventEnum.MOVE_END, pending.listener);
          pendingResetRef.current = null;
        }
        disabledHandlersRef.current.forEach((handler) => handler.enable());
        disabledHandlersRef.current = [];
      },
      []
    );
    const [selectedLayer, setSelectedLayer] = useState<LayerName | null>(
      LayerName.Cluster
    );
    const [staticLayer, setStaticLayer] = useState<Array<string>>([]);
    const tabNavigation = useTabNavigation();
    const mapBounds = useMemo(
      () => (bbox ? new LngLatBounds(bbox) : undefined),
      [bbox]
    );
    // Early return if it is full list view
    if (showFullList) return null;
    return (
      <Box
        sx={{
          height: "100%",
          width: "100%",
          display: "flex",
          flexDirection: "column",
        }}
      >
        <Paper
          id={mapContainerId}
          sx={{
            position: "relative",
            // flex:1 is height 0 in Edge, which makes Mapbox WebGL fail.
            // Map footer is hidden on mobile, so the map can use full height.
            height: {
              xs: "100%",
              sm: `calc(100% - ${MAP_FOOTER_HEIGHT})`,
            },
            width: "100%",
            borderRadius: 0,
            overflow: "hidden",
            ...sx,
          }}
        >
          <Map
            panelId={mapContainerId}
            bbox={mapBounds}
            zoom={zoom}
            progress={progress}
            onZoomEvent={onMapZoomOrMove}
            onMoveEvent={onMapZoomOrMove}
          >
            <Controls>
              <ToggleControl
                onToggleClicked={onToggleClicked}
                showFullMap={showFullMap}
              />
              <NavigationControl
                visible={!isUnderLaptop}
                // Reset flies back to the default Australia-wide extent.
                // preferCurrentCentroid stays false until the search this
                // reset started settles, not an earlier one.
                onReset={(map) => {
                  const afterReset = () => {
                    const token = resetTokenRef.current + 1;
                    resetTokenRef.current = token;
                    setPreferCurrentCentroid(false);
                    // flyTo has no originalEvent, so the normal move handler
                    // would ignore it. Ask for a search against the new extent.
                    void Promise.resolve(
                      onMapZoomOrMove(
                        {
                          type: MapEventEnum.MOVE_END,
                          target: map,
                        } as MapEvent,
                        true
                      )
                    ).finally(() => finishReset(token));
                  };
                  // Listen after flyTo. An animated flyTo is already moving
                  // when it returns, and any moveend it emits while starting
                  // belongs to the interrupted camera move. map.on, not
                  // map.once: once wraps the listener so off cannot remove it
                  // if this section unmounts before the animation ends.
                  const pending = pendingResetRef.current;
                  if (pending) {
                    pending.map.off(MapEventEnum.MOVE_END, pending.listener);
                    pendingResetRef.current = null;
                  }
                  disabledHandlersRef.current.forEach((handler) =>
                    handler.enable()
                  );
                  disabledHandlersRef.current = [
                    map.scrollZoom,
                    map.boxZoom,
                    map.dragPan,
                    map.keyboard,
                    map.doubleClickZoom,
                    map.touchZoomRotate,
                    map.touchPitch,
                  ].flatMap((handler) =>
                    handler?.isEnabled() ? [handler] : []
                  );
                  disabledHandlersRef.current.forEach((handler) =>
                    handler.disable()
                  );
                  fitToDefaultExtent(map, undefined);
                  if (!map.isMoving()) {
                    afterReset();
                    return;
                  }
                  const listener = () => {
                    pendingResetRef.current = null;
                    map.off(MapEventEnum.MOVE_END, listener);
                    afterReset();
                  };
                  pendingResetRef.current = { map, listener };
                  map.on(MapEventEnum.MOVE_END, listener);
                }}
              />
              <ScaleControl />
              <DisplayCoordinate />
              <MenuControlGroup>
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
                      layers={staticBaseLayerConfig}
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
                          selected: selectedLayer === LayerName.Cluster,
                        },
                        {
                          id: LayerName.Uncluster,
                          name: capitalizeFirstLetter(LayerName.Uncluster),
                          selected: selectedLayer === LayerName.Uncluster,
                        },
                        {
                          id: LayerName.Heatmap,
                          name: capitalizeFirstLetter(LayerName.Heatmap),
                          selected: selectedLayer === LayerName.Heatmap,
                        },
                      ]}
                      onEvent={(
                        layer: LayerSwitcherLayer<LayerName> | undefined
                      ) => {
                        layer && setSelectedLayer(layer.id);
                      }}
                    />
                  }
                />
              </MenuControlGroup>
            </Controls>
            <Layers>
              {createPresentationLayers(
                selectedLayer,
                collections,
                selectedUuids,
                tabNavigation,
                onClickMapPoint,
                preferCurrentCentroid
              )}
              {createStaticLayers(staticLayer)}
            </Layers>
          </Map>
        </Paper>
        <MiniFooter />
      </Box>
    );
  }
);

MapSection.displayName = "MapSection";

export default MapSection;
