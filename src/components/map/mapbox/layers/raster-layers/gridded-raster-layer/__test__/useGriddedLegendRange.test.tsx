import { ReactNode } from "react";
import {
  afterAll,
  afterEach,
  beforeAll,
  beforeEach,
  describe,
  expect,
  it,
  vi,
} from "vitest";
import { renderHook, waitFor } from "@testing-library/react";
import { Provider } from "react-redux";
import { http, HttpResponse } from "msw";
import store from "@/app/store/store";
import { server } from "@/__mocks__/server";
import { GriddedRasterProduct } from "@/app/store/GriddedTileDefinitions";
import useGriddedLegendRange from "../useGriddedLegendRange";

const wrapper = ({ children }: { children: ReactNode }) => (
  <Provider store={store}>{children}</Provider>
);

const LEGEND_TEMPLATE =
  "/api/v1/ogc/ext/tiles/colormaps/legend?colormap={colormap}";

const MANIFEST_PATH =
  "/api/v1/ogc/ext/tiles/collections/uuid-1/visual_tiles/manifest";

const product = (
  overrides: Partial<GriddedRasterProduct> = {}
): GriddedRasterProduct => ({
  id: "d:v",
  label: "d — v",
  template: "/tiles/{z}/{tileRow}/{tileCol}?datetime={datetime}",
  dates: ["2026-06-15T00:00:00Z", "2026-06-16T00:00:00Z"],
  colormap: "viridis",
  categorical: false,
  legendTemplate: LEGEND_TEMPLATE,
  manifestTemplate: `${MANIFEST_PATH}?dataset=d&variable=v&datetime={datetime}`,
  ...overrides,
});

