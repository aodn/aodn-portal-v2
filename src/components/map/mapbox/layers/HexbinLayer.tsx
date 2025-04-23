import { FC, useContext, useEffect, useRef } from "react";
import { HexagonLayer } from "@deck.gl/aggregation-layers";
import MapContext from "../MapContext";
import { LayerBasicType } from "./Layers";
import { Feature, Point } from "geojson";
import { MapboxOverlay } from "@deck.gl/mapbox";
import { Popup } from "mapbox-gl";
import { InnerHtmlBuilder } from "../../../../utils/HtmlUtils";

const MAPBOX_OVERLAY_HEXAGON_LAYER = "mapbox-overlay-hexagon-layer";

const HexbinMap: FC<LayerBasicType> = ({ featureCollection }) => {
  const { map } = useContext(MapContext);
  const popupRef = useRef<Popup | null>();
  const overlayRef = useRef<MapboxOverlay>();

  useEffect(() => {
    if (map === null) return;

    map?.once("load", () => {
      if (featureCollection === undefined) return;

      const hexagonLayer = new HexagonLayer<Feature<Point>>({
        id: MAPBOX_OVERLAY_HEXAGON_LAYER,
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
        getColorWeight: (point: Feature<Point>) => point?.properties?.count,
        // If you enable gpuAggregation the picking info will give less info
        // due to the internal implementation. We do not see much diff in speed
        // without gpuAggregation
        gpuAggregation: false,
        extruded: false,
        pickable: true,
        radius: 50000,
        opacity: 0.4,
        colorRange: [
          [255, 255, 178],
          [254, 217, 118],
          [254, 178, 76],
          [253, 141, 60],
          [240, 59, 32],
          [189, 0, 38],
        ],
        // getElevationValue: (v) => v.length,
      });

      const overlay = new MapboxOverlay({
        interleaved: true,
        layers: [hexagonLayer],
        onClick: (info) => {
          if (info.picked && info.object) {
            // Remove existing popup
            if (popupRef.current) {
              popupRef.current.remove();
              popupRef.current = null;
            }

            // Create popup
            popupRef.current = new Popup({
              closeButton: true,
              closeOnClick: false,
              maxWidth: "none",
              offset: [0, -5],
            });

            const points: Feature<Point>[] = info.object.points || [];

            const smallestDate =
              points.reduce((smallest, point) => {
                const date = point.properties?.date;
                if (typeof date !== "string") return smallest;
                if (!smallest || date <= smallest) return date;
                return smallest;
              }, "") || "N/A";

            const biggestDate =
              points.reduce((smallest, point) => {
                const date = point.properties?.date;
                if (typeof date !== "string") return smallest;
                if (!smallest || date > smallest) return date;
                return smallest;
              }, "") || "N/A";

            const htmlBuilder = new InnerHtmlBuilder()
              .addTitle("Data Records In This Area:")
              .addText(
                "Data Record Count: " +
                  points.reduce((sum, point) => {
                    const val = point.properties?.count ?? 0;
                    return sum + (typeof val === "number" ? val : 0);
                  }, 0)
              )
              .addRange("Time Range", smallestDate, biggestDate);

            popupRef.current
              .setLngLat(info.coordinate as [number, number])
              .setHTML(htmlBuilder.getHtml())
              .addTo(map);
          }
        },
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

  return null;
};

export default HexbinMap;
