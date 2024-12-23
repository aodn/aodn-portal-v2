import React, { useContext, useEffect, useState } from "react";
import MapContext from "../MapContext";
import { ScaleControl as MapboxScaleControl } from "mapbox-gl";

export type Unit = string;

interface ScaleControlProps {
  maxWidth?: number;
  unit?: Unit;
}

const ScaleControl = ({
  maxWidth = 80,
  unit = "metric",
}: ScaleControlProps) => {
  const { map } = useContext(MapContext);
  const [_, setInit] = useState<boolean>(false);

  useEffect(() => {
    if (!map) return;

    setInit((prev) => {
      if (!prev) {
        const scale = new MapboxScaleControl({
          maxWidth: maxWidth,
          unit: unit,
        });

        map.addControl(scale);
      }
      return true;
    });
  }, [map, maxWidth, unit]);

  return <React.Fragment />;
};

export default ScaleControl;
