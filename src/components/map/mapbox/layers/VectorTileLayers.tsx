import React, { useContext, useEffect, useState, useCallback } from "react";
import MapContext from "../MapContext";
import { stringToColor } from "../../../common/colors/colorsUtils";
import { OGCCollection } from "../../../common/store/searchReducer";

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
      map.on("load", () =>
        setMapLoaded((prev) => {
          // If style changed, we may need to add the layer again, hence listen to this event.
          // https://github.com/mapbox/mapbox-gl-js/issues/8660
          //
          // We take the maploaded event and setup the listener and return value at once.
          map.on("styledata", () => {
            if (map.isStyleLoaded()) {
              // Since the style change reset all layers, so it make sense
              // to set it back to empty and trigger a redraw of layers
              setLayers([]);
            }
          });
          return true;
        })
      );
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
      if (map.getSource(uuid)) {
        map.removeLayer("symbol-" + uuid);
        map.removeLayer("fill-" + uuid);
        map.removeSource(uuid);
      }
    });

    // If map style changed, then the layer will be gone, we need
    // to try add it again, but before add we need to check if the
    // layer exist
    stacIds.forEach((uuid, index) => {
      if (!map.getSource(uuid)) {
        const source: mapboxgl.AnySourceData = {
          type: "vector",
          tiles: [
            `${window.location.protocol}//${window.location.host}/api/v1/ogc/tiles/WebMercatorQuad/{z}/{x}/{y}?collections=${uuid}`,
          ],
        };
        map.addSource(uuid, source);
        map.addLayer({
          id: "fill-" + uuid,
          type: "fill",
          source: uuid,
          "source-layer": "hits",
          paint: {
            "fill-color": stringToColor(uuid),
            "fill-outline-color": "black",
          },
        });
        // This will add the number to the layer
        map.addLayer({
          id: "symbol-" + uuid,
          type: "symbol",
          source: uuid,
          "source-layer": "hits",
          layout: {
            "text-field": "" + collections?.find((e) => e.id === uuid).index,
            "text-size": 12,
          },
          paint: {
            "text-color": "white",
          },
        });
      }
    });

    // Bookmark the layers, however we do not need to update if nothing changed
    // that is nothing need to add or delete.
    if (toAdd.length > 0 || toDelete.length > 0) {
      // This avoid infinity loop due to layers update.
      setLayers(stacIds);
    }
  }, [map, collections, layers, mapLoaded]);

  return <React.Fragment />;
};

export default VectorTileLayers;
