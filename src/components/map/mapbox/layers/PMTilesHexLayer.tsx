import { useContext, useEffect } from "react";
import MapContext from "../MapContext";

const SOURCE_ID = "pmtiles-seabird";

// Define all PMTiles layer specs you want to add. These correspond to the
// `source-layer` names present inside the PMTiles (hex_z0, hex_z2, ...).
const PMTILE_LAYERS = [
  // Use ranges where maxzoom is the exclusive upper bound. To avoid gaps
  // between integer zooms use the next integer as maxzoom (e.g. 0..2 covers
  // zooms >=0 and <2 so it is visible for 0,1,1.5 etc.).
  { id: "pmtiles-hex-z0", sourceLayer: "hex_z0", minzoom: 0, maxzoom: 2 },
  { id: "pmtiles-hex-z2", sourceLayer: "hex_z2", minzoom: 2, maxzoom: 4 },
  { id: "pmtiles-hex-z4", sourceLayer: "hex_z4", minzoom: 4, maxzoom: 6 },
  { id: "pmtiles-hex-z6", sourceLayer: "hex_z6", minzoom: 6, maxzoom: 8 },
  { id: "pmtiles-hex-z8", sourceLayer: "hex_z8", minzoom: 8, maxzoom: 10 },
  { id: "pmtiles-hex-z10", sourceLayer: "hex_z10", minzoom: 10, maxzoom: 13 },
];

// Dynamically detect month keys from feature properties. Month keys are
// expected to be like 'mYYYYMM' (e.g. m200807). We'll query source features
// and extract property names matching that pattern, then build an
// expression which sums their numeric values and interpolates to opacity.
const MONTH_KEY_RE = /^m\d{6}$/;

// Minimum fill opacity to apply (floor). Adjust this value as needed.
const MIN_FILL_OPACITY = 0.15;
// Maximum fill opacity cap.
const MAX_FILL_OPACITY = 0.9;
// Interpolation base for exponential interpolation. 1 = linear, >1 emphasizes
// higher ratios, <1 emphasizes lower ratios.
const OPACITY_SCALE_BASE = 1.5;

