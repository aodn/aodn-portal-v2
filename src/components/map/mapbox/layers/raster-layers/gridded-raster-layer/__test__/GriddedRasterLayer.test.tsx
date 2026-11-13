import { ReactNode } from "react";
import { act, render, waitFor } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { Provider } from "react-redux";
import store from "@/app/store/store";
import { ogcAxiosWithRetry } from "@/app/store/searchReducer";
import MapContext from "../../../../MapContext";
import { MapEventEnum } from "../../../../constants";
import { GriddedRasterProduct } from "@/app/store/GriddedTileDefinitions";
import GriddedRasterLayer, {
  GRIDDED_RASTER_MAX_ZOOM,
} from "../GriddedRasterLayer";
import { buildGriddedTileUrl } from "../Common";
import * as layerOrder from "../../../../layerOrder";

const popupMock = vi.hoisted(() => {
  const instances: any[] = [];
  class Popup {
    html = "";
    open = false;
    lngLat: any;
    element = { dataset: {} as Record<string, string> };
    constructor() {
      instances.push(this);
    }
    setLngLat(lngLat: any) {
      this.lngLat = lngLat;
      return this;
    }
    setHTML(html: string) {
      this.html = html;
      return this;
    }
    addTo() {
      this.open = true;
      return this;
    }
    isOpen() {
      return this.open;
    }
    remove() {
      this.open = false;
      return this;
    }
    getElement() {
      return this.element;
    }
  }
  return { Popup, instances };
});

vi.mock("mapbox-gl", () => ({ Popup: popupMock.Popup }));

const wrapper = ({ children }: { children: ReactNode }) => (
  <Provider store={store}>{children}</Provider>
);

// {tileRow}/{tileCol} (not {x}/{y}) is the backend's actual OGC-named shape;
// buildGriddedTileUrl translates it for Mapbox, which urlFor below relies on.
const TEMPLATE =
  "/api/v1/ogc/collections/uuid-1/map/tiles/WebMercatorQuad/{z}/{tileRow}/{tileCol}" +
  "?dataset=d&variable=ucur%2Bvcur&datetime={datetime}&f=png";

const PRODUCTS: GriddedRasterProduct[] = [
  {
    id: "a:one",
    label: "a — one",
    tileTemplate: TEMPLATE,
    dates: ["2024-01-01", "2024-01-02", "2024-01-03"],
    pointTemplate:
      "/api/v1/ogc/ext/tiles/collections/uuid-1/data_tiles/point" +
      "?dataset=d&variable=ucur%2Bvcur&datetime={datetime}&lat={lat}&lon={lon}",
    colormap: "viridis",
    categorical: false,
  },
  {
    id: "b:two",
    label: "b — two",
    tileTemplate: TEMPLATE.replace("uuid-1", "uuid-2"),
    dates: ["2024-02-01"],
    colormap: "viridis",
    categorical: false,
  },
];

const urlFor = (date: string) => buildGriddedTileUrl(TEMPLATE, date) as string;

