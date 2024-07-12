import {
  FC,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import MapContext from "../MapContext";
import { Feature, Point } from "geojson";
import {
  OGCCollection,
  SearchParameters,
  fetchResultNoStore,
} from "../../../common/store/searchReducer";
import { GeoJSONSource, MapLayerMouseEvent, Popup } from "mapbox-gl";
import { useDispatch } from "react-redux";
import { AppDispatch } from "../../../common/store/store";
import { createRoot } from "react-dom/client";
import MapPopup from "../popup/MapPopup";
import {
  LayersProps,
  createCentroidDataSource,
  defaultMouseEnterEventHandler,
  defaultMouseLeaveEventHandler,
} from "./Layers";
import { mergeWithDefaults } from "../../../common/utils";

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
  onClickPopup?: (uuid: string) => void;
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
  unclusterPointColor: "#51bbd6",
  unclusterPointOpacity: 0.6,
  unclusterPointStrokeWidth: 1,
  unclusterPointStrokeColor: "#fff",
  unclusterPointRadius: 8,
};

// These function help to get the correct id and reduce the need to set those id in the
// useEffect list
const getLayerId = (id: string | undefined) => `cluster-layer-${id}`;

const getClusterSourceId = (layerId: string) => `${layerId}-source`;

const getClusterLayerId = (layerId: string) => `${layerId}-clusters`;

const getUnclusterPointId = (layerId: string) => `${layerId}-unclustered-point`;

const createPointsLayerId = (id: string) => `${id}-points`;

const createLinesLayerId = (id: string) => `${id}-lines`;

const createPolygonLayerId = (id: string) => `${id}-polygons`;

const createSourceId = (layerId: string, uuid: string) =>
  `${layerId}-${uuid}-source`;

