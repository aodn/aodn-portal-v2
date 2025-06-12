// import React, { useContext, useEffect } from "react";
// import MapContext from "../MapContext";
// import { FullscreenControl as LibreFullScreenControl } from "maplibre-gl";
//
// const FullScreen = () => {
//   const { map } = useContext(MapContext);
//
//   useEffect(() => {
//     if (!map) return;
//
//     const n = new LibreFullScreenControl();
//     map.addControl(n);
//
//     return () => {
//       map.removeControl(n);
//     };
//   }, [map]);
//
//   return <React.Fragment />;
// };
//
// export default FullScreen;
