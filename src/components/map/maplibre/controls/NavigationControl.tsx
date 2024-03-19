import React, { useContext, useEffect } from "react";
import MapContext from "../MapContext";
import { NavigationControl as LibreNavigationControl } from "maplibre-gl";

interface NavigationControlProps {
  showCompass?: boolean;
  showZoom?: boolean;
  visualizePitch?: boolean;
}

const NavigationControl = (props: NavigationControlProps) => {
  const { map } = useContext(MapContext);

  useEffect(() => {
    if (!map) return;

    const n = new LibreNavigationControl({
      showCompass: props.showCompass,
      showZoom: props.showZoom,
      visualizePitch: props.visualizePitch,
    });

    map.addControl(n);
    return () => {
      map.removeControl(n);
    };
  }, [map, props.showCompass, props.showZoom, props.visualizePitch]);

  return <React.Fragment />;
};

NavigationControl.defaultProps = {
  showCompass: true,
  showZoom: true,
  visualizePitch: true,
};

export default NavigationControl;
