import { IControl, Map } from "mapbox-gl";
import { createRoot, Root } from "react-dom/client";
import MapContext from "../MapContext";
import React, { useContext, useEffect, useRef, useState } from "react";
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
        width: "29px",
        height: "29px",
        borderRadius: borderRadius.small,
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
      }}
      onClick={() => {
        setIsShowingResult(!isShowingResult);
      }}
    >
      {isShowingResult ? (
        <ArrowBackIosNewIcon fontSize="small" />
      ) : (
        <ArrowForwardIosSharpIcon fontSize="small" />
      )}
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

  // It will generate warnings. React doesn't allow operating the real DOM directly. Should fix later
  onChange(isShowingResult: boolean) {
    this.root.render(
      <React.Fragment>
        <ToggleButton
          isShowingResult={isShowingResult}
          setIsShowingResult={this.setIsShowingResult}
        />
      </React.Fragment>
    );
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

  onRemove(_: Map): void {
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

  const controlRef = useRef<ToggleControlClass | null>(null);

  useEffect(() => {
    if (map === null) return;
    if (!controlRef.current) {
      controlRef.current = new ToggleControlClass(
        setIsShowingResult,
        isShowingResult
      );
    }
    setInit((prev) => {
      if (!prev) {
        map.addControl(controlRef.current, "top-left");
      } else {
        controlRef.current.onChange(isShowingResult);
      }
      return true;
    });
  }, [isShowingResult, map, setIsShowingResult]);

  return <React.Fragment />;
};

export default ToggleControl;
