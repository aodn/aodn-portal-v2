import { useContext, useEffect, useRef } from "react";
import MapContext from "../MapContext";
import { zIndex } from "../../../common/constants";

const DisplayCoordinate = () => {
  const { map } = useContext(MapContext);
  const ref = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!map) return;

    const handle = (e: mapboxgl.MapMouseEvent & mapboxgl.EventData) => {
      if (ref.current) {
        ref.current.innerHTML =
          JSON.stringify(e.point) + " " + JSON.stringify(e.lngLat.wrap());
      }
    };

    map.on("mousemove", handle);

    return () => {
      map.off("mousemove", handle);
    };
  }, [map]);

  return (
    <div
      id={"display-coor"}
      ref={ref}
      style={{
        display: "inline-block",
        position: "relative",
        zIndex: zIndex["MAP_COORD"],
        backgroundColor: "rgba(255, 255, 255, 0.6)",
      }}
    />
  );
};

export default DisplayCoordinate;
