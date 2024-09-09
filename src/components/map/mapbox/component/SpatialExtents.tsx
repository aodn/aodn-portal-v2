import React, { FC, useCallback, useContext, useEffect, useState } from "react";
import MapContext from "../MapContext";
import { AppDispatch } from "../../../common/store/store";
import { useDispatch } from "react-redux";
import {
  fetchResultNoStore,
  SearchParameters,
} from "../../../common/store/searchReducer";
import { MapLayerMouseEvent } from "mapbox-gl";
import { OGCCollections } from "../../../common/store/OGCCollectionDefinitions";

interface SpatialExtentsProps {
  layerId: string;
  // Selected uuids is managed in parent component, reflecting dataset that user selected from result list or map
  selectedUuids?: string[];
  onDatasetSelected?: (uuid: Array<string>) => void;
  // added layer ids are layers added on current map other than spatial extents layer
  // they are used in onEmptySpaceClick to identify if the click falls in empty space or in any layers
  addedLayerIds?: Array<string>;
}

const createPointsLayerId = (id: string) => `${id}-points`;

const createLinesLayerId = (id: string) => `${id}-lines`;

const createPolygonLayerId = (id: string) => `${id}-polygons`;

const createSourceId = (layerId: string, uuid: string) =>
  `${layerId}-${uuid}-source`;

const SpatialExtents: FC<SpatialExtentsProps> = ({
  layerId,
  selectedUuids,
  onDatasetSelected,
  addedLayerIds = [],
}) => {
  const { map } = useContext(MapContext);
  const dispatch = useDispatch<AppDispatch>();

  // util function to get collection data given uuid
  const getCollectionData = useCallback(
    async (uuid: string) => {
      const param: SearchParameters = {
        filter: `id='${uuid}'`,
        properties: "id,geometry",
      };

      return dispatch(fetchResultNoStore(param))
        .unwrap()
        .then((value: OGCCollections) => value.collections[0])
        .catch((error: any) => {
          console.error("Error fetching collection data:", error);
          // TODO: handle error in ErrorBoundary
        });
    },
    [dispatch]
  );

  const addSpatialExtentsLayer = useCallback(() => {
    const sourceIds = new Array<string>();
    const layerIds = new Array<string>();

    selectedUuids?.forEach(async (uuid: string) => {
      const sourceId = createSourceId(layerId, uuid);
      sourceIds.push(sourceId);

      const pointLayerId = createPointsLayerId(sourceId);
      layerIds.push(pointLayerId);

      const lineLayerId = createLinesLayerId(sourceId);
      layerIds.push(lineLayerId);

      const polygonLayerId = createPolygonLayerId(sourceId);
      layerIds.push(polygonLayerId);

      getCollectionData(uuid).then((collection) => {
        if (!map?.getSource(sourceId)) {
          map?.addSource(sourceId, {
            type: "geojson",
            data: collection?.getGeometry(),
          });
        }

        // util function to check if layer exists or not and add a before layerId
        // else you cannot click other dataset because this layer become top
        const addLayerIfNotExists = (id: string, layer: any) => {
          if (!map?.getLayer(id)) {
            map?.addLayer(layer, layerId);
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
            "fill-outline-color": "yellow",
          },
        });
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
  }, [selectedUuids, layerId, getCollectionData, map]);

  const onPointClick = useCallback(
    (ev: MapLayerMouseEvent): void => {
      ev.preventDefault();
      // Make sure even same id under same area will be set once.
      if (onDatasetSelected) {
        if (ev.features) {
          const uuids = [
            ...new Set(ev.features.map((feature) => feature.properties?.uuid)),
          ];
          onDatasetSelected(uuids);
        } else {
          onDatasetSelected([]);
        }
      }
    },
    [onDatasetSelected]
  );

  const onEmptySpaceClick = useCallback(
    (ev: MapLayerMouseEvent) => {
      const point = map?.project(ev.lngLat);

      // Query for features at the clicked point, but only in the addedLayerIds
      const features = point
        ? map?.queryRenderedFeatures(point, {
            layers: addedLayerIds,
          })
        : [];

      // If no features are found at the click point (i.e., clicked on empty space)
      if (features && features.length === 0 && onDatasetSelected) {
        onDatasetSelected([]);
      }
    },
    [map, addedLayerIds, onDatasetSelected]
  );

  useEffect(() => {
    map?.on("click", layerId, onPointClick);
    map?.on("click", onEmptySpaceClick);

    return () => {
      map?.off("click", layerId, onPointClick);
      map?.off("click", onEmptySpaceClick);
    };
  }, [map, layerId, onPointClick, onEmptySpaceClick]);

  // Remove all layers and sources created by addSpatialExtentsLayer
  useEffect(() => {
    const cleanup = addSpatialExtentsLayer();
    return () => {
      cleanup();
    };
  }, [addSpatialExtentsLayer]);

  return <React.Fragment />;
};

export default SpatialExtents;
