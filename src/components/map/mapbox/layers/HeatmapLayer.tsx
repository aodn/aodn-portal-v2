import {
  FC,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import MapContext from "../MapContext";

import {
  ExpressionSpecification,
  GeoJSONSource,
  PropertyValueSpecification,
} from "mapbox-gl";
import {
  defaultMouseEnterEventHandler,
  defaultMouseLeaveEventHandler,
  findSuitableVisiblePoint,
  LayerBasicType,
} from "./Layers";
import MapPopup from "../component/MapPopup";
import SpatialExtents from "../component/SpatialExtents";
import SpiderDiagram from "../component/SpiderDiagram";
import { TestHelper } from "../../../common/test/helper";
import { FeatureCollection, Point } from "geojson";
import { MapDefaultConfig } from "../constants";
import { generateFeatureCollectionFrom } from "../../../../utils/GeoJsonUtils";
import { mergeWithDefaults } from "../../../../utils/ObjectUtils";
import CardPopup from "../component/CardPopup";

interface IHeatmapLayer {
  maxZoom: number;
  weight: number | PropertyValueSpecification<number> | ExpressionSpecification;
  color: ExpressionSpecification;
  radius: number | PropertyValueSpecification<number> | ExpressionSpecification;
}

interface HeatmapCircle {
  radius: number | PropertyValueSpecification<number> | ExpressionSpecification;
  color: string;
  strokeColor: string;
  strokeWidth: number;
}

interface HeatmapConfig {
  clusterMaxZoom: number;
  heatmapSourceRadius: number;
  layer: IHeatmapLayer;
  circle: HeatmapCircle;
}

interface HeatmapLayerProps extends LayerBasicType {
  // Some method inherit from LayerBasicType
  heatmapLayerConfig?: Partial<HeatmapConfig>;
}

const defaultHeatmapConfig: HeatmapConfig = {
  clusterMaxZoom: MapDefaultConfig.MAX_ZOOM,
  heatmapSourceRadius: 10,
  circle: {
    strokeColor: "white",
    strokeWidth: 1,
    radius: 8,
    color: "#51bbd6",
  },
  layer: {
    maxZoom: 7,
    weight: 1,
    color: [
      "interpolate",
      ["linear"],
      ["heatmap-density"],
      0,
      "rgba(236,222,239,0)",
      0.2,
      "rgb(208,209,230)",
      0.3,
      "rgb(166,189,219)",
      0.4,
      "rgb(103,169,207)",
      0.6,
      "#ffe69e",
      0.7,
      "#ffd991",
      0.8,
      "#ffcc84",
      0.9,
      "#ffba78",
      1,
      "#ffa86b",
    ] as ExpressionSpecification,
    radius: {
      stops: [
        [11, 15],
        [15, 20],
      ],
    } as PropertyValueSpecification<number>,
  },
};

// These function help to get the correct id and reduce the need to set those id in the
// useEffect list
const getLayerId = (id: string | undefined) => `heatmap-layer-${id}`;
const getHeatmapSourceId = (layerId: string) => `${layerId}-heatmap-source`;
const getHeatmapLayerId = (layerId: string) => `${layerId}-heatmap-layer`;
const getClusterSourceId = (layerId: string) => `${layerId}-cluster-source`;
const getClusterCircleLayerId = (layerId: string) =>
  `${layerId}-cluster-circle-layer`;
const getUnclusterPointLayerId = (layerId: string) =>
  `${layerId}-uncluster-point-layer`;

const HeatmapLayer: FC<HeatmapLayerProps> = ({
  featureCollection = generateFeatureCollectionFrom(undefined),
  selectedUuids,
  onClickMapPoint: onDatasetSelected,
  tabNavigation,
  preferCurrentCentroid = true,
  heatmapLayerConfig,
}: HeatmapLayerProps) => {
  const { map } = useContext(MapContext);
  const [_, setLastVisiblePoint] = useState<
    FeatureCollection<Point> | undefined
  >(undefined);

  const [
    heatmapSourceId,
    clusterSourceId,
    heatmapLayer,
    clusterLayer,
    unClusterPointLayer,
  ] = useMemo(() => {
    const layerId = getLayerId(map?.getContainer().id);
    const heatmapSourceId = getHeatmapSourceId(layerId);
    const clusterSourceId = getClusterSourceId(layerId);
    const heatmapLayer = getHeatmapLayerId(layerId);
    const clusterLayer = getClusterCircleLayerId(layerId);
    const unClusterPointLayer = getUnclusterPointLayerId(layerId);

    return [
      heatmapSourceId,
      clusterSourceId,
      heatmapLayer,
      clusterLayer,
      unClusterPointLayer,
    ];
  }, [map]);

  // This is use to render the heatmap and add event handle to circles
  useEffect(() => {
    if (map === null) return;

    // This situation is map object created, hence not null, but not completely loaded
    // and therefore you will have problem setting source and layer. Set-up a listener
    // to update the state and then this effect can be call again when map loaded.
    const createLayers = () => {
      const dataSource = findSuitableVisiblePoint(
        generateFeatureCollectionFrom(undefined),
        map
      );

      const config = mergeWithDefaults(
        defaultHeatmapConfig,
        heatmapLayerConfig
      );

      map?.setMaxZoom(config.clusterMaxZoom);

      if (!map?.getSource(heatmapSourceId)) {
        map?.addSource(heatmapSourceId, {
          type: "geojson",
          data: dataSource,
          cluster: false,
        });
      }

      if (!map?.getSource(clusterSourceId)) {
        map?.addSource(clusterSourceId, {
          type: "geojson",
          data: dataSource,
          cluster: true,
          clusterMaxZoom: config.clusterMaxZoom,
          clusterRadius: config.heatmapSourceRadius,
        });
      }

      if (!map?.getLayer(heatmapLayer)) {
        map?.addLayer({
          id: heatmapLayer,
          type: "heatmap",
          source: heatmapSourceId,
          maxzoom: config.layer.maxZoom,
          paint: {
            // increase weight as diameter breast height increases
            "heatmap-weight": config.layer.weight,
            // increase intensity as zoom level increases
            "heatmap-intensity": {
              stops: [
                [config.layer.maxZoom - 4, 1],
                [config.layer.maxZoom, 3],
              ],
            } as PropertyValueSpecification<number>,
            // assign color values be applied to points depending on their density
            "heatmap-color": config.layer.color,
            // increase radius as zoom increases
            "heatmap-radius": config.layer.radius,
            // decrease opacity to transition into the circle layer
            "heatmap-opacity": {
              default: 1,
              stops: [
                [config.layer.maxZoom - 1, 1],
                [config.layer.maxZoom, 0],
              ],
            } as unknown as PropertyValueSpecification<number>,
          },
        });
      }

      if (!map?.getLayer(clusterLayer)) {
        map?.addLayer({
          id: clusterLayer,
          type: "circle",
          minzoom: config.layer.maxZoom - 1,
          source: clusterSourceId,
          filter: ["has", "point_count"],
          paint: {
            // increase the radius of the circle as the zoom level and dbh value increases
            "circle-radius": config.circle.radius,
            "circle-color": config.circle.color,
            "circle-stroke-color": config.circle.strokeColor,
            "circle-stroke-width": config.circle.strokeWidth,
            "circle-opacity": {
              stops: [
                // You want to make the heatmap totally transparent
                // aka looks disapear when the zoom level is hit max
                // zoom. Reappear if greater than max zoom
                [config.layer.maxZoom - 1, 0],
                [config.layer.maxZoom, 1],
              ],
            },
          },
        });
      }

      if (!map?.getLayer("cluster-count")) {
        map?.addLayer({
          id: "cluster-count",
          type: "symbol",
          source: clusterSourceId,
          filter: ["has", "point_count"],
          minzoom: config.layer.maxZoom - 1,
          layout: {
            "text-field": "{point_count_abbreviated}",
            "text-font": ["DIN Offc Pro Medium", "Arial Unicode MS Bold"],
            "text-size": 12,
          },
        });
      }

      if (!map?.getLayer(unClusterPointLayer)) {
        map?.addLayer({
          id: unClusterPointLayer,
          type: "circle",
          source: clusterSourceId,
          filter: ["!", ["has", "point_count"]],
          // Individual points appear at max cluster zoom
          minzoom: config.layer.maxZoom - 1,
          paint: {
            "circle-radius": config.circle.radius,
            "circle-color": config.circle.color,
            "circle-stroke-color": config.circle.strokeColor,
            "circle-stroke-width": config.circle.strokeWidth,
          },
        });
      }

      // Change the cursor to a pointer for uncluster point
      map?.on("mouseenter", unClusterPointLayer, defaultMouseEnterEventHandler);
      map?.on("mouseenter", clusterLayer, defaultMouseEnterEventHandler);

      // Change the cursor back to default when it leaves the unclustered points
      map?.on("mouseleave", unClusterPointLayer, defaultMouseLeaveEventHandler);
      map?.on("mouseleave", clusterLayer, defaultMouseLeaveEventHandler);
    };

    map?.once("idle", createLayers);

    // When user change the map style, for example change base map, all layer will be removed
    // as per mapbox design, we need to listen to that even and add back the layer
    map?.on("styledata", createLayers);

    return () => {
      map?.off(
        "mouseenter",
        unClusterPointLayer,
        defaultMouseEnterEventHandler
      );
      map?.off("mouseenter", clusterLayer, defaultMouseEnterEventHandler);
      map?.off(
        "mouseleave",
        unClusterPointLayer,
        defaultMouseLeaveEventHandler
      );
      map?.off("mouseleave", clusterLayer, defaultMouseLeaveEventHandler);

      if (map?.isStyleLoaded()) {
        if (map?.getLayer(heatmapLayer)) map?.removeLayer(heatmapLayer);
        if (map?.getLayer(clusterLayer)) map?.removeLayer(clusterLayer);
        if (map?.getLayer(unClusterPointLayer))
          map?.removeLayer(unClusterPointLayer);
        if (map?.getLayer("cluster-count")) map?.removeLayer("cluster-count");
        if (map?.getSource(heatmapSourceId)) map?.removeSource(heatmapSourceId);
        if (map?.getSource(clusterSourceId)) map?.removeSource(clusterSourceId);
      }
    };
    // Make sure map is the only dependency so that it will not trigger twice run
    // where you will add source and remove layer accidentally.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [map]);

  const updateSource = useCallback(() => {
    setLastVisiblePoint((p) => {
      const newData = findSuitableVisiblePoint(
        featureCollection,
        map,
        p,
        preferCurrentCentroid
      );
      if (map?.getSource(heatmapSourceId)) {
        (map?.getSource(heatmapSourceId) as GeoJSONSource).setData(newData);
      }
      if (map?.getSource(clusterSourceId)) {
        (map?.getSource(clusterSourceId) as GeoJSONSource).setData(newData);
      }
      return newData;
    });
  }, [
    featureCollection,
    map,
    heatmapSourceId,
    clusterSourceId,
    preferCurrentCentroid,
  ]);

  useEffect(() => {
    updateSource();
    map?.on("styledata", updateSource);
    return () => {
      map?.off("styledata", updateSource);
    };
  }, [map, updateSource]);

  return (
    <>
      <MapPopup layerId={unClusterPointLayer} tabNavigation={tabNavigation} />
      <CardPopup layerId={unClusterPointLayer} tabNavigation={tabNavigation} />
      <SpatialExtents
        layerId={unClusterPointLayer}
        selectedUuids={selectedUuids}
        addedLayerIds={[clusterLayer, unClusterPointLayer]}
        onDatasetSelected={onDatasetSelected}
      />
      <SpiderDiagram
        clusterLayer={clusterLayer}
        clusterSourceId={clusterSourceId}
        unclusterPointLayer={unClusterPointLayer}
        onClickMapPoint={onDatasetSelected}
        tabNavigation={tabNavigation}
      />
      <TestHelper
        id={map?.getContainer().id || ""}
        getHeatmapLayer={() => heatmapLayer}
      />
    </>
  );
};

export default HeatmapLayer;
