import React, { useContext, useEffect, useState } from "react";
import MapContext from "../MapContext";
import { ScaleControl as MapboxScaleControl } from "mapbox-gl";

export type Unit = string;

interface ScaleControlProps {
  maxWidth?: number;
  unit?: Unit;
}

const ScaleControl = ({ maxWidth, unit }: ScaleControlProps) => {
  const { map } = useContext(MapContext);
  const [init, setInit] = useState<boolean>(false);

  useEffect(() => {
    if (!map) return;

    setInit((prev) => {
      if (prev === false) {
        const scale = new MapboxScaleControl({
          maxWidth: maxWidth,
          unit: unit,
        });

        map.addControl(scale);
        map.on("remove", () => map.removeControl(scale));
      }
      return true;
    });
  }, [map, maxWidth, unit]);

  return <React.Fragment />;
};

ScaleControl.defaultProps = {
  maxWidth: 80,
  unit: "metric",
};

export default ScaleControl;
