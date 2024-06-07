import { IControl, Map } from "mapbox-gl";
import { createRoot, Root } from "react-dom/client";
import MapContext from "../MapContext";
import React, { useContext, useEffect, useRef, useState } from "react";
import { IconButton } from "@mui/material";
import { borderRadius } from "../../../../styles/constants";
import ArrowBackIosNewIcon from "@mui/icons-material/ArrowBackIosNew";
import ArrowForwardIosSharpIcon from "@mui/icons-material/ArrowForwardIosSharp";
import { SearchResultLayoutContext } from "../../../../pages/search-page/SearchPage";

interface ToggleControlProps {
  showFullMap: boolean;
  onToggleClicked?: (state: boolean) => void;
}

const ToggleButton: React.FC<ToggleControlProps> = ({
  showFullMap,
  onToggleClicked,
}) => {
  const [toggle, setToggle] = useState<boolean>(showFullMap);
  return (
    <IconButton
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
        const v = !toggle;
        setToggle(v);

        if (onToggleClicked) {
          onToggleClicked(v);
        }
      }}
    >
      {toggle ? (
        <ArrowForwardIosSharpIcon fontSize="small" />
      ) : (
        <ArrowBackIosNewIcon fontSize="small" />
      )}
    </IconButton>
  );
};

class ToggleControlClass implements IControl {
  private container: HTMLDivElement;
  private root: Root;
  private props: ToggleControlProps;

  constructor(props: ToggleControlProps) {
    this.props = props;
  }

  onAdd(map: Map): HTMLElement {
    this.container = document.createElement("div");
    this.container.className = "mapboxgl-ctrl mapboxgl-ctrl-group";
    this.root = createRoot(this.container!);
    this.root.render(
      <ToggleButton
        onToggleClicked={this.props.onToggleClicked}
        showFullMap={this.props.showFullMap}
      />
    );
    return this.container;
  }

  onRemove(_: Map): void {
    console.log("onRemove toggle button");
    if (this.container.parentNode) {
      // https://github.com/facebook/react/issues/25675#issuecomment-1518272581
      // Keep the old pointer
      setTimeout(() => {
        this.container.parentNode.removeChild(this.container);
        this.container = null;
        this.root.unmount();
      });
    }
  }
}

const ToggleControl = (props: ToggleControlProps) => {
  const { map } = useContext(MapContext);
  const [init, setInit] = useState<boolean>(false);

  useEffect(() => {
    if (map === null) return;
    setInit((prev) => {
      if (!prev) {
        const n = new ToggleControlClass({
          showFullMap: props.showFullMap,
          onToggleClicked: props?.onToggleClicked,
        });
        map.addControl(n, "top-left");
      }
      return true;
    });
  }, [map, props]);

  return <React.Fragment />;
};

ToggleControl.defaultProps = {
  showFullMap: false,
  onToggleClicked: (v: boolean) => {},
};

export default ToggleControl;
