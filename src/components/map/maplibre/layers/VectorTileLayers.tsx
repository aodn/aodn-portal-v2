import React, { useContext, useEffect, useState } from "react";
import MapContext from "../MapContext";
import { stringToColor } from "../../../common/colors/colorsUtils";
import { OGCCollection } from "../../../common/store/OGCCollectionDefinitions";

interface VectorTileLayersProps {
  // Vector tile layer should added to map
  collections: Array<OGCCollection>;
}

const findSetDifference = (setA: Array<string>, setB: Array<string>) =>
  setA.filter((x) => !setB.includes(x));

const VectorTileLayers = ({ collections }: VectorTileLayersProps) => {
  const { map } = useContext(MapContext);
  const [mapLoaded, setMapLoaded] = useState<boolean | null>(null);

  // Book keeping of layers added to map
  const [layers, setLayers] = useState<Array<string>>([]);

  useEffect(() => {
    // Do nothing if map isn't ready
    if (map === null) return;

    if (mapLoaded === null) {
      // This situation is map object created, hence not null, but not completely loaded
      // and therefore you will have problem setting source and layer. Set-up a listener
      // to update the state and then this effect can be call again when map loaded.
      map?.on("load", () => setMapLoaded(true));
      return;
    }
    // If map still not fire load even, aka not ready then we just return
    if (!mapLoaded) return;

    // Things need to add and remove given map is fully loaded
    const stacIds = collections.map((collection) => collection.id);

    const toAdd = findSetDifference(stacIds, layers);
    const toDelete = findSetDifference(layers, stacIds);

    // Remove items in map layer
    toDelete.forEach((uuid) => {
      map?.removeLayer(uuid);
      map?.removeSource(uuid);
    });

    // Add items to layer
    toAdd.forEach((uuid) => {
      if (!map?.getSource(uuid)) {
        const source: mapboxgl.AnySourceData = {
          type: "vector",
          tiles: [
            `${window.location.protocol}//${window.location.host}/api/v1/ogc/tiles/WebMercatorQuad/{z}/{x}/{y}?collections=${uuid}`,
          ],
        };
        map?.addSource(uuid, source);
        map?.addLayer({
          id: uuid,
          type: "fill",
          source: uuid,
          "source-layer": "hits",
          paint: {
            "fill-color": stringToColor(uuid),
            "fill-outline-color": "black",
          },
        });
      }
    });

    // Update the layers if there are changes, else you will have
    // infinite loop
    if (toAdd.length > 0 || toDelete.length > 0) {
      setLayers((l) => {
        const newLayers = l.filter((l) => !toDelete.includes(l));
        newLayers.push(...toAdd);
        return newLayers;
      });
    }
  }, [map, collections, layers, mapLoaded]);

  return <React.Fragment />;
};

export default VectorTileLayers;
