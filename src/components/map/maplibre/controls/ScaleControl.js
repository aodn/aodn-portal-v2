import React, { useContext, useEffect } from "react";
import MapContext from "../MapContext";
import maplibregl from 'maplibre-gl'

const ScaleControl = ({maxWidth = 80, unit = 'metric'}) => {
 
    const { map } = useContext(MapContext);  

    useEffect(() => {
        if(!map) return;

        const scale = new maplibregl.ScaleControl({
            maxWidth: maxWidth,
            unit: unit
        });

        map.addControl(scale);
        
        return () => {
            map.removeControl(scale);
        }

    }, [map, maxWidth, unit]);

    return (<React.Fragment/>);
}

export default ScaleControl;