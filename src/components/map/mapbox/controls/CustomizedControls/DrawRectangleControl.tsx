import { IControl, Map } from "mapbox-gl";
import MapboxDraw from "@mapbox/mapbox-gl-draw";
import { createRoot, Root } from "react-dom/client";
import BBoxIcon from "../../../../icon/BBoxIcon";

class DrawRectangleControl implements IControl {
  private draw: MapboxDraw;
  private iconRoot: Root | null = null;
  private mainContainer: HTMLDivElement | null = null;
  private map: Map | undefined | null = undefined;
  private container: HTMLDivElement | null = null;

  constructor(draw: MapboxDraw) {
    this.draw = draw;
  }

  onAdd(map: Map) {
    this.map = map;
    this.mainContainer = document.createElement("div");
    this.mainContainer.className = "mapboxgl-ctrl-group mapboxgl-ctrl";
    this.iconRoot = createRoot(this.mainContainer);
    this.iconRoot.render(<BBoxIcon />);
    this.mainContainer.onclick = () => {
      this.draw.changeMode("draw_rectangle");
    };
    this.mainContainer.style.width = "29px";
    this.mainContainer.style.height = "29px";
    this.mainContainer.style.display = "flex";
    this.mainContainer.style.alignItems = "center";
    this.mainContainer.style.justifyContent = "center";

    return this.mainContainer;
  }
  onRemove() {
    this.container?.parentNode?.removeChild(this.container);
    this.map = undefined;
  }
}

export default DrawRectangleControl;
