import React, {useContext, useEffect} from "react";
import MapContext from "../MapContext";
import mapLibre from "maplibre-gl";

const FullScreen = () => {

    const { map } = useContext(MapContext);

    useEffect(() => {
        if(!map) return;

        const n = new mapLibre.FullscreenControl();
        map.addControl(n);

        return () => {
            map.removeControl(n)
        }
    }, [map]);

    return (<React.Fragment/>);
}

export default FullScreen;