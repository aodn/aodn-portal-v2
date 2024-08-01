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
}

interface SpiderDiagramProps extends LayersProps {
  spiderDiagramConfig?: Partial<SpiderDiagramConfig>;
  clusterLayer: string;
  clusterSourceId: string;
  unclusterPointLayer: string;
}

const defaultSpiderDiagramConfig: SpiderDiagramConfig = {
  spiderifyFromZoomLevel: 8,
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

      //TODO: need to adjust according to zoom level and data.length
      const circleRadius = 20;
      const angleStep = (2 * Math.PI) / datasets.length;

      const spiderPinsFeatures: Feature<Point>[] = [];
      const spiderLinesFeatures: Feature<LineString>[] = [];

      datasets.forEach((dataset, index) => {
        const spiderPinId = getSpiderPinId(clusterCircleId, index);
        const spiderLineId = getSpiderLineId(spiderPinId);
        const angle = index * angleStep;
        const x = Math.cos(angle) * circleRadius;
        const y = Math.sin(angle) * circleRadius;

        const spiderLegCoordinate: [number, number] = [
          coordinate[0] + x / 5000,
          coordinate[1] + y / 5000,
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
        id: spiderPinsLayerId,
        type: "circle",
        source: spiderPinsSourceId,
        paint: {
          "circle-radius": 8,
          "circle-color": "green",
          "circle-opacity": 0.6,
          "circle-stroke-width": 1,
          "circle-stroke-color": "#fff",
        },
      });

      map?.addLayer({
        id: spiderLinesLayerId,
        type: "line",
        source: spiderLinesSourceId,
        paint: {
          "line-color": "#888",
          "line-width": 1,
        },
      });

      setCurrentSpiderifiedCluster(clusterCircleId);
    },
    [map, currentSpiderifiedCluster, unspiderify]
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
