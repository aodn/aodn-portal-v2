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
import usePolygonCursorHint from "../../../../../hooks/usePolygonCursorHint";

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

  const { syncHasSelected } = usePolygonCursorHint({
    map,
    activeTool,
    isDrawingMode,
    isDirectSelectMode,
    hasSelectedFeatures,
  });

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

  // Sync button state with actual draw mode
  useEffect(() => {
    const modePollingInterval = setInterval(() => {
      const currentMode = mapDraw.getMode();
      const drawing = currentMode === DRAW_RECTANGLE_MODE;
      const directSelect = currentMode === "direct_select";
      const selected = mapDraw.getSelectedIds().length > 0;

      // Update ref for mousemove handler (no re-render needed)
      syncHasSelected(selected);

      // Only setState when values actually changed to avoid unnecessary re-renders
      setIsDrawingMode((prev) => (prev !== drawing ? drawing : prev));
      setIsDirectSelectMode((prev) =>
        prev !== directSelect ? directSelect : prev
      );
      setHasSelectedFeatures((prev) => (prev !== selected ? selected : prev));

      // Check if there are any features to enable/disable trash button
      try {
        const featureCount = mapDraw.getAll().features.length;
        const hasFeat = featureCount > 0;
        setHasFeatures((prev) => (prev !== hasFeat ? hasFeat : prev));
      } catch (e: unknown) {
        // Ignore error
      }
    }, 100);
    return () => clearInterval(modePollingInterval);
  }, [mapDraw, syncHasSelected]);

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
