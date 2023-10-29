import React, { useState, useEffect } from 'react'

import 'maplibre-gl/dist/maplibre-gl.css'
import MapContext from "./MapContext";
import {Box} from "@mui/material";
import { Map as MaplibreMap } from 'maplibre-gl';

interface MapProps {
    centerLongitude: number;
    centerLatitude: number;
    zoom: number;
    panelId: string;
    stylejson: string;
};

const ReactMap = (props: React.PropsWithChildren<MapProps>) => {
    const [map, setMap] = useState<any | null>(null);

    useEffect(() => {
        const m = new MaplibreMap({
            container: props.panelId,
            style: props.stylejson,
            center: [props.centerLongitude, props.centerLatitude],
            zoom: props.zoom,
            localIdeographFontFamily: "'Noto Sans', 'Noto Sans CJK SC', sans-serif"
        });

        // https://github.com/maplibre/maplibre-gl-js/issues/2601
        m.getCanvas().classList.add('mapboxgl-canvas');
        m.getContainer().classList.add('mapboxgl-map');
        m.getCanvasContainer().classList.add('mapboxgl-canvas-container');
        m.getCanvasContainer().classList.add('mapboxgl-interactive');
        
        setMap(m);
    }, []);

    return (
        <MapContext.Provider value={{ map }}> 
            <Box>
                {props.children}
            </Box>
        </MapContext.Provider>
    )
}

ReactMap.defaultProps = {
    centerLatitude : -42.88611707886841,
    centerLongitude : 147.3353554138993,
    zoom : 5,
    stylejson : 'https://demotiles.maplibre.org/style.json'
};

export default ReactMap