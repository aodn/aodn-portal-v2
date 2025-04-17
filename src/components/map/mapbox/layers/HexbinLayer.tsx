import React, { FC, useContext, useEffect, useRef } from "react";
import { HexagonLayer } from "@deck.gl/aggregation-layers";
import { MapboxOverlay, MapboxOverlayProps } from "@deck.gl/mapbox";
import MapContext from "../MapContext";
import { LayerBasicType } from "./Layers";
import { Feature, FeatureCollection, Point } from "geojson";

// Generate 100 random points around San Francisco
const generateRandomPoints = (
  centerLng: number,
  centerLat: number,
  count: number,
  radius: number = 0.05 // Approx 5km radius in degrees
): FeatureCollection<Point> => {
  const features: Feature<Point>[] = [];

  for (let i = 0; i < count; i++) {
    // Generate random offsets
    const angle = Math.random() * 2 * Math.PI;
    const distance = Math.sqrt(Math.random()) * radius * 10;
    const lng = centerLng + i;
    const lat = centerLat + i;

    features.push({
      type: "Feature",
      geometry: {
        type: "Point",
        coordinates: [lng, lat],
      },
      properties: { id: i },
    });
  }

  return {
    type: "FeatureCollection",
    features,
  };
};
const HexbinMap: FC<LayerBasicType> = ({
  featureCollection = generateRandomPoints(-100, -37.8, 50),
}) => {
  const { map } = useContext(MapContext);
  const overlayRef = useRef<MapboxOverlay | null>(null);

  useEffect(() => {
    if (map === null) return;

    console.log(
      "Adding HexbinLayer with",
      featureCollection.features.length,
      "points"
    );

    map?.once("load", () => {
      if (overlayRef.current) return;

      const hexagonLayer = new HexagonLayer<Feature<Point>>({
        id: "mapbox-overlay-hexagon-layer",
        data: featureCollection.features,
        getPosition: (d: Feature<Point>) => {
          const coords = d.geometry.coordinates;
          return [Number(coords[0]), Number(coords[1])]; // [lng, lat]
        },
        radius: 100,
        extruded: true,
        elevationScale: 250,
        elevationRange: [0, 1000],
        getColorValue: (point: Feature<Point>[]) => 1000,
        // getElevationValue: (points) => points.length,
        colorRange: [[255, 0, 0]], // Bright red,
        opacity: 1,
        pickable: true,
        gpuAggregation: true,
      });

      const overlayProps: MapboxOverlayProps = {
        layers: [hexagonLayer],
        interleaved: true,
      };

      const overlay = new MapboxOverlay(overlayProps);
      map.addControl(overlay);
      overlayRef.current = overlay;

      console.log(
        "Mapbox layers:",
        map.getStyle()?.layers?.map((l) => ({ id: l.id, type: l.type }))
      );
    });

    return () => {
      // if (overlayRef.current) {
      //   map?.removeControl(overlayRef.current);
      //   overlayRef.current = null;
      // }
    };
  }, [featureCollection.features, map]);

  return null;
};

export default HexbinMap;
