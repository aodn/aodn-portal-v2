import React, { FC, useCallback, useContext, useEffect, useState } from "react";
import MapContext from "../MapContext";
import {
  Feature,
  FeatureCollection,
  GeoJsonProperties,
  Geometry,
} from "geojson";
import {
  OGCCollection,
  OGCCollections,
  SearchParameters,
  fetchResultNoStore,
} from "../../../common/store/searchReducer";
import { centroid } from "@turf/turf";
import { GeoJSONSource, MapLayerMouseEvent } from "mapbox-gl";
import { useDispatch } from "react-redux";
import { AppDispatch } from "../../../common/store/store";

interface ClusterLayerProps {
  // Vector tile layer should added to map
  collections: Array<OGCCollection>;
  // Event fired when user click on the point layer
  onDatasetSelected?: (uuid: Array<string>) => void;
}

const OPACITY = 0.6;
const STROKE_WIDTH = 1;

// Given an array of OGCCollections, we convert it to a cluster layer by adding all the feature items
// in a collection to the FeatureCollection
const createClusterDatSource = (
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

const unclusterPointLayerMouseEnterEventHandler = (
  ev: MapLayerMouseEvent
): void => {
  ev.target.getCanvas().style.cursor = "pointer";
};

const unclusterPointLayerMouseLeaveEventHandler = (
  ev: MapLayerMouseEvent
): void => {
  ev.target.getCanvas().style.cursor = "";
};

// These function help to get the correct id and reduce the need to set those id in the
// useEffect list
const getLayerId = (id: string | undefined) => `cluster-layer-${id}`;

const getClusterSourceId = (layerId: string) => `${layerId}-source`;

const getclusterLayerId = (layerId: string) => `${layerId}-clusters`;

const getUnclusterPointId = (layerId: string) => `${layerId}-unclustered-point`;

const ClusterLayer: FC<ClusterLayerProps> = ({
  collections,
  onDatasetSelected,
}: ClusterLayerProps) => {
  const { map } = useContext(MapContext);
  const dispatch = useDispatch<AppDispatch>();
  const [spatialExtentsUUid, setSpatialExtentsUUid] = useState<Array<string>>();

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

  useEffect(() => {
    const sourceIds = new Array<string>();
    const layerIds = new Array<string>();

    const createPointsLayerId = (id: string) => `${id}-points`;
    const createLinesLayerId = (id: string) => `${id}-lines`;
    const createPolygonLayerId = (id: string) => `${id}-polygons`;
    const createSourceId = (layerId: string, uuid: string) =>
      `${layerId}-${uuid}-source`;

    spatialExtentsUUid?.forEach((uuid: string) => {
      const layerId = getLayerId(map?.getContainer().id);
      const sourceId = createSourceId(layerId, uuid);
      const clusterLayer = getclusterLayerId(layerId);

      sourceIds.push(sourceId);

      const pointLayerId = createPointsLayerId(sourceId);
      layerIds.push(pointLayerId);

      const lineLayerId = createLinesLayerId(sourceId);
      layerIds.push(lineLayerId);

      const polygonLayerId = createPolygonLayerId(sourceId);
      layerIds.push(polygonLayerId);

      const param: SearchParameters = {
        filter: `id='${uuid}'`,
        properties: "id,geometry",
      };

      dispatch(fetchResultNoStore(param))
        .unwrap()
        .then((collections: OGCCollections) => {
          // Give we use uuid, there will be one record only
          const collection = collections.collections[0];

          map?.addSource(sourceId, {
            type: "geojson",
            data: collection.getGeometry(),
          });

          // Add layers for each geometry type within the GeometryCollection
          map?.addLayer(
            {
              id: pointLayerId,
              type: "symbol",
              source: sourceId,
              filter: ["==", "$type", "Point"],
              layout: {
                "icon-image": "marker-15", // Built-in icon provided by Mapbox
                "icon-size": 1.5,
                "text-field": ["get", "title"],
                "text-font": ["Open Sans Semibold", "Arial Unicode MS Bold"],
                "text-offset": [0, 1.25],
                "text-anchor": "top",
              },
            },
            clusterLayer
          );

          map?.addLayer(
            {
              id: lineLayerId,
              type: "line",
              source: sourceId,
              filter: ["==", "$type", "LineString"],
              paint: {
                "line-color": "#ff0000",
                "line-width": 2,
              },
            },
            clusterLayer
          );

          map?.addLayer(
            {
              id: polygonLayerId,
              type: "fill",
              source: sourceId,
              filter: ["==", "$type", "Polygon"],
              paint: {
                "fill-color": "#00ff00",
                "fill-opacity": 0.4,
              },
            },
            clusterLayer
          );
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
  }, [map, dispatch, spatialExtentsUUid]);

  // This is use to render the cluster circle and add event handle to circles
  useEffect(() => {
    if (map === null) return;

    const layerId = getLayerId(map?.getContainer().id);
    const clusterSourceId = getClusterSourceId(layerId);
    const clusterLayer = getclusterLayerId(layerId);
    const unclusterPointLayer = getUnclusterPointId(layerId);

    // This situation is map object created, hence not null, but not completely loaded
    // and therefore you will have problem setting source and layer. Set-up a listener
    // to update the state and then this effect can be call again when map loaded.
    const createLayers = () => {
      // Function may call multiple times due to useEffect, it is not possible to avoid
      // these changes so use this check to avoid duplicate add
      if (map?.getSource(clusterSourceId)) return;

      map?.addSource(clusterSourceId, {
        type: "geojson",
        data: createClusterDatSource(undefined),
        cluster: true,
        clusterMaxZoom: 14,
        clusterRadius: 10,
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
            "#51bbd6",
            100,
            "#f1f075",
            750,
            "#f28cb1",
          ],
          "circle-radius": [
            "step",
            ["get", "point_count"],
            15,
            100,
            30,
            750,
            40,
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

      // Change the cursor back to default when it leaves the unclustered points
      map?.on(
        "mouseleave",
        unclusterPointLayer,
        unclusterPointLayerMouseLeaveEventHandler
      );
    };

    map?.once("load", createLayers);

    return () => {
      map?.off(
        "mouseenter",
        unclusterPointLayer,
        unclusterPointLayerMouseEnterEventHandler
      );
      map?.off(
        "mouseleave",
        unclusterPointLayer,
        unclusterPointLayerMouseLeaveEventHandler
      );

      try {
        if (map?.getSource(clusterSourceId)) map?.removeSource(clusterSourceId);

        if (map?.getLayer(clusterLayer)) map?.removeLayer(clusterLayer);

        if (map?.getLayer(`${layerId}-cluster-count`))
          map?.removeLayer(`${layerId}-cluster-count`);

        if (map?.getLayer(unclusterPointLayer))
          map?.removeLayer(unclusterPointLayer);

        if (map?.getLayer(`${layerId}-unclustered-count`))
          map?.removeLayer(`${layerId}-unclustered-count`);
      } catch (error) {
        // If source not found and throw exception then layer will not exist
      }
    };
    // Make sure map is the only dependency so that it will not trigger twice run
    // where you will add source and remove layer accidentally.
  }, [map]);

  useEffect(() => {
    const clusterSourceId = getClusterSourceId(
      getLayerId(map?.getContainer().id)
    );
    if (map?.getSource(clusterSourceId)) {
      (map?.getSource(clusterSourceId) as GeoJSONSource).setData(
        createClusterDatSource(collections)
      );
    }
  }, [map, collections]);

  useEffect(() => {
    const layerId = getLayerId(map?.getContainer().id);
    const unclusterPointLayer = getUnclusterPointId(layerId);

    map?.on(
      "click",
      unclusterPointLayer,
      unclusterPointLayerMouseClickEventHandler
    );

    return () => {
      map?.off(
        "click",
        unclusterPointLayer,
        unclusterPointLayerMouseClickEventHandler
      );
    };
  }, [map, unclusterPointLayerMouseClickEventHandler]);

  return <React.Fragment />;
};

export default ClusterLayer;
