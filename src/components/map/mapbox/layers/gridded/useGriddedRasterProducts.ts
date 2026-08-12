import { useCallback, useEffect, useMemo, useState } from "react";
import { useAppDispatch } from "@/app/store/hooks";
import { fetchGriddedTileProducts } from "@/app/store/searchReducer";
import { GriddedRasterProduct } from "@/app/store/GriddedTileDefinitions";
import { OGCCollection } from "@/app/store/OGCCollectionDefinitions";
import { shouldQueryGriddedTiles, toGriddedRasterProducts } from "./Common";

interface GriddedRasterProductsResult {
  products: GriddedRasterProduct[];
  loading: boolean;
  error: boolean;
  retry: () => void;
}

/** One settled discovery attempt, tagged with what it was an attempt at. */
interface SettledState {
  uuid: string;
  attempt: number;
  products: GriddedRasterProduct[];
  error: boolean;
}

const NO_PRODUCTS: GriddedRasterProduct[] = [];

/**
 * Discovers the gridded raster tile products for one collection.
 *
 * A first-load failure is deliberately silent: from the browser, discovery
 * failing and a collection genuinely having no products are indistinguishable,
 * so surfacing an error would put a banner on *every* detail page during a DAS
 * outage — including the large majority that have no gridded products at all.
 * The `error`/`retry` pair is for the case where we do know the layer was real,
 * i.e. a refetch failing while the layer is already selected.
 *
 * No polling: the endpoint is cached for 5 minutes and a new day appearing
 * mid-session is not worth a background timer. Discovery runs on mount, on UUID
 * change and on explicit retry.
 */
const useGriddedRasterProducts = (
  collection?: OGCCollection | null
): GriddedRasterProductsResult => {
  const dispatch = useAppDispatch();
  const uuid = collection?.id ?? "";
  const enabled = uuid !== "" && shouldQueryGriddedTiles(collection);

  // Everything is keyed by uuid + attempt, so a UUID change falls back to "no
  // products" on the *same* render — no stale-product flash, and nothing has to
  // be reset from inside an effect.
  const [settled, setSettled] = useState<SettledState | null>(null);
  const [attempt, setAttempt] = useState(0);

  useEffect(() => {
    if (!enabled) return;

    const request = dispatch(fetchGriddedTileProducts({ uuid }));

    request
      .unwrap()
      .then((response) =>
        setSettled({
          uuid,
          attempt,
          products: toGriddedRasterProducts(response),
          error: false,
        })
      )
      .catch((e) => {
        // A cancelled request is superseded, not failed — its newer sibling owns
        // the state now.
        if (e?.name === "AbortError") return;
        console.warn(
          `Gridded raster tile product discovery failed for ${uuid}`,
          e
        );
        setSettled({ uuid, attempt, products: NO_PRODUCTS, error: true });
      });

    return () => request.abort();
  }, [attempt, dispatch, enabled, uuid]);

  const retry = useCallback(() => setAttempt((n) => n + 1), []);

  return useMemo(() => {
    // A result belongs to the uuid it was fetched for. Anything else is stale,
    // so it degrades to "no products" rather than painting another collection's.
    const current = settled?.uuid === uuid ? settled : undefined;
    return {
      products: current?.products ?? NO_PRODUCTS,
      loading: enabled && current?.attempt !== attempt,
      error: current?.error ?? false,
      retry,
    };
  }, [attempt, enabled, retry, settled, uuid]);
};

export default useGriddedRasterProducts;
