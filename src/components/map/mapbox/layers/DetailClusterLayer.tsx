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
import {
  defaultMouseEnterEventHandler,
  defaultMouseLeaveEventHandler,
  findSuitableVisiblePoint,
  LayersProps,
} from "./Layers";
import { Feature, Point } from "geojson";
import { MapDefaultConfig } from "../constants";
import { generateFeatureCollectionFrom } from "../../../../utils/GeoJsonUtils";
import * as turf from "@turf/turf";

interface DetailClusterSize {
  default?: number | string;
  medium: number | string;
  large: number | string;
  extra_large: number | string;
}

interface DetailClusterConfig {
  pointCountThresholds: DetailClusterSize;
  clusterMaxZoom: number;
  clusterRadius: number;
  clusterCircleSize: DetailClusterSize;
  clusterCircleColor: DetailClusterSize;
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

const defaultDetailClusterConfig: DetailClusterConfig = {
  // point count thresholds define the boundaries between different cluster sizes.
  pointCountThresholds: {
    medium: 10,
    large: 15,
    extra_large: 25,
  },
  clusterMaxZoom: MapDefaultConfig.MAX_ZOOM,
  clusterRadius: 20,
  // circle sizes define the radius(px) of the circles used to represent clusters on the map.
  clusterCircleSize: {
    default: 10,
    medium: 15,
    large: 20,
    extra_large: 30,
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

// TODO: This file is copy & paste from the clusterLayer file. It should be simplified later
const DetailClusterLayer: FC<LayersProps> = ({
  features = generateFeatureCollectionFrom(undefined),
}) => {
  const [bbox, setBbox] = useState<
    [number, number, number, number] | undefined
  >(undefined);
  const { map } = useContext(MapContext);

  const layerId = useMemo(() => getLayerId(map?.getContainer().id), [map]);

  const clusterSourceId = useMemo(() => getClusterSourceId(layerId), [layerId]);

  const clusterLayer = useMemo(() => getClusterLayerId(layerId), [layerId]);

  const unclusterPointLayer = useMemo(
    () => getUnclusterPointId(layerId),
    [layerId]
  );

  const isValid = (bbox: [number, number, number, number]) => {
    // lat and lon are in the range of -90 to 90 and -180 to 180 respectively
    const [minLon, minLat, maxLon, maxLat] = bbox;
    return (
      minLon >= -180 &&
      minLon <= 180 &&
      minLat >= -90 &&
      minLat <= 90 &&
      maxLon >= -180 &&
      maxLon <= 180 &&
      maxLat >= -90 &&
      maxLat <= 90
    );
  };

  useEffect(() => {
    if (bbox && map && isValid(bbox)) {
      map.fitBounds(bbox, {
        maxZoom: 4,
        padding: 100,
      });
    }
  }, [bbox, map]);

  useEffect(() => {
    if (!features.features || features.features.length === 0) return;
    const bbox = turf.bbox(features) as [number, number, number, number];
    setBbox(bbox);
  }, [features]);

  // This is used to render the cluster circle and add event handle to circles
  useEffect(() => {
    if (map === null) return;

    const createLayers = () => {
      if (map?.getSource(clusterSourceId)) return;

      const config = defaultDetailClusterConfig;

      map?.setMaxZoom(config.clusterMaxZoom);

      map?.addSource(clusterSourceId, {
        type: "geojson",
        data: findSuitableVisiblePoint(
          {
            type: "FeatureCollection",
            features: new Array<Feature<Point>>(),
          },
          map
        ),
        cluster: true,
        clusterMaxZoom: config.clusterMaxZoom,
        clusterRadius: config.clusterRadius,
        clusterProperties: {
          count: ["+", ["get", "count"]],
        },
      });

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
            ["get", "count"],
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
            ["get", "count"],
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
          "text-field": "{count}",
          "text-font": ["DIN Offc Pro Medium", "Arial Unicode MS Bold"],
          "text-size": config.clusterCircleTextSize,
        },
      });

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

      map?.on("mouseenter", clusterLayer, defaultMouseEnterEventHandler);
      map?.on("mouseleave", clusterLayer, defaultMouseLeaveEventHandler);
    };

    map?.once("load", createLayers);
    map?.on("styledata", createLayers);

    return () => {
      map?.off("mouseenter", clusterLayer, defaultMouseEnterEventHandler);
      map?.off("mouseleave", clusterLayer, defaultMouseLeaveEventHandler);

      try {
        if (map?.getLayer(clusterLayer)) map?.removeLayer(clusterLayer);
        if (map?.getLayer(`${layerId}-cluster-count`))
          map?.removeLayer(`${layerId}-cluster-count`);
        if (map?.getLayer(unclusterPointLayer))
          map?.removeLayer(unclusterPointLayer);
        if (map?.getSource(clusterSourceId)) map?.removeSource(clusterSourceId);
      } catch (error) {
        // Handle error
      }
    };
  }, [clusterLayer, clusterSourceId, layerId, map, unclusterPointLayer]);

  const updateSource = useCallback(() => {
    if (map?.getSource(clusterSourceId)) {
      (map?.getSource(clusterSourceId) as GeoJSONSource).setData(features);
    }
  }, [map, clusterSourceId, features]);

  useEffect(() => {
    updateSource();
    map?.on("styledata", updateSource);
    return () => {
      map?.off("styledata", updateSource);
    };
  }, [map, updateSource]);

  return <></>;
};

export default DetailClusterLayer;
