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

interface SettledState {
  uuid: string;
  attempt: number;
  products: GriddedRasterProduct[];
  error: boolean;
}

const NO_PRODUCTS: GriddedRasterProduct[] = [];

const useGriddedRasterProducts = (
  collection?: OGCCollection | null
): GriddedRasterProductsResult => {
  const dispatch = useAppDispatch();
  const uuid = collection?.id ?? "";
  const enabled = uuid !== "" && shouldQueryGriddedTiles(collection);

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
