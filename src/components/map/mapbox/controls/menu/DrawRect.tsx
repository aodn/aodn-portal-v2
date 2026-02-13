import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { Polygon, Feature } from "geojson";
import * as turf from "@turf/turf";
import MapboxDraw from "@mapbox/mapbox-gl-draw";

import type { MapMouseEvent } from "mapbox-gl";
import "mapbox-gl/dist/mapbox-gl.css";
import "@mapbox/mapbox-gl-draw/dist/mapbox-gl-draw.css";
import {
  BBoxCondition,
  DownloadConditionType,
  IDownloadCondition,
} from "../../../../../pages/detail-page/context/DownloadDefinitions";
import _ from "lodash";
import { Box, IconButton } from "@mui/material";
import DrawRectangle from "./DrawRectangle";
import { ControlProps } from "./Definition";
import { BboxSelectionIcon } from "../../../../../assets/icons/map/bbox_selection";
import { switcherIconButtonSx } from "./MenuControl";
import DeleteIcon from "@mui/icons-material/Delete";
import { BboxTooltipIcon } from "../../../../../assets/icons/map/tooltip_bbox";
import MenuTooltip from "./MenuTooltip";
import { PolygonSelectionTooltipIcon } from "../../../../../assets/icons/map/tooltip_polygon_selection";
import { PolygonSelectionIcon } from "../../../../../assets/icons/map/polygon_selection";

interface DrawControlProps extends ControlProps {
  getAndSetDownloadConditions: (
    type: DownloadConditionType,
    conditions: IDownloadCondition[]
  ) => IDownloadCondition[];
  downloadConditions: IDownloadCondition[];
}

const MENU_ID = "draw-rect-menu-button";
const POLYGON_MENU_ID = "draw-polygon-menu-button";
const TRASH_ID = "draw-rect-trash-button";
const DRAW_RECTANGLE_MODE = "draw_rectangle";
type SelectionTool = "bbox" | "polygon";

