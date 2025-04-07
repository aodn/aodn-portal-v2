import React, {
  useCallback,
  useContext,
  useEffect,
  useMemo,
  memo,
} from "react";
import {
  FeatureCollection,
  Polygon,
  Feature,
  Point,
  MultiPoint,
  BBox,
} from "geojson";
import { MapMouseEvent, Popup, GeoJSONSource } from "mapbox-gl";
import {
  defaultMouseEnterEventHandler,
  defaultMouseLeaveEventHandler,
  LayerBasicType,
} from "./Layers";
import { generateFeatureCollectionFrom } from "../../../../utils/GeoJsonUtils";
import MapContext from "../MapContext";
import { InnerHtmlBuilder } from "../../../../utils/HtmlUtils";
import "mapbox-gl/dist/mapbox-gl.css";
import { MapDefaultConfig } from "../constants";
import {
  bbox,
  hexGrid,
  pointsWithinPolygon,
  featureCollection,
} from "@turf/turf";
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

// Function to aggregate points into hexbins
const aggregateToHexbins = (
  points: FeatureCollection<Point | MultiPoint>
): FeatureCollection<Polygon> => {
  // Calculate bounding box of points
  const bounds = bbox(points);

  // Use a larger cellSide (e.g., 0.1 degrees ≈ 10km) to reduce hexagon count
  const hexagons: FeatureCollection<Polygon> = hexGrid(bounds, 0.7, {
    units: "degrees",
  });

  // Pre-compute point coordinates for slight optimization
  const allPoints = featureCollection(points.features);

  // Aggregate points into hexagons
  const hexbinFeatures: Feature<Polygon>[] = hexagons.features
    .map((hex: Feature<Polygon>) => {
      const hexBounds: BBox = bbox(hex);
      // Lightweight bounding box pre-filter, it will make processing much faster than
      // use the pointsWithPolygon directly
      const candidatePoints = featureCollection(
        allPoints.features.filter((point) => {
          const [lon, lat] = point.geometry.coordinates as [number, number];
          return (
            lon >= hexBounds[0] &&
            lon <= hexBounds[2] &&
            lat >= hexBounds[1] &&
            lat <= hexBounds[3]
          );
        })
      );

      const pointsInHex = pointsWithinPolygon(candidatePoints, hex);

      const count = _.sumBy(
        pointsInHex.features,
        (feature) => feature.properties?.count || 0
      );

      const dates = pointsInHex.features
        .map((f) => f.properties?.date)
        .filter(Boolean)
        .sort(); // Sort dates chronologically

      return {
        ...hex,
        properties: {
          count,
          startTime: dates.length ? `${dates[0]}-01T00:00:00Z` : null, // Assuming YYYY-MM format, append day and time
          endTime: dates.length
            ? `${dates[dates.length - 1]}-01T23:59:59Z`
            : null, // End of month
        },
      };
    })
    .filter((hex) => hex.properties.count > 0); // Only keep hexagons with points

  return {
    type: "FeatureCollection",
    features: hexbinFeatures,
  };
};

const calculateCount = (hexData: FeatureCollection<Polygon>) =>
  hexData.features.reduce(
    (max, feature) => Math.max(max, feature.properties?.count || 0),
    0
  ) || 2; // Fallback to 2 if no counts

const HexbinLayer: React.FC<LayerBasicType> = memo(
  ({
    featureCollection = generateFeatureCollectionFrom(undefined),
  }: LayerBasicType) => {
    const { map } = useContext(MapContext);
    const layerId = useMemo(
      () => `hexbin-layer-${map?.getContainer().id ?? "default"}`,
      [map]
    );
    const sourceId = useMemo(() => `${layerId}-source`, [layerId]);
    const hexbinLayer = useMemo(() => `${layerId}-hexagons`, [layerId]);

    const onHexbinClick = useCallback(
      (event: MapMouseEvent) => {
        if (!map) return;
        const features = map.queryRenderedFeatures(event.point, {
          layers: [hexbinLayer],
        });
        if (features?.length) {
          const feature = features[0] as Feature<Polygon>;
          const { count, startTime, endTime } = feature.properties || {};

          const htmlBuilder = new InnerHtmlBuilder()
            .addTitle("Data Records In This Hexagon:")
            .addText(`Data Record Count: ${count || 0}`)
            .addRange("Time Range", startTime, endTime);

          new Popup()
            .setLngLat(event.lngLat)
            .setHTML(htmlBuilder.getHtml())
            .addTo(map);
        }
      },
      [map, hexbinLayer]
    );

    // Setup hexbin layer
    useEffect(() => {
      if (!map) return;

      const createHexbinLayer = () => {
        if (map.getSource(sourceId)) return;

        map.setMaxZoom(config.clusterMaxZoom);

        const hexData = aggregateToHexbins(featureCollection);
        const maxCount = calculateCount(hexData);

        map.addSource(sourceId, {
          type: "geojson",
          data: hexData,
        });

        map.addLayer({
          id: hexbinLayer,
          type: "fill",
          source: sourceId,
          paint: {
            "fill-color": "#CCC",
            "fill-opacity": [
              "interpolate",
              ["linear"],
              ["get", "count"],
              0, // Minimum count
              0.3, // Minimum opacity
              maxCount, // Maximum count
              0.95, // Maximum opacity
            ],
            "fill-outline-color": "#000",
          },
        });

        map.on("mouseenter", hexbinLayer, defaultMouseEnterEventHandler);
        map.on("mouseleave", hexbinLayer, defaultMouseLeaveEventHandler);
        map.on("click", hexbinLayer, onHexbinClick);
      };

      map.once("load", createHexbinLayer);
      map.on("styledata", createHexbinLayer);

      return () => {
        map.off("mouseenter", hexbinLayer, defaultMouseEnterEventHandler);
        map.off("mouseleave", hexbinLayer, defaultMouseLeaveEventHandler);
        map.off("click", hexbinLayer, onHexbinClick);

        try {
          if (map.getLayer(hexbinLayer)) map.removeLayer(hexbinLayer);
          if (map.getSource(sourceId)) map.removeSource(sourceId);
        } catch (error) {
          console.error("Error cleaning up hexbin layer:", error);
        }
      };
    }, [map, sourceId, hexbinLayer, featureCollection, onHexbinClick]);

    // Update source data when featureCollection changes
    const updateSource = useCallback(() => {
      const source = map?.getSource(sourceId) as GeoJSONSource | undefined;
      if (source) {
        const hexData = aggregateToHexbins(featureCollection);
        const maxCount = calculateCount(hexData);

        source.setData(hexData);

        map?.setPaintProperty(hexbinLayer, "fill-opacity", [
          "interpolate",
          ["linear"],
          ["get", "count"],
          0,
          0.3,
          maxCount,
          0.95,
        ]);
      }
    }, [featureCollection, hexbinLayer, map, sourceId]);

    useEffect(() => {
      updateSource();
      map?.on("styledata", updateSource);
      return () => {
        map?.off("styledata", updateSource);
      };
    }, [map, updateSource]);

    return null; // No DOM rendering needed
  }
);

HexbinLayer.displayName = "DetailSymbolLayer";

export default HexbinLayer;
