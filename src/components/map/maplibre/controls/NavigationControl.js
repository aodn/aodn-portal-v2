import React, { useContext, useEffect } from "react";
import MapContext from "../MapContext";
import maplibregl from 'maplibre-gl'

const NavigationControl = (
    {showCompass = true, showZoom = true, visualizePitch = true}) => {

    const { map } = useContext(MapContext);  

    useEffect(() => {
        if(!map) return;

        const n = new maplibregl.NavigationControl({
            showCompass: showCompass, 
            showZoom: showZoom, 
            visualizePitch: visualizePitch
        });
    
        map.addControl(n);
        return () => {
            map.removeControl(n)
        }
    }, [map, showCompass, showZoom, visualizePitch]);

    return (<React.Fragment/>);
}

export default NavigationControl;