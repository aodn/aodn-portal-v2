import { SyntheticEvent, useCallback, useMemo, useState } from "react";
import { OGCCollection } from "@/app/store/OGCCollectionDefinitions";
import useGriddedRasterProducts from "./useGriddedRasterProducts";
import { buildTileDateMarks, GriddedRasterLayerControls } from "./Common";

/** Shaped to spread directly onto `<DateSliderPoint>` — see `DateSliderPointProps`. */
export interface GriddedRasterDateSliderProps {
  valid_points: number[];
  formatLabel: (value: number) => string;
  onDatePointChange: (
    event: Event | SyntheticEvent<Element, Event> | undefined,
    value: number | number[]
  ) => void;
}

export interface GriddedRasterLayerState {
  /** At least one renderable product for this collection. */
  hasProducts: boolean;
  /** The selected product advertises at least one day (drives `griddedRasterHasDates`). */
  hasDates: boolean;
  layerProps: GriddedRasterLayerControls;
  /**
   * `key` can't travel through a spread prop — React strips it before the
   * component ever sees it — so it's returned separately. Write it explicitly:
   * `<DateSliderPoint key={dateSliderKey} {...dateSliderProps} />`. Forces a
   * remount on product change, since that's the only way DateSliderPoint
   * resets its picked value to the new product's latest day.
   */
  dateSliderKey: string;
  dateSliderProps: GriddedRasterDateSliderProps;
}

/**
 * Owns all gridded-raster state (product listing, product/date overrides, and
 * their fallbacks) so `MapPanel` only wires the result to the layer switcher,
 * the subsetting capabilities, and the map layer/date slider.
 */
const useGriddedRasterLayer = (
  collection?: OGCCollection | null
): GriddedRasterLayerState => {
  const { products, error, retry } = useGriddedRasterProducts(collection);

  const [productOverride, setProductOverride] = useState<string>("");
  const selectedProduct = useMemo(
    () => products.find((p) => p.id === productOverride) ?? products[0],
    [products, productOverride]
  );

  const marks = useMemo(
    () => buildTileDateMarks(selectedProduct?.dates),
    [selectedProduct]
  );

  const [dateOverride, setDateOverride] = useState<{
    productId: string;
    date: string;
  } | null>(null);

  const selectedDate = useMemo(() => {
    const override =
      selectedProduct && dateOverride?.productId === selectedProduct.id
        ? dateOverride.date
        : undefined;
    return override && marks.dates.includes(override) ? override : marks.latest;
  }, [dateOverride, marks, selectedProduct]);

  const onDatePointChange = useCallback(
    (
      _event: Event | SyntheticEvent<Element, Event> | undefined,
      value: number | number[]
    ) => {
      // Always recovered from the map — never re-derived from the timestamp,
      // which would be off by a day in a browser west of UTC.
      const dayKey = marks.byValue.get(value as number);
      if (dayKey && selectedProduct) {
        setDateOverride({ productId: selectedProduct.id, date: dayKey });
      }
    },
    [marks, selectedProduct]
  );

  const formatLabel = useCallback(
    // The slider values are only ever keys. NEVER format the number back into a
    // date: available_dates are Australia/Sydney local days and UTC midnight
    // formatted in a UTC-08:00 browser renders the previous day.
    (value: number) => marks.byValue.get(value) ?? "",
    [marks]
  );

  return useMemo(
    () => ({
      hasProducts: products.length > 0,
      hasDates: marks.values.length > 0,
      layerProps: {
        products,
        selectedProductId: selectedProduct?.id ?? "",
        onSelectProduct: setProductOverride,
        selectedDate,
        error,
        onRetry: retry,
      },
      dateSliderKey: `gridded-date-${selectedProduct?.id ?? ""}`,
      dateSliderProps: {
        valid_points: marks.values,
        formatLabel,
        onDatePointChange,
      },
    }),
    [
      products,
      marks,
      selectedProduct,
      selectedDate,
      error,
      retry,
      formatLabel,
      onDatePointChange,
    ]
  );
};

export default useGriddedRasterLayer;
