import { act, render, waitFor } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import MapContext from "../../../MapContext";
import { MapEventEnum } from "../../../constants";
import { GriddedRasterProduct } from "@/app/store/GriddedTileDefinitions";
import GriddedRasterLayer, {
  GRIDDED_RASTER_MAX_ZOOM,
} from "../GriddedRasterLayer";
import * as layerOrder from "../../../layerOrder";

vi.mock("mapbox-gl", () => ({}));

const TEMPLATE =
  "/api/v1/ogc/collections/uuid-1/map/tiles/WebMercatorQuad/{z}/{x}/{y}" +
  "?dataset=d&variable=ucur%2Bvcur&datetime={datetime}&f=png";

const PRODUCTS: GriddedRasterProduct[] = [
  {
    id: "a:one",
    label: "a — one",
    template: TEMPLATE,
    dates: ["2024-01-01", "2024-01-02", "2024-01-03"],
  },
  {
    id: "b:two",
    label: "b — two",
    template: TEMPLATE.replace("uuid-1", "uuid-2"),
    dates: ["2024-02-01"],
  },
];

const urlFor = (date: string) => TEMPLATE.replace("{datetime}", date);

describe("GriddedRasterLayer", () => {
  let mockMap: any;
  // Captured so a test can fire the map's own STYLEDATA handler.
  let styleDataHandlers: Array<() => void>;

  const renderLayer = (props: Partial<Record<string, any>> = {}) =>
    render(
      <MapContext.Provider value={{ map: mockMap } as any}>
        <GriddedRasterLayer
          products={PRODUCTS}
          selectedProductId="a:one"
          onSelectProduct={vi.fn()}
          selectedDate="2024-01-03"
          visible
          {...props}
        />
      </MapContext.Provider>
    );

  beforeEach(() => {
    vi.clearAllMocks();
    vi.useFakeTimers({ shouldAdvanceTime: true });
    styleDataHandlers = [];

    const sources: Record<string, any> = {};
    const layers: Record<string, any> = {};

    mockMap = {
      getContainer: () => ({ id: "test-map" }),
      getSource: vi.fn((id: string) => sources[id]),
      addSource: vi.fn((id: string, spec: any) => {
        sources[id] = { ...spec, setTiles: vi.fn() };
      }),
      getLayer: vi.fn((id: string) => layers[id]),
      addLayer: vi.fn((spec: any) => {
        layers[spec.id] = spec;
      }),
      removeLayer: vi.fn((id: string) => {
        delete layers[id];
      }),
      removeSource: vi.fn((id: string) => {
        delete sources[id];
      }),
      on: vi.fn((event: string, cb: () => void) => {
        if (event === MapEventEnum.STYLEDATA) styleDataHandlers.push(cb);
      }),
      off: vi.fn(),
      // The layer is created on IDLE; fire it immediately.
      once: (event: string, cb: () => void) => {
        if (event === MapEventEnum.IDLE) cb();
      },
      isStyleLoaded: vi.fn().mockReturnValue(true),
      setLayoutProperty: vi.fn((id: string, prop: string, value: string) => {
        if (layers[id]) layers[id].layout = { [prop]: value };
      }),
      getLayoutProperty: vi.fn(
        (id: string, prop: string) => layers[id]?.layout?.[prop]
      ),
    };
  });

  it("adds a raster source and the layer through addDataLayer, not map.addLayer", () => {
    const spy = vi.spyOn(layerOrder, "addDataLayer");
    renderLayer();

    expect(mockMap.addSource).toHaveBeenCalledTimes(1);
    expect(mockMap.addSource).toHaveBeenCalledWith(
      "test-map-gridded-raster-source",
      expect.objectContaining({
        type: "raster",
        tiles: [urlFor("2024-01-03")],
        tileSize: 256,
        maxzoom: GRIDDED_RASTER_MAX_ZOOM,
      })
    );
    // addDataLayer keeps the raster below overlays and gl-draw; calling
    // map.addLayer directly would paint over them.
    expect(spy).toHaveBeenCalledTimes(1);
    expect(spy.mock.calls[0][1]).toEqual(
      expect.objectContaining({
        id: "test-map-gridded-raster-layer",
        type: "raster",
        source: "test-map-gridded-raster-source",
      })
    );
  });

  it("keeps %2B intact in the tile url", () => {
    renderLayer();
    const [, spec] = mockMap.addSource.mock.calls[0];
    expect(spec.tiles[0]).toContain("%2B");
    expect(spec.tiles[0]).not.toMatch(/variable=[^&]*\+/);
  });

  it("swaps tiles on a date change without rebuilding the source", async () => {
    const { rerender } = renderLayer();
    const source = mockMap.getSource("test-map-gridded-raster-source");

    rerender(
      <MapContext.Provider value={{ map: mockMap } as any}>
        <GriddedRasterLayer
          products={PRODUCTS}
          selectedProductId="a:one"
          onSelectProduct={vi.fn()}
          selectedDate="2024-01-01"
          visible
        />
      </MapContext.Provider>
    );

    await act(async () => {
      vi.advanceTimersByTime(300);
    });

    expect(source.setTiles).toHaveBeenCalledWith([urlFor("2024-01-01")]);
    expect(mockMap.addSource).toHaveBeenCalledTimes(1);
  });

  it("debounces three rapid date changes into one setTiles", async () => {
    const { rerender } = renderLayer();
    const source = mockMap.getSource("test-map-gridded-raster-source");

    ["2024-01-01", "2024-01-02", "2024-01-03"].forEach((date) => {
      rerender(
        <MapContext.Provider value={{ map: mockMap } as any}>
          <GriddedRasterLayer
            products={PRODUCTS}
            selectedProductId="a:one"
            onSelectProduct={vi.fn()}
            selectedDate={date}
            visible
          />
        </MapContext.Provider>
      );
    });

    await act(async () => {
      vi.advanceTimersByTime(300);
    });

    expect(source.setTiles).toHaveBeenCalledTimes(1);
    expect(source.setTiles).toHaveBeenCalledWith([urlFor("2024-01-03")]);
  });

  it("hides via setLayoutProperty, never by removing the layer", () => {
    const { rerender } = renderLayer();

    rerender(
      <MapContext.Provider value={{ map: mockMap } as any}>
        <GriddedRasterLayer
          products={PRODUCTS}
          selectedProductId="a:one"
          onSelectProduct={vi.fn()}
          selectedDate="2024-01-03"
          visible={false}
        />
      </MapContext.Provider>
    );

    expect(mockMap.setLayoutProperty).toHaveBeenCalledWith(
      "test-map-gridded-raster-layer",
      "visibility",
      "none"
    );
    expect(mockMap.removeLayer).not.toHaveBeenCalled();
    expect(mockMap.removeSource).not.toHaveBeenCalled();
  });

  it("re-creates source and layer on a style reload with the current visibility", () => {
    renderLayer({ visible: false });
    // A style reload drops everything the map held.
    mockMap.removeLayer("test-map-gridded-raster-layer");
    mockMap.removeSource("test-map-gridded-raster-source");
    mockMap.addSource.mockClear();

    act(() => styleDataHandlers.forEach((handler) => handler()));

    expect(mockMap.addSource).toHaveBeenCalledTimes(1);
    expect(
      mockMap.getLayoutProperty("test-map-gridded-raster-layer", "visibility")
    ).toBe("none");
  });

  it("removes both handlers, the layer and the source on unmount", () => {
    const { unmount } = renderLayer();
    unmount();

    const offEvents = mockMap.off.mock.calls.map((c: any[]) => c[0]);
    expect(offEvents).toContain(MapEventEnum.IDLE);
    expect(offEvents).toContain(MapEventEnum.STYLEDATA);
    expect(mockMap.removeLayer).toHaveBeenCalledWith(
      "test-map-gridded-raster-layer"
    );
    // GeoServerLayer leaks its source here; this one must not.
    expect(mockMap.removeSource).toHaveBeenCalledWith(
      "test-map-gridded-raster-source"
    );
  });

  it("does not touch the map on unmount while the style is unloading", () => {
    const { unmount } = renderLayer();
    mockMap.isStyleLoaded.mockReturnValue(false);

    expect(() => unmount()).not.toThrow();
    expect(mockMap.removeLayer).not.toHaveBeenCalled();
    expect(mockMap.removeSource).not.toHaveBeenCalled();
  });

  it("adds no source when there is no product or no date", () => {
    renderLayer({ selectedDate: undefined });
    expect(mockMap.addSource).not.toHaveBeenCalled();

    renderLayer({ selectedProductId: "does-not-exist" });
    expect(mockMap.addSource).not.toHaveBeenCalled();
  });

  it("renders the product dropdown only while visible", async () => {
    const { queryByTestId, rerender } = renderLayer();
    await waitFor(() =>
      expect(queryByTestId("layer-select-dropdown")).toBeInTheDocument()
    );

    rerender(
      <MapContext.Provider value={{ map: mockMap } as any}>
        <GriddedRasterLayer
          products={PRODUCTS}
          selectedProductId="a:one"
          onSelectProduct={vi.fn()}
          selectedDate="2024-01-03"
          visible={false}
        />
      </MapContext.Provider>
    );
    expect(queryByTestId("layer-select-dropdown")).not.toBeInTheDocument();
  });

  it("offers a retry when a refetch failed, without replacing the dropdown", async () => {
    const onRetry = vi.fn();
    const { getByTestId, getByRole } = renderLayer({ error: true, onRetry });

    expect(getByTestId("gridded-raster-error")).toBeInTheDocument();
    expect(getByTestId("layer-select-dropdown")).toBeInTheDocument();

    await act(async () => {
      getByRole("button", { name: /retry/i }).click();
    });
    expect(onRetry).toHaveBeenCalled();
  });
});
