import React, { FC, useContext, useEffect, useRef } from "react";
import { HexagonLayer } from "@deck.gl/aggregation-layers";
import MapContext from "../MapContext";
import { LayerBasicType } from "./Layers";
import { Feature, Point } from "geojson";
import { Box } from "@mui/material";
import { MapboxOverlay } from "@deck.gl/mapbox";

// // Generate 100 random points around San Francisco
// const generateRandomPoints = (
//   centerLng: number,
//   centerLat: number,
//   count: number,
//   radius: number = 0.05 // Approx 5km radius in degrees
// ): FeatureCollection<Point> => {
//   const features: Feature<Point>[] = [];
//
//   for (let i = 0; i < count; i++) {
//     // Generate random offsets
//     const angle = Math.random() * 2 * Math.PI;
//     const distance = Math.sqrt(Math.random()) * radius * 10;
//     const lng = centerLng + i;
//     const lat = centerLat + i;
//
//     features.push({
//       type: "Feature",
//       geometry: {
//         type: "Point",
//         coordinates: [lng, lat],
//       },
//       properties: { id: i, count: i },
//     });
//   }
//
//   return {
//     type: "FeatureCollection",
//     features,
//   };
// };
const HexbinMap: FC<LayerBasicType> = ({ featureCollection }) => {
  const { map } = useContext(MapContext);
  const overlayRef = useRef<MapboxOverlay>();

  useEffect(() => {
    if (map === null) return;

    map?.once("load", () => {
      if (featureCollection === undefined) return;

      const hexagonLayer = new HexagonLayer<Feature<Point>>({
        id: "mapbox-overlay-hexagon-layer",
        // data: "https://raw.githubusercontent.com/visgl/deck.gl-data/master/website/sf-bike-parking.json",
        //
        // gpuAggregation: true,
        // extruded: true,
        // getPosition: (d: any) => d.COORDINATES,
        // getColorWeight: (d: any) => d.SPACES,
        // getElevationWeight: (d: any) => d.SPACES,
        // elevationScale: 4,
        // radius: 100000,
        // pickable: true,
        data: featureCollection.features,
        getPosition: (d: Feature<Point>) => {
          const coords = d.geometry.coordinates;
          return [coords[0], coords[1]]; // [lng, lat]
        },
        getColorWeight: (point: Feature<Point>) => point?.properties?.count + 0,
        getElevationWeight: (point: Feature<Point>) =>
          point?.properties?.count + 0,
        gpuAggregation: true,
        extruded: true,
        radius: 50000,
        // getElevationValue: (v) => v.length,
        // // elevationRange: [0, 1000],
        // // getElevationValue: () => 500,
      });

      const overlay = new MapboxOverlay({
        interleaved: true,
        layers: [hexagonLayer],
      });

      overlayRef.current = overlay;
      map?.addControl(overlay);
    });

    return () => {
      if (overlayRef.current) {
        map?.removeControl(overlayRef.current);
      }
    };
  }, [featureCollection, map]);

  return (
    <Box sx={{ height: "100%", display: "block" }} data-testId={"HexbinMap"} />
  );
};

export default HexbinMap;
