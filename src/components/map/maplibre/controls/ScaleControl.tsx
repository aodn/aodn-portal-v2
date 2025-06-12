// import React, { useContext, useEffect } from "react";
// import MapContext from "../MapContext";
// import { Unit, ScaleControl as LibreScaleControl } from "maplibre-gl";
//
// interface ScaleControlProps {
//   maxWidth?: number;
//   unit?: Unit;
// }
//
// const ScaleControl = ({ maxWidth, unit }: ScaleControlProps) => {
//   const { map } = useContext(MapContext);
//
//   useEffect(() => {
//     if (!map) return;
//
//     const scale = new LibreScaleControl({
//       maxWidth: maxWidth,
//       unit: unit,
//     });
//
//     map.addControl(scale);
//
//     return () => {
//       map.removeControl(scale);
//     };
//   }, [map, maxWidth, unit]);
//
//   return <React.Fragment />;
// };
//
// ScaleControl.defaultProps = {
//   maxWidth: 80,
//   unit: "metric",
// };
//
// export default ScaleControl;
