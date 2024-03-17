import React, { useCallback, useContext, useEffect } from "react";

import MapContext from "../MapContext";
import MapboxDraw, {
  DrawDeleteEvent,
  DrawCreateEvent,
  DrawUpdateEvent,
} from "@mapbox/mapbox-gl-draw";
import "@mapbox/mapbox-gl-draw/dist/mapbox-gl-draw.css";

// Maplibre is a foke of Mapbox when it goes to commerical, hence
// some of the controls still works with maplibre. In this case
// we use MapboxDraw from Mapbox
//
// There is a third party control that can draw rectangle, but right
// now just stick with the offical control.

// Refer to this issue https://github.com/maplibre/maplibre-gl-js/issues/2601
// @ts-expect-error see above
MapboxDraw.constants.classes.CONTROL_BASE = "maplibregl-ctrl";
// @ts-expect-error see above
MapboxDraw.constants.classes.CONTROL_PREFIX = "maplibregl-ctrl-";
// @ts-expect-error see above
MapboxDraw.constants.classes.CONTROL_GROUP = "maplibregl-ctrl-group";

interface MapboxDrawControlProps {
  onDrawCreate: ((e: unknown) => void) | undefined;
  onDrawDelete: ((e: unknown) => void) | undefined;
  onDrawUpdate: ((e: unknown) => void) | undefined;
}

const MapboxDrawControl = ({
  onDrawCreate,
  onDrawDelete,
  onDrawUpdate,
}: MapboxDrawControlProps) => {
  const { map } = useContext(MapContext);

  // When user completed the polygon by double click, this event first
  const handleDrawCreate = useCallback(
    (e: DrawCreateEvent) => {
      onDrawCreate && onDrawCreate(e);
    },
    [onDrawCreate]
  );

  // When user hit the delete button, this event fire.
  const handleDrawDelete = useCallback(
    (e: DrawDeleteEvent) => {
      onDrawDelete && onDrawDelete(e);
    },
    [onDrawDelete]
  );

  // When user move the polygon, this event first
  const handleDrawUpdate = useCallback(
    (e: DrawUpdateEvent) => {
      onDrawUpdate && onDrawUpdate(e);
    },
    [onDrawUpdate]
  );

  useEffect(() => {
    if (!map) return;

    const draw = new MapboxDraw({
      displayControlsDefault: false,
      controls: {
        point: false,
        line_string: false,
        polygon: true,
        trash: true,
      },
      defaultMode: "draw_polygon",
    });

    map.addControl(draw);
    map.on("draw.create", handleDrawCreate);
    map.on("draw.delete", handleDrawDelete);
    map.on("draw.update", handleDrawUpdate);

    return () => {
      map.removeControl(draw);
      map.off("draw.create", handleDrawCreate);
      map.off("draw.delete", handleDrawDelete);
      map.off("draw.update", handleDrawUpdate);
    };
  }, [map, handleDrawCreate, handleDrawDelete, handleDrawUpdate]);

  return <React.Fragment />;
};

export default MapboxDrawControl;
