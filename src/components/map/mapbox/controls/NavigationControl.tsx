import React, { useContext, useEffect, useState } from "react";
import MapContext from "../MapContext";
import {
  NavigationControl as MapboxNavigationControl,
  Map as Mapbox,
} from "mapbox-gl";
import { renderToStaticMarkup } from "react-dom/server";
import { ZoomInIcon } from "../../../../assets/icons/map/zoom_in";
import { ZoomOutIcon } from "../../../../assets/icons/map/zoom_out";
import { ZoomResetIcon } from "../../../../assets/icons/map/zoom_reset";
import { MapDefaultConfig } from "../constants";

interface NavigationControlProps {
  visible?: boolean;
  showCompass?: boolean;
  showZoom?: boolean;
  visualizePitch?: boolean;
}

const CONTAINER_MAP_ZOOM_ID = "map-zoom-reset";

class StyledNavigationControl extends MapboxNavigationControl {
  private readonly zoomReset: HTMLButtonElement | undefined = undefined;
  private map: Mapbox | undefined = undefined;
  private zoomResetHandler: (event: MouseEvent) => void = () => {};
  private zoomButtonDisable: () => void = () => {};
  private zoomButtonEnable: () => void = () => {};

  private static readonly ICON_PX = "39px";

  constructor(options: {
    showCompass?: boolean;
    showZoom?: boolean;
    visualizePitch?: boolean;
  }) {
    super(options); // Pass options to parent class
    // create our own button
    const zoomResetSpan = document.createElement("span");
    zoomResetSpan.className = "mapbox-ctrl-icon";
    zoomResetSpan.style.backgroundImage = `url("data:image/svg+xml;charset=utf8,${encodeURIComponent(renderToStaticMarkup(<ZoomResetIcon />))}")`;
    zoomResetSpan.ariaHidden = "true";
    zoomResetSpan.title = "Zoom Reset";
    zoomResetSpan.style.display = "inline-block";
    zoomResetSpan.style.height = "100%";
    zoomResetSpan.style.width = "100%";

    this.zoomReset = document.createElement("button");
    this.zoomReset.id = "map-zoom-reset";
    this.zoomReset.type = "button";
    this.zoomReset.ariaLabel = "Zoom reset";
    this.zoomReset.ariaHidden = "false";
    this.zoomReset.appendChild(zoomResetSpan);
    this.zoomReset.style.minHeight = StyledNavigationControl.ICON_PX;
    this.zoomReset.style.minWidth = StyledNavigationControl.ICON_PX;
  }

  onAdd(map: Mapbox): HTMLElement {
    const container = super.onAdd(map) as HTMLDivElement;
    container.id = CONTAINER_MAP_ZOOM_ID;
    container.style.cssText = `
      border: 0 !important;
      border-radius: 0 !important;
      border-style: none !important;
      box-shadow: none !important;
      background: transparent !important;
      gap: 20px
    `;

    const zoomIn = container.querySelector(
      ".mapboxgl-ctrl-zoom-in"
    ) as HTMLButtonElement | null;

    if (zoomIn) {
      const icon = zoomIn.querySelector(
        ".mapboxgl-ctrl-icon"
      ) as HTMLSpanElement;

      // Change the image to our design, hence keep function
      if (icon) {
        icon.style.backgroundImage = `url("data:image/svg+xml;charset=utf8,${encodeURIComponent(renderToStaticMarkup(<ZoomInIcon />))}")`;
      }
      zoomIn.style.minHeight = StyledNavigationControl.ICON_PX;
      zoomIn.style.minWidth = StyledNavigationControl.ICON_PX;
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
        icon.style.backgroundImage = `url("data:image/svg+xml;charset=utf8,${encodeURIComponent(renderToStaticMarkup(<ZoomOutIcon />))}")`;
      }
      zoomOut.style.minHeight = StyledNavigationControl.ICON_PX;
      zoomOut.style.minWidth = StyledNavigationControl.ICON_PX;
    }

    // Now add our own element
    container.appendChild(this.zoomReset!);
    this.zoomResetHandler = () => map.zoomTo(MapDefaultConfig.ZOOM);
    this.zoomReset?.addEventListener("click", this.zoomResetHandler);

    this.zoomButtonDisable = () => {
      container.style.pointerEvents = "none";
      container.style.opacity = "0.8";
    };

    this.zoomButtonEnable = () => {
      container.style.pointerEvents = "auto";
      container.style.opacity = "1";
    };

    map.on("zoomstart", this.zoomButtonDisable);
    map.on("zoomend", this.zoomButtonEnable);

    this.zoomButtonDisable();
    this.map = map;
    return container;
  }

  onRemove() {
    super.onRemove();
    this.zoomReset?.removeEventListener("click", this.zoomResetHandler!);
    this.map?.off("zoomstart", this.zoomButtonDisable);
    this.map?.off("zoomend", this.zoomButtonEnable);
  }
}

const NavigationControl = ({
  visible = true,
  showCompass = false,
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
    const container: HTMLButtonElement | null = document.getElementById(
      CONTAINER_MAP_ZOOM_ID
    ) as HTMLButtonElement;

    if (container) {
      container.style.display = visible ? "block" : "none";
    }
  }, [visible]);
  return <React.Fragment />;
};

export default NavigationControl;
