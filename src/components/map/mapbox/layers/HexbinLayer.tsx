import React, {
  useCallback,
  useContext,
  useEffect,
  useMemo,
  memo,
  useRef,
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
  Units,
} from "@turf/turf";
import _ from "lodash";

interface DetailClusterSize {
  default: string;
}

interface DetailHexbinConfig {
  clusterMaxZoom: number;
  clusterColor: DetailClusterSize;
  clusterMinOpacity: number;
  clusterMaxOpacity: number;
}

const config: DetailHexbinConfig = {
  clusterMaxZoom: MapDefaultConfig.MAX_ZOOM,
  //cluster circle colors define the colors used for the circles representing clusters of different sizes.
  clusterColor: {
    default: "#CCC",
  },
  clusterMinOpacity: 0.3,
  clusterMaxOpacity: 0.9,
};

const createHexGrid = (
  bounds: BBox,
  cellSize: number,
  units: Units = "miles"
): FeatureCollection<Polygon> => {
  const [minX, minY, maxX, maxY] = bounds;

  if (minX < 0 && maxX > 0) {
    // The bounds cross zero line, need special handle, first split it to two bbox across zero
    const grids = [
      [minX, minY, 0, maxY] as BBox,
      [0, minY, maxX, maxY] as BBox,
    ].map((b) => hexGrid(b, cellSize, { units: units }));
    // Combine the hex generated and create FeatureCollection
    return {
      type: "FeatureCollection",
      features: grids.flatMap((grid) => grid.features),
    };
  } else {
    return hexGrid(bounds, cellSize, { units: units });
  }
};

// Function to aggregate points into HexBins
const aggregateToHexBins = (
  points: FeatureCollection<Point | MultiPoint>
): [number, FeatureCollection<Polygon>] => {
  let hexbinFeatures: Feature<Polygon>[];
  let maxCount: number = 2;
  console.time("MyComponent Execution");
  if (points.features.length === 0) {
    // Default to nothing
    hexbinFeatures = [];
  } else {
    // Calculate bounding box of points
    const bounds = bbox(points);

    // Use a larger cellSide (e.g., 0.1 degrees ≈ 10km) to reduce hexagon count
    const hexagons: FeatureCollection<Polygon> = createHexGrid(bounds, 65);

    // Aggregate points into hexagons
    hexbinFeatures = hexagons.features
      .map((hex: Feature<Polygon>) => {
        const hexBounds: BBox = bbox(hex);
        // Lightweight bounding box pre-filter, it will make processing much faster than
        // use the pointsWithPolygon directly
        const candidatePoints = featureCollection(
          points.features.filter((point) => {
            const [lon, lat] = point.geometry.coordinates as [number, number];
            return (
              lon >= hexBounds[0] &&
              lon <= hexBounds[2] &&
              lat >= hexBounds[1] &&
              lat <= hexBounds[3]
            );
          })
        );

        if (candidatePoints.features.length > 1) {
          // pointsWithinPolygon is very heavy weighted, run it unless we have some points
          const pointsInHex = pointsWithinPolygon(candidatePoints, hex);

          const count = _.sumBy(
            pointsInHex.features,
            (feature) => feature.properties?.count || 0
          );

          if (count > maxCount) {
            maxCount = count;
          }

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
        }
      })
      .filter((hex) => hex && hex.properties.count > 0) as Feature<Polygon>[]; // Only keep hexagons with points
  }
  console.timeEnd("MyComponent Execution");

  return [
    maxCount,
    {
      type: "FeatureCollection",
      features: hexbinFeatures,
    },
  ];
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
    const hexbinInitialized = useRef(false);

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
        if (
          map.getSource(sourceId) ||
          hexbinInitialized.current ||
          featureCollection?.features?.length == 0
        )
          return;

        hexbinInitialized.current = true; // Mark as initialized
        map.setMaxZoom(config.clusterMaxZoom);

        const [maxCount, hexData] = aggregateToHexBins(featureCollection);

        map.addSource(sourceId, {
          type: "geojson",
          data: hexData,
        });

        map.addLayer({
          id: hexbinLayer,
          type: "fill",
          source: sourceId,
          paint: {
            "fill-color": config.clusterColor.default,
            "fill-opacity": [
              "interpolate",
              ["linear"],
              ["get", "count"],
              0, // Minimum count
              config.clusterMinOpacity, // Minimum opacity
              maxCount, // Maximum count
              config.clusterMaxOpacity, // Maximum opacity
            ],
            "fill-outline-color": "#000",
          },
        });

        map.on("mouseenter", hexbinLayer, defaultMouseEnterEventHandler);
        map.on("mouseleave", hexbinLayer, defaultMouseLeaveEventHandler);
        map.on("click", hexbinLayer, onHexbinClick);
      };
      map.once("load", createHexbinLayer);

      return () => {
        map.off("mouseenter", hexbinLayer, defaultMouseEnterEventHandler);
        map.off("mouseleave", hexbinLayer, defaultMouseLeaveEventHandler);
        map.off("click", hexbinLayer, onHexbinClick);
        hexbinInitialized.current = false;
        try {
          if (map.getLayer(hexbinLayer)) map.removeLayer(hexbinLayer);
          if (map.getSource(sourceId)) map.removeSource(sourceId);
        } catch (error) {
          console.error("Error cleaning up hexbin layer:", error);
        }
      };
    }, [map, sourceId, hexbinLayer, featureCollection, onHexbinClick]);

    useEffect(() => {
      // Update source data when featureCollection changes
      const updateSource = () => {
        const source = map?.getSource(sourceId) as GeoJSONSource | undefined;
        if (source) {
          const [maxCount, hexData] = aggregateToHexBins(featureCollection);

          source.setData(hexData);

          map?.setPaintProperty(hexbinLayer, "fill-opacity", [
            "interpolate",
            ["linear"],
            ["get", "count"],
            0,
            config.clusterMinOpacity,
            maxCount,
            config.clusterMaxOpacity,
          ]);
        }
      };

      map?.on("styledata", updateSource);
      return () => {
        map?.off("styledata", updateSource);
      };
    }, [featureCollection, hexbinLayer, map, sourceId]);

    return null; // No DOM rendering needed
  }
);

HexbinLayer.displayName = "DetailSymbolLayer";

export { createHexGrid };
export default HexbinLayer;
