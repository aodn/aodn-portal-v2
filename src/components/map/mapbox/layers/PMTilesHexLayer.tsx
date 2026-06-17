import { useCallback, useContext, useEffect, useMemo, useRef } from "react";
import MapContext from "../MapContext";
import dayjs, { Dayjs } from "dayjs";
import { useDetailPageContext } from "../../../../pages/detail-page/context/detail-page-context";
import MapLayerSelect from "../component/MapLayerSelect";

const SOURCE_ID = "pmtiles-seabird";

// Zoom bands — maxzoom is exclusive so use the next integer to eliminate gaps.
const PMTILE_LAYERS = [
  { id: "pmtiles-hex-z0", sourceLayer: "hex_z0", minzoom: 0, maxzoom: 2 },
  { id: "pmtiles-hex-z2", sourceLayer: "hex_z2", minzoom: 2, maxzoom: 4 },
  { id: "pmtiles-hex-z4", sourceLayer: "hex_z4", minzoom: 4, maxzoom: 6 },
  { id: "pmtiles-hex-z6", sourceLayer: "hex_z6", minzoom: 6, maxzoom: 8 },
  { id: "pmtiles-hex-z8", sourceLayer: "hex_z8", minzoom: 8, maxzoom: 10 },
  { id: "pmtiles-hex-z10", sourceLayer: "hex_z10", minzoom: 10, maxzoom: 13 },
];

const MONTH_KEY_RE = /^m\d{6}$/;
const MIN_FILL_OPACITY = 0.15;
const MAX_FILL_OPACITY = 0.9;
const OPACITY_SCALE_BASE = 1.5;

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

/**
 * Parse a month key like 'm200906' → Dayjs(2009-06-01).
 * Return undefined if the key is not a valid mYYYYMM string.
 */
const parseMonthKey = (k: string): Dayjs | undefined => {
  if (!MONTH_KEY_RE.test(k)) return undefined;
  const year = parseInt(k.substring(1, 5), 10);
  const month = parseInt(k.substring(5, 7), 10);
  return dayjs(new Date(year, month - 1, 1));
};

/**
 * Keep only month keys whose year-month falls within [startDate, endDate].
 * If both bounds are undefined every key is kept (no filter applied).
 */
const filterMonthKeysByDateRange = (
  keys: string[],
  startDate?: Dayjs,
  endDate?: Dayjs
): string[] => {
  if (!startDate && !endDate) return keys;
  return keys.filter((k) => {
    const d = parseMonthKey(k);
    if (!d) return false;
    if (startDate && d.isBefore(startDate.startOf("month"))) return false;
    return !(endDate && d.isAfter(endDate.endOf("month")));
  });
};

/**
 * Build a Mapbox expression:
 *   opacity = interpolate_exp( (sum of filtered month counts) / maxB )
 * mapped to [minOpacity .. maxOpacity].
 */
const buildCapacityExpression = (
  monthKeys: string[],
  maxB: number,
  minOpacity = MIN_FILL_OPACITY,
  maxOpacity = MAX_FILL_OPACITY,
  scaleBase = OPACITY_SCALE_BASE
) => {
  if (!monthKeys.length || maxB <= 0) return minOpacity;

  const coalesced = monthKeys.map((k) => [
    "coalesce",
    ["to-number", ["get", k]],
    0,
  ]);
  const sumExpr = ["+", ...coalesced];
  const ratioExpr = ["/", sumExpr, maxB];

  return [
    "interpolate",
    ["exponential", scaleBase],
    ratioExpr,
    0,
    minOpacity,
    1,
    maxOpacity,
  ];
};

/**
 * Query rendered features for each PMTiles layer and return the largest
 * per-feature sum of the supplied month keys.
 */
const computeMaxFeatureSum = (map: any, monthKeys: string[]): number => {
  let max = 0;
  try {
    PMTILE_LAYERS.forEach((spec) => {
      const features =
        (map as any).queryRenderedFeatures({ layers: [spec.id] }) || [];
      features.forEach((f: any) => {
        const props = f.properties || {};
        let sum = 0;
        monthKeys.forEach((k) => {
          const n = Number(props[k] || 0);
          if (!Number.isNaN(n)) sum += n;
        });
        if (sum > max) max = sum;
      });
    });
  } catch (_e) {
    /* queryRenderedFeatures may throw if layers not yet added */
  }
  return max;
};

/**
 * Scan rendered features for property keys matching mYYYYMM.
 */
const detectMonthKeys = (map: any): string[] => {
  const set = new Set<string>();
  try {
    PMTILE_LAYERS.forEach((spec) => {
      const features =
        (map as any).queryRenderedFeatures({ layers: [spec.id] }) || [];
      features.forEach((f: any) => {
        Object.keys(f.properties || {}).forEach((k) => {
          if (MONTH_KEY_RE.test(k)) set.add(k);
        });
      });
    });
  } catch (_e) {
    /* queryRenderedFeatures may throw if layers not yet added */
  }
  return Array.from(set).sort();
};

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

export interface PMTilesHexLayerProps {
  /** Inclusive start of the selected date range (Dayjs). */
  filterStartDate?: Dayjs;
  /** Inclusive end of the selected date range (Dayjs). */
  filterEndDate?: Dayjs;
}

