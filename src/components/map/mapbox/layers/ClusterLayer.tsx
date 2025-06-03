import {
  FC,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import MapContext from "../MapContext";
import { GeoJSONSource } from "mapbox-gl";
import MapPopup from "../component/MapPopup";
import {
  defaultMouseEnterEventHandler,
  defaultMouseLeaveEventHandler,
  findSuitableVisiblePoint,
  LayerBasicType,
} from "./Layers";
import SpatialExtents from "../component/SpatialExtents";
import SpiderDiagram from "../component/SpiderDiagram";
import { TestHelper } from "../../../common/test/helper";
import { FeatureCollection, Point } from "geojson";
import { MapDefaultConfig } from "../constants";
import { mergeWithDefaults } from "../../../../utils/ObjectUtils";
import { generateFeatureCollectionFrom } from "../../../../utils/GeoJsonUtils";
import CardPopup from "../component/CardPopup";

interface ClusterSize {
  default?: number | string;
  medium: number | string;
  large: number | string;
  extra_large: number | string;
}

interface ClusterLayerConfig {
  pointCountThresholds: ClusterSize;
  clusterMaxZoom: number;
  clusterRadius: number;
  clusterCircleSize: ClusterSize;
  clusterCircleColor: ClusterSize;
  clusterCircleOpacity: number;
  clusterCircleStrokeWidth: number;
  clusterCircleStrokeColor: string;
  clusterCircleTextSize: number;
  unclusterPointColor: string;
  unclusterPointOpacity: number;
  unclusterPointStrokeWidth: number;
  unclusterPointStrokeColor: string;
  unclusterPointRadius: number;
}

interface ClusterLayerProps extends LayerBasicType {
  // Some method inherit from LayerBasicType
  clusterLayerConfig?: Partial<ClusterLayerConfig>;
}

const defaultClusterLayerConfig: ClusterLayerConfig = {
  // point count thresholds define the boundaries between different cluster sizes.
  pointCountThresholds: {
    medium: 20,
    large: 30,
    extra_large: 50,
  },
  clusterMaxZoom: MapDefaultConfig.MAX_ZOOM,
  clusterRadius: 50,
  // circle sizes define the radius(px) of the circles used to represent clusters on the map.
  clusterCircleSize: {
    default: 20,
    medium: 30,
    large: 40,
    extra_large: 60,
  },
  //cluster circle colors define the colors used for the circles representing clusters of different sizes.
  clusterCircleColor: {
    default: "#51bbd6",
    medium: "#f1f075",
    large: "#f28cb1",
    extra_large: "#fe8cf1",
  },
  clusterCircleOpacity: 0.6,
  clusterCircleStrokeWidth: 1,
  clusterCircleStrokeColor: "#fff",
  clusterCircleTextSize: 12,
  unclusterPointColor: "#51bbd6",
  unclusterPointOpacity: 1,
  unclusterPointStrokeWidth: 1,
  unclusterPointStrokeColor: "#fff",
  unclusterPointRadius: 8,
};

// These function help to get the correct id and reduce the need to set those id in the
// useEffect list
export const getLayerId = (id: string | undefined) => `cluster-layer-${id}`;

export const getClusterSourceId = (layerId: string) => `${layerId}-source`;

export const getClusterLayerId = (layerId: string) => `${layerId}-clusters`;

export const getUnclusterPointId = (layerId: string) =>
  `${layerId}-unclustered-point`;

const ClusterLayer: FC<ClusterLayerProps> = ({
  featureCollection = generateFeatureCollectionFrom(undefined),
  selectedUuids,
  onClickMapPoint: onDatasetSelected,
  tabNavigation,
  preferCurrentCentroid = true,
  clusterLayerConfig,
}: ClusterLayerProps) => {
  const { map } = useContext(MapContext);
  const [_, setLastVisiblePoint] = useState<
    FeatureCollection<Point> | undefined
  >(undefined);

  const layerId = useMemo(() => getLayerId(map?.getContainer().id), [map]);

  const clusterSourceId = useMemo(() => getClusterSourceId(layerId), [layerId]);

  const clusterLayer = useMemo(() => getClusterLayerId(layerId), [layerId]);

  const unclusterPointLayer = useMemo(
    () => getUnclusterPointId(layerId),
    [layerId]
  );

  // This is used to render the cluster circle and add event handle to circles
  useEffect(() => {
    if (map === null) return;

    // This situation is map object created, hence not null, but not completely loaded
    // ,and therefore you will have problem setting source and layer. Set up a listener
    // to update the state and then this effect can be call again when map loaded.
    const createLayers = () => {
      // Function may call multiple times due to useEffect, it is not possible to avoid
      // these changes so use this check to avoid duplicate add
      if (map?.getSource(clusterSourceId)) return;

      const config = mergeWithDefaults(
        defaultClusterLayerConfig,
        clusterLayerConfig
      );

      map?.setMaxZoom(config.clusterMaxZoom);

      map?.addSource(clusterSourceId, {
        type: "geojson",
        data: findSuitableVisiblePoint(
          generateFeatureCollectionFrom(undefined),
          map
        ),
        cluster: true,
        clusterMaxZoom: config.clusterMaxZoom,
        clusterRadius: 50,
      });

      // Add layers for multiple items, that is the cluster
      map?.addLayer({
        id: clusterLayer,
        type: "circle",
        source: clusterSourceId,
        filter: ["has", "point_count"],
        paint: {
          "circle-stroke-width": config.clusterCircleStrokeWidth,
          "circle-stroke-color": config.clusterCircleStrokeColor,
          "circle-opacity": config.clusterCircleOpacity,
          "circle-color": [
            "step",
            ["get", "point_count"],
            config.clusterCircleColor.default,
            config.pointCountThresholds.medium,
            config.clusterCircleColor.medium,
            config.pointCountThresholds.large,
            config.clusterCircleColor.large,
            config.pointCountThresholds.extra_large,
            config.clusterCircleColor.extra_large,
          ],
          "circle-radius": [
            "step",
            ["get", "point_count"],
            config.clusterCircleSize.default,
            config.pointCountThresholds.medium,
            config.clusterCircleSize.medium,
            config.pointCountThresholds.large,
            config.clusterCircleSize.large,
            config.pointCountThresholds.extra_large,
            config.clusterCircleSize.extra_large,
          ],
        },
      });

      map?.addLayer({
        id: `${layerId}-cluster-count`,
        type: "symbol",
        source: clusterSourceId,
        filter: ["has", "point_count"],
        layout: {
          "text-field": "{point_count_abbreviated}",
          "text-font": ["DIN Offc Pro Medium", "Arial Unicode MS Bold"],
          "text-size": config.clusterCircleTextSize,
        },
      });
      // Layer for only 1 item in the circle
      map?.addLayer({
        id: unclusterPointLayer,
        type: "circle",
        source: clusterSourceId,
        filter: ["!", ["has", "point_count"]],
        paint: {
          "circle-opacity": config.unclusterPointOpacity,
          "circle-color": config.unclusterPointColor,
          "circle-radius": config.unclusterPointRadius,
          "circle-stroke-width": config.unclusterPointStrokeWidth,
          "circle-stroke-color": config.unclusterPointStrokeColor,
        },
      });

      // Change the cursor to a pointer for cluster circle/uncluster point
      map?.on("mouseenter", clusterLayer, defaultMouseEnterEventHandler);
      map?.on("mouseenter", unclusterPointLayer, defaultMouseEnterEventHandler);
      // Change the cursor back to default when it leaves the cluster circle/unclustered points
      map?.on("mouseleave", clusterLayer, defaultMouseLeaveEventHandler);
      map?.on("mouseleave", unclusterPointLayer, defaultMouseLeaveEventHandler);
    };

    map?.once("load", createLayers);

    // When user change the map style, for example change base map, all layer will be removed
    // as per mapbox design, we need to listen to that even and add back the layer
    map?.on("styledata", createLayers);

    return () => {
      map?.off("mouseenter", clusterLayer, defaultMouseEnterEventHandler);
      map?.off(
        "mouseenter",
        unclusterPointLayer,
        defaultMouseEnterEventHandler
      );

      map?.off("mouseleave", clusterLayer, defaultMouseLeaveEventHandler);
      map?.off(
        "mouseleave",
        unclusterPointLayer,
        defaultMouseLeaveEventHandler
      );
      // Clean up resource when you click on the next spatial extents, map is
      // still working in this page.
      try {
        // Remove layers first
        if (map?.getLayer(clusterLayer)) map?.removeLayer(clusterLayer);

        if (map?.getLayer(`${layerId}-cluster-count`))
          map?.removeLayer(`${layerId}-cluster-count`);

        if (map?.getLayer(unclusterPointLayer))
          map?.removeLayer(unclusterPointLayer);

        if (map?.getLayer(`${layerId}-unclustered-count`))
          map?.removeLayer(`${layerId}-unclustered-count`);

        // Then remove the source
        if (map?.getSource(clusterSourceId)) map?.removeSource(clusterSourceId);
      } catch (error) {
        // If source not found and throw exception then layer will not exist
        // TODO: handle error in ErrorBoundary
      }
    };
    // Make sure map is the only dependency so that it will not trigger twice run
    // where you will add source and remove layer accidentally.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [map]);

  const updateSource = useCallback(() => {
    if (map?.getSource(clusterSourceId)) {
      setLastVisiblePoint((p) => {
        const newData = findSuitableVisiblePoint(
          featureCollection,
          map,
          p,
          preferCurrentCentroid
        );

        (map?.getSource(clusterSourceId) as GeoJSONSource).setData(newData);
        return newData;
      });
    }
  }, [map, clusterSourceId, featureCollection, preferCurrentCentroid]);

  useEffect(() => {
    updateSource();
    map?.on("styledata", updateSource);
    return () => {
      map?.off("styledata", updateSource);
    };
  }, [map, updateSource]);

  return (
    <>
      <MapPopup layerId={unclusterPointLayer} tabNavigation={tabNavigation} />
      <CardPopup layerId={unclusterPointLayer} tabNavigation={tabNavigation} />
      <SpatialExtents
        layerId={unclusterPointLayer}
        selectedUuids={selectedUuids}
        addedLayerIds={[clusterLayer, unclusterPointLayer]}
        onDatasetSelected={onDatasetSelected}
      />
      <SpiderDiagram
        clusterLayer={clusterLayer}
        clusterSourceId={clusterSourceId}
        unclusterPointLayer={unclusterPointLayer}
        onClickMapPoint={onDatasetSelected}
        tabNavigation={tabNavigation}
      />
      <TestHelper
        mapId={map?.getContainer().id || ""}
        getHeatmapLayer={() => clusterLayer}
      />
    </>
  );
};

export default ClusterLayer;
