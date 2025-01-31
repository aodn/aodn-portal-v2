import React, { useContext, useEffect, useState } from "react";
import MapContext from "../MapContext";
import { NavigationControl as MapboxNavigationControl } from "mapbox-gl";

interface NavigationControlProps {
  visible?: boolean;
  showCompass?: boolean;
  showZoom?: boolean;
  visualizePitch?: boolean;
}

const NavigationControl = ({
  visible = true,
  showCompass = true,
  showZoom = true,
  visualizePitch = true,
}: NavigationControlProps) => {
  const { map } = useContext(MapContext);
  const [_, setControl] = useState<MapboxNavigationControl | undefined>(
    undefined
  );

  useEffect(() => {
    if (map !== null) {
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
    }
  }, [map, showCompass, showZoom, visualizePitch]);

  useEffect(() => {
    const zoomIn: HTMLButtonElement | null = document.querySelector(
      ".mapboxgl-ctrl-zoom-in"
    );
    if (zoomIn) {
      zoomIn.style.display = visible ? "block" : "none";
    }

    const zoomOut: HTMLButtonElement | null = document.querySelector(
      ".mapboxgl-ctrl-zoom-out"
    );
    if (zoomOut) {
      zoomOut.style.display = visible ? "block" : "none";
    }

    const compass: HTMLButtonElement | null = document.querySelector(
      ".mapboxgl-ctrl-compass"
    );
    if (compass) {
      compass.style.display = visible ? "block" : "none";
    }
  }, [visible]);
  return <React.Fragment />;
};

export default NavigationControl;
