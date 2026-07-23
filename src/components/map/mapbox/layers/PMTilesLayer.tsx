import { FC, useCallback, useContext, useEffect, useMemo, useRef } from "react";
import MapContext from "../MapContext";
import dayjs, { Dayjs } from "dayjs";
import {
  ExpressionSpecification,
  GeoJSONSource,
  MapMouseEvent,
  Popup,
} from "mapbox-gl";
import { FeatureCollection, Geometry } from "geojson";
import { LayerBasicType } from "./Layers";
import MapLayerSelect from "../component/MapLayerSelect";
import { SelectItem } from "../../../common/dropdown/CommonSelect";
import { InnerHtmlBuilder } from "../../../../utils/HtmlUtils";
import { MapDefaultConfig } from "../constants";
import { playwrightTestIds } from "../../../common/constants";
import { DatasetType } from "@/app/store/OGCCollectionDefinitions";

const SOURCE_ID = "pmtiles-source-id";
const HOVER_SOURCE_ID = "pmtiles-hover-source-id";
const HOVER_OUTLINE_LAYER_ID = "pmtiles-hex-hover-outline";
const CURSOR_POINTER_CLASS = "map-cursor-pointer";
const EMPTY_FEATURE_COLLECTION: FeatureCollection = {
  type: "FeatureCollection",
  features: [],
};
const bucket = import.meta.env.VITE_PMTILES_BUCKET;
const region = import.meta.env.VITE_AWS_REGION;
// Caps keep Mapbox paint/filter expressions bounded for very wide ranges.
// Day cap is high enough for multi-decade daily PMTiles (~55 years).
const MONTH_KEY_LIMIT = 1200;
const DAY_KEY_LIMIT = 20000;
const DEFAULT_RANGE_START = "2000-01-01";
// mYYYYMM (month bucket) or mYYYYMMDD (day bucket)
const COUNT_PROPERTY_KEY = /^m(\d{6}|\d{8})$/;

const PMTILE_LAYERS = [
  { id: "pmtiles-hex-z0", sourceLayer: "hex_z0", minzoom: 0, maxzoom: 2 },
  { id: "pmtiles-hex-z2", sourceLayer: "hex_z2", minzoom: 2, maxzoom: 4 },
  { id: "pmtiles-hex-z4", sourceLayer: "hex_z4", minzoom: 4, maxzoom: 6 },
  { id: "pmtiles-hex-z6", sourceLayer: "hex_z6", minzoom: 6, maxzoom: 8 },
  { id: "pmtiles-hex-z8", sourceLayer: "hex_z8", minzoom: 8, maxzoom: 10 },
  { id: "pmtiles-hex-z10", sourceLayer: "hex_z10", minzoom: 10, maxzoom: 13 },
];

interface PMTilesHexLayerProps extends LayerBasicType {
  filterStartDate?: Dayjs;
  filterEndDate?: Dayjs;
  selectedCoKey?: string;
  onSelectCoKey?: (key: string) => void;
}

// Older PMTiles use month buckets (mYYYYMM); upgraded tiles use day buckets
// (mYYYYMMDD). A given file uses one format. Summing both is safe because
// missing properties coalesce to 0.

const resolveRange = (start?: Dayjs, end?: Dayjs) => ({
  start: start || dayjs(DEFAULT_RANGE_START),
  end: end || dayjs(),
});

// Exported following functions for unit testing
export const getMonthKeysInRange = (start?: Dayjs, end?: Dayjs): string[] => {
  const { start: s, end: e } = resolveRange(start, end);
  const keys: string[] = [];
  let current = s.startOf("month");
  const last = e.startOf("month");
  let limit = 0;
  while (
    (current.isBefore(last) || current.isSame(last)) &&
    limit < MONTH_KEY_LIMIT
  ) {
    keys.push(`m${current.format("YYYYMM")}`);
    current = current.add(1, "month");
    limit++;
  }
  return keys;
};