function PMTilesHexLayer({
  filterStartDate,
  filterEndDate,
}: PMTilesHexLayerProps) {
  const { map } = useContext(MapContext);

  const { collection } = useDetailPageContext();
  const dname = useMemo(() => {
    const summaryLinks = collection?.links?.filter(
      (link) => link.rel === "summary"
    );
    if (!summaryLinks || summaryLinks.length === 0) {
      return [];
    }

    // only get the first one to demo, and implement the rest in the future
    return summaryLinks[0].title;
  }, [collection?.links]);
  const uuid = collection?.id;

  // get the env var VITE_PMTILES_BUCKET
  const bucket = import.meta.env.VITE_PMTILES_BUCKET;
  let sourceUrl = "";
  if (bucket && uuid && dname) {
    sourceUrl = `https://${bucket}.s3.ap-southeast-2.amazonaws.com/visualization/${uuid}/${dname}.pmtiles`;
  }

  // All month keys detected from rendered features (updated on tile load / view change).
  const allMonthKeysRef = useRef<string[]>([]);

  // Always-fresh refs for filter dates so stable callbacks always see the latest value.
  const filterStartRef = useRef(filterStartDate);
  const filterEndRef = useRef(filterEndDate);
  useEffect(() => {
    filterStartRef.current = filterStartDate;
    filterEndRef.current = filterEndDate;
  }, [filterStartDate, filterEndDate]);

  // Core function: filter detected keys by date range → compute maxB from
  // currently rendered features → build Mapbox expression → apply to all layers.
  const buildAndApply = useCallback((): boolean => {
    if (!map) return false;

    const filteredKeys = filterMonthKeysByDateRange(
      allMonthKeysRef.current,
      filterStartRef.current,
      filterEndRef.current
    );
    if (!filteredKeys.length) return false;

    const maxB = computeMaxFeatureSum(map, filteredKeys);
    if (maxB <= 0) return false;

    const expr = buildCapacityExpression(filteredKeys, maxB) as any;
    PMTILE_LAYERS.forEach((spec) => {
      if (map.getLayer(spec.id)) {
        try {
          map.setPaintProperty(spec.id, "fill-opacity", expr);
        } catch (_e) {
          /* ignore if layer not ready */
        }
      }
    });
    console.log(
      "[PMTilesHexLayer] opacity updated — " +
        `filtered keys: ${filteredKeys.length}, maxB: ${maxB}, ` +
        `zoom: ${map.getZoom().toFixed(2)}`
    );
    return true;
  }, [map]);

  // Ref so map event handlers created once in the [map] effect always call
  // the freshest version of buildAndApply (which reads fresh filter refs).
  const buildAndApplyRef = useRef(buildAndApply);
  useEffect(() => {
    buildAndApplyRef.current = buildAndApply;
  }, [buildAndApply]);

  // ── Re-apply whenever the date range changes ──────────────────────────────
  // allMonthKeysRef already holds detected keys; we just re-filter + re-compute.
  useEffect(() => {
    if (!map || !allMonthKeysRef.current.length) return;
    buildAndApply();
  }, [filterStartDate, filterEndDate, map, buildAndApply]);

  // ── Map lifecycle: add layers, detect keys, move/zoom recalculation ───────
  useEffect(() => {
    if (!map) return;

    const addLayers = () => {
      if (!map.getSource(SOURCE_ID)) {
        map.addSource(SOURCE_ID, {
          type: "vector",
          url: sourceUrl,
        });
      }
      PMTILE_LAYERS.forEach((spec) => {
        if (!map.getLayer(spec.id)) {
          map.addLayer({
            id: spec.id,
            type: "fill",
            source: SOURCE_ID,
            "source-layer": spec.sourceLayer,
            minzoom: spec.minzoom,
            maxzoom: spec.maxzoom,
            paint: {
              "fill-color": "pink",
              // Placeholder until we detect keys and compute maxB.
              "fill-opacity": MIN_FILL_OPACITY,
              "fill-outline-color": "white",
            },
          });
        }
      });
    };

    if (map.isStyleLoaded && map.isStyleLoaded()) addLayers();
    else map.once("load", addLayers);
    map.on("styledata", addLayers);

    // Detect keys from rendered features then apply expression.
    const tryDetectAndApply = (): boolean => {
      const keys = detectMonthKeys(map);
      if (!keys.length) return false;
      allMonthKeysRef.current = keys;
      return buildAndApplyRef.current();
    };

    const handleSourceData = (e: any) => {
      if (e?.sourceId === SOURCE_ID && e.isSourceLoaded) {
        if (tryDetectAndApply()) map.off("sourcedata", handleSourceData);
      }
    };

    if (!tryDetectAndApply()) map.on("sourcedata", handleSourceData);

    // After each pan or zoom settles: re-detect visible keys + update maxB
    // so the opacity scale always reflects the current viewport.
    const handleViewChange = () => {
      console.log(
        "[PMTilesHexLayer] view change, zoom:",
        map.getZoom().toFixed(2)
      );
      const keys = detectMonthKeys(map);
      if (keys.length) allMonthKeysRef.current = keys;
      buildAndApplyRef.current();
    };

    map.on("moveend", handleViewChange);
    map.on("zoomend", handleViewChange);

    return () => {
      if (!map) return;
      if (map.isStyleLoaded && map.isStyleLoaded()) {
        PMTILE_LAYERS.forEach((spec) => {
          if (map.getLayer(spec.id)) map.removeLayer(spec.id);
        });
        if (map.getSource(SOURCE_ID)) map.removeSource(SOURCE_ID);
      }
      map.off("moveend", handleViewChange);
      map.off("zoomend", handleViewChange);
      try {
        map.off("sourcedata", handleSourceData);
      } catch (_e) {
        /* already removed */
      }
      map.off("styledata", addLayers);
    };
  }, [map]);

  return null;
}

export default PMTilesHexLayer;
