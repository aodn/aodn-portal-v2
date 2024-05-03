import React, { useContext, useEffect, useState } from "react";
import MapContext from "../MapContext";
import { NavigationControl as MapboxNavigationControl } from "mapbox-gl";

interface NavigationControlProps {
  showCompass?: boolean;
  showZoom?: boolean;
  visualizePitch?: boolean;
}

const NavigationControl = (props: NavigationControlProps) => {
  const { map } = useContext(MapContext);
  const [init, setInit] = useState<boolean>(false);

  useEffect(() => {
    if (map === null) return;

    setInit((prev) => {
      if (prev === false) {
        const n = new MapboxNavigationControl({
          showCompass: props.showCompass,
          showZoom: props.showZoom,
          visualizePitch: props.visualizePitch,
        });

        map.addControl(n, "top-left");
      }
      return true;
    });
  }, [map, props.showCompass, props.showZoom, props.visualizePitch]);

  return <React.Fragment />;
};

NavigationControl.defaultProps = {
  showCompass: true,
  showZoom: true,
  visualizePitch: true,
};

export default NavigationControl;
