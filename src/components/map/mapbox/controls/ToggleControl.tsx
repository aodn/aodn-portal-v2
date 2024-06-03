import { IControl, Map } from "mapbox-gl";
import { createRoot, Root } from "react-dom/client";
import MapContext from "../MapContext";
import React, { useContext, useEffect, useState } from "react";
import { IconButton } from "@mui/material";
import { borderRadius } from "../../../../styles/constants";
import ArrowBackIosNewIcon from "@mui/icons-material/ArrowBackIosNew";
import ArrowForwardIosSharpIcon from "@mui/icons-material/ArrowForwardIosSharp";
import { SearchResultLayoutContext } from "../../../../pages/search-page/SearchPage";

interface ToggleButtonProps {
  isShowingResult: boolean;
  setIsShowingResult: (isShowingResult: boolean) => void;
}

const ToggleButton: React.FC<ToggleButtonProps> = ({
  isShowingResult,
  setIsShowingResult,
}) => {
  return (
    <IconButton
      title="hint of the button"
      style={{
        width: "36px",
        height: "36px",
        borderRadius: borderRadius.small,
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
      }}
      onClick={() => setIsShowingResult(!isShowingResult)}
    >
      {isShowingResult ? <ArrowBackIosNewIcon /> : <ArrowForwardIosSharpIcon />}
    </IconButton>
  );
};

class ToggleControlClass implements IControl {
  private container: HTMLDivElement;
  private root: Root;
  private readonly setIsShowingResult: (value: boolean) => void;
  private readonly isShowingResult: boolean;

  constructor(
    setIsShowingResult: (value: boolean) => void,
    isShowingResult: boolean
  ) {
    this.isShowingResult = isShowingResult;
    this.setIsShowingResult = setIsShowingResult;
  }

  onAdd(_: Map): HTMLElement {
    this.container = document.createElement("div");
    this.container.className = "mapboxgl-ctrl mapboxgl-ctrl-group";
    this.root = createRoot(this.container!);
    this.root.render(
      <ToggleButton
        isShowingResult={this.isShowingResult}
        setIsShowingResult={this.setIsShowingResult}
      />
    );
    return this.container;
  }

  onRemove(map: Map): void {
    this.container.parentNode?.removeChild(this.container);
    this.container = null;
  }
}

const ToggleControl = () => {
  const { map } = useContext(MapContext);
  const [_, setInit] = useState<boolean>(false);
  const { isShowingResult, setIsShowingResult } = useContext(
    SearchResultLayoutContext
  );

  useEffect(() => {
    if (map === null) return;

    setInit((prev) => {
      if (!prev) {
        const n = new ToggleControlClass(setIsShowingResult, isShowingResult);
        map.addControl(n, "top-left");
      }
      return true;
    });
  }, [isShowingResult, map, setIsShowingResult]);

  return <React.Fragment />;
};

export default ToggleControl;
