import { ReactNode } from "react";
import { act, renderHook, waitFor } from "@testing-library/react";
import { Provider } from "react-redux";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import store from "@/app/store/store";
import { ogcAxiosWithRetry } from "@/app/store/searchReducer";
import {
  DatasetType,
  OGCCollection,
} from "@/app/store/OGCCollectionDefinitions";
import { TileProduct } from "@/app/store/GriddedTileDefinitions";
import { utcDayKeyToUnixMs } from "@/utils/DateUtils";
import useGriddedRasterLayer from "../useGriddedRasterLayer";

const wrapper = ({ children }: { children: ReactNode }) => (
  <Provider store={store}>{children}</Provider>
);

const TEMPLATE =
  "/api/v1/ogc/collections/uuid-1/map/tiles/WebMercatorQuad/{z}/{tileRow}/{tileCol}" +
  "?dataset=d&variable=v&datetime={datetime}&f=png";

const productPayload = (id: string, dates: string[]): TileProduct => ({
  id,
  variable: "GSLA",
  tile_types: ["visual"],
  // The listing sends full UTC datetimes, not bare day keys.
  available_dates: dates.map((date) => `${date}T00:00:00Z`),
  visual_tile_url_template: TEMPLATE,
});

const zarrCollection = (uuid: string): OGCCollection =>
  ({
    id: uuid,
    getDatasetType: () => [DatasetType.ZARR],
  }) as unknown as OGCCollection;

describe("useGriddedRasterLayer", () => {
  beforeEach(() => {
    vi.spyOn(console, "warn").mockImplementation(() => {});
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("defaults to the first product and its latest day", async () => {
    vi.spyOn(ogcAxiosWithRetry, "get").mockResolvedValue({
      data: {
        products: [
          productPayload("a:one", ["2024-01-01", "2024-01-05"]),
          productPayload("b:two", ["2024-02-01", "2024-02-10"]),
        ],
      },
    } as any);

    const { result } = renderHook(
      () => useGriddedRasterLayer(zarrCollection("uuid-1")),
      { wrapper }
    );

    await waitFor(() => expect(result.current.hasProducts).toBe(true));
    expect(result.current.layerProps.layerConfig).toBe("a:one");
    expect(result.current.layerProps.selectedDate).toBe("2024-01-05T00:00:00Z");
    expect(result.current.hasDates).toBe(true);
    expect(result.current.dateSliderKey).toBe("gridded-date-a:one");
    expect(
      result.current.dateSliderProps.formatLabel(
        utcDayKeyToUnixMs("2024-01-05")!
      )
    ).toBe("2024-01-05T00:00:00Z");
  });

  it("is false for hasProducts/hasDates before the fetch resolves and for a non-zarr collection", async () => {
    const nonZarr = {
      id: "uuid-parquet",
      getDatasetType: () => [DatasetType.PARQUET],
    } as unknown as OGCCollection;

    const { result } = renderHook(() => useGriddedRasterLayer(nonZarr), {
      wrapper,
    });

    expect(result.current.hasProducts).toBe(false);
    expect(result.current.hasDates).toBe(false);
  });

  it("switching product resets the day to the new product's latest, even when the old day is also valid for it", async () => {
    // The regression this guards against: MapPanel used to keep a date
    // override across a product switch whenever the retained date string was
    // still valid for the *new* product too.
    vi.spyOn(ogcAxiosWithRetry, "get").mockResolvedValue({
      data: {
        products: [
          productPayload("a:one", ["2024-01-01", "2024-01-05", "2024-01-09"]),
          productPayload("b:two", ["2024-01-05", "2024-01-20"]),
        ],
      },
    } as any);

    const { result } = renderHook(
      () => useGriddedRasterLayer(zarrCollection("uuid-1")),
      { wrapper }
    );

    await waitFor(() => expect(result.current.hasProducts).toBe(true));
    expect(result.current.layerProps.selectedDate).toBe("2024-01-09T00:00:00Z");
    expect(result.current.dateSliderKey).toBe("gridded-date-a:one");

    // Move product one's day to the one shared with product two.
    act(() => {
      result.current.dateSliderProps.onDatePointChange(
        undefined,
        utcDayKeyToUnixMs("2024-01-05")!
      );
    });
    expect(result.current.layerProps.selectedDate).toBe("2024-01-05T00:00:00Z");

    // Switch to product two: its own latest day is different from the shared date.
    act(() => {
      result.current.layerProps.onLayerChange("b:two");
    });

    await waitFor(() =>
      expect(result.current.layerProps.layerConfig).toBe("b:two")
    );
    expect(result.current.layerProps.selectedDate).toBe("2024-01-20T00:00:00Z");
    // The remount key follows the product, forcing DateSliderPoint to reset.
    expect(result.current.dateSliderKey).toBe("gridded-date-b:two");
  });

  it("onDatePointChange is a no-op for a value with no matching day key", async () => {
    vi.spyOn(ogcAxiosWithRetry, "get").mockResolvedValue({
      data: { products: [productPayload("a:one", ["2024-01-01"])] },
    } as any);

    const { result } = renderHook(
      () => useGriddedRasterLayer(zarrCollection("uuid-1")),
      { wrapper }
    );

    await waitFor(() => expect(result.current.hasProducts).toBe(true));
    const before = result.current.layerProps.selectedDate;

    act(() => {
      result.current.dateSliderProps.onDatePointChange(undefined, 999999);
    });

    expect(result.current.layerProps.selectedDate).toBe(before);
  });

  it("falls back to products[0] and marks.latest after a retry drops the picked product/day", async () => {
    const spy = vi
      .spyOn(ogcAxiosWithRetry, "get")
      .mockResolvedValueOnce({
        data: {
          products: [
            productPayload("a:one", ["2024-01-01", "2024-01-05"]),
            productPayload("b:two", ["2024-02-01"]),
          ],
        },
      } as any)
      .mockResolvedValueOnce({
        data: { products: [productPayload("c:three", ["2024-03-01"])] },
      } as any);

    const { result } = renderHook(
      () => useGriddedRasterLayer(zarrCollection("uuid-1")),
      { wrapper }
    );

    await waitFor(() => expect(result.current.hasProducts).toBe(true));
    act(() => result.current.layerProps.onLayerChange("b:two"));
    await waitFor(() =>
      expect(result.current.layerProps.layerConfig).toBe("b:two")
    );

    act(() => result.current.layerProps.onRetry?.());

    await waitFor(() =>
      expect(result.current.layerProps.layerConfig).toBe("c:three")
    );
    expect(result.current.layerProps.selectedDate).toBe("2024-03-01T00:00:00Z");
    expect(spy).toHaveBeenCalledTimes(2);
  });
});
