import { FC, useCallback, useContext, useEffect, useRef } from "react";
import { HexagonLayer } from "@deck.gl/aggregation-layers";
import MapContext from "../MapContext";
import { LayerBasicType } from "./Layers";
import { Feature, FeatureCollection, Point } from "geojson";
import { MapboxOverlay } from "@deck.gl/mapbox";
import { Map, Popup } from "mapbox-gl";
import { InnerHtmlBuilder } from "../../../../utils/HtmlUtils";
import { Color } from "@deck.gl/core";
import { TestHelper } from "../../../common/test/helper";
import { MapDefaultConfig } from "../constants";
import { isDrawModeRectangle } from "../../../../utils/MapUtils";
import dayjs from "dayjs";
import { CloudOptimizedFeature } from "../../../common/store/CloudOptimizedDefinitions";

const MAPBOX_OVERLAY_HEXAGON_LAYER = "mapbox-overlay-hexagon-layer";
const COLOR_RANGE: Color[] = [
  [255, 255, 178],
  [254, 217, 118],
  [254, 178, 76],
  [253, 141, 60],
  [240, 59, 32],
  [189, 0, 38],
];
// If featureCollection is undefined, create an empty layer
const createHexagonLayer = (
  featureCollection: FeatureCollection<Point> | undefined,
  visible: boolean | undefined
) => {
  return new HexagonLayer<Feature<Point>>({
    id: MAPBOX_OVERLAY_HEXAGON_LAYER,
    data: featureCollection?.features,
    getPosition: ({ geometry: { coordinates } }) =>
      coordinates as [number, number],
    getColorWeight: ({ properties }) => properties?.count ?? 0,
    // If you enable gpuAggregation the picking info will give less info
    // due to the internal implementation. We do not see much diff in speed
    // without gpuAggregation
    gpuAggregation: false,
    extruded: false,
    pickable: true,
    visible: visible,
    radius: 15000, // Change hexagon size here
    opacity: 0.3,
    colorRange: COLOR_RANGE,
    // getElevationValue: (v) => v.length,
  });
};

interface HexbinLayerProps extends LayerBasicType<CloudOptimizedFeature> {
  filterStartDate?: dayjs.Dayjs;
  filterEndDate?: dayjs.Dayjs;
}

export const createFilteredFeatures = (
  featureCollection?: FeatureCollection<Point, CloudOptimizedFeature>,
  filterStartDate?: dayjs.Dayjs,
  filterEndDate?: dayjs.Dayjs
) => {
  if (!featureCollection?.features) return undefined;

  const features = featureCollection.features;
  if (features.length === 0) return featureCollection;

  const startTs = filterStartDate?.valueOf();
  const endTs = filterEndDate?.valueOf();
  const hasStart = startTs !== undefined;
  const hasEnd = endTs !== undefined;

  if (!hasStart && !hasEnd) return featureCollection;

  const filteredFeatures = features.filter((feature) => {
    const ts = feature.properties.timestamp;
    return (!hasStart || ts >= startTs) && (!hasEnd || ts <= endTs);
  });

  return { ...featureCollection, features: filteredFeatures };
};

const HexbinLayer: FC<HexbinLayerProps> = ({
  featureCollection,
  filterStartDate,
  filterEndDate,
  visible,
}) => {
  const { map } = useContext(MapContext);
  const popupRef = useRef<Popup | null>();
  const overlayRef = useRef<MapboxOverlay | null>();

  const createLayer = useCallback(
    (map: Map) =>
      new MapboxOverlay({
        interleaved: true,
        layers: [],
        onClick: (info) => {
          if (info.picked && info.object && !isDrawModeRectangle(map)) {
            // Remove existing popup
            if (popupRef.current) {
              popupRef.current.remove();
              popupRef.current = null;
            }

            // Create popup
            popupRef.current = new Popup(MapDefaultConfig.DEFAULT_POPUP);
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
      }),
    []
  );

  useEffect(() => {
    if (!map || overlayRef.current !== undefined) return;

    const createHexbinLayer = () => {
      if (!overlayRef.current) {
        // Just create skeleton of the layer, data update later
        const overlay = createLayer(map);
        if (overlay) {
          overlayRef.current = overlay;
          map?.addControl(overlay);
        }
      }
    };

    const cleanup = () => {
      if (overlayRef.current && map?.isStyleLoaded()) {
        map?.removeControl(overlayRef.current);
        overlayRef.current = undefined;
      }
      if (popupRef.current) {
        popupRef.current.remove();
        popupRef.current = null;
      }
    };

    createHexbinLayer();

    return () => {
      cleanup();
    };
  }, [createLayer, map]);

  useEffect(() => {
    // Update the data on change
    if (overlayRef.current) {
      const features = createFilteredFeatures(
        featureCollection,
        filterStartDate,
        filterEndDate
      );
      overlayRef.current?.setProps({
        layers: [createHexagonLayer(features, visible)],
      });
    }
    if (popupRef.current) {
      popupRef.current.remove();
      popupRef.current = null;
    }
  }, [featureCollection, filterEndDate, filterStartDate, visible]);

  return (
    <TestHelper
      id={map?.getContainer().id || ""}
      getHexbinLayer={() => MAPBOX_OVERLAY_HEXAGON_LAYER}
    />
  );
};

export default HexbinLayer;
