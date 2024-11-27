import { IControl, Map } from "mapbox-gl";
import { createRoot, Root } from "react-dom/client";
import MapContext from "../MapContext";
import React, { useContext, useEffect, useState } from "react";
import { IconButton } from "@mui/material";
import { borderRadius } from "../../../../styles/constants";
import ArrowBackIosNewIcon from "@mui/icons-material/ArrowBackIosNew";
import ArrowForwardIosSharpIcon from "@mui/icons-material/ArrowForwardIosSharp";

interface ToggleControlProps {
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
          onToggleClicked(!showFullMap);
        }
      }}
    >
      {showFullMap ? (
        <ArrowForwardIosSharpIcon fontSize="small" />
      ) : (
        <ArrowBackIosNewIcon fontSize="small" />
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
    return this.container;
  }

  onRemove(_: Map): void {
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
