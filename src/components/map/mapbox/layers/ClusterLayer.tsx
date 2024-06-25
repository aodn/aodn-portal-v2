import React, { FC, useContext, useEffect, useState } from "react";
import MapContext from "../MapContext";
import {
  Feature,
  FeatureCollection,
  GeoJsonProperties,
  Geometry,
} from "geojson";
import { OGCCollection } from "../../../common/store/searchReducer";

interface ClusterLayerProps {
  // Vector tile layer should added to map
  collections: Array<OGCCollection>;
}

// Given an array of OGCCollections, we convert it to a cluster layer by adding all the feature items
// in a collection to the FeatureCollection
const createClusterDatSource = (
  collections: Array<OGCCollection>
): FeatureCollection => {
  const featureCollections: FeatureCollection = {
    type: "FeatureCollection",
    features: new Array<Feature<Geometry, GeoJsonProperties>>(),
  };

  collections.forEach((collection) => {
    // We skip the first one which is the overall bounding box, then add the remaining
    collection.extent
      ?.getGeojsonExtents(1)
      .features.forEach((i) => featureCollections.features.push(i));
  });

  return featureCollections;
};

const ClusterLayer: FC<ClusterLayerProps> = ({
  collections,
}: ClusterLayerProps) => {
  const { map } = useContext(MapContext);

  useEffect(() => {
    if (map === null) return;

    const layerId = `cluster-layer=${map?.getContainer().id}`;
    // This situation is map object created, hence not null, but not completely loaded
    // and therefore you will have problem setting source and layer. Set-up a listener
    // to update the state and then this effect can be call again when map loaded.
    if (collections?.length !== 0) {
      map?.once("idle", () => {
        map?.addSource(layerId, {
          type: "geojson",
          data: createClusterDatSource(collections),
          cluster: true,
          clusterMaxZoom: 14,
          clusterRadius: 50,
        });

        // Add layers for dataset1
        map?.addLayer({
          id: `${layerId}-clusters`,
          type: "circle",
          source: layerId,
          filter: ["has", "point_count"],
          paint: {
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
              20,
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
          source: layerId,
          filter: ["has", "point_count"],
          layout: {
            "text-field": "{point_count_abbreviated}",
            "text-font": ["DIN Offc Pro Medium", "Arial Unicode MS Bold"],
            "text-size": 12,
          },
        });

        map?.addLayer({
          id: `${layerId}-unclustered-point`,
          type: "circle",
          source: layerId,
          filter: ["!", ["has", "point_count"]],
          paint: {
            "circle-color": "#11b4da",
            "circle-radius": 4,
            "circle-stroke-width": 1,
            "circle-stroke-color": "#fff",
          },
        });
      });
    }

    return () => {
      if (map?.getLayer(`${layerId}-clusters`))
        map.removeLayer(`${layerId}-clusters`);
      if (map?.getLayer(`${layerId}-cluster-count`))
        map.removeLayer(`${layerId}-cluster-count`);
      if (map?.getLayer(`${layerId}-unclustered-point`))
        map.removeLayer(`${layerId}-unclustered-point`);
      if (map?.getSource(layerId)) map.removeSource(layerId);
    };
  }, [collections, map]);

  return <React.Fragment />;
};

export default ClusterLayer;
