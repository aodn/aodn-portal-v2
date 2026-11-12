import { useEffect, useState } from "react";
import { useAppDispatch } from "@/app/store/hooks";
import { fetchGriddedTileManifest } from "@/app/store/searchReducer";
import {
  GriddedRasterProduct,
  GriddedValueRange,
} from "@/app/store/GriddedTileDefinitions";
import {
  buildGriddedLegendUrl,
  buildGriddedManifestUrl,
  toCategoricalLabels,
  toLegendRange,
  toLegendUnit,
} from "./Common";

export interface GriddedLegendRange {
  /**
   * Colour-bar image for the product, set straight away so it loads alongside
   * the manifest. Undefined when the product has no legend_url; the legend is
   * hidden then.
   */
  legendUrl?: string;
  /** Range to label the legend with; undefined draws a bare colour bar. */
  range?: GriddedValueRange;
  /** Categorical products: one label per colour block, in order. */
  labels?: string[];
  /** The variable's units from the manifest, e.g. "m". */
  unit?: string;
  /**
   * False only while the first range for this product is still being fetched;
   * the legend shows a skeleton until then. On a later date change the
   * previous range is kept until the new one lands.
   */
  ready: boolean;
}

interface SettledRange {
  productId: string;
  url: string;
  range?: GriddedValueRange;
  labels?: string[];
  unit?: string;
}

/**
 * The labels the legend should carry. Continuous: the same range rule the
 * server uses for the tiles — the product's fixed `rescale` when it has one,
 * otherwise the selected date's `valueRange` from the visual-tile manifest.
 * Categorical: the manifest's flag meanings (or values), one per block.
 * The manifest is fetched even with a fixed `rescale`, for its `valueUnit`.
 */
const useGriddedLegendRange = (
  product?: GriddedRasterProduct,
  datetime?: string
): GriddedLegendRange => {
  const dispatch = useAppDispatch();
  const manifestUrl = buildGriddedManifestUrl(
    product?.manifestTemplate,
    datetime
  );
  const productId = product?.id;
  const categorical = product?.categorical;
  const colormap = product?.colormap;

  const [settled, setSettled] = useState<SettledRange | null>(null);

  useEffect(() => {
    if (!manifestUrl || !productId) return;

    const request = dispatch(fetchGriddedTileManifest({ url: manifestUrl }));
    request
      .unwrap()
      .then((manifest) =>
        setSettled({
          productId,
          url: manifestUrl,
          unit: toLegendUnit(manifest),
          ...(categorical
            ? { labels: toCategoricalLabels(manifest, colormap) }
            : { range: toLegendRange(manifest) }),
        })
      )
      .catch((e) => {
        if (e?.name === "AbortError") return;
        console.warn(`Gridded legend range lookup failed for ${productId}`, e);
        // Fall back to a bare bar rather than labels from another date.
        setSettled({ productId, url: manifestUrl });
      });

    return () => request.abort();
  }, [dispatch, manifestUrl, productId, categorical, colormap]);

  if (!product) return { range: undefined, ready: false };
  // Same colormap as the tiles, so the bar matches them.
  const legendUrl = buildGriddedLegendUrl(
    product.legendTemplate,
    product.colormap
  );
  if (!manifestUrl) {
    return { legendUrl, range: product.rescale, ready: true };
  }

  const current = settled?.productId === product.id ? settled : undefined;
  // Labels withheld until they land; the legend shows a skeleton meanwhile.
  return current
    ? {
        legendUrl,
        range: product.rescale ?? current.range,
        labels: current.labels,
        unit: current.unit,
        ready: true,
      }
    : { legendUrl, range: undefined, ready: false };
};

export default useGriddedLegendRange;
