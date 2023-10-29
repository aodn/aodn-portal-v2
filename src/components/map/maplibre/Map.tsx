import React, { useState, useEffect } from 'react'

import maplibregl from 'maplibre-gl'
import 'maplibre-gl/dist/maplibre-gl.css'
import MapContext from "./MapContext";
import "./Map.css";
import {Box} from "@mui/material";

import { Map as MapboxMap } from 'mapbox-gl';
import { Map as MaplibreMap } from 'maplibre-gl';

type Map = MapboxMap & MaplibreMap;

interface MapProps {
    centerLongitude: number;
    centerLatitude: number;
    zoom: number;
    panelId: string;
    stylejson: string;
};

const uniqueMapContainerId = 'map-libre-container-id';

const Map = (props: React.PropsWithChildren<MapProps>) => {
    const [map, setMap] = useState<any | null>(null);

    useEffect(() => {
        const m = new MaplibreMap({
            container: props.panelId,
            style: props.stylejson,
            center: [props.centerLongitude, props.centerLatitude],
            zoom: props.zoom,
            localIdeographFontFamily: "'Noto Sans', 'Noto Sans CJK SC', sans-serif"
        });
        setMap(m);
    }, []);

    return (
        <MapContext.Provider value={{ map }}> 
            <Box className="libre-map">
                {props.children}
            </Box>
        </MapContext.Provider>
    )
}

Map.defaultProps = {
    centerLongitude : 0,
    centerLatitude : 0,
    zoom : 5,
    stylejson : 'https://demotiles.maplibre.org/style.json'
};

export default Map