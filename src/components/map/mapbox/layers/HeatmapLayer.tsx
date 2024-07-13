import { FC, useCallback, useContext, useEffect, useMemo } from "react";
import MapContext from "../MapContext";

import { Expression, GeoJSONSource, StyleFunction } from "mapbox-gl";
import { LayersProps, createCentroidDataSource } from "./Layers";
import { mergeWithDefaults } from "../../../common/utils";
import MapPopup from "../component/MapPopup";
import SpatialExtents from "../component/SpatialExtents";

interface HeatmapLayer {
  maxZoom: number;
  weight: number | StyleFunction | Expression;
  color: string | StyleFunction | Expression;
  radius: number | StyleFunction | Expression;
}

interface HeatmapCircle {
  radius: number | StyleFunction | Expression;
  color: string | StyleFunction | Expression;
  strokeColor: string;
  strokeWidth: number;
}

interface HeatmapConfig {
  heatmapSourceRadius: number;
  layer: HeatmapLayer;
  circle: HeatmapCircle;
}

interface HeatmapLayerProps extends LayersProps {
  heatmapLayerConfig?: Partial<HeatmapConfig>;
}

const defaultHeatmapConfig: HeatmapConfig = {
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
      0.4,
      "rgb(166,189,219)",
      0.6,
      "rgb(103,169,207)",
      0.8,
      "rgb(28,144,153)",
    ],
    radius: {
      stops: [
        [11, 15],
        [15, 20],
      ],
    },
  },
};

// These function help to get the correct id and reduce the need to set those id in the
// useEffect list
const getLayerId = (id: string | undefined) => `heatmap-layer-${id}`;
const getHeatmapSourceId = (layerId: string) => `${layerId}-source`;
const getHeatmapLayerId = (layerId: string) => `${layerId}-heatmap`;
const getCircleLayerId = (layerId: string) => `${layerId}-circle`;

const HeatmapLayer: FC<HeatmapLayerProps> = ({
  collections,
  onDatasetSelected,
  heatmapLayerConfig,
}: HeatmapLayerProps) => {
  const { map } = useContext(MapContext);
  const layerId = useMemo(() => getLayerId(map?.getContainer().id), [map]);
  const sourceId = useMemo(() => getHeatmapSourceId(layerId), [layerId]);

  // This is use to render the heatmap and add event handle to circles
  useEffect(() => {
    if (map === null) return;

    const heatmapLayer = getHeatmapLayerId(layerId);
    const circleLayer = getCircleLayerId(layerId);

    // This situation is map object created, hence not null, but not completely loaded
    // and therefore you will have problem setting source and layer. Set-up a listener
    // to update the state and then this effect can be call again when map loaded.
    const createLayers = () => {
      if (map?.getSource(sourceId)) return;

      const config = mergeWithDefaults(
        defaultHeatmapConfig,
        heatmapLayerConfig
      );

      map?.addSource(sourceId, {
        type: "geojson",
        data: createCentroidDataSource(undefined),
        cluster: false,
        clusterMaxZoom: config.layer.maxZoom - 1,
        clusterRadius: config.heatmapSourceRadius,
      });

      map?.addLayer({
        id: heatmapLayer,
        type: "heatmap",
        source: sourceId,
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
          } as StyleFunction,
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
          } as StyleFunction,
        },
      });

      map?.addLayer({
        id: circleLayer,
        type: "circle",
        minzoom: config.layer.maxZoom - 1,
        source: sourceId,
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
    };

    map?.once("load", createLayers);

    // When user change the map style, for example change base map, all layer will be removed
    // as per mapbox design, we need to listen to that even and add back the layer
    map?.on("styledata", createLayers);

    return () => {
      try {
        if (map?.getLayer(heatmapLayer)) map?.removeLayer(heatmapLayer);
        if (map?.getLayer(circleLayer)) map?.removeLayer(circleLayer);
        if (map?.getSource(sourceId)) map?.removeSource(sourceId);
      } catch (e) {
        // OK to ignore if no layer then no source as well
      }
    };
  }, [map, layerId, sourceId, heatmapLayerConfig]);

  const updateSource = useCallback(() => {
    if (map?.getSource(sourceId)) {
      (map?.getSource(sourceId) as GeoJSONSource).setData(
        createCentroidDataSource(collections)
      );
    }
  }, [map, sourceId, collections]);

  useEffect(() => {
    updateSource();
    map?.on("styledata", updateSource);
    return () => {
      map?.off("styledata", updateSource);
    };
  }, [map, updateSource]);

  return (
    <>
      <MapPopup
        layerId={getCircleLayerId(layerId)}
        onDatasetSelected={onDatasetSelected}
      />
      <SpatialExtents layerId={getCircleLayerId(layerId)} />
    </>
  );
};

export default HeatmapLayer;
