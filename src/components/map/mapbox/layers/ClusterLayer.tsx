import {
  FC,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import MapContext from "../MapContext";
import { GeoJSONSource, MapLayerMouseEvent, MapMouseEvent } from "mapbox-gl";
import MapPopup from "../component/MapPopup";
import {
  LayersProps,
  createCentroidDataSource,
  defaultMouseEnterEventHandler,
  defaultMouseLeaveEventHandler,
} from "./Layers";
import { mergeWithDefaults } from "../../../common/utils";
import SpatialExtents from "../component/SpatialExtents";
import { Feature, FeatureCollection, LineString, Point } from "geojson";

interface ClusterSize {
  default?: number | string;
  medium: number | string;
  large: number | string;
  extra_large: number | string;
}

interface ClusterLayerConfig {
  pointCountThresholds: ClusterSize;
  clusterMaxZoom: number;
  clusterRadius: number;
  clusterCircleSize: ClusterSize;
  clusterCircleColor: ClusterSize;
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

interface ClusterLayerProps extends LayersProps {
  // Some method inherit from LayersProps
  clusterLayerConfig?: Partial<ClusterLayerConfig>;
}

const defaultClusterLayerConfig: ClusterLayerConfig = {
  // point count thresholds define the boundaries between different cluster sizes.
  pointCountThresholds: {
    medium: 20,
    large: 30,
    extra_large: 50,
  },
  clusterMaxZoom: 14,
  clusterRadius: 50,
  // circle sizes define the radius(px) of the circles used to represent clusters on the map.
  clusterCircleSize: {
    default: 20,
    medium: 30,
    large: 40,
    extra_large: 60,
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
  unclusterPointColor: "green",
  unclusterPointOpacity: 0.6,
  unclusterPointStrokeWidth: 1,
  unclusterPointStrokeColor: "#fff",
  unclusterPointRadius: 8,
};

const spiderifyFromZoomLevel = 14;

// const spiderPinsConfig = {
//   position: "absolute",
//   width: "16px",
//   height: "16px",
//   marginLeft: "-8px",
//   marginTop: "-8px",
//   backgroundColor: "green",
//   border: "1px solid #fff",
//   borderRadius: "50%",
//   zIndex: "2",
//   transform: "translate(0, -75%)",
// };

// These function help to get the correct id and reduce the need to set those id in the
// useEffect list
export const getLayerId = (id: string | undefined) => `cluster-layer-${id}`;

export const getClusterSourceId = (layerId: string) => `${layerId}-source`;

export const getClusterLayerId = (layerId: string) => `${layerId}-clusters`;

export const getUnclusterPointId = (layerId: string) =>
  `${layerId}-unclustered-point`;

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

const ClusterLayer: FC<ClusterLayerProps> = ({
  collections,
  onDatasetSelected,
  clusterLayerConfig,
}: ClusterLayerProps) => {
  const { map } = useContext(MapContext);

  const [currentSpiderifiedCluster, setCurrentSpiderifiedCluster] = useState<
    string | null
  >(null);
  console.log("currentSpiderifiedCluster", currentSpiderifiedCluster);

  const layerId = useMemo(() => getLayerId(map?.getContainer().id), [map]);

  const clusterSourceId = useMemo(() => getClusterSourceId(layerId), [layerId]);

  const clusterLayer = useMemo(() => getClusterLayerId(layerId), [layerId]);

  const unclusterPointLayer = useMemo(
    () => getUnclusterPointId(layerId),
    [layerId]
  );

  const updateSource = useCallback(() => {
    if (map?.getSource(clusterSourceId)) {
      (map?.getSource(clusterSourceId) as GeoJSONSource).setData(
        createCentroidDataSource(collections)
      );
    }
  }, [map, clusterSourceId, collections]);

  // util function to check if a cluster can spiderify or not
  const shouldCreateSpiderDiagram = useCallback(
    (features: any[]): boolean => {
      const zoom = map?.getZoom() || 0;
      const clusterCount = features[0].properties.point_count;
      console.log("current zoom", zoom);
      console.log("cluster count", clusterCount);
      // TODO: maybe can delete the clusterCount related condition since (!clusterCount && features.length > 1) won't happen
      return (
        (!clusterCount && features.length > 1) || zoom >= spiderifyFromZoomLevel
      );
    },
    [map]
  );

  const unspiderify = useCallback(
    (clusterCircleId: string) => {
      console.log("Un-spiderifying cluster:", clusterCircleId);
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

      setCurrentSpiderifiedCluster(null);
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

      console.log(
        "Attempting to spiderify cluster:clusterId==",
        clusterCircleId
      );
      console.log(
        "Attempting to spiderify cluster:currentSpiderifiedCluster==",
        currentSpiderifiedCluster
      );

      // Clear existing spider diagram if there is one
      if (currentSpiderifiedCluster) {
        unspiderify(currentSpiderifiedCluster);
      }

      // If clicking on the same cluster, just clear it and return
      if (currentSpiderifiedCluster === clusterCircleId) {
        // setCurrentSpiderifiedCluster(null);
        return;
      }

      const circleRadius = 20; // Adjust this value to change the size of the spider diagram
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

      // TODO: check if source/layer already exists
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
    console.log("called when zoom end");

    if (map) {
      const currentZoom = map.getZoom();
      console.log("when zoom end, check current zoom", currentZoom);

      setCurrentSpiderifiedCluster((currentCluster) => {
        console.log(
          "when zoom end, check currentSpiderifiedCluster=",
          currentCluster,
          map
        );

        if (currentCluster && currentZoom < spiderifyFromZoomLevel) {
          console.log("Zoom level below spiderify threshold, unspiderfying");
          unspiderify(currentCluster);
          return null;
        }

        return currentCluster;
      });
    }
  }, [map, unspiderify]);

  const onClusterCircleMouseClick = useCallback(
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

      console.log(
        "shouldCreateSpiderDiagram(features)",
        shouldCreateSpiderDiagram(features)
      );
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
          console.log("getClusterExpansionZoom==", zoom);
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
    [map, clusterLayer, clusterSourceId, shouldCreateSpiderDiagram, spiderify]
  );

  // for clear spider diagram when click on empty space
  const onEmptySpaceClick = useCallback(
    (ev: MapMouseEvent) => {
      const point = ev.point;

      setCurrentSpiderifiedCluster((currentCluster) => {
        console.log(
          "call onEmptySpaceClick, and check currentSpiderifiedCluster ",
          currentCluster
        );

        if (currentCluster) {
          const spiderPinsLayerId = getSpiderPinsLayerId(currentCluster);
          console.log(
            "on map clicked, find spiderPinsLayerId=",
            spiderPinsLayerId
          );

          if (!map?.getLayer(spiderPinsLayerId)) return null;
          const features = map?.queryRenderedFeatures(point, {
            layers: [spiderPinsLayerId],
          });

          if (!features || features.length === 0) {
            console.log("Clicked outside spider pins, clearing spider diagram");
            console.log(
              "unspiderify currentSpiderifiedCluster==",
              currentCluster
            );
            unspiderify(currentCluster);
            return null;
          } else {
            console.log("Clicked on a spider pin, keeping spider diagram");
            return currentCluster;
          }
        }

        return currentCluster; // This line ensures we always return string | null
      });
    },
    [map, unspiderify]
  );

  // This is use to render the cluster circle and add event handle to circles
  useEffect(() => {
    if (map === null) return;

    // This situation is map object created, hence not null, but not completely loaded
    // and therefore you will have problem setting source and layer. Set-up a listener
    // to update the state and then this effect can be call again when map loaded.
    const createLayers = () => {
      // Function may call multiple times due to useEffect, it is not possible to avoid
      // these changes so use this check to avoid duplicate add
      if (map?.getSource(clusterSourceId)) return;

      const config = mergeWithDefaults(
        defaultClusterLayerConfig,
        clusterLayerConfig
      );

      map?.addSource(clusterSourceId, {
        type: "geojson",
        data: createCentroidDataSource(undefined),
        cluster: true,
        clusterMaxZoom: 14,
        clusterRadius: 50,
      });

      // Add layers for multiple items, that is cluster
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
            ["get", "point_count"],
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
            ["get", "point_count"],
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
          "text-field": "{point_count_abbreviated}",
          "text-font": ["DIN Offc Pro Medium", "Arial Unicode MS Bold"],
          "text-size": config.clusterCircleTextSize,
        },
      });
      // Layer for only 1 item in the circle
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

      // Change the cursor to a pointer for uncluster point
      map?.on("mouseenter", clusterLayer, defaultMouseEnterEventHandler);

      // Change the cursor back to default when it leaves the unclustered points
      map?.on("mouseleave", clusterLayer, defaultMouseLeaveEventHandler);

      map?.on("click", clusterLayer, onClusterCircleMouseClick);
      map?.on("click", onEmptySpaceClick);
      map?.on("zoomend", checkZoomAndUnspiderify);
    };

    map?.once("load", createLayers);

    // When user change the map style, for example change base map, all layer will be removed
    // as per mapbox design, we need to listen to that even and add back the layer
    map?.on("styledata", createLayers);

    return () => {
      map?.off("mouseenter", clusterLayer, defaultMouseEnterEventHandler);
      map?.off("mouseleave", clusterLayer, defaultMouseLeaveEventHandler);
      map?.off("click", clusterLayer, onClusterCircleMouseClick);
      map?.off("click", onEmptySpaceClick);
      map?.off("zoomend", checkZoomAndUnspiderify);

      // Clean up resource when you click on the next spatial extents, map is
      // still working in this page.
      try {
        // Remove layers first
        if (map?.getLayer(clusterLayer)) map?.removeLayer(clusterLayer);

        if (map?.getLayer(`${layerId}-cluster-count`))
          map?.removeLayer(`${layerId}-cluster-count`);

        if (map?.getLayer(unclusterPointLayer))
          map?.removeLayer(unclusterPointLayer);

        if (map?.getLayer(`${layerId}-unclustered-count`))
          map?.removeLayer(`${layerId}-unclustered-count`);

        // Then remove the source
        if (map?.getSource(clusterSourceId)) map?.removeSource(clusterSourceId);
      } catch (error) {
        // If source not found and throw exception then layer will not exist
        // TODO: handle error in ErrorBoundary
      }
    };
    // Make sure map is the only dependency so that it will not trigger twice run
    // where you will add source and remove layer accidentally.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [map]);

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
        layerId={unclusterPointLayer}
        onDatasetSelected={onDatasetSelected}
      />
      <SpatialExtents
        layerId={unclusterPointLayer}
        addedLayerIds={[clusterLayer, unclusterPointLayer]}
        onDatasetSelected={onDatasetSelected}
      />

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

export default ClusterLayer;
