import { FC, useCallback, useContext, useEffect, useMemo } from "react";
import MapboxglSpiderifier, {
  popupOffsetForSpiderLeg,
  SpiderLeg,
} from "mapboxgl-spiderifier";
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
import { Feature, Point } from "geojson";

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

const spiderPinsConfig = {
  position: "absolute",
  width: "16px",
  height: "16px",
  marginLeft: "-8px",
  marginTop: "-8px",
  backgroundColor: "green",
  border: "1px solid #fff",
  borderRadius: "50%",
  zIndex: "2",
  transform: "translate(0, -75%)",
};

// These function help to get the correct id and reduce the need to set those id in the
// useEffect list
export const getLayerId = (id: string | undefined) => `cluster-layer-${id}`;

export const getClusterSourceId = (layerId: string) => `${layerId}-source`;

export const getClusterLayerId = (layerId: string) => `${layerId}-clusters`;

export const getUnclusterPointId = (layerId: string) =>
  `${layerId}-unclustered-point`;

const ClusterLayer: FC<ClusterLayerProps> = ({
  collections,
  onDatasetSelected,
  clusterLayerConfig,
}: ClusterLayerProps) => {
  const { map } = useContext(MapContext);

  const layerId = useMemo(() => getLayerId(map?.getContainer().id), [map]);

  const clusterSourceId = useMemo(() => getClusterSourceId(layerId), [layerId]);

  const clusterLayer = useMemo(() => getClusterLayerId(layerId), [layerId]);

  const unclusterPointLayer = useMemo(
    () => getUnclusterPointId(layerId),
    [layerId]
  );

  const initializeSpiderLeg = useCallback((spiderLeg: SpiderLeg) => {
    const pinElem = spiderLeg.elements.pin;
    const feature = spiderLeg.feature;

    // Apply CSS styles directly to the pin element
    if (pinElem) {
      Object.assign(pinElem.style, spiderPinsConfig);

      // Add hover effect
      pinElem.addEventListener("mouseenter", () => {
        pinElem.style.backgroundColor = "yellow";
      });
      pinElem.addEventListener("mouseleave", () => {
        pinElem.style.backgroundColor = "green";
      });
    }
  }, []);

  const spiderifier = useMemo(() => {
    if (map) {
      return new MapboxglSpiderifier(map, {
        animate: false,
        animationSpeed: 0,
        customPin: false,
        onClick: function (e, spiderLeg) {
          console.log("click on spiderLeg", spiderLeg);
        },
        initializeLeg: initializeSpiderLeg,
      });
    }
    return null;
  }, [initializeSpiderLeg, map]);

  const shouldCreateSpiderDiagram = useCallback(
    (features: any[]): boolean => {
      const zoom = map?.getZoom() || 0;
      const clusterCount = features[0].properties.point_count;
      console.log("current zoom", zoom);
      console.log("cluster count", clusterCount);
      return (!clusterCount && features.length > 1) || zoom > 7;
    },
    [map]
  );

  const updateSource = useCallback(() => {
    if (map?.getSource(clusterSourceId)) {
      (map?.getSource(clusterSourceId) as GeoJSONSource).setData(
        createCentroidDataSource(collections)
      );
    }
  }, [map, clusterSourceId, collections]);

  const onClusterCircleMouseClick = useCallback(
    (ev: MapMouseEvent): void => {
      const features = map?.queryRenderedFeatures(ev.point, {
        layers: [clusterLayer],
      });

      if (!features || features.length === 0) return;

      const feature = features[0] as Feature<Point>;
      const clusterId = feature.properties?.cluster_id;
      console.log("clusterId===", clusterId);
      const coordinate = [
        feature.geometry.coordinates[0],
        feature.geometry.coordinates[1],
      ] as [number, number];
      const source = map?.getSource(clusterSourceId) as GeoJSONSource;
      console.log(
        "shouldCreateSpiderDiagram(features)",
        shouldCreateSpiderDiagram(features)
      );
      if (shouldCreateSpiderDiagram(features)) {
        source.getClusterLeaves(clusterId, 100, 0, (err, leaves) => {
          if (err) {
            console.error("Error getting cluster leaves:", err);
            return;
          }
          const datasets = leaves as Feature<Point>[];
          const spiderLegs = datasets.map((dataset) => ({
            ...dataset.geometry.coordinates,
            properties: dataset.properties,
          }));

          spiderifier?.spiderfy(coordinate, spiderLegs);
        });
      } else {
        const maxZoomLevel = 4;
        source.getClusterExpansionZoom(clusterId, (err, zoom) => {
          if (err) return;

          map?.easeTo({
            center: (feature.geometry as any).coordinates,
            zoom: zoom <= maxZoomLevel ? maxZoomLevel : zoom,
            duration: 500,
          });
        });
      }
    },
    [map, clusterLayer, clusterSourceId, shouldCreateSpiderDiagram, spiderifier]
  );

  const onEmptySpaceClick = useCallback(
    (ev: MapLayerMouseEvent) => {
      const point = map?.project(ev.lngLat);

      // Query for features at the clicked point, but only in the cluster and unclustered point layers
      const features = point
        ? map?.queryRenderedFeatures(point, {
            layers: [clusterLayer, unclusterPointLayer],
          })
        : [];

      // If no features are found at the click point (i.e., clicked on empty space)
      if (spiderifier && features && features.length === 0) {
        spiderifier.unspiderfy();
      }
    },
    [map, clusterLayer, unclusterPointLayer, spiderifier]
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
      <SpatialExtents
        layerId={unclusterPointLayer} //TODO: spiderPinsLayers
        addedLayerIds={[clusterLayer, unclusterPointLayer]}
        onDatasetSelected={onDatasetSelected}
      />
    </>
  );
};

export default ClusterLayer;
