import { useContext, useEffect, useRef } from "react";
import MapContext from "../MapContext";

import { zIndex } from "../../../../styles/constants";
import { MapMouseEvent } from "mapbox-gl";

const DisplayCoordinate = () => {
  const { map } = useContext(MapContext);
  const ref = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (map) {
      const handle = (e: MapMouseEvent) => {
        if (ref.current) {
          ref.current.innerHTML =
            JSON.stringify(e.point) + " " + JSON.stringify(e.lngLat.wrap());
        }
      };

      map.on("mousemove", handle);
      return () => {
        map.off("mousemove", handle);
      };
    }
  }, [map]);

  return import.meta.env.MODE === "dev" ? (
    <div
      id={"display-coor"}
      ref={ref}
      style={{
        display: "inline-block",
        position: "absolute",
        bottom: 0,
        zIndex: zIndex["MAP_COORD"],
        backgroundColor: "rgba(255, 255, 255, 0.6)",
      }}
    />
  ) : (
    <></>
  );
};

export default DisplayCoordinate;
