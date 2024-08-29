import { FC, useCallback, useContext, useEffect, useState } from "react";
import MapContext from "../MapContext";
import { mergeWithDefaults } from "../../../common/utils";
import { Feature, FeatureCollection, LineString, Point } from "geojson";
import { createRoot } from "react-dom/client";
import { GeoJSONSource, MapMouseEvent } from "mapbox-gl";
import MapPopup from "./MapPopup";
import SpatialExtents from "./SpatialExtents";
import { LayersProps } from "../layers/Layers";

interface SpiderDiagramConfig {
  spiderifyFromZoomLevel: number;
  circleSpiralSwitchover: number;
  circleFootSeparation: number;
  spiralFootSeparation: number;
  spiralLengthStart: number;
  spiralLengthFactor: number;
  lineColor: string;
  lineWidth: number;
  circleRadius: number;
  circleColor: string;
  circleOpacity: number;
  circleStrokeWidth: number;
  circleStrokeColor: string;
}

interface SpiderDiagramProps extends LayersProps {
  spiderDiagramConfig?: Partial<SpiderDiagramConfig>;
  clusterLayer: string;
  clusterSourceId: string;
  unclusterPointLayer: string;
}

const defaultSpiderDiagramConfig: SpiderDiagramConfig = {
  spiderifyFromZoomLevel: 8,
  circleSpiralSwitchover: 9,
  circleFootSeparation: 25,
  spiralFootSeparation: 28,
  spiralLengthStart: 15,
  spiralLengthFactor: 4,
  lineColor: "#888",
  lineWidth: 1,
  circleRadius: 8,
  circleColor: "green",
  circleOpacity: 1,
  circleStrokeWidth: 1,
  circleStrokeColor: "#fff",
};

const getClusterCircleId = (coordinate: [number, number]) =>
  `${coordinate[0]},${coordinate[1]}`;

const getSpiderPinsSourceId = (clusterCircleId: string) =>
  `spider-pins-source-${clusterCircleId}`;

const getSpiderLinesSourceId = (clusterCircleId: string) =>
  `spider-lines-source-${clusterCircleId}`;

const getSpiderPinsLayerId = (clusterCircleId: string) =>
  `spider-lines-layer-${clusterCircleId}`;

const getSpiderLinesLayerId = (clusterCircleId: string) =>
  `spider-lines-line-${clusterCircleId}`;

const getSpiderPinId = (clusterId: string, index: number) =>
  `spider-pin-${clusterId}-${index}`;

const getSpiderLineId = (spiderPinId: string) => `${spiderPinId}-line`;

