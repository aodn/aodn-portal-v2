import React, { useContext, useEffect } from "react";
import MapContext from "../MapContext";
import maplibregl from 'maplibre-gl'

const Locate = () => {

    const { map } = useContext(MapContext);  

    useEffect(() => {
        if(!map) return;

        const n = new maplibregl.GeolocateControl({
            positionOptions: {
                enableHighAccuracy: true
            },
            trackUserLocation: true
        });
    
        map.addControl(n);
        return () => {
            map.removeControl(n)
        }
    }, [map]);

    return (<React.Fragment/>);
}

export default Locate;