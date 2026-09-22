import { SyntheticEvent, useCallback, useMemo, useState } from "react";
import { OGCCollection } from "@/app/store/OGCCollectionDefinitions";
import useGriddedRasterProducts from "./useGriddedRasterProducts";
import { buildTileDateMarks, GriddedRasterLayerControls } from "./Common";

export interface GriddedRasterDateSliderProps {
  valid_points: number[];
  value?: number;
  formatLabel: (value: number) => string;
  onDatePointChange: (
    event: Event | SyntheticEvent<Element, Event> | undefined,
    value: number | number[]
  ) => void;
}

export interface GriddedRasterLayerState {
  hasProducts: boolean;
  hasDates: boolean;
  layerProps: GriddedRasterLayerControls;
  dateSliderKey: string;
  dateSliderProps: GriddedRasterDateSliderProps;
}

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
    value: number;
  } | null>(null);

  // The mark (slider value) currently selected, kept as a plain number so it
  // can seed the slider's own state directly — the slider unmounts/remounts
  // whenever the user switches away from and back to this layer, and without
  // an explicit `value` to re-seed from it would forget the pick and fall
  // back to its own "latest mark" default.
  const selectedValue = useMemo(() => {
    const override =
      selectedProduct && dateOverride?.productId === selectedProduct.id
        ? dateOverride.value
        : undefined;
    return override !== undefined && marks.byValue.has(override)
      ? override
      : marks.values[marks.values.length - 1];
  }, [dateOverride, marks, selectedProduct]);

  const selectedDate = useMemo(
    () => marks.byValue.get(selectedValue) ?? marks.latest,
    [marks, selectedValue]
  );

  const onDatePointChange = useCallback(
    (
      _event: Event | SyntheticEvent<Element, Event> | undefined,
      value: number | number[]
    ) => {
      if (selectedProduct && marks.byValue.has(value as number)) {
        setDateOverride({
          productId: selectedProduct.id,
          value: value as number,
        });
      }
    },
    [marks, selectedProduct]
  );

  const formatLabel = useCallback(
    // The slider values are only ever keys. NEVER format the number back into a date
    (value: number) => marks.byValue.get(value) ?? "",
    [marks]
  );

  return useMemo(
    () => ({
      hasProducts: products.length > 0,
      hasDates: marks.values.length > 0,
      layerProps: {
        products,
        layerConfig: selectedProduct?.id ?? "",
        onLayerChange: setProductOverride,
        selectedDate,
        error,
        onRetry: retry,
      },
      dateSliderKey: `gridded-date-${selectedProduct?.id ?? ""}`,
      dateSliderProps: {
        valid_points: marks.values,
        value: selectedValue,
        formatLabel,
        onDatePointChange,
      },
    }),
    [
      products,
      marks,
      selectedProduct,
      selectedValue,
      selectedDate,
      error,
      retry,
      formatLabel,
      onDatePointChange,
    ]
  );
};

export default useGriddedRasterLayer;
