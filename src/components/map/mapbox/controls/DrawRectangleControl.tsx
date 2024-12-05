import { IControl, Map } from "mapbox-gl";
import MapboxDraw from "@mapbox/mapbox-gl-draw";
import { createRoot, Root } from "react-dom/client";
import BBoxIcon from "../../../icon/BBoxIcon";

class DrawRectangleControl implements IControl {
  private draw: MapboxDraw;
  private iconRoot: Root | null = null;
  private container: HTMLDivElement | null = null;
  private map: Map | undefined | null = undefined;

  constructor(draw: MapboxDraw) {
    this.draw = draw;
  }

  onAdd(map: Map) {
    this.map = map;
    this.container = document.createElement("div");
    this.container.className = "mapboxgl-ctrl-group mapboxgl-ctrl";
    this.iconRoot = createRoot(this.container);
    this.iconRoot.render(<BBoxIcon />);
    this.container.onclick = () => {
      this.draw.changeMode("draw_rectangle");
    };
    this.container.style.width = "29px";
    this.container.style.height = "29px";
    this.container.style.display = "flex";
    this.container.style.alignItems = "center";
    this.container.style.justifyContent = "center";

    return this.container;
  }
  onRemove() {
    this.container?.parentNode?.removeChild(this.container);
    this.map = undefined;
  }
}

export default DrawRectangleControl;