const DrawRect: React.FC<DrawControlProps> = ({
  map,
  getAndSetDownloadConditions,
  downloadConditions,
}) => {
  const [isDrawingMode, setIsDrawingMode] = useState<boolean>(false);
  const [isDirectSelectMode, setIsDirectSelectMode] = useState(false);
  const [activeTool, setActiveTool] = useState<SelectionTool>("bbox");
  const [showTooltip, setShowTooltip] = useState(false);
  const [showPolygonTooltip, setShowPolygonTooltip] = useState(false);
  const [hasFeatures, setHasFeatures] = useState<boolean>(false);
  const [hasSelectedFeatures, setHasSelectedFeatures] = useState(false);

  const handleIconClick = () => {
    if (showTooltip) {
      // If tooltip is showing, close it but keep draw mode active
      setShowTooltip(false);
    } else if (!isDrawingMode) {
      // If not in draw mode, activate draw mode and show tooltip
      mapDraw.changeMode(DRAW_RECTANGLE_MODE);
      setShowTooltip(true);
    } else {
      // If already in draw mode, just show tooltip again
      setShowTooltip(true);
    }
    setActiveTool("bbox");
    setShowPolygonTooltip(false);
  };

  const handleCloseTooltip = () => {
    setShowTooltip(false);
  };

  const handlePolygonClick = () => {
    if (showPolygonTooltip) {
      // If tooltip is showing, close it but keep draw mode active
      setShowPolygonTooltip(false);
    } else if (!isDrawingMode) {
      // Keep same behavior as bounding box: activate draw mode first
      mapDraw.changeMode(DRAW_RECTANGLE_MODE);
      setShowPolygonTooltip(true);
    } else {
      // If already in draw mode, just show tooltip again
      setShowPolygonTooltip(true);
    }
    setActiveTool("polygon");
    setShowTooltip(false);
  };

  const handleClosePolygonTooltip = () => {
    setShowPolygonTooltip(false);
  };

  const mapDraw = useMemo<MapboxDraw>(
    () =>
      new MapboxDraw({
        displayControlsDefault: false,
        controls: {
          trash: false, // Disable the default trash, handle it ourselves
        },
        defaultMode: "simple_select",
        modes: {
          ...MapboxDraw.modes,
          draw_rectangle: DrawRectangle,
        },
      }),
    []
  );

  // Converts map features to BBoxCondition objects and updates the context
  const syncMapFeaturesToContext = useCallback(
    (mapDraw: MapboxDraw) => {
      const features = mapDraw.getAll().features;
      const newConditions = features
        .filter((feature) => feature.geometry.type === "Polygon")
        .map((feature) => {
          const polygon = feature.geometry as Polygon;
          const bbox = turf.bbox(polygon);
          const id = _.toString(feature.id);

          return new BBoxCondition(id, bbox, () => {
            try {
              mapDraw.delete(id);
            } catch (error) {
              // Ok to ignore the error as this happens when user try to delete a download bbox condition when map is off
              // We use an effect to update the onRemove callback when map is on again
              console.warn(
                "Failed to delete bbox from map, but ok to ignore:",
                error
              );
            }
          });
        });

      getAndSetDownloadConditions(DownloadConditionType.BBOX, newConditions);
      return newConditions;
    },
    [getAndSetDownloadConditions]
  );

  const anchorRef = useRef(null);
  const polygonAnchorRef = useRef(null);
  const popperRef = useRef<HTMLDivElement>(null);
  const cursorHintRef = useRef<HTMLDivElement | null>(null);
  const isPolygonActiveRef = useRef(false);
  const cursorStyleRef = useRef<HTMLStyleElement | null>(null);

  const handleClickOutside = useCallback((event: MouseEvent) => {
    if (!popperRef.current || !anchorRef.current) {
      return;
    }
    if (!popperRef.current.contains(event.target as Node)) {
      setShowTooltip(false);
      setShowPolygonTooltip(false);
    }
  }, []);

  const handleTrashClick = useCallback(() => {
    if (!hasFeatures) return;

    // Get all selected features and delete them
    const selectedFeatures = mapDraw.getSelectedIds();
    if (selectedFeatures.length > 0) {
      mapDraw.delete(selectedFeatures);
    } else {
      // If no features are selected, delete all features
      const allFeatures = mapDraw.getAll().features;
      if (allFeatures.length > 0) {
        mapDraw.deleteAll();
      }
    }

    setTimeout(() => {
      syncMapFeaturesToContext(mapDraw);
    }, 0);
  }, [mapDraw, hasFeatures, syncMapFeaturesToContext]);

  useEffect(() => {
    if (isDrawingMode) {
      document.addEventListener("mousedown", handleClickOutside);
    } else {
      document.removeEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [handleClickOutside, isDrawingMode]);

  // Show hint when drawing or when a box is selected (but not after double-click)
  useEffect(() => {
    isPolygonActiveRef.current =
      activeTool === "polygon" &&
      (isDrawingMode || (hasSelectedFeatures && !isDirectSelectMode));
    if (!isPolygonActiveRef.current && cursorHintRef.current) {
      cursorHintRef.current.style.display = "none";
    }
  }, [activeTool, isDrawingMode, isDirectSelectMode, hasSelectedFeatures]);

  // Inject/remove crosshair cursor when drawing or editing with polygon tool
  useEffect(() => {
    const showCrosshair =
      activeTool === "polygon" && (isDrawingMode || isDirectSelectMode);
    if (showCrosshair && map) {
      if (!cursorStyleRef.current) {
        const style = document.createElement("style");
        const containerId = map.getContainer().id;
        const selector = containerId
          ? "#" + containerId + " .mapboxgl-canvas-container"
          : ".mapboxgl-canvas-container";
        style.textContent =
          selector +
          " { cursor: crosshair !important; } " +
          selector +
          " canvas { cursor: crosshair !important; }";
        document.head.appendChild(style);
        cursorStyleRef.current = style;
      }
    } else {
      if (cursorStyleRef.current) {
        cursorStyleRef.current.remove();
        cursorStyleRef.current = null;
      }
    }
  }, [isDrawingMode, isDirectSelectMode, activeTool, map]);

  // Cursor-following hint for polygon drawing mode
  useEffect(() => {
    if (!map) return;

    const container = map.getContainer();
    const hint = document.createElement("div");
    hint.style.cssText = `
      position: absolute;
      pointer-events: none;
      z-index: 10;
      display: none;
      width: 148px;
      height: 55px;
    `;

    // SVG bubble from design
    const svgEl = document.createElementNS("http://www.w3.org/2000/svg", "svg");
    svgEl.setAttribute("viewBox", "0 0 148 55");
    svgEl.setAttribute("preserveAspectRatio", "none");
    svgEl.setAttribute("fill", "none");
    svgEl.style.cssText =
      "position:absolute;top:0;left:0;width:100%;height:100%;";
    svgEl.innerHTML =
      "<g opacity='0.8' filter='url(#hintFilter)'>" +
      "<path d='M8.99963 4C8.99963 1.79086 10.7905 0 12.9996 0L143.037 " +
      "0C145.231 0 147.016 1.76857 147.036 3.9633L147.463 50.4633C147.483 " +
      "52.6867 145.687 54.5 143.463 54.5H12.9996C10.7905 54.5 8.99963 " +
      "52.7091 8.99963 50.5V21.5995C8.99963 20.0187 8.06872 18.5862 " +
      "6.62424 17.9442L0 15L6.62424 12.0558C8.06872 11.4138 8.99963 " +
      "9.98128 8.99963 8.40055V4Z' fill='white'/></g>" +
      "<defs><filter id='hintFilter' x='0' y='0' width='149.463' " +
      "height='56.5' filterUnits='userSpaceOnUse' " +
      "color-interpolation-filters='sRGB'>" +
      "<feFlood flood-opacity='0' result='bg'/>" +
      "<feBlend mode='normal' in='SourceGraphic' in2='bg' result='shape'/>" +
      "<feColorMatrix in='SourceAlpha' type='matrix' " +
      "values='0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0' " +
      "result='hardAlpha'/>" +
      "<feOffset dx='2' dy='2'/><feGaussianBlur stdDeviation='3'/>" +
      "<feComposite in2='hardAlpha' operator='arithmetic' k2='-1' k3='1'/>" +
      "<feColorMatrix type='matrix' " +
      "values='0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.1 0'/>" +
      "<feBlend mode='normal' in2='shape' result='shadow'/>" +
      "</filter></defs>";

    const textSpan = document.createElement("div");
    textSpan.style.cssText =
      "position:relative;padding:8px 12px 8px 18px;" +
      "font-family:'Open Sans',sans-serif;font-size:14px;" +
      "font-weight:500;color:#090C02;text-align:center;";

    hint.appendChild(svgEl);
    hint.appendChild(textSpan);
    container.appendChild(hint);
    cursorHintRef.current = hint;

    const onMouseMove = (e: MapMouseEvent) => {
      if (!cursorHintRef.current) return;
      if (isPolygonActiveRef.current) {
        const selectedIds = mapDraw.getSelectedIds();
        if (selectedIds.length > 0) {
          textSpan.textContent = "Double-click to draw polygon.";
        } else {
          textSpan.textContent = "Click to draw bounding box.";
        }
        cursorHintRef.current.style.display = "block";
        // Arrow tip in SVG is at (0, 15), align with cursor
        cursorHintRef.current.style.left = `${e.point.x + 10}px`;
        cursorHintRef.current.style.top = `${e.point.y - 15}px`;
      } else {
        cursorHintRef.current.style.display = "none";
      }
    };

    const onMouseLeave = () => {
      if (cursorHintRef.current) {
        cursorHintRef.current.style.display = "none";
      }
    };

    map.on("mousemove", onMouseMove);
    container.addEventListener("mouseleave", onMouseLeave);

    return () => {
      map.off("mousemove", onMouseMove);
      container.removeEventListener("mouseleave", onMouseLeave);
      hint.remove();
      cursorHintRef.current = null;
    };
  }, [map, mapDraw]);

  // Sync button state with actual draw mode
  useEffect(() => {
    const modePollingInterval = setInterval(() => {
      const currentMode = mapDraw.getMode();
      setIsDrawingMode(currentMode === DRAW_RECTANGLE_MODE);
      setIsDirectSelectMode(currentMode === "direct_select");
      setHasSelectedFeatures(mapDraw.getSelectedIds().length > 0);

      // Check if there are any features to enable/disable trash button
      try {
        const features = mapDraw.getAll().features;
        setHasFeatures(features.length > 0);
      } catch (e: unknown) {
        // Ignore error
      }
    }, 100);
    return () => clearInterval(modePollingInterval);
  }, [mapDraw]);

  useEffect(() => {
    if (map) {
      // This function also handle delete, the reason is draw.delete works on the highlighted draw item on map
      // so the below logic looks for remain valid box and set all effectively remove the item
      const onCreateOrUpdate = () => {
        const features = mapDraw.getAll().features;
        setHasFeatures(features.length > 0);
        syncMapFeaturesToContext(mapDraw);
      };

      const onModeChanged = (e: { mode: string }) => {
        const isDrawing = e.mode === DRAW_RECTANGLE_MODE;
        if (isDrawing) {
          map.dragPan.disable(); // Optional: prevent accidental pan
        } else {
          map.dragPan.enable();
        }
      };

      map.addControl(mapDraw);
      map.on("draw.create", onCreateOrUpdate);
      map.on("draw.delete", onCreateOrUpdate);
      map.on("draw.update", onCreateOrUpdate);
      map.on("draw.modechange", onModeChanged);

      return () => {
        try {
          map.off("draw.create", onCreateOrUpdate);
          map.off("draw.delete", onCreateOrUpdate);
          map.off("draw.update", onCreateOrUpdate);
          map.off("draw.modechange", onModeChanged);
          map.removeControl(mapDraw);
        } catch (ignored) {
          /* can be ignored */
        }
      };
    }
  }, [mapDraw, map, syncMapFeaturesToContext]);

  // Effect for init map draw rectangle
  useEffect(() => {
    if (!map || !mapDraw) return;
    const existingBboxConditions = downloadConditions.filter(
      (condition) => condition.type === DownloadConditionType.BBOX
    ) as BBoxCondition[];

    const features = mapDraw.getAll().features;

    // We only need to update map rectangles when number of bbox in context and map are different
    const shouldUpdateDrawRect =
      features.length !== existingBboxConditions.length;

    if (shouldUpdateDrawRect) {
      mapDraw.deleteAll();

      // For each existing bbox conditions from context, we create feature and add to map
      existingBboxConditions.forEach((condition) => {
        const [west, south, east, north] = condition.bbox;
        const feature: Feature<Polygon> = {
          type: "Feature",
          geometry: {
            type: "Polygon",
            coordinates: [
              [
                [west, north],
                [east, north],
                [east, south],
                [west, south],
                [west, north],
              ],
            ],
          },
          properties: {},
        };
        mapDraw.add(feature);
      });

      // Recreate conditions with new onRemove callback referencing new feature id
      setTimeout(() => {
        syncMapFeaturesToContext(mapDraw);
      }, 0);
    }
  }, [downloadConditions, syncMapFeaturesToContext, map, mapDraw]);

  return (
    <Box sx={{ display: "flex", flexDirection: "column", gap: 0 }}>
      <IconButton
        aria-label="draw-rect-menu"
        id={MENU_ID}
        data-testid={MENU_ID}
        ref={anchorRef}
        onClick={handleIconClick}
        sx={switcherIconButtonSx(isDrawingMode && activeTool === "bbox")}
      >
        <BboxSelectionIcon
          color={isDrawingMode && activeTool === "bbox" ? "white" : undefined}
        />
      </IconButton>

      <MenuTooltip
        open={showTooltip}
        anchorEl={anchorRef.current}
        title="Bounding Box Selection"
        description="Use bounding box tool to draw a rectangle as selection."
        icon={<BboxTooltipIcon />}
        onClose={handleCloseTooltip}
      />

      <IconButton
        aria-label="polygon-selection-menu"
        id={POLYGON_MENU_ID}
        data-testid={POLYGON_MENU_ID}
        ref={polygonAnchorRef}
        onClick={handlePolygonClick}
        sx={switcherIconButtonSx(isDrawingMode && activeTool === "polygon")}
      >
        <PolygonSelectionIcon
          color={
            isDrawingMode && activeTool === "polygon" ? "white" : undefined
          }
        />
      </IconButton>

      <MenuTooltip
        open={showPolygonTooltip}
        anchorEl={polygonAnchorRef.current}
        title="Polygon Selection"
        description="Use polygon tool to draw several points to complete a selection."
        icon={<PolygonSelectionTooltipIcon />}
        onClose={handleClosePolygonTooltip}
      />

      <IconButton
        aria-label="Delete"
        id={TRASH_ID}
        data-testid={TRASH_ID}
        onClick={handleTrashClick}
        disabled={!hasFeatures}
        sx={{
          ...switcherIconButtonSx(false),
          opacity: hasFeatures ? 1 : 0.5,
          cursor: hasFeatures ? "pointer" : "not-allowed",
          "&.MuiIconButton-root": { border: "0px solid transparent" },
          "&.Mui-disabled": {
            border: "0px solid transparent",
          },
        }}
      >
        <DeleteIcon />
      </IconButton>
    </Box>
  );
};

export { DRAW_RECTANGLE_MODE };
export default DrawRect;
