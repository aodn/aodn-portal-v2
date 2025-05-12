import { FC, useCallback, useContext, useEffect, useRef } from "react";
import { HexagonLayer } from "@deck.gl/aggregation-layers";
import MapContext from "../MapContext";
import { LayerBasicType } from "./Layers";
import { Feature, FeatureCollection, GeoJsonProperties, Point } from "geojson";
import { MapboxOverlay } from "@deck.gl/mapbox";
import { Map, Popup } from "mapbox-gl";
import { InnerHtmlBuilder } from "../../../../utils/HtmlUtils";
import { Color } from "@deck.gl/core";

const MAPBOX_OVERLAY_HEXAGON_LAYER = "mapbox-overlay-hexagon-layer";
const COLOR_RANGE: Color[] = [
  [255, 255, 178],
  [254, 217, 118],
  [254, 178, 76],
  [253, 141, 60],
  [240, 59, 32],
  [189, 0, 38],
];

const createHexagonLayer = (
  featureCollection: FeatureCollection<Point> | undefined
) => {
  if (featureCollection === undefined) return null;

  return new HexagonLayer<Feature<Point>>({
    id: MAPBOX_OVERLAY_HEXAGON_LAYER,
    data: featureCollection.features,
    getPosition: ({ geometry: { coordinates } }) =>
      coordinates as [number, number],
    getColorWeight: ({ properties }) => properties?.count ?? 0,
    // If you enable gpuAggregation the picking info will give less info
    // due to the internal implementation. We do not see much diff in speed
    // without gpuAggregation
    gpuAggregation: false,
    extruded: false,
    pickable: true,
    radius: 15000, // Change hexagon size here
    opacity: 0.3,
    colorRange: COLOR_RANGE,
    // getElevationValue: (v) => v.length,
  });
};

const HexbinLayer: FC<LayerBasicType> = ({ featureCollection }) => {
  const { map } = useContext(MapContext);
  const popupRef = useRef<Popup | null>();
  const overlayRef = useRef<MapboxOverlay | null>();

  const createLayer = useCallback(
    (
      featureCollection:
        | FeatureCollection<Point, GeoJsonProperties>
        | undefined,
      map: Map
    ) => {
      const layer = createHexagonLayer(featureCollection);

      return layer === null
        ? null
        : new MapboxOverlay({
            interleaved: true,
            layers: [layer],
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
                // Set gpuAggregation to true will make points object disappear
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
    },
    []
  );

  useEffect(() => {
    if (!map || overlayRef.current) return;

    const createHexbinLayer = () => {
      const overlay = createLayer(featureCollection, map);
      if (overlay) {
        overlayRef.current = overlay;
        map?.addControl(overlay);
      }
    };

    const cleanup = () => {
      if (overlayRef.current) {
        map?.removeControl(overlayRef.current);
        overlayRef.current = null;
        if (popupRef.current) {
          popupRef.current.remove();
          popupRef.current = null;
        }
      }
    };

    map?.once("load", createHexbinLayer);
    map?.on("styledata", createHexbinLayer);

    return () => {
      map?.off("styledata", createHexbinLayer);
      cleanup();
    };
  }, [createLayer, featureCollection, map]);

  useEffect(() => {
    // Update the data on change
    if (overlayRef.current) {
      const layer = createHexagonLayer(featureCollection);
      overlayRef.current.setProps({ layers: [layer] });
    }
  }, [featureCollection]);

  return null;
};

export default HexbinLayer;
