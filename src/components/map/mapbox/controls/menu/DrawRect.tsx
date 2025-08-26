import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { Polygon } from "geojson";
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
import { BboxSelectionIcon } from "../../../../../assets/map/bbox_selection";
import { switcherIconButtonSx } from "./MenuControl";
import DeleteIcon from "@mui/icons-material/Delete";

interface DrawControlProps extends ControlProps {
  getAndSetDownloadConditions: (
    type: DownloadConditionType,
    conditions: IDownloadCondition[]
  ) => IDownloadCondition[];
}

const MENU_ID = "draw-rect-menu-button";
const TRASH_ID = "draw-rect-trash-button";

const DrawRect: React.FC<DrawControlProps> = ({
  map,
  getAndSetDownloadConditions,
}) => {
  const [open, setOpen] = useState<boolean>(false);
  const [hasFeatures, setHasFeatures] = useState<boolean>(false);

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

  const anchorRef = useRef(null);
  const popperRef = useRef<HTMLDivElement>(null);

  const handleClickOutside = useCallback((event: MouseEvent) => {
    if (!popperRef.current || !anchorRef.current) {
      return;
    }
    if (!popperRef.current.contains(event.target as Node)) {
      setOpen(false);
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
      const features = mapDraw.getAll().features;
      const box: BBoxCondition[] =
        features
          ?.filter((feature) => feature.geometry.type === "Polygon")
          .map((feature) => {
            const polygon = feature.geometry as Polygon;
            const bbox = turf.bbox(polygon);
            const id = _.toString(feature.id);
            return new BBoxCondition(id, bbox, () => mapDraw.delete(id));
          }) || [];
      getAndSetDownloadConditions(DownloadConditionType.BBOX, box);
    }, 0);
  }, [mapDraw, hasFeatures, getAndSetDownloadConditions]);

  useEffect(() => {
    if (open) {
      document.addEventListener("mousedown", handleClickOutside);
    } else {
      document.removeEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [handleClickOutside, open]);

  // Sync button state with actual draw mode
  useEffect(() => {
    const modePollingInterval = setInterval(() => {
      const currentMode = mapDraw.getMode();
      const isDrawingMode = currentMode === "draw_rectangle";
      setOpen(isDrawingMode);

      // Check if there are any features to enable/disable trash button
      const features = mapDraw.getAll().features;
      setHasFeatures(features.length > 0);
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

        const box: BBoxCondition[] =
          features
            ?.filter((feature) => feature.geometry.type === "Polygon")
            .map((feature) => {
              const polygon = feature.geometry as Polygon;
              const bbox = turf.bbox(polygon);
              const id = _.toString(feature.id);
              // The removeCallback will be called when use click the bbox condition delete button
              return new BBoxCondition(id, bbox, () => mapDraw.delete(id));
            }) || [];
        // In case of delete, the box already gone on map, so we just need to remove the condition
        getAndSetDownloadConditions(DownloadConditionType.BBOX, box);
      };

      map.addControl(mapDraw);
      map.on("draw.create", onCreateOrUpdate);
      map.on("draw.delete", onCreateOrUpdate);
      map.on("draw.update", onCreateOrUpdate);

      return () => {
        try {
          map.off("draw.create", onCreateOrUpdate);
          map.off("draw.delete", onCreateOrUpdate);
          map.off("draw.update", onCreateOrUpdate);
          map.removeControl(mapDraw);
        } catch (ignored) {
          /* can be ignored */
        }
      };
    }
  }, [mapDraw, map, getAndSetDownloadConditions]);

  return (
    <Box sx={{ display: "flex", flexDirection: "column", gap: 0 }}>
      <IconButton
        aria-label="draw-rect-menu"
        id={MENU_ID}
        data-testid={MENU_ID}
        ref={anchorRef}
        onClick={() => mapDraw.changeMode("draw_rectangle")}
        sx={switcherIconButtonSx(open)}
      >
        <BboxSelectionIcon />
      </IconButton>

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
          mt: "4px",
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

export default DrawRect;
