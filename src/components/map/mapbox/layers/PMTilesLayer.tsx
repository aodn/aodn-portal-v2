import { FC, useCallback, useContext, useEffect, useMemo, useRef } from "react";
import MapContext from "../MapContext";
import dayjs, { Dayjs } from "dayjs";
import { ExpressionSpecification } from "mapbox-gl";
import { LayerBasicType } from "./Layers";
import MapLayerSelect from "../component/MapLayerSelect";
import { SelectItem } from "../../../common/dropdown/CommonSelect";

const SOURCE_ID = "pmtiles-source-id";
const bucket = import.meta.env.VITE_PMTILES_BUCKET;

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

const getMonthKeysInRange = (start?: Dayjs, end?: Dayjs): string[] => {
  const s = start || dayjs("2000-01-01");
  const e = end || dayjs();
  const keys: string[] = [];
  let current = s.startOf("month");
  const last = e.startOf("month");

  let limit = 0;
  while ((current.isBefore(last) || current.isSame(last)) && limit < 1200) {
    keys.push(`m${current.format("YYYYMM")}`);
    current = current.add(1, "month");
    limit++;
  }
  return keys;
};

const buildSumExpression = (keys: string[]) => {
  if (keys.length === 0) return 0;
  if (keys.length === 1) return ["coalesce", ["get", keys[0]], 0];
  return ["+", ...keys.map((k) => ["coalesce", ["get", k], 0])];
};

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

  const handleSelectDataset = useCallback(
    (key: string) => {
      onSelectCoKey?.(key);
    },
    [onSelectCoKey]
  );

  // Derive dataset options from the collection's summary links
  const datasetOptions = useMemo<SelectItem<string>[]>(() => {
    const summaryLinks = collection?.links?.filter(
      (link) => link.rel === "summary"
    );
    if (!summaryLinks || summaryLinks.length === 0) {
      return [];
    }
    return summaryLinks.map((link) => ({
      value: link.title,
      label: link.title.replace(/\.(zarr|parquet)$/i, ""),
    }));
  }, [collection]);

  useEffect(() => {
    filterStartDateRef.current = filterStartDate;
    filterEndDateRef.current = filterEndDate;
    visibleRef.current = visible;
  }, [filterStartDate, filterEndDate, visible]);

  useEffect(() => {
    if (!map) return;

    const sourceUrl = `https://${bucket}/portal/visualization/${collection?.id}/${selectedCoKey}.pmtiles`;

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

      const keys = getMonthKeysInRange(
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
        if (map.getSource(SOURCE_ID)) {
          map.removeSource(SOURCE_ID);
        }
      } catch (error) {
        // OK to ignore error here
      } finally {
        map.off("styledata", onStyleData);
        map.off("load", addSourceAndLayers);
      }
    };
  }, [map, collection?.id, selectedCoKey]);

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
    } catch (error) {
      // OK to ignore error here
    }
  }, [map, visible]);

  // Update paint properties on date filter changes
  useEffect(() => {
    if (!map) return;
    const keys = getMonthKeysInRange(filterStartDate, filterEndDate);
    const paintProps = getPaintProperties(keys);

    try {
      PMTILE_LAYERS.forEach((layer) => {
        if (map.getLayer(layer.id)) {
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
  }, [map, filterStartDate, filterEndDate]);

  return (
    <>
      {visible && (
        <MapLayerSelect
          mapLayersOptions={datasetOptions}
          selectedItem={selectedCoKey || ""}
          handleSelectItem={handleSelectDataset}
          isLoading={false}
          loadingText="Loading H3 Layers..."
        />
      )}
    </>
  );
};

export default PMTilesHexLayer;