// Build a Mapbox expression that represents the summed feature count (b)
// divided by the global total (a): capacity = b / a. `total` must be a
// positive number. Returns a number expression usable as a paint property.
const buildCapacityExpressionFromKeys = (
  monthKeys: string[],
  total: number,
  minOpacity = MIN_FILL_OPACITY,
  maxOpacity = MAX_FILL_OPACITY,
  scaleBase = OPACITY_SCALE_BASE
) => {
  if (!monthKeys || monthKeys.length === 0 || !total || total <= 0)
    return minOpacity; // fallback

  // For each month key produce: ['coalesce', ['to-number', ['get', key]], 0]
  const coalesced = monthKeys.map((k) => [
    "coalesce",
    ["to-number", ["get", k]],
    0,
  ]);

  // Sum expression: ['+', expr1, expr2, ...]
  const sumExpr = ["+", ...coalesced];

  // Ratio expression: ['/', sumExpr, total]
  const ratioExpr = ["/", sumExpr, total];

  // Map ratio (0..1) to [minOpacity..maxOpacity] using interpolate. Use
  // exponential interpolation with provided base to adjust curve.
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

// Compute the maximum per-feature summed count (max b) across currently
// available features returned by querySourceFeatures. This will be used as
// the denominator so that the largest hexagon maps to the top opacity.
const computeMaxFeatureSum = (map: any, monthKeys: string[]) => {
  let max = 0;
  try {
    PMTILE_LAYERS.forEach((spec) => {
      // Use queryRenderedFeatures so we only sample features that are
      // currently rendered on the map (viewport + style visibility).
      const features =
        (map as any).queryRenderedFeatures({ layers: [spec.id] }) || [];
      features.forEach((f: any) => {
        const props = f.properties || f?.properties || {};
        let sum = 0;
        monthKeys.forEach((k) => {
          const v = props[k];
          const n = Number(v || 0);
          if (!Number.isNaN(n)) sum += n;
        });
        if (sum > max) max = sum;
      });
    });
  } catch (err) {
    // ignore
  }
  return max;
};

// Detect month keys by sampling features from the source layers. Returns a
// sorted array of unique month keys (e.g. ['m193901','m193902',...]).
const detectMonthKeys = (map: any) => {
  const set = new Set<string>();
  try {
    PMTILE_LAYERS.forEach((spec) => {
      // Use queryRenderedFeatures to inspect properties of features that
      // are actually rendered in the current viewport/style. This helps
      // ensure keys come from visible features.
      const features =
        (map as any).queryRenderedFeatures({ layers: [spec.id] }) || [];
      features.forEach((f: any) => {
        const props = f.properties || f?.properties || {};
        Object.keys(props).forEach((k) => {
          if (MONTH_KEY_RE.test(k)) set.add(k);
        });
      });
    });
  } catch (err) {
    // querySourceFeatures may throw if source/tiles not ready — caller can
    // retry on 'sourcedata'.
    // console.debug('detectMonthKeys error', err);
  }

  return Array.from(set).sort();
};

const PMTilesHexLayer = () => {
  const { map } = useContext(MapContext);

  useEffect(() => {
    if (!map) return;

    const addLayers = () => {
      // Add vector source once
      if (!map.getSource(SOURCE_ID)) {
        map.addSource(SOURCE_ID, {
          type: "vector",
          // Keep your PMTiles URL here. Mapbox may require a special loader
          // or worker depending on your setup; this mirrors your previous URL.
          url: "https://havier-example-bucket.s3.ap-southeast-2.amazonaws.com/aggregated_seabird_nonqc.pmtiles",
        });
      }

      // Add each layer if it's not already present. Use the per-layer min/max
      // zoom so only the appropriate resolution is shown at each zoom range.
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
              "fill-color": "red",
              // Compute opacity from the summed month counts
              // cast to any to satisfy mapbox-gl typings for expression
              // Use default opacity for now; we'll detect month keys and
              // update paint with an expression when source data becomes
              // available.
              "fill-opacity": 0.6,
              "fill-outline-color": "white",
            },
          });
        }
      });

      // Try to detect month keys and set expressions if possible. If the
      // source/tiles aren't ready yet, a 'sourcedata' event handler below
      // will re-run detection and apply the expression when available.
    };

    // Re-add layers when the style is ready. Use both 'load' for initial
    // mount and 'styledata' to handle style reloads during the component
    // lifetime. addLayers is idempotent because it checks getSource/getLayer.
    if (map.isStyleLoaded && map.isStyleLoaded()) {
      addLayers();
    } else {
      map.once("load", addLayers);
    }

    map.on("styledata", addLayers);

    // Attempt to detect month keys and apply an opacity expression. We try
    // immediately, and also listen for 'sourcedata' in case tiles aren't
    // available yet.
    const tryApplyMonthExpression = () => {
      const keys = detectMonthKeys(map);
      if (!keys || keys.length === 0) return false;

      // Compute max per-feature sum 'maxB' by scanning loaded features.
      // We use this as the denominator so the largest hexagon maps to the
      // highest opacity.
      const maxB = computeMaxFeatureSum(map, keys);
      if (!maxB || maxB <= 0) return false;

      const expr = buildCapacityExpressionFromKeys(keys, maxB) as any;
      PMTILE_LAYERS.forEach((spec) => {
        if (map.getLayer(spec.id)) {
          try {
            map.setPaintProperty(spec.id, "fill-opacity", expr);
          } catch (err) {
            // ignore setPaintProperty errors
          }
        }
      });
      console.log(
        "Applied month-based capacity expression with",
        keys.length,
        "month keys, maxB:",
        maxB
      );
      return true;
    };

    // If detection fails immediately, wait for the source to load tiles and
    // try again once. The handler removes itself after a successful run.
    const handleSourceData = (e: any) => {
      if (e && e.sourceId === SOURCE_ID && e.isSourceLoaded) {
        if (tryApplyMonthExpression()) {
          map.off("sourcedata", handleSourceData);
        }
      }
    };

    // Try once now; if it returns false we keep the sourcedata listener.
    if (!tryApplyMonthExpression()) {
      map.on("sourcedata", handleSourceData);
    }

    // We'll update the opacity expression on view changes. Use moveend/zoomend
    // (not continuous move/zoom) and debounce updates to avoid thrashing.
    const handleMoveEnd = () => {
      tryApplyMonthExpression();
    };

    const handleZoomEnd = () => {
      tryApplyMonthExpression();
    };

    map.on("moveend", handleMoveEnd);
    map.on("zoomend", handleZoomEnd);

    return () => {
      // Guard against map/style being destroyed. Remove layers and source
      // only when a style exists to avoid the 'getOwnLayer' runtime error.
      if (!map) return;
      if (map.isStyleLoaded && map.isStyleLoaded()) {
        PMTILE_LAYERS.forEach((spec) => {
          if (map.getLayer(spec.id)) map.removeLayer(spec.id);
        });
        if (map.getSource(SOURCE_ID)) map.removeSource(SOURCE_ID);
      }

      // Remove the moveend/zoomend listeners we added above
      map.off("moveend", handleMoveEnd);
      map.off("zoomend", handleZoomEnd);

      // Remove the sourcedata listener if still attached
      try {
        map.off("sourcedata", handleSourceData);
      } catch (e) {
        // ignore if handler not defined/attached
      }

      map.off("styledata", addLayers);
    };
  }, [map]);

  return null;
};

export default PMTilesHexLayer;
