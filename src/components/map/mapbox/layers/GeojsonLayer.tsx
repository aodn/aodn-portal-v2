import React, { FC, useContext, useEffect, useState } from "react";
import { OGCCollection } from "../../../common/store/searchReducer";
import MapContext from "../MapContext";
import { stringToColor } from "../../../common/colors/colorsUtils";

interface GeojsonLayerProps {
  // Vector tile layer should added to map
  collection: OGCCollection;
}

const GeojsonLayer: FC<GeojsonLayerProps> = ({ collection }) => {
  const { map } = useContext(MapContext);
  const [mapLoaded, setMapLoaded] = useState<boolean | null>(null);
  console.log({ collection });
  useEffect(() => {
    if (map === null) return;

    const sourceId = `geojson-source-layer-${collection.id}`;
    const layerId = `geojson-layer-${collection.id}`;
    if (mapLoaded === null) {
      // This situation is map object created, hence not null, but not completely loaded
      // and therefore you will have problem setting source and layer. Set-up a listener
      // to update the state and then this effect can be call again when map loaded.
      map?.on("load", () =>
        setMapLoaded((prev) => {
          if (!prev) {
            // If style changed, we may need to add the layer again, hence listen to this event.
            // https://github.com/mapbox/mapbox-gl-js/issues/8660
            //
            // We take the maploaded event and setup the listener and return value at once.
            console.log("add source??????????????");
            map.addSource(sourceId, {
              type: "geojson",
              // Use a URL for the value for the `data` property.
              data: collection.extent?.getGeojsonExtents(),
            });
            console.log(
              "in add layer",
              JSON.stringify(collection.extent?.getGeojsonExtents())
            );
            map.addLayer({
              id: layerId,
              type: "fill",
              source: sourceId,
              paint: {
                "fill-color": "#0080ff", // blue color fill
                "fill-opacity": 1, // 100% opaque
                "fill-opacity-transition": { duration: 500 }, // 500 milliseconds = 1/2 seconds
              },
            });
            return true;
          } else return prev;
        })
      );
    }
    // return () => {
    //   if (map?.getSource(sourceId)) {
    //     map?.removeSource(sourceId);
    //     map?.removeLayer(layerId);
    //   }
    // };
  }, [collection.extent, collection.id, map, mapLoaded]);

  return <React.Fragment />;
};

export default GeojsonLayer;
