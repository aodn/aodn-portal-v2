import { IControl, Map } from "mapbox-gl";
import { createRoot, Root } from "react-dom/client";
import MapContext from "../MapContext";
import React, { startTransition, useContext, useEffect, useState } from "react";
import { IconButton } from "@mui/material";
import { borderRadius } from "../../../../styles/constants";
import FullscreenIcon from "@mui/icons-material/Fullscreen";
import CloseFullscreenIcon from "@mui/icons-material/CloseFullscreen";
import { MapEventEnum } from "../constants";
import { portalTheme } from "../../../../styles";
import MenuHintTooltip from "./menu/MenuHintTooltip";

export interface ToggleControlProps {
  showFullMap: boolean;
  onToggleClicked?: (state: boolean) => void;
}

const ToggleButton: React.FC<ToggleControlProps> = ({
  showFullMap,
  onToggleClicked,
}) => {
  return (
    <MenuHintTooltip
      hint={showFullMap ? "Exit fullscreen" : "Fullscreen"}
      disable={false}
      placement="right"
    >
      <IconButton
        id="map-toggle-control-button"
        sx={{
          width: "30px",
          height: "30px",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          backgroundColor: "none",
          // Repeated class beats mapbox's default button rules
          "&.MuiIconButton-root.MuiIconButton-root": {
            borderRadius: borderRadius.small,
            "&:hover": {
              color: "white",
              backgroundColor: portalTheme.palette.secondary1,
            },
          },
        }}
        onClick={() => onToggleClicked?.(!showFullMap)}
      >
        {showFullMap ? (
          <CloseFullscreenIcon sx={{ height: "100%", width: "100%" }} />
        ) : (
          <FullscreenIcon sx={{ height: "100%", width: "100%" }} />
        )}
      </IconButton>
    </MenuHintTooltip>
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
    // Align with the zoom buttons below
    this.container.style.marginLeft = "10px";
    this.container.style.marginBottom = "4px";
    // Match the button's hover radius so the white group background
    // does not peek out at the corners
    this.container.style.borderRadius = "6px";
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

    map.on(MapEventEnum.ZOOM_START, this.buttonDisable);
    map.on(MapEventEnum.ZOOM_END, this.buttonEnable);

    map.on(MapEventEnum.MOVE_START, this.buttonDisable);
    map.on(MapEventEnum.MOVE_END, this.buttonEnable);

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

    map.off(MapEventEnum.ZOOM_START, this.buttonDisable);
    map.off(MapEventEnum.ZOOM_END, this.buttonEnable);

    map.off(MapEventEnum.MOVE_START, this.buttonDisable);
    map.off(MapEventEnum.MOVE_END, this.buttonEnable);
  }
}

const ToggleControl = ({
  showFullMap = false,
  onToggleClicked = undefined,
}: ToggleControlProps) => {
  const { map } = useContext(MapContext);
  const [control, setControl] = useState<ToggleControlClass | null>(null);

  useEffect(() => {
    if (map === null) return;
    // Only create once
    startTransition(() => {
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
    });
  }, [map, showFullMap, onToggleClicked]);

  useEffect(() => control?.redraw(showFullMap), [showFullMap, control]);

  return <React.Fragment />;
};

export default ToggleControl;
