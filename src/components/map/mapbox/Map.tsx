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
import { MapDefaultConfig, MapEventEnum } from "./constants";
import { CircularProgress, Paper } from "@mui/material";
import { portalTheme } from "../../../styles";
import { InfoStatusType } from "../../info/InfoDefinition";
import InfoCard from "../../info/InfoCard";

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
    name: "Street Map",
    style: "mapbox://styles/mapbox/streets-v12",
  },
  {
    id: "2",
    name: "Topographic Map",
    style: "mapbox://styles/mapbox/outdoors-v12",
  },
  {
    id: "3",
    name: "Satellite Map",
    style: "mapbox://styles/mapbox/satellite-v9",
  },
  {
    id: "4",
    name: "World Imagery",
    style: ERSIWorldImagery as StyleSpecification,
    attribution:
      "Sources: Esri, Maxar, Earthstar Geographics, and the GIS User Community",
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
    const [loading, setLoading] = useState<boolean>(false);
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
        const newMap = new Map({
          container: panelId,
          accessToken: import.meta.env.VITE_MAPBOX_ACCESS_TOKEN,
          style: styles[MapDefaultConfig.DEFAULT_STYLE].style,
          minZoom: minZoom,
          maxZoom: maxZoom,
          testMode: import.meta.env.MODE === "playwright-local",
          attributionControl: true,
          localIdeographFontFamily:
            "'Open Sans', 'Open Sans CJK SC', sans-serif",
        });

        newMap.once(MapEventEnum.LOAD, () =>
          // Make sure map draw complete before changing the controls
          setTimeout(() => {
            // Remove scale control if it exists
            const scaleElement = newMap
              .getContainer()
              .querySelector(".mapboxgl-ctrl-scale");
            if (scaleElement) {
              (scaleElement as HTMLElement).style.display = "none";
            }
          }, 0)
        );

        return newMap;
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
        const cancelDebounceAndStartMove = (event: MapEvent) => {
          debounceOnMoveEvent.cancel();
          // Give start move event a chance to send to listener
          onMoveEvent?.(event);
        };

        const cancelDebounceAndStartZoom = (event: MapEvent) => {
          debounceOnZoomEvent.cancel();
          // Give start zoom event a chance to send to listener
          onZoomEvent?.(event);
        };

        map.on(MapEventEnum.MOVE_START, cancelDebounceAndStartMove);
        map.on(MapEventEnum.ZOOM_START, cancelDebounceAndStartZoom);

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

        if (import.meta.env.MODE === "playwright-local") {
          //map.showPadding = true;
          //map.showCollisionBoxes = true;
        }

        setMap(map);

        return () => {
          if (containerRef.current) {
            resizeObserver.unobserve(containerRef.current);
          }
          // We need this when the map destroy
          map.off(MapEventEnum.ZOOM_END, debounceOnZoomEvent);
          map.off(MapEventEnum.MOVE_END, debounceOnMoveEvent);
          map.off(MapEventEnum.MOVE_START, cancelDebounceAndStartMove);
          map.off(MapEventEnum.ZOOM_START, cancelDebounceAndStartZoom);
          map.remove();
          setMap(null);
        };
      };

      const cleanup = setupMap();

      return () => {
        cleanup?.();
      };
    }, [
      initializeMap,
      projection,
      debounceOnZoomEvent,
      debounceOnMoveEvent,
      onMoveEvent,
      onZoomEvent,
    ]);

    useEffect(() => {
      if (!map || !bbox || !containerRef.current?.isConnected) return;
      // Turn off event to avoid looping
      map.off(MapEventEnum.ZOOM_END, debounceOnZoomEvent);
      map.off(MapEventEnum.MOVE_END, debounceOnMoveEvent);
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
      map.on(MapEventEnum.IDLE, () => {
        map.on(MapEventEnum.ZOOM_END, debounceOnZoomEvent);
        map.on(MapEventEnum.MOVE_END, debounceOnMoveEvent);
      });
    }, [bbox, zoom, map, debounceOnZoomEvent, debounceOnMoveEvent, animate]);

    // Only render if map is initialized and container is still connected
    if (!map || !containerRef.current?.isConnected) {
      return null;
    }

    return (
      <MapContext.Provider value={{ map: map, setLoading: setLoading }}>
        {loading && (
          <Paper
            sx={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              position: "absolute",
              backgroundColor: "black",
              opacity: 0.15,
              height: "100%",
              width: "100%",
              zIndex: 500,
            }}
          >
            <CircularProgress
              sx={{ color: "#4ecdc4", opacity: 1 }}
              thickness={6}
            />
          </Paper>
        )}
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
          <InfoCard
            infoContent={{
              body: announcement?.replace(/^model:/, "") || "",
            }}
            status={InfoStatusType.WARNING}
            sx={{
              boxShadow: "unset",
              width: "480px",
              height: "56px",
              bgcolor: portalTheme.palette.primary6,
              borderRadius: "6px",
            }}
            contentSx={{
              padding: 0,
              px: 2,
              textAlign: "center",
              ...portalTheme.typography.title2Regular,
            }}
          />
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