describe("GriddedRasterLayer", () => {
  let mockMap: any;
  // Captured so a test can fire the map's own STYLEDATA handler.
  let styleDataHandlers: Array<() => void>;
  let clickHandlers: Array<(e: any) => void>;

  const renderLayer = (props: Partial<Record<string, any>> = {}) =>
    render(
      <MapContext.Provider value={{ map: mockMap } as any}>
        <GriddedRasterLayer
          products={PRODUCTS}
          layerConfig="a:one"
          onLayerChange={vi.fn()}
          selectedDate="2024-01-03"
          visible
          {...props}
        />
      </MapContext.Provider>,
      { wrapper }
    );

  beforeEach(() => {
    vi.clearAllMocks();
    vi.useFakeTimers({ shouldAdvanceTime: true });
    styleDataHandlers = [];
    clickHandlers = [];
    popupMock.instances.length = 0;

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
      on: vi.fn((event: string, cb: (e?: any) => void) => {
        if (event === MapEventEnum.STYLEDATA) styleDataHandlers.push(cb);
        if (event === "click") clickHandlers.push(cb);
      }),
      off: vi.fn((event: string, cb: (e?: any) => void) => {
        if (event === "click") {
          clickHandlers = clickHandlers.filter((h) => h !== cb);
        }
      }),
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

  it("creates the source immediately when the style is already loaded, without relying on a future idle event", () => {
    // This layer mounts only after async product discovery resolves, so the
    // map has very often already settled by then. `once('idle', cb)` alone
    // would then wait for an idle event that may never fire again. `once` is
    // deliberately a spy that never invokes its callback here, so this test
    // can only pass via the synchronous "already loaded" branch.
    mockMap.once = vi.fn();
    mockMap.isStyleLoaded.mockReturnValue(true);

    renderLayer();

    expect(mockMap.once).not.toHaveBeenCalled();
    expect(mockMap.addSource).toHaveBeenCalledTimes(1);
    expect(mockMap.addSource).toHaveBeenCalledWith(
      "test-map-gridded-raster-source",
      expect.objectContaining({ tiles: [urlFor("2024-01-03")] })
    );
  });

  it("falls back to waiting for idle when the style is not yet loaded", () => {
    let idleCallback: (() => void) | undefined;
    mockMap.once = vi.fn((event: string, cb: () => void) => {
      if (event === MapEventEnum.IDLE) idleCallback = cb;
    });
    mockMap.isStyleLoaded.mockReturnValue(false);

    renderLayer();

    expect(mockMap.addSource).not.toHaveBeenCalled();

    mockMap.isStyleLoaded.mockReturnValue(true);
    idleCallback?.();

    expect(mockMap.addSource).toHaveBeenCalledTimes(1);
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
          layerConfig="a:one"
          onLayerChange={vi.fn()}
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
            layerConfig="a:one"
            onLayerChange={vi.fn()}
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
          layerConfig="a:one"
          onLayerChange={vi.fn()}
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

    renderLayer({ layerConfig: "does-not-exist" });
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
          layerConfig="a:one"
          onLayerChange={vi.fn()}
          selectedDate="2024-01-03"
          visible={false}
        />
      </MapContext.Provider>
    );
    expect(queryByTestId("layer-select-dropdown")).not.toBeInTheDocument();
  });

  describe("point value popup", () => {
    const click = (lng: number, lat: number) =>
      act(() => {
        clickHandlers.forEach((h) => h({ lngLat: { lng, lat } }));
      });

    afterEach(() => {
      vi.restoreAllMocks();
    });

    it("fetches the clicked point with the raw %2B variable and shows lat, lon and value", async () => {
      const spy = vi.spyOn(ogcAxiosWithRetry, "get").mockResolvedValue({
        data: {
          lat: -44.20000076,
          lon: 132,
          variables: {
            UCUR: { value: 0.0631742775, units: "m/s" },
            VCUR: { value: null, units: "m/s" },
          },
        },
      } as any);
      renderLayer();

      click(132.01, -44.27);

      expect(spy).toHaveBeenCalledWith(
        "/api/v1/ogc/ext/tiles/collections/uuid-1/data_tiles/point?" +
          "dataset=d&variable=ucur%2Bvcur&datetime=2024-01-03" +
          "&lat=-44.27&lon=132.01",
        expect.anything()
      );
      const popup = popupMock.instances[0];
      expect(popup.isOpen()).toBe(true);
      expect(popup.element.dataset.testid).toBe("map-popup");
      await waitFor(() => expect(popup.html).toContain("UCUR: 0.06317 m/s"));
      expect(popup.html).toContain("Lat: -44.20<br>");
      expect(popup.html).toContain("Lon: 132.00<br>");
      expect(popup.html).toContain("VCUR: No data");
    });

    it("shows a categorical value's flag meaning, read when the lookup lands", async () => {
      let resolve: (value: unknown) => void = () => {};
      vi.spyOn(ogcAxiosWithRetry, "get").mockReturnValue(
        new Promise((r) => {
          resolve = r;
        }) as any
      );
      const { rerender } = renderLayer();
      click(132, -44);
      const popup = popupMock.instances[0];

      // The manifest's meanings arrive after the click: no re-subscribe.
      rerender(
        <MapContext.Provider value={{ map: mockMap } as any}>
          <GriddedRasterLayer
            products={PRODUCTS}
            layerConfig="a:one"
            onLayerChange={vi.fn()}
            selectedDate="2024-01-03"
            flagMeanings={new Map([[2, "strong"]])}
            visible
          />
        </MapContext.Provider>
      );
      expect(popup.isOpen()).toBe(true);

      resolve({ data: { variables: { MCS_category: { value: 2 } } } });
      await waitFor(() =>
        expect(popup.html).toContain("MCS_category: strong<br>")
      );
    });

    it("wraps world-copy longitudes into -180..180", () => {
      const spy = vi
        .spyOn(ogcAxiosWithRetry, "get")
        .mockResolvedValue({ data: {} } as any);
      renderLayer();

      click(190, -10);

      expect(spy.mock.calls[0][0]).toContain("&lon=-170");
    });

    it("shows a no-data message when the lookup fails", async () => {
      vi.spyOn(ogcAxiosWithRetry, "get").mockRejectedValue(
        Object.assign(new Error("404"), { response: { status: 404 } })
      );
      renderLayer();

      click(10, 10);

      await waitFor(() =>
        expect(popupMock.instances[0].html).toContain(
          "No data available at this location"
        )
      );
    });

    it("does not listen for clicks while hidden or without a point query", () => {
      renderLayer({ visible: false });
      expect(clickHandlers).toHaveLength(0);

      renderLayer({ layerConfig: "b:two" });
      expect(clickHandlers).toHaveLength(0);
    });

    it("closes the popup when the date changes", () => {
      vi.spyOn(ogcAxiosWithRetry, "get").mockResolvedValue({
        data: {},
      } as any);
      const { rerender } = renderLayer();
      click(132, -44);
      const popup = popupMock.instances[0];
      expect(popup.isOpen()).toBe(true);

      rerender(
        <MapContext.Provider value={{ map: mockMap } as any}>
          <GriddedRasterLayer
            products={PRODUCTS}
            layerConfig="a:one"
            onLayerChange={vi.fn()}
            selectedDate="2024-01-02"
            visible
          />
        </MapContext.Provider>
      );

      expect(popup.isOpen()).toBe(false);
    });
  });
});