const ClusterLayer: FC<ClusterLayerProps> = ({
  collections,
  onDatasetSelected,
  onClickPopup,
  clusterLayerConfig,
}: ClusterLayerProps) => {
  const { map } = useContext(MapContext);
  const dispatch = useDispatch<AppDispatch>();
  const [spatialExtentsUUid, setSpatialExtentsUUid] = useState<Array<string>>();

  // util function to get collection data given uuid
  // and based on boolean indicating whether to fetch only geometry-related properties
  const getCollectionData = useCallback(
    async ({ uuid, geometryOnly }: { uuid: string; geometryOnly: boolean }) => {
      const param: SearchParameters = {
        filter: `id='${uuid}'`,
        properties: geometryOnly ? "id,geometry" : undefined,
      };

      return dispatch(fetchResultNoStore(param))
        .unwrap()
        .then((value) => value.collections[0])
        .catch((error) => {
          console.error("Error fetching collection data:", error);
          // TODO: handle error in ErrorBoundary
        });
    },
    [dispatch]
  );

  const popup = useMemo(
    () =>
      new Popup({
        closeButton: false,
        closeOnClick: false,
        maxWidth: "none",
      }),
    []
  );

  const renderPopupContent = useCallback(
    async (uuid: string) => {
      const collection = await getCollectionData({
        uuid,
        geometryOnly: false,
      });
      if (!collection) return;
      return <MapPopup collection={collection} onClickPopup={onClickPopup} />;
    },
    [getCollectionData, onClickPopup]
  );

  const renderLoadingPopup = useCallback(
    () => <MapPopup collection={{} as OGCCollection} isLoading />,
    []
  );

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

  const onUnclusterPointMouseEnter = useCallback(
    async (ev: MapLayerMouseEvent): Promise<void> => {
      if (!ev.target || !map) return;

      ev.target.getCanvas().style.cursor = "pointer";

      // Copy coordinates array.
      if (ev.features && ev.features.length > 0) {
        const feature = ev.features[0] as Feature<Point>;
        const geometry = feature.geometry;
        const coordinates = geometry.coordinates.slice();
        const uuid = feature.properties?.uuid as string;

        // Create a new div container for the popup
        const popupNode = document.createElement("div");
        const root = createRoot(popupNode);

        // Render a loading state in the popup
        root.render(renderLoadingPopup());

        // Set the popup's position and content, then add it to the map
        popup
          .setLngLat(coordinates as [number, number])
          .setDOMContent(popupNode)
          .addTo(map);

        // Fetch and render the actual content for the popup
        const content = await renderPopupContent(uuid);
        root.render(content);
      }
    },
    [map, popup, renderLoadingPopup, renderPopupContent]
  );

  const onUnclusterPointMouseLeave = useCallback(
    (ev: MapLayerMouseEvent) => {
      ev.target.getCanvas().style.cursor = "";
      popup.remove();
    },
    [popup]
  );

  const onUnclusterPointMouseClick = useCallback(
    (ev: MapLayerMouseEvent): void => {
      // Make sure even same id under same area will be set once.
      if (ev.features) {
        const uuids = [
          ...new Set(ev.features.map((feature) => feature.properties?.uuid)),
        ];
        setSpatialExtentsUUid(uuids);

        // Give time for the state to be updated
        if (onDatasetSelected) setTimeout(() => onDatasetSelected(uuids), 100);
      }
    },
    [setSpatialExtentsUUid, onDatasetSelected]
  );

  const onClusterCircleMouseClick = useCallback(
    (ev: MapLayerMouseEvent): void => {
      if (ev.lngLat) {
        map?.easeTo({
          center: ev.lngLat,
          zoom: map?.getZoom() + 1,
          duration: 500,
        });
      }
    },
    [map]
  );

  const addSpatialExtentsLayer = useCallback(() => {
    const sourceIds = new Array<string>();
    const layerIds = new Array<string>();

    spatialExtentsUUid?.forEach(async (uuid: string) => {
      const sourceId = createSourceId(layerId, uuid);
      sourceIds.push(sourceId);

      const pointLayerId = createPointsLayerId(sourceId);
      layerIds.push(pointLayerId);

      const lineLayerId = createLinesLayerId(sourceId);
      layerIds.push(lineLayerId);

      const polygonLayerId = createPolygonLayerId(sourceId);
      layerIds.push(polygonLayerId);

      const collection = await getCollectionData({
        uuid,
        geometryOnly: true,
      });

      if (!map?.getSource(sourceId)) {
        map?.addSource(sourceId, {
          type: "geojson",
          data: collection?.getGeometry(),
        });
      }

      // util function to check if layer exists or not and add a before layer Id
      const addLayerIfNotExists = (id: string, layer: any) => {
        if (!map?.getLayer(id)) {
          map?.addLayer(layer, clusterLayer);
        }
      };

      // Add layers for each geometry type within the GeometryCollection if not exists
      addLayerIfNotExists(pointLayerId, {
        id: pointLayerId,
        type: "symbol",
        source: sourceId,
        filter: ["==", "$type", "Point"],
        layout: {
          "icon-image": "marker-15",
          "icon-size": 1.5,
          "text-field": ["get", "title"],
          "text-font": ["Open Sans Semibold", "Arial Unicode MS Bold"],
          "text-offset": [0, 1.25],
          "text-anchor": "top",
        },
      });

      addLayerIfNotExists(lineLayerId, {
        id: lineLayerId,
        type: "line",
        source: sourceId,
        filter: ["==", "$type", "LineString"],
        paint: {
          "line-color": "#ff0000",
          "line-width": 2,
        },
      });

      addLayerIfNotExists(polygonLayerId, {
        id: polygonLayerId,
        type: "fill",
        source: sourceId,
        filter: ["==", "$type", "Polygon"],
        paint: {
          "fill-color": "#fff",
          "fill-opacity": 0.4,
        },
      });
    });

    return () => {
      layerIds.forEach((id) => {
        try {
          if (map?.getLayer(id)) map?.removeLayer(id);
        } catch (error) {
          // Ok to ignore as map gone if we hit this error
          console.log("Ok to ignore remove layer error", error);
          // TODO: handle error in ErrorBoundary
        }
      });

      sourceIds.forEach((id) => {
        try {
          if (map?.getSource(id)) map?.removeSource(id);
        } catch (error) {
          // Ok to ignore as map gone if we hit this error
          console.log("Ok to ignore remove source error", error);
          // TODO: handle error in ErrorBoundary
        }
      });
    };
  }, [spatialExtentsUUid, layerId, getCollectionData, map, clusterLayer]);

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
            config.clusterCircleColor?.default,
            config.pointCountThresholds?.medium,
            config.clusterCircleColor?.medium,
            config.pointCountThresholds?.large,
            config.clusterCircleColor?.large,
            config.pointCountThresholds?.extra_large,
            config.clusterCircleColor?.extra_large,
          ],
          "circle-radius": [
            "step",
            ["get", "point_count"],
            config.clusterCircleSize?.default,
            config.pointCountThresholds?.medium,
            config.clusterCircleSize?.medium,
            config.pointCountThresholds?.large,
            config.clusterCircleSize?.large,
            config.pointCountThresholds?.extra_large,
            config.clusterCircleSize?.extra_large,
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
      map?.on("mouseenter", unclusterPointLayer, onUnclusterPointMouseEnter);
      map?.on("mouseenter", clusterLayer, defaultMouseEnterEventHandler);

      // Change the cursor back to default when it leaves the unclustered points
      map?.on("mouseleave", unclusterPointLayer, onUnclusterPointMouseLeave);
      map?.on("mouseleave", clusterLayer, defaultMouseLeaveEventHandler);

      map?.on("click", clusterLayer, onClusterCircleMouseClick);

      map?.on("click", unclusterPointLayer, onUnclusterPointMouseClick);
    };

    map?.once("load", createLayers);

    // When user change the map style, for example change base map, all layer will be removed
    // as per mapbox design, we need to listen to that even and add back the layer
    map?.on("styledata", createLayers);

    return () => {
      map?.off("mouseenter", unclusterPointLayer, onUnclusterPointMouseEnter);
      map?.off("mouseenter", clusterLayer, defaultMouseEnterEventHandler);
      map?.off("mouseleave", unclusterPointLayer, onUnclusterPointMouseLeave);
      map?.off("mouseleave", clusterLayer, defaultMouseLeaveEventHandler);

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

  // Remove all layers and sources created by addSpatialExtentsLayer
  useEffect(() => {
    const cleanup = addSpatialExtentsLayer();
    return () => {
      cleanup();
    };
  }, [addSpatialExtentsLayer, map, layerId, spatialExtentsUUid]);

  return null;
};

export default ClusterLayer;
