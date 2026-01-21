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
import { MapDefaultConfig, MapEventEnum } from "../constants";

interface NavigationControlProps {
  visible?: boolean;
  showCompass?: boolean;
  showZoom?: boolean;
  visualizePitch?: boolean;
}

const MAP_LEFT_CONTROL_CONTAINER = "map-left-control-container";

class StyledNavigationControl extends MapboxNavigationControl {
  private readonly zoomReset: HTMLButtonElement | undefined = undefined;
  private map: Mapbox | undefined = undefined;
  private container: HTMLDivElement | undefined = undefined;
  private zoomResetHandler: (event: MouseEvent) => void = () => {};
  private zoomButtonDisable: () => void = () => {};
  private zoomButtonEnable: () => void = () => {};
  private pointerOverHandler: (event: PointerEvent) => void;
  private pointerOutHandler: (event: PointerEvent) => void;

  private static readonly ICON_PX = "39px";

  constructor(options: {
    showCompass?: boolean;
    showZoom?: boolean;
    visualizePitch?: boolean;
  }) {
    super(options); // Pass options to parent class
    // create our own button
    const zoomResetSpan = document.createElement("span");
    zoomResetSpan.className = "mapboxgl-ctrl-icon";
    zoomResetSpan.dataset.normalSvg = `url("data:image/svg+xml;charset=utf8,${encodeURIComponent(renderToStaticMarkup(<ZoomResetIcon />))}")`;
    zoomResetSpan.dataset.hoverSvg = `url("data:image/svg+xml;charset=utf8,${encodeURIComponent(renderToStaticMarkup(<ZoomResetIcon hover={true} />))}")`;
    zoomResetSpan.style.backgroundImage = zoomResetSpan.dataset.normalSvg;
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
    this.zoomReset.style.borderTop = "0px";

    this.pointerOverHandler = (event: PointerEvent) => {
      if (event?.target instanceof Element) {
        const icon = event.target.closest<HTMLButtonElement>(
          ".mapboxgl-ctrl-icon"
        );
        if (icon) icon.style.backgroundImage = icon.dataset.hoverSvg || "";
      }
    };

    this.pointerOutHandler = (event: PointerEvent) => {
      if (event?.target instanceof Element) {
        const icon = event.target.closest<HTMLButtonElement>(
          ".mapboxgl-ctrl-icon"
        );
        if (icon) icon.style.backgroundImage = icon.dataset.normalSvg || "";
      }
    };
  }

  onAdd(map: Mapbox): HTMLElement {
    this.container = super.onAdd(map) as HTMLDivElement;
    this.container.id = MAP_LEFT_CONTROL_CONTAINER;
    this.container.style.cssText = `
      align-content: left;
      border: 0 !important;
      border-radius: 0 !important;
      border-style: none !important;
      box-shadow: none !important;
      background: transparent !important;
      gap: 20px
    `;
    this.container?.addEventListener("pointerover", this.pointerOverHandler);
    this.container?.addEventListener("pointerout", this.pointerOutHandler);

    const zoomIn = this.container.querySelector(
      ".mapboxgl-ctrl-zoom-in"
    ) as HTMLButtonElement | null;

    if (zoomIn) {
      const icon = zoomIn.querySelector(
        ".mapboxgl-ctrl-icon"
      ) as HTMLSpanElement;

      // Change the image to our design, hence keep function
      if (icon) {
        icon.dataset.normalSvg = `url("data:image/svg+xml;charset=utf8,${encodeURIComponent(renderToStaticMarkup(<ZoomInIcon />))}")`;
        icon.dataset.hoverSvg = `url("data:image/svg+xml;charset=utf8,${encodeURIComponent(renderToStaticMarkup(<ZoomInIcon hover={true} />))}")`;
        icon.style.backgroundImage = icon.dataset.normalSvg;
      }
      zoomIn.style.minHeight = StyledNavigationControl.ICON_PX;
      zoomIn.style.minWidth = StyledNavigationControl.ICON_PX;
      zoomIn.style.borderTop = "0px";
    }

    const zoomOut = this.container.querySelector(
      ".mapboxgl-ctrl-zoom-out"
    ) as HTMLButtonElement | null;

    if (zoomOut) {
      const icon = zoomOut.querySelector(
        ".mapboxgl-ctrl-icon"
      ) as HTMLSpanElement;

      // Change the image to our design, hence keep function
      if (icon) {
        icon.dataset.normalSvg = `url("data:image/svg+xml;charset=utf8,${encodeURIComponent(renderToStaticMarkup(<ZoomOutIcon />))}")`;
        icon.dataset.hoverSvg = `url("data:image/svg+xml;charset=utf8,${encodeURIComponent(renderToStaticMarkup(<ZoomOutIcon hover={true} />))}")`;
        icon.style.backgroundImage = icon.dataset.normalSvg;
      }
      zoomOut.style.minHeight = StyledNavigationControl.ICON_PX;
      zoomOut.style.minWidth = StyledNavigationControl.ICON_PX;
      zoomOut.style.borderTop = "0px";
    }

    // Now add our own element
    this.container.appendChild(this.zoomReset!);
    this.zoomResetHandler = () => map.zoomTo(MapDefaultConfig.ZOOM);
    this.zoomReset?.addEventListener("click", this.zoomResetHandler);

    this.zoomButtonDisable = () => {
      if (this.container) {
        this.container.style.pointerEvents = "none";
        this.container.style.opacity = "0.8";
      }
    };

    this.zoomButtonEnable = () => {
      if (this.container) {
        this.container.style.pointerEvents = "auto";
        this.container.style.opacity = "1";
      }
    };

    map.on(MapEventEnum.ZOOM_START, this.zoomButtonDisable);
    map.on(MapEventEnum.ZOOM_END, this.zoomButtonEnable);

    map.on(MapEventEnum.MOVE_START, this.zoomButtonDisable);
    map.on(MapEventEnum.MOVE_END, this.zoomButtonEnable);

    this.map = map;
    return this.container;
  }

  onRemove() {
    super.onRemove();
    this.container?.removeEventListener("pointerover", this.pointerOverHandler);
    this.container?.removeEventListener("pointerout", this.pointerOutHandler);
    this.zoomReset?.removeEventListener("click", this.zoomResetHandler!);
    this.container?.removeChild(this.zoomReset!);

    this.map?.off(MapEventEnum.ZOOM_START, this.zoomButtonDisable);
    this.map?.off(MapEventEnum.ZOOM_END, this.zoomButtonEnable);

    this.map?.off(MapEventEnum.MOVE_START, this.zoomButtonDisable);
    this.map?.off(MapEventEnum.MOVE_END, this.zoomButtonEnable);
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
      // We do not need to destruct the control, it will be call automatically by map
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
      MAP_LEFT_CONTROL_CONTAINER
    ) as HTMLButtonElement;

    if (container) {
      container.style.display = visible ? "block" : "none";
    }
  }, [visible]);
  return <React.Fragment />;
};

export default NavigationControl;
