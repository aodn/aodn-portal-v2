import React, {
  FC,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import MapContext from "../MapContext";
import {
  Feature,
  FeatureCollection,
  GeoJsonProperties,
  Geometry,
} from "geojson";
import {
  OGCCollection,
  OGCCollections,
  SearchParameters,
  fetchResultNoStore,
} from "../../../common/store/searchReducer";
import { centroid } from "@turf/turf";
import { GeoJSONSource, MapLayerMouseEvent } from "mapbox-gl";
import { useDispatch } from "react-redux";
import { AppDispatch } from "../../../common/store/store";
import { LayersProps, createCentroidDataSource } from "./Layers";

interface HeatmapLayerProps extends LayersProps {}

// These function help to get the correct id and reduce the need to set those id in the
// useEffect list
const getLayerId = (id: string | undefined) => `heatmap-layer-${id}`;
const getHeatmapSourceId = (layerId: string) => `${layerId}-source`;
const getHeatmapLayerId = (layerId: string) => `${layerId}-heatmap`;
const getCircleLayerId = (layerId: string) => `${layerId}-circle`;

const HeatmapLayer: FC<HeatmapLayerProps> = ({
  collections,
  onDatasetSelected,
}: HeatmapLayerProps) => {
  const { map } = useContext(MapContext);
  const dispatch = useDispatch<AppDispatch>();

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

      map?.addSource(sourceId, {
        type: "geojson",
        data: createCentroidDataSource(undefined),
        cluster: true,
        clusterMaxZoom: 14,
        clusterRadius: 10,
      });

      map?.addLayer({
        id: heatmapLayer,
        type: "heatmap",
        source: sourceId,
        maxzoom: 15,
        paint: {
          // increase weight as diameter breast height increases
          "heatmap-weight": {
            property: "dbh",
            type: "exponential",
            stops: [
              [1, 0],
              [62, 1],
            ],
          },
          // increase intensity as zoom level increases
          "heatmap-intensity": {
            stops: [
              [11, 1],
              [15, 3],
            ],
          },
          // assign color values be applied to points depending on their density
          "heatmap-color": [
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
          // increase radius as zoom increases
          "heatmap-radius": {
            stops: [
              [11, 15],
              [15, 20],
            ],
          },
          // decrease opacity to transition into the circle layer
          "heatmap-opacity": {
            default: 1,
            stops: [
              [14, 1],
              [15, 0],
            ],
          },
        },
      });

      map?.addLayer(
        {
          id: circleLayer,
          type: "circle",
          source: sourceId,
          minzoom: 14,
          paint: {
            // increase the radius of the circle as the zoom level and dbh value increases
            "circle-radius": {
              property: "dbh",
              type: "exponential",
              stops: [
                [{ zoom: 15, value: 1 }, 5],
                [{ zoom: 15, value: 62 }, 10],
                [{ zoom: 22, value: 1 }, 20],
                [{ zoom: 22, value: 62 }, 50],
              ],
            },
            "circle-color": {
              property: "dbh",
              type: "exponential",
              stops: [
                [0, "rgba(236,222,239,0)"],
                [10, "rgb(236,222,239)"],
                [20, "rgb(208,209,230)"],
                [30, "rgb(166,189,219)"],
                [40, "rgb(103,169,207)"],
                [50, "rgb(28,144,153)"],
                [60, "rgb(1,108,89)"],
              ],
            },
            "circle-stroke-color": "white",
            "circle-stroke-width": 1,
            "circle-opacity": {
              stops: [
                [14, 0],
                [15, 1],
              ],
            },
          },
        },
        heatmapLayer
      );
    };

    map?.once("load", createLayers);

    // When user change the map style, for example change base map, all layer will be removed
    // as per mapbox design, we need to listen to that even and add back the layer
    map?.on("styledata", createLayers);

    return () => {
      if (map?.getLayer(heatmapLayer)) map?.removeLayer(heatmapLayer);
      if (map?.getLayer(circleLayer)) map?.removeLayer(circleLayer);
      if (map?.getSource(sourceId)) map?.removeSource(sourceId);
    };
  }, [map, layerId, sourceId]);

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

  return <React.Fragment />;
};

export default HeatmapLayer;
