import { FC, useCallback, useContext, useEffect, useMemo } from "react";
import MapContext from "../MapContext";
import mapboxgl, { GeoJSONSource, MapMouseEvent, Popup } from "mapbox-gl";
import {
  defaultMouseEnterEventHandler,
  defaultMouseLeaveEventHandler,
  LayerBasicType,
} from "./Layers";

import { MapDefaultConfig } from "../constants";
import { generateFeatureCollectionFrom } from "../../../../utils/GeoJsonUtils";
import "mapbox-gl/dist/mapbox-gl.css";

import { InnerHtmlBuilder } from "../../../../utils/HtmlUtils";
import _ from "lodash";

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
}

const config: DetailClusterConfig = {
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
};

const DetailSymbolLayer: FC<LayerBasicType> = ({
  featureCollection = generateFeatureCollectionFrom(undefined),
}) => {
  const { map } = useContext(MapContext);

  const layerId = useMemo(() => `co-layer-${map?.getContainer().id}`, [map]);

  // TODO: still have bugs here, so i set default value to 2 to avoid the error
  //  as a temporary solution.
  //  The bug is: if querying featureCollection is slow, the maxCount will be the
  //  default value 2, and the layer will not be rendered correctly (no opacity change).
  //  Will fix it later as it is not a critical issue.
  const maxCount = useMemo(() => {
    const maxCountFeature = _.maxBy(
      featureCollection.features,
      (feature) => feature.properties?.count
    );
    return maxCountFeature && maxCountFeature.properties
      ? maxCountFeature.properties.count
      : 2;
  }, [featureCollection.features]);

  const clusterSourceId = useMemo(() => `${layerId}-source`, [layerId]);

  const clusterLayer = useMemo(() => `${layerId}-clusters`, [layerId]);

  const onSymbolClick = useCallback(
    (event: MapMouseEvent) => {
      const features = map?.queryRenderedFeatures(event.point, {
        layers: [clusterLayer],
      });
      if (features) {
        const htmlBuilder = new InnerHtmlBuilder()
          .addTitle("Data Records In This Area:")
          .addText("Data Record Count: " + features[0].properties?.count)
          .addRange(
            "Time Range",
            features[0].properties?.startTime,
            features[0].properties?.endTime
          );

        new Popup()
          .setLngLat(event.lngLat)
          .setHTML(htmlBuilder.getHtml())
          .addTo(map as mapboxgl.Map);
      }
    },
    [clusterLayer, map]
  );

  // This is used to render the cluster circle and add event handle to circles
  useEffect(() => {
    if (map === null) return;

    const createLayers = () => {
      if (map?.getSource(clusterSourceId)) return;

      map?.setMaxZoom(config.clusterMaxZoom);

      map?.addSource(clusterSourceId, {
        type: "geojson",
        data: featureCollection,
      });

      map?.loadImage("/images/legend1.png", (error, image) => {
        if (error) {
          throw error;
        }
        if (image) {
          map?.addImage("legend1_img", image);
        }
      });

      map?.addLayer({
        id: clusterLayer,
        type: "symbol",
        source: clusterSourceId,
        filter: ["has", "count"],
        layout: {
          "icon-image": "legend1_img",
          "icon-size": 1,
          "icon-allow-overlap": true,
          "icon-ignore-placement": true,
          "icon-anchor": "bottom",
        },
        paint: {
          "icon-opacity": [
            "interpolate",
            ["linear"],
            ["get", "count"],
            1, // Minimum count
            0.5, //  minimum opacity
            maxCount, // Maximum count
            1, // maximum opacity
          ],
        },
      });

      map?.on("mouseenter", clusterLayer, defaultMouseEnterEventHandler);
      map?.on("mouseleave", clusterLayer, defaultMouseLeaveEventHandler);
      map?.on("click", clusterLayer, onSymbolClick);
    };

    map?.once("load", createLayers);
    map?.on("styledata", createLayers);

    return () => {
      map?.off("mouseenter", clusterLayer, defaultMouseEnterEventHandler);
      map?.off("mouseleave", clusterLayer, defaultMouseLeaveEventHandler);
      map?.off("click", clusterLayer, onSymbolClick);

      try {
        if (map?.getLayer(clusterLayer)) map?.removeLayer(clusterLayer);
        if (map?.getSource(clusterSourceId)) map?.removeSource(clusterSourceId);
      } catch (error) {
        // Handle error
      }
    };
  }, [
    clusterLayer,
    clusterSourceId,
    featureCollection,
    layerId,
    map,
    maxCount,
    onSymbolClick,
  ]);

  const updateSource = useCallback(() => {
    if (map?.getSource(clusterSourceId)) {
      (map?.getSource(clusterSourceId) as GeoJSONSource).setData(
        featureCollection
      );
    }
  }, [map, clusterSourceId, featureCollection]);

  useEffect(() => {
    updateSource();
    map?.on("styledata", updateSource);
    return () => {
      map?.off("styledata", updateSource);
    };
  }, [map, updateSource]);

  return <></>;
};

export default DetailSymbolLayer;
