import { MultiPolygon } from "geojson";

// ================== UTILITY FUNCTIONS ==================
/**
 * Calculates bounding boxes for each polygon in a MultiPolygon
 * Input: MultiPolygon with coordinates
 * Output: { bbox_1: "[minLon,minLat,maxLon,maxLat]", bbox_2: "...", ... }
 */
export const calculateBboxes = (
  multiPolygon: MultiPolygon | null | undefined
): Record<string, string> => {
  if (!multiPolygon?.coordinates) return {};

  const bboxes: Record<string, string> = {};

  multiPolygon.coordinates.forEach((polygon, index) => {
    // MultiPolygon structure: [[[lon, lat], [lon, lat], ...]]
    // Flatten to get all coordinate pairs
    const allCoords: number[][] = [];

    polygon.forEach((ring) => {
      ring.forEach((coord) => {
        if (Array.isArray(coord) && coord.length >= 2) {
          allCoords.push(coord);
        }
      });
    });

    if (allCoords.length === 0) return;

    const lons = allCoords.map((coord) => coord[0]).filter((n) => !isNaN(n));
    const lats = allCoords.map((coord) => coord[1]).filter((n) => !isNaN(n));

    if (lons.length === 0 || lats.length === 0) return;

    const minLon = Math.min(...lons);
    const maxLon = Math.max(...lons);
    const minLat = Math.min(...lats);
    const maxLat = Math.max(...lats);

    bboxes[`bbox_${index + 1}`] = `[${minLon},${minLat},${maxLon},${maxLat}]`;
  });

  return bboxes;
};
