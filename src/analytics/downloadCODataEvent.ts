import { MultiPolygon, Polygon } from "geojson";
import * as turf from "@turf/turf";

/**
 * Calculates bounding boxes for each polygon in a MultiPolygon
 * Input: MultiPolygon with coordinates
 * Output: { bbox_1: "[minLon,minLat,maxLon,maxLat]", bbox_2: "...", ... }
 */
export const calculateBboxes = (
  multiPolygon: MultiPolygon | null | undefined
): Record<string, string> => {
  if (!multiPolygon?.coordinates) {
    return {};
  }

  const boundingBoxes: Record<string, string> = {};

  multiPolygon.coordinates.forEach((polygonCoordinates, polygonIndex) => {
    const polygon: Polygon = {
      type: "Polygon",
      coordinates: polygonCoordinates,
    };

    const [minLon, minLat, maxLon, maxLat] = turf.bbox(polygon);

    const bboxKey = `bbox_${polygonIndex + 1}`;
    const bboxValue = `[${minLon},${minLat},${maxLon},${maxLat}]`;

    boundingBoxes[bboxKey] = bboxValue;
  });

  return boundingBoxes;
};
