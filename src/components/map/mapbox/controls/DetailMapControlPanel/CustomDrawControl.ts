import { IControl, Map } from "mapbox-gl";
import MapboxDraw from "@mapbox/mapbox-gl-draw";

class CustomDrawControl implements IControl {
  private draw: MapboxDraw;
  private containerRec: HTMLButtonElement | null = null;
  private containerImgRec: HTMLImageElement | null = null;
  private mainContainer: HTMLDivElement | null = null;
  private map: Map | undefined | null = undefined;
  private container: HTMLDivElement | null = null;

  constructor(draw: MapboxDraw) {
    this.draw = draw;
  }

  onAdd(map: Map) {
    this.containerRec = document.createElement("button");

    this.map = map;

    this.containerRec.onclick = () => {
      this.draw.changeMode("draw_rectangle");
      const a = this.draw.getAll();
      console.log("draw", a);
    };
    this.containerRec.className =
      "mapbox-gl-draw_ctrl-draw-btn my-custom-control-rec";

    this.containerImgRec = document.createElement("img");
    this.containerImgRec.src =
      "  https://cdn-icons-png.flaticon.com/16/7367/7367908.png";
    this.containerRec.appendChild(this.containerImgRec);

    this.mainContainer = document.createElement("div");

    this.mainContainer.className = "mapboxgl-ctrl-group mapboxgl-ctrl";
    this.mainContainer.appendChild(this.containerRec);

    return this.mainContainer;
  }
  onRemove() {
    this.container?.parentNode?.removeChild(this.container);
    this.map = undefined;
  }
}

export default CustomDrawControl;
