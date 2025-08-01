import React, { memo, useCallback, useEffect, useRef, useState } from "react";
import {
  LngLatBounds,
  Map,
  MapEvent,
  ProjectionSpecification,
  StyleSpecification,
} from "mapbox-gl";
import MapContext from "./MapContext";
import "mapbox-gl/dist/mapbox-gl.css";
import ERSIWorldImagery from "./styles/ESRIWorldImagery.json";
import lodash from "lodash";
import { TestHelper } from "../../common/test/helper";
import { MapDefaultConfig } from "./constants";
import { Paper } from "@mui/material";
import { padding } from "../../../styles/constants";

// Define here to avoid repeat typing and accidentally changed value
// due to typo.
const ZOOM_START = "zoomstart";
const ZOOM_END = "zoomend";
const MOVE_START = "movestart";
const MOVE_END = "moveend";

export interface MapBasicType {
  centerLongitude?: number;
  centerLatitude?: number;
  bbox?: LngLatBounds;
  zoom?: number;
  minZoom?: number;
  maxZoom?: number;
  panelId: string;
  animate?: boolean;
  projection?: ProjectionSpecification | string;
  announcement?: string;
  onZoomEvent?: (event: MapEvent | undefined) => void;
  onMoveEvent?: (event: MapEvent | undefined) => void;
}

interface MapProps extends MapBasicType {}

// Styles can be found here https://developers.arcgis.com/rest/basemap-styles/
// but require feeds.
const styles = [
  {
    id: "1",
    name: "Street map",
    style: "mapbox://styles/mapbox/streets-v12",
  },
  {
    id: "2",
    name: "Topographic map ",
    style: "mapbox://styles/mapbox/outdoors-v12",
  },
  {
    id: "3",
    name: "Satellite map",
    style: "mapbox://styles/mapbox/satellite-v9",
  },
  {
    id: "4",
    name: "World Imagery",
    style: ERSIWorldImagery as StyleSpecification,
  },
  // Add more styles as needed
];

const { WEST_LON, EAST_LON, NORTH_LAT, SOUTH_LAT } =
  MapDefaultConfig.BBOX_ENDPOINTS;
const defaultBbox = new LngLatBounds([
  WEST_LON,
  SOUTH_LAT,
  EAST_LON,
  NORTH_LAT,
]);

