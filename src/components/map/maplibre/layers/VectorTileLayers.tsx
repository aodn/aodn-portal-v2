import React, { useContext, useEffect, useState } from "react";
import MapContext from "../MapContext";
import { OGCCollection } from "../../../common/store/searchReducer";
import { stringToColor } from "../../../common/colors/colorsUtils";

interface VectirTileLayersProps {
  // Vector tile layer should added to map
  stac: Array<OGCCollection>;
}

const findSetDifference = (setA: Array<string>, setB: Array<string>) =>
  setA.filter((x) => !setB.includes(x));

const VectirTileLayers = (props: VectirTileLayersProps) => {
  const { map } = useContext(MapContext);
  const [mapLoaded, setMapLoaded] = useState<boolean | null>(null);

  // Book keeping of layers added to map
  const [layers, setLayers] = useState<Array<string>>([]);

  useEffect(() => {
    if (!map) return;

    if (mapLoaded === null) {
      // This situation is map object created, hence not null, but not completely loaded
      // and therefore you will have problem setting source and layer. Set-up a listener
      // to update the state and then this effect can be call again when map loaded.
      map.on("load", () => setMapLoaded(true));
      return;
    }

    if (!mapLoaded) return;

    // Things need to add and remove
    const stacIds = props.stac.map((s) => s.id);

    const toAdd = findSetDifference(stacIds, layers);
    const toDelete = findSetDifference(layers, stacIds);

    toDelete.forEach((uuid) => {
      map.removeLayer(uuid);
      map.removeSource(uuid);
    });

    toAdd.forEach((uuid) => {
      if (!map.getSource(uuid)) {
        map.addSource(uuid, {
          type: "vector",
          tiles: [
            `${window.location.protocol}//${window.location.host}/api/v1/ogc/tiles/WebMercatorQuad/{z}/{x}/{y}?collections=${uuid}`,
          ],
        });
        map.addLayer({
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
  }, [map, props.stac, layers, mapLoaded]);

  return <React.Fragment />;
};

export default VectirTileLayers;
