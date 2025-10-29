import { IControl, Map } from "mapbox-gl";
import { createRoot, Root } from "react-dom/client";
import MapContext from "../MapContext";
import React, { useContext, useEffect, useState } from "react";
import { IconButton } from "@mui/material";
import { borderRadius } from "../../../../styles/constants";
import FullscreenIcon from "@mui/icons-material/Fullscreen";
import CloseFullscreenIcon from "@mui/icons-material/CloseFullscreen";
import { MOVE_END, MOVE_START, ZOOM_END, ZOOM_START } from "../Map";

export interface ToggleControlProps {
  showFullMap: boolean;
  onToggleClicked?: (state: boolean) => void;
}

const ToggleButton: React.FC<ToggleControlProps> = ({
  showFullMap,
  onToggleClicked,
}) => {
  return (
    <IconButton
      id="map-toggle-control-button"
      title={showFullMap ? "Exit fullscreen" : "Fullscreen"}
      style={{
        width: "32px",
        height: "32px",
        borderRadius: borderRadius.small,
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
      }}
      onClick={() => {
        if (onToggleClicked) {
          onToggleClicked(!showFullMap);
        }
      }}
    >
      {showFullMap ? (
        <CloseFullscreenIcon fontSize="small" />
      ) : (
        <FullscreenIcon fontSize="medium" />
      )}
    </IconButton>
  );
};

class ToggleControlClass implements IControl {
  private container: HTMLDivElement | null = null;
  private root: Root | null = null;
  private props: ToggleControlProps;
  private buttonDisable: () => void = () => {};
  private buttonEnable: () => void = () => {};

  constructor(props: ToggleControlProps) {
    this.props = props;
  }

  redraw(showFullMap: boolean) {
    this.root?.render(
      <ToggleButton
        onToggleClicked={this.props.onToggleClicked}
        showFullMap={showFullMap}
      />
    );
  }

  onAdd(map: Map): HTMLElement {
    this.container = document.createElement("div");
    this.container.className = "mapboxgl-ctrl mapboxgl-ctrl-group";
    this.root = createRoot(this.container!);
    this.redraw(this.props.showFullMap);

    this.buttonDisable = () => {
      if (this.container) {
        this.container.style.pointerEvents = "none";
        this.container.style.opacity = "0.8";
      }
    };

    this.buttonEnable = () => {
      if (this.container) {
        this.container.style.pointerEvents = "auto";
        this.container.style.opacity = "1";
      }
    };

    map.on(ZOOM_START, this.buttonDisable);
    map.on(ZOOM_END, this.buttonEnable);

    map.on(MOVE_START, this.buttonDisable);
    map.on(MOVE_END, this.buttonEnable);

    return this.container;
  }

  onRemove(map: Map): void {
    if (this.container?.parentNode) {
      // https://github.com/facebook/react/issues/25675#issuecomment-1518272581
      // Keep the old pointer
      setTimeout(() => {
        this.container?.parentNode?.removeChild(this.container);
        this.container = null;
        this.root?.unmount();
      });
    }

    map.off(ZOOM_START, this.buttonDisable);
    map.off(ZOOM_END, this.buttonEnable);

    map.off(MOVE_START, this.buttonDisable);
    map.off(MOVE_END, this.buttonEnable);
  }
}

const ToggleControl = ({
  showFullMap = false,
  onToggleClicked = (v: boolean) => {},
}: ToggleControlProps) => {
  const { map } = useContext(MapContext);
  const [control, setControl] = useState<ToggleControlClass | null>(null);

  useEffect(() => {
    if (map === null) return;
    // Only create once
    setControl((prev) => {
      if (!prev) {
        const n = new ToggleControlClass({
          showFullMap: showFullMap,
          onToggleClicked: onToggleClicked,
        });
        map?.addControl(n, "top-left");
        return n;
      }
      return prev;
    });
  }, [map, showFullMap, onToggleClicked]);

  useEffect(() => control?.redraw(showFullMap), [showFullMap, control]);

  return <React.Fragment />;
};

export default ToggleControl;