const ReactMap = memo(
  ({
    panelId,
    bbox = defaultBbox,
    zoom = MapDefaultConfig.ZOOM,
    minZoom = MapDefaultConfig.MIN_ZOOM,
    maxZoom = MapDefaultConfig.MAX_ZOOM,
    projection = MapDefaultConfig.PROJECTION,
    animate = false,
    announcement = undefined,
    onZoomEvent,
    onMoveEvent,
    children,
  }: React.PropsWithChildren<MapProps>) => {
    const [map, setMap] = useState<Map | null>(null);
    const containerRef = useRef<HTMLElement | null>(null);

    // Debouce to make the map transit smoother
    const debounceOnZoomEvent = useRef(
      lodash.debounce(
        useCallback(
          async (event: MapEvent | undefined) => onZoomEvent?.(event),
          [onZoomEvent]
        ),
        MapDefaultConfig.DEBOUNCE_BEFORE_EVENT_FIRE
      )
    ).current;

    const debounceOnMoveEvent = useRef(
      lodash.debounce(
        useCallback(
          async (event: MapEvent | undefined) => onMoveEvent?.(event),
          [onMoveEvent]
        ),
        MapDefaultConfig.DEBOUNCE_BEFORE_EVENT_FIRE
      )
    ).current;

    const initializeMap = useCallback(() => {
      try {
        // Check if container exists
        containerRef.current = document.getElementById(panelId);
        if (!containerRef.current) {
          return null;
        }

        // Create new map instance
        return new Map({
          container: panelId,
          accessToken: import.meta.env.VITE_MAPBOX_ACCESS_TOKEN,
          style: styles[MapDefaultConfig.DEFAULT_STYLE].style,
          minZoom: minZoom,
          maxZoom: maxZoom,
          testMode: import.meta.env.MODE === "dev",
          attributionControl: false,
          localIdeographFontFamily:
            "'Noto Sans', 'Noto Sans CJK SC', sans-serif",
        });
      } catch (err) {
        console.log("Map initialization failed:", err);
      }
    }, [panelId, minZoom, maxZoom]);

    useEffect(() => {
      const setupMap = () => {
        const map = initializeMap();
        if (!map) return;

        map.setProjection(projection);
        // Stop drag cause map to rotate.
        map.dragRotate.disable();

        // If exist fit the map to this area, this useful if url pass around and
        // the bbox in the url is not the default area of the map
        // Use same function to save processing
        const cancelDebounce = () => debounceOnZoomEvent.cancel();
        map.on(MOVE_START, cancelDebounce);
        map.on(ZOOM_START, cancelDebounce);

        // Do not setup here, the useEffect block will setup it correctly, if you set it here
        // you will get one extra data load which is of no use.
        // map.on("zoomend", debounceOnZoomEvent);
        // map.on("moveend", debounceOnMoveEvent);

        // Create a resize observer to the canvas so we know if its size have changed
        // we need to redraw the map
        const resizeObserver = new ResizeObserver((_) =>
          // https://stackoverflow.com/questions/70533564/mapbox-gl-flickers-when-resizing-the-container-div
          setTimeout(() => {
            try {
              map?.resize();
            } catch (error: any) {
              /* empty */
            }
          }, 0.1)
        );
        resizeObserver.observe(map.getContainer());

        if (import.meta.env.MODE === "dev") {
          //map.showPadding = true;
          //map.showCollisionBoxes = true;
        }

        setMap(map);

        return () => {
          if (containerRef.current) {
            resizeObserver.unobserve(containerRef.current);
          }
          // We need this when the map destroy
          map.off(ZOOM_END, debounceOnZoomEvent);
          map.off(MOVE_END, debounceOnMoveEvent);
          map.off(MOVE_START, cancelDebounce);
          map.off(ZOOM_START, cancelDebounce);
          map.remove();
          setMap(null);
        };
      };

      const cleanup = setupMap();

      return () => {
        cleanup?.();
      };
    }, [initializeMap, projection, debounceOnZoomEvent, debounceOnMoveEvent]);

    useEffect(() => {
      if (!map || !bbox || !containerRef.current?.isConnected) return;
      // Turn off event to avoid looping
      map.off(ZOOM_END, debounceOnZoomEvent);
      map.off(MOVE_END, debounceOnMoveEvent);
      // DO NOT use fitBounds(), it will cause the zoom and padding adjust so
      // you end up map area drift.
      if (animate) {
        map.easeTo({
          center: bbox.getCenter(),
          zoom: zoom,
        });
      } else {
        map.jumpTo({
          center: bbox.getCenter(),
          zoom: zoom,
        });
      }
      map.on("idle", () => {
        map.on(ZOOM_END, debounceOnZoomEvent);
        map.on(MOVE_END, debounceOnMoveEvent);
      });
    }, [bbox, zoom, map, debounceOnZoomEvent, debounceOnMoveEvent, animate]);

    // Only render if map is initialized and container is still connected
    if (!map || !containerRef.current?.isConnected) {
      return null;
    }

    return (
      <MapContext.Provider value={{ map }}>
        <Paper
          data-testid="announcement-panel"
          sx={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            position: "absolute",
            height: "100%",
            width: "100%",
            background: "transparent",
            pointerEvents: announcement?.startsWith("model")
              ? undefined
              : "none",
            visibility: announcement ? "visible" : "hidden",
          }}
        >
          <Paper
            sx={{
              padding: padding.medium,
              backgroundColor: "rgba(255, 255, 255, 0.70)",
              border: "1px solid #8C8C8C",
              borderRadius: "6px",
              backdropFilter: "blur(10px)",
              flexShrink: 0,
              width: {
                xs: "280px",
                sm: "350px",
                md: "480px",
              },
              height: {
                xs: "56px",
                sm: "60px",
                md: "64px",
              },
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: "#090C02",
              textAlign: "center",
              fontSize: "16px",
              fontStyle: "normal",
              fontWeight: 500,
              lineHeight: "14px",
            }}
          >
            {announcement?.replace(/^model:/, "")}
          </Paper>
        </Paper>
        <TestHelper id={panelId} getMap={() => map} />
        {children}
      </MapContext.Provider>
    );
  }
);
ReactMap.displayName = "ReactMap";
export default ReactMap;

export { styles };