const SpiderDiagram: FC<SpiderDiagramProps> = ({
  spiderDiagramConfig,
  clusterLayer,
  clusterSourceId,
  unclusterPointLayer,
  onDatasetSelected,
}) => {
  const { map } = useContext(MapContext);

  const config = mergeWithDefaults(
    defaultSpiderDiagramConfig,
    spiderDiagramConfig
  );
  const { spiderifyFromZoomLevel } = config;

  const [currentSpiderifiedCluster, setCurrentSpiderifiedCluster] = useState<
    string | null
  >(null);

  // util function to check if a cluster can spiderify or not
  const shouldCreateSpiderDiagram = useCallback(
    (features: any[]): boolean => {
      const zoom = map?.getZoom() || 0;
      const clusterCount = features[0].properties.point_count;
      return (
        (!clusterCount && features.length > 1) || zoom >= spiderifyFromZoomLevel
      );
    },
    [map, spiderifyFromZoomLevel]
  );

  const unspiderify = useCallback(
    (clusterCircleId: string) => {
      const spiderPinsSourceId = getSpiderPinsSourceId(clusterCircleId);
      const spiderLinesSourceId = getSpiderLinesSourceId(clusterCircleId);
      const spiderPinsLayerId = getSpiderPinsLayerId(clusterCircleId);
      const spiderLinesLayerId = getSpiderLinesLayerId(clusterCircleId);

      // Remove layers
      if (map?.getLayer(spiderPinsLayerId)) {
        map.removeLayer(spiderPinsLayerId);
      }
      if (map?.getLayer(spiderLinesLayerId)) {
        map.removeLayer(spiderLinesLayerId);
      }

      // Remove sources
      if (map?.getSource(spiderPinsSourceId)) {
        map.removeSource(spiderPinsSourceId);
      }
      if (map?.getSource(spiderLinesSourceId)) {
        map.removeSource(spiderLinesSourceId);
      }

      // setCurrentSpiderifiedCluster(null);
    },
    [map]
  );

  const spiderify = useCallback(
    (coordinate: [number, number], datasets: Feature<Point>[]) => {
      const clusterCircleId = getClusterCircleId(coordinate);
      const spiderPinsSourceId = getSpiderPinsSourceId(clusterCircleId);
      const spiderLinesSourceId = getSpiderLinesSourceId(clusterCircleId);
      const spiderPinsLayerId = getSpiderPinsLayerId(clusterCircleId);
      const spiderLinesLayerId = getSpiderLinesLayerId(clusterCircleId);

      // Clear existing spider diagram if there is one
      if (currentSpiderifiedCluster) {
        unspiderify(currentSpiderifiedCluster);
      }

      // If clicking on the same cluster, just clear it and return
      if (currentSpiderifiedCluster === clusterCircleId) {
        return;
      }

      const spiderPinsFeatures: Feature<Point>[] = [];
      const spiderLinesFeatures: Feature<LineString>[] = [];

      const currentZoom = map?.getZoom() || 0;
      const numPins = datasets.length;

      // Spider configuration
      const {
        circleSpiralSwitchover,
        circleFootSeparation,
        spiralFootSeparation,
        spiralLengthStart,
        spiralLengthFactor,
      } = config;

      const generateSpiderLegParams = (count: number) => {
        if (count >= circleSpiralSwitchover) {
          // Generate spiral
          let legLength = spiralLengthStart;
          let angle = 0;
          return Array.from({ length: count }, (_, index) => {
            angle += spiralFootSeparation / legLength + index * 0.0005;
            const x = legLength * Math.cos(angle) * 10;
            const y = legLength * Math.sin(angle) * 10;
            legLength += (2 * Math.PI * spiralLengthFactor) / angle;
            return { x, y, angle, legLength, index };
          });
        } else {
          // Generate circle
          const circumference = circleFootSeparation * (2 + count);
          const legLength = circumference / (2 * Math.PI);
          const angleStep = (2 * Math.PI) / count;
          return Array.from({ length: count }, (_, index) => {
            const angle = index * angleStep;
            return {
              x: legLength * Math.cos(angle) * 15,
              y: legLength * Math.sin(angle) * 15,
              angle,
              legLength,
              index,
            };
          });
        }
      };

      const spiderLegParams = generateSpiderLegParams(numPins);

      datasets.forEach((dataset, i) => {
        const spiderLegParam = spiderLegParams[i];
        const spiderPinId = getSpiderPinId(clusterCircleId, i);
        const spiderLineId = getSpiderLineId(spiderPinId);

        // Adjust the divisor based on zoom level for finer control
        const zoomFactor = Math.pow(2, currentZoom - spiderifyFromZoomLevel);
        const coordDivisor = 5000 / zoomFactor;

        const spiderLegCoordinate = [
          coordinate[0] + spiderLegParam.x / coordDivisor,
          coordinate[1] + spiderLegParam.y / coordDivisor,
        ];

        // Create spider pin feature
        spiderPinsFeatures.push({
          type: "Feature",
          geometry: {
            type: "Point",
            coordinates: spiderLegCoordinate,
          },
          properties: {
            ...dataset.properties,
            spiderPinId: spiderPinId,
          },
        });

        // Create spider line feature
        spiderLinesFeatures.push({
          type: "Feature",
          geometry: {
            type: "LineString",
            coordinates: [coordinate, spiderLegCoordinate],
          },
          properties: {
            spiderLineId: spiderLineId,
          },
        });
      });

      // Create FeatureCollections
      const spiderPinsFeatureCollection: FeatureCollection = {
        type: "FeatureCollection",
        features: spiderPinsFeatures,
      };

      const spiderLinesFeatureCollection: FeatureCollection = {
        type: "FeatureCollection",
        features: spiderLinesFeatures,
      };

      // Add sources
      map?.addSource(spiderPinsSourceId, {
        type: "geojson",
        data: spiderPinsFeatureCollection,
      });

      map?.addSource(spiderLinesSourceId, {
        type: "geojson",
        data: spiderLinesFeatureCollection,
      });

      // Add layers
      map?.addLayer({
        id: spiderLinesLayerId,
        type: "line",
        source: spiderLinesSourceId,
        paint: {
          "line-color": config.lineColor,
          "line-width": config.lineWidth,
        },
      });

      map?.addLayer({
        id: spiderPinsLayerId,
        type: "circle",
        source: spiderPinsSourceId,
        paint: {
          "circle-radius": config.circleRadius,
          "circle-color": config.circleColor,
          "circle-opacity": config.circleOpacity,
          "circle-stroke-width": config.circleStrokeWidth,
          "circle-stroke-color": config.circleStrokeColor,
        },
      });

      setCurrentSpiderifiedCluster(clusterCircleId);
    },
    [
      currentSpiderifiedCluster,
      map,
      config,
      unspiderify,
      spiderifyFromZoomLevel,
    ]
  );

  const checkZoomAndUnspiderify = useCallback(() => {
    if (map) {
      const currentZoom = map.getZoom();
      setCurrentSpiderifiedCluster((currentCluster) => {
        if (currentCluster && currentZoom < spiderifyFromZoomLevel) {
          unspiderify(currentCluster);
          return currentCluster;
        }

        return currentCluster;
      });
    }
  }, [map, spiderifyFromZoomLevel, unspiderify]);

  // for clear spider diagram when click on empty space
  const onEmptySpaceClick = useCallback(
    (ev: MapMouseEvent) => {
      const point = ev.point;

      setCurrentSpiderifiedCluster((currentCluster) => {
        if (currentCluster) {
          const spiderPinsLayerId = getSpiderPinsLayerId(currentCluster);

          if (!map?.getLayer(spiderPinsLayerId)) return null;
          const features = map?.queryRenderedFeatures(point, {
            layers: [spiderPinsLayerId],
          });

          if (!features || features.length === 0) {
            unspiderify(currentCluster);
            return null;
          } else {
            return currentCluster;
          }
        }

        return currentCluster;
      });
    },
    [map, unspiderify]
  );

  const onClusterClick = useCallback(
    (ev: MapMouseEvent): void => {
      const features = map?.queryRenderedFeatures(ev.point, {
        layers: [clusterLayer],
      });

      if (!features || features.length === 0) return;

      const feature = features[0] as Feature<Point>;
      // coordinate of clicked cluster circle
      const coordinate = [
        feature.geometry.coordinates[0],
        feature.geometry.coordinates[1],
      ] as [number, number];

      // get cluster_id from feature for later query
      const clusterId = feature.properties?.cluster_id;

      // get clicked cluster source
      const source = map?.getSource(clusterSourceId) as GeoJSONSource;

      if (shouldCreateSpiderDiagram(features)) {
        // get all datasets behind the cluster
        source.getClusterLeaves(clusterId, 100, 0, (err, leaves) => {
          if (err) {
            console.error("Error getting cluster leaves:", err);
            return;
          }
          const datasets = leaves as Feature<Point>[];
          spiderify(coordinate, datasets);
        });
      } else {
        source.getClusterExpansionZoom(clusterId, (err, zoom) => {
          if (err) return;

          // if expansionZoom level hasn't reach the spiderify-zoomLevel, keep zoom into
          // else go to the spiderify-zoomLevel
          const currentZoom = map?.getZoom();
          map?.easeTo({
            center: (feature.geometry as any).coordinates,
            zoom:
              zoom >= spiderifyFromZoomLevel
                ? spiderifyFromZoomLevel
                : zoom === currentZoom
                  ? zoom + 1
                  : zoom,
            duration: 500,
          });
        });
      }
    },
    [
      map,
      clusterLayer,
      clusterSourceId,
      shouldCreateSpiderDiagram,
      spiderify,
      spiderifyFromZoomLevel,
    ]
  );

  useEffect(() => {
    const container = document.createElement("div");
    const root = createRoot(container);

    map?.on("click", clusterLayer, onClusterClick);
    map?.on("click", onEmptySpaceClick);
    map?.on("zoomend", checkZoomAndUnspiderify);

    return () => {
      // Important to free up resources, and must timeout to avoid race condition
      setTimeout(() => root.unmount(), 500);

      map?.off("click", clusterLayer, onClusterClick);
      map?.off("click", onEmptySpaceClick);
      map?.off("zoomend", checkZoomAndUnspiderify);
    };
  }, [
    checkZoomAndUnspiderify,
    clusterLayer,
    map,
    onClusterClick,
    onEmptySpaceClick,
  ]);

  return (
    <>
      {currentSpiderifiedCluster && (
        <MapPopup
          layerId={getSpiderPinsLayerId(currentSpiderifiedCluster)}
          onDatasetSelected={onDatasetSelected}
        />
      )}
      {currentSpiderifiedCluster && (
        <SpatialExtents
          layerId={getSpiderPinsLayerId(currentSpiderifiedCluster)}
          addedLayerIds={[
            clusterLayer,
            unclusterPointLayer,
            getSpiderPinsLayerId(currentSpiderifiedCluster),
          ]}
          onDatasetSelected={onDatasetSelected}
        />
      )}
    </>
  );
};

export default SpiderDiagram;
