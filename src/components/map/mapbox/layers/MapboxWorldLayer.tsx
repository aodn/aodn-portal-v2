import { FC, useCallback, useContext, useEffect, useState } from "react";
import MapContext from "../MapContext";
import { TestHelper } from "../../../common/test/helper";

const sourceId = "mapbox-world-country-boundaries";
const layerId = "mapbox-world-country-boundaries-layer";
const undisputedLabelId = "mapbox-world-country-undisputed-country-label";

const MapboxWorldLayersDef = {
  WORLD: {
    id: "static-mapbox-world-layer",
    name: "World boundaries and Places",
  },
};

const MapboxWorldLayer: FC = () => {
  const { map } = useContext(MapContext);
  const [created, setCreated] = useState<boolean>(false);

  const createLayer = useCallback(() => {
    if (map?.getSource(sourceId)) return true;
    // This source is free source, other need payment
    map?.addSource(sourceId, {
      type: "vector",
      url: "mapbox://mapbox.country-boundaries-v1",
    });

    map?.addLayer({
      id: layerId,
      source: sourceId,
      "source-layer": "country_boundaries",
      type: "fill",
      filter: ["==", ["get", "disputed"], "false"],
      paint: {
        "fill-color": "rgba(66,100,251, 0.3)",
        "fill-outline-color": "#0000ff",
      },
    });

    map?.addLayer({
      id: undisputedLabelId,
      source: sourceId,
      "source-layer": "country_boundaries",
      type: "symbol",
      filter: ["==", ["get", "disputed"], "false"],
      layout: {
        "text-field": ["step", ["zoom"], ["to-string", ["get", "name"]], 9, ""],
        "text-font": ["Open Sans Regular", "Arial Unicode MS Regular"],
        "text-padding": 5,
        "text-size": 13,
        "text-allow-overlap": false,
        "text-ignore-placement": false,
        "symbol-placement": "line",
      },
      paint: {
        "text-color": "#ffffff",
        "text-halo-color": "#000000",
        "text-halo-width": 1,
      },
    });
  }, [map]);

  // This is use to handle base map change that set style will default remove all layer, which is
  // the behavior of mapbox, this useEffect, add the layer back based on user event
  useEffect(() => {
    map?.on("styledata", createLayer);
    return () => {
      map?.off("styledata", createLayer);
    };
  }, [map, createLayer]);

  useEffect(() => {
    if (map === null) return;

    // Only create once, the strict mode cause twice call.
    setCreated((value) => {
      if (!value) createLayer();
      return true;
    });

    return () => {
      // Always remember to clean up resources
      try {
        if (map?.getSource(sourceId)) {
          map?.removeLayer(layerId);
          map?.removeLayer(undisputedLabelId);
          map?.removeSource(sourceId);
        }
      } catch (error) {
        // OK to ignore error here
      }
    };
  }, [map, createLayer]);

  return (
    <TestHelper
      id={map?.getContainer().id || ""}
      getWorldBoundariesLayer={() => layerId}
    />
  );
};

export { MapboxWorldLayersDef };

export default MapboxWorldLayer;
