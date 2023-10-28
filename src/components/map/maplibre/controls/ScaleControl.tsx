import React, { useContext, useEffect } from "react";
import MapContext from "../MapContext";
import maplibregl from 'maplibre-gl'
import { Unit } from "maplibre-gl";

interface ScaleControlProps {
    maxWidth?: number;
    unit?: Unit;
}

const ScaleControl = (props: ScaleControlProps) => {
 
    const { map } = useContext(MapContext);  

    useEffect(() => {
        if(!map) return;

        const scale = new maplibregl.ScaleControl({
            maxWidth: props.maxWidth,
            unit: props.unit
        });

        map.addControl(scale);
        
        return () => {
            map.removeControl(scale);
        }

    }, [map, props.maxWidth, props.unit]);

    return (<React.Fragment/>);
}

ScaleControl.defaultProps = {
    maxWidth: 80, 
    unit: 'metric'
}

export default ScaleControl;