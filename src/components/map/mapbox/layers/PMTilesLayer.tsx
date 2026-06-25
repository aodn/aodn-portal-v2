import { FC, useContext, useEffect } from "react";
import MapContext from "../MapContext";
import dayjs, { Dayjs } from "dayjs";
import { ExpressionSpecification } from "mapbox-gl";

const SOURCE_ID = "pmtiles-source-id";

const PMTILE_LAYERS = [
  { id: "pmtiles-hex-z0", sourceLayer: "hex_z0", minzoom: 0, maxzoom: 2 },
  { id: "pmtiles-hex-z2", sourceLayer: "hex_z2", minzoom: 2, maxzoom: 4 },
  { id: "pmtiles-hex-z4", sourceLayer: "hex_z4", minzoom: 4, maxzoom: 6 },
  { id: "pmtiles-hex-z6", sourceLayer: "hex_z6", minzoom: 6, maxzoom: 8 },
  { id: "pmtiles-hex-z8", sourceLayer: "hex_z8", minzoom: 8, maxzoom: 10 },
  { id: "pmtiles-hex-z10", sourceLayer: "hex_z10", minzoom: 10, maxzoom: 13 },
];

interface PMTilesHexLayerProps {
  filterStartDate?: Dayjs;
  filterEndDate?: Dayjs;
  visible?: boolean;
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
      "#E2ECF3",
      10,
      "#C5D8E7",
      100,
      "#54BCEB",
      1000,
      "#3B6E8F",
      10000,
      "#182C3A",
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
  filterStartDate,
  filterEndDate,
  visible = false,
}) => {
  const { map } = useContext(MapContext);

  useEffect(() => {
    if (!map) return;

    const sourceUrl =
      "https://aodnportal-dev-data.s3.ap-southeast-2.amazonaws.com/portal/visualization/2a5739e7-0cb8-444a-b83b-b2bc841b0ce8/aggregated_amsa_nonqc.parquet.pmtiles";

    const addSourceAndLayers = () => {
      if (!map.getSource(SOURCE_ID)) {
        map.addSource(SOURCE_ID, {
          type: "vector",
          url: sourceUrl,
        });
      }

      const keys = getMonthKeysInRange(filterStartDate, filterEndDate);
      const paintProps = getPaintProperties(keys);

      PMTILE_LAYERS.forEach((layer) => {
        if (!map.getLayer(layer.id)) {
          map.addLayer({
            id: layer.id,
            type: "fill",
            source: SOURCE_ID,
            "source-layer": layer.sourceLayer,
            minzoom: layer.minzoom,
            maxzoom: layer.maxzoom,
            layout: {
              visibility: visible ? "visible" : "none",
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
      map.off("styledata", onStyleData);

      PMTILE_LAYERS.forEach((layer) => {
        if (map.getLayer(layer.id)) {
          map.removeLayer(layer.id);
        }
      });
      if (map.getSource(SOURCE_ID)) {
        map.removeSource(SOURCE_ID);
      }
    };
  }, [map, filterEndDate, filterStartDate, visible]);

  // Update visibility on changes
  useEffect(() => {
    if (!map) return;
    PMTILE_LAYERS.forEach((layer) => {
      if (map.getLayer(layer.id)) {
        map.setLayoutProperty(
          layer.id,
          "visibility",
          visible ? "visible" : "none"
        );
      }
    });
  }, [map, visible]);

  // Update paint properties on date filter changes
  useEffect(() => {
    if (!map) return;
    const keys = getMonthKeysInRange(filterStartDate, filterEndDate);
    const paintProps = getPaintProperties(keys);

    PMTILE_LAYERS.forEach((layer) => {
      if (map.getLayer(layer.id)) {
        map.setPaintProperty(layer.id, "fill-color", paintProps["fill-color"]);
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
  }, [map, filterStartDate, filterEndDate]);

  return null;
};

export default PMTilesHexLayer;
