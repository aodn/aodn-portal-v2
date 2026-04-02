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

  const mode = import.meta.env.MODE;
  return mode === "dev" || mode === "playwright-local" ? (
    <div
      id={"display-coor"}
      ref={ref}
      style={{
        display: "inline-block",
        position: "absolute",
        bottom: 0,
        zIndex: zIndex.MAP_BASE,
        backgroundColor: "rgba(255, 255, 255, 0.6)",
      }}
    />
  ) : (
    <></>
  );
};

export default DisplayCoordinate;
