/**
 * The single runtime entry point for mapbox-gl.
 *
 * Map.tsx builds maps from the ESM build ("mapbox-gl/esm", which works with
 * the CSP worker under Vite). Other files import "mapbox-gl". vite.config.ts
 * aliases that name here for builds, and tsconfig paths does the same for
 * typecheck, so values and types are this one ESM copy. "mapbox-gl/esm" stays
 * the real package.
 */
import * as mapboxgl from "mapbox-gl/esm";
import { setWorkerUrl } from "mapbox-gl/esm";
// eslint-disable-next-line import/extensions
import workerUrl from "mapbox-gl/dist/mapbox-gl-csp-worker.js?url";

// The ESM build has no default export, so workerUrl cannot be assigned on it.
setWorkerUrl(workerUrl);

export * from "mapbox-gl/esm";
export default mapboxgl;
