import { createContext, useContext } from "react";

// Refer to this https://maplibre.org/news/2023-01-03-aws-maplibre-plugins/
//
// due to name conflict for example mapbox.MapBoxDraw implement IControl interface
// which expect onAdd(mapbox.Map) to be add, however our map is of type maplibre.Map,
// we need to use the following to import the type
// so that the IControl interface for control in mapbox can be add to maplibre
// as the type definition combined them together
import { Map } from "mapbox-gl";

// ---------------------------------------------------------------
type MapContextType = {
  map: Map | null;
};

const MapContext = createContext<Partial<MapContextType>>({});

if (import.meta.env.MODE === "dev") {
  (
    window as Window &
      typeof globalThis & {
        __MAP_CONTEXT__: React.Context<Partial<MapContextType>>;
      }
  ).__MAP_CONTEXT__ = MapContext;
}

export default MapContext;
