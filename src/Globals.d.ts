declare module "*.module.css";

import mapboxgl from "mapbox-gl";

declare global {
  interface Document {
    MAP_OBJECT: mapboxgl.Map;
  }
}

export {};
