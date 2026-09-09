import { useEffect, useMemo } from "react";
import { createPortal } from "react-dom";
import { Box, IconButton } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import { Map as MapboxMap, Marker } from "mapbox-gl";
import type { Feature, Polygon, MultiPolygon } from "geojson";

interface Props {
  map: MapboxMap;
  feature: Feature<Polygon | MultiPolygon>;
  number: number;
  onRemove: (id: string) => void;
}

export default function SelectionMarker({
  map,
  feature,
  number,
  onRemove,
}: Props) {
  const element = useMemo(() => document.createElement("div"), []);
  const marker = useMemo(
    () => new Marker({ element, anchor: "bottom-left", offset: [4, -4] }),
    [element]
  );
  const rings =
    feature.geometry.type === "Polygon"
      ? feature.geometry.coordinates
      : feature.geometry.coordinates.flat();
  const points = rings.flat();
  // The easternmost of the northern vertices is the box's top-right corner.
  const corner = points.reduce((best, point) =>
    point[1] > best[1] || (point[1] === best[1] && point[0] > best[0])
      ? point
      : best
  );
  const [lng, lat] = corner;

  useEffect(() => {
    // Stop native events before they reach Mapbox Draw's map listeners.
    const stop = (event: Event) => event.stopPropagation();
    const events = [
      "mousedown",
      "mouseup",
      "click",
      "dblclick",
      "touchstart",
      "touchend",
      "pointerdown",
      "keydown",
    ];
    events.forEach((event) => element.addEventListener(event, stop));
    marker.setLngLat([lng, lat]).addTo(map);
    return () => {
      events.forEach((event) => element.removeEventListener(event, stop));
      marker.remove();
    };
    // Position is updated separately without remounting the marker.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [map, marker, element]);

  useEffect(() => {
    marker.setLngLat([lng, lat]);
  }, [marker, lng, lat]);

  return createPortal(
    <Box
      sx={{
        display: "flex",
        alignItems: "center",
        bgcolor: "background.paper",
        color: "text.primary",
        border: 1,
        borderColor: "divider",
        borderRadius: 1,
        boxShadow: 2,
        pl: 1,
        fontFamily: "inherit",
        fontWeight: 600,
      }}
    >
      <span aria-label={`Selection ${number}`}>{number}</span>
      <IconButton
        size="small"
        aria-label={`Remove selection ${number}`}
        title={`Remove selection ${number}`}
        onClick={(event) => {
          event.stopPropagation();
          onRemove(String(feature.id));
        }}
      >
        <CloseIcon fontSize="small" />
      </IconButton>
    </Box>,
    element
  );
}
