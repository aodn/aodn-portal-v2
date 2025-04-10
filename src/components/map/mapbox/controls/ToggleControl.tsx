import { IControl, Map } from "mapbox-gl";
import { createRoot, Root } from "react-dom/client";
import MapContext from "../MapContext";
import React, { useContext, useEffect, useState } from "react";
import { IconButton } from "@mui/material";
import { borderRadius } from "../../../../styles/constants";
import FullscreenIcon from "@mui/icons-material/Fullscreen";
import CloseFullscreenIcon from "@mui/icons-material/CloseFullscreen";

export interface ToggleControlProps {
  isFullMap: boolean;
  onToggleClicked?: (state: boolean) => void;
}

const ToggleButton: React.FC<ToggleControlProps> = ({
  isFullMap,
  onToggleClicked,
}) => {
  return (
    <IconButton
      id="map-toggle-control-button"
      title="hint of the button"
      style={{
        width: "29px",
        height: "29px",
        borderRadius: borderRadius.small,
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
      }}
      onClick={() => {
        if (onToggleClicked) {
          onToggleClicked(!isFullMap);
        }
      }}
    >
      {isFullMap ? (
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

  constructor(props: ToggleControlProps) {
    this.props = props;
  }

  redraw(isFullMap: boolean) {
    this.root?.render(
      <ToggleButton
        onToggleClicked={this.props.onToggleClicked}
        isFullMap={isFullMap}
      />
    );
  }

  onAdd(map: Map): HTMLElement {
    this.container = document.createElement("div");
    this.container.className = "mapboxgl-ctrl mapboxgl-ctrl-group";
    this.root = createRoot(this.container!);
    this.redraw(this.props.isFullMap);
    return this.container;
  }

  onRemove(_: Map): void {
    console.log("onRemove toggle button");
    if (this.container?.parentNode) {
      // https://github.com/facebook/react/issues/25675#issuecomment-1518272581
      // Keep the old pointer
      setTimeout(() => {
        this.container?.parentNode?.removeChild(this.container);
        this.container = null;
        this.root?.unmount();
      });
    }
  }
}

const ToggleControl = ({
  isFullMap = false,
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
          isFullMap: isFullMap,
          onToggleClicked: onToggleClicked,
        });
        map?.addControl(n, "top-left");
        return n;
      }
      return prev;
    });
  }, [map, isFullMap, onToggleClicked]);

  useEffect(() => control?.redraw(isFullMap), [isFullMap, control]);

  return <React.Fragment />;
};

export default ToggleControl;
