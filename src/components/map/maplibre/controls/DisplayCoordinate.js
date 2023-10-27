import React, {useContext, useEffect, useRef} from "react";
import MapContext from "../MapContext";

const DisplayCoordinate = (props) => {
  const { map } = useContext(MapContext);
  const ref = useRef();

  useEffect(() => {
    if(!map) return;

    const handle = (e) => ref.current.innerHTML = JSON.stringify(e.point) + ' ' + JSON.stringify(e.lngLat.wrap());
    map.on('mousemove', handle);

    return () => {
      map.off('mousemove', handle);
    }

  }, [map])

  return (
    <div id={'display-coor'}
         ref={ref}
         style={{
           display: "inline-block",
           position: "relative",
           zIndex: 10,
           backgroundColor: 'rgba(255, 255, 255, 0.6)'
         }}
    />
  );
}

export default DisplayCoordinate;