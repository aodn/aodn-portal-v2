import React from "react";
import maplibregl from 'maplibre-gl'
import { createContext } from 'react';

type MapContextType = {
    map: maplibregl.Map | null;
}

const MapContext = createContext<Partial<MapContextType>>({});;

export default MapContext;