import React, { useContext, useEffect, useState } from "react";
import MapContext from "../MapContext";
import {
  NavigationControl as MapboxNavigationControl,
  Map as Mapbox,
} from "mapbox-gl";
import { renderToStaticMarkup } from "react-dom/server";
import { ZoomInIcon } from "../../../../assets/icons/map/zoom_in";
import { ZoomOutIcon } from "../../../../assets/icons/map/zoom_out";

interface NavigationControlProps {
  visible?: boolean;
  showCompass?: boolean;
  showZoom?: boolean;
  visualizePitch?: boolean;
}

const zoomInSvg = encodeURIComponent(renderToStaticMarkup(<ZoomInIcon />));
const zoomOutSvg = encodeURIComponent(renderToStaticMarkup(<ZoomOutIcon />));

class StyledNavigationControl extends MapboxNavigationControl {
  constructor(options: {
    showCompass?: boolean;
    showZoom?: boolean;
    visualizePitch?: boolean;
  }) {
    super(options); // Pass options to parent class
  }

  onAdd(map: Mapbox): HTMLElement {
    const container = super.onAdd(map);
    container.style.background = "none";
    container.style.paddingBottom = "20px";
    container.style.border = "none";

    const zoomIn = container.querySelector(
      ".mapboxgl-ctrl-zoom-in"
    ) as HTMLButtonElement | null;

    if (zoomIn) {
      const icon = zoomIn.querySelector(
        ".mapboxgl-ctrl-icon"
      ) as HTMLSpanElement;

      // Change the image to our design, hence keep function
      if (icon) {
        icon.style.backgroundImage = `url("data:image/svg+xml;charset=utf8,${zoomInSvg}")`;
      }
      zoomIn.style.minHeight = "35px";
      zoomIn.style.minWidth = "35px";
    }

    const zoomOut = container.querySelector(
      ".mapboxgl-ctrl-zoom-out"
    ) as HTMLButtonElement | null;

    if (zoomOut) {
      const icon = zoomOut.querySelector(
        ".mapboxgl-ctrl-icon"
      ) as HTMLSpanElement;

      // Change the image to our design, hence keep function
      if (icon) {
        icon.style.backgroundImage = `url("data:image/svg+xml;charset=utf8,${zoomOutSvg}")`;
      }
      zoomOut.style.minHeight = "35px";
      zoomOut.style.minWidth = "35px";
    }
    // We do not need the compass
    const compass = container.querySelector(
      ".mapboxgl-ctrl-compass"
    ) as HTMLButtonElement | null;

    if (compass) {
      compass.style.height = "0px";
      compass.style.visibility = "none";
    }
    return container;
  }
}

const NavigationControl = ({
  visible = true,
  showCompass = true,
  showZoom = true,
  visualizePitch = true,
}: NavigationControlProps) => {
  const { map } = useContext(MapContext);
  const [_, setControl] = useState<StyledNavigationControl | undefined>(
    undefined
  );

  useEffect(() => {
    if (map !== null) {
      setControl((prev: StyledNavigationControl | undefined) => {
        if (!prev) {
          const n = new StyledNavigationControl({
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
