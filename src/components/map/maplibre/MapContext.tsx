import { createContext } from 'react';

// Refer to this https://maplibre.org/news/2023-01-03-aws-maplibre-plugins/
// 
// due to name conflict for example mapbox.MapBoxDraw implement IControl interface
// which expect onAdd(mapbox.Map) to be add, however our map is of type maplibre.Map, 
// we need to use the following to import the type
// so that the IControl interface for control in mapbox can be add to maplibre
// as the type definition combined them together
import { Map as MapboxMap } from 'mapbox-gl';
import { Map as MaplibreMap } from 'maplibre-gl';

type Map = MapboxMap & MaplibreMap;
// ---------------------------------------------------------------

type MapContextType = {
    map: Map | null;
}

const MapContext = createContext<Partial<MapContextType>>({});;

export default MapContext;