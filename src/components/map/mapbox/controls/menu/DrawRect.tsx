import React, {
  startTransition,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { Polygon, Feature, MultiPolygon } from "geojson";
import MapboxDraw from "@mapbox/mapbox-gl-draw";

import "mapbox-gl/dist/mapbox-gl.css";
import "@mapbox/mapbox-gl-draw/dist/mapbox-gl-draw.css";

import { Box, IconButton } from "@mui/material";
import DrawRectangle from "./DrawRectangle";
import { ControlProps } from "./Definition";
import { BboxSelectionIcon } from "@/assets/icons/map/bbox_selection";
import { switcherIconButtonSx } from "./MenuControl";
import MenuHintTooltip from "./MenuHintTooltip";
import DeleteIcon from "@mui/icons-material/Delete";
import { BboxTooltipIcon } from "@/assets/icons/map/tooltip_bbox";
import MenuTooltip from "./MenuTooltip";
import { PolygonSelectionTooltipIcon } from "@/assets/icons/map/tooltip_polygon_selection";
import { PolygonSelectionIcon } from "@/assets/icons/map/polygon_selection";
import usePolygonCursorHint from "../../../../../hooks/usePolygonCursorHint";
import { IControl } from "mapbox-gl";
import { isValidPolygonFeature } from "@/utils/GeoJsonUtils";
import { setMapDrawInteractionActive } from "@/utils/MapUtils";

interface DrawControlProps extends ControlProps {
  onChangeFeatures?: (
    features: Feature<Polygon | MultiPolygon>[],
    removeFeature: (id: string) => void
  ) => void;
  features?: Feature<Polygon | MultiPolygon>[];
}

const MENU_ID = "draw-rect-menu-button";
const POLYGON_MENU_ID = "draw-polygon-menu-button";
const TRASH_ID = "draw-rect-trash-button";
const DRAW_RECTANGLE_MODE = "draw_rectangle";
const DRAW_POLYGON_MODE = "draw_polygon";
type SelectionTool = "bbox" | "polygon";

const DrawRect: React.FC<DrawControlProps> = ({
  map,
  onChangeFeatures,
  features = [],
}) => {
  const [isDrawingMode, setIsDrawingMode] = useState<boolean>(false);
  const [isDirectSelectMode, setIsDirectSelectMode] = useState(false);
  const [activeTool, setActiveTool] = useState<SelectionTool>("bbox");
  const [showTooltip, setShowTooltip] = useState(false);
  const [showPolygonTooltip, setShowPolygonTooltip] = useState(false);
  const [hasFeatures, setHasFeatures] = useState<boolean>(false);
  const [hasSelectedFeatures, setHasSelectedFeatures] = useState(false);
  const activeToolRef = useRef<SelectionTool>("bbox");

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

  const handleIconClick = useCallback(() => {
    if (showTooltip) {
      // If tooltip is showing, close it but keep draw mode active
      setShowTooltip(false);
    } else {
      // Suppress data-layer popups immediately (PMTiles hover etc.)
      setMapDrawInteractionActive(map, true);
      mapDraw.changeMode(DRAW_RECTANGLE_MODE);
      setShowTooltip(true);
    }
    setActiveTool("bbox");
    activeToolRef.current = "bbox";
    setShowPolygonTooltip(false);
  }, [map, mapDraw, showTooltip]);

  const handleCloseTooltip = useCallback(() => {
    setShowTooltip(false);
  }, []);

  const handlePolygonClick = useCallback(() => {
    if (showPolygonTooltip) {
      // If tooltip is showing, close it but keep draw mode active
      setShowPolygonTooltip(false);
    } else {
      setMapDrawInteractionActive(map, true);
      mapDraw.changeMode(DRAW_POLYGON_MODE);
      setShowPolygonTooltip(true);
    }
    setActiveTool("polygon");
    activeToolRef.current = "polygon";
    setShowTooltip(false);
  }, [map, mapDraw, showPolygonTooltip]);

  const handleClosePolygonTooltip = useCallback(() => {
    setShowPolygonTooltip(false);
  }, []);

  // Pass map features to the caller via onChangeFeatures
  const syncMapFeaturesToContext = useCallback(
    (mapDraw: MapboxDraw) => {
      const features = mapDraw
        .getAll()
        .features.filter(
          (feature) =>
            (feature.geometry.type === "Polygon" ||
              feature.geometry.type === "MultiPolygon") &&
            isValidPolygonFeature(feature)
        ) as Feature<Polygon | MultiPolygon>[];

      const removeFeature = (id: string) => {
        try {
          mapDraw.delete(id);
        } catch (error) {
          // Ok to ignore the error as this happens when user try to delete a download condition when map is off
          console.warn(
            "Failed to delete feature from map, but ok to ignore:",
            error
          );
        }
      };

      if (onChangeFeatures) {
        onChangeFeatures(features, removeFeature);
      }
    },
    [onChangeFeatures]
  );

  const [anchorRef, setAnchorRef] = useState<HTMLButtonElement | null>(null);
  const [polygonAnchorRef, setPolygonAnchorRef] =
    useState<HTMLButtonElement | null>(null);
  const popperRef = useRef<HTMLDivElement>(null);

  const { syncHasSelected } = usePolygonCursorHint({
    map,
    activeTool,
    isDrawingMode,
    isDirectSelectMode,
    hasSelectedFeatures,
  });

  const handleClickOutside = useCallback(
    (event: MouseEvent) => {
      if (!popperRef.current || !anchorRef) {
        return;
      }
      if (!popperRef.current.contains(event.target as Node)) {
        setShowTooltip(false);
        setShowPolygonTooltip(false);
      }
    },
    [anchorRef]
  );

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

    startTransition(() => {
      syncMapFeaturesToContext(mapDraw);
    });
  }, [mapDraw, hasFeatures, syncMapFeaturesToContext]);

  // MapboxDraw only wires Delete/Backspace when controls.trash is true.
  // We hide the stock trash control and use our own button, so re-bind the
  // keys to the same delete behaviour.
  useEffect(() => {
    const isEditableTarget = (target: EventTarget | null) => {
      if (!(target instanceof HTMLElement)) return false;
      const tag = target.tagName;
      return (
        tag === "INPUT" ||
        tag === "TEXTAREA" ||
        tag === "SELECT" ||
        target.isContentEditable
      );
    };

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key !== "Delete" && event.key !== "Backspace") return;
      if (!hasFeatures) return;
      if (isEditableTarget(event.target)) return;

      event.preventDefault();
      handleTrashClick();
    };

    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, [hasFeatures, handleTrashClick]);

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

  // Sync button state with actual draw mode and publish interaction flag for
  // data-layer popup suppression (PMTiles hover, GeoServer click, MapPopup).
  useEffect(() => {
    const publishInteraction = (
      drawing: boolean,
      directSelect: boolean,
      selected: boolean
    ) => {
      setMapDrawInteractionActive(map, drawing || directSelect || selected);
    };

    const modePollingInterval = setInterval(() => {
      try {
        const currentMode = mapDraw.getMode();
        const drawing =
          currentMode === DRAW_RECTANGLE_MODE ||
          currentMode === DRAW_POLYGON_MODE;
        const directSelect = currentMode === "direct_select";
        const selected = mapDraw.getSelectedIds().length > 0;

        // Update ref for mousemove handler (no re-render needed)
        syncHasSelected(selected);
        publishInteraction(drawing, directSelect, selected);

        // Only setState when values actually changed to avoid unnecessary re-renders
        setIsDrawingMode((prev) => (prev !== drawing ? drawing : prev));
        setIsDirectSelectMode((prev) =>
          prev !== directSelect ? directSelect : prev
        );
        setHasSelectedFeatures((prev) => (prev !== selected ? selected : prev));

        // Check if there are any features to enable/disable trash button
        const validFeatureCount = mapDraw
          .getAll()
          .features.filter(isValidPolygonFeature).length;
        const hasFeat = validFeatureCount > 0;
        setHasFeatures((prev) => (prev !== hasFeat ? hasFeat : prev));
      } catch {
        // getMode throws before MapboxDraw is fully mounted via onAdd
        publishInteraction(false, false, false);
      }
    }, 100);
    return () => {
      clearInterval(modePollingInterval);
      setMapDrawInteractionActive(map, false);
    };
  }, [map, mapDraw, syncHasSelected]);

  useEffect(() => {
    if (map) {
      const onUpdateOrDelete = () => {
        const validFeatures = mapDraw
          .getAll()
          .features.filter(isValidPolygonFeature);
        setHasFeatures(validFeatures.length > 0);
        syncMapFeaturesToContext(mapDraw);
      };

      // Tag newly created features with the active selection type before syncing
      const onCreate = (e: { features: Feature[] }) => {
        e.features?.forEach((feature) => {
          if (isValidPolygonFeature(feature)) {
            mapDraw.setFeatureProperty(
              String(feature.id),
              "selectionType",
              activeToolRef.current
            );
          }
        });
        onUpdateOrDelete();
      };

      const publishDrawInteractionFromControl = () => {
        try {
          const mode = mapDraw.getMode();
          const isDrawing =
            mode === DRAW_RECTANGLE_MODE || mode === DRAW_POLYGON_MODE;
          const selected = mapDraw.getSelectedIds().length > 0;
          setMapDrawInteractionActive(
            map,
            isDrawing || mode === "direct_select" || selected
          );
        } catch {
          setMapDrawInteractionActive(map, false);
        }
      };

      const onModeChanged = (e: { mode: string }) => {
        const isDrawing =
          e.mode === DRAW_RECTANGLE_MODE || e.mode === DRAW_POLYGON_MODE;
        if (isDrawing) {
          map.dragPan.disable(); // Optional: prevent accidental pan
        } else {
          map.dragPan.enable();
        }
        // Immediate flag update (do not wait for the 100ms poll) so PMTiles
        // hover / other popups suppress as soon as draw mode starts.
        publishDrawInteractionFromControl();
      };

      const onSelectionChanged = () => {
        publishDrawInteractionFromControl();
      };

      map.addControl(mapDraw as unknown as IControl);
      map.on("draw.create", onCreate);
      map.on("draw.delete", onUpdateOrDelete);
      map.on("draw.update", onUpdateOrDelete);
      map.on("draw.modechange", onModeChanged);
      map.on("draw.selectionchange", onSelectionChanged);

      return () => {
        try {
          map.off("draw.create", onCreate);
          map.off("draw.delete", onUpdateOrDelete);
          map.off("draw.update", onUpdateOrDelete);
          map.off("draw.modechange", onModeChanged);
          map.off("draw.selectionchange", onSelectionChanged);
          map.removeControl(mapDraw as unknown as IControl);
          setMapDrawInteractionActive(map, false);
        } catch (ignored) {
          /* can be ignored */
        }
      };
    }
  }, [mapDraw, map, syncMapFeaturesToContext]);

  // Hash of the geometry currently on the map. We use this — instead of the
  // `features` array reference — as the effect dependency, so the map only
  // re-syncs when polygons actually change shape (not when the parent
  // re-renders with identical content).
  const drawnGeometryHash = useMemo(
    () =>
      features
        .filter(isValidPolygonFeature)
        .map(
          (f) =>
            `${f.geometry.type}|${JSON.stringify(
              f.geometry.coordinates
            )}|${f.properties?.selectionType ?? ""}`
        )
        .join("§"),
    [features]
  );

  // Effect for init map draw features (bbox rectangles and polygons)
  useEffect(() => {
    if (!map || !mapDraw) return;

    mapDraw.deleteAll();
    features.filter(isValidPolygonFeature).forEach((f) => mapDraw.add(f));

    // Recreate conditions with new onRemove callback referencing new feature id
    startTransition(() => syncMapFeaturesToContext(mapDraw));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [drawnGeometryHash, map, mapDraw]);

  return (
    <Box sx={{ display: "flex", flexDirection: "column", gap: 0 }}>
      <MenuHintTooltip
        hint="Subset Bounding Box Selection"
        disable={isDrawingMode && activeTool === "bbox"}
      >
        <IconButton
          aria-label="draw-rect-menu"
          id={MENU_ID}
          data-testid={MENU_ID}
          ref={setAnchorRef}
          onClick={handleIconClick}
          sx={switcherIconButtonSx(isDrawingMode && activeTool === "bbox")}
        >
          <BboxSelectionIcon
            color={isDrawingMode && activeTool === "bbox" ? "white" : undefined}
          />
        </IconButton>
      </MenuHintTooltip>

      <MenuTooltip
        open={showTooltip}
        anchorEl={anchorRef}
        title="Bounding Box Selection"
        description="Use bounding box tool to draw a rectangle as selection."
        icon={<BboxTooltipIcon />}
        onClose={handleCloseTooltip}
        hideIconOnSmallScreen
      />

      <MenuHintTooltip
        hint="Subset Polygon Selection"
        disable={isDrawingMode && activeTool === "polygon"}
      >
        <IconButton
          aria-label="polygon-selection-menu"
          id={POLYGON_MENU_ID}
          data-testid={POLYGON_MENU_ID}
          ref={setPolygonAnchorRef}
          onClick={handlePolygonClick}
          sx={switcherIconButtonSx(isDrawingMode && activeTool === "polygon")}
        >
          <PolygonSelectionIcon
            color={
              isDrawingMode && activeTool === "polygon" ? "white" : undefined
            }
          />
        </IconButton>
      </MenuHintTooltip>

      <MenuTooltip
        open={showPolygonTooltip}
        anchorEl={polygonAnchorRef}
        title="Polygon Selection"
        description="Use polygon tool to draw several points to complete a selection."
        icon={<PolygonSelectionTooltipIcon />}
        onClose={handleClosePolygonTooltip}
        hideIconOnSmallScreen
      />

      <MenuHintTooltip hint="Clear Area Selection" disable={!hasFeatures}>
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
      </MenuHintTooltip>
    </Box>
  );
};

export { DRAW_RECTANGLE_MODE, DRAW_POLYGON_MODE };
export default DrawRect;
