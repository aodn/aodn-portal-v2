import { ReactNode } from "react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { act, renderHook, waitFor } from "@testing-library/react";
import { Provider } from "react-redux";
import store from "@/app/store/store";
import { ogcAxiosWithRetry } from "@/app/store/searchReducer";
import {
  DatasetType,
  OGCCollection,
} from "@/app/store/OGCCollectionDefinitions";
import { TileProductsResponse } from "@/app/store/GriddedTileDefinitions";
import useGriddedRasterProducts from "../useGriddedRasterProducts";

const wrapper = ({ children }: { children: ReactNode }) => (
  <Provider store={store}>{children}</Provider>
);

const TEMPLATE =
  "/api/v1/ogc/collections/uuid-1/map/tiles/WebMercatorQuad/{z}/{tileRow}/{tileCol}" +
  "?dataset=d&variable=v&datetime={datetime}&f=png";

const payload = (id: string): TileProductsResponse => ({
  products: [
    {
      id,
      variable: "GSLA",
      tile_types: ["visual"],
      available_dates: ["2024-01-01", "2024-01-02"],
      visual_tile_url_template: TEMPLATE,
    },
  ],
});

const zarrCollection = (uuid: string): OGCCollection =>
  ({
    id: uuid,
    getDatasetType: () => [DatasetType.ZARR],
  }) as unknown as OGCCollection;

const parquetCollection = (uuid: string): OGCCollection =>
  ({
    id: uuid,
    getDatasetType: () => [DatasetType.PARQUET],
  }) as unknown as OGCCollection;

describe("useGriddedRasterProducts", () => {
  beforeEach(() => {
    vi.spyOn(console, "warn").mockImplementation(() => {});
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("requests the uuid-scoped OGC products path", async () => {
    const spy = vi
      .spyOn(ogcAxiosWithRetry, "get")
      .mockResolvedValue({ data: payload("a:one") } as any);

    const { result } = renderHook(
      () => useGriddedRasterProducts(zarrCollection("uuid-1")),
      { wrapper }
    );

    await waitFor(() => expect(result.current.products).toHaveLength(1));
    expect(spy).toHaveBeenCalledWith(
      "/ogc/ext/tiles/collections/uuid-1/products",
      expect.anything()
    );
    expect(result.current.error).toBe(false);
  });

  it("treats an empty listing as success, not failure", async () => {
    vi.spyOn(ogcAxiosWithRetry, "get").mockResolvedValue({
      data: { products: [] },
    } as any);

    const { result } = renderHook(
      () => useGriddedRasterProducts(zarrCollection("uuid-empty")),
      { wrapper }
    );

    await waitFor(() => expect(result.current.loading).toBe(false));
    expect(result.current.products).toEqual([]);
    expect(result.current.error).toBe(false);
  });

  it("degrades to no products with error set when discovery fails", async () => {
    vi.spyOn(ogcAxiosWithRetry, "get").mockRejectedValue(
      new Error("DAS is warming up")
    );

    const { result } = renderHook(
      () => useGriddedRasterProducts(zarrCollection("uuid-broken")),
      { wrapper }
    );

    await waitFor(() => expect(result.current.error).toBe(true));
    expect(result.current.products).toEqual([]);
    // Silent to the user, but not to the console.
    expect(console.warn).toHaveBeenCalled();
  });

  it("never lets a stale response overwrite a newer uuid's result", async () => {
    let resolveFirst: (value: unknown) => void = () => {};
    const first = new Promise((resolve) => {
      resolveFirst = resolve;
    });

    vi.spyOn(ogcAxiosWithRetry, "get").mockImplementation((path: string) =>
      path.includes("uuid-old")
        ? (first as any)
        : (Promise.resolve({ data: payload("new:product") }) as any)
    );

    const { result, rerender } = renderHook(
      ({ uuid }: { uuid: string }) =>
        useGriddedRasterProducts(zarrCollection(uuid)),
      { wrapper, initialProps: { uuid: "uuid-old" } }
    );

    rerender({ uuid: "uuid-new" });
    await waitFor(() =>
      expect(result.current.products.map((p) => p.id)).toEqual(["new:product"])
    );

    // The superseded request answers late — it must not win.
    await act(async () => {
      resolveFirst({ data: payload("old:product") });
      await Promise.resolve();
    });
    expect(result.current.products.map((p) => p.id)).toEqual(["new:product"]);
  });

  it("retry() starts a fresh attempt", async () => {
    const spy = vi
      .spyOn(ogcAxiosWithRetry, "get")
      .mockRejectedValueOnce(new Error("transient"))
      .mockResolvedValue({ data: payload("a:one") } as any);

    const { result } = renderHook(
      () => useGriddedRasterProducts(zarrCollection("uuid-retry")),
      { wrapper }
    );

    await waitFor(() => expect(result.current.error).toBe(true));

    act(() => result.current.retry());

    await waitFor(() => expect(result.current.products).toHaveLength(1));
    expect(result.current.error).toBe(false);
    expect(spy).toHaveBeenCalledTimes(2);
  });

  it("makes no request at all for a non-zarr collection", async () => {
    const spy = vi.spyOn(ogcAxiosWithRetry, "get");

    const { result } = renderHook(
      () => useGriddedRasterProducts(parquetCollection("uuid-parquet")),
      { wrapper }
    );

    await waitFor(() => expect(result.current.loading).toBe(false));
    expect(spy).not.toHaveBeenCalled();
    expect(result.current.products).toEqual([]);
    expect(result.current.error).toBe(false);
  });

  it("makes no request when there is no collection", async () => {
    const spy = vi.spyOn(ogcAxiosWithRetry, "get");

    const { result } = renderHook(() => useGriddedRasterProducts(undefined), {
      wrapper,
    });

    await waitFor(() => expect(result.current.loading).toBe(false));
    expect(spy).not.toHaveBeenCalled();
  });
});