export const getDayKeysInRange = (start?: Dayjs, end?: Dayjs): string[] => {
  const { start: s, end: e } = resolveRange(start, end);
  const keys: string[] = [];
  let current = s.startOf("day");
  const last = e.startOf("day");
  let limit = 0;
  while (
    (current.isBefore(last) || current.isSame(last)) &&
    limit < DAY_KEY_LIMIT
  ) {
    keys.push(`m${current.format("YYYYMMDD")}`);
    current = current.add(1, "day");
    limit++;
  }
  return keys;
};

/** Month + day keys for a range — supports both PMTiles property formats. */
export const getDateKeysInRange = (start?: Dayjs, end?: Dayjs): string[] => [
  ...getMonthKeysInRange(start, end),
  ...getDayKeysInRange(start, end),
];

/** Format mYYYYMM → YYYY-MM or mYYYYMMDD → YYYY-MM-DD. */
export const formatDateKey = (key: string): string => {
  const digits = key.startsWith("m") ? key.slice(1) : key;
  if (digits.length >= 8) {
    return `${digits.slice(0, 4)}-${digits.slice(4, 6)}-${digits.slice(6, 8)}`;
  }
  return `${digits.slice(0, 4)}-${digits.slice(4, 6)}`;
};

/**
 * Whether a count property key falls in the filter range.
 * - Day keys (mYYYYMMDD): the day must lie inside the filter.
 * - Month keys (mYYYYMM): the month overlaps the filter (whole-month bucket).
 */
export const isCountPropertyInRange = (
  key: string,
  filterStart?: Dayjs,
  filterEnd?: Dayjs
): boolean => {
  if (!COUNT_PROPERTY_KEY.test(key)) return false;
  const { start, end } = resolveRange(filterStart, filterEnd);
  const rangeStart = start.startOf("day");
  const rangeEnd = end.startOf("day");
  if (rangeStart.isAfter(rangeEnd)) return false;

  const digits = key.slice(1);
  if (digits.length === 8) {
    const day = dayjs(
      `${digits.slice(0, 4)}-${digits.slice(4, 6)}-${digits.slice(6, 8)}`
    );
    if (!day.isValid()) return false;
    return (
      (day.isAfter(rangeStart) || day.isSame(rangeStart, "day")) &&
      (day.isBefore(rangeEnd) || day.isSame(rangeEnd, "day"))
    );
  }

  // Month bucket: include when the month overlaps the filter window
  const monthStart = dayjs(`${digits.slice(0, 4)}-${digits.slice(4, 6)}-01`);
  if (!monthStart.isValid()) return false;
  const monthEnd = monthStart.endOf("month").startOf("day");
  return (
    !monthStart.isAfter(rangeEnd, "day") &&
    !monthEnd.isBefore(rangeStart, "day")
  );
};

/**
 * Popup totals come from properties present on the feature (not a pre-built
 * key list), so long day-bucket series are not truncated by DAY_KEY_LIMIT.
 */
export const buildPopupHtml = (
  properties: Record<string, unknown>,
  filterStartDate?: Dayjs,
  filterEndDate?: Dayjs
): string => {
  let total = 0;
  const matchedKeys: string[] = [];
  for (const [key, value] of Object.entries(properties)) {
    if (typeof value !== "number" || value <= 0) continue;
    if (!isCountPropertyInRange(key, filterStartDate, filterEndDate)) continue;
    total += value;
    matchedKeys.push(key);
  }
  // Lexicographic order matches chronological order for mYYYYMM / mYYYYMMDD
  matchedKeys.sort();
  const firstKey = matchedKeys[0];
  const lastKey = matchedKeys[matchedKeys.length - 1];
  return new InnerHtmlBuilder()
    .addTitle("Data Records In This Area:")
    .addText("Data Record Count: " + total)
    .addRange(
      "Time Range",
      firstKey ? formatDateKey(firstKey) : "N/A",
      lastKey ? formatDateKey(lastKey) : "N/A"
    )
    .getHtml();
};

export const buildSumExpression = (keys: string[]) => {
  if (keys.length === 0) return 0;
  if (keys.length === 1) return ["coalesce", ["get", keys[0]], 0];
  return ["+", ...keys.map((k) => ["coalesce", ["get", k], 0])];
};

