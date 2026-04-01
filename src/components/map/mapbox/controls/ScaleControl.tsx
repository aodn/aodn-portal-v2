import React, { useContext, useEffect, useRef } from "react";
import MapContext from "../MapContext";
import {
  ScaleControl as MapboxScaleControl,
  ScaleControlOptions,
} from "mapbox-gl";

export type Unit = string;

interface ScaleControlProps extends ScaleControlOptions {}

const ScaleControl = ({
  maxWidth = 80,
  unit = "metric",
}: ScaleControlProps) => {
  const { map } = useContext(MapContext);
  const isInitialized = useRef(false);

  useEffect(() => {
    if (!map) return;

    if (!isInitialized.current) {
      const scale = new MapboxScaleControl({
        maxWidth: maxWidth,
        unit: unit,
      });

      map.addControl(scale);

      // 4. Update the ref synchronously (does not trigger re-render)
      isInitialized.current = true;
    }
  }, [map, maxWidth, unit]);

  return <React.Fragment />;
};

export default ScaleControl;
