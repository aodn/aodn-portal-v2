/**
 * The single runtime entry point for mapbox-gl.
 *
 * Map.tsx builds maps from the ESM build ("mapbox-gl/esm", which works with
 * the CSP worker under Vite), but every other file imported classes such as
 * LngLatBounds or Popup from "mapbox-gl", which resolves to the separate UMD
 * build. Production therefore shipped and ran mapbox-gl twice (~500 kB gzip
 * each) and mixed classes from two copies of the library.
 *
 * vite.config.ts aliases "mapbox-gl" to this module for builds, so all of
 * those imports now share this one ESM copy. TypeScript ignores the alias, so
 * types still come from "mapbox-gl" as before.
 */
import mapboxgl from "mapbox-gl/esm";
// eslint-disable-next-line import/extensions
import workerUrl from "mapbox-gl/dist/mapbox-gl-csp-worker.js?url";

mapboxgl.workerUrl = workerUrl;

// Every class imported as a value from "mapbox-gl" anywhere in src. If a new
// one is needed and missing here, the build fails with "is not exported".
export const {
  AttributionControl,
  LngLat,
  LngLatBounds,
  Map,
  Marker,
  MercatorCoordinate,
  NavigationControl,
  Popup,
  ScaleControl,
} = mapboxgl;

export default mapboxgl;
