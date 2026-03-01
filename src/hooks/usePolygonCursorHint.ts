import { useCallback, useEffect, useRef } from "react";
import type { Map as MapboxMap, MapMouseEvent } from "mapbox-gl";
import {
  CURSOR_HINT_BUBBLE_SVG,
  CURSOR_HINT_BUBBLE_VIEWBOX,
  CURSOR_HINT_BUBBLE_WIDTH,
  CURSOR_HINT_BUBBLE_HEIGHT,
} from "../assets/icons/map/cursor_hint_bubble";

interface UsePolygonCursorHintProps {
  map: MapboxMap | undefined;
  activeTool: string;
  isDrawingMode: boolean;
  isDirectSelectMode: boolean;
  hasSelectedFeatures: boolean;
}

/**
 * Manages the crosshair cursor and cursor-following hint bubble
 * when the polygon selection tool is active.
 */
const usePolygonCursorHint = ({
  map,
  activeTool,
  isDrawingMode,
  isDirectSelectMode,
  hasSelectedFeatures,
}: UsePolygonCursorHintProps) => {
  const cursorHintRef = useRef<HTMLDivElement | null>(null);
  const isPolygonActiveRef = useRef(false);
  const hasSelectedRef = useRef(false);
  const cursorStyleRef = useRef<HTMLStyleElement | null>(null);

  // Keep hasSelectedRef in sync for the mousemove handler
  const syncHasSelected = useCallback((value: boolean) => {
    hasSelectedRef.current = value;
  }, []);

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

  // Cursor-following hint bubble
  useEffect(() => {
    if (!map) return;

    const container = map.getContainer();
    const hint = document.createElement("div");
    hint.style.cssText =
      "position:absolute;pointer-events:none;z-index:10;display:none;" +
      "width:" +
      CURSOR_HINT_BUBBLE_WIDTH +
      "px;max-width:320px;height:" +
      CURSOR_HINT_BUBBLE_HEIGHT +
      "px;";

    // SVG bubble from design
    const svgEl = document.createElementNS("http://www.w3.org/2000/svg", "svg");
    svgEl.setAttribute("viewBox", CURSOR_HINT_BUBBLE_VIEWBOX);
    svgEl.setAttribute("preserveAspectRatio", "none");
    svgEl.setAttribute("fill", "none");
    svgEl.style.cssText =
      "position:absolute;top:0;left:0;width:100%;height:100%;";
    svgEl.innerHTML = CURSOR_HINT_BUBBLE_SVG;

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
        if (hasSelectedRef.current) {
          textSpan.textContent = "Click to adjust vertices.";
          cursorHintRef.current.style.width = CURSOR_HINT_BUBBLE_WIDTH + "px";
        } else {
          textSpan.textContent = "Click to add points, double-click to finish.";
          cursorHintRef.current.style.width = "200px";
        }
        cursorHintRef.current.style.display = "block";
        // Arrow tip in SVG is at (0, 15), align with cursor
        cursorHintRef.current.style.left = e.point.x + 10 + "px";
        cursorHintRef.current.style.top = e.point.y - 15 + "px";
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
  }, [map]);

  return { syncHasSelected };
};

export default usePolygonCursorHint;
