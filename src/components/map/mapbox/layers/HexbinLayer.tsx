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
import { bbox, hexGrid, pointsWithinPolygon } from "@turf/turf";

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

// Sample input FeatureCollection
const pointFeatureCollection: FeatureCollection<Point> = {
  type: "FeatureCollection",
  features: [
    {
      type: "Feature",
      geometry: {
        type: "Point",
        coordinates: [143.7, -18.8],
      },
      properties: {
        date: "2021-01",
        count: 45,
      },
    },
    {
      type: "Feature",
      geometry: {
        type: "Point",
        coordinates: [145.7, -38.8],
      },
      properties: {
        date: "2021-02",
        count: 30,
      },
    },
    {
      type: "Feature",
      geometry: {
        type: "Point",
        coordinates: [158.4, -38.1],
      },
      properties: {
        date: "2021-03",
        count: 15,
      },
    },
  ],
};

// Function to aggregate points into hexbins
const aggregateToHexbins = (
  points: FeatureCollection<Point | MultiPoint> = pointFeatureCollection
): FeatureCollection<Polygon> => {
  // Calculate bounding box of points
  const bounds = bbox(points);

  // Generate hexagonal grid (cellSide in degrees, adjust for scale)
  const hexagons: FeatureCollection<Polygon> = hexGrid(bounds, 0.2, {
    units: "degrees",
  });

  // Aggregate points into hexagons
  const hexbinFeatures: Feature<Polygon>[] = hexagons.features
    .map((hex: Feature<Polygon>) => {
      const pointsInHex = pointsWithinPolygon(points, hex);

      if (pointsInHex.features.length > 0) {
        console.log("pointsInHex", pointsInHex);
      }
      const count = pointsInHex.features.reduce(
        (sum, feature) => sum + (feature.properties?.count || 0),
        0
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
    .filter((hex) => hex.properties.count >= 0); // Only keep hexagons with points

  return {
    type: "FeatureCollection",
    features: hexbinFeatures,
  };
};

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

    // Calculate max count for opacity scaling
    const maxCount = useMemo(() => {
      const maxFeature = featureCollection.features.reduce(
        (max, feature) => Math.max(max, feature.properties?.count || 0),
        0
      );
      return maxFeature || 2; // Fallback to 2 if no counts
    }, [featureCollection.features]);

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

        map.addSource(sourceId, {
          type: "geojson",
          data: aggregateToHexbins(),
          // featureCollection as FeatureCollection<Point>
          // ), // Assuming hexagonal polygons
        });

        map.addLayer({
          id: hexbinLayer,
          type: "fill",
          source: sourceId,
          paint: {
            "fill-color": "#AAA",
            "fill-opacity": [
              "interpolate",
              ["linear"],
              ["get", "count"],
              0, // Minimum count
              0.1, // Minimum opacity
              20, // Maximum count
              0.8, // Maximum opacity
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
    }, [
      map,
      sourceId,
      hexbinLayer,
      featureCollection,
      maxCount,
      onHexbinClick,
    ]);

    // Update source data when featureCollection changes
    const updateSource = useCallback(() => {
      const source = map?.getSource(sourceId) as GeoJSONSource | undefined;
      if (source) source.setData(aggregateToHexbins());
    }, [map, sourceId]);

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
