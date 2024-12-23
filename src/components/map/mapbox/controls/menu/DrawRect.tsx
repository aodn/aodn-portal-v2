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
import BBoxIcon from "../../../../icon/BBoxIcon";
import DrawRectangle from "./DrawRectangle";
import { ControlProps } from "./Definition";

interface DrawControlProps extends ControlProps {
  getAndSetDownloadConditions: (
    type: DownloadConditionType,
    conditions: IDownloadCondition[]
  ) => IDownloadCondition[];
}

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

  useEffect(() => {
    if (map) {
      const updateArea = () => {
        const features = mapDraw.getAll().features;
        const bboxes: BBoxCondition[] =
          features
            ?.filter((feature) => feature.geometry.type === "Polygon")
            .map((feature) => {
              const polygon = feature.geometry as Polygon;
              const bbox = turf.bbox(polygon);
              const id = _.toString(feature.id);
              return new BBoxCondition(id, bbox, () => mapDraw.delete(id));
            }) || [];
        getAndSetDownloadConditions(DownloadConditionType.BBOX, bboxes);
      };

      map.addControl(mapDraw);
      map.on("draw.create", updateArea);
      map.on("draw.delete", updateArea);
      map.on("draw.update", updateArea);

      return () => {
        try {
          map.off("draw.create", updateArea);
          map.off("draw.delete", updateArea);
          map.off("draw.update", updateArea);
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
      id="draw-rect-menu-button"
      ref={anchorRef}
      onClick={() => mapDraw.changeMode("draw_rectangle")}
      sx={{ paddingTop: "3px !important" }}
    >
      <BBoxIcon />
    </IconButton>
  );
};

export default DrawRect;
