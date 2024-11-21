import React, { useCallback, useEffect, useRef, useState } from "react";
import BBoxIcon from "../../../icon/BBoxIcon";
import XIcon from "../../../icon/XIcon";
import { Map } from "mapbox-gl";
import MapboxDraw from "@mapbox/mapbox-gl-draw";
import * as turf from "@turf/turf";
import { createRoot } from "react-dom/client";

interface PolygonSelectionProps {
  map: Map | undefined | null;
}

const PolygonSelection: React.FC<PolygonSelectionProps> = ({ map }) => {
  const [open, setOpen] = useState<boolean>(false);

  const anchorRef = useRef(null);
  const popperRef = useRef<HTMLDivElement>(null);
  const [roundedArea, setRoundedArea] = useState<number | undefined>(undefined);

  const handleAddBBox = useCallback(() => {
    setOpen(false);
  }, []);

  useEffect(() => {
    console.log("aaamap", map);
  }, [map]);

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
    const draw = new MapboxDraw({
      displayControlsDefault: false,
      controls: {
        polygon: true,
        trash: true,
      },
      defaultMode: "draw_polygon",
      styles: [
        {
          id: "gl-draw-polygon-fill",
          type: "fill",
          paint: {
            "fill-color": "#6e599f",
            "fill-opacity": 0.5,
          },
        },
        {
          id: "gl-draw-polygon-stroke",
          type: "line",
          paint: {
            "line-color": "#6e599f",
            "line-width": 2,
          },
        },
        {
          id: "gl-draw-line",
          type: "line",
          paint: {
            "line-color": "#6e599f",
            "line-width": 2,
          },
        },
        {
          id: "gl-draw-point",
          type: "circle",
          paint: {
            "circle-radius": 5,
            "circle-color": "#6e599f",
          },
        },
      ],
    });

    const updateArea = (e: any) => {
      const data = draw.getAll();
      if (data.features.length > 0) {
        const area = turf.area(data);
        setRoundedArea(Math.round(area * 100) / 100);
      } else {
        setRoundedArea(undefined);
      }
    };
    if (map) {
      map.addControl(draw);

      const drawButton = document.querySelector(".mapbox-gl-draw_polygon");
      if (drawButton) {
        const root = createRoot(drawButton);
        root.render(<BBoxIcon />);
      }

      const trashButton = document.querySelector(".mapbox-gl-draw_trash");
      if (trashButton) {
        const root = createRoot(trashButton);
        root.render(<XIcon />);
      }

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

export default PolygonSelection;
