import {
  FC,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
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
import _ from "lodash";
import { SelectItem } from "../../../common/dropdown/CommonSelect";
import MapLayerSelect from "../component/MapLayerSelect";
import { useDetailPageContext } from "../../../../pages/detail-page/context/detail-page-context";

const MAPBOX_OVERLAY_HEXAGON_LAYER = "mapbox-overlay-hexagon-layer";
const COLOR_RANGE: Color[] = [
  [255, 255, 178],
  [254, 217, 118],
  [254, 178, 76],
  [253, 141, 60],
  [240, 59, 32],
  [189, 0, 38],
];

// Extract unique keys from feature collection for dropdown options
export const extractHexbinOptions = (
  featureCollection?: FeatureCollection<Point, CloudOptimizedFeature>
): SelectItem<string>[] => {
  if (!featureCollection?.features?.length) return [];

  const uniqueKeys = new Set<string>();
  featureCollection.features.forEach((feature) => {
    const key = feature.properties?.key;
    if (key && typeof key === "string") {
      uniqueKeys.add(key);
    }
  });

  return Array.from(uniqueKeys)
    .sort()
    .map((key) => ({
      label: formatKeyLabel(key),
      value: key,
    }));
};

// Remove dataset type to format key for display in dropdown
const formatKeyLabel = (key: string): string => {
  return key.replace(/\.(parquet|zarr)$/i, "");
};

// Filter features by selected key
export const filterFeaturesByKey = (
  featureCollection?: FeatureCollection<Point, CloudOptimizedFeature>,
  selectedKey?: string
): FeatureCollection<Point, CloudOptimizedFeature> | undefined => {
  if (!featureCollection?.features?.length) return featureCollection;
  // Show all if no key selected
  if (!selectedKey) return featureCollection;

  const filteredFeatures = featureCollection.features.filter(
    (feature) => feature.properties?.key === selectedKey
  );

  return {
    ...featureCollection,
    features: filteredFeatures,
  };
};

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

// Use binary tree lookup the start and end point, data is assumed sorted by timestamp asc
export const createFilteredFeatures = (
  featureCollection?: FeatureCollection<Point, CloudOptimizedFeature>,
  filterStartDate?: dayjs.Dayjs,
  filterEndDate?: dayjs.Dayjs
) => {
  if (!featureCollection?.features?.length) return featureCollection;

  const features = featureCollection.features;
  const startTs = filterStartDate?.valueOf();
  const endTs = filterEndDate?.valueOf();
  const hasStart = startTs !== undefined;
  const hasEnd = endTs !== undefined;

  if (!hasStart && !hasEnd) return featureCollection;

  const dummy = { properties: { timestamp: 0 } };

  let startIdx = 0;
  if (hasStart) {
    dummy.properties.timestamp = startTs!;
    startIdx = _.sortedIndexBy(features, dummy, "properties.timestamp");
  }

  let endIdx = features.length;
  if (hasEnd) {
    dummy.properties.timestamp = endTs!;
    endIdx = _.sortedLastIndexBy(features, dummy, "properties.timestamp");
  }

  const filteredFeatures = features.slice(startIdx, endIdx);

  return { ...featureCollection, features: filteredFeatures };
};

export const createSortedFeatures = (
  featureCollection?: FeatureCollection<Point, CloudOptimizedFeature>
) => {
  const sortedFeatures = featureCollection?.features.sort(
    (a, b) => a.properties.timestamp - b.properties.timestamp
  );

  return {
    ...featureCollection,
    features: sortedFeatures,
  } as FeatureCollection<Point, CloudOptimizedFeature>;
};

const HexbinLayer: FC<HexbinLayerProps> = ({
  featureCollection,
  filterStartDate,
  filterEndDate,
  visible,
}) => {
  const { map } = useContext(MapContext);
  const { selectedCoKey, setSelectedCoKey } = useDetailPageContext();
  const popupRef = useRef<Popup | null>();
  const overlayRef = useRef<MapboxOverlay | null>();

  const [hexbinOptions, setHexbinOptions] = useState<SelectItem<string>[]>([]);
  const [isFetchingHexbinOptions, setIsFetchingHexbinOptions] = useState(true);

  // Sort it to make later lookup faster
  const sortedFeatureCollection = useMemo<
    FeatureCollection<Point, CloudOptimizedFeature>
  >(() => createSortedFeatures(featureCollection), [featureCollection]);

  const handleSelectHexbin = useCallback(
    (key: string) => {
      setSelectedCoKey(key);
    },
    [setSelectedCoKey]
  );

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

  // Extract hexbin options from feature collection
  useEffect(() => {
    if (!sortedFeatureCollection) {
      setIsFetchingHexbinOptions(false);
      return;
    }

    setIsFetchingHexbinOptions(true);

    // Extract options from sorted feature collection
    const options = extractHexbinOptions(sortedFeatureCollection);

    if (options.length > 0) {
      setHexbinOptions(options);

      // Set first option as default if none selected
      if (!selectedCoKey) {
        handleSelectHexbin(options[0].value);
      }
    } else {
      setHexbinOptions([]);
    }

    setIsFetchingHexbinOptions(false);
  }, [sortedFeatureCollection, selectedCoKey, handleSelectHexbin]);

  useEffect(() => {
    // Update the data on change, first filter by key, then filter by date range
    if (overlayRef.current) {
      const keyFilteredFeatures = filterFeaturesByKey(
        sortedFeatureCollection,
        selectedCoKey
      );

      const features = createFilteredFeatures(
        keyFilteredFeatures,
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
  }, [
    sortedFeatureCollection,
    filterEndDate,
    filterStartDate,
    visible,
    selectedCoKey,
  ]);

  return (
    <>
      {visible && (
        <MapLayerSelect
          mapLayersOptions={hexbinOptions}
          selectedItem={selectedCoKey}
          handleSelectItem={handleSelectHexbin}
          isLoading={isFetchingHexbinOptions}
          loadingText="Loading Hexbin Layers..."
        />
      )}
      <TestHelper
        id={map?.getContainer().id || ""}
        getHexbinLayer={() => MAPBOX_OVERLAY_HEXAGON_LAYER}
      />
    </>
  );
};

export default HexbinLayer;
