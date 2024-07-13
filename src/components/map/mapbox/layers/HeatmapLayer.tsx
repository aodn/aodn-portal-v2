import React, { FC, useCallback, useContext, useEffect, useMemo } from "react";
import MapContext from "../MapContext";

import {
  Expression,
  GeoJSONSource,
  MapLayerMouseEvent,
  Popup,
  StyleFunction,
} from "mapbox-gl";
import { useDispatch } from "react-redux";
import { AppDispatch } from "../../../common/store/store";
import {
  LayersProps,
  createCentroidDataSource,
  defaultMouseEnterEventHandler,
  defaultMouseLeaveEventHandler,
} from "./Layers";
import { mergeWithDefaults } from "../../../common/utils";
import MapPopup from "../popup/MapPopup";
import {
  OGCCollection,
  SearchParameters,
  fetchResultNoStore,
} from "../../../common/store/searchReducer";
import { createRoot } from "react-dom/client";
import { Feature, Point } from "geojson";

interface HeatmapLayer {
  maxZoom: number;
  weight: StyleFunction | Expression;
  color: StyleFunction | Expression;
  radius: number | StyleFunction | Expression;
}

interface HeatmapCircle {
  radius: StyleFunction | Expression;
  color: StyleFunction | Expression;
  strokeColor: string;
  strokeWidth: number;
}

interface HeatmapConfig {
  heatmapSourceRadius: number;
  layer: HeatmapLayer;
  circle: HeatmapCircle;
}

interface HeatmapLayerProps extends LayersProps {
  onClickPopup?: (uuid: string) => void;
  heatmapLayerConfig?: Partial<HeatmapConfig>;
}

const defaultHeatmapConfig: HeatmapConfig = {
  heatmapSourceRadius: 10,
  circle: {
    strokeColor: "white",
    strokeWidth: 1,
    radius: 8,
    color: "#51bbd6",
  },
  layer: {
    maxZoom: 7,
    weight: 1,
    color: [
      "interpolate",
      ["linear"],
      ["heatmap-density"],
      0,
      "rgba(236,222,239,0)",
      0.2,
      "rgb(208,209,230)",
      0.4,
      "rgb(166,189,219)",
      0.6,
      "rgb(103,169,207)",
      0.8,
      "rgb(28,144,153)",
    ],
    radius: {
      stops: [
        [11, 15],
        [15, 20],
      ],
    },
  },
};

// These function help to get the correct id and reduce the need to set those id in the
// useEffect list
const getLayerId = (id: string | undefined) => `heatmap-layer-${id}`;
const getHeatmapSourceId = (layerId: string) => `${layerId}-source`;
const getHeatmapLayerId = (layerId: string) => `${layerId}-heatmap`;
const getCircleLayerId = (layerId: string) => `${layerId}-circle`;

const HeatmapLayer: FC<HeatmapLayerProps> = ({
  collections,
  onDatasetSelected,
  onClickPopup,
  heatmapLayerConfig,
}: HeatmapLayerProps) => {
  const { map } = useContext(MapContext);
  const dispatch = useDispatch<AppDispatch>();

  // TODO: Duplicate code but due to use of dispatch cannot import it.
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
  const sourceId = useMemo(() => getHeatmapSourceId(layerId), [layerId]);

  const onPointMouseEnter = useCallback(
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

  const onPointMouseLeave = useCallback(
    (ev: MapLayerMouseEvent) => {
      ev.target.getCanvas().style.cursor = "";
      popup.remove();
    },
    [popup]
  );

  // This is use to render the heatmap and add event handle to circles
  useEffect(() => {
    if (map === null) return;

    const heatmapLayer = getHeatmapLayerId(layerId);
    const circleLayer = getCircleLayerId(layerId);

    // This situation is map object created, hence not null, but not completely loaded
    // and therefore you will have problem setting source and layer. Set-up a listener
    // to update the state and then this effect can be call again when map loaded.
    const createLayers = () => {
      if (map?.getSource(sourceId)) return;

      const config = mergeWithDefaults(
        defaultHeatmapConfig,
        heatmapLayerConfig
      );

      map?.addSource(sourceId, {
        type: "geojson",
        data: createCentroidDataSource(undefined),
        cluster: false,
        clusterMaxZoom: config.layer.maxZoom - 1,
        clusterRadius: config.heatmapSourceRadius,
      });

      map?.addLayer({
        id: heatmapLayer,
        type: "heatmap",
        source: sourceId,
        maxzoom: config.layer.maxZoom,
        paint: {
          // increase weight as diameter breast height increases
          "heatmap-weight": config.layer.weight,
          // increase intensity as zoom level increases
          "heatmap-intensity": {
            stops: [
              [config.layer.maxZoom - 4, 1],
              [config.layer.maxZoom, 3],
            ],
          },
          // assign color values be applied to points depending on their density
          "heatmap-color": config.layer.color,
          // increase radius as zoom increases
          "heatmap-radius": config.layer.radius,
          // decrease opacity to transition into the circle layer
          "heatmap-opacity": {
            default: 1,
            stops: [
              [config.layer.maxZoom - 1, 1],
              [config.layer.maxZoom, 0],
            ],
          },
        },
      });

      map?.addLayer({
        id: circleLayer,
        type: "circle",
        minzoom: config.layer.maxZoom - 1,
        source: sourceId,
        paint: {
          // increase the radius of the circle as the zoom level and dbh value increases
          "circle-radius": config.circle.radius,
          "circle-color": config.circle.color,
          "circle-stroke-color": config.circle.strokeColor,
          "circle-stroke-width": config.circle.strokeWidth,
          "circle-opacity": {
            stops: [
              // You want to make the heatmap totally transparent
              // aka looks disapear when the zoom level is hit max
              // zoom. Reappear if greater than max zoom
              [config.layer.maxZoom - 1, 0],
              [config.layer.maxZoom, 1],
            ],
          },
        },
      });

      map?.on("mouseenter", circleLayer, onPointMouseEnter);
      map?.on("mouseleave", circleLayer, onPointMouseLeave);
    };

    map?.once("load", createLayers);

    // When user change the map style, for example change base map, all layer will be removed
    // as per mapbox design, we need to listen to that even and add back the layer
    map?.on("styledata", createLayers);

    return () => {
      map?.off("mouseenter", circleLayer, onPointMouseEnter);
      map?.off("mouseleave", circleLayer, onPointMouseLeave);

      try {
        if (map?.getLayer(heatmapLayer)) map?.removeLayer(heatmapLayer);
        if (map?.getLayer(circleLayer)) map?.removeLayer(circleLayer);
        if (map?.getSource(sourceId)) map?.removeSource(sourceId);
      } catch (e) {
        // OK to ignore if no layer then no source as well
      }
    };
  }, [
    map,
    layerId,
    sourceId,
    heatmapLayerConfig,
    onPointMouseEnter,
    onPointMouseLeave,
  ]);

  const updateSource = useCallback(() => {
    if (map?.getSource(sourceId)) {
      (map?.getSource(sourceId) as GeoJSONSource).setData(
        createCentroidDataSource(collections)
      );
    }
  }, [map, sourceId, collections]);

  useEffect(() => {
    updateSource();
    map?.on("styledata", updateSource);
    return () => {
      map?.off("styledata", updateSource);
    };
  }, [map, updateSource]);

  return <React.Fragment />;
};

export default HeatmapLayer;
