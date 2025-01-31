import React, { useContext, useEffect, useState } from "react";
import MapContext from "../MapContext";
import { NavigationControl as MapboxNavigationControl } from "mapbox-gl";

interface NavigationControlProps {
  showCompass?: boolean;
  showZoom?: boolean;
  visualizePitch?: boolean;
}

const NavigationControl = ({
  showCompass = true,
  showZoom = true,
  visualizePitch = true,
}: NavigationControlProps) => {
  const { map } = useContext(MapContext);
  const [_, setControl] = useState<MapboxNavigationControl | undefined>(
    undefined
  );

  useEffect(() => {
    if (map === null) return;

    setControl((prev: MapboxNavigationControl | undefined) => {
      if (!prev) {
        const n = new MapboxNavigationControl({
          showCompass: showCompass,
          showZoom: showZoom,
          visualizePitch: visualizePitch,
        });

        map?.addControl(n, "top-left");
        return n;
      }
      return prev;
    });
  }, [map, showCompass, showZoom, visualizePitch]);

  return <React.Fragment />;
};

export default NavigationControl;