// Hexbins with no records in the filtered range must be excluded from the layer
export const buildNonZeroCountFilter = (
  keys: string[]
): ExpressionSpecification =>
  [">", buildSumExpression(keys), 0] as ExpressionSpecification;

const getPaintProperties = (keys: string[]) => {
  const sumExpr = buildSumExpression(keys);
  return {
    "fill-color": [
      "interpolate",
      ["linear"],
      sumExpr,
      0,
      "rgba(0, 0, 0, 0)",
      1,
      "#1E293B",
      10,
      "#334155",
      100,
      "#475569",
      1000,
      "#0284C7",
      5000,
      "#0D9488",
      10000,
      "#14B8A6",
    ] as ExpressionSpecification,
    "fill-opacity": [
      "interpolate",
      ["linear"],
      sumExpr,
      0,
      0,
      1,
      0.15,
      100,
      0.6,
      1000,
      0.8,
    ] as ExpressionSpecification,
    "fill-outline-color": "rgba(255, 255, 255, 0.4)",
  };
};

const PMTilesHexLayer: FC<PMTilesHexLayerProps> = ({
  collection,
  selectedCoKey,
  onSelectCoKey,
  filterStartDate,
  filterEndDate,
  visible = true,
}) => {
  const { map } = useContext(MapContext);
  const filterStartDateRef = useRef(filterStartDate);
  const filterEndDateRef = useRef(filterEndDate);
  const visibleRef = useRef(visible);
  const popupRef = useRef<Popup | null>(null);

  const removePopup = useCallback(() => {
    popupRef.current?.remove();
    popupRef.current = null;
  }, []);

  const handleSelectDataset = useCallback(
    (key: string) => {
      onSelectCoKey?.(key);
    },
    [onSelectCoKey]
  );

  // Derive dataset options from the collection's CO keys
  const datasetOptions = useMemo<SelectItem<string>[]>(() => {
    const coKeys = collection?.getAllCOKeys() ?? [];
    return coKeys.map((key) => ({
      value: key,
      label: key.replace(/\.(zarr|parquet)$/i, ""),
    }));
  }, [collection]);

  // The PMTiles visualization only exists for parquet datasets, so in a mixed
  // zarr/parquet collection, a non-parquet key falls back to the first parquet key
  const formSourceUrl = useCallback(() => {
    let key = selectedCoKey;
    if (key && collection?.getDatasetTypeByKey(key) !== DatasetType.PARQUET) {
      key = collection?.getAllParquetKeys()[0] ?? key;
    }
    return `https://${bucket}.s3.${region}.amazonaws.com/portal/visualization/${collection?.id}/${key}.pmtiles`;
  }, [collection, selectedCoKey]);

  useEffect(() => {
    filterStartDateRef.current = filterStartDate;
    filterEndDateRef.current = filterEndDate;
    visibleRef.current = visible;
  }, [filterStartDate, filterEndDate, visible]);

  useEffect(() => {
    if (!map) return;

    const sourceUrl = formSourceUrl();

    const addSourceAndLayers = () => {
      try {
        addSourceAndLayersUnsafe();
      } catch (error) {
        // OK to ignore error here
      }
    };

    const addSourceAndLayersUnsafe = () => {
      if (!map.getSource(SOURCE_ID)) {
        map.addSource(SOURCE_ID, {
          type: "vector",
          url: sourceUrl,
        });
      }

      const keys = getDateKeysInRange(
        filterStartDateRef.current,
        filterEndDateRef.current
      );
      const paintProps = getPaintProperties(keys);

      PMTILE_LAYERS.forEach((layer) => {
        if (!map.getLayer(layer.id)) {
          console.log(`Adding layer ${layer.id}`);
          map.addLayer({
            id: layer.id,
            type: "fill",
            source: SOURCE_ID,
            "source-layer": layer.sourceLayer,
            minzoom: layer.minzoom,
            maxzoom: layer.maxzoom,
            filter: buildNonZeroCountFilter(keys),
            layout: {
              visibility: visibleRef.current ? "visible" : "none",
            },
            paint: {
              "fill-color": paintProps["fill-color"],
              "fill-opacity": paintProps["fill-opacity"],
              "fill-outline-color": paintProps["fill-outline-color"],
            },
          });
        }
      });

      // Highlight outline for the hovered hexbin, drawn above the fill layers
      if (!map.getSource(HOVER_SOURCE_ID)) {
        map.addSource(HOVER_SOURCE_ID, {
          type: "geojson",
          data: EMPTY_FEATURE_COLLECTION,
        });
      }
      if (!map.getLayer(HOVER_OUTLINE_LAYER_ID)) {
        map.addLayer({
          id: HOVER_OUTLINE_LAYER_ID,
          type: "line",
          source: HOVER_SOURCE_ID,
          layout: {
            visibility: visibleRef.current ? "visible" : "none",
            "line-join": "round",
            "line-cap": "round",
          },
          paint: {
            // Brighter and slightly thicker than the fill layers' default
            // outline (rgba(255, 255, 255, 0.4), 1px)
            "line-color": "rgba(255, 255, 255, 0.9)",
            "line-width": 1.5,
          },
        });
      }
    };

    if (map.isStyleLoaded()) {
      addSourceAndLayers();
    } else {
      map.once("load", addSourceAndLayers);
    }

    const onStyleData = () => {
      addSourceAndLayers();
    };
    map.on("styledata", onStyleData);

    return () => {
      if (!map) return;

      try {
        PMTILE_LAYERS.forEach((layer) => {
          if (map.getLayer(layer.id)) {
            map.removeLayer(layer.id);
          }
        });
        if (map.getLayer(HOVER_OUTLINE_LAYER_ID)) {
          map.removeLayer(HOVER_OUTLINE_LAYER_ID);
        }
        if (map.getSource(SOURCE_ID)) {
          map.removeSource(SOURCE_ID);
        }
        if (map.getSource(HOVER_SOURCE_ID)) {
          map.removeSource(HOVER_SOURCE_ID);
        }
      } catch (error) {
        // OK to ignore error here
      } finally {
        map.off("styledata", onStyleData);
        map.off("load", addSourceAndLayers);
        removePopup();
      }
    };
  }, [map, collection?.id, selectedCoKey, formSourceUrl, removePopup]);

  // Show an aggregation-details popup and highlight outline while hovering
  // a hexbin
  useEffect(() => {
    if (!map) return;

    // Identity of the currently hovered hexbin, so the popup HTML and the
    // highlight outline are only rebuilt when the cursor moves onto a
    // different feature
    let hoveredId: string | number | undefined;

    const setHoverOutline = (geometry?: Geometry) => {
      const source = map.getSource<GeoJSONSource>(HOVER_SOURCE_ID);
      source?.setData(
        geometry
          ? {
              type: "FeatureCollection",
              features: [{ type: "Feature", geometry, properties: {} }],
            }
          : EMPTY_FEATURE_COLLECTION
      );
    };

    const clearHover = () => {
      // The deck.gl overlay (HexbinLayer) rewrites the canvas's inline
      // cursor on every pointer move, so toggle a CSS class instead
      map.getCanvas().classList.remove(CURSOR_POINTER_CLASS);
      hoveredId = undefined;
      setHoverOutline(undefined);
      removePopup();
    };

    const onHexHover = (
      layer: (typeof PMTILE_LAYERS)[number],
      e: MapMouseEvent
    ) => {
      if (!visibleRef.current) return;
      // queryRenderedFeatures ignores layer minzoom/maxzoom, so retained
      // lower-zoom tiles can still report hexbins from bands that are no
      // longer rendered — skip those.
      const zoom = map.getZoom();
      if (zoom < layer.minzoom || zoom >= layer.maxzoom) return;

      const feature = e.features?.[0];
      if (!feature) return;

      map.getCanvas().classList.add(CURSOR_POINTER_CLASS);

      if (!popupRef.current) {
        // A hover popup must not show a close button
        popupRef.current = new Popup({
          ...MapDefaultConfig.DEFAULT_POPUP,
          closeButton: false,
        });
        hoveredId = undefined;
      }

      // Vector tile features may not carry an id; rebuild every event then
      if (feature.id === undefined || feature.id !== hoveredId) {
        hoveredId = feature.id;
        popupRef.current.setHTML(
          buildPopupHtml(
            feature.properties ?? {},
            filterStartDateRef.current,
            filterEndDateRef.current
          )
        );
        setHoverOutline(feature.geometry);
      }

      popupRef.current.setLngLat(e.lngLat);
      if (!popupRef.current.isOpen()) {
        popupRef.current.addTo(map);
      }

      // add test id for playwright tests
      const popupElement = popupRef.current.getElement();
      if (popupElement) {
        popupElement.dataset.testid = playwrightTestIds.DETAIL_MAP_POPUP;
      }
    };

    const onHexLeave = () => {
      clearHover();
    };

    // Drop any open hover popup/outline when the zoom changes, so a hexbin
    // hovered just before crossing a zoom band can't linger once hidden
    const onZoom = () => {
      clearHover();
    };

    const hoverHandlers = PMTILE_LAYERS.map((layer) => ({
      layerId: layer.id,
      onMouseMove: (e: MapMouseEvent) => onHexHover(layer, e),
    }));

    hoverHandlers.forEach(({ layerId, onMouseMove }) => {
      map.on("mousemove", layerId, onMouseMove);
      map.on("mouseleave", layerId, onHexLeave);
    });
    map.on("zoom", onZoom);

    return () => {
      hoverHandlers.forEach(({ layerId, onMouseMove }) => {
        map.off("mousemove", layerId, onMouseMove);
        map.off("mouseleave", layerId, onHexLeave);
      });
      map.off("zoom", onZoom);
      try {
        clearHover();
      } catch (error) {
        // OK to ignore error here — the map may already be torn down
      }
    };
  }, [map, removePopup]);

  // Update visibility on changes
  useEffect(() => {
    if (!map) return;
    try {
      PMTILE_LAYERS.forEach((layer) => {
        if (map.getLayer(layer.id)) {
          map.setLayoutProperty(
            layer.id,
            "visibility",
            visible ? "visible" : "none"
          );
        }
      });
      if (map.getLayer(HOVER_OUTLINE_LAYER_ID)) {
        map.setLayoutProperty(
          HOVER_OUTLINE_LAYER_ID,
          "visibility",
          visible ? "visible" : "none"
        );
      }
    } catch (error) {
      // OK to ignore error here
    }
    if (!visible) {
      map.getCanvas().classList.remove(CURSOR_POINTER_CLASS);
      map
        .getSource<GeoJSONSource>(HOVER_SOURCE_ID)
        ?.setData(EMPTY_FEATURE_COLLECTION);
      removePopup();
    }
  }, [map, visible, removePopup]);

  // Update paint properties on date filter changes
  useEffect(() => {
    if (!map) return;
    const keys = getDateKeysInRange(filterStartDate, filterEndDate);
    const paintProps = getPaintProperties(keys);

    try {
      PMTILE_LAYERS.forEach((layer) => {
        if (map.getLayer(layer.id)) {
          map.setFilter(layer.id, buildNonZeroCountFilter(keys));
          map.setPaintProperty(
            layer.id,
            "fill-color",
            paintProps["fill-color"]
          );
          map.setPaintProperty(
            layer.id,
            "fill-opacity",
            paintProps["fill-opacity"]
          );
          map.setPaintProperty(
            layer.id,
            "fill-outline-color",
            paintProps["fill-outline-color"]
          );
        }
      });
    } catch (error) {
      // OK to ignore error here
    }
    // Popup content is derived from the date filter, so drop any open popup
    removePopup();
  }, [map, filterStartDate, filterEndDate, removePopup]);

  return (
    <>
      {visible && (
        <MapLayerSelect
          mapLayersOptions={datasetOptions}
          selectedItem={selectedCoKey || ""}
          handleSelectItem={handleSelectDataset}
          isLoading={false}
          loadingText="Loading Data Density Layers..."
        />
      )}
    </>
  );
};

export default PMTilesHexLayer;