describe("useGriddedLegendRange", () => {
  const requested: string[] = [];
  const onRequest = ({ request }: { request: Request }) => {
    requested.push(request.url);
  };

  beforeAll(() => server.listen());
  beforeEach(() => {
    requested.length = 0;
    server.events.on("request:start", onRequest);
    vi.spyOn(console, "warn").mockImplementation(() => {});
  });
  afterEach(() => {
    server.events.removeAllListeners();
    server.resetHandlers();
    vi.restoreAllMocks();
  });
  afterAll(() => server.close());

  it("labels a fixed range with the manifest's unit, not its valueRange", async () => {
    const { result } = renderHook(
      () =>
        useGriddedLegendRange(
          product({ rescale: [-1, 1] }),
          "2026-06-16T00:00:00Z"
        ),
      { wrapper }
    );
    await waitFor(() => expect(result.current.ready).toBe(true));
    expect(result.current).toEqual({
      legendUrl: "/api/v1/ogc/ext/tiles/colormaps/legend?colormap=viridis",
      range: [-1, 1],
      labels: undefined,
      unit: "m",
      ready: true,
    });
    expect(requested).toHaveLength(1);
  });

  it("keeps a fixed range when the manifest request fails", async () => {
    server.use(
      http.get(MANIFEST_PATH, () =>
        HttpResponse.json({ message: "nope" }, { status: 404 })
      )
    );
    const { result } = renderHook(
      () =>
        useGriddedLegendRange(
          product({ rescale: [-1, 1] }),
          "2026-06-16T00:00:00Z"
        ),
      { wrapper }
    );
    await waitFor(() => expect(result.current.ready).toBe(true));
    expect(result.current.range).toEqual([-1, 1]);
    expect(result.current.unit).toBeUndefined();
  });

  it("reads the selected date's valueRange from the manifest", async () => {
    const { result } = renderHook(
      () => useGriddedLegendRange(product(), "2026-06-16T00:00:00Z"),
      { wrapper }
    );
    expect(result.current.ready).toBe(false);

    await waitFor(() => expect(result.current.ready).toBe(true));
    expect(result.current.range).toEqual([-0.5, 1.5]);
    expect(result.current.unit).toBe("m");
    expect(requested).toHaveLength(1);
    expect(requested[0]).toContain(
      `${MANIFEST_PATH}?dataset=d&variable=v&datetime=2026-06-16T00:00:00Z`
    );
  });

  it("gives no range for a categorical product", async () => {
    const { result } = renderHook(
      () =>
        useGriddedLegendRange(
          product({
            manifestTemplate: `${MANIFEST_PATH}?dataset=d&variable=flag&datetime={datetime}`,
          }),
          "2026-06-16T00:00:00Z"
        ),
      { wrapper }
    );
    await waitFor(() => expect(result.current.ready).toBe(true));
    expect(result.current.range).toBeUndefined();
  });

  it("falls back to no range when the manifest request fails", async () => {
    server.use(
      http.get(MANIFEST_PATH, () =>
        HttpResponse.json({ message: "nope" }, { status: 404 })
      )
    );
    const { result } = renderHook(
      () => useGriddedLegendRange(product(), "2026-06-16T00:00:00Z"),
      { wrapper }
    );
    await waitFor(() => expect(result.current.ready).toBe(true));
    expect(result.current.range).toBeUndefined();
  });

  it("labels a categorical product with its flag meanings", async () => {
    const { result } = renderHook(
      () =>
        useGriddedLegendRange(
          product({
            categorical: true,
            colormap: "default_categorical",
            manifestTemplate: `${MANIFEST_PATH}?dataset=d&variable=flag&datetime={datetime}`,
          }),
          "2026-06-16T00:00:00Z"
        ),
      { wrapper }
    );
    expect(result.current.ready).toBe(false);
    await waitFor(() => expect(result.current.ready).toBe(true));
    expect(result.current.labels).toEqual([
      "none",
      "moderate",
      "strong",
      "severe",
    ]);
    expect(result.current.range).toBeUndefined();
  });

  it("is ready with no range when the product has no manifest", () => {
    const { result } = renderHook(
      () =>
        useGriddedLegendRange(
          product({ manifestTemplate: undefined }),
          "2026-06-16T00:00:00Z"
        ),
      { wrapper }
    );
    expect(result.current).toEqual({
      legendUrl: "/api/v1/ogc/ext/tiles/colormaps/legend?colormap=viridis",
      range: undefined,
      ready: true,
    });
    expect(requested).toHaveLength(0);
  });

  it("keeps the previous range while the next date's manifest loads", async () => {
    const ranges: Record<string, [number, number]> = {
      "2026-06-15T00:00:00Z": [0, 1],
      "2026-06-16T00:00:00Z": [2, 3],
    };
    server.use(
      http.get(MANIFEST_PATH, ({ request }) => {
        const datetime = new URL(request.url).searchParams.get("datetime");
        return HttpResponse.json({ valueRange: ranges[datetime ?? ""] });
      })
    );

    const { result, rerender } = renderHook(
      ({ datetime }) => useGriddedLegendRange(product(), datetime),
      { wrapper, initialProps: { datetime: "2026-06-15T00:00:00Z" } }
    );
    await waitFor(() => expect(result.current.range).toEqual([0, 1]));

    rerender({ datetime: "2026-06-16T00:00:00Z" });
    expect(result.current.range).toEqual([0, 1]);
    expect(result.current.ready).toBe(true);

    await waitFor(() => expect(result.current.range).toEqual([2, 3]));
  });

  it("withholds the legend url until the manifest has answered", async () => {
    const { result } = renderHook(
      () => useGriddedLegendRange(product(), "2026-06-16T00:00:00Z"),
      { wrapper }
    );
    expect(result.current.legendUrl).toBeUndefined();

    await waitFor(() => expect(result.current.ready).toBe(true));
    expect(result.current.legendUrl).toBe(
      "/api/v1/ogc/ext/tiles/colormaps/legend?colormap=viridis"
    );
  });

  it("builds the legend url with the product's own colormap", () => {
    const { result } = renderHook(
      () =>
        useGriddedLegendRange(
          product({
            colormap: "plasma",
            rescale: [0, 1],
            manifestTemplate: undefined,
          }),
          "2026-06-16T00:00:00Z"
        ),
      { wrapper }
    );
    expect(result.current.range).toEqual([0, 1]);
    expect(result.current.legendUrl).toBe(
      "/api/v1/ogc/ext/tiles/colormaps/legend?colormap=plasma"
    );
  });

  it("gives no legend url for a product without a legend template", () => {
    const { result } = renderHook(
      () =>
        useGriddedLegendRange(
          product({ legendTemplate: undefined, manifestTemplate: undefined }),
          "2026-06-16T00:00:00Z"
        ),
      { wrapper }
    );
    expect(result.current.legendUrl).toBeUndefined();
  });

  it("gives nothing without a product", () => {
    const { result } = renderHook(() => useGriddedLegendRange(undefined), {
      wrapper,
    });
    expect(result.current).toEqual({ range: undefined, ready: false });
  });
});
