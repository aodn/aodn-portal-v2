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
import { IconButton } from "@mui/material";
import DrawRectangle from "./DrawRectangle";
import { ControlProps } from "./Definition";
import { BboxSelectionIcon } from "../../../../../assets/map/bbox_selection";
import { switcherIconButtonSx } from "./MenuControl";
import { color } from "../../../../../styles/constants";

interface DrawControlProps extends ControlProps {
  getAndSetDownloadConditions: (
    type: DownloadConditionType,
    conditions: IDownloadCondition[]
  ) => IDownloadCondition[];
}

const MENU_ID = "draw-rect-menu-button";

const DrawRect: React.FC<DrawControlProps> = ({
  map,
  getAndSetDownloadConditions,
}) => {
  const [open, setOpen] = useState<boolean>(false);
  const mapDraw = useMemo<MapboxDraw>(
    () =>
      new MapboxDraw({
        displayControlsDefault: false,
        controls: {
          trash: true,
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
    }, 100);
    return () => clearInterval(modePollingInterval);
  }, [mapDraw]);

  useEffect(() => {
    const style = document.createElement("style");
    style.textContent = `
    .mapboxgl-ctrl-group .mapbox-gl-draw_ctrl-draw-btn.mapbox-gl-draw_trash {
      width: 40px;
      height: 40px;
    }
  `;
    document.head.appendChild(style);

    return () => {
      document.head.removeChild(style);
    };
  }, []);

  useEffect(() => {
    if (map) {
      // This function also handle delete, the reason is draw.delete works on the highlighted draw item on map
      // so the below logic looks for remain valid box and set all effectively remove the item
      const onCreateOrUpdate = () => {
        const features = mapDraw.getAll().features;
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
  );
};

export default DrawRect;
