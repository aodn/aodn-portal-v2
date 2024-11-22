import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { BBox, Polygon } from "geojson";
import * as turf from "@turf/turf";
import { Map } from "mapbox-gl";
import MapboxDraw from "@mapbox/mapbox-gl-draw";
import DrawRectangle from "./DrawRectangle";

import "mapbox-gl/dist/mapbox-gl.css";
import "@mapbox/mapbox-gl-draw/dist/mapbox-gl-draw.css";
import CustomDrawControl from "./CustomDrawControl";

interface DetailMapControlPanelProps {
  map: Map | undefined | null;
}

const DetailMapControlPanel: React.FC<DetailMapControlPanelProps> = ({
  map,
}) => {
  const [open, setOpen] = useState<boolean>(false);
  const [selectedBBoxes, setSelectedBBoxes] = useState<Array<BBox>>([]);
  const addSelectedBBox = useCallback((bbox: BBox) => {
    setSelectedBBoxes((prev) => [...prev, bbox]);
  }, []);
  const removeSelectedBBox = useCallback((bbox: BBox) => {
    setSelectedBBoxes((prev) => prev.filter((b) => b !== bbox));
  }, []);

  useEffect(() => {
    console.log("selectedBBoxes", selectedBBoxes);
  }, [selectedBBoxes]);

  const anchorRef = useRef(null);
  const popperRef = useRef<HTMLDivElement>(null);

  const draw = useMemo(
    () =>
      new MapboxDraw({
        displayControlsDefault: false,
        controls: {
          polygon: true,
          trash: true,
        },
        defaultMode: "draw_polygon",
        modes: {
          ...MapboxDraw.modes,
          draw_rectangle: DrawRectangle,
        },
      }),
    []
  );

  const handleAddBBox = useCallback(() => {
    setOpen(false);
  }, []);

  useEffect(() => {
    console.log("aaamap", map);
  }, [map]);

  const updateArea = useCallback(() => {
    console.log("updateArea");
    const features = draw.getAll().features;
    const bboxes: BBox[] = [];
    features.forEach((feature) => {
      const geo = feature.geometry;
      if (geo.type === "Polygon") {
        const polygon = geo as Polygon;
        const bbox = turf.bbox(polygon);
        if (bbox) {
          bboxes.push(bbox);
        }
      }
      setSelectedBBoxes(bboxes);
    });
  }, [draw]);

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
      map.addControl(new CustomDrawControl(draw), "top-right");
      map.addControl(draw);

      map.on("draw.create", updateArea);
      map.on("draw.delete", updateArea);
      map.on("draw.update", updateArea);
    }

    return () => {
      if (!map) return;
      map.off("draw.create", updateArea);
      map.off("draw.delete", updateArea);
      map.off("draw.update", updateArea);
      map.removeControl(draw);
    };
  }, [map]);

  return <></>;
};

export default DetailMapControlPanel;
