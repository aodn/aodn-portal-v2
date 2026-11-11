import { useEffect, useState } from "react";
import { useAppDispatch } from "@/app/store/hooks";
import { fetchGriddedTileManifest } from "@/app/store/searchReducer";
import {
  GriddedRasterProduct,
  GriddedValueRange,
} from "@/app/store/GriddedTileDefinitions";
import {
  buildGriddedManifestUrl,
  toCategoricalLabels,
  toLegendRange,
} from "./Common";

export interface GriddedLegendRange {
  /** Range to label the legend with; undefined draws a bare colour bar. */
  range?: GriddedValueRange;
  /** Categorical products: one label per colour block, in order. */
  labels?: string[];
  /**
   * False only while the first range for this product is still being fetched,
   * so the legend never shows a bar whose labels are about to change. On a
   * later date change the previous range is kept until the new one lands.
   */
  ready: boolean;
}

interface SettledRange {
  productId: string;
  url: string;
  range?: GriddedValueRange;
  labels?: string[];
}

/**
 * The labels the legend should carry. Continuous: the same range rule the
 * server uses for the tiles — the product's fixed `rescale` when it has one,
 * otherwise the selected date's `valueRange` from the data-tile manifest.
 * Categorical: the manifest's flag meanings (or values), one per block.
 */
const useGriddedLegendRange = (
  product?: GriddedRasterProduct,
  datetime?: string
): GriddedLegendRange => {
  const dispatch = useAppDispatch();
  const manifestUrl = product?.rescale
    ? undefined
    : buildGriddedManifestUrl(product?.manifestTemplate, datetime);
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
  if (product.rescale) return { range: product.rescale, ready: true };
  if (!manifestUrl) return { range: undefined, ready: true };

  const current = settled?.productId === product.id ? settled : undefined;
  return {
    range: current?.range,
    labels: current?.labels,
    ready: current !== undefined,
  };
};

export default useGriddedLegendRange;
