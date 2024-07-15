import React, { FC, useCallback, useContext, useEffect, useState } from "react";
import MapContext from "../MapContext";
import { AppDispatch } from "../../../common/store/store";
import { useDispatch } from "react-redux";
import {
  fetchResultNoStore,
  OGCCollections,
  SearchParameters,
} from "../../../common/store/searchReducer";
import { MapLayerMouseEvent } from "mapbox-gl";

interface SpatialExtentsProps {
  layerId: string;
  onDatasetSelected?: (uuid: Array<string>) => void;
}

const createPointsLayerId = (id: string) => `${id}-points`;

const createLinesLayerId = (id: string) => `${id}-lines`;

const createPolygonLayerId = (id: string) => `${id}-polygons`;

const createSourceId = (layerId: string, uuid: string) =>
  `${layerId}-${uuid}-source`;

const SpatialExtents: FC<SpatialExtentsProps> = ({
  layerId,
  onDatasetSelected,
}) => {
  const { map } = useContext(MapContext);
  const dispatch = useDispatch<AppDispatch>();
  const [spatialExtentsUUid, setSpatialExtentsUUid] = useState<Array<string>>();

  // util function to get collection data given uuid
  // and based on boolean indicating whether to fetch only geometry-related properties
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

    spatialExtentsUUid?.forEach(async (uuid: string) => {
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
  }, [spatialExtentsUUid, layerId, getCollectionData, map]);

  const onPointMouseClick = useCallback(
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

  useEffect(() => {
    map?.on("click", layerId, onPointMouseClick);

    return () => {
      map?.off("click", layerId, onPointMouseClick);
    };
  }, [map, layerId, onPointMouseClick]);

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
