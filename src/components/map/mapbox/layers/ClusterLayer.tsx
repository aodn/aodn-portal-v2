import {
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
  Point,
} from "geojson";
import {
  OGCCollection,
  OGCCollections,
  SearchParameters,
  fetchResultNoStore,
} from "../../../common/store/searchReducer";
import { centroid } from "@turf/turf";
import { GeoJSONSource, MapLayerMouseEvent, Popup } from "mapbox-gl";
import { useDispatch } from "react-redux";
import { AppDispatch } from "../../../common/store/store";
import { createRoot } from "react-dom/client";
import MapPopup from "../popup/MapPopup";
import { CircularProgress } from "@mui/material";

interface ClusterLayerProps {
  // Vector tile layer should added to map
  collections: Array<OGCCollection>;
  // Event fired when user click on the point layer
  onDatasetSelected?: (uuid: Array<string>) => void;
  onClickPopup?: (uuid: string) => void;
}

const OPACITY = 0.6;
const STROKE_WIDTH = 1;

// Constants for cluster circle sizes
//These define the radius(px) of the circles used to represent clusters on the map.
const DEFAULT_CIRCLE_SIZE = 20;
const MEDIUM_CIRCLE_SIZE = 30;
const LARGE_CIRCLE_SIZE = 40;
const EXTRA_LARGE_CIRCLE_SIZE = 60;

// Constants for cluster circle colors
// These define the colors used for the circles representing clusters of different sizes.
const DEFAULT_COLOR = "#51bbd6";
const MEDIUM_COLOR = "#f1f075";
const LARGE_COLOR = "#f28cb1";
const EXTRA_LARGE_COLOR = "#fe8cf1";

// Constants for point count thresholds
// These define the boundaries between different cluster sizes.
const MEDIUM_POINT_COUNT = 20;
const LARGE_POINT_COUNT = 30;
const EXTRA_LARGE_POINT_COUNT = 50;

// Given an array of OGCCollections, we convert it to a cluster layer by adding all the feature items
// in a collection to the FeatureCollection
const createClusterDataSource = (
  collections: Array<OGCCollection> | undefined
): FeatureCollection => {
  const featureCollections: FeatureCollection = {
    type: "FeatureCollection",
    features: new Array<Feature<Geometry, GeoJsonProperties>>(),
  };

  collections?.forEach((collection) => {
    // We skip the first one which is the overall bounding box, then add the remaining
    collection.extent?.getGeojsonExtents(1).features.forEach((i) =>
      featureCollections.features.push({
        ...centroid(i.geometry),
        // Add the id so we can reference it easily
        properties: { uuid: collection.id },
      })
    );
  });

  return featureCollections;
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

      try {
        const collections: OGCCollections = await dispatch(
          fetchResultNoStore(param)
        ).unwrap();
        // Given we use uuid, there will be one record only
        const collection = collections.collections[0];
        return collection;
      } catch (error) {
        // Handle any errors here
        console.error("Error fetching collection data:", error);
        throw error;
      }
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
        createClusterDataSource(collections)
      );
    }
  }, [map, clusterSourceId, collections]);

  const unclusterPointLayerMouseEnterEventHandler = useCallback(
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

  const unclusterPointLayerMouseLeaveEventHandler = useCallback(
    (ev: MapLayerMouseEvent) => {
      ev.target.getCanvas().style.cursor = "";
      popup.remove();
    },
    [popup]
  );

  const clusterLayerMouseEnterEventHandler = useCallback(
    (ev: MapLayerMouseEvent) => {
      ev.target.getCanvas().style.cursor = "pointer";
    },
    []
  );

  const clusterLayerMouseLeaveEventHandler = useCallback(
    (ev: MapLayerMouseEvent) => {
      ev.target.getCanvas().style.cursor = "";
    },
    []
  );

  const unclusterPointLayerMouseClickEventHandler = useCallback(
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

  const clusterLayerMouseClickEventHandler = useCallback(
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
          data: collection.getGeometry(),
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
        }
      });

      sourceIds.forEach((id) => {
        try {
          if (map?.getSource(id)) map?.removeSource(id);
        } catch (error) {
          // Ok to ignore as map gone if we hit this error
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

      map?.addSource(clusterSourceId, {
        type: "geojson",
        data: createClusterDataSource(undefined),
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
          "circle-stroke-width": STROKE_WIDTH,
          "circle-stroke-color": "#fff",
          "circle-opacity": OPACITY,
          "circle-color": [
            "step",
            ["get", "point_count"],
            DEFAULT_COLOR,
            MEDIUM_POINT_COUNT,
            MEDIUM_COLOR,
            LARGE_POINT_COUNT,
            LARGE_COLOR,
            EXTRA_LARGE_POINT_COUNT,
            EXTRA_LARGE_COLOR,
          ],
          "circle-radius": [
            "step",
            ["get", "point_count"],
            DEFAULT_CIRCLE_SIZE,
            MEDIUM_POINT_COUNT,
            MEDIUM_CIRCLE_SIZE,
            LARGE_POINT_COUNT,
            LARGE_CIRCLE_SIZE,
            EXTRA_LARGE_POINT_COUNT,
            EXTRA_LARGE_CIRCLE_SIZE,
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
          "text-size": 12,
        },
      });
      // Layer for only 1 item in the circle
      map?.addLayer({
        id: unclusterPointLayer,
        type: "circle",
        source: clusterSourceId,
        filter: ["!", ["has", "point_count"]],
        paint: {
          "circle-opacity": OPACITY,
          "circle-color": "#11b4da",
          "circle-radius": 8,
          "circle-stroke-width": STROKE_WIDTH,
          "circle-stroke-color": "#fff",
        },
      });

      // Change the cursor to a pointer for uncluster point
      map?.on(
        "mouseenter",
        unclusterPointLayer,
        unclusterPointLayerMouseEnterEventHandler
      );
      map?.on("mouseenter", clusterLayer, clusterLayerMouseEnterEventHandler);

      // Change the cursor back to default when it leaves the unclustered points
      map?.on(
        "mouseleave",
        unclusterPointLayer,
        unclusterPointLayerMouseLeaveEventHandler
      );
      map?.on("mouseleave", clusterLayer, clusterLayerMouseLeaveEventHandler);

      map?.on("click", clusterLayer, clusterLayerMouseClickEventHandler);

      map?.on(
        "click",
        unclusterPointLayer,
        unclusterPointLayerMouseClickEventHandler
      );
    };

    map?.once("load", createLayers);

    // When user change the map style, for example change base map, all layer will be removed
    // as per mapbox design, we need to listen to that even and add back the layer
    map?.on("styledata", createLayers);

    return () => {
      map?.off(
        "mouseenter",
        unclusterPointLayer,
        unclusterPointLayerMouseEnterEventHandler
      );
      map?.off("mouseenter", clusterLayer, clusterLayerMouseEnterEventHandler);
      map?.off(
        "mouseleave",
        unclusterPointLayer,
        unclusterPointLayerMouseLeaveEventHandler
      );
      map?.off("mouseleave", clusterLayer, clusterLayerMouseLeaveEventHandler);

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
