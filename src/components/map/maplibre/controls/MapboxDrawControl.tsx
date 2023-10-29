import React, { useContext, useEffect } from "react";

import MapContext from "../MapContext";
import MapboxDraw from "@mapbox/mapbox-gl-draw";
import '@mapbox/mapbox-gl-draw/dist/mapbox-gl-draw.css'

// Maplibre is a foke of Mapbox when it goes to commerical, hence 
// some of the controls still works with maplibre. In this case
// we use MapboxDraw from Mapbox
//
// There is a third party control that can draw rectangle, but right
// now just stick with the offical control. Because of that you cannot use typescript
// as it will fail on map.addControl(draw) as it is not in the type definition

// Refer to this issue https://github.com/maplibre/maplibre-gl-js/issues/2601
// @ts-ignore
MapboxDraw.constants.classes.CONTROL_BASE = "maplibregl-ctrl";
// @ts-ignore
MapboxDraw.constants.classes.CONTROL_PREFIX = "maplibregl-ctrl-";
// @ts-ignore
MapboxDraw.constants.classes.CONTROL_GROUP = "maplibregl-ctrl-group";

interface MapboxDrawControlProps {
    onDrawCreate: ((e: any) => void) | undefined;
    onDrawDelete: ((e: any) => void) | undefined;
    onDrawUpdate: ((e: any) => void) | undefined;
};

const MapboxDrawControl = (props: MapboxDrawControlProps) => {

    const { map } = useContext(MapContext);  

    useEffect(() => {
        if(!map) return;

        const draw = new MapboxDraw({
            displayControlsDefault: false,
            controls: {
                point: false,
                line_string: false, 
                polygon: true,
                trash: true
            },
        });

        map.addControl(draw);
        map.on('draw.create', onDrawCreate);
        map.on('draw.delete', onDrawDelete);
        map.on('draw.update', onDrawUpdate);

        return () => {
            map.removeControl(draw);
            map.off('draw.create', onDrawCreate);
            map.off('draw.delete', onDrawDelete);
            map.off('draw.update', onDrawUpdate);                
        }
    }, [map]);

    // When user completed the polygon by double click, this event first
    const onDrawCreate = (e: any) => {
        props.onDrawCreate && props.onDrawCreate(e);
    }

    // When user hit the delete button, this event fire.
    const onDrawDelete = (e: any) => {
        props.onDrawDelete && props.onDrawDelete(e);
    }

    // When user move the polygon, this event first
    const onDrawUpdate = (e: any) => {
        props.onDrawUpdate && props.onDrawUpdate(e);
    }

    return (<React.Fragment/>);
}

export default MapboxDrawControl;