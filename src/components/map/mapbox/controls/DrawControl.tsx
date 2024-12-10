import React, { useCallback, useEffect, useRef, useState } from "react";
import { Polygon } from "geojson";
import * as turf from "@turf/turf";
import { Map } from "mapbox-gl";
import MapboxDraw from "@mapbox/mapbox-gl-draw";

import "mapbox-gl/dist/mapbox-gl.css";
import "@mapbox/mapbox-gl-draw/dist/mapbox-gl-draw.css";
import DrawRectangleControl from "./DrawRectangleControl";
import {
  BBoxCondition,
  DownloadConditionType,
  IDownloadCondition,
} from "../../../../pages/detail-page/context/DownloadDefinitions";
import _ from "lodash";

interface DrawControlProps {
  map: Map | undefined | null;
  setDownloadConditions: (
    type: DownloadConditionType,
    conditions: IDownloadCondition[]
  ) => void;
  draw: MapboxDraw;
}

const DrawControl: React.FC<DrawControlProps> = ({
  map,
  setDownloadConditions,
  draw,
}) => {
  const [open, setOpen] = useState<boolean>(false);

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
    const updateArea = () => {
      const features = draw.getAll().features;
      const bboxes: BBoxCondition[] =
        features
          ?.filter((feature) => feature.geometry.type === "Polygon")
          .map((feature) => {
            const polygon = feature.geometry as Polygon;
            const bbox = turf.bbox(polygon);
            const id = _.toString(feature.id);
            return new BBoxCondition(bbox, id);
          }) || [];
      setDownloadConditions(DownloadConditionType.BBOX, bboxes);
    };

    if (map) {
      map.addControl(new DrawRectangleControl(draw), "top-right");
      map.addControl(draw);

      map.on("draw.create", updateArea);
      map.on("draw.delete", updateArea);
      map.on("draw.update", updateArea);
    }

    return () => {
      if (!map) return;
      try {
        map.off("draw.create", updateArea);
        map.off("draw.delete", updateArea);
        map.off("draw.update", updateArea);
        map.removeControl(draw);
      } catch (ignored) {
        /* can be ignored */
      }
    };
  }, [draw, map, setDownloadConditions]);

  return <></>;
};

export default DrawControl;
