import React, { FC, useContext, useEffect, useState } from "react";
import mapboxgl, { GeoJSONSource } from "mapbox-gl";
import MapContext from "../MapContext";
import { GeoJSON } from "geojson";

interface HeatmapLayerProps {
  data: { lat: number; lon: number }[];
}

const HeatmapLayer2: FC<HeatmapLayerProps> = ({ data }) => {
  const { map } = useContext(MapContext);
  const [heatmapData, setHeatmapData] = useState<GeoJSON.FeatureCollection>({
    type: "FeatureCollection",
    features: [],
  });

  useEffect(() => {
    if (!map) return;

    const convertToGeoJSON = (data: { lat: number; lon: number }[]) => {
      return {
        type: "FeatureCollection",
        features: data.map((point) => ({
          type: "Feature",
          geometry: {
            type: "Point",
            coordinates: [point.lon, point.lat],
          },
          properties: {},
        })),
      };
    };

    setHeatmapData(convertToGeoJSON(data));

    if (!map.getSource("heatmap")) {
      map.addSource("heatmap", {
        type: "geojson",
        data: heatmapData,
      });

      map.addLayer({
        id: "heatmap",
        type: "heatmap",
        source: "heatmap",
        paint: {
          "heatmap-weight": 1,
          "heatmap-intensity": {
            stops: [
              [0, 1],
              [9, 3],
            ],
          },
          "heatmap-color": [
            "interpolate",
            ["linear"],
            ["heatmap-density"],
            0,
            "rgba(33,102,172,0)",
            0.2,
            "rgb(103,169,207)",
            0.4,
            "rgb(209,229,240)",
            0.6,
            "rgb(253,219,199)",
            0.8,
            "rgb(239,138,98)",
            1,
            "rgb(178,24,43)",
          ],
          "heatmap-radius": {
            stops: [
              [0, 2],
              [9, 20],
            ],
          },
          "heatmap-opacity": {
            default: 1,
            stops: [
              [7, 1],
              [9, 0],
            ],
          },
        },
      });
    } else {
      (map.getSource("heatmap") as GeoJSONSource).setData(heatmapData);
    }

    return () => {
      if (map.getLayer("heatmap")) {
        map.removeLayer("heatmap");
      }
      if (map.getSource("heatmap")) {
        map.removeSource("heatmap");
      }
    };
  }, [map, data, heatmapData]);

  return null;
};

export default HeatmapLayer2;
